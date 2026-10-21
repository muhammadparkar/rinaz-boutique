import { expect, test } from "bun:test";
import { imageContentType } from "./media-validation";
import { validateWorkspaceChange } from "./permissions";
import { newDemo, saveWebsiteVersion } from "./repository";
import { getAdminSeed } from "./seed";

const seed = await getAdminSeed();
const initial = () => newDemo(seed.snapshot, seed.media);

test("editor can save content history, but cannot smuggle catalog or media changes", () => {
	const current = initial();
	const content = structuredClone(current.draft.content);
	content.storeName = "Edited studio";
	const saved = saveWebsiteVersion(current, content);
	expect(validateWorkspaceChange(current, saved, "Editor", "cms").draft.content.storeName).toBe(
		"Edited studio",
	);
	const product = saved.draft.products[0];
	if (!product) throw new Error("Fixture missing");
	product.name = "Forged product";
	expect(() => validateWorkspaceChange(current, saved, "Editor", "cms")).toThrow("permissions");
	expect(() => validateWorkspaceChange(current, current, "Operations", "cms")).toThrow("denied");
});

test("catalog role saves draft stock but cannot publish or alter page content", () => {
	const current = initial();
	const next = structuredClone(current);
	const variant = next.draft.products[0]?.variants[0];
	if (!variant) throw new Error("Fixture missing");
	variant.stock += 1;
	expect(
		validateWorkspaceChange(current, next, "Catalog Manager", "catalog").draft.products[0]?.variants[0]
			?.stock,
	).toBe(variant.stock);
	next.published = structuredClone(next.draft);
	expect(() => validateWorkspaceChange(current, next, "Catalog Manager", "catalog")).toThrow("permissions");
});

test("owner still validates unsafe links and browser-only media; ignores client audit changes", () => {
	const current = initial();
	const next = structuredClone(current);
	next.activity = [{ id: "fake", at: "now", message: "fake audit", role: "Owner" }];
	expect(validateWorkspaceChange(current, next, "Owner", "cms").activity).toEqual(current.activity);
	next.draft.content.navigation[0] = { id: "unsafe", label: "Unsafe", href: "javascript:alert(1)" };
	expect(() => validateWorkspaceChange(current, next, "Owner", "cms")).toThrow("safe");
});

test("raster uploads inspect bytes rather than claimed MIME type", () => {
	expect(imageContentType(new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 0]))).toBe("image/png");
	expect(() => imageContentType(new TextEncoder().encode("<svg onload='alert(1)'></svg>"))).toThrow("image");
	expect(() => imageContentType(new Uint8Array(2))).toThrow("Invalid");
});
