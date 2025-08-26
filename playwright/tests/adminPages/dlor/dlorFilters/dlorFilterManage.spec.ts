import { test, expect } from '../../../../test';
import { DLOR_ADMIN_USER } from '../../../../lib/constants';

test.describe('Digital Learning Hub admin filter management', () => {
    test.beforeEach(async ({ page }) => {
        await page.context().clearCookies();
    });
    test.describe('Admin page', () => {
        test('navigates to the filter management page', async ({ page }) => {
            await page.goto(`http://localhost:2020/admin/dlor?user=${DLOR_ADMIN_USER}`);
            await page.getByTestId('admin-dlor-menu-button').click();
            await page.getByTestId('admin-dlor-visit-manage-filters-button').click();
            await expect(page.getByTestId('StandardPage-title')).toContainText(
                'Digital Learning Hub - Facet Management',
            );
        });
    });
    test.describe('filters list', () => {
        test.beforeEach(async ({ page }) => {
            await page.goto(`http://localhost:2020/admin/dlor/filters?user=${DLOR_ADMIN_USER}`);
            await page.setViewportSize({ width: 1300, height: 1000 });
        });
        test('loads as expected', async ({ page }) => {
            await expect(page.getByTestId('StandardPage-title')).toHaveText(/Digital Learning Hub - Facet Management/);
            await expect(
                page
                    .locator('a[data-testid="dlor-breadcrumb-admin-homelink"]')
                    .getByText(/Digital Learning Hub admin/)
                    .first(),
            ).toHaveAttribute('href', `http://localhost:2020/admin/dlor?user=${DLOR_ADMIN_USER}`);
            await expect(
                page
                    .getByTestId('dlor-breadcrumb-facet-management-label-0')
                    .getByText(/Facet management/)
                    .first(),
            ).toBeVisible();
            await expect(page.getByTestId('facet-type-1-name')).toContainText('Topic');
            await expect(page.getByTestId('add-facet-1')).toBeVisible();
        });
        test('Allows the creation of a new filter', async ({ page }) => {
            await expect(page.getByTestId('StandardPage-title')).toHaveText(/Digital Learning Hub - Facet Management/);
            await page.getByTestId('add-facet-1').click();

            await expect(page.locator('#modal-modal-title')).toContainText('Add new facet');
            await expect(page.locator('#modal-modal-existingName')).toContainText('Topic');
            await page.locator('#facet_name').fill('New filter');
            await page.locator('#facet_order').fill('1');

            await page.locator('#facet_help').fill('This is a new filter');
            await page.getByTestId('admin-dlor-filter-confirm-button').click();
            await expect(page.locator('#modal-modal-title')).not.toBeVisible();
        });
        test('Allows the editing of an existing filter', async ({ page }) => {
            await expect(page.getByTestId('StandardPage-title')).toHaveText(/Digital Learning Hub - Facet Management/);
            await page.getByTestId('edit-facet-1').click();

            await expect(page.locator('#modal-modal-title')).toContainText('Edit facet');
            await expect(page.locator('#modal-modal-existingName')).toHaveText(/Original Name/);
            await expect(page.locator('#modal-modal-existingName')).toHaveText(/Aboriginal and Torres Strait Islander/);

            // content entry
            await page.locator('#facet_name').clear();
            await page.locator('#facet_name').fill('Adjusted Name');
            // Original name should still reflect the original name
            await expect(page.locator('#modal-modal-existingName')).toHaveText(/Original Name/);
            await expect(page.locator('#modal-modal-existingName')).toHaveText(/Aboriginal and Torres Strait Islander/);
            await page.locator('#facet_order').fill('2');

            // check input mechanism
            await page.locator('#facet_order').focus();
            await page.locator('#facet_order').press('ArrowUp');
            await page.locator('#facet_order').blur();
            await page.locator('#facet_order').focus();
            await page.locator('#facet_order').press('ArrowDown');

            await page.locator('#facet_show_help').click();
            await page.locator('#facet_help').fill('');
            await page.locator('#facet_help').fill('This is an adjusted filter');
            await page.getByTestId('admin-dlor-filter-confirm-button').click();
            await expect(page.locator('#modal-modal-title')).not.toBeVisible();
        });
        test('Allows for the deletion of filters', async ({ page }) => {
            await expect(page.getByTestId('StandardPage-title')).toHaveText(/Digital Learning Hub - Facet Management/);
            await page.getByTestId('delete-facet-1').click();

            await expect(page.getByTestId('message-title')).toContainText('Delete facet');
            await expect(page.getByTestId('message-content')).toContainText('Aboriginal and Torres Strait Islander');
            await page.getByTestId('confirm-alert-edit-save-succeeded').click();
            await page.getByTestId('delete-facet-1').click();

            await expect(page.getByTestId('message-title')).toContainText('Delete facet');
            await expect(page.getByTestId('message-content')).toContainText('Aboriginal and Torres Strait Islander');
            await page.getByTestId('cancel-alert-edit-save-succeeded').click();
            // popup
        });
    });
});
