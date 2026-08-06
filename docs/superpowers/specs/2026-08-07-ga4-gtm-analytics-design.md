# Agatha Website GA4, GTM, and Search Console Design

## Goal

Answer one practical question: which acquisition source produced a successful
trial-lesson booking. The initial funnel is:

`page_view -> book_trial_cta_click -> Cal.com booking -> generate_lead`

## Scope

- Reuse a matching GA4 property if one already exists; otherwise create one
  named `Agatha Website` under the user's existing Analytics account, with a
  web stream for `https://agathamusic.com`.
- Reuse a matching GTM web container if one already exists; otherwise create
  one named `Agatha Website`, then connect it to the GA4 stream with one Google
  Tag and two event tags.
- Reuse or create a Google Search Console property for `agathamusic.com` and
  link it to GA4 without creating a duplicate property.
- Add Basic Consent Mode: GTM and GA4 do not load or send data until the visitor
  selects `Allow analytics`.
- Track booking CTA clicks as `book_trial_cta_click` with a non-personal
  `cta_location` parameter.
- Convert Cal.com's `bookingSuccessfulV2` embed event to the recommended GA4
  event `generate_lead`, with only `booking_type: trial_lesson`.
- Mark `generate_lead` as a GA4 key event.
- Update the existing English `Datenschutz` placeholder to describe Google
  Analytics, consent, withdrawal, and the other processors already named on
  the page. The text remains subject to final legal review before launch.

Out of scope: ad audiences, Google Ads, remarketing, advanced consent mode,
scroll/time/form-field events, dashboards, custom attribution models, and
tracking any booking payload or personal data.

## Production and privacy boundaries

Analytics may run only when all three conditions are true:

1. `NEXT_PUBLIC_GTM_ID` is configured.
2. The hostname is `agathamusic.com` or `www.agathamusic.com`.
3. The visitor granted analytics consent.

Localhost and `*.vercel.app` deployments never load the production GTM
container. A visitor's choice is stored in first-party browser storage. The
banner offers equally visible allow and continue-without-analytics actions. A
control on `/datenschutz` lets the visitor reopen the choice and withdraw
consent; withdrawal updates analytics consent to denied for the current page,
deletes GA cookies that the site can access, and prevents GTM loading on later
page loads.

No Cal.com event payload fields are sent to GTM or GA4. In particular, do not
send names, email addresses, booking IDs, titles, times, status, or video-call
URLs.

## Site architecture

A small client analytics component mounted from the root layout owns consent,
production-host gating, GTM script injection, and the shared `dataLayer`.
Booking links opt in with a data attribute. One delegated click listener emits
`book_trial_cta_click` and reads the link's fixed `cta_location`; this avoids a
handler or component for every CTA. Current locations are `header` (desktop and
mobile share one value), `home`, `classes`, `media`, and `footer`.

The current raw Cal.com iframe is replaced by Cal.com's official inline embed
snippet on the booking page so the parent page can subscribe to
`bookingSuccessfulV2`. The rendered booking remains inline. On successful
creation, the listener pushes only:

```json
{"event":"generate_lead","booking_type":"trial_lesson"}
```

The embed receives only explicitly selected UTM parameters from the page when
present (`utm_source`, `utm_medium`, and `utm_campaign`); arbitrary query
parameters are not forwarded.

## GTM and GA4 configuration

The container contains:

- one Google Tag using the GA4 measurement ID;
- one custom-event trigger and GA4 event tag for `book_trial_cta_click`;
- one custom-event trigger and GA4 event tag for `generate_lead`;
- a `cta_location` event parameter on the CTA event;
- a `booking_type` event parameter on the lead event.

GA4 enhanced measurement supplies normal page views and source/medium reports.
`generate_lead` is configured as a key event. The primary acquisition views are
Session source / medium for the converting session and First user source /
medium for first-touch discovery.

## Search Console

Prefer a Domain property for `agathamusic.com` so both apex and `www` are
covered. Verify it through the domain's existing DNS provider when accessible;
otherwise use a URL-prefix property and the smallest supported site
verification method. Link the verified Search Console property to the GA4 web
stream. This adds search queries, impressions, clicks, positions, and landing
pages without another visitor-tracking script.

## Failure behavior

- Missing or malformed GTM configuration leaves the site functional and does
  not load analytics.
- Declining or withdrawing consent leaves booking fully functional.
- GTM, GA4, or Cal embed script failure never blocks navigation or the booking
  fallback.
- Duplicate Cal success notifications in one page lifecycle emit one
  `generate_lead` event.

## Verification

- Unit tests cover production-host gating, consent persistence/withdrawal,
  booking CTA data-layer payloads, lead payload redaction, and de-duplication.
- Existing typecheck, lint, Vitest, and production build checks remain green.
- Browser QA checks banner keyboard/focus behavior and layouts on desktop and
  mobile.
- Network inspection confirms no GTM/GA requests before consent and none on
  localhost or Vercel preview.
- GTM Preview and GA4 DebugView confirm one CTA event and one redacted
  `generate_lead` event for a test booking.

Production deployment, DNS changes, and GTM container publishing are performed
only with explicit user authorization at the point they are needed.
