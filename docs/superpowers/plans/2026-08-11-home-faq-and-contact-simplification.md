# Home FAQ and Contact Simplification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the reduced FAQ to Home as its centered third section and simplify the About contact flow to Email, Message, and Send message.

**Architecture:** Reuse the existing Home/About page components, native `details` FAQ markup, contact client, API route, and Resend sender. Remove obsolete content and form fields end-to-end so the rendered UI, validation contract, spam checks, and notification email all agree.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Zod, Resend, Vitest, Playwright.

## Global Constraints

- FAQ order is Hero, Location, then Questions on Home.
- FAQ heading and outer column are centered; question and answer text stays left-aligned.
- Keep only the beginner, theory-exam, and post-lesson questions.
- About keeps `/about#contact`, uses `Have a question`, and shows no intro paragraph.
- The visible form contains only Email, Message, and Send message.
- Preserve the honeypot, form timing, status live region, keyboard behavior, and existing error copy.
- Add no dependency and no generalized section system.

---

### Task 1: Move and reduce the FAQ

**Files:**
- Modify: `components/pages/HomePage.tsx`
- Modify: `components/pages/AboutPage.tsx`
- Modify: `content/site.ts`
- Test: `tests/site-structure.test.ts`
- Test: `tests/e2e/site-smoke.spec.ts`

**Interfaces:**
- Consumes: `SiteContent.faq: FAQItem[]` and `SiteContent.pages.about.faqHeading: string`.
- Produces: Home section `#home-faq-title` with `data-home-faq`; About no longer renders FAQ.

- [ ] **Step 1: Write failing rendered tests**

Update the page markup test to render both pages and assert these literal outcomes:

```ts
expect(homeHtml).toContain('data-home-faq="true"');
expect(homeHtml).toContain("Questions before the first lesson");
expect(homeHtml).toContain("Do you teach complete beginners?");
expect(homeHtml).toContain("Can you help with music theory exams?");
expect(homeHtml).toContain("What happens after a lesson?");
expect(homeHtml).not.toContain("Do you work with adults?");
expect(homeHtml).not.toContain("What languages are available?");
expect(homeHtml).not.toContain("What instruments do you teach?");
expect(aboutHtml).not.toContain("Questions before the first lesson");
```

Replace the old About-axis Playwright test with a Home geometry check at 390 and 1440 px. Assert the FAQ follows the Location section, the section/content center matches the viewport within one pixel, the heading uses `text-align: center`, question text uses `text-align: left`, and document overflow is at most 0.5 px.

- [ ] **Step 2: Run the narrow tests and verify RED**

Run:

```powershell
npm.cmd test -- tests/site-structure.test.ts
npm.cmd run e2e:run -- tests/e2e/site-smoke.spec.ts --grep "home FAQ"
```

Expected: markup fails because FAQ remains on About; browser test fails because `data-home-faq` is absent.

- [ ] **Step 3: Implement the minimal page/content change**

In `HomePage`, render the existing sorted `details` list immediately after Location:

```tsx
<section
  data-home-faq="true"
  aria-labelledby="home-faq-title"
  className="mt-[var(--space-190)] w-full px-[var(--space-20)] text-[var(--ink)] max-[600px]:mt-[var(--space-144)]"
>
  <div className="mx-auto grid w-full max-w-[643px] gap-[var(--space-32)]">
    <h2 id="home-faq-title" className="mai-h4 text-center">
      {content.pages.about.faqHeading}
    </h2>
    <div className="divide-y divide-[var(--line)] border-y border-[var(--line)] text-left">
      {[...content.faq]
        .sort((a, b) => a.order - b.order)
        .map((item) => (
          <details key={item.question} className="group py-[var(--space-20)]">
            <summary className="mai-body flex cursor-pointer list-none items-center justify-between gap-[var(--space-24)] text-[var(--ink)]">
              <span>{item.question}</span>
              <span aria-hidden="true" className="mai-ui">+</span>
            </summary>
            <p className="mai-body mt-[var(--space-16)] max-w-[780px] text-[var(--muted)]">
              {item.answer}
            </p>
          </details>
        ))}
    </div>
  </div>
</section>
```

Remove the FAQ section from `AboutPage`. Remove the three redundant FAQ entries from `content/site.ts` and renumber the remaining `order` values to 1, 2, and 3. Use existing spacing variables for the section margin and padding.

- [ ] **Step 4: Run the narrow tests and verify GREEN**

Run the same Vitest and Playwright commands from Step 2. Expected: both pass.

