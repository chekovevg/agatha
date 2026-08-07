# English Online Flute SEO Design

## Decision

Optimize the English-only site for private online flute lessons aimed at:

- adults who are beginning, returning to the flute, or continuing their studies;
- parents seeking structured private flute lessons for a child.

The site should qualify students through Agatha's academic background,
individual teaching, healthy technique, and clear progress. It should not
compete on low price or use artificial keyword repetition.

This release also adds transparent, self-reported lead attribution so the next
inquiry can identify how the student remembers finding Agatha. It does not add
hidden referrer persistence or cross-page UTM storage; the separate
consent-gated GA4/GTM integration remains independent.

## Search Architecture

Keep the existing routes and add two focused landing pages:

- `/online-flute-lessons-for-adults`
- `/online-flute-lessons-for-children`

The home page remains the brand entry point. `/classes` remains the complete
catalogue for flute, recorder, piccolo, music theory, ear training, and music
history. `/about` remains the main evidence page for Agatha's education and
teaching experience.

The two new pages must contain distinct, useful content rather than duplicating
the same sales copy with a changed audience label.

## Home and Navigation Integration

Use `Flute & Music Teacher` as the visually dominant home H1 and
`For Adults and Children` as its subtitle. Keep the hero static and
typographic, with no canvas, WebGL, audio, or musical-staff interaction.
Preserve `online flute lessons` in metadata, supporting copy, and the
audience landing pages so the more personal home positioning does not replace
the transactional search language.

Shorten the home page to this order:

1. plain hero with a primary `Get in Touch` action linking to `/book`;
2. manifesto heading `Music becomes possible when it is explained with care
   and practised with patience.` and subtitle `Agatha teaches through small
   realistic steps — helping students build confidence, sound and musical
   understanding.`;
3. two compact existing-style buttons labelled `For adults` and `For children`;
4. the `From the Rhine, online` location section with the shortened body
   `Agatha is based in the Cologne–Düsseldorf area and teaches students online
   in Russian, English and German.`;
5. footer.

Place the two audience buttons directly below the manifesto copy. Link them to
the two audience landing pages. Do not keep a separate `Find the right lesson`
heading or the audience cards. Remove the home Values section and the final
Agatha quote section from the rendered page.

Keep only `About me`, `Classes`, and `Media` in the primary header and footer
navigation, matching the supplied 1440 px reference. Keep descriptive links to
both audience pages on the home page and within the relevant flute entry on
`/classes`, so the landing pages remain internally discoverable without
crowding global navigation.

Use `Intro Call` for the header booking action and keep its arrow. Use the exact
label `Get in Touch` for both the hero and location booking actions.

The intended journey is:

`Home -> audience landing page -> trial lesson booking`

## Adult Landing Page

The adult page addresses complete beginners, returning players, and continuing
students. It should explain:

- who the lessons are for;
- common goals and obstacles for adult learners;
- tone, breathing, posture, technique, reading, and repertoire;
- how an online private lesson works;
- how the plan adapts to the student's level and available practice time;
- Agatha's relevant education and teaching experience;
- practical questions before a trial lesson;
- one clear booking action.

Within the first one or two screens, answer in this order: who the lessons are
for, what happens in lessons, why Agatha is the right teacher, and what the
visitor should do next. Longer teaching philosophy, technique detail, and FAQ
content belong below this direct introduction.

The page should sound serious and welcoming. It must not promise guaranteed
results or invent credentials, outcomes, prices, or testimonials.

## Children Landing Page

The children page speaks primarily to parents and uses the existing supported
age range, starting at age six. It should explain:

- suitability for beginners and continuing young players;
- structured, patient teaching and healthy playing habits;
- age-appropriate goals and repertoire;
- short practice notes and materials after lessons;
- the parent's role before and between online lessons;
- Agatha's experience teaching children;
- practical questions before a trial lesson;
- one clear booking action.

Within the first one or two screens, answer in this order: who the lessons are
for, what happens in lessons, why Agatha is the right teacher, and what the
parent should do next. Longer teaching philosophy, technique detail, and FAQ
content belong below this direct introduction.

The page must not make unverified safeguarding, certification, exam-result, or
student-outcome claims.

## Technical SEO

Use the existing Next.js metadata APIs and current site helpers. Do not add a
dependency.

- Set a site-wide metadata base and title template.
- Give every public editorial page a specific title, description, canonical
  URL, Open Graph data, and Twitter card data.
