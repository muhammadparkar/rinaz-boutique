export type CustomerAccount = {
	id: string;
	name: string;
	email: string;
};

export type AccountState =
	| { status: "unavailable" }
	| { status: "signed-out" }
	| { status: "signed-in"; customer: CustomerAccount };

export interface AccountRepository {
	getSession: () => Promise<AccountState>;
}

export const accountRepository: AccountRepository = {
	getSession: async () => {
		if (!process.env.DATABASE_URL || !process.env.BETTER_AUTH_SECRET) {
			return { status: "unavailable" };
		}
		const requestHeaders = await headers();
		const session = await getAuth().api.getSession({ headers: requestHeaders });
		return session
			? {
					status: "signed-in",
					customer: {
						id: session.user.id,
						name: session.user.name,
						email: session.user.email,
					},
				}
			: { status: "signed-out" };
	},
};

import { headers } from "next/headers";
import { getAuth } from "@/lib/auth";
