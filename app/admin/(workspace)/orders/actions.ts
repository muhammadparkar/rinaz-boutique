"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { nextOrderStatus } from "@/lib/orders";
import { requireOrderStaff } from "@/lib/staff";

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function saveOrder(formData: FormData) {
	await requireOrderStaff();
	const id = String(formData.get("id") ?? "");
	const intent = String(formData.get("intent") ?? "save");
	const adminNote = String(formData.get("adminNote") ?? "").trim();
	const trackingNumber = String(formData.get("trackingNumber") ?? "").trim();
	if (!uuid.test(id) || adminNote.length > 2000 || trackingNumber.length > 100) {
		throw new Error("Invalid order update");
	}
	const db = getDb();
	const [order] = await db.select({ status: orders.status }).from(orders).where(eq(orders.id, id)).limit(1);
	if (!order) throw new Error("Order not found");
	const next = intent === "save" ? order.status : nextOrderStatus(order.status, intent);
	if (!next) throw new Error("Order status changed or transition not allowed");
	const [updated] = await db
		.update(orders)
		.set({ status: next, adminNote, trackingNumber: trackingNumber || null })
		.where(and(eq(orders.id, id), eq(orders.status, order.status)))
		.returning({ id: orders.id });
	if (!updated) throw new Error("Order changed; reload and try again");
	revalidatePath("/admin/orders");
	revalidatePath(`/admin/orders/${id}`);
}
