import { desc } from "drizzle-orm";
import Link from "next/link";
import { Suspense } from "react";
import { getDb } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { formatMoney } from "@/lib/money";
import { requireOrderStaff } from "@/lib/staff";

async function OrderList() {
	await requireOrderStaff();
	const rows = await getDb()
		.select({
			id: orders.id,
			email: orders.email,
			status: orders.status,
			currency: orders.currency,
			totalMinor: orders.totalMinor,
			createdAt: orders.createdAt,
		})
		.from(orders)
		.orderBy(desc(orders.createdAt))
		.limit(100);
	return (
		<section className="rounded-lg border bg-background p-6">
			<h1 className="text-2xl font-semibold">Orders</h1>
			<p className="mt-2 text-sm text-muted-foreground">
				Database orders only. Demo orders are not included.
			</p>
			{rows.length === 0 ? (
				<p className="mt-8 text-sm">No real orders yet. Checkout remains disabled.</p>
			) : (
				<div className="mt-6 overflow-x-auto">
					<table className="w-full text-left text-sm">
						<thead>
							<tr className="border-b">
								<th className="py-3">Order</th>
								<th>Customer</th>
								<th>Status</th>
								<th>Total</th>
								<th>Created</th>
							</tr>
						</thead>
						<tbody>
							{rows.map((order) => (
								<tr key={order.id} className="border-b">
									<td className="py-3">
										<Link className="underline" href={`/admin/orders/${order.id}`}>
											{order.id.slice(0, 8)}
										</Link>
									</td>
									<td>{order.email}</td>
									<td>{order.status.replaceAll("_", " ")}</td>
									<td>
										{formatMoney({
											amount: String(order.totalMinor),
											currency: order.currency,
											locale: "en-US",
										})}
									</td>
									<td>{order.createdAt.toLocaleDateString("en-US")}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</section>
	);
}

export default function OrdersPage() {
	return (
		<Suspense fallback={<p>Loading orders…</p>}>
			<OrderList />
		</Suspense>
	);
}
