import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertContactSchema,
  insertProductSchema,
  insertCategorySchema,
  insertOrderSchema,
  insertOrderItemSchema
} from "@shared/schema";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { isAdmin } from "./adminAuth";
import multer from "multer";
import path from "path";
import { promises as fs } from "fs";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const userEmail = req.user.claims.email;

      // In development mode, create/return mock user directly
      if (process.env.NODE_ENV === "development") {
        const mockUser = await storage.upsertUser({
          id: userId,
          email: userEmail,
          firstName: req.user.claims.first_name || "Test",
          lastName: req.user.claims.last_name || "User",
          profileImageUrl: req.user.claims.profile_image_url || null,
        });
        return res.json(mockUser);
      }

      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
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

  // Get all contact submissions (protected - for admin)
  app.get("/api/contact/submissions", isAuthenticated, async (req, res) => {
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
  app.post("/api/orders", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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

  app.get("/api/orders/my-orders", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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
  app.get("/api/admin/check", isAuthenticated, isAdmin, async (req, res) => {
    res.json({ isAdmin: true });
  });

  // Admin Products
  app.post("/api/admin/products", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const validatedProduct = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedProduct);
      res.json(product);
    } catch (error) {
      console.error("Create product error:", error);
      res.status(400).json({ error: "Invalid product data" });
    }
  });

  app.put("/api/admin/products/:id", isAuthenticated, isAdmin, async (req, res) => {
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

  app.delete("/api/admin/products/:id", isAuthenticated, isAdmin, async (req, res) => {
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

  app.post("/api/admin/products/upload", isAuthenticated, isAdmin, upload.single("image"), async (req, res) => {
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
  app.post("/api/admin/categories", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const validatedCategory = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(validatedCategory);
      res.json(category);
    } catch (error) {
      console.error("Create category error:", error);
      res.status(400).json({ error: "Invalid category data" });
    }
  });

  app.put("/api/admin/categories/:id", isAuthenticated, isAdmin, async (req, res) => {
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

  app.delete("/api/admin/categories/:id", isAuthenticated, isAdmin, async (req, res) => {
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
  app.get("/api/admin/orders", isAuthenticated, isAdmin, async (req, res) => {
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

  app.put("/api/admin/orders/:id/status", isAuthenticated, isAdmin, async (req, res) => {
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
  app.get("/api/admin/users", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  // Admin Analytics
  app.get("/api/admin/analytics", isAuthenticated, isAdmin, async (req, res) => {
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
