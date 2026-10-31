"use client";

import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useMemo, useRef, useState } from "react";
import { useSelectedVariant } from "@/app/(storefront)/product/[slug]/use-selected-variant";
import { Button } from "@/components/ui/button";
import { StoreMedia } from "@/lib/store-media";
import { cn, isVideoUrl } from "@/lib/utils";

type Variant = {
	id: string;
	images: string[];
	combinations: {
		variantValue: {
			value: string;
			variantType: {
				label: string;
			};
		};
	}[];
};

type MediaGalleryProps = {
	images: string[];
	productName: string;
	variants: Variant[];
};

export function MediaGallery({ images, productName, variants }: MediaGalleryProps) {
	const searchParams = useSearchParams();
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [isZoomed, setIsZoomed] = useState(false);

	// The gallery always shows the full image set (product + every variant image). When a
	// variant is selected we don't filter the list — that would hide the other thumbnails —
	// we just jump the active image to that variant's first photo within the full gallery.
	const displayImages = images;

	const selectedVariant = useSelectedVariant(variants);

	const variantImageIndex = useMemo(() => {
		// Only variants with real combinations drive the gallery jump.
		const firstVariantImage =
			selectedVariant && selectedVariant.combinations.length > 0 ? selectedVariant.images[0] : undefined;
		if (!firstVariantImage) return 0;

		const index = images.indexOf(firstVariantImage);
		return index >= 0 ? index : 0;
	}, [selectedVariant, images]);

	// Jump to the selected variant's image when the variant changes (avoids useEffect)
	const searchParamsKey = searchParams.toString();
	const prevSearchParamsKey = useRef(searchParamsKey);
	if (prevSearchParamsKey.current !== searchParamsKey) {
		prevSearchParamsKey.current = searchParamsKey;
		setSelectedIndex(variantImageIndex);
	}

	const handlePrevious = useCallback(() => {
		setSelectedIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
	}, [displayImages.length]);

	const handleNext = useCallback(() => {
		setSelectedIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
	}, [displayImages.length]);

	// Keyboard navigation: ArrowLeft / ArrowRight (scoped to gallery container)
	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLDivElement>) => {
			if (displayImages.length <= 1) return;

			if (e.key === "ArrowLeft") {
				e.preventDefault();
				handlePrevious();
			} else if (e.key === "ArrowRight") {
				e.preventDefault();
				handleNext();
			}
		},
		[displayImages.length, handlePrevious, handleNext],
	);

	if (displayImages.length === 0) {
		return (
			<div className="flex min-w-0 flex-col gap-4 lg:sticky lg:top-36 lg:self-start">
				<div className="flex aspect-3/4 items-center justify-center bg-secondary">
					<p className="text-muted-foreground">No images available</p>
				</div>
			</div>
		);
	}

	return (
		// WAI-APG carousel: a named region; arrow keys bubble up from the focusable controls inside.
		<section
			aria-roledescription="carousel"
			aria-label="Product media gallery"
			onKeyDown={handleKeyDown}
			className="flex min-w-0 flex-col gap-4 outline-none lg:sticky lg:top-36 lg:self-start"
		>
			{/* Main Image */}
			<div className="group relative aspect-3/4 overflow-hidden bg-secondary">
				{isVideoUrl(displayImages[selectedIndex] ?? "") ? (
					<video
						className="absolute inset-0 w-full h-full object-cover"
						src={displayImages[selectedIndex]}
						muted
						loop
						autoPlay
						playsInline
						controls
					/>
				) : (
					<StoreMedia
						src={displayImages[selectedIndex] ?? ""}
						alt={`${productName} - View ${selectedIndex + 1}`}
						fill
						sizes="(max-width: 1023px) 100vw, (max-width: 1599px) 50vw, 704px"
						className={cn(
							"object-cover transition-transform duration-500 motion-reduce:transition-none",
							isZoomed && "scale-150 cursor-zoom-out",
						)}
						onClick={() => setIsZoomed(!isZoomed)}
						priority
					/>
				)}

				{/* Navigation Arrows */}
				{displayImages.length > 1 && (
					<div className="absolute inset-x-4 top-1/2 flex -translate-y-1/2 justify-between transition-opacity group-focus-within:opacity-100 lg:opacity-0 lg:group-hover:opacity-100 motion-reduce:transition-none">
						<Button
							variant="secondary"
							size="icon"
							className="h-10 w-10 rounded-sm border border-border bg-background/95 hover:bg-background"
							onClick={(e) => {
								e.stopPropagation();
								handlePrevious();
							}}
							aria-label="Previous image"
						>
							<ChevronLeft className="h-5 w-5" />
						</Button>
						<Button
							variant="secondary"
							size="icon"
							className="h-10 w-10 rounded-sm border border-border bg-background/95 hover:bg-background"
							onClick={(e) => {
								e.stopPropagation();
								handleNext();
							}}
							aria-label="Next image"
						>
							<ChevronRight className="h-5 w-5" />
						</Button>
					</div>
				)}

				{/* Zoom Indicator (hidden for videos) */}
				{!isVideoUrl(displayImages[selectedIndex] ?? "") && (
					<div className="absolute bottom-4 right-4 opacity-0 transition-opacity group-hover:opacity-100 motion-reduce:transition-none">
						<div className="flex items-center gap-2 bg-background/95 px-3 py-1.5 text-xs font-medium">
							<ZoomIn className="h-3.5 w-3.5" />
							Click to zoom
						</div>
					</div>
				)}

				{/* Image Counter */}
				{displayImages.length > 1 && (
					<div className="absolute bottom-4 left-4 bg-background/95 px-3 py-1.5 text-xs font-medium">
						{selectedIndex + 1} / {displayImages.length}
					</div>
				)}
			</div>

			{/* Thumbnails */}
			{displayImages.length > 1 && (
				<div className="-m-1 flex gap-3 overflow-x-auto p-1">
					{displayImages.map((image, index) => (
						<button
							key={`${image}-${index}`}
							type="button"
							onClick={() => setSelectedIndex(index)}
							aria-label={`View image ${index + 1}`}
							aria-pressed={selectedIndex === index}
							className={cn(
								"relative aspect-3/4 w-16 shrink-0 overflow-hidden transition-opacity duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 sm:w-20 motion-reduce:transition-none",
								selectedIndex === index
									? "ring-2 ring-foreground ring-offset-2 ring-offset-background"
									: "opacity-60 hover:opacity-100",
							)}
						>
							{isVideoUrl(image) ? (
								<video
									className="absolute inset-0 w-full h-full object-cover"
									src={image}
									muted
									playsInline
								/>
							) : (
								<StoreMedia
									src={image}
									alt={`${productName} thumbnail ${index + 1}`}
									fill
									sizes="(max-width: 639px) 64px, 80px"
									className="object-cover"
								/>
							)}
						</button>
					))}
				</div>
			)}
		</section>
	);
}
