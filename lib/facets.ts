import { cacheLife } from "next/cache";
import { commerce } from "@/lib/commerce";

const EMPTY_FACETS = {
	priceBounds: { min: 0, max: 0 },
	variantTypes: [],
	categories: [],
	collections: [],
	brands: [],
} satisfies Awaited<ReturnType<typeof commerce.productFilters>>;

export async function getFilterFacets() {
	"use cache";
	cacheLife("minutes");
	// Filters are an enhancement — never let a facets failure take down the product list.
	try {
		return await commerce.productFilters();
	} catch {
		return EMPTY_FACETS;
	}
}

// Shared by every product listing (/products, /category, /collection) so sort behaves the same.
export const LISTING_SORT_OPTIONS = [
	{ value: "newest", label: "Newest", orderBy: "createdAt", orderDirection: "desc" },
	{ value: "price-asc", label: "Price: Low to High", orderBy: "price", orderDirection: "asc" },
	{ value: "price-desc", label: "Price: High to Low", orderBy: "price", orderDirection: "desc" },
	{ value: "name", label: "Name: A–Z", orderBy: "name", orderDirection: "asc" },
] as const;

export const getListingSort = (value: string | undefined) =>
	LISTING_SORT_OPTIONS.find((s) => s.value === value) ?? LISTING_SORT_OPTIONS[0];
