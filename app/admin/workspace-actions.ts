"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath, updateTag } from "next/cache";
import type { Area, Role } from "@/lib/admin/model";
import { validateWorkspaceChange } from "@/lib/admin/permissions";
import { getWorkspace } from "@/lib/admin/workspace";
import { getWriteDb } from "@/lib/db";
import { publishCatalog } from "@/lib/db/publish-catalog";
import { adminWorkspace, staffRoles } from "@/lib/db/schema";
import { getStaff } from "@/lib/staff";

const roleNames = {
	owner: "Owner",
	editor: "Editor",
	catalog: "Catalog Manager",
	operations: "Operations",
} as const satisfies Record<string, Role>;

export async function saveWorkspace(input: unknown, revision: number, message: string, area: Area) {
	try {
		const staff = await getStaff();
		if (!staff) throw new Error("Staff session required");
		if (
			!Number.isSafeInteger(revision) ||
			revision < 0 ||
			typeof message !== "string" ||
			!message.trim() ||
			message.length > 200
		)
			throw new Error("Invalid save request");
		const current = await getWorkspace();
		if (revision !== current.revision)
			throw new Error("Another staff member saved changes. Reload before saving.");
		const role = roleNames[staff.role];
		const next = validateWorkspaceChange(current.state, input, role, area);
		next.activity = [
			{ id: crypto.randomUUID(), role, message, at: new Date().toISOString() },
			...current.state.activity,
		].slice(0, 100);
		const saved = await getWriteDb().transaction(async (tx) => {
			const [assignment] = await tx
				.select({ role: staffRoles.role })
				.from(staffRoles)
				.where(eq(staffRoles.userId, staff.user.id))
				.for("share");
			if (assignment?.role !== staff.role) throw new Error("Staff access changed. Reload before saving.");
			const [row] = await tx
				.update(adminWorkspace)
				.set({ state: next, revision: revision + 1, updatedAt: new Date() })
				.where(and(eq(adminWorkspace.id, "store"), eq(adminWorkspace.revision, revision)))
				.returning({ revision: adminWorkspace.revision });
			if (!row) throw new Error("Another staff member saved changes. Reload before saving.");
			if (JSON.stringify(next.published.products) !== JSON.stringify(current.state.published.products))
				await publishCatalog(tx, next.published);
			return row;
		});
		if (JSON.stringify(next.published) !== JSON.stringify(current.state.published)) {
			updateTag("storefront-cms");
			revalidatePath("/", "layout");
		}
		return { success: true as const, state: next, revision: saved.revision };
	} catch (error) {
		return {
			success: false as const,
			error: error instanceof Error ? error.message : "Unable to save workspace",
		};
	}
}
