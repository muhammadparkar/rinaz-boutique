"use client";
import {
	ChartNoAxesCombined,
	ChevronDown,
	CreditCard,
	FileText,
	Images,
	LayoutDashboard,
	Megaphone,
	Package,
	Search,
	Settings,
	ShoppingBag,
	Star,
	Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/admin/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/admin/ui/dialog";
import { Input } from "@/components/admin/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/admin/ui/tooltip";
import { canEdit } from "@/lib/admin/model";
import { cn } from "@/lib/utils";
import { useAdmin } from "./provider";

export const adminGroups = [
	{ name: "Dashboard", icon: LayoutDashboard, href: "/admin" },
	{
		name: "Catalog",
		icon: Package,
		area: "catalog",
		children: [
			{ name: "Products", href: "/admin/products" },
			{ name: "Categories", href: "/admin/categories" },
			{ name: "Inventory", href: "/admin/inventory" },
			{ name: "Media", href: "/admin/media" },
		],
	},
	{
		name: "Orders",
		icon: ShoppingBag,
		workflow: true,
		children: [
			{ name: "All orders", href: "/admin/orders" },
			{ name: "Pending", href: "/admin/orders?status=pending" },
			{ name: "Processing", href: "/admin/orders?status=processing" },
			{ name: "Shipped", href: "/admin/orders?status=shipped" },
			{ name: "Delivered", href: "/admin/orders?status=delivered" },
			{ name: "Refunds", href: "/admin/orders?status=refunded" },
		],
	},
	{
		name: "Payments",
		icon: CreditCard,
		workflow: true,
		children: [
			{ name: "Transactions", href: "/admin/payments" },
			{ name: "Successful", href: "/admin/payments?status=captured" },
			{ name: "Failed", href: "/admin/payments?status=failed" },
			{ name: "Refunds", href: "/admin/payments?status=refunds" },
		],
	},
	{ name: "Customers", icon: Users, workflow: true, href: "/admin/customers" },
	{
		name: "Marketing",
		icon: Megaphone,
		workflow: true,
		children: [
			{ name: "Coupons", href: "/admin/marketing/coupons" },
			{ name: "Discounts", href: "/admin/marketing/discounts" },
			{ name: "Promotions", href: "/admin/marketing/promotions" },
		],
	},
	{
		name: "Website",
		icon: FileText,
		area: "cms",
		children: [
			{ name: "Homepage", href: "/admin/cms" },
			{ name: "Hero slides", href: "/admin/cms?section=Hero%20slides" },
			{ name: "Navigation & footer", href: "/admin/cms?section=Navigation%20%26%20footer" },
			{ name: "Pages & SEO", href: "/admin/cms?section=Pages%20%26%20SEO" },
			{ name: "FAQs", href: "/admin/cms?section=FAQs" },
			{ name: "Store details", href: "/admin/cms?section=Store%20details" },
		],
	},
	{ name: "Reviews", icon: Star, workflow: true, href: "/admin/reviews" },
	{
		name: "Analytics",
		icon: ChartNoAxesCombined,
		workflow: true,
		children: [
			{ name: "Sales", href: "/admin/analytics" },
			{ name: "Products", href: "/admin/analytics?view=products" },
			{ name: "Customers", href: "/admin/analytics?view=customers" },
			{ name: "Payments", href: "/admin/analytics?view=payments" },
			{ name: "Inventory", href: "/admin/analytics?view=inventory" },
		],
	},
	{
		name: "Settings",
		icon: Settings,
		area: "administration",
		children: [
			{ name: "Store", href: "/admin/settings/store" },
			{ name: "Shipping", href: "/admin/settings/shipping" },
			{ name: "Tax", href: "/admin/settings/tax" },
			{ name: "Payment gateway", href: "/admin/settings/payments" },
			{ name: "Notifications", href: "/admin/settings/notifications" },
			{ name: "Team & activity", href: "/admin/team" },
			{ name: "Design system", href: "/admin/design-system" },
		],
	},
] as const;

export function AdminNavigation({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
	const path = usePathname();
	const params = useSearchParams();
	const { role } = useAdmin();
	const [open, setOpen] = useState<Record<string, boolean>>({});

	const active = (href: string) => {
		const [pathname, query = ""] = href.split("?");
		return path === pathname && new URLSearchParams(query).toString() === params.toString();
	};

	const visibleGroups = adminGroups.filter(
		(g) =>
			(!("workflow" in g) || role === "Owner" || role === "Operations") &&
			(!("area" in g) || canEdit(role, g.area)),
	);

	return (
		<TooltipProvider delayDuration={150}>
			<nav aria-label="Admin navigation" className="flex flex-col gap-1">
				{visibleGroups.map((group) => {
					const children = "children" in group ? group.children : undefined;
					const here = children
						? children.some((c) => c.href.split("?")[0] === path)
						: active("href" in group ? group.href : "");
					const expanded = open[group.name] ?? here;

					const itemButtonCls = cn(
						"group relative flex w-full items-center gap-2.5 rounded-md text-xs font-medium transition-colors select-none focus-visible:outline-2 focus-visible:outline-ops-gold",
						collapsed ? "h-9 w-9 justify-center p-0 mx-auto" : "h-8.5 px-2.5",
						here
							? "bg-ops-rail-2 text-ops-rail-ink font-semibold shadow-2xs"
							: "text-ops-rail-muted hover:bg-ops-rail-2/70 hover:text-ops-rail-ink",
					);

					if (collapsed) {
						return (
							<div key={group.name} className="flex justify-center">
								<Tooltip>
									<TooltipTrigger asChild>
										<Link
											href={children ? children[0].href : "href" in group ? group.href : "/admin"}
											onClick={onNavigate}
											className={itemButtonCls}
											aria-current={here ? "page" : undefined}
										>
											<group.icon className="size-4 shrink-0" />
											<span className="sr-only">{group.name}</span>
										</Link>
									</TooltipTrigger>
									<TooltipContent side="right" sideOffset={10} className="font-medium">
										{group.name}
									</TooltipContent>
								</Tooltip>
							</div>
						);
					}

					return (
						<div key={group.name} className="flex flex-col">
							{children ? (
								<button
									type="button"
									className={itemButtonCls}
									aria-expanded={expanded}
									onClick={() => setOpen({ ...open, [group.name]: !expanded })}
								>
									<group.icon className="size-4 shrink-0 transition-colors" />
									<span className="flex-1 text-left truncate">{group.name}</span>
									<ChevronDown
										className={cn(
											"size-3.5 shrink-0 text-ops-rail-muted transition-transform duration-200 motion-reduce:transition-none group-hover:text-ops-rail-ink",
											!expanded && "-rotate-90",
										)}
									/>
								</button>
							) : (
								<Link
									href={"href" in group ? group.href : "/admin"}
									onClick={onNavigate}
									className={itemButtonCls}
									aria-current={here ? "page" : undefined}
								>
									<group.icon className="size-4 shrink-0 transition-colors" />
									<span className="flex-1 text-left truncate">{group.name}</span>
								</Link>
							)}

							{children && expanded && (
								<div className="relative my-1 ml-4.5 flex flex-col gap-0.5 border-l border-ops-rail-line/60 pl-2">
									{children.map((child) => {
										const isCurrent = active(child.href);
										return (
											<Link
												key={child.href}
												href={child.href}
												onClick={onNavigate}
												aria-current={isCurrent ? "page" : undefined}
												className={cn(
													"group relative flex h-7 items-center rounded-md px-2 text-xs transition-colors",
													isCurrent
														? "bg-ops-rail-2 font-medium text-ops-rail-ink before:absolute before:-left-[9px] before:top-1.5 before:bottom-1.5 before:w-0.5 before:rounded-full before:bg-ops-gold"
														: "text-ops-rail-muted hover:bg-ops-rail-2/50 hover:text-ops-rail-ink",
												)}
											>
												<span className="truncate">{child.name}</span>
											</Link>
										);
									})}
								</div>
							)}
						</div>
					);
				})}

				{canEdit(role, "media") &&
					!canEdit(role, "catalog") &&
					(collapsed ? (
						<div className="flex justify-center">
							<Tooltip>
								<TooltipTrigger asChild>
									<Link
										href="/admin/media"
										onClick={onNavigate}
										className={cn(
											"group flex h-9 w-9 items-center justify-center rounded-md text-ops-rail-muted hover:bg-ops-rail-2/70 hover:text-ops-rail-ink transition-colors focus-visible:outline-2 focus-visible:outline-ops-gold",
											path === "/admin/media" && "bg-ops-rail-2 text-ops-rail-ink",
										)}
									>
										<Images className="size-4 shrink-0" />
										<span className="sr-only">Media</span>
									</Link>
								</TooltipTrigger>
								<TooltipContent side="right" sideOffset={10} className="font-medium">
									Media
								</TooltipContent>
							</Tooltip>
						</div>
					) : (
						<Link
							href="/admin/media"
							onClick={onNavigate}
							className={cn(
								"group flex h-8.5 w-full items-center gap-2.5 rounded-md px-2.5 text-xs font-medium text-ops-rail-muted hover:bg-ops-rail-2/70 hover:text-ops-rail-ink transition-colors focus-visible:outline-2 focus-visible:outline-ops-gold",
								path === "/admin/media" && "bg-ops-rail-2 text-ops-rail-ink font-semibold",
							)}
						>
							<Images className="size-4 shrink-0" />
							<span className="flex-1 text-left truncate">Media</span>
						</Link>
					))}
			</nav>
		</TooltipProvider>
	);
}
export function AdminSearch() {
	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState("");
	const { state, role } = useAdmin();
	useEffect(() => {
		const handler = (event: KeyboardEvent) => {
			if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
				event.preventDefault();
				setOpen((value) => !value);
			}
		};
		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, []);
	const pages = adminGroups
		.filter(
			(g) =>
				(!("workflow" in g) || role === "Owner" || role === "Operations") &&
				(!("area" in g) || canEdit(role, g.area)),
		)
		.flatMap<{ name: string; href: string; label: string }>((g) =>
			"children" in g
				? g.children.map((c) => ({ ...c, label: `${g.name} · ${c.name}` }))
				: [{ name: g.name, href: g.href, label: g.name }],
		);
	const results = [
		...pages,
		...(canEdit(role, "catalog")
			? state.draft.products.map((p) => ({
					name: p.name,
					label: `Product · ${p.name}`,
					href: `/admin/products?search=${encodeURIComponent(p.name)}`,
				}))
			: []),
	]
		.filter((p) => p.label.toLowerCase().includes(query.toLowerCase()))
		.slice(0, 15);
	return (
		<>
			<Button
				variant="outline"
				size="default"
				onClick={() => {
					setQuery("");
					setOpen(true);
				}}
				className="h-7 w-auto min-w-7 justify-start gap-2 rounded-md border-input bg-input/20 px-2 text-xs font-normal text-muted-foreground hover:bg-input/40 hover:text-foreground sm:w-56"
			>
				<Search className="size-3.5 shrink-0" />
				<span className="hidden sm:inline">Search workspace</span>
				<kbd className="pointer-events-none ml-auto hidden h-4 select-none items-center gap-0.5 rounded border border-border/70 bg-muted px-1 font-mono text-[9px] font-medium text-muted-foreground sm:inline-flex">
					⌘K
				</kbd>
				<span className="sr-only">Search admin</span>
			</Button>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="admin-content-theme max-w-lg rounded-xl">
					<DialogHeader>
						<DialogTitle>Search workspace</DialogTitle>
						<DialogDescription>Find admin pages and catalog products.</DialogDescription>
					</DialogHeader>
					<div className="relative">
						<Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
						<Input
							autoFocus
							aria-label="Search admin pages and products"
							placeholder="Search pages or products…"
							value={query}
							onChange={(event) => setQuery(event.target.value)}
							className="h-8 pl-8 text-xs"
						/>
					</div>
					<div className="max-h-80 space-y-0.5 overflow-y-auto">
						{results.map((result) => (
							<Link
								key={`${result.href}-${result.label}`}
								href={result.href}
								onClick={() => setOpen(false)}
								className="block rounded-md px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
							>
								{result.label}
							</Link>
						))}
						{!results.length && (
							<p className="py-6 text-center text-xs text-muted-foreground">No matching pages or products.</p>
						)}
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
