import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { getStoreSeo } from "@/lib/commerce";

export async function generateMetadata(): Promise<Metadata> {
	"use cache";
	cacheLife("hours");
	const { storeName } = await getStoreSeo();

	return {
		title: "Privacy Policy",
		description: `Read the Privacy Policy for ${storeName}.`,
		alternates: { canonical: "/privacy-policy" },
	};
}

export default async function PrivacyPolicyPage() {
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
				<span className="text-sm">Privacy Policy</span>
				<h1 className="mt-4 text-3xl sm:text-4xl font-medium tracking-tight">Privacy Policy</h1>
				<p className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">
					Last updated: September 2026
				</p>
			</div>

			<div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
				<section>
					<h2 className="text-lg font-medium text-foreground mb-3">1. Commitment to Privacy</h2>
					<p>
						At {storeName}, we are dedicated to safeguarding your privacy and ensuring your personal
						information is treated with the highest degree of respect and integrity. This Privacy Policy
						details how we collect, use, and protect your information when you browse our boutique or purchase
						our couture collections and fine jewelry.
					</p>
				</section>

				<section>
					<h2 className="text-lg font-medium text-foreground mb-3">2. Information We Collect</h2>
					<p>
						We collect personal details essential for bespoke orders and seamless service, including your
						name, contact information, shipping address, billing details, and any custom sizing measurements
						provided for bridal or haute couture tailoring.
					</p>
				</section>

				<section>
					<h2 className="text-lg font-medium text-foreground mb-3">3. How Your Information Is Used</h2>
					<p>
						Your data is utilized strictly for processing and delivering your orders via insured worldwide
						couriers, communicating bespoke tailoring milestones, and providing tailored customer care.
					</p>
				</section>

				<section>
					<h2 className="text-lg font-medium text-foreground mb-3">4. Security & Confidentiality</h2>
					<p>
						All payment transactions are encrypted using industry-standard SSL technology. We never store raw
						credit card numbers, and we never sell, rent, or trade your personal information to third parties.
					</p>
				</section>

				<section>
					<h2 className="text-lg font-medium text-foreground mb-3">5. Contact Our Concierge</h2>
					<p>
						If you have inquiries regarding your personal data or wish to exercise your data rights, please
						contact our concierge via our{" "}
						<Link href="/contact" className="text-foreground underline underline-offset-4 hover:text-primary">
							contact page
						</Link>
						.
					</p>
				</section>
			</div>
		</div>
	);
}
