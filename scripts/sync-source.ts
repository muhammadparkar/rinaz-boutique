import { isDeepStrictEqual } from "node:util";
import { eq } from "drizzle-orm";
import { parseDemoState } from "@/lib/admin/model";
import { newDemo } from "@/lib/admin/repository";
import { getAdminSeed } from "@/lib/admin/seed";
import { syncSourceState } from "@/lib/admin/source-sync";
import { getWriteDb } from "@/lib/db";
import { publishCatalog } from "@/lib/db/publish-catalog";
import { adminWorkspace } from "@/lib/db/schema";

if (!process.env.DATABASE_URL) {
	console.log("CMS sync skipped: DATABASE_URL not configured (local demo catalog active)");
} else {
	const source = await getAdminSeed();
	const db = getWriteDb();
	try {
		const result = await db.transaction(async (tx) => {
			await tx
				.insert(adminWorkspace)
				.values({
					id: "store",
					state: newDemo(source.snapshot, source.media),
				})
				.onConflictDoNothing();
			const [row] = await tx
				.select()
				.from(adminWorkspace)
				.where(eq(adminWorkspace.id, "store"))
				.for("update");
			if (!row) throw new Error("CMS workspace unavailable");
			const current = parseDemoState(row.state);
			const next = syncSourceState(current, source.snapshot);
			if (isDeepStrictEqual(current, next))
				return { changed: false, products: next.published.products.length, revision: row.revision };
			if (!isDeepStrictEqual(current.published.products, next.published.products))
				await publishCatalog(tx, next.published, { preserveStock: true });
			await tx
				.update(adminWorkspace)
				.set({
					state: next,
					revision: row.revision + 1,
					updatedAt: new Date(),
				})
				.where(eq(adminWorkspace.id, "store"));
			return { changed: true, products: next.published.products.length, revision: row.revision + 1 };
		});
		console.log("CMS/database sync:", JSON.stringify(result));
	} finally {
		await db.$client.end();
	}
}
