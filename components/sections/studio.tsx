import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Price } from "@/components/currency";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type SectionProps = {
	title?: string;
	text?: string;
	image?: React.ReactNode;
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
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-24">
			<div className="mb-8 text-center sm:mb-12">
				<h2 className="text-3xl sm:text-4xl font-medium tracking-tight">{title}</h2>
				<p className="mt-3 italic text-muted-foreground">{text}</p>
			</div>
			<div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
				{tiles.map((tile) => (
					<Card key={tile.href} className="group relative gap-0 overflow-hidden rounded-2xl border-0 py-0">
						<Link href={tile.href} className="relative block aspect-3/4 bg-secondary">
							{renderImage ? (
								renderImage(tile.image, tile.name)
							) : (
								<Image
									src={tile.image}
									alt=""
									fill
									sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
									className="object-cover transition-transform duration-500 group-hover:scale-105"
								/>
							)}
							<span className="absolute inset-0 bg-linear-to-t from-black/75 via-black/10 to-transparent" />
							<CardHeader className="absolute inset-x-0 bottom-0 gap-1 p-3 text-white sm:p-5">
								<CardTitle className="text-xs font-medium tracking-wide uppercase sm:text-lg">
									{tile.name}
								</CardTitle>
								<CardDescription className="hidden text-white/85 sm:block">{tile.subtitle}</CardDescription>
								<span className="mt-2 hidden items-center gap-1 text-xs font-medium tracking-widest sm:inline-flex">
									VIEW COLLECTION <ArrowRightIcon className="h-3 w-3" />
								</span>
							</CardHeader>
						</Link>
					</Card>
				))}
			</div>
		</section>
	);
}

