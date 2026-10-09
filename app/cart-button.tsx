"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="grid min-h-11 min-w-11 place-items-center p-2 hover:bg-secondary rounded-full transition-colors relative"
			aria-label="Shopping cart"
		>
			<ShoppingCart className="w-6 h-6" />
			{itemCount > 0 ? (
				<span
					aria-live="polite"
					className="absolute -top-1 -right-1 bg-foreground text-background text-xs rounded-full w-5 h-5 flex items-center justify-center"
				>
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
