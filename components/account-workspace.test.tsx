import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { AccountWorkspace } from "./account-workspace";
import { AuthForm } from "./auth-form";

test("signed-out account shows accessible sign-in instead of placeholder dashboard", () => {
	const html = renderToStaticMarkup(<AccountWorkspace state={{ status: "signed-out" }} />);
	expect(html).toContain("Welcome back");
	expect(html).toContain('for="auth-email"');
	expect(html).toMatch(/autocomplete="current-password"/i);
	expect(html).toContain("Create an account");
	expect(html).not.toContain('aria-label="Account sections"');
});

test("signed-in account shows real identity and honest order availability", () => {
	const html = renderToStaticMarkup(
		<AccountWorkspace
			state={{
				status: "signed-in",
				customer: { id: "test", name: "Test customer", email: "customer@example.invalid" },
			}}
		/>,
	);
	expect(html).toContain("Test customer");
	expect(html).toContain("customer@example.invalid");
	expect(html).toContain("Order history and tracking are not available yet.");
	expect(html).toContain("Sign out");
	expect(html).not.toContain("Welcome back");
});

test("unconfigured account does not offer a nonfunctional sign-in form", () => {
	const html = renderToStaticMarkup(<AccountWorkspace state={{ status: "unavailable" }} />);
	expect(html).toContain("Account services are temporarily unavailable");
	expect(html).not.toContain("<form");
});

test("staff form keeps its separate access flow", () => {
	const html = renderToStaticMarkup(<AuthForm admin />);
	expect(html).toContain("Staff sign in");
	expect(html).not.toContain("Create an account");
	expect(html).not.toContain("Show password");
});
