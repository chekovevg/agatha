# English-only Routing and Reliability Design

## Goal

Make English the only language and the canonical unprefixed site while fixing
technical reliability, accessibility, and SEO issues that do not change the
marketing funnel, conversion strategy, hero, CTA placement, or editorial copy.

## Routing and localization

- Move the pages currently under `app/[locale]/` to unprefixed routes:
  `/`, `/about`, `/classes`, `/media`, and `/book`.
- Remove `next-intl`, the `i18n/` request configuration, locale message files,
  locale routing helpers, locale props, and locale-aware component links.
- Remove the proxy and all legacy locale redirects.
- Requests under `/en`, `/de`, `/ru`, and their nested paths must not redirect;
  because no matching routes remain, they must return the standard Next.js 404.
- Keep `/impressum` and `/datenschutz` at their current paths.
- Keep all existing English editorial content unchanged.

## Metadata and indexing

- Keep `<html lang="en">` as the single correct document language.
- Update canonical URLs, alternates, sitemap entries, and internal links to use
  unprefixed paths only.
- Remove locale alternates rather than retaining references to deleted routes.
- Avoid reporting every sitemap entry as newly modified on every build; omit
  `lastModified` until a real content modification date exists.

## Contact form reliability

- Catch network failures in the client and transition the form to its existing
  error state instead of leaving it disabled in `submitting`.
- Announce submitting, success, and error status accessibly with `aria-live`,
  and expose the form's busy state.
- When Resend is not configured, the API must return a service error rather
  than reporting a successful delivery. Development and production use the
  same truthful response contract.
- Preserve the existing fields, labels, validation rules, spam heuristics,
  email content, and visual layout.

## Rate limiting

- Keep the current dependency-free, in-process limiter as best-effort defense.
- Validate and reject malformed or obvious spam requests before consuming a
  legitimate submission quota.
- Bound stale in-memory entries so long-running processes do not accumulate IP
  keys indefinitely.
- Do not add a database, KV service, Vercel Firewall rule, or dependency. A
  distributed production-grade limit remains a documented deployment concern.

## Booking and third-party behavior

- Preserve the existing Cal.com embed and fallback behavior.
- Add non-behavioral iframe safeguards where appropriate, including lazy
  loading, without introducing consent UI or changing the booking funnel.
- Do not add webhook persistence or deduplication because that would require
  new storage infrastructure outside the approved v1 architecture.

## Testing and acceptance criteria

- Add or update tests before each behavior change.
- Verify `/`, `/about`, `/classes`, `/media`, and `/book` build as the primary
  English pages with no locale parameter.
- Verify locale-prefixed URLs are not represented by application routes or
  redirects.
- Verify contact network failures leave the form retryable and expose an error.
- Verify missing email configuration yields a non-success API response.
- Verify malformed/spam requests do not consume valid-submission quota and
  stale limiter state is pruned.
- Run typecheck, lint, unit tests, production build, and desktop/mobile browser
  smoke QA.

## Explicit non-goals

- No new or relocated CTA buttons.
- No changes to hero content, effects, or layout.
- No copywriting or conversion optimization.
- No visual redesign.
- No new dependencies, authentication, CMS, database, CRM, payments, custom
  calendar, or deployment configuration.
