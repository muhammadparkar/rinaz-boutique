import { afterEach, expect, test } from "bun:test";
import type { Snapshot } from "@/lib/admin/model";
import { syncWorkflowCatalog, workflowCatalog } from "./catalog-bridge";
import { useStore } from "./lib/store";
import {
	connectOperationsStorage,
	OPERATIONS_KEY,
	operationsData,
	parseOperations,
	resetOperations,
} from "./persistence";

const initial = operationsData(useStore.getState());
afterEach(() => {
	useStore.setState(structuredClone(initial));
});
function memoryStorage() {
	const values = new Map<string, string>();
	return {
		getItem: (key: string) => values.get(key) ?? null,
		setItem: (key: string, value: string) => {
			values.set(key, value);
		},
		removeItem: (key: string) => {
			values.delete(key);
		},
		clear: () => values.clear(),
		key: (index: number) => Array.from(values.keys())[index] ?? null,
		get length() {
			return values.size;
		},
	};
}
test("workflow updates persist and restore, without overriding actions", () => {
	const storage = memoryStorage();
	const errors: string[] = [];
	const disconnect = connectOperationsStorage(storage, (message) => errors.push(message));
	const order = useStore.getState().orders[0];
	if (!order) throw new Error("Missing sample order");
	useStore.getState().addOrderNote(order.id, "Pack carefully");
	const raw = storage.getItem(OPERATIONS_KEY);
	expect(raw).not.toBeNull();
	disconnect();
	useStore.setState(structuredClone(initial));
	const stop = connectOperationsStorage(storage, (message) => errors.push(message));
	expect(useStore.getState().orders.find((o) => o.id === order.id)?.note).toBe("Pack carefully");
	expect(errors).toEqual([]);
	expect(typeof useStore.getState().refund).toBe("function");
	stop();
});
test("invalid version, missing fields and nonfinite prices are rejected", () => {
	expect(() => parseOperations({ version: 2, data: initial })).toThrow();
	expect(() => parseOperations({ version: 1, data: { orders: [] } })).toThrow();
	const invalid = structuredClone(initial);
	if (invalid.orders[0]) invalid.orders[0].total = Number.NaN;
	expect(() => parseOperations({ version: 1, data: invalid })).toThrow();
	expect(parseOperations({ version: 1, data: { ...initial, refund: "invalid" } })).not.toHaveProperty(
		"refund",
	);
});
test("failed save rolls back operation and keeps previous data", () => {
	const storage = memoryStorage();
	storage.setItem = () => {
		throw new Error("Quota exceeded");
	};
	const errors: string[] = [];
	const stop = connectOperationsStorage(storage, (message) => errors.push(message));
	const order = useStore.getState().orders[0];
	if (!order) throw new Error("Missing sample order");
	useStore.getState().addOrderNote(order.id, "Should not persist");
	expect(useStore.getState().orders[0]?.note).toBe(order.note);
	expect(errors[0]).toContain("preserved");
	stop();
});
test("demo refunds reject invalid amounts and cap remaining balance", () => {
	const state = useStore.getState();
	const transaction = state.transactions.find((t) => t.status === "captured" && t.refunded === 0);
	if (!transaction) throw new Error("Missing refundable transaction");
	state.refund(transaction.id, -1);
	state.refund(transaction.id, transaction.amount + 1);
	expect(useStore.getState().transactions.find((t) => t.id === transaction.id)?.refunded).toBe(0);
	state.refund(transaction.id, transaction.amount / 2);
	expect(useStore.getState().transactions.find((t) => t.id === transaction.id)?.status).toBe(
		"partial_refund",
	);
	state.refund(transaction.id, transaction.amount / 2);
	expect(useStore.getState().transactions.find((t) => t.id === transaction.id)?.status).toBe("refunded");
	resetOperations();
	expect(useStore.getState().transactions.find((t) => t.id === transaction.id)?.refunded).toBe(0);
});
test("catalog bridge converts minor-unit prices and preserves IDs and stock", () => {
	const snapshot = {
		products: [
			{
				id: "own-p",
				name: "Own product",
				slug: "own-product",
				summary: "Description",
				categoryId: "own-c",
				status: "published",
				images: [],
				variants: [
					{
						id: "own-v",
						sku: "OWN",
						label: "M",
						price: "1999",
						originalPrice: "2499",
						stock: 7,
						images: [],
						attributes: {},
					},
				],
			},
		],
		categories: [],
		content: {
			storeName: "RINAZ",
			announcement: { enabled: false, text: "", href: "/" },
			navigation: [],
			footer: { text: "", links: [] },
			slides: [],
			sections: [],
			pages: [],
			contact: { email: "", phone: "", address: "" },
			faqs: [],
		},
	} as Snapshot;
	const product = workflowCatalog(snapshot)[0];
	expect(product?.id).toBe("own-p");
	expect(product?.price).toBe(24.99);
	expect(product?.salePrice).toBe(19.99);
	expect(product?.variants[0]?.stock).toBe(7);
});

test("invalid currency and refund amounts cannot replace saved data", () => {
	const invalid = structuredClone(initial);
	invalid.settings.baseCurrency = "INVALID";
	expect(() => parseOperations({ version: 1, data: invalid })).toThrow("currency");
	const amounts = structuredClone(initial);
	if (amounts.transactions[0]) amounts.transactions[0].refunded = amounts.transactions[0].amount + 1;
	expect(() => parseOperations({ version: 1, data: amounts })).toThrow("amounts");
});

test("sample reports link to catalog once without rewriting order amounts", () => {
	const product = useStore.getState().products[0];
	if (!product) throw new Error("Missing seed product");
	const before = useStore.getState().orders.map((order) => order.total);
	const snapshot: Snapshot = {
		products: [
			{
				id: "own-id",
				name: "Own abaya",
				slug: "own-abaya",
				summary: "",
				categoryId: "own-category",
				status: "published",
				images: [],
				variants: [
					{
						id: "own-variant",
						sku: "OWN",
						label: "M",
						price: "1999",
						originalPrice: "",
						stock: 7,
						images: [],
						attributes: {},
					},
				],
			},
		],
		categories: [
			{
				id: "own-category",
				name: "Haute Abayas",
				slug: "abayas",
				parentId: null,
				image: "",
				active: true,
				position: 0,
			},
		],
		content: {
			storeName: "RINAZ",
			announcement: { enabled: false, text: "", href: "/" },
			navigation: [],
			footer: { text: "", links: [] },
			slides: [],
			sections: [],
			pages: [],
			contact: { email: "", phone: "", address: "" },
			faqs: [],
		},
	};
	syncWorkflowCatalog(snapshot);
	const state = useStore.getState();
	expect(state.orders.map((order) => order.total)).toEqual(before);
	expect(state.orders.flatMap((order) => order.items).some((item) => item.productId === "own-id")).toBe(true);
	expect(state.products[0]?.sold30d).toBeGreaterThan(0);
	expect(state.products[0]?.variants[0]?.stock).toBe(7);
	const history = state.orders.flatMap((order) => order.items).filter((item) => item.productId === "own-id");
	syncWorkflowCatalog({
		...snapshot,
		products: snapshot.products.map((product) => ({ ...product, name: "Renamed abaya" })),
	});
	expect(
		useStore
			.getState()
			.orders.flatMap((order) => order.items)
			.filter((item) => item.productId === "own-id"),
	).toEqual(history);
});
