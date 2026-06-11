# The Notorious Avengers

A shared library of **agents**, **skills**, and **rules** for the whole crew to use while vibe coding.

Please do not share this outside of The Notorious Avengers.

## What this is

This repo is the team arsenal. Instead of every person re-explaining the same standards to their AI agent on every project, we keep the standards here once and everyone pulls from the same source. Drop these into Cursor (or any agent that reads `.cursor/skills` and `agents/`) and your AI stops guessing. It already knows how we do auth, how we write a PRD, how we ship a Stripe flow, and what a clean PR looks like.

Three building blocks, and they work together:

- **Guardians** (`agents/`) are the specialists. Each one owns a single domain and knows exactly when to step in and when to hand off. A guardian is the "who" that shows up to do the work.
- **Weapons** (`skills/`) are the deep reference each guardian carries. The guardian is the operator, the weapon is the full playbook, templates, examples, and research it reads before acting. Every guardian is paired with its weapon below.
- **Rules** (`rules/`) are the non-negotiables that apply across every guardian and every repo. Voice, planning discipline, and work boundaries.

The split matters: the guardian decides, the weapon informs, the rules constrain. Keep them separate and you can swap or upgrade a weapon without rewriting the operator, and tighten a rule once instead of in eighty places.

## How to use it while vibe coding

1. Point your agent at this repo, or copy `agents/`, `skills/`, and `rules/` into your project.
2. Describe what you want in plain language. "Set up auth," "audit this branch for security," "write a PRD for X," "fix my Lighthouse score."
3. The matching guardian fires, reads its weapon, and does the work to our standard. Most guardians also tell you which other guardian to call next, so the handoffs are automatic.

Two guardians are meant to run near the end of every implementation: `security-guardian` does the security pass, then `quality-guardian` checks the build against its plan. Run them in that order.

## The rules

| Rule | What it enforces |
| --- | --- |
| [`no-em-dashes.mdc`](rules/no-em-dashes.mdc) | Writing reads like a human wrote it. No em-dashes anywhere. |
| [`plan-construction-protocol.mdc`](rules/plan-construction-protocol.mdc) | How agents build a plan before they touch code, so work is scoped before it starts. |
| [`respect-agent-work-boundaries.mdc`](rules/respect-agent-work-boundaries.mdc) | Guardians stay in their lane and hand off instead of trampling another guardian's domain. |

## The roster

Every guardian, its paired weapon, and what it does. Grouped so you can find the right one fast.

### Code and architecture

| Guardian | Weapon | What it does |
| --- | --- | --- |
| [react-guardian](agents/react-guardian.md) | [react-weapon](skills/react-weapon/) | React 18/19 architecture: Server Components, Suspense, Actions, state layering, data-fetching boundaries, and performance discipline. Reviews diffs and proposes refactors. |
| [preact-guardian](agents/preact-guardian.md) | [preact-weapon](skills/preact-weapon/) | Preact 11 specialist: signals, preact/compat migration from React, embeddable widgets, and Astro/Fresh island integration. |
| [python-guardian](agents/python-guardian.md) | [python-weapon](skills/python-weapon/) | Django, Django Ninja, FastAPI, Celery, and pytest. Polices ORM N+1s, migrations, type adoption, and the decoupled Django + React API contract. |
| [db-guardian](agents/db-guardian.md) | [db-weapon](skills/db-weapon/) | PostgreSQL data architecture: schema design, indexing, zero-downtime migrations, ORM choice, and serverless DB platform selection. |
| [auth-guardian](agents/auth-guardian.md) | [auth-weapon](skills/auth-weapon/) | End-to-end authentication: provider selection, Google OAuth flows, MFA and passkeys, RBAC, and B2B SSO. |
| [devops-guardian](agents/devops-guardian.md) | [devops-weapon](skills/devops-weapon/) | Container builds and CI/CD for Node/Next.js: Dockerfile hygiene, Compose, GitHub Actions security, Depot acceleration, and image scanning. |
| [security-guardian](agents/security-guardian.md) | [security-weapon](skills/security-weapon/) | Security audit and remediation for the JS/TS/Node stack. Carries 2025-2026 vulnerability catalogs plus playbooks. Runs second-to-last in every plan. |
| [quality-guardian](agents/quality-guardian.md) | [quality-weapon](skills/quality-weapon/) | QA reviewer that audits a finished implementation against its source PRD or IRD and files a structured findings report. Runs last. |
| [code-review-pr-guardian](agents/code-review-pr-guardian.md) | [code-review-pr-weapon](skills/code-review-pr-weapon/) | PR culture and lifecycle: description structure, review checklists, PR size limits, and the blocker/suggestion/nit comment taxonomy. |
| [code-forensics-guardian](agents/code-forensics-guardian.md) | [code-forensics-weapon](skills/code-forensics-weapon/) | Forensic investigation of dev and agency engagements for fee-clawback and breach claims. Produces an 11-document evidence packet from the paper trail. |
| [http-rest-fundamentals-guardian](agents/http-rest-fundamentals-guardian.md) | [http-rest-fundamentals-weapon](skills/http-rest-fundamentals-weapon/) | HTTP and REST protocol authority: method safety, status-code honesty, headers, CORS, conditional requests, and Fielding-constraint compliance. |
| [estimation-guardian](agents/estimation-guardian.md) | [estimation-weapon](skills/estimation-weapon/) | Estimation and forecasting: story points, T-shirt sizing, the NoEstimates debate, and Monte Carlo probabilistic delivery dates. |
| [terminal-bash-guardian](agents/terminal-bash-guardian.md) | [terminal-bash-weapon](skills/terminal-bash-weapon/) | Terminal productivity: Bash/Zsh/Fish config, modern CLI tools, shell scripting, dotfiles, tmux/Zellij, and just/make automation. |
| [cron-scheduling-guardian](agents/cron-scheduling-guardian.md) | [cron-scheduling-weapon](skills/cron-scheduling-weapon/) | Scheduled jobs: cron expression authoring, platform limits, exactly-once execution, timezone and DST safety, and "did the cron run?" observability. |

