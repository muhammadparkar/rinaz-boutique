export type OrderStatus = "pending_payment" | "paid" | "cancelled" | "fulfilled";

export function nextOrderStatus(current: OrderStatus, intent: string): OrderStatus | null {
	if (current === "pending_payment" && intent === "cancel") return "cancelled";
	if (current === "paid" && intent === "fulfill") return "fulfilled";
	return null;
}
