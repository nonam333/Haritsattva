import { Lucia } from "lucia";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { db } from "./drizzleStorage";
import { session, users } from "../shared/schema";

const adapter = new DrizzlePostgreSQLAdapter(db, session, users);

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			secure: process.env.NODE_ENV === "production",
			sameSite: "none", // Required for cross-origin requests (Android app)
			httpOnly: true // Prevent JavaScript access to cookie
			// Don't set domain - let it default to the current host
		}
	},
  getUserAttributes: (attributes) => {
		return {
			email: attributes.email,
			role: attributes.role,
		};
	}
});

declare module "lucia" {
	interface Register {
		Lucia: typeof lucia;
    DatabaseUserAttributes: {
      email: string;
      role: "user" | "admin";
    }
	}
}
