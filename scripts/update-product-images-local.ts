import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "../shared/schema";
import { eq } from "drizzle-orm";
import * as dotenv from "dotenv";

dotenv.config();

/**
 * Script to update product images to use local image files
 * Maps local image files to products based on Hindi/English names
 */

// Mapping of product names to local image files
const imageMapping: Record<string, string> = {
  // Vegetables
  "Bottle Gourd": "/images/loki.jpg",
  "Coriander": "/images/dhaniya.jpg",
  "Pumpkin": "/images/kaddu.jpg",
  "Eggplant (Round)": "/images/baigan gol.jpg",
  "Eggplant (Long)": "/images/baigan lamba.jpg",
  "Capsicum (Green)": "/images/shimla mirch hari.jpg",
  "Bell Pepper (Red/Yellow)": "/images/shimlamirch red and yellow.jpg",
  "Beetroot": "/images/chukandar.jpg",
  "Radish": "/images/muli.jpg",
  "Fenugreek": "/images/methi.jpg",
  "Mustard Greens": "/images/mustard greens.jpg",
  "Sweet Potato": "/images/shakarkand.jpg",
  "Green Chilli": "/images/mirch.jpg",
  "Green Peas": "/images/hari matar.jpg",
  "Okra": "/images/bhindi.jpg",
  "French Beans": "/images/french beans.jpg",
  "Garlic": "/images/lehsun.jpg",
  "Ginger": "/images/ginger.jpg",
  "Amla": "/images/amla.jpg",

  // Fruits
  "Lemon": "/images/nimbu.jpg",
  "Papaya": "/images/papaya.jpg",
};

async function updateProductImages() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not defined in environment variables");
    process.exit(1);
  }

  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql, { schema });

  console.log("🚀 Starting product image update...\n");

  try {
    // Get all products
    console.log("📋 Fetching all products...");
    const products = await db.select().from(schema.products);
    console.log(`Found ${products.length} products\n`);

    let updatedCount = 0;
    let notFoundCount = 0;

    console.log("🖼️  Updating product images...\n");

    for (const product of products) {
      const localImagePath = imageMapping[product.name];

      if (localImagePath) {
        await db.update(schema.products)
          .set({ imageUrl: localImagePath })
          .where(eq(schema.products.id, product.id));

        console.log(`  ✅ ${product.name} → ${localImagePath}`);
        updatedCount++;
      } else {
        console.log(`  ⚠️  ${product.name} → No local image found (keeping current)`);
        notFoundCount++;
      }
    }

    console.log(`\n✅ Image update completed!`);
    console.log(`   - Updated: ${updatedCount} products`);
    console.log(`   - No local image: ${notFoundCount} products`);

  } catch (error) {
    console.error("❌ Error during update:", error);
    throw error;
  }
}

// Run the script
updateProductImages()
  .then(() => {
    console.log("\n✅ Script completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Script failed:", error);
    process.exit(1);
  });
