# English Online Flute SEO Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add two high-intent English flute lesson landing pages, integrate them into the editorial site, improve technical SEO and entity markup, preserve legacy English URLs, and capture a transparent self-reported lead source.

**Architecture:** Keep the static-first App Router architecture and existing content separation. Add one shared server-rendered audience page backed by two distinct content objects, extend the existing SEO helper with complete metadata and JSON-LD builders, and add attribution to the existing Zod/Resend flow. The root title template receives only unbranded child titles; home uses `title.absolute`.

**Tech Stack:** Next.js 16.2.10 App Router, React 19.2.7, TypeScript 5, Tailwind CSS 4, Zod 4, Resend, Vitest 4, Playwright 1.60.

## Global Constraints

- Keep English-only, unprefixed canonical routes.
- Add no dependency, CMS, database, tracker, GTM, cookie, custom booking system, or localization layer.
- Use `Agatha Gurko` as the public name and `Agafiia Gurko` only as an alternate name.
- Do not invent credentials, prices, testimonials, outcomes, legal text, or safeguarding claims.
- Keep marketing copy in `content/` and reuse the current editorial design system.
- Keep the Cal.com embed unchanged; its attribution question is an external account-level action.
- Preserve user-owned changes in `app/globals.css`, `tests/home-hero.test.tsx`, and unrelated untracked files.
- Do not commit, stage, push, deploy, or mutate external services automatically.

## File Map

- `content/types.ts`, `content/site.ts`: audience page model and distinct adult/children copy.
- `components/pages/AudienceLessonPage.tsx`: shared server-rendered page structure.
- `app/online-flute-lessons-for-adults/page.tsx`, `app/online-flute-lessons-for-children/page.tsx`: static routes and metadata.
- `components/pages/HomePage.tsx`, `components/pages/ClassesPage.tsx`, Header, Footer: discoverable internal links and visible service H1.
- `lib/seo.ts`, `app/layout.tsx`: page metadata, title rules, JSON-LD graph, safe serialization.
- Sitemap, legal routes, and `next.config.ts`: index hygiene and exact redirects.
- Contact form, validator, and Resend helper: optional self-reported attribution.
- Existing Vitest and Playwright files: direct regression coverage.

---

### Task 1: Audience content, routes, and internal navigation

**Files:**
- Modify: `content/types.ts`
- Modify: `content/site.ts`
- Create: `components/pages/AudienceLessonPage.tsx`
- Create: `app/online-flute-lessons-for-adults/page.tsx`
- Create: `app/online-flute-lessons-for-children/page.tsx`
- Modify: `components/pages/HomePage.tsx`
- Modify: `components/pages/ClassesPage.tsx`
- Modify: `components/layout/Header.tsx`
- Modify: `components/layout/header-state.ts`
- Modify: `components/layout/useHeaderController.ts`
- Modify: `components/layout/Footer.tsx`
- Modify: `tests/site-structure.test.ts`
- Modify: `tests/home-hero.test.tsx`
- Modify: `tests/footer.test.tsx`
- Modify: `tests/header-state.test.ts`

**Interfaces:**
- Produces: `AudienceLessonContent` and `siteContent.audienceLessons.adults|children`.
- Produces: `/online-flute-lessons-for-adults` and `/online-flute-lessons-for-children`.
- Produces: one visible H1 per route and links to both audience pages from home, classes, header, and footer.

- [ ] **Step 1: Write failing structure and render assertions**

Update `tests/site-structure.test.ts` to expect both route files and navigation in this exact order:

```ts
expect(siteContent.nav).toEqual([
  {label: "About me", href: "/about"},
  {label: "Classes", href: "/classes"},
  {label: "For adults", href: "/online-flute-lessons-for-adults"},
  {label: "For children", href: "/online-flute-lessons-for-children"},
  {label: "Media", href: "/media"},
]);
```

Render `HomePage`, `ClassesPage`, both audience variants, and `Footer` in the existing static-markup tests. Assert the home slogan is not an H1, the visible H1 is `Private Online Flute Lessons for Adults and Children`, adult/children pages have distinct titles and copy, and all four surfaces link to both routes. Update `tests/header-state.test.ts` so 860px is mobile and 861px permits desktop hide-on-scroll.

- [ ] **Step 2: Run focused tests and verify RED**

