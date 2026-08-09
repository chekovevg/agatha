# Responsive Red Hat Mono Typography Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every reference-equivalent Red Hat Mono role in Figma and production follow the approved `1728+` base values and the `microsoft.ai` responsive scale.

**Architecture:** Keep the existing `--unit-fx-type` breakpoint engine and place semantic role sizes in `app/globals.css`. Components consume role classes instead of local size and weight utilities. Figma stores static `1728+` values and a visible responsive annotation; browser tests verify computed production values across the requested viewport matrix.

**Tech Stack:** Figma MCP, Next.js 16, React 19, Tailwind CSS 4, CSS custom properties, Playwright, Vitest.

## Global Constraints

- Figma values are the static base for `1728px` and above; responsive interpolation exists only in code.
- Do not change Newsreader, EB Garamond, Display Italic, component geometry, content, or behavior.
- Do not add dependencies.
- Preserve user-authored favicon changes and exclude them from typography edits and review.
- Do not commit, push, or deploy until the combined favicon and typography result has been reviewed and the user explicitly asks for that final action.
- Follow `docs/superpowers/specs/2026-08-10-responsive-mono-typography-design.md` exactly.

---

### Task 1: Update the AG typography source in Figma

**Files:**
- External design: Figma file `314E0PxdPGZBO124xOAELq`, canvas `2057:2066`, group `AG`

**Interfaces:**
- Consumes: the approved role matrix in the design specification.
- Produces: Figma component text layers and text styles representing `Mono / UI`, `Mono / Header nav`, `Mono / Metanav title`, `Mono / Metanav description`, `Mono / Eyebrow`, `Mono / Footer`, and `Mono / Footer note`.

- [ ] **Step 1: Re-fetch the AG group before mutation**

Read the component group and screenshots again so any changes made since the audit are preserved. Record the current affected text nodes for Header, Classes menu, menu item, preview card, Button, class card, Link, and Footer.

- [ ] **Step 2: Apply the approved `1728+` role values**

Apply these exact values:

```text
Mono / UI                  16px  500  100%  -0.24px
Mono / Header nav          16px  500  100%  -0.24px
Mono / Metanav title       15px  500  100%  -0.24px
Mono / Metanav description 13px 500  160%  -0.24px
Mono / Eyebrow             16px  500  100%  +1.5px
Mono / Footer              15px  400  160%  +1.5px
Mono / Footer note         12px  400  125%  -0.24px
```

If shared text-style publishing is unavailable, apply the exact metrics to the component text layers and expose the same role names in the annotation.

- [ ] **Step 3: Add the responsive annotation**

Add this visible note in the AG typography area:

```text
Typography base: 1728px and above. Responsive values are defined in code.
```

Include the five scale ranges from the design spec below the note.

- [ ] **Step 4: Verify the updated Figma components**

Re-fetch screenshots of Header, Classes menu, Button, class card, Link, and Footer. Confirm that serif layers, geometry, content, and colors are unchanged.

---

### Task 2: Add the failing responsive typography browser contract

**Files:**
- Modify: `tests/e2e/site-smoke.spec.ts`

**Interfaces:**
- Consumes: visible role classes produced by Tasks 3 and 4.
- Produces: an end-to-end test named `Red Hat Mono roles follow the reference responsive matrix`.

- [ ] **Step 1: Replace stale fixed typography assertions**

Replace the current `14px / 400 / -0.21px` and Classes-menu `16px / 14px` assertions with numeric computed-style assertions. Use this exact fixture:

```ts
const monoTypographyCases = [
  {width: 390, ui: 12, headerNav: 16, metaTitle: 14.55, metaDescription: 12.61, footer: 12, footerNote: 11.64},
  {width: 768, ui: 12.7, headerNav: 12.7, metaTitle: 12, metaDescription: 10.32, footer: 11.91, footerNote: 9.52},
  {width: 1280, ui: 14.22, headerNav: 14.22, metaTitle: 13.33, metaDescription: 11.56, footer: 13.33, footerNote: 10.67},
  {width: 1440, ui: 14.22, headerNav: 14.22, metaTitle: 13.33, metaDescription: 11.56, footer: 13.33, footerNote: 10.67},
  {width: 1536, ui: 14.22, headerNav: 14.22, metaTitle: 13.33, metaDescription: 11.56, footer: 13.33, footerNote: 10.67},
  {width: 1600, ui: 14.81, headerNav: 14.81, metaTitle: 13.89, metaDescription: 12.04, footer: 13.89, footerNote: 11.11},
  {width: 1728, ui: 16, headerNav: 16, metaTitle: 15, metaDescription: 13, footer: 15, footerNote: 12},
  {width: 1920, ui: 16, headerNav: 16, metaTitle: 15, metaDescription: 13, footer: 15, footerNote: 12},
] as const;
```

Assert font sizes with `toBeCloseTo(expected, 1)`. Assert UI/metanav `font-weight: 500`, footer `font-weight: 400`, role-specific line-height ratios, and exact tracking values. At widths `<=860`, open the mobile navigation and do not expect the desktop Classes submenu to render.

- [ ] **Step 2: Run the focused test and observe the expected failure**

Run:

```powershell
npm.cmd run build
npx.cmd playwright test tests/e2e/site-smoke.spec.ts --grep "Red Hat Mono roles"
```

Expected: FAIL because production still resolves `.mai-ui` to fixed `14px / 400`, footer to fixed `14px`, and Classes metanav to local `16px / 14px`.

