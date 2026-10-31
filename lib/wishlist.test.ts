import { expect, test } from "bun:test";
import { readWishlist, toggleSavedProduct } from "./wishlist";

const product = { id: "p1", slug: "silk-abaya", name: "Silk abaya", image: null };
test("wishlist saves, reloads and removes by id", () => {
	const saved = toggleSavedProduct([], product);
	expect(readWishlist(JSON.stringify(saved))).toEqual([product]);
	expect(toggleSavedProduct(saved, { ...product, name: "Updated" })).toEqual([]);
});
test("wishlist ignores malformed storage", () => {
	expect(readWishlist("invalid")).toEqual([]);
	expect(readWishlist("{}")).toEqual([]);
	expect(readWishlist('[null,1,{"id":"bad"}]')).toEqual([]);
});
