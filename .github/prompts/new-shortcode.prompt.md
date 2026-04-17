---
description: Create a new Hugo shortcode under layouts/shortcodes/
mode: agent
---

# New shortcode

Inputs:

- `${input:name}` — kebab-case filename (becomes `{{< name … >}}`).
  If the shortcode belongs in the `cag/` namespace (generic visual
  primitive reused across pages), prefix accordingly:
  `${input:name}` → `cag/${input:name}`.
- `${input:summary}` — one-line description of what this renders.
- `${input:params}` — comma-separated named parameters.

## Before writing anything

1. List `layouts/shortcodes/` (and `layouts/shortcodes/cag/`). If an
   existing shortcode has overlapping purpose, stop and recommend
   extending it instead of forking.
2. Confirm you are writing a **shortcode** (called from Markdown with
   `{{< name >}}`), not a partial (called from templates).
3. Decide `Inner` handling:
   - Block Markdown → `{{ .Inner | .Page.RenderString }}`.
   - Plain text for attributes → `{{ .Inner | markdownify | plainify }}`.
   - None (self-closing) → omit `Inner` usage.

## Create `layouts/shortcodes/${input:name}.html`

```html
{{- /*
  ${input:summary}

  Params (named):
    <param> (type, required|optional, default "…") — purpose.

  Inner: <block markdown | attribute-safe text | none>.

  Usage:
    {{</* ${input:name} param="…" */>}}Inner{{</* /${input:name} */>}}
*/ -}}
{{- $class := .Get "class" | default "" -}}
<div class="cag-${input:name} {{ $class }}">
  {{ .Inner | .Page.RenderString }}
</div>
```

Rules:

- Root element gets the `cag-${input:name}` class **and** any
  author-supplied `class=` appended.
- Named parameters only for anything the author touches; positional
  only for single-value utilities.
- Never inline brand hexes; use the `@theme` tokens.
- Icons via `{{ partial "icon.html" (dict "name" "…" "size" 18) }}`.
- Do not call other shortcodes from inside — delegate to a partial.

## After writing

1. Add a one-line usage example to the leading comment (above).
2. Exercise the shortcode on at least one page (both HU and EN if the
   page pair exists) so the production build covers it.
3. If the shortcode introduces new styling patterns, add them under
   `@layer components` in `assets/css/main.css` rather than inline.
4. Run `npm run build` and confirm no template or CSS errors.
