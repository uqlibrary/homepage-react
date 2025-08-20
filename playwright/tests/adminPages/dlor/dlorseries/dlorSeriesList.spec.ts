import { test, expect } from '@uq/pw/test';
import { DLOR_ADMIN_USER } from '@uq/pw/lib/constants';
import { assertAccessibility } from '@uq/pw/lib/axe';

test.describe('Digital Learning Hub admin Series management', () => {
    test.beforeEach(async ({ page }) => {
        await page.context().clearCookies();
    });
    test.describe('Series management', () => {
        test.beforeEach(async ({ page }) => {
            await page.goto(`http://localhost:2020/admin/dlor/series/manage?user=${DLOR_ADMIN_USER}`);
            await page.setViewportSize({ width: 1300, height: 1000 });
        });
        test('is accessible', async ({ page }) => {
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.locator('h1')).toContainText('Digital Learning Hub - Series management');
            await assertAccessibility(page, '[data-testid="StandardPage"]', { disabledRules: ['button-name'] });
        });
        test('has breadcrumbs', async ({ page }) => {
            await expect(
                page
                    .getByTestId('subsite-title')
                    .getByText(/Digital learning hub admin/)
                    .first(),
            ).toBeVisible();
        });
        test('loads as expected', async ({ page }) => {
            await expect(
                page
                    .locator('a[data-testid="dlor-breadcrumb-admin-homelink"]')
                    .getByText(/Digital Learning Hub admin/)
                    .first(),
            ).toHaveAttribute('href', `http://localhost:2020/admin/dlor?user=${DLOR_ADMIN_USER}`);
            await expect(
                page
                    .getByTestId('dlor-breadcrumb-series-management-label-0')
                    .getByText(/Series management/)
                    .first(),
            ).toBeVisible();
            // series name shows correctly
            await expect(
                page
                    .getByTestId('dlor-serieslist-panel-1')
                    .getByText(/Advanced literature searching/)
                    .first(),
            ).toBeVisible();
            await expect(
                page
                    .getByTestId('dlor-serieslist-panel-2')
                    .getByText(/Digital Essentials/)
                    .first(),
            ).toBeVisible();
            await expect(
                page
                    .getByTestId('dlor-serieslist-panel-3')
                    .getByText(/EndNote/)
                    .first(),
            ).toBeVisible();
            await expect(
                page
                    .getByTestId('dlor-serieslist-panel-4')
                    .getByText(/Python/)
                    .first(),
            ).toBeVisible();
            await expect(
                page
                    .getByTestId('dlor-serieslist-panel-5')
                    .getByText(/R with RStudio/)
                    .first(),
            ).toBeVisible();
            await expect(
                page
                    .getByTestId('dlor-serieslist-panel-6')
                    .getByText(/Research techniques/)
                    .first(),
            ).toBeVisible();
            await expect(
                page
                    .getByTestId('dlor-serieslist-panel-7')
                    .getByText(/How to find guides/)
                    .first(),
            ).toBeVisible();
            await expect(
                page
                    .getByTestId('dlor-serieslist-panel-8')
                    .getByText(/Indigenising curriculum/)
                    .first(),
            ).toBeVisible();
            await expect(
                page
                    .getByTestId('dlor-serieslist-panel-9')
                    .getByText(/Subject guides/)
                    .first(),
            ).toBeVisible();
            await expect(
                page
                    .getByTestId('dlor-serieslist-panel-null')
                    .getByText(/Not in a series/)
                    .first(),
            ).toBeVisible();

            // there is no delete button where the series has associated objects
            await expect(page.getByTestId('dlor-serieslist-delete-1')).not.toBeVisible();
            await expect(page.getByTestId('dlor-serieslist-delete-2')).not.toBeVisible();
            await expect(page.getByTestId('dlor-serieslist-delete-3')).not.toBeVisible();
            await expect(page.getByTestId('dlor-serieslist-delete-4')).toBeVisible();
            await expect(page.getByTestId('dlor-serieslist-delete-5')).toBeVisible();
            await expect(page.getByTestId('dlor-serieslist-delete-6')).not.toBeVisible();
            await expect(page.getByTestId('dlor-serieslist-delete-7')).toBeVisible();
            await expect(page.getByTestId('dlor-serieslist-delete-8')).not.toBeVisible();
            await expect(page.getByTestId('dlor-serieslist-delete-10')).not.toBeVisible();

            // all have edit buttons
            for (let i = 1; i <= 9; i++) {
                await expect(page.locator(`[data-testid="dlor-serieslist-edit-${i}"]`)).toBeVisible();
            }
            // object counts are correct
            await expect(
                page
                    .getByTestId('dlor-series-object-list-1')
                    .getByText(/2 Objects/)
                    .first(),
            ).toBeVisible();
            await expect(
                page
                    .getByTestId('dlor-series-object-list-2')
                    .getByText(/7 Objects/)
                    .first(),
            ).toBeVisible();
            await expect(
                page
                    .getByTestId('dlor-series-object-list-3')
                    .getByText(/1 Object/)
                    .first(),
            ).toBeVisible();
            await expect(page.getByTestId('dlor-series-object-list-4')).not.toBeVisible();
            await expect(page.getByTestId('dlor-series-object-list-5')).not.toBeVisible();
            await expect(
                page
                    .getByTestId('dlor-series-object-list-6')
                    .getByText(/1 Object/)
                    .first(),
            ).toBeVisible();
            await expect(page.getByTestId('dlor-series-object-list-7')).not.toBeVisible();
            await expect(
                page
                    .getByTestId('dlor-series-object-list-8')
                    .getByText(/1 Object/)
                    .first(),
            ).toBeVisible();
            await expect(
                page
                    .getByTestId('dlor-series-object-list-null')
                    .getByText(/other Objects/)
                    .first(),
            ).toBeVisible();
        });
        test('has a working "edit a series" button 1', async ({ page }) => {
            await page.getByTestId('dlor-serieslist-edit-1').click();
            await expect(page).toHaveURL('http://localhost:2020/admin/dlor/series/edit/1?user=dloradmn');
        });
        test('has a working "view a dlor" button', async ({ page }) => {
            // can open a list and click edit
            await page.locator('[data-testid="dlor-series-object-list-1"] summary').click();
            await page.getByTestId('dlor-series-object-list-item-view-2').click();
            await expect(page).toHaveURL(
                'http://localhost:2020/digital-learning-hub/view/98s0_dy5k3_98h4?user=dloradmn',
            );
        });
        test('has a working "edit a dlor" button', async ({ page }) => {
            // can open a list and click edit
            await page.locator('[data-testid="dlor-series-object-list-1"] summary').click();
            await page.getByTestId('dlor-series-object-list-item-2').click();
            await expect(page).toHaveURL('http://localhost:2020/admin/dlor/edit/98s0_dy5k3_98h4?user=dloradmn');
        });
        test('has a working "edit a series" button 2', async ({ page }) => {
            await page.getByTestId('dlor-serieslist-edit-2').click();
            await expect(page).toHaveURL(`http://localhost:2020/admin/dlor/series/edit/2?user=${DLOR_ADMIN_USER}`);
        });
        test('can cancel deletion of a Series', async ({ page }) => {
            // click delete icon on first Object
            await page.getByTestId('dlor-serieslist-delete-4').click();
            // confirm delete box is open
            await expect(
                page
                    .getByTestId('dialogbox-dlor-series-delete-confirm')
                    .getByText(/Do you want to delete this series\?/)
                    .first(),
            ).toBeVisible();
            // say "no, I dont want to delete" and the dialog just closes
            await page
                .getByTestId('cancel-dlor-series-delete-confirm')
                .getByText(/No/)
                .first()
                .click();
            await expect(page.getByTestId('dialogbox-dlor-series-delete-confirm')).not.toBeVisible();
        });
        test('can delete a series', async ({ page }) => {
            // click delete icon on first Object
            await page.getByTestId('dlor-serieslist-delete-4').click();
            // "confirm delete" box is open
            await expect(
                page
                    .getByTestId('dialogbox-dlor-series-delete-confirm')
                    .getByText(/Do you want to delete this series\?/)
                    .first(),
            ).toBeVisible();
            // say "yes"
            await expect(
                page
                    .getByTestId('confirm-dlor-series-delete-confirm')
                    .getByText(/Yes/)
                    .first(),
            ).toBeVisible();
            await page.getByTestId('confirm-dlor-series-delete-confirm').click();

            // it worked!
            await expect(
                page
                    .locator('[data-testid="dialogbox-dlor-series-delete-confirm"] h2')
                    .getByText(/The series has been deleted\./)
                    .first(),
            ).toBeVisible();
            await expect(page.getByTestId('cancel-dlor-series-delete-confirm')).not.toBeVisible();
            await page
                .getByTestId('confirm-dlor-series-delete-confirm')
                .getByText(/Close/)
                .first()
                .click();

            // cant really test it was deleted - that will happen in canary. just confirm the page reloads
            await expect(page.getByTestId('dlor-serieslist-list').locator(':scope > *')).toHaveCount(10);
            // a second delete throws up the correct dialog boxes
            // (and doesnt think it is already done
            await page.getByTestId('dlor-serieslist-delete-4').click();
            // "confirm delete" box is open
            await expect(
                page
                    .getByTestId('dialogbox-dlor-series-delete-confirm')
                    .getByText(/Do you want to delete this series\?/)
                    .first(),
            ).toBeVisible();
            // say "yes"
            await page.getByTestId('confirm-dlor-series-delete-confirm').click();

            // it worked!
            await expect(
                page
                    .locator('[data-testid="dialogbox-dlor-series-delete-confirm"] h2')
                    .getByText(/The series has been deleted\./)
                    .first(),
            ).toBeVisible();
            await expect(page.getByTestId('cancel-dlor-series-delete-confirm')).not.toBeVisible();
            await expect(
                page
                    .getByTestId('confirm-dlor-series-delete-confirm')
                    .getByText(/Close/)
                    .first(),
            ).toBeVisible();

            await page.getByTestId('confirm-dlor-series-delete-confirm').click();
        });
    });
    test.describe('failed actions', () => {
        test.beforeEach(async ({ page }) => {
            await page.goto(
                `http://localhost:2020/admin/dlor/series/manage?user=${DLOR_ADMIN_USER}&responseType=saveError`,
            );
            await page.setViewportSize({ width: 1300, height: 1000 });
        });
        test('a failed api load shows correctly', async ({ page }) => {
            await page.goto(
                `http://localhost:2020/admin/dlor/series/manage?user=${DLOR_ADMIN_USER}&responseType=error`,
            );
            await expect(
                page
                    .getByTestId('dlor-serieslist-error')
                    .getByText(/An error has occurred during the request/)
                    .first(),
            ).toBeVisible();
        });
        test('a failed deletion is handled properly', async ({ page }) => {
            // click delete icon on first Object
            await page.getByTestId('dlor-serieslist-delete-4').click();

            // confirm delete box is open
            await expect(
                page
                    .getByTestId('dialogbox-dlor-series-delete-confirm')
                    .getByText(/Do you want to delete this series\?/)
                    .first(),
            ).toBeVisible();

            // say "yes"
            await page.getByTestId('confirm-dlor-series-delete-confirm').click();

            // it failed! just what we wanted :)
            await expect(
                page
                    .locator('[data-testid="dialogbox-dlor-series-delete-confirm"] h2')
                    .getByText(/An error has occurred during the request and this request cannot be processed\./)
                    .first(),
            ).toBeVisible();
            await expect(page.getByTestId('cancel-dlor-series-delete-confirm')).not.toBeVisible();
            await expect(
                page
                    .getByTestId('confirm-dlor-series-delete-confirm')
                    .getByText(/Close/)
                    .first(),
            ).toBeVisible();

            await page.getByTestId('confirm-dlor-series-delete-confirm').click();
            // cant really test it was deleted - that will happen in canary. just confirm the page reloads
            await expect(page.getByTestId('dlor-serieslist-list').locator(':scope > *')).toHaveCount(10);
        });
    });
    test.describe('user access', () => {
        test('displays an "unauthorised" page to public users', async ({ page }) => {
            await page.goto('http://localhost:2020/admin/dlor/series/manage?user=public');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(
                page
                    .locator('h1')
                    .getByText(/Authentication required/)
                    .first(),
            ).toBeVisible();
        });
        test('displays an "unauthorised" page to non-authorised users', async ({ page }) => {
            await page.goto('http://localhost:2020/admin/dlor/series/manage?user=uqstaff');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(
                page
                    .locator('h1')
                    .getByText(/Permission denied/)
                    .first(),
            ).toBeVisible();
        });
        test('displays correct page for admin users (list)', async ({ page }) => {
            await page.goto(`http://localhost:2020/admin/dlor/series/manage?user=${DLOR_ADMIN_USER}`);
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.locator('h1')).toContainText('Digital Learning Hub - Series management');
        });
    });
});
