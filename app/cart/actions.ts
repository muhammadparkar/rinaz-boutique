"use server";

import { try_ } from "safe-try";
import { getCartCookieJson, setCartCookie } from "@/lib/cookies";
import { getStoredCart, upsertStoredCart } from "@/lib/db/cart";

export async function getCart() {
	const cartCookie = await getCartCookieJson();

	if (!cartCookie?.id) {
		return null;
	}

	const [error, cart] = await try_(getStoredCart(cartCookie.id));
	if (error) {
		console.error("cart: cartGet failed", { cartId: cartCookie.id, error });
		return null;
	}
	return cart;
}

export async function addToCart(variantId: string, quantity = 1) {
	const cartCookie = await getCartCookieJson();

	// The yns_cart cookie can point at a cartId that no longer exists server-side
	// (expired, store re-seeded, old session). cartUpsert then throws "Cart not found";
	// retry once with a FRESH cart so the add always lands. No revalidatePath — the
	// client syncs from this action's returned cart (the layout cartGet hits a
	// read-replica and can return the pre-write cart, dropping the just-added line).
	let [error, cart] = await try_(upsertStoredCart({ token: cartCookie?.id, variantId, quantity }));
	if (error) {
		if (!(error instanceof Error) || error.message !== "Cart not found") {
			console.error("cart: addToCart failed", { variantId, quantity, error });
			return { success: false, cart: null };
		}
		[error, cart] = await try_(upsertStoredCart({ variantId, quantity }));
		if (error) {
			console.error("cart: addToCart failed after fresh-cart retry", { variantId, quantity, error });
			return { success: false, cart: null };
		}
	}

	if (!cart) {
		return { success: false, cart: null };
	}

	if (cart.id !== cartCookie?.id) {
		await setCartCookie({ id: cart.id });
	}

	return { success: true, cart };
}

export async function addBundleToCart(
	_bundleId: string,
	_selections: Array<{ variantId: string; groupId: string; quantity: number }>,
) {
	return { success: false as const, error: "Bundles are not available yet" };
}

export async function removeFromCart(variantId: string) {
	const cartCookie = await getCartCookieJson();

	if (!cartCookie?.id) {
		return { success: false, cart: null };
	}

	// Quantity 0 removes the item; the response is the updated cart
	const [error, cart] = await try_(
		upsertStoredCart({
			token: cartCookie.id,
			variantId,
			quantity: 0,
		}),
	);
	if (error) {
		console.error("cart: removeFromCart failed", { cartId: cartCookie.id, variantId, error });
		return { success: false, cart: null };
	}
	return { success: true, cart };
}

// Set absolute quantity for a cart item
export async function setCartQuantity(variantId: string, quantity: number) {
	const cartCookie = await getCartCookieJson();

	if (!cartCookie?.id) {
		return { success: false, cart: null };
	}

	// mode "set" replaces the line quantity atomically; 0 removes the item
	const [error, cart] = await try_(
		upsertStoredCart({
			token: cartCookie.id,
			variantId,
			quantity: Math.max(quantity, 0),
			mode: "set",
		}),
	);
	if (error) {
		console.error("cart: setCartQuantity failed", { cartId: cartCookie.id, variantId, quantity, error });
		return { success: false, cart: null };
	}
	return { success: true, cart };
}

const REMOVE_CODE_FAILED = "Couldn't remove the code. Try again.";

export async function applyDiscountCode(_rawCode: string, _itemCount: number) {
	return { success: false as const, error: "Discount codes are not available yet" };
}

export async function removeDiscountCode() {
	return { success: false as const, error: REMOVE_CODE_FAILED };
}
