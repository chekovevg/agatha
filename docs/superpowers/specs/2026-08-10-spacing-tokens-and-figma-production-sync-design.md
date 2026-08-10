# Spacing tokens and Figma production sync

## Goal

Make the production code and the Agatha Figma file describe the same typography,
spacing relationships, components, and public screens. The Microsoft AI site is
the behavioral reference; Agatha keeps its own EB Garamond, Newsreader, and Red
Hat Mono type palette.

## Source of truth

- Production code is the source of truth for routes, content, interactions, and
  responsive behavior.
- Figma documents one canonical desktop state at `1728+` pixels.
- The responsive formula and the mobile composition remain in code. Figma does
  not duplicate them as viewport modes.
- The existing Figma section `1440_desktop` is renamed to
  `Desktop / 1728+ baseline`, and its frames become 1728-pixel frames.

## Spacing scale

Spacing primitives form one deliberately small scale. A value is added only
when it is used by a production layout; the scale does not contain width,
height, image-size, or container-size tokens.

The initial scale required by the synchronized screens is:

```text
0 · 2 · 4 · 8 · 10 · 12 · 12.5 · 16 · 20 · 24 · 30 · 32 · 37.5 · 40 · 48 · 50
56 · 64 · 72 · 76 · 80 · 100 · 120 · 144 · 160 · 190 · 200 · 250
```

Existing Tailwind spacing utilities already consume Tailwind's spacing scale.
Custom reference-derived layout relationships consume the Agatha scale through
CSS variables. Figma auto-layout gaps and padding consume matching local number
variables. Repeated component values reuse the same primitive rather than
creating a component-specific number variable.

## Spacing roles

Spacing is named by relationship rather than size:

| Semantic role | 1728+ | Mobile 402 | Relationship |
| --- | ---: | ---: | --- |
| `type-display-lead` | 37.5 px | 12.5 px | Display heading to lead |
| `copy-action` | 50 px | 40 px | Lead or description to primary action |
| `control-description` | 30 px | 30 px | Tab Menu to its description |
| `section-transition` | 190 px | 144 px | Audience action to Location heading |
| `heading-media` | 0 px | 30 px | Location heading to image |
| `media-copy` | 30 px | 30 px | Location image to body copy |
| `editorial-action` | 76 px | 76 px | Location copy to action |

At intermediate widths, CSS multiplies the desktop values by the existing
fluid unit `width / 1728`. At and above 1728 pixels, the unit is capped at one
pixel. At 600 pixels and below, the mobile values use `width / 402`.

Intervals tied to typography remain type-aware. Breakpoints are used only when
the composition or relationship changes, not to reproduce arbitrary snapshots.

## Home composition

The production Home sequence is:

1. Header.
2. Hero display, lead, and primary action.
3. Audience Tab Menu, selected description, and `Book a Call` action.
4. Location heading, image, copy, and action.
5. Footer.

Each measured relationship is owned by one semantic alias pointing to the
spacing scale. Nested section padding and generic container gaps must not add
invisible extra space between two tokenized elements.

## Figma library scope

Preserve and normalize the existing local Agatha library:

- primitive and semantic color variables;
- the local `ag/*` typography styles;
- Header, Footer, Tab Menu, buttons, links, cards, menu items, booking states,
  and the icon-library instances they use.

Add the spacing scale to the primitive collection and the seven spacing-role
aliases to the semantic collection. Bind every auto-layout `itemSpacing` and
padding property in the production screens and local components to a spacing
variable. Repair the invalid Header component set and normalize semantic layer
names. Do not create width or height variables, and do not import a generic
external design system. The subscribed `icons` library remains the icon source.

## Figma screen scope

The `Desktop / 1728+ baseline` section contains the seven public production
screens:

1. Home.
2. About.
3. Classes.
4. Media.
5. Book.
6. Impressum.
7. Datenschutz.

Existing screens are updated rather than duplicated. Missing screens are built
with auto layout, local component instances, local text styles, semantic spacing
variables, and descriptive English layer names. Home includes the new audience
tabs; About includes its production FAQ and contact content. Legal placeholder
content is copied exactly from production and is not invented or expanded.

## Verification

- Inspect Home at 390, 768, 1224, and 1728 pixels.
- Measure every approved Home spacing relationship from rendered boxes.
- Verify tab selection, keyboard behavior, focus visibility, and mobile flow.
- Run the relevant typecheck, lint, unit, build, and browser checks.
- Re-read the Figma variables, components, and all seven screen roots after
  mutation; compare the 1728 Home rendering with its Figma baseline.

## Out of scope

- Additional routes or content.
- Responsive Figma modes or separate tablet/mobile screens.
- Redesigning the established colors, typefaces, or product architecture.
- Push, merge, deployment, or publication.
