import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import Image from "next/image";
import { Suspense } from "react";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { About } from "@/components/sections/about";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";
import {
	BridalSanctuary,
	CompleteTheLook,
	GoldenHourFeature,
	TrustPillars,
} from "@/components/sections/studio";
import { getPublishedSnapshot } from "@/lib/admin/workspace";
import { commerce } from "@/lib/commerce";
import { storefrontHome } from "@/lib/storefront-home";

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

export async function generateMetadata(): Promise<Metadata> {
	const { content } = await getPublishedSnapshot();
	const page = content.pages.find((item) => item.id === "home");
	return {
		title: { absolute: page?.seoTitle || content.storeName },
		description: page?.seoDescription,
		alternates: { canonical: "/" },
	};
}

export default async function Home() {
	"use cache";
	cacheLife("minutes");
	cacheTag("storefront-cms");
	const [snapshot, catalog] = await Promise.all([
		getPublishedSnapshot(),
		commerce.productBrowse({ active: true, limit: 100 }),
	]);
	const { content } = snapshot;
	const sections = content.sections.filter(
		(section) => section.enabled && !["about", "newsletter", "trust"].includes(section.type),
	);
	const suits = catalog.data.filter((product) => product.category?.slug === "pakistani-couture");
	const renderSection = (section: (typeof sections)[number]) => {
		const selected = section.productIds.flatMap((id) => catalog.data.filter((product) => product.id === id));
		const props = {
			title: section.title,
			text: section.text,
			ctaLabel: section.ctaLabel || undefined,
			ctaHref: section.ctaHref || undefined,
			image: section.image ? (
				<Image
					src={section.image}
					alt={section.title}
					fill
					sizes="(min-width: 1024px) 50vw, 100vw"
					className="object-cover"
				/>
			) : undefined,
		};
		switch (section.type) {
			case "hero":
				return <Hero key={section.id} slides={content.slides} navigation={content.navigation} />;
			case "feature":
				return (
					<GoldenHourFeature
						key={section.id}
						{...props}
						secondaryImage={
							suits[0]?.images[0] ? (
								<Image
									src={suits[0].images[0]}
									alt={suits[0].name}
									fill
									sizes="(min-width: 1024px) 25vw, 50vw"
									className="object-cover"
								/>
							) : undefined
						}
					/>
				);
			case "products":
				return section.id === "pairings" ? (
					<CompleteTheLook
						key={section.id}
						{...props}
						pieces={selected.map((product) => ({
							name: product.name,
							href: `/product/${product.slug}`,
							price: Number(product.variants[0]?.price ?? 0),
							image: product.images[0],
						}))}
					/>
				) : (
					<ProductGrid
						key={section.id}
						title={section.title}
						description={section.text}
						products={selected}
					/>
				);
			case "trust":
				return <TrustPillars key={section.id} text={section.text} />;
			case "about":
				return <About key={section.id} title={section.title} text={section.text} />;
			case "sanctuary":
				return <BridalSanctuary key={section.id} {...props} />;
			case "newsletter":
				return <Newsletter key={section.id} title={section.title} text={section.text} />;
			case "categories":
				return null;
		}
	};
	return storefrontHome(snapshot, catalog.data).map((item) => {
		if (item.kind === "section") return renderSection(item.section);
		const rail = (
			<Suspense fallback={<FeaturedProductsSkeleton />}>
				<ProductGrid
					title={item.title}
					description=""
					viewAllHref={item.href}
					products={item.productIds.flatMap((id) => catalog.data.filter((product) => product.id === id))}
				/>
			</Suspense>
		);
		return (
			<div key={item.id} className={item.spaced ? "pt-8 sm:pt-12" : undefined}>
				{rail}
			</div>
		);
	});
}
