"use server";

import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getWriteDb } from "@/lib/db";
import { staffRoles, users } from "@/lib/db/schema";
import { getStaff } from "@/lib/staff";

const assignableRoles = ["editor", "catalog", "operations", "owner"] as const;

export async function assignStaffRole(
	_previous: { success: boolean; message: string } | null,
	form: FormData,
) {
	try {
		const actor = await getStaff();
		if (actor?.role !== "owner") throw new Error("Owner access required");
		const email = String(form.get("email") ?? "")
			.trim()
			.toLowerCase();
		const role = String(form.get("role") ?? "");
		if (
			!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
			(role !== "none" && !assignableRoles.some((value) => value === role))
		) {
			throw new Error("Valid account email and role required");
		}
		await getWriteDb().transaction(async (db) => {
			await db.execute(sql`select pg_advisory_xact_lock(825731)`);
			const [assignment] = await db.select().from(staffRoles).where(eq(staffRoles.userId, actor.user.id));
			if (assignment?.role !== "owner") throw new Error("Owner access required");
			const [target] = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
			if (!target) throw new Error("Account not found. Staff member must sign up first.");
			if (target.id === actor.user.id && role !== "owner") throw new Error("Owner cannot demote own account");
			if (role === "none") {
				await db.delete(staffRoles).where(eq(staffRoles.userId, target.id));
				return;
			}
			const validatedRole = role as (typeof assignableRoles)[number];
			await db
				.insert(staffRoles)
				.values({ userId: target.id, role: validatedRole })
				.onConflictDoUpdate({ target: staffRoles.userId, set: { role: validatedRole } });
		});
		revalidatePath("/admin/team");
		return { success: true, message: role === "none" ? "Staff access removed" : "Staff role assigned" };
	} catch (error) {
		return { success: false, message: error instanceof Error ? error.message : "Unable to update staff" };
	}
}
