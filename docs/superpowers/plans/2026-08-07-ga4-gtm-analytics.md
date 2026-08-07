# Agatha Website GA4, GTM, and Search Console Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Attribute successful Cal.com bookings to their traffic source with a consent-gated GA4/GTM funnel and linked Search Console data.

**Architecture:** A single client analytics manager owns consent, production-host gating, GTM loading, and booking-link click capture. A focused Cal.com client embed forwards only a redacted success signal into the same data layer. GA4, GTM, and Search Console are configured in the user's signed-in Chrome session.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, native browser APIs, Google Tag Manager, GA4, Google Search Console, Cal.com embed API, Vitest, Playwright.

## Global Constraints

- Add no npm dependencies.
- Use Basic Consent Mode: Google tags do not load or send data before consent.
- GTM/GA4 must not load before consent.
- GTM/GA4 must not load on localhost or any `*.vercel.app` hostname.
- Send no Cal.com payload fields or PII to GTM/GA4.
- Track only `booking_cta_click` with `cta_location` and `booking_completed` with `booking_type: intro_call | music_lesson`.
- Preserve booking behavior when analytics, GTM, or Cal embed scripts fail.
- Do not edit unrelated user changes in `app/globals.css` or `tests/home-hero.test.tsx`.
- Do not commit, deploy, change DNS, or publish the GTM container without explicit authorization.

---

## File map

- Create `lib/analytics.ts`: pure analytics contracts, host/consent checks, data-layer push helpers, Cal URL/UTM parsing, and one-shot booking-success tracking.
- Create `components/analytics/AnalyticsManager.tsx`: consent banner, preference management, delegated CTA listener, and consent-gated GTM loader.
- Create `components/analytics/CalBookingEmbed.tsx`: official inline Cal.com embed and redacted success callback.
- Create `tests/analytics.test.ts`: direct tests for analytics logic and privacy boundaries.
- Create `tests/analytics-ui.test.tsx`: static accessibility and markup checks for the banner and tracked CTA attributes.
- Modify `lib/env.ts` and `.env.example`: add optional `NEXT_PUBLIC_GTM_ID`.
- Modify `app/layout.tsx`: mount the manager once.
- Modify `components/sections/BookingSection.tsx`: render the Cal embed component.
- Modify booking CTA call sites in `Header.tsx`, `HomePage.tsx`, `ClassesPage.tsx`, `MediaPage.tsx`, and `Footer.tsx`: add fixed `data-analytics-booking-cta` locations.
- Modify `app/datenschutz/page.tsx`: add reviewed-scope analytics disclosure and preference control without inventing missing controller/legal details.
- Modify `tests/site-structure.test.ts` and `tests/footer.test.tsx`: update structural assertions for the official embed and analytics attributes.

---

### Task 1: Analytics contracts and environment gate

**Files:**
- Create: `lib/analytics.ts`
- Create: `tests/analytics.test.ts`
- Modify: `lib/env.ts`
- Modify: `.env.example`

**Interfaces:**
- Produces: `AnalyticsConsent = "granted" | "denied"`, `BookingType = "intro_call" | "music_lesson"`, `canLoadAnalytics(hostname: string, gtmId: string | undefined, consent: AnalyticsConsent | null): boolean`, `createBookingClickEvent(ctaLocation: string): AnalyticsEvent`, `createBookingCompletedEvent(bookingType: BookingType): AnalyticsEvent`, `readAnalyticsConsent(storage: Pick<Storage, "getItem">): AnalyticsConsent | null`, `writeAnalyticsConsent(storage: Pick<Storage, "setItem">, consent: AnalyticsConsent): void`, `pushAnalyticsEvent(event: AnalyticsEvent): boolean`, `calPathFromUrl(url: string): string | null`, `readCalUtm(search: string): Record<string, string>`, and `createBookingSuccessTracker(push: (event: AnalyticsEvent) => unknown): (notification: unknown) => void`.
- Consumes: no earlier task interfaces.

- [ ] **Step 1: Write failing tests for the privacy and event contracts**

```ts
expect(canLoadAnalytics("agathamusic.com", "GTM-ABC123", "granted")).toBe(true);
expect(canLoadAnalytics("www.agathamusic.com", "GTM-ABC123", "granted")).toBe(true);
expect(canLoadAnalytics("agatha-pied.vercel.app", "GTM-ABC123", "granted")).toBe(false);
expect(canLoadAnalytics("localhost", "GTM-ABC123", "granted")).toBe(false);
expect(canLoadAnalytics("agathamusic.com", "GTM-ABC123", "denied")).toBe(false);
expect(createBookingClickEvent("header")).toEqual({
  event: "booking_cta_click",
  cta_location: "header",
});
expect(createBookingCompletedEvent("intro_call")).toEqual({
  event: "booking_completed",
  booking_type: "intro_call",
});
expect(readCalUtm("?utm_source=telegram&utm_medium=social&email=nope@example.com")).toEqual({
  utm_source: "telegram",
  utm_medium: "social",
});
```

