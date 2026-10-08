"use client";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAdmin } from "./provider";
import { EmptyState, Field, PageHeading, SelectField } from "./shared";
export function Inventory() {
	const { state, commit, setDirty } = useAdmin();
	const [threshold, setThreshold] = useState(state.threshold);
	const [selected, setSelected] = useState("");
	const [stock, setStock] = useState(0);
	const [reason, setReason] = useState("");
	const [filter, setFilter] = useState("all");
	const variants = state.draft.products.flatMap((p) =>
		p.variants.map((v) => ({ ...v, productName: p.name })),
	);
	const adjust = () => {
		const v = variants.find((v) => v.id === selected);
		if (!v || !reason.trim() || !Number.isSafeInteger(stock) || stock < 0) {
			window.alert("Select a variant, enter a nonnegative whole stock count, and provide a reason.");
			return;
		}
		if (
			commit(
				{
					...state,
					draft: {
						...state.draft,
						products: state.draft.products.map((p) => ({
							...p,
							variants: p.variants.map((item) => (item.id === v.id ? { ...item, stock } : item)),
						})),
					},
					adjustments: [
						{
							id: crypto.randomUUID(),
							variantId: v.id,
							productName: v.productName,
							before: v.stock,
							after: stock,
							reason: reason.trim(),
							at: new Date().toISOString(),
						},
						...state.adjustments,
					],
				},
				"Inventory draft adjusted",
				"catalog",
			)
		) {
			setSelected("");
			setReason("");
		}
	};
	return (
		<>
			<PageHeading
				title="Every piece accounted for"
				description="Track stock by variant. Adjustments affect the draft catalog until demo publishing."
			/>
			<div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
				<section className="space-y-4 rounded-lg border bg-background p-6">
					<h2 className="text-xl">Stock adjustment</h2>
					<SelectField
						label="Variant"
						value={selected}
						onChange={(id) => {
							setSelected(id);
							setStock(variants.find((v) => v.id === id)?.stock || 0);
							setDirty(true);
						}}
						options={[
							{ value: "", label: "Select a variant" },
							...variants.map((v) => ({ value: v.id, label: `${v.productName} / ${v.label}` })),
						]}
					/>
					<Field
						label="New stock count"
						type="number"
						min={0}
						step={1}
						value={stock}
						onChange={(value) => {
							setStock(Number(value));
							setDirty(true);
						}}
					/>
					<Field
						label="Reason for adjustment"
						value={reason}
						onChange={(value) => {
							setReason(value);
							setDirty(true);
						}}
					/>
					<Button onClick={adjust}>Record adjustment</Button>
				</section>
				<section className="space-y-4 rounded-lg border bg-background p-6">
					<h2 className="text-xl">Low-stock alerts</h2>
					<p className="text-sm text-muted-foreground">
						A variant is flagged when its stock is at or below this threshold.
					</p>
					<Field
						label="Low-stock threshold"
						type="number"
						min={0}
						step={1}
						value={threshold}
						onChange={(value) => {
							setThreshold(Number(value));
							setDirty(true);
						}}
					/>
					<Button
						variant="outline"
						onClick={() => commit({ ...state, threshold }, "Low-stock threshold saved", "catalog")}
					>
						Save threshold
					</Button>
					<p className="text-3xl font-display">
						{variants.filter((v) => v.stock <= state.threshold).length}{" "}
						<span className="font-sans text-sm text-muted-foreground">variants need attention</span>
					</p>
				</section>
			</div>
			<div className="mb-4 max-w-xs">
				<SelectField
					label="Stock status"
					value={filter}
					onChange={setFilter}
					options={[
						{ value: "all", label: "All variants" },
						{ value: "low", label: "Low stock" },
						{ value: "out", label: "Out of stock" },
					]}
				/>
			</div>
			<div className="rounded-lg border bg-background">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Product / Variant</TableHead>
							<TableHead>SKU</TableHead>
							<TableHead>Available</TableHead>
							<TableHead>Status</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{variants
							.filter(
								(v) => filter === "all" || (filter === "out" ? v.stock === 0 : v.stock <= state.threshold),
							)
							.map((v) => (
								<TableRow key={v.id}>
									<TableCell>
										<p className="font-medium">{v.productName}</p>
										<p className="mt-1 text-xs text-muted-foreground">{v.label}</p>
									</TableCell>
									<TableCell>{v.sku}</TableCell>
									<TableCell>{v.stock}</TableCell>
									<TableCell>
										<Badge variant="outline">
											{v.stock === 0 ? "Out of stock" : v.stock <= state.threshold ? "Low stock" : "In stock"}
										</Badge>
									</TableCell>
								</TableRow>
							))}
					</TableBody>
				</Table>
			</div>
			<h2 className="mb-4 mt-8 text-xl">Adjustment history</h2>
			{state.adjustments.length ? (
				<div className="divide-y rounded-lg border bg-background">
					{state.adjustments.map((a) => (
						<div key={a.id} className="flex flex-wrap justify-between gap-3 p-4">
							<div>
								<p className="text-sm font-medium">
									{a.productName}: {a.before} → {a.after}
								</p>
								<p className="mt-1 text-xs text-muted-foreground">{a.reason}</p>
							</div>
							<time className="text-xs text-muted-foreground" dateTime={a.at}>
								{new Date(a.at).toLocaleString()}
							</time>
						</div>
					))}
				</div>
			) : (
				<EmptyState
					title="A clear record starts with your first adjustment"
					description="Each stock change records the count, reason, and time."
				/>
			)}
		</>
	);
}
