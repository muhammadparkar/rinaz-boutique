import {
	ArrowLeft,
	CaretLeft,
	CaretRight,
	CheckCircle,
	type Icon,
	Info,
	MagnifyingGlass,
	Star,
	WarningCircle,
	X,
} from "@phosphor-icons/react";
import {
	type ButtonHTMLAttributes,
	type ChangeEvent,
	Children,
	forwardRef,
	type InputHTMLAttributes,
	isValidElement,
	type ReactNode,
	type SelectHTMLAttributes,
	type TextareaHTMLAttributes,
} from "react";
import { Link } from "@/components/admin/operations/router";
import { AdminImage } from "@/components/admin/shared";
import { Badge as ShadBadge } from "@/components/admin/ui/badge";
import { Button as ShadButton } from "@/components/admin/ui/button";
import { Checkbox as ShadCheckbox } from "@/components/admin/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/admin/ui/dialog";
import { Input as ShadInput } from "@/components/admin/ui/input";
import {
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Select as ShadSelect,
} from "@/components/admin/ui/select";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@/components/admin/ui/sheet";
import { Switch as ShadSwitch } from "@/components/admin/ui/switch";
import { Textarea as ShadTextarea } from "@/components/admin/ui/textarea";
import { cx, initials } from "../lib/format";
import { useStore } from "../lib/store";

/* Shape rule: controls 4px, panels 6px, status chips 3px. One-pixel rules, no shadows on content. */

/* ---------------- Buttons ---------------- */

type BtnVariant = "primary" | "secondary" | "ghost" | "danger";
type BtnSize = "sm" | "md";
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: BtnVariant;
	size?: BtnSize;
	icon?: Icon;
}
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
	{ variant = "secondary", size = "md", icon: I, className, children, type = "button", ...rest },
	ref,
) {
	return (
		<ShadButton
			ref={ref}
			type={type}
			variant={
				variant === "danger"
					? "destructive"
					: variant === "primary"
						? "default"
						: variant === "ghost"
							? "ghost"
							: "outline"
			}
			size={size === "sm" ? "sm" : "default"}
			className={className}
			{...rest}
		>
			{I && <I size={size === "sm" ? 14 : 15} className="shrink-0" />}
			{children}
		</ShadButton>
	);
});

