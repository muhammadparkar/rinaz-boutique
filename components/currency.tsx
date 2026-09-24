"use client";

import { useCallback, useSyncExternalStore } from "react";
import { useStoreConfig } from "@/components/store-config-provider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";

// Display-only conversion from the store's USD prices. Checkout still charges USD.
// ponytail: fixed rates from the brand brief; swap for a daily rates feed when prices must track the market.
export const CURRENCIES = [
	{ code: "USD", label: "USD $", rate: 1 },
	{ code: "INR", label: "INR ₹", rate: 83.5 },
	{ code: "QAR", label: "QAR QR", rate: 3.64 },
	{ code: "AED", label: "AED", rate: 3.67 },
	{ code: "EUR", label: "EUR €", rate: 0.92 },
] as const;

type CurrencyCode = (typeof CURRENCIES)[number]["code"];

const STORAGE_KEY = "rinaz-currency";
const CHANGE_EVENT = "rinaz-currency-change";

const rateOf = (code: string) => CURRENCIES.find((c) => c.code === code)?.rate;

const readStored = (): CurrencyCode | null => {
	try {
		const value = localStorage.getItem(STORAGE_KEY);
		return CURRENCIES.some((c) => c.code === value) ? (value as CurrencyCode) : null;
	} catch {
		return null;
	}
};

const subscribe = (onChange: () => void) => {
	window.addEventListener(CHANGE_EVENT, onChange);
	window.addEventListener("storage", onChange);
	return () => {
		window.removeEventListener(CHANGE_EVENT, onChange);
		window.removeEventListener("storage", onChange);
	};
};

/** The shopper's display currency. Server render and hydration use the store currency, then it switches. */
export function useDisplayCurrency() {
	const { currency: base } = useStoreConfig();
	const stored = useSyncExternalStore(subscribe, readStored, () => null);
	const current = stored ?? base;
	const setCurrency = useCallback((code: string) => {
		try {
			localStorage.setItem(STORAGE_KEY, code);
		} catch {
			// Private mode: the choice just won't persist.
		}
		window.dispatchEvent(new Event(CHANGE_EVENT));
	}, []);
	return { base, current, setCurrency };
}

/** Formats a store-currency minor amount in the shopper's display currency. */
export function useFormatPrice() {
	const { locale } = useStoreConfig();
	const { base, current } = useDisplayCurrency();
	return useCallback(
		(minor: bigint | number | string) => {
			const from = rateOf(base);
			const to = rateOf(current);
			if (!from || !to || base === current) {
				return formatMoney({ amount: minor, currency: base, locale });
			}
			return formatMoney({ amount: Math.round((Number(minor) * to) / from), currency: current, locale });
		},
		[base, current, locale],
	);
}

/** Price in the display currency, for server components that can't call hooks. */
export function Price({ amount }: { amount: bigint | number | string }) {
	return <>{useFormatPrice()(amount)}</>;
}

export function CurrencySelect({ className }: { className?: string }) {
	const { current, setCurrency } = useDisplayCurrency();
	return (
		<Select value={current} onValueChange={setCurrency}>
			<SelectTrigger
				aria-label="Currency"
				size="sm"
				className={cn("h-9 gap-1 border-none px-2 text-xs font-medium tracking-wider shadow-none", className)}
			>
				<SelectValue />
			</SelectTrigger>
			<SelectContent align="end">
				{CURRENCIES.map((c) => (
					<SelectItem key={c.code} value={c.code} className="text-xs tracking-wider">
						{c.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
