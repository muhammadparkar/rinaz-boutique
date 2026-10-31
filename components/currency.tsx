"use client";

import Image from "next/image";
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

const currencyFlags = { USD: "us", INR: "in", QAR: "qa", AED: "ae", EUR: "eu" } as const;

export function CurrencySelect({ className, iconOnly = false }: { className?: string; iconOnly?: boolean }) {
	const { current, setCurrency } = useDisplayCurrency();
	const flag = currencyFlags[current as keyof typeof currencyFlags];
	return (
		<Select value={current} onValueChange={setCurrency}>
			<SelectTrigger
				aria-label={`Currency: ${current}`}
				size="sm"
				className={cn(
					"h-9 gap-1 border-none px-2 text-xs font-medium tracking-wider shadow-none",
					iconOnly &&
						"size-11 justify-center rounded-none bg-transparent p-0 dark:bg-transparent dark:hover:bg-secondary [&>svg]:hidden",
					className,
				)}
			>
				{iconOnly ? (
					<span aria-hidden="true" className="relative block size-6 shrink-0 overflow-hidden rounded-full">
						{flag ? (
							<Image src={`/flags/${flag}.svg`} alt="" fill sizes="24px" className="object-cover" />
						) : (
							current
						)}
					</span>
				) : (
					<SelectValue />
				)}
			</SelectTrigger>
			<SelectContent align="end">
				{CURRENCIES.map((c) => (
					<SelectItem key={c.code} value={c.code} className="text-xs tracking-wider">
						<span className="relative mr-2 inline-block size-5 shrink-0 overflow-hidden rounded-full align-middle">
							<Image
								src={`/flags/${currencyFlags[c.code]}.svg`}
								alt=""
								fill
								sizes="20px"
								className="object-cover"
							/>
						</span>
						{c.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
