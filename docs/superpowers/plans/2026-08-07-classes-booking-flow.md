# Classes Booking Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver the approved Classes menu and a single booking page that opens the correct Intro Call or Music Lesson event from every CTA.

**Architecture:** Keep lesson data in `content/site.ts`, encode booking intent in `/book` query parameters, and resolve it in the server page before rendering `BookingSection`. Reuse the existing Cal.com embed and analytics integration; add no dependencies.

**Tech Stack:** Next.js 16 App Router, React, TypeScript, Tailwind CSS 4, Vitest, Playwright.

## Global Constraints

- Do not modify or import WebGL, canvas, musical-score, or experimental hero code.
- Use Figma node `2059:227` and the live Microsoft AI menu motion values.
- Preserve existing analytics event titles `Intro Call` and `Music Lesson`.
- Do not commit, push, deploy, or edit `.env.local`.

---

### Task 1: Booking intent and catalog contract

**Files:**
- Modify: `content/types.ts`
- Modify: `content/site.ts`
- Modify: `lib/env.ts`
- Modify: `tests/site-structure.test.ts`

**Interfaces:**
- Produces: typed lesson images and `BookingMode = "intro" | "lesson"` content consumed by pages and booking UI.

- [ ] Write assertions for the five-lesson catalog, shared images, unified copy, and two booking modes.
- [ ] Run `npm.cmd test -- tests/site-structure.test.ts` and observe the expected failures.
- [ ] Remove Music History and per-lesson CTA labels; add shared images and the verified lesson Cal URL.
- [ ] Run the focused test and confirm it passes.

### Task 2: Booking routes and switch

**Files:**
- Modify: `app/book/page.tsx`
- Modify: `components/sections/BookingSection.tsx`
- Modify: `components/pages/ClassesPage.tsx`
- Modify: `components/pages/AudienceLessonPage.tsx`
- Modify: `components/pages/HomePage.tsx`
- Modify: `components/layout/Header.tsx`
- Modify: `components/layout/Footer.tsx`
- Test: `tests/site-structure.test.ts`
- Test: `tests/e2e/site-smoke.spec.ts`

**Interfaces:**
- Consumes: `BookingMode`, booking option copy, and lesson titles.
- Produces: `/book?type=intro` and `/book?type=lesson&subject=...` links plus the active Cal embed.

- [ ] Add failing rendering and browser tests for both booking modes and a specific Flute class.
- [ ] Run focused Vitest and Playwright tests and observe failures caused by the old single-event flow.
- [ ] Resolve async `searchParams`, render the mode switch, key the Cal embed by URL, and remove the extra booking border/card surface.
- [ ] Update every booking entry link according to its intent.
- [ ] Run focused tests and confirm they pass.

### Task 3: Classes dropdown and reference motion

**Files:**
- Create: `components/layout/ClassesMenu.tsx`
- Modify: `components/layout/Header.tsx`
- Test: `tests/e2e/site-smoke.spec.ts`

**Interfaces:**
- Consumes: the shared lesson catalog and `onNavigate` callback.
- Produces: accessible desktop hover/focus dropdown; mobile keeps the existing flat menu.

- [ ] Add a failing browser test for hover, preview changes, specific booking URL, Escape focus restoration, and hidden mobile panel.
- [ ] Run the focused browser test and observe the missing menu failure.
- [ ] Implement Figma layout and the `0.8s` opacity/clip-path transition with reduced-motion fallback.
- [ ] Run the focused browser test and confirm it passes.

### Task 4: Integrated verification

**Files:**
- Review all changed files and the full diff.

- [ ] Run `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd test`, `npm.cmd run build`, and `npm.cmd run e2e:run`.
- [ ] Inspect `/`, `/classes`, `/book?type=intro`, and `/book?type=lesson&subject=Flute` at desktop and mobile widths.
- [ ] Verify the footer remains centered to Figma node `2059:109` and no experimental hero files changed.
