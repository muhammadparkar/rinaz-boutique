import { type Content, canEdit, type Media, type Role, safeHref, safeImage } from "./model";

export type EditorMessage =
	| { type: "rinaz-editor"; kind: "select"; id: string; slideId?: string }
	| { type: "rinaz-editor"; kind: "undo" | "redo"; id: "history" }
	| { type: "rinaz-editor"; kind: "section" | "slide"; id: string; field: string; value: string };

export function isEditorMessage(value: unknown): value is EditorMessage {
	if (
		!value ||
		typeof value !== "object" ||
		!("type" in value) ||
		value.type !== "rinaz-editor" ||
		!("id" in value) ||
		typeof value.id !== "string" ||
		!("kind" in value)
	)
		return false;
	return (
		(value.kind === "select" && (!("slideId" in value) || typeof value.slideId === "string")) ||
		((value.kind === "undo" || value.kind === "redo") && value.id === "history") ||
		((value.kind === "section" || value.kind === "slide") &&
			"field" in value &&
			typeof value.field === "string" &&
			"value" in value &&
			typeof value.value === "string" &&
			value.value.length <= 10000)
	);
}

export function applyEditorMessage(content: Content, media: Media[], role: Role, message: EditorMessage) {
	if (!canEdit(role, "cms") || (message.kind !== "section" && message.kind !== "slide")) return content;
	const { field, value, id } = message;
	const imageAllowed = safeImage(value) && (value === "" || media.some((asset) => asset.src === value));
	if (message.kind === "section") {
		const section = content.sections.find((item) => item.id === id);
		if (!section || !["title", "text", "image", "ctaLabel", "ctaHref"].includes(field)) return content;
		if ((field === "image" && !imageAllowed) || (field === "ctaHref" && !safeHref(value))) return content;
		return {
			...content,
			sections: content.sections.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
		};
	}
	const slide = content.slides.find((item) => item.id === id);
	if (!slide) return content;
	let patch = {};
	if (["title", "accent", "copy"].includes(field)) patch = { [field]: value };
	else if (field === "ctaLabel" || field === "ctaHref") {
		if (field === "ctaHref" && !safeHref(value)) return content;
		patch = { cta: { ...slide.cta, [field === "ctaLabel" ? "label" : "href"]: value } };
	} else if (/^image[01]$/.test(field)) {
		if (!imageAllowed || !value) return content;
		patch = {
			images: slide.images.map((image, index) =>
				index === Number(field.slice(-1)) ? { ...image, src: value } : image,
			),
		};
	} else return content;
	return {
		...content,
		slides: content.slides.map((item) => (item.id === id ? { ...item, ...patch } : item)),
	};
}

export function moveSection(content: Content, source: string, target: string) {
	const from = content.sections.findIndex((section) => section.id === source);
	const to = content.sections.findIndex((section) => section.id === target);
	const section = content.sections[from];
	if (!section || to < 0 || from === to) return content;
	const rest = content.sections.filter((item) => item.id !== source);
	return { ...content, sections: [...rest.slice(0, to), section, ...rest.slice(to)] };
}

export type ContentHistory = { past: Content[]; present: Content; future: Content[]; group?: string };
export type HistoryEvent = { kind: "edit"; content: Content; group?: string } | { kind: "undo" | "redo" };
export function contentHistory(history: ContentHistory, event: HistoryEvent): ContentHistory {
	if (event.kind === "edit") {
		if (JSON.stringify(history.present) === JSON.stringify(event.content)) return history;
		return {
			past:
				event.group && event.group === history.group
					? history.past
					: [...history.past, history.present].slice(-50),
			present: event.content,
			future: [],
			group: event.group,
		};
	}
	if (event.kind === "undo") {
		const previous = history.past.at(-1);
		return previous
			? { past: history.past.slice(0, -1), present: previous, future: [history.present, ...history.future] }
			: history;
	}
	const next = history.future[0];
	return next
		? { past: [...history.past, history.present], present: next, future: history.future.slice(1) }
		: history;
}
