# RINAZ Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- Shoppers browsing RINAZ collections and buying through the storefront.
- Store owners and staff managing products, categories, inventory, media, and website content.
- Content editors updating campaigns and pages through the website preview.

## Product Purpose

RINAZ combines a boutique storefront with an admin workspace. Shoppers discover products and reach the local checkout entry. Staff complete catalog and inventory tasks and maintain website content without editing code.

Admin success means a staff member can select content in the preview, edit text or imagery, rearrange sections, save a numbered draft, restore an earlier version, and explicitly publish to the local demo.

## Operating Context

The existing project uses Next.js App Router, Tailwind, and owned ShadCN components. Admin workflows must support desktop and mobile web use.

The current admin is an interactive prototype. Structured data and website versions persist in browser localStorage; uploaded image blobs persist in IndexedDB. Demo publishing updates a separate browser-local snapshot. It does not publish the public storefront.

## Capabilities and Constraints

- Manage products, variants, prices, categories, stock adjustments, media, and structured site content.
- Edit homepage content through contextual controls in the real storefront preview. Reorder, hide, and show sections on the canvas.
- Show desktop and mobile previews using real viewport dimensions and orientation controls.
- Create numbered versions after successful website draft saves. Restoring loads an unsaved draft; publishing remains explicit.
- Keep uploaded assets protected while referenced by drafts, published content, or saved versions.
- Demonstrate Owner, Editor, Catalog Manager, and Operations permissions. Role switching is not authentication.
- Label sample business metrics and browser-local persistence clearly.
- Orders, payments/refunds, customers, appointments, coupons, discounts, promotions, reviews, analytics, and settings now have browser-local sample workflows. Production authentication, server authorization, durable shared storage, real transactions, messaging, shipping, and analytics remain later milestones. The owner will supply a custom backend; URL, endpoints, authentication, and payment contracts remain undecided.
- Preserve public routes, cart behavior, and the prerendered storefront shell. Account and checkout routes are local; production functionality depends on the owner-managed backend.
- Arbitrary pixel positioning is outside the current structured content model.

## Brand Commitments

Preserve the RINAZ STUDIO identity, existing logo assets, and shared storefront/admin branding. Use existing ShadCN components and the established design-system reference. The admin logo belongs in navigation; do not repeat it in the workspace header.

Use clear operational language. Prioritize working admin tasks over promotional copy and explanatory clutter. Visual editing should feel direct and familiar, taking workflow inspiration from Shopify and Wix without claiming integration with either.

## Evidence on Hand

- Existing storefront, catalog, and brand assets in this repository.
- Admin requirements supplied in `/Users/talisman/Downloads/ecommerce_admin_portal_requirements.pdf`.
- Shared UI reference: `docs/design-system.md` and `/admin/design-system`.
- Visual editor behavior and limitations: `docs/visual-content-editor.md`.
- Typed prototype models, permission checks, validation, and tests under `lib/admin/`.

Sample revenue, order, and payment figures are demonstration data, not verified business results.

## Product Principles

1. Lead with the task and its next action.
2. Make website content editable where staff can see it.
3. Keep saving, restoring, and publishing distinct and explicit.
4. Preserve successfully saved data and referenced assets on failure.
5. Share storefront presentation and reusable UI instead of duplicating them.

## Accessibility & Inclusion

Support keyboard navigation, visible focus, labeled fields, understandable validation, reduced motion, light and dark themes, mobile forms, and horizontally scrollable tables. Maintain WCAG AA text contrast and the project's accessibility audit target of at least 0.98.
