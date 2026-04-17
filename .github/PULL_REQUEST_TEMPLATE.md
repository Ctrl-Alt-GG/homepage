<!--
Thanks for contributing to the Ctrl-Alt-GG Homepage!
Keep this short. If a section doesn't apply, delete it.
-->

## What changed

<!-- One or two sentences. What does this PR do, and why? -->

## Scope

- [ ] Content (Markdown under `content/`)
- [ ] Data (`data/games.yaml` or other `data/`)
- [ ] Presentation (layouts, shortcodes, CSS under `assets/css/`)
- [ ] Configuration (`hugo.yaml`, `package.json`, workflows)
- [ ] Docs / agent files (`AGENTS.md`, `.github/instructions/`, `.github/prompts/`)

## Checks

- [ ] `npm run build` succeeds locally with no template errors
- [ ] No generated artefacts committed (`public/`, `resources/`, `assets/css/compiled/`, `.hugo_build.lock`, `hugo_stats.json`)
- [ ] Bilingual parity: every `content/**/<slug>.md` has a matching `<slug>.en.md`, with identical `weight`, `draft`, `date`, and slug
- [ ] New user-facing strings go through `{{ i18n "key" }}` with the key added to both `i18n/hu.yaml` and `i18n/en.yaml`
- [ ] New shortcodes use named parameters, respect `params.cag.*` flags, and document the `.Inner` contract in a leading comment
- [ ] New `data/games.yaml` entries resolve to a live `200` URL and are referenced by matching slug
- [ ] Agent-facing docs updated if behaviour changed (`AGENTS.md`, `.github/instructions/`)

## Screenshots / notes

<!-- Optional. Especially helpful for layout, shortcode, or CSS changes. -->
