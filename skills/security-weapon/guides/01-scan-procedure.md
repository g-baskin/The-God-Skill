# 01 — Scan Procedure (Phase 1)

The systematic sweep that must precede triage. Work top to bottom. Each step cites the pattern catalog entry it maps to.

Sources: `research/2026-04-24-semgrep-tooling.md`, `research/cve-watchlist.md`.

---

## Step 0 — Run `scripts/scan.sh`

Execute before anything else. It populates a local ephemeral scratch dir (e.g., `.scan-output/`, gitignored) with:

- `npm-audit.json`
- `cve-version-check.txt` (Next.js + React from `package-lock.json` vs. watchlist)
- `unicode-scan.txt` (rules-file backdoor)
- `grep-findings.txt` (regex sweeps)

Read the outputs. Every regex hit is a lead, not a finding — you must confirm by reading the file.

---

## Step 1 — Version gate (CVE-2025-29927 + CVE-2025-55182)

From `package-lock.json`, resolve:

- `next` — must be ≥14.2.25 on 14.x, ≥15.2.3 on 15.x.
- `react` / `react-dom` — must be ≥19.0.1 on 19.0.x, ≥19.1.2 on 19.1.x, ≥19.2.1 on 19.2.x.

If either fails: **Critical**. Remediation = `pnpm up` / `npm install` to patched version, re-run type-check, re-run test suite. No other remediation is needed to clear the CVE, but document version before/after in the report.

Guide cross-refs: `guides/02-vibe-coding-patterns.md` A2, A3; `guides/06-cve-tracker.md`.

---

## Step 2 — Rules-file backdoor scan

Glob: `rules/**/*.{md,mdc,txt}`, `.gg/**/*.{md,mdc,txt}`, `AGENTS.md`, `CLAUDE.md`, `.github/copilot-instructions.md`, plus legacy Cursor rule files if present.

Search each for zero-width / bidi codepoints (U+200B-200F, U+202A-202E, U+2060-2069, U+FEFF). Any hit = **Critical**, silent supply-chain backdoor.

Remediation: delete the compromised file, audit `git log` to find when the codepoints were introduced, invalidate any tokens or secrets the compromised rules may have exfiltrated.

Guide cross-ref: `guides/02-vibe-coding-patterns.md` A4. Research: `research/2026-04-24-rules-file-backdoor.md`.

---

## Step 3 — Environment configuration

Files: `.env`, `.env.local`, `.env.production`, `.env*`.

Checklist:

- [ ] Any `NEXT_PUBLIC_*` variable whose name includes `key`, `secret`, `token`, `password`, or whose value matches `sk_live_*`, `sk_test_*`, a JWT-shaped string, or a DB connection string → **Critical**. Leaked in the client bundle.
- [ ] `.env*` files committed to git (`git ls-files | grep -E '^\.env'`) → **Critical**. Rotate secrets, add to `.gitignore`, force-push removal.
- [ ] Hardcoded secrets in source files — search `src/**` for strings matching `sk_live_`, `-----BEGIN`, long Base64-looking constants in auth-adjacent code.

Guide cross-ref: `guides/04-pii-and-financial.md` C1.

---

## Step 4 — Security headers & CORS

File: `next.config.js` (or `next.config.mjs` / `next.config.ts`).

Required in the `headers()` export (or in `middleware.ts` CSP nonce flow):

- [ ] `Strict-Transport-Security`
- [ ] `X-Content-Type-Options: nosniff`
- [ ] `X-Frame-Options: DENY` (or CSP `frame-ancestors 'none'`)
- [ ] `Referrer-Policy: strict-origin-when-cross-origin`
- [ ] `Content-Security-Policy` with no `'unsafe-inline'` in script-src

Also check CORS. `Access-Control-Allow-Origin: '*'` combined with `Access-Control-Allow-Credentials: true` = **High**. Wildcard with credentials is invalid per spec and creates CSRF vectors.

Guide cross-ref: `guides/03-owasp-top-10.md` B5. Research: `research/2026-04-24-nextjs-security-headers.md`.

---

## Step 5 — Middleware vs. per-route auth (CVE-2025-29927 follow-up)

File: `middleware.ts` / `middleware.js`.

If middleware performs auth (`if (!session) return NextResponse.redirect(...)`), **every** protected route handler in `app/api/**` and server action in `app/actions/**` must independently call `auth()` / `verifySession()`. The middleware header bypass (`x-middleware-subrequest`) makes middleware-only auth insufficient.

For each route handler file, confirm an identity check exists within the first few lines. Flag handlers that have no identity check as **Critical** (auth bypass).

Guide cross-ref: `guides/02-vibe-coding-patterns.md` A2. Research: `research/2026-04-24-cve-2025-29927-middleware-bypass.md`.

---

## Step 6 — Route handlers — per-file pass

Files: `app/api/**/*.{ts,tsx}`, `pages/api/**/*.{ts,tsx}`.

For each handler, check:

- [ ] **Authentication:** is there an identity check? If not → **Critical**.
- [ ] **Authorization (IDOR):** if the handler accepts an ID param, does it verify `session.user.id === resource.ownerId` OR `session.user.role === 'admin'`? If not → **High**. See `examples/high-idor-finding.md`.
- [ ] **Injection:** any `db.query(template-literal)`, `connection.query(... + ...)`, `.find({ field: req.body.x })` without `$eq`, `child_process.exec(template-literal)` → **High**. See `guides/03-owasp-top-10.md` B1.
- [ ] **Error disclosure:** `res.status(500).json({ error: err.message, stack: err.stack })` → **Medium**. See `examples/low-verbose-error.md` (body has the Medium/Low split).
- [ ] **PII in logs:** `console.log(user)` or `Sentry.captureException(err, { contexts: { ... PII } })` → **High** if PII present.

