"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeading } from "./shared";
export function DesignSystem() {
	return (
		<>
			<PageHeading
				title="A language for the studio"
				description="Shared foundations for the storefront, back office, and everything that comes next."
			/>
			<section className="mb-10 grid grid-cols-1 gap-8 border-y py-8 md:grid-cols-2">
				<div>
					<p className="text-[10px] tracking-[0.2em] text-muted-foreground">DISPLAY / CINZEL</p>
					<h2 className="mt-4 text-4xl">
						Modern poise.
						<br />
						Timeless craft.
					</h2>
					<p className="mt-4 text-sm text-muted-foreground">
						Editorial titles. Regular weight. Use sparingly.
					</p>
				</div>
				<div>
					<p className="text-[10px] tracking-[0.2em] text-muted-foreground">BODY / MONTSERRAT</p>
					<p className="mt-4 text-lg leading-relaxed">
						Clear language and considered detail give every interaction purpose.
					</p>
					<p className="mt-4 text-sm text-muted-foreground">
						Body 14–16px · Labels 12–14px · Metadata 11–12px
					</p>
				</div>
			</section>
			<h2 className="mb-5 text-2xl">The palette</h2>
			<div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
				{["background", "foreground", "secondary", "muted", "gold", "warm-white", "border", "ring"].map(
					(token) => (
						<div key={token} className="overflow-hidden rounded-lg border bg-background">
							<div className="h-24 border-b" style={{ background: `var(--${token})` }} />
							<div className="p-3">
								<p className="text-sm">{token}</p>
								<code className="text-[10px] text-muted-foreground">--{token}</code>
							</div>
						</div>
					),
				)}
			</div>
			<div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
				<section className="space-y-5 rounded-lg border bg-background p-6">
					<h2 className="text-2xl">Action hierarchy</h2>
					<div className="flex flex-wrap gap-3">
						<Button>Primary action</Button>
						<Button variant="outline">Secondary</Button>
						<Button variant="ghost">Quiet action</Button>
						<Button variant="destructive">Destructive</Button>
						<Button disabled>Unavailable</Button>
					</div>
					<p className="text-sm text-muted-foreground">
						One primary action per workflow. Confirm deletion; preserve edits on failure.
					</p>
					<div className="flex flex-wrap gap-2">
						<Badge>Published</Badge>
						<Badge variant="secondary">Draft</Badge>
						<Badge variant="outline">Low stock</Badge>
					</div>
				</section>
				<section className="space-y-5 rounded-lg border bg-background p-6">
					<h2 className="text-2xl">Form foundations</h2>
					<div className="space-y-2">
						<Label htmlFor="design-example">Product title</Label>
						<Input id="design-example" placeholder="A considered name" />
						<p className="text-xs text-muted-foreground">
							Labels stay visible. Help text explains the decision.
						</p>
					</div>
					<p className="text-sm text-muted-foreground">
						8px spacing rhythm · 10px base radius · 24px minimum target · visible keyboard focus · shared
						light and dark tokens.
					</p>
				</section>
			</div>
			<section className="mt-8 rounded-lg bg-secondary/40 p-6">
				<h2 className="text-xl">Build with the shared system</h2>
				<p className="mt-3 text-sm leading-relaxed text-muted-foreground">
					Use components/ui for primitives and components/admin/shared for page headings, labeled fields,
					confirmations, empty states, media selection, and image fallback. All surfaces use semantic tokens
					rather than independent palettes.
				</p>
			</section>
		</>
	);
}
