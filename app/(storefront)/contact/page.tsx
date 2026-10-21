import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactForm } from "@/app/(storefront)/contact/contact-form";
import { getPublishedSnapshot } from "@/lib/admin/workspace";
import { getStoreSeo } from "@/lib/commerce";
import { JsonLdScript } from "@/lib/json-ld";
import { isStoreToolEnabled } from "@/lib/store-tools";

export async function generateMetadata(): Promise<Metadata> {
	const { storeName } = await getStoreSeo();
	const page = (await getPublishedSnapshot()).content.pages.find((item) => item.id === "contact");
	const description = page?.seoDescription || `Get in touch with the ${storeName} team.`;

	return {
		title: { absolute: page?.seoTitle || "Contact Us" },
		description,
		alternates: { canonical: "/contact" },
		openGraph: {
			type: "website",
			title: "Contact Us",
			description,
			url: "/contact",
		},
	};
}

const contactJsonLd = {
	"@context": "https://schema.org",
	"@type": "ContactPage",
	name: "Contact Us",
	description: "Get in touch with our team. Questions about orders, products, or anything else.",
};

export default async function ContactPage() {
	"use cache";
	cacheLife("minutes");
	const { content } = await getPublishedSnapshot();
	const page = content.pages.find((item) => item.id === "contact");

	if (!(await isStoreToolEnabled("contactForm"))) {
		notFound();
	}

	return (
		<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
			<JsonLdScript data={contactJsonLd} />

			{/* Header */}
			<div className="mb-10">
				<Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
					Home
				</Link>
				<span className="mx-2 text-muted-foreground">/</span>
				<span className="text-sm">Contact Us</span>
				<h1 className="mt-4 text-4xl font-medium tracking-tight">{page?.title || "Contact Us"}</h1>
				<p className="mt-3 text-lg text-muted-foreground">{page?.text}</p>
			</div>
			<address className="mb-8 space-y-2 text-sm not-italic">
				<p>
					<a href={`mailto:${content.contact.email}`}>{content.contact.email}</a>
				</p>
				<p>{content.contact.phone}</p>
				<p>{content.contact.address}</p>
			</address>

			{/* Form */}
			<ContactForm />

			{/* FAQ link */}
			<p className="mt-10 text-sm text-muted-foreground">
				Looking for a quick answer? Check our{" "}
				<Link href="/faq" className="font-medium text-foreground hover:underline">
					frequently asked questions
				</Link>
				.
			</p>
		</div>
	);
}
