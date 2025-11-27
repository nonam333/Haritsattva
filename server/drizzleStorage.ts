import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { and, eq } from "drizzle-orm";
import * as schema from "../shared/schema";
import {
  IStorage,
  User,
  UpsertUser,
  ContactSubmission,
  InsertContact,
  Product,
  InsertProduct,
  Category,
  InsertCategory,
  Order,
  InsertOrder,
  OrderItem,
  InsertOrderItem,
  ProductSuggestion,
  InsertProductSuggestion,
  SocietyRequest,
  InsertSocietyRequest,
  Payment,
  InsertPayment,
} from "./storage"; // Assuming IStorage and types are exported from storage.ts
import { randomUUID } from "crypto";

import { seedDefaultData } from "./seed";

export class DrizzleStorage implements IStorage {
  public db;
  public readonly db_for_seeding;

  constructor() {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error("DATABASE_URL is not set");
    }

    // Optimize connection for low memory environments (Render free tier)
    const sql = neon(databaseUrl, {
      fetchOptions: {
        cache: 'no-store' // Prevent memory buildup from caching
      }
    });

    this.db = drizzle(sql, { schema });
    this.db_for_seeding = this.db;

    // Only seed on first deployment or when explicitly needed
    // Check environment variable to control seeding
    if (process.env.RUN_SEED === 'true') {
      seedDefaultData(this.db_for_seeding).catch(err => {
        console.error('Seeding error:', err);
      });
    }
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const users = await this.db.select().from(schema.users).where(eq(schema.users.id, id)).limit(1);
    return users[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const users = await this.db.select().from(schema.users).where(eq(schema.users.email, email)).limit(1);
    return users[0];
  }

  async createUser(userData: schema.UpsertUser): Promise<User> {
    const [user] = await this.db
      .insert(schema.users)
      .values(userData)
      .returning();
    return user;
  }
  async getAllUsers(): Promise<User[]> {
    return this.db.select().from(schema.users);
  }

