import type { JSONContent, YNSProvider } from "commerce-kit";

// Local stand-in for the YNS backend: a static catalog plus an in-memory cart, exposing the
// same methods the storefront calls on `commerce`. Edit the arrays below to change the store.
// ponytail: carts live in process memory (lost on restart, not shared across instances); swap
// for a real DB/API when this needs to take orders.

const now = new Date().toISOString();
const img = (id: string) => `https://images.unsplash.com/photo-${id}?w=1400&q=80&auto=format&fit=crop`;

const categories = [
	{ id: "cat-abayas", name: "Haute Abayas", slug: "haute-abayas", image: img("1760083545495-b297b1690672") },
	{
		id: "cat-jewelry",
		name: "18K Fine Jewelry",
		slug: "fine-jewelry",
		image: img("1773832190768-b4c4667ceeb4"),
	},
	{
		id: "cat-couture",
		name: "Pakistani Couture",
		slug: "pakistani-couture",
		image: img("1747847471517-952a3eb93a89"),
	},
].map((c) => ({
	...c,
	description: null,
	active: true,
	parentId: null,
	parent: null,
	seo: null,
	createdAt: now,
	updatedAt: now,
	storeId: "local",
}));

const ABAYA_SIZES = ["52 (S)", "54 (M)", "56 (L)", "58 (XL)"];
const DRESS_SIZES = ["XS (UK 6)", "S (UK 8)", "M (UK 10)", "L (UK 12)"];

