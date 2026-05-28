#!/usr/bin/env tsx
/**
 * standardize-library.ts
 *
 * Scaffolds and migrates a repository's library/ folder to schema v2.
 * See legion-shared/standards/library-schema-v2.md for the full spec.
 *
 * Usage (from legion-suite root):
 *   pnpm standardize-library --repository legion-cloud      one repo, scaffold/migrate
 *   pnpm standardize-library --all                          all legion-* repos + suite root
 *   pnpm standardize-library --repository legion-secure --dry-run  preview only
 *   pnpm standardize-library --all --no-sync               skip wiki sync at end
 *
 * Safety rules:
 *   - Never deletes a file (only moves/renames)
 *   - Only deletes a folder if it is empty after all moves
 *   - Refuses to overwrite an existing v2 file with different content (warns + skips)
 *   - --dry-run prints the full plan without touching disk
 */

import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const SUITE_ROOT = path.resolve(__dirname, "..");
const TEMPLATES_DIR = path.join(
  SUITE_ROOT,
  "legion-shared",
  "skills",
  "library-weapon",
  "templates"
);

const ALL_REPOS = [
  "legion-suite",     // library/ at repo root
  "legion-marketing",
  "legion-secure",
  "legion-code",
  "legion-website",
  "legion-cloud",
  "legion-shim",
  "legion-harness",
  "legion-shared",
  "legion-atlas",
  "legion-academy",
];

// Repos that don't have a library/ at all (fresh scaffold only)
const FRESH_REPOS = new Set(["legion-cloud", "legion-shim", "legion-harness"]);
// legion-shared is special: no library at all (uses standards/ folder)
const NO_LIBRARY_REPOS = new Set(["legion-shared"]);

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Action {
  type: "create_dir" | "write_readme" | "move_file" | "move_dir" | "delete_empty_dir";
  src?: string;
  dest?: string;
  template?: string;
  label: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function libRoot(repo: string): string {
  if (repo === "legion-suite") {
    return path.join(SUITE_ROOT, "library");
  }
  return path.join(SUITE_ROOT, repo, "library");
}

function tpl(name: string): string {
  return path.join(TEMPLATES_DIR, name);
}

function tplContent(name: string): string {
  const p = tpl(name);
  if (!fs.existsSync(p)) throw new Error(`Template not found: ${name}`);
  return fs.readFileSync(p, "utf-8");
}

function ensureDir(dir: string, actions: Action[], dryRun: boolean): void {
  if (!fs.existsSync(dir)) {
    actions.push({ type: "create_dir", dest: dir, label: `mkdir ${relPath(dir)}` });
    if (!dryRun) fs.mkdirSync(dir, { recursive: true });
  }
}

function writeReadme(
  dest: string,
  templateName: string,
  actions: Action[],
  dryRun: boolean
): void {
  const target = path.join(dest, "README.md");
  if (fs.existsSync(target)) return; // never overwrite existing README
  actions.push({
    type: "write_readme",
    dest: target,
    template: templateName,
    label: `write ${relPath(target)} (from ${templateName})`,
  });
  if (!dryRun) {
    ensureDir(dest, [], false);
    fs.writeFileSync(target, tplContent(templateName), "utf-8");
  }
}

function moveFile(src: string, dest: string, actions: Action[], dryRun: boolean): boolean {
  if (!fs.existsSync(src)) return false;
  if (fs.existsSync(dest)) {
    const srcContent = fs.readFileSync(src, "utf-8");
    const destContent = fs.readFileSync(dest, "utf-8");
    if (srcContent !== destContent) {
      console.warn(`  [WARN] Skipping move — destination exists with different content:`);
      console.warn(`         src:  ${relPath(src)}`);
      console.warn(`         dest: ${relPath(dest)}`);
      return false;
    }
    return true; // already at destination with same content
  }
  actions.push({ type: "move_file", src, dest, label: `move ${relPath(src)} -> ${relPath(dest)}` });
  if (!dryRun) {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.renameSync(src, dest);
  }
  return true;
}

function moveDir(srcDir: string, destDir: string, actions: Action[], dryRun: boolean): void {
  if (!fs.existsSync(srcDir)) return;
  const files = walkAll(srcDir);
  for (const rel of files) {
    const s = path.join(srcDir, rel);
    const d = path.join(destDir, rel);
    moveFile(s, d, actions, dryRun);
  }
  // After moves, attempt to delete empty source dirs
  tryDeleteEmpty(srcDir, actions, dryRun);
}

function tryDeleteEmpty(dir: string, actions: Action[], dryRun: boolean): void {
  if (!fs.existsSync(dir)) return;
  // Walk bottom-up and delete only empty dirs
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    if (e.isDirectory()) tryDeleteEmpty(path.join(dir, e.name), actions, dryRun);
  }
  const remaining = fs.readdirSync(dir);
  if (remaining.length === 0) {
    actions.push({ type: "delete_empty_dir", dest: dir, label: `rmdir (empty) ${relPath(dir)}` });
    if (!dryRun) fs.rmdirSync(dir);
  }
}

