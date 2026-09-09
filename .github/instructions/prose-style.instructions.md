---
description: Prose and tone rules for everything the agent writes (page copy, i18n strings, code comments, docs, commit messages)
applyTo: 'content/**/*.md, i18n/*.yaml, **/*.md'
---

# Prose style

These rules cover **every string a reader can see**: page copy under
`content/`, translations in `i18n/`, code and template comments, docs
such as `README.md` and `AGENTS.md`, commit messages, and PR
descriptions. Hungarian and English are held to the same standard.

## Banned characters

Never emit these. They are the clearest signal that a machine wrote the
text, and they break `grep`, diffs, and hand-editing.

| Banned | Use instead |
|---|---|
| em dash `—` | comma, colon, semicolon, parentheses, or two sentences |
| en dash `–` | comma; a plain hyphen `-` in numeric ranges (`10-15 perc`) |
| ellipsis `…` | three periods `...` |
| curly quotes `‘ ’ “ ”` | straight `'` and `"` |
| non-breaking space | a normal space (use `&nbsp;` only when the markup needs it) |
| decorative arrows `→ ⇒` in prose | "to", "becomes", "leads to" |

Exceptions, all narrow:

- Characters that belong to the language or the data itself: proper
  nouns, and stop names copied verbatim from BKK.
- A trailing arrow used as a **visual affordance** on a call-to-action
  button (`care_cta_button` in `i18n/`). That is a design element, not
  prose. Do not introduce new ones.

Before committing, sweep the files you touched. This file is the only
legitimate home for the glyphs above, so it is excluded:

```bash
git diff --name-only main \
  | grep -v 'prose-style.instructions.md' \
  | while read -r f; do
      [ -f "$f" ] && grep -Hn $'[\u2013\u2014\u2026\u2018\u2019\u201c\u201d]' "$f"
    done
```

## Write like a native speaker, not a model

- **Say the thing.** Lead with the fact the reader needs. Cut the
  wind-up ("It is worth noting that", "In this section we will",
  "Fontos megjegyezni, hogy").
- **Vary sentence length.** Runs of identically shaped medium sentences
  are what makes copy read robotic. Let a short one land.
- **No triads by reflex.** Three parallel adjectives or three parallel
  clauses per sentence is a model tic. Use the number of items the idea
  actually has.
- **Ban filler superlatives**: "seamless", "robust", "leverage",
  "delve", "elevate", "unlock", "journey", "in today's fast-paced".
  Hungarian equivalents too: "élményekben gazdag", "garantáltan",
  "ne maradj le".
- **Concrete over abstract.** "Bus 118 stops 320 m away" beats
  "excellent transport links".
- **Second person, present tense** for reader-facing copy. Hungarian
  uses informal *te* ("gyere", "hozz magaddal"), never *ön*.
- **No emoji in body prose.** The `icon=` parameters on shortcodes are
  the sanctioned place for them.
- **Don't restate the heading** in the first sentence under it.

## Hungarian specifics

- Hungarian is the source language, not a translation of the English.
  Write it natively; if a sentence only makes sense as a calque of the
  English, rewrite it.
- Keep the two locales semantically equal but idiomatically independent.
  Sentence counts may differ; meaning must not.
- Use Hungarian typographic conventions for numbers, dates, and
  addresses (`1037 Budapest, Nagymihály utca 2.`, `10-15 perc`).

## Comments in code

Same rules, plus: a comment states what the code cannot. Do not narrate
the next line, do not address a reviewer, and do not write a paragraph
where one line does.
