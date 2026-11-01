import { UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { CartButton } from "@/app/cart-button";
import { DesktopNav, Navbar, type NavLink } from "@/app/navbar";
import { CurrencySelect } from "@/components/currency";
import { SearchInput } from "@/components/search/search-input";
import { ThemeToggle } from "@/components/theme-toggle";
import { WishlistButton } from "@/components/wishlist";
import { storefrontNavigation } from "@/lib/storefront-navigation";

export const navLinks: NavLink[] = storefrontNavigation;

export function StorefrontHeader({ links = navLinks }: { links?: NavLink[] }) {
	const categoryLinks = links;
	return (
		<header id="preview-header" className="sticky top-0 z-50 border-b border-border bg-background">
			<div className="relative mx-auto grid max-w-[1600px] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center px-4 sm:px-6 xl:grid-cols-[minmax(0,1fr)_auto_248px] xl:px-8">
				<div className="col-start-1 row-start-1 flex h-[68px] min-w-0 items-center">
					<Navbar links={categoryLinks} />
					<Link
						href="/"
						className="absolute top-1/2 left-1/2 flex min-h-11 -translate-x-1/2 -translate-y-1/2 items-center"
						aria-label="RINAZ STUDIO Home"
					>
						<Image
							src="/brand/rinaz-v3.png"
							alt="RINAZ STUDIO"
							width={1220}
							height={361}
							sizes="(min-width: 640px) 112px, (min-width: 380px) 80px, 64px"
							className="h-auto w-16 object-contain min-[380px]:w-20 sm:w-28"
						/>
					</Link>
				</div>
				<div className="col-start-3 row-start-1 flex items-center justify-end [&>button]:size-10 [&>button]:min-h-10 [&>button]:min-w-10 max-[379px]:[&>button]:size-9 max-[379px]:[&>button]:min-h-9 max-[379px]:[&>button]:min-w-9 xl:[&>button]:size-9 xl:[&>button]:min-h-9 xl:[&>button]:min-w-9">
					<CurrencySelect iconOnly className="hidden sm:flex" />
					{/* Phones follow the system theme; the toggle frees header room from sm up. */}
					<div className="hidden sm:contents">
						<ThemeToggle />
					</div>
					{/* Plain <a>: /account is a proxied zone — soft navigation 500s (see AGENTS.md).
									    Static on purpose: reading the session here would pull the header out of the
									    prerendered shell. Guests get the sign-in flow, shoppers land on the dashboard. */}
					<a
						href="/account"
						className="hidden size-10 shrink-0 place-items-center p-2 transition-colors hover:bg-secondary sm:grid max-[379px]:size-9 xl:size-9"
						aria-label="Account"
					>
						<UserRound className="size-6" strokeWidth={1.25} />
					</a>
					<WishlistButton />
					<CartButton />
				</div>
				<div data-header-search className="col-start-1 row-start-1 ml-11 justify-self-start xl:ml-0 xl:w-56">
					<Suspense>
						<SearchInput />
					</Suspense>
				</div>
			</div>
			<div data-header-categories className="hidden h-14 border-t border-border xl:block">
				<DesktopNav links={categoryLinks} />
			</div>
		</header>
	);
}
