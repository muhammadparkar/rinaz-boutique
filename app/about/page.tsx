import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getStoreSeo, meGetCached } from "@/lib/commerce";
import { JsonLdScript } from "@/lib/json-ld";

export async function generateMetadata(): Promise<Metadata> {
	const { storeName, storeDescription } = await getStoreSeo();
	const description = storeDescription
		? `Learn more about ${storeName}. ${storeDescription}`
		: `Learn about ${storeName} — our story, our values, and the people behind the products.`;

	return {
		title: "About Us",
		description,
		alternates: { canonical: "/about" },
		openGraph: {
			type: "website",
			title: "About Us",
			description,
			url: "/about",
		},
	};
}

async function getStoreInfo() {
	try {
		const me = await meGetCached();
		return {
			storeName: me.store.name || "our store",
			storeDescription: me.store.settings?.storeDescription || null,
			contactFormEnabled: me.store.settings?.enabledTools?.contactForm ?? false,
		};
	} catch {
		return { storeName: "our store", storeDescription: null, contactFormEnabled: false };
	}
}

export default async function AboutPage() {
	"use cache";
	cacheLife("hours");

	const { storeName, storeDescription, contactFormEnabled } = await getStoreInfo();

	const aboutJsonLd = {
		"@context": "https://schema.org",
		"@type": "AboutPage",
		name: `About ${storeName}`,
		description:
			storeDescription ?? "Learn about our story, our values, and the people behind the products we make.",
	};

	return (
		<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
			<JsonLdScript data={aboutJsonLd} />

			{/* Header */}
			<div className="mb-10">
				<Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
					Home
				</Link>
				<span className="mx-2 text-muted-foreground">/</span>
				<span className="text-sm">About Us</span>
				<h1 className="mt-4 text-4xl font-medium tracking-tight">About Us</h1>
				{storeDescription && <p className="mt-3 text-lg text-muted-foreground">{storeDescription}</p>}
			</div>

			{/* Story */}
			<div className="space-y-12">
				<section>
					<h2 className="text-2xl font-medium tracking-tight mb-4">Simple. Memorable. Meaningful.</h2>
					<p className="text-muted-foreground leading-relaxed">
						Every curve of the RINAZ mark is rooted in modesty, craftsmanship, and cultural pride.
					</p>
				</section>

				<AboutList title="The Story Behind the Icon" items={monogram} />
				<AboutList title="The 4 Pillars of RINAZ" items={pillars} />

				<section>
					<h2 className="text-2xl font-medium tracking-tight mb-4">Atelier Savoir-Faire</h2>
					<p className="mb-6 text-muted-foreground leading-relaxed">
						480 GSM Japanese double-weave pure silk developed in the Bishu district of Japan, bonded with
						Italian cupro silk and secured with laser-etched palladium titanium clasps.
					</p>
					<AboutGrid items={savoirFaire} />
				</section>
			</div>

			{/* CTA */}
			<div className="mt-16 rounded-lg border border-border bg-secondary/30 p-8 text-center">
				<h2 className="text-2xl font-medium tracking-tight">Want to learn more?</h2>
				<p className="mt-2 text-muted-foreground">
					Explore the collections or book a private consultation with our styling concierge.
				</p>
				<div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
					<Button asChild size="lg" className="h-11 rounded-full px-8">
						<Link href="/products">Shop collections</Link>
					</Button>
					{contactFormEnabled && (
						<Button asChild size="lg" variant="outline" className="h-11 rounded-full px-8">
							<Link href="/contact">Book a consultation</Link>
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}

const monogram = [
	{
		title: "Cultural Form",
		body: 'The letter "R" sculpted with the flowing curve of a modest silk drape and hijab, representing dignity and heritage.',
	},
	{
		title: "Modern Sparkle",
		body: "A 4-point diamond star denoting modern ambition, brilliance, certified 18K gold purity, and luminous beauty.",
	},
	{
		title: "Elegance & Grace",
		body: "The crown: a harmonious unity of cultural identity and contemporary haute couture fashion that feels elevated across London and the Gulf.",
	},
];

const pillars = [
	{
		title: "Cultural Respect",
		body: "Honoring Islamic modest heritage and South Asian craft traditions with graceful contemporary refinement.",
	},
	{
		title: "Premium Craftsmanship",
		body: "100+ hours of artisan needlework, certified 18K solid gold, VVS1 diamonds, and pure Korean silks.",
	},
	{
		title: "Timeless Beauty",
		body: "Silhouettes designed to transcend fleeting seasons and become treasured generational heirlooms.",
	},
	{
		title: "Empowered Style",
		body: "Celebrating confidence and modesty through structured drapes, fluid silk falls, and majestic fits.",
	},
];

const savoirFaire = [
	{
		title: "Zero-Waste Patterning",
		body: "Mathematical pattern layouts achieving 94% textile utilization, converting selvedge edges into kinetic architectural drapes.",
	},
	{
		title: "Numbered Editions",
		body: "Never mass-produced. Each piece carries an embossed gold plaque indicating its unique edition number and hand-signed master cutter certificate.",
	},
	{
		title: "White-Glove Delivery",
		body: "Custom archival presentation boxes with velvet dust bags delivered via insured DHL Express worldwide courier.",
	},
];

type AboutItem = { title: string; body: string };

function AboutGrid({ items }: { items: AboutItem[] }) {
	return (
		<div className="grid gap-6 sm:grid-cols-2">
			{items.map((item) => (
				<Card key={item.title}>
					<CardHeader>
						<CardTitle className="text-base font-medium">{item.title}</CardTitle>
						<CardDescription className="leading-relaxed">{item.body}</CardDescription>
					</CardHeader>
				</Card>
			))}
		</div>
	);
}

function AboutList({ title, items }: { title: string; items: AboutItem[] }) {
	return (
		<section>
			<h2 className="text-2xl font-medium tracking-tight mb-6">{title}</h2>
			<AboutGrid items={items} />
		</section>
	);
}