const seed = [
	{
		sku: "RS-AB-01",
		name: "Blush Silk Embroidered Open Abaya",
		cat: "cat-abayas",
		price: 68000,
		originalPrice: 75000,
		stock: 4,
		sizes: ABAYA_SIZES,
		images: ["1760083545495-b297b1690672", "1736342182642-e2042084f47c"],
		collection: "RINAZ Signature Abaya Line",
		colors: "Blush Pink · Light Cream",
		description:
			"Crafted from premium Korean silk crepe, this open abaya features delicate champagne gold needlework along the lapels and sleeves, styled with a matching tonal slip and chiffon hijab.",
		details: [
			"Hand-embellished with micro-sequins and champagne gold thread",
			"Includes matching silk slip dress and lightweight chiffon scarf",
			"Fluid relaxed silhouette with concealed snap button closure",
			"Dry clean only · Packaged in signature RINAZ keepsake box",
		],
		composition: "100% Japanese Silk Crepe · Pure Chiffon Scarf",
		origin: "Hand-finished in the RINAZ Couture Atelier",
		pairings: "The Gilded Teardrop Diamond Pendant & Graceful Adornment Pearl Choker",
	},
	{
		sku: "RS-JW-02",
		name: "The Gilded Teardrop Diamond Pendant",
		cat: "cat-jewelry",
		price: 145000,
		stock: 3,
		sizes: ["16–18 Inch Adjustable Chain"],
		images: ["1773832190768-b4c4667ceeb4", "1771515411694-57fb626159d1"],
		collection: "RINAZ Fine Jewelry Collection",
		colors: "Champagne Gold · Rose Gold",
		description:
			"A radiant statement of modern grace. Designed in 18K solid champagne gold featuring a center pear-cut diamond surrounded by a double halo of brilliant pavé diamonds.",
		details: [
			"0.85 Total Carat Weight (VVS1 Clarity, E-F Color)",
			"Solid 18K Hallmarked Champagne Gold",
			"Delivered in our signature light cream velvet presentation box",
			"Accompanied by a Certificate of Authenticity & Valuation",
		],
		composition: "18K Solid Champagne Gold · Ethically Sourced Natural Diamonds",
		origin: "Handcrafted by Master Goldsmiths for RINAZ",
		pairings: "Blush Silk Open Abaya & Ivory Anarkali Ensemble",
	},
	{
		sku: "RS-PK-03",
		name: "Ivory & Gold Hand-Embroidered Anarkali Ensemble",
		cat: "cat-couture",
		price: 185000,
		originalPrice: 210000,
		stock: 2,
		sizes: [...DRESS_SIZES, "Custom Fit"],
		images: ["1747847471517-952a3eb93a89", "1733470324488-d0e10d014d80"],
		collection: "Pakistani Formal Pret & Bridal",
		colors: "Light Cream & Gold · Blush Champagne",
		description:
			"An ethereal traditional silhouette reinterpreted with contemporary poise. Features 16 kalis of pure 80g raw silk intricately hand-worked with pearls, crystal beads, and gold dabka.",
		details: [
			"Over 120 hours of handcrafted zardozi and gota artisan work",
			"Paired with matching hand-embroidered tissue silk dupatta and churidar",
			"Custom bodice lining with built-in structure",
			"Available with bespoke fitting consultations",
		],
		composition: "100% Pure Raw Silk · Fine Organza Tissue Dupatta",
		origin: "Master Artisans of Lahore & Islamabad Atelier",
		pairings: "Gilded Teardrop Diamond Pendant & Pearl Choker",
	},
	{
		sku: "RS-AB-04",
		name: "Nocturne Charcoal Zardozi Evening Abaya",
		cat: "cat-abayas",
		price: 74000,
		stock: 5,
		sizes: ABAYA_SIZES,
		images: ["1772474542630-5f5822ca8421", "1772474528936-4f1187eb1611"],
		collection: "RINAZ Signature Abaya Line",
		colors: "Deep Charcoal · Midnight Black",
		description:
			"Timeless modest elegance in rich deep charcoal. Accented with intricate hand-embroidered sleeve medallions in antique champagne gold zari with a tie sash and matching Sheila.",
		details: [
			"Heavy breathable Nida silk fabric for luxurious drape",
			"Delicate hand-sewn metallic gold piping along perimeter",
			"Detachable self-tie waist cord with handmade tassel finishes",
			"Hand-finished in our studio workshop",
		],
		composition: "Premium Nida Silk Fabric · Metal Thread Embroidery",
		origin: "RINAZ Studio Atelier",
		pairings: "The Gilded Teardrop Diamond Pendant",
	},
	{
		sku: "RS-JW-05",
		name: "Graceful Adornment Pearl & Gold Choker",
		cat: "cat-jewelry",
		price: 98000,
		stock: 3,
		sizes: ["14–16 Inch Adjustable Choker"],
		images: ["1654699991520-aaaf4dd2608b", "1515562141207-7a88fb7ce338"],
		collection: "RINAZ Fine Jewelry Collection",
		colors: "Champagne Pearl",
		description:
			"Lustrous hand-selected cultured South Sea pearls strung with silk knotting and finished with an architectural 18K gold clasp embossed with the RINAZ monogram.",
		details: [
			"Natural 7-8mm AAA South Sea pearls with brilliant orient",
			"Custom 18K gold clasp with safety latch",
			"Presented in archival keepsake velvet box",
		],
		composition: "100% Cultured Pearls · 18K Solid Gold",
		origin: "Atelier Jewelry Studio",
		pairings: "Ivory Anarkali Ensemble & Blush Silk Open Abaya",
	},
	{
		sku: "RS-PK-06",
		name: "Rose Quartz Raw Silk Formal Peshwas",
		cat: "cat-couture",
		price: 162000,
		stock: 2,
		sizes: DRESS_SIZES,
		images: ["1733470381571-c3d082e68457", "1705920824583-0e783235394d"],
		collection: "Pakistani Formal Pret & Bridal",
		colors: "Blush Pink · Champagne Gold",
		description:
			"A fairytale silhouette blending soft blush pink hues with intricate resham thread embroidery and hand-cut gota motifs. The flared hem glides effortlessly.",
		details: [
			"Layered sheer organza over pure raw silk lining",
			"Heavily embellished hand-worked neckline and back tassel tie",
			"Includes embroidered silk trousers and mukaish dupatta",
		],
		composition: "Pure Silk Organza · 80g Raw Silk Trouser",
		origin: "Handmade in RINAZ Lahore Atelier",
		pairings: "The Gilded Teardrop Diamond Pendant",
	},
];