function walkAll(dir: string, base = dir): string[] {
  if (!fs.existsSync(dir)) return [];
  const result: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      result.push(...walkAll(full, base));
    } else {
      result.push(path.relative(base, full));
    }
  }
  return result;
}

function relPath(p: string): string {
  return path.relative(SUITE_ROOT, p).replace(/\\/g, "/");
}

// ---------------------------------------------------------------------------
// v1 -> v2 migration helpers
// ---------------------------------------------------------------------------

/** Convert "feature-007-user-export" to "prd-007-user-export" */
function featureSlugToPrd(slug: string): string {
  return slug.replace(/^feature-/, "prd-");
}

/** Convert "issue-042-stale-cache" to "ird-042-stale-cache" */
function issueSlugToIrd(slug: string): string {
  return slug.replace(/^issue-/, "ird-");
}

/**
 * Convert old PRD main filename to new index filename.
 * "prd-feature-007-user-export.md" -> "prd-007-user-export-index.md"
 * Also handles already-converted "prd-007-user-export.md" -> "prd-007-user-export-index.md"
 */
function prdFilenameToIndex(filename: string, newFolderSlug: string): string {
  // If it already ends with -index.md, done
  if (filename.endsWith("-index.md")) return filename;
  // Strip old prefixes and extension, build canonical name
  return `${newFolderSlug}-index.md`;
}

/** Convert "ird-issue-042-stale-cache.md" -> "ird-042-stale-cache-index.md" */
function irdFilenameToIndex(filename: string, newFolderSlug: string): string {
  if (filename.endsWith("-index.md")) return filename;
  return `${newFolderSlug}-index.md`;
}

// ---------------------------------------------------------------------------
// Scaffold v2 structure
// ---------------------------------------------------------------------------

function scaffoldV2(lib: string, actions: Action[], dryRun: boolean): void {
  // Top-level folders
  const dirs = [
    [lib, "library-README.md"],
    [path.join(lib, "knowledge"), "knowledge-README.md"],
    [path.join(lib, "knowledge", "public"), "knowledge-public-README.md"],
    [path.join(lib, "knowledge", "public", "overview"), null],
    [path.join(lib, "knowledge", "public", "guides"), null],
    [path.join(lib, "knowledge", "public", "faqs"), null],
    [path.join(lib, "knowledge", "private"), "knowledge-private-README.md"],
    [path.join(lib, "knowledge", "private", "architecture"), null],
    [path.join(lib, "knowledge", "private", "standards"), null],
    [path.join(lib, "requirements"), "requirements-README.md"],
    [path.join(lib, "requirements", "in-work"), "requirements-in-work-README.md"],
    [path.join(lib, "requirements", "backlog"), "requirements-backlog-README.md"],
    [path.join(lib, "requirements", "completed"), "requirements-completed-README.md"],
    [path.join(lib, "requirements", "reports"), "requirements-reports-README.md"],
    [path.join(lib, "issues"), "issues-README.md"],
    [path.join(lib, "issues", "in-work"), "issues-in-work-README.md"],
    [path.join(lib, "issues", "backlog"), "issues-backlog-README.md"],
    [path.join(lib, "issues", "completed"), "issues-completed-README.md"],
    [path.join(lib, "notes"), "notes-README.md"],
  ] as [string, string | null][];

  for (const [dir, tmpl] of dirs) {
    ensureDir(dir, actions, dryRun);
    if (tmpl) writeReadme(dir, tmpl, actions, dryRun);
  }

  // Seed documentation-framework.md in standards if missing
  const fwDest = path.join(lib, "knowledge", "private", "standards", "documentation-framework.md");
  if (!fs.existsSync(fwDest)) {
    const fwSrc = tpl("documentation-framework.md");
    actions.push({
      type: "write_readme",
      dest: fwDest,
      template: "documentation-framework.md",
      label: `write ${relPath(fwDest)}`,
    });
    if (!dryRun) {
      fs.mkdirSync(path.dirname(fwDest), { recursive: true });
      fs.copyFileSync(fwSrc, fwDest);
    }
  }
}

// ---------------------------------------------------------------------------
// v1 migration
// ---------------------------------------------------------------------------

