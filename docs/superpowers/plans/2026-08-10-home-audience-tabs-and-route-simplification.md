# Home Audience Tabs and Route Simplification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the dedicated Adults and Children routes and replace the Home audience links and manifesto heading with accessible local tabs, a dynamic description, and a split-arrow booking action.

**Architecture:** Keep `TabMenu` as the single visual segmented-control primitive, but give it an explicit navigation mode for Booking and tabs mode for Home. Replace the route-oriented `audienceLessons` content with a compact Home-only audience-tab model, delete all route/SEO consumers, and verify standard 404 behavior.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Vitest, Playwright.

## Global Constraints

- Old audience URLs must return the ordinary application `404`; do not add redirects, rewrites, compatibility routes, or query-parameter replacements.
- `For adults` is the default selected tab.
- Hover and focus styling must not change the selected description.
- The split-arrow `Book a Call` action must use `introBookingHref` and remain outside the tab panel.
- Booking's existing URL navigation behavior must remain unchanged.
- Do not add images, an explainer, a form, a Cal.com embed, dependencies, or final spacing-system values.
- Preserve the current uncommitted typography work in this branch.
- Do not commit, push, merge, or deploy without explicit user authorization.

---

## File Map

- Modify `content/types.ts`: replace `AudienceLessonContent` and `audienceLessons` with the compact Home audience-tab contract.
- Modify `content/site.ts`: remove long audience page content and add the two Home tab labels/descriptions.
- Modify `lib/seo.ts`: remove audience-page metadata and Service JSON-LD helpers.
- Modify `app/sitemap.ts`: remove both audience URLs.
- Delete `app/online-flute-lessons-for-adults/page.tsx`.
- Delete `app/online-flute-lessons-for-children/page.tsx`.
- Delete `components/pages/AudienceLessonPage.tsx`.
- Modify `components/ui/TabMenu.tsx`: add explicit navigation and interactive tabs modes.
- Create `components/sections/HomeAudienceTabs.tsx`: own audience state and render tabs, panel, and booking action.
- Delete `components/sections/HomeAudienceSelector.tsx`.
- Modify `components/pages/HomePage.tsx`: consume the new Home audience model.
- Modify `app/globals.css`: remove the obsolete Home heading/copy stack rule and preserve current section geometry.
- Modify `tests/site-structure.test.ts`, `tests/seo.test.ts`, `tests/home-hero.test.tsx`, and `tests/e2e/site-smoke.spec.ts` for the new contract.

---

### Task 1: Remove the route-oriented audience content and pages

**Files:**
- Modify: `tests/site-structure.test.ts`
- Modify: `tests/seo.test.ts`
- Modify: `content/types.ts`
- Modify: `content/site.ts`
- Modify: `lib/seo.ts`
- Modify: `app/sitemap.ts`
- Delete: `app/online-flute-lessons-for-adults/page.tsx`
- Delete: `app/online-flute-lessons-for-children/page.tsx`
- Delete: `components/pages/AudienceLessonPage.tsx`

**Interfaces:**
- Produces: `SiteContent["home"]["audienceTabs"]` with `adults` and `children`, each containing `label` and `description`.
- Removes: `AudienceLessonContent`, `siteContent.audienceLessons`, `audienceLessonMetadata`, and `serviceStructuredData`.

- [ ] **Step 1: Change the structure tests to describe the reduced public model**

Replace the audience-page assertions with:

```ts
expect(siteContent.home.audienceTabs).toEqual({
  adults: {
    label: "For adults",
    description:
      "Start from your first note, return after a break, or strengthen the playing you already have.",
  },
  children: {
    label: "For children",
    description:
      "Clear musical foundations, age-appropriate goals and practical guidance for the time between lessons.",
  },
});
expect(siteContent).not.toHaveProperty("audienceLessons");
```

Update the sitemap expectation to exactly `[/, /book, /classes, /about, /media]`. In the filesystem contract, assert that both route page files and `components/pages/AudienceLessonPage.tsx` do not exist.

- [ ] **Step 2: Remove audience-page SEO tests**

Delete the `AudienceLessonContent` import, audience metadata assertions, audience canonical/Open Graph test, and Service JSON-LD loop. Preserve the landing metadata, Person/WebSite JSON-LD, serialization safety, and legal noindex tests.

