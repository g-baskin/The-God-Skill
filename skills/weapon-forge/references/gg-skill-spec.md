# GG Coder Skill Specification Reference

This file summarizes what `weapon-forge` needs to know to produce a valid, high-quality GG Coder skill for this repository.

---

## What a GG Coder skill is

A GG Coder skill is a folder containing a `SKILL.md` file and optional supporting resources. In this repo, God routes to a weapon by loading `skills/<weapon-name>/SKILL.md` after it has selected the matching guardian.

The SKILL.md body should act as a compact navigation layer: it explains what to do, then points to focused guides, examples, templates, scripts, reports, and research only when the request needs them.

---

## Required structure

```
<weapon-name>/
└── SKILL.md          (required)
```

That's the minimum. Everything else is optional but recommended for weapons that need more than a few hundred lines of instruction.

---

## SKILL.md structure

```markdown
---
name: skill-name
description: A sentence or two describing what this skill does and when to use it.
---

# Skill body in markdown
...
```

### Frontmatter rules

- `name` must match the folder name exactly.
- `description` is the trigger and routing summary. It should specify both **what the skill does** and **when to use it**.
- Additional optional fields such as `license`, `compatibility`, or `version` may be used only when the consuming tool or repo convention already supports them.

### Body best practices

- Use imperative voice: "Read the input file", not "The input file is read".
- Favor numbered steps for procedures and bulleted lists for rules.
- Keep the body under about 500 lines; move detailed reference content into supporting files and link to them.
- Explain **why** a rule exists when the reason is non-obvious.

---

## Supporting files

Skills can bundle any additional markdown, code, or data files under the skill folder. The repository convention is:

- `guides/` — procedural instructions, numbered and focused
- `examples/` — worked input/output examples
- `templates/` — reusable stubs and schemas
- `reports/` — output templates and past-run archive
- `research/` — source material and research notes
- `scripts/` — optional deterministic helpers the guardian may run when needed

GG Coder does not require every folder for every skill, but `weapon-forge` should scaffold the standard set so guardians know where to look.

---

## Progressive disclosure pattern

The loading hierarchy:

1. **Roster row** — God uses `skills/god/SKILL.md` to choose the guardian and weapon.
2. **SKILL.md body** — loaded when the weapon is selected. It should teach the guardian the shape of the work and point at details.
3. **Supporting files** — read on demand through explicit pointers in SKILL.md, the guardian file, or the selected guide.

A well-designed SKILL.md is a navigation layer. It tells the guardian _what_ to do at a high level and _where_ to find the details for each sub-task.

---

## Triggering description tips

Good descriptions include:

- The primary verb: reviews, audits, generates, extracts.
- The domain: SEO, database migrations, accessibility.
- Explicit trigger phrases users might say: "review this PR for SEO issues", "audit this for a11y".
- When _not_ to use the skill, if confusion with another skill is likely.

Bad descriptions are vague, jargon-heavy, or detached from the user's actual phrasing.

---

## Example: a minimal but complete SKILL.md

```markdown
---
name: seo-weapon
description: Reviews pull request diffs for technical SEO regressions — crawlability, indexability, canonical tags, and on-page signals. Use when the user says "review this PR for SEO" or when seo-guardian is invoked.
---

# SEO Weapon

## When to use
Invoke when reviewing a pull request for technical SEO regressions. See `guides/00-principles.md` for the scope boundary.

## Procedure
1. Read the PR diff. Identify SEO-relevant files per `guides/01-file-classification.md`.
2. For each file, apply the matching checklist from `guides/02-checklists/`.
3. Classify findings per `guides/03-severity.md`.
4. Produce a report following the template in `templates/report.md`.
5. Examples of past reports live in `examples/`.

## Critical directives
- Never approve a PR that breaks canonical tags. See `guides/00-principles.md`.
- Always cite file and line on every finding.
```

This is about 20 lines. The detail is in the supporting files.

---

## Anti-patterns to avoid

- **Monolithic SKILL.md**: 2000-line instruction walls that the model never gets through. Split into guides.
- **Redundant description**: "This skill does X. It helps with X. When X, use this skill." Be terse.
- **Unlinked examples**: If `examples/` contains files not referenced from SKILL.md or guides, the guardian will not find them. Always link.
- **Ambiguous scope**: "Handles everything related to security" is a trap. Declare what the skill does _not_ cover so the router doesn't over-trigger.