function migrateV1(lib: string, actions: Action[], dryRun: boolean): void {
  // 1. knowledge-base/ -> knowledge/private/ (bulk, except special sub-cases)
  const kbDir = path.join(lib, "knowledge-base");
  if (fs.existsSync(kbDir)) {
    const domains = fs.readdirSync(kbDir, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => e.name);
    for (const domain of domains) {
      const src = path.join(kbDir, domain);
      // Special case: overview/ is public knowledge
      const dest = domain === "overview"
        ? path.join(lib, "knowledge", "public", "overview")
        : path.join(lib, "knowledge", "private", domain);
      moveDir(src, dest, actions, dryRun);
    }
    // Move any loose .md files at kb root
    const looseFiles = fs.readdirSync(kbDir, { withFileTypes: true })
      .filter((e) => e.isFile() && e.name.endsWith(".md"))
      .map((e) => e.name);
    for (const f of looseFiles) {
      moveFile(
        path.join(kbDir, f),
        path.join(lib, "knowledge", "private", f),
        actions,
        dryRun
      );
    }
    tryDeleteEmpty(kbDir, actions, dryRun);
  }

  // 2. architecture/ (ADRs) -> knowledge/private/architecture/
  const archDir = path.join(lib, "architecture");
  if (fs.existsSync(archDir)) {
    moveDir(archDir, path.join(lib, "knowledge", "private", "architecture"), actions, dryRun);
  }

  // 3. reference/ -> knowledge/private/reference/
  const refDir = path.join(lib, "reference");
  if (fs.existsSync(refDir)) {
    moveDir(refDir, path.join(lib, "knowledge", "private", "reference"), actions, dryRun);
  }

  // 4. ai-tools/ -> knowledge/private/ai-tools/
  const aiToolsDir = path.join(lib, "ai-tools");
  if (fs.existsSync(aiToolsDir)) {
    moveDir(aiToolsDir, path.join(lib, "knowledge", "private", "ai-tools"), actions, dryRun);
  }

  // 5. requirements/features/feature-NNN-slug/ -> requirements/backlog/prd-NNN-slug/
  //    requirements/features/completed/ -> requirements/completed/
  const featDir = path.join(lib, "requirements", "features");
  if (fs.existsSync(featDir)) {
    const entries = fs.readdirSync(featDir, { withFileTypes: true });
    for (const e of entries) {
      if (!e.isDirectory()) continue;
      if (e.name === "completed") {
        // requirements/features/completed/ -> requirements/completed/
        moveDir(
          path.join(featDir, "completed"),
          path.join(lib, "requirements", "completed"),
          actions,
          dryRun
        );
        continue;
      }
      if (!e.name.startsWith("feature-")) continue;
      const oldFolderSlug = e.name;
      const newFolderSlug = featureSlugToPrd(oldFolderSlug);
      const oldDir = path.join(featDir, oldFolderSlug);
      const newDir = path.join(lib, "requirements", "backlog", newFolderSlug);

      // Find the main PRD file inside the old folder
      const oldContents = fs.readdirSync(oldDir, { withFileTypes: true });
      for (const item of oldContents) {
        if (item.isDirectory()) {
          const subName = item.name;
          if (subName === "reports") {
            // reports/ -> qa/
            moveDir(
              path.join(oldDir, "reports"),
              path.join(newDir, "qa"),
              actions,
              dryRun
            );
          } else {
            moveDir(
              path.join(oldDir, subName),
              path.join(newDir, subName),
              actions,
              dryRun
            );
          }
        } else if (item.isFile() && item.name.endsWith(".md")) {
          const newFilename = prdFilenameToIndex(item.name, newFolderSlug);
          moveFile(
            path.join(oldDir, item.name),
            path.join(newDir, newFilename),
            actions,
            dryRun
          );
        }
      }
      tryDeleteEmpty(oldDir, actions, dryRun);
    }
    tryDeleteEmpty(featDir, actions, dryRun);
  }

  // 6. requirements/issues/issue-NNN-slug/ -> issues/backlog/ird-NNN-slug/
  //    requirements/issues/completed/ -> issues/completed/
  const issuesOldDir = path.join(lib, "requirements", "issues");
  if (fs.existsSync(issuesOldDir)) {
    const entries = fs.readdirSync(issuesOldDir, { withFileTypes: true });
    for (const e of entries) {
      if (!e.isDirectory()) continue;
      if (e.name === "completed") {
        moveDir(
          path.join(issuesOldDir, "completed"),
          path.join(lib, "issues", "completed"),
          actions,
          dryRun
        );
        continue;
      }
      if (!e.name.startsWith("issue-")) continue;
      const oldFolderSlug = e.name;
      const newFolderSlug = issueSlugToIrd(oldFolderSlug);
      const oldDir = path.join(issuesOldDir, oldFolderSlug);
      const newDir = path.join(lib, "issues", "backlog", newFolderSlug);

      const oldContents = fs.readdirSync(oldDir, { withFileTypes: true });
      for (const item of oldContents) {
        if (item.isDirectory() && item.name === "reports") {
          moveDir(path.join(oldDir, "reports"), path.join(newDir, "qa"), actions, dryRun);
        } else if (item.isDirectory()) {
          moveDir(path.join(oldDir, item.name), path.join(newDir, item.name), actions, dryRun);
        } else if (item.isFile() && item.name.endsWith(".md")) {
          const newFilename = irdFilenameToIndex(item.name, newFolderSlug);
          moveFile(
            path.join(oldDir, item.name),
            path.join(newDir, newFilename),
            actions,
            dryRun
          );
        }
      }
      tryDeleteEmpty(oldDir, actions, dryRun);
    }
    tryDeleteEmpty(issuesOldDir, actions, dryRun);
  }

  // 7. qa/ -> requirements/reports/ (standalone scan reports)
  const qaOldDir = path.join(lib, "qa");
  if (fs.existsSync(qaOldDir)) {
    const files = walkAll(qaOldDir);
    const reportsDir = path.join(lib, "requirements", "reports");
    for (const rel of files) {
      // Flatten: qa/domain/date-report.md -> reports/date-domain-report.md
      const parts = rel.replace(/\\/g, "/").split("/");
      let newName: string;
      if (parts.length === 2) {
        // qa/domain/filename.md -> reports/filename.md (keep domain in filename if not already)
        newName = parts[1];
      } else {
        newName = parts[parts.length - 1];
      }
      moveFile(
        path.join(qaOldDir, rel),
        path.join(reportsDir, newName),
        actions,
        dryRun
      );
    }
    tryDeleteEmpty(qaOldDir, actions, dryRun);
  }

  // 8. Handle legion-marketing special cases:
  //    knowledge-base/public/ already is a sub-brand folder (from previous work)
  //    knowledge-base/product/ -> knowledge/private/product/
  //    knowledge-base/marketing/ -> knowledge/private/marketing/
  //    knowledge-base/roadmap/ -> knowledge/private/roadmap/
  //    (overview/ handled above as special -> public/overview/)
  // These are already handled by the bulk knowledge-base/ migration above.
}

