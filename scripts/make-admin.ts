// scripts/make-admin.ts
import "dotenv/config";
import { storage } from "../server/storage";
import { users } from "../shared/schema";
import { eq } from "drizzle-orm";

async function makeAdmin() {
  const email = process.argv[2];

  if (!email) {
    console.error("Please provide an email address.");
    console.log("Usage: tsx scripts/make-admin.ts <email>");
    process.exit(1);
  }

  console.log(`Attempting to make '${email}' an admin...`);

  try {
    const existingUser = await storage.getUserByEmail(email);

    if (!existingUser) {
      console.error(`Error: User with email '${email}' not found.`);
      process.exit(1);
    }

    if (existingUser.role === 'admin') {
      console.log(`User '${email}' is already an admin.`);
      process.exit(0);
    }

    await storage.db
      .update(users)
      .set({ role: "admin" })
      .where(eq(users.email, email));

    console.log(`✅ Successfully promoted '${email}' to admin.`);
  } catch (error) {
    console.error("An error occurred:", error);
    process.exit(1);
  }
}

makeAdmin();
