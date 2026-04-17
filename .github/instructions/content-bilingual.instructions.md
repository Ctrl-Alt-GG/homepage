---
description: Bilingual content rules for Markdown under content/
applyTo: 'content/**/*.md'
---

# Content rules (Hungarian + English)

## Pairing rule

Every page exists twice:

- `content/<path>/<slug>.md` — Hungarian (default language)
- `content/<path>/<slug>.en.md` — English

Section indexes follow the same rule (`_index.md` / `_index.en.md`).
Creating, renaming, or deleting one half without the other breaks parity
and must not be done.

## Frontmatter

Required keys on every content page:

- `title` — translated per locale.
- `summary` or `description` — translated per locale, one sentence,
  ≤160 characters.
- `weight` — integer, identical across the language pair, unique within
  the section (conventionally multiples of 10).

Optional:

- `date` — ISO date; identical across the pair.
- `draft: true` while WIP; remove before merging to `main`.

Do not set `url`, `slug`, or `aliases` unless intentionally diverging
from Hugo's defaults — they desync the two locales.

## Authoring with shortcodes

Compose pages out of the project shortcode library rather than raw HTML:

```markdown
{{< intro >}}Opening paragraph (renders inside .cag-intro).{{< /intro >}}

{{< features heading="Why come?" >}}
  {{< card icon="🎮" title="Real LAN" >}}No lag, just skill.{{< /card >}}
  {{< card icon="🏆" title="Tournament" >}}Compete with your team.{{< /card >}}
{{< /features >}}

{{< cag/image src="gamingroom.webp" width="100%" height="20rem"
    class="rounded-4 shadow" loading="eager" fetchpriority="high"
    breakpoints=true >}}
```

- Use `cag/image` for every image (handles WebP + responsive breakpoints).
- Use `cag/gallery` for galleries; do not hand-roll `<figure>` + `<img>`
  combos.
- Consult `layouts/shortcodes/` for the current parameter contract; extend
  rather than fork when a shortcode almost fits.

## Writing style

- Hungarian copy is primary: write the Hungarian version first, translate
  after, and cross-check tone and structure match.
- Sentence case in headings; keep depth shallow (H2/H3 mostly).
- Cross-page links use `ref`/`relref`, never a hard-coded URL.

## Page resources

Images and downloads placed next to a Markdown file are page resources.
Reference them by filename (e.g. `src="gamingroom.webp"` inside
`cag/image`), not by absolute `/static/...` paths, so page bundles stay
portable.
