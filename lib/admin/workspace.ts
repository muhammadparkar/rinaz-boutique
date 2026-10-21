import { eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { getDb } from "@/lib/db";
import { adminWorkspace } from "@/lib/db/schema";
import { parseDemoState } from "./model";
import { newDemo } from "./repository";
import { getAdminSeed } from "./seed";

export async function getWorkspace() {
	const db = getDb();
	let [row] = await db.select().from(adminWorkspace).where(eq(adminWorkspace.id, "store"));
	if (!row) {
		const seed = await getAdminSeed();
		await db
			.insert(adminWorkspace)
			.values({ id: "store", state: newDemo(seed.snapshot, seed.media) })
			.onConflictDoNothing();
		[row] = await db.select().from(adminWorkspace).where(eq(adminWorkspace.id, "store"));
	}
	if (!row) throw new Error("Workspace unavailable");
	return { state: parseDemoState(row.state), revision: row.revision };
}

export async function getPublishedSnapshot() {
	"use cache";
	cacheLife("minutes");
	cacheTag("storefront-cms");
	if (!process.env.DATABASE_URL) return (await getAdminSeed()).snapshot;
	const [row] = await getDb()
		.select({ state: adminWorkspace.state })
		.from(adminWorkspace)
		.where(eq(adminWorkspace.id, "store"));
	return row ? parseDemoState(row.state).published : (await getAdminSeed()).snapshot;
}
