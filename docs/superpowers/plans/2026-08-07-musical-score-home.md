# Musical Score Home Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the SEO-trimmed home page to match the approved editorial concept and add a playable, shape-changing curved score with a synthetic flute voice.

**Architecture:** Keep `HomePage` server-rendered and move only the score interaction into a client component. A typed phrase array drives a pure SVG geometry layer and a lazily imported Tone.js player, so the score, highlight timing, and sound share one source of truth.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, inline SVG, Tone.js, Vitest, Playwright.

## Global Constraints

- Preserve every current uncommitted SEO change and the adult/child landing pages.
- Preserve one manifesto link to `/online-flute-lessons-for-adults` and one to
  `/online-flute-lessons-for-children`.
- Create `codex/home-score-experience` from the current dirty checkout; do not stash or reset.
- Keep exactly one visible home H1 whose complete text is `Flute Lessons for Adults and Children`.
- Keep only hero, manifesto, Rhine block, and footer on Home.
- Keep `Intro Call` in the header and `Get in Touch` on hero/location booking actions.
- Never autoplay audio; Tone.js loads only after a user gesture.
- Respect keyboard focus and `prefers-reduced-motion`.
- Do not add a CMS, database, API route, MIDI parser, notation engine, WebGL system, or sample pack.
- Do not commit, merge, push, deploy, or alter unrelated dirty files.

## File Map

- Create `content/score-phrases.ts`: score types, three licensed phrase records, curve profiles, and note events.
- Create `lib/score-geometry.ts`: pure cubic Bézier sampling, tangent/normal calculation, staff paths, and note placement.
- Create `components/ui/CurvedScore.tsx`: accessible responsive SVG built from geometry output.
- Create `components/ui/MusicalScoreHero.tsx`: play/pause/resume/replay state, phrase cycling, highlighting, and status text.
- Create `lib/flute-player.ts`: dynamic Tone import and disposable synthetic-flute scheduler.
- Modify `components/pages/HomePage.tsx`: approved hero and trimmed section layout.
- Modify `content/site.ts` and `content/types.ts`: approved hero copy and score-content typing only where needed.
- Modify `app/globals.css`: editorial home layout, SVG/player states, responsive rules, focus, and reduced motion.
- Modify `components/layout/Footer.tsx`: approved compact grouping and CTA terminology if required by the rendered comparison.
- Modify `tests/home-hero.test.tsx`: semantic home contract and SVG fallback assertions.
- Create `tests/score-geometry.test.ts`: curve and note placement regression tests.
- Create `tests/score-phrases.test.ts`: phrase completeness, duration, licence, and event-order checks.
- Modify `tests/e2e/site-smoke.spec.ts`: desktop/mobile home visibility and player interaction checks.

---

### Task 1: Preserve the SEO state on one feature branch

**Files:**
- No source-file changes.

**Interfaces:**
- Consumes: current dirty `main` checkout with 118 passing tests.
- Produces: current checkout on `codex/home-score-experience`, with the identical working tree.

- [ ] **Step 1: Capture the current dirty-file list**

Run: `git status --short --branch`

Expected: local `main`, ahead of `origin/main`, with SEO modifications and untracked audience-page/spec files.

- [ ] **Step 2: Create and switch the branch without touching the index or working tree**

Run: `git switch -c codex/home-score-experience`

Expected: `Switched to a new branch 'codex/home-score-experience'`.

- [ ] **Step 3: Verify preservation**

Run: `git status --short --branch`

Expected: the branch name changes and the same modified/untracked paths remain.

---

### Task 2: Define phrases and curved-score geometry

**Files:**
- Create: `tests/score-phrases.test.ts`
- Create: `tests/score-geometry.test.ts`
- Create: `content/score-phrases.ts`
- Create: `lib/score-geometry.ts`

**Interfaces:**
- Produces: `ScorePhrase`, `ScoreNote`, `CurveProfile`, `scorePhrases`, `sampleCurve(profile, count)`, `buildStaffPaths(profile)`, and `placeNotes(profile, notes)`.

- [ ] **Step 1: Write failing phrase-data tests**

Assert that `scorePhrases` contains exactly three phrases; every phrase has a composer, work, public-domain or explicit licence string, source URL, BPM from 48 through 132, 8–12 seconds of ordered note events, and a unique curve id.

- [ ] **Step 2: Run the phrase tests and verify the missing-module failure**

Run: `npm.cmd test -- tests/score-phrases.test.ts`

Expected: FAIL because `@/content/score-phrases` does not exist.

- [ ] **Step 3: Add the typed phrase records**

Use this public interface:

