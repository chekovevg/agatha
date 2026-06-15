# Agatha Editorial Site Structure Design

## Decision

Move the public site from the compact dashboard direction into the Figma editorial
system for `Agatha Music`.

The Figma `Classes` screen is the visual source of truth for the first pass:
warm paper canvas, muted brown text, large serif headings, mono UI labels, soft
pill buttons, watercolor lesson images, and sparse editorial spacing.

## Public Structure

- `/[locale]` becomes a focused home cover.
- `/[locale]/classes` presents lesson types.
- `/[locale]/about` contains biography, education, teaching principles, values,
  reviews and FAQ material from the old full profile.
- `/[locale]/media` contains the open lesson, media gallery, lesson examples and
  performance/photo material.
- `/[locale]/book` remains the Cal.com booking surface.

The old `/[locale]/full` profile is no longer the main information container.
Its content is distributed across the new pages.

## Home

The homepage should answer who Agatha is and where to go next, not repeat every
section.

Primary message:

> Germany-based, Moscow-trained flutist and music teacher

Supporting message:

> Online flute, recorder and music theory lessons in Russian, English and
> German.

The first screen should include:

- brand header with `About me`, `Classes`, `Media`, and `Book Trial Class`
- one real or placeholder teacher image
- the main positioning line
- trust line: teaching since 2014, children and adults, online lessons
- three editorial entry links for Classes, About me and Media
- booking CTA

## Classes

Use the Figma page pattern directly:

- large centered heading
- repeated lesson rows
- image slot on the left
- class name and pill CTA in the middle
- description on the right

Lesson types come from existing `content.lessons`. The first pass should keep:
Flute, Recorder, Piccolo, Music Theory, Ear Training and Solfege, and Music
History if the content remains useful.

## About Me

Move old long-profile content here:

- biography from `about`
- trust strip facts
- method/principles
- review summaries
- FAQ

This page should stay editorial, not card-heavy. Use section breaks, columns and
text hierarchy rather than dashboard panels.

## Media

Move old media content here:

- open lesson video preview
- media gallery
- lesson materials/photos
- future performance media

Do not auto-load third-party video embeds before user interaction.

## Implementation Boundaries

- Keep Cal.com and Resend behavior unchanged.
- Do not edit legal production text.
- Do not add a CMS, database, auth, payments or custom calendar.
- Do not add dependencies.
- Preserve multilingual routing for `en`, `de`, and `ru`.
- Keep content separation in `content/`.

## Verification

Run:

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd test
npm.cmd run build
```

Browser QA:

- `/` redirects to `/en`.
- `/en`, `/de`, `/ru` render the new home.
- `/en/classes`, `/en/about`, `/en/media` render.
- `/en/book` still renders booking.
- `/impressum` and `/datenschutz` still render.
- mobile width has no horizontal overflow or overlapping text.
