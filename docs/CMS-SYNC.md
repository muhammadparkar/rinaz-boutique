# Code, CMS, and database sync

- `bun run dev` syncs before starting Next.js, then watches shared content/catalog imports for changes.
- `bun run cms:sync` syncs immediately. `bun run db:seed-demo` runs the same sync.
- `bun run build` syncs before building, including on Vercel when `DATABASE_URL` is configured. A sync failure stops the build.
- Existing manually started dev servers need one restart to enable the new watcher.

Shared editable content lives in `lib/admin/seed.ts`, campaign content in `lib/storefront-content.ts`, FAQ content in `app/(storefront)/faq/faq-data.ts`, and demo products in `lib/mock-store.ts`. Edit those definitions, rather than duplicating text in JSX. `data/site-content.json` is a legacy file, not the current CMS source.

First sync adds missing records and establishes a baseline, preserving existing CMS edits. Later code changes merge into both draft and published snapshots. CMS-only edits, products, and code removals are preserved; actual removals should happen through CMS. Conflicting changes to the same field stop the entire transaction. Resolve the field in code and CMS to the same value, then retry. CMS revisions prevent an already-open admin tab from overwriting synced content.

Product rows, variants, prices, and CMS snapshots save in one database transaction. Existing database stock is never reset by code sync. Changed prices lose approval; new prices are unapproved. No users, orders, or payments are seeded. Checkout stays disabled.

Layout, CSS, and React logic are code, not CMS data. Shared storefront components update the storefront and CMS preview through normal development/deployment; their markup cannot be converted automatically into editable CMS fields. Add an explicit field to the CMS model when a new piece of content needs editing. Cached storefront reads may take a minute to refresh after external sync; deployed changes require a new deployment.

Seeded products are test data using reused photography and illustrative descriptions/prices. Replace with client-approved catalog before accepting real orders.
