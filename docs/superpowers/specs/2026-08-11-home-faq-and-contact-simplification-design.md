# Home FAQ and Contact Simplification

## Goal

Move the useful pre-booking questions onto the Home page and reduce the About
contact form to the two fields a visitor actually needs.

## Home page

The Home page will contain three sections in this order:

1. Hero with the audience tabs and booking action.
2. Location (`From the Rhine, online`).
3. FAQ (`Questions before the first lesson`).

The FAQ will be removed from About rather than duplicated. Its outer column and
heading will be centered on the page. Question and answer text will remain
left-aligned inside that centered column for readability. The existing native
`details`/`summary` interaction and keyboard behavior will remain unchanged.

Only these questions will remain, in this order:

1. Do you teach complete beginners?
2. Can you help with music theory exams?
3. What happens after a lesson?

The questions about adults, languages, and instruments will be removed from the
shared content because those answers are already visible elsewhere on the site.

## About contact section

The section stays at `/about#contact` so existing booking fallbacks remain
valid. Its heading changes from `Get in touch` to `Have a question`. The
introductory paragraph is removed.

The visible form contains only:

- Email
- Message
- Send message

The invisible honeypot and form-start timestamp remain because they support
spam protection and do not add user-facing fields. Existing success, failure,
loading, keyboard, and live-region behavior remains intact.

## Submission contract

The contact API will accept `email`, `message`, the optional honeypot, and the
internal form-start timestamp. Name, student age, and lesson subject will no
longer be required or sent.

Spam-text screening will inspect the message. Agatha's notification email will
use a generic website-question subject and include the sender email plus the
message. The visitor confirmation email remains unchanged.

## Verification

Rendered tests will verify that:

- FAQ appears on Home as the third section and no longer appears on About.
- Only the three approved questions render.
- The FAQ column and heading are centered while question text is left-aligned.
- About renders `Have a question` with only Email, Message, and Send message.
- A two-field submission passes validation and reaches the existing email path.
- Responsive layouts have no horizontal overflow and existing accessibility
  behavior remains intact.

The implementation will reuse the existing content model, page components,
form client, API route, and design tokens. No new dependency or generalized
section system is needed.