```powershell
npm.cmd test -- tests/site-structure.test.ts tests/home-hero.test.tsx tests/footer.test.tsx tests/header-state.test.ts
```

Expected: failures for missing routes/content, old nav, slogan H1, missing links, and the old 600px header threshold.

- [ ] **Step 3: Add the explicit content model**

Add this type and `audienceLessons: {adults; children}` to `SiteContent`:

```ts
export type AudienceLessonContent = {
  path: "/online-flute-lessons-for-adults" | "/online-flute-lessons-for-children";
  navLabel: "For adults" | "For children";
  eyebrow: string;
  title: string;
  intro: string;
  trustLine: string;
  cardCopy: string;
  audienceHeading: string;
  audienceCopy: string;
  audiencePoints: string[];
  lessonsHeading: string;
  lessonsCopy: string;
  lessonFocus: {title: string; text: string}[];
  whyHeading: string;
  whyParagraphs: string[];
  faq: {question: string; answer: string}[];
  ctaHeading: string;
  ctaCopy: string;
  seo: {title: string; description: string};
};
```

- [ ] **Step 4: Add distinct adult copy in `content/site.ts`**

Use these values:

```ts
{
  path: "/online-flute-lessons-for-adults",
  navLabel: "For adults",
  eyebrow: "Private online flute lessons",
  title: "Private Online Flute Lessons for Adults",
  intro: "One-to-one online flute lessons for complete beginners, returning players and continuing adult musicians. Build reliable technique and musical confidence through clear, realistic steps.",
  trustLine: "Moscow-trained flutist and music teacher · Teaching since 2014",
  cardCopy: "Start from your first note, return after a break, or strengthen the playing you already have.",
  audienceHeading: "A lesson built around your life and level",
  audienceCopy: "You do not need to fit a conservatory timetable or arrive with perfect technique. Lessons begin with what you can already do, the music you want to play and the time you can realistically give to practice.",
  audiencePoints: [
    "Complete beginners who want a healthy, clear start",
    "Returning players rebuilding confidence after a break",
    "Continuing flutists refining sound, technique and expression",
  ],
  lessonsHeading: "What happens in lessons",
  lessonsCopy: "Each lesson has a practical focus and a next step you can use immediately.",
  lessonFocus: [
    {title: "Sound and breathing", text: "Develop a supported, flexible tone without unnecessary tension."},
    {title: "Relaxed technique", text: "Work on posture, embouchure, articulation and finger coordination step by step."},
    {title: "Reading and rhythm", text: "Make notation, pulse and musical structure easier to understand and use."},
    {title: "Repertoire and expression", text: "Connect technical work with pieces that are meaningful and motivating to play."},
  ],
  whyHeading: "Why learn with Agatha",
  whyParagraphs: [
    "Agatha Gurko is a Moscow-trained flutist and music teacher who has taught since 2014 in music schools, private lessons and online classes.",
    "Her teaching combines a strong musical foundation with patient explanation, healthy technique and goals shaped around the individual student.",
  ],
  faq: [
    {question: "Do I need previous experience?", answer: "No. Lessons can begin with choosing a comfortable setup, producing the first sound, basic rhythm and reading music."},
    {question: "Can I return after a long break?", answer: "Yes. We review the foundations without assuming that everything should already feel familiar."},
    {question: "How much should I practise?", answer: "The practice plan is adapted to your schedule. Consistent short sessions are often more useful than an unrealistic target."},
    {question: "What do I need for an online lesson?", answer: "A flute, a stable internet connection, a device with a camera and enough space to sit or stand comfortably."},
  ],
  ctaHeading: "Begin with a trial lesson",
  ctaCopy: "Use the first lesson to discuss your level, goals, repertoire and a realistic way forward.",
  seo: {
    title: "Online Flute Lessons for Adults",
    description: "Private online flute lessons for adult beginners, returning players and continuing flutists with Agatha Gurko.",
  },
}
```

- [ ] **Step 5: Add distinct children copy in `content/site.ts`**

Use these values:

