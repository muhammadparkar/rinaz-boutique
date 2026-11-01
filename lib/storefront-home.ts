import type { Snapshot } from "./admin/model";

export function storefrontHome(
	{ content, categories }: Pick<Snapshot, "content" | "categories">,
	products: { id: string; categoryId: string | null }[],
) {
	const sections = content.sections.filter(
		(section) => section.enabled && !["about", "newsletter", "trust"].includes(section.type),
	);
	const categorySection = sections.find((section) => section.type === "categories");
	const arrivals = sections.find((section) => section.id === "bestsellers");
	const sectionItems = (items: typeof sections) =>
		items.map((section) => ({
			kind: "section" as const,
			id: section.id,
			section,
		}));
	const rail = (slug: string, fallback: string) => {
		const category = categories.find((item) => item.slug === slug);
		const ids = products.filter((item) => item.categoryId === category?.id).map((item) => item.id);
		return categorySection && category?.active && ids.length
			? [
					{
						kind: "rail" as const,
						id: `category-${slug}`,
						section: categorySection,
						title: category.name || fallback,
						href: `/category/${slug}`,
						productIds: ids,
						spaced: false,
					},
				]
			: [];
	};
	return [
		...sectionItems(sections.filter((section) => section.type === "hero")),
		...(arrivals
			? [
					{
						kind: "rail" as const,
						id: arrivals.id,
						section: arrivals,
						title: "New Arrivals",
						href: "/collection/new-in",
						spaced: true,
						productIds: products
							.filter((item) => arrivals.productIds.includes(item.id))
							.slice(0, 4)
							.map((item) => item.id),
					},
				]
			: []),
		...rail("haute-abayas", "Abayas"),
		...sectionItems(sections.filter((section) => section.type === "feature" || section.id === "pairings")),
		...rail("pakistani-couture", "Elegant Kurtis"),
		...rail("fine-jewelry", "Jewelry"),
		...sectionItems(
			sections.filter(
				(section) =>
					section.type !== "hero" &&
					section.type !== "categories" &&
					section.type !== "feature" &&
					section.id !== "pairings" &&
					section.id !== "bestsellers",
			),
		),
	];
}
