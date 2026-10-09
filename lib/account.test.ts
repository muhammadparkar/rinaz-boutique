import { expect, test } from "bun:test";
import { accountRepository } from "./account";
import { mockCommerce } from "./mock-store";

test("missing account backend returns no fabricated session", async () => {
	expect(await accountRepository.getSession()).toEqual({ status: "unavailable" });
});

test("disconnected backend cannot report successful writes", async () => {
	await expect(
		mockCommerce.contactMessageCreate({ email: "test@example.com", message: "Hello" }),
	).rejects.toThrow("not connected");
	await expect(mockCommerce.subscriberCreate({ email: "test@example.com" })).rejects.toThrow("not connected");
});
