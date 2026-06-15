# Agatha Editorial Site Structure Implementation Plan

Status: implemented. The compact dashboard direction was retired, `/full` was
removed, and its useful profile content was distributed into the editorial
pages.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the compact dashboard homepage with the Figma-inspired editorial structure and distribute the old full profile into Home, Classes, About me and Media pages.

**Architecture:** Keep Next.js App Router pages as thin route files and move page composition into focused server components under `components/pages/`. Keep marketing copy in `content/site.ts`, reuse existing media assets, and keep booking/contact/legal infrastructure unchanged.

**Tech Stack:** Next.js 16 App Router, TypeScript, Tailwind CSS 4, next-intl routing, Vitest for structure checks.

---

## File Structure

- Modify `content/site.ts`: brand, nav, SEO, hero copy and page-specific content.
- Modify `content/types.ts`: add optional home editorial fields if needed.
- Modify `components/layout/Header.tsx`: align navigation to Home/About/Classes/Media/Book.
- Modify `components/layout/Footer.tsx`: align footer to the new site map.
- Create `components/pages/HomePage.tsx`: editorial home cover and section links.
- Create `components/pages/ClassesPage.tsx`: Figma-style lesson rows.
- Create `components/pages/AboutPage.tsx`: biography, facts, principles, reviews and FAQ.
- Create `components/pages/MediaPage.tsx`: open lesson and gallery.
- Modify `app/[locale]/page.tsx`: render `HomePage`.
- Create `app/[locale]/classes/page.tsx`, `app/[locale]/about/page.tsx`, `app/[locale]/media/page.tsx`.
- Modify `lib/seo.ts`: add metadata helpers for the new pages and update brand.
- Modify `app/sitemap.ts`: include the new pages and remove `/full`.
- Add `tests/site-structure.test.ts`: verify brand, nav and sitemap structure.

## Tasks

- [x] Add a failing Vitest structure test for brand, primary nav and sitemap routes.
- [x] Update content and routing metadata to use `Agatha Music` and the new page paths.
- [x] Build shared editorial page components from the Figma tokens.
- [x] Add Home, Classes, About and Media route files.
- [x] Update header/footer navigation and remove `/full` from public navigation.
- [x] Run typecheck, lint, tests and production build.
- [x] Run browser QA on desktop and mobile.
