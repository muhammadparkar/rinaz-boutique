"use client";
import { useState } from "react";
import { ArrowDown, ArrowUp, Eye, EyeOff, GripVertical, Pencil } from "@/components/admin/preset-icons";
import { Button } from "@/components/admin/ui/button";
import { Checkbox } from "@/components/admin/ui/checkbox";
import { Label } from "@/components/admin/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/admin/ui/popover";
import type { Product, Section } from "@/lib/admin/model";
import { safeHref } from "@/lib/admin/model";
import type { EditorMessage } from "@/lib/admin/visual-editor";
import type { HeroSlide } from "@/lib/storefront-content";
import { Field, MediaPicker } from "./shared";

export function PreviewSectionEditor({
	section,
	slide,
	enabled,
	scale,
	selected,
	previousId,
	nextId,
	products,
	children,
}: {
	section: Section;
	slide?: HeroSlide;
	enabled: boolean;
	scale: number;
	selected: boolean;
	previousId?: string;
	nextId?: string;
	products: Product[];
	children: React.ReactNode;
}) {
	const [open, setOpen] = useState(false);
	const [invalidUrl, setInvalidUrl] = useState<string | null>(null);
	const send = (message: EditorMessage) => window.parent.postMessage(message, window.location.origin);
	const select = () =>
		send({ type: "rinaz-editor", kind: "select", id: section.id, ...(slide ? { slideId: slide.id } : {}) });
	const update = (field: string, value: string) =>
		send({
			type: "rinaz-editor",
			kind: slide ? "slide" : "section",
			id: slide?.id || section.id,
			field,
			value,
		});
	const heading = slide?.title ?? section.title;
	return (
		<section
			id={`preview-section-${section.id}`}
			data-editor-section={enabled ? section.id : undefined}
			aria-label={enabled ? `Edit ${section.title} section` : undefined}
			tabIndex={enabled ? 0 : undefined}
			className={`relative scroll-mt-16 ${enabled ? "group/editor outline-offset-[-2px] hover:outline hover:outline-2 hover:outline-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary" : ""} ${enabled && selected ? "outline outline-2 outline-primary" : ""}`}
			onDragOver={
				enabled
					? (event) => {
							if (event.dataTransfer.types.includes("application/x-rinaz-section")) event.preventDefault();
						}
					: undefined
			}
			onDrop={
				enabled
					? (event) => {
							const source = event.dataTransfer.getData("application/x-rinaz-section");
							if (!source) return;
							event.preventDefault();
							send({ type: "rinaz-editor", kind: "move", id: source, target: section.id });
						}
					: undefined
			}
			onClickCapture={
				enabled
					? (event) => {
							const target = event.target;
							if (
								!(target instanceof Element) ||
								target.closest("[data-editor-controls],button,input,textarea,select,label,[role=combobox]")
							)
								return;
							select();
							if (target.closest("h1,h2,h3,h4,p,img,a,article") || target === event.currentTarget) {
								event.preventDefault();
								event.stopPropagation();
								setOpen(true);
							}
						}
					: undefined
			}
			onKeyDown={
				enabled
					? (event) => {
							if (event.target === event.currentTarget && (event.key === "Enter" || event.key === " ")) {
								event.preventDefault();
								select();
								setOpen(true);
							}
						}
					: undefined
			}
		>
			{section.enabled ? (
				children
			) : (
				<div className="min-h-24 border border-dashed p-8 text-center text-sm text-muted-foreground">
					{section.title} (hidden)
				</div>
			)}
			{enabled && (
				<div
					data-editor-controls
					className="absolute top-3 left-3 z-40 flex gap-1"
					style={{ zoom: 1 / scale }}
				>
					<Button
						variant="secondary"
						size="icon-sm"
						draggable
						aria-label={`Drag ${section.title} to reorder`}
						onDragStart={(event) => {
							event.dataTransfer.setData("application/x-rinaz-section", section.id);
							event.dataTransfer.effectAllowed = "move";
						}}
					>
						<GripVertical />
					</Button>
					<Button
						variant="secondary"
						size="icon-sm"
						disabled={!previousId}
						aria-label={`Move ${section.title} up`}
						onClick={() =>
							previousId && send({ type: "rinaz-editor", kind: "move", id: section.id, target: previousId })
						}
					>
						<ArrowUp />
					</Button>
					<Button
						variant="secondary"
						size="icon-sm"
						disabled={!nextId}
						aria-label={`Move ${section.title} down`}
						onClick={() =>
							nextId && send({ type: "rinaz-editor", kind: "move", id: section.id, target: nextId })
						}
					>
						<ArrowDown />
					</Button>
					<Button
						variant="secondary"
						size="icon-sm"
						aria-label={`${section.enabled ? "Hide" : "Show"} ${section.title}`}
						onClick={() =>
							send({ type: "rinaz-editor", kind: "visibility", id: section.id, enabled: !section.enabled })
						}
					>
						{section.enabled ? <EyeOff /> : <Eye />}
					</Button>
					<Popover
						open={open}
						onOpenChange={(next) => {
							setOpen(next);
							if (next) select();
							else setInvalidUrl(null);
						}}
					>
						<PopoverTrigger asChild>
							<Button
								size="sm"
								variant="secondary"
								className={`shadow-md ${selected ? "" : "opacity-0 group-hover/editor:opacity-100 group-focus-within/editor:opacity-100"}`}
								aria-label={`${section.type === "hero" ? "Edit campaign" : "Edit section"}: ${section.title}`}
							>
								<Pencil />
								{section.type === "hero" ? "Edit campaign" : "Edit section"}
							</Button>
						</PopoverTrigger>
						<PopoverContent
							align="start"
							side="bottom"
							className="w-[360px] overflow-y-auto"
							style={{
								zoom: 1 / scale,
								maxWidth: `calc(100vw * ${scale} - 32px)`,
								maxHeight: `calc(70vh * ${scale})`,
							}}
							onEscapeKeyDown={() => setOpen(false)}
						>
							<div data-editor-controls className="space-y-4">
								<h3 className="font-sans text-sm font-semibold">
									{section.type === "hero" ? "Campaign content" : "Section content"}
								</h3>
								<p className="text-xs text-muted-foreground">
									Live draft edits. Save and publish from the CMS.
								</p>
								<Field
									label={section.type === "trust" ? "Section label" : "Heading"}
									value={heading}
									onChange={(value) => update("title", value)}
								/>
								{slide && (
									<Field
										label="Accent line"
										value={slide.accent}
										onChange={(value) => update("accent", value)}
									/>
								)}
								<Field
									label="Copy"
									multiline
									value={slide?.copy ?? section.text}
									onChange={(value) => update(slide ? "copy" : "text", value)}
								/>
								{slide
									? slide.images.map((image, index) => (
											<MediaPicker
												key={index === 0 ? "first" : "second"}
												label={`Campaign image ${index + 1}`}
												value={image.src}
												allowEmpty={false}
												onChange={(value) => update(`image${index}`, value)}
											/>
										))
									: (section.type === "feature" || section.id === "pairings") && (
											<MediaPicker
												label="Section image"
												value={section.image}
												onChange={(value) => update("image", value)}
											/>
										)}
								{(slide || section.ctaHref) && (
									<>
										<Field
											label="CTA label"
											value={slide?.cta.label ?? section.ctaLabel}
											onChange={(value) => update("ctaLabel", value)}
										/>
										<Field
											label="CTA destination"
											value={invalidUrl ?? slide?.cta.href ?? section.ctaHref}
											onChange={(value) => {
												if (!safeHref(value)) setInvalidUrl(value);
												else {
													setInvalidUrl(null);
													update("ctaHref", value);
												}
											}}
										/>
										{invalidUrl !== null && (
											<p role="alert" className="text-sm text-destructive">
												Use a local path, HTTPS, email, or telephone link.
											</p>
										)}
									</>
								)}
								{section.type === "products" && (
									<fieldset className="space-y-2">
										<legend className="mb-2 text-sm font-medium">Featured products</legend>
										{products.map((p) => (
											<div className="flex items-center gap-2" key={p.id}>
												<Checkbox
													id={`canvas-product-${section.id}-${p.id}`}
													checked={section.productIds.includes(p.id)}
													onCheckedChange={(checked) =>
														send({
															type: "rinaz-editor",
															kind: "products",
															id: section.id,
															ids:
																checked === true
																	? [...section.productIds, p.id]
																	: section.productIds.filter((id) => id !== p.id),
														})
													}
												/>
												<Label htmlFor={`canvas-product-${section.id}-${p.id}`}>{p.name}</Label>
											</div>
										))}
									</fieldset>
								)}
								<Button
									variant="outline"
									size="sm"
									onClick={() => {
										setInvalidUrl(null);
										setOpen(false);
									}}
								>
									Done
								</Button>
							</div>
						</PopoverContent>
					</Popover>
				</div>
			)}
		</section>
	);
}
