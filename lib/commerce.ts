import { cacheLife } from "next/cache";
import { try_ } from "safe-try";
import { mockCommerce } from "@/lib/mock-store";

// No backend: every call is served by the local catalog in lib/mock-store.ts.
export const commerce = mockCommerce;

// Plain "use cache" (not "remote") so store settings can be part of the static
// shell — remote-cached entries defer to request time and block prerendering
// for everything that depends on them (metadata, <html lang>, nav links).
export const meGetCached = async (_token?: string) => {
	"use cache";

	return commerce.meGet();
};

// Store name + description for page-level metadata. Same cache posture as the
// root layout's getStoreMetadata so it stays in the static shell.
export async function getStoreSeo() {
	"use cache";
	cacheLife("hours");

	const [error, me] = await try_(meGetCached());
	if (error) {
		return { storeName: "RINAZ STUDIO", storeDescription: null };
	}
	return {
		storeName: me.store.name || "RINAZ STUDIO",
		storeDescription: me.store.settings?.storeDescription || null,
	};
}

export function getStoreFaviconUrl(
	settings: Awaited<ReturnType<typeof commerce.meGet>>["store"]["settings"],
) {
	const faviconUrl =
		settings?.favicon?.imageUrl ??
		(typeof settings?.logo === "string" ? settings.logo : settings?.logo?.imageUrl) ??
		"/brand/rinaz-R-v3.png";

	return faviconUrl;
}

export function getCanonicalUrl(): string {
	if (process.env.NEXT_PUBLIC_URL) {
		return process.env.NEXT_PUBLIC_URL.replace(/\/$/, "");
	}
	if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
		return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
	}
	if (process.env.VERCEL_URL) {
		return `https://${process.env.VERCEL_URL}`;
	}
	return "http://localhost:3000";
}
