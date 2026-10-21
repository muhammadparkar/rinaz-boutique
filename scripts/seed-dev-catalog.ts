import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { prices, products, variants } from "@/lib/db/schema";
import { mockCommerce } from "@/lib/mock-store";

if (process.env.NEON_BRANCH !== "production") {
	throw new Error("Demo catalog seed refused outside production branch");
}

const db = getDb();
const response = await mockCommerce.productBrowse({ active: true, limit: 100, offset: 0 });
await Promise.all(
	response.data.map(async (product) => {
		await db
			.insert(products)
			.values({
				sourceId: product.id,
				slug: product.slug,
				name: product.name,
				description: product.summary ?? "",
				status: "active",
			})
			.onConflictDoNothing({ target: products.sourceId });
		const [storedProduct] = await db
			.select({ id: products.id })
			.from(products)
			.where(eq(products.sourceId, product.id))
			.limit(1);
		if (!storedProduct) throw new Error(`Could not seed product ${product.id}`);
		await Promise.all(
			product.variants.map(async (variant, index) => {
				const amountMinor = Number(variant.price);
				if (!Number.isSafeInteger(amountMinor) || amountMinor < 0)
					throw new Error(`Invalid demo price for ${variant.id}`);
				await db
					.insert(variants)
					.values({
						sourceId: variant.id,
						productId: storedProduct.id,
						sku: `${variant.sku ?? product.id}-${index + 1}`,
						name: variant.combinations?.map((c) => c.variantValue.value).join(" / ") || product.name,
						stock: variant.stock ?? 0,
					})
					.onConflictDoNothing({ target: variants.sourceId });
				const [storedVariant] = await db
					.select({ id: variants.id })
					.from(variants)
					.where(eq(variants.sourceId, variant.id))
					.limit(1);
				if (!storedVariant) throw new Error(`Could not seed variant ${variant.id}`);
				await db
					.insert(prices)
					.values({
						variantId: storedVariant.id,
						currency: "USD",
						amountMinor,
						approved: false,
					})
					.onConflictDoNothing({ target: [prices.variantId, prices.currency] });
			}),
		);
	}),
);
console.log(
	`Seeded ${response.data.length} demo products on test production branch; prices remain unapproved`,
);
