"use client";
import { useState } from "react";
import { ChevronDown, SlidersHorizontal } from "@/components/admin/preset-icons";
import { Badge } from "@/components/admin/ui/badge";
import { Button } from "@/components/admin/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/admin/ui/dialog";
import { Input } from "@/components/admin/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/admin/ui/table";
import { useAdmin } from "./provider";
import { EmptyState, Field, PageHeading, SelectField } from "./shared";
export function Inventory() {
	const { state, commit, setDirty } = useAdmin();
	const [adjusting, setAdjusting] = useState(false);
	const [threshold, setThreshold] = useState(state.threshold);
	const [selected, setSelected] = useState("");
	const [stock, setStock] = useState(0);
	const [reason, setReason] = useState("");
	const [filter, setFilter] = useState("all");
	const variants = state.draft.products.flatMap((p) =>
		p.variants.map((v) => ({ ...v, productName: p.name })),
	);
	const visible = variants.filter(
		(v) => filter === "all" || (filter === "out" ? v.stock === 0 : v.stock <= state.threshold),
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
			setAdjusting(false);
			setSelected("");
			setReason("");
		}
	};
	return (
		<>
			<PageHeading
				title="Inventory"
				description="Review stock and record adjustments. Changes save to your draft catalog."
			/>
			<div className="mb-6">
				<Dialog
					open={adjusting}
					onOpenChange={(open) => {
						if (
							!open &&
							(reason.trim() || stock !== variants.find((v) => v.id === selected)?.stock) &&
							!window.confirm("Discard this stock adjustment?")
						)
							return;
						setAdjusting(open);
						if (!open) {
							setReason("");
							setSelected("");
							setDirty(threshold !== state.threshold);
						}
					}}
				>
					<DialogContent className="admin-workspace admin-content-theme max-h-[90dvh] overflow-y-auto">
						<DialogHeader>
							<DialogTitle>Adjust stock</DialogTitle>
							<DialogDescription>Set the new quantity and record why it changed.</DialogDescription>
						</DialogHeader>
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
					</DialogContent>
				</Dialog>
				<details className="group max-w-lg rounded-lg border bg-background p-4 transition-colors">
					<summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium select-none [&::-webkit-details-marker]:hidden">
						<span className="flex items-center gap-2">
							<SlidersHorizontal className="size-4 text-muted-foreground" />
							<span>Low-stock settings</span>
						</span>
						<ChevronDown className="size-4 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
					</summary>
					<div className="mt-4 space-y-4 border-t pt-4">
						<p className="text-xs text-muted-foreground leading-relaxed">
							A variant is flagged when its stock is at or below this threshold.
						</p>
						<div className="flex flex-wrap items-end gap-3">
							<div className="w-36 space-y-1.5">
								<label htmlFor="inv-threshold" className="text-xs font-medium text-muted-foreground">
									Low-stock threshold
								</label>
								<Input
									id="inv-threshold"
									type="number"
									min={0}
									step={1}
									value={threshold}
									onChange={(e) => {
										setThreshold(Number(e.target.value));
										setDirty(true);
									}}
								/>
							</div>
							<Button
								variant="outline"
								onClick={() => commit({ ...state, threshold }, "Low-stock threshold saved", "catalog")}
							>
								Save threshold
							</Button>
						</div>
						<div className="flex items-center gap-2.5 rounded-md bg-muted/40 px-3.5 py-2.5 text-xs text-muted-foreground">
							<span className="text-base font-semibold text-foreground tabular-nums">
								{variants.filter((v) => v.stock <= state.threshold).length}
							</span>
							<span>variants currently need attention</span>
						</div>
					</div>
				</details>
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
			<div className="overflow-hidden rounded-lg border bg-background">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Product / Variant</TableHead>
							<TableHead>SKU</TableHead>
							<TableHead>Available</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>
								<span className="sr-only">Actions</span>
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{visible.map((v) => (
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
								<TableCell>
									<Button
										variant="outline"
										size="sm"
										onClick={() => {
											setSelected(v.id);
											setStock(v.stock);
											setReason("");
											setAdjusting(true);
										}}
									>
										Adjust stock
									</Button>
								</TableCell>
							</TableRow>
						))}
						{!visible.length && (
							<TableRow>
								<TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
									No variants match this stock status.
								</TableCell>
							</TableRow>
						)}
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
					title="No adjustments yet"
					description="Each stock change records the count, reason, and time."
				/>
			)}
		</>
	);
}
