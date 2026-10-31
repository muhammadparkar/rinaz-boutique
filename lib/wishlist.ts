export type SavedProduct = { id: string; slug: string; name: string; image: string | null };

export function readWishlist(raw: string | null): SavedProduct[] {
	try {
		const value: unknown = JSON.parse(raw ?? "[]");
		if (!Array.isArray(value)) return [];
		return value.filter(
			(item): item is SavedProduct =>
				item !== null &&
				typeof item === "object" &&
				typeof item.id === "string" &&
				typeof item.slug === "string" &&
				typeof item.name === "string" &&
				(item.image === null || typeof item.image === "string"),
		);
	} catch {
		return [];
	}
}

export function toggleSavedProduct(items: SavedProduct[], product: SavedProduct) {
	return items.some((item) => item.id === product.id)
		? items.filter((item) => item.id !== product.id)
		: [...items, product];
}
