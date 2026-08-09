# Classes and booking flow design

## Scope

Implement the approved Classes dropdown, simplify the Classes catalog, and make one booking page switch between Intro Call and Music Lesson. The experimental WebGL, canvas, musical-score, and hero work remains isolated on `codex/home-score-experience` and is not part of this change.

## Interaction

- Header, home, audience, and footer intro CTAs open `/book?type=intro`.
- A specific class opens `/book?type=lesson&subject=<lesson title>`.
- The booking page includes one two-option switch. Each option updates the URL, visible heading, supporting copy, steps, and Cal.com event.
- Intro Call uses `https://cal.com/agafiia-gurko/intro-call`; Music Lesson uses the verified `https://cal.com/agafiia-gurko/music-lesson` event.
- Unknown or missing `type` values default to Intro Call. Only known lesson titles are displayed as selected subjects.

## Classes

- Catalog order: Flute, Recorder, Piccolo, Music Theory, Solfege.
- Remove Music History and the For adults / For children links from class cards.
- Every card uses the eyebrow `Music lesson` and CTA `Book a lesson`.
- Menu assets, titles, and descriptions come from the same typed lesson catalog as the Classes page.

## Dropdown motion

- Match Figma node `2059:227` for layout and the live Microsoft AI reference for motion.
- Open/close with `opacity` and center-origin `clip-path` over `0.8s` using `cubic-bezier(0.43, 0.195, 0.02, 1)`.
- Preserve keyboard focus, Escape handling, mobile navigation, and reduced-motion behavior.

## Booking and footer layout

- Remove the booking section's top border and extra outer card background/shadow around the Cal embed.
- Keep the fixed header clear of the booking heading.
- Keep the existing `site-release` footer structure because it already matches Figma node `2059:109`; verify it visually rather than rewriting it.

## Verification

- Vitest covers catalog content and server-rendered links/copy.
- Playwright covers menu motion states, specific-class routing, both booking modes, switch behavior, mobile navigation, and footer alignment.
- Run typecheck, lint, unit tests, build, and browser smoke tests; inspect desktop and mobile renders.
