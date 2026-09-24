"use client";

import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/action";
import { NewsletterConsent } from "@/components/newsletter-consent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trackIdentify } from "@/lib/track";

export function Newsletter() {
	const [state, action, isPending] = useActionState(subscribeToNewsletter, null);
	const [marketingConsent, setMarketingConsent] = useState(false);

	useEffect(() => {
		if (state?.success && state.email) trackIdentify(state.email);
	}, [state]);

	return (
		<section className="bg-foreground text-background overflow-hidden">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
				<div className="max-w-2xl mx-auto text-center">
					{state?.success ? (
						<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
							<div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-background/10">
								<CheckIcon className="h-6 w-6" />
							</div>
							<h2 className="text-2xl sm:text-3xl font-medium tracking-tight">You&apos;re on the list</h2>
							<p className="mt-3 text-background/60">{state.message}</p>
						</div>
					) : (
						<>
							<h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight">
								Receive First Access to Runway Drops
							</h2>
							<p className="mt-4 text-lg leading-relaxed text-background/60 max-w-md mx-auto">
								Join our private client register to receive seasonal preview lookbooks, limited bridal pret
								releases, and private studio invitations.
							</p>
							<form action={action} className="mx-auto mt-10 flex max-w-md flex-col gap-4">
								<div className="flex flex-col gap-3 sm:flex-row">
									<label htmlFor="newsletter-email" className="sr-only">
										Email address
									</label>
									{/* flex-1 only in the row layout: in the stacked phone column it would collapse the height. */}
									<Input
										id="newsletter-email"
										type="email"
										name="email"
										placeholder="your@email.com"
										autoComplete="email"
										required
										className="h-12 rounded-full border-background/25 bg-background/10 px-5 text-base text-background shadow-none placeholder:text-background/55 focus-visible:border-background/50 focus-visible:ring-background/20 sm:flex-1 dark:bg-background/10"
									/>
									<Button
										type="submit"
										size="lg"
										disabled={isPending || !marketingConsent}
										className="h-12 shrink-0 rounded-full bg-background px-8 text-foreground hover:bg-background/90 disabled:opacity-60"
									>
										{isPending ? "Subscribing\u2026" : "Subscribe"}
										{!isPending && <ArrowRightIcon />}
									</Button>
								</div>
								<NewsletterConsent
									checked={marketingConsent}
									onCheckedChange={setMarketingConsent}
									disabled={isPending}
								/>
							</form>
							{state?.error && <p className="mt-4 text-sm text-red-300">{state.error}</p>}
						</>
					)}
				</div>
			</div>
		</section>
	);
}
