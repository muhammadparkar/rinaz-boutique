"use client";

import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

export function AuthForm({ admin = false }: { admin?: boolean }) {
	const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
	const [pending, setPending] = useState(false);
	const [error, setError] = useState("");
	const [showPassword, setShowPassword] = useState(false);

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
		<form
			onSubmit={submit}
			aria-busy={pending}
			className={
				admin
					? "mx-auto grid w-full max-w-sm gap-4 rounded-lg border p-6"
					: "mx-auto grid w-full max-w-sm min-w-0 grid-cols-1 gap-6"
			}
		>
			<div className={admin ? "" : "mb-3"}>
				<h1
					className={
						admin ? "font-display text-2xl" : "font-display text-3xl leading-tight break-words sm:text-4xl"
					}
				>
					{admin ? "Staff sign in" : mode === "sign-up" ? "Create your account" : "Welcome back"}
				</h1>
				{!admin && (
					<p className="mt-3 text-sm leading-6 text-muted-foreground">
						{mode === "sign-up"
							? "A place for your RINAZ details. Start with your name and email."
							: "Sign in to your RINAZ account with your email and password."}
					</p>
				)}
			</div>
			{mode === "sign-up" && !admin && (
				<Label htmlFor="auth-name" className="grid gap-2 text-sm font-medium">
					Name
					<Input
						id="auth-name"
						name="name"
						autoComplete="name"
						required
						minLength={2}
						disabled={pending}
						className="h-12 rounded-none shadow-none"
					/>
				</Label>
			)}
			<Label htmlFor="auth-email" className="grid gap-2 text-sm font-medium">
				Email
				<Input
					id="auth-email"
					name="email"
					type="email"
					autoComplete="email"
					required
					disabled={pending}
					aria-describedby={error ? "auth-error" : undefined}
					className={admin ? undefined : "h-12 rounded-none shadow-none"}
				/>
			</Label>
			<div className="grid gap-2">
				<Label htmlFor="auth-password" className="text-sm font-medium">
					Password
				</Label>
				<div className="relative">
					<Input
						id="auth-password"
						name="password"
						type={showPassword ? "text" : "password"}
						autoComplete={mode === "sign-up" ? "new-password" : "current-password"}
						required
						minLength={8}
						disabled={pending}
						aria-describedby={error ? "auth-error" : mode === "sign-up" ? "auth-password-hint" : undefined}
						className={admin ? undefined : "h-12 rounded-none pr-12 shadow-none"}
					/>
					{!admin && (
						<Button
							type="button"
							variant="ghost"
							size="icon"
							className="absolute right-0.5 top-0.5 size-11 rounded-none"
							onClick={() => setShowPassword(!showPassword)}
							disabled={pending}
							aria-label={showPassword ? "Hide password" : "Show password"}
							aria-pressed={showPassword}
						>
							{showPassword ? <EyeOff aria-hidden /> : <Eye aria-hidden />}
						</Button>
					)}
				</div>
				{mode === "sign-up" && !admin && (
					<p id="auth-password-hint" className="text-xs leading-5 text-muted-foreground">
						Use at least 8 characters.
					</p>
				)}
			</div>
			{error && (
				<p id="auth-error" role="alert" className="text-sm leading-6 text-destructive">
					{error}
				</p>
			)}
			<Button
				type="submit"
				disabled={pending}
				className={
					admin
						? undefined
						: "h-auto min-h-12 w-full justify-between whitespace-normal rounded-none bg-foreground px-5 py-3 text-left text-background hover:bg-foreground/90"
				}
			>
				{pending ? "Please wait…" : mode === "sign-up" ? "Create account" : "Sign in"}
				{!admin && <ArrowRight aria-hidden />}
			</Button>
			{!admin && (
				<div className="border-t border-border pt-6 text-center text-sm leading-6">
					<span className="text-muted-foreground">
						{mode === "sign-in" ? "New to RINAZ? " : "Already have an account? "}
					</span>
					<Button
						type="button"
						variant="link"
						className="min-h-11 whitespace-normal rounded-none px-0 text-foreground underline underline-offset-4 hover:text-muted-foreground"
						disabled={pending}
						onClick={() => {
							setMode(mode === "sign-in" ? "sign-up" : "sign-in");
							setError("");
							setShowPassword(false);
						}}
					>
						{mode === "sign-in" ? "Create an account" : "Sign in"}
					</Button>
				</div>
			)}
		</form>
	);
}
