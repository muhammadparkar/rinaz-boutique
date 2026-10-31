"use client";

import Image from "next/image";
import Link from "next/link";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { type HeroSlide, heroSlides } from "@/lib/storefront-content";
import { cn } from "@/lib/utils";

// Campaign stays still; CMS preview can select another slide.
export function Hero({
	slides = heroSlides,
	renderImage,
	selectedSlideId,
	navigation = [],
}: {
	navigation?: { href: string; label: string }[];
	slides?: HeroSlide[];
	selectedSlideId?: string;
	onSlideChange?: (id: string) => void;
	renderImage?: (props: {
		src: string;
		alt: string;
		priority: boolean;
		sizes: string;
		className: string;
	}) => ReactNode;
}) {
	const [active, setActive] = useState(0);
	const heroRef = useRef<HTMLElement>(null);

	useEffect(() => {
		const hero = heroRef.current;
		const header = hero?.closest(".storefront")?.querySelector("header");
		if (!hero || !header) return;
		const observer = new IntersectionObserver(
			([entry]) => {
				header.dataset.heroVisible = String(entry?.isIntersecting ?? false);
			},
			{ rootMargin: "-56px 0px 0px 0px" },
		);
		observer.observe(hero);
		return () => {
			observer.disconnect();
			delete header.dataset.heroVisible;
		};
	}, []);

	useEffect(() => {
		if (!selectedSlideId) return;
		const index = slides.findIndex((slide) => slide.id === selectedSlideId);
		if (index >= 0) {
			setActive(index);
		}
	}, [selectedSlideId, slides]);

	const slide = slides[active];
	if (!slide) return null;

	return (
		<section
			ref={heroRef}
			aria-label="Featured collections"
			className="storefront-hero relative isolate h-[calc(100svh-56px)] min-h-[520px] w-full overflow-hidden bg-neutral-900 text-[#faf7f2] xl:h-[calc(100svh-96px)]"
		>
			<h1 className="sr-only">RINAZ STUDIO: Haute Abayas, Fine Jewelry & Pakistani Couture</h1>

			{/* Slides crossfade while photographs keep a fixed crop. */}
			{slides.map((s, index) => {
				const isActive = index === active;
				return (
					// biome-ignore lint/a11y/useSemanticElements: WAI-ARIA carousel pattern, each slide is a labelled group
					<div
						key={s.id}
						role="group"
						aria-roledescription="slide"
						aria-label={`${index + 1} of ${slides.length}: ${s.title} ${s.accent}`}
						aria-hidden={!isActive}
						inert={!isActive}
						className={cn(
							"absolute inset-0 grid transition-opacity duration-1000 ease-out-expo motion-reduce:transition-none md:grid-cols-2",
							isActive ? "opacity-100" : "opacity-0",
						)}
					>
						{s.images.map((img, i) => (
							<div key={img.src} className={cn("relative overflow-hidden", i > 0 && "hidden md:block")}>
								{renderImage ? (
									renderImage({
										src: img.src,
										alt: img.alt,
										priority: index === 0 && i === 0,
										sizes: "(min-width: 768px) 50vw, 100vw",
										className: "absolute inset-0 h-full w-full object-cover object-[center_25%]",
									})
								) : (
									<Image
										src={img.src}
										alt={img.alt}
										fill
										priority={index === 0 && i === 0}
										fetchPriority={index === 0 && i === 0 ? "high" : "auto"}
										sizes="(min-width: 768px) 50vw, 100vw"
										className="object-cover object-[center_25%]"
									/>
								)}
							</div>
						))}
					</div>
				);
			})}

			{/* Scrim keeps the copy legible on any photograph. */}
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 bg-linear-to-t from-neutral-950/70 via-neutral-950/50 to-neutral-950/30"
			/>

			<div className="absolute inset-0 z-10">
				<div className="mx-auto h-full max-w-7xl px-5 sm:px-8">
					{/* Copy remounts per slide so its entrance replays. */}
					<div
						key={slide.id}
						className="hero-campaign-copy absolute inset-x-5 top-1/2 mx-auto max-w-3xl -translate-y-1/2 text-center sm:inset-x-8"
						aria-live="polite"
					>
						<h2 className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] tracking-[-0.01em]">
							<span className="block animate-rise motion-reduce:animate-none">{slide.title}</span>
							<span
								className="block animate-rise italic text-[#faf7f2]/85 motion-reduce:animate-none"
								style={{ animationDelay: "90ms" }}
							>
								{slide.accent}
							</span>
						</h2>
						<p
							className="mx-auto mt-5 max-w-md animate-rise text-sm leading-relaxed text-[#faf7f2]/90 sm:text-base motion-reduce:animate-none"
							style={{ animationDelay: "180ms" }}
						>
							{slide.copy}
						</p>
					</div>
				</div>
			</div>
			{navigation.length > 0 && (
				<nav
					aria-label="Featured categories"
					className="absolute inset-x-5 bottom-5 z-10 flex items-center gap-7 overflow-x-auto whitespace-nowrap text-xs text-[#faf7f2] md:inset-x-8 md:justify-center md:gap-8 md:text-sm"
				>
					{navigation.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							className="inline-flex min-h-11 shrink-0 items-center border-b border-transparent tracking-wide hover:border-current"
						>
							{link.label}
						</Link>
					))}
				</nav>
			)}
		</section>
	);
}
