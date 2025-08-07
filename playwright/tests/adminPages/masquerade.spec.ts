import { test, expect } from '../../test';
import { assertAccessibility } from '../../lib/axe';

test.describe('Masquerade', () => {
    test('Masquerade Admin Accessibility', async ({ page }) => {
        await page.goto('/admin/masquerade?user=uqstaff');
        await page.setViewportSize({
            width: 1300,
            height: 1000,
        });
        await expect(
            page
                .locator('[data-testid="masquerade"]')
                .getByText(/Masquerade/)
                .first(),
        ).toBeVisible();
        console.log('Masquerade');
        await assertAccessibility(page, '[data-testid="masquerade"]');
    });
    test('Masquerade Readonly Accessibility', async ({ page }) => {
        await page.goto('/admin/masquerade?user=uqmasquerade');

        await page.setViewportSize({
            width: 1300,
            height: 1000,
        });
        await expect(
            page
                .locator('[data-testid="masquerade"]')
                .getByText(/Masquerade/)
                .first(),
        ).toBeVisible();
        console.log('Masquerade');
        await assertAccessibility(page, '[data-testid="masquerade"]');
    });
    test('unprivileged users cant masquerade', async ({ page }) => {
        await page.goto('/admin/masquerade?user=s1111111');
        await page.setViewportSize({
            width: 1300,
            height: 1000,
        });
        await expect(
            page
                .locator('body')
                .getByText(/The requested page is available to authorised users only\./)
                .first(),
        ).toBeVisible();
    });
    test('readonly users can masquerade', async ({ page }) => {
        page.route('**/auth.library.uq.edu.au/**', route =>
            route.fulfill({ status: 200, body: 'user has navigated to auth for readonly' }),
        );
        await page.goto('/admin/masquerade/?user=uqmasquerade');
        await page.setViewportSize({
            width: 1300,
            height: 1000,
        });
        await page.locator('[data-testid="masquerade-userName"] input').fill('s1111111');
        await page
            .locator('button')
            .getByText(/Masquerade/)
            .first()
            .click();
        await expect(
            page
                .locator('body')
                .getByText(/user has navigated to auth for readonly/)
                .first(),
        ).toBeVisible();
    });
    test('admin users can masquerade', async ({ page }) => {
        page.route('**/auth.library.uq.edu.au/**', route =>
            route.fulfill({ status: 200, body: 'user has navigated to auth for admin' }),
        );
        await page.goto('/admin/masquerade/?user=uqstaff');
        await page.setViewportSize({
            width: 1300,
            height: 1000,
        });
        await expect(
            page
                .locator('body')
                .getByText(/When masquerading/)
                .first(),
        ).toBeVisible();
        await page.locator('[data-testid="masquerade-userName"] input').fill('s1111111');
        await page
            .locator('button')
            .getByText(/Masquerade/)
            .first()
            .click();
        await expect(
            page
                .locator('body')
                .getByText(/user has navigated to auth for admin/)
                .first(),
        ).toBeVisible();
    });
});