### Git and repository health

| Guardian | Weapon | What it does |
| --- | --- | --- |
| [git-guardian](agents/git-guardian.md) | [git-weapon](skills/git-weapon/) | Git mastery: interactive rebase, conflict resolution, history rewriting, reflog recovery, worktrees, hooks, and submodules vs subtrees. |
| [branching-strategy-guardian](agents/branching-strategy-guardian.md) | [branching-strategy-weapon](skills/branching-strategy-weapon/) | Branching model selection (trunk-based, GitHub Flow, GitFlow), the merge-vs-rebase call, and feature-flag vs feature-branch decisions. |
| [github-repo-health-guardian](agents/github-repo-health-guardian.md) | [github-repo-health-weapon](skills/github-repo-health-weapon/) | Repo hygiene audit: branch protection rulesets, commit quality, CODEOWNERS, issue and PR templates, and repository settings. |
| [dependency-audit-guardian](agents/dependency-audit-guardian.md) | [dependency-audit-weapon](skills/dependency-audit-weapon/) | Supply-chain hygiene: scanner selection, vulnerability triage, SBOM generation, lockfile discipline, and provenance verification. |

### Frontend, UI, and design

| Guardian | Weapon | What it does |
| --- | --- | --- |
| [ux-ui-guardian](agents/ux-ui-guardian.md) | [ux-ui-weapon](skills/ux-ui-weapon/) | Enforces a product's design system from its source of truth: tokens, utilities, components, screens, plus shadcn, Mantine, and Framer Motion integration. |
| [design-system-guardian](agents/design-system-guardian.md) | [design-system-weapon](skills/design-system-weapon/) | Bootstraps a complete design system from scratch: brief, tokens, utilities, component and screen specs, and HTML examples. |
| [dark-mode-theming-guardian](agents/dark-mode-theming-guardian.md) | [dark-mode-theming-weapon](skills/dark-mode-theming-weapon/) | Dark-mode and theming for React/Next.js: CSS variable tokens, next-themes wiring, flash-of-wrong-theme prevention, and white-label swaps. |
| [icon-system-guardian](agents/icon-system-guardian.md) | [icon-system-weapon](skills/icon-system-weapon/) | Icon systems: library selection, tree-shake vs sprite delivery, dynamic-import-by-name, custom SVG wrappers, and the accessibility contract. |
| [image-optimization-guardian](agents/image-optimization-guardian.md) | [image-optimization-weapon](skills/image-optimization-weapon/) | Image delivery for React/Next.js: AVIF/WebP selection, responsive srcset, blur placeholders, and next/image remote patterns. |
| [font-loading-guardian](agents/font-loading-guardian.md) | [font-loading-weapon](skills/font-loading-weapon/) | The font loading pipeline: font-display strategy, preload correctness, variable-font subsetting, next/font, and CLS-from-swap elimination. |
| [typography-font-guardian](agents/typography-font-guardian.md) | [typography-font-weapon](skills/typography-font-weapon/) | Typography craft: variable fonts, the FOIT/FOUT story, fluid type scales via clamp(), vertical rhythm, and type-token architecture. |
| [modal-toast-dialog-guardian](agents/modal-toast-dialog-guardian.md) | [modal-toast-dialog-weapon](skills/modal-toast-dialog-weapon/) | Accessible overlays for React: picking the right primitive, the six-point accessible-modal contract, and the toast-vs-notification taxonomy. |
| [product-tour-onboarding-ui-guardian](agents/product-tour-onboarding-ui-guardian.md) | [product-tour-onboarding-ui-weapon](skills/product-tour-onboarding-ui-weapon/) | In-app tours and onboarding UI: tool selection, tooltip and checklist components, segment triggers, and a tour-maintenance protocol that survives deploys. |
| [csv-xlsx-import-export-guardian](agents/csv-xlsx-import-export-guardian.md) | [csv-xlsx-import-export-weapon](skills/csv-xlsx-import-export-weapon/) | The "upload your spreadsheet" surface: CSV/XLSX parse, streaming large files, column-mapping wizards, row validation, and CSV-injection prevention. |
| [markdown-mdx-content-pipeline-guardian](agents/markdown-mdx-content-pipeline-guardian.md) | [markdown-mdx-content-pipeline-weapon](skills/markdown-mdx-content-pipeline-weapon/) | Markdown/MDX from source to output: compiler selection, remark and rehype chains, syntax highlighting, math and diagram embedding, and XSS sanitization. |

