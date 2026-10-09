import type { Snapshot } from "@/lib/admin/model";
import { useStore } from "./lib/store";
import type { Product as WorkflowProduct } from "./lib/types";

const defaults = useStore.getState().products;
const categoryDefaults = useStore.getState().categories;
export function workflowCatalog(snapshot: Snapshot) {
	return snapshot.products.map((product, index): WorkflowProduct => {
		const base = defaults[index % defaults.length];
		if (!base) throw new Error("Workflow product defaults are missing.");
		const first = product.variants[0];
		const categoryName =
			snapshot.categories.find((category) => category.id === product.categoryId)?.name ?? product.name;
		const line = /jewel|gold|diamond|pearl/i.test(categoryName)
			? "jewelry"
			: /couture|bridal|pakistani|anarkali|peshwas/i.test(categoryName)
				? "couture"
				: "abaya";
		return {
			...base,
			line,
			cost: 0,
			madeToOrder: false,
			leadTimeDays: 0,
			id: product.id,
			name: product.name,
			slug: product.slug,
			sku: first?.sku ?? "",
			categoryId: product.categoryId,
			description: product.summary,
			status: product.status === "published" ? "active" : product.status,
			price: Number(first?.originalPrice || first?.price || "0") / 100,
			salePrice: first?.originalPrice ? Number(first.price) / 100 : null,
			image: product.images[0] ?? "",
			gallery: product.images,
			options: [],
			collections: [],
			variants: product.variants.map((v) => ({
				id: v.id,
				options: [v.label],
				sku: v.sku,
				price: Number(v.price) / 100,
				stock: v.stock,
			})),
			sold30d: 0,
			revenue30d: 0,
			rating: 0,
			reviewCount: 0,
		};
	});
}
export function syncWorkflowCatalog(snapshot: Snapshot, threshold = 5) {
	const products = workflowCatalog(snapshot).map((product) => ({ ...product, lowStockAt: threshold }));
	const state = useStore.getState();
	const aliases = new Map(
		defaults.map((old, index) => {
			const candidates = products.filter((product) => product.line === old.line);
			return [old.id, candidates[index % candidates.length]] as const;
		}),
	);
	const orders = state.orders.map((order) => ({
		...order,
		items: order.items.map((item) => {
			const product = aliases.get(item.productId);
			const variant = product?.variants[0];
			return product
				? {
						...item,
						productId: product.id,
						name: product.name,
						image: product.image,
						sku: variant?.sku ?? item.sku,
						variantId: variant?.id ?? null,
						variant: variant?.options.join(" / ") ?? item.variant,
					}
				: item;
		}),
	}));
	const categories = categoryDefaults.map(
		(old) =>
			[
				old.id,
				snapshot.categories.find((category) => category.name === old.name)?.id ??
					snapshot.categories[0]?.id ??
					old.id,
			] as const,
	);
	const categoryAliases = new Map(categories);
	const targets = (rule: { appliesTo: string; targetIds: string[] }) =>
		rule.targetIds.map((id) =>
			rule.appliesTo === "products"
				? (aliases.get(id)?.id ?? id)
				: rule.appliesTo === "categories"
					? (categoryAliases.get(id) ?? id)
					: id,
		);
	useStore.setState({
		products: products.map((product) => {
			const sold = orders
				.filter(
					(order) =>
						order.createdAt > Date.now() - 30 * 86400000 &&
						order.status !== "cancelled" &&
						order.paymentStatus !== "failed",
				)
				.flatMap((order) => order.items)
				.filter((item) => item.productId === product.id);
			return {
				...product,
				sold30d: sold.reduce((sum, item) => sum + item.qty, 0),
				revenue30d: sold.reduce((sum, item) => sum + item.qty * item.price, 0),
			};
		}),
		orders,
		reviews: state.reviews.map((review) => ({
			...review,
			productId: aliases.get(review.productId)?.id ?? review.productId,
		})),
		coupons: state.coupons.map((coupon) => ({ ...coupon, targetIds: targets(coupon) })),
		discounts: state.discounts.map((discount) => ({ ...discount, targetIds: targets(discount) })),
		categories: snapshot.categories.map((category) => ({
			id: category.id,
			name: category.name,
			slug: category.slug,
			parentId: category.parentId,
			visible: category.active,
			order: category.position,
			image: category.image,
			description: "",
		})),
	});
}
