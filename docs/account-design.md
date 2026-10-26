# Customer account surface

This is an extension of the RINAZ visual system in `docs/design-system.md` and
`app/globals.css`, not a new identity. It reuses Cinzel headings, Montserrat body
and controls, semantic light/dark colors, ShadCN primitives, and existing
storefront chrome. No global tokens, fonts, or dependencies were introduced.

## Layout and presentation

`AccountAccess` gives `/account/login` and signed-out `/account` the same access
surface. At the large breakpoint, the existing campaign photograph occupies the
left half and a form bounded to 24rem occupies the right. Below that breakpoint,
the photograph is hidden and the form leads. Page headings are 30px, increasing to
36px on wider screens; form labels and supporting copy are 14px. Customer inputs
are 48px high with square corners; the primary action uses foreground/background
tokens. The photograph's dark caption overlay remains local to this composition.

`AccountWorkspace` follows the pinned ASOS composition using the existing ShadCN
Card and Button components: real identity and grouped navigation on the left,
separate content panels on the right. The sidebar is 260px from the medium
breakpoint and 280px from the large breakpoint. Cards retain the shared corner
and border treatment with shadows removed. Mobile presents identity, three-column
section navigation, content, then support and sign-out.

## Implemented behavior

The customer form switches between sign-in and account creation, resets errors
and password visibility on mode changes, and reuses the existing authentication
client. Fields retain labels, autocomplete, browser validation, pending states,
and announced errors. Password visibility has an explicit accessible name and
pressed state. Staff sign-in retains its separate mode and access check.

Signed-in customers can switch Orders, Profile, and Addresses without navigation.
Profile shows session name and email read-only. Order history, tracking, saved
addresses, and profile editing are explicitly unavailable. Sign-out has a pending
state and retryable error. The unconfigured `/account` state shows an availability
message. Request-time session access remains inside the account Suspense boundary.

## Review evidence and limits

The finish review accepted the surface. Captures in `.impeccable/review/account/`
record desktop and mobile sign-in, mobile signup, desktop orders and profile,
mobile orders, and narrow mobile with enlarged text. These are review evidence;
the campaign image remains the reused external asset in `AccountAccess`.

Existing-account sign-in and profile display were checked in the browser during
implementation. Account creation was not submitted. The supplied enlarged-text
capture records the scoped form reflow fix; an unrelated global-header overflow
remains outside this change. Captures do not establish complete dark/light,
keyboard, or assistive-technology coverage.

`PRODUCT.md` and the prototype sections of `docs/design-system.md` contain older
backend/persistence descriptions. This surface does not update or canonize that
global context drift. No new global DESIGN.md or sidecar is needed for the
inherited account design.
