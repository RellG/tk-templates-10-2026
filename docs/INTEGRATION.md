# TKTechnology integration

Deploy the contents of `site/` under a static path such as `/templates/collection-02/`. Keep `assets/`, `tokens/`, and `downloads/` beside the gallery. JPEG files must be served as `image/jpeg`.

`catalog.json` includes each fictional title, reference title/source URL, category, theme, hero and photo layout, sections, preview/download/token paths, colors and image provenance. Resolve relative paths against the catalog URL:

```js
const catalogURL = new URL('/templates/collection-02/catalog.json', location.origin);
const response = await fetch(catalogURL);
if (!response.ok) throw new Error('Template catalog unavailable');
const templates = (await response.json()).map(template => ({
  ...template,
  previewURL: new URL(template.preview, catalogURL).href,
  downloadURL: new URL(template.download, catalogURL).href,
  tokensURL: new URL(template.tokens, catalogURL).href,
}));
```

Use `collection + '/' + id` when merging catalogs. Same-origin links support HTML downloads; cross-origin hosting may need `Content-Disposition: attachment`.

Each standalone download embeds its photo and styles/scripts, so copying that one HTML file is sufficient. Preview pages instead share the local photo assets. Customize the fictional text and connect the demo form before using a template for a real business. The footer retains design/photo attribution links; asset provenance is also in `assets/credits.json`.

The production TKTechnology website is not part of this checkout. This collection supplies the deployment files and catalog; the running WireGuard preview does not publish to the production domain.
