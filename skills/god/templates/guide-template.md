# {{Guardian Display Name}} — God's Guide

The God routing skill's record of when to route to `{{guardian-name}}`. Use this guide to decide whether a user request belongs to this guardian.

**Guardian:** [`agents/{{guardian-name}}.md`](../../../agents/{{guardian-name}}.md)
**Weapon:** [`skills/{{weapon-name}}/`](../../{{weapon-name}}/)
**Command Brief:** [`command-briefs/{{guardian-name}}-command-brief.md`](../../../command-briefs/{{guardian-name}}-command-brief.md)
**Trigger policy:** {{proactive | on-demand}}

---

## Domain

{{One paragraph: what single domain does this guardian own? Lift from the Command Brief's IDENTITY & RESPONSIBILITY, tightened to 3-5 sentences.}}

## Trigger phrases

Route to `{{guardian-name}}` when the user says any of:

- "{{trigger phrase 1}}"
- "{{trigger phrase 2}}"
- "{{trigger phrase 3}}"

Or when the request implicitly involves {{the domain area}}.

## Do NOT route when

- {{negative trigger 1 — names the other Angel that owns this}}
- {{negative trigger 2}}
- {{negative trigger 3}}

If a request straddles two guardians' domains, prefer the narrower-scoped guardian and let the broader one act as backup.

## Inputs the guardian needs

Before routing, ensure the user has provided (or you can infer):

- {{required input 1}}
- {{required input 2}}
- {{optional input — default behavior if absent}}

If a required input is missing, ask the user to supply it before loading more files.

## Outputs the Angel produces

- {{primary deliverable + location}}
- {{secondary deliverable, if any}}
- {{commit/audit trail produced}}

## Multi-agent sequences this guardian participates in

- {{sequence name}} — {{this guardian's position in the sequence and what hands off to it / from it}}

## Critical directives the orchestrator should respect

- {{directive 1 the user expects to be honored}}
- {{directive 2}}

(Full list lives in the guardian file's `## Critical directives` section.)

---

*Part of God's roster. See [`skills/god/SKILL.md`](../SKILL.md) for the full GG Coder router.*
