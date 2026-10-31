import { isDeepStrictEqual } from "node:util";
import type { DemoState, Snapshot } from "./model";
import { parseDemoState } from "./model";

const record = (value: unknown): value is Record<string, unknown> =>
	typeof value === "object" && value !== null && !Array.isArray(value);
const identified = (value: unknown): value is { id: string }[] =>
	Array.isArray(value) && value.every((item) => record(item) && typeof item.id === "string");

// Keep CMS-only edits and deletions; reject fields edited differently in both sources.
function merge(current: unknown, previous: unknown, source: unknown, path: string): unknown {
	if (isDeepStrictEqual(previous, source) || source === undefined) return current;
	if (current === undefined) return previous === undefined ? source : undefined;
	if (isDeepStrictEqual(current, source)) return current;
	if (identified(current) && identified(source) && (previous === undefined || identified(previous))) {
		const base = identified(previous) ? previous : [];
		const ids = [...new Set([...current, ...source].map((item) => item.id))];
		return ids
			.map((id) =>
				merge(
					current.find((item) => item.id === id),
					base.find((item) => item.id === id),
					source.find((item) => item.id === id),
					`${path}[${id}]`,
				),
			)
			.filter((item) => item !== undefined);
	}
	if (record(current) && record(source) && (previous === undefined || record(previous))) {
		return Object.fromEntries(
			[...new Set([...Object.keys(current), ...Object.keys(source)])].map((key) => [
				key,
				merge(current[key], record(previous) ? previous[key] : undefined, source[key], `${path}.${key}`),
			]),
		);
	}
	if (previous !== undefined && isDeepStrictEqual(current, previous)) return source;
	// First sync establishes baseline without replacing existing CMS fields.
	if (previous === undefined) return current;
	throw new Error(`Code/CMS conflict at ${path}. Resolve content in both sources before syncing.`);
}

export function syncSourceState(state: DemoState, source: Snapshot) {
	const next = {
		...state,
		draft: merge(state.draft, state.codeSnapshot, source, "draft"),
		published: merge(state.published, state.codeSnapshot, source, "published"),
		codeSnapshot: source,
	};
	return parseDemoState(next);
}
