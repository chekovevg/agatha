# Compact Dashboard Homepage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the localized homepage with a compact teacher dashboard while preserving the current long-form page at `/[locale]/full`.

**Architecture:** Extract the existing long homepage composition into a reusable server component, then make `/[locale]` render a new compact dashboard component. Add small typed dashboard content to the existing repo content model and keep Cal.com, Resend, legal pages and booking routes unchanged.

**Tech Stack:** Next.js 16 App Router, TypeScript, Tailwind CSS 4, `next-intl`, existing content files and server components.

---

## File Structure

- Create `components/pages/LongProfilePage.tsx`: shared long-form page composition currently inside `app/[locale]/page.tsx`.
- Create `components/pages/CompactDashboardPage.tsx`: compact dashboard homepage composition for `/[locale]`.
- Modify `app/[locale]/page.tsx`: render `CompactDashboardPage`.
- Create `app/[locale]/full/page.tsx`: render `LongProfilePage`.
- Modify `content/types.ts`: add `DashboardContent` and `dashboard` field on `SiteContent`.
- Modify `content/site.ts`: add English dashboard copy and draft localized overrides for German/Russian.
- Modify `lib/seo.ts`: add `fullProfileMetadata(locale)`.
- Modify `app/sitemap.ts`: include public full-profile routes.
- Modify `components/layout/Header.tsx`: allow route-aware navigation links and current-locale path switching for `/full`.

## Task 1: Preserve Current Long Homepage

**Files:**
- Create: `components/pages/LongProfilePage.tsx`
- Modify: `app/[locale]/page.tsx`
- Create: `app/[locale]/full/page.tsx`
- Modify: `lib/seo.ts`
- Modify: `app/sitemap.ts`

- [ ] **Step 1: Extract current long page composition**

Create `components/pages/LongProfilePage.tsx` with the imports and JSX currently used by `app/[locale]/page.tsx`:

```tsx
import {Footer} from "@/components/layout/Footer";
import {Header} from "@/components/layout/Header";
import {AboutSection} from "@/components/sections/AboutSection";
import {BookingSection} from "@/components/sections/BookingSection";
import {ContactSection} from "@/components/sections/ContactSection";
import {FAQSection} from "@/components/sections/FAQSection";
import {HeroSection} from "@/components/sections/HeroSection";
import {LessonsSection} from "@/components/sections/LessonsSection";
import {MediaGallerySection} from "@/components/sections/MediaGallerySection";
import {MethodSection} from "@/components/sections/MethodSection";
import {OpenLessonSection} from "@/components/sections/OpenLessonSection";
import {ReviewsSection} from "@/components/sections/ReviewsSection";
import {TrustStrip} from "@/components/sections/TrustStrip";
import type {SiteContent} from "@/content/types";
import type {Locale} from "@/lib/routing";

export function LongProfilePage({
  content,
  locale,
}: {
  content: SiteContent;
  locale: Locale;
}) {
  return (
    <>
      <Header content={content} locale={locale} variant="full" />
      <main>
        <HeroSection content={content} locale={locale} />
        <TrustStrip items={content.trust} />
        <LessonsSection content={content} />
        <AboutSection content={content.about} />
        <MethodSection content={content.method} />
        <OpenLessonSection content={content} />
        <MediaGallerySection items={content.media} />
        <ReviewsSection content={content.reviews} />
        <BookingSection content={content} locale={locale} />
        <FAQSection items={content.faq} />
        <ContactSection content={content} />
      </main>
      <Footer content={content} locale={locale} />
    </>
  );
}
```

- [ ] **Step 2: Create `/[locale]/full` route**

Create `app/[locale]/full/page.tsx` using the same locale validation pattern as the booking page:

```tsx
import type {Metadata} from "next";
import {notFound} from "next/navigation";

import {LongProfilePage} from "@/components/pages/LongProfilePage";
import {siteContent} from "@/content/site";
import {fullProfileMetadata} from "@/lib/seo";
import {isLocale, locales, type Locale} from "@/lib/routing";

type PageProps = {
  params: Promise<{locale: string}>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale} = await params;

  if (!isLocale(locale)) {
    return {};
  }

  return fullProfileMetadata(locale);
}

export default async function FullProfileRoute({params}: PageProps) {
  const {locale: rawLocale} = await params;

  if (!isLocale(rawLocale)) {
    notFound();
  }

  const locale: Locale = rawLocale;

  return <LongProfilePage content={siteContent[locale]} locale={locale} />;
}
```

- [ ] **Step 3: Add full profile metadata**

In `lib/seo.ts`, add:

```ts
export function fullProfileMetadata(locale: Locale): Metadata {
  const seo = siteContent[locale].seo;

  return {
    title: `Full profile | ${seo.title}`,
    description: seo.description,
    alternates: {
      canonical: siteUrl(`/${locale}/full`),
      languages: localizedAlternates("/full"),
    },
  };
}
```

- [ ] **Step 4: Add full profile routes to sitemap**

In `app/sitemap.ts`, add `/${locale}/full` entries with `priority: 0.7` and `changeFrequency: "monthly"`.

- [ ] **Step 5: Verify long page route builds**

Run:

```powershell
npm.cmd run typecheck
```

Expected: command exits with code 0.

## Task 2: Add Dashboard Content Model

**Files:**
- Modify: `content/types.ts`
- Modify: `content/site.ts`

- [ ] **Step 1: Add dashboard types**

In `content/types.ts`, add:

