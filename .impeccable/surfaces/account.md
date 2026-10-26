# Customer account access

Mode: Operate. Scope: /account, /account/login, customer AuthForm. Staff login remains unchanged.

## Direction contract

THESIS: Replace the signed-out placeholder dashboard with direct access to the existing email/password flow. Follow the supplied split-image/form examples, not a new visual identity.

OWN-WORLD: Existing RINAZ theme tokens, Cinzel display headings, Montserrat controls, flat surfaces, restrained rules. Keep global chrome unchanged.

STORY: A returning shopper signs in; a new shopper switches to account creation. Signed-in shoppers see real identity information and honest unavailable order/address states.

FIRST VIEWPORT: Guest desktop has campaign photograph left and bounded form right. Mobile prioritizes the form. Signed-in desktop follows the supplied ASOS composition: identity and grouped navigation left, separate content panels right. Mobile compacts navigation above content and moves support/sign-out below it.

FORM: User-provided split-form reference (PDF page 3, first row, middle) plus subsequently pinned ASOS account reference. No concept seed: supplied references pin composition. ShadCN Card, Button, Input, and Label; familiar mode switch and password visibility control, no decorative entrance animation.

FINISH: Review the implemented account states and record the result in `docs/account-design.md`. This ordinary extension inherits `docs/design-system.md` and `app/globals.css`; it does not establish a new global DESIGN.md or token sidecar. Preserve provenance for shipping raster assets; review captures are evidence, not shipping assets.

Constraints: No new backend claims, social login, recovery flow, fabricated orders, or address writes. Reuse existing campaign asset and authentication calls. Preserve plain account anchors and Suspense boundary.

## Implemented record

See `docs/account-design.md` for implemented composition, behavior, review evidence, and remaining limits. The desktop split image disappears below the large breakpoint. Signed-in navigation becomes three columns on mobile; help and sign-out follow the content. Profile details are read-only session data. Order history and saved addresses remain explicitly unavailable.
