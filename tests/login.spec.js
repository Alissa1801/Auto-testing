import { test, expect } from '@playwright/test';

test('login authorized user', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('https://jeterp-staging.jetruby.cloud/');

    await page.click('text=Continue with SSO');

    await page.waitForSelector('input[name="username"]');

    await page.fill('input[name="username"]', 'erp.test+employee@jetruby.com');
    await page.fill('input[name="password"]', 'ERPtest123!');

    await page.click('input[type="submit"][value="Sign In"]');

    await page.waitForSelector('text=/forms/i', { timeout: 10000 });

    await expect(page.locator('h1.mb-6')).toContainText('Forms');
});