```ts
{
  path: "/online-flute-lessons-for-children",
  navLabel: "For children",
  eyebrow: "Private online flute lessons",
  title: "Private Online Flute Lessons for Children",
  intro: "Patient, structured one-to-one flute lessons for children from age six, from first musical steps to more confident playing.",
  trustLine: "Experienced with young beginners and continuing students · Teaching since 2014",
  cardCopy: "Clear musical foundations, age-appropriate goals and practical guidance for the time between lessons.",
  audienceHeading: "Support that fits the child",
  audienceCopy: "Lessons adapt to the child's age, experience, attention and musical interests while keeping a clear direction for progress.",
  audiencePoints: [
    "Young beginners learning their first sounds and rhythms",
    "Children developing technique, reading and musical confidence",
    "Students who need patient support alongside their current music studies",
  ],
  lessonsHeading: "What happens in lessons",
  lessonsCopy: "Technique, listening and music-making are introduced in manageable steps, with brief notes for practice afterwards.",
  lessonFocus: [
    {title: "Healthy foundations", text: "Build breathing, posture, hand position and sound without forcing the body."},
    {title: "Rhythm and reading", text: "Learn notation through playing, listening, singing and simple musical patterns."},
    {title: "Age-appropriate repertoire", text: "Use pieces and exercises that match the child's level and keep the work meaningful."},
    {title: "Practice guidance", text: "Leave each lesson with a small, clear focus that can be continued at home."},
  ],
  whyHeading: "Why learn with Agatha",
  whyParagraphs: [
    "Agatha has taught children in music schools, private lessons and online classes as part of her teaching work since 2014.",
    "She combines clear musical standards with patience, adaptability and respect for each child's pace of learning.",
  ],
  faq: [
    {question: "What age can a child begin?", answer: "Lessons are available from age six. The trial lesson helps determine a comfortable instrument setup and starting point."},
    {question: "Does a parent need to stay during the lesson?", answer: "A parent may help a younger beginner with the camera, music stand and first practice routine. The right level of involvement depends on the child."},
    {question: "Can online lessons work for a beginner?", answer: "Yes, when the camera shows the child's posture and hands clearly and the instrument, music stand and device are prepared before the lesson."},
    {question: "What happens between lessons?", answer: "The student receives brief notes and materials with a manageable focus for practice."},
  ],
  ctaHeading: "Book a trial lesson for your child",
  ctaCopy: "Use the first lesson to discuss age, experience, goals, instrument setup and the parent's practical questions.",
  seo: {
    title: "Online Flute Lessons for Children",
    description: "Private online flute lessons for children from age six with patient, structured teaching by Agatha Gurko.",
  },
}
```

- [ ] **Step 6: Build the shared page and static routes**

`AudienceLessonPage` renders in order: Header; early hero with eyebrow, visible H1, intro, trust line, `/book` CTA; audience-fit section; lesson-focus section; Why Agatha; native `<details>` FAQ; final `/book` CTA; Footer. Use semantic sections, H2s, lists, and exactly one visible H1.

Each route imports its exact content object:

```tsx
export default function AdultFluteLessonsPage() {
  return <AudienceLessonPage content={siteContent.audienceLessons.adults} site={siteContent} />;
}
```

- [ ] **Step 7: Integrate home, classes, header, and footer**

Render `Your Musical Companion` as a paragraph with existing display classes; render `Private Online Flute Lessons for Adults and Children` as the visible H1. Add `Find the right lesson` after the manifesto with two descriptive links. In Classes, add the two text links only under the flute row.

Use the five-item nav in Header and Footer. Move Header's responsive split from 600/601 to 860/861 and use `MOBILE_HEADER_MAX_WIDTH = 860` in header state/controller. Fix footer copyright to `Agatha Gurko Music 2026`.

- [ ] **Step 8: Run focused tests and verify GREEN**

Run Step 2. Expected: all focused tests pass.

---

### Task 2: Transparent lead-source attribution

**Files:**
- Modify: `content/contact-form.ts`
- Modify: `components/ui/ContactForm.tsx`
- Modify: `lib/validators.ts`
- Modify: `lib/resend.ts`
- Modify: `tests/contact.test.ts`
- Modify: `tests/resend.test.ts`
- Modify: `tests/site-structure.test.ts`

**Interfaces:**
- Produces: optional `source` in `ContactInput`, limited to six approved values or an empty string.
- Produces: visible optional select and an attribution line in the owner notification email.
- Preserves: request size, Zod validation, honeypot, timing, spam, rate-limit, retry, and confirmation-email behavior.

