# Home Hero Audience Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Place the existing audience tabs directly under the Home H1, remove the duplicated hero lead/action, render the Rhine heading with the established H2 role, and show a pointer over the analytics acknowledgement button.

**Architecture:** Reuse `HomeAudienceTabs` unchanged and move its single instance inside the existing hero copy. Adjust only the existing Home spacing and typography selectors; do not add components, tokens, dependencies, or content fields.

**Tech Stack:** Next.js 16, React, TypeScript, Tailwind CSS 4, Vitest, Playwright.

## Global Constraints

- Preserve EB Garamond, Newsreader, and Red Hat Mono roles.
- Keep all existing audience tab keyboard and focus behavior.
- Use the existing responsive H2 variables for `From the Rhine, online`.
- Do not change Figma, dependencies, routes, or content.
- Do not commit, push, or deploy without a new explicit request.

---

### Task 1: Integrate the audience block into the Home hero

**Files:**
- Modify: `tests/home-hero.test.tsx`
- Modify: `tests/e2e/site-smoke.spec.ts`
- Modify: `tests/e2e/responsive-typography.spec.ts`
- Modify: `components/pages/HomePage.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: `HomeAudienceTabs({tabs})` and the existing Home spacing/H2 variables.
- Produces: one rendered audience block inside `.plain-home-hero`, followed by the Location section.

- [ ] **Step 1: Write failing rendered-contract tests**

Update the Home unit test to require one audience CTA and reject the old hero copy/action:

```ts
expect(html).not.toContain("For Adults and Children");
expect(html).not.toContain('data-analytics-booking-cta="home-hero"');
expect(html).not.toContain("Get in Touch");
expect(html.match(/data-analytics-booking-cta="home-audience"/g)).toHaveLength(1);
```

Update the Playwright Home test to assert the real hierarchy:

```ts
await expect(page.locator(".plain-home-hero [role=tablist]")).toBeVisible();
await expect(page.locator(".plain-home-subtitle")).toHaveCount(0);
await expect(page.locator('[data-analytics-booking-cta="home-hero"]')).toHaveCount(0);
```

Replace the old H1-to-subtitle spacing assertion with H1-to-tablist geometry at 390, 768, 1224, 1440, and 1728 pixels. Update the responsive typography table so the Location heading expects the existing H2 rendered values instead of H1 values.

- [ ] **Step 2: Run the narrow tests and observe RED**

Run:

```powershell
npm.cmd test -- tests/home-hero.test.tsx
playwright test tests/e2e/responsive-typography.spec.ts tests/e2e/site-smoke.spec.ts --grep "home display|home spacing|responsive typography"
```

Expected: failures for the duplicate subtitle/action, audience block outside the hero, and Location using H1 typography.

- [ ] **Step 3: Make the minimal Home implementation**

In `HomePage`, render only the title and existing audience component inside `.plain-home-hero-copy`, then render Location in `.home-main-stack`. Remove the unused `ButtonLink`, `introBookingHref`, and `showActions` hero-action code.

In `globals.css`:

```css
.plain-home-hero-copy {
  width: 100%;
}

.plain-home-hero .home-manifesto-section {
  padding-top: var(--space-home-display-lead);
}

.home-location-heading {
  font-size: calc(120 * var(--unit-fx));
  letter-spacing: var(--mai-h2-tracking);
  line-height: var(--mai-h2-line);
}
```

At 600px and below, use `var(--mai-h2-size)`. Do not use the shared tablet H2 font-size plateau because it renders larger than the H1 at 768px.

Keep the action-to-Location gap on `--space-home-section-transition` by removing obsolete outer top padding rather than introducing a new spacing value.

- [ ] **Step 4: Run the narrow tests and observe GREEN**

Run the same Vitest and Playwright selections. Confirm audience keyboard/focus tests remain green and no horizontal overflow appears at the five audited widths.

### Task 2: Add the analytics acknowledgement pointer

**Files:**
- Modify: `tests/e2e/site-smoke.spec.ts`
- Modify: `components/analytics/AnalyticsManager.tsx`

**Interfaces:**
- Produces: the existing `Okay` button with computed `cursor: pointer`; click and focus behavior are unchanged.

- [ ] **Step 1: Write and run the failing browser assertion**

```ts
const okay = banner.getByRole("button", {name: "Okay"});
await expect(okay).toHaveCSS("cursor", "pointer");
```

Run the single analytics banner Playwright test and confirm it fails with computed `cursor: auto`.

- [ ] **Step 2: Add the local cursor class and verify GREEN**

Add `cursor-pointer` to the existing analytics `Button` class list. Re-run the same Playwright test and confirm it passes.

### Task 3: Verify the integrated result

**Files:**
- Verify only; do not add verification infrastructure.

- [ ] **Step 1: Inspect Home at the audited widths**

Capture and inspect Home at 390, 768, 1224, 1440, and 1728 pixels. Confirm the hero order, Location H2 hierarchy, CTA visibility, and absence of horizontal overflow.

- [ ] **Step 2: Run project checks**

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd test
npm.cmd run build
playwright test tests/e2e/responsive-typography.spec.ts tests/e2e/site-smoke.spec.ts
```

Report exact results, remaining visual risks, and the changed files.
