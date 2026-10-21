import { expect, test } from "bun:test";
import { createHmac } from "node:crypto";
import { verifyRazorpayCheckoutSignature, verifyRazorpayWebhookSignature } from "./razorpay-signature";

test("checkout signature accepts only matching order and payment", () => {
	const signature = createHmac("sha256", "test-secret").update("order_1|pay_1").digest("hex");
	expect(
		verifyRazorpayCheckoutSignature({
			providerOrderId: "order_1",
			providerPaymentId: "pay_1",
			signature,
			secret: "test-secret",
		}),
	).toBe(true);
	expect(
		verifyRazorpayCheckoutSignature({
			providerOrderId: "order_2",
			providerPaymentId: "pay_1",
			signature,
			secret: "test-secret",
		}),
	).toBe(false);
	expect(
		verifyRazorpayCheckoutSignature({
			providerOrderId: "order_1",
			providerPaymentId: "pay_1",
			signature: "bad",
			secret: "test-secret",
		}),
	).toBe(false);
});

test("webhook signature uses exact raw body", () => {
	const rawBody = '{"event":"payment.captured"}';
	const signature = createHmac("sha256", "webhook-secret").update(rawBody).digest("hex");
	expect(verifyRazorpayWebhookSignature(rawBody, signature, "webhook-secret")).toBe(true);
	expect(verifyRazorpayWebhookSignature(`${rawBody} `, signature, "webhook-secret")).toBe(false);
});