---

### Task 3: Define the semantic responsive tokens

**Files:**
- Modify: `app/globals.css`

**Interfaces:**
- Produces CSS classes: `.mai-ui`, `.mai-header-nav`, `.mai-metanav-title`, `.mai-metanav-description`, `.mai-eyebrow`.
- Produces variables used by footer selectors: `--mai-footer-size`, `--mai-footer-note-size`, `--mai-footer-tracking`.

- [ ] **Step 1: Define role variables in `:root`**

Add the exact rules below next to the existing typography variables:

```css
--mai-ui-size: max(10px, calc(16 * var(--unit-fx-type)));
--mai-ui-tracking: -0.24px;
--mai-metanav-title-size: max(12px, calc(15 * var(--unit-fx-type)));
--mai-metanav-description-size: max(10px, calc(13 * var(--unit-fx-type)));
--mai-eyebrow-tracking: 1.5px;
--mai-footer-size: max(10px, calc(15 * var(--unit-fx-type)));
--mai-footer-tracking: 1.5px;
--mai-footer-note-size: calc(12 * var(--unit-fx-type));
```

In the existing `<=600px` root media block set:

```css
--mai-ui-size: 12px;
--mai-eyebrow-tracking: 1.2px;
--mai-footer-size: 12px;
--mai-footer-tracking: 0px;
```

- [ ] **Step 2: Define the role classes**

Set `.mai-ui` to Red Hat Mono `500 / 1 / -0.24px`. Add the header, metanav, and eyebrow classes with the exact metrics from the spec. The mobile header override belongs in `@media (width <= 600px)` and sets `.mai-header-nav { font-size: 16px; line-height: 1.8; }`.

- [ ] **Step 3: Map footer selectors to footer variables**

Use `--mai-footer-size` for footer link lists and copyright, with `400 / 1.6 / var(--mai-footer-tracking)`. Use `--mai-footer-note-size` with `400 / 1.25 / -0.24px`. Remove the fixed `14px` overrides from the `<=1080px` block while retaining its layout-only rules.

---

### Task 4: Map components to semantic roles

**Files:**
- Modify: `components/layout/Header.tsx`
- Modify: `components/layout/ClassesMenu.tsx`
- Modify: `components/pages/ClassesPage.tsx`
- Modify: `components/ui/SectionHeader.tsx`
- Modify only if it contains a local mono override: `components/pages/AboutPage.tsx`
- Modify only if it contains a local mono override: `components/analytics/AnalyticsManager.tsx`

**Interfaces:**
- Consumes: CSS classes created in Task 3.
- Produces: reference-equivalent role usage without changing DOM semantics or component behavior.

- [ ] **Step 1: Map Header and its mobile footer links**

Use `mai-header-nav` on the primary header navigation. Keep booking actions on `mai-ui`. Use the footer role for the secondary footer/social links shown inside the mobile overlay instead of fixed `text-[14px]`.

- [ ] **Step 2: Remove Classes-menu hardcodes**

Use `mai-metanav-title` for `What I teach` and the preview title, `mai-metanav-description` for both descriptions, and `mai-ui` for lesson rows and `All Classes`. Remove local `font-mono`, `text-[16px]`, `text-[14px]`, `font-normal`, line-height, and tracking utilities replaced by those roles.

- [ ] **Step 3: Map eyebrows and remaining local mono overrides**

Replace `mai-ui` plus tracking utilities with `mai-eyebrow` in class cards and `SectionHeader`. Remove `tracking-[-0.21px]` and `text-[15px]` overrides from other `mai-ui` consumers so each semantic role has one source.

- [ ] **Step 4: Audit the completed mapping**

Run:

```powershell
rg -n "font-mono text-|font-ui text-\[14px\]|mai-ui.*tracking-\[-0\.21px\]|mai-ui.*text-\[15px\]" app components
```

Expected: no typography hardcodes that override these Red Hat Mono roles. Any remaining match must be documented as a different explicit role before proceeding.

---

### Task 5: Verify the integrated typography change

**Files:**
- Verify: `app/globals.css`
- Verify: `components/layout/Header.tsx`
- Verify: `components/layout/ClassesMenu.tsx`
- Verify: `components/pages/ClassesPage.tsx`
- Verify: `components/ui/SectionHeader.tsx`
- Verify: `tests/e2e/site-smoke.spec.ts`

**Interfaces:**
- Consumes: the completed Figma and code mappings.
- Produces: an evidence-backed handoff ready to combine with the user's favicon change.

- [ ] **Step 1: Run the focused browser contract**

```powershell
npm.cmd run build
npx.cmd playwright test tests/e2e/site-smoke.spec.ts --grep "Red Hat Mono roles"
```

Expected: PASS at all eight viewport widths.

- [ ] **Step 2: Run project checks**

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd test
npm.cmd run build
npm.cmd run e2e:run
```

Expected: all commands pass.

- [ ] **Step 3: Perform rendered visual QA**

Inspect `/`, `/classes`, and the open Classes submenu at `390`, `768`, `1280`, `1440`, `1536`, `1600`, `1728`, and `1920`. Capture useful comparison screenshots at `390`, `1440`, and `1728`. Confirm focus visibility, hover states, wrapping, clipping, and vertical centering remain correct.

- [ ] **Step 4: Review only the typography diff**

Use path-limited Git diffs for the files listed above. Report favicon files separately as user-authored changes. Do not stage, commit, push, or deploy until the user asks after reviewing the combined result.
