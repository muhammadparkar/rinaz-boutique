"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Children, useEffect, useId, useRef, useState } from "react";

export function ProductGridLayout({
	title,
	description,
	showViewAll = true,
	viewAllHref = "/products",
	children,
}: {
	title: string;
	description: string;
	showViewAll?: boolean;
	viewAllHref?: string;
	children: React.ReactNode;
}) {
	const rail = useRef<HTMLDivElement>(null);
	const id = useId();
	const [canScroll, setCanScroll] = useState({ previous: false, next: false });
	useEffect(() => {
		const element = rail.current;
		if (!element) return;
		const update = () =>
			setCanScroll({
				previous: element.scrollLeft > 1,
				next: element.scrollLeft + element.clientWidth < element.scrollWidth - 1,
			});
		update();
		const observer = new ResizeObserver(update);
		observer.observe(element);
		element.addEventListener("scroll", update, { passive: true });
		return () => {
			observer.disconnect();
			element.removeEventListener("scroll", update);
		};
	}, []);
	const scroll = (direction: number) =>
		rail.current?.scrollBy({
			left: direction * rail.current.clientWidth,
			behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
		});
	return (
		<section aria-labelledby={`${id}-title`} className="reference-collection mx-auto w-full py-7 sm:py-9">
			<div className="mb-5 text-center">
				<div className="flex items-center justify-center gap-3">
					<button
						type="button"
						onClick={() => scroll(-1)}
						aria-label={`Previous ${title} products`}
						disabled={!canScroll.previous}
						aria-controls={`${id}-rail`}
						className="grid size-8 place-items-center text-muted-foreground hover:text-foreground disabled:opacity-35"
					>
						<ChevronLeft className="size-4" strokeWidth={1.2} />
					</button>
					<h2 id={`${id}-title`} className="text-xl font-normal">
						{title}
					</h2>
					<button
						type="button"
						onClick={() => scroll(1)}
						aria-label={`Next ${title} products`}
						disabled={!canScroll.next}
						aria-controls={`${id}-rail`}
						className="grid size-8 place-items-center text-muted-foreground hover:text-foreground disabled:opacity-35"
					>
						<ChevronRight className="size-4" strokeWidth={1.2} />
					</button>
				</div>
				{description && <p className="sr-only">{description}</p>}
				{showViewAll && (
					<Link
						href={viewAllHref}
						className="inline-flex min-h-6 items-center text-[10px] uppercase tracking-[0.12em] text-primary underline underline-offset-4"
					>
						View all
					</Link>
				)}
			</div>
			<div
				id={`${id}-rail`}
				ref={rail}
				className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-2 sm:scroll-px-8 sm:gap-5 sm:px-8 lg:scroll-px-12 lg:px-12 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [&>div:first-child]:ms-auto [&>div:last-child]:me-auto"
			>
				{Children.map(children, (child) => (
					<div className="w-[64vw] shrink-0 snap-start sm:w-[calc((100vw-84px)/3)] lg:w-[calc((100vw-156px)/4.3)]">
						{child}
					</div>
				))}
			</div>
		</section>
	);
}
