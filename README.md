# Alegre Solutions GS Website

Static multi-page website for Alegre Solutions GS, focused on contractor growth systems for Las Vegas home service businesses.

## Current Structure

Core pages:
- `index.html`
- `about.html`
- `services.html`
- `pricing.html`
- `case-studies.html`
- `contact.html`
- `thank-you.html`
- `404.html`
- `sitemap.html`

Trade and comparison pages:
- `hvac-marketing-las-vegas.html`
- `roofing-marketing-las-vegas.html`
- `plumbing-marketing-las-vegas.html`
- `landscaping-marketing-las-vegas.html`
- `general-contractor-marketing-las-vegas.html`
- `meta-ads-vs-google-ads-contractors.html`
- `gohighlevel-vs-servicetitan.html`

Service detail pages live in `services/`.

Legal and compliance pages:
- `privacy-policy.html`
- `terms-and-conditions.html`
- `cookie-policy.html`
- `accessibility-statement.html`
- `disclaimer.html`
- `do-not-sell.html`
- `data-request.html`

## Assets

Primary styles and scripts:
- `style.css`
- `responsive.css`
- `forms.css`
- `animations.css`
- `script.js`
- `cookie-consent.js`
- `lazyload.js`
- `animations.js`

Primary assets:
- `icons/alegre.png`
- `images/hero-poster.jpg`
- trade hero images in `images/*-hero.jpg`
- hero video files in `videos/`
- Inter variable fonts in `fonts/`

## Deployment Notes

The site has no build step. Upload the static files to the hosting target or serve them through GitHub Pages.

Current public metadata points to:

`https://alegresolutionsgs.com/`

Before final launch:
- Confirm the public URL and update canonicals/sitemap if the path changes.
- Compress `videos/hero-video.mp4` and `videos/hero-video.webm` for better mobile performance.
- Replace or remove any placeholder case study numbers before using them as client proof.
- Have legal pages reviewed by counsel before production use.
- Submit the updated `sitemap.xml` in Google Search Console.

## Maintenance Notes

Cookie consent is handled in `cookie-consent.js` and uses localStorage.
Dark mode is handled in `script.js` using the `alegre-theme` localStorage key and `data-theme` on the root element.
