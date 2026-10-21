import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { drizzle as postgresDrizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

export function getDb() {
	const url = process.env.DATABASE_URL;
	if (!url) throw new Error("DATABASE_URL is not configured");
	return drizzle(neon(url), { schema });
}

let writeDb: ReturnType<typeof postgresDrizzle<typeof schema>> | undefined;
export function getWriteDb() {
	if (!writeDb) {
		if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured");
		writeDb = postgresDrizzle(new pg.Pool({ connectionString: process.env.DATABASE_URL, max: 3 }), {
			schema,
		});
	}
	return writeDb;
}
