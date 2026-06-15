# Launch Checklist

Use this checklist before treating the site as beta-ready or production-ready.

## Repository

- [x] GitHub HTTPS push works.
- [x] `main` is pushed to `https://github.com/chekovevg/agatha.git`.
- [x] No secrets are committed.
- [x] `git status --short --branch` is clean before deployment.

## Vercel

- [x] Vercel project is connected to the GitHub repo.
- [x] Production deployment is created from `main`.
- [x] `NEXT_PUBLIC_SITE_URL` points to `https://agatha-pied.vercel.app`.
- [x] `NEXT_PUBLIC_CAL_LINK` is set.
- [x] `RESEND_API_KEY` is set.
- [x] `CONTACT_TO_EMAIL` is set.
- [x] `CONTACT_FROM_EMAIL` is set to the temporary Resend sender
  `onboarding@resend.dev`.
- [ ] Replace the temporary Resend sender with a verified custom-domain sender.
- [ ] Optional public links are set if available.

## Booking

- [x] `/en/book` renders a real Cal.com embed or a real fallback link.
- [x] Trial Lesson event exists in Cal.com.
- [ ] Intake questions are configured in Cal.com.
- [ ] Calendar sync is configured in Cal.com.
- [x] No custom calendar logic is added to the site.

## Contact

- [x] Contact form accepts a valid submission.
- [ ] Invalid email and missing required fields are rejected.
- [ ] Honeypot submissions do not send email.
- [x] Test receiver receives the notification email.
- [x] Test visitor receives the auto-reply email.
- [ ] Replace temporary test receiver/sender setup with real Agatha email and
  verified domain sender.

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
- [ ] Anti-AI-slop review in `docs/UI_REVIEW.md` is completed for the editorial
  site.
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

- [x] `/` redirects to `/en`.
- [x] `/en`, `/de`, `/ru` render.
- [x] `/en/book` renders booking.
- [x] `/impressum` and `/datenschutz` render.
- [x] Video iframe is absent before click and present after click.
- [x] Contact form success state works on production.
- [ ] Contact form error state is checked manually in browser after final
  content pass.
- [x] Mobile header/menu and hero are usable.
- [x] `/sitemap.xml` and `/robots.txt` are reachable and use the production
  Vercel URL.
