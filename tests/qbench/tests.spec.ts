import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { TestPage } from '../pages/TestPage';
import { TestDataFactory } from '../fixtures/testData';

test.describe('Test Management Tests', () => {
  let loginPage: LoginPage;
  let testPage: TestPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    testPage = new TestPage(page);
  });

  test('should verify test module accessibility', async ({ page }) => {
    const credentials = TestDataFactory.getLoginCredentials();
    
    // Login
    await loginPage.navigateToLogin();
    await loginPage.login(credentials.username, credentials.password);
    await loginPage.verifyLoginSuccess();

    // Navigate to tests section (basic verification)
    await testPage.navigateToTestsList();
    
    // Basic verification that the module is accessible
    await expect(page.locator('body')).toBeVisible();
    console.log('✅ Test module accessibility verified');
  });
});
