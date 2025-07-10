import {test, expect} from '@playwright/test';

test('login authorized user', async ({browser}) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto ('https://jeterp-staging.jetruby.cloud/');

    const [KeycloakPage] = await Promise.all([
        context.waitForEvent('page'),
        page.click('text=Continue with SSO')
    ]);

    await KeycloakPage.waitForLoadState();

    await KeycloakPage.waitForSelector('input[name="username"]');

    await KeycloakPage.fill('input[name="username"]', 'erp.test+employee@jetruby.com');
    await KeycloakPage.fill ('input[name="password"]', 'ERPtest123!');

    await Promise.all([
        page.waitForNavigation(),
        page.click('text=Sign in')
    ]);

    await expect (KeycloakPage.locator('text=Forms')).toBeVisible();
});