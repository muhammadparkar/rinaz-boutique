import type { APICollectionGetByIdResult } from "commerce-kit";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ListingShell } from "@/components/listing-shell";
import { ProductCard } from "@/components/product-card";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { commerce, getStoreSeo } from "@/lib/commerce";
import { getFilterFacets, getListingSort } from "@/lib/facets";
import { buildCollectionBreadcrumbJsonLd, buildCollectionJsonLd, JsonLdScript } from "@/lib/json-ld";
import { encodeVts } from "@/lib/vts";

// The page has no pagination, so a smart collection renders one browse page. 100 is the API's max.
const SMART_COLLECTION_LIMIT = 100;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
	"use cache";
	cacheLife("minutes");
	const { slug } = await params;
	const collection = await commerce.collectionGet({ idOrSlug: slug });

	if (!collection) {
		return { title: "Collection Not Found", robots: { index: false, follow: true } };
	}

	const { storeName } = await getStoreSeo();
	const description =
		typeof collection.description === "string"
			? collection.description
			: `Shop the ${collection.name} collection at ${storeName}.`;
	const canonical = `/collection/${collection.slug}`;

	return {
		title: collection.name,
		description,
		alternates: { canonical },
		openGraph: {
			type: "website",
			title: collection.name,
			description,
			url: canonical,
			images: collection.image ? [{ url: collection.image, alt: collection.name }] : undefined,
		},
		twitter: {
			card: collection.image ? "summary_large_image" : "summary",
			title: collection.name,
			description,
			images: collection.image ? [collection.image] : undefined,
		},
	};
}

// Only a `manual` collection keeps its members in the join table that `collectionGet` returns —
// the smart filters are evaluated against the whole catalog when the storefront asks for them.
// Re-expressing each one as the equivalent product browse is what keeps those collections from
// rendering as an empty grid.
async function getCollectionProducts(collection: APICollectionGetByIdResult) {
	const { filter } = collection;

	if (filter.type === "manual") {
		const ids = collection.productCollections.map((pc) => pc.product.id);
		return (await Promise.all(ids.map((id) => commerce.productGet({ idOrSlug: id })))).filter(
			(product) => product !== null,
		);
	}

	if (filter.type === "variantValues") {
		const { data } = await commerce.productBrowse({
			active: true,
			limit: SMART_COLLECTION_LIMIT,
			vts: encodeVts(filter.values),
		});
		return data;
	}

	if (filter.type === "dynamicPrice") {
		const { data } = await commerce.productBrowse({
			active: true,
			limit: SMART_COLLECTION_LIMIT,
			priceMin: filter.min ?? undefined,
			priceMax: filter.max ?? undefined,
		});
		return data;
	}

	const { data } = await commerce.productBrowse({
		active: true,
		limit: SMART_COLLECTION_LIMIT,
		orderBy: "createdAt",
		orderDirection: "desc",
	});

	// A rolling "new arrivals" window has no browse equivalent, so the age bound is applied here.
	if (typeof filter.days !== "number") {
		return data;
	}
	const cutoff = Date.now() - filter.days * MS_PER_DAY;
	return data.filter((product) => new Date(product.createdAt).getTime() >= cutoff);
}

type CollectionFilterParams = { sort?: string; category?: string; priceMin?: string; priceMax?: string };

// Collections render in one page, so the sidebar filters and sort apply to the member list here.
// ponytail: in-memory filter over at most SMART_COLLECTION_LIMIT products; move to the API if collections grow past that.
async function CollectionProducts({
	collection,
	searchParams,
}: {
	collection: APICollectionGetByIdResult;
	searchParams: Promise<CollectionFilterParams>;
}) {
	const [filters, products] = await Promise.all([searchParams, getCollectionProducts(collection)]);
	const { orderBy, orderDirection } = getListingSort(filters.sort);
	const priceOf = (p: (typeof products)[number]) => Number(p.variants[0]?.price ?? 0);
	const min = filters.priceMin ? Number(filters.priceMin) : Number.NEGATIVE_INFINITY;
	const max = filters.priceMax ? Number(filters.priceMax) : Number.POSITIVE_INFINITY;
	const key = (p: (typeof products)[number]) =>
		orderBy === "price" ? priceOf(p) : orderBy === "name" ? p.name : p.createdAt;
	const dir = orderDirection === "asc" ? 1 : -1;

	const shown = products
		.filter((p) => !filters.category || p.category?.slug === filters.category)
		.filter((p) => priceOf(p) >= min && priceOf(p) <= max)
		.sort((a, b) => (key(a) > key(b) ? dir : key(a) < key(b) ? -dir : 0));

	if (shown.length === 0) {
		return (
			<div className="py-24 text-center">
				<p className="text-lg text-muted-foreground">No products match these filters.</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 xl:grid-cols-3">
			{shown.map((product, index) => (
				<ProductCard key={product.id} product={product} priority={index === 0} />
			))}
		</div>
	);
}

// Awaiting params at the top of the page blocks the static shell — the page
// stays a sync shell and the params-dependent content streams inside Suspense.
export default function CollectionPage(props: PageProps<"/collection/[slug]">) {
	return (
		<Suspense fallback={<ProductGridSkeleton />}>
			<CollectionContent params={props.params} searchParams={props.searchParams} />
		</Suspense>
	);
}

const getCollectionData = async (slug: string) => {
	"use cache";
	cacheLife("minutes");
	return commerce.collectionGet({ idOrSlug: slug });
};

const CollectionContent = async ({
	params,
	searchParams,
}: {
	params: PageProps<"/collection/[slug]">["params"];
	searchParams: Promise<CollectionFilterParams>;
}) => {
	const { slug } = await params;
	const [collection, facets] = await Promise.all([getCollectionData(slug), getFilterFacets()]);

	if (!collection) {
		notFound();
	}

	return (
		<>
			<JsonLdScript data={buildCollectionJsonLd(collection)} />
			<JsonLdScript data={buildCollectionBreadcrumbJsonLd(collection)} />
			<ListingShell
				crumbs={[{ name: collection.name }]}
				title={collection.name}
				description={typeof collection.description === "string" ? collection.description : null}
				facets={{ ...facets, variantTypes: [], brands: [] }}
				showCollections={false}
			>
				<Suspense fallback={<ProductGridSkeleton />}>
					<CollectionProducts collection={collection} searchParams={searchParams} />
				</Suspense>
			</ListingShell>
		</>
	);
};
