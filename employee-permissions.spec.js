import { test, expect } from '@playwright/test';

let sharedPage;

test.describe('Permissions for employee', () => {
  test('Authorization', async ({ browser }) => {
    const context = await browser.newContext();
    sharedPage = await context.newPage();

    await sharedPage.goto('https://jeterp-staging.jetruby.cloud/');
    await sharedPage.click('text=Continue with SSO');
    await sharedPage.waitForSelector('input[name="username"]');
    await sharedPage.fill('input[name="username"]', 'erp.test+employee@jetruby.com');
    await sharedPage.fill('input[name="password"]', 'ERPtest123!');
    await sharedPage.click('input[type="submit"][value="Sign In"]');
    await sharedPage.waitForSelector('text=Forms', { timeout: 10000 });
  });

  test('Open Calendar', async () => {
    await sharedPage.click('a[data-tooltip-content="Calendar"]');
    await expect(sharedPage.locator('h1')).toContainText('Calendar');
  });

  test('Open Time tracking', async () => {
    await sharedPage.click('a[data-tooltip-content="Time tracking"]');
    await expect(sharedPage.locator('h1')).toContainText('Time tracking');
  });

  test('Open Payslips', async () => {
    await sharedPage.click('a[data-tooltip-content="Payslips"]');
    await expect(sharedPage.locator('h1')).toContainText('Payslips');
  });

  test('Open Settings', async () => {
    await sharedPage.click('a[data-tooltip-content="Settings"]');
    await expect(sharedPage.locator('.text-xl.font-bold.text-black')).toContainText(
      'Language settings',
    );
  });

  test.afterAll(async () => {
    if (sharedPage) {
      await sharedPage.context().close();
    }
  });
});
