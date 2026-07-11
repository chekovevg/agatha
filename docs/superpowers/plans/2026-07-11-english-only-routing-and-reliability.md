# English-only Routing and Reliability Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make English the only unprefixed site and fix approved reliability, accessibility, and SEO defects without changing content, hero, CTA placement, or conversion behavior.

**Architecture:** Collapse localized content and dynamic locale routes into one static English content object and five unprefixed App Router pages. Keep contact delivery and rate limiting as small independently tested units; the limiter remains bounded, dependency-free, and explicitly best-effort for serverless deployments.

**Tech Stack:** Next.js 16.2 App Router, React 19, TypeScript, Tailwind CSS 4, Zod, Resend, Vitest, Playwright.

## Global Constraints

- Preserve all existing English editorial copy and visual structure.
- Do not add, remove, or relocate CTA buttons or alter hero behavior.
- Do not add dependencies, storage, deployment configuration, consent UI, or conversion changes.
- Do not commit automatically because the starting worktree contains user-owned uncommitted changes.
- Read relevant Next.js 16 local documentation before changing App Router conventions.

---

### Task 1: English-only content and component links

**Files:**
- Modify: `tests/site-structure.test.ts`
- Modify: `tests/footer.test.tsx`
- Modify: `tests/home-hero.test.tsx`
- Modify: `content/site.ts`
- Modify: `components/layout/Header.tsx`
- Modify: `components/layout/Footer.tsx`
- Modify: `components/pages/HomePage.tsx`
- Modify: `components/pages/AboutPage.tsx`
- Modify: `components/pages/ClassesPage.tsx`
- Modify: `components/pages/MediaPage.tsx`
- Modify: `components/sections/BookingSection.tsx`
- Delete: `lib/routing.ts`

**Interfaces:**
- Produces: `siteContent: SiteContent`, with no locale-keyed wrapper.
- Produces: page/layout components that accept `content` only and link to `/`, `/about`, `/classes`, `/media`, and `/book`.

- [ ] **Step 1: Write failing assertions for a single content object and unprefixed links**

Update structure/render tests to use `siteContent` rather than `siteContent.en`, assert the sitemap and rendered links contain only unprefixed application paths, and assert `/en`, `/de`, and `/ru` are absent.

- [ ] **Step 2: Run the focused tests and verify RED**

Run: `npm.cmd test -- tests/site-structure.test.ts tests/footer.test.tsx tests/home-hero.test.tsx`

Expected: failures caused by the existing locale-keyed content and prefixed links.

- [ ] **Step 3: Collapse content and remove locale props minimally**

Change `content/site.ts` to export the unchanged English `baseContent` directly:

```ts
export const siteContent: SiteContent = baseContent;
```

Remove locale parameters from shared components and replace generated paths such as ``/${locale}/book`` and ``/${locale}/about#contact`` with `/book` and `/about#contact`. Replace the `next-intl` navigation Link in Header with `next/link`.

- [ ] **Step 4: Run focused tests and verify GREEN**

Run: `npm.cmd test -- tests/site-structure.test.ts tests/footer.test.tsx tests/home-hero.test.tsx`

Expected: all focused tests pass.

### Task 2: Unprefixed App Router pages and canonical metadata

**Files:**
- Modify: `tests/site-structure.test.ts`
- Modify: `app/page.tsx`
- Create: `app/about/page.tsx`
- Create: `app/classes/page.tsx`
- Create: `app/media/page.tsx`
- Create: `app/book/page.tsx`
- Delete: `app/[locale]/layout.tsx`
- Delete: `app/[locale]/page.tsx`
- Delete: `app/[locale]/about/page.tsx`
- Delete: `app/[locale]/classes/page.tsx`
- Delete: `app/[locale]/media/page.tsx`
- Delete: `app/[locale]/book/page.tsx`
- Modify: `lib/seo.ts`
- Modify: `app/sitemap.ts`
- Delete: `proxy.ts`

**Interfaces:**
- Produces: static page modules with direct metadata calls and no `params`.
- Produces: `landingMetadata()`, `aboutMetadata()`, `classesMetadata()`, `mediaMetadata()`, and `bookMetadata()` with unprefixed canonical URLs and no language alternates.

- [ ] **Step 1: Add failing source/sitemap assertions**

Assert that unprefixed page files exist, locale page and proxy files do not exist, sitemap paths equal `/`, `/about`, `/classes`, `/media`, `/book`, `/impressum`, and `/datenschutz`, and sitemap entries omit `lastModified`.

- [ ] **Step 2: Run structure tests and verify RED**

Run: `npm.cmd test -- tests/site-structure.test.ts`

Expected: missing unprefixed route files and localized sitemap failures.

- [ ] **Step 3: Implement static unprefixed routes and metadata**

Each route imports `siteContent`, renders its existing page component, and exports direct metadata, for example:

```tsx
export const metadata = aboutMetadata();
export default function AboutRoute() {
  return <AboutPage content={siteContent} />;
}
```

Delete `[locale]`, `proxy.ts`, locale alternates, locale parameters, and build-time timestamps from sitemap entries.

- [ ] **Step 4: Run structure tests and build-route check**

Run: `npm.cmd test -- tests/site-structure.test.ts`

Expected: structure tests pass.

Run: `npm.cmd run build`

Expected: `/`, `/about`, `/classes`, `/media`, and `/book` appear; no `[locale]` route or Proxy appears.

### Task 3: Truthful contact delivery and retryable client errors