### Performance and SEO

| Guardian | Weapon | What it does |
| --- | --- | --- |
| [seo-aeo-guardian](agents/seo-aeo-guardian.md) | [seo-aeo-weapon](skills/seo-aeo-weapon/) | Next.js App Router SEO and Answer Engine Optimization: metadata, schema markup, E-E-A-T structure, Core Web Vitals, and optimizing for AI Overviews. |
| [lighthouse-pagespeed-guardian](agents/lighthouse-pagespeed-guardian.md) | [lighthouse-pagespeed-weapon](skills/lighthouse-pagespeed-weapon/) | Lighthouse and PageSpeed: local vs CI audits, score and performance budgets, custom plugins, and the lab-vs-field data gap. |

### Product and process

| Guardian | Weapon | What it does |
| --- | --- | --- |
| [agile-scrum-guardian](agents/agile-scrum-guardian.md) | [agile-scrum-weapon](skills/agile-scrum-weapon/) | Scrum coaching: audits whether you actually practice Scrum, runs the ceremonies, writes a Definition of Done, and diagnoses anti-patterns. |
| [kanban-flow-guardian](agents/kanban-flow-guardian.md) | [kanban-flow-weapon](skills/kanban-flow-weapon/) | Kanban method: WIP limit design, flow metrics, Little's Law diagnostics, board design, and cumulative-flow-diagram reading. |
| [retrospective-guardian](agents/retrospective-guardian.md) | [retrospective-weapon](skills/retrospective-weapon/) | Retro facilitation: format selection, the psychological-safety pre-check, a time-boxed plan, and follow-through on action items. |
| [okr-goal-setting-guardian](agents/okr-goal-setting-guardian.md) | [okr-goal-setting-weapon](skills/okr-goal-setting-weapon/) | OKRs: writes, grades, and iterates objectives and key results, enforces output-vs-input discipline, and adapts the framework for small teams. |
| [discovery-research-guardian](agents/discovery-research-guardian.md) | [discovery-research-weapon](skills/discovery-research-weapon/) | Continuous product discovery: Teresa Torres interview cadence, Opportunity Solution Trees, JTBD interviews, and prototype experiments. |
| [product-feedback-roadmap-guardian](agents/product-feedback-roadmap-guardian.md) | [product-feedback-roadmap-weapon](skills/product-feedback-roadmap-weapon/) | The feedback-to-roadmap loop: tool selection, status transitions, public vs private roadmaps, de-duplication, and RICE/ICE prioritization. |

