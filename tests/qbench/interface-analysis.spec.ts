import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('QBench Interface Analysis', () => {
  test('Analyze available elements after login', async ({ page }) => {
    console.log('🔍 Analyzing QBench interface elements...');
    
    const loginPage = new LoginPage(page);
    
    // Step 1: Login
    await loginPage.navigateToLogin();
    
    const username = process.env.QBENCH_USERNAME || 'melvin+qaengineer@qbench.com';
    const password = process.env.QBENCH_PASSWORD || 'umu8kaw3VJQ2tjw.ryj-ba';
    
    // Login using basic selectors
    await page.locator('input[name="email"]').fill(username);
    await page.locator('input[name="password"]').fill(password);
    await page.locator('button[type="submit"]').click();
    
    // Wait for page to load after login
    await page.waitForTimeout(5000);
    
    console.log(`📍 Current URL: ${page.url()}`);
    
    // Step 2: Find all clickable elements that might lead to orders
    console.log('🔍 Looking for navigation elements...');
    
    const allLinks = await page.locator('a').all();
    console.log(`Found ${allLinks.length} links`);
    
    for (const link of allLinks.slice(0, 20)) { // Limit to first 20
      try {
        const href = await link.getAttribute('href');
        const text = await link.textContent();
        const classes = await link.getAttribute('class');
        
        if ((href && href.includes('order')) || (text && text.toLowerCase().includes('order'))) {
          console.log(`🎯 ORDER LINK: "${text}" -> ${href} (classes: ${classes})`);
        }
        
        if (text && (text.toLowerCase().includes('new') || text.toLowerCase().includes('create'))) {
          console.log(`➕ CREATE LINK: "${text}" -> ${href} (classes: ${classes})`);
        }
        
        if (text && text.toLowerCase().includes('workflow')) {
          console.log(`📋 WORKFLOW LINK: "${text}" -> ${href} (classes: ${classes})`);
        }
      } catch (error) {
        // Skip elements that can't be read
      }
    }
    
    // Step 3: Try to find specific navigation patterns
    console.log('🔍 Checking for specific selectors...');
    
    const patterns = [
      { name: 'New Order (href)', selector: 'a[href*="order"]' },
      { name: 'New Order (text)', selector: 'a:has-text("Order")' },
      { name: 'Create button', selector: 'a:has-text("Create")' },
      { name: 'Plus button', selector: 'a:has-text("+")' },
      { name: 'Workflow menu', selector: 'a:has-text("Workflow")' },
      { name: 'Nav menu items', selector: 'nav a, .nav a, .menu a' }
    ];
    
    for (const pattern of patterns) {
      const count = await page.locator(pattern.selector).count();
      console.log(`${pattern.name}: ${count} elements found`);
      
      if (count > 0) {
        const elements = await page.locator(pattern.selector).all();
        for (let i = 0; i < Math.min(count, 3); i++) {
          try {
            const text = await elements[i].textContent();
            const href = await elements[i].getAttribute('href');
            console.log(`  - "${text}" -> ${href}`);
          } catch (error) {
            // Skip elements that can't be read
          }
        }
      }
    }
    
    // Step 4: Try to navigate to /order directly
    console.log('🔍 Testing direct navigation to /order...');
    
    try {
      await page.goto('https://srqaengineer-ba-uat.qbench.net/order');
      await page.waitForTimeout(3000);
      console.log(`✅ Direct navigation to /order successful. Current URL: ${page.url()}`);
      
      // Take screenshot of order page
      await page.screenshot({ 
        path: 'test-results/order-page-direct.png', 
        fullPage: true 
      });
      
      // Look for form elements on order page
      const inputs = await page.locator('input, select, textarea').all();
      console.log(`📝 Found ${inputs.length} form elements on order page`);
      
      for (let i = 0; i < Math.min(inputs.length, 10); i++) {
        try {
          const tagName = await inputs[i].evaluate(el => el.tagName);
          const name = await inputs[i].getAttribute('name');
          const type = await inputs[i].getAttribute('type');
          const placeholder = await inputs[i].getAttribute('placeholder');
          
          console.log(`  - ${tagName}: name="${name}", type="${type}", placeholder="${placeholder}"`);
        } catch (error) {
          // Skip elements that can't be read
        }
      }
      
    } catch (error) {
      console.log(`❌ Direct navigation to /order failed: ${error}`);
    }
    
    console.log('🏁 Interface analysis completed');
  });
});
