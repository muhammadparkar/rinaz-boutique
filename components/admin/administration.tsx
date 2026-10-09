"use client";
import { useRef } from "react";
import { try_ } from "safe-try";
import { toast } from "sonner";
import { Badge } from "@/components/admin/ui/badge";
import { Button } from "@/components/admin/ui/button";
import { roles } from "@/lib/admin/model";
import { useAdmin } from "./provider";
import { Confirm, EmptyState, PageHeading } from "./shared";

const descriptions = [
	"Full workspace access; publish catalog and content; import, export, reset.",
	"Edit and demo-publish website content; manage imagery.",
	"Manage products, categories, stock, and media. Owner publishes catalog drafts.",
	"Read the dashboard; future orders and customer-service workflows.",
];
export function Administration() {
	const { state, reset, importData } = useAdmin();
	const input = useRef<HTMLInputElement>(null);
	const exportData = () => {
		const url = URL.createObjectURL(new Blob([JSON.stringify(state, null, 2)], { type: "application/json" }));
		const anchor = document.createElement("a");
		anchor.href = url;
		anchor.download = "rinaz-demo.json";
		anchor.click();
		URL.revokeObjectURL(url);
	};
	const importFile = async (file?: File) => {
		if (!file) return;
		if (file.size > 5 * 1024 * 1024) {
			toast.error("JSON import must be under 5 MB.");
			return;
		}
		const [error, raw] = await try_(file.text());
		if (error) {
			toast.error("Unable to read file.");
			return;
		}
		try {
			importData(JSON.parse(raw));
		} catch {
			toast.error("This is not valid JSON.");
		}
	};
	return (
		<>
			<PageHeading
				title="The people behind the studio"
				description="Four fixed demo roles, a local activity record, and controls for your workspace."
			/>
			<div className="mb-8 rounded-lg border bg-secondary/40 p-5 text-sm leading-relaxed">
				Role switching is a UI demonstration. There are no real administrator accounts, invitations, or access
				security in this prototype.
			</div>
			<section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				{roles.map((role, index) => (
					<article key={role} className="rounded-lg border bg-background p-6">
						<div className="flex justify-between">
							<h2 className="text-xl">{role}</h2>
							<Badge variant="outline">Sample staff</Badge>
						</div>
						<p className="mt-3 text-sm">
							{["Studio Owner", "Campaign Editor", "Collection Manager", "Studio Concierge"][index]}
						</p>
						<p className="mt-2 text-xs leading-relaxed text-muted-foreground">{descriptions[index]}</p>
					</article>
				))}
			</section>
			<section className="my-8 rounded-lg border bg-background p-6">
				<h2 className="text-xl">Workspace data</h2>
				<p className="my-4 text-sm text-muted-foreground">
					Exports contain structured drafts, the published snapshot, and image references. Uploaded image
					files stay in IndexedDB on this browser and may be missing when importing elsewhere.
				</p>
				<div className="flex flex-wrap gap-3">
					<Button variant="outline" onClick={exportData}>
						Export JSON
					</Button>
					<Button variant="outline" onClick={() => input.current?.click()}>
						Import JSON
					</Button>
					<input
						ref={input}
						type="file"
						accept="application/json,.json"
						aria-label="Import demo JSON"
						className="sr-only"
						onChange={(e) => {
							const file = e.target.files?.[0];
							if (file && window.confirm("Replace all demo data with this export?")) void importFile(file);
							e.target.value = "";
						}}
					/>
					<Confirm
						label="Reset demo"
						title="Reset the studio workspace?"
						description="This removes saved drafts, the demo-published snapshot, and uploaded images. The original storefront seed will be restored."
						onConfirm={reset}
					/>
				</div>
			</section>
			<h2 className="mb-4 text-xl">Activity record</h2>
			{state.activity.length ? (
				<div className="divide-y rounded-lg border bg-background">
					{state.activity.map((a) => (
						<div key={a.id} className="flex flex-wrap justify-between gap-3 p-4">
							<div>
								<p className="text-sm">{a.message}</p>
								<p className="mt-1 text-xs text-muted-foreground">{a.role}</p>
							</div>
							<time dateTime={a.at} className="text-xs text-muted-foreground">
								{new Date(a.at).toLocaleString()}
							</time>
						</div>
					))}
				</div>
			) : (
				<EmptyState
					title="A fresh workspace"
					description="Save a draft or publish the demo to begin the activity record."
				/>
			)}
		</>
	);
}
