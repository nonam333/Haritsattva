import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "../shared/schema";
import { eq } from "drizzle-orm";
import * as dotenv from "dotenv";

dotenv.config();

/**
 * Migration script to:
 * 1. Delete all existing categories
 * 2. Create only 2 categories: Fruits and Vegetables
 * 3. Update all products to belong to one of these categories
 */

// Product categorization map - adjust based on your products
const FRUITS = [
  "apple", "banana", "mango", "orange", "grapes", "watermelon", "papaya",
  "pomegranate", "pineapple", "guava", "kiwi", "strawberry", "avocado",
  "peach", "plum", "cherry", "berry", "berries", "lemon", "lime", "melon"
];

const VEGETABLES = [
  "tomato", "potato", "onion", "carrot", "cabbage", "cauliflower", "broccoli",
  "spinach", "lettuce", "cucumber", "pepper", "bell pepper", "chili", "chilli",
  "eggplant", "brinjal", "pumpkin", "squash", "zucchini", "radish", "beetroot",
  "turnip", "ginger", "garlic", "beans", "peas", "corn", "okra", "lady finger",
  "mushroom", "capsicum", "green", "leafy", "salad"
];

function categorizeProduct(productName: string, productCategory: string): "Fruits" | "Vegetables" {
  const nameLower = productName.toLowerCase();
  const categoryLower = productCategory.toLowerCase();

  // Check if product name contains any fruit keywords
  for (const fruit of FRUITS) {
    if (nameLower.includes(fruit) || categoryLower.includes(fruit)) {
      return "Fruits";
    }
  }

  // Check if product name contains any vegetable keywords
  for (const veg of VEGETABLES) {
    if (nameLower.includes(veg) || categoryLower.includes(veg)) {
      return "Vegetables";
    }
  }

  // Default to Vegetables if uncertain
  return "Vegetables";
}

async function restructureCategories() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not defined in environment variables");
    process.exit(1);
  }

  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql, { schema });

  console.log("🚀 Starting category restructuring...\n");

  try {
    // Step 1: Get all existing products and categories
    console.log("📋 Fetching all existing products...");
    const existingProducts = await db.select().from(schema.products);
    console.log(`Found ${existingProducts.length} products\n`);

    console.log("📋 Fetching all existing categories...");
    const existingCategories = await db.select().from(schema.categories);
    console.log(`Found ${existingCategories.length} categories\n`);

    // Step 2: Get or create two new categories
    console.log("📁 Getting/Creating new categories...");

    let fruitsCategory = existingCategories.find(c => c.name === "Fruits");
    if (!fruitsCategory) {
      [fruitsCategory] = await db.insert(schema.categories).values({
        name: "Fruits",
        nameTranslations: { en: "Fruits", hi: "फल" },
        description: "Fresh organic fruits"
      }).returning();
      console.log(`✅ Created category: Fruits (ID: ${fruitsCategory.id})`);
    } else {
      console.log(`✅ Found existing category: Fruits (ID: ${fruitsCategory.id})`);
    }

    let vegetablesCategory = existingCategories.find(c => c.name === "Vegetables");
    if (!vegetablesCategory) {
      [vegetablesCategory] = await db.insert(schema.categories).values({
        name: "Vegetables",
        nameTranslations: { en: "Vegetables", hi: "सब्जियाँ" },
        description: "Fresh organic vegetables"
      }).returning();
      console.log(`✅ Created category: Vegetables (ID: ${vegetablesCategory.id})\n`);
    } else {
      console.log(`✅ Found existing category: Vegetables (ID: ${vegetablesCategory.id})\n`);
    }

    // Step 3: Update all products with new categories
    console.log("🔄 Updating products with new categories...\n");

    let fruitsCount = 0;
    let vegetablesCount = 0;

    for (const product of existingProducts) {
      const newCategory = categorizeProduct(product.name, product.category);
      const categoryId = newCategory === "Fruits" ? fruitsCategory.id : vegetablesCategory.id;

      await db.update(schema.products)
        .set({
          category: newCategory,
          categoryId: categoryId
        })
        .where(eq(schema.products.id, product.id));

      if (newCategory === "Fruits") {
        fruitsCount++;
        console.log(`  🍎 ${product.name} → Fruits`);
      } else {
        vegetablesCount++;
        console.log(`  🥕 ${product.name} → Vegetables`);
      }
    }

    console.log(`\n✅ Updated ${existingProducts.length} products`);
    console.log(`   - Fruits: ${fruitsCount}`);
    console.log(`   - Vegetables: ${vegetablesCount}\n`);

    // Step 4: Delete old categories (now safe since all products are reassigned)
    console.log("🗑️  Deleting old categories...");
    for (const category of existingCategories) {
      if (category.name !== "Fruits" && category.name !== "Vegetables") {
        await db.delete(schema.categories).where(eq(schema.categories.id, category.id));
        console.log(`  ✅ Deleted: ${category.name}`);
      }
    }
    console.log("✅ All old categories deleted\n");

    console.log("\n🎉 Category restructuring completed successfully!");

  } catch (error) {
    console.error("❌ Error during restructuring:", error);
    throw error;
  }
}

// Run the migration
restructureCategories()
  .then(() => {
    console.log("\n✅ Migration completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Migration failed:", error);
    process.exit(1);
  });
