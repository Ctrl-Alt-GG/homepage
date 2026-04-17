---
description: Scaffold a new bilingual content section under content/
mode: agent
---

# New content section

Inputs:

- `${input:section}` — kebab-case folder name (becomes `content/${input:section}/`).
- `${input:titleHu}` — Hungarian section title.
- `${input:titleEn}` — English section title.
- `${input:summaryHu}` — Hungarian one-sentence summary (≤160 chars).
- `${input:summaryEn}` — English one-sentence summary (≤160 chars).

## Steps

1. Create the folder `content/${input:section}/`.
2. Pick a `weight`: if the section should appear in main navigation,
   read existing top-level `_index.md` files and choose the next free
   multiple of 10 after the current max. Otherwise omit `weight`.
3. Create `content/${input:section}/_index.md` (Hungarian default):

   ```markdown
   ---
   title: "${input:titleHu}"
   summary: "${input:summaryHu}"
   weight: <chosen weight or omit>
   ---

   {{< intro >}}
   Rövid bevezető a szekcióhoz.
   {{< /intro >}}
   ```

4. Create `content/${input:section}/_index.en.md` with matching
   `weight` and translated copy:

   ```markdown
   ---
   title: "${input:titleEn}"
   summary: "${input:summaryEn}"
   weight: <same weight>
   ---

   {{< intro >}}
   Short intro for this section.
   {{< /intro >}}
   ```

5. If the section has custom behaviour flags, check whether an existing
   `params.cag.*` flag in `hugo.yaml` already covers it before adding a
   new one.
6. Run `npm run build` and report any template errors.

## Invariants to double-check

- Both `_index` files exist and share `weight`.
- Neither sets `url`, `slug`, or `aliases`.
- Hungarian comes first; English mirrors it.
- No changes to `hugo.yaml` unless a new behaviour flag is genuinely
  needed.
