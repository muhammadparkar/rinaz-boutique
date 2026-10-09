"use client";
import Link from "next/link";
import { ArrowRight, BarChart3, ChevronDown } from "@/components/admin/preset-icons";
import { Badge } from "@/components/admin/ui/badge";
import { Button } from "@/components/admin/ui/button";
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
			<PageHeading title="Overview" description="Manage your catalog, stock, and website.">
				<Badge variant="outline">Browser-local demo</Badge>
			</PageHeading>
			<div className="mb-6 flex flex-wrap gap-2">
				{canEdit(role, "catalog") && (
					<Button asChild>
						<Link href="/admin/products">
							Manage products <ArrowRight />
						</Link>
					</Button>
				)}
				{canEdit(role, "catalog") && (
					<Button asChild variant="outline">
						<Link href="/admin/inventory">Adjust stock</Link>
					</Button>
				)}
				{canEdit(role, "cms") && (
					<Button asChild variant="outline">
						<Link href="/admin/cms">Edit website</Link>
					</Button>
				)}
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
					<div className="mb-4 flex items-center justify-between gap-2">
						<h2 className="font-sans text-base font-semibold">Low stock</h2>
						{canEdit(role, "catalog") && (
							<Button asChild variant="outline" size="sm">
								<Link href="/admin/inventory">Review inventory</Link>
							</Button>
						)}
					</div>
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
					<h2 className="mb-4 font-sans text-base font-semibold">Recent activity</h2>
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
			<details className="group mt-8 border-t pt-4">
				<summary className="flex cursor-pointer list-none items-center justify-between py-2 text-sm font-medium select-none [&::-webkit-details-marker]:hidden">
					<span className="flex items-center gap-2">
						<BarChart3 className="size-4 text-muted-foreground" />
						<span>Sample sales report</span>
					</span>
					<ChevronDown className="size-4 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
				</summary>
				<section
					className="mb-8 grid grid-cols-2 border-y lg:grid-cols-4"
					aria-label="Sample business metrics"
				>
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
				<section className="rounded-lg border bg-background p-5 sm:p-7">
					<div className="flex justify-between gap-3">
						<div>
							<h2 className="text-xl">Daily revenue</h2>
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
			</details>
		</>
	);
}
