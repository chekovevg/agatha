# Local Production Readiness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the current English-only project locally production-ready for one later GitHub push without changing visible design, copy, hero behavior, CTA placement, or conversion flows.

**Architecture:** Preserve existing page/component contracts while extracting header state logic, centralizing contact UI content, adding shared JSON-body protection, and extending verification from Vitest to Playwright. Platform hardening stays dependency-free and uses supported Next.js 16 configuration; CI only automates the same local commands.

**Tech Stack:** Next.js 16.2, React 19.2, TypeScript, Tailwind CSS 4, Vitest 4, Playwright 1.60, npm, GitHub Actions.

## Global Constraints

- Preserve rendered layout, responsive behavior, animations, links, form fields, hero, CTA placement, and English copy.
- Do not add runtime dependencies, external services, storage, secrets, or deployment mutations.
- Do not stage, commit, push, merge, or create a PR automatically.
- Preserve unrelated user-owned edits in the dirty worktree.
- Follow TDD for behavior changes and run browser QA after UI-adjacent refactors.

---

### Task 1: Repository hygiene

**Files:**
- Modify: `.gitignore`
- Delete: `footer-debug-3002.png`
- Delete: `next-dev-3000.log`
- Delete: `next-dev-3000.err.log`
- Delete: `next-start-3002.log`
- Delete: `next-start-3002.err.log`

**Interfaces:** None.

- [ ] **Step 1: Add ignored-artifact assertions to the structure test**

