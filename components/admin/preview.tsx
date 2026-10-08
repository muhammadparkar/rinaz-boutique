"use client";
import { Badge } from "@/components/ui/badge";
import { LiveDraftPreview } from "./live-draft-preview";
import { useAdmin } from "./provider";
import { PageHeading } from "./shared";
export function Preview() {
	const { state } = useAdmin();
	return (
		<>
			<PageHeading
				title="Through your customer’s eyes"
				description="This preview uses your last demo-published snapshot. Public storefront content is unchanged."
			>
				<Badge variant="outline">Browser-local preview</Badge>
			</PageHeading>
			<p className="mb-4 text-xs text-muted-foreground">
				{state.publishedAt
					? `Published ${new Date(state.publishedAt).toLocaleString()}`
					: "Original storefront snapshot"}{" "}
				· Navigation stays inside the preview.
			</p>
			<LiveDraftPreview snapshot={state.published} path="/" focusId="" slideId="" mode="published" />
		</>
	);
}
