const photo = (id: string) => `https://images.unsplash.com/photo-${id}?w=1400&q=80&auto=format&fit=crop`;

export const heroSlides = [
	{
		id: "new-in",
		title: "Timeless Style.",
		accent: "Modern Luxury",
		copy: "Handcrafted luxury Abayas, certified 18K solid gold jewelry, and bespoke Pakistani bridal couture created for modern poise.",
		cta: { label: "SHOP NEW IN", href: "/collection/new-in" },
		secondary: { label: "BOOK PRIVATE SALON", href: "/#sanctuary" },
		images: [
			{ src: photo("1724412665971-114bd351a42d"), alt: "Black abaya with champagne gold embroidery" },
			{ src: photo("1760083545495-b297b1690672"), alt: "Beige open abaya with tonal needlework" },
		],
	},
	{
		id: "golden-hour",
		title: "The Golden Hour",
		accent: "Collection",
		copy: "Sculpted in pure double-faced georgette silk and metallic gold zardozi for intimate ceremonies and receptions.",
		cta: { label: "SHOP THE CAPSULE", href: "/collection/golden-hour" },
		secondary: { label: "BRIDAL PRET", href: "/collection/bridal-pret" },
		images: [
			{ src: photo("1747847471517-952a3eb93a89"), alt: "Bride in hand-embroidered Pakistani couture" },
			{ src: photo("1733470324488-d0e10d014d80"), alt: "Pastel formal ensemble beneath a floral arch" },
		],
	},
	{
		id: "fine-jewelry",
		title: "18K Fine",
		accent: "Jewelry",
		copy: "Bridal diamonds and hallmarked solid gold, each piece delivered with a signed Certificate of Valuation.",
		cta: { label: "SHOP JEWELRY", href: "/category/fine-jewelry" },
		secondary: { label: "THE TEARDROP PENDANT", href: "/product/the-gilded-teardrop-diamond-pendant" },
		images: [
			{ src: photo("1773832190768-b4c4667ceeb4"), alt: "Gold pendant set with diamonds" },
			{ src: photo("1654699991520-aaaf4dd2608b"), alt: "Strand of South Sea pearls" },
		],
	},
];

export type HeroSlide = (typeof heroSlides)[number];
