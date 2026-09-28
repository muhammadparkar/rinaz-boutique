# RINAZ STUDIO — Brand & Web Design Guidelines

> **Tagline:** TIMELESS STYLE | MODERN YOU  
> **Brand Essence:** Luxury modest fashion, certified 18K solid gold fine jewelry, and heirloom Pakistani bridal couture designed for contemporary poise.

---

## 1. Brand Values

| Value | Principle & Expression |
| :--- | :--- |
| **Premium Quality** | Uncompromising materials — 480 GSM Japanese silk, certified 18K solid gold, VVS1 clarity diamonds, and archival finishes. |
| **Modern Elegance** | Fluid drape and clean architectural lines that balance modest tradition with contemporary luxury. |
| **Timeless Fashion** | Generational heirlooms transcending seasonal trends with enduring cultural craftsmanship. |
| **Confidence** | Structured silhouettes that empower the wearer across London, Doha, Dubai, and beyond. |
| **You** | Tailored exclusivity — bespoke bridal appointments, made-to-measure sizing, and private consultations. |

---

## 2. Color Palette & Tokens

### Primary & Accent Colors (3. Rich Gold Palette)

| Swatch | Color Name | Hex Code | Role & Usage |
| :---: | :--- | :---: | :--- |
| <div style="background:#000000; width:24px; height:24px; border-radius:4px; display:inline-block; border:1px solid #444;"></div> | **Black** | `#000000` | **Primary Canvas**: Dark-mode background, light-mode primary buttons and high-contrast typography. |
| <div style="background:#B8860B; width:24px; height:24px; border-radius:4px; display:inline-block;"></div> | **Gold** | `#B8860B` | **Deep Rich Gold**: Secondary gold accents, light-mode focus rings, and luxury emblems. |
| <div style="background:#FFD700; width:24px; height:24px; border-radius:4px; display:inline-block;"></div> | **Bright Gold** | `#FFD700` | **Primary CTA Accent**: Dark-mode primary buttons, glowing highlights, and active states. |
| <div style="background:#FFF8E7; width:24px; height:24px; border-radius:4px; display:inline-block; border:1px solid #ccc;"></div> | **Warm White** | `#FFF8E7` | **Light Canvas & Text**: Light-mode canvas background, dark-mode text, and subtle card surfaces. |

---

### Design System Token Mappings (`app/globals.css`)

#### Light Theme (Clean White & Black)
- `--background`: `#FFFFFF` (Pure White)
- `--foreground`: `#000000` (Black)
- `--card`: `#FFFFFF`
- `--card-foreground`: `#000000`
- `--popover`: `#FFFFFF`
- `--popover-foreground`: `#000000`
- `--primary`: `#000000` (Black)
- `--primary-foreground`: `#FFFFFF` (White)
- `--secondary`: `#F4ECD8` (Tinted warm surface)
- `--secondary-foreground`: `#000000`
- `--muted`: `#F4ECD8`
- `--muted-foreground`: `#5C5544` (Warm contrast tone, clears 6.2:1+ WCAG AA)
- `--accent`: `#F4ECD8`
- `--accent-foreground`: `#000000`
- `--border`: `#E8DECA`
- `--input`: `#E8DECA`
- `--ring`: `#B8860B` (Gold)
- `--gold`: `#B8860B`
- `--gold-bright`: `#FFD700`
- `--warm-white`: `#FFF8E7`

#### Dark Theme (Black & Bright Gold — Preferred Background)
- `--background`: `#000000` (Black)
- `--foreground`: `#FFF8E7` (Warm White)
- `--card`: `#12110E` (Deep obsidian/warm black surface)
- `--card-foreground`: `#FFF8E7`
- `--popover`: `#12110E`
- `--popover-foreground`: `#FFF8E7`
- `--primary`: `#FFD700` (Bright Gold)
- `--primary-foreground`: `#000000` (Black text on gold CTA buttons)
- `--secondary`: `#1F1B12` (Deep warm dark surface)
- `--secondary-foreground`: `#FFF8E7`
- `--muted`: `#18150E`
- `--muted-foreground`: `#C0B8A4` (Warm gold-tinted tone, clears 8.6:1–10.6:1 WCAG AA)
- `--accent`: `#1F1B12`
- `--accent-foreground`: `#FFF8E7`
- `--border`: `#2A2416`
- `--input`: `#2A2416`
- `--ring`: `#FFD700` (Bright Gold)
- `--gold`: `#B8860B`
- `--gold-bright`: `#FFD700`
- `--warm-white`: `#FFF8E7`

---

## 3. Typography System

| Element | Typeface | Tracking / Spacing | Role |
| :--- | :--- | :--- | :--- |
| **Brand Wordmark** | `Cinzel` | `tracking-[0.24em] - tracking-[0.28em]` | "RINAZ" wordmark in navbar, hero headlines, and packaging. |
| **Sub-Brand / Label** | `Montserrat` | `tracking-[0.32em] - tracking-[0.35em]` | "— STUDIO —" descriptor, category chips, uppercase metadata. |
| **Headings (`h1`, `h2`)** | `Cinzel` | `tracking-tight` or wide for titles | Editorial serif, classical luxury feel for all hero and section titles. |
| **Body & UI Text** | `Montserrat` | `tracking-normal` | Clean geometric sans-serif for product descriptions, navigation, buttons, and tables. |
| **Technical / Code** | `Geist_Mono` | `tracking-normal` | Chat markdown, coupon codes, and serial/edition stamps. |

---

## 4. Logo & Identity Assets

1. **Monogram Icon (`R`):**
   - Classical Roman serif letterform with flowing calligraphic leg.
   - Used for app icon, favicon (`public/brand/rinaz-R-v3.png`), seals, jewelry clasps, clothing tags, and avatars.
2. **Horizontal Wordmark Lockup:**
   - Circular Monogram `[ R ]` + `RINAZ` (Cinzel) stacked with `STUDIO` (Montserrat).
   - Displayed in the sticky navigation bar and footer.
3. **Divider Elements:**
   - Single-pixel refined dividers (`border-border`) paired with gold star/diamond accents (`✦`).
4. **Pattern & Texture:**
   - Subtle repeating monogram lattice for tissue wrap, unboxing bags, and background accents.

---

## 5. Accessibility & Performance Verification

- **WCAG AA Compliance:** Every text/surface token pair in both light (`:root`) and dark (`.dark`) themes clears the 4.5:1 contrast requirement verified by `app/palette.test.ts`.
- **Preload Performance:** `Montserrat` and `Cinzel` are optimized variable Google fonts. Secondary faces (`Geist_Mono`) load asynchronously (`preload: false`) to avoid blocking first paint.
- **Prerendered Shell:** Layout navigation and footer structure stay purely static in Next.js without hoisting dynamic request reads above the chrome.