const text = (value: string): JSONContent => ({ type: "text", text: value });
const para = (value: string): JSONContent => ({ type: "paragraph", content: [text(value)] });
const heading = (value: string): JSONContent => ({
	type: "heading",
	attrs: { level: 3 },
	content: [text(value)],
});
const bullets = (items: string[]): JSONContent => ({
	type: "bulletList",
	content: items.map((item) => ({ type: "listItem", content: [para(item)] })),
});

const products = seed.map((s, i) => {
	const id = `prod-${i + 1}`;
	const slug = s.name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");
	const category = categories.find((c) => c.id === s.cat) ?? null;
	const sizeType = { id: `size-${id}`, type: "string" as const, label: "Size" };
	const sizeValues = s.sizes.map((value, position) => ({
		id: `${sizeType.id}-${position}`,
		value,
		position,
		colorValue: null,
	}));
	const price = String(s.price);
	const originalPrice = String(s.originalPrice ?? s.price);
	return {
		id,
		name: s.name,
		slug,
		type: "product" as const,
		status: "published" as const,
		summary: s.description,
		content: {
			type: "doc",
			content: [
				para(s.description),
				heading("Craftsmanship"),
				bullets(s.details),
				heading("Composition & Origin"),
				para(`${s.composition}. ${s.origin}.`),
				heading("Colour Palette"),
				para(s.colors),
				heading("Editorial Pairings"),
				para(s.pairings),
				para(`SKU ${s.sku} · ${s.collection}`),
			],
		},
		images: s.images.map(img),
		badge: null,
		flags: null,
		seo: null,
		categoryId: category?.id ?? null,
		category,
		brandId: null,
		bundle: null,
		bundlePriceMode: "percent" as const,
		bundleFixedPriceAmount: null,
		bundleFixedPriceAmountGross: null,
		bundleAmountOffAmount: null,
		bundleAmountOffAmountGross: null,
		volumePricingTiers: [],
		productCollections: [],
		variantsTypes: s.sizes.length > 1 ? [{ ...sizeType, variantValues: sizeValues }] : [],
		translations: [],
		createdAt: new Date(Date.now() - i * 86_400_000).toISOString(),
		updatedAt: now,
		storeId: "local",
		variants: sizeValues.map((value) => ({
			id: `${id}-${value.position}`,
			productId: id,
			price,
			priceGross: price,
			originalPrice,
			originalPriceGross: originalPrice,
			calculatedPrice: null,
			// ponytail: the brief gives stock per product, so every size shows that count.
			stock: s.stock,
			images: [],
			attributes: null,
			combinations: s.sizes.length > 1 ? [{ variantValue: { ...value, variantType: sizeType } }] : [],
			prices: [],
			sku: s.sku,
			description: null,
			shippable: true,
			createdAt: now,
			updatedAt: now,
			storeId: "local",
		})),
	};
});

const collections = [
	{ id: "col-new", name: "New In", slug: "new-in", productIds: ["prod-1", "prod-2", "prod-3"] },
	{ id: "col-bridal", name: "Bridal Pret", slug: "bridal-pret", productIds: ["prod-3", "prod-6"] },
	{ id: "col-noir", name: "Evening Noir", slug: "evening-noir", productIds: ["prod-4", "prod-2"] },
	{
		id: "col-golden-hour",
		name: "The Golden Hour Collection",
		slug: "golden-hour",
		description:
			"Sculpted in pure double-faced georgette silk and metallic gold zardozi for intimate ceremonies and receptions.",
		productIds: ["prod-3", "prod-6", "prod-2", "prod-5"],
	},
].map(({ productIds, ...c }) => ({
	description: null as string | null,
	...c,
	image: null,
	active: true,
	seo: null,
	filter: { type: "manual" as const },
	createdAt: now,
	updatedAt: now,
	storeId: "local",
	productCollections: products
		.filter((p) => productIds.includes(p.id))
		.map((product) => ({ productId: product.id, collectionId: c.id, product })),
}));

