# Home audience tabs and route simplification

## Goal

Reduce the public site map by removing the dedicated Adults and Children lesson pages, while preserving the useful audience distinction as a compact interactive block on Home.

The Home block will use the existing Tab Menu visual language. It replaces the current `Music becomes possible when it is explained with care.` heading and the two audience links. Selecting a tab changes the short description below it. A split-arrow `Book a Call` link follows the description.

## Approved page composition

The Home sequence remains:

1. Hero.
2. Audience tabs, description, and booking call to action.
3. Location section.
4. Footer.

The audience block anatomy is:

1. `For adults` / `For children` Tab Menu.
2. One dynamic description panel.
3. `Book a Call` split-arrow link to the existing intro booking route.

`For adults` is selected by default. No heading is displayed above the Tab Menu. The block must retain an accessible programmatic label even though it has no visible heading.

## Interaction contract

- The audience choices are local tabs, not navigation links.
- Selecting a tab updates the description without navigation, page reload, query parameters, or browser-history entries.
- Mouse click, Enter, and Space select a tab.
- Left and Right Arrow move focus and selection between tabs; Home and End select the first and last tab.
- Hover and focus styles may preview the control state but must not change the selected content by themselves.
- The active tab exposes `aria-selected="true"` and controls the single associated tab panel.
- The tab panel is labelled by the active tab. It does not use an additional live region that would duplicate tab announcements.
- The split-arrow booking link is outside the tab panel because its destination and meaning do not change with the selected audience.
- The booking link uses the existing intro booking authority and analytics convention; it does not embed Cal.com in this block.

## Component architecture

### TabMenu

`components/ui/TabMenu.tsx` remains the single visual implementation of the segmented Tab Menu. It supports two semantic modes:

1. **Navigation mode** for Booking. Items render as links and use `aria-current` for the active destination. Existing Booking behavior and URL-based mode selection remain unchanged.
2. **Tabs mode** for Home. Items render as buttons in a `tablist` and expose tab selection, panel relationships, and keyboard behavior.

Both modes share the existing container, item geometry, typography, colors, focus treatment, and transitions. The semantic mode must be explicit in the component API so links and tabs cannot be mixed accidentally.

### HomeAudienceTabs

`HomeAudienceSelector` becomes `HomeAudienceTabs`. It owns the local active-audience state and supplies the tabs-mode data to `TabMenu`.

It renders:

- the audience Tab Menu;
- the active short description;
- the existing `SplitLinkButton` with label `Book a Call` and the intro booking href.

The current hover-driven copy switching is removed. Audience selection persists until the visitor selects the other tab or leaves/reloads the page.

## Content contract

The large `audienceLessons` page model is removed. Home retains only the content it consumes:

```text
home.audienceTabs.adults.label
home.audienceTabs.adults.description
home.audienceTabs.children.label
home.audienceTabs.children.description
```

The initial descriptions reuse the current audience `cardCopy` values:

- Adults: `Start from your first note, return after a break, or strengthen the playing you already have.`
- Children: `Clear musical foundations, age-appropriate goals and practical guidance for the time between lessons.`

The removed page titles, long-form sections, FAQs, audience-specific SEO descriptions, and route paths are deleted rather than archived in the production content model.

General site copy may still mention that Agatha teaches adults and children. Only the dedicated audience-page structure is removed.

## Route and sitemap contract

Delete:

- `/online-flute-lessons-for-adults`
- `/online-flute-lessons-for-children`

There are no redirects, rewrites, compatibility routes, or query-parameter replacements. Direct requests return the application's ordinary `404`, as if the routes had never existed.

Both URLs are removed from `app/sitemap.ts`. Internal links, metadata generation, content types, and tests must not reference them.

`AudienceLessonPage` is deleted if it has no consumers after the route removal.

## Spacing boundary

This change establishes the new anatomy but does not finalize the site-wide spacing model. The audience block initially keeps the existing Home section container and responsive geometry.

The following relationships will be assigned semantic spacing roles in the immediately following spacing-system task:

- section start to Tab Menu;
- Tab Menu to description;
- description to booking action;
- audience block to Location.

No image, explainer, booking form, or Cal.com embed is added underneath the tabs in this change.

## Accessibility and resilience

- The block remains understandable without hover.
- Every tab is a native button with a visible keyboard focus state.
- Selection is conveyed programmatically and not by color alone.
- The tab panel can grow for longer copy and must not have a fixed height that clips text.
- The layout must tolerate the WCAG text-spacing override without overlap or lost content.
- With JavaScript unavailable, the default Adults description remains present in the server-rendered markup.

## Verification

### Structure and routing

- The two removed routes return `404`.
- The sitemap excludes both URLs.
- No rendered internal link points to either URL.
- The obsolete audience page component and page-specific content types have no remaining imports.

### Interaction

- Adults is active on initial load and its description is visible.
- Selecting Children changes the description without changing the URL.
- Selecting Adults restores the original description.
- Arrow, Home, End, Enter, and Space behavior matches the interaction contract.
- Hover alone does not change the description.
- `Book a Call` points to the existing intro booking route and uses the split-arrow visual.
- Booking's existing navigation-mode Tab Menu still works.

### Responsive and accessibility checks

- Inspect Home at 390, 768, 1224, and 1728 pixels.
- Confirm tab labels do not clip or collide.
- Confirm the description and CTA remain centred and do not overlap at text-spacing overrides.
- Confirm visible focus and correct tab/tab-panel relationships.

Run the existing typecheck, lint, unit, build, and browser suites after implementation.

## Out of scope

- Final spacing-token values or Figma spacing-variable modes.
- Changes to the Hero, Location, Header, Footer, Classes cards, or booking implementation.
- A Home booking embed or contact form.
- New images, explainers, audience-specific pages, redirects, or SEO landing pages.
- Deployment, push, or merge.
