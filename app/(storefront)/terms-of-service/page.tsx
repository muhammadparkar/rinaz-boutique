import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { getStoreSeo } from "@/lib/commerce";

export async function generateMetadata(): Promise<Metadata> {
	"use cache";
	cacheLife("hours");
	const { storeName } = await getStoreSeo();

	return {
		title: "Terms of Service",
		description: `Read the Terms of Service for ${storeName}.`,
		alternates: { canonical: "/terms-of-service" },
	};
}

export default async function TermsOfServicePage() {
	"use cache";
	cacheLife("hours");
	const { storeName } = await getStoreSeo();

	return (
		<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
			<div className="mb-8">
				<Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
					Home
				</Link>
				<span className="mx-2 text-muted-foreground">/</span>
				<span className="text-sm">Terms of Service</span>
				<h1 className="mt-4 text-3xl sm:text-4xl font-medium tracking-tight">Terms of Service</h1>
				<p className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">
					Last updated: September 2026
				</p>
			</div>

			<div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
				<section>
					<h2 className="text-lg font-medium text-foreground mb-3">1. Agreement to Terms</h2>
					<p>
						By accessing or placing an order through {storeName}, you agree to be bound by these Terms of
						Service and all applicable laws and regulations governing high-value luxury goods.
					</p>
				</section>

				<section>
					<h2 className="text-lg font-medium text-foreground mb-3">
						2. 18K Solid Gold & Fine Jewelry Authenticity
					</h2>
					<p>
						Every piece within our Fine Jewelry collection is forged from hallmarked 18K solid gold and
						hand-set with VVS1 clarity diamonds or cultured South Sea pearls. Each piece is dispatched with a
						signed Certificate of Valuation.
					</p>
				</section>

				<section>
					<h2 className="text-lg font-medium text-foreground mb-3">3. Bespoke Couture & Custom Tailoring</h2>
					<p>
						Made-to-measure couture Abayas and bridal ensembles require meticulous handcrafted artisan
						needlework. Once individual pattern drafting and fabric cutting commences, custom-tailored
						commissions cannot be cancelled.
					</p>
				</section>

				<section>
					<h2 className="text-lg font-medium text-foreground mb-3">4. Worldwide Shipping & Delivery</h2>
					<p>
						All orders are dispatched via insured express courier (DHL Express) with signature verification
						required upon delivery. Risk of loss passes to the purchaser upon certified courier receipt.
					</p>
				</section>

				<section>
					<h2 className="text-lg font-medium text-foreground mb-3">5. Returns & Exchanges</h2>
					<p>
						Ready-to-wear items in pristine, unworn condition with all security tags and original presentation
						packaging intact may be returned within 14 days of receipt. Custom-sized bridal wear is final
						sale.
					</p>
				</section>
			</div>
		</div>
	);
}
