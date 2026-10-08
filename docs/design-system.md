# RINAZ shared design system

The public storefront and admin workspace share `app/globals.css` and ShadCN's
New York primitives in `components/ui`. The interactive reference is
`/admin/design-system`.

## Foundations

- Montserrat: navigation, body, labels, forms, tables. Default text 14–16px.
- Cinzel: page/section headings, 24–40px in the admin, regular weight.
- Geist Mono: code only, loaded on use.
- Semantic colors: background/foreground, card/card-foreground,
  secondary/secondary-foreground, muted/muted-foreground, border, input, ring.
  Cream and gold communicate the brand. Gold is an accent, not small body text
  on white. Use explicit text labels as well as color for statuses.
- Use the existing light and dark tokens. Add text/surface contrast assertions
  to `app/palette.test.ts` when introducing a new text token pair.
- Spacing rhythm: 4/8/12/16/24/32/40px. Base radius: 0.625rem.
- Minimum interactive target: 24px, normally 32–40px. Maintain visible focus,
  labeled fields, reduced-motion support, and horizontal table scrolling.

## Shared patterns

`components/admin/shared.tsx` provides PageHeading, Field, SelectField,
EmptyState, Confirm, AdminImage, and MediaPicker. Reuse these and ShadCN Button,
Input, Textarea, Table, Checkbox, Sheet, Dialog, Badge, and Accordion.

One primary action per workflow. Outline actions are secondary; ghost actions
are low emphasis. Confirm destructive changes. Preserve the last successfully
saved data on errors. Tables communicate operational data without extra nested
cards. Mobile navigation uses a Sheet; desktop sidebar can collapse.

The campaign Hero accepts slide data and an optional image renderer so the same
carousel supports optimized remote imagery and browser-local preview uploads.
ProductCardDetails is shared between public and demo product cards.

## Prototype data and extension points

`lib/admin/model.ts` defines versioned structured data and permission rules.
`DemoRepository` in `lib/admin/repository.ts` owns persistence. Structured data
uses `rinaz-admin-v1` in localStorage; image blobs use `rinaz-admin-media` in
IndexedDB. Prices remain integer minor-unit strings, formatted with formatMoney.

The CMS editor includes a live preview of unsaved content, sent to the preview
frame through same-origin messages in browser memory. The frame validates the
message shape and parent window, and follows the edited section, campaign, or page.
This preview does not write to storage or update the published snapshot.

Save draft updates local data; Publish to demo replaces the published preview snapshot.
Owners publish content and catalog. Editors publish content only; references to
unpublished catalog items fail validation until the Owner publishes those items.
Uploaded images are not embedded in JSON exports. Imports on another browser can
show missing-image placeholders. Browser data is not synchronized across devices.

The four roles simulate UI access. No credentials, real invitations, or protected
administration exist yet. Never enter real customer or payment information here.
The dashboard's business figures are sample data; catalog figures are calculated
from the local draft. All commerce/payment/notification operations remain planned.

Future production work replaces the repository adapter, enforces authorization
on the server, adds durable object storage, and connects live commerce services.
Do not put provider secrets or real credentials into the browser-local model.
