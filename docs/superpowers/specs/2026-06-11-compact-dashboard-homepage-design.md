# Compact Dashboard Homepage Design

## Context

The current MVP homepage is a long landing page with many sections: hero, trust,
lessons, about, method, video, media, reviews, booking, FAQ, contact and footer.
That structure is useful as a full profile, but it asks new visitors to scroll
too much before they can answer the real decision questions.

The teacher-choice research supplied for this project points to a sharper
homepage goal: people are not choosing the most decorated teacher in the
abstract. They are trying to reduce risk:

- Is this teacher right for me or my child?
- Can I trust her?
- What will happen in the first lesson?

## Decision

Use a compact dashboard as the primary localized homepage.

- `/en`, `/de`, `/ru` become the new compact dashboard experience.
- `/en/full`, `/de/full`, `/ru/full` preserve the current long-form page as the
  accessible full profile copy.
- The existing legal, booking, API, locale, Cal.com and Resend architecture
  stays unchanged.
- The old long-form content is not deleted; it is moved behind a clear secondary
  path.

## Primary Homepage Model

The homepage should feel like a focused teacher profile, not a marketing
landing page.

Desktop first viewport:

- Header with brand, locale switcher and primary booking CTA.
- Teacher identity block:
  - Agathe G. Musik
  - concise positioning line
  - one short trust sentence
  - primary CTA: book a trial lesson
  - secondary CTA: ask a question or open full profile
- Media block:
  - real photo or video preview when available
  - temporary SVG media can remain for beta if explicitly accepted
- Compact evidence grid:
  - suitable for
  - lesson style
  - trial lesson agenda
  - proof / reviews
- Small practical strip:
  - languages
  - formats
  - current booking path
  - experience signal

Mobile:

- Keep the same information order, but stack it.
- The booking CTA should remain visible near the top.
- Avoid hiding the core “fit / trial / trust” information behind too many taps.

## Dashboard Content Blocks

### Suitable For

This block answers: “Is this for me?”

Use short, scannable fit statements:

- children and teenagers who need patient structure
- adult beginners who want to start without shame or pressure
- flute, recorder, piccolo and theory students
- students who want explanations in Russian, English or German

Avoid broad generic claims such as “for everyone”.

### Lesson Style

This block answers: “What will lessons feel like?”

Use style tags and one explanatory sentence:

- calm
- structured
- attentive
- practical
- healthy technique
- clear practice notes

The tone should reduce anxiety, not oversell.

### Trial Lesson

This block answers: “What happens first?”

Use the trial as a product:

1. Meet and clarify the goal.
2. Check level, breathing, posture, sound, rhythm or theory needs.
3. Try a short learning activity.
4. Leave with notes and a realistic next-step recommendation.

This block must link to `/[locale]/book` or the Cal.com booking surface.

### Trust / Proof

This block answers: “Can I trust her?”

Use concise proof, not a CV dump:

- teaching since 2014
- students aged 6-60
- music schools, private lessons and online lessons
- academic flute background
- student-review themes such as clear explanations and patient support

Detailed biography and full method can live on `/[locale]/full`.

## Full Profile Route

The full profile route keeps the current long-form page available:

- `/en/full`
- `/de/full`
- `/ru/full`

It should reuse the existing long homepage sections with minimal changes.

The compact dashboard links to the full profile through a secondary text link,
for example:

- `Read the full profile`
- `See lesson details`
- `More about Agathe's method`

The full profile should still include booking and contact CTAs, but it is not
the primary conversion path.

## Navigation

The compact homepage should not keep the old long-scroll nav as-is. Anchors like
`#lessons`, `#method`, `#reviews`, and `#media` become less meaningful on the
new primary route.

Recommended primary nav:

- Lessons
- Trial lesson
- Reviews
- Full profile
- Contact

For beta, these can point to dashboard blocks, `/[locale]/book`,
`/[locale]/full`, and the contact block.

## Content Strategy

The first screen should use decision-language rather than resume-language.

Prefer:

> Flute, recorder and music theory lessons for students who need calm structure,
> clear next steps and a teacher who notices how they learn.

Avoid:

> Agathe is an experienced teacher with a strong academic background and many
> years of experience.

Credentials still matter, but they should support fit and trust rather than
dominate the first screen.

## Implementation Boundaries

In scope for the implementation plan:

- Add localized `/[locale]/full` routes that render the existing long-form page.
- Replace `/[locale]` with a compact dashboard composition.
- Add any small content fields needed for dashboard blocks.
- Update navigation links to make sense for compact and full profile routes.
- Keep Cal.com and Resend integration unchanged.
- Keep legal pages unchanged.
- Preserve SEO metadata and localized canonical URLs.

Out of scope for this pass:

- New domain/legal text.
- New real photography or video production.
- Full visual rebrand.
- CMS, database, admin, auth or payments.
- A multi-teacher marketplace or real matching algorithm.

## Verification

Local checks:

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd test
npm.cmd run build
```

Manual/browser QA:

- `/` still redirects to `/en`.
- `/en`, `/de`, `/ru` render compact dashboard pages.
- `/en/full`, `/de/full`, `/ru/full` render the preserved long profile.
- `/en/book` still renders Cal.com booking.
- Contact form still sends through Resend.
- Locale switcher works on compact and full pages.
- Mobile first viewport is useful without long scrolling.
- No core text overlaps at mobile or desktop widths.
- Sitemap includes the new localized full-profile routes if they are public.

## Open Questions For Implementation

- Should the compact dashboard include a small embedded contact form, or only a
  link to the contact area/full profile?
- Should `/[locale]/full` be indexed in the sitemap, or should it stay as a
  secondary but public profile route?
- If prices are not ready, should the dashboard explicitly say “trial lesson via
  Cal.com” without showing price?
