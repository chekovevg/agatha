# Classes Menu Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the approved Figma desktop Classes menu with shared lesson content, accessible interactions, and editable contact-subject prefill.

**Architecture:** Keep lesson copy and image paths in `content/site.ts`, render the Classes page and new header menu from the same `Lesson` objects, and keep menu state inside one focused client component. Reuse the existing contact form and populate its Subject input from the native URL query string.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Vitest, Playwright

## Global Constraints

- Do not create lesson detail pages or change the mobile navigation structure.
- Use only Flute, Recorder, Piccolo, Music Theory, and Solfege in the desktop menu.
- Keep the existing `ear-training` slug and local image filename.
- Add no dependencies or generated icons.
- Preserve all unrelated working-tree changes.
- Do not commit without an explicit user request.

---

### Task 1: Share lesson images and Solfege copy

**Files:**
- Modify: `content/types.ts`
- Modify: `content/site.ts`
- Modify: `components/pages/ClassesPage.tsx`
- Test: `tests/site-structure.test.ts`

**Interfaces:**
- Produces: `Lesson.image: string`
- Produces: `siteContent.lessons` entry `{slug: "ear-training", title: "Solfege", image: "/images/classes/ear-training.png", ...}`
- Consumes: existing `SiteContent.lessons` and local files under `public/images/classes/`

- [ ] **Step 1: Add a failing shared-data regression test**

Add this assertion to `tests/site-structure.test.ts`:

```ts
it("keeps lesson menu content and images in the shared catalog", () => {
  expect(
    siteContent.lessons.map(({slug, title, image}) => ({slug, title, image})),
  ).toContainEqual({
    slug: "ear-training",
    title: "Solfege",
    image: "/images/classes/ear-training.png",
  });
  expect(siteContent.lessons.every((lesson) => lesson.image.startsWith("/images/classes/"))).toBe(true);
});
```

- [ ] **Step 2: Run the focused test and observe the intended failure**

Run: `npm.cmd test -- tests/site-structure.test.ts`

Expected: FAIL because `Lesson.image` does not exist and the title is still `Ear Training & Solfege`.

- [ ] **Step 3: Add image paths to the shared lesson content**

Extend `Lesson` in `content/types.ts`:

```ts
export type Lesson = {
  title: string;
  description: string;
  ctaLabel: string;
  slug: string;
  image: string;
};
```

Add the matching `/images/classes/*.png` path to every lesson object in `content/site.ts`, and change only the `ear-training` title to `Solfege`.

- [ ] **Step 4: Make the Classes page consume `lesson.image`**

Delete the local `lessonImages` record from `components/pages/ClassesPage.tsx` and replace `src={lessonImages[lesson.slug]}` with:

```tsx
src={lesson.image}
```

- [ ] **Step 5: Run the focused test**

Run: `npm.cmd test -- tests/site-structure.test.ts`

Expected: PASS.

---

### Task 2: Add the interactive header menu and contact prefill

**Files:**
- Create: `components/layout/ClassesMenu.tsx`
- Modify: `components/layout/Header.tsx`
- Modify: `components/ui/ContactForm.tsx`
- Modify: `tests/e2e/site-smoke.spec.ts`

**Interfaces:**
- Consumes: `Lesson[]`, `label: string`, and `onNavigate: () => void`
- Produces: `ClassesMenu({label, lessons, onNavigate}): React.ReactElement`
- Produces: lesson destinations `/about?subject=${encodeURIComponent(title)}#contact`

- [ ] **Step 1: Add failing Playwright coverage**

Add a desktop test that:

```ts
test("desktop Classes menu previews lessons and supports keyboard dismissal", async ({page}) => {
  await page.setViewportSize({width: 1280, height: 900});
  await page.goto("/");

  const classesLink = page.getByRole("navigation", {name: "Header Menu"})
    .getByRole("link", {name: "Classes", exact: true});
  await classesLink.hover();

  const menu = page.getByTestId("classes-menu");
  await expect(menu).toBeVisible();
  await menu.getByRole("link", {name: "Recorder", exact: true}).hover();

  const preview = page.getByTestId("classes-menu-preview");
  await expect(preview.getByText("Recorder", {exact: true})).toBeVisible();
  await expect(preview).toHaveAttribute("href", "/about?subject=Recorder#contact");
  await expect(menu.getByRole("link", {name: "All classes"})).toHaveAttribute("href", "/classes");

  await classesLink.focus();
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await expect(classesLink).toBeFocused();
});
```

Add contact-prefill and mobile assertions:

```ts
test("lesson menu destinations prefill the editable contact subject", async ({page}) => {
  await page.goto("/about?subject=Piccolo#contact");
  await expect(page.getByLabel("Subject")).toHaveValue("Piccolo");
  await page.getByLabel("Subject").fill("Piccolo for an adult beginner");
  await expect(page.getByLabel("Subject")).toHaveValue("Piccolo for an adult beginner");
});
```

In the existing mobile navigation test, assert `page.getByTestId("classes-menu")` is hidden.

- [ ] **Step 2: Build first and run only the new browser tests**

Run: `npm.cmd run build`

Run: `npm.cmd run e2e:run -- --grep "desktop Classes menu|lesson menu destinations"`

Expected: FAIL because the menu test IDs and query prefill do not exist.

- [ ] **Step 3: Implement the focused `ClassesMenu` client component**

Create `components/layout/ClassesMenu.tsx` with:

- the five-slug order `flute`, `recorder`, `piccolo`, `music-theory`, `ear-training`;
- `useState` for open state and the active preview;
- pointer enter/leave and focus/blur behavior only when `(min-width: 861px)` matches;
- Escape handling that closes and restores focus to the top Classes link;
- the Figma panel widths, 24px padding, 10px column gap, 50px menu rows, 260px preview image, and existing color tokens;
- `ChevronRight` from the already-installed `lucide-react` package;
- `motion-reduce:transition-none` on decorative transitions;
- `data-testid="classes-menu"` on the panel and `data-testid="classes-menu-preview"` on the preview link.

- [ ] **Step 4: Integrate the menu without changing mobile navigation**

In `Header.tsx`, render `ClassesMenu` only for the existing nav entry whose `href` is `/classes`; keep the current list item markup for About me and Media. Pass `content.lessons` and `closeMenu`.

- [ ] **Step 5: Prefill the existing Subject input from the URL**

Add a form ref in `ContactForm.tsx` and, in the existing client effect, read:

```ts
const subject = new URLSearchParams(window.location.search).get("subject");
const subjectInput = formRef.current?.elements.namedItem("subject");

if (subject && subjectInput instanceof HTMLInputElement) {
  subjectInput.value = subject;
}
```

Attach `ref={formRef}` to the existing form. Do not make the input controlled; it must remain editable and continue to reset after successful submission.

- [ ] **Step 6: Run the focused browser tests**

Run: `npm.cmd run build`

Run: `npm.cmd run e2e:run -- --grep "desktop Classes menu|lesson menu destinations|mobile navigation"`

Expected: PASS.

- [ ] **Step 7: Run project verification**

Run:

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd test
npm.cmd run build
npm.cmd run e2e:run
```

Expected: all commands PASS.

- [ ] **Step 8: Perform rendered visual QA**

Inspect `/` at 1280×900 with the Classes menu open and at 390×844 with the mobile menu open. Compare menu placement, dimensions, typography, colors, image switching, chevrons, focus visibility, reduced-motion behavior, and overflow against Figma nodes `133:4304`, `133:4218`, `133:4220`, `131:4149`, and `132:4165`.
