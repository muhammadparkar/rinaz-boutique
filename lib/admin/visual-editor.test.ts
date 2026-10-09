import { expect, test } from "bun:test";
import { getAdminSeed } from "./seed";
import {
	applyEditorMessage,
	type ContentHistory,
	contentHistory,
	type EditorMessage,
	isEditorMessage,
	moveSection,
} from "./visual-editor";

const { snapshot, media } = await getAdminSeed();
const content = snapshot.content;
const message = (
	field: string,
	value: string,
	kind: "section" | "slide" = "section",
	id = "about",
): EditorMessage => ({ type: "rinaz-editor", kind, id, field, value });

test("canvas messages reject malformed payloads and oversized values", () => {
	expect(isEditorMessage(null)).toBe(false);
	expect(isEditorMessage({ type: "rinaz-editor", kind: "undo", id: "history" })).toBe(true);
	expect(isEditorMessage({ type: "rinaz-editor", kind: "redo", id: "missing" })).toBe(false);
	expect(isEditorMessage({ type: "rinaz-editor", kind: "section", id: "about" })).toBe(false);
	expect(isEditorMessage(message("title", "x".repeat(10001)))).toBe(false);
	expect(isEditorMessage(message("title", "A new heading"))).toBe(true);
});
test("canvas edits preserve models, reject unknown targets and enforce roles", () => {
	const next = applyEditorMessage(content, media, "Editor", message("title", "New story"));
	expect(next.sections.find((section) => section.id === "about")?.title).toBe("New story");
	expect(content.sections.find((section) => section.id === "about")?.title).toBe(
		"Simple. Memorable. Meaningful.",
	);
	expect(next.slides).toBe(content.slides);
	expect(applyEditorMessage(content, media, "Operations", message("title", "Denied"))).toBe(content);
	expect(applyEditorMessage(content, media, "Catalog Manager", message("title", "Denied"))).toBe(content);
	expect(applyEditorMessage(content, media, "Owner", message("__proto__", "Denied"))).toBe(content);
	expect(applyEditorMessage(content, media, "Owner", message("title", "Denied", "section", "missing"))).toBe(
		content,
	);
});
test("canvas URL and image changes validate against approved media", () => {
	expect(applyEditorMessage(content, media, "Owner", message("ctaHref", "javascript:alert(1)"))).toBe(
		content,
	);
	expect(applyEditorMessage(content, media, "Owner", message("ctaHref", "//evil.example"))).toBe(content);
	expect(applyEditorMessage(content, media, "Owner", message("image", "media:missing"))).toBe(content);
	const src = media[0]?.src || "";
	expect(
		applyEditorMessage(content, media, "Owner", message("image", src)).sections.find(
			(section) => section.id === "about",
		)?.image,
	).toBe(src);
	const slide = content.slides[0];
	if (!slide) throw new Error("Missing campaign");
	expect(
		applyEditorMessage(content, media, "Editor", message("image0", src, "slide", slide.id)).slides[0]
			?.images[0]?.src,
	).toBe(src);
	expect(
		applyEditorMessage(
			content,
			media,
			"Editor",
			message("ctaHref", "javascript:alert(1)", "slide", slide.id),
		),
	).toBe(content);
});
test("drag reorder preserves every section and hidden content in both directions", () => {
	const moved = moveSection(content, "hero", "about");
	expect(moved.sections.findIndex((section) => section.id === "hero")).toBe(
		content.sections.findIndex((section) => section.id === "about"),
	);
	expect(moved.sections.map((section) => section.id).sort()).toEqual(
		content.sections.map((section) => section.id).sort(),
	);
	expect(moveSection(moved, "hero", "categories").sections[0]?.id).toBe("hero");
	expect(moveSection(content, "missing", "about")).toBe(content);
	expect(moveSection(content, "hero", "missing")).toBe(content);
	expect(moveSection(content, "hero", "hero")).toBe(content);
	const hidden = {
		...content,
		sections: content.sections.map((section) =>
			section.id === "about" ? { ...section, enabled: false } : section,
		),
	};
	expect(moveSection(hidden, "about", "hero").sections[0]?.enabled).toBe(false);
});
test("undo groups typing, redo restores changes, and new edits discard redo", () => {
	const initial: ContentHistory = { past: [], present: content, future: [] };
	const first = applyEditorMessage(content, media, "Owner", message("title", "First"));
	const second = applyEditorMessage(first, media, "Owner", message("title", "Second"));
	const typed = contentHistory(contentHistory(initial, { kind: "edit", content: first, group: "heading" }), {
		kind: "edit",
		content: second,
		group: "heading",
	});
	expect(typed.past).toHaveLength(1);
	const undone = contentHistory(typed, { kind: "undo" });
	expect(undone.present).toBe(content);
	expect(contentHistory(undone, { kind: "redo" }).present).toBe(second);
	expect(contentHistory(undone, { kind: "edit", content: first }).future).toHaveLength(0);
	expect(contentHistory(initial, { kind: "undo" })).toBe(initial);
});

test("canvas controls reorder and toggle visibility with role enforcement", () => {
	const move: EditorMessage = { type: "rinaz-editor", kind: "move", id: "hero", target: "about" };
	expect(isEditorMessage(move)).toBe(true);
	expect(isEditorMessage({ ...move, target: 42 })).toBe(false);
	expect(applyEditorMessage(content, media, "Owner", move)).toEqual(moveSection(content, "hero", "about"));
	expect(applyEditorMessage(content, media, "Operations", move)).toBe(content);
	const hide: EditorMessage = { type: "rinaz-editor", kind: "visibility", id: "hero", enabled: false };
	expect(
		applyEditorMessage(content, media, "Editor", hide).sections.find((s) => s.id === "hero")?.enabled,
	).toBe(false);
	expect(
		applyEditorMessage(
			content,
			media,
			"Owner",
			{ type: "rinaz-editor", kind: "products", id: "products", ids: ["unknown"] },
			snapshot.products,
		),
	).toBe(content);
});