**Files:**
- Create: `lib/contact-client.ts`
- Create: `tests/contact-client.test.ts`
- Modify: `tests/contact.test.ts`
- Modify: `app/api/contact/route.ts`
- Modify: `components/ui/ContactForm.tsx`

**Interfaces:**
- Produces: `submitContact(payload: Record<string, FormDataEntryValue>): Promise<boolean>`; it returns `false` for non-2xx responses and network failures.
- Contact API returns 503 with `{error: "Email service unavailable"}` when `sendContactEmails` returns `{skipped: true}`.

- [ ] **Step 1: Write failing helper/API tests**

Test a rejected fetch, a non-OK response, an OK response, and a skipped email result. Add source/render assertions for `aria-busy`, `role="status"`, and `aria-live="polite"`.

- [ ] **Step 2: Run focused tests and verify RED**

Run: `npm.cmd test -- tests/contact-client.test.ts tests/contact.test.ts`

Expected: missing helper and skipped email currently returning 200.

- [ ] **Step 3: Implement the minimal truthful state flow**

Implement `submitContact` with `try/catch`. In `ContactForm`, await it, reset only on success, set `error` otherwise, and expose busy/status semantics without changing fields or layout. In the route, convert `skipped` into a 503 response.

- [ ] **Step 4: Run focused tests and verify GREEN**

Run: `npm.cmd test -- tests/contact-client.test.ts tests/contact.test.ts`

Expected: all focused tests pass.

### Task 4: Bounded best-effort rate limiter

**Files:**
- Create: `lib/rate-limit.ts`
- Create: `tests/rate-limit.test.ts`
- Modify: `tests/contact.test.ts`
- Modify: `app/api/contact/route.ts`

**Interfaces:**
- Produces: `createRateLimiter({windowMs, maxRequests, maxKeys})` returning `{isLimited(key, now?), clear()}`.
- Route consumes quota only after JSON parsing, Zod validation, honeypot, timing, and marketing-spam rejection.

- [ ] **Step 1: Write failing limiter and request-order tests**

Test window expiry, maximum request count, pruning of expired keys, maximum key bound, and six spam submissions followed by one valid submission from the same IP.

- [ ] **Step 2: Run focused tests and verify RED**

Run: `npm.cmd test -- tests/rate-limit.test.ts tests/contact.test.ts`

Expected: missing limiter module and current spam requests exhausting quota.

- [ ] **Step 3: Implement and integrate the limiter**

Use a bounded `Map<string, number[]>`, prune expired entries before checks, evict the oldest key when the configured key limit is reached, and invoke it only immediately before the email send attempt.

- [ ] **Step 4: Run focused tests and verify GREEN**

Run: `npm.cmd test -- tests/rate-limit.test.ts tests/contact.test.ts`

Expected: all focused tests pass.

### Task 5: Remove localization runtime and add booking iframe safeguard

**Files:**
- Modify: `tests/site-structure.test.ts`
- Modify: `components/sections/BookingSection.tsx`
- Modify: `next.config.ts`
- Modify: `package.json`
- Modify: `package-lock.json`
- Delete: `i18n/request.ts`
- Delete: `messages/en.json`
- Delete: `messages/de.json`

**Interfaces:**
- Next config exports plain `nextConfig` without the next-intl plugin.
- Cal iframe keeps its title/src/layout and adds `loading="lazy"` and a restrictive `referrerPolicy` compatible with Cal.com.

- [ ] **Step 1: Add failing assertions for removed localization and iframe attributes**

Assert the localization directories/config are absent, `next-intl` is absent from package dependencies/config, and rendered booking markup contains `loading="lazy"`.

- [ ] **Step 2: Run focused tests and verify RED**

Run: `npm.cmd test -- tests/site-structure.test.ts`

Expected: localization artifacts and missing iframe attribute fail assertions.

- [ ] **Step 3: Remove runtime and update lockfile**

Delete the localization files, remove the Next config wrapper, run `npm.cmd uninstall next-intl`, and add iframe loading/referrer attributes.

- [ ] **Step 4: Run focused tests and verify GREEN**

Run: `npm.cmd test -- tests/site-structure.test.ts`

Expected: focused tests pass.

### Task 6: Documentation and full verification

**Files:**
- Modify only localization/routing references in: `README.md`, `AGENTS.md`, `docs/AI_WORKFLOW.md`, `docs/LAUNCH_CHECKLIST.md`

**Interfaces:** None.

- [ ] **Step 1: Update factual documentation without changing marketing copy**

Replace multilingual/locale route instructions with the English-only unprefixed route set and remove `next-intl` from stack descriptions. Preserve unrelated user edits.

- [ ] **Step 2: Search for stale localization references**

Run: `rg -n "next-intl|siteContent\.(en|de)|/\[locale\]|/en|/de|locale=|type Locale|messages/|i18n/" app components content lib tests README.md AGENTS.md docs package.json next.config.ts`

Expected: no active-code references; historical spec/plan references may remain.

- [ ] **Step 3: Run full automated verification**

Run: `npm.cmd run typecheck`

Run: `npm.cmd run lint`

Run: `npm.cmd test`

Run: `npm.cmd run build`

Expected: all commands exit 0; build lists only unprefixed application routes.

- [ ] **Step 4: Run browser smoke QA**

Start production server and verify desktop/mobile rendering for `/`, `/about`, `/classes`, `/media`, and `/book`; verify `/en`, `/de`, `/ru`, and nested variants return 404; verify contact success/error UI and video click-to-load behavior.

- [ ] **Step 5: Inspect final diff**

Run: `git diff --check` and `git status --short`.

Expected: no whitespace errors; only scoped changes plus pre-existing user files are present.
