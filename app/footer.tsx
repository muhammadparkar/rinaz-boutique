import { cacheLife } from "next/cache";
import Link from "next/link";
import { commerce } from "@/lib/commerce";

async function FooterLegalPages() {
	"use cache";
	cacheLife("hours");

	const pages = await commerce.legalPageBrowse();

	if (pages.data.length === 0) {
		return null;
	}

	return (
		<div>
			<h3 className="text-sm font-semibold text-foreground">Legal</h3>
			<ul className="mt-4 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<Link
							href={`/legal${page.href}`}
							className="text-sm text-muted-foreground hover:text-foreground transition-colors"
						>
							{page.label}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}

// `new Date()` is an unstable value: now that the footer is part of the prerendered
// shell, reading it during the prerender is an error. Caching pins it to the entry.
async function getCopyrightYear() {
	"use cache";
	cacheLife("days");

	return new Date().getFullYear();
}

const directories = [
	{
		title: "Collections",
		links: [
			{ label: "Haute Open Abayas", href: "/category/haute-abayas" },
			{ label: "18K Fine Jewelry", href: "/category/fine-jewelry" },
			{ label: "Pakistani Formal Pret", href: "/category/pakistani-couture" },
			{ label: "Bridal Peshwas & Anarkalis", href: "/collection/bridal-pret" },
		],
	},
	{
		title: "Studio Sanctuaries",
		links: [
			{ label: "London (Knightsbridge)", href: "/#sanctuary" },
			{ label: "Dubai (Fashion Avenue)", href: "/#sanctuary" },
			{ label: "Lahore (Gulberg Atelier)", href: "/#sanctuary" },
			{ label: "Doha (Private Suite)", href: "/#sanctuary" },
		],
	},
	{
		title: "Client Concierge",
		links: [
			{ label: "Bespoke Bridal Consultations", href: "/contact" },
			{ label: "Custom Measurement Service", href: "/faq#sizing" },
			{ label: "Insured Express Courier", href: "/faq#shipping" },
			{ label: "Gift Box Packaging", href: "/faq#packaging" },
			{ label: "About the Studio", href: "/about" },
		],
	},
];

export async function Footer() {
	const year = await getCopyrightYear();

	return (
		<footer className="border-t border-border bg-background">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-2 gap-x-6 gap-y-10 py-12 sm:py-16 lg:grid-cols-5">
					<div className="col-span-2 lg:max-w-sm">
						<Link href="/" className="text-lg font-semibold tracking-[0.25em] text-foreground">
							RINAZ STUDIO
						</Link>
						<p className="mt-4 text-sm text-muted-foreground leading-relaxed">
							Graceful adornments, timeless fashion. Handcrafted couture Abayas, certified 18K solid gold fine
							jewelry, and bespoke Pakistani bridal couture.
						</p>
						<p className="mt-6 text-xs tracking-widest text-muted-foreground">
							CULTURAL RESPECT · PREMIUM CRAFTSMANSHIP · TIMELESS BEAUTY · EMPOWERED STYLE
						</p>
					</div>

					{directories.map((directory) => (
						<div key={directory.title}>
							<h3 className="text-sm font-semibold text-foreground">{directory.title}</h3>
							<ul className="mt-4 space-y-3">
								{directory.links.map((link) => (
									<li key={link.label}>
										<Link
											href={link.href}
											className="text-sm text-muted-foreground hover:text-foreground transition-colors"
										>
											{link.label}
										</Link>
									</li>
								))}
							</ul>
						</div>
					))}

					<FooterLegalPages />
				</div>

				<div className="py-6 border-t border-border">
					<p className="text-xs tracking-widest text-muted-foreground">
						&copy; {year} RINAZ STUDIO. ALL RIGHTS RESERVED.
					</p>
				</div>
			</div>
		</footer>
	);
}
