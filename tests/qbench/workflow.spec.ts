import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import OrderPage from '../pages/OrderPage';
import { SamplePage } from '../pages/SamplePage';
import { TestDataFactory } from '../fixtures/testData';

test.describe('QBench Complete Workflow Tests', () => {
  let loginPage: LoginPage;
  let orderPage: OrderPage;
  let samplePage: SamplePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    orderPage = new OrderPage(page);
    samplePage = new SamplePage(page);
    
    // Login before each test
    const credentials = TestDataFactory.getLoginCredentials();
    await loginPage.navigateToLogin();
    await loginPage.login(credentials.username, credentials.password);
    await loginPage.verifyLoginSuccess();
  });

  test('Complete Order Creation Workflow', async ({ page }) => {
    // 1. Create Order
    const result = await orderPage.createOrder();
    
    // Verify order ID
    expect(result.orderId, 'Order ID should be generated').toBeTruthy();
    
    // Verify customer name
    expect(result.customerName).toBe('ACME Labs');
    
    // 4. Verify customer name is visible in the page
    await expect(page.getByText(result.customerName)).toBeVisible({ timeout: 5000 });
    
    // 5. Verify order was created successfully by checking for Print Order Labels button
    await expect(page.getByRole('button', { name: 'Print Order Labels' })).toBeVisible({ timeout: 10000 });

    // 6. Verify we are in the order page
    const url = page.url();
    expect(url).toContain('/order');
    expect(url).toContain(result.orderId);
  });
});
