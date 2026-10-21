import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { saveOrder } from "@/app/admin/(workspace)/orders/actions";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { Textarea } from "@/components/admin/ui/textarea";
import { getDb } from "@/lib/db";
import { orderItems, orders } from "@/lib/db/schema";
import { formatMoney } from "@/lib/money";
import { requireOrderStaff } from "@/lib/staff";

async function OrderDetail({ id }: { id: string }) {
	await requireOrderStaff();
	if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) notFound();
	const db = getDb();
	const [order] = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
	if (!order) notFound();
	const items = await db.select().from(orderItems).where(eq(orderItems.orderId, id));
	return (
		<section className="grid max-w-4xl gap-6 rounded-lg border bg-background p-6">
			<Link href="/admin/orders" className="text-sm underline">
				← Orders
			</Link>
			<div>
				<h1 className="break-all text-2xl font-semibold">Order {order.id}</h1>
				<p className="mt-2 text-sm">
					{order.email} · {order.status.replaceAll("_", " ")}
				</p>
			</div>
			<ul className="grid gap-2">
				{items.map((item) => (
					<li key={item.id} className="flex justify-between border-b py-2">
						<span>
							{item.name} × {item.quantity}
						</span>
						<span>
							{formatMoney({
								amount: String(item.unitPriceMinor * item.quantity),
								currency: order.currency,
								locale: "en-US",
							})}
						</span>
					</li>
				))}
			</ul>
			<p className="font-semibold">
				Total: {formatMoney({ amount: String(order.totalMinor), currency: order.currency, locale: "en-US" })}
			</p>
			<form action={saveOrder} className="grid gap-4">
				<input type="hidden" name="id" value={order.id} />
				<label htmlFor="tracking-number" className="grid gap-1 text-sm">
					Tracking number
					<Input
						id="tracking-number"
						name="trackingNumber"
						maxLength={100}
						defaultValue={order.trackingNumber ?? ""}
					/>
				</label>
				<label htmlFor="admin-note" className="grid gap-1 text-sm">
					Internal note
					<Textarea id="admin-note" name="adminNote" maxLength={2000} defaultValue={order.adminNote ?? ""} />
				</label>
				<div className="flex flex-wrap gap-2">
					<Button name="intent" value="save" type="submit">
						Save details
					</Button>
					{order.status === "pending_payment" && (
						<Button name="intent" value="cancel" type="submit" variant="outline">
							Cancel unpaid order
						</Button>
					)}
					{order.status === "paid" && (
						<Button name="intent" value="fulfill" type="submit" variant="outline">
							Mark fulfilled
						</Button>
					)}
				</div>
			</form>
		</section>
	);
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	return (
		<Suspense fallback={<p>Loading order…</p>}>
			<OrderDetail id={id} />
		</Suspense>
	);
}
