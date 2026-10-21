import { createHash, randomBytes } from "node:crypto";
import { and, eq, sql } from "drizzle-orm";
import type { Cart } from "@/app/cart/cart-math";
import { getDb } from "@/lib/db";
import { databaseCatalog } from "@/lib/db/catalog";
import { cartItems, carts, prices, products, variants } from "@/lib/db/schema";

const tokenPattern = /^[a-f0-9]{64}$/;
const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

async function findCart(token: string) {
	if (!tokenPattern.test(token)) return null;
	const [cart] = await getDb()
		.select({ id: carts.id })
		.from(carts)
		.where(eq(carts.accessTokenHash, hashToken(token)))
		.limit(1);
	return cart ?? null;
}

export async function getStoredCart(token: string): Promise<Cart | null> {
	const cart = await findCart(token);
	if (!cart) return null;
	const lines = await getDb()
		.select({
			quantity: cartItems.quantity,
			sourceVariantId: variants.sourceId,
			sourceProductId: products.sourceId,
			amountMinor: prices.amountMinor,
		})
		.from(cartItems)
		.innerJoin(variants, eq(cartItems.variantId, variants.id))
		.innerJoin(products, eq(variants.productId, products.id))
		.innerJoin(prices, and(eq(prices.variantId, variants.id), eq(prices.currency, "USD")))
		.where(and(eq(cartItems.cartId, cart.id), eq(products.status, "active"), eq(variants.active, true)));
	const lineItems = await Promise.all(
		lines.map(async (line) => {
			if (!line.sourceProductId || !line.sourceVariantId) throw new Error("Cart catalog item is unavailable");
			const product = await databaseCatalog.productGet({ idOrSlug: line.sourceProductId });
			const variant = product?.variants.find((item) => item.id === line.sourceVariantId);
			if (!product || !variant) throw new Error("Cart catalog item is unavailable");
			return {
				quantity: line.quantity,
				productVariant: {
					...variant,
					price: String(line.amountMinor),
					priceGross: String(line.amountMinor),
					product,
				},
			};
		}),
	);
	const subtotal = lines.reduce((sum, line) => sum + line.amountMinor * line.quantity, 0);
	return { id: token, lineItems, subtotal, subtotalNet: subtotal, subtotalGross: subtotal, coupon: null };
}

export async function upsertStoredCart(input: {
	token?: string;
	variantId: string;
	quantity: number;
	mode?: "set";
}): Promise<Cart> {
	const { variantId, quantity, mode } = input;
	if (!Number.isInteger(quantity) || quantity < 0 || quantity > 99) throw new Error("Invalid cart quantity");
	const db = getDb();
	const [variant] = await db
		.select({ id: variants.id, stock: variants.stock })
		.from(variants)
		.innerJoin(products, eq(variants.productId, products.id))
		.where(
			and(
				eq(variants.sourceId, variantId),
				...(quantity === 0 ? [] : [eq(variants.active, true), eq(products.status, "active")]),
			),
		)
		.limit(1);
	if (!variant) throw new Error("Variant not found");
	let token = input.token;
	let cart = token ? await findCart(token) : null;
	if (token && !cart) throw new Error("Cart not found");
	if (!cart) {
		token = randomBytes(32).toString("hex");
		const [created] = await db
			.insert(carts)
			.values({ accessTokenHash: hashToken(token), currency: "USD" })
			.returning({ id: carts.id });
		cart = created ?? null;
	}
	if (!cart || !token) throw new Error("Could not create cart");
	if (quantity === 0) {
		await db.delete(cartItems).where(and(eq(cartItems.cartId, cart.id), eq(cartItems.variantId, variant.id)));
	} else {
		if (quantity > variant.stock) throw new Error("Not enough stock");
		const nextQuantity = mode === "set" ? sql`${quantity}` : sql`${cartItems.quantity} + ${quantity}`;
		const [written] = await db
			.insert(cartItems)
			.values({ cartId: cart.id, variantId: variant.id, quantity })
			.onConflictDoUpdate({
				target: [cartItems.cartId, cartItems.variantId],
				set: { quantity: nextQuantity },
				setWhere: sql`${nextQuantity} <= (select stock from variant where id = ${variant.id})`,
			})
			.returning({ id: cartItems.id });
		if (!written) throw new Error("Not enough stock");
	}
	const result = await getStoredCart(token);
	if (!result) throw new Error("Cart not found after update");
	return result;
}
