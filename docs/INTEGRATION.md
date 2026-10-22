# Make the collection available on TKTechnology

`site/` is the complete static deployment artifact. There is no runtime build, remote font, API or image dependency. Deploy the contents under a directory such as `/templates/collection-02/`; relative gallery, preview, download and token URLs work under that prefix.

## Catalog integration

Fetch `/templates/collection-02/catalog.json` from your TKTechnology gallery. Each record includes `id`, `title`, `collection`, `category`, `theme`, `hero`, `sections`, `description`, `preview`, `download`, `tokens` and `colors`.

Resolve relative links against the **catalog URL**, not the parent page:

```js
const catalogURL = new URL('/templates/collection-02/catalog.json', location.origin);
const templates = await fetch(catalogURL).then(response => {
  if (!response.ok) throw new Error('Template catalog unavailable');
  return response.json();
});
const cards = templates.map(template => ({
  ...template,
  previewURL: new URL(template.preview, catalogURL).href,
  downloadURL: new URL(template.download, catalogURL).href,
  tokensURL: new URL(template.tokens, catalogURL).href,
}));
```

Use `collection + '/' + id` as the key if merging multiple catalogs. Same-origin links support the HTML `download` attribute; for cross-origin download hosting, configure `Content-Disposition: attachment` on the download files.

## Customize and publish

1. Copy the selected standalone HTML download into the client project.
2. Replace the fictional branding, illustrative claims, pricing and testimonials.
3. Connect the demo contact form to the intended submission service; update its status messaging.
4. Add real policy/contact destinations if required for that business.
5. Set TKTechnology's template distribution terms.
6. Deploy and review the business-specific version.

The local preview does not publish to the TKTechnology production domain. This repository supplies the collection and catalog; integration into a separate production repository needs that site's source or hosting configuration.
