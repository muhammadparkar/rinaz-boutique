"use client";
import {
	ArrowUpRight,
	Boxes,
	ChartNoAxesCombined,
	CreditCard,
	Eye,
	FileText,
	Images,
	Layers,
	LayoutDashboard,
	Megaphone,
	Menu,
	Package,
	Palette,
	PanelLeftClose,
	PanelLeftOpen,
	Settings,
	ShoppingBag,
	Star,
	Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { type Area, canEdit, type Role, roles } from "@/lib/admin/model";
import { cn } from "@/lib/utils";
import { useAdmin } from "./provider";
import { AdminSelect } from "./shared";

const navigation = [
	{ name: "Overview", href: "/admin", icon: LayoutDashboard },
	{ name: "Website content", href: "/admin/cms", icon: FileText, area: "cms" },
	{ name: "Products", href: "/admin/products", icon: Package, area: "catalog" },
	{ name: "Categories", href: "/admin/categories", icon: Layers, area: "catalog" },
	{ name: "Inventory", href: "/admin/inventory", icon: Boxes, area: "catalog" },
	{ name: "Media library", href: "/admin/media", icon: Images, area: "media" },
	{ name: "Team & activity", href: "/admin/team", icon: Users, area: "administration" },
	{ name: "Design system", href: "/admin/design-system", icon: Palette },
] as const;
const planned = [
	{ name: "Orders & shipping", icon: ShoppingBag },
	{ name: "Payments & refunds", icon: CreditCard },
	{ name: "Customers", icon: Users },
	{ name: "Marketing", icon: Megaphone },
	{ name: "Reviews", icon: Star },
	{ name: "Analytics", icon: ChartNoAxesCombined },
	{ name: "Settings & notifications", icon: Settings },
];
function Navigation({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
	const pathname = usePathname();
	const { role } = useAdmin();
	return (
		<nav aria-label="Admin navigation" className="space-y-1">
			{navigation
				.filter((item) => !("area" in item) || canEdit(role, item.area as Area))
				.map((item) => (
					<Link
						key={item.href}
						href={item.href}
						onClick={onNavigate}
						aria-current={pathname === item.href ? "page" : undefined}
						title={collapsed ? item.name : undefined}
						aria-label={collapsed ? item.name : undefined}
						className={cn(
							"flex min-h-10 items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
							pathname === item.href
								? "bg-foreground text-background"
								: "text-muted-foreground hover:bg-secondary hover:text-foreground",
							collapsed && "justify-center",
						)}
					>
						<item.icon size={17} />
						<span
							aria-hidden={collapsed}
							className={cn(
								"whitespace-nowrap transition-[opacity,transform] duration-150 motion-reduce:transition-none",
								collapsed ? "sr-only opacity-0 -translate-x-1" : "opacity-100 translate-x-0",
							)}
						>
							{item.name}
						</span>
					</Link>
				))}
			{!collapsed && (
				<>
					<p className="px-3 pb-2 pt-8 text-[10px] tracking-[0.18em] text-muted-foreground">NEXT MILESTONE</p>
					{planned.map((item) => (
						<div key={item.name} className="flex items-center gap-3 px-3 py-2 text-xs text-muted-foreground">
							<item.icon size={15} />
							<span>{item.name}</span>
							<span className="ml-auto rounded border px-1.5 py-0.5 text-[9px]">Planned</span>
						</div>
					))}
				</>
			)}
		</nav>
	);
}
function AdminLogo({ compact = false, className }: { compact?: boolean; className?: string }) {
	return (
		<Image
			src={compact ? "/brand/rinaz-R-v3.png" : "/brand/rinaz-v3.png"}
			alt={compact ? "RINAZ monogram" : "RINAZ STUDIO"}
			width={compact ? 900 : 1220}
			height={compact ? 750 : 361}
			sizes={compact ? "36px" : "168px"}
			className={cn("h-auto object-contain", compact ? "w-9" : "w-42", className)}
		/>
	);
}
export function AdminShell({ children }: { children: React.ReactNode }) {
	const [collapsed, setCollapsed] = useState(false);
	const [animateSidebar, setAnimateSidebar] = useState(false);
	const [mobileOpen, setMobileOpen] = useState(false);
	const { role, setRole, ready, storageError } = useAdmin();
	return (
		<div className="min-h-screen bg-muted/20">
			<a
				href="#admin-main"
				className="sr-only focus:not-sr-only focus:fixed focus:z-[100] focus:bg-background focus:p-4"
			>
				Skip to admin content
			</a>
			<div
				className={cn(
					"flex lg:grid ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
					animateSidebar && "transition-[grid-template-columns] duration-250",
				)}
				style={{ gridTemplateColumns: collapsed ? "80px minmax(0,1fr)" : "256px minmax(0,1fr)" }}
			>
				<aside
					className={cn(
						"sticky top-0 hidden h-screen min-w-0 overflow-hidden flex-col border-r bg-background p-4 lg:flex",
					)}
				>
					<Link
						href="/admin"
						aria-label="RINAZ administration home"
						className={cn(
							"mb-9 mt-3 flex min-h-12 flex-col justify-center",
							collapsed ? "items-center" : "items-start px-3",
						)}
					>
						<AdminLogo compact={collapsed} />
						{!collapsed && (
							<span className="mt-3 text-[9px] tracking-[0.22em] text-muted-foreground">ADMINISTRATION</span>
						)}
					</Link>
					<div className="min-h-0 flex-1 overflow-y-auto">
						<Suspense fallback={<p className="text-sm">Navigation</p>}>
							<Navigation collapsed={collapsed} />
						</Suspense>
					</div>
					<div className="mt-5 border-t pt-4">
						<Button
							variant="ghost"
							size="icon-sm"
							aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
							onClick={(event) => {
								setAnimateSidebar(event.detail > 0);
								setCollapsed(!collapsed);
							}}
						>
							{collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
						</Button>
						{!collapsed && (
							<p className="mt-2 px-3 text-[10px] text-muted-foreground">
								Crafted for the people behind the studio.
							</p>
						)}
					</div>
				</aside>
				<div className="min-w-0 flex-1">
					<header className="sticky top-0 z-30 flex min-h-20 flex-wrap items-center justify-between gap-3 border-b bg-background px-4 py-3 sm:px-8">
						<div className="flex items-center gap-3">
							<Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
								<SheetTrigger asChild>
									<Button
										className="lg:hidden"
										variant="outline"
										size="icon-sm"
										aria-label="Open admin navigation"
									>
										<Menu />
									</Button>
								</SheetTrigger>
								<SheetContent
									side="left"
									className="data-[state=open]:duration-250 data-[state=closed]:duration-200 ease-out motion-reduce:animate-none motion-reduce:transition-none [&>button]:size-8 [&>button]:grid [&>button]:place-items-center"
								>
									<SheetHeader>
										<Link
											href="/admin"
											aria-label="RINAZ administration home"
											onClick={() => setMobileOpen(false)}
											className="mb-2 w-fit"
										>
											<AdminLogo />
										</Link>
										<SheetTitle className="sr-only">RINAZ administration</SheetTitle>
										<SheetDescription>Manage your browser-local demo.</SheetDescription>
									</SheetHeader>
									<div className="overflow-auto p-4">
										<Suspense>
											<Navigation collapsed={false} onNavigate={() => setMobileOpen(false)} />
										</Suspense>
									</div>
								</SheetContent>
							</Sheet>
							<div>
								<p className="text-xs font-medium">Studio workspace</p>
								<p className="mt-1 text-[11px] text-muted-foreground">Demo — data saved in this browser</p>
							</div>
						</div>
						<div className="flex flex-wrap items-center gap-2">
							<label htmlFor="demo-role" className="sr-only">
								Demo role
							</label>
							<AdminSelect
								id="demo-role"
								label="Demo role"
								value={role}
								onChange={(value) => setRole(value as Role)}
								options={roles.map((value) => ({ value, label: value }))}
								disabled={!ready}
								className="w-40 text-xs"
							/>
							<ThemeToggle />
							<Button asChild variant="outline" size="sm">
								<Link href="/admin/preview">
									<Eye />
									Preview
								</Link>
							</Button>
							<a href="/" className="hidden items-center gap-1 text-xs text-muted-foreground sm:flex">
								Storefront
								<ArrowUpRight size={14} />
							</a>
						</div>
					</header>
					{storageError && (
						<div role="alert" className="border-b bg-secondary px-4 py-3 text-sm sm:px-8">
							Save problem: {storageError} Your last successfully saved data is preserved.
						</div>
					)}
					<main id="admin-main" className="mx-auto max-w-[1500px] p-4 sm:p-8 lg:p-10">
						{!ready && (
							<div role="status" className="space-y-6">
								<p>Opening your studio workspace…</p>
								<div className="h-64 animate-pulse rounded-lg bg-secondary" />
							</div>
						)}
						<div key={ready ? "loaded" : "loading"} hidden={!ready}>
							{children}
						</div>
					</main>
				</div>
			</div>
		</div>
	);
}
