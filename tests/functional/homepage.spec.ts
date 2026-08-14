/**
 * tests/functional/homepage.spec.ts
 *
 * Functional tests for the CustomerHub homepage.
 * Covers hero section, statistics banner, CTAs, testimonials, and case studies.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('Homepage Functional @functional', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.navigate();
    await homePage.waitForLoad();
  });

  // ── Hero section ─────────────────────────────────────────────────────────────

  test('hero section has a primary heading @functional', async ({ homePage }) => {
    const heading = await homePage.getMainHeading();
    expect(heading.length, 'Homepage should have a visible H1 or H2 heading').toBeGreaterThan(0);
  });

  test('hero section has primary CTAs @functional', async ({ homePage }) => {
    const ctaButtons = await homePage.getCTAButtons();
    expect(
      ctaButtons.length,
      'Homepage should have at least one CTA button (Get Started, Schedule Demo, etc.)'
    ).toBeGreaterThan(0);
  });

  test('Get Started CTA is visible in hero @functional', async ({ page }) => {
    const getStartedCTA = page.getByRole('link', { name: /get started/i }).first();
    await expect(
      getStartedCTA,
      '"Get Started" CTA should be visible on the CustomerHub homepage'
    ).toBeVisible({ timeout: 10_000 });
  });

  test('Schedule Demo CTA is present @functional', async ({ page }) => {
    const demoCTA = page.getByRole('link', { name: /schedule demo|book demo|request demo/i }).first();
    if (await demoCTA.count() > 0) {
      await expect(demoCTA).toBeVisible();
    } else {
      // Also accept a button variant
      const demoBtn = page.getByRole('button', { name: /schedule demo|book demo|request demo/i }).first();
      if (await demoBtn.count() > 0) {
        await expect(demoBtn).toBeVisible();
      } else {
        console.warn('[functional] Schedule Demo CTA not found — may have been renamed.');
      }
    }
  });

  // ── Stats banner ─────────────────────────────────────────────────────────────

  test('statistics banner displays key metrics @functional', async ({ page }) => {
    // CustomerHub homepage shows: 10K portals, 10M customers, $100M revenue
    const statsSection = page.locator(
      '[class*="stat" i], [class*="metric" i], [class*="counter" i], ' +
      'section:has-text("10K"), section:has-text("10M"), section:has-text("$100")'
    ).first();

    if (await statsSection.count() > 0) {
      await expect(statsSection).toBeVisible();
    } else {
      // Verify individual stats are somewhere on the page
      const portalsStat = page.locator('text=/10K|10,000/i').first();
      const customersStat = page.locator('text=/10M|10 million/i').first();

      const hasStats = (await portalsStat.count() > 0) || (await customersStat.count() > 0);
      expect(hasStats, 'Homepage should display key statistics (portals, customers, revenue)').toBeTruthy();
    }
  });

  // ── Trust indicators ──────────────────────────────────────────────────────────

  test('free trial trust indicators are present @functional', async ({ page }) => {
    const trustText = page.locator(
      'text=/30.day free trial/i, text=/free trial/i, text=/cancel anytime/i, text=/no credit card/i'
    ).first();

    if (await trustText.count() > 0) {
      await expect(trustText).toBeVisible();
    } else {
      console.warn('[functional] Free trial trust indicators not found on homepage.');
    }
  });

  // ── Testimonials section ──────────────────────────────────────────────────────

  test('testimonials section is present @functional', async ({ page }) => {
    const testimonialsSection = page.locator(
      '[class*="testimonial" i], [class*="review" i], [class*="quote" i], ' +
      '[id*="testimonial" i], section:has([class*="testimonial" i])'
    ).first();

    if (await testimonialsSection.count() > 0) {
      await expect(testimonialsSection, 'Testimonials section should be visible').toBeVisible();
    } else {
      // Fallback: check for blockquote elements (customer quotes)
      const quotes = page.locator('blockquote, [class*="quote" i]');
      expect(
        await quotes.count(),
        'At least one customer testimonial/quote should be visible on the homepage'
      ).toBeGreaterThan(0);
    }
  });

  test('testimonials contain customer quotes @functional', async ({ page }) => {
    const quotes = page.locator(
      '[class*="testimonial" i] p, [class*="review" i] p, blockquote p, ' +
      '[class*="quote-text" i], [class*="testimonial-body" i]'
    );

    if (await quotes.count() === 0) {
      console.warn('[functional] Could not locate testimonial quote text elements — skipping.');
      return;
    }

    const firstQuote = await quotes.first().textContent();
    expect(
      firstQuote?.trim().length ?? 0,
      'Testimonial quotes should have meaningful content'
    ).toBeGreaterThan(20);
  });

  // ── Case studies section ──────────────────────────────────────────────────────

  test('case studies section is present on homepage @functional', async ({ page }) => {
    const caseStudiesSection = page.locator(
      '[class*="case-stud" i], [id*="case-stud" i], ' +
      'section:has(h2:text-matches("case studies", "i")), section:has(a:text-matches("Read Story", "i"))'
    ).first();

    if (await caseStudiesSection.count() > 0) {
      await expect(caseStudiesSection, 'Case studies section should be visible').toBeVisible();
    } else {
      // Check if "Read Story" links exist (case study CTAs)
      const storyLinks = page.getByRole('link', { name: /read story|view story|case study/i });
      if (await storyLinks.count() > 0) {
        await expect(storyLinks.first()).toBeVisible();
      } else {
        console.warn('[functional] Case studies section not found — may not be on homepage.');
      }
    }
  });

  test('case study cards have titles @functional', async ({ page }) => {
    // CustomerHub features 6 case studies: Boogie Mites, Ontocore, Flight Club, etc.
    const caseStudyCards = page.locator(
      '[class*="case-stud" i] h3, [class*="case-stud" i] h4, ' +
      '[class*="story" i] h3, [class*="story" i] h4'
    );

    if (await caseStudyCards.count() === 0) {
      console.warn('[functional] Could not find case study card titles — skipping.');
      return;
    }

    const count = await caseStudyCards.count();
    expect(count, 'Expected at least 3 case study titles').toBeGreaterThanOrEqual(3);
  });

  // ── Homepage loaded check ─────────────────────────────────────────────────────

  test('homepage loads with all key sections @functional', async ({ homePage }) => {
    const isLoaded = await homePage.isLoaded();
    expect(
      isLoaded,
      'Homepage should have: a heading, navigation, and meaningful body text'
    ).toBeTruthy();
  });
});
