export async function GET() {
	return Response.json({
		databaseConfigured: Boolean(process.env.DATABASE_URL),
		authConfigured: Boolean(process.env.DATABASE_URL && process.env.BETTER_AUTH_SECRET),
		paymentConfigured: Boolean(
			process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET && process.env.RAZORPAY_WEBHOOK_SECRET,
		),
		checkoutEnabled: false,
	});
}
