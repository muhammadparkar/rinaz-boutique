"use client";

import {
	AlertTriangle,
	Check,
	ChevronDown,
	Eye,
	Globe,
	History,
	Plus,
	Redo2,
	RotateCcw,
	Save,
	Trash2,
	Undo2,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useReducer, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/admin/ui/button";
import { Checkbox } from "@/components/admin/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/admin/ui/dialog";
import { Label } from "@/components/admin/ui/label";
import { type Content, canEdit, type LinkItem } from "@/lib/admin/model";
import { saveWebsiteVersion } from "@/lib/admin/repository";
import { applyEditorMessage, contentHistory, type EditorMessage } from "@/lib/admin/visual-editor";
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
	const [announcement, setAnnouncement] = useState("");
	const params = useSearchParams();
	const requested = params.get("section") || "Homepage";
	const [tab, setTab] = useState(tabs.includes(requested) ? requested : "Homepage");
	useEffect(() => {
		if (tabs.includes(requested)) setTab(requested);
	}, [requested]);
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
		} else {
			const next = applyEditorMessage(content, state.media, role, message, state.draft.products);
			if (next !== content)
				edit(
					next,
					message.kind === "section" || message.kind === "slide"
						? `${message.kind}:${message.id}:${message.field}`
						: undefined,
				);
		}
	};

	const page = content.pages.find((p) => p.id === pageId);
	const saved = () => commit(saveWebsiteVersion(state, content), "Website draft version saved", "cms");
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

	const [discardDialogOpen, setDiscardDialogOpen] = useState(false);

	const discardEdits = () => {
		edit(structuredClone(state.draft.content));
		setAnnouncement("Unsaved edits discarded");
		toast.info("Unsaved edits discarded");
	};

	const discardDraft = () => {
		const base = state.published?.content ?? state.websiteVersions[0]?.snapshot.content;
		if (!base) {
			toast.error("No previous baseline available to restore.");
			return;
		}
		const restored = structuredClone(base);
		commit(
			{
				...state,
				draft: { ...state.draft, content: restored },
			},
			"Draft discarded; restored to baseline",
			"cms",
		);
		edit(restored);
		setAnnouncement("Draft discarded; restored to baseline");
		toast.success("Draft discarded. Restored to baseline.");
		setDiscardDialogOpen(false);
	};

	return (
		<>
			<PageHeading title="Website content" description="Edit, preview, and publish your website content.">
				{/* History Controls */}
				<div className="inline-flex items-center rounded-lg border border-border/80 bg-muted/40 p-0.5">
					<Button
						variant="ghost"
						size="icon-sm"
						aria-label="Undo content edit"
						disabled={!editable || !history.past.length}
						onClick={() => dispatch({ kind: "undo" })}
						className="size-7 text-muted-foreground hover:text-foreground disabled:opacity-30"
					>
						<Undo2 className="size-3.5" />
					</Button>
					<Button
						variant="ghost"
						size="icon-sm"
						aria-label="Redo content edit"
						disabled={!editable || !history.future.length}
						onClick={() => dispatch({ kind: "redo" })}
						className="size-7 text-muted-foreground hover:text-foreground disabled:opacity-30"
					>
						<Redo2 className="size-3.5" />
					</Button>
				</div>

				{/* Status Badge */}
				{dirty ? (
					<span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-500 select-none">
						<span className="size-1.5 rounded-full bg-amber-500 animate-pulse" />
						<span>Unsaved edits</span>
					</span>
				) : (
					<span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-500 select-none">
						<span className="size-1.5 rounded-full bg-emerald-500" />
						<span>Draft saved</span>
					</span>
				)}

				{/* Discard Actions */}
				{dirty && (
					<Button
						variant="ghost"
						size="default"
						onClick={discardEdits}
						disabled={!editable}
						className="h-8 gap-1.5 px-2.5 text-xs text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
					>
						<RotateCcw className="size-3.5" />
						<span>Discard edits</span>
					</Button>
				)}

				{editable && (state.published?.content || state.websiteVersions.length > 0) && (
					<Button
						variant="outline"
						size="default"
						onClick={() => setDiscardDialogOpen(true)}
						className="h-8 gap-1.5 px-2.5 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive border-border/80"
					>
						<Trash2 className="size-3.5" />
						<span>Discard draft</span>
					</Button>
				)}

				<Button
					variant="outline"
					size="default"
					onClick={saved}
					disabled={!editable}
					className="h-8 gap-1.5 px-2.5 text-xs"
				>
					<Save className="size-3.5" />
					<span>Save draft</span>
				</Button>

				<Button asChild variant="outline" size="default" className="h-8 gap-1.5 px-2.5 text-xs">
					<Link href="/admin/preview">
						<Eye className="size-3.5" />
						<span>Preview</span>
					</Link>
				</Button>

				<Button
					size="default"
					onClick={publish}
					disabled={dirty || !editable}
					className="h-8 gap-1.5 px-3 text-xs"
				>
					<Check className="size-3.5" />
					<span>Publish to demo</span>
				</Button>
			</PageHeading>

			{/* Publication Status Card */}
			<div className="mb-6 flex flex-col gap-2 rounded-xl border border-border/70 bg-card/60 p-4 sm:flex-row sm:items-center sm:justify-between shadow-2xs">
				<div className="flex items-center gap-3">
					<div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
						<Globe className="size-4" />
					</div>
					<div>
						<div className="flex items-center gap-2">
							<span className="text-xs font-semibold text-foreground">
								{state.publishedAt ? "Published to Live Demo" : "Unpublished Draft State"}
							</span>
							{state.publishedAt ? (
								<span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-500 border border-emerald-500/20">
									<span className="size-1.5 rounded-full bg-emerald-500" /> Live
								</span>
							) : (
								<span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-500 border border-amber-500/20">
									<span className="size-1.5 rounded-full bg-amber-500" /> Staged
								</span>
							)}
						</div>
						<p className="mt-0.5 text-[11px] text-muted-foreground">
							{state.publishedAt
								? `Last demo publish: ${new Date(state.publishedAt).toLocaleString()}`
								: "No changes published to the live storefront yet. Current edits are saved locally in your draft."}
						</p>
					</div>
				</div>
				{role === "Editor" && (
					<span className="text-[11px] text-muted-foreground italic">
						Editors publish website content only; Owners publish catalog updates.
					</span>
				)}
			</div>

			<p role="status" className="sr-only">
				{announcement}
			</p>

			{!editable && (
				<p className="mb-4 text-sm text-muted-foreground">
					This role can browse content but cannot edit or publish.
				</p>
			)}

			{/* Version History Accordion Card */}
			<details className="group mb-6 rounded-xl border border-border/70 bg-card/60 transition-colors shadow-2xs">
				<summary className="flex cursor-pointer list-none items-center justify-between p-4 text-sm font-medium select-none [&::-webkit-details-marker]:hidden">
					<div className="flex items-center gap-2.5">
						<div className="flex size-7 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
							<History className="size-4 text-foreground" />
						</div>
						<div>
							<span className="font-semibold text-foreground">Version history</span>
							<span className="ml-2 inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
								{state.websiteVersions.length} snapshots
							</span>
						</div>
					</div>
					<ChevronDown className="size-4 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
				</summary>
				<div className="border-t border-border/60 p-4">
					{state.websiteVersions.length ? (
						<div className="max-h-72 space-y-2 overflow-y-auto pr-1">
							{[...state.websiteVersions].reverse().map((v, index) => {
								const isLatest = index === 0;
								return (
									<div
										key={v.number}
										className="flex flex-col gap-2 rounded-lg border border-border/50 bg-background/60 p-3 transition-colors hover:bg-muted/40 sm:flex-row sm:items-center sm:justify-between"
									>
										<div className="flex items-center gap-3">
											<span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-secondary font-mono text-xs font-bold text-foreground ring-1 ring-border">
												V{v.number}
											</span>
											<div>
												<div className="flex items-center gap-2">
													<time className="text-xs font-medium text-foreground">
														{new Date(v.at).toLocaleDateString(undefined, {
															month: "short",
															day: "numeric",
															year: "numeric",
														})}{" "}
														at{" "}
														{new Date(v.at).toLocaleTimeString([], {
															hour: "2-digit",
															minute: "2-digit",
														})}
													</time>
													{isLatest && (
														<span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-500 border border-emerald-500/20">
															Latest
														</span>
													)}
												</div>
												<p className="mt-0.5 text-[11px] text-muted-foreground">
													{v.snapshot.content.sections.length} sections · {v.snapshot.content.slides.length}{" "}
													slides
												</p>
											</div>
										</div>
										<Button
											size="sm"
											variant="outline"
											disabled={!editable}
											className="h-7 gap-1.5 px-2.5 text-xs hover:bg-secondary"
											onClick={() => {
												if (dirty && !window.confirm("Replace unsaved edits with this version?")) return;
												edit({
													...structuredClone(v.snapshot.content),
													sections: v.snapshot.content.sections.map((s) => ({
														...s,
														productIds: s.productIds.filter((id) =>
															state.draft.products.some((p) => p.id === id),
														),
													})),
												});
												setAnnouncement(`V${v.number} restored as unsaved draft`);
												toast.success(`Restored snapshot V${v.number}`);
											}}
										>
											<RotateCcw className="size-3" />
											<span>Restore draft</span>
										</Button>
									</div>
								);
							})}
						</div>
					) : (
						<p className="py-4 text-center text-xs text-muted-foreground">
							No version snapshots saved yet. Click "Save draft" to record V1.
						</p>
					)}
				</div>
			</details>
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
				<details className="group min-w-0 border-t pt-4">
					<summary className="flex cursor-pointer list-none items-center justify-between py-2 text-sm font-medium select-none [&::-webkit-details-marker]:hidden">
						<span>Page settings, navigation, and SEO</span>
						<ChevronDown className="size-4 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
					</summary>
					<fieldset disabled={!editable} className="min-w-0 pt-4">
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
												<Field
													label="Hero title"
													value={slide.title}
													onChange={(title) => update({ title })}
												/>
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
												onClick={() =>
													edit({ ...content, faqs: content.faqs.filter((f) => f.id !== faq.id) })
												}
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
											edit({
												...content,
												announcement: { ...content.announcement, enabled: checked === true },
											})
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
				</details>
			</div>
			<Dialog open={discardDialogOpen} onOpenChange={setDiscardDialogOpen}>
				<DialogContent className="admin-content-theme max-w-md rounded-xl">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2 text-destructive">
							<AlertTriangle className="size-5" />
							<span>Discard website draft?</span>
						</DialogTitle>
						<DialogDescription>
							This action will discard your working draft and restore website content to match the live
							storefront (or baseline configuration). All unpublished changes in this draft will be removed.
						</DialogDescription>
					</DialogHeader>

					<div className="rounded-lg border border-border/70 bg-muted/40 p-3 text-xs space-y-1.5">
						<div className="flex justify-between">
							<span className="text-muted-foreground">Restore target:</span>
							<span className="font-medium text-foreground">
								{state.publishedAt
									? `Published demo (${new Date(state.publishedAt).toLocaleDateString()})`
									: "Initial baseline"}
							</span>
						</div>
						<div className="flex justify-between">
							<span className="text-muted-foreground">Recorded versions:</span>
							<span className="font-medium text-foreground">{state.websiteVersions.length} snapshots</span>
						</div>
					</div>

					<DialogFooter className="gap-2 sm:gap-0">
						<Button variant="outline" size="sm" onClick={() => setDiscardDialogOpen(false)}>
							Cancel
						</Button>
						<Button variant="destructive" size="sm" onClick={discardDraft} className="gap-1.5">
							<Trash2 className="size-3.5" />
							<span>Discard draft</span>
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
