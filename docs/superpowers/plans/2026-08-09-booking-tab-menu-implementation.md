# Booking Tab Menu Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Match the current Figma mono styles and shared menu shadow, then rebuild `/book` around the Figma Tab Menu and the existing Cal.com inline embed.

**Architecture:** Keep URL-driven server rendering for the two booking modes. Add one focused navigation component for the Figma tabs, keep Cal.com as the only booking authority, and make the booking page a centered vertical composition without the current step-card grid.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Cal.com inline embed, Vitest, Playwright.

## Global Constraints

- Keep the current header booking CTA unchanged.
- Use Red Hat Mono weight 400, tracking -0.21px, medium 16/16px, and small 14/19.6px.
- Header and Classes Menu section share `0 3px 100px 8px rgba(0, 0, 0, 0.12)` on desktop.
- Keep Cal.com inline embed and existing Intro Call/Music Lesson URLs; add no dependency.
- Render `/book` as `Book a Call` → Tab Menu → relevant description/subject → wide embed.
- Keep booking-step content in `content/site.ts` but do not render its cards.
- Preserve keyboard focus, `aria-current`, mobile fit, analytics, UTM forwarding, notes, and fallback links.

---

### Task 1: Restore mono typography and shared navigation shadow

**Files:**
- Modify: `tests/e2e/site-smoke.spec.ts`
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`
- Modify: `components/layout/Header.tsx`
- Modify: `components/layout/ClassesMenu.tsx`

**Interfaces:**
- Consumes: existing `font-ui`, Header surface, and Classes menu panel.
- Produces: `--shadow-navigation-surface` and a Classes menu computed style using Red Hat Mono.

- [ ] **Step 1: Write the failing browser expectations**

Change the Classes-menu typography expectation to require Red Hat Mono and add an assertion that the open Classes panel has exactly the same computed `box-shadow` as `[data-header-surface]`:

```ts
expect(fluteFontFamily).toContain("Red Hat Mono");
expect(await menuPanel.evaluate((element) => getComputedStyle(element).boxShadow))
  .toBe(await headerSurface.evaluate((element) => getComputedStyle(element).boxShadow));
```

- [ ] **Step 2: Run the focused tests and verify RED**

Run:

```powershell
npm.cmd run e2e:run -- --grep "desktop Classes menu previews lessons|shared navigation shadow"
```

Expected: FAIL because the Classes menu uses Geist Mono and a 50px-blur shadow without the header spread.

- [ ] **Step 3: Implement the exact tokens**

Remove `Geist_Mono` and `--font-geist-mono` from `app/layout.tsx`. Restore Tailwind's mono token to Red Hat Mono and add:

```css
--shadow-navigation-surface: 0 3px 100px 8px rgba(0, 0, 0, 0.12);
--font-mono: var(--font-red-hat-mono);
```

Use `shadow-[var(--shadow-navigation-surface)]` on the desktop header and Classes menu panel. Keep the existing mobile header shadow exclusion.

- [ ] **Step 4: Run the focused tests and verify GREEN**

Run the same focused browser tests and expect PASS.

### Task 2: Add the Figma Tab Menu and centered booking composition

**Files:**
- Create: `components/ui/TabMenu.tsx`
- Modify: `components/sections/BookingSection.tsx`
- Modify: `components/analytics/CalBookingEmbed.tsx`
- Modify: `tests/site-structure.test.ts`
- Modify: `tests/e2e/site-smoke.spec.ts`

**Interfaces:**
- Produces:

```ts
type TabMenuItem = {
  active: boolean;
  href: string;
  label: string;
};

function TabMenu(props: {
  ariaLabel: string;
  items: TabMenuItem[];
}): React.ReactElement;
```

- Consumes: `content.booking.eventTypes`, `introBookingHref`, `lessonBookingHref(subject)`, current `BookingMode`, and existing Cal.com URLs.

- [ ] **Step 1: Write failing server-render and browser expectations**

Update the booking tests to require:

```ts
expect(html).toContain("Book a Call");
expect(html).toContain('aria-label="Booking type"');
expect(html).toContain('aria-current="page"');
expect(html).not.toContain("Choose the next step");
```

Update Playwright to require one visible H1 `Book a Call`, active Intro Call/Music Lesson links, a 366px desktop Tab Menu with 12px padding and 38px links, valid route switching, selected class text, and the relevant Cal.com fallback URL.

- [ ] **Step 2: Run the focused tests and verify RED**

Run:

```powershell
npm.cmd test -- tests/site-structure.test.ts
npm.cmd run e2e:run -- --grep "booking route selects"
```

Expected: FAIL because the page still renders mode-specific H1 text, pill buttons, a two-column layout, and step cards.

- [ ] **Step 3: Implement `TabMenu`**

Create a reusable navigation component with this structure:

```tsx
<nav aria-label={ariaLabel} className="w-[366px] max-w-full rounded-[5px] bg-[#f7f1e4] p-3">
  <div className="flex items-center justify-center">
    {items.map((item) => (
      <a
        key={item.label}
        href={item.href}
        aria-current={item.active ? "page" : undefined}
        className={cn(
          "flex h-[38px] min-w-0 items-center justify-center rounded-[3px] px-[30px] font-ui text-[16px] font-normal leading-none tracking-[-0.21px] focus-visible:outline-2",
          item.active ? "bg-[var(--background)]" : "bg-transparent",
        )}
      >
        {item.label}
      </a>
    ))}
  </div>
</nav>
```

Add only the smallest mobile adjustment required to keep both labels inside the available width.

- [ ] **Step 4: Recompose `BookingSection`**

Render one centered `mai-h4` H1 `Book a Call`, matching the existing Classes page heading scale, then the Tab Menu, centered mode-specific copy, optional selected subject, and the wide Cal embed in that order. Remove the rendered step-card grid and old `ButtonLink` tab navigation. Keep fallback behavior and route helpers unchanged.

- [ ] **Step 5: Configure the existing Cal.com embed UI**

After `Cal("inline", ...)`, add the supported UI instruction:

```ts
Cal("ui", {
  hideEventTypeDetails: true,
  showTimezoneWhenEventDetailsHidden: true,
  styles: {body: {background: "transparent"}},
});
```

Keep booking-success analytics and UTM/notes configuration unchanged.

- [ ] **Step 6: Run focused tests and verify GREEN**

Run the same site-structure and focused booking browser tests and expect PASS.

### Task 3: Integrated visual and regression verification

**Files:**
- Modify only if verification finds a requirement mismatch.

**Interfaces:**
- Consumes: the integrated page and component behavior from Tasks 1–2.
- Produces: verified desktop/mobile preview-ready branch.

- [ ] **Step 1: Run static and unit checks**

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd test
npm.cmd run build
```

Expected: all commands exit 0.

- [ ] **Step 2: Run the full browser suite**

Run `npm.cmd run e2e:run` against a production build. Expected: all Playwright tests pass.

- [ ] **Step 3: Perform visual proof**

At 1440×1000, compare the rendered Tab Menu with Figma node `2069:857`; verify the Classes Menu section shadow visibly matches the header. At 390×844, verify the tabs fit, the booking flow is centered, the Cal embed uses its native stacked layout, and the page has no horizontal overflow. Verify no browser console errors.

- [ ] **Step 4: Review the integrated diff**

Run `git diff --check` and review every changed source/test file against `docs/superpowers/specs/2026-08-09-booking-tab-menu-design.md`.

- [ ] **Step 5: Commit, push, and verify preview deployment**

Commit the implementation on `codex/site-release`, push it to origin, and wait for the Vercel branch preview to report `READY`. Do not deploy production.
