"use client";

import { Menu, Monitor, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { CurrencySelect } from "@/components/currency";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export type NavLink = {
	href: string;
	label: string;
};

export function Navbar({ links }: { links: NavLink[] }) {
	const [open, setOpen] = useState(false);

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<button
					type="button"
					aria-label="Open menu"
					className="-order-1 rounded-full p-2 transition-colors hover:bg-secondary xl:hidden"
				>
					<Menu className="h-6 w-6" />
				</button>
			</SheetTrigger>
			<SheetContent side="left" className="gap-0 overflow-y-auto p-6">
				<SheetTitle className="sr-only">Menu</SheetTitle>
				<nav className="mt-10 flex flex-col gap-1">
					{links.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							onClick={() => setOpen(false)}
							className="rounded-lg px-3 py-3 text-base font-medium text-foreground transition-colors hover:bg-secondary"
						>
							{link.label}
						</Link>
					))}
				</nav>
				<div className="mt-6 flex items-center justify-between border-t border-border px-3 pt-6">
					<span className="text-sm text-muted-foreground">Currency</span>
					<CurrencySelect className="border" />
				</div>
				<div className="mt-4 flex items-center justify-between px-3">
					<span className="text-sm text-muted-foreground">Theme</span>
					<ThemeSwitch />
				</div>
			</SheetContent>
		</Sheet>
	);
}

// Hidden while the page sits at the top; slides down from under the header once the shopper
// scrolls or tabs into it. It hangs below the sticky header (absolute), so revealing it never
// shifts the page.
const themes = [
	{ value: "light", label: "Light", icon: Sun },
	{ value: "dark", label: "Dark", icon: Moon },
	{ value: "system", label: "System", icon: Monitor },
] as const;

// Segmented light/dark/system control for the phone menu. The menu only mounts on the client,
// after next-themes has read the stored theme, so the active state never mismatches hydration.
function ThemeSwitch() {
	const { theme, setTheme } = useTheme();
	return (
		<div className="flex rounded-full border border-border p-0.5">
			{themes.map(({ value, label, icon: Icon }) => (
				<button
					key={value}
					type="button"
					aria-pressed={theme === value}
					aria-label={`${label} theme`}
					onClick={() => setTheme(value)}
					className={cn(
						"grid size-8 place-items-center rounded-full text-muted-foreground transition-colors hover:text-foreground",
						theme === value && "bg-secondary text-foreground",
					)}
				>
					<Icon className="size-4" />
				</button>
			))}
		</div>
	);
}

export function DesktopNav({ links }: { links: NavLink[] }) {
	const [revealed, setRevealed] = useState(false);

	useEffect(() => {
		const onScroll = () => setRevealed(window.scrollY > 40);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	return (
		<nav
			aria-label="Collections"
			className={cn(
				"absolute inset-x-0 top-full -z-10 hidden h-11 items-center justify-center gap-8 border-b border-border bg-background/90 backdrop-blur-md transition-[translate,opacity] duration-500 ease-out-expo xl:flex",
				revealed
					? "translate-y-0 opacity-100"
					: "-translate-y-full opacity-0 focus-within:translate-y-0 focus-within:opacity-100",
			)}
		>
			{links.map((link) => (
				<Link
					key={link.href}
					href={link.href}
					className="text-xs font-medium tracking-widest text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
				>
					{link.label}
				</Link>
			))}
		</nav>
	);
}
