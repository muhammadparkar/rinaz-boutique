# Local backend

This personal test Neon project uses its `production` branch as the single active database. Storefront catalog reads active products, variants, stock, and USD prices from Postgres; demo images, categories, and editorial content still come from the local seed, so new database-only products will not appear yet. Cart lines persist in Postgres. Better Auth handles customer login; staff access requires a separate database role. Admin order list/detail read Postgres, but no real orders can yet be placed. Other admin modules remain demo-backed.

1. Add a random `BETTER_AUTH_SECRET` of at least 32 characters to ignored `.env.local`. Never commit it. Keep `NEON_BRANCH=production`, with pooled `DATABASE_URL` and direct `DATABASE_URL_UNPOOLED` for migrations.
2. Run `bun run db:migrate` and `bun run db:seed-demo` against this test project only. Both refuse non-`production` branch. Review migrations before running them against a future client project.
3. Run `bun dev`. Open `/account/login` for customer login or signup. `/api/backend/status` exposes configuration flags only.
4. To create the first owner, set `ADMIN_BOOTSTRAP_EMAIL` and `ADMIN_BOOTSTRAP_PASSWORD` (16+ characters) in ignored `.env.local`, then run `bun run admin:bootstrap`. The command refuses existing accounts and refuses to run once an owner exists. Open `/staff/login`, then `/admin/team` to assign fixed staff roles to accounts that signed up.
5. Run `bun run check` and `bun run build`. After schema changes, run `bun run db:generate` and inspect generated SQL before migrating.

Checkout and payment capture remain disabled. No approved merchant prices, shipping/tax policy, or provider credentials exist. `CHECKOUT_ENABLED=false` must stay until server totals, stock handling, order creation, webhook reconciliation, refunds, and access checks are implemented and tested. Demo prices must not be used for live charging.
