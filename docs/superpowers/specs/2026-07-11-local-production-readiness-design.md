# Local Production Readiness Design

## Goal

Prepare the current English-only Agatha Music codebase for one later GitHub
push by improving maintainability, automated verification, API resilience,
repository hygiene, and safe platform defaults without changing visible
design, editorial copy, hero behavior, CTA placement, or conversion flows.

## Scope boundaries

- Preserve the rendered layout, responsive breakpoints, animations, links,
  form fields, booking flow, video interaction, and all English copy.
- Do not add dependencies unless a required capability cannot be implemented
  with the installed stack and the user approves it separately.
- Do not add storage, authentication, CMS, payments, consent UI, analytics, or
  deployment secrets.
- Do not push, merge, or create a pull request until the user explicitly asks.
- Preserve all user-owned changes already present in the dirty worktree.

## Repository hygiene

- Remove only confirmed diagnostic artifacts generated during local QA:
  `footer-debug-3002.png`, `next-dev-3000*.log`, and
  `next-start-3002*.log`.
- Extend `.gitignore` for local Next.js logs, debug screenshots, Playwright
  output, and other reproducible QA artifacts while keeping intentional public
  images and documentation tracked.
- Keep the approved design and implementation plan documents because they
  explain the routing and quality-hardening decisions.
- End with an auditable status/diff separating the requested work from any
  pre-existing changes; do not auto-stage or commit mixed changes.

## Header maintainability

- Keep `Header` as the public component with its current props and markup
  behavior.
- Extract scroll-direction visibility state into a focused hook that owns its
  listeners, animation-frame scheduling, and cleanup.
- Extract the mobile menu state machine/timer into a focused hook or small
  internal unit.
- Extract static navigation/social link construction and mobile menu markup
  only when the resulting units have clear inputs and no duplicated state.
- Preserve class names, DOM order, accessibility labels, timing, and responsive
  behavior so the refactor has zero intended visual change.

## Contact content and client behavior

- Move the existing English contact-form labels and status messages verbatim
  from the component to a typed content module under `content/`.
- Keep the network helper independent and keep retryable error behavior.
- Prefer behavior-level tests for request results and rendered accessibility
  semantics; avoid new assertions that merely search source text.

## Test architecture

- Keep focused Vitest tests for pure functions, route handlers, content models,
  and server-renderable components.
- Replace the most brittle source-string assertions in touched areas with
  output or behavior assertions. Existing pixel-sensitive editorial tests may
  remain when they protect an explicitly approved visual contract.
- Add a committed Playwright configuration and smoke suite using the installed
  `playwright` package. The suite must cover:
  - `/`, `/about`, `/classes`, `/media`, `/book`;
  - standard 404 behavior for `/en`, `/de`, `/ru` and representative nested
    paths;
  - mobile menu open/close and unprefixed navigation;
  - video iframe absent before interaction and present after interaction;
  - contact network-failure state, accessible announcement, and retryable
    submit button;
  - absence of Next.js error overlays and unexpected browser exceptions.
- E2E tests run against a locally started Next.js server on a dedicated port
  and must not send real email or require production secrets.

## API resilience

- Introduce a small request-body guard for contact and Cal webhook endpoints.
  Reject declared or observed JSON bodies above an explicit conservative limit
  with HTTP 413 before business processing.
- Preserve Zod as the authoritative payload validator and keep generic public
  error messages.
- Wrap Cal notification delivery so Resend failures produce a controlled 500
  response rather than an unhandled route rejection.
- Preserve the existing webhook secret contract and disabled behavior.
- Do not add webhook persistence or distributed rate limiting.

## Security headers

- Add conservative response headers through supported Next.js 16 config:
  `X-Content-Type-Options: nosniff`, a restrictive `Permissions-Policy`, and a
  referrer policy compatible with the current Cal.com embed.
- Use `Content-Security-Policy` only if a tested policy can support Next.js,
  Cal.com, YouTube nocookie embeds, local development, Vercel Analytics, and
  Speed Insights without weakening the policy into meaningless complexity.
- Do not add obsolete headers or a frame restriction that blocks intended
  third-party embeds.

## Dependency policy

- Inspect `npm outdated` and `npm audit` results.
- Apply only patch/minor updates that remain within existing declared ranges,
  have no migration requirement, and pass the full verification suite.
- Do not run `npm audit fix --force`, accept a major downgrade, or add an npm
  override solely to silence an advisory.
- Document advisories that cannot be safely resolved in the current supported
  Next.js line.

## Scripts and CI

- Add a cross-platform `check` script that runs typecheck, lint, unit tests,
  and production build using npm scripts rather than shell-specific syntax.
- Add an `e2e` script for the Playwright smoke suite.
- Add a minimal GitHub Actions workflow for supported Node.js 20 that performs
  `npm ci`, `npm run check`, installs the Playwright Chromium runtime, and runs
  the smoke suite.
- Use dependency caching through the standard setup-node npm cache; do not add
  external CI actions beyond official GitHub/Playwright-supported setup.

## Documentation

- Update README, AI workflow, and launch checklist with the actual English-only
  routes, new verification commands, CI behavior, local URL, and known
  serverless rate-limit limitation.
- Keep historical specs as historical records; do not rewrite them to look as
  though the original multilingual design never existed.

## Verification and acceptance criteria

- Header snapshots/behavior remain equivalent before and after refactoring on
  desktop and mobile.
- No content, hero, CTA, or conversion diff is introduced.
- `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`, and the new
  Playwright suite pass from a clean generated-output state.
- Primary routes return 200 and legacy locale routes return 404.
- Contact and webhook oversized bodies return 413; controlled delivery errors
  return the documented service error status.
- Browser console contains no application errors; expected local-only Vercel
  Analytics script warnings are documented and not treated as product faults.
- `git diff --check` passes and diagnostic artifacts are absent from status.

## Explicit non-goals

- Visual redesign or component restyling.
- Funnel, SEO-copy, CTA, booking-offer, or conversion optimization.
- Replacing or simplifying Canvas, WebGL, ASCII, or hero query controls.
- Production deployment, push, merge, PR, or secret changes.
- Distributed infrastructure or legal-content decisions.