```ts
export type DashboardContent = {
  eyebrow: string;
  heading: string;
  subheading: string;
  trustLine: string;
  fitHeading: string;
  fitItems: string[];
  styleHeading: string;
  styleIntro: string;
  styleTags: string[];
  trialHeading: string;
  trialSteps: string[];
  proofHeading: string;
  proofItems: string[];
  practical: {label: string; value: string}[];
  fullProfileCta: string;
};
```

Then add `dashboard: DashboardContent;` to `SiteContent`.

- [ ] **Step 2: Add source English dashboard copy**

In `content/site.ts`, add `dashboard` to `baseContent`:

```ts
dashboard: {
  eyebrow: "Flute · Recorder · Music Theory",
  heading: "Music lessons with calm structure and clear next steps.",
  subheading:
    "For children, adult beginners and aspiring musicians who want attentive online lessons in Russian, English or German.",
  trustLine:
    "Teaching since 2014 · Students aged 6-60 · Music schools, private lessons and online classes.",
  fitHeading: "Suitable for",
  fitItems: [
    "Children and teenagers who need patient structure",
    "Adult beginners who want to start without shame or pressure",
    "Flute, recorder, piccolo and music theory students",
    "Students who want explanations in Russian, English or German",
  ],
  styleHeading: "Lesson style",
  styleIntro:
    "Calm, structured and practical lessons with healthy technique, clear explanations and notes after class.",
  styleTags: [
    "Calm",
    "Structured",
    "Attentive",
    "Practical",
    "Healthy technique",
    "Practice notes",
  ],
  trialHeading: "What happens in a trial lesson",
  trialSteps: [
    "Meet and clarify the goal.",
    "Check level, breathing, posture, sound, rhythm or theory needs.",
    "Try a short learning activity.",
    "Leave with notes and a realistic next-step recommendation.",
  ],
  proofHeading: "Why students trust Agathe",
  proofItems: [
    "Academic flute background",
    "Teaching experience since 2014",
    "Clear explanations and patient support",
    "Experience with children, adults and online lessons",
  ],
  practical: [
    {label: "Languages", value: "Russian · English · German"},
    {label: "Format", value: "Online lessons"},
    {label: "First step", value: "Trial lesson via Cal.com"},
    {label: "Focus", value: "Flute · Recorder · Theory"},
  ],
  fullProfileCta: "Read the full profile",
}
```

- [ ] **Step 3: Add localized dashboard overrides**

In `de` and `ru` content, override at least `dashboard` with complete draft keys. Use draft translations and keep the existing file comment that English is source of truth.

- [ ] **Step 4: Verify content type safety**

Run:

```powershell
npm.cmd run typecheck
```

Expected: command exits with code 0 or reveals only the next missing implementation from Task 3.

## Task 3: Build Compact Dashboard Page

**Files:**
- Create: `components/pages/CompactDashboardPage.tsx`
- Modify: `app/[locale]/page.tsx`

- [ ] **Step 1: Create compact dashboard component**

Create `components/pages/CompactDashboardPage.tsx` as a server component that uses existing `Header`, `Footer`, `ButtonLink` and `next/image`. It should render:

- header variant `compact`
- main dashboard first viewport
- four evidence blocks with ids `lessons`, `trial`, `reviews`, `contact`
- CTAs to `/${locale}/book`, `#contact`, and `/${locale}/full`
- footer

- [ ] **Step 2: Replace localized homepage composition**

Modify `app/[locale]/page.tsx` so its default export returns:

```tsx
return <CompactDashboardPage content={siteContent[locale]} locale={locale} />;
```

Keep `generateStaticParams` and `generateMetadata` unchanged.

- [ ] **Step 3: Verify homepage route typechecks**

Run:

```powershell
npm.cmd run typecheck
```

Expected: command exits with code 0 after Task 3 is complete.

## Task 4: Update Header Navigation

**Files:**
- Modify: `components/layout/Header.tsx`

- [ ] **Step 1: Add variant prop**

Add `variant?: "compact" | "full"` to the `Header` props.

- [ ] **Step 2: Use route-aware nav links**

For compact pages, render these links:

```ts
[
  {label: "Lessons", href: "#lessons"},
  {label: "Trial lesson", href: "#trial"},
  {label: "Reviews", href: "#reviews"},
  {label: "Full profile", href: `/${locale}/full`},
  {label: "Contact", href: "#contact"},
]
```

For full pages, keep `content.nav`.

- [ ] **Step 3: Preserve locale switching**

Keep the locale switcher pointing to `/` for compact pages. On full pages, make locale switcher point to `/full` so the user stays on the full profile route.

- [ ] **Step 4: Verify mobile menu**

Run:

```powershell
npm.cmd run lint
```

Expected: no lint errors.

## Task 5: Final Verification And Commit

**Files:**
- All changed implementation files.

- [ ] **Step 1: Run local checks**

Run:

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd test
npm.cmd run build
```

Expected: all commands exit with code 0.

- [ ] **Step 2: Browser QA**

Start dev server:

```powershell
npm.cmd run dev
```

Check:

- `http://127.0.0.1:3000/` redirects to `/en`.
- `/en`, `/de`, `/ru` render compact dashboards.
- `/en/full`, `/de/full`, `/ru/full` render the preserved long profile.
- `/en/book` still renders booking.
- `/sitemap.xml` includes `/en/full`, `/de/full`, `/ru/full`.
- Mobile width shows usable top CTA and no overlapping dashboard text.

- [ ] **Step 3: Commit and push**

Run:

```powershell
git status --short --branch
git add app components content lib docs app/sitemap.ts .gitignore
git commit -m "feat: add compact dashboard homepage"
git push
```

Expected: `main` is pushed to GitHub and Vercel can deploy from it.
