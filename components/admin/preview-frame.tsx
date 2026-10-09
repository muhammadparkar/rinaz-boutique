"use client";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/admin/ui/accordion";
import { Button } from "@/components/admin/ui/button";
import { ProductCardDetails } from "@/components/product-card-details";
import { ProductCardView } from "@/components/product-card-view";
import { About } from "@/components/sections/about";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGridLayout } from "@/components/sections/product-grid-layout";
import {
	CategoryTiles,
	CompleteTheLook,
	categoryTiles,
	GoldenHourFeature,
	TrustPillars,
} from "@/components/sections/studio";
import { useStoreConfig } from "@/components/store-config-provider";
import { FooterContent } from "@/components/storefront-footer";
import { StorefrontHeader } from "@/components/storefront-header";
import { isSnapshot, type Product, type Section, type Snapshot } from "@/lib/admin/model";
import type { APIProductsBrowseResult } from "@/lib/commerce-types";
import { formatMoney } from "@/lib/money";
import { PreviewSectionEditor } from "./preview-section-editor";
import { useAdmin } from "./provider";
import { AdminImage, SelectField } from "./shared";

const money = (amount: string) => formatMoney({ amount, currency: "USD", locale: "en-US" });
function PreviewProduct({ product, navigate }: { product: Product; navigate: (path: string) => void }) {
	return (
		<button type="button" className="group text-left" onClick={() => navigate(`/product/${product.slug}`)}>
			<div className="relative mb-3 aspect-3/4 overflow-hidden rounded-md bg-secondary">
				<AdminImage
					src={product.images[0] || ""}
					alt={product.name}
					className="h-full w-full object-cover"
					sizes="(max-width: 1024px) 50vw, 33vw"
				/>
			</div>
			<ProductCardDetails
				name={product.name}
				price={money(String(Math.min(...product.variants.map((v) => Number(v.price)))))}
			/>
		</button>
	);
}
export function PreviewFrame({
	baseline,
	catalog,
	year,
	legalPages,
	pages,
}: {
	baseline: Snapshot;
	catalog: APIProductsBrowseResult["data"];
	year: number;
	legalPages: ReactNode;
	pages: Record<string, ReactNode>;
}) {
	const { taxBehavior } = useStoreConfig();
	const { state, ready } = useAdmin();
	const [liveSnapshot, setLiveSnapshot] = useState<Snapshot | null>(null);
	const [focusId, setFocusId] = useState("");
	const [slideId, setSlideId] = useState("");
	const [editing, setEditing] = useState(false);
	const [editorScale, setEditorScale] = useState(1);
	const { content, categories, products } = liveSnapshot || state.published;
	const [path, setPath] = useState("/");
	useEffect(() => {
		if (window.parent === window) return;
		const receive = (event: MessageEvent) => {
			if (event.origin !== window.location.origin || event.source !== window.parent) return;
			const data: unknown = event.data;
			if (
				typeof data !== "object" ||
				!data ||
				!("type" in data) ||
				data.type !== "rinaz-draft-preview" ||
				!("snapshot" in data) ||
				!isSnapshot(data.snapshot)
			)
				return;
			setLiveSnapshot(data.snapshot);
			setEditing("editing" in data && data.editing === true);
			if (
				"editorScale" in data &&
				typeof data.editorScale === "number" &&
				data.editorScale > 0 &&
				data.editorScale <= 1
			)
				setEditorScale(data.editorScale);
			if ("path" in data && typeof data.path === "string") setPath(data.path);
			if ("focusId" in data && typeof data.focusId === "string") setFocusId(data.focusId);
			if ("slideId" in data && typeof data.slideId === "string") setSlideId(data.slideId);
		};
		window.addEventListener("message", receive);
		window.parent.postMessage({ type: "rinaz-preview-ready" }, window.location.origin);
		return () => window.removeEventListener("message", receive);
	}, []);
	useEffect(() => {
		if (!ready) return;
		if (path !== "/") {
			window.scrollTo(0, 0);
			return;
		}
		const target =
			focusId && focusId !== "preview-section-hero" && focusId !== "preview-header"
				? document.getElementById(focusId)
				: null;
		if (target) target.scrollIntoView({ block: "start", behavior: "instant" });
		else window.scrollTo(0, 0);
	}, [focusId, path, ready]);
	const navigate = (next: string) => {
		if (!next.startsWith("/") && !next.startsWith("#")) return;
		const destination = new URL(next, `${window.location.origin}${path}`);
		if (destination.origin !== window.location.origin) return;
		setPath(destination.pathname);
		if (destination.hash)
			requestAnimationFrame(() =>
				document.getElementById(destination.hash.slice(1))?.scrollIntoView({ behavior: "instant" }),
			);
		else window.scrollTo(0, 0);
	};

	const visibleProducts = products.filter((p) => p.status === "published");
	const pageId = path.slice(1) || "home";
	const page = content.pages.find((p) => p.id === pageId);
	const detail = visibleProducts.find((p) => path === `/product/${p.slug}`);
	const [variantIndex, setVariantIndex] = useState(0);

	const changed = (section: Section, key: "title" | "text" | "image") =>
		section[key] !== baseline.content.sections.find((item) => item.id === section.id)?.[key];
	const image = (src: string, alt: string) => (
		<AdminImage
			src={src}
			alt={alt}
			className="absolute inset-0 h-full w-full object-cover"
			sizes="(min-width: 1024px) 50vw, 100vw"
		/>
	);
	const catalogProduct = (product: Product) => {
		const original = catalog.find((item) => item.id === product.id) || catalog[0];
		if (!original) return null;
		return {
			...original,
			id: product.id,
			name: product.name,
			slug: product.slug,
			summary: product.summary,
			images: product.images,
			variants: product.variants.map((variant) => {
				const source = original.variants.find((item) => item.id === variant.id) || original.variants[0];
				return {
					...source,
					...variant,
					priceGross: variant.price === source?.price ? source?.priceGross : null,
				};
			}),
		};
	};
	const renderSection = (section: Section) => {
		const props = {
			title: changed(section, "title") ? section.title : undefined,
			text: changed(section, "text") ? section.text : undefined,
			image: changed(section, "image") ? image(section.image, section.title) : undefined,
			ctaLabel: section.ctaLabel,
			ctaHref: section.ctaHref,
		};
		if (section.type === "hero")
			return (
				<Hero
					slides={content.slides}
					selectedSlideId={slideId || (editing ? content.slides[0]?.id : undefined)}
					onSlideChange={editing ? setSlideId : undefined}
					renderImage={
						content.slides.some((slide) => slide.images.some((item) => item.src.startsWith("media:")))
							? (props) => <AdminImage {...props} />
							: undefined
					}
				/>
			);
		if (section.type === "categories") {
			const tiles = categories
				.filter((category) => category.active)
				.sort((a, b) => a.position - b.position)
				.map((category) => {
					const original = categoryTiles.find(
						(tile) =>
							tile.href === `/category/${baseline.categories.find((item) => item.id === category.id)?.slug}`,
					);
					const unchanged =
						category.image === baseline.categories.find((item) => item.id === category.id)?.image;
					return {
						name: category.name,
						subtitle: original?.subtitle || "",
						href: `/category/${category.slug}`,
						image: unchanged && original ? original.image : category.image,
					};
				})
				.concat(categoryTiles.filter((tile) => tile.href.startsWith("/collection/")));
			return (
				<CategoryTiles
					title={section.title}
					text={section.text}
					tiles={tiles}
					renderImage={tiles.some((tile) => tile.image.startsWith("media:")) ? image : undefined}
				/>
			);
		}
		if (section.id === "pairings")
			return (
				<CompleteTheLook
					{...props}
					pieces={section.productIds
						.map((id) => visibleProducts.find((item) => item.id === id))
						.filter((item): item is Product => Boolean(item))
						.map((item) => ({
							name: item.name,
							href: `/product/${item.slug}`,
							price: Number(item.variants[0]?.price || 0),
						}))}
				/>
			);
		if (section.type === "products")
			return (
				<ProductGridLayout title={section.title} description={section.text}>
					{section.productIds
						.map((id) => visibleProducts.find((item) => item.id === id))
						.filter((item): item is Product => Boolean(item))
						.map((item, index) => {
							const product = catalogProduct(item);
							return product ? (
								<ProductCardView
									key={item.id}
									product={product}
									taxBehavior={taxBehavior}
									priority={index === 0}
									preview
									renderImage={(src, alt, className) => (
										<AdminImage src={src} alt={alt} className={className} />
									)}
								/>
							) : null;
						})}
				</ProductGridLayout>
			);
		if (section.type === "feature") return <GoldenHourFeature {...props} />;
		if (section.type === "trust") return <TrustPillars text={props.text} />;
		if (section.type === "about") return <About title={section.title} text={props.text} />;
		return <Newsletter title={section.title} text={section.text} preview />;
	};
	const originalPage =
		page &&
		JSON.stringify(page) === JSON.stringify(baseline.content.pages.find((item) => item.id === page.id)) &&
		(pageId !== "faq" || JSON.stringify(content.faqs) === JSON.stringify(baseline.content.faqs)) &&
		(pageId !== "contact" || JSON.stringify(content.contact) === JSON.stringify(baseline.content.contact));

	return (
		<div
			className="flex min-h-screen flex-col"
			onKeyDownCapture={(event) => {
				if (!editing || !(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== "z") return;
				const target = event.target;
				if (
					target instanceof HTMLElement &&
					(target.isContentEditable || target.closest("input,textarea,select"))
				)
					return;
				event.preventDefault();
				window.parent.postMessage(
					{ type: "rinaz-editor", kind: event.shiftKey ? "redo" : "undo", id: "history" },
					window.location.origin,
				);
			}}
			onSubmitCapture={(event) => {
				event.preventDefault();
				event.stopPropagation();
			}}
			onClickCapture={(event) => {
				const target = event.target;
				if (target instanceof Element) {
					if (editing && target.closest("[data-editor-section]")) return;
					const link = target.closest("a");
					if (link) {
						event.preventDefault();
						navigate(link.getAttribute("href") || "/");
					}
				}
			}}
		>
			{content.announcement.enabled && (
				<a
					href={content.announcement.href}
					className="block bg-foreground p-2 text-center text-xs text-background"
				>
					{content.announcement.text}
				</a>
			)}
			<StorefrontHeader links={content.navigation} />
			<main className="flex-1">
				{!ready ? (
					<p className="p-8" role="status">
						Loading published demo…
					</p>
				) : path === "/" ? (
					<>
						{page?.text && <p className="p-6 text-center">{page.text}</p>}
						{content.sections
							.filter((s) => s.type !== "sanctuary" && (s.enabled || editing))
							.map((s, index, sections) => (
								<PreviewSectionEditor
									key={s.id}
									section={s}
									products={products}
									previousId={sections[index - 1]?.id}
									nextId={sections[index + 1]?.id}
									slide={
										s.type === "hero"
											? content.slides.find((slide) => slide.id === slideId) || content.slides[0]
											: undefined
									}
									enabled={editing}
									scale={editorScale}
									selected={focusId === `preview-section-${s.id}`}
								>
									{renderSection(s)}
								</PreviewSectionEditor>
							))}
					</>
				) : detail ? (
					<div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-2">
						<AdminImage
							src={detail.images[0] || ""}
							alt={detail.name}
							className="aspect-3/4 w-full rounded-md object-cover"
						/>
						<div>
							<h1 className="text-3xl">{detail.name}</h1>
							<p className="mt-5 leading-relaxed text-muted-foreground">{detail.summary}</p>
							<div className="mt-8">
								<SelectField
									label="Variant"
									value={String(Math.min(variantIndex, detail.variants.length - 1))}
									onChange={(value) => setVariantIndex(Number(value))}
									options={detail.variants.map((variant, index) => ({
										value: String(index),
										label: variant.label,
									}))}
								/>
							</div>
							<p className="mt-6 text-xl">
								{money((detail.variants[variantIndex] || detail.variants[0])?.price || "0")}
							</p>
							<p className="mt-3 text-sm">
								{(detail.variants[variantIndex] || detail.variants[0])?.stock || 0} in stock
							</p>
							<Button className="mt-6" disabled>
								Checkout unavailable in demo
							</Button>
						</div>
					</div>
				) : originalPage && pages[pageId] ? (
					pages[pageId]
				) : page ? (
					<div className="mx-auto max-w-3xl space-y-6 px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
						<h1 className="text-4xl">{page.title}</h1>
						<p className="whitespace-pre-line leading-relaxed text-muted-foreground">{page.text}</p>
						{pageId === "contact" && (
							<address className="space-y-2 not-italic">
								<p>{content.contact.email}</p>
								<p>{content.contact.phone}</p>
								<p>{content.contact.address}</p>
							</address>
						)}
						{pageId === "faq" && (
							<Accordion type="multiple">
								{content.faqs.map((f) => (
									<AccordionItem key={f.id} value={f.id}>
										<AccordionTrigger>{f.question}</AccordionTrigger>
										<AccordionContent>
											<p className="mb-2 text-xs text-muted-foreground">{f.category}</p>
											{f.answer}
										</AccordionContent>
									</AccordionItem>
								))}
							</Accordion>
						)}
					</div>
				) : (
					<section className="mx-auto max-w-7xl px-4 py-12">
						<h1 className="mb-8 text-3xl">
							{categories.find((c) => path === `/category/${c.slug}`)?.name || "The collection"}
						</h1>
						<div className="grid grid-cols-2 gap-6 lg:grid-cols-3">
							{visibleProducts
								.filter(
									(p) =>
										!path.startsWith("/category/") ||
										categories.some(
											(c) => path === `/category/${c.slug}` && p.categoryId === c.id && c.active,
										),
								)
								.map((p) => (
									<PreviewProduct key={p.id} product={p} navigate={navigate} />
								))}
						</div>
					</section>
				)}
			</main>
			<FooterContent
				year={year}
				legalPages={legalPages}
				text={content.footer.text}
				links={
					JSON.stringify(content.footer.links) === JSON.stringify(baseline.content.footer.links)
						? undefined
						: content.footer.links
				}
			/>
		</div>
	);
}