---

## Step 7 — Server Actions

Files: `app/actions/**/*.ts`, and any `'use server'` function body in components.

For each, check:

- [ ] `auth()` / `verifySession()` invoked inside the action. Origin validation alone is not enough (see `research/2026-04-24-server-actions-csrf.md`).
- [ ] Input validated with Zod `.strict()` (or equivalent) — mitigates prototype pollution and type coercion.
- [ ] No secrets or PII echoed back to the caller via return value.

Missing auth → **High**. Missing Zod strict → **Medium** unless the shape is user-trusted inside (e.g., merges into a DB record), then **High**.

---

## Step 8 — Server Components & data serialization

Files: `app/**/page.tsx`, `app/**/layout.tsx`, any `async function Component(...)` not marked `'use client'`.

Check: does the server component pass an ORM model object (full `User`, `Order`, etc.) to a `'use client'` child? Server Component return values are serialized into the JS bundle and sent to the browser.

Pattern: `<ClientComp user={user} />` where `user` came from `db.user.findUnique()` → **High**. Fix: build an explicit DTO with only the fields needed.

Guide cross-ref: `guides/04-pii-and-financial.md` C8.

---

## Step 9 — Components with user input

Files: `src/components/**/*.tsx`, `app/**/*.tsx`.

Checklist:

- [ ] `dangerouslySetInnerHTML={{ __html: x }}` — if `x` is any value that may derive from user input, flag **High** and verify DOMPurify wraps it. See `guides/05-remediation-playbooks.md`.
- [ ] `localStorage.setItem(`, `sessionStorage.setItem(` — if the stored payload contains `ssn`, `email`, `phone`, `cardToken`, `password`, any auth-related string → **High**. See `guides/04-pii-and-financial.md` C6.
- [ ] `eval(`, `new Function(` — **High** regardless of input.

---

## Step 10 — Payment handling

Any file importing `stripe`, `@stripe/stripe-js`, `@stripe/react-stripe-js`, or anything whose filename contains `payment`, `checkout`, `billing`.

Checklist:

- [ ] **No raw card fields in request bodies or DB:** search for `cardNumber`, `card_number`, `cvv`, `cvc`, `exp_month`, `exp_year`. Any hit → **Critical** (PCI DSS SAQ D). See `examples/critical-pci-violation.md`.
- [ ] **Stripe webhook handlers** call `stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)`. Missing → **Critical** (forged events).
- [ ] **Amounts calculated server-side:** if `req.body.totalPrice` or `req.body.amount` used directly → **High** (price manipulation).
- [ ] **Negative amounts rejected:** quantity/amount must be `> 0` at validation boundary.

Guide cross-ref: `guides/04-pii-and-financial.md` C5. Research: `research/2026-04-24-stripe-pci-dss.md`.

---

## Step 11 — GraphQL (if present)

Files: `src/graphql/**`, `schema.graphql`, any `buildSchema`, `makeExecutableSchema` call.

Checklist:

- [ ] Every resolver returning sensitive fields (`email`, `phone`, `ssn`, `bankAccount`, `internalNotes`) has a role/ownership check in the resolver body or a `graphql-shield` directive applied.
- [ ] No `@skipAuth` / `@public` directives on resolvers returning sensitive fields.

Missing field-level auth → **High**. See `guides/04-pii-and-financial.md` C7.

---

## Step 12 — Database schema / migrations

Files: `prisma/schema.prisma`, `drizzle/**`, `migrations/**`, `supabase/migrations/**`.

Checklist:

- [ ] No plaintext columns named `password`, `ssn`, `card_number`, `cvv`, `private_key`. Passwords → bcrypt/argon2 hash only. Card data → must not exist (Stripe token instead). SSN → encrypted at rest (envelope encryption) or hashed depending on use-case.
- [ ] Multi-tenant tables include a `tenantId` / `organizationId` column AND a RLS policy (Supabase/Postgres) OR an explicit filter in every query.

Plaintext sensitive columns → **Critical**. Missing tenantId scope → **High**.

---

## Step 13 — Dependency review

Output from `npm audit --json --audit-level=high`:

- [ ] Any Critical vulnerability → **Critical**. Upgrade to patched version.
- [ ] Any High vulnerability → **High**. Upgrade unless the advisory has an explicit "not exploitable in this usage" note.
- [ ] Recently-added packages with <100 weekly downloads → investigate for typosquatting / hallucinated-dependency risk. See `guides/02-vibe-coding-patterns.md` A5.

Guide cross-ref: `guides/03-owasp-top-10.md` B6 (A03:2025 Supply Chain Failures).

---

## Step 14 — GDPR / compliance smoke test

- [ ] `DELETE /api/user` endpoint exists AND performs hard delete (not just a `deletedAt` soft-delete). See `guides/04-pii-and-financial.md` C9.
- [ ] `GET /api/user/export` or equivalent portability endpoint exists.
- [ ] Logs have a retention policy (documented somewhere — README, runbook, infra config).

Missing each → **Medium**. **Critical** if the product is EU-exposed AND handles paid-tier personal data (brief rule).

---

## Step 15 — Sanity pass

Re-read your finding list. For each:

- Does it have a file path AND line number?
- Is the severity correct per the rubric in `guides/00-principles.md`?
- If Critical/High, is a remediation queued?

Then proceed to Phase 2 (triage) → Phase 3 (fix) → Phase 4 (report).

---

## Examples

- `examples/critical-pci-violation.md` — Step 10 worked case.
- `examples/high-idor-finding.md` — Step 6 IDOR worked case.
- `examples/medium-missing-header.md` — Step 4 worked case.
- `examples/low-verbose-error.md` — Step 6 error-disclosure worked case.
