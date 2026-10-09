"use client";

import {
	ArrowUpRight,
	ChevronsUpDown,
	Eye,
	LogOut,
	Menu,
	Moon,
	PanelLeftClose,
	PanelLeftOpen,
	ShieldCheck,
	Sparkles,
	Sun,
	User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/admin/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/admin/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/admin/ui/dropdown-menu";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/admin/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/admin/ui/tooltip";
import { type Role, roles } from "@/lib/admin/model";
import { cn } from "@/lib/utils";
import { AdminSearch, AdminNavigation as Navigation } from "./navigation";
import { Toasts } from "./operations/components/ui";
import { OperationsStorage } from "./operations/workspace";
import { useAdmin } from "./provider";
import { AdminSelect } from "./shared";
import { AdminWorkspaceSkeleton } from "./skeleton";

const roleCapabilities: Record<Role, string[]> = {
	Owner: ["Full Catalog", "Order Workflows", "Payments", "CMS & Slides", "Team & Settings"],
	Operations: ["Orders & Shipping", "Payments & Refunds", "Customer CRM", "Analytics"],
	Editor: ["CMS Homepage", "Slides & Banners", "Media Storage", "Store Info"],
	"Catalog Manager": ["Products & Categories", "Stock Adjustment", "Media Assets"],
};

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

function AdminThemeToggle() {
	const { setTheme } = useTheme();
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size="icon-sm"
					aria-label="Change theme"
					className="size-7 text-muted-foreground hover:text-foreground"
				>
					<Sun className="size-3.5 dark:hidden" />
					<Moon className="hidden size-3.5 dark:block" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="admin-content-theme">
				<DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export function AdminShell({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const [collapsed, setCollapsed] = useState(false);
	const [animateSidebar, setAnimateSidebar] = useState(false);
	const [mobileOpen, setMobileOpen] = useState(false);
	const [profileOpen, setProfileOpen] = useState(false);
	const { role, setRole, ready, storageError } = useAdmin();

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "b") {
				event.preventDefault();
				setAnimateSidebar(true);
				setCollapsed((prev) => !prev);
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);

	return (
		<div className="admin-workspace min-h-screen bg-ops-bg">
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
				style={{ gridTemplateColumns: collapsed ? "80px minmax(0,1fr)" : "244px minmax(0,1fr)" }}
			>
				<aside
					className={cn(
						"sticky top-0 hidden h-screen min-w-0 overflow-hidden flex-col border-r border-ops-rail-line bg-ops-rail p-3 text-ops-rail-ink lg:flex",
					)}
				>
					<Link
						href="/admin"
						aria-label="RINAZ administration home"
						className={cn(
							"mb-4 mt-1 flex min-h-12 flex-col justify-center transition-opacity hover:opacity-90",
							collapsed ? "items-center" : "items-start px-2",
						)}
					>
						<AdminLogo compact={collapsed} />
						{!collapsed && (
							<span className="mt-2.5 text-[9px] font-semibold tracking-[0.22em] text-ops-rail-muted">
								ADMINISTRATION
							</span>
						)}
					</Link>
					<div className="min-h-0 flex-1 overflow-y-auto pr-0.5">
						<Suspense fallback={<p className="text-sm">Navigation</p>}>
							<Navigation collapsed={collapsed} />
						</Suspense>
					</div>
					<div
						className={cn(
							"mt-auto border-t border-ops-rail-line/80 pt-2",
							collapsed ? "flex flex-col items-center gap-1.5" : "flex flex-col gap-1",
						)}
					>
						{collapsed ? (
							<DropdownMenu>
								<TooltipProvider delayDuration={150}>
									<Tooltip>
										<TooltipTrigger asChild>
											<DropdownMenuTrigger asChild>
												<button
													type="button"
													aria-label="Login user profile menu"
													className="relative flex size-9 items-center justify-center rounded-lg bg-ops-rail-2/50 text-ops-rail-muted ring-1 ring-white/10 transition-colors hover:bg-ops-rail-2 hover:text-ops-rail-ink focus-visible:outline-2 focus-visible:outline-ops-gold"
												>
													<User className="size-4 text-ops-rail-ink" />
													<span className="absolute bottom-1 right-1 size-2 rounded-full bg-emerald-500 ring-2 ring-[#121110]" />
												</button>
											</DropdownMenuTrigger>
										</TooltipTrigger>
										<TooltipContent side="right" sideOffset={12}>
											Login user ({role})
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
								<DropdownMenuContent
									side="right"
									align="end"
									sideOffset={12}
									className="admin-content-theme w-56 rounded-xl border border-border/80 p-1.5 shadow-xl"
								>
									<DropdownMenuLabel className="font-normal px-2.5 py-1.5">
										<div className="flex items-center gap-2.5">
											<div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold text-xs">
												LU
											</div>
											<div className="flex flex-col min-w-0 leading-tight">
												<p className="text-xs font-semibold text-foreground truncate">Login user</p>
												<p className="text-[11px] text-muted-foreground truncate">{role} account</p>
											</div>
										</div>
									</DropdownMenuLabel>
									<DropdownMenuSeparator className="my-1" />
									<DropdownMenuItem
										className="flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent"
										onClick={() => setProfileOpen(true)}
									>
										<User className="size-3.5 text-muted-foreground" />
										<span>View Profile</span>
									</DropdownMenuItem>
									<DropdownMenuItem asChild>
										<Link
											href="/admin/team"
											className="flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent"
										>
											<ShieldCheck className="size-3.5 text-muted-foreground" />
											<span>Role & Permissions</span>
										</Link>
									</DropdownMenuItem>
									<DropdownMenuSeparator className="my-1" />
									<DropdownMenuItem
										className="flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-destructive focus:bg-destructive/10 focus:text-destructive"
										onClick={() => {
											toast.success("Logged out successfully");
											router.push("/");
										}}
									>
										<LogOut className="size-3.5" />
										<span>Log out</span>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						) : (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<button
										type="button"
										className="group flex w-full items-center gap-2.5 rounded-lg border border-transparent p-2 text-left transition-all hover:border-ops-rail-line hover:bg-ops-rail-2/80 focus-visible:outline-2 focus-visible:outline-ops-gold"
									>
										<div className="relative flex size-8 shrink-0 items-center justify-center rounded-lg bg-ops-rail-2 text-ops-rail-ink ring-1 ring-white/10 shadow-xs">
											<User className="size-4 text-ops-rail-ink" />
											<span className="absolute bottom-0 right-0 size-2 rounded-full bg-emerald-500 ring-2 ring-[#121110]" />
										</div>
										<div className="flex flex-1 flex-col min-w-0 leading-tight">
											<span className="text-xs font-semibold text-ops-rail-ink truncate group-hover:text-white">
												Login user
											</span>
											<div className="flex items-center gap-1.5 mt-0.5">
												<span className="text-[10px] font-medium text-ops-rail-muted truncate capitalize">
													{role}
												</span>
												<span className="size-1 rounded-full bg-ops-rail-muted/50" />
												<span className="text-[10px] text-emerald-500 font-medium">Active</span>
											</div>
										</div>
										<ChevronsUpDown className="size-3.5 shrink-0 text-ops-rail-muted/70 transition-colors group-hover:text-ops-rail-ink" />
									</button>
								</DropdownMenuTrigger>
								<DropdownMenuContent
									side="top"
									align="start"
									sideOffset={8}
									className="admin-content-theme w-56 rounded-xl border border-border/80 p-1.5 shadow-xl"
								>
									<DropdownMenuLabel className="font-normal px-2.5 py-1.5">
										<div className="flex items-center gap-2.5">
											<div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold text-xs">
												LU
											</div>
											<div className="flex flex-col min-w-0 leading-tight">
												<p className="text-xs font-semibold text-foreground truncate">Login user</p>
												<p className="text-[11px] text-muted-foreground truncate">{role} account</p>
											</div>
										</div>
									</DropdownMenuLabel>
									<DropdownMenuSeparator className="my-1" />
									<DropdownMenuItem
										className="flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent"
										onClick={() => setProfileOpen(true)}
									>
										<User className="size-3.5 text-muted-foreground" />
										<span>View Profile</span>
									</DropdownMenuItem>
									<DropdownMenuItem asChild>
										<Link
											href="/admin/team"
											className="flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent"
										>
											<ShieldCheck className="size-3.5 text-muted-foreground" />
											<span>Role & Permissions</span>
										</Link>
									</DropdownMenuItem>
									<DropdownMenuSeparator className="my-1" />
									<DropdownMenuItem
										className="flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-destructive focus:bg-destructive/10 focus:text-destructive"
										onClick={() => {
											toast.success("Logged out successfully");
											router.push("/");
										}}
									>
										<LogOut className="size-3.5" />
										<span>Log out</span>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						)}
					</div>
				</aside>
				<div className="min-w-0 flex-1">
					<header className="admin-content-theme sticky top-0 z-30 flex h-12 items-center justify-between gap-3 border-b border-border bg-background/95 px-4 backdrop-blur-md sm:px-6 text-foreground">
						<div className="flex items-center gap-3">
							<Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
								<SheetTrigger asChild>
									<Button
										className="lg:hidden"
										variant="outline"
										size="icon-sm"
										aria-label="Open admin navigation"
									>
										<Menu className="size-3.5" />
									</Button>
								</SheetTrigger>
								<SheetContent
									side="left"
									className="admin-workspace bg-ops-rail text-ops-rail-ink data-[state=open]:duration-250 data-[state=closed]:duration-200 ease-out motion-reduce:animate-none motion-reduce:transition-none [&>button]:size-7 [&>button]:grid [&>button]:place-items-center"
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
										<SheetDescription className="text-ops-rail-muted">
											Manage your browser-local demo.
										</SheetDescription>
									</SheetHeader>
									<div className="flex-1 overflow-auto p-4">
										<Suspense>
											<Navigation collapsed={false} onNavigate={() => setMobileOpen(false)} />
										</Suspense>
									</div>
									<div className="border-t border-ops-rail-line p-4">
										<button
											type="button"
											onClick={() => {
												setMobileOpen(false);
												setProfileOpen(true);
											}}
											className="flex w-full items-center gap-3 rounded-md px-2 py-1.5 text-xs text-ops-rail-muted transition-colors hover:bg-ops-rail-2 hover:text-ops-rail-ink"
										>
											<div className="relative flex size-7 shrink-0 items-center justify-center rounded-full bg-ops-rail-2 text-ops-rail-ink ring-1 ring-ops-rail-line">
												<User className="size-4" />
												<span className="absolute -bottom-0.5 -right-0.5 size-1.5 rounded-full bg-emerald-500 ring-2 ring-ops-rail" />
											</div>
											<div className="flex flex-col text-left leading-tight truncate">
												<span className="font-medium text-ops-rail-ink truncate">Login user</span>
												<span className="text-[10px] text-ops-rail-muted truncate">{role} account</span>
											</div>
										</button>
									</div>
								</SheetContent>
							</Sheet>
							<TooltipProvider delayDuration={150}>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											variant="ghost"
											size="icon-sm"
											aria-label={collapsed ? "Expand sidebar (⌘B)" : "Collapse sidebar (⌘B)"}
											className="hidden text-muted-foreground hover:bg-muted hover:text-foreground lg:inline-flex"
											onClick={(event) => {
												setAnimateSidebar(event.detail > 0);
												setCollapsed((prev) => !prev);
											}}
										>
											{collapsed ? (
												<PanelLeftOpen className="size-4" />
											) : (
												<PanelLeftClose className="size-4" />
											)}
										</Button>
									</TooltipTrigger>
									<TooltipContent side="bottom" sideOffset={8}>
										{collapsed ? "Expand sidebar (⌘B)" : "Collapse sidebar (⌘B)"}
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
							<AdminSearch />
							<div className="hidden items-center gap-2 xl:flex">
								<div className="h-4 w-px bg-border/70" />
								<div className="leading-tight">
									<p className="text-xs font-medium text-foreground">Studio workspace</p>
									<p className="text-[10px] text-muted-foreground">Demo — data saved in browser</p>
								</div>
							</div>
						</div>
						<div className="flex items-center gap-2">
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
								className="w-32 text-xs"
							/>
							<AdminThemeToggle />
							<Button asChild variant="outline" size="default" className="h-7 gap-1.5 px-2.5 text-xs">
								<Link href="/admin/preview">
									<Eye className="size-3.5" />
									<span>Preview</span>
								</Link>
							</Button>
							<Button
								asChild
								variant="ghost"
								size="default"
								className="hidden h-7 gap-1 px-2 text-xs text-muted-foreground hover:text-foreground sm:inline-flex"
							>
								<a href="/" target="_blank" rel="noopener noreferrer">
									<span>Storefront</span>
									<ArrowUpRight className="size-3.5" />
								</a>
							</Button>
						</div>
					</header>
					<OperationsStorage />
					{storageError && (
						<div role="alert" className="border-b bg-secondary px-4 py-3 text-sm sm:px-6">
							Save problem: {storageError} Your last successfully saved data is preserved.
						</div>
					)}
					<main
						id="admin-main"
						className="admin-content-theme mx-auto max-w-[1360px] p-4 pb-24 sm:p-6 lg:p-8"
					>
						{!ready && <AdminWorkspaceSkeleton />}
						<div key={ready ? "loaded" : "loading"} hidden={!ready}>
							{children}
						</div>
					</main>
				</div>
			</div>
			<Toasts />
			<Dialog open={profileOpen} onOpenChange={setProfileOpen}>
				<DialogContent className="admin-content-theme max-w-md overflow-hidden rounded-2xl p-0 border border-border/80 shadow-2xl">
					{/* Luxury Monogram Header Banner */}
					<div className="relative overflow-hidden bg-gradient-to-br from-ops-rail via-stone-900 to-ops-rail-2 p-6 text-ops-rail-ink border-b border-ops-rail-line">
						<div className="absolute right-0 top-0 translate-x-4 -translate-y-4 size-32 rounded-full bg-ops-gold/10 blur-2xl pointer-events-none" />
						<div className="flex items-start justify-between gap-4">
							<div className="flex items-center gap-4">
								<div className="relative flex size-14 shrink-0 items-center justify-center rounded-2xl bg-ops-rail text-ops-gold ring-2 ring-ops-gold/30 shadow-lg">
									<User className="size-7" />
									<span className="absolute -bottom-1 -right-1 flex items-center gap-1 rounded-full bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-400 ring-2 ring-ops-rail">
										<span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
										Live
									</span>
								</div>
								<div>
									<h2 className="text-base font-semibold tracking-tight text-ops-rail-ink">Login user</h2>
									<p className="text-xs text-ops-rail-muted">admin@rinaz-boutique.com</p>
									<div className="mt-2 flex items-center gap-2">
										<span className="inline-flex items-center gap-1 rounded-full border border-ops-gold/40 bg-ops-gold/15 px-2.5 py-0.5 text-[10px] font-semibold tracking-wide text-ops-gold uppercase">
											<Sparkles className="size-2.5" />
											{role}
										</span>
										<span className="text-[11px] text-ops-rail-muted/90">Studio Workspace</span>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="p-6 space-y-5">
						<DialogHeader className="sr-only">
							<DialogTitle>User Profile</DialogTitle>
							<DialogDescription>Administrative account details and role permissions.</DialogDescription>
						</DialogHeader>

						{/* Session Overview */}
						<div className="rounded-xl border border-border/70 bg-card p-3.5 space-y-2.5">
							<p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
								Session Overview
							</p>
							<div className="grid grid-cols-2 gap-2 text-xs">
								<div className="rounded-lg bg-muted/40 p-2.5">
									<p className="text-[10px] text-muted-foreground">Account Type</p>
									<p className="font-medium text-foreground mt-0.5">Studio Administrator</p>
								</div>
								<div className="rounded-lg bg-muted/40 p-2.5">
									<p className="text-[10px] text-muted-foreground">Environment</p>
									<p className="font-medium text-emerald-600 dark:text-emerald-400 mt-0.5">
										Authenticated (Demo)
									</p>
								</div>
							</div>
						</div>

						{/* Role Capabilities */}
						<div className="space-y-2">
							<p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
								Active Capabilities
							</p>
							<div className="flex flex-wrap gap-1.5">
								{(roleCapabilities[role] ?? roleCapabilities.Owner).map((badge) => (
									<span
										key={badge}
										className="inline-flex items-center gap-1 rounded-md border border-border bg-muted/50 px-2 py-1 text-[11px] text-foreground"
									>
										<ShieldCheck className="size-3 text-emerald-500" />
										{badge}
									</span>
								))}
							</div>
						</div>

						<div className="flex items-center justify-between border-t border-border/70 pt-4">
							<Button variant="outline" size="sm" onClick={() => setProfileOpen(false)}>
								Close
							</Button>
							<Button asChild size="sm">
								<Link href="/admin/team" onClick={() => setProfileOpen(false)}>
									Manage Team & Roles
								</Link>
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
