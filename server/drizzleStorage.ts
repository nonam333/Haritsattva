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
    const sql = neon(databaseUrl);
    this.db = drizzle(sql, { schema });
    this.db_for_seeding = this.db;

    seedDefaultData(this.db_for_seeding);
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
}

export const db = new DrizzleStorage().db;
