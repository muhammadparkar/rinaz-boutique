import { expect, test } from "bun:test";
import { nextOrderStatus } from "./orders";

test("only unpaid orders may be cancelled without refund", () => {
	expect(nextOrderStatus("pending_payment", "cancel")).toBe("cancelled");
	expect(nextOrderStatus("paid", "cancel")).toBeNull();
	expect(nextOrderStatus("fulfilled", "cancel")).toBeNull();
});

test("only paid orders may be fulfilled", () => {
	expect(nextOrderStatus("paid", "fulfill")).toBe("fulfilled");
	expect(nextOrderStatus("pending_payment", "fulfill")).toBeNull();
	expect(nextOrderStatus("cancelled", "fulfill")).toBeNull();
});
