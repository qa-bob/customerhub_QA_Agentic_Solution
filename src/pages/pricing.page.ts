/**
 * src/pages/pricing.page.ts
 *
 * PricingPage models the pricing section of CustomerHub.
 * Supports both the homepage pricing section and the dedicated /pricing page.
 * Does NOT click plan CTAs that would initiate a sign-up flow.
 */

import { type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';

export interface PricingTierInfo {
  name: string;
  price: string;
  hasCTA: boolean;
}

export class PricingPage extends BasePage {
  // ── Pricing section root ─────────────────────────────────────────────────────

  private getPricingSection(): Locator {
    return this.page.locator(
      '[id*="pricing" i], [class*="pricing" i], section:has(h2:text-matches("pricing", "i"))'
    ).first();
  }

  // ── Billing toggle ───────────────────────────────────────────────────────────

  /**
   * Return true if an annual/monthly billing toggle is visible on the page.
   */
  async isBillingToggleVisible(): Promise<boolean> {
    const toggle = this.page.locator(
      '[class*="billing-toggle" i], [class*="pricing-toggle" i], ' +
      '[class*="toggle" i]:has-text("annual"), [class*="toggle" i]:has-text("monthly"), ' +
      'input[type="checkbox"][id*="annual" i], input[type="checkbox"][id*="billing" i]'
    );
    return (await toggle.count()) > 0 && toggle.first().isVisible();
  }

  /**
   * Click the annual billing option on the toggle.
   */
  async selectAnnualBilling(): Promise<void> {
    const annualBtn = this.page.locator(
      'button:has-text("Annual"), label:has-text("Annual"), [aria-label*="annual" i]'
    ).first();
    if (await annualBtn.count() > 0) {
      await annualBtn.click();
    }
  }

  /**
   * Click the monthly billing option on the toggle.
   */
  async selectMonthlyBilling(): Promise<void> {
    const monthlyBtn = this.page.locator(
      'button:has-text("Monthly"), label:has-text("Monthly"), [aria-label*="monthly" i]'
    ).first();
    if (await monthlyBtn.count() > 0) {
      await monthlyBtn.click();
    }
  }

  // ── Pricing tiers ────────────────────────────────────────────────────────────

  /**
   * Return all pricing tier card locators visible on the page.
   */
  async getPricingTierLocators(): Promise<Locator[]> {
    const tierLocator = this.page.locator(
      '[class*="pricing-card" i], [class*="plan-card" i], [class*="price-card" i], ' +
      '[class*="pricing-tier" i], [class*="plan-tier" i], ' +
      '[data-testid*="plan"], [data-testid*="pricing"]'
    );

    const count = await tierLocator.count();

    if (count > 0) return tierLocator.all();

    // Fallback: sections within the pricing section that contain a price
    const pricingSection = this.getPricingSection();
    if (await pricingSection.count() > 0) {
      return pricingSection.locator('div').filter({ hasText: /\$\d+/ }).all();
    }

    return [];
  }

  /**
   * Return the number of distinct pricing tiers visible.
   */
  async getTierCount(): Promise<number> {
    const tiers = await this.getPricingTierLocators();
    return tiers.length;
  }

  /**
   * Return plan names found within the pricing section.
   * CustomerHub's known plans: Onboard, Educate, Engage.
   */
  async getPlanNames(): Promise<string[]> {
    const knownPlans = ['Onboard', 'Educate', 'Engage'];
    const found: string[] = [];

    for (const plan of knownPlans) {
      const el = this.page.locator(`text="${plan}"`).first();
      if (await el.count() > 0) {
        found.push(plan);
      }
    }

    return found;
  }

  /**
   * Return true if any pricing CTA button is visible.
   * Looks for "Get Started" or "Start Free Trial" style buttons within pricing context.
   */
  async hasPricingCTAs(): Promise<boolean> {
    const ctaLocator = this.page.locator(
      '[class*="pricing" i] a, [class*="pricing" i] button, ' +
      '[id*="pricing" i] a, [id*="pricing" i] button'
    ).filter({
      hasText: /get started|start free|try free|sign up|choose|select plan/i,
    });

    if (await ctaLocator.count() > 0) return true;

    // Broader fallback
    const generalCTAs = this.page.getByRole('link', {
      name: /get started|start free|try free/i,
    });
    return (await generalCTAs.count()) > 0;
  }

  /**
   * Return true if free trial messaging is present on the pricing section.
   */
  async hasFreeTrialMessaging(): Promise<boolean> {
    const freeTrialText = this.page.locator(
      'text=/free trial/i, text=/no credit card/i, text=/cancel anytime/i'
    );
    return (await freeTrialText.count()) > 0;
  }

  /**
   * Return true if the pricing section is present and visible.
   */
  async isPricingSectionVisible(): Promise<boolean> {
    const section = this.getPricingSection();
    if (await section.count() === 0) return false;
    return section.isVisible();
  }

  /**
   * Navigate directly to the /pricing page.
   */
  async goToPricingPage(): Promise<void> {
    const pricingUrl = this.config.url.replace(/\/$/, '') + '/pricing';
    await this.page.goto(pricingUrl, { waitUntil: 'domcontentloaded' });
  }
}
