import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Checkout", robots: { index: false, follow: false } };

export default function CheckoutPage() {
	return (
		<section className="mx-auto max-w-xl px-4 py-20 text-center">
			<h1 className="font-display text-3xl">Checkout is not available yet</h1>
			<p className="mt-4 text-sm leading-relaxed text-muted-foreground">
				Payment and order services are being connected. No order has been placed and no payment has been
				taken.
			</p>
			<Button asChild className="mt-8">
				<Link href="/products">Continue shopping</Link>
			</Button>
		</section>
	);
}
