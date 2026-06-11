# AI Workflow

## Purpose
This repository should be developed with a small, safe loop:

idea -> focused task -> inspect -> plan -> implement -> verify -> review diff ->
commit -> next task.

Avoid broad "finish the whole site" requests. The project is small enough that
focused tasks produce better diffs and fewer regressions.

## Current Project State
- Product: multilingual static-first website for Agathe G. Musik.
- Stack: Next.js 16 App Router, TypeScript, Tailwind CSS 4, `next-intl`,
  Resend, Cal.com, Vercel Analytics, Vitest, Playwright.
- Git branch: `main`.
- Git remote: `https://github.com/chekovevg/agatha.git`.
- GitHub push is configured via HTTPS fallback because SSH auth was not
  available in this environment.
- Production URL: `https://agatha-pied.vercel.app`.
- Vercel production deployment is connected to GitHub `main`.
- Cal.com booking is configured through `NEXT_PUBLIC_CAL_LINK`.
- Resend contact email is configured and verified with the temporary
  `onboarding@resend.dev` sender. This is acceptable for testing only; replace
  it with a verified custom-domain sender before final production launch.

## Core Commands
Use `npm.cmd` in PowerShell if `npm.ps1` is blocked.

```powershell
npm.cmd install
npm.cmd run dev
npm.cmd run typecheck
npm.cmd run lint
npm.cmd test
npm.cmd run build
```

Dev URL:

```text
http://127.0.0.1:3000/en
```

## Environment Variables
Copy `.env.example` to `.env.local` for local configuration. Never commit real
secrets.

Required for production-like MVP behavior:
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_CAL_LINK`
- `RESEND_API_KEY`
- `CONTACT_TO_EMAIL`
- `CONTACT_FROM_EMAIL`

Optional:
- `NEXT_PUBLIC_PREPLY_URL`
- `NEXT_PUBLIC_INSTAGRAM_URL`
- `NEXT_PUBLIC_WHATSAPP_URL`
- `CAL_WEBHOOK_SECRET`

Do not add Stripe, Supabase, CMS, or auth variables unless v1 scope changes.

## Installed Project Tooling
- `next-intl`: locale routing and messages.
- `zod`: validation for contact and webhook payloads.
- `resend`: outbound contact and booking notification emails.
- `@vercel/analytics` and `@vercel/speed-insights`: cookieless Vercel metrics.
- `vitest`: API/unit tests.
- `playwright`: local browser QA when UI behavior needs verification.

No extra MCP server is required for normal development right now.

## When To Use Extra Tools
- Figma MCP: only when a real Figma file is the source of truth.
- Playwright MCP: later, if browser QA should become a persistent external tool.
  Current local Playwright is enough.
- Context7: later, if local docs are not enough for library/version questions.
- shadcn/ui MCP: only if the project adopts shadcn components.
- Firecrawl: only if we need structured scraping/research from external sites.

Audit any plugin or MCP before installing it: README, install script, required
tokens, permissions, latest issues, and files it will modify.

## Safe Task Template
Use this shape for new requests:

```text
We will work on one task only.

Task:
[describe the task]

Rules:
- First inspect relevant files.
- Keep the diff minimal.
- Do not add dependencies without approval.
- Use existing components and content patterns.
- After implementation, run relevant checks.
- End with changed files, checks, risks, confidence 1-10, and what remains.
```

## Recommended Next Tasks
1. Replace legal placeholders in `/impressum` and `/datenschutz` with reviewed
   real content.
2. Configure a real domain, verify it in Resend, and replace
   `CONTACT_FROM_EMAIL=onboarding@resend.dev` with a branded sender.
3. Confirm Cal.com intake questions, availability, timezone, and calendar sync.
4. Replace SVG placeholders with approved photos/media.
5. Run the anti-AI-slop design and copy review in `docs/UI_REVIEW.md` before
   visual polish.
6. Add real optional public links if available: Preply, Instagram, WhatsApp.
7. Run the full local checks and production browser QA after final content.

## What Not To Touch Without Approval
- Real `.env.local` values or secrets.
- Legal production text.
- Payment, Stripe, tax, billing, or pricing flows.
- Auth, database, CMS, or custom admin features.
- Production deployment settings.
- Large visual redesigns outside an approved design task.

## Handoff Checklist
For a new session, include:
- latest commit or dirty status;
- current task;
- files changed;
- commands run and results;
- decisions made;
- known risks;
- what not to touch.
