import { test, expect } from '@uq/pw/test';
import { assertAccessibility } from '@uq/pw/lib/axe';
import { hasAWorkingHelpButton } from '../../../support/alerts';
import { clickButton, clickSVGButton } from '../../../support/helpers';

test.describe('Alert Admin List page', () => {
    const numRowsHiddenAsNoDataInfo = 1;
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:2020/admin/alerts?user=uqstaff');
        await page.setViewportSize({ width: 1300, height: 1200 });
    });
    test('has breadcrumb', async ({ page }) => {
        await expect(
            page
                .getByTestId('subsite-title')
                .getByText(/Alerts admin/)
                .first(),
        ).toBeVisible();
    });
    test('displays a list of alerts to the authorised user', async ({ page }) => {
        await expect(page.locator('[data-testid="admin-alerts-list-current-list"] tbody tr')).toHaveCount(
            1 + numRowsHiddenAsNoDataInfo,
        );
        await expect(
            page
                .getByTestId('headerRow-count-current')
                .getByText(/1 alert/)
                .first(),
        ).toBeVisible();
        // this alert has all 3 chips
        await expect(page.getByTestId('alert-list-urgent-chip-1db618c0-d897-11eb-a27e-df4e46db7245')).toBeVisible();
        await expect(
            page
                .getByTestId('alert-list-urgent-chip-1db618c0-d897-11eb-a27e-df4e46db7245')
                .getByText(/Urgent/)
                .first(),
        ).toBeVisible();
        await expect(page.getByTestId('alert-list-link-chip-1db618c0-d897-11eb-a27e-df4e46db7245')).toBeVisible();
        await expect(
            page
                .getByTestId('alert-list-link-chip-1db618c0-d897-11eb-a27e-df4e46db7245')
                .getByText(/Link/)
                .first(),
        ).toBeVisible();
        await expect(page.getByTestId('alert-list-permanent-chip-1db618c0-d897-11eb-a27e-df4e46db7245')).toBeVisible();
        await expect(
            page
                .getByTestId('alert-list-permanent-chip-1db618c0-d897-11eb-a27e-df4e46db7245')
                .getByText(/Permanent/)
                .first(),
        ).toBeVisible();

        // the system chips display as expected
        await expect(
            page
                .getByTestId('alert-list-system-chip-1db618c0-d897-11eb-a27e-df4e46db7245-homepage')
                .getByText(/System: Home page/)
                .first(),
        ).toBeVisible();
        await expect(page.locator('[data-testid="admin-alerts-list-future-list"] tbody')).toBeVisible();
        await expect(
            page
                .getByTestId('headerRow-count-scheduled')
                .getByText(/5 alerts/)
                .first(),
        ).toBeVisible();
        await page.locator('[data-testid="admin-alerts-list-future-list"] tbody').scrollIntoViewIfNeeded();
        await expect(
            page.locator('[data-testid="admin-alerts-list-future-list"] tbody').locator(':scope > *'),
        ).toHaveCount(5 + numRowsHiddenAsNoDataInfo);
        await expect(page.locator('[data-testid="admin-alerts-list-future-list"] tfoot')).not.toBeVisible();
        // this alert has no chips
        await expect(page.getByTestId('alert-list-urgent-chip-0aa12a30-996a-11eb-b009-3f6ded4fdb35')).not.toBeVisible();
        await expect(page.getByTestId('alert-list-link-chip-0aa12a30-996a-11eb-b009-3f6ded4fdb35')).not.toBeVisible();
        await expect(
            page.getByTestId('alert-list-permanent-chip-0aa12a30-996a-11eb-b009-3f6ded4fdb35'),
        ).not.toBeVisible();
        await expect(page.getByTestId('admin-alerts-list-past-list')).toBeVisible();
        await expect(
            page
                .getByTestId('headerRow-count-past')
                .getByText(/78 alerts/)
                .first(),
        ).toBeVisible();
        await page.locator('[data-testid="admin-alerts-list-past-list"] tbody').scrollIntoViewIfNeeded();
        await expect(
            page.locator('[data-testid="admin-alerts-list-past-list"] tbody ').locator(':scope > *'),
        ).toHaveCount(5 + numRowsHiddenAsNoDataInfo);
        await expect(
            page
                .locator('[data-testid="admin-alerts-list-past-list"] tfoot')
                .getByText(/1–5 of 78/)
                .first(),
        ).toBeVisible();
    });
    test('is accessible', async ({ page }) => {
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(
            page
                .locator('h2')
                .getByText(/All alerts/)
                .first(),
        ).toBeVisible();
        await expect(page.getByTestId('alert-list-row-1db618c0-d897-11eb-a27e-df4e46db7245')).toBeVisible();
        await assertAccessibility(page, '[data-testid="StandardPage"]');
    });
    test('has a working Help button on the List page', async ({ page }) => {
        await hasAWorkingHelpButton(page);
    });
    test('has a working Add button on the List page', async ({ page }) => {
        await expect(page.getByTestId('admin-alerts-help-display-button')).toBeVisible();
        await page.getByTestId('admin-alerts-help-display-button').click();
        await expect(page).toHaveURL('http://localhost:2020/admin/alerts/add');
    });
    test('has a working Edit button on the List page', async ({ page }) => {
        await clickButton(
            page,
            'button[data-testid="alert-list-item-edit-1db618c0-d897-11eb-a27e-df4e46db7245"]',
            'Edit',
        );
        await expect(page).toHaveURL('http://localhost:2020/admin/alerts/edit/1db618c0-d897-11eb-a27e-df4e46db7245');
    });
    test('an Edit button a long way down the List shows the top of the edit form', async ({ page }) => {
        await page
            .locator('button[data-testid="alert-list-item-edit-0aa12a30-996a-11eb-b009-3f6ded4fdb35"]')
            .scrollIntoViewIfNeeded();
        await clickButton(
            page,
            'button[data-testid="alert-list-item-edit-0aa12a30-996a-11eb-b009-3f6ded4fdb35"]',
            'Edit',
        );
        await expect(page).toHaveURL('http://localhost:2020/admin/alerts/edit/0aa12a30-996a-11eb-b009-3f6ded4fdb35');
        await expect(page.getByTestId('StandardPage').first()).toBeInViewport();
    });
    test('has alert dates formatted as expected', async ({ page }) => {
        // non-past dates dont have the year' time is formatted as expected
        {
            const scope = page.locator('tr[data-testid="alert-list-row-1db618c0-d897-11eb-a27e-df4e46db7245"]');
            await expect(scope.getByText(/Example alert:/).first()).toBeVisible();
            await expect(scope.getByText(/Tue 29 Jun/).first()).toBeVisible();
            await expect(scope.getByText(/3pm/).first()).toBeVisible();
            await expect(scope.getByText(/Wed 2 Jul/).first()).toBeVisible();
            await expect(scope.getByText(/6\.30pm/).first()).toBeVisible();
        }

        // past dates do have the year and a line break
        {
            const scope = page.locator('tr[data-testid="alert-list-row-d23f2e10-d7d6-11eb-a928-71f3ef9d35d9"]');
            await expect(scope.getByText(/Face masks in the Library:/).first()).toBeVisible();
            await expect(scope.getByText(/Mon 28 Jun 2021/).first()).toBeVisible();
            await expect(scope.getByText(/4\.02pm/).first()).toBeVisible();
            await expect(scope.getByText(/Tue 29 Jun 2021/).first()).toBeVisible();
            await expect(scope.getByText(/3pm/).first()).toBeVisible();
        }
    });
    test('can save the paginator default row count selection', async ({ page }) => {
        await expect(
            page.locator('[data-testid="alert-list-past"] [data-testid="admin-alerts-list-paginator-select"]'),
        ).toHaveValue('5');
        await page
            .locator('[data-testid="alert-list-past"] [data-testid="admin-alerts-list-paginator-select"]')
            .selectOption('10');
        await expect(
            page.locator('[data-testid="alert-list-past"] [data-testid="admin-alerts-list-paginator-select"]'),
        ).toHaveValue('10');
        await page.goto('http://localhost:2020/admin/alerts?user=uqstaff');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await page
            .locator('[data-testid="alert-list-past"] [data-testid="admin-alerts-list-paginator-select"]')
            .selectOption('10');
        await expect(
            page.locator('[data-testid="alert-list-past"] [data-testid="admin-alerts-list-paginator-select"]'),
        ).toHaveValue('10');
        await expect(
            page
                .locator('[data-testid="admin-alerts-list-past-list"] tfoot')
                .getByText(/1–10 of 78/)
                .first(),
        ).toBeVisible();
    });
    test('has working Split button actions for current/scheduled alerts', async ({ page }) => {
        await expect(
            page
                .getByTestId('alert-list-item-edit-1db618c0-d897-11eb-a27e-df4e46db7245')
                .getByText(/Edit/)
                .first(),
        ).toBeVisible();
        // the dropdown split button exists but is not open
        await expect(
            page
                .getByTestId('alert-list-arrowicon-1db618c0-d897-11eb-a27e-df4e46db7245')
                .locator('..')
                .locator('..')
                .locator(':scope > *'),
        ).toHaveCount(1);
        // open the split button
        await clickSVGButton(
            page,
            '[data-testid="alert-list-action-block-1db618c0-d897-11eb-a27e-df4e46db7245"] button:nth-of-type(2)',
        );
        await expect(
            page
                .getByTestId('alert-list-arrowicon-1db618c0-d897-11eb-a27e-df4e46db7245')
                .locator('..')
                .locator('..')
                .locator(':scope > *'),
        ).toHaveCount(2);
        // CLONE BUTTON WORKS
        await page.getByTestId('1db618c0-d897-11eb-a27e-df4e46db7245-clone-button').click();
        await expect(page).toHaveURL('http://localhost:2020/admin/alerts/clone/1db618c0-d897-11eb-a27e-df4e46db7245');
        await page.getByTestId('admin-alerts-form-button-cancel').click();
        await expect(page).toHaveURL('http://localhost:2020/admin/alerts');
        await page
            .locator(
                '[data-testid="alert-list-action-block-1db618c0-d897-11eb-a27e-df4e46db7245"] button:nth-of-type(2)',
            )
            .click();
        // DELETE BUTTON WORKS
        await page.getByTestId('1db618c0-d897-11eb-a27e-df4e46db7245-delete-button').click();
        // confirmation appears
        await expect(
            page
                .getByTestId('message-title')
                .getByText(/Remove 1 alert\?/)
                .first(),
        ).toBeVisible();
        await expect(
            page
                .getByTestId('confirm-alert-delete-confirm')
                .getByText(/Proceed/)
                .first(),
        ).toBeVisible();
        await page.getByTestId('confirm-alert-delete-confirm').click();
        // dialog disappears
        await expect(page.getByTestId('dialogbox-alert-delete-confirm')).not.toBeVisible();
        // cant test display further as mock data doesnt actually delete
    });
    test('has working Split button actions for past alerts', async ({ page }) => {
        // VIEW BUTTON WORKS
        await expect(page.getByTestId('alert-list-item-view-d23f2e10-d7d6-11eb-a928-71f3ef9d35d9')).toBeVisible();
        await expect(
            page
                .getByTestId('alert-list-item-view-d23f2e10-d7d6-11eb-a928-71f3ef9d35d9')
                .getByText(/View/)
                .first(),
        ).toBeVisible();
        await page.getByTestId('alert-list-item-view-d23f2e10-d7d6-11eb-a928-71f3ef9d35d9').click();
        // but this is actually showing an error because we dont have the mock data
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(page).toHaveURL('http://localhost:2020/admin/alerts/view/d23f2e10-d7d6-11eb-a928-71f3ef9d35d9');
        await page.goto('http://localhost:2020/admin/alerts?user=uqstaff');
        // the dropdown split button exists but is not open
        await expect(
            page
                .getByTestId('alert-list-arrowicon-d23f2e10-d7d6-11eb-a928-71f3ef9d35d9')
                .locator('..')
                .locator('..')
                .locator(':scope > *'),
        ).toHaveCount(1);
        await page
            .locator(
                '[data-testid="alert-list-action-block-d23f2e10-d7d6-11eb-a928-71f3ef9d35d9"] button:nth-of-type(2)',
            )
            .click();
        await expect(
            page
                .getByTestId('alert-list-arrowicon-d23f2e10-d7d6-11eb-a928-71f3ef9d35d9')
                .locator('..')
                .locator('..')
                .locator(':scope > *'),
        ).toHaveCount(2);
        // CLONE PAGE LINK WORKS
        await expect(page.getByTestId('d23f2e10-d7d6-11eb-a928-71f3ef9d35d9-clone-button')).toBeVisible();
        // but the mock data doesnt exist so we wont try to load it
        // DELETE PAGE LINK WORKS (needs actual test here because the method is slightly different to the checkbox)
        await page.getByTestId('d23f2e10-d7d6-11eb-a928-71f3ef9d35d9-delete-button').click();
        // confirmation appears
        await expect(
            page
                .getByTestId('message-title')
                .getByText(/Remove 1 alert\?/)
                .first(),
        ).toBeVisible();
        await expect(
            page
                .getByTestId('confirm-alert-delete-confirm')
                .getByText(/Proceed/)
                .first(),
        ).toBeVisible();
        await page.getByTestId('confirm-alert-delete-confirm').click();
        // dialog disappears
        await expect(page.getByTestId('dialogbox-alert-delete-confirm')).not.toBeVisible();
        // cant test display further as mock data doesnt actually delete
    });
    test('the footer paginator shows all links when "all" is selected', async ({ page }) => {
        await page
            .locator('[data-testid="admin-alerts-list-past-list"] [data-testid="admin-alerts-list-paginator-select"]')
            .selectOption('All');
        await expect(
            page.locator(
                '[data-testid="admin-alerts-list-past-list"] [data-testid="admin-alerts-list-paginator-select"]',
            ),
        ).toHaveValue('78');
        await expect(
            page.locator('[data-testid="admin-alerts-list-past-list"] tbody ').locator(':scope > *'),
        ).toHaveCount(78 + numRowsHiddenAsNoDataInfo);
        await expect(
            page
                .locator('[data-testid="admin-alerts-list-past-list"] tfoot')
                .getByText(/1–78 of 78/)
                .first(),
        ).toBeVisible();
    });
    test('the footer paginator navigates between pages', async ({ page }) => {
        await expect(
            page
                .locator('[data-testid="admin-alerts-list-past-list"] tfoot')
                .getByText(/1–5 of 78/)
                .first(),
        ).toBeVisible();
        await page.waitForTimeout(1000);
        await page.locator('[data-testid="admin-alerts-list-past-list"] tfoot button:nth-child(3)').click();
        await expect(
            page
                .locator('[data-testid="admin-alerts-list-past-list"] tfoot')
                .getByText(/6–10 of 78/)
                .first(),
        ).toBeVisible();
        await expect(page.locator('[data-testid="admin-alerts-list-past-list"] tbody tr:first-child')).toContainText(
            '[5.00pm] Unexpected performance issues, UQ Library Search',
        );
        await page.locator('[data-testid="admin-alerts-list-past-list"] tfoot button:nth-child(2)').click();
        await expect(
            page
                .locator('[data-testid="admin-alerts-list-past-list"] tfoot')
                .getByText(/1–5 of 78/)
                .first(),
        ).toBeVisible();
        await expect(page.locator('[data-testid="admin-alerts-list-past-list"] tbody tr:first-child')).toContainText(
            'Face masks in the Library',
        );
        await page.locator('[data-testid="admin-alerts-list-past-list"] tfoot button:nth-child(4)').click();
        await expect(
            page
                .locator('[data-testid="admin-alerts-list-past-list"] tfoot')
                .getByText(/76–78 of 78/)
                .first(),
        ).toBeVisible();
        await expect(page.locator('[data-testid="admin-alerts-list-past-list"] tbody tr:first-child')).toContainText(
            'Unexpected issue, print credit top-ups',
        );
        await page.locator('[data-testid="admin-alerts-list-past-list"] tfoot button:nth-child(1)').click();
        await expect(
            page
                .locator('[data-testid="admin-alerts-list-past-list"] tfoot')
                .getByText(/1–5 of 78/)
                .first(),
        ).toBeVisible();
        await expect(page.locator('[data-testid="admin-alerts-list-past-list"] tbody tr:first-child')).toContainText(
            'Face masks in the Library',
        );
    });
    test.describe('Alert Admin deletion', () => {
        test.beforeEach(async ({ page }) => {
            await page.goto('http://localhost:2020/admin/alerts?user=uqstaff');
            await page.setViewportSize({ width: 1300, height: 1400 });
        });
        test('the user can select an alert to delete', async ({ page }) => {
            // select one alert and every thing looks right
            await expect(page.getByTestId('headerRow-current')).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
            await expect(page.locator('[data-testid="headerRow-current"] span.deleteManager')).not.toBeVisible();
            await page.getByTestId('alert-list-item-checkbox-1db618c0-d897-11eb-a27e-df4e46db7245').check();
            await expect(page.getByTestId('headerRow-current')).toHaveCSS('background-color', 'rgb(35, 119, 203)');
            await expect(
                page
                    .locator('[data-testid="headerRow-current"] span.deleteManager span')
                    .getByText(/1 alert selected/)
                    .first(),
            ).toBeVisible();
            await page.getByTestId('alert-list-item-checkbox-1db618c0-d897-11eb-a27e-df4e46db7245').uncheck();
            await expect(page.locator('[data-testid="headerRow-current"] span.deleteManager')).not.toBeVisible();
            await page.getByTestId('alert-list-item-checkbox-0aa12a30-996a-11eb-b009-3f6ded4fdb35').check();
            await page.getByTestId('alert-list-item-checkbox-232d6880-996a-11eb-8a79-e7fddae87baf').check();
            await expect(
                page
                    .locator('[data-testid="headerRow-scheduled"] span.deleteManager span')
                    .getByText(/2 alerts selected/)
                    .first(),
            ).toBeVisible();
            await page.getByTestId('alert-list-item-checkbox-0aa12a30-996a-11eb-b009-3f6ded4fdb35').uncheck();
            await expect(
                page
                    .locator('[data-testid="headerRow-scheduled"] span.deleteManager span')
                    .getByText(/1 alert selected/)
                    .first(),
            ).toBeVisible();
            await page.getByTestId('alert-list-scheduled-delete-button').click();
            await page.getByTestId('cancel-alert-delete-confirm').click();
            await expect(page.getByTestId('dialogbox-alert-delete-confirm')).not.toBeVisible();
        });
        test('the user can clear selected alerts', async ({ page }) => {
            await expect(page.getByTestId('headerRow-scheduled')).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
            await expect(page.locator('[data-testid="headerRow-scheduled"] span.deleteManager')).not.toBeVisible();
            await page.getByTestId('alert-list-item-checkbox-d480b250-9cd8-11eb-88c0-a3882cd6c52e').check();
            await expect(page.getByTestId('headerRow-scheduled')).toHaveCSS('background-color', 'rgb(35, 119, 203)');
            await expect(
                page
                    .locator('[data-testid="headerRow-scheduled"] span.deleteManager span')
                    .getByText(/1 alert selected/)
                    .first(),
            ).toBeVisible();
            await page.getByTestId('alert-list-item-checkbox-857726b0-a19f-11eb-ab5b-bb33418ed6de').check();
            await expect(
                page
                    .locator('[data-testid="headerRow-scheduled"] span.deleteManager span')
                    .getByText(/2 alerts selected/)
                    .first(),
            ).toBeVisible();
            await page.getByTestId('alert-list-scheduled-deselect-button').click();
            await expect(page.locator('[data-testid="headerRow-scheduled"] span.deleteManager')).not.toBeVisible();
        });
        test('the user can delete an alert', async ({ page }) => {
            await page.getByTestId('alert-list-item-checkbox-1db618c0-d897-11eb-a27e-df4e46db7245').check();
            await expect(
                page
                    .locator('[data-testid="headerRow-current"] span span')
                    .getByText(/1 alert selected/)
                    .first(),
            ).toBeVisible();
            await page.getByTestId('alert-list-current-delete-button').click();
            await expect(
                page
                    .getByTestId('confirm-alert-delete-confirm')
                    .getByText(/Proceed/)
                    .first(),
            ).toBeVisible();
            await page.getByTestId('confirm-alert-delete-confirm').click();
            // dialog disappears
            await expect(page.getByTestId('dialogbox-alert-delete-confirm')).not.toBeVisible();
            // cant test display further as mock data doesnt actually delete
        });
        test('reports when a delete fails', async ({ page }) => {
            await page.getByTestId('alert-list-item-checkbox-0aa12a30-996a-11eb-b009-3f6ded4fdb35').check();
            await expect(
                page
                    .locator('[data-testid="headerRow-scheduled"] span span')
                    .getByText(/1 alert selected/)
                    .first(),
            ).toBeVisible();
            await page.getByTestId('alert-list-scheduled-delete-button').click();
            // a confirm dialog popup
            await expect(
                page
                    .getByTestId('confirm-alert-delete-confirm')
                    .getByText(/Proceed/)
                    .first(),
            ).toBeVisible();
            await page.getByTestId('confirm-alert-delete-confirm').click();
            await expect(page.getByTestId('dialogbox-alert-delete-confirm')).not.toBeVisible();
            // failure is reported in a dialog
            await expect(
                page
                    .locator('[data-testid="dialogbox-alert-delete-error-dialog"] h2')
                    .getByText(/Record Deletion was not successful/)
                    .first(),
            ).toBeVisible();
            // dialog can be closed
            await page.getByTestId('confirm-alert-delete-error-dialog').click();
            await expect(page.getByTestId('dialogbox-alert-delete-error-dialog')).not.toBeVisible();
        });
        test('sequential deletion of alerts does not fail', async ({ page }) => {
            await page.getByTestId('alert-list-item-checkbox-d23f2e10-d7d6-11eb-a928-71f3ef9d35d9').check();
            await expect(
                page
                    .locator('[data-testid="headerRow-past"] span span')
                    .getByText(/1 alert selected/)
                    .first(),
            ).toBeVisible();
            await page.getByTestId('alert-list-past-delete-button').click();
            // a confirm dialog popup
            await expect(
                page
                    .getByTestId('confirm-alert-delete-confirm')
                    .getByText(/Proceed/)
                    .first(),
            ).toBeVisible();
            await page.getByTestId('confirm-alert-delete-confirm').click();
            await expect(page.getByTestId('dialogbox-alert-delete-confirm')).not.toBeVisible();
            await page.waitForTimeout(500);
            // the error dialog doesnt appear
            await expect(page.getByTestId('dialogbox-alert-delete-error-dialog')).not.toBeVisible();
            await page.waitForTimeout(1000);
            await page.getByTestId('alert-list-item-checkbox-da181a00-d476-11eb-8596-2540419539a9').check();
            await expect(
                page
                    .locator('[data-testid="headerRow-past"] span span')
                    .getByText(/1 alert selected/)
                    .first(),
            ).toBeVisible();
            await page.getByTestId('alert-list-item-checkbox-cc0ab120-d4a3-11eb-b5ee-6593c1ac8f08').check();
            await expect(
                page
                    .locator('[data-testid="headerRow-past"] span span')
                    .getByText(/2 alerts selected/)
                    .first(),
            ).toBeVisible();
            await page.getByTestId('alert-list-past-delete-button').click();
            // a confirm dialog popup
            await expect(
                page
                    .getByTestId('confirm-alert-delete-confirm')
                    .getByText(/Proceed/)
                    .first(),
            ).toBeVisible();
            await page.getByTestId('confirm-alert-delete-confirm').click();
            await expect(page.getByTestId('dialogbox-alert-delete-confirm')).not.toBeVisible();
            await page.waitForTimeout(500);
            // the error dialog doesnt appear
            await expect(page.getByTestId('dialogbox-alert-delete-error-dialog')).not.toBeVisible();
        });
        test('during delete section checkboxes in other sections are disabled', async ({ page }) => {
            await expect(
                page.getByTestId('alert-list-item-checkbox-1db618c0-d897-11eb-a27e-df4e46db7245'),
            ).not.toBeDisabled();
            await expect(
                page.getByTestId('alert-list-item-checkbox-dc64fde0-9969-11eb-8dc3-1d415ccc50ec'),
            ).not.toBeDisabled();
            await page.getByTestId('alert-list-item-checkbox-da181a00-d476-11eb-8596-2540419539a9').check();
            await expect(
                page.getByTestId('alert-list-item-checkbox-1db618c0-d897-11eb-a27e-df4e46db7245'),
            ).toBeDisabled();
            await expect(
                page.getByTestId('alert-list-item-checkbox-dc64fde0-9969-11eb-8dc3-1d415ccc50ec'),
            ).not.toBeDisabled();
            await page.getByTestId('alert-list-item-checkbox-cc0ab120-d4a3-11eb-b5ee-6593c1ac8f08').check();
            await page.getByTestId('alert-list-item-checkbox-d23f2e10-d7d6-11eb-a928-71f3ef9d35d9').check();
            await expect(
                page.getByTestId('alert-list-item-checkbox-1db618c0-d897-11eb-a27e-df4e46db7245'),
            ).toBeDisabled();
            await expect(
                page.getByTestId('alert-list-item-checkbox-dc64fde0-9969-11eb-8dc3-1d415ccc50ec'),
            ).not.toBeDisabled();
            await page.getByTestId('alert-list-item-checkbox-da181a00-d476-11eb-8596-2540419539a9').uncheck();
            await expect(
                page.getByTestId('alert-list-item-checkbox-1db618c0-d897-11eb-a27e-df4e46db7245'),
            ).toBeDisabled();
            await expect(
                page.getByTestId('alert-list-item-checkbox-dc64fde0-9969-11eb-8dc3-1d415ccc50ec'),
            ).not.toBeDisabled();
            await page.getByTestId('alert-list-item-checkbox-cc0ab120-d4a3-11eb-b5ee-6593c1ac8f08').uncheck();
            await expect(
                page.getByTestId('alert-list-item-checkbox-1db618c0-d897-11eb-a27e-df4e46db7245'),
            ).toBeDisabled();
            await expect(
                page.getByTestId('alert-list-item-checkbox-dc64fde0-9969-11eb-8dc3-1d415ccc50ec'),
            ).not.toBeDisabled();
            await page.getByTestId('alert-list-item-checkbox-d23f2e10-d7d6-11eb-a928-71f3ef9d35d9').uncheck();
            await expect(
                page.getByTestId('alert-list-item-checkbox-1db618c0-d897-11eb-a27e-df4e46db7245'),
            ).not.toBeDisabled();
            await expect(
                page.getByTestId('alert-list-item-checkbox-dc64fde0-9969-11eb-8dc3-1d415ccc50ec'),
            ).not.toBeDisabled();
        });
        test('can unselect all checkboxes with the "X"', async ({ page }) => {
            await expect(
                page.getByTestId('alert-list-item-checkbox-1db618c0-d897-11eb-a27e-df4e46db7245'),
            ).not.toBeDisabled();
            await expect(
                page.getByTestId('alert-list-item-checkbox-dc64fde0-9969-11eb-8dc3-1d415ccc50ec'),
            ).not.toBeDisabled();
            await page.getByTestId('alert-list-item-checkbox-da181a00-d476-11eb-8596-2540419539a9').check();
            await page.getByTestId('alert-list-item-checkbox-cc0ab120-d4a3-11eb-b5ee-6593c1ac8f08').check();
            await page.getByTestId('alert-list-item-checkbox-d23f2e10-d7d6-11eb-a928-71f3ef9d35d9').check();
            await expect(
                page.getByTestId('alert-list-item-checkbox-1db618c0-d897-11eb-a27e-df4e46db7245'),
            ).toBeDisabled();
            await expect(
                page.getByTestId('alert-list-item-checkbox-dc64fde0-9969-11eb-8dc3-1d415ccc50ec'),
            ).not.toBeDisabled();
            await page.getByTestId('alert-list-past-deselect-button').click();
            await expect(
                page.getByTestId('alert-list-item-checkbox-1db618c0-d897-11eb-a27e-df4e46db7245'),
            ).not.toBeDisabled();
            await expect(
                page.getByTestId('alert-list-item-checkbox-dc64fde0-9969-11eb-8dc3-1d415ccc50ec'),
            ).not.toBeDisabled();
            await expect(
                page.getByTestId('alert-list-item-checkbox-da181a00-d476-11eb-8596-2540419539a9'),
            ).not.toBeChecked();
            await expect(
                page.getByTestId('alert-list-item-checkbox-cc0ab120-d4a3-11eb-b5ee-6593c1ac8f08'),
            ).not.toBeChecked();
            await expect(
                page.getByTestId('alert-list-item-checkbox-d23f2e10-d7d6-11eb-a928-71f3ef9d35d9'),
            ).not.toBeChecked();
        });
    });
});