Add tests that pass the two exact supported Cal titles to the function returned
by `createBookingSuccessTracker(push)`, reject malformed or unexpected titles,
and suppress duplicate valid notifications.

- [ ] **Step 2: Run the focused test and observe the expected failure**

Run: `npm.cmd test -- tests/analytics.test.ts`

Expected: FAIL because `@/lib/analytics` does not exist.

- [ ] **Step 3: Implement the minimum analytics module**

Use these fixed values and shapes:

```ts
export const ANALYTICS_CONSENT_KEY = "agatha.analytics-consent";
export type AnalyticsConsent = "granted" | "denied";
export type BookingType = "intro_call" | "music_lesson";
export type AnalyticsEvent =
  | {event: "booking_cta_click"; cta_location: string}
  | {event: "booking_completed"; booking_type: BookingType};

const productionHosts = new Set(["agathamusic.com", "www.agathamusic.com"]);
const gtmIdPattern = /^GTM-[A-Z0-9]+$/;
```

`readCalUtm` must copy only `utm_source`, `utm_medium`, and `utm_campaign` when
non-empty. `calPathFromUrl` must accept only `https://cal.com/...` and return
the path without leading/trailing slashes. `pushAnalyticsEvent` must return
`false` without mutating `window.dataLayer` unless stored consent is granted
and `window.location.hostname` is a production host.

- [ ] **Step 4: Add and validate the public GTM environment variable**

Add to `envSchema` and `envSchema.parse`:

```ts
NEXT_PUBLIC_GTM_ID: z.string().regex(/^GTM-[A-Z0-9]+$/).optional(),
```

Add `NEXT_PUBLIC_GTM_ID=` to `.env.example`. Do not write an ID into an ignored
`.env` file.

- [ ] **Step 5: Run the focused tests**

Run: `npm.cmd test -- tests/analytics.test.ts`

Expected: PASS.

---

### Task 2: Consent banner and consent-gated GTM loader

**Files:**
- Create: `components/analytics/AnalyticsManager.tsx`
- Create: `tests/analytics-ui.test.tsx`
- Modify: `app/layout.tsx`
- Modify: `app/datenschutz/page.tsx`

**Interfaces:**
- Consumes: Task 1 consent helpers, `canLoadAnalytics`, `createBookingClickEvent`, and `pushAnalyticsEvent`.
- Produces: `AnalyticsManager({gtmId}: {gtmId?: string})` and exported presentational `AnalyticsConsentBanner` for static accessibility testing.

- [ ] **Step 1: Write a failing static banner test**

Render `AnalyticsConsentBanner` with no-op callbacks and assert the HTML has:

```ts
expect(html).toContain('role="region"');
expect(html).toContain('aria-label="Analytics preferences"');
expect(html).toContain("Allow analytics");
expect(html).toContain("Continue without analytics");
expect(html).toContain('href="/datenschutz"');
```

Also render `DatenschutzPage` and assert it contains `Google Analytics`,
`consent`, and `data-analytics-preferences`.

- [ ] **Step 2: Run the UI test and observe the expected failure**

Run: `npm.cmd test -- tests/analytics-ui.test.tsx`

Expected: FAIL because the manager and disclosure do not exist.

- [ ] **Step 3: Implement `AnalyticsManager`**

The client component must:

1. Read `ANALYTICS_CONSENT_KEY` after hydration.
2. Render the banner only when no choice is stored or when an element with
   `data-analytics-preferences` is activated.
3. On allow, persist `granted`, initialize `window.dataLayer`, enqueue consent
   defaults with `analytics_storage: "granted"` and all ad consent values
   `"denied"`, then enqueue `{event: "gtm.js", "gtm.start": Date.now()}` and
   mount `next/script` for
   `https://www.googletagmanager.com/gtm.js?id=${gtmId}` only when
   `canLoadAnalytics(...)` is true.
4. On continue-without, persist `denied`, enqueue a consent update to denied if
   GTM was already loaded, delete accessible cookies whose names start `_ga`,
   and do not render the GTM script on later loads.
5. Use one document click listener for both preference controls and elements
   carrying `data-analytics-booking-cta`; CTA events are emitted only while
   stored consent is granted.

