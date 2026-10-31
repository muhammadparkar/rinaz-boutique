import Link from "next/link";
import { Fragment, type ReactNode, Suspense } from "react";
import { SortLinks, SortSelect } from "@/app/(storefront)/products/products-sort-select";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { ProductFilters, ProductFiltersMobile } from "@/components/sections/product-filters";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import type { APIProductFiltersResult } from "@/lib/commerce-types";
import { LISTING_SORT_OPTIONS } from "@/lib/facets";

type Crumb = { name: string; href?: string };

// Shared listing layout keeps heading in the shell and request-time controls with the grid.
// The controls read useSearchParams(), so they share one Suspense boundary with the grid while the
// breadcrumb and heading stay in the prerendered shell.
export function ListingShell({
	crumbs,
	title,
	description,
	facets,
	showCategories = true,
	showCollections = true,
	children,
}: {
	crumbs: Crumb[];
	title: string;
	description?: string | null;
	facets: APIProductFiltersResult;
	showCategories?: boolean;
	showCollections?: boolean;
	children: ReactNode;
}) {
	const filtersAvailable =
		(showCategories && facets.categories.length > 0) ||
		(showCollections && facets.collections.length > 0) ||
		facets.brands.length > 0 ||
		facets.variantTypes.length > 0 ||
		facets.priceBounds.max > 0;
	const filterProps = { facets, showCategories, showCollections };

	return (
		<div className="mx-auto max-w-7xl px-5 py-8 sm:px-6 lg:px-12 lg:py-12">
			<Breadcrumb className="mb-8">
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink asChild>
							<Link href="/">Home</Link>
						</BreadcrumbLink>
					</BreadcrumbItem>
					{crumbs.map((crumb) => (
						<Fragment key={crumb.name}>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								{crumb.href ? (
									<BreadcrumbLink asChild>
										<Link href={crumb.href}>{crumb.name}</Link>
									</BreadcrumbLink>
								) : (
									<BreadcrumbPage>{crumb.name}</BreadcrumbPage>
								)}
							</BreadcrumbItem>
						</Fragment>
					))}
				</BreadcrumbList>
			</Breadcrumb>

			<div className="mb-10 lg:mb-12">
				<h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
				{description && (
					<p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">{description}</p>
				)}
			</div>

			<Suspense fallback={<ProductGridSkeleton />}>
				<div
					className={filtersAvailable ? "lg:grid lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-10 xl:gap-14" : ""}
				>
					{filtersAvailable && <ProductFilters {...filterProps} />}

					<div className="min-w-0">
						<div className="mb-6 flex items-center justify-between gap-3 border-y border-border py-3 lg:hidden">
							{filtersAvailable ? <ProductFiltersMobile {...filterProps} /> : <span />}
							<SortSelect options={LISTING_SORT_OPTIONS} />
						</div>
						<div className="mb-6 hidden min-h-12 flex-wrap items-center justify-end gap-3 border-y border-border py-3 lg:flex">
							<span className="text-sm text-muted-foreground">Sort by:</span>
							<SortLinks options={LISTING_SORT_OPTIONS} />
						</div>
						{children}
					</div>
				</div>
			</Suspense>
		</div>
	);
}
