import "@/app/globals.css";

import { Suspense } from "react";
import { CartBootstrap, CartProvider } from "@/app/cart/cart-context";
import { CartSidebar } from "@/app/cart/cart-sidebar";
import { Footer } from "@/app/footer";
import { NewsletterDialog } from "@/components/newsletter-dialog";
import { StoreChatSection } from "@/components/store-chat/store-chat-section";
import { StoreConfigProvider } from "@/components/store-config-provider";
import { StorefrontHeader } from "@/components/storefront-header";
import { getPublishedSnapshot } from "@/lib/admin/workspace";
import { meGetCached } from "@/lib/commerce";
import { getCartCookieJson } from "@/lib/cookies";
import { getStoredCart } from "@/lib/db/cart";
import { StoreJsonLd } from "@/lib/json-ld";
import { getStoreConfig } from "@/lib/store-config";

async function getInitialCart() {
	const cartCookie = await getCartCookieJson();

	if (!cartCookie?.id) {
		return { cart: null, cartId: null };
	}

	try {
		const cart = await getStoredCart(cartCookie.id);
		return { cart: cart ?? null, cartId: cartCookie.id };
	} catch {
		return { cart: null, cartId: cartCookie.id };
	}
}

// The customer's cart is a cookie read, so it can never be part of the prerendered
// shell. Kept in its own component (and its own Suspense boundary below) so the await
// lands BELOW the chrome instead of above it.
async function CartBootstrapper() {
	const { cart, cartId } = await getInitialCart();

	return <CartBootstrap cart={cart} cartId={cartId} />;
}

async function CartProviderWrapper({ children }: { children: React.ReactNode }) {
	// Only cached reads here. Awaiting anything request-time (cookies, headers, the
	// cart) would take the header, nav and footer out of the prerendered shell and
	// leave the page blank until the server responds. The other half of the rule: no
	// <Suspense> around this component either — the boundary itself is what streams the
	// chrome out of the shell, whether or not anything inside it is request-time.
	const [storeConfig, { content }] = await Promise.all([getStoreConfig(), getPublishedSnapshot()]);

	return (
		<StoreConfigProvider value={storeConfig}>
			<CartProvider>
				<div className="flex min-h-screen flex-col">
					{content.announcement.enabled && (
						<a
							href={content.announcement.href}
							className="block bg-primary px-4 py-2 text-center text-sm text-primary-foreground"
						>
							{content.announcement.text}
						</a>
					)}
					<StorefrontHeader links={content.navigation} />
					<main className="flex-1">{children}</main>
					<Footer />
				</div>
				<CartSidebar />
				<Suspense>
					<CartBootstrapper />
				</Suspense>
				{/* Inside CartProvider on purpose: add-to-cart from chat uses the cart context. */}
				<Suspense>
					<StoreChatSection />
				</Suspense>
			</CartProvider>
		</StoreConfigProvider>
	);
}

async function NewsletterPopupSection() {
	const me = await meGetCached();
	if (!me.store.settings?.enabledTools?.newsletterPopup) {
		return null;
	}
	return <NewsletterDialog settings={me.store.settings?.newsletterPopup} />;
}

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<Suspense>
				<StoreJsonLd />
			</Suspense>
			<CartProviderWrapper>{children}</CartProviderWrapper>
			<Suspense>
				<NewsletterPopupSection />
			</Suspense>
		</>
	);
}