- [ ] **Step 3: Run the narrow tests and observe the expected failure**

Run:

```powershell
npm.cmd test -- tests/site-structure.test.ts tests/seo.test.ts
```

Expected: failures because `home.audienceTabs` does not exist and the old pages/model still exist.

- [ ] **Step 4: Replace the content type**

In `SiteContent.home`, replace `manifesto` with:

```ts
audienceTabs: {
  adults: {label: "For adults"; description: string};
  children: {label: "For children"; description: string};
};
```

Remove the top-level `audienceLessons` property and delete `AudienceLessonContent`.

- [ ] **Step 5: Replace the site content**

Delete the full `audienceLessons` object and the old `home.manifesto`. Add `home.audienceTabs` using the exact labels and descriptions from Step 1. Keep general Adults/Children references in Hero, About, trust content, and FAQ.

- [ ] **Step 6: Remove route and SEO implementation**

Delete both route page files and `AudienceLessonPage.tsx`. Remove both audience entries from `app/sitemap.ts`. Remove the `AudienceLessonContent` import and the `audienceLessonMetadata` and `serviceStructuredData` exports from `lib/seo.ts`.

- [ ] **Step 7: Run the narrow tests**

Run:

```powershell
npm.cmd test -- tests/site-structure.test.ts tests/seo.test.ts
```

Expected: PASS.

---

### Task 2: Generalize TabMenu without changing Booking

**Files:**
- Modify: `components/ui/TabMenu.tsx`
- Modify: `components/sections/BookingSection.tsx` only if needed to make `mode="navigation"` explicit.
- Test: `tests/site-structure.test.ts`

**Interfaces:**
- Navigation mode consumes `{active: boolean; href: string; label: string}[]`.
- Tabs mode consumes `{id: string; label: string}[]`, `activeId`, `panelId`, and `onTabChange(id: string)`.

- [ ] **Step 1: Add a static navigation regression assertion**

Preserve the Booking rendering test and assert that its Tab Menu continues to render links to `/book?type=intro` and `/book?type=lesson` with the active item exposing `aria-current="page"`.

- [ ] **Step 2: Run the Booking structure test**

Run:

```powershell
npm.cmd test -- tests/site-structure.test.ts
```

Expected: PASS before the refactor, establishing the regression baseline.

- [ ] **Step 3: Implement the discriminated TabMenu API**

Add `"use client"` and define a prop union keyed by `mode`:

```ts
type NavigationProps = {
  mode?: "navigation";
  ariaLabel: string;
  items: {active: boolean; href: string; label: string}[];
};

type TabsProps = {
  mode: "tabs";
  ariaLabel: string;
  items: {id: string; label: string}[];
  activeId: string;
  panelId: string;
  onTabChange: (id: string) => void;
};
```

Navigation mode keeps the current `<nav><a>` semantics and visual classes. Tabs mode renders a `role="tablist"` container and native `<button role="tab">` items with `id`, `aria-controls`, `aria-selected`, and roving `tabIndex`.

For Left/Right Arrow and Home/End, prevent default, choose the next index with wraparound, call `onTabChange`, and focus the corresponding button. Native button behavior supplies Enter/Space activation. Reuse the current active and hover classes in both modes.

- [ ] **Step 4: Run typecheck and the Booking regression test**

Run:

```powershell
npm.cmd run typecheck
npm.cmd test -- tests/site-structure.test.ts
```

Expected: PASS, with Booking still using links rather than tab semantics.

---

### Task 3: Replace the Home manifesto with audience tabs and booking action

