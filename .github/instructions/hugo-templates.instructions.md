---
description: Conventions for Hugo Go templates under layouts/
applyTo: 'layouts/**/*.html'
---

# Hugo template conventions

## Entry points

- `layouts/_default/baseof.html` wraps every page.
- `layouts/_default/list.html` and `single.html` specialise it.
- Prefer adding a partial over forking a `_default` template.

## Idioms

- Open templates with `{{ $page := . }}` and work off `$page`.
- Read parameters with `.Param "cag.site.color"` so values cascade site →
  section → page.
- Respect site-wide `params.cag.*` flags: when a flag such as
  `cag.site.disable_breadcrumbs` is true, the corresponding partial must
  no-op. Gate render logic with `{{ if not (.Param "cag.site.disable_…") }}`.
- Pipe user-provided text through `markdownify | plainify | htmlUnescape`
  before embedding into attributes (`<title>`, `<meta content="…">`,
  `alt`, `content` in OpenGraph meta).
- Icons are rendered via `{{ partial "icon.html" (dict "name" "…" "size" 18) }}`.

## Partials vs shortcodes

- **Partials** compose templates (`{{ partial "head/css.html" . }}`).
- **Shortcodes** are the authoring API invoked from Markdown with
  `{{< name … >}}`.
- Do not call shortcodes from templates; do not expect partials to be
  reachable from Markdown.

## Internationalisation

- All user-facing strings go through `{{ i18n "key" }}`; add every new
  key to **both** `i18n/hu.yaml` and `i18n/en.yaml` in the same commit.
- Use `ref`/`relref` for cross-page links so they resolve per locale.

## Remote resources

- `data/games.yaml` provides remote image URLs consumed via
  `resources.GetRemote`. When adding a template that fetches remote
  assets, always:
  1. Cache the fetch result (`$res := resources.GetRemote $url`).
  2. Guard with `{{ with $res.Err }}{{ errorf "…" . }}{{ end }}`.
  3. Pipe through `.Process "webp"` (or similar) before templating.

## Safety

- Prefer `markdownify` over `safeHTML` unless you own the HTML fragment.
- Keep templates idempotent — no global state, no writes outside render.
