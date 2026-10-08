import type { ComponentProps } from "react";
import { ProductCardView } from "@/components/product-card-view";
import { getStoreConfig } from "@/lib/store-config";
export async function ProductCard(props: Omit<ComponentProps<typeof ProductCardView>, "taxBehavior">) {
	const { taxBehavior } = await getStoreConfig();
	return <ProductCardView {...props} taxBehavior={taxBehavior} />;
}
