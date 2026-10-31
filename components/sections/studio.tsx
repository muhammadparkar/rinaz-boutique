import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type SectionProps = {
	title?: string;
	text?: string;
	image?: React.ReactNode;
	secondaryImage?: React.ReactNode;
	ctaLabel?: string;
	ctaHref?: string;
};

const photo = (id: string) => `https://images.unsplash.com/photo-${id}?w=1200&q=80&auto=format&fit=crop`;

export const categoryTiles = [
	{
		name: "Haute Abayas",
		subtitle: "Pure Silk & Champagne Gold Needlework",
		href: "/category/haute-abayas",
		image: photo("1760083545495-b297b1690672"),
	},
	{
		name: "18K Fine Jewelry",
		subtitle: "Bridal Diamonds & Hallmarked Gold",
		href: "/category/fine-jewelry",
		image: photo("1773832190768-b4c4667ceeb4"),
	},
	{
		name: "Pakistani Couture",
		subtitle: "Heirloom Bridal Anarkalis & Pret",
		href: "/category/pakistani-couture",
		image: photo("1747847471517-952a3eb93a89"),
	},
	{
		name: "Evening Noir",
		subtitle: "Monochrome Reception Silhouettes",
		href: "/collection/evening-noir",
		image: photo("1772474528936-4f1187eb1611"),
	},
];

export function CategoryTiles({
	title = "Explore Our World of Style",
	text = "Handcrafted for Unforgettable Entrances",
	tiles = categoryTiles,
	renderImage,
}: {
	title?: string;
	text?: string;
	tiles?: typeof categoryTiles;
	renderImage?: (src: string, alt: string) => React.ReactNode;
} = {}) {
	return (
		<section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-12 sm:py-20">
			<div className="mb-8 text-center sm:mb-12">
				<h2 className="text-3xl sm:text-4xl font-medium tracking-tight">{title}</h2>
				<p className="mt-3 text-muted-foreground">{text}</p>
			</div>
			<div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
				{tiles.map((tile) => (
					<Link key={tile.href} href={tile.href} className="group block min-w-0">
						<div className="relative aspect-3/4 overflow-hidden bg-secondary">
							{renderImage ? (
								renderImage(tile.image, tile.name)
							) : (
								<Image
									src={tile.image}
									alt=""
									fill
									sizes="(min-width: 1024px) 25vw, 50vw"
									className="object-cover"
								/>
							)}
						</div>
						<h3 className="mt-4 text-sm font-semibold leading-6 group-hover:underline sm:text-base">
							{tile.name}
						</h3>
						<p className="mt-1 text-xs leading-5 text-muted-foreground sm:text-sm">{tile.subtitle}</p>
						<span className="mt-3 inline-flex min-h-6 items-center text-xs underline underline-offset-4">
							VIEW COLLECTION
						</span>
					</Link>
				))}
			</div>
		</section>
	);
}

export function GoldenHourFeature({
	title,
	text,
	image,
	secondaryImage,
	ctaLabel = "SHOP THE CAPSULE",
	ctaHref = "/collection/golden-hour",
}: SectionProps = {}) {
	return (
		<section id="golden-hour" className="reference-editorial reference-editorial-collage bg-muted/50">
			<div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-12 sm:px-8 md:grid-cols-2 md:gap-12 md:py-16 lg:px-12">
				<div className="relative aspect-[1.35]">
					<div
						className={`absolute top-0 left-0 overflow-hidden ${secondaryImage ? "bottom-8 w-[55%]" : "bottom-0 w-full"}`}
					>
						{image ?? (
							<Image
								src={photo("1733470324488-d0e10d014d80")}
								alt="The Golden Hour Collection"
								fill
								sizes="50vw"
								className="object-cover"
							/>
						)}
					</div>
					{secondaryImage && (
						<div className="absolute inset-y-8 right-0 w-[52%] translate-y-4 overflow-hidden">
							{secondaryImage}
						</div>
					)}
				</div>
				<div className="mx-auto max-w-md text-center">
					<h2>{title ?? "The Golden Hour Collection."}</h2>
					<p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
						{text ??
							"Sculpted in pure double-faced georgette silk and metallic gold zardozi for intimate ceremonies and receptions."}
					</p>
					<Button
						asChild
						className="mt-6 h-10 rounded-none bg-foreground px-6 text-[11px] font-normal tracking-wide text-background hover:bg-foreground/85"
					>
						<a href={ctaHref}>{ctaLabel}</a>
					</Button>
				</div>
			</div>
		</section>
	);
}

const pillars = [
	{
		title: "100% Certified Authentic",
		description:
			"Hallmarked 18K solid gold, VVS1 diamonds & pure Japanese silks with gemological valuation certificates.",
	},
	{
		title: "DHL Express Worldwide",
		description: "Complimentary insured courier on orders over $400. Delivered within 2–3 business days.",
	},
	{
		title: "14-Day Global Returns",
		description: "Complimentary return pickup from your doorstep with complete insurance protection.",
	},
	{
		title: "24/7 Styling Concierge",
		description: "Private styling advice, custom bridal measurements & bespoke order tracking anytime.",
	},
];

