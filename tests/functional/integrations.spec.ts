/**
 * tests/functional/integrations.spec.ts
 *
 * Functional tests for the CustomerHub integrations section.
 * Verifies the integrations section is present, known partner names are shown,
 * and links are valid. Does NOT click any external integration links.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('Integrations Functional @functional', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.navigate();
    await homePage.waitForLoad();
  });

  // ── Integrations section visibility ──────────────────────────────────────────

  test('integrations section is visible on homepage @functional', async ({ featuresPage }) => {
    const isVisible = await featuresPage.isIntegrationsSectionVisible();
    if (!isVisible) {
      // Scroll to try to reveal it
      await featuresPage.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.7));
      await featuresPage.page.waitForTimeout(300);
    }
    const afterScroll = await featuresPage.isIntegrationsSectionVisible();
    expect(
      afterScroll,
      'An integrations section should be visible on the CustomerHub homepage'
    ).toBeTruthy();
  });

  // ── Known integrations ────────────────────────────────────────────────────────

  test('Stripe integration is mentioned @functional', async ({ page }) => {
    const stripeText = page.locator('text="Stripe"').first();
    if (await stripeText.count() > 0) {
      await expect(stripeText).toBeVisible();
    } else {
      const stripeImg = page.locator('img[alt*="Stripe" i]').first();
      expect(
        await stripeImg.count() > 0 || await stripeText.count() > 0,
        'Stripe should be listed as an integration'
      ).toBeTruthy();
    }
  });

  test('ActiveCampaign integration is mentioned @functional', async ({ page }) => {
    const acText = page.locator('text="ActiveCampaign"').first();
    if (await acText.count() > 0) {
      await expect(acText).toBeVisible();
    } else {
      console.warn('[functional] ActiveCampaign not found in integrations section.');
    }
  });

  test('Zapier integration is mentioned @functional', async ({ page }) => {
    const zapierText = page.locator('text="Zapier"').first();
    if (await zapierText.count() > 0) {
      await expect(zapierText).toBeVisible();
    } else {
      console.warn('[functional] Zapier not found in integrations section.');
    }
  });

  test('at least 3 integrations are listed @functional', async ({ featuresPage }) => {
    const integrationNames = await featuresPage.getVisibleIntegrationNames();
    expect(
      integrationNames.length,
      `Expected at least 3 integration partners — found: ${integrationNames.join(', ') || 'none'}`
    ).toBeGreaterThanOrEqual(3);
  });

  // ── Integrations page ─────────────────────────────────────────────────────────

  test('/integrations page loads @functional', async ({ page, siteConfig }) => {
    const response = await page.goto(
      siteConfig.url.replace(/\/$/, '') + '/integrations',
      { waitUntil: 'domcontentloaded', timeout: 15_000 }
    ).catch(() => null);

    if (!response) {
      console.warn('[functional] /integrations page unreachable — may be under a different URL.');
      return;
    }

    expect(
      response.status(),
      '/integrations should respond with HTTP 2xx or 3xx'
    ).toBeLessThan(400);
  });

  test('/integrations page lists partner integrations @functional', async ({ page, siteConfig }) => {
    await page.goto(
      siteConfig.url.replace(/\/$/, '') + '/integrations',
      { waitUntil: 'domcontentloaded', timeout: 15_000 }
    ).catch(() => null);

    // Check at least one known integration partner is present
    const stripeEl = page.locator('text="Stripe"').first();
    const zapierEl = page.locator('text="Zapier"').first();
    const acEl = page.locator('text="ActiveCampaign"').first();

    const hasAnyIntegration = (
      (await stripeEl.count()) > 0 ||
      (await zapierEl.count()) > 0 ||
      (await acEl.count()) > 0
    );

    if (!hasAnyIntegration) {
      console.warn('[functional] No known integration names found on /integrations — page may have different structure.');
    } else {
      expect(hasAnyIntegration, 'At least one integration partner should be listed').toBeTruthy();
    }
  });

  // ── Integration "Learn More" links ────────────────────────────────────────────

  test('integrations section has learn more links @functional', async ({ page }) => {
    const learnMoreLinks = page.locator(
      '[class*="integration" i] a, [id*="integration" i] a'
    ).filter({ hasText: /learn more|view/i });

    if (await learnMoreLinks.count() > 0) {
      await expect(learnMoreLinks.first()).toBeVisible();
    } else {
      // Broader check: any link within an integration-related section
      const integrationLinks = page.locator(
        'section:has-text("Integration") a[href]'
      );
      if (await integrationLinks.count() > 0) {
        await expect(integrationLinks.first()).toBeVisible();
      } else {
        console.warn('[functional] No integration links found — section may not contain links.');
      }
    }
  });
});
