import { Lucia } from "lucia";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { db } from "./drizzleStorage";
import { session, users } from "../shared/schema";

const adapter = new DrizzlePostgreSQLAdapter(db, session, users);

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			// For Android WebView compatibility, use lax instead of none
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax", // Changed from "none" for Android WebView compatibility
			httpOnly: false // Allow JavaScript access for mobile debugging
			// Don't set domain - let it default to the current host
		}
	},
  getUserAttributes: (attributes) => {
		return {
			email: attributes.email,
			role: attributes.role,
			shippingName: attributes.shippingName,
			shippingPhone: attributes.shippingPhone,
			shippingAddress: attributes.shippingAddress,
			shippingFlatNumber: attributes.shippingFlatNumber,
		};
	}
});

declare module "lucia" {
	interface Register {
		Lucia: typeof lucia;
    DatabaseUserAttributes: {
      email: string;
      role: "user" | "admin";
      shippingName: string | null;
      shippingPhone: string | null;
      shippingAddress: string | null;
      shippingFlatNumber: string | null;
    }
	}
}
