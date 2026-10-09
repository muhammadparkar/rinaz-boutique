import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { contrastRatio, parseCssBlock, resolveColor } from "@/lib/contrast";

const css = readFileSync(`${import.meta.dir}/admin.css`, "utf8");
[".admin-workspace", ".dark .admin-workspace"].map((selector) => {
	const tokens = parseCssBlock(css, selector) ?? {};
	const pairs = [
		...["ink", "ink-2", "muted", "faint"].flatMap((text) =>
			["surface", "surface-2", "bg", "sunken"].map((surface) => [text, surface]),
		),
		...["ok", "warn", "bad", "info"].map((tone) => [tone, `${tone}-soft`]),
	];
	pairs.map(([text, surface]) =>
		test(`${selector}: ${text} on ${surface} clears AA`, () => {
			const foreground = resolveColor(`ops-${text}`, tokens);
			const background = resolveColor(`ops-${surface}`, tokens);
			expect(foreground).not.toBeNull();
			expect(background).not.toBeNull();
			if (foreground && background) expect(contrastRatio(foreground, background)).toBeGreaterThanOrEqual(4.5);
		}),
	);
});

const preset = readFileSync(`${import.meta.dir}/preset.css`, "utf8");
const base = parseCssBlock(preset, ".admin-content-theme") ?? {};
[".admin-content-theme", ".dark .admin-content-theme"].map((selector) => {
	const palette = { ...base, ...parseCssBlock(preset, selector) };
	[
		["foreground", "background"],
		["card-foreground", "card"],
		["muted-foreground", "card"],
		["secondary-foreground", "secondary"],
		["primary-foreground", "primary"],
		["popover-foreground", "popover"],
	].map(([text, surface]) =>
		test(`${selector} preset: ${text} on ${surface} clears AA`, () => {
			const foreground = resolveColor(text ?? "", palette);
			const background = resolveColor(surface ?? "", palette);
			expect(foreground).not.toBeNull();
			expect(background).not.toBeNull();
			if (foreground && background) expect(contrastRatio(foreground, background)).toBeGreaterThanOrEqual(4.5);
		}),
	);
});
