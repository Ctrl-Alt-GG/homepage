# AGENTS.md — Ctrl-Alt-GG Homepage

> Canonical guide for AI coding agents (GitHub Copilot, Cursor, Codex, Claude, etc.)
> working on this repository. Editors, humans, and automation should all read this first.
> See `README.md` for the human-facing pointer.

## 1. What this repo is

The **brand homepage** of the Ctrl-Alt-GG LAN community — the main marketing
and info site (program, location, FAQ, recap, gaming stuff, about us). Built
with Hugo + Tailwind CSS v4, deployed to Azure Static Web Apps. Live at
<https://www.ctrl-alt-gg.hu/>.

Bilingual: Hungarian (`hu`) is the default, English (`en`) is secondary. The
site also renders rich marketing sections via a shortcode library and pulls
game metadata from a YAML data file.

## 2. Source of truth for the stack

Do not hard-code versions or commands in docs or code. Read them from:

| Fact | Pinned in |
|---|---|
| Node.js version | `engines.node` in `package.json` |
| Hugo version floor | `.github/workflows/azure-static-web-apps-*.yml` |
| Dev / build commands | `scripts` in `package.json` |
| Deploy pipeline | `.github/workflows/azure-static-web-apps-*.yml` |
| Site languages, params, flags | `hugo.yaml` (`[languages]`, `params.cag.*`) |
| Game card sources | `data/games.yaml` |
| Ignored / generated paths | `.gitignore` |

If a change would contradict any of these, update the pinned source.

## 3. Repository shape (conventions, not inventory)

- `content/` — top-level marketing pages and sections (about, location,
  program, Q&A, recap, stuff). Each human-facing page ships in both
  `<slug>.md` (Hungarian) and `<slug>.en.md` (English).
- `data/` — structured data consumed by templates (`games.yaml` keys are
  slugs; values are remote image URLs fetched at build time).
- `layouts/_default/` — site-wide templates (`baseof`, `list`, `single`).
- `layouts/partials/` — reusable template fragments. Nested folders group
  related partials (`head/`, `footer/`, `chroma/` for code highlighting).
- `layouts/shortcodes/` — the marketing component library
  (`intro`, `features`, `card`, `faq`, `countdown`, `maps`, `person`,
  `stuff-*`, `cag/image`, `cag/gallery`, `cag/email`). Content authors
  compose pages out of these.
- `assets/css/` — Tailwind source; `assets/css/compiled/` is **git-ignored** (generated during build).
- `assets/img/`, `assets/js/` — small hand-authored static assets.
- `i18n/` — per-locale string tables (`<lang>.yaml`).
- `static/` — files copied verbatim to the site root.
- `public/`, `resources/` — build output. **Never commit.**

Discover actual files via the filesystem; the names above describe roles,
not a pinned inventory.

## 4. Running the project

```bash
npm ci               # install locked deps
npm run dev          # Tailwind --watch + hugo server
npm run build        # production build (build:css then build:hugo)
```

The first Hugo build fetches remote images referenced in `data/games.yaml`
via `resources.GetRemote`. Expect a slow first run and a `resources/` cache
directory (git-ignored) afterwards.

## 5. Content invariants

- Every user-facing page exists in both locales: `<slug>.md` (Hungarian)
  and `<slug>.en.md` (English). `_index.md` / `_index.en.md` for sections.
- `weight`, `draft`, `date`, slugs stay identical across the pair; only
  `title`, `summary`, and `description` are translated.
- The `params.cag.*` tree in `hugo.yaml` encodes site-wide behaviour flags
  (`disable_breadcrumbs`, `disable_authors`, schema toggles, …). Respect
  them when writing templates — a feature that is disabled at the site
  level must not render unconditionally in a partial.
- Don't set page-level `url` / `slug` / `aliases` unless you are
  intentionally diverging from Hugo's defaults.

## 6. Shortcode contracts

The shortcode library is the **public authoring API**. When touching or
adding shortcodes, preserve the calling shape so existing content keeps
working.

General rules:

- Parameters that an author passes should be **named**
  (`{{< features heading="…" >}}`), not positional.
- `{{ .Inner }}` may or may not be Markdown — decide per-shortcode and
  document the expectation in a leading comment. When in doubt, prefer
  `{{ .Inner | .Page.RenderString }}` (keeps Hugo's Markdown settings)
  over raw `{{ .Inner | markdownify }}`.
- Never inline brand colours; use the `@theme` tokens in
  `assets/css/main.css`.
- Images should go through `cag/image` (it handles WebP/responsive sizes).
  Don't hand-write `<img>` tags in content.

## 7. Data files

- `data/games.yaml` is a flat dictionary: `slug: "<image url>"`. The slug
  is used as the filename stem referenced from Markdown. When adding a
  game card, add the entry here **first**, then reference the image in
  content via the `cag/image` shortcode using the same slug.
- Prefer permanent, content-addressed sources (Steam CDN headers) over
  fragile hot-link URLs. Verify the URL returns `200` before committing.
- Keep entries grouped and commented by source (Steam / official /
  non-Steam) the way the file already does. Stable ordering matters only
  for human reviewers; templates do not rely on it.

## 8. Templating conventions

- Start non-trivial templates with `{{ $page := . }}` and work off `$page`.
- Read parameters with `.Param "cag.site.color"` so values cascade site →
  section → page.
- Pipe user content through `markdownify | plainify | htmlUnescape` before
  it enters HTML attributes.
- Render icons via the `icon.html` partial; do not inline SVG paths.
- All user-facing strings go through `{{ i18n "key" }}` with the key in
  **both** `i18n/hu.yaml` and `i18n/en.yaml`.

## 9. Styling (Tailwind CSS v4)

- Entry: `assets/css/main.css` (`@import "tailwindcss"`, `@plugin
  "@tailwindcss/typography"`, `@theme { … }`).
- Never touch `assets/css/compiled/**`.
- Shortcodes use their own semantic class prefixes (`cag-*`, e.g.
  `cag-intro`, `cag-features`). Keep that naming so
  content-authored CSS selectors keep working.
- Dark mode is expressed via the `dark:` variant with a custom variant
  declaration; do not introduce `prefers-color-scheme` media queries.

## 10. Deployment

`main` pushes and PRs are built and deployed by the Azure Static Web Apps
workflow under `.github/workflows/`. Required order:
`npm ci` → `npm run build:css` → `hugo` → upload. Do not change
`app_location`, `api_location`, `output_location`, or the secret name
without aligning Azure side.

## 11. Do-not-touch list

- `assets/css/compiled/**` — generated.
- `public/**`, `resources/**`, `.hugo_build.lock`, `hugo_stats.json`.
- `node_modules/**`.
- `.github/workflows/**` unless that is the subject of the change.

## 12. Where the other Copilot files fit

- `.github/copilot-instructions.md` — thin always-loaded pointer to this
  document.
- `.github/instructions/*.instructions.md` — path-scoped rules (templates,
  content, CSS, workflows, shortcodes, data files) auto-applied by glob.
- `.github/prompts/*.prompt.md` — reusable slash-command scaffolds for
  recurring tasks.
