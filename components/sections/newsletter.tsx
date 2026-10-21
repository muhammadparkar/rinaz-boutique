"use client";

import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";
import { NewsletterConsent } from "@/components/newsletter-consent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trackIdentify } from "@/lib/track";

export function Newsletter({
	title = "Receive First Access to Runway Drops",
	text,
	preview = false,
}: {
	title?: string;
	text?: string;
	preview?: boolean;
} = {}) {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);
	const [marketingConsent, setMarketingConsent] = useState(false);

	useEffect(() => {
		if (state?.success && state.email) trackIdentify(state.email);
	}, [state]);

	return (
		<section id="newsletter" className="border-t border-border bg-background text-foreground">
			<div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-12 lg:items-center lg:gap-12 lg:px-12 lg:py-24">
				<div className="lg:col-span-6">
					<h2 className="max-w-[17ch] text-[clamp(2rem,3.7vw,3.5rem)] leading-[1.15] tracking-[-0.025em] text-balance">
						{title}
					</h2>
					<p className="mt-5 max-w-[42ch] text-base leading-7 text-muted-foreground">
						{text ??
							"Join our private client register to receive seasonal preview lookbooks, limited bridal pret releases, and private studio invitations."}
					</p>
				</div>
				<div className="lg:col-span-5 lg:col-start-8" aria-live="polite">
					{state?.success ? (
						<div role="status" className="border-y border-border py-8">
							<CheckIcon aria-hidden="true" className="mb-4 size-6" />
							<h3 className="font-display text-2xl">You&apos;re on the list</h3>
							<p className="mt-3 text-base leading-7 text-muted-foreground">{state.message}</p>
						</div>
					) : (
						<>
							<form
								onSubmit={preview ? (event) => event.preventDefault() : undefined}
								action={action}
								className="flex flex-col gap-5"
							>
								<div>
									<label htmlFor="newsletter-email" className="text-sm font-medium">
										Email address
									</label>
									<div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end">
										<Input
											id="newsletter-email"
											type="email"
											name="email"
											placeholder="your@email.com"
											autoComplete="email"
											required
											disabled={isPending}
											aria-describedby={state?.error ? "newsletter-error" : undefined}
											className="h-12 min-w-0 rounded-none border-0 border-b border-foreground/40 bg-transparent px-0 text-base text-foreground shadow-none placeholder:text-muted-foreground focus-visible:border-foreground focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-4 focus-visible:ring-offset-background sm:flex-1 dark:bg-transparent"
										/>
										<Button
											type="submit"
											size="lg"
											disabled={isPending || !marketingConsent}
											className="h-12 shrink-0 rounded-none bg-foreground px-5 text-background hover:bg-foreground/85 focus-visible:ring-foreground disabled:opacity-50"
										>
											{isPending ? "Subscribing\u2026" : "Subscribe"}
											{!isPending && <ArrowRightIcon aria-hidden="true" />}
										</Button>
									</div>
								</div>
								<NewsletterConsent
									checked={marketingConsent}
									onCheckedChange={setMarketingConsent}
									disabled={isPending}
									className="min-h-11 gap-3 text-foreground [&_[data-slot=checkbox]]:size-5 [&_[data-slot=checkbox]]:border-foreground/60 [&_[data-slot=checkbox]]:bg-transparent [&_[data-slot=checkbox]]:text-foreground [&_[data-slot=checkbox]]:data-[state=checked]:bg-foreground [&_[data-slot=checkbox]]:data-[state=checked]:text-background [&_span]:opacity-100"
								/>
							</form>
							{state?.error && (
								<p id="newsletter-error" role="alert" className="mt-4 text-sm font-medium">
									{state.error}
								</p>
							)}
						</>
					)}
				</div>
			</div>
		</section>
	);
}
