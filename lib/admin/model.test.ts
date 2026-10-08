import { describe, expect, test } from "bun:test";
import { canEdit, mediaUsage, parseDemoState, safeHref, validateSnapshot } from "./model";
import { newDemo } from "./repository";
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
