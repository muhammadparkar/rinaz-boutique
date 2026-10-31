"use client";

import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { searchDiscovery } from "@/app/search-discovery";
import { Price } from "@/components/currency";
import { Suggestions } from "@/components/search/suggestions";
import {
	getActiveId,
	makeKeyHandler,
	makeNavHandlers,
	useSearchController,
} from "@/components/search/use-search-controller";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { StoreMedia } from "@/lib/store-media";

const isTypingTarget = (el: EventTarget | null) =>
	el instanceof HTMLElement && (el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName));

export function SearchInput() {
	const searchParams = useSearchParams();
	const c = useSearchController(searchParams.get("q") ?? "");
	const [open, setOpen] = useState(false);
	const [products, setProducts] = useState<Awaited<ReturnType<typeof searchDiscovery>> | null>(null);
	const [discoveryError, setDiscoveryError] = useState(false);
	const [category, setCategory] = useState("All");
	const inputRef = useRef<HTMLInputElement>(null);
	const listboxId = useId();
	const close = () => setOpen(false);
	const { goToSearch, goToProduct, handleSubmit } = makeNavHandlers(c, close);
	const panelOpen = open && c.enoughChars;
	const categories = ["All", ...new Set(products?.flatMap((item) => (item.category ? [item.category] : [])))];
	const visibleProducts = products
		?.filter((item) => category === "All" || item.category === category)
		.slice(0, 6);

	useEffect(() => {
		if (!open || products) return;
		let cancelled = false;
		setDiscoveryError(false);
		searchDiscovery().then(
			(items) => {
				if (!cancelled) setProducts(items);
			},
			() => {
				if (!cancelled) setDiscoveryError(true);
			},
		);
		return () => {
			cancelled = true;
		};
	}, [open, products]);

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (!((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !isTypingTarget(e.target))))
				return;
			e.preventDefault();
			setOpen(true);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger
				data-search-underline
				aria-label="Search the atelier"
				aria-keyshortcuts="/ Meta+K"
				className="inline-flex h-11 w-11 items-center justify-center gap-3 text-foreground transition-colors hover:bg-secondary xl:h-8 xl:w-full xl:justify-start xl:border-b xl:border-foreground/60"
			>
				<Search className="size-5 shrink-0" strokeWidth={1.5} />
				<span className="hidden truncate text-sm text-muted-foreground xl:inline">
					What are you looking for?
				</span>
			</SheetTrigger>
			<SheetContent
				side="top"
				onOpenAutoFocus={(event) => {
					event.preventDefault();
					inputRef.current?.focus();
				}}
				className="search-panel max-h-[90svh] gap-0 overflow-y-auto px-5 pb-10 font-[Helvetica_Neue,Helvetica,sans-serif] sm:px-8 lg:px-12 lg:pb-12 [&_h2]:font-[inherit] [&>button]:top-5 [&>button]:right-5 [&>button]:grid [&>button]:size-11 [&>button]:place-items-center [&>button>svg]:size-6 lg:[&>button]:top-[76px] lg:[&>button]:right-10"
			>
				<SheetTitle className="sr-only">Search RINAZ</SheetTitle>
				<SheetDescription className="sr-only">Search products or explore our collections.</SheetDescription>
				<div className="mx-auto flex h-20 w-full max-w-[1600px] items-center justify-center lg:h-24">
					<Image
						src="/brand/rinaz-v3.png"
						alt="RINAZ STUDIO"
						width={1220}
						height={361}
						sizes="150px"
						className="h-auto w-32 lg:w-40"
					/>
				</div>
				<div className="mx-auto grid w-full max-w-[1600px] gap-x-16 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
					<search className="min-w-0 lg:col-start-2 lg:row-start-1 lg:pr-12">
						<form onSubmit={handleSubmit}>
							<label htmlFor={`${listboxId}-input`} className="sr-only">
								Search products
							</label>
							<div className="flex min-h-11 items-center gap-3 border-b-2 border-foreground pb-2">
								<Search className="size-5 shrink-0 text-muted-foreground" strokeWidth={1.5} />
								<input
									ref={inputRef}
									id={`${listboxId}-input`}
									type="search"
									name="q"
									placeholder="What are you looking for?"
									value={c.query}
									onChange={(event) => c.setQuery(event.target.value)}
									onKeyDown={makeKeyHandler(c, panelOpen, close, () => goToSearch(c.query))}
									role="combobox"
									aria-expanded={panelOpen}
									aria-controls={panelOpen ? listboxId : undefined}
									aria-autocomplete="list"
									aria-activedescendant={getActiveId(listboxId, c, panelOpen)}
									enterKeyHint="search"
									autoComplete="off"
									className="h-9 min-w-0 flex-1 bg-transparent text-base text-foreground placeholder:text-muted-foreground focus:outline-none sm:text-lg [&::-webkit-search-cancel-button]:hidden"
								/>
								{c.query && (
									<button
										type="button"
										aria-label="Clear search"
										className="min-h-8 px-2 text-xs underline"
										onClick={() => {
											c.setQuery("");
											inputRef.current?.focus();
										}}
									>
										Clear
									</button>
								)}
							</div>
						</form>
						{panelOpen && (
							<div className="mt-6">
								<Suggestions
									listboxId={listboxId}
									open={panelOpen}
									c={c}
									onPick={goToProduct}
									onSeeAll={() => goToSearch(c.query)}
								/>
							</div>
						)}
					</search>
					<div className="mt-7 min-w-0 lg:col-start-1 lg:row-start-1 lg:mt-0">
						<fieldset className="flex min-h-11 gap-5 overflow-x-auto border-b border-border">
							<legend className="sr-only">Filter featured products by category</legend>
							{categories.map((name) => (
								<button
									key={name}
									type="button"
									data-search-underline
									aria-pressed={category === name}
									onClick={() => setCategory(name)}
									className={`min-h-11 shrink-0 border-b-2 text-xs uppercase sm:text-sm ${category === name ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
								>
									{name}
								</button>
							))}
						</fieldset>
						<h2 className="mt-8 mb-5 text-sm font-normal text-muted-foreground">Explore the collection</h2>
						{!products && !discoveryError && (
							<p role="status" className="py-10 text-sm text-muted-foreground">
								Loading products…
							</p>
						)}
						{discoveryError && (
							<p role="status" className="py-10 text-sm text-muted-foreground">
								Product previews unavailable. You can still search above or{" "}
								<Link href="/products" onClick={close} className="underline">
									browse all products
								</Link>
								.
							</p>
						)}
						{products?.length === 0 && (
							<p className="py-10 text-sm text-muted-foreground">
								No products to preview.{" "}
								<Link href="/products" onClick={close} className="underline">
									Browse collections
								</Link>
								.
							</p>
						)}
						<div className="flex gap-4 overflow-x-auto pb-3 sm:gap-5">
							{visibleProducts?.map((product) => (
								<Link
									key={product.id}
									href={`/product/${product.slug}`}
									onClick={close}
									className="group w-36 shrink-0 sm:w-40 lg:w-[calc((100%-60px)/4)] lg:min-w-36"
								>
									<div className="relative aspect-3/4 overflow-hidden bg-secondary">
										{product.image && (
											<StoreMedia
												src={product.image}
												alt={product.name}
												fill
												sizes="(min-width: 1024px) 180px, 160px"
												className="object-cover"
											/>
										)}
									</div>
									<h3 className="mt-3 text-sm font-semibold leading-5 group-hover:underline">
										{product.name}
									</h3>
									{product.price !== null && (
										<p className="mt-5 text-sm font-semibold">
											<Price amount={product.price} />
										</p>
									)}
								</Link>
							))}
						</div>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}
