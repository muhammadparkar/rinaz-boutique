import { and, eq } from "drizzle-orm";
import { getPublishedSnapshot } from "@/lib/admin/workspace";
import type { CommerceAdapter } from "@/lib/commerce-types";
import { getDb } from "@/lib/db";
import { prices, products, variants } from "@/lib/db/schema";
import { mockCommerce } from "@/lib/mock-store";

async function catalog() {
	const [base, snapshot, rows] = await Promise.all([
		mockCommerce.productBrowse({ active: true, limit: 1000, offset: 0 }),
		getPublishedSnapshot(),
		getDb()
			.select({
				productSourceId: products.sourceId,
				slug: products.slug,
				name: products.name,
				description: products.description,
				status: products.status,
				variantSourceId: variants.sourceId,
				stock: variants.stock,
				active: variants.active,
				amountMinor: prices.amountMinor,
			})
			.from(products)
			.innerJoin(variants, eq(variants.productId, products.id))
			.innerJoin(prices, and(eq(prices.variantId, variants.id), eq(prices.currency, "USD"))),
	]);
	const displayProducts = await Promise.all(
		base.data.map((product) => mockCommerce.productGet({ idOrSlug: product.id })),
	);
	return snapshot.products.flatMap((published) => {
		const original = displayProducts.find((item) => item?.id === published.id);
		const product = original ?? displayProducts[0];
		if (!product || published.status !== "published") return [];
		const matches = rows.filter((row) => row.productSourceId === published.id);
		if (matches[0]?.status !== "active") return [];
		const attributes = Array.from(
			new Set(published.variants.flatMap((variant) => Object.keys(variant.attributes))),
		);
		const variantTypes = attributes.map((label) => ({
			id: `${published.id}-${label}`,
			type: "string" as const,
			label,
			variantValues: Array.from(
				new Set(
					published.variants
						.map((variant) => variant.attributes[label])
						.filter((value): value is string => Boolean(value)),
				),
			).map((value, position) => ({
				id: `${published.id}-${label}-${value}`,
				value,
				position,
				colorValue: null,
			})),
		}));
		const storedVariants = published.variants.flatMap((variant) => {
			const row = matches.find((item) => item.variantSourceId === variant.id && item.active);
			if (!row) return [];
			const source = original?.variants.find((item) => item.id === variant.id) ?? product.variants[0];
			if (!source) return [];
			const price = String(row.amountMinor);
			return [
				{
					...source,
					id: variant.id,
					productId: published.id,
					sku: variant.sku,
					images: variant.images,
					attributes: variant.attributes,
					combinations: variantTypes.flatMap((type) => {
						const value = type.variantValues.find((item) => item.value === variant.attributes[type.label]);
						return value
							? [
									{
										createdAt: source.createdAt,
										updatedAt: source.updatedAt,
										productVariantId: variant.id,
										variantValueId: value.id,
										variantValue: {
											...value,
											variantType: { id: type.id, type: type.type, label: type.label },
										},
									},
								]
							: [];
					}),
					stock: row.stock,
					price,
					priceGross: price,
					originalPrice: variant.originalPrice,
					originalPriceGross: variant.originalPrice,
				},
			];
		});
		if (storedVariants.length === 0) return [];
		const category = snapshot.categories.find((item) => item.id === published.categoryId);
		return [
			{
				...product,
				id: published.id,
				images: published.images,
				content: original?.content ?? null,
				categoryId: published.categoryId,
				category: category
					? {
							...product.category,
							...category,
							position: String(category.position),
							longDescription: null,
							description: null,
							parent: null,
							seo: null,
							createdAt: product.createdAt,
							updatedAt: product.updatedAt,
							storeId: "local",
						}
					: null,
				variantsTypes: variantTypes,
				productCollections: original?.productCollections ?? [],
				slug: matches[0].slug,
				name: matches[0].name,
				summary: matches[0].description,
				variants: storedVariants,
			},
		];
	});
}

const priceOf = (product: Awaited<ReturnType<typeof catalog>>[number]) =>
	Number(product.variants[0]?.price ?? 0);

