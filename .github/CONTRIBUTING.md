# Contributing to CustomerHub QA Agentic Solution

Thank you for contributing to this test suite. This guide explains how to add tests, create page objects, and open pull requests correctly.

---

## Ground Rules

These rules are non-negotiable for all contributors. Violations will block your PR.

| Rule | Rationale |
|------|-----------|
| **Never submit a form** | Prevents spam to real inboxes |
| **Never create an account or log in** | Auth flows are out of scope unless `auth.required: true` |
| **Never hardcode the site URL** | Use `baseURL` from Playwright config / `siteConfig.url` from the fixture |
| **No `page.waitForTimeout()` > 500ms** | Use `waitForSelector` or Playwright's built-in auto-waiting |
| **No `any` types** | TypeScript strict mode is enabled — always type explicitly |
| **No `expect()` inside page objects** | Assertions belong in test files only |
| **Tag every test** | Every test must have at least one of: `@smoke`, `@navigation`, `@forms`, `@functional`, `@visual`, `@responsive` |
| **Run typecheck before pushing** | `npm run typecheck` must pass with zero errors |
| **Run lint before pushing** | `npm run lint` must pass with zero errors |

---

## Getting Started

See the [README](../README.md) for environment setup and how to run tests.

---

## Making Changes

### Bug fix or test update

1. Identify the failing test and the page object it uses.
2. Fix the selector or logic in the page object, not directly in the spec.
3. Run the specific test to confirm it passes: `npx playwright test <file> --project=chromium-desktop`
4. Run `npm run typecheck` and `npm run lint`.
5. Open a PR.

### Adding a new test

1. Read `site.config.json` to understand the site's URL and flags.
2. Inspect the live site (or use `/analyze-site`) to find real selectors.
3. Check if an existing page object in `src/pages/` covers what you need. If so, add a method there.
4. If the page/section has no page object yet, create `src/pages/<name>.page.ts` extending `BasePage`.
5. Add a fixture for the new page object in `src/fixtures/site.fixture.ts`.
6. Write your test in the correct `tests/<category>/` directory.
7. Tag the test appropriately.
8. Run `npm run typecheck` — fix all errors before pushing.

### Adding a new page object

```typescript
// src/pages/example.page.ts
import { type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';

export class ExamplePage extends BasePage {
  readonly heroHeading: Locator;

  constructor(page: Parameters<typeof BasePage['prototype']['constructor']>[0],
              config: Parameters<typeof BasePage['prototype']['constructor']>[1]) {
    super(page, config);
    this.heroHeading = page.locator('h1').first();
  }

  async getHeroText(): Promise<string> {
    return (await this.heroHeading.textContent())?.trim() ?? '';
  }
}
```

Then add the fixture in `src/fixtures/site.fixture.ts`:

```typescript
examplePage: async ({ page, siteConfig }, use) => {
  const examplePage = new ExamplePage(page, siteConfig);
  await use(examplePage);
},
```

---

## Selector Strategy

Use selectors in this priority order:

1. **Role-based** — `page.getByRole('button', { name: 'Get Started' })` — most resilient
2. **Test IDs** — `page.locator('[data-testid="hero"]')` — if present
3. **Text-based** — `page.getByText('Pricing')` — for unique text
4. **ARIA** — `page.locator('[aria-label="main navigation"]')` — for unlabeled elements
5. **CSS class partial match** — `page.locator('[class*="pricing-card"]')` — last resort

Avoid:
- Deeply nested CSS selectors (`div > ul > li:nth-child(3) > a`)
- `:nth-child` positional selectors (fragile to DOM changes)
- XPath unless absolutely necessary

---

## PR Checklist

Before opening a PR, confirm all of the following:

- [ ] `npm run typecheck` passes with zero errors
- [ ] `npm run lint` passes with zero errors
- [ ] All new tests have at least one `@tag`
- [ ] No form is submitted in any test
- [ ] No hardcoded URLs (all use `baseURL` or `siteConfig.url`)
- [ ] All new page object methods are typed (`readonly Locator`, explicit return types)
- [ ] No `page.waitForTimeout()` calls > 500ms
- [ ] Visual baseline updated if relevant (`npm run baseline`) and snapshots committed

---

## Commit Message Format

Use the imperative mood and a short subject line (≤72 chars):

```
add pricing page object and functional tests
fix broken nav link selector after site redesign
update visual baselines after homepage redesign
```

---

## Questions?

Open a GitHub Issue or use `/analyze-site` in a Claude Code session to inspect the current site state.
