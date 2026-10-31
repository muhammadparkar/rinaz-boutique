"use client";

import { Heart, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { StoreMedia } from "@/lib/store-media";
import { readWishlist, type SavedProduct, toggleSavedProduct } from "@/lib/wishlist";

const key = "rinaz-wishlist";
const changed = "rinaz-wishlist-change";
const subscribe = (onChange: () => void) => {
	window.addEventListener("storage", onChange);
	window.addEventListener(changed, onChange);
	return () => {
		window.removeEventListener("storage", onChange);
		window.removeEventListener(changed, onChange);
	};
};
const snapshot = () => {
	try {
		return localStorage.getItem(key);
	} catch {
		return null;
	}
};

function useWishlist() {
	const raw = useSyncExternalStore(subscribe, snapshot, () => null);
	const items = useMemo(() => readWishlist(raw), [raw]);
	const [error, setError] = useState("");
	const toggle = (product: SavedProduct) => {
		try {
			localStorage.setItem(key, JSON.stringify(toggleSavedProduct(readWishlist(snapshot()), product)));
			window.dispatchEvent(new Event(changed));
			setError("");
		} catch {
			setError("Could not update saved items. Allow browser storage and try again.");
		}
	};
	return { items, toggle, error };
}

export function WishlistToggle({ product, className = "" }: { product: SavedProduct; className?: string }) {
	const { items, toggle, error } = useWishlist();
	const saved = items.some((item) => item.id === product.id);
	return (
		<div className={className}>
			<Button
				type="button"
				variant="ghost"
				size="icon"
				className="size-11 rounded-full bg-background/90 text-foreground hover:bg-background"
				aria-label={`${saved ? "Remove" : "Save"} ${product.name}${saved ? " from saved items" : " to saved items"}`}
				aria-pressed={saved}
				onClick={() => toggle(product)}
			>
				<Heart className="size-6" strokeWidth={1.25} fill={saved ? "currentColor" : "none"} />
			</Button>
			{error && (
				<p role="alert" className="max-w-56 bg-background p-2 text-xs text-destructive">
					{error}
				</p>
			)}
		</div>
	);
}

export function WishlistButton() {
	const { items, toggle, error } = useWishlist();
	const [open, setOpen] = useState(false);
	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger
				className="relative grid size-11 place-items-center transition-colors hover:bg-secondary"
				aria-label={`Saved items (${items.length})`}
			>
				<Heart className="size-6" strokeWidth={1.25} />
				{items.length > 0 && (
					<span className="absolute -top-1 -right-1 grid size-5 place-items-center rounded-full bg-foreground text-xs text-background">
						{items.length}
					</span>
				)}
			</SheetTrigger>
			<SheetContent className="w-full overflow-y-auto px-5 pt-14 font-[Helvetica_Neue,Helvetica,sans-serif] sm:max-w-md">
				<SheetTitle className="font-[inherit]">Saved items</SheetTitle>
				<SheetDescription>
					Saved in this browser. Open a product for current price and availability.
				</SheetDescription>
				{error && (
					<p role="alert" className="text-sm text-destructive">
						{error}
					</p>
				)}
				{items.length === 0 ? (
					<div className="py-10">
						<p className="text-sm text-muted-foreground">Tap a product’s heart to save it here.</p>
						<Button asChild variant="outline" className="mt-5">
							<Link href="/products" onClick={() => setOpen(false)}>
								Explore products
							</Link>
						</Button>
					</div>
				) : (
					<ul className="divide-y divide-border">
						{items.map((item) => (
							<li key={item.id} className="flex items-center gap-4 py-5">
								<Link
									href={`/product/${encodeURIComponent(item.slug)}`}
									onClick={() => setOpen(false)}
									className="flex min-w-0 flex-1 items-center gap-4"
								>
									<span className="relative h-28 w-20 shrink-0 bg-secondary">
										{item.image && (
											<StoreMedia src={item.image} alt="" fill sizes="80px" className="object-cover" />
										)}
									</span>
									<span className="text-sm font-medium leading-6 hover:underline">{item.name}</span>
								</Link>
								<Button
									variant="ghost"
									size="icon"
									aria-label={`Remove ${item.name} from saved items`}
									onClick={() => toggle(item)}
								>
									<X className="size-4" />
								</Button>
							</li>
						))}
					</ul>
				)}
			</SheetContent>
		</Sheet>
	);
}
