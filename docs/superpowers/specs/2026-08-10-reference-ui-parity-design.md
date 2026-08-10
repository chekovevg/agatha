# Microsoft AI reference parity for responsive navigation and booking

## Status

Written design checkpoint. Implementation in code and Figma begins only after
this document is approved.

## Goal

Bring four visible areas of Agatha Music into behavioral alignment with the
live Microsoft AI reference while preserving Agatha's content, visual palette,
typography system, Cal.com ownership of booking, and the current Next.js
architecture:

1. Make `TabMenu` content-sized on desktop and compact when its items fit on
   mobile, with the same edge-to-edge horizontal overflow behavior as the
   reference when the items do not fit.
2. Remove the unintended extra vertical gap between links in the regular page
   footer on stacked/mobile layouts.
3. Give `Classes` a separate chevron trigger and a real mobile accordion while
   retaining the existing desktop flyout.
4. Make a slow or failed Cal.com embed understandable and recoverable, with a
   direct Cal.com link available immediately below the embed.

Code and Figma must describe the same states and behavior. The work does not
include deployment or changes to Cal.com configuration.

## Sources of truth and precedence

1. **Interaction and responsive behavior:** the rendered live
   `microsoft.ai` reference, measured at desktop and mobile viewports.
2. **Agatha content and destinations:** the typed content catalog and booking
   helpers in production code.
3. **Agatha visual language:** the existing color, typography, shadow, and
   motion tokens in `app/globals.css` and the approved Red Hat Mono typography
   specification.
4. **Figma editing target:** file `314E0PxdPGZBO124xOAELq`, component shelf
   section `2071:3025`.

When the current code and current Figma component both differ from the live
reference, the live reference wins for layout and interaction. Existing Agatha
content, colors, and fonts are not replaced by Microsoft branding.

## Branch and integration strategy

- Work is isolated in `codex/reference-ui-parity`, created from `main` at
  `13eacc6` in a dedicated worktree.
- The dirty `codex/home-score-experience` checkout is not used or modified.
- The separate typography task remains independent. Before this branch is
  considered ready for integration, it will be compared with the then-current
  `main`, and any newer approved typography changes will be integrated and
  re-verified.
- No commit, push, pull request, merge, or deployment is part of this task
  unless separately requested.

## Phase 0 evidence and gap analysis

### Current Figma state

The supplied section contains the relevant local component sets:

- `header`: `2071:3026` (`type=desktop` and `type=mobile`)
- `footer`: `2071:3127` (`type=desktop` and `type=mobile`)
- `tabMenu`: `2071:3267`, with two active-item variants
- `menuSection`: `2071:3245`, using the existing desktop lesson flyout
- `menuItem`: `2071:3204`

The current Figma `tabMenu` is the same fixed design as the current code:

- width `366px`
- padding `12px`
- tab height `38px`
- horizontal tab padding `30px`
- no mobile overflow state

The current Figma mobile footer also uses `16px` between link rows. The current
header has only closed desktop/mobile variants and no Classes chevron or
expanded mobile Classes state.

The file has one broad legacy variable collection named `pathway`. Its local
variables use `ALL_SCOPES` and have no code syntax. It is unrelated to the
Agatha component shelf and will not be repaired or repurposed in this task.

The only library subscribed to the file is the existing `icons` library.
Searches for tabs and accordion/chevron components found generic third-party
systems whose property APIs, tokens, and visual language do not match Agatha.
The correct reuse choice is therefore: update Agatha's local components, reuse
the existing icon library where it contains the required chevron, and do not
import a foreign tabs or accordion component.

### Code-to-Figma gaps

| Area | Current code | Current Figma | Required resolution |
| --- | --- | --- | --- |
| Tab Menu | Fixed `366px`, no overflow measurement | Same fixed geometry | Replace both with content-sized desktop/fit-mobile behavior plus measured mobile overflow |
| Footer | Link line height plus `16px` list gap | Same `16px` gap | Set stacked/mobile link-list gap to zero; preserve group spacing |
| Classes | Desktop flyout exists; mobile submenu is hidden; link itself owns `aria-expanded` | Desktop menu section exists; no chevron/accordion states | Separate link and button; add mobile accordion and matching Figma states |
| Booking | Immediate third-party embed with no ready/fail UI; direct link absent when URL exists | No loading/recovery state | Add event-driven status and a persistent direct Cal.com link |

### Figma foundations for this scope

Before modifying component variants, create a small, isolated Agatha component
token collection with one mode named `Default`. Only tokens used by the touched
components are included. Each variable receives explicit scopes and WEB code
syntax based on production CSS. At minimum it covers:

- `color/background` → `var(--background)` / `#FEF9EE`
- `color/ink` → `var(--ink)` / `#5C524C`
- `color/row-soft` → `var(--hover-paper)` / `#FBF0DC`
- `color/tab-surface` → `var(--tab-surface)` / `#F7F1E4`
- component spacing and radii used by the Tab Menu and Classes rows, with
  `GAP`, `WIDTH_HEIGHT`, or `CORNER_RADIUS` scopes as appropriate