// Percent coupons use thousandths of a percent, like the API: "10000" = 10%.
const coupons = [
	{ code: "RINAZ10", type: "percentage", value: "10000" },
	{ code: "STUDIO", type: "percentage", value: "10000" },
];

const me = {
	publicUrl: "http://localhost:3000",
	storeBaseUrl: "http://localhost:3000",
	store: {
		id: "local",
		name: "RINAZ STUDIO",
		subdomain: "rinaz-studio",
		domain: null,
		domainVerified: false,
		currency: "USD",
		locale: "en-US",
		taxBehavior: "inclusive" as const,
		published: true,
		environment: "test" as const,
		settings: {
			storeName: "RINAZ STUDIO",
			storeDescription:
				"Haute Abayas, Fine Jewelry & Pakistani Couture. Handcrafted luxury Abayas, certified 18K solid gold jewelry, and bespoke Pakistani bridal couture.",
			enabledTools: { contactForm: true },
		},
	},
};

type Product = (typeof products)[number];
type Line = { quantity: number; productVariant: Product["variants"][number] & { product: Product } };
type Coupon = (typeof coupons)[number];
type Cart = { id: string; lineItems: Line[]; coupon: Coupon | null };

const globalCarts = globalThis as { __mockCarts?: Map<string, Cart> };
globalCarts.__mockCarts ??= new Map();
const carts = globalCarts.__mockCarts;

// Totals the cart drawer reads: subtotalGross before the coupon, subtotal after it.
const priced = (cart: Cart) => {
	const gross = cart.lineItems.reduce((sum, l) => sum + Number(l.productVariant.price) * l.quantity, 0);
	const pct = cart.coupon ? Number(cart.coupon.value) / 100_000 : 0;
	const subtotal = Math.round(gross * (1 - pct));
	return { ...cart, subtotalGross: gross, subtotalNet: gross, subtotal };
};

const save = (cart: Cart) => {
	carts.set(cart.id, cart);
	return priced(cart);
};

const getCart = (cartId: string) => {
	const cart = carts.get(cartId);
	if (!cart) throw new Error("Cart not found");
	return cart;
};

const priceOf = (p: Product) => Number(p.variants[0]?.price ?? 0);

const findProduct = (idOrSlug: string) =>
	products.find((p) => p.id === idOrSlug || p.slug === idOrSlug) ?? null;

const browse = (params: {
	query?: string;
	category?: string;
	collection?: string;
	limit?: number;
	offset?: number;
	orderBy?: string;
	orderDirection?: string;
	priceMin?: number;
	priceMax?: number;
}) => {
	// Every word must appear somewhere in the name, summary or category ("silk abaya").
	const words = params.query?.toLowerCase().split(/\s+/).filter(Boolean) ?? [];
	const inCollection = collections.find((c) => c.slug === params.collection);
	const filtered = products
		.filter((p) => {
			const haystack = `${p.name} ${p.summary} ${p.category?.name}`.toLowerCase();
			return words.every((w) => haystack.includes(w));
		})
		.filter((p) => !params.category || p.category?.slug === params.category)
		.filter((p) => !inCollection || inCollection.productCollections.some((pc) => pc.productId === p.id))
		.filter((p) => params.priceMin === undefined || priceOf(p) >= params.priceMin)
		.filter((p) => params.priceMax === undefined || priceOf(p) <= params.priceMax);
	const key = (p: Product) =>
		params.orderBy === "price" ? priceOf(p) : params.orderBy === "name" ? p.name : p.createdAt;
	const dir = params.orderDirection === "asc" ? 1 : -1;
	const sorted = params.orderBy ? [...filtered].sort((a, b) => (key(a) > key(b) ? dir : -dir)) : filtered;
	const offset = params.offset ?? 0;
	return {
		data: sorted.slice(offset, offset + (params.limit ?? 24)),
		meta: {
			count: filtered.length,
			countPublished: filtered.length,
			countDraft: 0,
			countHidden: 0,
			nextCursor: undefined,
		},
	};
};

