# AGENTS.md — Claude Code Agent Reference

This file documents the Claude Code agents available in this repository. Each agent is a specialized subagent that Claude Code can spawn to handle a focused task. Agent definitions live in `.claude/agents/`.

---

## What are Agents?

Claude Code agents are autonomous subprocesses invoked either explicitly (via slash commands or direct invocation) or automatically when the task matches the agent's described capabilities. Each agent has its own role, tool access, and step-by-step instructions defined in a markdown file under `.claude/agents/`.

---

## Available Agents

### `site-analyzer`

**File:** `.claude/agents/site-analyzer.md`

**Purpose:** Crawl a live website and produce a fully-populated `site.config.json`.

**When it runs:**
- On first-time repo onboarding when `site.config.json` is missing or has empty fields
- When `/analyze-site` is invoked
- When asked to verify the config is still accurate after a site redesign

**What it does:**
1. Issues a HEAD request and follows all redirects to resolve the canonical URL
2. Navigates the site with `waitUntil: 'networkidle'`
3. Dismisses cookie/consent banners
4. Extracts nav items from `nav a[href]` and `[role="navigation"] a[href]`
5. Searches for contact forms on `/`, `/contact`, `/contact-us`, `/get-in-touch`
6. Infers the industry from page copy
7. Determines `skipVisual` (heavy CSS animations) and `auth.required` (login redirect)
8. Outputs a complete `site.config.json` JSON block plus an issues checklist

**Output:**
```json
{
  "name": "string",
  "url": "string",
  "description": "string",
  "industry": "string",
  "hasContactForm": true,
  "expectedNavItems": ["..."],
  "viewports": ["desktop", "mobile", "tablet"],
  "skipVisual": false,
  "skipForms": false,
  "auth": { "required": false, "loginUrl": "", "username": "", "password": "" }
}
```

---

### `test-generator`

**File:** `.claude/agents/test-generator.md`

**Purpose:** Generate site-specific Playwright test files beyond the shared framework suites.

**When it runs:**
- When `/generate-full-suite` is invoked
- When a site has unique functionality not covered by the generic test suites
- When writing regression tests for a recently discovered bug
- When a client requests additional coverage (pricing page, demo request flow, blog pagination)

**What it does:**
1. Reads `site.config.json` to understand site structure
2. Fetches the live site to discover actual HTML elements
3. Identifies gaps in existing test coverage
4. Plans test scenarios before writing code
5. Generates or updates page objects in `src/pages/`
6. Writes spec files in `tests/custom/` or the appropriate `tests/<category>/` folder
7. Outputs valid TypeScript following all POM and naming conventions

**Conventions for generated files:**
- File naming: `tests/custom/<kebab-case>.spec.ts`
- JSDoc header explaining what is tested and why it's site-specific
- Import from `@fixtures/site.fixture`
- Tag tests `@custom` plus any applicable standard tag
- Strict TypeScript — no implicit `any`
- Never submit forms; never rely on fixed timeouts > 500ms

---

## How to Invoke an Agent

### Automatically via slash commands

```
/analyze-site         → invokes site-analyzer
/generate-full-suite  → invokes test-generator
```

### Explicitly in a prompt

```
Use the site-analyzer agent to update site.config.json for CustomerHub.
Use the test-generator agent to write tests for the pricing page.
```

### Via Claude Code sub-agent spawning

Claude Code will automatically spawn the most appropriate agent when a task matches the agent's `When to invoke` criteria. You can also explicitly reference an agent by name in your request.

---

## Adding a New Agent

1. Create `.claude/agents/<agent-name>.md`
2. Define: **Role**, **When to invoke**, **Capabilities**, **Inputs**, **Output**, **Step-by-step instructions**, **Edge cases**
3. Add an entry to this file and to `SKILLS.md` if the agent is user-invocable
4. Reference the agent in `CLAUDE.md` if it should be part of core workflows

---

## Agent Rules

All agents in this repo must follow the global rules in `CLAUDE.md`:

- Never submit forms
- Never create accounts or enter real credentials
- Never hardcode URLs — use `siteConfig.url`
- TypeScript strict mode — run `npx tsc --noEmit` before finishing
- Use `waitForSelector` / Playwright auto-waiting — no `page.waitForTimeout()` > 500ms
