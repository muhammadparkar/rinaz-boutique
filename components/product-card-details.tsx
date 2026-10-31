import type { ReactNode } from "react";
export function ProductCardDetails({ name, price }: { name: string; price: ReactNode }) {
	return (
		<div className="product-card-details space-y-1 text-left text-sm leading-relaxed">
			<h3 className="line-clamp-2 font-semibold text-foreground">{name}</h3>
			<p className="font-normal text-foreground">{price}</p>
		</div>
	);
}
