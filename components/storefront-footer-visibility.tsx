"use client";

import { usePathname } from "next/navigation";

export function StorefrontFooterVisibility({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	return pathname === "/account" || pathname.startsWith("/account/") ? null : children;
}