```ts
export type ScoreNote = {
  duration: number;
  pitch: string;
  staffOffset: number;
  time: number;
};

export type CurveProfile = {
  id: "ribbon" | "pebble" | "arch";
  points: readonly [number, number][];
};

export type ScorePhrase = {
  bpm: number;
  composer: string;
  curve: CurveProfile;
  id: string;
  licence: string;
  notes: readonly ScoreNote[];
  sourceUrl: string;
  work: string;
};

export const scorePhrases: readonly ScorePhrase[] = [
  bachBadinerie,
  beethovenOdeToJoy,
  mozartVariationsTheme,
];
```

Use three short, verified public-domain flute-suitable excerpts. Store note timing in seconds so rendering does not depend on Tone.js. Keep the source URL and licence statement on every record.

- [ ] **Step 4: Run phrase tests and verify PASS**

Run: `npm.cmd test -- tests/score-phrases.test.ts`

- [ ] **Step 5: Write failing geometry tests**

Assert that `sampleCurve` returns the requested number of finite points, that staff paths contain five non-empty SVG paths, and that `placeNotes` returns one finite `{x, y, angle}` position per note while preserving order.

- [ ] **Step 6: Run geometry tests and verify the missing-module failure**

Run: `npm.cmd test -- tests/score-geometry.test.ts`

Expected: FAIL because `@/lib/score-geometry` does not exist.

- [ ] **Step 7: Implement the minimum pure geometry**

Expose:

```ts
export type CurvePoint = {angle: number; x: number; y: number};
export function sampleCurve(profile: CurveProfile, count: number): CurvePoint[];
export function buildStaffPaths(profile: CurveProfile): string[];
export function placeNotes(
  profile: CurveProfile,
  notes: readonly ScoreNote[],
): CurvePoint[];
```

Interpolate authored points with Catmull–Rom-to-cubic sampling, derive the tangent from adjacent samples, and offset five staff lines along the local normal. Clamp requested counts to at least two so every returned angle is finite.

- [ ] **Step 8: Run both tests and verify PASS**

Run: `npm.cmd test -- tests/score-phrases.test.ts tests/score-geometry.test.ts`

---

### Task 3: Render a static accessible score and approved home semantics

**Files:**
- Create: `components/ui/CurvedScore.tsx`
- Modify: `components/pages/HomePage.tsx`
- Modify: `content/site.ts`
- Modify: `tests/home-hero.test.tsx`

**Interfaces:**
- Consumes: `ScorePhrase`, `buildStaffPaths`, and `placeNotes`.
- Produces: `<CurvedScore phrase activeNoteIndex reducedMotion />` and server-rendered home markup containing the default phrase.

- [ ] **Step 1: Change the home test first**

Require one H1 whose combined text is `Flute Lessons For Adults and Children`, one `/book` CTA in the hero, `data-musical-score`, `Play the phrase`, the two audience links after the manifesto, the existing Rhine image, and absence of old watercolor/WebGL hero markup.

- [ ] **Step 2: Run the focused home test and verify the expected assertion failure**

Run: `npm.cmd test -- tests/home-hero.test.tsx`

Expected: FAIL because the current hero still renders `Your Musical Companion` and `HomeHeroBackground`.

- [ ] **Step 3: Implement `CurvedScore`**

Render five staff paths, note groups with `data-note-index`, note heads/stems, a treble-clef-like SVG path, restrained dynamics text, and coral annotation arcs. Set decorative geometry to `aria-hidden="true"`; expose composer and work through a visible caption outside the decorative group.

- [ ] **Step 4: Replace the Home hero structure**

Keep `HomePage` a server component. Render:

```tsx
<h1 id="home-hero-title">
  <span>Flute Lessons</span>
  <span>For Adults and Children</span>
</h1>
<ButtonLink href="/book">{home.location.cta}</ButtonLink>
<MusicalScoreHero />
```

Retain the SEO-approved manifesto, adult/child links, Rhine block, and footer. Remove only obsolete home-background components from this page.

- [ ] **Step 5: Update home content**

Set `heroTitle` to `Flute Lessons` and `heroSubtitle` to `For Adults and Children`, without altering audience landing-page copy or metadata descriptions.

- [ ] **Step 6: Run the home and SEO tests**

Run: `npm.cmd test -- tests/home-hero.test.tsx tests/seo.test.ts tests/site-structure.test.ts`

Expected: PASS after adjusting only assertions made obsolete by the approved visual structure.

---

### Task 4: Add playback and synthetic flute audio

**Files:**
- Create: `lib/flute-player.ts`
- Create: `components/ui/MusicalScoreHero.tsx`
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `tests/e2e/site-smoke.spec.ts`

**Interfaces:**
- Consumes: `ScorePhrase` note events and `CurvedScore`.
- Produces: `createFlutePlayer(phrase, onNote): Promise<FlutePlayer>` and the interactive `MusicalScoreHero`.

