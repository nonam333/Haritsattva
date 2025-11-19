import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "../shared/schema";
import { InsertCategory, InsertProduct } from "../shared/schema";

export async function seedDefaultData(db: any) {
  try {
    // Seed default categories if none exist
    const existingCategories = await db.select().from(schema.categories).limit(1);
    if (existingCategories.length === 0) {
      const defaultCategories: InsertCategory[] = [
        { name: "Fruits", description: "Fresh seasonal fruits" },
        { name: "Vegetables", description: "Organic vegetables" },
        { name: "Herbs", description: "Fresh herbs and greens" },
      ];
      await db.insert(schema.categories).values(defaultCategories);
      console.log("Default categories seeded.");
    }

    // Seed default products if none exist
    const existingProducts = await db.select().from(schema.products).limit(1);
    if (existingProducts.length === 0) {
      const categories = await db.select().from(schema.categories);
      const fruitsCategory = categories.find(c => c.name === "Fruits");
      const vegetablesCategory = categories.find(c => c.name === "Vegetables");
      const herbsCategory = categories.find(c => c.name === "Herbs");

      if (!fruitsCategory || !vegetablesCategory || !herbsCategory) {
        console.warn("Could not find default categories for product seeding.");
        return;
      }

      const defaultProducts: InsertProduct[] = [
        // Fruits (6 products)
        {
          name: "Organic Apples",
          description: "Crisp and sweet organic apples, perfect for snacking or baking",
          price: "120",
          category: "Fruits",
          categoryId: fruitsCategory.id,
          imageUrl: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400",
          inStock: 50,
        },
        {
          name: "Fresh Bananas",
          description: "Naturally ripened bananas, rich in potassium and energy",
          price: "50",
          category: "Fruits",
          categoryId: fruitsCategory.id,
          imageUrl: "https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=400",
          inStock: 100,
        },
        {
          name: "Sweet Oranges",
          description: "Juicy and sweet oranges packed with Vitamin C",
          price: "80",
          category: "Fruits",
          categoryId: fruitsCategory.id,
          imageUrl: "https://images.unsplash.com/photo-1580052614034-c55d20bfee3b?w=400",
          inStock: 60,
        },
        {
          name: "Alphonso Mangoes",
          description: "Premium Alphonso mangoes, the king of fruits",
          price: "200",
          category: "Fruits",
          categoryId: fruitsCategory.id,
          imageUrl: "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400",
          inStock: 30,
        },
        {
          name: "Fresh Strawberries",
          description: "Sweet and tangy strawberries, freshly harvested",
          price: "180",
          category: "Fruits",
          categoryId: fruitsCategory.id,
          imageUrl: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400",
          inStock: 25,
        },
        {
          name: "Green Grapes",
          description: "Seedless green grapes, perfect for the whole family",
          price: "100",
          category: "Fruits",
          categoryId: fruitsCategory.id,
          imageUrl: "https://images.unsplash.com/photo-1596363505729-4190a9506133?w=400",
          inStock: 40,
        },
        // Vegetables (9 products)
        {
          name: "Fresh Tomatoes",
          description: "Ripe and juicy tomatoes for salads and cooking",
          price: "40",
          category: "Vegetables",
          categoryId: vegetablesCategory.id,
          imageUrl: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400",
          inStock: 80,
        },
        {
          name: "Organic Potatoes",
          description: "Farm-fresh organic potatoes, versatile and nutritious",
          price: "35",
          category: "Vegetables",
          categoryId: vegetablesCategory.id,
          imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400",
          inStock: 120,
        },
        {
          name: "Fresh Carrots",
          description: "Crunchy orange carrots loaded with beta-carotene",
          price: "50",
          category: "Vegetables",
          categoryId: vegetablesCategory.id,
          imageUrl: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400",
          inStock: 70,
        },
        {
          name: "Baby Spinach",
          description: "Tender baby spinach leaves, perfect for salads",
          price: "60",
          category: "Vegetables",
          categoryId: vegetablesCategory.id,
          imageUrl: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400",
          inStock: 45,
        },
        {
          name: "Green Broccoli",
          description: "Fresh broccoli florets, rich in nutrients",
          price: "80",
          category: "Vegetables",
          categoryId: vegetablesCategory.id,
          imageUrl: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400",
          inStock: 35,
        },
        {
          name: "Fresh Cucumber",
          description: "Crisp and refreshing cucumbers",
          price: "30",
          category: "Vegetables",
          categoryId: vegetablesCategory.id,
          imageUrl: "https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=400",
          inStock: 90,
        },
        {
          name: "Red Bell Peppers",
          description: "Sweet and colorful red bell peppers",
          price: "90",
          category: "Vegetables",
          categoryId: vegetablesCategory.id,
          imageUrl: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400",
          inStock: 55,
        },
        {
          name: "Fresh Cauliflower",
          description: "White and firm cauliflower heads",
          price: "45",
          category: "Vegetables",
          categoryId: vegetablesCategory.id,
          imageUrl: "https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=400",
          inStock: 40,
        },
        {
          name: "Organic Onions",
          description: "Essential organic onions for everyday cooking",
          price: "40",
          category: "Vegetables",
          categoryId: vegetablesCategory.id,
          imageUrl: "https://images.unsplash.com/photo-1580201092675-a0a6a6cafbb1?w=400",
          inStock: 100,
        },
        // Herbs (3 products)
        {
          name: "Fresh Basil",
          description: "Aromatic basil leaves for Italian dishes",
          price: "30",
          category: "Herbs",
          categoryId: herbsCategory.id,
          imageUrl: "https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=400",
          inStock: 50,
        },
        {
          name: "Mint Leaves",
          description: "Fresh mint leaves for beverages and garnishing",
          price: "25",
          category: "Herbs",
          categoryId: herbsCategory.id,
          imageUrl: "https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?w=400",
          inStock: 60,
        },
        {
          name: "Fresh Coriander",
          description: "Fragrant coriander leaves for Indian cooking",
          price: "20",
          category: "Herbs",
          categoryId: herbsCategory.id,
          imageUrl: "https://images.unsplash.com/photo-1598030699713-59f5e18c9a67?w=400",
          inStock: 70,
        },
      ];
      await db.insert(schema.products).values(defaultProducts);
      console.log("Default products seeded.");
    }
  } catch (error) {
    console.error("Error seeding default data:", error);
  }
}
