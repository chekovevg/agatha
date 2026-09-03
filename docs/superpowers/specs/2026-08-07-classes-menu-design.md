# Classes menu design

## Scope

Add the Figma `Menu item`, `Card menu`, and `Menu section` interaction to the existing desktop header. Do not create lesson detail pages or change the mobile navigation structure.

## Content

- Use the existing five lessons: Flute, Recorder, Piccolo, Music Theory, and Solfege.
- Rename the current `Ear Training & Solfege` lesson to `Solfege` at its shared content source.
- Store each lesson image path with the lesson content so the Classes page and header menu use the same title, description, and image data.
- Keep the existing `ear-training` slug and image filename; changing URLs or asset names is outside scope.

## Desktop interaction

- At widths above 860px, the existing Classes navigation link opens the menu on pointer hover or keyboard focus while still linking to `/classes` when activated.
- Match the Figma layout: a centered 698px-wide light panel beneath the header, a 307px lesson column, and a 333px preview card.
- Flute is the initial preview. Hovering or focusing a lesson updates the preview image, title, and description.
- The active lesson item reveals a right chevron. Hovering or focusing the preview card reveals its chevron and underlines its title.
- Open and close with a short opacity/vertical-translation transition. Disable decorative motion when reduced motion is requested.
- Escape closes the menu and returns focus to the Classes link.

## Navigation

- The header Classes link and `All classes` link both navigate to `/classes`.
- Lesson items and the preview card navigate to `/about?subject=<lesson title>#contact`.
- The contact form reads the `subject` query parameter on the client and pre-fills its existing Subject input. The value remains editable.

## Mobile behavior

At 860px and below, keep the existing full-screen mobile menu and its direct Classes link. Do not render the desktop lesson panel.

## Components and data flow

- Add one focused client component for the desktop Classes menu under `components/layout/`.
- The Header passes `content.lessons` to it instead of maintaining duplicate lesson copy.
- Extend the existing `Lesson` content type with its local image path and update the Classes page to consume that field.
- Use the already-installed Next.js Image component and existing local assets; add no dependencies or generated icons.

## Verification

- Add focused browser coverage for pointer opening, lesson preview switching, link destinations, keyboard focus, Escape, and unchanged mobile navigation.
- Run typecheck, lint, relevant Vitest tests, production build, and the affected Playwright checks.
- Inspect the rendered menu at desktop and mobile viewport sizes against the supplied Figma frame and screenshot.
