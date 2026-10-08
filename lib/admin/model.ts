import type { HeroSlide } from "@/lib/storefront-content";

export const roles = ["Owner", "Editor", "Catalog Manager", "Operations"] as const;
export type Role = (typeof roles)[number];
export type Area = "cms" | "catalog" | "media" | "administration";
export const canEdit = (role: Role, area: Area) =>
	role === "Owner" ||
	(role === "Editor" && (area === "cms" || area === "media")) ||
	(role === "Catalog Manager" && (area === "catalog" || area === "media"));
export type Variant = {
	id: string;
	sku: string;
	label: string;
	price: string;
	originalPrice: string;
	stock: number;
	images: string[];
	attributes: Record<string, string>;
};
export type Product = {
	id: string;
	name: string;
	slug: string;
	summary: string;
	categoryId: string;
	status: "published" | "draft" | "archived";
	images: string[];
	variants: Variant[];
};
export type Category = {
	id: string;
	name: string;
	slug: string;
	parentId: string | null;
	image: string;
	active: boolean;
	position: number;
};
export type Media = { id: string; name: string; src: string; alt: string; uploaded: boolean };
export type LinkItem = { id: string; label: string; href: string };
export type Section = {
	id: string;
	type: "hero" | "categories" | "products" | "feature" | "trust" | "about" | "sanctuary" | "newsletter";
	title: string;
	text: string;
	image: string;
	ctaLabel: string;
	ctaHref: string;
	enabled: boolean;
	productIds: string[];
};
export type Content = {
	storeName: string;
	announcement: { enabled: boolean; text: string; href: string };
	navigation: LinkItem[];
	footer: { text: string; links: LinkItem[] };
	slides: HeroSlide[];
	sections: Section[];
	pages: { id: string; title: string; text: string; seoTitle: string; seoDescription: string }[];
	contact: { email: string; phone: string; address: string };
	faqs: { id: string; category: string; question: string; answer: string }[];
};
export type Snapshot = { content: Content; products: Product[]; categories: Category[] };
export type Adjustment = {
	id: string;
	variantId: string;
	productName: string;
	before: number;
	after: number;
	reason: string;
	at: string;
};
export type Activity = { id: string; message: string; role: Role; at: string };
export type DemoState = {
	version: 1;
	draft: Snapshot;
	published: Snapshot;
	media: Media[];
	threshold: number;
	adjustments: Adjustment[];
	activity: Activity[];
	publishedAt: string | null;
};
export const price = (value: string) => /^\d+$/.test(value) && Number.isSafeInteger(Number(value));
export const safeHref = (value: string) =>
	!/[\s\\]/.test(value) &&
	!Array.from(value).some((char) => char.charCodeAt(0) < 32) &&
	((value.startsWith("/") && !value.startsWith("//")) ||
		/^https:\/\/[^/]+/.test(value) ||
		/^mailto:[^@]+@[^@]+$/.test(value) ||
		/^tel:\+?[\d-]+$/.test(value));
export const safeImage = (value: string) =>
	value === "" ||
	value.startsWith("media:") ||
	(value.startsWith("/") && !value.startsWith("//") && !value.includes("\\")) ||
	/^https:\/\/(images\.unsplash\.com|[a-z0-9.-]+\.public\.blob\.vercel-storage\.com|(?:[a-z0-9-]+\.)?yns\.(?:store|cx))\//.test(
		value,
	);
const unique = (values: string[]) => new Set(values).size === values.length;
const slug = (value: string) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);