**Files:**
- Modify: `tests/home-hero.test.tsx`
- Create: `components/sections/HomeAudienceTabs.tsx`
- Delete: `components/sections/HomeAudienceSelector.tsx`
- Modify: `components/pages/HomePage.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: `SiteContent["home"]["audienceTabs"]`, tabs-mode `TabMenu`, `SplitLinkButton`, and `introBookingHref`.
- Produces: Home audience block with test ids `home-audience-tabs` and `home-audience-panel` and analytics id `home-audience`.

- [ ] **Step 1: Rewrite the Home static-render contract**

Assert that Home contains both labels, the default Adults description, the split-link class, `href="/book?type=intro"`, and `data-analytics-booking-cta="home-audience"`. Assert that it does not contain `Music becomes possible`, either old audience URL, or an audience `<a>` link.

- [ ] **Step 2: Run the Home test and observe the expected failure**

Run:

```powershell
npm.cmd test -- tests/home-hero.test.tsx
```

Expected: FAIL because the old heading and audience route links are still rendered.

- [ ] **Step 3: Create HomeAudienceTabs**

Implement a client component with `activeAudience` initialized to `"adults"`. Render a visually hidden H2 (`Who lessons are for`), tabs-mode `TabMenu`, a single flexible-height `<p role="tabpanel">` labelled by the active tab, and `SplitLinkButton` beneath it:

```tsx
<SplitLinkButton
  href={introBookingHref}
  data-analytics-booking-cta="home-audience"
>
  Book a Call
</SplitLinkButton>
```

Keep `data-home-manifesto-copy` on the panel so the existing typography regression test continues to inspect the same text role.

- [ ] **Step 4: Wire HomePage and remove the obsolete selector**

Replace `HomeAudienceSelector` with `HomeAudienceTabs` and pass `home.audienceTabs`. Delete `HomeAudienceSelector.tsx`. Remove the unused `.home-manifesto-copy-stack` and `.home-manifesto-heading` rules and the unused `--home-heading-copy-gap` token, but preserve `.home-manifesto-section`, `.home-section-copy`, current section padding, and current responsive geometry.

- [ ] **Step 5: Run the Home and type tests**

Run:

```powershell
npm.cmd test -- tests/home-hero.test.tsx tests/site-structure.test.ts
npm.cmd run typecheck
```

Expected: PASS.

---

### Task 4: Verify interaction, routing, responsiveness, and regressions

**Files:**
- Modify: `tests/e2e/site-smoke.spec.ts`

**Interfaces:**
- Consumes the final route list, Home audience tabs, Booking navigation menu, and existing Playwright server setup.

- [ ] **Step 1: Update route coverage**

Remove both audience paths from the successful-route loop and delete the audience-page H1/metadata checks. Add both old URLs to the standard-404 test.

- [ ] **Step 2: Replace the hover-button test with a tabs interaction test**

At 1440px, assert:

```ts
const adults = page.getByRole("tab", {name: "For adults"});
const children = page.getByRole("tab", {name: "For children"});
const panel = page.getByRole("tabpanel");

await expect(adults).toHaveAttribute("aria-selected", "true");
await expect(panel).toHaveText(/Start from your first note/);
await children.hover();
await expect(panel).toHaveText(/Start from your first note/);
await children.click();
await expect(children).toHaveAttribute("aria-selected", "true");
await expect(panel).toHaveText(/Clear musical foundations/);
await expect(page).toHaveURL(/\/$/);
```

Then focus Children, press ArrowLeft, and assert Adults is focused, selected, and its description restored. Press End and Home to verify direct boundary selection. Assert the audience `Book a Call` link uses the split-link class and `/book?type=intro`.

- [ ] **Step 3: Add responsive tab-label checks**

At widths 390, 768, 1224, and 1728, assert both tabs are visible and compare their bounding boxes to ensure they do not overlap. Confirm the panel and CTA have non-zero boxes and the panel text is not clipped (`scrollHeight <= clientHeight + 1`).

- [ ] **Step 4: Run the focused browser test**

Run:

```powershell
npm.cmd run build
npm.cmd run e2e:run -- --grep "audience|primary English routes|404|booking"
```

Expected: PASS.

- [ ] **Step 5: Run the full verification suite**

Run:

```powershell
npm.cmd run check
npm.cmd run e2e:run
```

Expected: typecheck, lint, Vitest, build, and every Playwright test PASS.

- [ ] **Step 6: Inspect the rendered result**

Use the local production preview at 390, 768, 1224, and 1728 pixels. Check default and Children states, keyboard focus, the split-arrow CTA, Location transition, and Booking Tab Menu regression. Record any spacing concerns for the next spacing-system task rather than introducing unapproved final spacing tokens here.

