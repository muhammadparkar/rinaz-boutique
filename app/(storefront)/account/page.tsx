import type { Metadata } from "next";
import { AccountWorkspace } from "@/components/account-workspace";
import { accountRepository } from "@/lib/account";

export const metadata: Metadata = {
	title: "Your account",
	robots: { index: false, follow: false },
};

export default async function AccountPage() {
	"use cache";
	const state = await accountRepository.getSession();
	return <AccountWorkspace state={state} />;
}