export function validateSnapshot(snapshot: Snapshot) {
	const { content, products, categories } = snapshot;
	if (!content.storeName.trim()) throw new Error("Store name is required.");
	if (
		!unique(products.map((p) => p.id)) ||
		!unique(products.map((p) => p.slug)) ||
		!unique(categories.map((c) => c.id)) ||
		!unique(categories.map((c) => c.slug))
	)
		throw new Error("Product and category IDs and slugs must be unique.");
	const variants = products.flatMap((p) => p.variants);
	if (!unique(variants.map((v) => v.id)) || !unique(variants.map((v) => v.sku.toLowerCase())))
		throw new Error("Every variant needs a unique ID and SKU.");
	products.map((p) => {
		if (
			!p.name.trim() ||
			!slug(p.slug) ||
			!p.variants.length ||
			!categories.some((c) => c.id === p.categoryId)
		)
			throw new Error("Products need a name, valid slug, category, and at least one variant.");
		if (p.images.some((src) => !safeImage(src))) throw new Error("Unsupported product image URL.");
		p.variants.map((v) => {
			if (
				!v.sku.trim() ||
				!v.label.trim() ||
				!price(v.price) ||
				!price(v.originalPrice) ||
				Number(v.price) > Number(v.originalPrice) ||
				!Number.isSafeInteger(v.stock) ||
				v.stock < 0 ||
				v.images.some((src) => !safeImage(src))
			)
				throw new Error(
					"Variants need a SKU, label, valid minor-unit prices (sale ≤ original), and nonnegative whole stock.",
				);
			return v;
		});
		return p;
	});
	categories.map((c) => {
		if (
			!c.name.trim() ||
			!slug(c.slug) ||
			!safeImage(c.image) ||
			!Number.isSafeInteger(c.position) ||
			c.position < 0
		)
			throw new Error("Categories need a name, valid slug, image, and nonnegative whole position.");
		const visited = new Set([c.id]);
		let parent = c.parentId;
		while (parent) {
			if (visited.has(parent)) throw new Error("Category parents cannot form a cycle.");
			visited.add(parent);
			const next = categories.find((item) => item.id === parent);
			if (!next) throw new Error("Category parent does not exist.");
			parent = next.parentId;
		}
		return c;
	});
	const links = [
		...content.navigation,
		...content.footer.links,
		{ href: content.announcement.href, label: "Announcement" },
		...content.slides.flatMap((s) => [s.cta, s.secondary]),
		...content.sections.filter((s) => s.ctaHref).map((s) => ({ href: s.ctaHref, label: s.ctaLabel })),
	];
	if (links.some((l) => !l.label.trim() || !safeHref(l.href)))
		throw new Error("Links require a label and a safe relative, HTTPS, email, or phone URL.");
	if (
		!content.slides.length ||
		content.slides.some(
			(s) =>
				!s.title.trim() ||
				s.images.length !== 2 ||
				s.images.some((i) => !i.src || !safeImage(i.src) || !i.alt.trim()),
		)
	)
		throw new Error("Each hero needs a title and two images with alt text.");
	if (
		!unique(content.sections.map((s) => s.id)) ||
		content.sections.some(
			(s) =>
				!s.title.trim() ||
				!safeImage(s.image) ||
				s.productIds.some((id) => !products.some((p) => p.id === id)),
		)
	)
		throw new Error("Sections need unique IDs, titles, supported images, and existing products.");
	if (
		content.pages.some((p) => !p.title.trim()) ||
		content.faqs.some((f) => !f.question.trim() || !f.answer.trim())
	)
		throw new Error("Pages need titles; FAQ questions and answers cannot be empty.");
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(content.contact.email))
		throw new Error("Enter a valid contact email.");
	return snapshot;
}

export function mediaUsage(state: DemoState, src: string) {
	return [state.draft, state.published].flatMap((snapshot, index) => {
		const prefix = index === 0 ? "Draft" : "Published";
		return [
			...snapshot.products
				.filter((p) => p.images.includes(src) || p.variants.some((v) => v.images.includes(src)))
				.map((p) => `${prefix}: ${p.name}`),
			...snapshot.categories.filter((c) => c.image === src).map((c) => `${prefix}: ${c.name}`),
			...snapshot.content.slides
				.filter((s) => s.images.some((i) => i.src === src))
				.map((s) => `${prefix}: ${s.title}`),
			...snapshot.content.sections.filter((s) => s.image === src).map((s) => `${prefix}: ${s.title}`),
		];
	});
}

// Imports are untrusted: verify the complete structure before applying domain validation.
const record = (v: unknown): v is Record<string, unknown> =>
	typeof v === "object" && v !== null && !Array.isArray(v);
