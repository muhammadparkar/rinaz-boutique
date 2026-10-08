"use client";
import { ArrowDown, ArrowUp, Check, Eye, GripVertical, Plus, Redo2, Undo2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useReducer, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { type Content, canEdit, type LinkItem } from "@/lib/admin/model";
import {
	applyEditorMessage,
	contentHistory,
	type EditorMessage,
	moveSection,
} from "@/lib/admin/visual-editor";
import { LiveDraftPreview } from "./live-draft-preview";
import { useAdmin } from "./provider";
import { Field, MediaPicker, PageHeading, SelectField } from "./shared";

const tabs = ["Homepage", "Hero slides", "Navigation & footer", "Pages & SEO", "FAQs", "Store details"];
function LinkEditor({ links, onChange }: { links: LinkItem[]; onChange: (links: LinkItem[]) => void }) {
	return (
		<div className="space-y-4">
			{links.map((link) => (
				<div key={link.id} className="grid items-end gap-3 sm:grid-cols-[1fr_1.5fr_auto]">
					<Field
						label="Link label"
						value={link.label}
						onChange={(label) => onChange(links.map((l) => (l.id === link.id ? { ...l, label } : l)))}
					/>
					<Field
						label="Link destination"
						value={link.href}
						onChange={(href) => onChange(links.map((l) => (l.id === link.id ? { ...l, href } : l)))}
					/>
					<Button variant="ghost" onClick={() => onChange(links.filter((l) => l.id !== link.id))}>
						Remove
					</Button>
				</div>
			))}
			<Button
				variant="outline"
				onClick={() => onChange([...links, { id: crypto.randomUUID(), label: "New link", href: "/" }])}
			>
				<Plus />
				Add link
			</Button>
		</div>
	);
}
export function Cms() {
	const { state, role, commit, dirty, setDirty } = useAdmin();
	const [history, dispatch] = useReducer(contentHistory, {
		past: [],
		present: state.draft.content,
		future: [],
	});
	const content = history.present;
	const editable = canEdit(role, "cms");
	const [dragged, setDragged] = useState("");
	const [announcement, setAnnouncement] = useState("");
	const [tab, setTab] = useState(tabs[0]);
	const [sectionId, setSectionId] = useState(content.sections[0]?.id || "");
	const [slideId, setSlideId] = useState(content.slides[0]?.id || "");
	const [pageId, setPageId] = useState("home");
	const edit = (next: Content, group?: string) => {
		if (!editable) return;
		dispatch({ kind: "edit", content: next, group });
	};
	useEffect(
		() => setDirty(JSON.stringify(content) !== JSON.stringify(state.draft.content)),
		[content, state.draft.content, setDirty],
	);
	useEffect(() => {
		const keydown = (event: KeyboardEvent) => {
			if (!editable || !(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== "z") return;
			const target = event.target;
			if (
				target instanceof HTMLElement &&
				(target.isContentEditable || target.closest("input,textarea,select"))
			)
				return;
			event.preventDefault();
			dispatch({ kind: event.shiftKey ? "redo" : "undo" });
		};
		window.addEventListener("keydown", keydown);
		return () => window.removeEventListener("keydown", keydown);
	}, [editable]);
	const fromPreview = (message: EditorMessage) => {
		if (!editable) return;
		if (message.kind === "undo" || message.kind === "redo") {
			dispatch({ kind: message.kind });
			return;
		}
		if (message.kind === "select") {
			const target = content.sections.find((item) => item.id === message.id);
			if (!target) return;
			if (message.slideId && !content.slides.some((slide) => slide.id === message.slideId)) return;
			if (target.type === "hero" && message.slideId) setSlideId(message.slideId);
			setSectionId(target.id);
			setTab(target.type === "hero" ? "Hero slides" : "Homepage");
		} else if (message.kind === "section" || message.kind === "slide") {
			const next = applyEditorMessage(content, state.media, role, message);
			if (next !== content) edit(next, `${message.kind}:${message.id}:${message.field}`);
		}
	};

	const section = content.sections.find((s) => s.id === sectionId);
	const page = content.pages.find((p) => p.id === pageId);
	const saved = () => commit({ ...state, draft: { ...state.draft, content } }, "Website draft saved", "cms");
	const publish = () => {
		if (dirty) {
			toast.error("Save your draft before publishing.");
			return;
		}
		const published =
			role === "Owner"
				? structuredClone(state.draft)
				: { ...state.published, content: structuredClone(state.draft.content) };
		commit(
			{ ...state, published, publishedAt: new Date().toISOString() },
			role === "Owner" ? "Storefront published to local demo" : "Website content published to local demo",
			"cms",
		);
	};
	const updateSection = (patch: Partial<NonNullable<typeof section>>) =>
		edit({
			...content,
			sections: content.sections.map((s) => (s.id === sectionId ? { ...s, ...patch } : s)),
		});

	const reorder = (id: string, direction: number) => {
		const index = content.sections.findIndex((section) => section.id === id);
		const target = content.sections[index + direction];
		if (target) {
			edit(moveSection(content, id, target.id));
			setAnnouncement("Section order updated");
		}
	};

	return (
		<>
			<PageHeading
				title="Tell the studio’s story"
				description="Structured content, considered imagery, and a preview before every demo publish."
			>
				<Button
					variant="outline"
					size="icon-sm"
					aria-label="Undo content edit"
					disabled={!editable || !history.past.length}
					onClick={() => dispatch({ kind: "undo" })}
				>
					<Undo2 />
				</Button>
				<Button
					variant="outline"
					size="icon-sm"
					aria-label="Redo content edit"
					disabled={!editable || !history.future.length}
					onClick={() => dispatch({ kind: "redo" })}
				>
					<Redo2 />
				</Button>
				<Badge variant="outline">{dirty ? "Unsaved edits" : "Draft saved"}</Badge>
				<Button variant="outline" onClick={saved} disabled={!editable}>
					Save draft
				</Button>
				<Button asChild variant="outline">
					<Link href="/admin/preview">
						<Eye />
						Preview
					</Link>
				</Button>
				<Button onClick={publish} disabled={dirty || !editable}>
					<Check />
					Publish to demo
				</Button>
			</PageHeading>
			<p className="mb-6 text-xs text-muted-foreground">
				{state.publishedAt
					? `Last demo publish: ${new Date(state.publishedAt).toLocaleString()}`
					: "No changes published yet."}{" "}
				{role === "Editor" && "Editors publish content only; an Owner publishes catalog changes."}
			</p>
			<p role="status" className="sr-only">
				{announcement}
			</p>
			{!editable && (
				<p className="mb-4 text-sm text-muted-foreground">
					This role can browse content but cannot edit or publish.
				</p>
			)}
			<div className="grid grid-cols-1 items-start gap-8">
				<LiveDraftPreview
					snapshot={{ ...state.draft, content }}
					editable={editable}
					onEditorMessage={fromPreview}
					path={
						tab === "Pages & SEO" ? (pageId === "home" ? "/" : `/${pageId}`) : tab === "FAQs" ? "/faq" : "/"
					}
					focusId={
						tab === "Homepage"
							? `preview-section-${sectionId}`
							: tab === "Hero slides"
								? "preview-section-hero"
								: tab === "Navigation & footer"
									? "preview-footer"
									: "preview-header"
					}
					slideId={tab === "Hero slides" ? slideId : ""}
				/>
				<fieldset disabled={!editable} className="min-w-0">
					<div className="mb-7 flex flex-wrap gap-2 border-b pb-4">
						{tabs.map((name) => (
							<Button
								key={name}
								variant={tab === name ? "default" : "ghost"}
								size="sm"
								aria-pressed={tab === name}
								onClick={() => setTab(name)}
							>
								{name}
							</Button>
						))}
					</div>
					{tab === "Homepage" && (
						<div className="grid grid-cols-1 gap-6 2xl:grid-cols-[220px_minmax(0,1fr)]">
							<section className="space-y-2">
								<h2 className="mb-2 text-xl">Page composition</h2>
								<p className="mb-4 text-xs text-muted-foreground">
									Drag a handle to reorder, or use the arrows.
								</p>
								{content.sections.map((s, index) => (
									<fieldset
										key={s.id}
										aria-label={`${s.title} section controls`}
										onDragOver={(event) => {
											if (editable && dragged) event.preventDefault();
										}}
										onDrop={(event) => {
											event.preventDefault();
											if (!editable || !dragged) return;
											edit(moveSection(content, dragged, s.id));
											setDragged("");
											setAnnouncement("Section order updated");
										}}
										className={`rounded-lg border bg-background p-3 ${s.id === sectionId ? "ring-1 ring-ring" : ""} ${dragged === s.id ? "opacity-50" : dragged ? "hover:ring-2 hover:ring-ring" : ""}`}
									>
										<div className="flex items-center gap-2">
											<Button
												variant="ghost"
												size="icon-sm"
												draggable={editable}
												className="cursor-grab active:cursor-grabbing"
												aria-label={`Drag ${s.title} to reorder`}
												onDragStart={(event) => {
													setDragged(s.id);
													event.dataTransfer.effectAllowed = "move";
													event.dataTransfer.setData("text/plain", s.id);
												}}
												onDragEnd={() => setDragged("")}
											>
												<GripVertical />
											</Button>
											<button
												type="button"
												className="flex-1 text-left text-sm font-medium"
												onClick={() => setSectionId(s.id)}
											>
												{String(index + 1).padStart(2, "0")} · {s.title}
											</button>
											<Button
												variant="ghost"
												size="icon-sm"
												aria-label={`Move ${s.title} up`}
												disabled={index === 0}
												onClick={() => reorder(s.id, -1)}
											>
												<ArrowUp />
											</Button>
											<Button
												variant="ghost"
												size="icon-sm"
												aria-label={`Move ${s.title} down`}
												disabled={index === content.sections.length - 1}
												onClick={() => reorder(s.id, 1)}
											>
												<ArrowDown />
											</Button>
										</div>
										<p className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">
											{s.type} · {s.enabled ? "Visible" : "Hidden"}
										</p>
									</fieldset>
								))}
							</section>
							{section && (
								<section className="space-y-5 rounded-lg border bg-background p-6">
									<h2 className="text-2xl">{section.title}</h2>
									<div className="flex items-center gap-2">
										<Checkbox
											id="section-visible"
											checked={section.enabled}
											onCheckedChange={(checked) => updateSection({ enabled: checked === true })}
										/>
										<Label htmlFor="section-visible">Show this section</Label>
									</div>
									<Field
										label={section.type === "hero" ? "Section label (editor only)" : "Section heading"}
										value={section.title}
										onChange={(title) => updateSection({ title })}
									/>
									<Field
										label="Section copy"
										multiline
										value={section.text}
										onChange={(text) => updateSection({ text })}
									/>
									{section.type === "hero" ? (
										<p className="text-sm text-muted-foreground">
											Manage campaign images, copy, and links in Hero slides.
										</p>
									) : (
										<>
											<MediaPicker
												label="Section image"
												value={section.image}
												onChange={(image) => updateSection({ image })}
											/>
											<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
												<Field
													label="CTA label"
													value={section.ctaLabel}
													onChange={(ctaLabel) => updateSection({ ctaLabel })}
												/>
												<Field
													label="CTA destination"
													value={section.ctaHref}
													onChange={(ctaHref) => updateSection({ ctaHref })}
												/>
											</div>
										</>
									)}
									{section.type === "products" && (
										<fieldset className="space-y-3">
											<legend className="mb-3 text-sm font-medium">Featured products</legend>
											{state.draft.products.map((p) => (
												<div key={p.id} className="flex items-center gap-2">
													<Checkbox
														id={`featured-${p.id}`}
														checked={section.productIds.includes(p.id)}
														onCheckedChange={(checked) =>
															updateSection({
																productIds:
																	checked === true
																		? [...section.productIds, p.id]
																		: section.productIds.filter((id) => id !== p.id),
															})
														}
													/>
													<Label htmlFor={`featured-${p.id}`}>{p.name}</Label>
												</div>
											))}
										</fieldset>
									)}
								</section>
							)}
						</div>
					)}
					{tab === "Hero slides" && (
						<div className="space-y-6">
							{content.slides.map((slide, index) => {
								const update = (patch: Partial<typeof slide>) =>
									edit({
										...content,
										slides: content.slides.map((s) => (s.id === slide.id ? { ...s, ...patch } : s)),
									});
								return (
									<section
										key={slide.id}
										onFocusCapture={() => setSlideId(slide.id)}
										onPointerDown={() => setSlideId(slide.id)}
										className="space-y-5 rounded-lg border bg-background p-6"
									>
										<div className="flex flex-wrap items-center justify-between gap-3">
											<h2 className="text-xl">Campaign {index + 1}</h2>
											<Button
												variant="outline"
												size="sm"
												disabled={content.slides.length < 2}
												onClick={() =>
													edit({ ...content, slides: content.slides.filter((s) => s.id !== slide.id) })
												}
											>
												Remove slide
											</Button>
										</div>
										<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
											<Field label="Hero title" value={slide.title} onChange={(title) => update({ title })} />
											<Field
												label="Accent line"
												value={slide.accent}
												onChange={(accent) => update({ accent })}
											/>
										</div>
										<Field
											label="Campaign copy"
											value={slide.copy}
											multiline
											onChange={(copy) => update({ copy })}
										/>
										<div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
											{slide.images.map((image, i) => (
												<div key={i} className="space-y-4">
													<MediaPicker
														label={`Campaign image ${i + 1}`}
														value={image.src}
														allowEmpty={false}
														onChange={(src) =>
															update({
																images: slide.images.map((item, n) =>
																	n === i
																		? { src, alt: state.media.find((m) => m.src === src)?.alt || item.alt }
																		: item,
																),
															})
														}
													/>
													<Field
														label={`Image ${i + 1} alt text`}
														value={image.alt}
														onChange={(alt) =>
															update({
																images: slide.images.map((item, n) => (n === i ? { ...item, alt } : item)),
															})
														}
													/>
												</div>
											))}
										</div>
										<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
											<Field
												label="Primary CTA label"
												value={slide.cta.label}
												onChange={(label) => update({ cta: { ...slide.cta, label } })}
											/>
											<Field
												label="Primary CTA destination"
												value={slide.cta.href}
												onChange={(href) => update({ cta: { ...slide.cta, href } })}
											/>
											<Field
												label="Secondary CTA label"
												value={slide.secondary.label}
												onChange={(label) => update({ secondary: { ...slide.secondary, label } })}
											/>
											<Field
												label="Secondary CTA destination"
												value={slide.secondary.href}
												onChange={(href) => update({ secondary: { ...slide.secondary, href } })}
											/>
										</div>
									</section>
								);
							})}
							<Button
								variant="outline"
								onClick={() => {
									const first = content.slides[0];
									if (first)
										edit({
											...content,
											slides: [
												...content.slides,
												{ ...structuredClone(first), id: crypto.randomUUID(), title: "New campaign" },
											],
										});
								}}
							>
								<Plus />
								Add campaign
							</Button>
						</div>
					)}
					{tab === "Navigation & footer" && (
						<div className="space-y-6">
							<section className="space-y-5 rounded-lg border bg-background p-6">
								<h2 className="text-xl">Header navigation</h2>
								<LinkEditor
									links={content.navigation}
									onChange={(navigation) => edit({ ...content, navigation })}
								/>
							</section>
							<section className="space-y-5 rounded-lg border bg-background p-6">
								<h2 className="text-xl">Footer</h2>
								<Field
									label="Footer description"
									value={content.footer.text}
									multiline
									onChange={(text) => edit({ ...content, footer: { ...content.footer, text } })}
								/>
								<LinkEditor
									links={content.footer.links}
									onChange={(links) => edit({ ...content, footer: { ...content.footer, links } })}
								/>
							</section>
						</div>
					)}
					{tab === "Pages & SEO" && (
						<section className="max-w-3xl space-y-5 rounded-lg border bg-background p-6">
							<SelectField
								label="Page"
								value={pageId}
								onChange={setPageId}
								options={content.pages.map((p) => ({ value: p.id, label: p.title }))}
							/>
							{page && (
								<>
									<Field
										label="Page title"
										value={page.title}
										onChange={(title) =>
											edit({
												...content,
												pages: content.pages.map((p) => (p.id === pageId ? { ...p, title } : p)),
											})
										}
									/>
									<Field
										label="Page content"
										value={page.text}
										multiline
										onChange={(text) =>
											edit({
												...content,
												pages: content.pages.map((p) => (p.id === pageId ? { ...p, text } : p)),
											})
										}
									/>
									<Field
										label="SEO title"
										value={page.seoTitle}
										onChange={(seoTitle) =>
											edit({
												...content,
												pages: content.pages.map((p) => (p.id === pageId ? { ...p, seoTitle } : p)),
											})
										}
									/>
									<Field
										label="SEO description"
										value={page.seoDescription}
										multiline
										onChange={(seoDescription) =>
											edit({
												...content,
												pages: content.pages.map((p) => (p.id === pageId ? { ...p, seoDescription } : p)),
											})
										}
									/>
									<div className="rounded-lg border bg-muted/30 p-5">
										<p className="mb-3 text-[10px] tracking-widest text-muted-foreground">
											SEARCH RESULT PREVIEW
										</p>
										<p className="text-xs">rinazboutique.com / {page.id === "home" ? "" : page.id}</p>
										<p className="mt-2 text-xl font-medium">{page.seoTitle || page.title}</p>
										<p className="mt-2 text-sm text-muted-foreground">{page.seoDescription}</p>
									</div>
								</>
							)}
						</section>
					)}
					{tab === "FAQs" && (
						<div className="space-y-5">
							{content.faqs.map((faq) => {
								const update = (patch: Partial<typeof faq>) =>
									edit({
										...content,
										faqs: content.faqs.map((f) => (f.id === faq.id ? { ...f, ...patch } : f)),
									});
								return (
									<section key={faq.id} className="space-y-4 rounded-lg border bg-background p-5">
										<Field
											label="FAQ category"
											value={faq.category}
											onChange={(category) => update({ category })}
										/>
										<Field
											label="Question"
											value={faq.question}
											onChange={(question) => update({ question })}
										/>
										<Field
											label="Answer"
											multiline
											value={faq.answer}
											onChange={(answer) => update({ answer })}
										/>
										<Button
											size="sm"
											variant="outline"
											onClick={() => edit({ ...content, faqs: content.faqs.filter((f) => f.id !== faq.id) })}
										>
											Remove FAQ
										</Button>
									</section>
								);
							})}
							<Button
								variant="outline"
								onClick={() =>
									edit({
										...content,
										faqs: [
											...content.faqs,
											{
												id: crypto.randomUUID(),
												category: "General",
												question: "New question",
												answer: "Answer",
											},
										],
									})
								}
							>
								<Plus />
								Add FAQ
							</Button>
						</div>
					)}
					{tab === "Store details" && (
						<section className="max-w-3xl space-y-5 rounded-lg border bg-background p-6">
							<h2 className="text-xl">Identity & contact</h2>
							<Field
								label="Website title / store name"
								value={content.storeName}
								onChange={(storeName) => edit({ ...content, storeName })}
							/>
							{(["email", "phone", "address"] as const).map((key) => (
								<Field
									key={key}
									label={`Contact ${key}`}
									value={content.contact[key]}
									onChange={(value) => edit({ ...content, contact: { ...content.contact, [key]: value } })}
								/>
							))}
							<h2 className="pt-5 text-xl">Announcement banner</h2>
							<div className="flex items-center gap-2">
								<Checkbox
									id="announcement-enabled"
									checked={content.announcement.enabled}
									onCheckedChange={(checked) =>
										edit({ ...content, announcement: { ...content.announcement, enabled: checked === true } })
									}
								/>
								<Label htmlFor="announcement-enabled">Show announcement</Label>
							</div>
							<Field
								label="Announcement text"
								value={content.announcement.text}
								onChange={(text) => edit({ ...content, announcement: { ...content.announcement, text } })}
							/>
							<Field
								label="Announcement link"
								value={content.announcement.href}
								onChange={(href) => edit({ ...content, announcement: { ...content.announcement, href } })}
							/>
						</section>
					)}
				</fieldset>
			</div>
		</>
	);
}