### Docs and knowledge

| Guardian | Weapon | What it does |
| --- | --- | --- |
| [library-guardian](agents/library-guardian.md) | [library-weapon](skills/library-weapon/) | Owns the full docs lifecycle: scaffolds the `library/` folder, ingests issues into IRDs, generates feature PRDs, and reverse-engineers code into backwards-PRDs. |
| [knowledge-guardian](agents/knowledge-guardian.md) | [knowledge-weapon](skills/knowledge-weapon/) | Authors narrative knowledge docs: system overviews, auth-architecture diagrams, schema references, and coding standards. Owns `knowledge/`, never PRDs. |
| [wiki-guardian](agents/wiki-guardian.md) | [wiki-weapon](skills/wiki-weapon/) | Extracts code entities into atomic, backlinked wiki pages, infers ADRs from commit history, and runs a contradiction protocol when contracts change. |
| [asset-guardian](agents/asset-guardian.md) | [asset-weapon](skills/asset-weapon/) | Single owner of the Universal Asset Registry: the queryable, drift-auditable catalog of every UI primitive, route, content entry, and rollout binding. |
| [adr-writing-guardian](agents/adr-writing-guardian.md) | [adr-writing-weapon](skills/adr-writing-weapon/) | Architecture Decision Records: authors, supersedes, and audits ADRs in Nygard, MADR, and Y-statement formats with the "decisions, not docs" discipline. |
| [api-docs-guardian](agents/api-docs-guardian.md) | [api-docs-weapon](skills/api-docs-weapon/) | API reference docs: renderer selection, OpenAPI spec enrichment with examples, hosted deployment, SDK generation, and changelog discipline. |
| [docs-site-guardian](agents/docs-site-guardian.md) | [docs-site-weapon](skills/docs-site-weapon/) | Developer docs-site infrastructure: platform selection, the Diataxis content pyramid, docs-as-code CI, and search wiring. |
| [readme-writing-guardian](agents/readme-writing-guardian.md) | [readme-writing-weapon](skills/readme-writing-weapon/) | READMEs as landing pages, not manuals. Writes and audits READMEs in both the OSS and internal-tool registers. |
| [technical-writing-craft-guardian](agents/technical-writing-craft-guardian.md) | [technical-writing-craft-weapon](skills/technical-writing-craft-weapon/) | Writing-quality review: Diataxis, inverted-pyramid structure, code-example discipline, and the reader-lens diagnostic. |
| [runbook-writing-guardian](agents/runbook-writing-guardian.md) | [runbook-writing-weapon](skills/runbook-writing-weapon/) | Operational runbooks: break-fix and diagnostic templates, exact-command discipline, escalation paths, rollback standards, and game-day testing. |
| [changelog-release-notes-guardian](agents/changelog-release-notes-guardian.md) | [changelog-release-notes-weapon](skills/changelog-release-notes-weapon/) | Public changelogs and release notes: tool selection, impact-first copy, and multi-channel distribution. |
| [knowledge-base-help-center-guardian](agents/knowledge-base-help-center-guardian.md) | [knowledge-base-help-center-weapon](skills/knowledge-base-help-center-weapon/) | Customer-facing knowledge bases: platform selection, search-first architecture, AI deflection, versioning, and the content-gap loop. |

### Integrations and platform surfaces

