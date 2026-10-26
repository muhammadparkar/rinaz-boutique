"use client";

import { ArrowRight, LogOut, MapPin, Package, UserRound } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AccountAccess } from "@/components/account-access";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { AccountState } from "@/lib/account";
import { authClient } from "@/lib/auth-client";

const views = [
	{
		name: "Orders",
		icon: Package,
		title: "Your orders",
		text: "Order history and tracking are not available yet. You can still explore the collections.",
	},
	{
		name: "Profile",
		icon: UserRound,
		title: "Personal details",
		text: "These are the details associated with your account. Profile editing is not available yet.",
	},
	{
		name: "Addresses",
		icon: MapPin,
		title: "Delivery addresses",
		text: "Saved delivery addresses are not available yet. No address has been added through this page.",
	},
] as const;

export function AccountWorkspace({ state }: { state: AccountState }) {
	const [selected, setSelected] = useState(0);
	const [signingOut, setSigningOut] = useState(false);
	const [error, setError] = useState("");
	const view = views[selected] ?? views[0];

	async function signOut() {
		setSigningOut(true);
		setError("");
		try {
			const result = await authClient.signOut();
			if (result.error) throw new Error("Sign out failed");
			window.location.assign("/account");
		} catch {
			setError("Could not sign out. Please try again.");
			setSigningOut(false);
		}
	}

	if (state.status === "signed-out") return <AccountAccess />;
	if (state.status === "unavailable")
		return (
			<section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12">
				<h1 className="font-display text-3xl sm:text-4xl">Your account</h1>
				<p role="status" className="mt-5 max-w-lg text-base leading-7 text-muted-foreground">
					Account services are temporarily unavailable. Please try again later.
				</p>
				<Link
					href="/products"
					className="mt-8 inline-flex min-h-11 items-center gap-4 underline underline-offset-4"
				>
					Continue shopping <ArrowRight className="size-4" aria-hidden />
				</Link>
			</section>
		);

	return (
		<div className="bg-secondary/40">
			<div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-12 lg:px-12">
				<div className="mb-8 flex flex-wrap items-center justify-between gap-4">
					<div>
						<h1 className="font-display text-3xl sm:text-4xl">My account</h1>
					</div>
					<Link
						href="/products"
						className="inline-flex min-h-11 items-center gap-4 text-sm underline underline-offset-4 hover:text-muted-foreground"
					>
						Explore the collections <ArrowRight className="size-4" aria-hidden />
					</Link>
				</div>
				<div className="grid min-w-0 items-start gap-5 md:grid-cols-[260px_minmax(0,1fr)] lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-6">
					<aside className="min-w-0 space-y-3">
						<Card className="shadow-none">
							<CardContent className="flex items-center gap-4">
								<span
									aria-hidden
									className="grid size-14 shrink-0 place-items-center rounded-full bg-foreground text-xl font-semibold text-background"
								>
									{state.customer.name
										.trim()
										.split(/\s+/)
										.slice(0, 2)
										.map((part) => part[0])
										.join("")
										.toUpperCase()}
								</span>
								<div className="min-w-0">
									<p className="text-sm text-muted-foreground">Hello,</p>
									<p className="mt-1 break-words text-base font-semibold">{state.customer.name}</p>
									<p className="mt-1 break-words text-xs leading-5 text-muted-foreground">
										{state.customer.email}
									</p>
								</div>
							</CardContent>
						</Card>
						<Card className="gap-0 py-2 shadow-none">
							<nav aria-label="Account sections" className="grid grid-cols-3 gap-1 px-2 md:flex md:flex-col">
								{views.map((item, index) => (
									<Button
										key={item.name}
										variant="ghost"
										className={`h-auto min-h-12 flex-col justify-center whitespace-normal px-1 py-3 text-center md:flex-row md:justify-start md:px-4 md:text-left ${selected === index ? "bg-secondary text-foreground" : "text-muted-foreground"}`}
										aria-pressed={selected === index}
										aria-controls="account-content"
										onClick={() => setSelected(index)}
									>
										<item.icon aria-hidden />
										{item.name}
									</Button>
								))}
							</nav>
						</Card>
						<Card className="hidden gap-1 px-2 py-2 shadow-none md:flex">
							<Button asChild variant="ghost" className="min-h-12 justify-start px-4">
								<Link href="/contact">
									Need help? <ArrowRight className="ml-auto" aria-hidden />
								</Link>
							</Button>
							<Button
								asChild
								variant="ghost"
								className="h-auto min-h-12 justify-start whitespace-normal px-4 py-3 text-left"
							>
								<Link href="/faq">Frequently asked questions</Link>
							</Button>
						</Card>
						<Card className="hidden gap-0 px-2 py-2 shadow-none md:flex">
							<Button
								variant="ghost"
								className="min-h-12 justify-start px-4 text-muted-foreground"
								onClick={signOut}
								disabled={signingOut}
							>
								<LogOut aria-hidden />
								{signingOut ? "Signing out…" : "Sign out"}
							</Button>
							{error && (
								<p role="alert" className="px-4 pb-3 text-sm leading-6 text-destructive">
									{error}
								</p>
							)}
						</Card>
					</aside>
					<section id="account-content" aria-labelledby="account-view-title" className="min-w-0 space-y-4">
						<Card className="shadow-none">
							<CardContent>
								<view.icon className="mb-4 size-6" aria-hidden />
								<h2 id="account-view-title" className="font-sans text-xl font-semibold">
									{view.title}
								</h2>
								<p className="mt-4 max-w-lg text-sm leading-7 text-muted-foreground">{view.text}</p>
							</CardContent>
						</Card>
						<Card className="min-h-56 shadow-none">
							<CardContent>
								{selected === 1 ? (
									<dl className="divide-y divide-border text-sm">
										<div className="grid gap-2 py-5 sm:grid-cols-[140px_minmax(0,1fr)]">
											<dt className="text-muted-foreground">Full name</dt>
											<dd className="break-words">{state.customer.name}</dd>
										</div>
										<div className="grid gap-2 py-5 sm:grid-cols-[140px_minmax(0,1fr)]">
											<dt className="text-muted-foreground">Email address</dt>
											<dd className="break-words">{state.customer.email}</dd>
										</div>
									</dl>
								) : (
									<div className="py-4">
										<p className="mb-6 max-w-md text-sm leading-7 text-muted-foreground">
											{selected === 0
												? "Discover abayas, fine jewelry, and couture in the current collections."
												: "For delivery questions, contact the studio while saved addresses are unavailable."}
										</p>
										<Button
											asChild
											variant="outline"
											className="h-auto min-h-12 whitespace-normal px-5 py-3 text-left"
										>
											<Link href="/products">
												Browse collections <ArrowRight aria-hidden />
											</Link>
										</Button>
									</div>
								)}
							</CardContent>
						</Card>
						<Card className="gap-1 px-2 py-2 shadow-none md:hidden">
							<Button asChild variant="ghost" className="min-h-12 justify-start px-4">
								<Link href="/contact">
									Need help? <ArrowRight className="ml-auto" aria-hidden />
								</Link>
							</Button>
							<Button
								asChild
								variant="ghost"
								className="h-auto min-h-12 justify-start whitespace-normal px-4 py-3 text-left"
							>
								<Link href="/faq">Frequently asked questions</Link>
							</Button>
							<Button
								variant="ghost"
								className="min-h-12 justify-start px-4 text-muted-foreground"
								onClick={signOut}
								disabled={signingOut}
							>
								<LogOut aria-hidden />
								{signingOut ? "Signing out…" : "Sign out"}
							</Button>
							{error && (
								<p role="alert" className="px-4 pb-3 text-sm leading-6 text-destructive">
									{error}
								</p>
							)}
						</Card>
					</section>
				</div>
			</div>
		</div>
	);
}
