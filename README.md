# TKTechnology templates — Collection 02

24 new reference-led web templates, following the August collection's **Refero → DESIGN.md → semantic tokens → layout plan → HTML/gallery** pipeline. The source references are all different from collection 01. This rebuild replaces the first October attempt with full published design documents, source-driven visual choices and free hero photography.

## Preview

Node.js 20+ is sufficient; committed output needs no installation:

```sh
npm start
# http://127.0.0.1:4174

# On this WireGuard host:
node serve.js 8088 10.8.0.1
# http://10.8.0.1:8088/start
```

The current preview runs as `tk-templates-collection02.service`, bound only to the WireGuard address. It is a transient systemd service and does not survive a host reboot. Your viewing device needs WireGuard or the existing homelab route/forward.

## Build and verify

```sh
npm run build
npm test
npm ci
npx playwright install chromium  # only if missing
npm run test:browser
```

The normal build is offline and uses committed design documents/photos. It produces 24 previews, 24 self-contained downloads, a dark searchable gallery, token exports and an integration catalog. Downloads embed their hero photo. Browser checks cover every page at desktop/mobile widths, photo decoding, gallery filters, downloads, navigation, keyboard tabs, FAQ disclosures and the demo form.

## Refresh references

```sh
node collect-style-urls.js 24 > candidate-style-urls.json
# Review candidate URLs AND titles against reference-exclusions.json.
# Replace style-urls.json only after selecting the intended references.
node scrape-design-tokens.js 24
```

The collector tries the public newest index and then popular/trending if scrolling stops. The current manifest is curated to exclude both prior URLs and repeated reference names. The scraper resumes existing sources and fails explicitly on unsuccessful extraction. Source documents are unchanged after entity decoding; adaptations live in the generator.

## Files and rules

- `refero-design-systems/`: 24 full source documents, provenance and generated tokens/plans.
- `collect-style-urls.js`, `scrape-design-tokens.js`, `style-urls.json`: the same source acquisition pipeline as collection 01, updated for current markup.
- `reference-exclusions.json`: August source baseline for non-overlap validation.
- `lib/tokens.mjs`, `lib/layout.mjs`: inherited extraction/selection rules with the exact-level layout heading fix.
- `lib/experiences.mjs`: fictional brands and tailored content.
- `lib/render.mjs`, `lib/gallery.mjs`: responsive page compositions and the original dark gallery direction.
- `assets/photos/`, `assets/credits.json`: local stock photography and provenance.
- `site/`: complete static deployable output.
- `docs/BUILD-PLAN.md`: recovered direction, implementation rules and documented adaptations.
- `docs/IMAGE-CREDITS.md`: photographer/source/license links.
- `docs/INTEGRATION.md`: TKTechnology catalog/deployment instructions.

## Collection

| Template | Design reference | Category |
| --- | --- | --- |
| Verdant | [Nuxt](https://styles.refero.design/style/d9a19632-e9ee-4c9c-849b-ed48b1c43ee7) | Developer tools |
| Counter | [Mollie](https://styles.refero.design/style/73ec75d6-edec-4ed2-bc09-debb261b6ee0) | Commerce |
| Ledger House | [Modern Treasury](https://styles.refero.design/style/2e9b3dcb-f937-488d-891c-351c7366188f) | Finance |
| Pinboard Studio | [Milanote](https://styles.refero.design/style/bea59438-bb4f-47ea-9484-f41caf6eb685) | Creative tools |
| Sunday Crunch | [Magic Spoon](https://styles.refero.design/style/4d42420f-a7d4-499f-8025-5af294fff0f5) | Food & drink |
| Margin | [Kagi](https://styles.refero.design/style/3a4d1008-0bd1-4ebb-9efe-0c146c45a99b) | Research |
| Somewhere Good | [Hopper](https://styles.refero.design/style/e2125e17-6a67-4c27-8817-adf8537303d8) | Travel |
| Fieldnotes | [Heptabase](https://styles.refero.design/style/7368cfab-6313-4e50-97e5-c3318c52e7fe) | Research |
| Paper Post | [HEY](https://styles.refero.design/style/eb5e696d-353c-4094-ad54-151ecdc50cb5) | Communication |
| Branchwork | [Graphite](https://styles.refero.design/style/fd36bae9-dbf4-4b0f-a48b-e8c6f92edca3) | Developer tools |
| Daybreak | [Grafana Labs](https://styles.refero.design/style/03e0e30c-4c0f-4879-948a-9b501e530207) | Observability |
| Letterform | [Glyphs](https://styles.refero.design/style/67bb82e2-d81c-4ead-a882-a8a2534eb221) | Design tools |
| Worktree | [GitButler](https://styles.refero.design/style/92f92f04-d3a7-4e5b-9a1d-f23c9a4d16dc) | Developer tools |
| Framegrab | [CleanShot X](https://styles.refero.design/style/679f08af-741f-4b04-bb44-0a9b97e96ad3) | Creative tools |
| Listening Room | [Featurebase](https://styles.refero.design/style/506f983d-e4ed-4e7a-a3b3-851a18f5b402) | Customer feedback |
| Commonplace | [Capacities](https://styles.refero.design/style/586b97ac-f687-46ba-bbf7-31031cfcc110) | Knowledge |
| Cut & Story | [Captions](https://styles.refero.design/style/196dc658-219f-4ea0-b150-f9af17cd4c3f) | Video tools |
| Farpoint | [bunny.net](https://styles.refero.design/style/5ac4d8c4-2994-4d14-b563-0a51332dc7e0) | Infrastructure |
| Afterhours | [Bose](https://styles.refero.design/style/ac53627e-5738-4121-8f5d-05e4d8475a5b) | Audio |
| Daywell | [Bevel](https://styles.refero.design/style/c0717d1a-b446-4166-a445-6497fe287fea) | Wellness |
| Askroom | [Your workplace has the answer. Just ask Dala for it.](https://styles.refero.design/style/e5f5f8cf-e68d-4ed1-bbf5-6b67569af648) | Knowledge |
| Northbank | [Mercury](https://styles.refero.design/style/3172cd4d-118a-4a16-a259-6b634d32322e) | Finance |
| Outline | [Linear](https://styles.refero.design/style/90ce5883-bb24-4466-93f7-801cd617b0d1) | Project management |
| Goodform | [ORYZO AI](https://styles.refero.design/style/1f204e95-454a-437e-845b-c1b169d35607) | Creative agency |

These are fictional adaptations, not the reference brands' real websites. Palette, typography, shapes and composition come from their documented systems; stock photography and copy are new. Source font fallbacks are used where proprietary fonts are unavailable. Demo prices, claims and quotes are illustrative, and the contact form sends/stores nothing.

The original repo remains unchanged. TKTechnology production integration is provided as files/catalog, not deployed to the production website. Photo terms are documented separately from the template source; no blanket license is asserted over third-party design documents or trademarks.
