import type { Metadata } from "next";
import { AdminProvider } from "@/components/admin/provider";

import { getAdminSeed } from "@/lib/admin/seed";
export const metadata: Metadata = {
	title: { absolute: "Studio Administration — RINAZ" },
	robots: { index: false, follow: false },
};
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
	const seed = await getAdminSeed();
	return <AdminProvider {...seed}>{children}</AdminProvider>;
}
