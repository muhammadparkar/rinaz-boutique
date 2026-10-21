import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AdminProvider } from "@/components/admin/provider";
import type { Role } from "@/lib/admin/model";

import { getAdminSeed } from "@/lib/admin/seed";
import { getWorkspace } from "@/lib/admin/workspace";
import { getStaff } from "@/lib/staff";
export const metadata: Metadata = {
	title: { absolute: "Studio Administration — RINAZ" },
	robots: { index: false, follow: false },
};
async function StaffOnly({ children }: { children: React.ReactNode }) {
	const staff = await getStaff();
	if (!staff) redirect("/staff/login");
	const seed = await getAdminSeed();
	const workspace = await getWorkspace();
	const roles: Record<typeof staff.role, Role> = {
		owner: "Owner",
		editor: "Editor",
		catalog: "Catalog Manager",
		operations: "Operations",
	};
	return (
		<AdminProvider {...seed} role={roles[staff.role]} workspace={workspace}>
			{children}
		</AdminProvider>
	);
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
	return (
		<Suspense fallback={<p className="p-8">Checking staff access…</p>}>
			<StaffOnly>{children}</StaffOnly>
		</Suspense>
	);
}
