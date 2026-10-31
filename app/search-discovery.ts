"use server";

import { cacheLife, cacheTag } from "next/cache";
import { commerce } from "@/lib/commerce";
import { priceRange } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";

export async function searchDiscovery() {
	"use cache";
	cacheLife("minutes");
	cacheTag("storefront-cms");
	const [result, config] = await Promise.all([
		commerce.productBrowse({ active: true, limit: 24 }),
		getStoreConfig(),
	]);
	return result.data.map((product) => ({
		id: product.id,
		name: product.name,
		slug: product.slug,
		image: product.images[0] ?? product.variants[0]?.images[0] ?? null,
		category: product.category?.name ?? null,
		price: priceRange(product.variants, config.taxBehavior).min?.toString() ?? null,
	}));
}
