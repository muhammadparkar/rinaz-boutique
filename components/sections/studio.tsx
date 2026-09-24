import { ArrowRightIcon, Clock, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Price } from "@/components/currency";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const photo = (id: string) => `https://images.unsplash.com/photo-${id}?w=1200&q=80&auto=format&fit=crop`;

const categoryTiles = [
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

export function CategoryTiles() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-24">
			<div className="mb-8 text-center sm:mb-12">
				<h2 className="text-3xl sm:text-4xl font-medium tracking-tight">Explore Our World of Style</h2>
				<p className="mt-3 italic text-muted-foreground">Handcrafted for Unforgettable Entrances</p>
			</div>
			<div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
				{categoryTiles.map((tile) => (
					<Card key={tile.href} className="group relative gap-0 overflow-hidden rounded-2xl border-0 py-0">
						<Link href={tile.href} className="relative block aspect-3/4 bg-secondary">
							<Image
								src={tile.image}
								alt=""
								fill
								sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
								className="object-cover transition-transform duration-500 group-hover:scale-105"
							/>
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

export function GoldenHourFeature() {
	return (
		<section className="bg-foreground text-background">
			<div className="max-w-7xl mx-auto grid items-center gap-8 px-4 py-12 sm:gap-10 sm:px-6 sm:py-24 lg:grid-cols-2 lg:px-8">
				<div className="relative aspect-square overflow-hidden rounded-2xl sm:aspect-4/5 lg:order-2">
					<Image
						src={photo("1733470324488-d0e10d014d80")}
						alt="Bridal couture from The Golden Hour Collection"
						fill
						sizes="(min-width: 1024px) 50vw, 100vw"
						className="object-cover"
					/>
				</div>
				<div>
					<h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight">
						<span className="italic font-normal">The Golden Hour</span> Collection.
					</h2>
					<p className="mt-6 max-w-md text-lg leading-relaxed text-background/70">
						Sculpted in pure double-faced georgette silk and metallic gold zardozi for intimate ceremonies and
						receptions.
					</p>
					<div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
						<Button
							asChild
							size="lg"
							className="h-12 rounded-full bg-background px-8 tracking-widest text-foreground hover:bg-background/90"
						>
							<Link href="/collection/golden-hour">
								SHOP THE CAPSULE
								<ArrowRightIcon />
							</Link>
						</Button>
						<Badge variant="outline" className="h-8 rounded-full border-background/30 px-3 text-background">
							<Truck /> Complimentary Express Delivery
						</Badge>
					</div>
				</div>
			</div>
		</section>
	);
}

const pillars = [
	{
		icon: ShieldCheck,
		title: "100% Certified Authentic",
		description:
			"Hallmarked 18K solid gold, VVS1 diamonds & pure Japanese silks with gemological valuation certificates.",
	},
	{
		icon: Truck,
		title: "DHL Express Worldwide",
		description: "Complimentary insured courier on orders over $400. Delivered within 2–3 business days.",
	},
	{
		icon: RotateCcw,
		title: "14-Day Global Returns",
		description: "Complimentary return pickup from your doorstep with complete insurance protection.",
	},
	{
		icon: Clock,
		title: "24/7 Styling Concierge",
		description: "Private styling advice, custom bridal measurements & bespoke order tracking anytime.",
	},
];

export function TrustPillars() {
	return (
		<section className="border-y border-border">
			<div className="max-w-7xl mx-auto grid grid-cols-2 gap-x-4 gap-y-8 px-4 py-10 sm:gap-10 sm:px-6 sm:py-14 lg:grid-cols-4 lg:px-8">
				{pillars.map((pillar) => (
					<Card
						key={pillar.title}
						className="items-center border-0 bg-transparent py-0 text-center shadow-none"
					>
						<CardHeader className="w-full justify-items-center gap-3 px-0">
							<pillar.icon className="h-6 w-6 text-muted-foreground" />
							<CardTitle className="text-xs font-medium tracking-wide uppercase sm:text-sm">
								{pillar.title}
							</CardTitle>
							<CardDescription className="text-xs leading-relaxed sm:text-sm">
								{pillar.description}
							</CardDescription>
						</CardHeader>
					</Card>
				))}
			</div>
		</section>
	);
}

const lookPieces = [
	{
		name: "Blush Silk Embroidered Open Abaya",
		price: 68000,
		href: "/product/blush-silk-embroidered-open-abaya",
	},
	{
		name: "The Gilded Teardrop Diamond Pendant",
		price: 145000,
		href: "/product/the-gilded-teardrop-diamond-pendant",
	},
	{
		name: "Graceful Adornment Pearl & Gold Choker",
		price: 98000,
		href: "/product/graceful-adornment-pearl-gold-choker",
	},
];

export function CompleteTheLook() {
	return (
		<section className="max-w-7xl mx-auto grid items-center gap-8 px-4 py-12 sm:gap-10 sm:px-6 sm:py-24 lg:grid-cols-2 lg:px-8">
			<div className="relative aspect-square overflow-hidden rounded-2xl bg-secondary sm:aspect-4/5">
				<Image
					src={photo("1736342182642-e2042084f47c")}
					alt="The signature Blush Silk Open Abaya styled with fine jewelry"
					fill
					sizes="(min-width: 1024px) 50vw, 100vw"
					className="object-cover"
				/>
			</div>
			<div>
				<h2 className="text-3xl sm:text-4xl font-medium tracking-tight">Curated Adornments & Pairings</h2>
				<p className="mt-4 text-lg leading-relaxed text-muted-foreground">
					Style the signature Blush Silk Open Abaya with hallmarked 18K solid gold and South Sea pearls for an
					effortless, elevated entrance.
				</p>
				<Card className="mt-8 gap-0 py-2">
					<CardContent className="px-4">
						<ol className="divide-y divide-border">
							{lookPieces.map((piece, index) => (
								<li key={piece.href}>
									<Link
										href={piece.href}
										className="flex items-center justify-between gap-4 py-4 transition-colors hover:text-muted-foreground"
									>
										<span className="flex items-baseline gap-4">
											<span className="text-xs tabular-nums text-muted-foreground">
												{String(index + 1).padStart(2, "0")}
											</span>
											<span className="font-medium">{piece.name}</span>
										</span>
										<span className="tabular-nums">
											<Price amount={piece.price} />
										</span>
									</Link>
								</li>
							))}
						</ol>
					</CardContent>
				</Card>
				<p className="mt-4 text-sm text-muted-foreground">
					Complete look:{" "}
					<span className="font-medium text-foreground">
						<Price amount={lookPieces.reduce((sum, p) => sum + p.price, 0)} />
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

export function BridalSanctuary() {
	return (
		<section id="sanctuary" className="scroll-mt-20 bg-secondary/40">
			<div className="max-w-7xl mx-auto grid gap-10 px-4 py-12 sm:gap-12 sm:px-6 sm:py-24 lg:grid-cols-2 lg:px-8">
				<div>
					<h2 className="text-3xl sm:text-4xl font-medium tracking-tight">
						An intimate private bridal consultation.
					</h2>
					<p className="mt-3 italic text-muted-foreground">Custom fittings tailored for your sacred day</p>
					<p className="mt-6 text-lg leading-relaxed text-muted-foreground">
						Step inside the RINAZ Studio bridal sanctuary. From bespoke made-to-measure Anarkalis to private
						18K fine jewelry styling, our appointments ensure an unforgettable wedding experience.
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
						<Link href="/contact">
							BOOK BRIDAL APPOINTMENT
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
