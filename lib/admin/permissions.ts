import { isDeepStrictEqual } from "node:util";
import { type Area, canEdit, type DemoState, parseDemoState, type Role } from "./model";

export function validateWorkspaceChange(current: DemoState, input: unknown, role: Role, area: Area) {
	if (!["cms", "catalog", "media", "administration"].includes(area) || !canEdit(role, area)) {
		throw new Error("Workspace access denied");
	}
	const serialized = JSON.stringify(input);
	if (!serialized || serialized.length > 750_000) throw new Error("Workspace exceeds 750 KB");
	const next = parseDemoState(input);
	if (next.media.some((asset) => asset.src.startsWith("media:"))) {
		throw new Error("Browser-only images cannot be saved. Upload them again to shared storage.");
	}
	if (role !== "Owner") {
		const allowed = structuredClone(current);
		if (area === "cms") {
			allowed.draft.content = next.draft.content;
			allowed.published.content = next.published.content;
			allowed.publishedAt = next.publishedAt;
			allowed.websiteVersions = next.websiteVersions.map((version) => ({
				...version,
				snapshot: {
					...(current.websiteVersions.find((item) => item.number === version.number)?.snapshot ??
						current.draft),
					content: version.snapshot.content,
				},
			}));
		} else if (area === "catalog") {
			allowed.draft.products = next.draft.products;
			allowed.draft.categories = next.draft.categories;
			allowed.threshold = next.threshold;
			allowed.adjustments = next.adjustments;
		} else if (area === "media") {
			allowed.media = next.media;
		}
		const comparable = { ...next, activity: current.activity };
		if (!isDeepStrictEqual(allowed, comparable)) {
			throw new Error("Changes exceed assigned staff permissions");
		}
	}
	return { ...next, activity: current.activity };
}
