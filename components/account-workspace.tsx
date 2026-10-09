"use client";

import { MapPin, Package, UserRound } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AccountState } from "@/lib/account";

const views = [
	{
		name: "Orders",
		icon: Package,
		title: "Your order history",
		text: "Order status, tracking, and receipts will appear here after account services are connected.",
	},
	{
		name: "Profile",
		icon: UserRound,
		title: "Your personal details",
		text: "Your name and email will be available here once secure sign-in is connected.",
	},
	{
		name: "Addresses",
		icon: MapPin,
		title: "Your saved addresses",
		text: "Manage delivery addresses here once account services are connected.",
	},
] as const;

export function AccountWorkspace({ state }: { state: AccountState }) {
	const [selected, setSelected] = useState(0);
	const view = views[selected] ?? views[0];
	return (
		<div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
			<div className="mb-8 flex flex-wrap items-start justify-between gap-4">
				<div>
					<h1 className="font-display text-3xl sm:text-4xl">Your account</h1>
					<p className="mt-3 text-sm text-muted-foreground">
						Orders, personal details, and delivery addresses.
					</p>
				</div>
				<Badge variant="outline">
					{state.status === "unavailable"
						? "Account services unavailable"
						: state.status === "signed-out"
							? "Signed out"
							: "Signed in"}
				</Badge>
			</div>
			<div
				role="status"
				className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-lg border bg-secondary/30 p-5"
			>
				<div>
					<p className="text-sm font-medium">Online accounts are not available yet</p>
					<p className="mt-1 text-sm text-muted-foreground">
						Sign-in and customer data will be available when our account services are connected.
					</p>
				</div>
				<Button disabled aria-describedby="account-sign-in-help">
					Sign in
				</Button>
				<span id="account-sign-in-help" className="sr-only">
					Sign-in is disabled until the account backend is connected.
				</span>
			</div>
			<div className="grid gap-6 md:grid-cols-[220px_minmax(0,1fr)]">
				<nav aria-label="Account sections" className="flex gap-1 overflow-x-auto md:flex-col">
					{views.map((item, index) => (
						<Button
							key={item.name}
							variant={selected === index ? "secondary" : "ghost"}
							className="min-h-11 justify-start"
							aria-pressed={selected === index}
							aria-controls="account-content"
							onClick={() => setSelected(index)}
						>
							<item.icon />
							{item.name}
						</Button>
					))}
				</nav>
				<section
					id="account-content"
					aria-labelledby="account-view-title"
					className="flex min-h-72 flex-col items-center justify-center rounded-lg border p-6 text-center sm:p-10"
				>
					<view.icon className="mb-5 size-8 text-muted-foreground" aria-hidden />
					<h2 id="account-view-title" className="font-sans text-xl font-semibold">
						{view.title}
					</h2>
					<p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">{view.text}</p>
					<Button asChild variant="outline" className="mt-6">
						<Link href="/products">Continue shopping</Link>
					</Button>
				</section>
			</div>
		</div>
	);
}
