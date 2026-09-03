# Home Hero Positioning Copy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan inline. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Change the home hero's primary positioning from `Flute Lessons` to `Flute & Music Teacher` without changing the musical-score design or SEO metadata.

**Architecture:** Keep the existing two-line H1 and update its content value. Derive the accessible label from the two content fields so visible and accessible copy cannot drift apart.

**Tech Stack:** React 19, TypeScript, Vitest, Playwright.

## Global Constraints

- Keep `For Adults and Children` as the second H1 line.
- Keep the musical score, hero layout, CTA, metadata, and audience landing pages unchanged.
- Do not add dependencies or components.
- Do not commit, stage, push, deploy, or alter unrelated dirty files.

---

### Task 1: Update the home hero positioning

**Files:**
- Modify: `tests/home-hero.test.tsx`
- Modify: `tests/e2e/site-smoke.spec.ts`
- Modify: `content/site.ts`
- Modify: `components/pages/HomePage.tsx`

**Interfaces:**
- Consumes: `siteContent.home.heroTitle` and `siteContent.home.heroSubtitle`.
- Produces: one visible H1 and accessible name `Flute & Music Teacher For Adults and Children`.

- [x] **Step 1: Write the failing rendered assertion**

Require the rendered H1 and its accessible label to contain the approved full phrase:

```ts
expect(html).toContain("Flute &amp; Music Teacher");
expect(html).toContain(
  'aria-label="Flute &amp; Music Teacher For Adults and Children"',
);
```

Update the browser smoke expectation to `Flute & Music Teacher For Adults and Children`.

- [x] **Step 2: Run the focused test and verify RED**

```powershell
npm.cmd test -- tests/home-hero.test.tsx
```

Expected: FAIL because the rendered H1 still contains `Flute Lessons`.

- [x] **Step 3: Implement the minimal copy change**

Set `home.heroTitle` to `Flute & Music Teacher`. In `HomePage`, derive the H1 label from `${home.heroTitle} ${home.heroSubtitle}` and preserve a whitespace text node between the styled spans so indexable text does not concatenate the words across lines.

- [x] **Step 4: Verify GREEN and the rendered page**

```powershell
npm.cmd test -- tests/home-hero.test.tsx
npm.cmd run typecheck
npm.cmd run lint
```

Reload `http://127.0.0.1:3103/` and confirm the two-line hero remains visually balanced at desktop and mobile widths.
