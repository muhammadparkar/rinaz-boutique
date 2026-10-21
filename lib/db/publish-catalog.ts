import { and, eq, notInArray, sql } from "drizzle-orm";
import type { Snapshot } from "@/lib/admin/model";
import type { getWriteDb } from "@/lib/db";
import { prices, products, variants } from "@/lib/db/schema";

type Transaction = Parameters<Parameters<ReturnType<typeof getWriteDb>["transaction"]>[0]>[0];

export async function publishCatalog(tx: Transaction, snapshot: Snapshot) {
	await tx
		.update(products)
		.set({ status: "archived" })
		.where(
			snapshot.products.length
				? notInArray(
						products.sourceId,
						snapshot.products.map((item) => item.id),
					)
				: sql`true`,
		);
	await Promise.all(
		snapshot.products.map(async (product) => {
			const status = product.status === "published" ? "active" : product.status;
			const [stored] = await tx
				.insert(products)
				.values({
					sourceId: product.id,
					slug: product.slug,
					name: product.name,
					description: product.summary,
					status,
				})
				.onConflictDoUpdate({
					target: products.sourceId,
					set: {
						slug: product.slug,
						name: product.name,
						description: product.summary,
						status,
						updatedAt: new Date(),
					},
				})
				.returning({ id: products.id });
			if (!stored) throw new Error("Product publish failed");
			await tx
				.update(variants)
				.set({ active: false })
				.where(
					and(
						eq(variants.productId, stored.id),
						notInArray(
							variants.sourceId,
							product.variants.map((item) => item.id),
						),
					),
				);
			await Promise.all(
				product.variants.map(async (variant) => {
					const [existing] = await tx
						.select({ productId: variants.productId })
						.from(variants)
						.where(eq(variants.sourceId, variant.id));
					if (existing && existing.productId !== stored.id)
						throw new Error("Variant IDs cannot move between products");
					const [saved] = await tx
						.insert(variants)
						.values({
							sourceId: variant.id,
							productId: stored.id,
							sku: variant.sku,
							name: variant.label,
							stock: variant.stock,
							active: status === "active",
						})
						.onConflictDoUpdate({
							target: variants.sourceId,
							set: {
								sku: variant.sku,
								name: variant.label,
								stock: variant.stock,
								active: status === "active",
							},
						})
						.returning({ id: variants.id });
					if (!saved) throw new Error("Variant publish failed");
					const amount = Number(variant.price);
					if (amount > 2_147_483_647) throw new Error("Price exceeds supported range");
					await tx
						.insert(prices)
						.values({ variantId: saved.id, currency: "USD", amountMinor: amount, approved: false })
						.onConflictDoUpdate({
							target: [prices.variantId, prices.currency],
							set: {
								amountMinor: amount,
								approved: sql`case when ${prices.amountMinor} = ${amount} then ${prices.approved} else false end`,
							},
						});
				}),
			);
		}),
	);
}
