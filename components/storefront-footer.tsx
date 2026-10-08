import Image from "next/image";
import Link from "next/link";

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

export function FooterContent({
	year,
	legalPages,
	text,
	links,
}: {
	year: number;
	legalPages: React.ReactNode;
	text?: string;
	links?: { id: string; label: string; href: string }[];
}) {
	return (
		<footer id="preview-footer" className="border-t border-border bg-background">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-2 gap-x-6 gap-y-10 py-12 sm:py-16 lg:grid-cols-5">
					<div className="col-span-2 lg:max-w-sm">
						<Link
							href="/"
							className="group inline-flex items-center transition-opacity hover:opacity-90"
							aria-label="RINAZ STUDIO Home"
						>
							<Image
								src="/brand/rinaz-side-side-v3.png"
								alt="RINAZ STUDIO"
								width={2172}
								height={724}
								className="h-10 w-auto object-contain"
							/>
						</Link>

						<p className="mt-3 text-sm text-muted-foreground leading-relaxed">
							{text ??
								"Handcrafted couture Abayas, certified 18K solid gold fine jewelry, and bespoke Pakistani bridal couture crafted for the modern you."}
						</p>
						<p className="mt-5 text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
							PREMIUM QUALITY · MODERN ELEGANCE · TIMELESS FASHION · CONFIDENCE · YOU
						</p>
					</div>

					{(links ? [{ title: "Client Concierge", links }] : directories).map((directory) => (
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

					{legalPages}
				</div>

				<div className="grid grid-cols-1 items-center gap-4 border-t border-border py-6 text-xs text-muted-foreground lg:grid-cols-3">
					<p className="text-center tracking-widest lg:text-left">
						&copy; {year} RINAZ STUDIO. ALL RIGHTS RESERVED.
					</p>

					<p className="text-center">
						Designed and developed by{" "}
						<a
							href="https://qadmastechnologies.com/"
							target="_blank"
							rel="noopener noreferrer"
							className="font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-primary hover:decoration-foreground"
						>
							Qadmas Technologies
						</a>
					</p>

					<div className="flex items-center justify-center gap-4 lg:justify-end">
						<Link href="/privacy-policy" className="transition-colors hover:text-foreground">
							Privacy Policy
						</Link>
						<span className="text-border" aria-hidden="true">
							·
						</span>
						<Link href="/terms-of-service" className="transition-colors hover:text-foreground">
							Terms of Service
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}
