import { test, expect } from '@playwright/test';

test.describe('Permissions for employee', () => {
  let sharedPage;

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    sharedPage = await context.newPage();

    await sharedPage.goto('https://jeterp-staging.jetruby.cloud/');
    await sharedPage.click('text=Continue with SSO');
    await sharedPage.waitForSelector('input[name="username"]');
    await sharedPage.fill('input[name="username"]', 'erp.test+om.administrator@jetruby.com');
    await sharedPage.fill('input[name="password"]', 'ERPtest123!');
    await sharedPage.click('input[type="submit"][value="Sign In"]');
    await sharedPage.waitForSelector('text=Forms', { timeout: 10000 });

    sharedPage.on('response', async (response) => {
      if (response.url().includes('/api/') && response.status() >= 400) {
        const body = await response.text();
        console.error(`❌ Ошибка ${response.status()} на ${response.url()}\n${body}`);
      }
    });
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
    await expect(sharedPage.locator('button:has-text("Save settings")')).toBeVisible();
  });

  test('Open Contact us', async () => {
    const newPagePromise = sharedPage.context().waitForEvent('page');
    await sharedPage.click('a[data-tooltip-content="Contact us"]');
    const newPage = await newPagePromise;
    await newPage.waitForLoadState('networkidle');
    try {
      await expect(newPage.locator('text=Forms').first()).toBeVisible({ timeout: 5000 });
    } catch (error) {
      await expect(newPage.locator('body')).toContainText('Forms', { timeout: 3000 });
    }
    await newPage.close();
  });

  test('Open Guidelines', async () => {
    const newPagePromise = sharedPage.context().waitForEvent('page');
    await sharedPage.click('a[data-tooltip-content="Guidelines"]');
    const newPage = await newPagePromise;
    await newPage.waitForLoadState('networkidle');
    try {
      await expect(newPage.locator('text=Wiki').first()).toBeVisible({ timeout: 5000 });
    } catch (error) {
      await expect(newPage.locator('body')).toContainText('Wiki', { timeout: 3000 });
    }
    await newPage.close();
  });

  test('Open Profile', async () => {
    await sharedPage.click('a.flex[href="/profile"]');
    await expect(sharedPage.locator('h1')).toContainText('Profile');
  });

  test('Open Personnel Accounting', async () => {
    await sharedPage.click('button[data-tooltip-content="Staff Management"]');
    await sharedPage.waitForSelector('ul[data-headlessui-state="open"]');
    await sharedPage.click('a[href="/staff_management/personnel_accounting"]');
    await expect(sharedPage.locator('h1')).toContainText('Personnel Accounting');
  });

  test('Open Office manager', async () => {
    await sharedPage.click('button[data-tooltip-content="Staff Management"]');
    await sharedPage.waitForSelector('ul[data-headlessui-state="open"]');
    await sharedPage.click('a[href="/staff_management/om"]');
    await expect(sharedPage.locator('h1')).toContainText('Office manager');
  });

  test('Open Managerial accounting', async () => {
    await sharedPage.click('button[data-tooltip-content="Staff Management"]');
    await sharedPage.waitForSelector('ul[data-headlessui-state="open"]');
    await sharedPage.click('a[href="/staff_management/ac"]');
    await expect(sharedPage.locator('h1')).toContainText('Managerial accounting');
  });

  test('Open Analytics by unused vacations', async () => {
    await sharedPage.click('button[data-tooltip-content="Staff Management"]');
    await sharedPage.waitForSelector('ul[data-headlessui-state="open"]');
    await sharedPage.click('a[href="/staff_management/va"]');
    await expect(sharedPage.locator('h1')).toContainText('Analytics by unused vacations');
  });

  test.afterAll(async () => {
    if (sharedPage) {
      await sharedPage.context().close();
    }
  });
});