| Guardian | Weapon | What it does |
| --- | --- | --- |
| [payments-guardian](agents/payments-guardian.md) | [payments-weapon](skills/payments-weapon/) | Stripe (non-Connect): Checkout, Payment Intents, Subscriptions, Customer Portal, and webhook processing. Owns money-flow correctness end to end. |
| [crm-integration-guardian](agents/crm-integration-guardian.md) | [crm-integration-weapon](skills/crm-integration-weapon/) | CRM connectivity for HubSpot, Salesforce, Pipedrive, and more: bi-directional sync, field mapping, dedupe, and native-API vs Merge.dev. |
| [slack-app-guardian](agents/slack-app-guardian.md) | [slack-app-weapon](skills/slack-app-weapon/) | Slack apps on the Bolt SDK: slash commands, modals, Events API, multi-workspace OAuth, and Marketplace submission. |
| [discord-bot-guardian](agents/discord-bot-guardian.md) | [discord-bot-weapon](skills/discord-bot-weapon/) | Discord bots with discord.js, discord.py, and Serenity: slash commands, components, voice, sharding, rate limits, and the 100-server verification gate. |
| [telegram-bot-guardian](agents/telegram-bot-guardian.md) | [telegram-bot-weapon](skills/telegram-bot-weapon/) | Telegram bots: Bot API, grammY and aiogram, webhook vs polling, Mini Apps initData validation, and Telegram Stars payments. |
| [live-chat-support-guardian](agents/live-chat-support-guardian.md) | [live-chat-support-weapon](skills/live-chat-support-weapon/) | Live chat surfaces (Intercom, Crisp, Plain, Pylon): widget integration, HMAC identity verification, routing, and AI deflection. |
| [customer-support-tooling-guardian](agents/customer-support-tooling-guardian.md) | [customer-support-tooling-weapon](skills/customer-support-tooling-weapon/) | The support stack: tool selection, shared inboxes, AI deflection, SLA tiers, escalation to Linear, and a founder-as-support playbook. |
| [status-page-guardian](agents/status-page-guardian.md) | [status-page-weapon](skills/status-page-weapon/) | Public status pages: platform selection, component-tree architecture, incident comms templates, subscriber notifications, and post-incident discipline. |
| [newsletter-platform-guardian](agents/newsletter-platform-guardian.md) | [newsletter-platform-weapon](skills/newsletter-platform-weapon/) | Newsletter as a channel: platform selection, embedded signup for Next.js, deliverability tradeoffs, monetization, and migrations. |

### AI and the cognitive layer

| Guardian | Weapon | What it does |
| --- | --- | --- |
| [mind-guardian](agents/mind-guardian.md) | [mind-weapon](skills/mind-weapon/) | The cognitive layer of the product: coach and agent routing, prompt cascade, RAG/GraphRAG, three-tier memory, observability, and evals. |
| [ai-coding-tools-guardian](agents/ai-coding-tools-guardian.md) | [ai-coding-tools-weapon](skills/ai-coding-tools-weapon/) | The vibe-coder's tool advisor: recommends and configures Cursor, Claude Code, Aider, Cline, Windsurf, and more across autonomy tiers. |
| [ai-tools-platform-guardian](agents/ai-tools-platform-guardian.md) | [ai-tools-platform-weapon](skills/ai-tools-platform-weapon/) | The AI toolbox: gateways, cloud providers, model selection, cheap-fallback routes, local LLMs, GPU cloud, and must-have MCP servers. |
| [cursor-ide-guardian](agents/cursor-ide-guardian.md) | [cursor-ide-weapon](skills/cursor-ide-weapon/) | Cursor IDE platform: project rules, MCP server registration and tool authoring, the SDK, custom modes, and Cloud Agents. |

### Growth, marketing, and sales

| Guardian | Weapon | What it does |
| --- | --- | --- |
| [blogging-content-strategy-guardian](agents/blogging-content-strategy-guardian.md) | [blogging-content-strategy-weapon](skills/blogging-content-strategy-weapon/) | Editorial blog strategy: cluster and pillar topical authority, intent-based length, title and meta craft, AEO formatting, and publishing cadence. |
| [social-media-marketing-organic-guardian](agents/social-media-marketing-organic-guardian.md) | [social-media-marketing-organic-weapon](skills/social-media-marketing-organic-weapon/) | Genuine organic social for solo founders and small teams: platform selection, authentic voice, build-in-public, and realistic content calendars. |
| [alt-ads-platforms-guardian](agents/alt-ads-platforms-guardian.md) | [alt-ads-platforms-weapon](skills/alt-ads-platforms-weapon/) | Paid acquisition beyond Meta and Google: LinkedIn, TikTok, Reddit, Microsoft, Pinterest, Quora, YouTube, and Spotify, picked by ICP fit. |
| [cold-outreach-guardian](agents/cold-outreach-guardian.md) | [cold-outreach-weapon](skills/cold-outreach-weapon/) | Outbound cold email: tool selection, deliverability and domain warmup, sequence design, AI personalization without slop, and list hygiene. |
| [review-funnels-g2-guardian](agents/review-funnels-g2-guardian.md) | [review-funnels-g2-weapon](skills/review-funnels-g2-weapon/) | Review collection and reputation: G2, Capterra, Trustpilot, and Product Hunt profiles, request UX, incentive compliance, and badge deployment. |
| [affiliate-referral-program-guardian](agents/affiliate-referral-program-guardian.md) | [affiliate-referral-program-weapon](skills/affiliate-referral-program-weapon/) | Affiliate and referral programs: platform selection, attribution in the post-cookie era, payout automation, fraud detection, and program economics. |

