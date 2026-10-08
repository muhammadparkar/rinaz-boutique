import type { ReactNode } from "react";
export function ProductCardDetails({ name, price }: { name: string; price: ReactNode }) {
	return (
		<div className="space-y-1">
			<h3 className="line-clamp-2 text-sm font-medium text-foreground sm:text-base">{name}</h3>
			<p className="text-sm font-semibold text-foreground sm:text-base">{price}</p>
		</div>
	);
}
