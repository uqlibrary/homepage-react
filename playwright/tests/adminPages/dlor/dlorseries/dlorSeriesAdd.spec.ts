import { test, expect } from '@uqpw/test';
import { DLOR_ADMIN_USER } from '@uqpw/lib/constants';
import { typeCKEditor } from '@uqpw/lib/ckeditor';
import { assertAccessibility } from '@uqpw/lib/axe';

test.describe('Digital Learning Hub admin Series management - add item', () => {
    test.beforeEach(async ({ page }) => {
        await page.context().clearCookies();
    });
    test.describe('Series management', () => {
        test.beforeEach(async ({ page }) => {
            await page.goto(`http://localhost:2020/admin/dlor/series/add?user=${DLOR_ADMIN_USER}`);
            await page.setViewportSize({ width: 1300, height: 1000 });
        });
        test('loads as expected', async ({ page }) => {
            await expect(page.getByTestId('StandardPage-title')).toHaveText(/Digital Learning Hub - Add Series/);
            await expect(
                page
                    .locator('a[data-testid="dlor-breadcrumb-admin-homelink"]')
                    .getByText(/Digital Learning Hub admin/)
                    .first(),
            ).toHaveAttribute('href', `http://localhost:2020/admin/dlor?user=${DLOR_ADMIN_USER}`);
            await expect(
                page
                    .locator('a[data-testid="dlor-breadcrumb-series-management-link-0"]')
                    .getByText(/Series management/)
                    .first(),
            ).toHaveAttribute('href', `http://localhost:2020/admin/dlor/series/manage?user=${DLOR_ADMIN_USER}`);
            // series name input shows correctly
            await expect(page.locator('[data-testid="series-name"] input')).toBeVisible();
            // CKEditor should show
            await expect(page.locator('[class="ck ck-editor__main"]')).toBeVisible();
            await expect(page.locator('#dragLandingAarea')).toContainText('(None yet)');
        });
        test('is accessible', async ({ page }) => {
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.locator('h1')).toContainText('Digital Learning Hub - Add Series');
            await assertAccessibility(page, '[data-testid="StandardPage"]');
        });
        test('can add a series without objects', async ({ page }) => {
            await expect(
                page
                    .getByTestId('admin-dlor-series-form-button-cancel')
                    .getByText(/Cancel/)
                    .first(),
            ).toBeVisible();

            await page.locator('[data-testid="series-name"] input').fill('Series without objects');
            await typeCKEditor(page, undefined, 'This is a series without any objects');
            await expect(page.locator('#dragLandingAarea')).toContainText('(None yet)');
            await page.getByTestId('admin-dlor-series-form-save-button').click();
            await expect(page.getByTestId('message-title')).toContainText('Series has been created');
        });
        test('can navigate to and from the add series page', async ({ page }) => {
            await expect(
                page
                    .getByTestId('admin-dlor-series-form-button-cancel')
                    .getByText(/Cancel/)
                    .first(),
            ).toBeVisible();

            await page.getByTestId('dlor-breadcrumb-admin-homelink').click();
            await page.getByTestId('admin-dlor-menu-button').click();
            await page.getByTestId('admin-dlor-visit-add-series-button').click();
            await expect(page.getByTestId('StandardPage-title')).toHaveText(/Digital Learning Hub - Add Series/);
        });
    });
});