export function GoldenHourFeature({
	title,
	text,
	image,
	ctaLabel = "SHOP THE CAPSULE",
	ctaHref = "/collection/golden-hour",
}: SectionProps = {}) {
	return (
		<section id="golden-hour" className="bg-background text-foreground">
			<div className="mx-auto grid max-w-7xl grid-cols-1 md:grid-cols-2">
				<div className="relative aspect-4/5 overflow-hidden">
					{image ?? (
						<Image
							src={photo("1733470324488-d0e10d014d80")}
							alt="Bridal couture from The Golden Hour Collection"
							fill
							sizes="(min-width: 1280px) 640px, (min-width: 768px) 50vw, 100vw"
							className="object-cover object-[center_35%]"
						/>
					)}
				</div>
				<div className="flex min-w-0 flex-col justify-center px-6 py-12 sm:px-10 md:px-12 lg:px-16 lg:py-20">
					<h2 className="max-w-[12ch] text-[clamp(2.5rem,4.8vw,4.5rem)] leading-[1.08] tracking-[-0.03em] break-words text-balance">
						{title ?? "The Golden Hour Collection."}
					</h2>
					<p className="mt-6 max-w-[34ch] text-base leading-7 text-muted-foreground lg:mt-8 lg:text-lg lg:leading-8">
						{text ??
							"Sculpted in pure double-faced georgette silk and metallic gold zardozi for intimate ceremonies and receptions."}
					</p>
					<a
						href={ctaHref}
						className="group mt-8 flex min-h-12 w-fit max-w-full items-center justify-between gap-5 border-b border-foreground pb-1 text-sm font-medium tracking-wide transition-colors hover:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground lg:mt-12 lg:gap-10"
					>
						{ctaLabel}
						<ArrowRightIcon
							aria-hidden="true"
							className="size-5 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transform-none motion-reduce:transition-none"
						/>
					</a>
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
		<section aria-label="Shopping with RINAZ" className="bg-background text-foreground">
			<ul className="mx-auto grid max-w-7xl gap-x-8 gap-y-7 px-5 py-10 sm:grid-cols-2 sm:px-8 lg:grid-cols-4 lg:gap-x-10 lg:px-12 lg:py-14">
				{pillars.map((pillar, index) => (
					<li key={text?.split("\n")[index] ?? pillar.title} className="border-t border-border pt-4">
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
	renderPieceImage,
}: SectionProps & {
	pieces?: { name: string; price: number; href: string; image?: string }[];
	renderPieceImage?: (src: string, alt: string) => React.ReactNode;
} = {}) {
	return (
		<section
			id="curated-pairings"
			className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-12 lg:gap-x-12 lg:gap-y-8 lg:px-12 lg:py-28"
		>
			<div className="min-w-0 lg:col-span-5 lg:col-start-1 lg:row-start-1 lg:self-end">
				<h2 className="max-w-[15ch] text-[clamp(2rem,3.6vw,3.5rem)] leading-[1.12] tracking-[-0.025em] break-words text-balance">
					{title}
				</h2>
				<p className="mt-5 max-w-[44ch] text-base leading-7 text-muted-foreground">
					{text ??
						"Style the signature Blush Silk Open Abaya with hallmarked 18K solid gold and South Sea pearls for an effortless, elevated entrance."}
				</p>
			</div>
			<div className="relative aspect-4/5 overflow-hidden bg-secondary lg:col-span-6 lg:col-start-7 lg:row-span-2 lg:row-start-1">
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
			<div className="min-w-0 lg:col-span-5 lg:col-start-1 lg:row-start-2">
				<ul className="divide-y divide-border border-y border-border">
					{pieces.map((piece) => (
						<li key={piece.href}>
							<Link
								href={piece.href}
								className={`group grid min-h-16 items-center gap-x-3 gap-y-1 py-4 transition-colors hover:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring sm:gap-4 ${piece.image ? "grid-cols-[auto_minmax(0,1fr)] sm:grid-cols-[auto_minmax(0,1fr)_auto]" : "grid-cols-1 sm:grid-cols-[minmax(0,1fr)_auto]"}`}
							>
								{piece.image && (
									<span className="relative row-span-2 h-20 w-14 overflow-hidden bg-secondary sm:row-span-1 sm:h-24 sm:w-18">
										{renderPieceImage ? (
											renderPieceImage(piece.image, piece.name)
										) : (
											<Image
												src={piece.image}
												alt=""
												fill
												sizes="72px"
												className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none"
											/>
										)}
									</span>
								)}
								<span className="text-sm font-medium leading-6 break-words">{piece.name}</span>
								<span
									className={`whitespace-nowrap text-sm tabular-nums sm:col-auto ${piece.image ? "col-start-2" : "col-start-1"}`}
								>
									<Price amount={piece.price} />
								</span>
							</Link>
						</li>
					))}
				</ul>
				<p className="mt-5 flex flex-wrap items-baseline justify-between gap-2 text-sm text-muted-foreground">
					<span>Complete look</span>
					<span className="text-lg font-medium tabular-nums text-foreground">
						<Price amount={pieces.reduce((sum, p) => sum + p.price, 0)} />
					</span>
				</p>
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
			<div className="max-w-7xl mx-auto grid gap-10 px-4 py-12 sm:gap-12 sm:px-6 sm:py-24 lg:grid-cols-2 lg:px-8">
				<div>
					<h2 className="text-3xl sm:text-4xl font-medium tracking-tight">{title}</h2>
					<p className="mt-3 italic text-muted-foreground">
						{text?.split("\n")[0] ?? "Custom fittings tailored for your sacred day"}
					</p>
					<p className="mt-6 text-lg leading-relaxed text-muted-foreground">
						{text?.split("\n").slice(1).join("\n") ??
							"Step inside the RINAZ Studio bridal sanctuary. From bespoke made-to-measure Anarkalis to private 18K fine jewelry styling, experience an unforgettable bridal journey."}
					</p>
					<ul className="mt-6 space-y-2">
						{services.map((service) => (
							<li key={service} className="flex gap-3 text-sm">
								<span aria-hidden className="text-muted-foreground">
									✦
								</span>
								{service}
							</li>
						))}
					</ul>
					<Button asChild size="lg" className="mt-10 h-12 rounded-full px-8 tracking-widest">
						<Link href={ctaHref}>
							{ctaLabel}
							<ArrowRightIcon />
						</Link>
					</Button>
				</div>
				<div className="grid grid-cols-2 content-center gap-3 sm:gap-6">
					{sanctuaries.map((s) => (
						<Card key={s.city} className="rounded-2xl">
							<CardHeader>
								<CardTitle className="text-sm font-medium tracking-widest uppercase">{s.city}</CardTitle>
								<CardDescription>{s.place}</CardDescription>
							</CardHeader>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
}
