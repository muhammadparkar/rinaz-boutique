"use client";

import { ArrowRight } from "lucide-react";
import { useActionState, useState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";
import { NewsletterConsent } from "@/components/newsletter-consent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function FooterNewsletter({ description }: { description?: string }) {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);
	const [consent, setConsent] = useState(false);

	return (
		<div className="max-w-md">
			<h2 className="font-display text-xl">Join the RINAZ list</h2>
			<p className="mt-2 text-sm leading-relaxed text-muted-foreground">
				{description ?? "Receive private previews and studio news."}
			</p>
			{state?.success ? (
				<p className="mt-4 text-sm" role="status">
					{state.message}
				</p>
			) : (
				<form action={action} className="mt-4 space-y-3">
					<div className="flex flex-col gap-2 min-[360px]:flex-row">
						<Input
							name="email"
							type="email"
							placeholder="Email address"
							autoComplete="email"
							required
							className="h-11 min-w-0 bg-background"
							aria-label="Email address"
							disabled={isPending}
						/>
						<Button
							type="submit"
							className="h-11 bg-[#121110] px-5 text-white hover:bg-[#292725] disabled:opacity-80"
							disabled={!consent || isPending}
						>
							{isPending ? "Subscribing…" : "Subscribe"}
							<ArrowRight className="size-4" aria-hidden="true" />
						</Button>
					</div>
					<NewsletterConsent checked={consent} onCheckedChange={setConsent} disabled={isPending} />
					{state?.error && (
						<p className="text-sm text-destructive" role="alert">
							{state.error}
						</p>
					)}
				</form>
			)}
		</div>
	);
}
