"use client";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { Section } from "@/lib/admin/model";
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
	children,
}: {
	section: Section;
	slide?: HeroSlide;
	enabled: boolean;
	scale: number;
	selected: boolean;
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
							if (target.closest("h2,p,img,a")) {
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
			{children}
			{enabled && (
				<div data-editor-controls className="absolute top-3 left-3 z-40" style={{ zoom: 1 / scale }}>
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
