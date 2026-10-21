import { eq } from "drizzle-orm";
import { getAuth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { staffRoles, users } from "@/lib/db/schema";

if (process.env.NEON_BRANCH !== "production") {
	throw new Error("Owner assignment refused outside production branch");
}

const email = (process.env.ADMIN_BOOTSTRAP_EMAIL ?? process.argv[2])?.trim().toLowerCase();
if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
	throw new Error("Set ADMIN_BOOTSTRAP_EMAIL or run: bun run admin:bootstrap -- owner@example.com");
}

const db = getDb();
const existingOwners = await db
	.select({ userId: staffRoles.userId })
	.from(staffRoles)
	.where(eq(staffRoles.role, "owner"))
	.limit(1);
if (existingOwners.length) throw new Error("Owner already exists; bootstrap cannot run again");
const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
if (existing.length) throw new Error("Account already exists; refusing automatic promotion");
const password = process.env.ADMIN_BOOTSTRAP_PASSWORD;
if (!password || password.length < 16)
	throw new Error("Set ADMIN_BOOTSTRAP_PASSWORD (16+ characters) in .env.local");
await getAuth().api.signUpEmail({ body: { email, password, name: "Studio Owner" } });
const [user] = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
if (!user) throw new Error("Account creation failed");

await db.insert(staffRoles).values({ userId: user.id, role: "owner" }).onConflictDoNothing();
console.log("Owner account ready on test production branch");
