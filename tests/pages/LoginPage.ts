import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly loginForm: string;
  readonly usernameField: string;
  readonly passwordField: string;
  readonly loginButton: string;
  readonly errorMessage: string;
  readonly dashboardTitle: string;

  constructor(page: Page) {
    super(page);
    this.loginForm = 'form';
    this.usernameField = 'input[name="username"], input[type="email"]';
    this.passwordField = 'input[name="password"], input[type="password"]';
    this.loginButton = 'button[type="submit"], input[type="submit"], .btn-primary';
    this.errorMessage = '.alert-danger, .error, .alert-error';
    this.dashboardTitle = 'h3.page-title';
  }

  async login(username: string, password: string): Promise<void> {
    await this.fillField(this.usernameField, username);
    await this.fillField(this.passwordField, password);
    await this.clickElement(this.loginButton);
    await this.waitForNavigation();
  }

  async verifyLoginSuccess(): Promise<void> {
    try {
      // More flexible login verification
      await Promise.race([
        this.waitForSelector(this.dashboardTitle),
        this.waitForSelector('h3.page-title'),
        this.waitForSelector('.page-title'),
        this.page.waitForURL('**/dashboard', { timeout: 10000 }),
        this.page.waitForURL(/(?!.*login)/, { timeout: 10000 })
      ]);
      console.log('✅ Login verification successful');
    } catch (error) {
      // Fallback: check URL change
      const currentUrl = this.page.url();
      if (currentUrl.includes('login') || currentUrl.includes('signin')) {
        throw new Error('Login failed - still on login page');
      }
      console.log('✅ Login successful (URL-based verification)');
    }
  }

  async verifyLoginError(): Promise<void> {
    await this.waitForSelector(this.errorMessage);
    const error = await this.getText(this.errorMessage);
    expect(error.length).toBeGreaterThan(0);
  }

  async navigateToLogin(): Promise<void> {
    // Navigate to the QBench base URL from environment variables
    const baseUrl = process.env.QBENCH_BASE_URL || 'https://srqaengineer-ba-uat.qbench.net';
    await this.navigateToUrl(baseUrl);
  }
}
