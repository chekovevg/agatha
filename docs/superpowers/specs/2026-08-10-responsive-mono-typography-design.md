# Responsive Red Hat Mono typography alignment

## Goal

Align the Red Hat Mono typography used by Agatha Music with the equivalent roles on `microsoft.ai`, in both the AG Figma component group and production code. Figma records the canonical desktop values at a `1728px` viewport and above. Code owns the responsive interpolation below `1728px`.

This change is limited to Red Hat Mono. Newsreader, EB Garamond, and Display Italic remain unchanged.

## Sources of truth

- Reference behavior: the rendered `microsoft.ai` components and their computed CSS.
- Design-system base: the `AG` group in Figma file `314E0PxdPGZBO124xOAELq`, canvas node `2057:2066`.
- Production behavior: semantic typography tokens in `app/globals.css`, consumed by the existing components.

The same semantic role must have one definition. Component-local `font-size`, `font-weight`, `line-height`, and `letter-spacing` values must not override that definition unless the role explicitly calls for it.

## Responsive engine

The existing `--unit-fx-type` engine already matches the reference and remains the shared scale:

| Viewport | `--unit-fx-type` |
| --- | --- |
| `<= 600px` | `100vw / 402` |
| `601px - 860px` | `100vw / 967.5` |
| `861px - 1536px` | `1536px / 1728` |
| `1537px - 1727px` | `100vw / 1728` |
| `>= 1728px` | `1px` |

Figma does not attempt to model this interpolation. Every Figma value in the AG typography group is labelled as the static `1728+` base. Responsive values are derived in CSS from the same role tokens.

## Approved Red Hat Mono roles

| Role | Figma base at `1728+` | Responsive code rule | Usage |
| --- | --- | --- | --- |
| `Mono / UI` | `16px / 500 / 100% / -0.24px` | `max(10px, 16 * scale)`; `12px` at `<=600px` | header actions, buttons, menu rows, plain UI links |
| `Mono / Header nav` | `16px / 500 / 100% / -0.24px`; expanded mobile list uses `180%` line-height | uses `Mono / UI`; expanded mobile navigation is `16px` at `<=600px` | primary header links and Classes trigger |
| `Mono / Metanav title` | `15px / 500 / 100% / -0.24px` | `max(12px, 15 * scale)` | Classes menu section and preview titles |
| `Mono / Metanav description` | `13px / 500 / 160% / -0.24px` | `max(10px, 13 * scale)` | Classes menu descriptive copy |
| `Mono / Eyebrow` | `16px / 500 / 100% / +1.5px` | UI size; tracking becomes `+1.2px` at `<=600px` | label above class/card headings |
| `Mono / Footer` | `15px / 400 / 160% / +1.5px` | `max(10px, 15 * scale)`; `12px / 0px tracking` at `<=600px` | footer navigation and copyright |
| `Mono / Footer note` | `12px / 400 / 125% / -0.24px` | `12 * scale` | footer descriptive note |

`scale` means the current computed value of `--unit-fx-type`. Weight `500` must use the loaded Red Hat Mono medium face, not a visual approximation created with tracking or opacity.

## Responsive snapshot

Values below are expected computed font sizes in pixels. Metanav values are included for formula verification even when that desktop-only submenu is not rendered.

| Viewport | Header mobile nav | UI / Eyebrow | Metanav title | Metanav description | Footer | Footer note |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `390` | `16.00` | `12.00` | `14.55` | `12.61` | `12.00` | `11.64` |
| `768` | `12.70` | `12.70` | `12.00` | `10.32` | `11.91` | `9.52` |
| `1280` | `14.22` | `14.22` | `13.33` | `11.56` | `13.33` | `10.67` |
| `1440` | `14.22` | `14.22` | `13.33` | `11.56` | `13.33` | `10.67` |
| `1536` | `14.22` | `14.22` | `13.33` | `11.56` | `13.33` | `10.67` |
| `1600` | `14.81` | `14.81` | `13.89` | `12.04` | `13.89` | `11.11` |
| `1728+` | `16.00` | `16.00` | `15.00` | `13.00` | `15.00` | `12.00` |

At `768px`, the header uses its responsive UI size because the reference only applies the fixed `16px` mobile-nav override through `600px`.

## Figma changes

Within the AG group:

1. Create or rename the Red Hat Mono text styles to the approved semantic role names.
2. Set their values to the `1728+` column above.
3. Apply those roles consistently to Header, Classes menu, menu item, preview card, Button, class-card eyebrow, Link, and Footer components.
4. Add a visible annotation: `Typography base: 1728px and above. Responsive values are defined in code.`
5. Preserve component geometry, content, colors, and all serif text styles.

If the Figma connector cannot publish shared text styles, apply the exact role values to the component text layers and add the role matrix as the annotation. That keeps the visual source of truth explicit without rebuilding unrelated components.

## Code changes

1. Keep the existing viewport scale breakpoints and formulas.
2. Change `.mai-ui` from fixed `14px / 400` to the `Mono / UI` token.
3. Add semantic classes or variables for metanav title, metanav description, eyebrow, footer, and footer note.
4. Replace the hardcoded `16px` and `14px` typography in `ClassesMenu` with semantic roles.
5. Map Header, Button, Classes cards, and Footer to those roles without changing component structure or behavior.
6. Keep layout dimensions and spacing unchanged unless rendered verification proves that text clipping requires a minimal component-local correction.

## Verification

- Assert computed `font-family`, `font-size`, `font-weight`, `line-height`, and `letter-spacing` for representative elements at `390`, `768`, `1280`, `1440`, `1536`, `1600`, `1728`, and `1920` pixels.
- Visually inspect Header, open Classes menu, class cards, buttons, eyebrows, and Footer on desktop and mobile.
- Confirm no clipping, unwanted wrapping, vertical misalignment, focus regression, or menu hit-area regression.
- Run typecheck, lint, unit tests, production build, and the relevant browser suite.
- Compare the `1728px` production capture with the updated AG Figma components and the reference roles.

## Out of scope

- Changes to Newsreader, EB Garamond, or Display Italic.
- Layout redesign, component restructuring, content edits, new dependencies, or deployment.
- Changes to the reference-derived responsive engine outside the typography role definitions.
