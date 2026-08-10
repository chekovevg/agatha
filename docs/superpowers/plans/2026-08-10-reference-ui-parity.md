# Reference UI Parity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to execute this plan.

**Goal:** Bring the booking tab menu, regular-page footer rhythm, Classes disclosure, and Cal.com booking loading/fallback behavior into parity with the approved Microsoft AI reference on desktop and mobile, then represent the same contract in Figma.

**Architecture:** Keep the existing Next.js 16 structure and content model. Add client-side behavior only where measurement or interaction requires it: `TabMenu` measures its own viewport, `ClassesMenu` owns disclosure state, and `CalBookingEmbed` owns the embed lifecycle. Styling stays in the existing design layer and Figma receives a small isolated Agatha token set plus responsive component variants; the unrelated legacy `pathway` collection remains untouched.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4/global CSS, Vitest, Playwright, Figma MCP/plugin API.

## Global Constraints

- Work only in `codex/reference-ui-parity`, based on `main`; do not modify or clean the dirty `codex/home-score-experience` worktree.
- Do not add dependencies, introduce a custom calendar, change environment variables, commit, push, deploy, or alter production settings.
- Preserve the public component APIs and marketing content separation unless the approved behavior requires a narrowly scoped addition.
- Follow red-green-refactor for each independently testable behavior and run rendered browser checks for UI claims.
- Keep code and Figma semantics aligned: identical states, breakpoints, labels, dimensions, and responsive behavior.
- Preserve keyboard navigation, focus visibility, reduced-motion behavior, and page-level horizontal containment.

### Task 1: Rebuild `TabMenu` as a responsive measured component

**Files:**

- Create: `components/ui/tab-menu-scroll.ts`
- Modify: `components/ui/TabMenu.tsx`
- Modify: `app/globals.css`
- Create: `tests/tab-menu.test.ts`
- Modify: `tests/e2e/site-smoke.spec.ts`

**Steps:**

1. Write unit tests for the pure nearest-scroll calculation: fully visible item keeps the current position, left-clipped item aligns to the viewport start, and right-clipped item aligns to the viewport end.
2. Run `npm.cmd test -- tests/tab-menu.test.ts` and confirm the missing helper fails for the expected reason.
3. Implement the smallest typed scroll helper and rerun the focused unit test.
4. Add Playwright assertions for the two-item mobile booking tabs at 390 px and a deliberately narrow overflow case: the active item becomes visible, only the tab viewport scrolls, and the document does not overflow horizontally.
5. Run the focused Playwright spec against the current build and observe the reference-parity failure.
6. Convert `TabMenu` to a client component with viewport/row/active refs, `ResizeObserver`, an overflow state, and reduced-motion-aware active-item scrolling.
7. Replace the fixed 366 px shell with content-sized desktop geometry and the approved compact/overflow mobile geometry. Add `--tab-surface: #f7f1e4` and component variables in `app/globals.css`.
8. Rerun unit and focused browser tests; inspect 1440 px and 390 px screenshots.

### Task 2: Correct regular-page footer link rhythm

**Files:**

- Modify: `app/globals.css`
- Modify: `tests/e2e/site-smoke.spec.ts`

**Steps:**

1. Add a browser regression test at 390 px that compares consecutive link top positions to the computed line-height and verifies the separate footer groups retain their spacing.
2. Add a desktop assertion that the existing 16 px link-list gap remains unchanged.
3. Run the focused test and confirm the current mobile 16 px gap fails.
4. At `max-width: 1080px`, set `.ag-footer-link-list` to `gap: 0` while preserving typography line-height and the 48 px group separation.
5. Rerun the focused test and inspect regular page footers on `/`, `/classes`, and `/media` at mobile width.

### Task 3: Add the reference-style Classes disclosure

**Files:**

- Modify: `components/layout/ClassesMenu.tsx`
- Modify: `components/layout/Header.tsx`
- Modify: `app/globals.css`
- Modify: `tests/site-structure.test.ts`
- Modify: `tests/e2e/site-smoke.spec.ts`

**Steps:**

1. Add static markup tests proving that `Classes` remains an `/classes` link, the disclosure is a separate button with `aria-label`, `aria-expanded`, and `aria-controls`, and both desktop and mobile controlled panels exist.
2. Add Playwright tests for desktop hover/focus/click behavior, mobile collapsed/expanded normal-flow rows, navigation links, Escape focus restoration, and reset when the full header menu closes.
3. Run the focused unit/browser tests and observe the existing implementation fail the new contract.
4. Split the trigger row into the navigation link and responsive disclosure buttons. Keep the existing 698 px desktop flyout and preview card.
5. Add the mobile accordion containing the five lesson links and `All Classes`, using approximately 51.6 px rows and no preview card.
6. Reset disclosure state when the mobile header transitions from open to closed; make Escape close the disclosure and restore focus to the active responsive button.
7. Add responsive CSS for the chevron, 44 px hit targets, accordion motion, and reduced-motion fallback.
8. Rerun tests and inspect desktop and 390 px interaction states with keyboard and pointer.

