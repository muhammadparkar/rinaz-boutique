import StorefrontLayout from "@/app/(storefront)/layout";
import StorefrontNotFound from "@/app/(storefront)/not-found";

export { metadata } from "@/app/(storefront)/not-found";
export default function NotFound() {
	return (
		<StorefrontLayout>
			<StorefrontNotFound />
		</StorefrontLayout>
	);
}
