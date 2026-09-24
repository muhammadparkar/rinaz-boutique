"use client";

import { ArrowRightIcon, Search } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { Suggestions } from "@/components/search/suggestions";
import {
	getActiveId,
	makeKeyHandler,
	makeNavHandlers,
	useSearchController,
} from "@/components/search/use-search-controller";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const departments = [
	{ label: "Haute Abayas", href: "/category/haute-abayas" },
	{ label: "18K Fine Jewelry", href: "/category/fine-jewelry" },
	{ label: "Pakistani Couture", href: "/category/pakistani-couture" },
	{ label: "Bridal Pret", href: "/collection/bridal-pret" },
];

const popular = ["Silk abaya", "Anarkali", "Diamond pendant", "Pearl", "Peshwas"];

const isTypingTarget = (el: EventTarget | null) =>
	el instanceof HTMLElement && (el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName));

// One search surface at every breakpoint: a header trigger (plus "/" and ⌘K) opens a
// top sheet; before typing it offers departments and popular searches instead of a blank box.
export function SearchInput() {
	const searchParams = useSearchParams();
	const c = useSearchController(searchParams.get("q") ?? "");
	const [open, setOpen] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const listboxId = useId();

	const close = () => setOpen(false);
	const { goToSearch, goToProduct, handleSubmit } = makeNavHandlers(c, close);
	const panelOpen = open && c.enoughChars;

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			const shortcut =
				(e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !isTypingTarget(e.target));
			if (!shortcut) return;
			e.preventDefault();
			setOpen(true);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger
				aria-label="Search"
				aria-keyshortcuts="/ Meta+K"
				className="group inline-flex h-10 items-center gap-3 rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground xl:border xl:border-border xl:pr-2 xl:pl-4"
			>
				<Search className="h-5 w-5 xl:h-4 xl:w-4" strokeWidth={1.75} />
				<span className="hidden text-sm xl:inline">Search the atelier</span>
				<kbd className="hidden h-6 min-w-6 items-center justify-center rounded-full border border-border px-2 font-sans text-[11px] xl:inline-flex">
					/
				</kbd>
			</SheetTrigger>

			<SheetContent
				side="top"
				onOpenAutoFocus={(e) => {
					e.preventDefault();
					inputRef.current?.focus();
				}}
				className="max-h-[85svh] gap-0 overflow-y-auto"
			>
				<SheetTitle className="sr-only">Search</SheetTitle>
				<SheetDescription className="sr-only">
					Search abayas, fine jewelry and Pakistani couture
				</SheetDescription>

				<div className="mx-auto w-full max-w-3xl px-4 pt-14 pb-10 sm:px-6 sm:pt-16">
					<search>
						<form onSubmit={handleSubmit}>
							<label htmlFor={`${listboxId}-input`} className="sr-only">
								Search products
							</label>
							<div className="flex items-center gap-4 border-b border-foreground/80 pb-3">
								<Search className="h-6 w-6 flex-none text-muted-foreground" strokeWidth={1.5} />
								<input
									ref={inputRef}
									id={`${listboxId}-input`}
									type="search"
									name="q"
									placeholder="What are you looking for?"
									value={c.query}
									onChange={(e) => c.setQuery(e.target.value)}
									onKeyDown={makeKeyHandler(c, panelOpen, close, () => goToSearch(c.query))}
									role="combobox"
									aria-expanded={panelOpen}
									aria-controls={listboxId}
									aria-autocomplete="list"
									aria-activedescendant={getActiveId(listboxId, c, panelOpen)}
									enterKeyHint="search"
									autoComplete="off"
									className="min-w-0 flex-1 bg-transparent font-display text-3xl text-foreground placeholder:text-muted-foreground/70 focus:outline-none sm:text-4xl [&::-webkit-search-cancel-button]:hidden"
								/>
								{c.query ? (
									<button
										type="button"
										onClick={() => {
											c.setQuery("");
											inputRef.current?.focus();
										}}
										className="h-8 flex-none rounded-full px-3 text-xs tracking-widest text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
									>
										CLEAR
									</button>
								) : null}
							</div>
						</form>
					</search>

					{panelOpen ? (
						<div className="mt-4">
							<Suggestions
								listboxId={listboxId}
								open={panelOpen}
								c={c}
								onPick={goToProduct}
								onSeeAll={() => goToSearch(c.query)}
							/>
						</div>
					) : (
						<div className="mt-10 grid gap-10 sm:grid-cols-2">
							<section>
								<h2 className="font-sans text-xs tracking-[0.2em] text-muted-foreground">DEPARTMENTS</h2>
								<ul className="mt-4">
									{departments.map((d) => (
										<li key={d.href}>
											<Link
												href={d.href}
												onClick={close}
												className="group flex items-center justify-between border-b border-border py-3 font-display text-xl transition-colors hover:text-muted-foreground"
											>
												{d.label}
												<ArrowRightIcon className="h-4 w-4 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
											</Link>
										</li>
									))}
								</ul>
							</section>
							<section>
								<h2 className="font-sans text-xs tracking-[0.2em] text-muted-foreground">POPULAR SEARCHES</h2>
								<ul className="mt-4 flex flex-wrap gap-2">
									{popular.map((term) => (
										<li key={term}>
											<button
												type="button"
												onClick={() => {
													c.setQuery(term);
													inputRef.current?.focus();
												}}
												className="h-9 rounded-full border border-border px-4 text-sm transition-colors hover:border-foreground"
											>
												{term}
											</button>
										</li>
									))}
								</ul>
								<p className="mt-8 hidden text-xs text-muted-foreground sm:block">
									Press <kbd className="rounded border border-border px-1.5">↑</kbd>{" "}
									<kbd className="rounded border border-border px-1.5">↓</kbd> to move,{" "}
									<kbd className="rounded border border-border px-1.5">Enter</kbd> to open,{" "}
									<kbd className="rounded border border-border px-1.5">Esc</kbd> to close.
								</p>
							</section>
						</div>
					)}
				</div>
			</SheetContent>
		</Sheet>
	);
}