// ---------------------------------------------------------------------------
// Process one repo
// ---------------------------------------------------------------------------

function processRepo(
  repo: string,
  dryRun: boolean,
  noSync: boolean
): void {
  console.log(`\n=== ${repo} ===`);

  if (NO_LIBRARY_REPOS.has(repo)) {
    console.log(`  SKIP: ${repo} does not use a library/ folder.`);
    return;
  }

  const lib = libRoot(repo);
  const actions: Action[] = [];

  // Always ensure v2 structure exists first
  scaffoldV2(lib, actions, dryRun);

  // Migrate v1 paths if they exist
  migrateV1(lib, actions, dryRun);

  if (actions.length === 0) {
    console.log("  Already up to date.");
    return;
  }

  for (const a of actions) {
    const prefix = dryRun ? "  [DRY]" : "  [OK] ";
    console.log(`${prefix} ${a.label}`);
  }

  // Print changed paths for manual cross-link review
  const moved = actions.filter((a) => a.type === "move_file" || a.type === "move_dir");
  if (moved.length > 0 && !dryRun) {
    console.log(`\n  ${moved.length} file(s) moved. Review cross-links with:`);
    console.log(`    rg "knowledge-base|feature-|issue-|/architecture/" ${repo}/library/ --files-with-matches`);
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main(): void {
  const args = process.argv.slice(2);
  const all = args.includes("--all");
  const dryRun = args.includes("--dry-run");
  const noSync = args.includes("--no-sync");
  const repoIdx = args.indexOf("--repository");
  const singleRepo = repoIdx !== -1 ? args[repoIdx + 1] : null;

  if (!all && !singleRepo) {
    console.error("Usage: pnpm standardize-library --repository <name> | --all [--dry-run] [--no-sync]");
    process.exit(1);
  }

  if (dryRun) console.log("[DRY RUN — no changes will be made]\n");

  const repos = all ? ALL_REPOS : [singleRepo!];
  for (const repo of repos) {
    processRepo(repo, dryRun, noSync);
  }

  if (!dryRun && !noSync) {
    console.log("\nRunning legion-sync --full to update wiki...");
    try {
      execSync("npx tsx scripts/legion-sync.ts --full", {
        cwd: SUITE_ROOT,
        stdio: "inherit",
      });
    } catch {
      console.warn("  legion-sync failed — run manually: pnpm legion-sync --full");
    }
  }

  console.log("\nDone.");
}

main();
