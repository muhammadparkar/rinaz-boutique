"use client";
import Image from "next/image";
import { useEffect, useId, useState } from "react";
import { try_ } from "safe-try";
import { Button } from "@/components/admin/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/admin/ui/dialog";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/admin/ui/select";
import { Textarea } from "@/components/admin/ui/textarea";
import { browserRepository } from "@/lib/admin/repository";
import { cn } from "@/lib/utils";
import { useAdmin } from "./provider";

export function PageHeading({
	eyebrow,
	title,
	description,
	children,
}: {
	eyebrow?: string;
	title: string;
	description: string;
	children?: React.ReactNode;
}) {
	return (
		<div className="mb-6 flex flex-wrap items-center justify-between gap-4">
			<div>
				{eyebrow && <p className="mb-2 text-xs text-muted-foreground">{eyebrow}</p>}
				<h1 className="font-display text-2xl font-medium tracking-wide">{title}</h1>
				<p className="mt-2 max-w-xl text-sm text-muted-foreground leading-relaxed">{description}</p>
			</div>
			<div className="flex flex-wrap gap-2">{children}</div>
		</div>
	);
}
export function Field({
	label,
	value,
	onChange,
	multiline = false,
	type = "text",
	...props
}: {
	label: string;
	value: string | number;
	onChange: (value: string) => void;
	multiline?: boolean;
	type?: string;
	required?: boolean;
	min?: number;
	step?: number;
	disabled?: boolean;
}) {
	const id = useId();
	return (
		<div className="space-y-2">
			<Label htmlFor={id}>{label}</Label>
			{multiline ? (
				<Textarea id={id} value={value} onChange={(e) => onChange(e.target.value)} {...props} />
			) : (
				<Input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} {...props} />
			)}
		</div>
	);
}
type DropdownProps = {
	id?: string;
	label: string;
	value: string;
	onChange: (value: string) => void;
	options: { value: string; label: string }[];
	disabled?: boolean;
	className?: string;
};
export function AdminSelect({
	id,
	label,
	value,
	onChange,
	options,
	disabled = false,
	className,
}: DropdownProps) {
	const selected = options.findIndex((option) => option.value === value);
	return (
		<Select
			value={selected < 0 ? "" : String(selected)}
			onValueChange={(index) => {
				const option = options[Number(index)];
				if (option) onChange(option.value);
			}}
			disabled={disabled}
		>
			<SelectTrigger id={id} aria-label={label} className={cn("w-full min-w-0", className)}>
				<SelectValue placeholder="Select an option" />
			</SelectTrigger>
			<SelectContent align="start" className="admin-content-theme max-h-80 max-w-[calc(100vw-2rem)]">
				{options.map((option, index) => (
					<SelectItem key={option.value} value={String(index)} className="cursor-pointer">
						<span className="truncate">{option.label}</span>
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
export function SelectField(props: Omit<DropdownProps, "id">) {
	const id = useId();
	return (
		<div className="space-y-2 min-w-0">
			<Label htmlFor={id}>{props.label}</Label>
			<AdminSelect id={id} {...props} />
		</div>
	);
}
export function EmptyState({ title, description }: { title: string; description: string }) {
	return (
		<div className="rounded-lg border border-dashed p-12 text-center">
			<h2 className="text-xl">{title}</h2>
			<p className="mt-2 text-sm text-muted-foreground">{description}</p>
		</div>
	);
}
export function Confirm({
	label,
	title,
	description,
	onConfirm,
	disabled = false,
}: {
	label: string;
	title: string;
	description: string;
	onConfirm: () => void;
	disabled?: boolean;
}) {
	const [open, setOpen] = useState(false);
	return (
		<>
			<Button variant="outline" size="sm" disabled={disabled} onClick={() => setOpen(true)}>
				{label}
			</Button>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="admin-workspace admin-content-theme [&>button]:size-8 [&>button]:grid [&>button]:place-items-center">
					<DialogHeader>
						<DialogTitle>{title}</DialogTitle>
						<DialogDescription>{description}</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button variant="outline" onClick={() => setOpen(false)}>
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={() => {
								onConfirm();
								setOpen(false);
							}}
						>
							Confirm
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
export function AdminImage({
	src,
	alt,
	className = "",
	sizes = "300px",
	priority = false,
}: {
	src: string;
	alt: string;
	className?: string;
	sizes?: string;
	priority?: boolean;
}) {
	const [local, setLocal] = useState("");
	const [failed, setFailed] = useState(false);
	useEffect(() => {
		setFailed(false);
		setLocal("");
		if (!src.startsWith("media:")) return;
		let active = true;
		let url = "";
		void (async () => {
			const [error, blob] = await try_(browserRepository.getImage(src.slice(6)));
			if (!active) return;
			if (error || !blob) setFailed(true);
			else {
				url = URL.createObjectURL(blob);
				setLocal(url);
			}
		})();
		return () => {
			active = false;
			if (url) URL.revokeObjectURL(url);
		};
	}, [src]);
	if (!src || failed)
		return (
			<div
				className={`flex min-h-24 items-center justify-center bg-secondary p-4 text-xs text-muted-foreground ${className}`}
			>
				Image unavailable
			</div>
		);
	// Blob images are browser-local; remote platform images continue through Next's optimizer.
	if (src.startsWith("media:"))
		return local ? (
			// biome-ignore lint/performance/noImgElement: browser-local blobs cannot use the server optimizer
			<img src={local} alt={alt} className={className} onError={() => setFailed(true)} />
		) : (
			<div role="status" className={`animate-pulse bg-secondary ${className}`} aria-label="Loading image" />
		);
	return (
		<Image
			src={src}
			alt={alt}
			width={800}
			height={1000}
			sizes={sizes}
			priority={priority}
			className={className}
			onError={() => setFailed(true)}
		/>
	);
}
export function MediaPicker({
	label,
	value,
	onChange,
	allowEmpty = true,
}: {
	label: string;
	value: string;
	onChange: (src: string) => void;
	allowEmpty?: boolean;
}) {
	const { state } = useAdmin();
	return (
		<SelectField
			label={label}
			value={value}
			onChange={onChange}
			options={[
				...(allowEmpty ? [{ value: "", label: "No image" }] : []),
				...state.media.map((m) => ({ value: m.src, label: m.name })),
			]}
		/>
	);
}
