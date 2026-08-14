/**
 * src/pages/features.page.ts
 *
 * FeaturesPage models the features and integrations sections of CustomerHub.
 * Covers both the homepage features overview and the dedicated /features page.
 */

import { type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';

export class FeaturesPage extends BasePage {
  // ── Features section ─────────────────────────────────────────────────────────

  private getFeaturesSection(): Locator {
    return this.page.locator(
      '[id*="features" i], [class*="features" i], ' +
      'section:has(h2:text-matches("features", "i"))'
    ).first();
  }

  private getIntegrationsSection(): Locator {
    return this.page.locator(
      '[id*="integrations" i], [class*="integrations" i], ' +
      'section:has(h2:text-matches("integrations", "i"))'
    ).first();
  }

  /**
   * Return true if the main features section is visible.
   */
  async isFeaturesSectionVisible(): Promise<boolean> {
    const section = this.getFeaturesSection();
    if (await section.count() === 0) {
      // Fallback: check for known feature pillar headings anywhere on the page
      const pillars = this.page.locator('h2, h3').filter({
        hasText: /onboard|educate|engage/i,
      });
      return (await pillars.count()) > 0;
    }
    return section.isVisible();
  }

  /**
   * Return the count of feature pillar elements (Onboard, Educate, Engage).
   * CustomerHub has exactly 3 core pillars.
   */
  async getFeaturePillarCount(): Promise<number> {
    const pillars = ['Onboard', 'Educate', 'Engage'];
    let found = 0;
    for (const pillar of pillars) {
      const el = this.page.locator(`h2:has-text("${pillar}"), h3:has-text("${pillar}")`).first();
      if (await el.count() > 0) found++;
    }
    return found;
  }

  /**
   * Return the visible text of all feature pillar headings.
   */
  async getFeaturePillarNames(): Promise<string[]> {
    const pillars = ['Onboard', 'Educate', 'Engage'];
    const found: string[] = [];
    for (const pillar of pillars) {
      const el = this.page.locator(`h2:has-text("${pillar}"), h3:has-text("${pillar}")`).first();
      if (await el.count() > 0) {
        const text = await el.textContent();
        if (text) found.push(text.trim());
      }
    }
    return found;
  }

  /**
   * Return true if the known feature module headings are present.
   * CustomerHub modules: Onboarding Flows, Product Library, Online Courses,
   * Memberships, Private Feed, Stripe Integration, Reporting Dashboard.
   */
  async hasFeatureModules(): Promise<boolean> {
    const moduleKeywords = [
      'Onboarding',
      'Course',
      'Membership',
      'Reporting',
    ];

    for (const keyword of moduleKeywords) {
      const el = this.page.locator(`text*="${keyword}"`).first();
      if (await el.count() > 0) return true;
    }
    return false;
  }

  // ── Integrations section ─────────────────────────────────────────────────────

  /**
   * Return true if the integrations section is visible on the current page.
   */
  async isIntegrationsSectionVisible(): Promise<boolean> {
    const section = this.getIntegrationsSection();
    if (await section.count() === 0) {
      const heading = this.page.locator('h2, h3').filter({ hasText: /integrations/i }).first();
      return (await heading.count()) > 0 && heading.isVisible();
    }
    return section.isVisible();
  }

  /**
   * Return the names of integrations found in the integrations section.
   * CustomerHub known integrations: Stripe, ActiveCampaign, Zapier, HighLevel, Keap, MailChimp, Zoom.
   */
  async getVisibleIntegrationNames(): Promise<string[]> {
    const knownIntegrations = [
      'Stripe',
      'ActiveCampaign',
      'Zapier',
      'HighLevel',
      'Keap',
      'MailChimp',
      'Zoom',
    ];

    const found: string[] = [];
    for (const name of knownIntegrations) {
      const el = this.page.locator(`text="${name}"`).first();
      if (await el.count() > 0) {
        found.push(name);
      }
    }
    return found;
  }

  /**
   * Return the count of integration logo/card elements.
   */
  async getIntegrationCount(): Promise<number> {
    const section = this.getIntegrationsSection();

    // Try scoped count first
    if (await section.count() > 0) {
      const logos = section.locator('img, [class*="logo" i], [class*="partner" i]');
      const count = await logos.count();
      if (count > 0) return count;
    }

    // Fallback: count known integration names on page
    const names = await this.getVisibleIntegrationNames();
    return names.length;
  }

  /**
   * Navigate directly to the /features page.
   */
  async goToFeaturesPage(): Promise<void> {
    const featuresUrl = this.config.url.replace(/\/$/, '') + '/features';
    await this.page.goto(featuresUrl, { waitUntil: 'domcontentloaded' });
  }
}
