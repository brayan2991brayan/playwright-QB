import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateToUrl(url: string): Promise<void> {
    await this.page.goto(url);
    await this.page.waitForLoadState('networkidle');
  }

  async clickElement(selector: string): Promise<void> {
    await this.page.click(selector);
  }

  async fillField(selector: string, text: string): Promise<void> {
    await this.page.fill(selector, text);
  }

  async selectOption(selector: string, option: string): Promise<void> {
    await this.page.selectOption(selector, option);
  }

  async waitForSelector(selector: string, timeout = 10000): Promise<void> {
    await this.page.waitForSelector(selector, { timeout });
  }

  async getText(selector: string): Promise<string> {
    return await this.page.textContent(selector) || '';
  }

  async isVisible(selector: string): Promise<boolean> {
    return await this.page.isVisible(selector);
  }

  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `test-results/${name}.png` });
  }

  async waitForNavigation(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }
}