const upsert = ({
	cartId,
	variantId,
	quantity,
	mode,
}: {
	cartId?: string;
	variantId: string;
	quantity: number;
	mode?: string;
}) => {
	const cart = cartId ? getCart(cartId) : { id: crypto.randomUUID(), lineItems: [], coupon: null };
	const product = products.find((p) => p.variants.some((v) => v.id === variantId));
	const variant = product?.variants.find((v) => v.id === variantId);
	if (!product || !variant) throw new Error(`Variant ${variantId} not found`);
	const existing = cart.lineItems.find((l) => l.productVariant.id === variantId);
	const nextQty = quantity === 0 ? 0 : mode === "set" ? quantity : (existing?.quantity ?? 0) + quantity;
	const others = cart.lineItems.filter((l) => l.productVariant.id !== variantId);
	return save({
		...cart,
		lineItems:
			nextQty > 0 ? [...others, { quantity: nextQty, productVariant: { ...variant, product } }] : others,
	});
};

const findCoupon = (code: string) => coupons.find((c) => c.code === code.toUpperCase()) ?? null;

const empty = { data: [] };

const mock = {
	meGet: async () => me,
	productBrowse: async (params: Parameters<typeof browse>[0]) => browse(params),
	productGet: async ({ idOrSlug }: { idOrSlug: string }) => findProduct(idOrSlug),
	productFilters: async () => ({
		priceBounds: { min: 0, max: Math.max(...products.map((p) => priceOf(p))) },
		variantTypes: [],
		categories: categories.map(({ name, slug }) => ({ name, slug })),
		collections: collections.map(({ name, slug }) => ({ name, slug })),
		brands: [],
	}),
	search: async ({ query, limit }: { query: string; limit?: number }) => ({
		items: browse({ query, limit }).data.map((p) => ({ ...p, image: p.images[0] ?? null })),
	}),
	collectionBrowse: async ({ limit }: { limit?: number }) => ({ data: collections.slice(0, limit) }),
	collectionGet: async ({ idOrSlug }: { idOrSlug: string }) =>
		collections.find((c) => c.id === idOrSlug || c.slug === idOrSlug) ?? null,
	categoriesBrowse: async () => ({ data: categories }),
	categoryGet: async ({ idOrSlug }: { idOrSlug: string }) =>
		categories.find((c) => c.id === idOrSlug || c.slug === idOrSlug) ?? null,
	cartGet: async ({ cartId }: { cartId: string }) => {
		const cart = carts.get(cartId);
		return cart ? priced(cart) : null;
	},
	cartUpsert: async (body: Parameters<typeof upsert>[0]) => upsert(body),
	cartAddBundle: async () => {
		throw new Error("Bundles are not supported in the local store");
	},
	cartCouponApply: async ({ cartId, code }: { cartId: string; code: string }) => {
		const coupon = findCoupon(code);
		if (!coupon) throw new Error("Coupon cannot be applied");
		return save({ ...getCart(cartId), coupon });
	},
	cartCouponRemove: async ({ cartId }: { cartId: string }) => {
		save({ ...getCart(cartId), coupon: null });
		return { ok: true };
	},
	couponGet: async () => null,
	orderGet: async () => null,
	postBrowse: async () => empty,
	postGet: async () => null,
	legalPageBrowse: async () => empty,
	legalPageGet: async () => null,
	productReviewsBrowse: async () => ({ data: [], meta: { count: 0 } }),
	productReviewCreate: async () => ({ ok: true }),
	subscriberCreate: async () => ({ ok: true }),
	contactMessageCreate: async () => ({ ok: true }),
	request: async () => ({ status: "ok" }),
};

// ponytail: cast — the mock covers only the methods this storefront calls, with the fields its
// pages read, not the full 16k-line API type surface.
export const mockCommerce = mock as unknown as YNSProvider;