Use a non-modal fixed region with two ordinary buttons, visible focus styles,
readable contrast, and no focus trap. Omit GTM's `<noscript>` iframe because it
would bypass the JavaScript consent gate.

- [ ] **Step 4: Mount the manager once from the root layout**

Add beneath page content and before Vercel telemetry:

```tsx
<AnalyticsManager gtmId={env.NEXT_PUBLIC_GTM_ID} />
```

Keep `RootLayout` a server component.

- [ ] **Step 5: Update `/datenschutz` within the approved legal boundary**

Keep the existing warning that final legal review is required. Add a focused
Google Analytics section stating that analytics is consent-based, disabled
until allowed, used for page/source and booking-funnel measurement, and sends
no booking form contents. Add:

```tsx
<button type="button" data-analytics-preferences>
  Review analytics preferences
</button>
```

Do not invent controller address, retention promises, transfer safeguards, or
legal-contact details not already supplied.

- [ ] **Step 6: Run the UI and analytics tests**

Run: `npm.cmd test -- tests/analytics-ui.test.tsx tests/analytics.test.ts`

Expected: PASS.

---

### Task 3: Booking CTA funnel event

**Files:**
- Modify: `components/layout/Header.tsx`
- Modify: `components/pages/HomePage.tsx`
- Modify: `components/pages/ClassesPage.tsx`
- Modify: `components/pages/MediaPage.tsx`
- Modify: `components/layout/Footer.tsx`
- Modify: `tests/analytics-ui.test.tsx`
- Modify: `tests/footer.test.tsx`

**Interfaces:**
- Consumes: Task 2 delegated listener contract: `data-analytics-booking-cta="<location>"`.
- Produces: CTA locations `header`, `home`, `classes`, `media`, and `footer`.

- [ ] **Step 1: Add failing rendered-markup assertions**

Assert that the relevant page/layout renderings include these exact attributes:

```html
data-analytics-booking-cta="header"
data-analytics-booking-cta="home"
data-analytics-booking-cta="classes"
data-analytics-booking-cta="media"
data-analytics-booking-cta="footer"
```

The desktop and mobile header CTAs both use `header`; do not create separate
event names.

- [ ] **Step 2: Run the focused test and observe the expected failure**

Run: `npm.cmd test -- tests/analytics-ui.test.tsx tests/footer.test.tsx`

Expected: FAIL because the data attributes are absent.

- [ ] **Step 3: Add only the fixed data attributes to existing links**

Do not replace link primitives, alter labels, add wrappers, or change styling.
Every link continues to navigate normally when analytics is unavailable.

- [ ] **Step 4: Run the focused tests**

Run: `npm.cmd test -- tests/analytics-ui.test.tsx tests/footer.test.tsx`

Expected: PASS.

---

### Task 4: Official Cal.com embed and redacted completion event

**Files:**
- Create: `components/analytics/CalBookingEmbed.tsx`
- Modify: `components/sections/BookingSection.tsx`
- Modify: `tests/analytics.test.ts`
- Modify: `tests/site-structure.test.ts`

**Interfaces:**
- Consumes: Task 1 `calPathFromUrl`, `readCalUtm`, `pushAnalyticsEvent`, and `createBookingSuccessTracker`.
- Produces: `CalBookingEmbed({url, title}: {url: string; title: string})`.

- [ ] **Step 1: Add failing embed contract assertions**

Assert that `BookingSection` renders the Cal embed component when the link is
configured, retains the existing contact fallback when absent, and that the
embed source subscribes to `bookingSuccessfulV2` rather than the deprecated
`bookingSuccessful`. Extend `tests/analytics.test.ts` to prove unrelated query
parameters never reach `readCalUtm` output.

- [ ] **Step 2: Run the focused tests and observe the expected failure**

Run: `npm.cmd test -- tests/analytics.test.ts tests/site-structure.test.ts`

Expected: FAIL because the official embed component is absent.

- [ ] **Step 3: Implement the official inline embed with no new package**

Use Cal.com's official loader URL `https://app.cal.com/embed/embed.js`, initialize
with origin `https://cal.com`, and invoke the non-namespaced API:

```ts
Cal("init", {origin: "https://cal.com"});
Cal("inline", {
  elementOrSelector: "#agatha-cal-inline",
  calLink: calPathFromUrl(url),
  config: readCalUtm(window.location.search),
});
Cal("on", {
  action: "bookingSuccessfulV2",
  callback: createBookingSuccessTracker(pushAnalyticsEvent),
});
```

