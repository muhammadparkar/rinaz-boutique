import { expect, test } from "bun:test";
import { getAdminSeed } from "./admin/seed";
import { mockCommerce } from "./mock-store";
import { storefrontNavigation } from "./storefront-navigation";

test("all five navigation links match CMS categories, with new categories empty", async () => {
	const { snapshot } = await getAdminSeed();
	expect(snapshot.content.navigation).toEqual(storefrontNavigation);
	expect(storefrontNavigation.map((link) => link.label)).toEqual([
		"Elegant Kurtis",
		"Abayas",
		"Jewelry",
		"Footwear",
		"Handbags",
	]);
	await Promise.all(
		storefrontNavigation.map(async (link) => {
			const slug = link.href.split("/").at(-1);
			expect(snapshot.categories.some((category) => category.slug === slug)).toBe(true);
			const category = await mockCommerce.categoryGet({ idOrSlug: slug ?? "" });
			expect(category).not.toBeNull();
			if (slug === "footwear" || slug === "handbags") {
				const result = await mockCommerce.productBrowse({ category: slug });
				expect(result.data).toHaveLength(0);
			}
		}),
	);
});