```ts
export type FlutePlayer = {
  pause(): void;
  resume(): Promise<void>;
  start(): Promise<void>;
  stop(): void;
};
```

- [ ] **Step 1: Add a failing browser interaction assertion**

Require the initial button text `Play the phrase`; after click it becomes `Pause`; a second click becomes `Resume`; restarting after completion becomes `Replay`; and no `data-audio-started` marker exists before the first click.

- [ ] **Step 2: Run the focused browser check and verify failure**

Run: `npm.cmd run e2e:run -- --grep "musical score player"`

Expected: FAIL because the interactive player does not exist.

- [ ] **Step 3: Install Tone.js**

Run: `npm.cmd install tone`

Expected: `tone` is added to dependencies and the lockfile is updated.

- [ ] **Step 4: Implement the disposable Tone adapter**

Inside `createFlutePlayer`, call `await import("tone")` only from the user-started path, then build `FMSynth -> Vibrato -> Reverb -> Destination`. Schedule phrase notes on Tone's transport and mirror note changes through `Tone.Draw`. `pause` and `resume` control that transport; `stop` clears only this player's event ids, resets the transport position, and disposes the created nodes.

- [ ] **Step 5: Implement player state in `MusicalScoreHero`**

Use the states `idle | loading | playing | paused | complete | error`. Select a phrase after hydration, preserve the server default until selection, highlight the active note, cycle to the next phrase after replay, and expose a retryable text error without hiding the SVG.

- [ ] **Step 6: Re-run the focused browser check**

Run: `npm.cmd run e2e:run -- --grep "musical score player"`

Expected: PASS in Chromium; no audio starts before the click.

---

### Task 5: Match the approved layout responsively

**Files:**
- Modify: `app/globals.css`
- Modify: `components/layout/Footer.tsx` only if the comparison shows a mismatch.
- Modify: `tests/home-hero.test.tsx`

**Interfaces:**
- Consumes: the approved markup and existing local Garamond/UI fonts.
- Produces: desktop and mobile layouts matching the supplied concept.

- [ ] **Step 1: Add failing CSS contract assertions**

Require `.musical-home-hero`, `.musical-score-stage`, `.musical-score-player`, `.score-note[data-active="true"]`, a mobile breakpoint, a visible `:focus-visible` rule, and a `prefers-reduced-motion` override.

- [ ] **Step 2: Run the CSS-focused home test and verify failure**

Run: `npm.cmd test -- tests/home-hero.test.tsx`

- [ ] **Step 3: Add the minimum responsive CSS**

Use the existing parchment background, ink, coral accent, local display fonts,
`--unit-fx`, and existing button primitives. Target the supplied 1440 px rhythm,
then collapse title/score/player spacing below 860 px. Do not modify shared page
styles unless the home selector scopes the change.

- [ ] **Step 4: Add motion and focus safeguards**

Keep the play button focus ring visible. Under `prefers-reduced-motion: reduce`, remove score fades/transitions and keep instant active-note color changes.

- [ ] **Step 5: Run unit checks**

Run: `npm.cmd test -- tests/home-hero.test.tsx tests/score-geometry.test.ts tests/score-phrases.test.ts`

---

### Task 6: Integrated browser proof and regression checks

**Files:**
- Modify: `tests/e2e/site-smoke.spec.ts` only for verified home assertions.
- Create screenshots under Playwright's ignored output directory; do not add generated proof images to source control.

**Interfaces:**
- Consumes: complete home implementation.
- Produces: fresh desktop/mobile evidence and full verification output.

- [ ] **Step 1: Run static checks**

Run: `npm.cmd run typecheck`

Run: `npm.cmd run lint`

Run: `npm.cmd test`

Expected: zero errors and all tests passing.

- [ ] **Step 2: Run the production build**

Run: `npm.cmd run build`

Expected: exit code 0 and successful static generation for existing routes.

- [ ] **Step 3: Run browser tests**

Run: `npm.cmd run e2e:run`

Expected: all configured browser checks pass, including `/`, `/about`, `/classes`, `/media`, `/book`, audience pages, legal pages, and negative locale routes.

- [ ] **Step 4: Inspect desktop and mobile renders**

Start `npm.cmd run dev`, capture `/` at 1440×2200 and 390×844, and compare against `D:/Downloads/agatha website/1440_main.png`. Check score clipping, type hierarchy, CTA alignment, footer spacing, play states, and the Rhine image.

- [ ] **Step 5: Verify accessibility-affecting states**

Tab to the player and CTA controls, confirm visible focus, set reduced motion, confirm no autoplay, and verify the text status changes independently of color.

- [ ] **Step 6: Review the integrated diff**

Run: `git diff --check`

Run: `git status --short --branch`

Confirm that no pre-existing dirty file outside the approved Home/SEO overlap was overwritten and report all remaining changes without committing them.
