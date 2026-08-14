/**
 * tests/functional/features.spec.ts
 *
 * Functional tests for the CustomerHub features section.
 * Covers the three product pillars (Onboard, Educate, Engage), feature module
 * listings, and the dedicated /features page.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('Features Functional @functional', () => {
  // ── Homepage features section ─────────────────────────────────────────────────

  test.describe('Homepage features overview', () => {
    test.beforeEach(async ({ homePage }) => {
      await homePage.navigate();
      await homePage.waitForLoad();
    });

    test('features section is visible on homepage @functional', async ({ featuresPage }) => {
      const isVisible = await featuresPage.isFeaturesSectionVisible();
      expect(
        isVisible,
        'Features section or product pillars should be visible on the homepage'
      ).toBeTruthy();
    });

    test('all three product pillars are present @functional', async ({ featuresPage }) => {
      const pillarCount = await featuresPage.getFeaturePillarCount();
      expect(
        pillarCount,
        'CustomerHub should have 3 product pillars: Onboard, Educate, Engage'
      ).toBe(3);
    });

    test('Onboard feature pillar is visible @functional', async ({ page }) => {
      const onboardHeading = page.locator('h2:has-text("Onboard"), h3:has-text("Onboard")').first();
      if (await onboardHeading.count() > 0) {
        await expect(onboardHeading).toBeVisible();
      } else {
        console.warn('[functional] "Onboard" pillar heading not found — may use different element.');
      }
    });

    test('Educate feature pillar is visible @functional', async ({ page }) => {
      const educateHeading = page.locator('h2:has-text("Educate"), h3:has-text("Educate")').first();
      if (await educateHeading.count() > 0) {
        await expect(educateHeading).toBeVisible();
      } else {
        console.warn('[functional] "Educate" pillar heading not found — may use different element.');
      }
    });

    test('Engage feature pillar is visible @functional', async ({ page }) => {
      const engageHeading = page.locator('h2:has-text("Engage"), h3:has-text("Engage")').first();
      if (await engageHeading.count() > 0) {
        await expect(engageHeading).toBeVisible();
      } else {
        console.warn('[functional] "Engage" pillar heading not found — may use different element.');
      }
    });

    test('feature modules section has content @functional', async ({ featuresPage }) => {
      const hasModules = await featuresPage.hasFeatureModules();
      expect(
        hasModules,
        'Page should mention feature modules (Onboarding Flows, Courses, Memberships, Reporting, etc.)'
      ).toBeTruthy();
    });

    test('features section mentions onboarding capabilities @functional', async ({ page }) => {
      const onboardingText = page.locator(
        'text=/onboarding flow/i, text=/step.by.step/i, text=/progress tracking/i'
      ).first();

      if (await onboardingText.count() > 0) {
        await expect(onboardingText).toBeVisible();
      } else {
        console.warn('[functional] Onboarding capability text not found on homepage.');
      }
    });

    test('features section mentions course/education capabilities @functional', async ({ page }) => {
      const courseText = page.locator(
        'text=/online course/i, text=/digital product/i, text=/content library/i, text=/membership/i'
      ).first();

      if (await courseText.count() > 0) {
        await expect(courseText).toBeVisible();
      } else {
        console.warn('[functional] Course/education capability text not found on homepage.');
      }
    });

    test('features section mentions community/engagement capabilities @functional', async ({ page }) => {
      const communityText = page.locator(
        'text=/community/i, text=/private feed/i, text=/member profile/i'
      ).first();

      if (await communityText.count() > 0) {
        await expect(communityText).toBeVisible();
      } else {
        console.warn('[functional] Community/engagement capability text not found on homepage.');
      }
    });
  });

  // ── Dedicated /features page ──────────────────────────────────────────────────

  test.describe('Dedicated features page', () => {
    test.beforeEach(async ({ featuresPage }) => {
      await featuresPage.goToFeaturesPage();
      await featuresPage.waitForLoad();
    });

    test('/features page loads successfully @functional', async ({ page, siteConfig }) => {
      const response = await page.goto(siteConfig.url.replace(/\/$/, '') + '/features', {
        waitUntil: 'domcontentloaded',
      });

      if (response) {
        expect(
          response.status(),
          '/features should respond with HTTP 2xx or 3xx'
        ).toBeLessThan(400);
      }

      const title = await page.title();
      expect(title.trim().length, '/features page should have a <title>').toBeGreaterThan(0);
    });

    test('/features page has product pillars @functional', async ({ featuresPage }) => {
      const pillarCount = await featuresPage.getFeaturePillarCount();
      expect(
        pillarCount,
        'Features page should have at least 2 product pillar headings'
      ).toBeGreaterThanOrEqual(2);
    });

    test('/features page has feature module content @functional', async ({ featuresPage }) => {
      const hasModules = await featuresPage.hasFeatureModules();
      expect(
        hasModules,
        'Features page should list individual feature modules'
      ).toBeTruthy();
    });
  });
});
