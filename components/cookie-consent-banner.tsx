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
			className="fixed right-3 bottom-3 left-3 z-[60] max-h-[calc(100dvh-1.5rem)] overflow-y-auto rounded-xl border border-border bg-popover font-sans text-popover-foreground sm:right-4 sm:bottom-4 sm:left-auto sm:w-96"
		>
			<div className="relative p-4">
				<button
					type="button"
					onClick={() => choose("declined")}
					aria-label="Close and keep essentials only"
					className="absolute top-2 right-2 grid size-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
				>
					<XIcon className="size-4" />
				</button>
				<h2
					id="cookie-consent-title"
					className={managing ? "pr-8 font-sans text-sm font-semibold" : "sr-only"}
				>
					Cookie preferences
				</h2>
				<p className={`${managing ? "mt-2" : ""} pr-7 text-sm leading-5 text-muted-foreground`}>
					We use cookies to run the store. You can also allow analytics and ads.
				</p>
				<div id="cookie-preferences" hidden={!managing}>
					<ul className="mt-3 divide-y divide-border border-y border-border text-sm">
						<li className="flex items-center justify-between gap-4 py-2.5">
							<span>
								<span className="block font-medium">Essentials</span>
								<span className="text-xs text-muted-foreground">Cart, currency and theme</span>
							</span>
							<span className="text-xs text-muted-foreground">Always on</span>
						</li>
						<li className="flex items-center justify-between gap-4 py-2.5">
							<label htmlFor="consent-analytics" className="cursor-pointer">
								<span className="block font-medium">Analytics and ads</span>
								<span className="text-xs text-muted-foreground">Optional tracking</span>
							</label>
							<Checkbox
								id="consent-analytics"
								checked={analytics}
								onCheckedChange={(value) => setAnalytics(value === true)}
								className="size-6"
							/>
						</li>
					</ul>
				</div>

				<div className="mt-3 grid grid-cols-2 gap-2">
					{managing ? (
						<Button
							type="button"
							onClick={() => choose(analytics ? "accepted" : "declined")}
							className="col-span-2 h-10 rounded-md bg-foreground px-3 text-sm font-medium tracking-normal text-background hover:bg-foreground/90"
						>
							Save preferences
						</Button>
					) : (
						<>
							<Button
								type="button"
								onClick={() => choose("accepted")}
								className="h-10 rounded-md bg-foreground px-3 text-sm font-medium tracking-normal text-background hover:bg-foreground/90"
							>
								Accept all
							</Button>
							<Button
								type="button"
								variant="outline"
								onClick={() => choose("declined")}
								className="h-10 rounded-md px-3 text-sm font-medium tracking-normal"
							>
								Essentials only
							</Button>
						</>
					)}
					<button
						type="button"
						onClick={() => setManaging((m) => !m)}
						aria-expanded={managing}
						aria-controls="cookie-preferences"
						className="col-span-2 min-h-6 justify-self-start rounded-sm text-xs text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
					>
						{managing ? "Back" : "Preferences"}
					</button>
				</div>
			</div>
		</section>
	);
};
