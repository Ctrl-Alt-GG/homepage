---
description: Rules for authoring Hugo shortcodes (the marketing component library)
applyTo: 'layouts/shortcodes/**/*.html'
---

# Shortcode authoring

Shortcodes are the **public authoring API** of this site. Content authors
call them from Markdown; existing content pins on their parameter names
and their root CSS class. Treat every rename as a breaking change.

## Parameter contract

- Parameters authors touch are **named** (`{{< features heading="…" >}}`),
  not positional. Reserve positional arguments (`{{ .Get 0 }}`) for
  single-value utilities like `{{< email "…" >}}`.
- Every parameter gets a default with `{{ .Get "param" | default "…" }}`.
  Never `errorf` on a missing optional — only on truly required inputs
  (document them in the leading comment).
- Accept `class=` as an additive parameter (appended to the root, never
  replacing) when the shortcode renders a visual primitive.
- Do **not** validate emoji parameters with `strings.RuneCount`: many
  valid single grapheme clusters (ZWJ sequences, flag emojis) are more
  than 2 runes. Only warn on clearly wrong input such as multi-word
  strings containing whitespace.

## Inner content

- `{{ .Inner }}` may or may not be Markdown. Pick one and document it
  in the leading comment.
- **Never output `{{ .Inner }}` directly** when the contract says it
  accepts Markdown — always pipe it through `.Page.RenderString` or
  `markdownify` so authors get the expected rendering.
- For block-level Markdown, prefer `{{ .Inner | .Page.RenderString }}`
  over raw `markdownify` — it respects per-page Markdown config. Wrap
  the output in a `<div>`, not `<p>`, so the block-level `<p>` elements
  that `RenderString` produces are valid.
- For attribute-safe text, use `{{ .Inner | markdownify | plainify }}`.

## Styling contract

- Root elements use a semantic class prefix `cag-*` (e.g. `cag-intro`,
  `cag-features`, `cag-grid`, `cag-faq`). Do not rename existing ones.
- Tailwind utilities are allowed alongside the `cag-*` class.
- Never inline brand hexes — use the `@theme` tokens declared in
  `assets/css/main.css`.
- Images go through the `cag/image` shortcode; galleries through
  `cag/gallery`. Do not hand-roll `<img>` or `<figure>` combos.

## Composition

- Do not call shortcodes from other shortcodes. Delegate shared
  rendering to a partial (`layouts/partials/...`) and call it from both
  sites.
- When a new shortcode overlaps an existing one (`card` vs a proposed
  `tile`, `features` vs a proposed `grid`), extend the existing one's
  params instead of forking.

## Leading comment

Every shortcode starts with a documented header:

```html
{{- /*
  One-sentence summary of what this renders.

  Params (named):
    heading (string, required) — section heading.
    variant (string, optional, default "default") — visual variant.

  Inner: block Markdown (piped through .Page.RenderString).

  Usage:
    {{</* features heading="Why come?" */>}}
      {{</* card icon="🎮" title="…" */>}}…{{</* /card */>}}
    {{</* /features */>}}
*/ -}}
```

This is non-negotiable — the file is the reference for content authors.
