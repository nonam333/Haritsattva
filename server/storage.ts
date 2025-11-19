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
  type InsertOrderItem
} from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;

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
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private contactSubmissions: Map<string, ContactSubmission>;
  private products: Map<string, Product>;
  private categories: Map<string, Category>;
  private orders: Map<string, Order>;
  private orderItems: Map<string, OrderItem>;

  constructor() {
    this.users = new Map();
    this.contactSubmissions = new Map();
    this.products = new Map();
    this.categories = new Map();
    this.orders = new Map();
    this.orderItems = new Map();

    // Seed default categories
    this.seedDefaultCategories();
    // Seed default products
    this.seedDefaultProducts();
  }

  private seedDefaultCategories() {
    const defaultCategories: Category[] = [
      { id: randomUUID(), name: "Fruits", description: "Fresh seasonal fruits", createdAt: new Date() },
      { id: randomUUID(), name: "Vegetables", description: "Organic vegetables", createdAt: new Date() },
      { id: randomUUID(), name: "Herbs", description: "Fresh herbs and greens", createdAt: new Date() },
    ];

    defaultCategories.forEach(cat => this.categories.set(cat.id, cat));
  }

  private seedDefaultProducts() {
    // Get category IDs
    const fruitsCategory = Array.from(this.categories.values()).find(c => c.name === "Fruits");
    const vegetablesCategory = Array.from(this.categories.values()).find(c => c.name === "Vegetables");
    const herbsCategory = Array.from(this.categories.values()).find(c => c.name === "Herbs");

    if (!fruitsCategory || !vegetablesCategory || !herbsCategory) return;

    const now = new Date();
    const defaultProducts: Product[] = [
      // Fruits (6 products)
      {
        id: randomUUID(),
        name: "Organic Apples",
        description: "Crisp and sweet organic apples, perfect for snacking or baking",
        price: "120",
        category: "Fruits",
        categoryId: fruitsCategory.id,
        imageUrl: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400",
        inStock: 50,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: randomUUID(),
        name: "Fresh Bananas",
        description: "Naturally ripened bananas, rich in potassium and energy",
        price: "50",
        category: "Fruits",
        categoryId: fruitsCategory.id,
        imageUrl: "https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=400",
        inStock: 100,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: randomUUID(),
        name: "Sweet Oranges",
        description: "Juicy and sweet oranges packed with Vitamin C",
        price: "80",
        category: "Fruits",
        categoryId: fruitsCategory.id,
        imageUrl: "https://images.unsplash.com/photo-1580052614034-c55d20bfee3b?w=400",
        inStock: 60,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: randomUUID(),
        name: "Alphonso Mangoes",
        description: "Premium Alphonso mangoes, the king of fruits",
        price: "200",
        category: "Fruits",
        categoryId: fruitsCategory.id,
        imageUrl: "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400",
        inStock: 30,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: randomUUID(),
        name: "Fresh Strawberries",
        description: "Sweet and tangy strawberries, freshly harvested",
        price: "180",
        category: "Fruits",
        categoryId: fruitsCategory.id,
        imageUrl: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400",
        inStock: 25,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: randomUUID(),
        name: "Green Grapes",
        description: "Seedless green grapes, perfect for the whole family",
        price: "100",
        category: "Fruits",
        categoryId: fruitsCategory.id,
        imageUrl: "https://images.unsplash.com/photo-1596363505729-4190a9506133?w=400",
        inStock: 40,
        createdAt: now,
        updatedAt: now,
      },
      // Vegetables (9 products)
      {
        id: randomUUID(),
        name: "Fresh Tomatoes",
        description: "Ripe and juicy tomatoes for salads and cooking",
        price: "40",
        category: "Vegetables",
        categoryId: vegetablesCategory.id,
        imageUrl: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400",
        inStock: 80,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: randomUUID(),
        name: "Organic Potatoes",
        description: "Farm-fresh organic potatoes, versatile and nutritious",
        price: "35",
        category: "Vegetables",
        categoryId: vegetablesCategory.id,
        imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400",
        inStock: 120,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: randomUUID(),
        name: "Fresh Carrots",
        description: "Crunchy orange carrots loaded with beta-carotene",
        price: "50",
        category: "Vegetables",
        categoryId: vegetablesCategory.id,
        imageUrl: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400",
        inStock: 70,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: randomUUID(),
        name: "Baby Spinach",
        description: "Tender baby spinach leaves, perfect for salads",
        price: "60",
        category: "Vegetables",
        categoryId: vegetablesCategory.id,
        imageUrl: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400",
        inStock: 45,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: randomUUID(),
        name: "Green Broccoli",
        description: "Fresh broccoli florets, rich in nutrients",
        price: "80",
        category: "Vegetables",
        categoryId: vegetablesCategory.id,
        imageUrl: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400",
        inStock: 35,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: randomUUID(),
        name: "Fresh Cucumber",
        description: "Crisp and refreshing cucumbers",
        price: "30",
        category: "Vegetables",
        categoryId: vegetablesCategory.id,
        imageUrl: "https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=400",
        inStock: 90,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: randomUUID(),
        name: "Red Bell Peppers",
        description: "Sweet and colorful red bell peppers",
        price: "90",
        category: "Vegetables",
        categoryId: vegetablesCategory.id,
        imageUrl: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400",
        inStock: 55,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: randomUUID(),
        name: "Fresh Cauliflower",
        description: "White and firm cauliflower heads",
        price: "45",
        category: "Vegetables",
        categoryId: vegetablesCategory.id,
        imageUrl: "https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=400",
        inStock: 40,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: randomUUID(),
        name: "Organic Onions",
        description: "Essential organic onions for everyday cooking",
        price: "40",
        category: "Vegetables",
        categoryId: vegetablesCategory.id,
        imageUrl: "https://images.unsplash.com/photo-1580201092675-a0a6a6cafbb1?w=400",
        inStock: 100,
        createdAt: now,
        updatedAt: now,
      },
      // Herbs (3 products)
      {
        id: randomUUID(),
        name: "Fresh Basil",
        description: "Aromatic basil leaves for Italian dishes",
        price: "30",
        category: "Herbs",
        categoryId: herbsCategory.id,
        imageUrl: "https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=400",
        inStock: 50,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: randomUUID(),
        name: "Mint Leaves",
        description: "Fresh mint leaves for beverages and garnishing",
        price: "25",
        category: "Herbs",
        categoryId: herbsCategory.id,
        imageUrl: "https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?w=400",
        inStock: 60,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: randomUUID(),
        name: "Fresh Coriander",
        description: "Fragrant coriander leaves for Indian cooking",
        price: "20",
        category: "Herbs",
        categoryId: herbsCategory.id,
        imageUrl: "https://images.unsplash.com/photo-1598030699713-59f5e18c9a67?w=400",
        inStock: 70,
        createdAt: now,
        updatedAt: now,
      },
    ];

    defaultProducts.forEach(product => this.products.set(product.id, product));
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.email === email);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const now = new Date();
    const existingUser = this.users.get(userData.id as string);

    const user: User = {
      id: userData.id as string,
      email: userData.email ?? null,
      firstName: userData.firstName ?? null,
      lastName: userData.lastName ?? null,
      profileImageUrl: userData.profileImageUrl ?? null,
      role: userData.role ?? "user",
      createdAt: existingUser?.createdAt ?? now,
      updatedAt: now,
    };

    this.users.set(user.id, user);
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Contact submissions
  async createContactSubmission(insertContact: InsertContact): Promise<ContactSubmission> {
    const id = randomUUID();
    const createdAt = new Date().toISOString();
    const contact: ContactSubmission = { ...insertContact, id, createdAt };
    this.contactSubmissions.set(id, contact);
    return contact;
  }

  async getAllContactSubmissions(): Promise<ContactSubmission[]> {
    return Array.from(this.contactSubmissions.values());
  }

  // Products
  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const now = new Date();
    const product: Product = {
      id: randomUUID(),
      ...insertProduct,
      createdAt: now,
      updatedAt: now,
    };
    this.products.set(product.id, product);
    return product;
  }

  async updateProduct(id: string, updateData: Partial<InsertProduct>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;

    const updated: Product = {
      ...product,
      ...updateData,
      updatedAt: new Date(),
    };
    this.products.set(id, updated);
    return updated;
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.products.delete(id);
  }

  // Categories
  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategory(id: string): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const category: Category = {
      id: randomUUID(),
      ...insertCategory,
      createdAt: new Date(),
    };
    this.categories.set(category.id, category);
    return category;
  }

  async updateCategory(id: string, updateData: Partial<InsertCategory>): Promise<Category | undefined> {
    const category = this.categories.get(id);
    if (!category) return undefined;

    const updated: Category = {
      ...category,
      ...updateData,
    };
    this.categories.set(id, updated);
    return updated;
  }

  async deleteCategory(id: string): Promise<boolean> {
    return this.categories.delete(id);
  }

  // Orders
  async getAllOrders(): Promise<Order[]> {
    return Array.from(this.orders.values()).sort((a, b) =>
      (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
    );
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrdersByUserId(userId: string): Promise<Order[]> {
    return Array.from(this.orders.values())
      .filter(order => order.userId === userId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const now = new Date();
    const order: Order = {
      id: randomUUID(),
      ...insertOrder,
      createdAt: now,
      updatedAt: now,
    };
    this.orders.set(order.id, order);
    return order;
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;

    const updated: Order = {
      ...order,
      status,
      updatedAt: new Date(),
    };
    this.orders.set(id, updated);
    return updated;
  }

  // Order Items
  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values()).filter(item => item.orderId === orderId);
  }

  async createOrderItem(insertItem: InsertOrderItem): Promise<OrderItem> {
    const item: OrderItem = {
      id: randomUUID(),
      ...insertItem,
    };
    this.orderItems.set(item.id, item);
    return item;
  }
}

export const storage = new MemStorage();
