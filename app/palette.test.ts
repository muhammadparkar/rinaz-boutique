import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { contrastRatio, parseCssBlock, resolveColor, SUPPORTED_SYNTAXES } from "@/lib/contrast";

/**
 * The palette in `app/globals.css` must clear WCAG AA (4.5:1) for body text on
 * every surface it is painted on. Themes fork this file, so the check lives
 * here rather than in a reviewer's eye: darken the *text* token, never lighten
 * the tint the design is built on.
 */

const AA = 4.5;
const FIX = "darken `--muted-foreground` until ≥ 4.5; keep the tint";

/** Text token, surface token — every combination the components actually paint. */
const PAIRS = [
	["foreground", "background"],
	["card-foreground", "card"],
	["popover-foreground", "popover"],
	["muted-foreground", "background"],
	["muted-foreground", "card"],
	["muted-foreground", "muted"],
	["muted-foreground", "secondary"],
	["secondary-foreground", "secondary"],
	["accent-foreground", "accent"],
	["primary-foreground", "primary"],
	["gold-foreground", "warm-white"],
] as const;

const palettes = [
	{ file: "globals.css", selectors: [":root", ".dark"] },
	{ file: "storefront.css", selectors: ["body:has(.storefront)", ".dark body:has(.storefront)"] },
];

palettes.map(({ file, selectors }) =>
	selectors.map((selector) => {
		const css = readFileSync(join(import.meta.dir, file), "utf8");
		const tokens = parseCssBlock(css, selector);

		test(`${selector} declares a palette`, () => {
			expect(tokens).not.toBeNull();
		});

		if (file === "storefront.css") {
			["input", "ring"].map((control) =>
				test(`${selector}: --${control} clears UI contrast`, () => {
					const color = resolveColor(control, tokens ?? {});
					expect(color).not.toBeNull();
					["background", "card", "popover"].map((surface) => {
						const background = resolveColor(surface, tokens ?? {});
						expect(background).not.toBeNull();
						if (color && background) expect(contrastRatio(color, background)).toBeGreaterThanOrEqual(3);
					});
				}),
			);
		}

		return PAIRS.map(([fg, bg]) => {
			const declared = tokens?.[fg] !== undefined && tokens?.[bg] !== undefined;
			// A theme that drops a token simply has no such pair to check.
			const check = declared ? test : test.skip;

			return check(`${selector}: --${fg} on --${bg} clears WCAG AA`, () => {
				const palette = tokens ?? {};
				const text = resolveColor(fg, palette);
				const surface = resolveColor(bg, palette);

				// An unreadable value is a failure, not a skip: `color-mix()` in a theme
				// would otherwise hide a contrast regression from this test.
				expect(
					text,
					`${selector} --${fg}: ${palette[fg]} — unsupported colour syntax. Supported: ${SUPPORTED_SYNTAXES}.`,
				).not.toBeNull();
				expect(
					surface,
					`${selector} --${bg}: ${palette[bg]} — unsupported colour syntax. Supported: ${SUPPORTED_SYNTAXES}.`,
				).not.toBeNull();
				if (!text || !surface) return;

				const ratio = contrastRatio(text, surface);
				expect(
					ratio,
					`${selector} --${fg} on --${bg} is ${ratio.toFixed(2)}:1, below WCAG AA (${AA}:1) — ${FIX}`,
				).toBeGreaterThanOrEqual(AA);
			});
		});
	}),
);
