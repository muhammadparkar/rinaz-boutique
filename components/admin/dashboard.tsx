"use client";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { canEdit } from "@/lib/admin/model";
import { formatMoney } from "@/lib/money";
import { useAdmin } from "./provider";
import { AdminImage, PageHeading } from "./shared";

const money = (amount: string | number) => formatMoney({ amount, currency: "USD", locale: "en-US" });
const sales = [124000, 168000, 146000, 232000, 197000, 281000, 354000];
export function Dashboard() {
	const { state, role } = useAdmin();
	const { products } = state.draft;
	const variants = products.flatMap((p) => p.variants.map((v) => ({ ...v, product: p })));
	const low = variants.filter((v) => v.stock <= state.threshold);
	return (
		<>
			<PageHeading
				title="The studio, at a glance."
				description="A considered view of your collection, content, and daily operations."
			>
				<Badge variant="outline">Sample business data</Badge>
			</PageHeading>
			<section className="mb-8 grid grid-cols-2 border-y lg:grid-cols-4" aria-label="Sample business metrics">
				{[
					{ label: "Revenue this month", value: money(2846500), note: "+12.8% vs. sample prior month" },
					{ label: "Orders this month", value: "38", note: "6 awaiting fulfillment · sample" },
					{ label: "Successful payments", value: "35 / 38", note: "2 pending · 1 failed · sample" },
					{ label: "Average order value", value: money(74908), note: "USD · sample orders" },
				].map((metric, index) => (
					<div key={metric.label} className={`py-6 px-4 sm:px-6 ${index ? "border-l" : ""}`}>
						<p className="text-xs text-muted-foreground">{metric.label}</p>
						<p className="mt-3 text-2xl font-medium tabular-nums sm:text-3xl">{metric.value}</p>
						<p className="mt-3 text-[11px] text-muted-foreground">{metric.note}</p>
					</div>
				))}
			</section>
			<div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.6fr_1fr]">
				<section className="rounded-lg border bg-background p-5 sm:p-7">
					<div className="flex justify-between gap-3">
						<div>
							<h2 className="text-xl">A week in the studio</h2>
							<p className="mt-1 text-xs text-muted-foreground">Sample daily revenue · USD</p>
						</div>
						<Badge variant="secondary">7 days</Badge>
					</div>
					<fieldset
						className="mt-10 flex min-w-0 h-52 items-end gap-3 sm:gap-6"
						aria-label="Sample revenue by day"
					>
						{sales.map((amount, index) => (
							<div key={index} className="flex h-full min-w-0 flex-1 flex-col justify-end gap-2">
								<span className="text-center text-[9px] tabular-nums text-muted-foreground sm:text-[11px]">
									{money(amount)}
								</span>
								<div className="rounded-t bg-foreground/85" style={{ height: `${amount / 4000}%` }} />
								<span className="text-center text-[11px] text-muted-foreground">
									{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}
								</span>
							</div>
						))}
					</fieldset>
				</section>
				<section className="relative overflow-hidden rounded-lg bg-secondary p-7">
					<p className="text-[10px] tracking-[0.2em] text-muted-foreground">YOUR NEXT CHAPTER</p>
					<h2 className="mt-6 max-w-xs text-3xl leading-tight">
						Shape the story.
						<br />
						Curate the collection.
					</h2>
					<p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
						Keep your campaigns, imagery, and products as considered as the pieces themselves.
					</p>
					{canEdit(role, "cms") && (
						<Button asChild className="mt-7">
							<Link href="/admin/cms">
								Edit website content
								<ArrowUpRight />
							</Link>
						</Button>
					)}
					{canEdit(role, "catalog") && (
						<Link
							href="/admin/products"
							className="mt-4 flex items-center gap-2 text-xs underline underline-offset-4"
						>
							Manage the collection
							<ArrowRight size={13} />
						</Link>
					)}
				</section>
			</div>
			<div className="my-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
				{[
					{ label: "Products in the catalog", value: products.length },
					{ label: "Units in inventory", value: variants.reduce((sum, v) => sum + v.stock, 0) },
					{ label: "Variants at low stock", value: low.length },
				].map((item) => (
					<div
						key={item.label}
						className="flex items-center justify-between rounded-lg border bg-background px-5 py-4"
					>
						<span className="text-xs text-muted-foreground">{item.label}</span>
						<span className="text-xl tabular-nums">{item.value}</span>
					</div>
				))}
			</div>
			<div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
				<section>
					<h2 className="mb-4 text-xl">Inventory watch</h2>
					<div className="divide-y rounded-lg border bg-background">
						{low.slice(0, 4).map((v) => (
							<div key={v.id} className="flex items-center gap-4 p-4">
								<AdminImage
									src={v.product.images[0] || ""}
									alt={v.product.name}
									className="h-14 w-11 rounded object-cover"
									sizes="44px"
								/>
								<div className="min-w-0 flex-1">
									<p className="truncate text-sm font-medium">{v.product.name}</p>
									<p className="mt-1 text-xs text-muted-foreground">{v.label}</p>
								</div>
								<Badge variant="outline">{v.stock} left</Badge>
							</div>
						))}
						{!low.length && (
							<p className="p-5 text-sm text-muted-foreground">
								All variants are above the low-stock threshold.
							</p>
						)}
					</div>
				</section>
				<section>
					<h2 className="mb-4 text-xl">Studio activity</h2>
					<div className="divide-y rounded-lg border bg-background">
						{state.activity.slice(0, 5).map((a) => (
							<div key={a.id} className="p-4">
								<p className="text-sm">{a.message}</p>
								<p className="mt-1 text-xs text-muted-foreground">
									{a.role} · {new Date(a.at).toLocaleString()}
								</p>
							</div>
						))}
						{!state.activity.length && (
							<div className="p-6">
								<p className="text-sm">Your workspace is ready.</p>
								<p className="mt-2 text-xs text-muted-foreground">
									Saved edits and demo publishing will appear here.
								</p>
							</div>
						)}
					</div>
				</section>
			</div>
		</>
	);
}
