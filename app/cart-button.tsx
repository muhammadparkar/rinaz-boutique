"use client";

import { ShoppingBag } from "lucide-react";
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
			<ShoppingBag className="size-6" strokeWidth={1.25} />
			{itemCount > 0 ? (
				<span
					aria-live="polite"
					className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground"
				>
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
