# GG Coder Agent Specification Reference

This file summarizes the local conventions angel-creator uses to produce a valid guardian file for GG Coder routing in this repository.

---

## What a guardian agent is

A guardian agent is a specialized markdown instruction file that owns one domain and tells GG Coder when to route work to it.

The God router discovers guardians from `skills/god/SKILL.md`, then loads the matched file from `agents/<guardian-name>.md`.

---

## File location

```text
<repo-root>/agents/<guardian-name>.md
```

The filename must match the `name` frontmatter field.

---

## YAML frontmatter

Required fields:

- `name` — guardian identifier, matching the filename.
- `description` — the trigger description GG Coder uses to decide when the guardian owns a request.

Optional fields:

- `proactive` — `true` for guardians GG Coder may route to when their domain is touched, `false` for explicit-invocation agents.

---

## Body convention

Use this section order:

1. `# <Guardian Display Name>`
2. `## Identity & responsibility`
3. `## Paired Weapon`
4. `## Procedure`
5. `## Critical directives`
6. `## Escalation`
7. `## References to skill files`

The paired weapon path must be repo-local: `skills/<weapon-name>/SKILL.md`.

---

## GG Coder routing rules

- Do not point a guardian at legacy Cursor paths.
- Do not point a guardian at legacy `ai-tools/` paths.
- Use `agents/`, `skills/`, `rules/`, and `command-briefs/` paths from the repository root.
- Keep the guardian concise; push procedural depth into the paired weapon.
- Name every guide, template, example, script, and report shape the guardian should read before acting.

---

## Minimal example

```markdown
---
name: seo-guardian
description: SEO authority for Next.js pages, metadata, schema, and Core Web Vitals. Invoke for SEO audits, metadata fixes, structured data, crawlability, or search visibility regressions.
proactive: true
---

# SEO Guardian

## Identity & responsibility

`seo-guardian` owns search visibility for Next.js surfaces.

## Paired Weapon

[`skills/seo-weapon/`](../skills/seo-weapon/)

Read `skills/seo-weapon/SKILL.md` first.
```
