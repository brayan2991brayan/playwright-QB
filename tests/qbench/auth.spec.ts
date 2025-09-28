import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { TestDataFactory } from '../fixtures/testData';

test.describe('Authentication Tests', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    const credentials = TestDataFactory.getLoginCredentials();
    
    await loginPage.navigateToLogin();
    await loginPage.login(credentials.username, credentials.password);
    await loginPage.verifyLoginSuccess();
  });
});