export function IconButton({
	icon: I,
	label,
	className,
	size = 16,
	...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { icon: Icon; label: string; size?: number }) {
	return (
		<ShadButton
			type="button"
			variant="ghost"
			size="icon-sm"
			aria-label={label}
			title={label}
			className={className}
			{...rest}
		>
			<I size={size} />
		</ShadButton>
	);
}

/* ---------------- Status marks ---------------- */

export type Tone = "neutral" | "ok" | "warn" | "bad" | "info" | "ink";
export function Badge({
	tone = "neutral",
	children,
	className,
	mark = true,
}: {
	tone?: Tone;
	children: ReactNode;
	className?: string;
	mark?: boolean;
}) {
	return (
		<ShadBadge
			variant={
				tone === "bad"
					? "destructive"
					: tone === "ok"
						? "default"
						: tone === "neutral"
							? "outline"
							: "secondary"
			}
			className={className}
		>
			{mark && <span aria-hidden className="size-1.5 bg-current" />}
			{children}
		</ShadBadge>
	);
}

const statusMap: Record<string, [string, Tone]> = {
	pending: ["Pending", "warn"],
	processing: ["Processing", "info"],
	shipped: ["Shipped", "info"],
	delivered: ["Delivered", "ok"],
	cancelled: ["Cancelled", "neutral"],
	refunded: ["Refunded", "bad"],
	paid: ["Paid", "ok"],
	failed: ["Failed", "bad"],
	partially_refunded: ["Part refunded", "warn"],
	captured: ["Captured", "ok"],
	partial_refund: ["Part refunded", "warn"],
	active: ["Active", "ok"],
	draft: ["Draft", "neutral"],
	archived: ["Archived", "neutral"],
	approved: ["Approved", "ok"],
	rejected: ["Rejected", "bad"],
	published: ["Published", "ok"],
	blocked: ["Blocked", "bad"],
	invited: ["Invited", "info"],
	suspended: ["Suspended", "bad"],
	requested: ["Requested", "warn"],
	confirmed: ["Confirmed", "ink"],
	completed: ["Completed", "ok"],
	no_show: ["No show", "bad"],
	live: ["Live", "ok"],
	scheduled: ["Scheduled", "info"],
	ended: ["Ended", "neutral"],
};
export function StatusBadge({ status }: { status: string }) {
	const [label, tone] = statusMap[status] ?? [status, "neutral"];
	return <Badge tone={tone}>{label}</Badge>;
}

/** One stable reference per record (order no., SKU, appointment no.), set the same way everywhere. */
export function Ref({ children, to, className }: { children: ReactNode; to?: string; className?: string }) {
	const cls = cx(
		"ops-num text-[12.5px] font-medium text-ops-ink",
		to && "underline decoration-ops-line-strong underline-offset-[3px] hover:decoration-ops-ink",
		className,
	);
	return to ? (
		<Link to={to} onClick={(e) => e.stopPropagation()} className={cls}>
			{children}
		</Link>
	) : (
		<span className={cls}>{children}</span>
	);
}

/* ---------------- The tape ---------------- */

export const TAPE_GOLD = (_major: number) => "var(--ops-info)";
export const TAPE_BLANK = (_major: number) => "var(--ops-sunken)";
export function Tape({
	value,
	className,
	label,
	height = 8,
	animate = true,
}: {
	value: number;
	major?: number;
	className?: string;
	label?: string;
	height?: number;
	animate?: boolean;
}) {
	const progress = Math.max(0, Math.min(1, value));
	return (
		<div
			role="img"
			aria-label={`${label ?? "Progress"}: ${Math.round(value * 100)}%`}
			className={cx("relative overflow-hidden rounded-full bg-ops-sunken", className)}
			style={{ height }}
		>
			<div
				className={cx(
					"absolute inset-0 origin-left rounded-full transition-transform duration-300 ease-out motion-reduce:transition-none",
					animate && "ops-tape-fill",
				)}
				style={{
					transform: `scaleX(${progress})`,
					background: progress >= 1 ? "var(--ops-ok)" : "var(--ops-info)",
				}}
			/>
		</div>
	);
}

/** A tape divided into named stages, used for order fulfilment. */
export function StageTape({
	stages,
	at,
	broken,
	compact,
}: {
	stages: string[];
	at: number;
	broken?: boolean;
	compact?: boolean;
}) {
	const segs = stages.length - 1;
	return (
		<div className={cx("w-full", compact && "max-w-[92px]")}>
			{broken ? (
				<div
					className="relative rounded-full"
					style={{ height: compact ? 8 : 10, background: TAPE_BLANK(segs) }}
				>
					<span className="absolute inset-x-0 top-1/2 h-px bg-ops-bad" />
				</div>
			) : (
				<Tape
					value={at / segs}
					major={segs}
					height={compact ? 8 : 10}
					label={`${stages[at]}, step ${at + 1} of ${stages.length}`}
				/>
			)}
			{!compact && (
				<div
					className="mt-2 grid text-[11.5px]"
					style={{ gridTemplateColumns: `repeat(${stages.length}, minmax(0, 1fr))` }}
				>
					{stages.map((s, i) => (
						<span
							key={s}
							className={cx(
								i === 0 ? "text-left" : i === stages.length - 1 ? "text-right" : "text-center",
								!broken && i <= at ? "font-medium text-ops-ink" : "text-ops-faint",
							)}
						>
							{s}
						</span>
					))}
				</div>
			)}
		</div>
	);
}

/* ---------------- Form controls ---------------- */

const controlCls =
	"rounded-md border border-ops-line-strong bg-ops-surface px-2.5 text-[13px] text-ops-ink placeholder:text-ops-faint transition-colors hover:border-ops-faint focus:border-ops-ink focus:outline-none focus:shadow-[0_0_0_2px_var(--ops-gold-soft)] disabled:bg-ops-sunken disabled:text-ops-muted aria-[invalid=true]:border-ops-bad";

export function Field({
	label,
	hint,
	error,
	children,
	className,
	htmlFor,
	aside,
}: {
	label: string;
	hint?: ReactNode;
	error?: string;
	children: ReactNode;
	className?: string;
	htmlFor?: string;
	aside?: ReactNode;
}) {
	return (
		<div className={cx("flex min-w-0 flex-col gap-1.5", className)}>
			<div className="flex items-baseline justify-between gap-2">
				<label htmlFor={htmlFor} className="text-[12.5px] font-medium text-ops-ink-2">
					{label}
				</label>
				{aside && <span className="text-[12px] text-ops-muted">{aside}</span>}
			</div>
			{children}
			{error ? (
				<p className="text-[12px] text-ops-bad">{error}</p>
			) : hint ? (
				<p className="text-[12px] text-ops-muted">{hint}</p>
			) : null}
		</div>
	);
}

export const Input = forwardRef<
	HTMLInputElement,
	InputHTMLAttributes<HTMLInputElement> & { prefix?: string; suffix?: string }
>(function Input({ className, prefix, suffix, type, ...rest }, ref) {
	if (prefix || suffix) {
		return (
			<div
				className={cx(
					"flex h-7 w-full min-w-0 items-stretch overflow-hidden rounded-md border border-input bg-input/20 transition-colors focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30 dark:bg-input/30 max-sm:h-8",
					className,
				)}
			>
				{prefix && (
					<span className="grid shrink-0 place-items-center border-r border-input bg-muted/50 px-2.5 text-xs text-muted-foreground select-none">
						{prefix}
					</span>
				)}
				<input
					ref={ref}
					type={type}
					className="h-full min-w-0 flex-1 border-0 border-none bg-transparent px-2.5 py-0.5 text-sm text-foreground placeholder:text-muted-foreground shadow-none outline-none ring-0 rounded-none focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-xs/relaxed"
					{...rest}
				/>
				{suffix && (
					<span className="grid shrink-0 place-items-center border-l border-input bg-muted/50 px-2.5 text-xs text-muted-foreground select-none">
						{suffix}
					</span>
				)}
			</div>
		);
	}
	return <ShadInput ref={ref} type={type} className={className} {...rest} />;
});

export function Textarea({ className, ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
	return <ShadTextarea className={className} {...rest} />;
}

export function Select({
	className,
	children,
	value,
	defaultValue,
	onChange,
	id,
	disabled,
	name,
	...rest
}: SelectHTMLAttributes<HTMLSelectElement>) {
	const options = Children.toArray(children).filter(
		isValidElement<{ value?: string | number; children?: ReactNode; disabled?: boolean }>,
	);
	const current = String(value ?? defaultValue ?? "");
	return (
		<ShadSelect
			value={current || "__empty"}
			disabled={disabled}
			name={name}
			onValueChange={(next) => {
				const value = next === "__empty" ? "" : next;
				onChange?.({ target: { value }, currentTarget: { value } } as ChangeEvent<HTMLSelectElement>);
			}}
		>
			<SelectTrigger
				id={id}
				aria-label={rest["aria-label"]}
				aria-labelledby={rest["aria-labelledby"]}
				className={cx("w-full", className)}
			>
				<SelectValue />
			</SelectTrigger>
			<SelectContent className="admin-workspace admin-content-theme bg-ops-surface text-ops-ink">
				{options.map((option, index) => {
					const v = String(option.props.value ?? option.props.children ?? "");
					return (
						<SelectItem key={`${v}-${index}`} value={v || "__empty"} disabled={option.props.disabled}>
							{option.props.children}
						</SelectItem>
					);
				})}
			</SelectContent>
		</ShadSelect>
	);
}

export function Toggle({
	checked,
	onChange,
	label,
	disabled,
}: {
	checked: boolean;
	onChange: (checked: boolean) => void;
	label: string;
	disabled?: boolean;
}) {
	return <ShadSwitch checked={checked} onCheckedChange={onChange} aria-label={label} disabled={disabled} />;
}
export function Checkbox({
	checked,
	indeterminate,
	onChange,
	label,
}: {
	checked: boolean;
	indeterminate?: boolean;
	onChange: (checked: boolean) => void;
	label: string;
}) {
	return (
		<ShadCheckbox
			aria-label={label}
			checked={indeterminate && !checked ? "indeterminate" : checked}
			onCheckedChange={(next) => onChange(next === true)}
			className="size-6"
		/>
	);
}

export function SearchInput({
	value,
	onChange,
	placeholder = "Search",
	className,
}: {
	value: string;
	onChange: (v: string) => void;
	placeholder?: string;
	className?: string;
}) {
	return (
		<div className={cx("relative", className)}>
			<MagnifyingGlass
				size={15}
				className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-ops-faint"
			/>
			<input
				type="search"
				aria-label={placeholder}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder={placeholder}
				className={cx(controlCls, "h-7 w-full pl-8 max-sm:h-8 [&::-webkit-search-cancel-button]:hidden")}
			/>
			{value && (
				<button
					type="button"
					aria-label="Clear search"
					onClick={() => onChange("")}
					className="absolute right-1.5 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-md text-ops-faint hover:text-ops-ink"
				>
					<X size={13} />
				</button>
			)}
		</div>
	);
}

/* ---------------- Layout pieces ---------------- */

export function PageHeader({
	title,
	description,
	actions,
	back,
	meta,
}: {
	title: ReactNode;
	description?: ReactNode;
	actions?: ReactNode;
	back?: { to: string; label: string };
	meta?: ReactNode;
}) {
	return (
		<header className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
			<div className="min-w-0">
				{back && (
					<Link
						to={back.to}
						className="mb-2 inline-flex items-center gap-1 text-[12.5px] text-ops-muted hover:text-ops-ink"
					>
						<ArrowLeft size={13} /> {back.label}
					</Link>
				)}
				<div className="flex flex-wrap items-center gap-3">
					<h1 className="ops-display text-[25px] leading-tight text-ops-ink max-sm:text-[22px]">{title}</h1>
					{meta}
				</div>
				{description && <p className="mt-1.5 max-w-[68ch] text-[13.5px] text-ops-muted">{description}</p>}
			</div>
			{actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
		</header>
	);
}

export function Panel({
	title,
	actions,
	children,
	className,
	bodyClass,
	description,
	id,
}: {
	title?: ReactNode;
	actions?: ReactNode;
	children: ReactNode;
	className?: string;
	bodyClass?: string;
	description?: ReactNode;
	id?: string;
}) {
	return (
		<section id={id} className={cx("min-w-0 rounded-lg border border-ops-line bg-ops-surface", className)}>
			{(title || actions) && (
				<div className="flex min-h-12 items-center justify-between gap-3 border-b border-ops-line px-4 py-2.5">
					<div className="min-w-0">
						{title && <h2 className="text-[14px] font-semibold text-ops-ink">{title}</h2>}
						{description && <p className="mt-0.5 text-[12.5px] text-ops-muted">{description}</p>}
					</div>
					{actions && <div className="flex shrink-0 items-center gap-1.5">{actions}</div>}
				</div>
			)}
			<div className={cx(bodyClass ?? "p-4")}>{children}</div>
		</section>
	);
}

export function Tabs<T extends string>({
	value,
	onChange,
	items,
	className,
}: {
	value: T;
	onChange: (value: T) => void;
	items: { value: T; label: string; count?: number }[];
	className?: string;
}) {
	return (
		<div
			role="tablist"
			aria-label="Filter"
			className={cx(
				"flex items-center gap-1.5 overflow-x-auto py-2.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
				className,
			)}
		>
			{items.map((item) => {
				const active = item.value === value;
				return (
					<button
						key={item.value}
						type="button"
						role="tab"
						aria-selected={active}
						tabIndex={active ? 0 : -1}
						onClick={() => onChange(item.value)}
						className={cx(
							"group inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:ring-2 focus-visible:ring-ring/50",
							active
								? "border border-border bg-secondary text-foreground font-semibold shadow-xs"
								: "border border-transparent text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
						)}
					>
						<span>{item.label}</span>
						{item.count !== undefined && (
							<span
								className={cx(
									"inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1.5 text-[10.5px] font-medium leading-none tabular-nums transition-colors",
									active
										? "bg-foreground/15 text-foreground font-semibold"
										: "bg-muted-foreground/15 text-muted-foreground group-hover:bg-muted-foreground/25 group-hover:text-foreground",
								)}
							>
								{item.count}
							</span>
						)}
					</button>
				);
			})}
		</div>
	);
}

export function Segmented<T extends string>({
	value,
	onChange,
	items,
	label,
}: {
	value: T;
	onChange: (value: T) => void;
	items: { value: T; label: string }[];
	label?: string;
}) {
	return (
		<div
			title={label}
			className="inline-flex h-8 items-center rounded-lg border border-border bg-muted/40 p-0.5 text-muted-foreground"
		>
			{items.map((item) => {
				const active = item.value === value;
				return (
					<button
						key={item.value}
						type="button"
						aria-pressed={active}
						onClick={() => onChange(item.value)}
						className={cx(
							"inline-flex h-7 items-center justify-center rounded-md px-2.5 text-xs font-medium transition-all outline-none focus-visible:ring-1 focus-visible:ring-ring/50",
							active ? "bg-background text-foreground shadow-xs font-semibold" : "hover:text-foreground",
						)}
					>
						{item.label}
					</button>
				);
			})}
		</div>
	);
}

/* ---------------- Tables ---------------- */

export const th =
	"h-9 px-3 text-left text-[12px] font-medium text-ops-muted whitespace-nowrap first:pl-4 last:pr-4";
export const td = "h-13 px-3 text-[13px] first:pl-4 last:pr-4";
export const tr = "border-t border-ops-line transition-colors hover:bg-ops-surface-2";

export function Pagination({
	page,
	pageSize,
	total,
	onPage,
}: {
	page: number;
	pageSize: number;
	total: number;
	onPage: (p: number) => void;
}) {
	const pages = Math.max(1, Math.ceil(total / pageSize));
	const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
	const to = Math.min(total, page * pageSize);
	return (
		<div className="flex items-center justify-between border-t border-ops-line px-4 py-2 text-[12.5px] text-ops-muted">
			<span className="ops-num">
				{from}-{to} of {total}
			</span>
			<div className="flex items-center gap-1">
				<IconButton
					icon={CaretLeft}
					label="Previous page"
					disabled={page <= 1}
					onClick={() => onPage(page - 1)}
					size={14}
				/>
				<span className="ops-num px-1">
					{page} / {pages}
				</span>
				<IconButton
					icon={CaretRight}
					label="Next page"
					disabled={page >= pages}
					onClick={() => onPage(page + 1)}
					size={14}
				/>
			</div>
		</div>
	);
}

export function EmptyState({
	icon: I,
	title,
	body,
	action,
}: {
	icon: Icon;
	title: string;
	body: string;
	action?: ReactNode;
}) {
	return (
		<div className="flex flex-col items-center px-6 py-14 text-center">
			<I size={26} weight="light" className="mb-3 text-ops-faint" />
			<p className="text-[14px] font-semibold text-ops-ink">{title}</p>
			<p className="mt-1 max-w-[42ch] text-[13px] text-ops-muted">{body}</p>
			{action && <div className="mt-4">{action}</div>}
		</div>
	);
}

export function Skeleton({ className }: { className?: string }) {
	return <div className={cx("ops-skeleton rounded-md", className)} />;
}

/** Bulk-selection bar shown above a table. */
export function SelectionBar({
	count,
	children,
	onClear,
}: {
	count: number;
	children: ReactNode;
	onClear: () => void;
}) {
	return (
		<div className="flex flex-wrap items-center gap-2 border-t border-ops-line bg-ops-rail px-4 py-2 text-ops-rail-ink">
			<span className="ops-num mr-2 text-[13px] font-medium">{count} selected</span>
			<div className="flex flex-wrap items-center gap-1.5 [&_button]:border-ops-rail-line [&_button]:bg-ops-rail-2 [&_button]:text-ops-rail-ink [&_button:hover]:border-ops-rail-muted">
				{children}
			</div>
			<button
				type="button"
				onClick={onClear}
				className="ml-auto text-[12.5px] text-ops-rail-muted hover:text-ops-rail-ink"
			>
				Clear
			</button>
		</div>
	);
}

/* ---------------- Avatars, thumbs, stars ---------------- */

export function Avatar({ name, size = 28 }: { name: string; size?: number }) {
	return (
		<span
			className="inline-grid shrink-0 place-items-center rounded-full border border-ops-line-strong bg-ops-surface-2 font-medium text-ops-ink-2"
			style={{ width: size, height: size, fontSize: size * 0.36 }}
		>
			{initials(name) || "?"}
		</span>
	);
}

/** Portrait thumb: fashion photography is roughly 4:5. */
export function Thumb({
	src,
	alt,
	size = 40,
	square,
}: {
	src: string;
	alt: string;
	size?: number;
	square?: boolean;
}) {
	return (
		<span
			className="relative inline-block shrink-0 overflow-hidden rounded-md bg-ops-sunken"
			style={{ width: square ? size : Math.round(size * 0.8), height: size }}
		>
			<AdminImage src={src} alt={alt} className="size-full object-cover" sizes={`${size}px`} />
		</span>
	);
}

export function Stars({ value, size = 12 }: { value: number; size?: number }) {
	return (
		<span
			role="img"
			className="inline-flex items-center gap-px text-ops-ink"
			aria-label={`${value} out of 5`}
		>
			{[1, 2, 3, 4, 5].map((n) => (
				<Star
					key={n}
					size={size}
					weight={n <= Math.round(value) ? "fill" : "regular"}
					className={n <= Math.round(value) ? "" : "text-ops-line-strong"}
				/>
			))}
		</span>
	);
}

/* ---------------- Overlays ---------------- */

export function Drawer({
	open,
	onClose,
	title,
	children,
	footer,
	width = 520,
}: {
	open: boolean;
	onClose: () => void;
	title: ReactNode;
	children: ReactNode;
	footer?: ReactNode;
	width?: number;
}) {
	return (
		<Sheet
			open={open}
			onOpenChange={(open) => {
				if (!open) onClose();
			}}
		>
			<SheetContent
				className="admin-workspace admin-content-theme flex w-full flex-col bg-ops-surface text-ops-ink sm:max-w-none"
				style={{ maxWidth: width }}
			>
				<SheetHeader>
					<SheetTitle>{title}</SheetTitle>
					<SheetDescription>Update this browser-local demo record.</SheetDescription>
				</SheetHeader>
				<div className="flex-1 overflow-y-auto px-5 pb-5">{children}</div>
				{footer && <SheetFooter>{footer}</SheetFooter>}
			</SheetContent>
		</Sheet>
	);
}
export function Modal({
	open,
	onClose,
	title,
	children,
	footer,
	width = 440,
}: {
	open: boolean;
	onClose: () => void;
	title: string;
	children: ReactNode;
	footer?: ReactNode;
	width?: number;
}) {
	return (
		<Dialog
			open={open}
			onOpenChange={(open) => {
				if (!open) onClose();
			}}
		>
			<DialogContent
				className="admin-workspace admin-content-theme bg-ops-surface text-ops-ink"
				style={{ maxWidth: width }}
			>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>Changes affect demo data in this browser only.</DialogDescription>
				</DialogHeader>
				<div className="max-h-[65vh] overflow-y-auto">{children}</div>
				{footer && <DialogFooter>{footer}</DialogFooter>}
			</DialogContent>
		</Dialog>
	);
}

export function Confirm({
	open,
	onClose,
	onConfirm,
	title,
	body,
	confirmLabel = "Confirm",
	danger,
}: {
	open: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title: string;
	body: ReactNode;
	confirmLabel?: string;
	danger?: boolean;
}) {
	return (
		<Modal
			open={open}
			onClose={onClose}
			title={title}
			footer={
				<>
					<Button onClick={onClose}>Keep as is</Button>
					<Button
						variant={danger ? "danger" : "primary"}
						onClick={() => {
							onConfirm();
							onClose();
						}}
					>
						{confirmLabel}
					</Button>
				</>
			}
		>
			{body}
		</Modal>
	);
}

export function Toasts() {
	const toasts = useStore((s) => s.toasts);
	const dismiss = useStore((s) => s.dismissToast);
	return (
		<div
			className="pointer-events-none fixed inset-x-3 bottom-20 z-[60] flex flex-col items-end gap-2 lg:inset-x-auto lg:bottom-4 lg:right-4"
			aria-live="polite"
		>
			{toasts.map((t) => {
				const I = t.tone === "ok" ? CheckCircle : t.tone === "bad" ? WarningCircle : Info;
				return (
					<div
						key={t.id}
						className="ops-anim-rise pointer-events-auto flex w-full max-w-sm items-center gap-2.5 rounded-lg bg-ops-rail px-3.5 py-2.5 text-[13px] text-ops-rail-ink shadow-ops-float"
					>
						<I
							size={17}
							weight="fill"
							className={t.tone === "bad" ? "text-[#ef8a80]" : "text-ops-rail-ink"}
						/>
						<span className="flex-1">{t.text}</span>
						<button
							type="button"
							aria-label="Dismiss"
							onClick={() => dismiss(t.id)}
							className="text-ops-rail-muted hover:text-ops-rail-ink"
						>
							<X size={13} />
						</button>
					</div>
				);
			})}
		</div>
	);
}

/* ---------------- Misc ---------------- */

export function KeyValue({ items }: { items: [string, ReactNode][] }) {
	return (
		<dl className="grid grid-cols-[minmax(104px,auto)_1fr] gap-x-4 gap-y-2 text-[13px]">
			{items.map(([k, v]) => (
				<div key={k} className="contents">
					<dt className="text-ops-muted">{k}</dt>
					<dd className="min-w-0 break-words text-ops-ink">{v}</dd>
				</div>
			))}
		</dl>
	);
}

export function Delta({ value, invert }: { value: number | null; invert?: boolean }) {
	if (value === null || !Number.isFinite(value))
		return <span className="text-[12px] text-ops-faint">no earlier data</span>;
	if (Math.abs(value) < 0.05) return <span className="ops-num text-[12px] text-ops-muted">no change</span>;
	const good = invert ? value < 0 : value > 0;
	return (
		<span className={cx("ops-num text-[12px] font-medium", good ? "text-ops-ok" : "text-ops-bad")}>
			{value > 0 ? "+" : "−"}
			{Math.abs(value).toFixed(1)}%
		</span>
	);
}
