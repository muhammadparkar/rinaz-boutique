import AboutPage from "@/app/(storefront)/about/page";
import ContactPage from "@/app/(storefront)/contact/page";
import FAQPage from "@/app/(storefront)/faq/page";
import { CartProvider } from "@/app/cart/cart-context";
import { FooterLegalPages, getCopyrightYear } from "@/app/footer";
import { PreviewFrame } from "@/components/admin/preview-frame";
import { StoreConfigProvider } from "@/components/store-config-provider";
import { getAdminSeed } from "@/lib/admin/seed";
import { commerce } from "@/lib/commerce";
import { getStoreConfig } from "@/lib/store-config";
export default async function PreviewFramePage() {
	const [seed, config, catalog, year] = await Promise.all([
		getAdminSeed(),
		getStoreConfig(),
		commerce.productBrowse({ active: true, limit: 100 }),
		getCopyrightYear(),
	]);
	return (
		<StoreConfigProvider value={config}>
			<CartProvider>
				<PreviewFrame
					baseline={seed.snapshot}
					catalog={catalog.data}
					year={year}
					legalPages={<FooterLegalPages />}
					pages={{ about: <AboutPage />, contact: <ContactPage />, faq: <FAQPage /> }}
				/>
			</CartProvider>
		</StoreConfigProvider>
	);
}