Copy the bootstrap loader from Cal.com's current Embed Snippet Generator in the
signed-in browser rather than approximating it. Render a minimum-height inline
container with the existing title available to assistive technology. If the
script fails, leave a normal link to `url` visible so booking still works.

- [ ] **Step 4: Replace only the raw iframe branch**

In `BookingSection`, replace the existing iframe with:

```tsx
<CalBookingEmbed url={calLink} title="Book an intro call with Agatha" />
```

Keep the existing missing-link fallback and event-type cards unchanged.

- [ ] **Step 5: Run the focused tests**

Run: `npm.cmd test -- tests/analytics.test.ts tests/site-structure.test.ts`

Expected: PASS.

---

### Task 5: Create and configure Google resources in Chrome

**Files:**
- No source files unless Search Console requires the URL-prefix HTML-tag fallback.

**Interfaces:**
- Consumes: production domain `agathamusic.com`, GTM data-layer event names from Tasks 1-4.
- Produces: GA4 measurement ID, GTM container ID, GA4 key event, and linked Search Console property.

- [ ] **Step 1: Inspect before creating**

In the user's existing Chrome session, open Google Analytics, GTM, and Search
Console. Reuse any exact matching `Agatha Website` property/container and
`agathamusic.com` Search Console property; do not create duplicates.

- [ ] **Step 2: Create the missing GA4 property and web stream**

Under the user's existing Analytics account, use property name
`Agatha Website`, the user's current reporting timezone/currency unless Google
requires confirmation, and web stream URL `https://agathamusic.com`. Enable
enhanced measurement, including page views/history changes. Record the public
`G-...` measurement ID without exposing unrelated account data.

- [ ] **Step 3: Create the missing GTM web container**

Use container name `Agatha Website`, target platform `Web`, and the appropriate
country already associated with the account. Record the public `GTM-...` ID.

- [ ] **Step 4: Configure the minimum GTM workspace**

Create:

1. Google Tag using the GA4 `G-...` ID, firing on Initialization / All Pages.
2. Custom Event trigger `booking_cta_click` and GA4 Event tag of the same
   name with `cta_location = {{DLV - cta_location}}`.
3. Custom Event trigger `booking_completed` and GA4 Event tag of the same name with
   `booking_type = {{DLV - booking_type}}`.

Add only the two required Data Layer Variables. Keep the workspace unpublished
until deployment/publish authorization is explicit.

- [ ] **Step 5: Configure GA4 reporting**

Create `booking_completed` as a key event. Do not enable Google Signals, ads
personalization, audiences, or Google Ads linking.

- [ ] **Step 6: Connect Search Console**

Reuse or create the Domain property `agathamusic.com`. If DNS verification is
needed, stop for explicit authorization before writing the TXT record. After
verification, link the property to the GA4 web stream from GA4 Admin.

- [ ] **Step 7: Supply the GTM ID to the implementation safely**

Use the real `GTM-...` value only in the deployment environment when deployment
is authorized. For local checks, pass a syntactically valid test ID through the
process environment; do not create or edit `.env` files.

---

### Task 6: Integrated verification

**Files:**
- Modify only test files when a directly observed regression requires it.

**Interfaces:**
- Consumes: all earlier tasks.
- Produces: fresh verification evidence and a concise handoff of anything that requires deployment/publish/DNS authorization.

- [ ] **Step 1: Run project checks**

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd test
npm.cmd run build
```

Expected: all exit 0.

- [ ] **Step 2: Run local browser QA on desktop and mobile**

Check `/`, `/classes`, `/media`, `/book`, and `/datenschutz`. Verify keyboard
focus, both consent choices, reopening preferences, unchanged CTA navigation,
Cal fallback behavior, and no layout regression.

- [ ] **Step 3: Verify privacy boundaries from the network and data layer**

Confirm no requests to `googletagmanager.com`, `google-analytics.com`, or
`analytics.google.com` before consent, after denial, on localhost, or on a
Vercel preview hostname. With an allowed-host test harness and granted consent,
confirm exact data-layer payloads and one-shot completion de-duplication.

- [ ] **Step 4: Inspect the complete diff**

Run `git diff --check` and `git diff --` for every task-owned file. Confirm the
pre-existing edits to `app/globals.css`, `tests/home-hero.test.tsx`, and the
unrelated SEO spec remain untouched.

- [ ] **Step 5: Request the remaining external authorization**

If not already explicit, ask before production deployment, GTM publication, or
DNS verification. After those actions are authorized and completed, use GTM
Preview and GA4 DebugView to verify one `booking_cta_click` and one redacted
`booking_completed` from a test booking, then confirm Search Console is linked.
