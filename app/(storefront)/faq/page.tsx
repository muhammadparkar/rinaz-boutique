import { Mail } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { type FAQCategory, faqCategories } from "@/app/(storefront)/faq/faq-data";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getPublishedSnapshot } from "@/lib/admin/workspace";
import { getStoreSeo } from "@/lib/commerce";
import { JsonLdScript } from "@/lib/json-ld";

export async function generateMetadata(): Promise<Metadata> {
	const { storeName } = await getStoreSeo();
	const page = (await getPublishedSnapshot()).content.pages.find((item) => item.id === "faq");
	const description =
		page?.seoDescription ||
		`Frequently asked questions about orders, payments, shipping, and returns at ${storeName}.`;

	return {
		title: { absolute: page?.seoTitle || "FAQ" },
		description,
		alternates: { canonical: "/faq" },
		openGraph: {
			type: "website",
			title: "Frequently Asked Questions",
			description,
			url: "/faq",
		},
	};
}

function buildFaqJsonLd(categories: FAQCategory[]): Record<string, unknown> {
	const mainEntity = categories.flatMap((category) =>
		category.questions.map((q) => ({
			"@type": "Question",
			name: q.question,
			acceptedAnswer: {
				"@type": "Answer",
				text: q.answer,
			},
		})),
	);

	return {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity,
	};
}

function CategoryNav({ categories }: { categories: FAQCategory[] }) {
	return (
		<nav className="flex flex-wrap gap-2">
			{categories.map((category) => (
				<a
					key={category.id}
					href={`#${category.id}`}
					className="rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
				>
					{category.title}
				</a>
			))}
		</nav>
	);
}

function FAQSection({ category }: { category: FAQCategory }) {
	return (
		<section id={category.id} className="scroll-mt-24">
			<h2 className="text-2xl font-medium tracking-tight mb-4">{category.title}</h2>
			<Accordion type="single" collapsible className="rounded-lg border border-border px-4">
				{category.questions.map((item, index) => (
					<AccordionItem key={`${category.id}-${index}`} value={`${category.id}-${index}`}>
						<AccordionTrigger>{item.question}</AccordionTrigger>
						<AccordionContent>
							<p className="text-muted-foreground leading-relaxed">{item.answer}</p>
						</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>
		</section>
	);
}

function ContactCard() {
	return (
		<div className="rounded-lg border border-border bg-secondary/30 p-8 text-center">
			<h2 className="text-2xl font-medium tracking-tight">Still have questions?</h2>
			<p className="mt-2 text-muted-foreground">
				We're here to help. Reach out and we'll get back to you as soon as possible.
			</p>
			<div className="mt-6 inline-flex items-center gap-2 text-sm font-medium">
				<Mail className="h-4 w-4" />
				<span>Contact us via the details on our website</span>
			</div>
		</div>
	);
}

export default async function FAQPage() {
	const { content } = await getPublishedSnapshot();
	const page = content.pages.find((item) => item.id === "faq");
	const categories: FAQCategory[] = Array.from(new Set(content.faqs.map((item) => item.category))).map(
		(title, index) => ({
			id: faqCategories.find((item) => item.title === title)?.id ?? `faq-${index}`,
			title,
			questions: content.faqs
				.filter((item) => item.category === title)
				.map(({ question, answer }) => ({ question, answer })),
		}),
	);
	return (
		<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
			<JsonLdScript data={buildFaqJsonLd(categories)} />
			{/* Header */}
			<div className="mb-10">
				<Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
					Home
				</Link>
				<span className="mx-2 text-muted-foreground">/</span>
				<span className="text-sm">FAQ</span>
				<h1 className="mt-4 text-4xl font-medium tracking-tight">
					{page?.title || "Frequently Asked Questions"}
				</h1>
				<p className="mt-3 text-lg text-muted-foreground">
					{page?.text || "Find answers to questions about orders, payments, shipping, and more."}
				</p>
			</div>

			{/* Category Navigation */}
			<div className="mb-10">
				<CategoryNav categories={categories} />
			</div>

			{/* FAQ Sections */}
			<div className="space-y-12">
				{categories.map((category) => (
					<FAQSection key={category.id} category={category} />
				))}
			</div>

			{/* Contact Card */}
			<div className="mt-16">
				<ContactCard />
			</div>
		</div>
	);
}
