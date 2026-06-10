# Launch Checklist

Use this checklist before treating the site as beta-ready or production-ready.

## Repository

- [x] GitHub HTTPS push works.
- [x] `main` is pushed to `https://github.com/chekovevg/agatha.git`.
- [ ] No secrets are committed.
- [ ] `git status --short --branch` is clean before deployment.

## Vercel

- [ ] Vercel project is connected to the GitHub repo.
- [ ] Preview deployment is created before production deployment.
- [ ] `NEXT_PUBLIC_SITE_URL` points to the deployed site URL.
- [ ] `NEXT_PUBLIC_CAL_LINK` is set.
- [ ] `RESEND_API_KEY` is set.
- [ ] `CONTACT_TO_EMAIL` is set.
- [ ] `CONTACT_FROM_EMAIL` is set and verified in Resend.
- [ ] Optional public links are set if available.

## Booking

- [ ] `/en/book` renders a real Cal.com embed or a real fallback link.
- [ ] Trial Lesson event exists in Cal.com.
- [ ] Intake questions are configured in Cal.com.
- [ ] Calendar sync is configured in Cal.com.
- [ ] No custom calendar logic is added to the site.

## Contact

- [ ] Contact form accepts a valid submission.
- [ ] Invalid email and missing required fields are rejected.
- [ ] Honeypot submissions do not send email.
- [ ] Agathe receives the notification email.
- [ ] User receives the auto-reply email.

## Legal

- [ ] `/impressum` has real reviewed provider data.
- [ ] `/datenschutz` has reviewed privacy text for Resend, Cal.com, Vercel,
  and video embeds.
- [ ] No cookie banner is needed, or a legal decision says one is required.
- [ ] No payment, database, auth, or CMS claims are present unless implemented.

## Content And Media

- [ ] English source copy is reviewed.
- [ ] German draft copy is reviewed by a human speaker.
- [ ] Russian draft copy is reviewed by a human speaker.
- [ ] Placeholder SVGs are replaced with approved photos/media or accepted for
  beta.
- [ ] Preply, Instagram, and WhatsApp links are real if displayed.

## Verification

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd test
npm.cmd run build
```

Browser QA:

- [ ] `/` redirects to `/en`.
- [ ] `/en`, `/de`, `/ru` render.
- [ ] `/en/book` renders booking.
- [ ] `/impressum` and `/datenschutz` render.
- [ ] Video iframe is absent before click and present after click.
- [ ] Contact form success and error states work.
- [ ] Mobile header/menu and hero are usable.
- [ ] `/sitemap.xml` and `/robots.txt` are reachable.