- Reuse a suitable existing Agatha image for social previews.
- Use `Agatha Gurko` as the canonical public name and correct the footer's
  `Agata Gurko Music` spelling to `Agatha Gurko Music`.
- Add one canonical JSON-LD `Person` with
  `@id: https://www.agathamusic.com/#agatha-gurko`, `name: Agatha Gurko`,
  `alternateName: Agafiia Gurko`, and `jobTitle: Flutist and music teacher`.
  Use `https://www.lessonface.com/instructor/agafiia-gurko` as its only initial
  `sameAs` value. Do not use the temporary LvDM listing as an identity URL.
- Add one `WebSite` entity that refers to the canonical Person, plus one
  `Service` on each landing page. Each Service must reference the same Person
  `@id` as its provider, so the graph does not create duplicate Agatha entities.
  Name the services `Private Online Flute Lessons for Adults` and `Private
  Online Flute Lessons for Children`. Escape serialized JSON-LD before
  rendering it.
- Add both landing pages to the existing sitemap.
- Keep the existing permissive robots policy for public content.
- Remove the placeholder legal pages from the sitemap and mark them `noindex`
  until reviewed production text is supplied. Keep them crawlable so search
  engines can read the `noindex` directive; do not add a robots.txt `Disallow`.
  Do not edit or invent legal text.
- Add exact permanent redirects for the five formerly published English URLs:
  `/en` to `/`, `/en/about` to `/about`, `/en/classes` to `/classes`, `/en/media`
  to `/media`, and `/en/book` to `/book`. Do not add a wildcard locale redirect.
- Do not add a `keywords` meta tag, FAQ rich-result markup, fake ratings,
  doorway pages, or location pages for places where no local service is
  offered.

## Lead Attribution

Add an optional, visible `How did you find Agatha?` field to the contact form.
Use `Google or another search engine`, `Lessonface`, `Recommendation`, `Social
media`, `Another website or profile`, and `Other` as the options, and include
the answer in the existing contact notification email. Validate it at the API
boundary and preserve the form's existing spam and error behavior.

Configure the same optional question in the existing Cal.com event separately
from the codebase. Do not add GTM, hidden referrer collection, cross-page UTM
persistence, cookies, or personal data to analytics as part of this release.
Vercel Analytics remains the aggregate traffic-source tool; the optional field
is the lead-level, self-reported source.

## Content Ownership

Keep marketing copy in `content/` and render it through focused page
components. Reuse the existing header, footer, buttons, typography, spacing,
and editorial visual language. No CMS, blog system, localization, custom
booking system, or new runtime dependency is part of this change.

## Verification

Add the smallest regression coverage for:

- the two routes and their visible audience-specific headings;
- home and classes links to both routes, plus their deliberate omission from
  the compact header and footer navigation;
- unique metadata and canonical URLs;
- JSON-LD serialization and core entity fields;
- sitemap inclusion and legal-placeholder exclusion;
- `noindex` metadata on both placeholder legal pages;
- exact permanent responses for the five legacy `/en` routes and continued 404
  behavior for unknown locale-prefixed paths;
- optional attribution validation and inclusion in contact notification email.

Run:

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd test
npm.cmd run build
npm.cmd run e2e:run
```

Perform rendered browser QA on desktop, tablet, and mobile. Confirm that the
hero remains plain and static, the manifesto buttons are visible and usable,
the trimmed section order matches the approved reference, the compact desktop
header does not overlap the logo or booking action, and the mobile menu remains
keyboard accessible. Confirm both landing pages lead to booking, the rendered
HTML contains the intended visible H1, metadata, and JSON-LD, and the legal
pages remain reachable while advertising `noindex`.

## Release Follow-up

Code changes alone cannot ensure indexing or ranking. The branded production
domain is already live with `https://www.agathamusic.com` as the canonical
origin. After deployment, verify `agathamusic.com` as a Google Search Console
Domain Property, submit the production `/sitemap.xml`, and inspect the home
page and both audience landing pages. Domain Property coverage includes host
variants while canonical metadata and the sitemap continue to use the single
`www` production origin.

Monitor indexing, search queries, impressions, landing-page traffic, and
self-reported lead sources over the following weeks. Review real mobile Core
Web Vitals in Speed Insights before changing fonts or preloads. Do not expand
into German localization, a blog, local doorway pages, or additional
lesson-service pages until observed demand justifies the work.
