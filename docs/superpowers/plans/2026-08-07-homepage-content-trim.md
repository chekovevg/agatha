# Homepage Content Trim Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan inline. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Match the approved 1440 px homepage reference by shortening global navigation and the home content stack while leaving the complete hero visual untouched.

**Architecture:** Reuse `siteContent.nav`, the existing `ButtonLink`, and the current manifesto/location sections. Delete rendered-only home sections and their now-unused image helper; keep audience landing pages and `/classes` links unchanged.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Vitest.

## Global Constraints

- Do not change `HomeHeroBackground`, hero artwork, hero typography, hero copy, or musical-staff behavior.
- Keep marketing copy in `content/site.ts`.
- Add no dependency or new component.
- Keep audience landing routes and their SEO content unchanged.
- Do not commit, stage, push, deploy, or alter external services.

---

### Task 1: Trim homepage navigation and content

**Files:**
- Modify: `tests/home-hero.test.tsx`
- Modify: `tests/site-structure.test.ts`
- Modify: `tests/footer.test.tsx`
- Modify: `content/site.ts`
- Modify: `components/pages/HomePage.tsx`

**Interfaces:**
- Consumes: `siteContent.audienceLessons.adults|children` and `ButtonLink`.
- Produces: global navigation containing only `About me`, `Classes`, and `Media`.
- Produces: home order `hero -> manifesto/buttons -> location -> footer`.
- Produces: `Intro Call` in the header and `Get in Touch` in the hero and location section.

- [x] **Step 1: Write failing rendered-behavior assertions**

Update the homepage test to require exactly one link to each audience route, compact button styling through the existing `ButtonLink`, and source order in which both links follow the manifesto copy and precede `single-location`. Assert the rendered home omits `data-reference-section="values"`, `data-reference-section="quote"`, `Find the right lesson`, and the quote copy.

Update the navigation test to expect:

```ts
expect(siteContent.nav).toEqual([
  {label: "About me", href: "/about"},
  {label: "Classes", href: "/classes"},
  {label: "Media", href: "/media"},
]);
```

Update the footer test to assert that audience route links are absent.

Assert the rendered home has two `/book` actions labelled `Get in Touch`, with
the first inside the hero, and that the header's mobile and desktop actions are
both labelled `Intro Call`.

- [x] **Step 2: Run focused tests and verify RED**

```powershell
npm.cmd test -- tests/home-hero.test.tsx tests/site-structure.test.ts tests/footer.test.tsx
```

Expected: failures identify the five-item navigation, audience cards, Values section, quote section, and audience links in the footer.

- [x] **Step 3: Implement the smallest content and render change**

Set `nav` in `content/site.ts` to the three approved items, `cta.primary` to `Intro Call`, and the shared hero/location action label to `Get in Touch`. Shorten the manifesto and location body to the exact copy in the approved design specification. In `HomePage`, add the primary `/book` action to the hero, remove `HomeValuesSection`, `AgathaQuoteImage`, and the separate audience-card and quote sections. Append these actions to the manifesto section directly after its copy:

```tsx
<div className="flex flex-wrap justify-center gap-3">
  {Object.values(content.audienceLessons).map((lesson) => (
    <ButtonLink key={lesson.path} href={lesson.path}>
      {lesson.navLabel}
    </ButtonLink>
  ))}
</div>
```

Keep the existing hero and location JSX unchanged except for the surrounding home stack spacing required after section deletion.

- [x] **Step 4: Run focused tests and verify GREEN**

Run the Step 2 command. Expected: all focused tests pass.

- [x] **Step 5: Verify the integrated result**

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd test
git diff --check
```

Inspect `http://127.0.0.1:3103/` at desktop and mobile widths. Confirm the hero visual is unchanged, the two buttons follow the manifesto copy, Values and quote are absent, location follows next, header/mobile menu remain usable, and there is no horizontal overflow.
