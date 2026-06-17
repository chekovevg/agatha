# Microsoft AI Home Structure Mapping

Source checked: https://microsoft.ai/ on 2026-06-17.

This document records which Microsoft AI home-page blocks Agatha Music reuses,
adapts, or intentionally does not copy.

## Reference Tokens

- Hero background: `#FBD3BE`
- Main page background: `#FEF9ED`
- Values scroll warm point: about `#F4E8C8`
- Key Locations subtle warm point: about `#FBF9EE`
- Text and header ink: `#5D524B`
- Soft row / menu surface: `#FBF0DC`
- Small UI chip surface: `#F7ECD9`

## Block Map

| Microsoft AI order | Microsoft AI block | Agatha Music decision |
| --- | --- | --- |
| 1 | Header | Reused structurally as the Agatha header. |
| 2 | Hero | Reused as the Agatha hero with music-teacher copy and watercolor canvas. |
| 3 | Large image/news link after Hero | Not reused for v1. Do not copy to home. |
| 4 | Models list | Not reused on home. The same list-row logic is adapted on `/[locale]/classes`. |
| 5 | Manifesto copy | Reused as `Music becomes possible...` plus the teaching subtitle. |
| 6 | Our Values | Reused as `My Values`. Microsoft scroll-sensitive value switching is intentionally simplified to hover/focus/click text switching. |
| 7 | Join Us photo zoom block | Not reused for v1. Keep as a possible future pattern only. |
| 8 | Key Locations | Adapted as one single-location block: `From the Rhine, online`. Do not copy multi-location scroll behavior. |
| 9 | Quote with portrait/signature | Reused as Agatha photo, quote, and name. |
| 10 | Footer | Reused structurally as the Agatha footer. |

## Behavior Rules

- Reused sections should keep the Microsoft AI color rhythm: peach Hero, then cream editorial sections.
- The reference does not switch the global page background on the Hero-to-content boundary. Hero keeps its own peach section background while the page shell remains cream.
- Dynamic background changes apply only to reused sections that match the reference: `My Values` warms on entry and fades back to cream; the single-location block uses the very subtle Key Locations warm shift. The implementation is section-scoped with `data-scroll-bg`.
- Values copy does not follow Microsoft AI scroll sensitivity. Agatha uses hover, focus, and click to reveal the active value text.
- Blocks marked "not reused" are intentionally absent from the home page.
- The classes page may reuse the models-list row pattern, but the home page must not add a separate models/classes block.
