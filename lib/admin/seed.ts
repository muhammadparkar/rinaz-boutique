import { faqCategories } from "@/app/(storefront)/faq/faq-data";
import { commerce } from "@/lib/commerce";
import { heroSlides } from "@/lib/storefront-content";
import type { Media, Section, Snapshot } from "./model";

export async function getAdminSeed() {
	"use cache";
	const [catalog, taxonomy] = await Promise.all([
		commerce.productBrowse({ active: true, limit: 100 }),
		commerce.categoriesBrowse({}),
	]);
	const products: Snapshot["products"] = catalog.data.map((p) => ({
		id: p.id,
		name: p.name,
		slug: p.slug,
		summary: p.summary || "",
		categoryId: p.category?.id || "cat-abayas",
		status: "published",
		images: p.images,
		variants: p.variants.map((v, index) => ({
			id: v.id,
			sku: `${v.sku || p.slug}-${index + 1}`,
			label: v.combinations?.map((c) => c.variantValue.value).join(" / ") || "Default",
			price: v.price,
			originalPrice: v.originalPrice || v.price,
			stock: v.stock ?? 0,
			images: v.images,
			attributes: Object.fromEntries(
				v.combinations?.map((c) => [c.variantValue.variantType.label, c.variantValue.value]) || [],
			),
		})),
	}));
	const photo = (id: string) => `https://images.unsplash.com/photo-${id}?w=1400&q=80&auto=format&fit=crop`;
	const sections: Section[] = [
		{
			id: "hero",
			type: "hero",
			title: "Campaign Carousel",
			text: "",
			image: "",
			ctaLabel: "",
			ctaHref: "",
			enabled: true,
			productIds: [],
		},
		{
			id: "categories",
			type: "categories",
			title: "Explore Our World of Style",
			text: "Handcrafted for Unforgettable Entrances",
			image: "",
			ctaLabel: "",
			ctaHref: "",
			enabled: true,
			productIds: [],
		},
		{
			id: "bestsellers",
			type: "products",
			title: "Best Sellers",
			text: "Our most coveted luxury silhouettes, certified 18K solid gold pendants, and heirloom Pakistani bridal couture.",
			image: "",
			ctaLabel: "",
			ctaHref: "",
			enabled: true,
			productIds: products.map((p) => p.id),
		},
		{
			id: "golden-hour",
			type: "feature",
			title: "The Golden Hour Collection.",
			text: "Sculpted in pure double-faced georgette silk and metallic gold zardozi for intimate ceremonies and receptions.",
			image: photo("1733470324488-d0e10d014d80"),
			ctaLabel: "SHOP THE CAPSULE",
			ctaHref: "/collection/golden-hour",
			enabled: true,
			productIds: [],
		},
		{
			id: "trust",
			type: "trust",
			title: "Our promise",
			text: "100% Certified Authentic\nDHL Express Worldwide\n14-Day Global Returns\n24/7 Styling Concierge",
			image: "",
			ctaLabel: "",
			ctaHref: "",
			enabled: true,
			productIds: [],
		},
		{
			id: "pairings",
			type: "products",
			title: "Curated Adornments & Pairings",
			text: "Style the signature Blush Silk Open Abaya with hallmarked 18K solid gold and South Sea pearls for an effortless, elevated entrance.",
			image: photo("1736342182642-e2042084f47c"),
			ctaLabel: "",
			ctaHref: "",
			enabled: true,
			productIds: products
				.slice(0, 2)
				.concat(products.slice(4, 5))
				.map((p) => p.id),
		},
		{
			id: "about",
			type: "about",
			title: "Simple. Memorable. Meaningful.",
			text: "Every curve of the RINAZ mark is rooted in modesty, craftsmanship, and cultural pride. We honor Islamic modest heritage and South Asian craft traditions with graceful contemporary refinement.\nSilhouettes designed to transcend fleeting seasons and become treasured generational heirlooms.",
			image: "",
			ctaLabel: "",
			ctaHref: "",
			enabled: true,
			productIds: [],
		},
		{
			id: "sanctuary",
			type: "sanctuary",
			title: "An intimate private bridal consultation.",
			text: "Custom fittings tailored for your sacred day\nStep inside the RINAZ Studio bridal sanctuary. From bespoke made-to-measure Anarkalis to private 18K fine jewelry styling, our appointments ensure an unforgettable wedding experience.",
			image: "",
			ctaLabel: "BOOK BRIDAL APPOINTMENT",
			ctaHref: "/contact",
			enabled: true,
			productIds: [],
		},
		{
			id: "newsletter",
			type: "newsletter",
			title: "Receive First Access to Runway Drops",
			text: "Join our private client register to receive seasonal preview lookbooks, limited bridal pret releases, and private studio invitations.",
			image: "",
			ctaLabel: "",
			ctaHref: "",
			enabled: true,
			productIds: [],
		},
	];
	const snapshot: Snapshot = {
		products,
		categories: taxonomy.data.map((c, position) => ({
			id: c.id,
			name: c.name,
			slug: c.slug,
			parentId: c.parentId,
			image: c.image || "",
			active: c.active,
			position,
		})),
		content: {
			storeName: "RINAZ STUDIO",
			announcement: {
				enabled: false,
				text: "Complimentary Worldwide Insured Delivery On Orders Over $400",
				href: "/collection/new-in",
			},
			navigation: [
				{ id: "new", label: "NEW IN", href: "/collection/new-in" },
				{ id: "abayas", label: "HAUTE ABAYAS", href: "/category/haute-abayas" },
				{ id: "jewelry", label: "18K FINE JEWELRY", href: "/category/fine-jewelry" },
				{ id: "couture", label: "PAKISTANI COUTURE", href: "/category/pakistani-couture" },
				{ id: "bridal", label: "BRIDAL PRET", href: "/collection/bridal-pret" },
				{ id: "studio", label: "STUDIO SANCTUARY", href: "/#sanctuary" },
			],
			footer: {
				text: "Handcrafted couture Abayas, certified 18K solid gold fine jewelry, and bespoke Pakistani bridal couture crafted for the modern you.",
				links: [
					{ id: "about", label: "About the Studio", href: "/about" },
					{ id: "faq", label: "Client Concierge", href: "/faq" },
					{ id: "privacy", label: "Privacy Policy", href: "/privacy-policy" },
					{ id: "terms", label: "Terms of Service", href: "/terms-of-service" },
				],
			},
			slides: structuredClone(heroSlides),
			sections,
			pages: [
				{
					id: "home",
					title: "Home",
					text: "",
					seoTitle: "RINAZ STUDIO",
					seoDescription:
						"Haute Abayas, Fine Jewelry & Pakistani Couture. Handcrafted luxury for modern poise.",
				},
				{
					id: "about",
					title: "About Us",
					text: sections.find((s) => s.id === "about")?.text || "",
					seoTitle: "About Us — RINAZ STUDIO",
					seoDescription: "Learn about our story, our values, and the people behind the products we make.",
				},
				{
					id: "contact",
					title: "Contact Us",
					text: "Have a question or just want to say hello? Send us a message and we'll get back to you as soon as we can.",
					seoTitle: "Contact Us — RINAZ STUDIO",
					seoDescription: "Get in touch with the RINAZ STUDIO team.",
				},
				{
					id: "faq",
					title: "Frequently Asked Questions",
					text: "Sizing, shipping, returns, and care.",
					seoTitle: "FAQs — RINAZ STUDIO",
					seoDescription: "Answers to your questions about RINAZ STUDIO.",
				},
			],
			contact: {
				email: "concierge@rinazboutique.com",
				phone: "+44 20 7946 0912",
				address: "Knightsbridge & Bond Street, London",
			},
			faqs: faqCategories.flatMap((c) =>
				c.questions.map((q, index) => ({ id: `${c.id}-${index}`, category: c.title, ...q })),
			),
		},
	};
	const sources = [
		...new Set(
			[
				...products.flatMap((p) => p.images),
				...snapshot.categories.map((c) => c.image),
				...heroSlides.flatMap((s) => s.images.map((i) => i.src)),
				...sections.map((s) => s.image),
			].filter(Boolean),
		),
	];
	const media: Media[] = sources.map((src, index) => ({
		id: `seed-${index}`,
		src,
		name:
			heroSlides.flatMap((s) => s.images).find((i) => i.src === src)?.alt ||
			products.find((p) => p.images.includes(src))?.name ||
			`Studio image ${index + 1}`,
		alt:
			heroSlides.flatMap((s) => s.images).find((i) => i.src === src)?.alt ||
			products.find((p) => p.images.includes(src))?.name ||
			`RINAZ studio image ${index + 1}`,
		uploaded: false,
	}));
	return { snapshot, media };
}
