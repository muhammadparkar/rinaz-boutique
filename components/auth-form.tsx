"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

export function AuthForm({ admin = false }: { admin?: boolean }) {
	const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
	const [pending, setPending] = useState(false);
	const [error, setError] = useState("");

	async function submit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError("");
		setPending(true);
		const form = new FormData(event.currentTarget);
		const email = String(form.get("email") ?? "").trim();
		const password = String(form.get("password") ?? "");
		try {
			const response =
				mode === "sign-up" && !admin
					? await authClient.signUp.email({
							name: String(form.get("name") ?? "").trim(),
							email,
							password,
						})
					: await authClient.signIn.email({ email, password });
			if (response.error) {
				setError(response.error.message ?? "Could not sign in.");
				return;
			}
			if (admin) {
				const access = await fetch("/api/staff/session", { cache: "no-store" });
				if (!access.ok || !(await access.json()).assigned) {
					setError("This account has no staff access. Ask an owner to assign a role.");
					return;
				}
			}
			window.location.assign(admin ? "/admin" : "/account");
		} catch {
			setError("Could not connect. Please try again.");
		} finally {
			setPending(false);
		}
	}

	return (
		<form onSubmit={submit} className="mx-auto grid w-full max-w-sm gap-4 rounded-lg border p-6">
			<h1 className="font-display text-2xl">
				{admin ? "Staff sign in" : mode === "sign-up" ? "Create account" : "Sign in"}
			</h1>
			{mode === "sign-up" && !admin && (
				<label htmlFor="auth-name" className="grid gap-1 text-sm">
					Name
					<Input id="auth-name" name="name" autoComplete="name" required minLength={2} />
				</label>
			)}
			<label htmlFor="auth-email" className="grid gap-1 text-sm">
				Email
				<Input id="auth-email" name="email" type="email" autoComplete="email" required />
			</label>
			<label htmlFor="auth-password" className="grid gap-1 text-sm">
				Password
				<Input
					id="auth-password"
					name="password"
					type="password"
					autoComplete={mode === "sign-up" ? "new-password" : "current-password"}
					required
					minLength={8}
				/>
			</label>
			{error && (
				<p role="alert" className="text-sm text-destructive">
					{error}
				</p>
			)}
			<Button type="submit" disabled={pending}>
				{pending ? "Please wait…" : mode === "sign-up" ? "Create account" : "Sign in"}
			</Button>
			{!admin && (
				<button
					type="button"
					className="text-sm underline"
					onClick={() => setMode(mode === "sign-in" ? "sign-up" : "sign-in")}
				>
					{mode === "sign-in" ? "Create an account" : "Already have an account? Sign in"}
				</button>
			)}
		</form>
	);
}
