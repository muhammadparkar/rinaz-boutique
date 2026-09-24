"use client";

import { ArrowRightIcon, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const photo = (id: string) => `https://images.unsplash.com/photo-${id}?w=1400&q=80&auto=format&fit=crop`;

const SLIDE_MS = 6500;

const slides = [
	{
		id: "new-in",
		title: "Timeless Style.",
		accent: "Modern Luxury",
		copy: "Handcrafted luxury Abayas, certified 18K solid gold jewelry, and bespoke Pakistani bridal couture created for modern poise.",
		cta: { label: "SHOP NEW IN", href: "/collection/new-in" },
		secondary: { label: "BOOK PRIVATE SALON", href: "/#sanctuary" },
		images: [
			{ src: photo("1724412665971-114bd351a42d"), alt: "Black abaya with champagne gold embroidery" },
			{ src: photo("1760083545495-b297b1690672"), alt: "Beige open abaya with tonal needlework" },
		],
	},
	{
		id: "golden-hour",
		title: "The Golden Hour",
		accent: "Collection",
		copy: "Sculpted in pure double-faced georgette silk and metallic gold zardozi for intimate ceremonies and receptions.",
		cta: { label: "SHOP THE CAPSULE", href: "/collection/golden-hour" },
		secondary: { label: "BRIDAL PRET", href: "/collection/bridal-pret" },
		images: [
			{ src: photo("1747847471517-952a3eb93a89"), alt: "Bride in hand-embroidered Pakistani couture" },
			{ src: photo("1733470324488-d0e10d014d80"), alt: "Pastel formal ensemble beneath a floral arch" },
		],
	},
	{
		id: "fine-jewelry",
		title: "18K Fine",
		accent: "Jewelry",
		copy: "Bridal diamonds and hallmarked solid gold, each piece delivered with a signed Certificate of Valuation.",
		cta: { label: "SHOP JEWELRY", href: "/category/fine-jewelry" },
		secondary: { label: "THE TEARDROP PENDANT", href: "/product/the-gilded-teardrop-diamond-pendant" },
		images: [
			{ src: photo("1773832190768-b4c4667ceeb4"), alt: "Gold pendant set with diamonds" },
			{ src: photo("1654699991520-aaaf4dd2608b"), alt: "Strand of South Sea pearls" },
		],
	},
];

const controlButton = "grid size-9 place-items-center rounded-full transition-colors hover:bg-[#faf7f2]/15";

// Campaign carousel: two full-bleed portrait frames per slide on desktop, one on phones. The progress
// bar's CSS animation is the timer: when it ends the next slide shows, and pausing it pauses autoplay.
export function Hero() {
	const [active, setActive] = useState(0);
	const [paused, setPaused] = useState(false);
	const [hovered, setHovered] = useState(false);

	// Autoplay stays off for anyone who asked the OS for less motion.
	useEffect(() => {
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPaused(true);
	}, []);

	const go = (index: number) => setActive((index + slides.length) % slides.length);
	const slide = slides[active];
	const running = !paused && !hovered;
	if (!slide) return null;

	return (
		<section
			aria-roledescription="carousel"
			aria-label="Featured collections"
			className="relative isolate h-[calc(100svh-65px)] min-h-[520px] overflow-hidden bg-neutral-900 text-[#faf7f2]"
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
			onFocus={() => setHovered(true)}
			onBlur={(e) => {
				if (!e.currentTarget.contains(e.relatedTarget)) setHovered(false);
			}}
		>
			<h1 className="sr-only">RINAZ STUDIO: Haute Abayas, Fine Jewelry & Pakistani Couture</h1>

			{/* Slides crossfade; the active one settles from a slight zoom while it is on screen. */}
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
							"absolute inset-0 grid transition-opacity duration-1000 ease-out-expo md:grid-cols-2",
							isActive ? "opacity-100" : "opacity-0",
						)}
					>
						{s.images.map((img, i) => (
							<div key={img.src} className={cn("relative overflow-hidden", i > 0 && "hidden md:block")}>
								<Image
									src={img.src}
									alt={img.alt}
									fill
									priority={index === 0}
									sizes="(min-width: 768px) 50vw, 100vw"
									className={cn(
										"object-cover object-[center_25%] transition-transform duration-[7000ms] ease-out motion-reduce:transition-none",
										isActive ? "scale-100" : "scale-[1.06]",
									)}
								/>
							</div>
						))}
					</div>
				);
			})}

			{/* Scrim keeps the copy legible on any photograph. */}
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 bg-linear-to-t from-neutral-950/80 via-neutral-950/25 to-transparent"
			/>

			<div className="absolute inset-x-0 bottom-0 z-10">
				<div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 pb-24 sm:px-6 md:pb-12 lg:flex-row lg:items-end lg:justify-between lg:px-8">
					{/* Copy remounts per slide so its entrance replays. */}
					<div key={slide.id} className="max-w-2xl" aria-live={running ? "off" : "polite"}>
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
							className="mt-5 max-w-md animate-rise text-sm leading-relaxed text-[#faf7f2]/85 sm:text-base motion-reduce:animate-none"
							style={{ animationDelay: "180ms" }}
						>
							{slide.copy}
						</p>
						<div
							className="mt-7 flex animate-rise flex-wrap items-center gap-x-6 gap-y-3 motion-reduce:animate-none"
							style={{ animationDelay: "270ms" }}
						>
							<Button
								asChild
								size="lg"
								className="h-12 rounded-full bg-[#faf7f2] px-7 text-xs tracking-[0.2em] text-neutral-900 hover:bg-[#faf7f2]/90"
							>
								<Link href={slide.cta.href}>
									{slide.cta.label}
									<ArrowRightIcon />
								</Link>
							</Button>
							<Link
								href={slide.secondary.href}
								className="text-xs font-medium tracking-[0.2em] underline decoration-[#faf7f2]/40 underline-offset-8 transition-colors hover:decoration-[#faf7f2]"
							>
								{slide.secondary.label}
							</Link>
						</div>
					</div>

					<div className="absolute right-4 bottom-6 left-4 flex items-center gap-4 sm:right-6 sm:left-6 md:static md:w-80 md:flex-none">
						<div className="flex flex-1 gap-2">
							{slides.map((s, index) => (
								<button
									key={s.id}
									type="button"
									onClick={() => go(index)}
									aria-label={`Show slide ${index + 1}: ${s.title} ${s.accent}`}
									aria-current={index === active}
									className="relative h-6 flex-1"
								>
									<span className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 overflow-hidden bg-[#faf7f2]/30">
										<span
											key={index === active ? `run-${active}` : "idle"}
											className={cn(
												"absolute inset-0 origin-left bg-[#faf7f2]",
												index < active && "scale-x-100",
												index > active && "scale-x-0",
												index === active && "animate-[progress_linear_both]",
											)}
											style={
												index === active
													? {
															animationDuration: `${SLIDE_MS}ms`,
															animationPlayState: running ? "running" : "paused",
														}
													: undefined
											}
											onAnimationEnd={() => go(active + 1)}
										/>
									</span>
								</button>
							))}
						</div>
						<span className="text-[11px] tabular-nums tracking-widest text-[#faf7f2]/85">
							{String(active + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
						</span>
						<div className="flex items-center">
							<button
								type="button"
								onClick={() => go(active - 1)}
								aria-label="Previous slide"
								className={controlButton}
							>
								<ChevronLeft className="size-4" />
							</button>
							<button
								type="button"
								onClick={() => setPaused((p) => !p)}
								aria-label={paused ? "Play slideshow" : "Pause slideshow"}
								className={controlButton}
							>
								{paused ? <Play className="size-3.5" /> : <Pause className="size-3.5" />}
							</button>
							<button
								type="button"
								onClick={() => go(active + 1)}
								aria-label="Next slide"
								className={controlButton}
							>
								<ChevronRight className="size-4" />
							</button>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
