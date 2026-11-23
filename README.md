# amarrazzaq.com

Source for the personal academic website of Dr. Amar Razzaq, built with [Eleventy](https://www.11ty.dev/) and published with GitHub Pages.

## Quick start

You need Node.js 22 or newer.

```bash
npm install      # once, after cloning
npm start        # preview at http://localhost:8080, reloads as you edit
npm test         # build the site and run the checks (do this before every push)
```

## How the project is organised

```
src/                       Pages and articles (Nunjucks templates)
  _data/site.json          Name, title, footer year, counter and the navigation menu
  _includes/layouts/       base.njk: the page frame shared by every page
  _includes/partials/      header.njk and footer.njk, written once for the whole site
  index.njk                Home page
  research/ outreach/ services/ insights/
public/                    Copied unchanged to the same address on the site
  style.css, site.js       Site stylesheet and script (menu, light/dark switch)
  images/                  All images
  CNAME                    Custom domain (amarrazzaq.com). Do not remove.
  robots.txt, sitemap.xml  Search engine files
  google39ba595f50221b08.html   Google Search Console verification. Do not remove.
  *.htm                    Redirects from old addresses (e.g. /research.htm)
  cv/index.html            Redirect: old CV address now goes to the home page (the CV is not published)
docs/                      Reference material, not published (e.g. the old article template)
scripts/check-site.mjs     Checks the built site (see below)
scripts/clean.mjs          Empties _site/ before each build
eleventy.config.js         Build settings
_site/                     Build output. Never edit; it is rebuilt every time.
```

**Rule of thumb:** a file in `public/` appears on the site at the same path (`public/images/amar.jpg` becomes `/images/amar.jpg`). A file in `src/` is a page that gets the shared header and footer.

## Common tasks

See [CONTRIBUTING.md](CONTRIBUTING.md) for step-by-step instructions: changing the menu, editing a page, adding an Insights article and releasing changes.

## Checks

`npm run check` runs on the built site and fails if:

- `CNAME`, `robots.txt`, `sitemap.xml` or the Google verification file is missing
- an address in `sitemap.xml` has no page
- an internal link, image, script or stylesheet points to a file that does not exist
- a file that must stay private would be published (the CV, the article template, or any PDF)

To publish a PDF on purpose, remove the PDF rule in `scripts/check-site.mjs` deliberately.

## Deployment

GitHub Actions (`.github/workflows/deploy.yml`) builds and checks every push and pull request. Only the `main` branch is deployed to amarrazzaq.com. If the checks fail, nothing is deployed and the live site stays as it was.

The repository's Pages setting must be **Settings → Pages → Build and deployment → Source: GitHub Actions**.
