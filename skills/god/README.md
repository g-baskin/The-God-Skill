# God

The master routing skill for the GG Coder setup in this repository.

God does not perform work. It routes GG Coder's tasks to the correct guardian and paired weapon, while keeping the context load small.

## Entry points

- [`.gg/skills/god/SKILL.md`](../../.gg/skills/god/SKILL.md) — the GG Coder shim that lazy-loads this router.
- [`SKILL.md`](./SKILL.md) — the canonical routing roster.

## Roster

Each Angel has a dedicated, in-depth guide:

- [`guides/asset-guardian.md`](guides/asset-guardian.md)
- [`guides/auth-guardian.md`](guides/auth-guardian.md)
- [`guides/db-guardian.md`](guides/db-guardian.md)
- [`guides/design-system-guardian.md`](guides/design-system-guardian.md)
- [`guides/devops-guardian.md`](guides/devops-guardian.md)
- [`guides/library-guardian.md`](guides/library-guardian.md)
- [`guides/mind-guardian.md`](guides/mind-guardian.md)
- [`guides/payments-guardian.md`](guides/payments-guardian.md)
- [`guides/quality-guardian.md`](guides/quality-guardian.md)
- [`guides/react-guardian.md`](guides/react-guardian.md)
- [`guides/security-guardian.md`](guides/security-guardian.md)
- [`guides/seo-aeo-guardian.md`](guides/seo-aeo-guardian.md)
- [`guides/ux-ui-guardian.md`](guides/ux-ui-guardian.md)

## Adding new guardians

The Factory forges new guardians end to end. To register a new guardian with God after the Factory has produced the artifacts:

1. Add the guardian to the roster table in [`SKILL.md`](./SKILL.md).
2. Author a new guide under [`guides/`](./guides/) using [`templates/guide-template.md`](./templates/guide-template.md).
3. Update the multi-agent orchestration section in `SKILL.md` if the new guardian fits an existing sequence.

## Philosophy

See [`references/philosophy.md`](./references/philosophy.md) for the rationale behind routing over generalization.

---

*Part of The Notorious Avengers shared agent, skill, and rule library.*
