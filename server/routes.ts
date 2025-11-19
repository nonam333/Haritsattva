import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertContactSchema,
  insertProductSchema,
  insertCategorySchema,
  insertOrderSchema,
  insertOrderItemSchema,
  users
} from "@shared/schema";
import { isAdmin } from "./adminAuth";
import multer from "multer";
import path from "path";
import { promises as fs } from "fs";
import { lucia } from "./auth";
import { generateId } from "lucia";
import { Argon2id } from "oslo/password";

import { eq } from "drizzle-orm";



export async function registerRoutes(app: Express): Promise<Server> {

  // ============== AUTH ROUTES ==============
  app.post("/api/auth/signup", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password || typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({ error: "Invalid input" });
    }
    const hashedPassword = await new Argon2id().hash(password);
    const userId = generateId(15);

    try {
      await storage.createUser({
        id: userId,
        email,
        hashed_password: hashedPassword,
        role: 'user'
      });

      const session = await lucia.createSession(userId, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      res.appendHeader("Set-Cookie", sessionCookie.serialize());
      return res.status(201).json({ success: true });
    } catch (e) {
      // db error, email taken
      return res.status(400).json({ error: "Email already in use" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
		const { email, password } = req.body;
		if (!email || !password || typeof email !== "string" || typeof password !== "string") {
			return res.status(400).json({ error: "Invalid input" });
		}

		const existingUser = await storage.getUserByEmail(email);
		if (!existingUser) {
			return res.status(400).json({
				error: "Incorrect email or password"
			});
		}

		const validPassword = await new Argon2id().verify(existingUser.hashed_password, password);
		if (!validPassword) {
			return res.status(400).json({
				error: "Incorrect email or password"
			});
		}

		const session = await lucia.createSession(existingUser.id, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		res.appendHeader("Set-Cookie", sessionCookie.serialize());
		return res.status(200).json({ success: true });
	});

  app.post("/api/auth/logout", async (req, res) => {
		const sessionCookie = lucia.createBlankSessionCookie();
		res.appendHeader("Set-Cookie", sessionCookie.serialize());
		return res.status(200).json({ success: true });
	});

  app.get("/api/auth/user", async (req, res) => {
    const sessionId = lucia.readSessionCookie(req.headers.cookie ?? "");
    if (!sessionId) {
      return res.status(401).json({ user: null });
    }
    const { session, user } = await lucia.validateSession(sessionId);
    if (session && session.fresh) {
      const sessionCookie = lucia.createSessionCookie(session.id);
      res.appendHeader("Set-Cookie", sessionCookie.serialize());
    }
    if (!session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      res.appendHeader("Set-Cookie", sessionCookie.serialize());
    }
    return res.status(200).json({ user });
  });


  // Contact form submission
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactSchema.parse(req.body);
      const contact = await storage.createContactSubmission(validatedData);
      res.json({ success: true, id: contact.id });
    } catch (error) {
      console.error("Contact form error:", error);
      res.status(400).json({ error: "Invalid contact form data" });
    }
  });

  app.use(async (req, res, next) => {
    const sessionId = lucia.readSessionCookie(req.headers.cookie ?? "");
    if (!sessionId) {
      res.locals.user = null;
      res.locals.session = null;
      return next();
    }

    const { session, user } = await lucia.validateSession(sessionId);
    if (session && session.fresh) {
      const sessionCookie = lucia.createSessionCookie(session.id);
      res.appendHeader("Set-Cookie", sessionCookie.serialize());
    }
    if (!session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      res.appendHeader("Set-Cookie", sessionCookie.serialize());
    }
    res.locals.session = session;
    res.locals.user = user;
    return next();
  });

  // Get all contact submissions (protected - for admin)
  app.get("/api/contact/submissions", isAdmin, async (req, res) => {
    try {
      const submissions = await storage.getAllContactSubmissions();
      res.json(submissions);
    } catch (error) {
      console.error("Get submissions error:", error);
      res.status(500).json({ error: "Failed to fetch submissions" });
    }
  });

  // ============== PUBLIC PRODUCT ROUTES ==============
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  // ============== PUBLIC CATEGORY ROUTES ==============
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  // ============== PUBLIC ORDER ROUTES (for checkout) ==============
  app.post("/api/orders", async (req: any, res) => {
    if (!res.locals.user) return res.status(401).json({ error: "Unauthorized" });
    try {
      const userId = res.locals.user.id;
      const validatedOrder = insertOrderSchema.parse({
        ...req.body,
        userId,
      });

      const order = await storage.createOrder(validatedOrder);

      // Create order items
      if (req.body.items && Array.isArray(req.body.items)) {
        for (const item of req.body.items) {
          await storage.createOrderItem({
            orderId: order.id,
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity,
            price: item.price,
          });
        }
      }

      res.json({ success: true, order });
    } catch (error) {
      console.error("Create order error:", error);
      res.status(400).json({ error: "Invalid order data" });
    }
  });

  app.get("/api/orders/my-orders", async (req: any, res) => {
    if (!res.locals.user) return res.status(401).json({ error: "Unauthorized" });
    try {
      const userId = res.locals.user.id;
      const orders = await storage.getOrdersByUserId(userId);

      // Fetch order items for each order
      const ordersWithItems = await Promise.all(
        orders.map(async (order) => {
          const items = await storage.getOrderItems(order.id);
          return { ...order, items };
        })
      );

      res.json(ordersWithItems);
    } catch (error) {
      console.error("Error fetching user orders:", error);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  // ============== ADMIN ROUTES ==============

  // Check if user is admin
  app.get("/api/admin/check", isAdmin, async (req, res) => {
    res.json({ isAdmin: true });
  });

  // Admin Products
  app.post("/api/admin/products", isAdmin, async (req, res) => {
    try {
      const validatedProduct = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedProduct);
      res.json(product);
    } catch (error) {
      console.error("Create product error:", error);
      res.status(400).json({ error: "Invalid product data" });
    }
  });

  app.put("/api/admin/products/:id", isAdmin, async (req, res) => {
    try {
      const product = await storage.updateProduct(req.params.id, req.body);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Update product error:", error);
      res.status(400).json({ error: "Failed to update product" });
    }
  });

  app.delete("/api/admin/products/:id", isAdmin, async (req, res) => {
    try {
      const success = await storage.deleteProduct(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Delete product error:", error);
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  // Image upload configuration
  const upload = multer({
    storage: multer.diskStorage({
      destination: async (req, file, cb) => {
        const uploadDir = path.join(process.cwd(), "attached_assets", "uploaded_images");
        await fs.mkdir(uploadDir, { recursive: true });
        cb(null, uploadDir);
      },
      filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}_${file.originalname}`;
        cb(null, uniqueName);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith("image/")) {
        cb(null, true);
      } else {
        cb(new Error("Only image files are allowed"));
      }
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  });

  app.post("/api/admin/products/upload", isAdmin, upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      const imageUrl = `/attached_assets/uploaded_images/${req.file.filename}`;
      res.json({ imageUrl });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: "Failed to upload image" });
    }
  });

  // Admin Categories
  app.post("/api/admin/categories", isAdmin, async (req, res) => {
    try {
      const validatedCategory = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(validatedCategory);
      res.json(category);
    } catch (error) {
      console.error("Create category error:", error);
      res.status(400).json({ error: "Invalid category data" });
    }
  });

  app.put("/api/admin/categories/:id", isAdmin, async (req, res) => {
    try {
      const category = await storage.updateCategory(req.params.id, req.body);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      console.error("Update category error:", error);
      res.status(400).json({ error: "Failed to update category" });
    }
  });

  app.delete("/api/admin/categories/:id", isAdmin, async (req, res) => {
    try {
      const success = await storage.deleteCategory(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Delete category error:", error);
      res.status(500).json({ error: "Failed to delete category" });
    }
  });

  // Admin Orders
  app.get("/api/admin/orders", isAdmin, async (req, res) => {
    try {
      const orders = await storage.getAllOrders();

      // Fetch order items and user info for each order
      const ordersWithDetails = await Promise.all(
        orders.map(async (order) => {
          const items = await storage.getOrderItems(order.id);
          const user = await storage.getUser(order.userId);
          return { ...order, items, user };
        })
      );

      res.json(ordersWithDetails);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  app.put("/api/admin/orders/:id/status", isAdmin, async (req, res) => {
    try {
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ error: "Status is required" });
      }
      const order = await storage.updateOrderStatus(req.params.id, status);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      console.error("Update order status error:", error);
      res.status(500).json({ error: "Failed to update order status" });
    }
  });

  // Admin Users
  app.get("/api/admin/users", isAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  // Admin Analytics
  app.get("/api/admin/analytics", isAdmin, async (req, res) => {
    try {
      const [orders, products, users, categories] = await Promise.all([
        storage.getAllOrders(),
        storage.getAllProducts(),
        storage.getAllUsers(),
        storage.getAllCategories(),
      ]);

      // Calculate revenue
      const totalRevenue = orders.reduce((sum, order) => {
        return sum + parseFloat(order.total.toString());
      }, 0);

      // Count orders by status
      const ordersByStatus = orders.reduce((acc: any, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {});

      // Get recent orders (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const recentOrders = orders.filter(order =>
        order.createdAt && order.createdAt >= sevenDaysAgo
      );

      // Get product sales data
      const allOrderItems = await Promise.all(
        orders.map(order => storage.getOrderItems(order.id))
      );
      const flatOrderItems = allOrderItems.flat();

      const productSales = flatOrderItems.reduce((acc: any, item) => {
        if (!acc[item.productId]) {
          acc[item.productId] = {
            productId: item.productId,
            productName: item.productName,
            totalQuantity: 0,
            totalRevenue: 0,
          };
        }
        acc[item.productId].totalQuantity += item.quantity;
        acc[item.productId].totalRevenue += parseFloat(item.price.toString()) * item.quantity;
        return acc;
      }, {});

      const topProducts = Object.values(productSales)
        .sort((a: any, b: any) => b.totalRevenue - a.totalRevenue)
        .slice(0, 5);

      // Calculate low stock products
      const lowStockProducts = products.filter(p => p.inStock < 10);

      res.json({
        summary: {
          totalRevenue,
          totalOrders: orders.length,
          totalProducts: products.length,
          totalUsers: users.length,
          totalCategories: categories.length,
        },
        ordersByStatus,
        recentOrders: recentOrders.length,
        topProducts,
        lowStockProducts: lowStockProducts.length,
        lowStockItems: lowStockProducts,
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
