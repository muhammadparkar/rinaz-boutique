import Image from "next/image";
import Link from "next/link";
import { FooterNewsletter } from "@/components/footer-newsletter";
import { storefrontNavigation } from "@/lib/storefront-navigation";

const directories = [
	{
		title: "Collections",
		links: storefrontNavigation,
	},
	{
		title: "About RINAZ",
		links: [
			{ label: "About the studio", href: "/about" },
			{ label: "Journal", href: "/blog" },
			{ label: "Contact us", href: "/contact" },
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
				<div className="grid gap-x-12 gap-y-12 py-12 sm:py-16 lg:grid-cols-12 lg:gap-x-16 lg:py-20">
					<div className="space-y-7 lg:col-span-5">
						<div>
							<Link
								href="/"
								className="group inline-flex items-center transition-opacity hover:opacity-90"
								aria-label="RINAZ STUDIO Home"
							>
								<Image
									src="/brand/rinaz-v3.png"
									alt="RINAZ STUDIO"
									width={1220}
									height={361}
									className="h-10 w-auto object-contain"
								/>
							</Link>
						</div>

						<FooterNewsletter description={text} />
					</div>

					<div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:col-span-7 lg:gap-x-10">
						{directories.map((directory) => (
							<div key={directory.title} className="pt-1">
								<h3 className="mb-5 text-base font-medium">{directory.title}</h3>
								<ul className="space-y-3">
									{(directory.title === "Client Concierge" && links?.length ? links : directory.links)
										.filter(
											(link) =>
												!(["about the studio", "privacy policy", "terms of service"] as string[]).includes(
													link.label.toLowerCase(),
												),
										)
										.map((link) => (
											<li key={link.label}>
												<a
													href={link.href}
													className="text-sm text-muted-foreground hover:text-foreground transition-colors"
												>
													{link.label}
												</a>
											</li>
										))}
								</ul>
							</div>
						))}
					</div>
				</div>

				<div className="flex flex-col gap-5 py-6 text-xs text-muted-foreground lg:flex-row lg:items-center lg:justify-between">
					<p className="text-left">&copy; {year} RINAZ STUDIO. ALL RIGHTS RESERVED.</p>

					<p className="text-left">
						Designed and developed by{" "}
						<a
							href="https://qadmastechnologies.com/"
							target="_blank"
							rel="noopener noreferrer"
							className="font-semibold text-inherit underline underline-offset-4"
						>
							Qadmas Technologies
						</a>
					</p>

					<div className="flex flex-wrap items-center gap-x-5 gap-y-3">
						<Link href="/privacy-policy" className="transition-colors hover:text-foreground">
							Privacy Policy
						</Link>
						<span className="text-border" aria-hidden="true">
							·
						</span>
						<Link href="/terms-of-service" className="transition-colors hover:text-foreground">
							Terms of Service
						</Link>
						{legalPages}
					</div>
				</div>
			</div>
		</footer>
	);
}
