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

test('login user with end date of period', async ({browser}) => {
 const context = await browser.newContext();
 const page = await context.newPage();

 await page.goto('https://api.jeterp-staging.jetruby.cloud/admin/session/new');
 await page.click('text=Log In with Google');

 await page.waitForSelector('input[name="query"]');
 await page.click('a[href="/admin/people/2a409428-b370-4890-bf12-6d91d95cd8d9"]');
 
 await page.waitForSelector('a.btn.btn-primary[href*="/edit"]', { timeout: 10000 });
 await page.click('a.btn.btn-primary[href*="/edit"]');

  await page.waitForSelector('#person_actual_period_attributes_finished_at');
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate-1);
  const dateStr = yesterday.toISOString().split('T')[0];
  await page.fill ('#person_actual_period_attributes_finished_at', dateStr);
  await page.click('input[type="submit"][name="commit"][value="Save"]')
  
  await page.waitForNavigation({ waitUntil: 'networkidle' });
  const toast = page.locator('.alert.alert-info');
  await expect(toast).toBeVisible({ timeout: 5000 });
  await expect(toast).toContainText('Updated successfully.');
});