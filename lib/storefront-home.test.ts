import { expect, test } from "bun:test";
import { getAdminSeed } from "./admin/seed";
import { storefrontHome } from "./storefront-home";

const { snapshot } = await getAdminSeed();

test("storefront and CMS use identical homepage order and category rails", () => {
	const items = storefrontHome(snapshot, snapshot.products);
	expect(items.slice(0, 7).map((item) => item.id)).toEqual([
		"hero",
		"bestsellers",
		"category-haute-abayas",
		"golden-hour",
		"pairings",
		"category-pakistani-couture",
		"category-fine-jewelry",
	]);
	const arrivals = items.find((item) => item.id === "bestsellers");
	expect(arrivals?.kind === "rail" && arrivals.productIds.length).toBe(4);
	expect(items.some((item) => ["about", "newsletter", "trust"].includes(item.section.type))).toBe(false);
});

test("draft enablement, category names and selected products drive shared preview plan", () => {
	const draft = structuredClone(snapshot);
	draft.content.sections = draft.content.sections.map((section) => ({
		...section,
		enabled: section.type !== "hero",
	}));
	const category = draft.categories.find((item) => item.slug === "haute-abayas");
	if (!category) throw new Error("Missing fixture category");
	category.name = "Draft Abayas";
	const items = storefrontHome(draft, draft.products);
	expect(items.some((item) => item.section.type === "hero")).toBe(false);
	const abayas = items.find((item) => item.id === "category-haute-abayas");
	expect(abayas?.kind === "rail" && abayas.title).toBe("Draft Abayas");
	expect(abayas?.kind === "rail" && abayas.productIds.length).toBeGreaterThan(0);
});
