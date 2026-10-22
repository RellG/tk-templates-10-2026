# TKTechnology templates · Collection 02

24 new responsive landing-page templates, built as a separate October 2026 collection. Continues the design-document → semantic-token → layout → HTML/gallery pipeline from [tk-templates-8-2026](https://github.com/RellG/tk-templates-8-2026), commit `ba9f374`.

This round uses **original authored design systems**, rather than scraped third-party references. Each has its own palette, type direction, fictional brand, headline, and section arrangement. Five hero families, eight software product categories, nine dark and fifteen light templates. All product claims, customer names, metrics, prices and testimonials are illustrative.

## Preview

Requires Node.js 20 or newer. Generated pages are committed, so preview has no install step:

```sh
npm start
# http://127.0.0.1:4174
```

WireGuard preview (on a host that owns this address):

```sh
node serve.js 8088 10.8.0.1
# http://10.8.0.1:8088/ — /start is also supported
```

Connect your viewing device to WireGuard, or use your existing homelab routing/SSH forwarding setup. The server binds only to the supplied address. A successful request from the server itself does not establish connectivity from the homelab.

## Build and verify

```sh
npm run build
npm test
npm ci
npx playwright install chromium  # only if Chromium isn't installed
npm run test:browser
```

Build and structural checks use Node built-ins. Playwright is a development dependency used only for browser QA. Browser checks cover every page at desktop/mobile widths, overflow, filtering, downloads, navigation, tabs/keyboard behavior, FAQs, and form preview. Screenshots are written to ignored `test-results/`.

## Contents

- `design-systems/<id>/DESIGN.md`: editable palette, typography, shape and layout directions.
- `design-systems/<id>/source.json`: fictional brand, category, original headline and provenance.
- `design-systems/<id>/tokens.json`: generated semantic tokens and page plan.
- `lib/`: token extraction, deterministic content, layout selection, rendering, gallery.
- `site/index.html`: searchable gallery, category/theme/layout filters, downloadable HTML.
- `site/<id>.html`: gallery preview with previous/next navigation.
- `site/downloads/<id>.html`: standalone page with inline CSS/JS and no gallery dependency.
- `site/tokens/<id>.json`: deployable design-token files.
- `site/catalog.json`: integration catalog for TKTechnology.
- `docs/BUILD-PLAN.md`: recovered build direction and round-two scope.
- `docs/INTEGRATION.md`: static-hosting and catalog integration notes.

## Templates

| Category | Templates |
| --- | --- |
| Analytics | Signal Atlas, Prism Metrics, Tally Studio |
| Payments | Copper Pay, Current Ledger, Mintline |
| Design systems | Forma Kit, Chromatic, Grid & Grain |
| Infrastructure | Launchrail, Basalt Cloud, Orbit Runtime |
| CRM | Kinfolk CRM, Relay Sales, Threadline |
| Scheduling | Sundial, Tempo Teams, Openhour |
| Security | Watchtower, Evidence House, Safeharbor |
| Publishing | Folio Press, Dispatch CMS, Storyfield |

## Customizing a template

Edit the design document and source metadata, then rebuild. Change category copy in `lib/content.mjs` and shared markup in `lib/render.mjs`. To customize a single exported page directly, work on its downloaded HTML outside the generated `site/` folder; rebuilding replaces generated files.

Templates have usable mobile navigation, accessible feature tabs, native FAQ disclosures, and an explicitly labeled contact-form preview. The form sends and stores nothing. Connect your own backend and replace illustrative claims, pricing, names, and testimonials before using a page as a real business website. System fonts and CSS interface illustrations avoid remote asset dependencies.

No license was added: the original repository has no LICENSE file. Set TKTechnology's distribution terms before offering a licensed commercial download. The original source metadata's ISC package field is not treated here as a grant for this collection.
