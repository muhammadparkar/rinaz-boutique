import { UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { CartButton } from "@/app/cart-button";
import { DesktopNav, Navbar, type NavLink } from "@/app/navbar";
import { CurrencySelect } from "@/components/currency";
import { SearchInput } from "@/components/search/search-input";
import { ThemeToggle } from "@/components/theme-toggle";

export const navLinks: NavLink[] = [
	{ href: "/collection/new-in", label: "NEW IN" },
	{ href: "/category/haute-abayas", label: "HAUTE ABAYAS" },
	{ href: "/category/fine-jewelry", label: "18K FINE JEWELRY" },
	{ href: "/category/pakistani-couture", label: "PAKISTANI COUTURE" },
	{ href: "/collection/bridal-pret", label: "BRIDAL PRET" },
	{ href: "/contact", label: "STUDIO SANCTUARY" },
];

export function StorefrontHeader({ links = navLinks }: { links?: NavLink[] }) {
	return (
		<header
			id="preview-header"
			className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md"
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="relative flex items-center justify-between h-16">
					<div className="flex items-center gap-3">
						<Link
							href="/"
							className="group flex items-center transition-opacity hover:opacity-90"
							aria-label="RINAZ STUDIO Home"
						>
							<Image
								src="/brand/rinaz-v3.png"
								alt="RINAZ STUDIO"
								width={1220}
								height={361}
								sizes="(min-width: 640px) 120px, 100px"
								className="h-7 w-auto object-contain sm:h-8"
							/>
						</Link>
						<Navbar links={links} />
					</div>
					<div className="flex items-center sm:gap-2">
						<CurrencySelect className="hidden sm:flex" />
						<Suspense>
							<SearchInput />
						</Suspense>
						{/* Phones follow the system theme; the toggle frees header room from sm up. */}
						<div className="hidden sm:contents">
							<ThemeToggle />
						</div>
						{/* Plain <a>: /account is a proxied zone — soft navigation 500s (see AGENTS.md).
									    Static on purpose: reading the session here would pull the header out of the
									    prerendered shell. Guests get the sign-in flow, shoppers land on the dashboard. */}
						<a
							href="/account"
							className="grid min-h-11 min-w-11 place-items-center p-2 hover:bg-secondary transition-colors"
							aria-label="Account"
						>
							<UserRound className="w-5 h-5" />
						</a>
						<CartButton />
					</div>
				</div>
			</div>
			<DesktopNav links={links} />
		</header>
	);
}
