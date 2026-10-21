import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { getAuth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { staffRoles } from "@/lib/db/schema";

export async function getStaff() {
	if (!process.env.BETTER_AUTH_SECRET || !process.env.DATABASE_URL) return null;
	const requestHeaders = await headers();
	const session = await getAuth().api.getSession({ headers: requestHeaders });
	if (!session) return null;
	const [assignment] = await getDb()
		.select({ role: staffRoles.role })
		.from(staffRoles)
		.where(eq(staffRoles.userId, session.user.id))
		.limit(1);
	return assignment ? { user: session.user, role: assignment.role } : null;
}

export async function requireOrderStaff() {
	const staff = await getStaff();
	if (!staff || (staff.role !== "owner" && staff.role !== "operations")) {
		throw new Error("Order management access denied");
	}
	return staff;
}
