# Admin workflow migration

The supplied `/Users/talisman/Downloads/cms-main` reference provides workflow layouts, sample records, order/customer/appointment flows, marketing, reviews, analytics, and settings. These modules now run under Next.js `/admin` routes. React Router and the source app shell were not imported.

Existing catalog, categories, stock adjustments, IndexedDB media, inline content editing, numbered website versions, and explicit draft/demo publishing remain authoritative. Workflow catalog views read those saved catalog records. Historical orders and customer records remain independent samples; simulated refunds, fulfillment, marketing, and settings never contact providers or change public storefront data.

## Persistence and permissions

Operational sample records use versioned `rinaz-admin-operations-v1` browser storage. Reload validates shape and finite numbers. Writes preserve previous records on quota failures. Owner reset also resets workflow records. Owner accesses all modules; Operations accesses operational demos; Editor and Catalog Manager retain their existing workspaces. Roles are UI demonstrations, not authentication.

Catalog/site JSON export remains the original CMS format. Operational tables provide CSV exports. Uploaded assets remain in the existing IndexedDB media repository.

## Preset

Applied `npx shadcn@latest apply --preset b1GdgzGtO`: Radix Mira, Inter, Lucide icons, neutral base colors, amber theme & amber charts (`0.625rem` radius). Preset components live in `components/admin/ui`; scoped variables live in `app/admin/preset.css`. Shared storefront components and root styles (`app/globals.css`) were preserved. Inter is used throughout admin content. Existing sidebar styling remains separate.

Status badges use native Mira rounded-full default, secondary, outline, and destructive variants, retaining explicit labels. Neutral preset surfaces, amber chart series, and compact high-density controls are shared across modules.

## Production boundary

All workflows remain local demos. Authentication, authorization, real transactions, delivery, messaging, appointments, tax rules, and shared publishing require the owner's backend contracts.
