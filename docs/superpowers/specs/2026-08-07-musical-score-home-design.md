# Musical Score Home — Design Specification

## Goal

Rebuild the home page to match the approved 1440 px concept while preserving
the current uncommitted SEO work: one descriptive H1, adult and child landing
page links, the trimmed three-section home structure, metadata, sitemap, and
existing booking routes.

The hero must add the reference site's memorable behaviour: a curved musical
score that can change shape and play a short flute phrase with synchronized
note highlighting. The primary conversion remains the intro-call/booking flow.

## Current State and Git Safety

- The SEO work is not on a separate branch. It is an uncommitted working tree
  on local `main`, which is 17 commits ahead of `origin/main`.
- The existing baseline passes 118 Vitest tests across 19 files.
- Implementation will create `codex/home-score-experience` from the current
  checkout so all existing uncommitted SEO changes remain present.
- No existing work will be reset, stashed, reformatted, or discarded.
- No commit, merge, push, or deployment is included without an explicit user
  request.

## Considered Approaches

### 1. Responsive SVG plus Tone.js — selected

Generate five curved staff lines and notation marks as SVG geometry. Place each
note from a small phrase data set along the same centerline, using the curve
tangent and normal for rotation and pitch offset. Tone.js schedules the same
events and exposes the current note for highlighting.

This provides crisp responsive rendering, deterministic tests, keyboard-safe
controls, and enough performance for a few dozen notes without a rendering
engine.

### 2. Canvas 2D plus Tone.js

Closer to the reference site's implementation and useful for hundreds of
animated marks, but less inspectable, harder to make sharp at every device
pixel ratio, and unnecessary for the approved visual density.

### 3. Pre-rendered score images plus audio

Lowest implementation risk, but it cannot convincingly change shapes or
highlight individual notes. It does not deliver the agreed interaction.

## Page Structure

The home page keeps only these blocks:

1. Fixed editorial header.
2. Hero with `Flute & Music Teacher`, `For Adults and Children`, booking CTA, curved
   score, and `Play the phrase` control.
3. Teaching manifesto with links to the adult and child SEO landing pages.
4. `From the Rhine, online` location block with the existing Cologne artwork
   and booking CTA.
5. Compact editorial footer.

The removed values, quote, portrait, lesson-grid, review, and other legacy home
blocks stay removed.

## SEO and Content Semantics

- The hero has exactly one visible H1. Its styled lines together read
  `Flute & Music Teacher For Adults and Children`; the full accessible and
  indexable positioning remains in that H1. The metadata and audience landing
  pages retain the more transactional `online flute lessons` wording.
- The manifesto retains one link each to
  `/online-flute-lessons-for-adults` and
  `/online-flute-lessons-for-children`.
- Existing audience pages, metadata utilities, sitemap entries, legal pages,
  contact handling, and booking architecture are unchanged.
- Marketing copy remains in `content/site.ts`; score repertoire metadata and
  note events live in a small dedicated content module.
- CTA labels use the current SEO decision: `Intro Call` in the header and
  `Get in Touch` in the hero/location buttons. No trial-lesson language is
  introduced.

## Score Experience

### Repertoire

V1 contains three curated phrases of approximately 8–12 seconds. Each phrase
stores:

- composer and work title;
- source/licence note;
- tempo;
- note pitch, start time, duration, and emphasis;
- one of three authored curve profiles.

Only public-domain notation or notation with a compatible explicit licence is
used. The site does not reuse third-party performance recordings. Source and
licence attribution is kept in the repository and exposed in compact on-page
information where the licence requires it.

### Rendering

- The score is an inline responsive SVG with a stable `viewBox`.
- A lightweight geometry helper samples an authored centerline and produces
  staff paths plus note positions.
- Note heads, stems, beams, clef-like ornament, dynamics, and coral editorial
  annotations use SVG primitives. A full engraving engine and SMuFL font are
  out of scope for V1.
- One phrase is selected after hydration and fades in, avoiding server/client
  markup mismatch. A new phrase and shape is selected after replay/phrase
  completion.
- Without JavaScript, the SVG still renders its default phrase and all booking
  content remains available.

### Audio

- Tone.js is dynamically imported only after the user activates `Play`.
- The flute-like patch uses a soft sine/FM voice, restrained breath noise,
  subtle vibrato, and short reverb. No sample pack is shipped in V1.
- The same note-event array drives audio scheduling and visual highlighting.
- States are `Play`, `Pause`, `Resume`, and `Replay`. Starting audio always
  requires a user gesture; there is no autoplay.
- Audio nodes, timers, and animation frames are disposed on unmount and after
  playback.
- If the synthetic timbre is not convincing in browser QA, the later upgrade
  is limited to replacing the sound source with a small CC0 Tone.Sampler set;
  the score and timing architecture remain unchanged.

## Responsive and Accessible Behaviour

- Desktop follows the approved 1440 px composition and generous vertical
  rhythm.
- Mobile keeps the title and CTA above the score, scales the score within the
  viewport, and places the play control directly below it.
- The player is a native button with visible focus, descriptive state labels,
  and `aria-pressed`/status text where appropriate.
- Decorative score details are hidden from assistive technology; the phrase
  title and playback state are textual.
- `prefers-reduced-motion` removes fades and animated note progression while
  retaining manual audio playback and a static current-note indication.
- Tone failures leave the page intact and show a short retryable status beside
  the play control.

## Component Boundaries

- `HomePage`: server-rendered page structure and content.
- `MusicalScoreHero`: client boundary for phrase selection and playback state.
- `CurvedScore`: pure responsive SVG renderer.
- `score-geometry`: pure curve sampling and note-position functions.
- `score-phrases`: typed repertoire metadata and note events.
- `flute-player`: small Tone.js adapter created on demand.

No CMS, database, API route, MIDI parser, notation engine, WebGL pipeline, or
general-purpose audio framework is added beyond Tone.js itself.

## Testing and Verification

Implementation follows test-first cycles for pure score geometry, phrase data,
server-rendered home semantics, and player state transitions. Tone integration
is kept behind the small adapter so tests exercise state without loading an
audio context.

Final verification includes:

- Vitest, typecheck, lint, and production build;
- rendered browser inspection of `/` at desktop and mobile viewports;
- keyboard focus and play/pause/replay behaviour;
- reduced-motion behaviour and no-autoplay confirmation;
- existing adult/child SEO routes and single-H1 assertions;
- visual comparison against `D:/Downloads/agatha website/1440_main.png`.

## Out of Scope

- Authentic multi-sampled flute recordings;
- arbitrary uploaded MIDI or notation;
- generative composition;
- automatic transcription;
- an admin repertoire editor;
- exact reproduction of the reference site's internal rendering technology.