- [ ] **Step 1: Write failing validation, render, and email tests**

Add `source: "Google or another search engine"` to valid API and Resend fixtures. Assert an unknown source returns 400, omitted/empty source remains valid, rendered form contains the visible optional label and all six options, and the first email contains:

```text
How they found Agatha: Google or another search engine
```

- [ ] **Step 2: Run focused tests and verify RED**

```powershell
npm.cmd test -- tests/contact.test.ts tests/resend.test.ts tests/site-structure.test.ts
```

Expected: unknown source is ignored, form lacks the field, and email lacks attribution.

- [ ] **Step 3: Implement the smallest end-to-end field**

Export this exact tuple from `content/contact-form.ts`:

```ts
export const contactSourceOptions = [
  "Google or another search engine",
  "Lessonface",
  "Recommendation",
  "Social media",
  "Another website or profile",
  "Other",
] as const;
```

Add `howDidYouFind: "How did you find Agatha? (optional)"`. Render a select named `source` with an empty `Not provided` option followed by the tuple. Import the tuple into `lib/validators.ts` and add:

```ts
source: z.enum(contactSourceOptions).optional().or(z.literal("")),
```

Add `How they found Agatha: ${input.source || "Not provided"}` only to the owner notification details. Do not add it to the student confirmation or Vercel Analytics.

- [ ] **Step 4: Run focused tests and verify GREEN**

Run Step 2. Expected: all focused tests pass.

---

### Task 3: Integration expectations and operational handoff

**Files:**
- Modify: `tests/e2e/site-smoke.spec.ts`
- Modify: `docs/LAUNCH_CHECKLIST.md`

**Interfaces:**
- Verifies: rendered semantics, responsive navigation, exact redirects, legal noindex, booking links, and optional attribution.
- Documents: manual Search Console and Cal.com actions without performing them.

- [ ] **Step 1: Extend the browser smoke contract**

Add both audience routes to the primary route loop. Assert:

- home has exactly one visible H1 with the approved service text;
- both landing pages have one audience-specific H1 and a `/book` trial CTA;
- Header exposes `For adults` and `For children` on desktop and in the mobile menu;
- at 861px and 1280px, logo, navigation, and booking-action rectangles do not intersect;
- `/en`, `/en/about`, `/en/classes`, `/en/media`, and `/en/book` return 308 with exact locations;
- `/de`, `/ru`, `/en/unknown`, and `/de/book` remain 404;
- legal pages return 200 and render a robots meta containing `noindex`;
- the contact form accepts an optional source and stays retryable on network failure.

- [ ] **Step 2: Update the operational checklist**

Add unchecked entries to `docs/LAUNCH_CHECKLIST.md` to verify `agathamusic.com` as a Search Console Domain Property, submit `https://www.agathamusic.com/sitemap.xml`, inspect home and both audience pages, add the optional attribution question to the Cal.com trial event, and review real mobile Core Web Vitals after traffic accumulates.

- [ ] **Step 3: Run browser tests and verify the remaining technical RED state**

```powershell
npm.cmd run build
npm.cmd run e2e:run
```

Expected: new routes and responsive UI checks pass; assertions for redirects and legal `noindex` fail until Task 4 implements the technical SEO contract.

- [ ] **Step 4: Inspect integrated diff and worktree safety**

```powershell
git diff --check
git status --short
```

Expected: no whitespace errors. The diff contains only SEO-scoped files plus pre-existing user changes. Review the complete diff against every approved spec section.

- [ ] **Step 5: Perform rendered visual QA**

Inspect `/`, both audience pages, `/classes`, and `/about` at 390×844, 768×1024, 861×900, and 1440×1000. Verify readable hierarchy, no horizontal overflow, visible focus, semantic headings, header/menu usability, reduced-motion compatibility, and preservation of the cream-paper editorial language. Capture screenshots only when useful for comparing corrections.

---

### Task 4: Metadata, JSON-LD, redirects, and final verification

**Files:**
- Create: `tests/seo.test.ts`
- Modify: `lib/seo.ts`
- Modify: `app/layout.tsx`
- Modify: all seven indexed `app/**/page.tsx` route modules
- Modify: `components/pages/AudienceLessonPage.tsx`
- Modify: `app/sitemap.ts`
- Modify: `app/impressum/page.tsx`
- Modify: `app/datenschutz/page.tsx`
- Modify: `next.config.ts`
- Modify: `tests/next-config.test.ts`
- Modify: `tests/site-structure.test.ts`

