import { Inter } from "next/font/google";
import { AdminShell } from "@/components/admin/shell";

const inter = Inter({ subsets: ["latin"], variable: "--font-admin-inter" });
export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className={inter.variable}>
			<style>{`:root { --font-admin-content-family: ${inter.style.fontFamily}; }`}</style>
			<AdminShell>{children}</AdminShell>
		</div>
	);
}