  async updateUser(id: string, updateData: Partial<UpsertUser>): Promise<User | undefined> {
    const [user] = await this.db
      .update(schema.users)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(schema.users.id, id))
      .returning();
    return user;
  }

  // Contact submissions
  async createContactSubmission(insertContact: InsertContact): Promise<ContactSubmission> {
    const [contact] = await this.db.insert(schema.contactSubmissions).values(insertContact).returning();
    return contact;
  }

  async getAllContactSubmissions(): Promise<ContactSubmission[]> {
    return this.db.select().from(schema.contactSubmissions);
  }

  // Products
  async getAllProducts(): Promise<Product[]> {
    return this.db.select().from(schema.products);
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const products = await this.db.select().from(schema.products).where(eq(schema.products.id, id)).limit(1);
    return products[0];
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await this.db.insert(schema.products).values(insertProduct).returning();
    return product;
  }

  async updateProduct(id: string, updateData: Partial<InsertProduct>): Promise<Product | undefined> {
    const [product] = await this.db
      .update(schema.products)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(schema.products.id, id))
      .returning();
    return product;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const result = await this.db.delete(schema.products).where(eq(schema.products.id, id)).returning({ id: schema.products.id });
    return result.length > 0;
  }

  // Categories
  async getAllCategories(): Promise<Category[]> {
    return this.db.select().from(schema.categories);
  }

  async getCategory(id: string): Promise<Category | undefined> {
    const categories = await this.db.select().from(schema.categories).where(eq(schema.categories.id, id)).limit(1);
    return categories[0];
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const [category] = await this.db.insert(schema.categories).values(insertCategory).returning();
    return category;
  }

  async updateCategory(id: string, updateData: Partial<InsertCategory>): Promise<Category | undefined> {
    const [category] = await this.db
      .update(schema.categories)
      .set(updateData)
      .where(eq(schema.categories.id, id))
      .returning();
    return category;
  }

  async deleteCategory(id: string): Promise<boolean> {
    const result = await this.db.delete(schema.categories).where(eq(schema.categories.id, id)).returning({ id: schema.categories.id });
    return result.length > 0;
  }

  // Orders
  async getAllOrders(): Promise<Order[]> {
    return this.db.select().from(schema.orders);
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const orders = await this.db.select().from(schema.orders).where(eq(schema.orders.id, id)).limit(1);
    return orders[0];
  }

  async getOrdersByUserId(userId: string): Promise<Order[]> {
    return this.db.select().from(schema.orders).where(eq(schema.orders.userId, userId));
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const [order] = await this.db.insert(schema.orders).values(insertOrder).returning();
    return order;
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    const [order] = await this.db
      .update(schema.orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(schema.orders.id, id))
      .returning();
    return order;
  }

  // Order Items
  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    return this.db.select().from(schema.orderItems).where(eq(schema.orderItems.orderId, orderId));
  }

  async createOrderItem(insertItem: InsertOrderItem): Promise<OrderItem> {
    const [orderItem] = await this.db.insert(schema.orderItems).values(insertItem).returning();
    return orderItem;
  }

  // Product Suggestions
  async getAllProductSuggestions(): Promise<ProductSuggestion[]> {
    return this.db.select().from(schema.productSuggestions);
  }

  async getProductSuggestion(id: string): Promise<ProductSuggestion | undefined> {
    const suggestions = await this.db.select().from(schema.productSuggestions).where(eq(schema.productSuggestions.id, id)).limit(1);
    return suggestions[0];
  }

  async createProductSuggestion(insertSuggestion: InsertProductSuggestion): Promise<ProductSuggestion> {
    const [suggestion] = await this.db.insert(schema.productSuggestions).values(insertSuggestion).returning();
    return suggestion;
  }

  async updateProductSuggestion(id: string, updateData: Partial<InsertProductSuggestion>): Promise<ProductSuggestion | undefined> {
    const [suggestion] = await this.db
      .update(schema.productSuggestions)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(schema.productSuggestions.id, id))
      .returning();
    return suggestion;
  }

  async deleteProductSuggestion(id: string): Promise<boolean> {
    const result = await this.db.delete(schema.productSuggestions).where(eq(schema.productSuggestions.id, id)).returning({ id: schema.productSuggestions.id });
    return result.length > 0;
  }

  // Society Requests
  async getAllSocietyRequests(): Promise<SocietyRequest[]> {
    return this.db.select().from(schema.societyRequests);
  }

  async createSocietyRequest(insertRequest: InsertSocietyRequest): Promise<SocietyRequest> {
    const [request] = await this.db.insert(schema.societyRequests).values(insertRequest).returning();
    return request;
  }

  async deleteSocietyRequest(id: string): Promise<boolean> {
    const result = await this.db.delete(schema.societyRequests).where(eq(schema.societyRequests.id, id)).returning({ id: schema.societyRequests.id });
    return result.length > 0;
  }

  // Payments
  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const [payment] = await this.db.insert(schema.payments).values(insertPayment).returning();
    return payment;
  }

  async updatePayment(id: string, updates: Partial<InsertPayment>): Promise<Payment | undefined> {
    const [payment] = await this.db
      .update(schema.payments)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(schema.payments.id, id))
      .returning();
    return payment;
  }

  async getPaymentByOrderId(orderId: string): Promise<Payment | undefined> {
    const payments = await this.db.select().from(schema.payments).where(eq(schema.payments.orderId, orderId)).limit(1);
    return payments[0];
  }

  async getPaymentByRazorpayOrderId(razorpayOrderId: string): Promise<Payment | undefined> {
    const payments = await this.db.select().from(schema.payments).where(eq(schema.payments.razorpayOrderId, razorpayOrderId)).limit(1);
    return payments[0];
  }

  async updateOrderPaymentStatus(orderId: string, paymentStatus: string): Promise<Order | undefined> {
    const [order] = await this.db
      .update(schema.orders)
      .set({ paymentStatus, updatedAt: new Date() })
      .where(eq(schema.orders.id, orderId))
      .returning();
    return order;
  }
}

export const db = new DrizzleStorage().db;
