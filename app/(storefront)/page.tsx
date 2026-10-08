import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { About } from "@/components/sections/about";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";
import {
	BridalSanctuary,
	CategoryTiles,
	CompleteTheLook,
	GoldenHourFeature,
	TrustPillars,
} from "@/components/sections/studio";

function FeaturedProductsSkeleton() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
			<div className="flex items-end justify-between mb-12">
				<div>
					<div className="h-8 w-48 bg-secondary rounded animate-pulse" />
					<div className="mt-2 h-5 w-64 bg-secondary rounded animate-pulse" />
				</div>
			</div>
			<ProductGridSkeleton className="lg:grid-cols-3" />
		</section>
	);
}

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<>
			<Hero />
			<CategoryTiles />
			<Suspense fallback={<FeaturedProductsSkeleton />}>
				<ProductGrid
					title="Best Sellers"
					description="Our most coveted luxury silhouettes, certified 18K solid gold pendants, and heirloom Pakistani bridal couture."
					limit={6}
				/>
			</Suspense>
			<GoldenHourFeature />
			<TrustPillars />
			<CompleteTheLook />
			<About />
			<BridalSanctuary />
			<Newsletter />
		</>
	);
}
