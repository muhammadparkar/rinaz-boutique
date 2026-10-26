import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { AccountWorkspace } from "@/components/account-workspace";
import { accountRepository } from "@/lib/account";

export const metadata: Metadata = {
	title: "Your account",
	robots: { index: false, follow: false },
};

async function AccountContent() {
	await connection();
	const state = await accountRepository.getSession();
	return <AccountWorkspace state={state} />;
}

export default function AccountPage() {
	return (
		<Suspense fallback={<p className="mx-auto max-w-7xl px-4 py-10">Loading account…</p>}>
			<AccountContent />
		</Suspense>
	);
}