export function TrustPillars({ text }: { text?: string } = {}) {
	return (
		<section
			aria-label="Shopping with RINAZ"
			className="border-y border-border bg-background text-foreground"
		>
			<ul className="mx-auto grid max-w-7xl gap-x-8 gap-y-7 px-5 py-10 sm:grid-cols-2 sm:px-8 lg:grid-cols-4 lg:gap-x-10 lg:px-12 lg:py-14">
				{pillars.map((pillar, index) => (
					<li key={text?.split("\n")[index] ?? pillar.title}>
						<h3 className="text-sm font-semibold leading-6">{text?.split("\n")[index] ?? pillar.title}</h3>
						<p className="mt-2 max-w-[34ch] text-sm leading-6 text-muted-foreground">{pillar.description}</p>
					</li>
				))}
			</ul>
		</section>
	);
}

const lookPieces = [
	{
		name: "Blush Silk Embroidered Open Abaya",
		image: photo("1760083545495-b297b1690672"),
		price: 68000,
		href: "/product/blush-silk-embroidered-open-abaya",
	},
	{
		name: "The Gilded Teardrop Diamond Pendant",
		image: photo("1773832190768-b4c4667ceeb4"),
		price: 145000,
		href: "/product/the-gilded-teardrop-diamond-pendant",
	},
	{
		name: "Graceful Adornment Pearl & Gold Choker",
		image: photo("1654699991520-aaaf4dd2608b"),
		price: 98000,
		href: "/product/graceful-adornment-pearl-gold-choker",
	},
];

export function CompleteTheLook({
	title = "Curated Adornments & Pairings",
	text,
	image,
	pieces = lookPieces,
	ctaLabel = "SHOP THE LOOK",
	ctaHref,
}: SectionProps & {
	pieces?: { name: string; price: number; href: string; image?: string }[];
	renderPieceImage?: (src: string, alt: string) => React.ReactNode;
} = {}) {
	return (
		<section
			id="curated-pairings"
			className="reference-editorial mx-auto grid max-w-7xl items-center gap-10 px-5 py-12 sm:px-8 md:grid-cols-2 md:gap-12 md:py-16 lg:px-12"
		>
			<div className="relative aspect-[3/5] overflow-hidden bg-secondary">
				{image ?? (
					<Image
						src={photo("1736342182642-e2042084f47c")}
						alt="The signature Blush Silk Open Abaya styled with fine jewelry"
						fill
						sizes="(min-width: 1024px) 50vw, 100vw"
						className="object-cover"
					/>
				)}
			</div>
			<div className="mx-auto max-w-md text-center">
				<h2>{title}</h2>
				<p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
					{text ??
						"Style the signature Blush Silk Open Abaya with hallmarked 18K solid gold and South Sea pearls for an effortless, elevated entrance."}
				</p>
				<Button
					asChild
					variant="outline"
					className="mt-6 h-10 rounded-none border-foreground/60 px-6 text-[11px] font-normal tracking-wide"
				>
					<a href={ctaHref || pieces[0]?.href || "/products"}>{ctaLabel}</a>
				</Button>
			</div>
		</section>
	);
}

const sanctuaries = [
	{ city: "London", place: "Knightsbridge & Bond Street (Mayfair)" },
	{ city: "Dubai", place: "Fashion Avenue & D3 Design District" },
	{ city: "Doha", place: "Private Suite" },
	{ city: "Lahore", place: "Gulberg Atelier" },
];

const services = [
	"Private 1-on-1 Bridal Consultations",
	"Certified 18K Solid Gold & Diamond Viewings",
	"Custom Bridal Sizing & Hem Tailoring",
];

export function BridalSanctuary({
	title = "An intimate private bridal consultation.",
	text,
	ctaLabel = "EXPLORE BRIDAL COUTURE",
	ctaHref = "/contact",
}: SectionProps = {}) {
	return (
		<section id="sanctuary" className="scroll-mt-20 bg-secondary/40">
			<div className="max-w-7xl mx-auto grid items-center gap-10 px-5 py-12 sm:gap-12 sm:px-6 sm:py-20 md:grid-cols-2 lg:px-8">
				<div className="min-w-0 text-center">
					<h2 className="font-sans text-3xl sm:text-4xl font-bold leading-tight break-words">{title}</h2>
					<p className="mt-3 text-muted-foreground">
						{text?.split("\n")[0] ?? "Custom fittings tailored for your sacred day"}
					</p>
					<p className="mt-6 text-lg leading-relaxed text-muted-foreground">
						{text?.split("\n").slice(1).join("\n") ??
							"Step inside the RINAZ Studio bridal sanctuary. From bespoke made-to-measure Anarkalis to private 18K fine jewelry styling, experience an unforgettable bridal journey."}
					</p>
					<ul className="mt-6 space-y-2">
						{services.map((service) => (
							<li key={service} className="text-sm leading-6">
								{service}
							</li>
						))}
					</ul>
					<Button
						asChild
						variant="outline"
						className="mt-7 h-auto min-h-12 max-w-full whitespace-normal rounded-none border-foreground px-7 py-3 font-semibold"
					>
						<Link href={ctaHref}>{ctaLabel}</Link>
					</Button>
				</div>
				<div className="grid grid-cols-2 content-center gap-3 sm:gap-6">
					{sanctuaries.map((s) => (
						<div key={s.city} className="border-t border-border py-5 text-center">
							<h3 className="text-sm font-semibold">{s.city}</h3>
							<p className="mt-2 text-sm leading-6 text-muted-foreground">{s.place}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