### Task 2: Reduce the visible contact form and submission contract

**Files:**
- Modify: `components/pages/AboutPage.tsx`
- Modify: `components/ui/ContactForm.tsx`
- Modify: `content/contact-form.ts`
- Modify: `content/site.ts`
- Modify: `content/types.ts`
- Modify: `lib/validators.ts`
- Modify: `app/api/contact/route.ts`
- Modify: `lib/resend.ts`
- Test: `tests/contact-client.test.ts`
- Test: `tests/contact.test.ts`
- Test: `tests/resend.test.ts`
- Test: `tests/site-structure.test.ts`
- Test: `tests/e2e/site-smoke.spec.ts`

**Interfaces:**
- Consumes: browser payload `{email, message, website, formStartedAt}`.
- Produces: `ContactInput` containing `email`, `message`, and optional `website`; Resend subject `New website question`.

- [ ] **Step 1: Write failing form, route, and email tests**

Assert rendered About markup contains `Have a question`, Email, Message, and Send message, and does not contain the intro paragraph or controls named `name`, `studentAge`, or `subject`.

Change the route fixture to:

```ts
{
  email: "student@example.com",
  message: "I would like to ask about a first lesson.",
  website: "",
  formStartedAt: String(Date.now() - 5000),
}
```

Assert it reaches `sendContactEmails`; invalid email and messages shorter than 10 characters still return 400. Update the Resend test to assert the notification has subject `New website question`, `replyTo` matches the submitted email, and its body contains only the email and message details.

Update the Playwright network-failure test to fill only Email and Message before submitting.

- [ ] **Step 2: Run the narrow tests and verify RED**

Run:

```powershell
npm.cmd test -- tests/contact-client.test.ts tests/contact.test.ts tests/resend.test.ts tests/site-structure.test.ts
npm.cmd run e2e:run -- tests/e2e/site-smoke.spec.ts --grep "contact network failure|Have a question"
```

Expected: tests fail because obsolete fields and validation are still present and the heading remains `Get in touch`.

- [ ] **Step 3: Implement the minimal end-to-end form change**

Remove Name, Student age, and Subject controls and their copy/options. Keep Email, Message, the honeypot, timing field injection, submit state, status live region, and messages.

Change `contactSchema` to:

```ts
z.object({
  email: z.string().trim().email().max(180),
  message: z.string().trim().min(10).max(3000),
  website: z.string().max(500).optional().or(z.literal("")),
});
```

Make marketing-spam inspection consume only `message`. Build the Agatha email as:

```ts
const details = [`Email: ${input.email}`, "", input.message].join("\n");
```

Use subject `New website question`. Change the About heading content to `Have a question`, remove the rendered introductory paragraph, and remove its unused `copy` property from the content type/data.

- [ ] **Step 4: Run the narrow tests and verify GREEN**

Run the commands from Step 2. Expected: all pass.

### Task 3: Integrated responsive verification and preview update

**Files:**
- Review: all files changed in Tasks 1 and 2
- Test: `tests/e2e/site-smoke.spec.ts`

**Interfaces:**
- Consumes: completed Home FAQ and simplified About contact flow.
- Produces: verified branch preview for the current commit.

- [ ] **Step 1: Run complete local verification**

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd test
npm.cmd run build
npm.cmd run e2e:run
```

Expected: zero failures; the optional responsive screenshot test may remain skipped unless its audit directory is set.

- [ ] **Step 2: Inspect rendered Home and About**

At 390 and 1440 px verify Home section order, centered FAQ geometry, left-aligned disclosure text, native disclosure keyboard behavior, About two-field form, visible focus, and no horizontal overflow. Capture screenshots as local evidence.

- [ ] **Step 3: Review and commit the integrated diff**

```powershell
git diff --check
git status --short
git diff --stat
git add -- app/api/contact/route.ts components/pages/AboutPage.tsx components/pages/HomePage.tsx components/ui/ContactForm.tsx content/contact-form.ts content/site.ts content/types.ts lib/resend.ts lib/validators.ts tests/contact-client.test.ts tests/contact.test.ts tests/e2e/site-smoke.spec.ts tests/resend.test.ts tests/site-structure.test.ts docs/superpowers/plans/2026-08-11-home-faq-and-contact-simplification.md
git commit -m "feat: move FAQ home and simplify contact"
```

- [ ] **Step 4: Push and confirm the preview**

```powershell
git push origin codex/typography-responsive-fix
```

Wait for the deployment tied to the new commit to report `READY`, then verify the stable branch alias returns HTTP 200.
