import { expect, test } from "bun:test";
import { previewScale, previewViewport } from "./preview-viewport";

test("rotation swaps real viewport dimensions without depending on panel size", () => {
	expect(previewViewport(true, false)).toEqual({ width: 390, height: 844 });
	expect(previewViewport(true, true)).toEqual({ width: 844, height: 390 });
	expect(previewViewport(false, false)).toEqual({ width: 1440, height: 900 });
	expect(previewViewport(false, true)).toEqual({ width: 900, height: 1440 });
});
test("preview fits both dimensions and preserves aspect ratio without upscaling", () => {
	expect(previewScale({ width: 500, height: 422 }, previewViewport(true, false))).toBe(0.5);
	expect(previewScale({ width: 720, height: 600 }, previewViewport(false, false))).toBe(0.5);
	expect(previewScale({ width: 2000, height: 2000 }, previewViewport(false, false))).toBe(1);
	expect(previewScale({ width: 0, height: 500 }, previewViewport(true, false))).toBe(0);
});
