# Booking Tab Menu and Menu Fidelity Design

## Goal

Bring the Classes menu and booking page back into alignment with the current
Figma system and the Microsoft AI reference without replacing Cal.com as the
booking authority.

## Approved scope

- Keep the current header booking CTA unchanged.
- Use Red Hat Mono for the Classes menu and the new booking tabs.
- Give the Classes `Menu section` the exact same desktop shadow as the header.
- Replace the two booking pill links with the Figma `Tab Menu` component.
- Recompose `/book` as one centered vertical flow.
- Keep the existing Cal.com inline embed and event URLs.
- Do not add Cal.com Booker Atoms or another booking dependency.
- Do not delete the existing booking-step content, but do not render the step
  cards on the booking page in this iteration.

## Visual contract

### Shared shadow

The desktop header and Classes `Menu section` use one shared shadow token:

```css
0 3px 100px 8px rgba(0, 0, 0, 0.12)
```

The header continues to have no shadow at the existing mobile breakpoint. The
Classes menu remains desktop-only, so no new mobile shadow behavior is needed.

### Mono typography

The current Figma text style is the implementation source of truth:

- family: Red Hat Mono
- weight: 400
- medium size: 16px
- medium line-height: 16px
- small size: 14px
- small line-height: 19.6px
- tracking: -0.21px

Geist Mono is removed from the root font setup. Existing header and footer
typography remain Red Hat Mono.

### Tab Menu

Source: Figma node `2069:857` in file `314E0PxdPGZBO124xOAELq`.

- outer width: 366px on desktop, constrained to the available width on mobile
- outer padding: 12px
- outer radius: 5px
- outer background: `#F7F1E4`
- tab height: 38px
- tab horizontal padding: 30px
- tab radius: 3px
- active background: `#FEF9EE`
- inactive background: transparent against the outer surface
- labels: `Intro Call` and `Music Lesson`

The component is a navigation tab list made from links because changing the
booking type changes the URL. The current link carries `aria-current="page"`.
Keyboard focus remains visible and each tab is one tab stop.

## Booking page composition

`/book` becomes a centered vertical sequence:

1. One H1: `Book a Call`.
2. Centered `Tab Menu`.
3. Mode-specific description.
4. Optional selected-class line for lesson links that include a valid subject.
5. A wide Cal.com inline embed.
6. The existing normal Cal.com fallback link below the embed.

The intro and lesson routes remain:

- `/book?type=intro`
- `/book?type=lesson`
- `/book?type=lesson&subject=<valid class>`

Unknown booking types still fall back to Intro Call. Invalid subjects are
ignored. A valid subject supplied by a class link remains attached to the
Music Lesson route and Cal.com notes.

The content column is centered. The embed receives enough desktop width for
Cal.com's own responsive booker to place its calendar and time-slot list in its
native horizontal arrangement when available. The site does not reach inside
the third-party embed to reorder its controls.

The current four step cards are omitted from the rendered page to keep the
approved order clear. Their content remains in `content/site.ts` for a later
layout decision.

## Cal.com integration

The existing official inline loader, booking-success analytics, UTM forwarding,
notes prefill, and fallback links remain intact. The embed UI is configured to
hide Cal.com's duplicate event-details panel and keep the timezone control
available, leaving the site heading, tabs, and description as the page-level
context.

## Responsive behavior

- Desktop and tablet: centered heading and description; tabs remain 366px;
  embed expands within the page's centered maximum width.
- Mobile: Tab Menu shrinks to the available content width, both tabs share the
  row without overflow, and the Cal embed keeps its native stacked layout.
- No horizontal page overflow at 390px.

## Verification

- Regression test the Red Hat Mono family and current Figma sizes.
- Regression test identical computed shadows for the header and Classes menu.
- Regression test `Book a Call`, active tab state, route switching, subject
  preservation, and the relevant Cal.com event link.
- Run typecheck, lint, unit tests, production build, and the full browser suite.
- Visually compare the Tab Menu to the Figma screenshot at desktop and mobile.
- Verify Classes menu hover behavior and Cal embed/fallback behavior remain
  intact.

## Out of scope

- Cal.com Booker Atoms or a custom booking calendar.
- Changes to Cal.com availability, billing, event configuration, or secrets.
- New lesson detail pages.
- Redesigning the header CTA.
- Final placement or redesign of the booking step cards.