### Business, operations, and legal

| Guardian | Weapon | What it does |
| --- | --- | --- |
| [incorporation-startup-stack-guardian](agents/incorporation-startup-stack-guardian.md) | [incorporation-startup-stack-weapon](skills/incorporation-startup-stack-weapon/) | Company formation: platform selection, entity type, EIN, startup banking, early bookkeeping, and the critical 83(b) election. |
| [investor-cap-table-guardian](agents/investor-cap-table-guardian.md) | [investor-cap-table-weapon](skills/investor-cap-table-weapon/) | Cap tables and fundraising paperwork: platform selection, SAFEs, term-sheet mechanics, 409A, option pools, vesting, and data-room prep. |
| [hr-payroll-guardian](agents/hr-payroll-guardian.md) | [hr-payroll-weapon](skills/hr-payroll-weapon/) | HR and payroll: domestic platform selection, international contractor and EOR, the W-2/1099/EOR/PEO matrix, and equity-admin handoff. |
| [hiring-ats-guardian](agents/hiring-ats-guardian.md) | [hiring-ats-weapon](skills/hiring-ats-weapon/) | Applicant Tracking Systems: platform selection, pipeline-stage design, scorecard calibration, D&I reporting, and the ATS-to-HRIS handoff. |
| [legal-docs-guardian](agents/legal-docs-guardian.md) | [legal-docs-weapon](skills/legal-docs-weapon/) | SaaS legal docs: Terms, Privacy Policy, DPA, MSA, and Cookie Notice via the template-plus-lawyer-review path, with GDPR and CCPA postures. |
| [app-store-submission-guardian](agents/app-store-submission-guardian.md) | [app-store-submission-weapon](skills/app-store-submission-weapon/) | App store publication for iOS and Android: ASO, privacy compliance, rejection diagnosis, age ratings, IAP setup, and realistic timelines. |

### Build a whole thing

| Guardian | Weapon | What it does |
| --- | --- | --- |
| [website-guardian](agents/website-guardian.md) | [website-weapon](skills/website-weapon/) | Builds a production-grade SvelteKit + Payload CMS + Supabase site end to end from a brief, applying a 12-phase site-template playbook. |

## The Factory

New guardians are not hand-written one at a time. They come off a pipeline, the Legion AI Tools Factory. You hand it a domain and it forges a fully-paired guardian and weapon, researched and registered.

| Stage | Agent | Role |
| --- | --- | --- |
| Propose | [big-bang-space](agents/big-bang-space.md) | Queues a brand new guardian proposal. Reads the [big-bang-earth](skills/big-bang-earth/) skill before authoring. |
| Research | [scripture-historian](agents/scripture-historian.md) | Phase 1.5. Runs a depth-calibrated, time-bounded literature sweep and fills the new weapon's `research/` folder. Research only, no weapon of its own. |
| Orchestrate | [gods-hand](agents/gods-hand.md) | Pulls one row from the queue and drives it through all five phases, moving the row before it does any work. Carries [gods-hand-weapon](skills/gods-hand-weapon/). |

The build phases it dispatches live as skills: [command-center](skills/command-center/) writes the Command Brief, [weapon-forge](skills/weapon-forge/) forges the skill, [angel-creator](skills/angel-creator/) writes the guardian file, [god-registrar](skills/god-registrar/) registers it, and [god](skills/god/) is the routing roster that decides which guardian to call.

## Repo layout

```
agents/             the guardians, one markdown file each
skills/             the weapons, one folder each (SKILL.md plus guides, examples, research, templates)
rules/              the cross-cutting non-negotiables
scripts/            standardize-library tooling
_library-template/  the canonical library/ folder a guardian scaffolds into a new repo
```

## Contributing

Adding a guardian by hand is fine, but the Factory is the paved road. Propose it with `big-bang-space`, let `gods-hand` run it through, and it lands fully paired and registered. Whatever you add, keep the guardian and its weapon in sync, stay inside the rules, and do not share any of this outside The Notorious Avengers.
