import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getDb } from "@/lib/db";
import * as schema from "@/lib/db/schema";

export function getAuth() {
	if (!process.env.BETTER_AUTH_SECRET || !process.env.DATABASE_URL) {
		throw new Error("Auth backend is not configured");
	}
	if (process.env.BETTER_AUTH_SECRET.length < 32)
		throw new Error("BETTER_AUTH_SECRET must contain at least 32 characters");
	return betterAuth({
		secret: process.env.BETTER_AUTH_SECRET,
		baseURL: process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_URL ?? "http://localhost:3000",
		database: drizzleAdapter(getDb(), {
			provider: "pg",
			schema: {
				...schema,
				user: schema.users,
				session: schema.sessions,
				account: schema.accounts,
				verification: schema.verifications,
			},
		}),
		emailAndPassword: { enabled: true },
		rateLimit: { enabled: true, storage: "database", window: 60, max: 100 },
	});
}
