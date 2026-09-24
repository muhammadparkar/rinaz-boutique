// ─── DO NOT REMOVE ──────────────────────────────────────────────────────────
// GDPR cookie consent banner. Entry point + server logic in ./cookie-consent.tsx.
// ────────────────────────────────────────────────────────────────────────────
"use client";

import { XIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { notifyConsentChanged } from "@/lib/track";

// Must match CONSENT_COOKIE in ./cookie-consent.tsx
const CONSENT_COOKIE = "yns-cookie-consent";

const recordChoice = (choice: "accepted" | "declined") => {
	document.cookie = `${CONSENT_COOKIE}=${choice}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
	const state = choice === "accepted" ? "granted" : "denied";
	window.dataLayer = window.dataLayer || [];
	window.dataLayer.push({
		event: "consent_update",
		ad_storage: state,
		ad_user_data: state,
		ad_personalization: state,
		analytics_storage: state,
	});
	// Nudges the platform storefront kit to re-read the cookie and start its
	// trackers without a reload.
	notifyConsentChanged();
};

declare global {
	interface Window {
		dataLayer?: Array<Record<string, unknown>>;
	}
}

export const CookieConsentBanner = () => {
	const [hidden, setHidden] = useState(false);
	const [managing, setManaging] = useState(false);
	const [analytics, setAnalytics] = useState(true);
	if (hidden) return null;

	const choose = (choice: "accepted" | "declined") => {
		recordChoice(choice);
		setHidden(true);
	};

	return (
		// z-[60]: above the chat launcher and the newsletter launcher (all z-50 at bottom-4),
		// which otherwise overlap the buttons and shrink their clickable area.
		<section
			aria-labelledby="cookie-consent-title"
			className="fixed right-4 bottom-4 left-4 z-[60] animate-rise rounded-xl border border-border bg-popover text-popover-foreground shadow-[0_24px_60px_-20px_rgb(0_0_0/0.35)] sm:right-6 sm:left-auto sm:max-w-md motion-reduce:animate-none"
		>
			<div className="p-6">
				<div className="flex items-start justify-between gap-4">
					<p className="text-[11px] tracking-[0.3em] text-muted-foreground">✦ RINAZ STUDIO</p>
					<button
						type="button"
						onClick={() => choose("declined")}
						aria-label="Close and keep essentials only"
						className="-mt-2 -mr-2 grid size-8 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
					>
						<XIcon className="size-4" />
					</button>
				</div>

				<h2 id="cookie-consent-title" className="mt-3 text-2xl">
					A note on <span className="italic">cookies</span>
				</h2>
				<p className="mt-3 text-sm leading-relaxed text-muted-foreground">
					Like our velvet keepsake box, we keep only what matters: your cart, currency and light or dark mode.
					With your permission we also learn which pieces you love, so we can curate better collections.
				</p>

				{/* Preferences unfold in place (grid-rows 0fr → 1fr) instead of opening another dialog. */}
				<div
					className={`grid transition-[grid-template-rows] duration-500 ease-out-expo ${managing ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
				>
					<div className="overflow-hidden" inert={!managing}>
						<ul className="mt-5 divide-y divide-border border-y border-border text-sm">
							<li className="flex items-center justify-between gap-4 py-3">
								<span>
									<span className="block font-medium">Essentials</span>
									<span className="text-xs text-muted-foreground">Cart, currency and theme</span>
								</span>
								<span className="text-[11px] tracking-widest text-muted-foreground">ALWAYS ON</span>
							</li>
							<li className="flex items-center justify-between gap-4 py-3">
								<label htmlFor="consent-analytics" className="cursor-pointer">
									<span className="block font-medium">Analytics</span>
									<span className="text-xs text-muted-foreground">
										What you browse, to shape future collections
									</span>
								</label>
								<Checkbox
									id="consent-analytics"
									checked={analytics}
									onCheckedChange={(value) => setAnalytics(value === true)}
									className="size-5"
								/>
							</li>
						</ul>
					</div>
				</div>

				<div className="mt-6 flex flex-wrap items-center gap-3">
					{managing ? (
						<Button
							type="button"
							onClick={() => choose(analytics ? "accepted" : "declined")}
							className="h-10 rounded-full px-6 text-xs tracking-[0.15em]"
						>
							SAVE PREFERENCES
						</Button>
					) : (
						<>
							<Button
								type="button"
								onClick={() => choose("accepted")}
								className="h-10 rounded-full px-6 text-xs tracking-[0.15em]"
							>
								ACCEPT ALL
							</Button>
							<Button
								type="button"
								variant="outline"
								onClick={() => choose("declined")}
								className="h-10 rounded-full px-6 text-xs tracking-[0.15em]"
							>
								ESSENTIALS ONLY
							</Button>
						</>
					)}
					<button
						type="button"
						onClick={() => setManaging((m) => !m)}
						aria-expanded={managing}
						className="text-xs text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground"
					>
						{managing ? "Back" : "Manage preferences"}
					</button>
				</div>
			</div>
		</section>
	);
};
