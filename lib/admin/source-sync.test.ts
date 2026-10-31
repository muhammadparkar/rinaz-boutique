import { expect, test } from "bun:test";
import { validateWorkspaceChange } from "./permissions";
import { newDemo } from "./repository";
import { getAdminSeed } from "./seed";
import { syncSourceState } from "./source-sync";

const { snapshot, media } = await getAdminSeed();
const initial = () => newDemo(structuredClone(snapshot), media);

test("first sync adds missing products without replacing CMS edits or drafts", () => {
	const current = initial();
	current.published.products = current.published.products.slice(0, 6);
	current.draft.products = current.draft.products.slice(0, 6);
	current.published.content.storeName = "CMS name";
	current.draft.content.storeName = "Unpublished name";
	const next = syncSourceState(current, snapshot);
	expect(next.published.products).toHaveLength(36);
	expect(next.draft.products).toHaveLength(36);
	expect(next.published.content.storeName).toBe("CMS name");
	expect(next.draft.content.storeName).toBe("Unpublished name");
	expect(syncSourceState(next, snapshot)).toEqual(next);
});

test("code content updates merge with unrelated CMS edits", () => {
	const current = syncSourceState(initial(), snapshot);
	current.draft.content.storeName = "CMS name";
	const source = structuredClone(snapshot);
	source.content.footer.text = "New footer copy";
	const next = syncSourceState(current, source);
	expect(next.draft.content.storeName).toBe("CMS name");
	expect(next.draft.content.footer.text).toBe("New footer copy");
	expect(next.published.content.footer.text).toBe("New footer copy");
});

test("conflicts stop sync; CMS deletions and source removals preserve existing data", () => {
	const current = syncSourceState(initial(), snapshot);
	current.draft.content.storeName = "CMS name";
	const source = structuredClone(snapshot);
	source.content.storeName = "Code name";
	expect(() => syncSourceState(current, source)).toThrow("conflict");
	current.draft.products = current.draft.products.slice(1);
	current.draft.content.sections = current.draft.content.sections.map((section) => ({
		...section,
		productIds: section.productIds.filter((id) => id !== snapshot.products[0]?.id),
	}));
	const next = syncSourceState(current, snapshot);
	expect(next.draft.products).toHaveLength(35);
	const removedSource = structuredClone(snapshot);
	removedSource.products = removedSource.products.slice(1);
	removedSource.content.sections = removedSource.content.sections.map((section) => ({
		...section,
		productIds: section.productIds.filter((id) => id !== snapshot.products[0]?.id),
	}));
	expect(syncSourceState(initial(), removedSource).published.products).toHaveLength(36);
});

test("clients cannot alter code baseline, including owner", () => {
	const current = syncSourceState(initial(), snapshot);
	const next = structuredClone(current);
	if (!next.codeSnapshot) throw new Error("Missing fixture baseline");
	next.codeSnapshot.content.storeName = "Forged baseline";
	expect(() => validateWorkspaceChange(current, next, "Owner", "cms")).toThrow("server-managed");
});
