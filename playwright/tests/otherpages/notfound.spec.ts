import { test, expect } from '@uq/pw/test';
import { assertAccessibility } from '@uq/pw/lib/axe';

test.describe('not found page accessibility', () => {
    test('unprivileged user on an admin-only page is accessible', async ({ page }) => {
        await page.goto('/admin/alerts?user=s1111111');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(
            page
                .locator('div[id="content-container"]')
                .getByText(/Permission denied/)
                .first(),
        ).toBeVisible();
        await assertAccessibility(page, '[data-testid="StandardPage"]');
    });

    test('non-loggedin user on a page that requires login is accessible', async ({ page }) => {
        await page.goto('/learning-resources?user=public');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(
            page
                .locator('div[id="content-container"]')
                .getByText(/authenticated users only/)
                .first(),
        ).toBeVisible();
        await assertAccessibility(page, '[data-testid="StandardPage"]');
    });

    test('pages that arent available to all logged in users are accessible', async ({ page }) => {
        await page.goto('/learning-resources?user=emcommunity');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(
            page
                .locator('div[id="content-container"]')
                .getByText(/authorised users only/)
                .first(),
        ).toBeVisible();
        await assertAccessibility(page, '[data-testid="StandardPage"]');
    });

    test('genuine 404 is accessible', async ({ page }) => {
        await page.goto('/xxxxxx/?user=vanilla');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(
            page
                .locator('div[id="content-container"]')
                .getByText(/Page not found/)
                .first(),
        ).toBeVisible();
        await assertAccessibility(page, '[data-testid="StandardPage"]');
    });
});

test.describe('authorisation errors', () => {
    test('page that requires Admin returns an error to unprivileged users', async ({ page }) => {
        await page.goto('/admin/alerts?user=s1111111');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(
            page
                .locator('h1')
                .getByText(/Permission denied/)
                .first(),
        ).toBeVisible();
    });
    test('page that isnt available to all logged in users returns an authorisation error for non privileged users', async ({
        page,
    }) => {
        await page.goto('/learning-resources?user=emcommunity');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(page.getByTestId('permission-denied')).toBeVisible();
        await expect(
            page
                .locator('body')
                .getByText(/Permission denied/)
                .first(),
        ).toBeVisible();
    });
    test('page that requires Admin does not return a not found error to privileged users', async ({ page }) => {
        await page.goto('/admin/alerts?user=uqstaff');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(page.getByTestId('page-not-found')).not.toBeVisible();
        await expect(page.locator('h1')).not.toContainText('Permission denied');
    });
    test('page that isnt available to all logged in users does not return an authorisation error for privileged users', async ({
        page,
    }) => {
        await page.goto('/learning-resources?user=s1111111');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(page.getByTestId('permission-denied')).not.toBeVisible();
        await expect(page.locator('h1')).not.toContainText('Permission denied');
    });
});
test.describe('authentication errors', () => {
    test('page that requires login returns an authentication error for non-loggedin user', async ({ page }) => {
        await page.goto('/learning-resources?user=public');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(page.getByTestId('user-not-loggedin')).toBeVisible();
        await expect(
            page
                .locator('body')
                .getByText(/Authentication required/)
                .first(),
        ).toBeVisible();
    });
    test('page that requires login does not return an authentication error for loggedin user', async ({ page }) => {
        await page.goto('/learning-resources?user=uqstaff');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(page.getByTestId('user-not-loggedin')).not.toBeVisible();
    });
});
test.describe('404 errors', () => {
    test('an unknown page generates a not found error', async ({ page }) => {
        await page.goto('/thisPageDoesntExist?user=vanilla');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(
            page
                .locator('body')
                .getByText(/The requested page could not be found\./)
                .first(),
        ).toBeVisible();
        await expect(page.locator('body')).not.toContainText('This page has permanently moved and is now available at');
    });
    test('the course resources page notifies the user of the new url', async ({ page }) => {
        await page.goto('/courseresources?user=public');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(page.locator('body')).not.toContainText('The requested page could not be found.');
        await expect(page.locator('body')).toContainText('This page has permanently moved and is now available at');
    });
});
