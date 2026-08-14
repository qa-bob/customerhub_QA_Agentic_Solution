## Summary

<!-- Describe what this PR changes and why. One to three sentences. -->

## Type of Change

- [ ] New test(s)
- [ ] Updated test(s) / selector fix
- [ ] New page object
- [ ] Updated page object
- [ ] Bug fix in framework code (utils, fixtures, config)
- [ ] Documentation update
- [ ] Visual baseline update
- [ ] CI/CD change

## Test Categories Affected

- [ ] `@smoke`
- [ ] `@navigation`
- [ ] `@forms`
- [ ] `@functional`
- [ ] `@visual`
- [ ] `@responsive`

## Checklist

- [ ] `npm run typecheck` passes with zero errors
- [ ] `npm run lint` passes with zero errors
- [ ] All new/changed tests have at least one `@tag`
- [ ] No form is submitted in any test
- [ ] No hardcoded URLs — all use `baseURL` or `siteConfig.url`
- [ ] No `page.waitForTimeout()` calls > 500ms
- [ ] No `expect()` calls inside page objects
- [ ] Visual baselines updated and committed (if applicable)

## How to Test This PR

<!-- Steps a reviewer should follow to verify the change works correctly. -->

1. `npm install`
2. `npx playwright install`
3. Run: `npx playwright test <path/to/changed/spec.ts> --project=chromium-desktop`
4. Expected result: all tests pass

## Related Issues

<!-- Link any related GitHub issues: Closes #123 -->
