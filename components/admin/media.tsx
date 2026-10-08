"use client";
import { Search, Upload } from "lucide-react";
import { useState } from "react";
import { try_ } from "safe-try";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mediaUsage } from "@/lib/admin/model";
import { browserRepository } from "@/lib/admin/repository";
import { useAdmin } from "./provider";
import { AdminImage, Confirm, EmptyState, Field, PageHeading } from "./shared";
export function MediaLibrary() {
	const { state, commit, setDirty } = useAdmin();
	const [query, setQuery] = useState("");
	const [busy, setBusy] = useState(false);
	const [selected, setSelected] = useState("");
	const [alt, setAlt] = useState("");
	const [name, setName] = useState("");
	const upload = async (file?: File) => {
		if (!file) return;
		if (
			!["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"].includes(file.type) ||
			file.size > 10 * 1024 * 1024
		) {
			toast.error("Upload a JPEG, PNG, WebP, AVIF, or GIF up to 10 MB.");
			return;
		}
		setBusy(true);
		const id = crypto.randomUUID();
		const [error] = await try_(browserRepository.putImage(id, file));
		if (error) toast.error("Image upload failed. Check available browser storage.");
		else if (
			!commit(
				{
					...state,
					media: [
						...state.media,
						{
							id,
							src: `media:${id}`,
							name: file.name,
							alt: file.name.replace(/\.[^.]+$/, ""),
							uploaded: true,
						},
					],
				},
				"Image added to media library",
				"media",
			)
		)
			await try_(browserRepository.deleteImage(id));
		setBusy(false);
	};
	const current = state.media.find((m) => m.id === selected);
	return (
		<>
			<PageHeading
				title="The visual archive"
				description="A shared library for campaign imagery, product photography, and studio stories."
			>
				<label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground">
					<Upload size={16} />
					{busy ? "Uploading…" : "Upload image"}
					<input
						aria-label="Upload image"
						type="file"
						accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
						className="sr-only"
						disabled={busy}
						onChange={(e) => {
							void upload(e.target.files?.[0]);
							e.target.value = "";
						}}
					/>
				</label>
			</PageHeading>
			<div className="relative mb-6 max-w-sm">
				<Search size={15} className="absolute left-3 top-3 text-muted-foreground" />
				<Input
					aria-label="Search media"
					className="pl-9"
					placeholder="Search the archive…"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
				/>
			</div>
			{current && (
				<section className="mb-7 grid grid-cols-1 gap-6 rounded-lg border bg-background p-6 lg:grid-cols-[200px_1fr]">
					<AdminImage src={current.src} alt={current.alt} className="h-52 w-full rounded object-cover" />
					<div className="space-y-4">
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
							<Field
								label="Asset name"
								value={name}
								onChange={(value) => {
									setName(value);
									setDirty(true);
								}}
							/>
							<Field
								label="Image alt text"
								value={alt}
								onChange={(value) => {
									setAlt(value);
									setDirty(true);
								}}
							/>
						</div>
						<div className="flex gap-2">
							<Button
								onClick={() => {
									if (!alt.trim() || !name.trim()) {
										toast.error("Name and alt text are required.");
										return;
									}
									commit(
										{
											...state,
											media: state.media.map((m) => (m.id === selected ? { ...m, name, alt } : m)),
										},
										"Image details saved",
										"media",
									);
								}}
							>
								Save image details
							</Button>
							<Button
								variant="outline"
								onClick={() => {
									if (!window.confirm("Close image editor? Unsaved changes will be discarded.")) return;
									setSelected("");
									setDirty(false);
								}}
							>
								Close
							</Button>
						</div>
						<p className="text-xs text-muted-foreground">
							Used in: {mediaUsage(state, current.src).join(" · ") || "No references — safe to remove"}
						</p>
						<p className="text-xs text-muted-foreground">
							Uploaded images stay in this browser. JSON exports include their references, not image files.
						</p>
					</div>
				</section>
			)}
			<div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
				{state.media
					.filter((m) => `${m.name} ${m.alt}`.toLowerCase().includes(query.toLowerCase()))
					.map((m) => {
						const usage = mediaUsage(state, m.src);
						return (
							<article key={m.id} className="overflow-hidden rounded-lg border bg-background">
								<button
									type="button"
									className="block w-full text-left"
									aria-label={`Edit ${m.name}`}
									onClick={() => {
										if (selected && !window.confirm("Switch image? Unsaved edits will be discarded.")) return;
										setDirty(false);
										setSelected(m.id);
										setAlt(m.alt);
										setName(m.name);
									}}
								>
									<AdminImage
										src={m.src}
										alt={m.alt}
										className="aspect-[4/5] w-full object-cover"
										sizes="(min-width: 1280px) 20vw, 40vw"
									/>
									<div className="p-3">
										<p className="truncate text-xs font-medium">{m.name}</p>
										<p className="mt-1 text-[10px] text-muted-foreground">
											{m.uploaded ? "Browser upload" : "Storefront asset"} · {usage.length} references
										</p>
									</div>
								</button>
								<div className="px-3 pb-3">
									<Confirm
										label="Delete"
										title="Remove this image?"
										description="Referenced images cannot be deleted. Replace them in both drafts and the published snapshot first."
										disabled={usage.length > 0}
										onConfirm={() => {
											if (
												commit(
													{ ...state, media: state.media.filter((item) => item.id !== m.id) },
													"Image removed from library",
													"media",
												)
											) {
												setSelected("");
												if (m.uploaded)
													void try_(browserRepository.deleteImage(m.id)).then(([error]) => {
														if (error) toast.error("Image removed; unused blob cleanup failed.");
													});
											}
										}}
									/>
								</div>
							</article>
						);
					})}
			</div>
			{!state.media.length && (
				<EmptyState
					title="Build your visual library"
					description="Upload the first campaign or product image to get started."
				/>
			)}
		</>
	);
}
