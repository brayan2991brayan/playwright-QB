import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export default class OrderPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async navigateToNewOrder(): Promise<void> {
    try {
      await this.page.hover('a:has-text("Workflow")');
      await this.page.waitForTimeout(1000);
      await this.page.click('a:has-text("Workflow")');
      await this.page.waitForTimeout(1000);
      await this.page.click('a:has-text("Orders")');
      await this.page.waitForTimeout(1500);
      await this.page.click('a:has-text("+ New Order"), button:has-text("+ New Order"), .btn:has-text("New Order")');
      await this.page.waitForTimeout(2000);
    } catch (error: any) {
      console.error('Error navigating to new order:', error);
    }
  }

  private async extractOrderId(): Promise<string> {
    const patterns = [
      /order[#\s]*(\w+)/i,
      /id[#:\s]*(\w+)/i,
      /#(\w+)/,
      /(\d+)/
    ];

    // Check URL first
    const currentUrl = this.page.url();
    const urlMatch = currentUrl.match(/order[s]?\/(\w+)/i) || currentUrl.match(/id[=\/](\w+)/i);
    if (urlMatch) return urlMatch[1];

    // Check title and success messages
    const selectors = [
      '.alert-success',
      '.success-message',
      '.notification-success',
      '.flash-success',
      'h1, h2, h3',
      '.page-title',
      '.breadcrumb',
      '.order-header'
    ];

    for (const selector of selectors) {
      try {
        const element = this.page.locator(selector).first();
        if (await element.isVisible()) {
          const text = await element.textContent() || '';
          for (const pattern of patterns) {
            const match = text.match(pattern);
            if (match) return match[1];
          }
        }
      } catch {
        continue;
      }
    }

    return '';
  }

  async createOrder(): Promise<{
    orderId: string;
    customerName: string;
    wasActuallyCreated: boolean;
  }> {
    let customerName = '';
    let wasActuallyCreated = false;
    let actualOrderId = '';

    try {
      // 1. Navigate to new order form
      await this.navigateToNewOrder();
      await this.page.waitForTimeout(2000);

      // 2. Select Customer (Required)
      await this.page.waitForLoadState('networkidle');
      
      await this.page.getByRole('link', { name: 'Select Customer' }).click();
      await this.page.getByRole('option', { name: '— ACME Labs' }).click();
      await this.page.getByRole('link', { name: ' special fields' }).click();
      await this.page.locator('#s2id_autogen1').click();
      await this.page.getByRole('option', { name: 'Melvin Caraang' }).click();
      customerName = 'ACME Labs';

      // 4. Fill Date Received
      await this.page.waitForSelector('input[name*="received" i], input[placeholder*="received" i]', { state: 'visible', timeout: 5000 });
      const today = new Date().toISOString().split('T')[0];
      await this.page.getByRole('textbox', { name: 'Date Received' }).click();
      await this.page.getByRole('cell', { name: '27' }).click();
      
      // 5. Fill Date Completed
      await this.page.getByRole('textbox', { name: 'Date Completed' }).click();
      await this.page.getByRole('cell', { name: '27' }).click();
      await this.page.locator('.tab-content').first().click();  // Click fuera para cerrar el datepicker

      // 5. Click Save Order y esperar la redirección
      await this.page.getByRole('button', { name: 'Save Order' }).click();
      
      // Esperar a que la página se actualice
      await this.page.waitForLoadState('networkidle');
      
      // Esperar a que aparezca el botón Print Order Labels (indica que estamos en la página de la orden)
      await this.page.getByRole('button', { name: 'Print Order Labels' }).waitFor({ state: 'visible', timeout: 15000 });
      
      // Esperar unos segundos más para asegurar que todo está cargado
      await this.page.waitForTimeout(2000);

      // Get order ID and mark as created
      actualOrderId = await this.extractOrderId();
      wasActuallyCreated = true;
    } catch (error: any) {
      console.error('Error during order creation:', error);
    }

    // Ensure we have an order ID
    if (!actualOrderId) {
      actualOrderId = 'ORDER_' + Date.now();
    }

    return {
      orderId: actualOrderId,
      customerName,
      wasActuallyCreated
    };
  }
}