const strings = (v: unknown): v is string[] => Array.isArray(v) && v.every((i) => typeof i === "string");
const fields = (v: unknown, keys: string[]) => record(v) && keys.every((k) => typeof v[k] === "string");
export function isSnapshot(v: unknown): v is Snapshot {
	if (!record(v) || !record(v.content) || !Array.isArray(v.products) || !Array.isArray(v.categories))
		return false;
	const c = v.content;
	return (
		fields(c, ["storeName"]) &&
		record(c.announcement) &&
		fields(c.announcement, ["text", "href"]) &&
		typeof c.announcement.enabled === "boolean" &&
		record(c.footer) &&
		fields(c.footer, ["text"]) &&
		[c.navigation, c.footer.links].every(
			(a) => Array.isArray(a) && a.every((l) => fields(l, ["id", "label", "href"])),
		) &&
		Array.isArray(c.slides) &&
		c.slides.every(
			(s) =>
				record(s) &&
				fields(s, ["id", "title", "accent", "copy"]) &&
				fields(s.cta, ["label", "href"]) &&
				fields(s.secondary, ["label", "href"]) &&
				Array.isArray(s.images) &&
				s.images.every((i) => fields(i, ["src", "alt"])),
		) &&
		Array.isArray(c.sections) &&
		c.sections.every(
			(s) =>
				record(s) &&
				fields(s, ["id", "title", "text", "image", "ctaLabel", "ctaHref"]) &&
				["hero", "categories", "products", "feature", "trust", "about", "sanctuary", "newsletter"].includes(
					String(s.type),
				) &&
				typeof s.enabled === "boolean" &&
				strings(s.productIds),
		) &&
		Array.isArray(c.pages) &&
		c.pages.every((p) => fields(p, ["id", "title", "text", "seoTitle", "seoDescription"])) &&
		fields(c.contact, ["email", "phone", "address"]) &&
		Array.isArray(c.faqs) &&
		c.faqs.every((f) => fields(f, ["id", "category", "question", "answer"])) &&
		v.categories.every(
			(x) =>
				record(x) &&
				fields(x, ["id", "name", "slug", "image"]) &&
				(x.parentId === null || typeof x.parentId === "string") &&
				typeof x.active === "boolean" &&
				typeof x.position === "number",
		) &&
		v.products.every(
			(p) =>
				record(p) &&
				fields(p, ["id", "name", "slug", "summary", "categoryId"]) &&
				["published", "draft", "archived"].includes(String(p.status)) &&
				strings(p.images) &&
				Array.isArray(p.variants) &&
				p.variants.every(
					(x) =>
						record(x) &&
						fields(x, ["id", "sku", "label", "price", "originalPrice"]) &&
						typeof x.stock === "number" &&
						strings(x.images) &&
						record(x.attributes) &&
						Object.values(x.attributes).every((a) => typeof a === "string"),
				),
		)
	);
}
export function parseDemoState(input: unknown): DemoState {
	if (
		!record(input) ||
		input.version !== 1 ||
		!isSnapshot(input.draft) ||
		!isSnapshot(input.published) ||
		!Array.isArray(input.media) ||
		!input.media.every(
			(m) =>
				record(m) &&
				fields(m, ["id", "name", "src", "alt"]) &&
				typeof m.uploaded === "boolean" &&
				safeImage(String(m.src)),
		) ||
		!Number.isSafeInteger(input.threshold) ||
		Number(input.threshold) < 0 ||
		!Array.isArray(input.activity) ||
		!input.activity.every(
			(a) => record(a) && fields(a, ["id", "message", "at"]) && roles.includes(a.role as Role),
		) ||
		!Array.isArray(input.adjustments) ||
		!input.adjustments.every(
			(a) =>
				record(a) &&
				fields(a, ["id", "variantId", "productName", "reason", "at"]) &&
				Number.isSafeInteger(a.before) &&
				Number(a.before) >= 0 &&
				Number.isSafeInteger(a.after) &&
				Number(a.after) >= 0,
		) ||
		!(input.publishedAt === null || typeof input.publishedAt === "string")
	)
		throw new Error("Invalid demo file. Expected a complete RINAZ version 1 export.");
	validateSnapshot(input.draft);
	validateSnapshot(input.published);
	const state = input as DemoState;
	if (!unique(state.media.map((m) => m.id)) || !unique(state.media.map((m) => m.src)))
		throw new Error("Media IDs and sources must be unique.");
	const referenced = [state.draft, state.published]
		.flatMap((s) => [
			...s.products.flatMap((p) => [...p.images, ...p.variants.flatMap((v) => v.images)]),
			...s.categories.map((c) => c.image),
			...s.content.slides.flatMap((slide) => slide.images.map((i) => i.src)),
			...s.content.sections.map((section) => section.image),
		])
		.filter((src) => src.startsWith("media:"));
	if (referenced.some((src) => !state.media.some((m) => m.src === src && m.uploaded)))
		throw new Error("Uploaded image references must exist in the media gallery.");
	return state;
}
