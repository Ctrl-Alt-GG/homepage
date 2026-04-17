# Ctrl-Alt-GG Homepage

The brand homepage of the [Ctrl-Alt-GG](https://ctrl-alt-gg.hu) LAN community — program, location, FAQ, recap, games, and about. Bilingual (Hungarian / English). Live at <https://www.ctrl-alt-gg.hu/>.

This is the marketing front door: it tells people what Ctrl-Alt-GG is, where it happens, and what they can expect. Content is composed out of a small shortcode library so most updates stay in Markdown.

## Stack

Hugo (extended) + Tailwind CSS v4 + Node.js, deployed to Azure Static Web Apps.

Tool versions and build commands are pinned in the repo — don't copy them into docs. Read them from:

- `.nvmrc` and `engines.node` in `package.json` — Node version
- `module.hugoVersion` in `hugo.yaml` — Hugo version floor
- `scripts` in `package.json` — dev and build commands

## Local development

```bash
nvm use
npm ci
npm run dev
```

Tailwind runs in watch mode alongside `hugo server`; the site is served at <http://localhost:1313/>.

The first build is **slow**. The homepage pulls game cover images from remote sources at build time via `resources.GetRemote` (see `data/games.yaml`), and caches them under `resources/` afterwards. Subsequent builds are fast. Both `resources/` and the cache are git-ignored.

## Build

```bash
npm run build
```

Builds the Tailwind stylesheet first, then runs Hugo. Output is written to `public/`. Never run `hugo` directly without `npm run build:css` first — templates reference classes that only exist in the compiled stylesheet.

## Project layout

- `content/` — top-level marketing pages and sections (about, location, program, Q&A, recap, stuff). Each user-facing page ships in both `<slug>.md` (Hungarian) and `<slug>.en.md` (English).
- `data/games.yaml` — the game-cards dictionary. Each entry is `slug: "<image url>"`; the slug is referenced from content via the `cag/image` shortcode.
- `layouts/shortcodes/` — the marketing component library authors compose pages from: `intro`, `features`, `card`, `faq`, `countdown`, `maps`, `person`, `stuff-*`, `cag/image`, `cag/gallery`, `cag/email`.
- `layouts/_default/` and `layouts/partials/` — site-wide templates and reusable fragments (`head/`, `footer/`, `chroma/`).
- `assets/css/main.css` — Tailwind v4 source. The compiled output in `assets/css/compiled/` is git-ignored.
- `i18n/hu.yaml`, `i18n/en.yaml` — per-locale string tables for template-owned strings.
- `static/` — files copied verbatim to the site root.

Site-wide behaviour flags live in `hugo.yaml` under `params.cag.*` (e.g. `disable_breadcrumbs`, `disable_authors`, schema toggles). Templates must respect them.

## Contributing and working with AI agents

The canonical contributor guide — for humans and AI agents alike — is [`AGENTS.md`](AGENTS.md). It covers bilingual parity, the shortcode contract, `data/games.yaml` conventions, the Tailwind setup, and the "do-not-touch" list.

Path-scoped rules for Copilot and other agents live under `.github/instructions/` and are auto-applied by glob. Reusable slash-command scaffolds (new section, new shortcode, new game entry) live under `.github/prompts/`.

When opening a PR, follow [`.github/PULL_REQUEST_TEMPLATE.md`](.github/PULL_REQUEST_TEMPLATE.md). The most important checks are that `npm run build` is clean, no generated artefacts are committed, and bilingual parity is maintained.

## Deployment

Pushes and PRs targeting `main` are built and deployed to Azure Static Web Apps via the workflow in `.github/workflows/`. The required build order (`npm ci` → `npm run build:css` → `hugo`) is encoded there and mirrors the npm scripts. The deploy uploads from `app_location: /public`.
