import Link from "next/link";
import { Price } from "@/components/currency";
import { ProductCardDetails } from "@/components/product-card-details";
import { WishlistToggle } from "@/components/wishlist";
import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "@/lib/commerce-types";
import { priceRange, type TaxBehavior } from "@/lib/pricing";
import { StoreMedia } from "@/lib/store-media";
import { isVideoUrl } from "@/lib/utils";
import { QuickAddButton } from "./quick-add-button";

type BrowseProduct = APIProductsBrowseResult["data"][number];
type CollectionProduct = APICollectionGetByIdResult["productCollections"][number]["product"];
type FullProduct = NonNullable<APIProductGetByIdResult>;

export function ProductCardView({
	product,
	priority = false,
	taxBehavior,
	preview = false,
	renderImage,
}: {
	product: BrowseProduct | CollectionProduct | FullProduct;
	priority?: boolean;
	taxBehavior: TaxBehavior;
	preview?: boolean;
	renderImage?: (src: string, alt: string, className: string) => React.ReactNode;
}) {
	const variants = "variants" in product ? product.variants : null;
	const { min: minPrice, max: maxPrice } =
		variants && variants.length > 0 ? priceRange(variants, taxBehavior) : { min: null, max: null };

	const priceDisplay =
		variants && variants.length > 1 && minPrice && maxPrice && minPrice !== maxPrice ? (
			<>
				<Price amount={String(minPrice)} /> - <Price amount={String(maxPrice)} />
			</>
		) : minPrice ? (
			<Price amount={String(minPrice)} />
		) : null;

	const allImages = [
		...(product.images ?? []),
		...(variants?.flatMap((v) => v.images ?? []).filter((img) => !(product.images ?? []).includes(img)) ??
			[]),
	];
	const primaryImage = allImages[0];
	const secondaryImage = allImages[1];

	const singleVariant = variants?.length === 1 && variants[0]?.stock !== 0 ? variants[0] : null;

	// A single-variant card deep-links to that variant; a bare link would show the product's default.
	const onlyVariant = variants?.length === 1 ? variants[0] : null;
	const variantSearch = (() => {
		if (!onlyVariant || !("combinations" in onlyVariant) || onlyVariant.combinations.length === 0) {
			return "";
		}
		const params = new URLSearchParams();
		for (const combination of onlyVariant.combinations) {
			params.set(combination.variantValue.variantType.label, combination.variantValue.value);
		}
		return `?${params.toString()}`;
	})();

	return (
		<div className="group relative min-w-0">
			<Link
				href={`/product/${product.slug}${variantSearch}`}
				className="block min-w-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
			>
				<div className="relative mb-4 aspect-3/4 overflow-hidden bg-secondary">
					{singleVariant && !preview && (
						<QuickAddButton
							variantId={singleVariant.id}
							variantSku={"sku" in singleVariant ? singleVariant.sku : null}
							variantPrice={singleVariant.price}
							variantPriceGross={"priceGross" in singleVariant ? singleVariant.priceGross : null}
							variantImages={singleVariant.images}
							product={{
								id: product.id,
								name: product.name,
								slug: product.slug,
								images: product.images ?? [],
							}}
						/>
					)}
					{primaryImage &&
						(renderImage && primaryImage.startsWith("media:") ? (
							renderImage(primaryImage, product.name, "absolute inset-0 h-full w-full object-cover")
						) : isVideoUrl(primaryImage) ? (
							<video
								className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 motion-reduce:transition-none ${secondaryImage ? "group-hover:opacity-0" : ""}`}
								src={primaryImage}
								muted
								loop
								autoPlay
								playsInline
							/>
						) : (
							<StoreMedia
								src={primaryImage}
								alt={product.name}
								fill
								sizes="(max-width: 1023px) 50vw, (max-width: 1599px) 25vw, 360px"
								className={`object-cover transition-opacity duration-500 motion-reduce:transition-none ${secondaryImage ? "group-hover:opacity-0" : ""}`}
								priority={priority}
							/>
						))}
					{secondaryImage &&
						(renderImage && secondaryImage.startsWith("media:") ? (
							renderImage(
								secondaryImage,
								product.name,
								"absolute inset-0 h-full w-full object-cover opacity-0 group-hover:opacity-100",
							)
						) : isVideoUrl(secondaryImage) ? (
							<video
								className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100 motion-reduce:transition-none"
								src={secondaryImage}
								muted
								loop
								autoPlay
								playsInline
							/>
						) : (
							<StoreMedia
								src={secondaryImage}
								alt={`${product.name} - alternate view`}
								fill
								sizes="(max-width: 1023px) 50vw, (max-width: 1599px) 25vw, 360px"
								className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100 motion-reduce:transition-none"
							/>
						))}
				</div>
				<ProductCardDetails name={product.name} price={priceDisplay} />
			</Link>
			{!preview && (
				<WishlistToggle
					product={{ id: product.id, slug: product.slug, name: product.name, image: primaryImage ?? null }}
					className="absolute top-2 right-2 z-10"
				/>
			)}
		</div>
	);
}
