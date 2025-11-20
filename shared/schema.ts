import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, integer, jsonb, timestamp, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User table for Lucia Auth
export const users = pgTable("users", {
	id: text("id").primaryKey(),
  email: varchar("email").unique(),
  hashed_password: text("hashed_password").notNull(),
  role: varchar("role", { length: 20 }).notNull().default("user"), // 'user' | 'admin'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),

  // Shipping information
  shippingName: text("shipping_name"),
  shippingPhone: text("shipping_phone"),
  shippingAddress: text("shipping_address"), // Society name
  shippingFlatNumber: text("shipping_flat_number"),
});

export const session = pgTable("session", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => users.id),
	expiresAt: timestamp("expires_at", {
		withTimezone: true,
		mode: "date"
	}).notNull()
});

// Categories table
export const categories = pgTable("categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  categoryId: varchar("category_id").references(() => categories.id),
  category: text("category").notNull(), // Keep for backward compatibility
  imageUrl: text("image_url").notNull(),
  inStock: integer("in_stock").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const cartItems = pgTable("cart_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").notNull(),
  quantity: integer("quantity").notNull().default(1),
});

export const contactSubmissions = pgTable("contact_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  message: text("message").notNull(),
  createdAt: varchar("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Product Suggestions table
export const productSuggestions = pgTable("product_suggestions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  suggestedProductName: text("suggested_product_name").notNull(),
  productDescription: text("product_description"),
  suggestedCategory: text("suggested_category"),
  userEmail: text("user_email"),
  status: varchar("status", { length: 20 }).notNull().default("pending"), // pending, reviewed, implemented, rejected
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Orders table
export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 50 }).notNull().default("pending"), // pending, confirmed, shipped, delivered, cancelled
  shippingName: text("shipping_name").notNull(),
  shippingEmail: text("shipping_email").notNull(),
  shippingPhone: text("shipping_phone").notNull(),
  shippingAddress: text("shipping_address").notNull(), // Society name
  shippingFlatNumber: text("shipping_flat_number").notNull(),
  paymentMethod: varchar("payment_method", { length: 50 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Order items table
export const orderItems = pgTable("order_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").notNull().references(() => orders.id),
  productId: varchar("product_id").notNull().references(() => products.id),
  productName: text("product_name").notNull(), // Store name for historical record
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(), // Price at time of order
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCartItemSchema = createInsertSchema(cartItems).omit({
  id: true,
});

export const insertContactSchema = createInsertSchema(contactSubmissions).omit({
  id: true,
  createdAt: true,
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  createdAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true,
});

export const insertProductSuggestionSchema = createInsertSchema(productSuggestions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Society Requests table
export const societyRequests = pgTable("society_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  societyName: text("society_name").notNull(),
  phone: text("phone").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertSocietyRequestSchema = createInsertSchema(societyRequests).omit({
  id: true,
  createdAt: true,
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type ProductSuggestion = typeof productSuggestions.$inferSelect;
export type InsertProductSuggestion = z.infer<typeof insertProductSuggestionSchema>;
export type SocietyRequest = typeof societyRequests.$inferSelect;
export type InsertSocietyRequest = z.infer<typeof insertSocietyRequestSchema>;
