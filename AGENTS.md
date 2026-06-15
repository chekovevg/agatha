<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes. APIs, conventions, and file structure may
all differ from your training data. Read the relevant guide in
`node_modules/next/dist/docs/` before writing code that touches Next.js
routing, proxy, metadata, images, or App Router conventions. Heed deprecation
notices.
<!-- END:nextjs-agent-rules -->

# AGENTS.md

## Project
Agatha Music is a static-first multilingual marketing and booking website
for a music teacher. The site presents lessons, teaching method, media, reviews,
booking, FAQ, contact, and German legal pages.

The v1 architecture intentionally avoids custom auth, CMS, database, custom
calendar, and payments. Booking belongs to Cal.com. Contact email belongs to
Resend.

See `docs/AI_WORKFLOW.md` for the longer AI-assisted development workflow.

## Stack
- Framework: Next.js 16 App Router
- Language: TypeScript
- Styling: Tailwind CSS 4
- i18n: `next-intl` with `en`, `de`, `ru`
- Forms/validation: Route Handlers + Zod
- Email: Resend
- Booking: Cal.com embed/link via `NEXT_PUBLIC_CAL_LINK`
- Analytics: Vercel Analytics and Speed Insights
- Tests: Vitest for route-handler tests, Playwright for browser QA when needed
- Package manager: npm

## Commands
Use `npm.cmd` in PowerShell when `npm.ps1` is blocked by execution policy.

- Install: `npm.cmd install`
- Dev server: `npm.cmd run dev`
- Typecheck: `npm.cmd run typecheck`
- Lint: `npm.cmd run lint`
- Tests: `npm.cmd test`
- Production build: `npm.cmd run build`

## Structure
- `app/[locale]/` - localized editorial and booking pages
- `app/api/contact/route.ts` - contact form endpoint
- `app/api/cal/webhook/route.ts` - optional Cal.com webhook endpoint
- `components/layout/` - header and footer
- `components/sections/` - focused reusable sections
- `components/ui/` - small reusable UI primitives
- `content/` - typed marketing content and content models
- `messages/` - `next-intl` message files
- `lib/` - env parsing, routing, SEO, validators, email helpers
- `public/images/` - local visual assets
- `tests/` - Vitest tests

## Working Rules
- Before coding, inspect relevant files and understand existing patterns.
- Keep each task small and scoped. Do not bundle unrelated refactors.
- Do not add dependencies without explicit approval unless the user directly
  asked for implementation that requires them.
- Do not edit secrets, `.env` values, auth, billing, payments, legal production
  text, or deployment settings without explicit approval.
- Do not implement a custom calendar, CRM, database, CMS, auth, or Stripe flow
  for v1 unless the user changes scope.
- Preserve content separation: marketing copy lives in `content/` and
  translations/messages live in `messages/`.
- Prefer server components. Use client components only for real interactivity.
- Use Next.js 16 local docs in `node_modules/next/dist/docs/` when touching
  routing, proxy, metadata, image, or App Router conventions.

## Design Rules
- Current UI is an architecture MVP, not the final visual direction.
- Avoid generic AI-looking UI and filler copy.
- Preserve accessibility: semantic HTML, keyboard focus, readable contrast,
  mobile layouts, and reduced-motion friendliness.
- Do not auto-load third-party video embeds before user interaction.
- Do not add cookie-requiring trackers without a privacy/legal decision.

## Verification
Run the narrowest useful checks after changes. For shared code, routing, API,
or UI work, prefer the full set:

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd test
npm.cmd run build
```

For UI work, also run browser QA on desktop and mobile. Verify:
- `/` redirects to `/en`
- `/en`, `/de`, `/ru` render
- `/en/book` renders booking embed or fallback
- `/impressum` and `/datenschutz` render
- contact form success/error states
- video iframe loads only after click

## Definition of Done
- The requested behavior is implemented or a limitation is documented.
- No unrelated files were changed.
- No secrets or real legal data were invented.
- Relevant checks were run and results are reported.
- Final summary includes changed files, checks, risks, confidence from 1-10,
  and recommended next step.
