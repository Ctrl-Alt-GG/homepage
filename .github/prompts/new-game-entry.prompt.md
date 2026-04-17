---
description: Add a game card entry to data/games.yaml
mode: agent
---

# New game entry

Inputs:

- `${input:slug}` — kebab-case slug (becomes the key in `data/games.yaml`
  and the image filename stem referenced from content).
- `${input:source}` — `steam` | `official-site` | `fan-site`.
- `${input:url}` — absolute URL to the header image (460×215 if
  possible; Steam CDN `header.jpg` is the canonical source).

## Validation before writing

1. Read `data/games.yaml`. If the slug already exists, stop and report —
   do not overwrite silently.
2. Confirm the URL returns HTTP 200. A dead URL causes
   `resources.GetRemote` failures on the production deploy.
3. Prefer permanent, content-addressed URLs (Steam CDN app headers at
   `https://cdn.cloudflare.steamstatic.com/steam/apps/<id>/header.jpg`)
   over hot-linked screenshots.

## Steps

1. Append the entry to the matching comment-delimited group in
   `data/games.yaml`:

   ```yaml
   # Steam CDN headers (460x215 JPEG, permanent content-addressed URLs)
   …
   ${input:slug}: "${input:url}"
   ```

   Groups in the file today: Steam CDN headers, non-Steam games
   (with a provenance comment per line), official sources. Add the
   entry to the group that matches `${input:source}`. If it is
   non-Steam, add a brief provenance comment on its own line above
   the entry (e.g. `# <Game>: <where the image is officially served>`).

2. Reference the image from content via the `cag/image` shortcode
   using the same slug as the filename stem:

   ```markdown
   {{< cag/image src="${input:slug}.jpg" width="460" height="215" loading="lazy" >}}
   ```

3. Do **not** add any templates, partials, or CSS — game cards are
   wholly data-driven.

4. Run `npm run build`. Hugo will fetch and process the image; watch
   for `resources.GetRemote` warnings or errors.

## Invariants to double-check

- Slug is unique within `data/games.yaml`.
- URL returns 200 and serves an image MIME type.
- Entry lives in the correct comment group.
- No trailing whitespace; one entry per line.