### Task 4: Make Cal.com loading explicit and retain a direct booking path

**Files:**

- Create: `components/analytics/cal-booking-status.ts`
- Modify: `components/analytics/CalBookingEmbed.tsx`
- Modify: `components/sections/BookingSection.tsx`
- Create: `tests/cal-booking-status.test.ts`
- Modify: `tests/site-structure.test.ts`

**Steps:**

1. Add reducer tests for `loading`, the 8-second `slow` state, `bookerReady`, and `linkFailed`, including protection against stale terminal transitions.
2. Change the booking-section static test to require an external `ButtonLink` labelled `Open booking page in Cal.com` with the exact resolved Cal URL and booking notes.
3. Run both focused tests and observe their expected failures.
4. Implement the small status reducer and wire `CalBookingEmbed` to `linkReady`, `bookerReady`, `linkFailed`, and the existing `bookingSuccessfulV2` event. Guard timeouts and callbacks after cleanup.
5. Render an accessible loading status, a slow-loading explanation after 8 seconds, and a failure explanation; remove the status shell when the booker is ready.
6. Always render the existing plain `ButtonLink` below a valid embed, using the same resolved URL; preserve the contact fallback when no Cal URL is available.
7. Rerun focused tests, typecheck, and a rendered `/book` check. Where external Cal availability permits, record cold-cache mobile timing without treating a third-party network failure as application success.

### Task 5: Integrate and verify the rendered implementation

**Files:**

- Modify only files already listed if browser evidence reveals an in-scope defect.

**Steps:**

1. Run `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd test`, and `npm.cmd run build`.
2. Run the relevant Playwright filters, then the complete `npm.cmd run e2e:run` suite when the focused checks are green.
3. Capture and inspect desktop and mobile states for the tab menu, regular footer, Classes disclosure, and booking page.
4. Check focus, Escape, target sizes, `aria-expanded`, `aria-controls`, reduced motion, and absence of document horizontal overflow.
5. Review `git diff --check`, the full scoped diff, and working-tree status; do not commit.

### Task 6: Create the minimal Agatha Figma foundations

**Target:** Figma file `314E0PxdPGZBO124xOAELq`, section `2071:3025`.

**Steps:**

1. Post the required Phase 1 checklist and create/update the design-system state ledger outside the repository.
2. Create small primitive and semantic Agatha variable collections only for colors, spacing, sizes, radii, and motion used by the four approved patterns.
3. Set explicit variable scopes and code syntax matching real CSS custom properties; use aliases for semantic variables.
4. Leave the broad legacy `pathway` collection and existing typography roles unchanged.
5. Validate variable metadata and aliases, then post the Phase 1 summary.

### Task 7: Document the responsive behavior in the existing Figma shelf

**Steps:**

1. Post the Phase 2 checklist for the user-approved scoped documentation area inside the existing Agatha component shelf.
2. Add concise usage/state notes for TabMenu overflow, footer mobile rhythm, Classes desktop/mobile disclosure, and Cal loading/failure/direct-link states.
3. Document accessibility and responsive rules next to the relevant examples rather than creating unrelated design-system pages.
4. Validate hierarchy and screenshots, then post the Phase 2 summary.

### Task 8: Update the Figma components sequentially

**Steps:**

1. Post the Phase 3 checklist and search the subscribed library before each component update; reuse only compatible assets.
2. Update `tabMenu` (`2071:3267`) to Desktop, Mobile First Active, Mobile Second Active, and a documented four-item overflow example using responsive auto layout.
3. Update the existing mobile footer example so link rhythm matches line-height while desktop remains unchanged.
4. Extend the header/menu examples with desktop Classes closed/open and mobile menu collapsed/expanded states, reusing `menuSection` (`2071:3245`) and `menuItem` (`2071:3204`).
5. Add booking loading, slow/failure, and direct-link documentation/examples consistent with the code.
6. After each logical component group, read metadata and capture a screenshot before proceeding.
7. Add Code Connect only where the repository/component mapping is exact and the available Figma tooling supports it; otherwise record the precise limitation without inventing a mapping.
8. Post the Phase 3 summary with created/updated node IDs and remaining risks.

### Task 9: Final code ↔ Figma proof and handoff

**Steps:**

1. Post the Phase 4 checklist and compare final rendered screenshots against the corresponding Figma states and the approved live-reference contract.
2. Verify component names, properties, variables, accessibility notes, and responsive variants are consistent between code and Figma.
3. Run final code checks if any implementation changed during visual tuning.
4. Perform a focused self-review of the integrated diff and Figma state ledger.
5. Post the Phase 4 summary and report changed files, checks, limitations/risks, confidence from 1–10, and the recommended next integration step. Do not commit, push, or merge.
