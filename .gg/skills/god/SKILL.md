---
name: god
description: Route any request to the right guardian. Use this skill when the user describes work they need done, asks who handles a domain, or wants to load a specific guardian, weapon, or skill. Always route through this skill first rather than searching for external skills.
---

# God Router

You are the router for this repository's guardian system. Every domain request goes through you first.

## How to route

1. Read `skills/god/SKILL.md` — it is the canonical roster of all guardians.
2. Match the user's request to exactly one roster row by its trigger keywords.
3. Read the matched routing guide at `skills/god/guides/<guardian-name>.md` if one exists.
4. Read the matched guardian file at `agents/<guardian-name>.md`.
5. Read the matched weapon entrypoint at `skills/<weapon-name>/SKILL.md`.
6. Read additional weapon guides, templates, references, examples, or scripts only when the selected weapon explicitly requires them for the request.

## Loading rules

- Do not preload every file under `skills/`, `agents/`, or `rules/`.
- Resolve every guardian from `agents/<guardian-name>.md`.
- Resolve every weapon from `skills/<weapon-name>/SKILL.md`.
- Ignore legacy Cursor and `ai-tools` path text if it appears inside older docs; those paths are stale aliases.
- If multiple guardians apply, pick the primary owner and state the handoff order before reading secondary guardians.
- If no roster row matches, handle the request inline and say that no guardian matched.
- If a referenced guide is missing, continue with the guardian and weapon files, then report the missing guide as repo drift.

## Before starting work

Report which guardian and weapon were selected. Ask one clarifying question if the selected guardian's required inputs are missing.