export const databaseCatalog = {
	async productBrowse(params: Parameters<CommerceAdapter["productBrowse"]>[0]) {
		const [all, allowed] = await Promise.all([
			catalog(),
			mockCommerce.productBrowse({
				category: params.category,
				collection: params.collection,
				limit: 1000,
				offset: 0,
			}),
		]);
		const allowedIds = new Set(allowed.data.map((product) => product.id));
		const words = params.query?.toLowerCase().split(/\s+/).filter(Boolean) ?? [];
		const filtered = all
			.filter((product) => !params.collection || allowedIds.has(product.id))
			.filter(
				(product) =>
					!params.category ||
					product.category?.id === params.category ||
					product.category?.slug === params.category,
			)
			.filter((product) => {
				const text = `${product.name} ${product.summary} ${product.category?.name}`.toLowerCase();
				return words.every((word) => text.includes(word));
			})
			.filter((product) => params.priceMin === undefined || priceOf(product) >= params.priceMin)
			.filter((product) => params.priceMax === undefined || priceOf(product) <= params.priceMax);
		const key = (product: (typeof filtered)[number]) =>
			params.orderBy === "price"
				? priceOf(product)
				: params.orderBy === "name"
					? product.name
					: product.createdAt;
		const direction = params.orderDirection === "asc" ? 1 : -1;
		const sorted = params.orderBy
			? [...filtered].sort((a, b) => (key(a) > key(b) ? direction : key(a) < key(b) ? -direction : 0))
			: filtered;
		const offset = params.offset ?? 0;
		return {
			data: sorted.slice(offset, offset + (params.limit ?? 24)),
			meta: { ...allowed.meta, count: filtered.length, countPublished: filtered.length },
		};
	},
	async productGet({ idOrSlug }: Parameters<CommerceAdapter["productGet"]>[0]) {
		return (await catalog()).find((product) => product.id === idOrSlug || product.slug === idOrSlug) ?? null;
	},
	async categoriesBrowse(params: Parameters<CommerceAdapter["categoriesBrowse"]>[0]) {
		const [snapshot, base] = await Promise.all([getPublishedSnapshot(), mockCommerce.categoriesBrowse({})]);
		const data = snapshot.categories
			.filter((item) => params.active === undefined || item.active === params.active)
			.filter((item) => !params.query || item.name.toLowerCase().includes(params.query.toLowerCase()))
			.sort((a, b) => a.position - b.position)
			.map((item) => ({
				...base.data[0],
				...item,
				position: String(item.position),
				description: null,
				createdAt: base.data[0]?.createdAt ?? "",
				updatedAt: base.data[0]?.updatedAt ?? "",
			}));
		return {
			data: data.slice(params.offset ?? 0, (params.offset ?? 0) + (params.limit ?? data.length)),
			meta: { count: data.length },
		};
	},
	async categoryGet({ idOrSlug }: Parameters<CommerceAdapter["categoryGet"]>[0]) {
		const snapshot = await getPublishedSnapshot();
		const category = snapshot.categories.find(
			(item) => item.active && (item.id === idOrSlug || item.slug === idOrSlug),
		);
		if (!category) return null;
		const base =
			(await mockCommerce.categoryGet({ idOrSlug: category.id })) ??
			(await mockCommerce.categoryGet({ idOrSlug: snapshot.categories[0]?.id ?? "" }));
		if (!base) return null;
		return {
			...base,
			...category,
			position: String(category.position),
			products: await catalog().then((items) => items.filter((item) => item.categoryId === category.id)),
			parent: null,
			children: [],
		};
	},
	async productFilters() {
		const [all, base, snapshot] = await Promise.all([
			catalog(),
			mockCommerce.productFilters(),
			getPublishedSnapshot(),
		]);
		return {
			...base,
			categories: snapshot.categories.filter((item) => item.active).map(({ name, slug }) => ({ name, slug })),
			priceBounds: { min: 0, max: Math.max(0, ...all.map(priceOf)) },
		};
	},
	async search({ query, limit = 6, offset = 0 }: Parameters<CommerceAdapter["search"]>[0]) {
		const result = await databaseCatalog.productBrowse({ query, limit, offset });
		return {
			items: result.data.map((product) => ({
				type: "product" as const,
				id: product.id,
				name: product.name,
				slug: product.slug,
				summary: product.summary,
				image: product.images[0] ?? null,
				relevance: 1,
			})),
			pagination: { total: result.meta.count, offset, limit, hasMore: offset + limit < result.meta.count },
		};
	},
};
