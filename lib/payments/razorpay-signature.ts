import { createHmac, timingSafeEqual } from "node:crypto";

function matchesSignature(payload: string, signature: string, secret: string) {
	if (!/^[a-f0-9]{64}$/i.test(signature) || !secret) return false;
	const expected = createHmac("sha256", secret).update(payload).digest();
	return timingSafeEqual(expected, Buffer.from(signature, "hex"));
}

export function verifyRazorpayCheckoutSignature(input: {
	providerOrderId: string;
	providerPaymentId: string;
	signature: string;
	secret: string;
}) {
	return matchesSignature(
		`${input.providerOrderId}|${input.providerPaymentId}`,
		input.signature,
		input.secret,
	);
}

export function verifyRazorpayWebhookSignature(rawBody: string, signature: string, secret: string) {
	return matchesSignature(rawBody, signature, secret);
}
