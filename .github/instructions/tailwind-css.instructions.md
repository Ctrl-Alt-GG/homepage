---
description: Tailwind CSS v4 rules for the site stylesheet source
applyTo: 'assets/css/**/*.css'
---

# Tailwind CSS v4

## Entry point

`assets/css/main.css` is the single source file. Keep these at the top:

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";
```

The compiled output lives under `assets/css/compiled/` and is
**git-ignored**. Never edit compiled files, never commit them.

## Design tokens

Shared tokens live in `@theme { … }` at the top of `main.css`:

- Brand palette: `--color-brand-*` (cross-site red, mirrored across
  `care`, `homepage`, and `spawn`).
- Typography: `--font-sans` (Inter-first fallback chain).
- Radius / elevation: `--radius-*`, `--shadow-*`.

Don't introduce parallel token systems, ad-hoc hexes in templates, or
`!important` overrides. Add or rename tokens here so all three CAG
properties stay visually coherent.

## Shortcode styling contract

The shortcode library uses semantic class prefixes (`cag-intro`,
`cag-features`, `cag-grid`, `cag-faq`, …). Treat these as a **public
API** — content authors may target them from custom CSS snippets, and
existing content may rely on them. Style them via `@layer components`:

```css
@layer components {
  .cag-features {
    @apply my-12 grid gap-6;
  }
  .cag-features-heading {
    @apply text-2xl font-bold mb-4;
  }
}
```

Never rename an existing `cag-*` class; extend by adding new ones.

## Dark mode

Dark mode is expressed with the `dark:` variant (declared via
`@custom-variant dark (&:where(.dark, .dark *, [data-theme="dark"], [data-theme="dark"] *))`).
Do not add `prefers-color-scheme` media queries alongside it.

## Typography

The typography plugin is enabled; style Markdown output via `.prose`
selectors under `@layer components`, not by decorating individual
elements in templates.

## Build

`npm run build:css` runs the CLI once; `npm run dev:css` watches. Both
are wired from `package.json` — do not invoke the Tailwind binary
directly.