**Interfaces:**
- Produces: `pageMetadata`, `audienceLessonMetadata`, `siteStructuredData`, `serviceStructuredData`, `serializeJsonLd`.
- Produces: root `%s | Agatha Music` template, home absolute title, full Open Graph/Twitter metadata, one Person, and two Services.
- Produces: exact HTTP 308 redirects for five old English paths.

- [ ] **Step 1: Write failing SEO tests**

Create `tests/seo.test.ts` with these assertions:

```ts
expect(landingMetadata().title).toEqual({
  absolute: "Online Flute Lessons with Agatha Gurko | Agatha Music",
});
expect(aboutMetadata().title).toBe("About Agatha Gurko");
expect(audienceLessonMetadata(siteContent.audienceLessons.adults).title)
  .toBe("Online Flute Lessons for Adults");
expect(serializeJsonLd({value: "</script>"})).toContain("\\u003c/script>");
```

Assert the Person has `@id: ${siteUrl("/")}#agatha-gurko`, canonical/alternate names, `jobTitle`, and only the Lessonface URL in `sameAs`. Assert `WebSite.publisher` and each `Service.provider` reference that same ID. Update sitemap tests to expect `/`, `/book`, `/classes`, `/about`, `/media`, and both audience routes only. Assert exact five redirects and no `/en/:path*` wildcard.

- [ ] **Step 2: Run focused tests and verify RED**

```powershell
npm.cmd test -- tests/seo.test.ts tests/site-structure.test.ts tests/next-config.test.ts
```

Expected: missing exports/structured data, old sitemap, and absent redirects.

- [ ] **Step 3: Implement metadata without duplicated brands**

Root layout metadata:

```ts
metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
title: {
  default: "Online Flute Lessons with Agatha Gurko | Agatha Music",
  template: "%s | Agatha Music",
},
```

Use one `pageMetadata({path, title, description, absoluteTitle?})` helper. All child helpers pass unbranded titles. Home alone uses `{absolute: "Online Flute Lessons with Agatha Gurko | Agatha Music"}`. Every indexed page gets canonical, complete Open Graph data, and `twitter: {card: "summary_large_image", ...}`. Reuse `/images/media/open-lesson-preview.png` with its real 1672×941 dimensions. Add no keywords field.

- [ ] **Step 4: Implement the entity graph and safe serialization**

```ts
const PERSON_ID = `${siteUrl("/")}#agatha-gurko`;
const WEBSITE_ID = `${siteUrl("/")}#website`;

export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
```

`siteStructuredData()` returns a `@graph` with one Person and one WebSite. Use `publisher: {"@id": PERSON_ID}`. Person includes canonical about URL, portrait URL, `knowsLanguage: ["English", "German", "Russian"]`, and only `https://www.lessonface.com/instructor/agafiia-gurko` in `sameAs`. Each landing page renders one Service referencing the same Person ID. Use native `application/ld+json` scripts, not `next/script` or a `MusicTeacher` type.

- [ ] **Step 5: Implement sitemap, legal noindex, and exact redirects**

Add both audience URLs to sitemap; remove both legal placeholders. Add `robots: {index: false, follow: true}` to each legal page while keeping `app/robots.ts` permissive. Add only:

```ts
[
  {source: "/en", destination: "/", permanent: true},
  {source: "/en/about", destination: "/about", permanent: true},
  {source: "/en/classes", destination: "/classes", permanent: true},
  {source: "/en/media", destination: "/media", permanent: true},
  {source: "/en/book", destination: "/book", permanent: true},
]
```

- [ ] **Step 6: Run focused tests and verify GREEN**

Run Step 2. Expected: all focused tests pass.

- [ ] **Step 7: Run the complete automated suite and final diff review**

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd test
npm.cmd run build
npm.cmd run e2e:run
git diff --check
git status --short
```

Expected: every check exits 0, both new routes are present, exact redirects and legal `noindex` pass browser checks, and the worktree contains only scoped files plus preserved user changes. Review the complete diff against the approved design spec before reporting completion.
