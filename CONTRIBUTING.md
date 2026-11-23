# Working on the site

## Branches

| Branch | Purpose |
|---|---|
| `main` | What is live on amarrazzaq.com. Only changed through a pull request. |
| `staging` | Optional place to combine changes before release. Built and checked, never deployed. |
| `feature/...`, `fix/...`, `chore/...` | One branch per change. |

Typical flow:

```bash
git switch main && git pull
git switch -c feature/short-description
npm start                     # edit and preview at http://localhost:8080
npm test                      # must pass
git add -A && git commit -m "feat(insights): add article on ..."
git push -u origin feature/short-description
```

Then open a pull request into `main` on GitHub. GitHub Actions builds and checks it. After merging, the site deploys automatically in a minute or two.

Commit messages follow the existing style: `feat(...)`, `fix(...)`, `chore(...)`, `docs(...)`.

## Change the menu, name, title or footer year

Edit `src/_data/site.json`. Every page picks up the change.

## Edit a page

Each page in `src/` has three parts:

```njk
---
permalink: /research/index.html   # the address on the site; do not change for existing pages
nav: research                     # which menu item is highlighted
---
{% extends "layouts/base.njk" %}

{% block head %}
  ... title, description, social-media tags for this page ...
{% endblock %}

{% block content %}
  ... the page itself (everything between the header and the footer) ...
{% endblock %}
```

Edit the HTML inside the blocks as usual. The header and footer come from `src/_includes/partials/`.

A page can also add scripts that run after the footer with `{% block scripts %} ... {% endblock %}` (see `src/insights/liberalizing-wheat-prices-pakistan.njk`).

## Add an Insights article

1. Copy the most recent article, e.g. `src/insights/rethinking-pakistan-farm-economy-2024-agricultural-census.njk`, to `src/insights/<new-slug>.njk`.
2. Change `permalink` to `/insights/<new-slug>.html`.
3. Update everything in the `head` block: title, description, keywords, canonical and `og:url` addresses, image, dates and the Schema.org block.
4. Replace the article text in the `content` block.
5. Put images in `public/images/insights/` and refer to them as `/images/insights/<file>`.
6. Add a card for the article to `src/insights/index.njk` (and to the home page if it should be featured).
7. Run `npm test`, then commit and open a pull request.

## Add a file that is not a page

Put it in `public/` at the path it should have on the site. For example, `public/files/talk.pdf` is served at `/files/talk.pdf`.

## Undo a release

On GitHub, open the merged pull request and click **Revert**, then merge the revert pull request. The previous version is redeployed automatically.
