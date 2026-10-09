import { describe, expect, test } from "bun:test";
import { canEdit, mediaUsage, parseDemoState, safeHref, validateSnapshot } from "./model";
import { newDemo, saveWebsiteVersion } from "./repository";
import { getAdminSeed } from "./seed";

const seed = await getAdminSeed();
const fixture = <T>(value: T | undefined): T => {
	if (value === undefined) throw new Error("Missing test fixture");
	return value;
};
const demo = () => newDemo(seed.snapshot, seed.media);

describe("admin draft and import boundaries", () => {
	test("seed matches a valid versioned export and drafts are isolated", () => {
		const state = demo();
		parseDemoState(state);
		fixture(state.draft.content.slides[0]).title = "Changed";
		expect(fixture(state.published.content.slides[0]).title).not.toBe("Changed");
		expect(parseDemoState(JSON.parse(JSON.stringify(state))).draft.content.slides[0]?.title).toBe("Changed");
	});
	test("rejects incomplete and incompatible imports", () => {
		expect(() => parseDemoState({ version: 1 })).toThrow();
		expect(() => parseDemoState({ ...demo(), version: 2 })).toThrow();
		const state = demo();
		(state.draft.content as unknown as Record<string, unknown>).sections = [{}];
		expect(() => parseDemoState(state)).toThrow();
	});
	test("rejects duplicate SKUs, negative stock, and invalid prices", () => {
		const state = demo();
		const variants = fixture(state.draft.products[0]).variants;
		fixture(variants[1]).sku = fixture(variants[0]).sku;
		expect(() => validateSnapshot(state.draft)).toThrow("unique");
		fixture(variants[1]).sku = "distinct";
		fixture(variants[0]).stock = -1;
		expect(() => validateSnapshot(state.draft)).toThrow("nonnegative");
		fixture(variants[0]).stock = 1;
		fixture(variants[0]).price = "NaN";
		expect(() => validateSnapshot(state.draft)).toThrow();
	});
	test("prevents category cycles and dangling references", () => {
		const state = demo();
		fixture(state.draft.categories[0]).parentId = fixture(state.draft.categories[1]).id;
		fixture(state.draft.categories[1]).parentId = fixture(state.draft.categories[0]).id;
		expect(() => validateSnapshot(state.draft)).toThrow("cycle");
		fixture(state.draft.categories[1]).parentId = "absent";
		expect(() => validateSnapshot(state.draft)).toThrow();
	});
	test("rejects unsafe CTA links", () => {
		expect(safeHref("javascript:alert(1)")).toBe(false);
		expect(safeHref("//evil.example")).toBe(false);
		expect(safeHref("/\\evil.example")).toBe(false);
		expect(safeHref("/contact")).toBe(true);
		const state = demo();
		fixture(state.draft.content.slides[0]).cta.href = "javascript:alert(1)";
		expect(() => validateSnapshot(state.draft)).toThrow("safe");
	});
	test("media references include published snapshots", () => {
		const state = demo();
		const src = fixture(fixture(state.published.content.slides[0]).images[0]).src;
		fixture(fixture(state.draft.content.slides[0]).images[0]).src = fixture(state.media[0]).src;
		expect(mediaUsage(state, src).some((s) => s.startsWith("Published"))).toBe(true);
	});
	test("rejects missing upload references and invalid thresholds", () => {
		const state = demo();
		fixture(fixture(state.draft.content.slides[0]).images[0]).src = "media:missing";
		expect(() => parseDemoState(state)).toThrow("media gallery");
		expect(() => parseDemoState({ ...demo(), threshold: -1 })).toThrow();
	});
	test("fixed role capabilities separate editing from administration", () => {
		expect(canEdit("Editor", "cms")).toBe(true);
		expect(canEdit("Editor", "catalog")).toBe(false);
		expect(canEdit("Catalog Manager", "catalog")).toBe(true);
		expect(canEdit("Catalog Manager", "administration")).toBe(false);
		expect(canEdit("Operations", "cms")).toBe(false);
		expect(canEdit("Owner", "administration")).toBe(true);
	});
});

test("website save versions survive export, retain media, and migrate old browser data", () => {
	const initial = demo();
	const legacy = { ...initial } as Partial<typeof initial>;
	delete legacy.websiteVersions;
	expect(parseDemoState(legacy).websiteVersions).toEqual([]);
	const first = saveWebsiteVersion(initial, initial.draft.content);
	const changed = structuredClone(first.draft.content);
	fixture(changed.slides[0]).title = "Second draft";
	const second = saveWebsiteVersion(first, changed);
	expect(second.websiteVersions.map((v) => v.number)).toEqual([1, 2]);
	expect(second.websiteVersions[0]?.snapshot.content.slides[0]?.title).not.toBe("Second draft");
	expect(second.published).toEqual(initial.published);
	expect(parseDemoState(JSON.parse(JSON.stringify(second))).websiteVersions).toHaveLength(2);
	expect(() =>
		parseDemoState({ ...second, websiteVersions: [{ number: 1, at: "bad", snapshot: {} }] }),
	).toThrow();
	const src = fixture(fixture(initial.draft.content.slides[0]).images[0]).src;
	expect(mediaUsage(second, src).some((label) => label.startsWith("V1:"))).toBe(true);
});
