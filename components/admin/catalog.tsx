"use client";
import { ArrowLeft, Plus, Search } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Category, Product, Variant } from "@/lib/admin/model";
import { formatMoney } from "@/lib/money";
import { useAdmin } from "./provider";
import { AdminImage, Confirm, EmptyState, Field, MediaPicker, PageHeading, SelectField } from "./shared";

const money = (amount: string) => formatMoney({ amount, currency: "USD", locale: "en-US" });
const newVariant = (): Variant => ({
	id: crypto.randomUUID(),
	sku: "",
	label: "Default",
	price: "0",
	originalPrice: "0",
	stock: 0,
	images: [],
	attributes: {},
});
function ProductEditor({ original, onClose }: { original: Product; onClose: () => void }) {
	const { state, commit, setDirty, dirty } = useAdmin();
	const [product, setProduct] = useState(original);
	const edit = (next: Product) => {
		setProduct(next);
		setDirty(true);
	};
	const variant = (id: string, patch: Partial<Variant>) =>
		edit({ ...product, variants: product.variants.map((v) => (v.id === id ? { ...v, ...patch } : v)) });
	const close = () => {
		if (!dirty || window.confirm("Discard unsaved product edits?")) {
			setDirty(false);
			onClose();
		}
	};
	const save = () => {
		const prior = state.draft.products.find((p) => p.id === product.id);
		const changes = product.variants
			.filter((v) => prior?.variants.find((p) => p.id === v.id)?.stock !== v.stock)
			.map((v) => ({
				id: crypto.randomUUID(),
				variantId: v.id,
				productName: product.name,
				before: prior?.variants.find((p) => p.id === v.id)?.stock || 0,
				after: v.stock,
				reason: "Stock set in product editor",
				at: new Date().toISOString(),
			}));
		const products = prior
			? state.draft.products.map((p) => (p.id === product.id ? product : p))
			: [...state.draft.products, product];
		if (
			commit(
				{ ...state, draft: { ...state.draft, products }, adjustments: [...changes, ...state.adjustments] },
				"Product draft saved",
				"catalog",
			)
		)
			onClose();
	};
	return (
		<>
			<PageHeading
				title={original.name || "A new addition"}
				description="Product edits are drafts until an Owner publishes the demo."
			>
				<Button variant="outline" onClick={close}>
					<ArrowLeft />
					Back
				</Button>
				<Button onClick={save}>Save product draft</Button>
			</PageHeading>
			<div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.5fr_1fr]">
				<section className="space-y-6 rounded-lg border bg-background p-6">
					<h2 className="text-xl">Product details</h2>
					<Field
						label="Product name"
						value={product.name}
						onChange={(name) => edit({ ...product, name })}
						required
					/>
					<Field label="URL slug" value={product.slug} onChange={(slug) => edit({ ...product, slug })} />
					<Field
						label="Description"
						value={product.summary}
						onChange={(summary) => edit({ ...product, summary })}
						multiline
					/>
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<SelectField
							label="Category"
							value={product.categoryId}
							onChange={(categoryId) => edit({ ...product, categoryId })}
							options={[
								{ value: "", label: "Select a category" },
								...state.draft.categories.map((c) => ({ value: c.id, label: c.name })),
							]}
						/>
						<SelectField
							label="Visibility"
							value={product.status}
							onChange={(status) => edit({ ...product, status: status as Product["status"] })}
							options={["published", "draft", "archived"].map((value) => ({ value, label: value }))}
						/>
					</div>
				</section>
				<section className="space-y-4 rounded-lg border bg-background p-6">
					<h2 className="text-xl">Product imagery</h2>
					{product.images.map((src, index) => (
						<div key={`${src}-${index}`} className="space-y-2">
							<AdminImage src={src} alt={product.name} className="h-40 w-full rounded object-cover" />
							<MediaPicker
								label={`Image ${index + 1}`}
								value={src}
								allowEmpty={false}
								onChange={(next) =>
									edit({ ...product, images: product.images.map((image, i) => (i === index ? next : image)) })
								}
							/>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => edit({ ...product, images: product.images.filter((_, i) => i !== index) })}
							>
								Remove image
							</Button>
						</div>
					))}
					<Button
						variant="outline"
						onClick={() => {
							const first = state.media[0];
							if (first) edit({ ...product, images: [...product.images, first.src] });
						}}
						disabled={!state.media.length}
					>
						Add image from library
					</Button>
				</section>
			</div>
			<section className="mt-8 rounded-lg border bg-background p-6">
				<div className="mb-6 flex flex-wrap items-center justify-between gap-3">
					<div>
						<h2 className="text-xl">Variants & pricing</h2>
						<p className="mt-1 text-xs text-muted-foreground">
							Prices in USD minor units: 68000 = $680.00. Sale price must not exceed original price.
						</p>
					</div>
					<Button
						variant="outline"
						onClick={() => edit({ ...product, variants: [...product.variants, newVariant()] })}
					>
						<Plus />
						Add variant
					</Button>
				</div>
				<div className="space-y-6">
					{product.variants.map((v) => (
						<div key={v.id} className="space-y-4 border-t pt-5">
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
								<Field label="Variant label" value={v.label} onChange={(label) => variant(v.id, { label })} />
								<Field label="Unique SKU" value={v.sku} onChange={(sku) => variant(v.id, { sku })} />
								<Field
									label="Sale / current price"
									value={v.price}
									onChange={(price) => variant(v.id, { price })}
								/>
								<Field
									label="Original price"
									value={v.originalPrice}
									onChange={(originalPrice) => variant(v.id, { originalPrice })}
								/>
								<Field
									label="Stock units"
									value={v.stock}
									type="number"
									min={0}
									step={1}
									onChange={(stock) => variant(v.id, { stock: Number(stock) })}
								/>
							</div>
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
								<Field
									label="Size attribute"
									value={v.attributes.Size || ""}
									onChange={(Size) => variant(v.id, { attributes: { ...v.attributes, Size } })}
								/>
								<MediaPicker
									label="Variant image"
									value={v.images[0] || ""}
									onChange={(src) => variant(v.id, { images: src ? [src] : [] })}
								/>
							</div>
							<Button
								variant="ghost"
								size="sm"
								disabled={product.variants.length < 2}
								onClick={() =>
									edit({ ...product, variants: product.variants.filter((item) => item.id !== v.id) })
								}
							>
								Remove variant
							</Button>
						</div>
					))}
				</div>
			</section>
		</>
	);
}
export function Products() {
	const { state, commit, setDirty } = useAdmin();
	const [editing, setEditing] = useState<Product | null>(null);
	const [query, setQuery] = useState("");
	const [status, setStatus] = useState("all");
	if (editing) return <ProductEditor key={editing.id} original={editing} onClose={() => setEditing(null)} />;
	const filtered = state.draft.products.filter(
		(p) =>
			`${p.name} ${p.variants.map((v) => v.sku).join(" ")}`.toLowerCase().includes(query.toLowerCase()) &&
			(status === "all" || p.status === status),
	);
	return (
		<>
			<PageHeading
				title="The collection"
				description="Manage your pieces, pricing, and the details that make them distinct."
			>
				<Button
					onClick={() => {
						setDirty(false);
						setEditing({
							id: crypto.randomUUID(),
							name: "",
							slug: "",
							summary: "",
							categoryId: state.draft.categories[0]?.id || "",
							status: "draft",
							images: [],
							variants: [newVariant()],
						});
					}}
				>
					<Plus />
					Add product
				</Button>
			</PageHeading>
			<div className="mb-5 flex flex-wrap items-end gap-4">
				<div className="relative max-w-sm flex-1">
					<Search className="absolute left-3 top-3 text-muted-foreground" size={15} />
					<Input
						aria-label="Search products"
						placeholder="Search name or SKU…"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						className="pl-9"
					/>
				</div>
				<SelectField
					label="Product status"
					value={status}
					onChange={setStatus}
					options={["all", "published", "draft", "archived"].map((value) => ({ value, label: value }))}
				/>
			</div>
			{filtered.length ? (
				<div className="overflow-hidden rounded-lg border bg-background">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Product</TableHead>
								<TableHead>Category</TableHead>
								<TableHead>Price from</TableHead>
								<TableHead>Stock</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filtered.map((p) => (
								<TableRow key={p.id}>
									<TableCell>
										<div className="flex min-w-56 items-center gap-3">
											<AdminImage
												src={p.images[0] || ""}
												alt={p.name}
												className="h-16 w-12 shrink-0 rounded object-cover"
												sizes="48px"
											/>
											<div>
												<button
													type="button"
													className="text-left font-medium hover:underline"
													onClick={() => setEditing(p)}
												>
													{p.name}
												</button>
												<p className="mt-1 text-xs text-muted-foreground">{p.variants.length} variants</p>
											</div>
										</div>
									</TableCell>
									<TableCell>{state.draft.categories.find((c) => c.id === p.categoryId)?.name}</TableCell>
									<TableCell>{money(String(Math.min(...p.variants.map((v) => Number(v.price)))))}</TableCell>
									<TableCell>{p.variants.reduce((sum, v) => sum + v.stock, 0)}</TableCell>
									<TableCell>
										<Badge variant="outline">{p.status}</Badge>
									</TableCell>
									<TableCell>
										<div className="flex gap-2">
											<Button variant="outline" size="sm" onClick={() => setEditing(p)}>
												Edit
											</Button>
											<Button
												variant="ghost"
												size="sm"
												onClick={() =>
													commit(
														{
															...state,
															draft: {
																...state.draft,
																products: state.draft.products.map((item) =>
																	item.id === p.id ? { ...item, status: "archived" } : item,
																),
															},
														},
														"Product archived in draft",
														"catalog",
													)
												}
											>
												Archive
											</Button>
											<Confirm
												label="Delete"
												title="Delete product draft?"
												description="Removes the product and its draft featured selections. The published snapshot remains unchanged until publishing."
												onConfirm={() =>
													commit(
														{
															...state,
															draft: {
																...state.draft,
																products: state.draft.products.filter((item) => item.id !== p.id),
																content: {
																	...state.draft.content,
																	sections: state.draft.content.sections.map((s) => ({
																		...s,
																		productIds: s.productIds.filter((id) => id !== p.id),
																	})),
																},
															},
														},
														"Product deleted from draft",
														"catalog",
													)
												}
											/>
										</div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			) : (
				<EmptyState
					title="No pieces found"
					description="Adjust your filters or add the first product to your collection."
				/>
			)}
		</>
	);
}
function CategoryEditor({ original, onClose }: { original: Category; onClose: () => void }) {
	const { state, commit, setDirty, dirty } = useAdmin();
	const [category, setCategory] = useState(original);
	const edit = (patch: Partial<Category>) => {
		setCategory({ ...category, ...patch });
		setDirty(true);
	};
	return (
		<>
			<PageHeading
				title={original.name || "New category"}
				description="Organize the collection with clear names and thoughtful imagery."
			>
				<Button
					variant="outline"
					onClick={() => {
						if (!dirty || window.confirm("Discard category edits?")) {
							setDirty(false);
							onClose();
						}
					}}
				>
					Back
				</Button>
				<Button
					onClick={() => {
						const exists = state.draft.categories.some((c) => c.id === category.id);
						if (
							commit(
								{
									...state,
									draft: {
										...state.draft,
										categories: exists
											? state.draft.categories.map((c) => (c.id === category.id ? category : c))
											: [...state.draft.categories, category],
									},
								},
								"Category draft saved",
								"catalog",
							)
						)
							onClose();
					}}
				>
					Save category draft
				</Button>
			</PageHeading>
			<div className="max-w-2xl space-y-6 rounded-lg border bg-background p-6">
				<Field label="Category name" value={category.name} onChange={(name) => edit({ name })} />
				<Field label="URL slug" value={category.slug} onChange={(slug) => edit({ slug })} />
				<SelectField
					label="Parent category"
					value={category.parentId || ""}
					onChange={(parentId) => edit({ parentId: parentId || null })}
					options={[
						{ value: "", label: "Top-level category" },
						...state.draft.categories
							.filter((c) => c.id !== category.id)
							.map((c) => ({ value: c.id, label: c.name })),
					]}
				/>
				<Field
					label="Display position"
					type="number"
					min={0}
					step={1}
					value={category.position}
					onChange={(position) => edit({ position: Number(position) })}
				/>
				<SelectField
					label="Visibility"
					value={String(category.active)}
					onChange={(active) => edit({ active: active === "true" })}
					options={[
						{ value: "true", label: "Visible" },
						{ value: "false", label: "Hidden" },
					]}
				/>
				<MediaPicker label="Category image" value={category.image} onChange={(image) => edit({ image })} />
				<AdminImage src={category.image} alt={category.name} className="h-64 w-full rounded object-cover" />
			</div>
		</>
	);
}
export function Categories() {
	const { state, commit } = useAdmin();
	const [editing, setEditing] = useState<Category | null>(null);
	if (editing) return <CategoryEditor key={editing.id} original={editing} onClose={() => setEditing(null)} />;
	return (
		<>
			<PageHeading
				title="Worlds within the studio"
				description="Create a considered hierarchy for your collections."
			>
				<Button
					onClick={() =>
						setEditing({
							id: crypto.randomUUID(),
							name: "",
							slug: "",
							parentId: null,
							image: "",
							active: true,
							position: state.draft.categories.length,
						})
					}
				>
					<Plus />
					Add category
				</Button>
			</PageHeading>
			<div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
				{[...state.draft.categories]
					.sort((a, b) => a.position - b.position)
					.map((c) => (
						<article key={c.id} className="overflow-hidden rounded-lg border bg-background">
							<AdminImage src={c.image} alt={c.name} className="h-52 w-full object-cover" />
							<div className="space-y-4 p-5">
								<div className="flex justify-between gap-3">
									<h2 className="text-xl">{c.name}</h2>
									<Badge variant="outline">{c.active ? "Visible" : "Hidden"}</Badge>
								</div>
								<p className="text-xs text-muted-foreground">
									{c.parentId
										? state.draft.categories.find((item) => item.id === c.parentId)?.name
										: "Top-level"}{" "}
									· Position {c.position} · {state.draft.products.filter((p) => p.categoryId === c.id).length}{" "}
									products
								</p>
								<div className="flex gap-2">
									<Button variant="outline" size="sm" onClick={() => setEditing(c)}>
										Edit category
									</Button>
									<Confirm
										label="Delete"
										title="Delete category?"
										description="Categories with products or child categories must be reassigned before deletion."
										onConfirm={() => {
											if (
												state.draft.products.some((p) => p.categoryId === c.id) ||
												state.draft.categories.some((item) => item.parentId === c.id)
											) {
												window.alert("Reassign products and child categories first.");
												return;
											}
											commit(
												{
													...state,
													draft: {
														...state.draft,
														categories: state.draft.categories.filter((item) => item.id !== c.id),
													},
												},
												"Category deleted from draft",
												"catalog",
											);
										}}
									/>
								</div>
							</div>
						</article>
					))}
			</div>
			{!state.draft.categories.length && (
				<EmptyState
					title="Your category structure starts here"
					description="Add a category before adding products."
				/>
			)}
		</>
	);
}