The code gains `--tab-surface` so the Figma variable and implementation have a
real shared name. Existing semantic Red Hat Mono text styles and approved
responsive type formulas remain authoritative; this task does not create a
parallel typography system. The unrelated `pathway` collection is left
untouched.

## Tab Menu contract

### Public API and semantics

Keep the existing `ariaLabel` and `items` API. Each item remains a real anchor
because selecting a booking type changes the URL. The active item keeps
`aria-current="page"`; the wrapping element remains a labelled navigation
landmark. Focus rings remain visible.

The component becomes client-side only for two real interaction needs:

- detect whether the item row overflows its viewport;
- bring the active item into view after mount, route change, resize, or content
  change.

Overflow detection uses `ResizeObserver` on the viewport and item row. The
component records the result with `data-overflow="true|false"`. When overflow
is unavailable or cannot be measured, the safe fallback is a centered,
content-sized menu constrained to the available width.

### Desktop behavior

At reference desktop widths the shell hugs its item row instead of using a
hardcoded width. The measured `1440px` reference snapshot is the visual QA
target:

- shell padding: approximately `10px`
- shell height: approximately `59.22px`
- item height: approximately `39.22px`
- item horizontal padding: approximately `25px`
- Red Hat Mono UI text: approximately `14.22px`, weight `500`
- active item uses Agatha background; inactive items expose the tab surface
- the complete shell retains rounded corners

These values are outputs of the existing responsive unit/type system, not a
new independent breakpoint scale.

### Mobile behavior when items fit

For the current two booking tabs at `390px`, the shell hugs the labels and is
centered. It must not stretch to the old `366px` width merely because space is
available. Both outer corners remain rounded.

### Mobile behavior when items overflow

The measured `390px` reference snapshot is the QA target:

- viewport starts approximately `19.4px` from the left edge
- viewport width is approximately `370.6px` and ends at the right edge
- shell height is approximately `54.66px`
- shell padding is approximately `11.64px`
- item height is approximately `31.38px`
- item horizontal padding is approximately `19.4px`
- Red Hat Mono UI text is `12px`, weight `500`
- the item row scrolls horizontally; the page itself does not overflow
- the right edge is clipped/flush while the left edge preserves the reference
  inset
- selecting or initially loading a later active tab scrolls only the tab
  viewport enough to reveal it; the document does not jump and no hash is
  introduced

Use reduced or instant scroll behavior when the user prefers reduced motion.
Hide the native scrollbar visually without removing touch, trackpad, wheel,
or keyboard scrolling.

### Figma representation

Update the existing `tabMenu` component set rather than creating a competing
component. It will contain four production variants:

- `Viewport=Desktop, Active=First`
- `Viewport=Desktop, Active=Second`
- `Viewport=Mobile, Active=First`
- `Viewport=Mobile, Active=Second`

Desktop and fit-mobile variants use Auto Layout with horizontal hug sizing.
Add a documented mobile overflow demonstration next to the component set with
four tab items, clipped horizontal overflow, and start/end prototype states.
The demo exists to explain behavior for arbitrary item counts without inflating
the production booking variant matrix. Add an annotation containing the
measured `1440px` and `390px` reference values above and a note that responsive
type interpolation is owned by code.

## Footer contract

This change applies to the regular page footer, not the footer links inside the
open mobile header menu.

- At the stacked footer breakpoint (`<=1080px`), `.ag-footer-link-list` has
  `gap: 0`.
- Link rhythm comes only from the existing `1.6` line height. At `390px`, the
  expected top-to-top distance is approximately `19.2px` for `12px` text.
- The `48px` spacing between the site, contact, and legal groups is preserved.
- Desktop footer grouping and the current `16px` desktop row gap remain
  unchanged because the reported/reference discrepancy is the stacked/mobile
  footer.
- The mobile Figma footer variant is updated to the same zero-gap link stacks;
  the desktop Figma variant is unchanged.

## Classes dropdown and accordion contract

### Shared trigger semantics

`Classes` remains a normal link to `/classes`. A separate adjacent button owns
submenu disclosure state:

- `aria-label="Classes menu"`
- `aria-expanded="true|false"`
- `aria-controls` points to the relevant submenu panel
- the chevron is decorative inside the labelled button and rotates when open

The visual chevron follows the reference. The interactive target remains at
least `44×44px` even where the visible button/icon geometry is smaller.

### Desktop

- Hovering or focusing the Classes row opens the existing `698px` lesson
  flyout and preserves the current center-origin clip/opacity motion.
- Clicking the disclosure button toggles the flyout without navigating.
- Clicking the `Classes` text still navigates to `/classes`.
- The current lesson image, title, description, and `All Classes` content are
  reused from the typed lesson catalog.
- Moving focus outside, leaving the complete trigger/panel region, pressing
  Escape, or navigating closes the flyout. Escape returns focus to the
  disclosure button.

### Mobile

- The open full-screen header shows one Classes row with the `/classes` link on
  the left and the visible chevron button on the right.
- The button expands a submenu in normal document flow; no desktop preview card
  is rendered on mobile.
