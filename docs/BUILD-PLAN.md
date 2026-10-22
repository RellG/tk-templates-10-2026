# Collection 02 — same pipeline, new source references

## What was reviewed

The complete August checkout and its only remote commit (`ba9f374`) were reviewed: URL collector, scraper, 150 reference directories, token parser, content generator, layout selector, renderer, generated pages and README. No separate historical planning/rules file exists in that checkout.

The original approach is explicitly **reference-led**: collect Refero style URLs, save each published DESIGN.md and provenance, extract semantic tokens, detect the documented layouts/components, and generate varied landing pages plus a searchable dark gallery. The long reference documents include typography, spacing, shapes, components, do/don't rules, imagery, and layout descriptions. The earlier October version's short authored briefs did not preserve that depth and have been replaced.

## Current build rules

1. Keep `refero-design-systems/<id>/DESIGN.md` faithful to the published source. Save retrieval URL/title/date separately in `source.json`.
2. Use 24 references absent from the August collection by both URL and title. The fixed baseline is `reference-exclusions.json`.
3. Extract the actual level-two `## Layout` prose, not the nested `### Layout` spacing table. The inherited parser used a substring search that confused those headings; it now matches the exact heading line.
4. Preserve the source palette, font stacks and corner tokens. Prefer explicit card/button/image radii over generic radius aliases. Use the hero/display type token before a smaller section heading token.
5. Detect the hero, navigation, components and section types using the inherited layout module and a stable random seed. Respect left-text/right-media composition when explicitly documented.
6. Derive image framing from the layout/imagery prose: framed, immersive or collage. Add stock hero photography as the user's explicit adaptation, including on references whose own products use screenshots. Never describe a stock photo as a screenshot of the reference product.
7. Use new fictional brands and category-appropriate copy. Do not copy the real brand's identity, logos, customer claims or proprietary screenshots.
8. Keep neutral source ink for readable text and adjust muted ink for at least 4.5:1 contrast. Select primary button fills from the documented button role before the inherited accent fallback; use black or white button text according to contrast.
9. Preserve the dark gallery direction from collection 01. Include the reference name on each card and a source link on each page.
10. Store photos locally with author, source page, license link and SHA-256. Embed the selected photo into standalone downloads.
11. Verify source provenance, non-overlap, resolved links, semantic contrast, image loading, mobile layouts, interactions and offline downloads.
12. Commit source and generated output to the separate October repo and update the WireGuard preview.

## Deliberate limits

These are adaptations, not pixel-for-pixel reproductions of the reference businesses. Shared rendering still uses the original five hero families and reusable section library. Section spacing is constrained to 48–120px for usability; unavailable brand fonts use each source's fallback stack. Product capabilities, pricing, sample customer quotes and the contact form are clearly marked as fictional/demo content.

The August renderer in this checkout uses abstract CSS panels and contains no photo URLs or image assets. The revised collection adds the user-requested free photography rather than claiming an earlier photo implementation was recovered.
