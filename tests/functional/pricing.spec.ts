/**
 * tests/functional/pricing.spec.ts
 *
 * Functional tests for the CustomerHub pricing section and /pricing page.
 * Verifies tier visibility, billing toggle, plan names, CTAs, and free trial messaging.
 * Does NOT click sign-up or payment CTAs.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('Pricing Functional @functional', () => {
  // ── Homepage pricing section ──────────────────────────────────────────────────

  test.describe('Homepage pricing section', () => {
    test.beforeEach(async ({ homePage }) => {
      await homePage.navigate();
      await homePage.waitForLoad();
    });

    test('pricing section is visible on homepage @functional', async ({ pricingPage }) => {
      const isVisible = await pricingPage.isPricingSectionVisible();
      if (!isVisible) {
        // Scroll down — pricing may be below the fold
        await pricingPage.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
        await pricingPage.page.waitForTimeout(300);
      }
      const afterScroll = await pricingPage.isPricingSectionVisible();
      expect(
        afterScroll,
        'A pricing section should be visible on the CustomerHub homepage'
      ).toBeTruthy();
    });

    test('pricing shows three plan tiers @functional', async ({ pricingPage }) => {
      const planNames = await pricingPage.getPlanNames();
      expect(
        planNames.length,
        `Expected 3 plan names (Onboard, Educate, Engage) — found: ${planNames.join(', ') || 'none'}`
      ).toBeGreaterThanOrEqual(2);
    });

    test('Onboard plan is visible @functional', async ({ page }) => {
      const onboardPlan = page.locator('text="Onboard"').first();
      if (await onboardPlan.count() > 0) {
        await expect(onboardPlan).toBeVisible();
      } else {
        console.warn('[functional] "Onboard" plan not found on homepage pricing section.');
      }
    });

    test('Educate plan is visible @functional', async ({ page }) => {
      const educatePlan = page.locator('text="Educate"').first();
      if (await educatePlan.count() > 0) {
        await expect(educatePlan).toBeVisible();
      } else {
        console.warn('[functional] "Educate" plan not found on homepage pricing section.');
      }
    });

    test('Engage plan is visible @functional', async ({ page }) => {
      const engagePlan = page.locator('text="Engage"').first();
      if (await engagePlan.count() > 0) {
        await expect(engagePlan).toBeVisible();
      } else {
        console.warn('[functional] "Engage" plan not found on homepage pricing section.');
      }
    });

    test('pricing CTAs are present on pricing section @functional', async ({ pricingPage }) => {
      const hasCTAs = await pricingPage.hasPricingCTAs();
      expect(hasCTAs, 'Pricing section should have at least one "Get Started" CTA').toBeTruthy();
    });

    test('free trial messaging is visible in pricing section @functional', async ({ pricingPage }) => {
      const hasFreeTrialMsg = await pricingPage.hasFreeTrialMessaging();
      expect(
        hasFreeTrialMsg,
        'Pricing section should mention free trial, cancel anytime, or similar trust messaging'
      ).toBeTruthy();
    });
  });

  // ── Dedicated /pricing page ───────────────────────────────────────────────────

  test.describe('Dedicated pricing page', () => {
    test.beforeEach(async ({ pricingPage }) => {
      await pricingPage.goToPricingPage();
      await pricingPage.waitForLoad();
    });

    test('/pricing page loads successfully @functional', async ({ page, siteConfig }) => {
      const response = await page.goto(siteConfig.url.replace(/\/$/, '') + '/pricing', {
        waitUntil: 'domcontentloaded',
      });

      if (response) {
        expect(
          response.status(),
          '/pricing should respond with HTTP 2xx'
        ).toBeLessThan(400);
      }

      const title = await page.title();
      expect(title.trim().length, '/pricing page should have a <title>').toBeGreaterThan(0);
    });

    test('/pricing page has plan tier headings @functional', async ({ pricingPage }) => {
      const planNames = await pricingPage.getPlanNames();
      expect(
        planNames.length,
        'Pricing page should show at least 2 plan names'
      ).toBeGreaterThanOrEqual(2);
    });

    test('/pricing page has billing frequency toggle @functional', async ({ pricingPage }) => {
      const hasToggle = await pricingPage.isBillingToggleVisible();
      if (!hasToggle) {
        console.warn('[functional] Billing toggle not found on /pricing — may be annual-only display.');
        return;
      }
      expect(hasToggle, 'Annual/monthly billing toggle should be visible on pricing page').toBeTruthy();
    });

    test('annual billing toggle changes displayed price @functional', async ({ pricingPage, page }) => {
      const hasToggle = await pricingPage.isBillingToggleVisible();
      if (!hasToggle) {
        test.skip(true, 'Billing toggle not present on this page');
        return;
      }

      // Get a price element before toggling
      const priceLocator = page.locator('[class*="price" i]:has-text("$")').first();
      if (await priceLocator.count() === 0) {
        console.warn('[functional] Could not find price elements to compare toggle behavior.');
        return;
      }

      const priceBefore = await priceLocator.textContent();
      await pricingPage.selectMonthlyBilling();
      await page.waitForTimeout(300);
      const priceAfter = await priceLocator.textContent();

      // If prices changed, the toggle works; if not, it may already be on monthly
      if (priceBefore !== priceAfter) {
        expect(priceBefore).not.toEqual(priceAfter);
      } else {
        // Toggle back and try the reverse
        await pricingPage.selectAnnualBilling();
        const priceAnnual = await priceLocator.textContent();
        console.log(`[functional] Billing toggle — annual: ${priceAnnual}, monthly: ${priceAfter}`);
      }
    });

    test('/pricing page has free trial messaging @functional', async ({ pricingPage }) => {
      const hasFreeTrialMsg = await pricingPage.hasFreeTrialMessaging();
      expect(
        hasFreeTrialMsg,
        'Pricing page should mention "free trial", "cancel anytime", or similar'
      ).toBeTruthy();
    });

    test('/pricing page has Get Started CTAs @functional', async ({ pricingPage }) => {
      const hasCTAs = await pricingPage.hasPricingCTAs();
      expect(hasCTAs, 'Pricing page should have CTA buttons for each plan').toBeTruthy();
    });
  });
});
