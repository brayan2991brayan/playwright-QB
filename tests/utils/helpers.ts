import { Page } from '@playwright/test';

export class DateUtils {
  static getTodayFormatted(): string {
    return new Date().toISOString().split('T')[0];
  }

  static getTomorrowFormatted(): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }

  static getDatePlusDays(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  }

  static getCurrentTimestamp(): string {
    return Date.now().toString();
  }
}

export class WaitUtils {
  static async waitForPageLoad(page: Page): Promise<void> {
    await page.waitForLoadState('networkidle');
  }

  static async waitForElementToBeVisible(page: Page, selector: string, timeout = 10000): Promise<void> {
    await page.waitForSelector(selector, { state: 'visible', timeout });
  }

  static async waitForElementToBeHidden(page: Page, selector: string, timeout = 10000): Promise<void> {
    await page.waitForSelector(selector, { state: 'hidden', timeout });
  }
}

export class StringUtils {
  static generateUniqueId(prefix = ''): string {
    return `${prefix}${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  static sanitizeText(text: string): string {
    return text.trim().replace(/\s+/g, ' ');
  }
}

export class DebugUtils {
  static async logPageTitle(page: Page): Promise<void> {
    const title = await page.title();
    console.log(`Current page title: ${title}`);
  }

  static async logCurrentUrl(page: Page): Promise<void> {
    const url = page.url();
    console.log(`Current URL: ${url}`);
  }

  static async logElementText(page: Page, selector: string): Promise<void> {
    try {
      const text = await page.textContent(selector);
      console.log(`Element ${selector} text: ${text}`);
    } catch (error) {
      console.log(`Element ${selector} not found or error: ${error}`);
    }
  }
}
