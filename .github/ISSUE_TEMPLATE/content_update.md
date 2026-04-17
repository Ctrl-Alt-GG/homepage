---
name: Content update
about: A page, section, or game card needs to be added, corrected, translated, or removed.
title: "[content] "
labels: content
---

## Type

- [ ] Page / section update (Markdown under `content/`)
- [ ] Game card update (`data/games.yaml` entry + matching `cag/image` reference)
- [ ] New shortcode-composed block on an existing page
- [ ] Other (describe below)

## Which page or entry?

- Section / page: <!-- e.g. program, location, about, q-and-a -->
- Slug: <!-- filename without extension, e.g. `program` for content/program.md -->
- Language pair (for content pages):
  - [ ] Hungarian (`<slug>.md`)
  - [ ] English (`<slug>.en.md`)
- Game slug (for game-card updates): <!-- must match the key in `data/games.yaml` -->

<!--
Reminder: the homepage is bilingual. Any change to one language file usually
needs the same change in its pair. `weight`, `draft`, `date`, and slugs must
stay identical across the pair; only `title`, `summary`, and `description`
are translated.
-->

## What needs to change

<!-- Describe the update. Paste replacement text or the new image URL if you have it. -->

## Why

<!-- Context: new date, new game for the lineup, outdated FAQ, etc. -->

## Related links or screenshots

<!-- Optional. -->