- The expanded panel contains the five lesson links in catalog order followed
  by `All Classes`. Lesson destinations remain the existing typed lesson
  booking URLs.
- Rows are approximately `51.6px` high, matching the reference rhythm, and are
  fully tappable.
- The panel animates `max-height`/clip and opacity with the existing reference
  easing. Reduced-motion mode removes the transition.
- Escape closes the accordion and returns focus to the disclosure button.
  Closing the full mobile header also resets the accordion so the next opening
  starts collapsed.

### Figma representation

Extend the existing header and menu assets rather than duplicating the desktop
flyout:

- add desktop Classes closed/open header states using the existing
  `menuSection` instance;
- add mobile menu open / Classes collapsed and mobile menu open / Classes
  expanded states;
- expose a visible chevron disclosure button in the mobile states;
- connect collapsed/expanded states with `CHANGE_TO` prototype interactions;
- reuse the subscribed icon library chevron if its geometry matches the
  reference; otherwise use the exact editable SVG from the approved code icon,
  not reconstructed line primitives.

All new containers use Auto Layout and the scoped Agatha variables created for
this component work.

## Cal.com loading and recovery contract

The root cause of the long blank state is the official Cal.com inline embed's
third-party payload, not a slow local form. A prior production waterfall showed
roughly 83 Cal.com requests and about 70 JavaScript resources; on a fast
connection the visible booker appeared around `3.2–3.7s`, so slower mobile
connections can take substantially longer.

The first-stage solution keeps the inline embed loading immediately because
booking is a primary action, but makes progress and recovery explicit:

- server-render a visible loading shell before the Cal script hydrates;
- listen to official `linkReady`, `bookerReady`, and `linkFailed` events;
- remove the loading shell when `bookerReady` confirms the booker is usable;
- show a longer-than-usual message after `8s` without `bookerReady` while the
  embed continues loading;
- show a recoverable failure message on `linkFailed`;
- preserve the existing `bookingSuccessfulV2` analytics event;
- guard callbacks after unmount so route/tab changes cannot update stale UI.

Whenever a valid Cal URL exists, render the existing `ButtonLink` component
below the embed with variant `plain`, label `Open booking page in Cal.com`, and
the same resolved URL/notes as the embed. Because it is external, the existing
component opens it in a new tab with the appropriate relation automatically.
The link is present in server-rendered HTML and never waits for the embed.

If no Cal URL is configured, keep the existing `Booking link pending` contact
fallback. No custom calendar, Booker Atoms dependency, delayed click-to-load
flow, or change to Cal.com availability is introduced in this iteration.

The loading/failure states are documented beside the booking components in the
Figma component shelf, using the existing button/link component for the direct
fallback action.

## State and failure handling

- `ResizeObserver` callbacks are disconnected on unmount.
- Active-tab scrolling is limited to the Tab Menu viewport and uses `nearest`
  alignment.
- Classes submenu IDs are unique across desktop and mobile panels.
- Classes disclosure state is reset when the enclosing mobile menu closes.
- Cal event callbacks are ignored after cleanup; timeouts are cleared on ready,
  failure, or unmount.
- A Cal failure never removes the direct link.
- Unknown booking types and invalid lesson subjects keep their existing safe
  fallbacks.

## Verification and acceptance criteria

### Automated checks

- Unit/regression tests cover active Tab Menu semantics, footer structure and
  zero stacked/mobile gap, Classes disclosure labels/relationships, and the
  persistent external Cal link.
- Browser tests verify at `1440px` and `390px`:
  - two booking tabs are content-sized and centered when they fit;
  - a constrained/overflowing Tab Menu scrolls without page overflow and brings
    the active item into view;
  - the regular footer link top-to-top rhythm equals its computed line height;
  - desktop Classes hover/focus/click behavior and mobile accordion behavior;
  - Escape, focus return, visible focus rings, and reduced motion;
  - the direct Cal link is visible before the embed reports ready.
- Cal ready/fail behavior is tested with a stubbed event API rather than making
  the deterministic suite depend on Cal.com's network.
- Run `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd test`,
  `npm.cmd run build`, and the relevant Playwright suite.

### Rendered QA

- Capture desktop and mobile screenshots of the booking tabs, regular footer,
  desktop Classes flyout, mobile collapsed/expanded Classes accordion, and Cal
  loading/failure/direct-link states.
- Compare code screenshots with the updated Figma variants and the live
  reference measurements.
- Run a cold-cache mobile booking measurement against production and the local
  branch. Report time to `bookerReady`, request count, and the time at which the
  direct link becomes usable. The direct link must be usable from initial HTML;
  third-party request-count reduction is not claimed by this phase.

## Out of scope

- Cleaning or migrating the legacy Figma `pathway` variables.
- Importing a third-party design system for tabs or accordions.
- Changing Newsreader, EB Garamond, or the approved Red Hat Mono responsive
  engine.
- Cal.com Booker Atoms, a custom calendar, Cal.com account/event changes, or
  environment-secret changes.
- Home score/WebGL work from `codex/home-score-experience`.
- Deployment, production mutation, or repository publication.
