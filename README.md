# RINAZ Studio

Independent Next.js storefront and browser-local admin prototype.

## Development

```sh
bun install
bun dev
bun run check
bun run build
```

Set `NEXT_PUBLIC_URL` in `.env.local` for canonical URLs. No Commerce Kit or YNS credentials are required.

## Current data

Catalog and cart use the local demo adapter in `lib/mock-store.ts`. Admin drafts, published previews, and versions remain browser-local. Account and checkout are local routes with explicit unavailable states; authentication, orders, and payments are not connected.

## Backend connection

Replace the account repository in `lib/account.ts` once authentication and session contracts are supplied. Customer session reads must be request-scoped and rendered below storefront chrome in a Suspense boundary. Replace the demo commerce adapter in `lib/commerce.ts` when catalog/cart contracts are ready. Enforce authorization and payment totals on the backend. Contact, newsletter, and review writes currently fail explicitly rather than reporting fake success.

Run `bun run audit <url>` against a running production server. Build includes the prerendered-shell gate; its override is `RINAZ_SHELL_CHECK`.
