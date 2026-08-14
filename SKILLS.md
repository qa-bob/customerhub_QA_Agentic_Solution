# SKILLS.md — Claude Code Skills & Slash Command Reference

This file documents all user-invocable skills (slash commands) available in this repository. Skill definitions live in `.claude/commands/`.

---

## What are Skills?

Skills are reusable Claude Code workflows packaged as markdown files in `.claude/commands/`. They load on demand when invoked and contain step-by-step instructions Claude executes. Unlike `CLAUDE.md` (which loads every session), skills only enter context when called — keeping the base context lean.

Invoke a skill by typing `/skill-name` in a Claude Code session.

---

## Available Skills

### `/analyze-site`

**File:** `.claude/commands/analyze-site.md`

**Purpose:** Crawl the live CustomerHub website and report on its structure.

**What it does:**
- Navigates to the URL in `site.config.json`
- Extracts all navigation links, page sections, forms, and interactive elements
- Reports pages discovered, nav items, form fields, and potential issues
- Optionally updates `site.config.json` with discovered values

**When to use:**
- Before writing new tests to understand what elements are actually on the page
- After a site redesign to check if `site.config.json` is still accurate
- When debugging selectors that stopped working

---

### `/generate-full-suite`

**File:** `.claude/commands/generate-full-suite.md`

**Purpose:** Analyze the live site and generate a complete POM + test suite.

**What it does:**
1. Runs `/analyze-site` to discover site structure
2. Creates or updates page objects in `src/pages/`
3. Writes tests across all categories: smoke, navigation, forms, functional, visual, responsive
4. Updates `src/fixtures/site.fixture.ts` to expose new page objects
5. Runs `npx tsc --noEmit` to verify TypeScript compiles cleanly

**When to use:**
- First-time setup of a new target site
- After a major site redesign requiring broad test rewrites
- When onboarding a new site to this framework

---

### `/run-smoke`

**File:** `.claude/commands/run-smoke.md`

**Purpose:** Run all `@smoke` tests and report results in the terminal.

**What it does:**
- Executes `npm run test:smoke`
- Parses `test-results/results.json`
- Displays a pass/fail summary per test
- Lists any failures with their error messages
- Suggests next steps if failures are found

**When to use:**
- Quick health check before running the full suite
- After deploying a site change to verify the site is still up
- As a gate in CI before running slower test suites

---

### `/update-baseline`

**File:** `.claude/commands/update-baseline.md`

**Purpose:** Refresh all visual regression baseline screenshots.

**What it does:**
- Runs `npm run baseline` (`playwright test --grep @visual --update-snapshots`)
- Reports which snapshots were updated
- Reminds you to commit the updated `__snapshots__/` files

**When to use:**
- After an intentional visual/design change to the site
- When setting up visual tests for the first time on a new environment
- After updating the Playwright version (which may change rendering slightly)

**Important:** Only run this when the new appearance is intentional and correct. Updating baselines to hide failures defeats the purpose of visual regression testing.

---

### `/generate-report`

**File:** `.claude/commands/generate-report.md`

**Purpose:** Parse Playwright results and display a formatted test summary.

**What it does:**
1. Reads `test-results/results.json`
2. Displays a table: suite → total / passed / failed / flaky
3. Lists all failed tests with their error messages and retry counts
4. Lists flaky tests with suggestions
5. Suggests next steps (fix broken links, run `/update-baseline` for visual failures, etc.)

**When to use:**
- After a full test run to get a human-readable summary
- When triaging failures from a CI run
- When generating a status update for stakeholders

---

## Skill Invocation Cheatsheet

```
/analyze-site          Crawl site, report structure, optionally update config
/generate-full-suite   Generate complete POM + test suite from live site
/run-smoke             Run @smoke tests, display pass/fail summary
/update-baseline       Refresh visual regression baseline screenshots
/generate-report       Parse results.json, display formatted test summary
```

---

## Adding a New Skill

1. Create `.claude/commands/<skill-name>.md`
2. Define: **Purpose**, **Usage**, **What this command does** (numbered steps), **Notes**
3. Add an entry to this file
4. Reference the skill in `CLAUDE.md`'s Slash Commands table

### Skill file template

```markdown
# /skill-name

One-sentence description of what this skill does.

## Usage

/skill-name [optional-argument]

## What this command does

1. Step one
2. Step two
3. Step three

## Notes

- Any important caveats
- Environment-specific behavior
```
