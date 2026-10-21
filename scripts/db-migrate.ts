import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import pg from "pg";

if (process.env.NEON_BRANCH !== "production") {
	throw new Error("Migration refused: expected Neon production branch");
}

const url = process.env.DATABASE_URL_UNPOOLED;
if (!url || new URL(url).hostname.includes("-pooler")) {
	throw new Error("DATABASE_URL_UNPOOLED must be a direct Neon connection");
}

const client = new pg.Client({ connectionString: url });
try {
	await client.connect();
	await migrate(drizzle(client), { migrationsFolder: "./drizzle" });
	console.log("Database migrations applied");
} finally {
	await client.end().catch(() => undefined);
}
