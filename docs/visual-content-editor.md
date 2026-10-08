# Visual content editing for RINAZ

A Shopify-style editor is feasible within the existing browser-local CMS. It can reuse the current content models, media picker, section ordering, role checks, and separate draft/published snapshots. No backend or authentication change is needed for this prototype.

## What is already working

The CMS sends its current unsaved content to a same-origin iframe. The homepage preview uses the same header, footer, carousel, category tiles, product cards, pairings, trust pillars, About, sanctuary, and newsletter presentation components as the storefront. Device presets create real CSS viewports: phone 390 × 844 and desktop 1440 × 900; rotation swaps those dimensions. Scaling the frame to fit the editor preserves its aspect ratio.

The public storefront remains unchanged by demo edits. Other catalog routes still have simpler demo layouts; those should share the full storefront presentation before claiming identical previews across every route.

## Implemented visual editor

1. Add an **Edit / Browse** toggle to the preview. In Edit mode, sections receive a subtle hover outline and a selected-section label. Clicking a section selects its existing settings form; Browse mode keeps the current preview interactions.
2. Allow dragging sections in the existing section list. Update `content.sections` in the CMS and let the existing draft message redraw the iframe. Keep the current Move up/down buttons for keyboard and phone users. Disabled sections stay available in the list even though hidden in the preview.
3. Allow direct text editing for clearly identified title and copy fields. Commit plain text into the same draft model, without importing HTML from the preview DOM. Image clicks open the existing media picker; CTA clicks open the label/destination fields. Maintain URL validation and image reference checks.
4. Add undo/redo for the editing session. Keep Save draft, Preview, and Publish to demo explicit; a direct edit must never publish automatically.

Keep each section's responsive layout fixed. The editor can reorder sections and change their content, images, CTAs, and featured products. Arbitrary pixel positioning or dragging every element independently would require a different content model and could break the phone layout. Hero images, trust columns, and product cards remain structured elements in this iteration.

## Implementation boundaries

`Cms` remains the source of truth for unsaved content. Extend the existing iframe message bridge with typed section-selection and field-edit events. Accept messages only from the expected same-origin frame; verify section IDs, permitted fields, value types, and the current role before changing the draft. Never accept executable markup or whole DOM fragments.

Selection overlays belong only to the preview, so public components retain their production layout and accessibility. Dragging first belongs in the outer section list, avoiding pointer-coordinate errors caused by the scaled iframe. Canvas drop targets can follow once that interaction is reliable.

Use the existing ShadCN controls and media picker. No dependency is required for section selection or field editing; choose drag tooling only when keyboard/touch behavior calls for it.

## Acceptance checks

An Editor can click a hero, change its title and image, reorder two sections, undo that move, save a draft, reload, and publish to the local demo. The result must stay correct in portrait and landscape. Operations cannot edit. Keyboard users can select and reorder sections, focus returns after media dialogs, unsaved navigation warns, and invalid URLs or unknown message IDs are rejected. Public storefront content and real commerce actions remain unaffected.

The visual editor is implemented in `/admin/cms`. Direct edits use ShadCN popovers anchored to the preview; text, campaign images, section imagery, and primary CTAs update the unsaved draft immediately. Clicking a section also selects its existing settings form. Dragging uses the composition list; the move buttons remain the keyboard and phone alternative. Undo/redo is available in the CMS toolbar and with Cmd/Ctrl+Z outside text inputs, including inside the preview. History lasts for the editing session and keeps the latest 50 edits; typing in one canvas field is grouped.

The full website remains a browser-local demo. This iteration edits homepage sections; page, navigation, FAQ, category, and product forms remain available in their existing modules. Arbitrary element positioning and canvas drop targets are not implemented.
