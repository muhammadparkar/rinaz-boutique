import { setCurrency } from "./lib/format";
import { useStore } from "./lib/store";

export const OPERATIONS_KEY = "rinaz-admin-operations-v1";
const keys = [
	"customers",
	"orders",
	"transactions",
	"reviews",
	"coupons",
	"discounts",
	"promotions",
	"banners",
	"appointments",
	"ateliers",
	"notifications",
	"settings",
	"audit",
	"admins",
	"roles",
] as const;
type State = ReturnType<typeof useStore.getState>;
export type OperationsData = Pick<State, (typeof keys)[number]>;
export const operationsData = (state: State) =>
	Object.fromEntries(keys.map((key) => [key, state[key]])) as OperationsData;
const initial = structuredClone(operationsData(useStore.getState()));
const record = (value: unknown): value is Record<string, unknown> =>
	typeof value === "object" && value !== null && !Array.isArray(value);
const nullable = new Set([
	"coupon",
	"carrier",
	"tracking",
	"customerId",
	"variantId",
	"collectionId",
	"bannerId",
	"failureReason",
	"reply",
	"eventDate",
	"usageLimit",
	"endsAt",
	"expiresAt",
	"startsAt",
	"freeAbove",
	"express",
	"salePrice",
]);
function matches(value: unknown, example: unknown, key = ""): boolean {
	if (value === null && nullable.has(key)) return true;
	if (example === null)
		return (
			value === null || typeof value === "string" || (typeof value === "number" && Number.isFinite(value))
		);
	if (Array.isArray(example))
		return Array.isArray(value) && (example.length === 0 || value.every((item) => matches(item, example[0])));
	if (record(example))
		return (
			record(value) &&
			Object.entries(example).every(([key, expected]) => key in value && matches(value[key], expected, key))
		);
	return typeof value === typeof example && (typeof value !== "number" || Number.isFinite(value));
}
export function parseOperations(value: unknown): OperationsData {
	if (!record(value) || value.version !== 1 || !matches(value.data, initial))
		throw new Error("Saved workflow data is incompatible or damaged.");
	const data = value.data as OperationsData;
	if (!["USD", "GBP", "AED", "QAR", "SAR", "PKR", "EUR"].includes(data.settings.baseCurrency))
		throw new Error("Unsupported demo currency.");
	if (
		data.orders.some(
			(order) => order.total < 0 || order.items.some((item) => item.qty <= 0 || item.price < 0),
		) ||
		data.transactions.some(
			(transaction) =>
				transaction.amount < 0 || transaction.refunded < 0 || transaction.refunded > transaction.amount,
		)
	)
		throw new Error("Saved workflow amounts are invalid.");
	try {
		new Intl.DateTimeFormat("en-US", { timeZone: data.settings.timezone }).format();
		data.ateliers.map((atelier) => new Intl.DateTimeFormat("en-US", { timeZone: atelier.timezone }).format());
	} catch {
		throw new Error("Saved workflow time zone is invalid.");
	}

	return Object.fromEntries(keys.map((key) => [key, data[key]])) as OperationsData;
}
export function connectOperationsStorage(storage: Storage, onError: (message: string) => void) {
	let preserving = false;
	try {
		const saved = storage.getItem(OPERATIONS_KEY);
		if (saved) {
			const data = parseOperations(JSON.parse(saved));
			useStore.setState(data);
			setCurrency(data.settings.baseCurrency);
		}
	} catch (error) {
		onError(error instanceof Error ? error.message : "Workflow storage unavailable.");
		return () => {};
	}
	return useStore.subscribe((state, previous) => {
		if (preserving || keys.every((key) => state[key] === previous[key])) return;
		try {
			storage.setItem(
				OPERATIONS_KEY,
				JSON.stringify({ version: 1, data: parseOperations({ version: 1, data: operationsData(state) }) }),
			);
		} catch {
			preserving = true;
			useStore.setState(operationsData(previous));
			preserving = false;
			onError("Workflow save failed. Your previous data is preserved.");
		}
	});
}
export function resetOperations() {
	useStore.setState(structuredClone(initial));
	setCurrency(initial.settings.baseCurrency);
}
