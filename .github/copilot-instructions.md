# Copilot instructions

The canonical guide for this repo is [`AGENTS.md`](../AGENTS.md). Read it first;
this file only lists always-true invariants so Copilot Chat never breaks them.

## Stack

Hugo (extended) + Tailwind CSS v4 + Node.js, deployed to Azure Static Web Apps.
Do **not** hard-code versions — read `.nvmrc`, `engines` in `package.json`, and
`module.hugoVersion` in `hugo.yaml`.

## Non-negotiables

- Run Tailwind before Hugo. Use `npm run build` / `npm run dev`; never run
  `hugo` without first running `npm run build:css`.
- Never commit generated artefacts: `public/`, `resources/`, `assets/css/compiled/`,
  `.hugo_build.lock`, `hugo_stats.json`. All in `.gitignore`.
- Bilingual parity: every `content/**/<slug>.md` (Hungarian) has a matching
  `<slug>.en.md`. `weight`, `draft`, `date`, and slugs stay in sync; only
  `title`, `summary`, and `description` are translated.
- Respect the `params.cag.*` flags in `hugo.yaml` (`disable_breadcrumbs`,
  `disable_authors`, schema toggles, etc.). A feature disabled at the site
  level must not render unconditionally in a template.
- Shortcode API stability: parameter names under `layouts/shortcodes/**` are
  a public contract — existing content relies on them. Extend rather than
  rename.
- Tailwind v4 syntax (`@import "tailwindcss"`, `@plugin`, `@theme`,
  `@custom-variant`). Edit `assets/css/main.css`; never touch
  `assets/css/compiled/**`.
- Semantic class prefix `cag-*` on shortcode roots is part of the public
  API — authors may target these in custom styling.
- User-facing strings go through `{{ i18n "key" }}`, with the key added to
  **both** `i18n/hu.yaml` and `i18n/en.yaml`.
- Images in content go through the `cag/image` shortcode, not raw `<img>`.

## Scope-specific rules

Path-scoped guidance lives in `.github/instructions/*.instructions.md` —
Copilot auto-applies the right file via its `applyTo` glob. Reusable
scaffolds for recurring tasks live in `.github/prompts/*.prompt.md`.
