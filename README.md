# Agathe G. Musik

Static-first multilingual Next.js site for a music teacher brand. The v1 site
is a marketing and booking surface: lessons, method, about, media, reviews,
booking, FAQ, contact, and German legal pages.

## Stack

- Next.js 16 App Router
- TypeScript
- Tailwind CSS 4
- `next-intl` for `en`, `de`, `ru`
- Resend for contact email
- Cal.com for booking
- Vercel Analytics and Speed Insights
- Vitest and Playwright for verification

## Local Development

PowerShell may block `npm.ps1`, so use `npm.cmd`.

```powershell
npm.cmd install
npm.cmd run dev
```

Open:

```text
http://127.0.0.1:3000/en
```

## Checks

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd test
npm.cmd run build
```

## Environment

Copy `.env.example` to `.env.local` for local secrets. Never commit real env
values.

Required for production-like behavior:

```text
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_CAL_LINK=
RESEND_API_KEY=
CONTACT_TO_EMAIL=
CONTACT_FROM_EMAIL=
```

Optional public links:

```text
NEXT_PUBLIC_PREPLY_URL=
NEXT_PUBLIC_INSTAGRAM_URL=
NEXT_PUBLIC_WHATSAPP_URL=
CAL_WEBHOOK_SECRET=
```

## Launch Blockers

Do not publish as production until these are resolved:

- GitHub SSH or HTTPS push works.
- Vercel project is connected to the GitHub repo.
- Production env vars are configured in Vercel.
- `/impressum` contains reviewed real provider information.
- `/datenschutz` contains reviewed real privacy text.
- Cal.com booking link is real and verified.
- Resend sender/receiver values are real and verified.
- Placeholder SVG media is replaced or explicitly accepted for beta.

## Deployment

Preferred flow:

1. Push `main` to `git@github.com:chekovevg/agatha.git`.
2. Import the repo in Vercel.
3. Add env vars from `.env.example`.
4. Deploy preview first.
5. Verify routes, sitemap, robots, booking, and contact form.

Current known issue: SSH push previously failed with `Permission denied
(publickey)`. Configure GitHub SSH access or switch the remote to an HTTPS URL
with a valid GitHub login/token.

## AI Workflow

See `AGENTS.md` and `docs/AI_WORKFLOW.md`.