Update `tests/site-structure.test.ts` to assert `.gitignore` covers root `next-*.log`, `*-debug-*.png`, `playwright-report/`, and `test-results/`.

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npm.cmd test -- tests/site-structure.test.ts`

Expected: missing ignore patterns fail.

- [ ] **Step 3: Update `.gitignore` and delete only approved artifacts**

Add:

```gitignore
# local QA artifacts
/next-*.log
/*-debug-*.png
/playwright-report/
/test-results/
```

Delete the five approved root artifacts after confirming their resolved paths remain inside the workspace.

- [ ] **Step 4: Run the focused test and verify GREEN**

Run: `npm.cmd test -- tests/site-structure.test.ts`

Expected: structure tests pass and artifacts disappear from `git status --short`.

### Task 2: Header state extraction without markup changes

**Files:**
- Create: `components/layout/header-state.ts`
- Create: `components/layout/useHeaderController.ts`
- Create: `tests/header-state.test.ts`
- Modify: `components/layout/Header.tsx`
- Verify: `tests/home-hero.test.tsx`

**Interfaces:**
- Produces: `shouldHideHeader(input: {currentScrollY: number; lastScrollY: number; viewportWidth: number; menuVisible: boolean}): boolean | null`, where `null` preserves the current state.
- Produces: `useHeaderController(): {menuState; menuVisible; menuExpanded; headerHidden; openMenu; closeMenu}`.

- [ ] **Step 1: Write failing pure state tests**

Cover top-of-page/mobile/menu-open visibility, scroll down hiding, scroll up revealing, and sub-threshold deltas preserving state.

- [ ] **Step 2: Run focused tests and verify RED**

Run: `npm.cmd test -- tests/header-state.test.ts tests/home-hero.test.tsx`

Expected: missing state module fails.

- [ ] **Step 3: Implement state helper and controller hook**

Move listener/timer/ref ownership into the hook, use the pure helper for scroll decisions, and keep the current thresholds: desktop `>600`, delta `>6`/`<-6`, close delay `700ms`.

- [ ] **Step 4: Reduce Header to rendering and link construction**

Replace internal effects/state with `useHeaderController()` while preserving all existing class strings, DOM order, data attributes, labels, and callbacks.

- [ ] **Step 5: Run focused tests and verify GREEN**

Run: `npm.cmd test -- tests/header-state.test.ts tests/home-hero.test.tsx tests/footer.test.tsx`

Expected: all focused tests pass.

### Task 3: Typed contact form content and behavior tests

**Files:**
- Create: `content/contact-form.ts`
- Modify: `components/ui/ContactForm.tsx`
- Modify: `tests/contact-client.test.ts`

**Interfaces:**
- Produces: `contactFormContent` with exact existing labels/status text and readonly preferred-language options.

- [ ] **Step 1: Replace source-reading assertions with failing render/content assertions**

Render `ContactForm` to static markup and assert `aria-busy`, `role="status"`, `aria-live="polite"`, exact labels, and submit copy. Import `contactFormContent` and assert its existing values verbatim.

- [ ] **Step 2: Run focused test and verify RED**

Run: `npm.cmd test -- tests/contact-client.test.ts`

Expected: missing content module fails.

- [ ] **Step 3: Move copy without changing output**

Export the current strings from `content/contact-form.ts`, render options from its readonly array, and remove the local `copy` object.

- [ ] **Step 4: Run focused tests and verify GREEN**

Run: `npm.cmd test -- tests/contact-client.test.ts tests/contact.test.ts`

Expected: all focused tests pass.

### Task 4: Shared bounded JSON body reader

**Files:**
- Create: `lib/request-json.ts`
- Create: `tests/request-json.test.ts`
- Modify: `app/api/contact/route.ts`
- Modify: `tests/contact.test.ts`

**Interfaces:**
- Produces: `readJsonBody(request: Request, maxBytes: number): Promise<{ok: true; data: unknown} | {ok: false; reason: "invalid" | "too-large"}>`.
- Contact payload limit: `16_384` bytes; oversized responses use status 413 and `{error: "Request too large"}`.

- [ ] **Step 1: Write failing helper/contact tests**

Cover valid JSON, malformed JSON, declared oversize, actual UTF-8 oversize without `content-length`, and contact 413 behavior.

- [ ] **Step 2: Run focused tests and verify RED**

Run: `npm.cmd test -- tests/request-json.test.ts tests/contact.test.ts`

Expected: missing helper and contact oversize returning 400 fail.

- [ ] **Step 3: Implement the reader and integrate contact route**

Check a numeric `content-length` before reading, read text once, measure with `TextEncoder`, parse JSON, and map `too-large`/`invalid` to 413/400.

- [ ] **Step 4: Run focused tests and verify GREEN**

Run: `npm.cmd test -- tests/request-json.test.ts tests/contact.test.ts`

Expected: all focused tests pass.

### Task 5: Cal webhook controlled failures

**Files:**
- Create: `tests/cal-webhook.test.ts`
- Modify: `app/api/cal/webhook/route.ts`

**Interfaces:**
- Webhook payload limit: `262_144` bytes.
- Delivery failures return status 500 and `{error: "Unable to process webhook"}`.
- Disabled, unauthorized, invalid, and success contracts remain 503, 401, 400, and 200.

- [ ] **Step 1: Write failing route tests**

Mock env and Resend notification delivery; cover disabled, unauthorized, malformed, oversized, invalid schema, delivery rejection, and success.

- [ ] **Step 2: Run focused test and verify RED**

Run: `npm.cmd test -- tests/cal-webhook.test.ts`

Expected: oversized request is not 413 and send rejection escapes.

- [ ] **Step 3: Reuse `readJsonBody` and catch delivery errors**

Return controlled public responses while preserving the secret check before body processing.

- [ ] **Step 4: Run focused test and verify GREEN**

Run: `npm.cmd test -- tests/cal-webhook.test.ts tests/request-json.test.ts`

Expected: all focused tests pass.

### Task 6: Safe response headers and dependency audit

**Files:**
- Create: `tests/next-config.test.ts`
- Modify: `next.config.ts`
- Modify only if safe within declared ranges: `package-lock.json`

**Interfaces:**
- Next config `headers()` returns `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and a restrictive `Permissions-Policy` for `/:path*`.

- [ ] **Step 1: Write failing config test**

Import the config, call `headers()`, and assert the exact wildcard source and header values.

- [ ] **Step 2: Run focused test and verify RED**

Run: `npm.cmd test -- tests/next-config.test.ts`

Expected: `headers` is undefined.

- [ ] **Step 3: Implement supported Next.js headers**

Do not add CSP in this task because the current inline styles, Next dev runtime, Cal.com, YouTube, and Vercel scripts require a separately nonce-based design.

- [ ] **Step 4: Inspect dependencies read-only**

Run: `npm.cmd outdated` and `npm.cmd audit`.

Apply `npm.cmd update` only if all resolved updates remain inside existing declared ranges; otherwise leave dependencies unchanged and document the result.

- [ ] **Step 5: Run focused test and verification**

Run: `npm.cmd test -- tests/next-config.test.ts`

Run: `npm.cmd run typecheck`

Expected: both pass.

### Task 7: Verification scripts and Playwright smoke suite

**Files:**
- Modify: `package.json`
- Create: `playwright.config.ts`
- Create: `tests/e2e/site-smoke.spec.ts`

**Interfaces:**
- Produces scripts: `check`, `e2e`, and `e2e:run`.
- Playwright uses `http://127.0.0.1:3101`, Chromium, one worker, trace/screenshot on failure, and `npm run start -- --port 3101` as its web server.

- [ ] **Step 1: Add the smoke suite before scripts/config**

Cover primary 200 routes, representative locale 404s, mobile menu open/close, media iframe click-to-load, contact aborted-request error/retry, and browser page errors.

- [ ] **Step 2: Run Playwright and verify RED**

Run: `npm.cmd run e2e:run`

Expected: missing script/config fails.

- [ ] **Step 3: Add scripts and config**

Use:

```json
"check": "npm run typecheck && npm run lint && npm test && npm run build",
"e2e": "npm run build && playwright test",
"e2e:run": "playwright test"
```

The config starts the already-built production server, avoiding conflict with the user's dev server on port 3000.

- [ ] **Step 4: Run the suite and verify GREEN**

Run: `npm.cmd run build`

Run: `npm.cmd run e2e:run`

Expected: all smoke tests pass without production secrets.

### Task 8: GitHub Actions CI

**Files:**
- Create: `.github/workflows/ci.yml`
- Modify: `tests/site-structure.test.ts`

**Interfaces:**
- Workflow triggers on push and pull_request, uses Node.js 20, npm cache, `npm ci`, `npm run check`, Playwright Chromium installation, and `npm run e2e:run`.

- [ ] **Step 1: Add failing workflow structure assertions**

Assert the workflow exists and contains the approved official actions/commands.

- [ ] **Step 2: Run focused test and verify RED**

Run: `npm.cmd test -- tests/site-structure.test.ts`

Expected: missing workflow fails.

- [ ] **Step 3: Add minimal CI workflow**

Use `actions/checkout@v4`, `actions/setup-node@v4`, `cache: npm`, and `npx playwright install --with-deps chromium`; set a 20-minute timeout and no deployment permissions.

- [ ] **Step 4: Run focused test and verify GREEN**

Run: `npm.cmd test -- tests/site-structure.test.ts`

Expected: structure tests pass.

### Task 9: Documentation and complete verification

**Files:**
- Modify factual sections only: `README.md`, `docs/AI_WORKFLOW.md`, `docs/LAUNCH_CHECKLIST.md`, `AGENTS.md`

**Interfaces:** None.

- [ ] **Step 1: Document local and CI verification**

Add `npm.cmd run check`, `npm.cmd run e2e`, port behavior, route expectations, known in-process rate-limit limitation, and unresolved dependency advisory if still present.

- [ ] **Step 2: Stop the existing dev server before final generated-output checks**

Terminate only the dev-server session started for this task; do not terminate unrelated processes.

- [ ] **Step 3: Run full verification from fresh generated state**

Remove only the verified workspace `.next` directory, then run:

```powershell
npm.cmd run check
npm.cmd run e2e:run
git diff --check
```

Expected: all commands exit 0.

- [ ] **Step 4: Run final browser and HTTP checks**

Verify desktop/mobile primary routes, 404 locale routes, mobile menu, video interaction, contact error retry, response security headers, and no application console errors.

- [ ] **Step 5: Audit final status**

Run `git status --short`, confirm diagnostic artifacts are gone, and report changed files, checks, known risks, confidence, and the recommended single-commit/push next step without staging or pushing.
