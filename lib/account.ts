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

// The backend contract is not ready; no session or credentials are fabricated.
export const accountRepository: AccountRepository = {
	getSession: async () => ({ status: "unavailable" }),
};
