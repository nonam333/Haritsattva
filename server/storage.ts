import {
  type User,
  type UpsertUser,
  type ContactSubmission,
  type InsertContact,
  type Product,
  type InsertProduct,
  type Category,
  type InsertCategory,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
  type ProductSuggestion,
  type InsertProductSuggestion,
  type SocietyRequest,
  type InsertSocietyRequest
} from "@shared/schema";
import { DrizzleStorage } from "./drizzleStorage";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: UpsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  updateUser(id: string, user: Partial<UpsertUser>): Promise<User | undefined>; // Add this line

  // Contact submissions
  createContactSubmission(contact: InsertContact): Promise<ContactSubmission>;
  getAllContactSubmissions(): Promise<ContactSubmission[]>;

  // Products
  getAllProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;

  // Categories
  getAllCategories(): Promise<Category[]>;
  getCategory(id: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: string): Promise<boolean>;

  // Orders
  getAllOrders(): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  getOrdersByUserId(userId: string): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: string, status: string): Promise<Order | undefined>;

  // Order Items
  getOrderItems(orderId: string): Promise<OrderItem[]>;
  createOrderItem(item: InsertOrderItem): Promise<OrderItem>;

  // Product Suggestions
  getAllProductSuggestions(): Promise<ProductSuggestion[]>;
  getProductSuggestion(id: string): Promise<ProductSuggestion | undefined>;
  createProductSuggestion(suggestion: InsertProductSuggestion): Promise<ProductSuggestion>;
  updateProductSuggestion(id: string, suggestion: Partial<InsertProductSuggestion>): Promise<ProductSuggestion | undefined>;
  deleteProductSuggestion(id: string): Promise<boolean>;

  // Society Requests
  getAllSocietyRequests(): Promise<SocietyRequest[]>;
  createSocietyRequest(request: InsertSocietyRequest): Promise<SocietyRequest>;
  deleteSocietyRequest(id: string): Promise<boolean>;
}

export const storage = new DrizzleStorage();

export {
  type User,
  type UpsertUser,
  type ContactSubmission,
  type InsertContact,
  type Product,
  type InsertProduct,
  type Category,
  type InsertCategory,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
  type ProductSuggestion,
  type InsertProductSuggestion,
  type SocietyRequest,
  type InsertSocietyRequest
};