---
description: Rules for structured data files under data/
applyTo: 'data/**/*.{yaml,yml,toml,json}'
---

# Data files

Hugo exposes everything under `data/` as `site.Data.<filename>`. Templates
read from it, so the shape of these files is part of the template
contract.

## `data/games.yaml`

- Flat dictionary: `slug: "<remote-image-url>"`.
- The slug is used as the image filename stem referenced from content
  via the `cag/image` shortcode. Renaming a slug orphans every
  reference — treat it as a breaking change and grep `content/` first.
- Prefer permanent, content-addressed URLs (Steam CDN app headers at
  `https://cdn.cloudflare.steamstatic.com/steam/apps/<id>/header.jpg`)
  over hot-linked screenshots.
- Verify the URL returns `200` before committing. Dead URLs cause
  `resources.GetRemote` build failures on the production deploy.
- Keep entries grouped by source with the existing comment headers
  (Steam CDN / non-Steam / official) so reviewers can audit provenance.
- No trailing whitespace; one entry per line; align values loosely for
  readability but do not reformat on unrelated edits.

## Adding a new data file

When introducing a new `data/*.{yaml,toml,json}` file:

1. Document its shape in a leading comment (YAML/TOML) or a paired
   README fragment.
2. Use stable keys (slugs, ids) rather than numeric indices — templates
   should iterate with `range` over values keyed by identity.
3. Keep bilingual labels together (e.g. `title_hu` and `title_en`
   beside each other) rather than splitting into sibling files.
4. Do **not** put secrets or tokens in `data/`. Everything here ships
   to the public build.

## General YAML hygiene

- Use double-quoted strings for URLs and anything containing `:` or
  `#`.
- UTF-8, LF line endings, no BOM.
- Keep ordering stable across edits (alphabetical or grouped) so
  diffs stay reviewable.
