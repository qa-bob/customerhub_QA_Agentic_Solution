# CustomerHub — QA Agentic Solution

Automated regression test suite for [CustomerHub](https://www.customerhub.com/) built with **Playwright + TypeScript** and the **Page Object Model (POM)** pattern. Tests cover smoke, navigation, forms, functional, visual regression, and responsive layout checks across desktop, tablet, and mobile viewports.

---

## Table of Contents

- [Project Purpose](#project-purpose)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Development Environment Setup](#development-environment-setup)
- [Running Tests](#running-tests)
- [Project Architecture](#project-architecture)
- [Writing Tests — Contributor Rules](#writing-tests--contributor-rules)
- [Claude Code Integration](#claude-code-integration)
- [CI/CD](#cicd)

---

## Project Purpose

This repo tests the CustomerHub SaaS website (`https://www.customerhub.com`) — a membership and content management platform for coaches and small businesses. The test suite:

- Verifies the site is available and performant (smoke tests)
- Confirms navigation links are reachable and functional (navigation tests)
- Validates form field presence and HTML5 validation without submitting forms (forms tests)
- Exercises business-critical features: hero CTAs, pricing tiers, feature pillars, integrations section (functional tests)
- Detects visual regressions via screenshot comparison (visual tests)
- Ensures the layout works at mobile, tablet, and desktop breakpoints (responsive tests)

No accounts are created, no forms are submitted, and no real credentials are used.

---

## Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| [Playwright](https://playwright.dev/) | ^1.44 | Browser automation & test runner |
| TypeScript | ^5.4 | Type-safe test code |
| ESLint + `@typescript-eslint` | ^8 / ^7 | Linting |
| GitHub Actions | — | CI/CD pipeline |
| Claude Code | latest | Agentic test generation and maintenance |

---

## Prerequisites

| Requirement | Notes |
|-------------|-------|
| **Node.js ≥ 18** | LTS recommended |
| **npm ≥ 9** | Bundled with Node 18+ |
| **Git** | Clone and branch management |
| **Claude Code CLI** (optional) | For agentic slash commands |

---

## Development Environment Setup

```bash
# 1. Clone the repository
git clone https://github.com/<org>/customerhub_QA_Agentic_Solution.git
cd customerhub_QA_Agentic_Solution

# 2. Install Node dependencies
npm install

# 3. Install Playwright browsers (Chromium, Firefox, WebKit)
npx playwright install

# 4. (Optional) Copy the example env file and customise
cp .env.example .env

# 5. Verify the TypeScript compiles cleanly
npm run typecheck

# 6. Run the smoke suite to confirm your environment is working
npm run test:smoke
```

The target URL is read from `site.config.json`. To override it for a single run:

```bash
SITE_URL=https://staging.customerhub.com npm test
```

---

## Running Tests

```bash
npm test                      # All tests (all browsers)
npm run test:smoke            # @smoke — availability and basic load
npm run test:navigation       # @navigation — nav links, menus, routing
npm run test:forms            # @forms — form fields, validation
npm run test:visual           # @visual — screenshot regression
npm run test:responsive       # @responsive — viewport layout checks

npx playwright test --grep @functional          # Functional business logic tests
npx playwright test --project=chromium-desktop  # Specific browser project
npx playwright test --headed                    # Watch tests run in the browser

npm run report                # Open the HTML test report
npm run baseline              # Update visual regression snapshots
npm run lint                  # ESLint
npm run typecheck             # TypeScript check (no emit)
```

### Playwright Projects

| Project | Viewport | Device |
|---------|----------|--------|
| `chromium-desktop` | 1280×720 | Desktop Chrome |
| `mobile-chrome` | 390×844 | Pixel 5 |
| `tablet` | 768×1024 | iPad Mini |

---

## Project Architecture

This suite follows the **Page Object Model (POM)** pattern with **OOP** principles.

```
site.config.json          # Site URL, name, feature flags
playwright.config.ts      # Playwright config — projects, reporters, timeouts
global-setup.ts           # Pre-suite reachability check

src/
  pages/                  # One class per page or section (extends BasePage)
    base.page.ts          # Shared methods: navigate, screenshot, scroll
    home.page.ts          # Hero, headings, CTAs
    navigation.page.ts    # Nav detection, link checking, mobile menu
    contact.page.ts       # Form discovery, field inspection, fill helpers
    features.page.ts      # Feature pillars, integrations section
    pricing.page.ts       # Pricing tiers, billing toggle, plan CTAs
  fixtures/
    site.fixture.ts       # Custom test fixtures — exposes page objects + siteConfig
  utils/
    link-checker.ts       # HTTP HEAD link-checking helper
    visual-helper.ts      # Cookie banner dismissal, screenshot helpers
  types/
    site-config.types.ts  # SiteConfig interface + loadSiteConfig()

tests/
  smoke/
    site-availability.spec.ts     # HTTP status, load time, console errors, HTTPS, meta tags
  navigation/
    nav-links.spec.ts             # Nav visibility, 404 checks, mobile menu, logo link
  forms/
    contact-form.spec.ts          # Form presence, required fields, labels, HTML5 validation
  functional/
    homepage.spec.ts              # Hero, stats, CTAs, testimonials, case studies
    pricing.spec.ts               # Pricing tiers, billing toggle, plan names, free trial
    features.spec.ts              # Feature pillars, feature modules, section headings
    integrations.spec.ts          # Integration logos, partner links, section visibility
  visual/
    visual-regression.spec.ts     # Screenshot baselines — desktop, mobile, tablet
  responsive/
    layout.spec.ts                # Horizontal scroll, font size, alt attributes, viewport meta

.claude/
  agents/
    site-analyzer.md              # Agent: crawl site → populate site.config.json
    test-generator.md             # Agent: generate site-specific test files
  commands/
    analyze-site.md               # /analyze-site slash command
    generate-full-suite.md        # /generate-full-suite slash command
    generate-report.md            # /generate-report slash command
    run-smoke.md                  # /run-smoke slash command
    update-baseline.md            # /update-baseline slash command

.github/
  workflows/
    playwright.yml                # CI: run tests on push / PR
  CONTRIBUTING.md                 # Contribution guide
  PULL_REQUEST_TEMPLATE.md        # PR checklist template
```

### OOP / POM Conventions

- Every page or section has its own class in `src/pages/` extending `BasePage`.
- Locators are `readonly Locator` properties on the class.
- Methods represent **user actions** — no `expect()` calls inside page objects.
- Tests use the custom fixture (`@fixtures/site.fixture`) — never raw `page.locator()` in a spec body.
- TypeScript strict mode is always enabled.

---

## Writing Tests — Contributor Rules

Before writing or modifying a test, read `CLAUDE.md` for the full rule set. Key rules:

| Rule | Why |
|------|-----|
| **Never submit a form** | Prevents spam to real inboxes |
| **Never create accounts** | Auth flows are out of scope |
| **No hardcoded URLs** | Always use `baseURL` from Playwright config |
| **Tag every test** | Required: `@smoke`, `@navigation`, `@forms`, `@functional`, `@visual`, or `@responsive` |
| **No `page.waitForTimeout()`** | Use `waitForSelector` or Playwright auto-waiting |
| **No `any` types** | Strict TypeScript — always type explicitly |
| **Assertions in tests only** | Page object methods must not call `expect()` |
| **Run typecheck before pushing** | `npm run typecheck` must pass with zero errors |

### Adding a new page or section

1. Create `src/pages/<name>.page.ts` extending `BasePage`.
2. Add a fixture for it in `src/fixtures/site.fixture.ts`.
3. Write tests in `tests/<category>/<name>.spec.ts`.
4. Add the fixture type to the `Fixtures` interface in `site.fixture.ts`.
5. Run `npm run typecheck` — fix any errors before opening a PR.

---

## Claude Code Integration

This repo is configured for **Claude Code** agentic operation. Slash commands are in `.claude/commands/` and agent definitions are in `.claude/agents/`.

### Available Slash Commands

| Command | What it does |
|---------|-------------|
| `/analyze-site` | Crawls the live site and updates `site.config.json` |
| `/generate-full-suite` | Analyzes the site and generates a complete POM + test suite |
| `/run-smoke` | Runs `@smoke` tests and reports results |
| `/update-baseline` | Refreshes all visual regression snapshots |
| `/generate-report` | Parses results and displays a formatted test summary |

### Available Agents

| Agent | Description |
|-------|-------------|
| `site-analyzer` | Inspects the live site DOM and produces a populated `site.config.json` |
| `test-generator` | Reads `site.config.json` and generates site-specific Playwright specs |

See `AGENTS.md` for agent usage details and `SKILLS.md` for skill invocation reference.

---

## CI/CD

Tests run automatically on every push and pull request via GitHub Actions (`.github/workflows/playwright.yml`). The workflow:

1. Installs Node dependencies and Playwright browsers.
2. Runs the full test suite.
3. Uploads the HTML report and test results as artifacts.
4. On failure: uploads failure screenshots and traces.

To trigger manually: **Actions → Playwright Tests → Run workflow**.

Visual regression baselines are stored in `__snapshots__/` and committed to the repo. Update them with `npm run baseline` after intentional design changes, then commit the updated snapshots.
