"use client";

import { Menu, Monitor, Moon, Sun, UserRound } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { CurrencySelect } from "@/components/currency";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export type NavLink = {
	href: string;
	label: string;
};

export function Navbar({ links }: { links: NavLink[] }) {
	const [open, setOpen] = useState(false);
	const menuRef = useRef<HTMLButtonElement>(null);
	useEffect(() => {
		const header = menuRef.current?.closest("header");
		if (!header) return;
		const update = () => {
			const scrolled = String(window.scrollY > 40);
			if (header.dataset.scrolled !== scrolled) header.dataset.scrolled = scrolled;
		};
		update();
		window.addEventListener("scroll", update, { passive: true });
		return () => {
			window.removeEventListener("scroll", update);
			delete header.dataset.scrolled;
		};
	}, []);

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<button
					ref={menuRef}
					type="button"
					aria-label="Open menu"
					className="grid min-h-11 min-w-11 place-items-center p-2 transition-colors hover:bg-secondary xl:hidden"
				>
					<Menu className="h-6 w-6" />
				</button>
			</SheetTrigger>
			<SheetContent side="left" className="gap-0 overflow-y-auto p-6">
				<SheetTitle className="sr-only">Menu</SheetTitle>
				<nav className="mt-6 flex flex-col gap-1">
					{links.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							onClick={() => setOpen(false)}
							className="rounded-lg px-3 py-3 font-[var(--font-storefront-body)] text-sm font-semibold uppercase tracking-[0.08em] text-foreground transition-colors hover:bg-secondary"
						>
							{link.label}
						</Link>
					))}
				</nav>
				<a
					href="/account"
					onClick={() => setOpen(false)}
					className="mt-5 flex min-h-11 items-center gap-3 border-t border-border px-3 pt-5 text-sm font-semibold text-foreground transition-colors hover:text-muted-foreground"
				>
					<UserRound className="size-5" aria-hidden="true" />
					Account
				</a>
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
		<fieldset className="grid shrink-0 grid-cols-3 gap-1 rounded-md border border-border p-1">
			<legend className="sr-only">Theme preference</legend>
			{themes.map(({ value, label, icon: Icon }) => (
				<button
					key={value}
					type="button"
					aria-pressed={theme === value}
					aria-label={`${label} theme`}
					onClick={() => setTheme(value)}
					className={cn(
						"grid size-9 shrink-0 place-items-center rounded-sm text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground",
						theme === value && "bg-secondary text-foreground",
					)}
				>
					<Icon className="size-4" aria-hidden="true" />
				</button>
			))}
		</fieldset>
	);
}

export function DesktopNav({ links }: { links: NavLink[] }) {
	return (
		<nav
			aria-label="Collections"
			className="flex min-h-10 flex-wrap items-center justify-center gap-x-7 gap-y-1 py-1"
		>
			{links.map((link) => (
				<Link
					key={link.href}
					href={link.href}
					className="inline-flex min-h-8 items-center font-[var(--font-storefront-body)] text-xs font-semibold uppercase tracking-[0.08em] text-foreground underline-offset-4 hover:underline"
				>
					{link.label}
				</Link>
			))}
		</nav>
	);
}
