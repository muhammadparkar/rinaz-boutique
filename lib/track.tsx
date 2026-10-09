"use client";

// Browser-local commerce events. No external analytics runtime is loaded.

import { useEffect } from "react";
import { CURRENCY } from "@/lib/constants";
import { minorUnitsToMajor } from "@/lib/money";

export type TrackedVariant = {
	id: string;
	sku?: string | null;
	/** Minor units, as the API returns it — converted internally. */
	price: string;
};

type TrackedItem = {
	id: string;
	name: string;
	price: number;
	quantity?: number;
	currency: string;
};

type QueueItem =
	| ({ event: "ViewContent" | "AddToCart" } & TrackedItem)
	| { event: "ConsentChanged" }
	| { event: "Identify"; email: string };

declare global {
	interface Window {
		rinazTrackQueue?: QueueItem[];
	}
}

const publish = (item: QueueItem) => {
	window.rinazTrackQueue = window.rinazTrackQueue || [];
	window.rinazTrackQueue.push(item);
	window.dispatchEvent(new Event("rinaz:track"));
};

/** Same item id convention as the product feeds: variant sku when set, variant id otherwise. */
const trackItemId = (variant: TrackedVariant) => variant.sku || variant.id;

const toItem = (variant: TrackedVariant, name: string, quantity?: number): TrackedItem => ({
	id: trackItemId(variant),
	name,
	price: minorUnitsToMajor({ amount: variant.price, currency: CURRENCY }),
	quantity,
	currency: CURRENCY,
});

/** Publish an add-to-cart. Queued, so it is safe to call before local listeners has loaded. */
export const trackAddToCart = (variant: TrackedVariant, name: string, quantity: number) =>
	publish({ event: "AddToCart", ...toItem(variant, name, quantity) });

/** Tell local listeners the consent cookie changed so it can re-read it (no reload needed). */
export const notifyConsentChanged = () => publish({ event: "ConsentChanged" });

/** The visitor gave their email (newsletter sign-up), so trackers can match them to a contact. */
export const trackIdentify = (email: string) => publish({ event: "Identify", email });

/** Fire-once product view — mount on the product page. */
export function TrackProductView({ variant, name }: { variant: TrackedVariant; name: string }) {
	const itemId = trackItemId(variant);
	// biome-ignore lint/correctness/useExhaustiveDependencies: fire once per product, not per render
	useEffect(() => {
		publish({ event: "ViewContent", ...toItem(variant, name) });
	}, [itemId]);
	return null;
}
