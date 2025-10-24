import { expect, Page, test } from '@uq/pw/test';
import { assertAccessibility } from '@uq/pw/lib/axe';
import { dateHasValue, hasAWorkingHelpButton } from './helpers';
import { COLOR_UQPURPLE } from '@uq/pw/lib/constants';

async function selectPriorityType(page: Page, type: string) {
    // open the select
    await page.getByTestId('admin-alerts-form-select-prioritytype').click();
    // choose urgent
    await page.locator(`[data-testid="admin-alerts-form-option-${type}"]`).click();
    await expect(page.getByTestId('admin-alerts-form-prioritytype-input')).toHaveValue(type);
}

test.describe('Alerts Admin Form Pages', () => {
    const numRowsHiddenAsNoDataInfo = 1;
    test.describe('Alert Admin Add page', () => {
        test.beforeEach(async ({ page }) => {
            await page.goto('http://localhost:2020/admin/alerts/add?user=uqstaff');
            await page.setViewportSize({ width: 1300, height: 1000 });
        });

        async function thisManyRemoveButtonsExist(page: Page, buttonId: number) {
            for (let ii = 0; ii <= buttonId; ii++) {
                await expect(page.locator(`[data-testid="admin-alerts-form-start-date-${ii}"] input`)).toBeVisible();
                await expect(page.locator(`[data-testid="admin-alerts-form-end-date-${ii}"] input`)).toBeVisible();
                await expect(page.locator(`[data-testid="admin-alerts-form-row-${ii}"]`)).toHaveText(/Start date/);
                await expect(
                    page
                        .locator(`[data-testid="admin-alerts-form-row-${ii}"]`)
                        .locator(`[data-testid="admin-alerts-form-remove-date-button-${ii}"]`),
                ).toHaveAttribute('aria-label', 'Remove this date set');
            }
            const nextButtonId = buttonId + 1;
            await expect(
                page.locator(`[data-testid="admin-alerts-form-remove-date-button-${nextButtonId}"]`),
            ).not.toBeVisible();
        }

        async function clickMinusButton(page: Page, buttonId: string) {
            await page.getByTestId('admin-alerts-form-remove-date-button-' + buttonId).click();
        }

        async function clickPlusButton(page: Page, buttonId: string) {
            await page.getByTestId('admin-alerts-form-another-date-button-' + buttonId).click();
        }

        test('the "remove a date set button" works', async ({ page }) => {
            await expect(page.getByTestId('admin-alerts-form-add-remove-buttons-0')).toBeVisible();
            await expect(page.getByTestId('admin-alerts-form-remove-date-button-0')).not.toBeVisible(); // no '-' button
            await clickPlusButton(page, '0'); // add a date field
            await thisManyRemoveButtonsExist(page, 1);

            await clickPlusButton(page, '1');
            await thisManyRemoveButtonsExist(page, 2);

            await clickPlusButton(page, '2');
            await thisManyRemoveButtonsExist(page, 3);

            await clickMinusButton(page, '1'); // remove a date field
            await thisManyRemoveButtonsExist(page, 2);
        });

        test('is accessible', async ({ page }) => {
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(
                page
                    .locator('h2')
                    .getByText(/Create alert/)
                    .first(),
            ).toBeVisible();
            await expect(page.getByTestId('admin-alerts-form-add-remove-buttons-0')).toBeVisible();
            await assertAccessibility(page, '[data-testid="StandardPage"]');
        });

        test('buttons have the correct styling initially', async ({ page }) => {
            const helpButton = page.getByTestId('admin-alerts-help-button');
            await expect(helpButton).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
            await expect(helpButton).toHaveCSS('border-color', COLOR_UQPURPLE);
            await expect(helpButton).toHaveCSS('color', COLOR_UQPURPLE);

            const cancelButton = page.getByTestId('admin-alerts-form-button-cancel');
            await expect(cancelButton).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
            await expect(cancelButton).toHaveCSS('border-color', COLOR_UQPURPLE);
            await expect(cancelButton).toHaveCSS('color', COLOR_UQPURPLE);

            const previewButton = page.getByTestId('admin-alerts-form-button-preview');
            await expect(previewButton).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
            await expect(previewButton).toHaveCSS('border-color', 'rgb(255, 255, 255)');
            await expect(previewButton).toHaveCSS('color', COLOR_UQPURPLE);

            const saveButton = page.getByTestId('admin-alerts-form-button-save');
            // before fields entered, Save button looks disabled
            await expect(saveButton).toHaveCSS('background-color', 'rgba(0, 0, 0, 0.12)');
            await expect(saveButton).toHaveCSS('border-color', 'rgba(0, 0, 0, 0.12)');
            await expect(saveButton).toHaveCSS('color', 'rgba(0, 0, 0, 0.26)');

            await page.locator('[data-testid="admin-alerts-form-title"] input').fill('alert title');
            await page
                .locator('[data-testid="admin-alerts-form-body"] textarea')
                .first()
                .fill('the body');
        });
        test('an url must be valid', async ({ page }) => {
            await page.locator('[data-testid="admin-alerts-form-checkbox-linkrequired"] input').check();
            await page.locator('[data-testid="admin-alerts-form-link-title"] input').fill('Read more');
            await page.locator('[data-testid="admin-alerts-form-link-url"] input').fill('http://x.c');
            await expect(page.getByTestId('admin-alerts-form-link-url')).toHaveClass(/Mui-error/);
            // one more character
            await page.locator('[data-testid="admin-alerts-form-link-url"] input').pressSequentially('o');
            await expect(page.getByTestId('admin-alerts-form-link-url')).not.toHaveClass(/Mui-error/);
        });
        test('can save an alert (simple)', async ({ page }) => {
            await page.locator('[data-testid="admin-alerts-form-title"] input').fill('alert title 3');

            // this solves many coverage issues! Actually test of preview happens in e2e
            const previewButton = page.getByTestId('admin-alerts-form-button-preview');
            await previewButton.click();
            // then hide it again
            await previewButton.click();

            await page
                .locator('[data-testid="admin-alerts-form-body"] textarea')
                .first()
                .fill('body 3');
            await page.getByTestId('admin-alerts-form-button-save').click();
            await expect(page.getByTestId('confirm-alert-add-save-succeeded')).toBeVisible();
            await expect(
                page
                    .locator('.MuiDialog-container')
                    .getByText(/An alert has been added/)
                    .first(),
            ).toBeVisible();
            // click 'add another alert' button in dialog
            await page.getByTestId('confirm-alert-add-save-succeeded').click();
            await expect(page).toHaveURL('http://localhost:2020/admin/alerts/add?user=uqstaff');
            // the alert page reloads with a blank form
            await expect(page.locator('[data-testid="admin-alerts-form-title"] input')).toHaveValue('');
            await expect(page.locator('[data-testid="admin-alerts-form-body"] textarea').first()).toHaveValue('');
        });
        test('can save an alert (more complex)', async ({ page }) => {
            await page.locator('[data-testid="admin-alerts-form-title"] input').fill('alert title 4');
            await page
                .locator('[data-testid="admin-alerts-form-body"] textarea')
                .first()
                .fill('body 4');
            await selectPriorityType(page, 'urgent');
            await page.locator('[data-testid="admin-alerts-form-checkbox-permanent"] input').check();
            await expect(page.getByTestId('admin-alerts-form-link-title')).not.toBeVisible();
            await expect(page.getByTestId('admin-alerts-form-link-url')).not.toBeVisible();
            await page.locator('[data-testid="admin-alerts-form-checkbox-linkrequired"] input').check();
            await page.locator('[data-testid="admin-alerts-form-link-title"] input').fill('Read more');
            await page.locator('[data-testid="admin-alerts-form-link-url"] input').fill('http://example.com/');

            await page.getByTestId('admin-alerts-form-button-save').click();
            await expect(page.getByTestId('confirm-alert-add-save-succeeded')).toBeVisible();
            await expect(
                page
                    .locator('.MuiDialog-container')
                    .getByText(/An alert has been added/)
                    .first(),
            ).toBeVisible();
            // click 'View alert list' button in dialog
            await page.getByTestId('cancel-alert-add-save-succeeded').click();
            // reloads list page (sadly it is mock data so we cant test for the presence of the new alert)
            await expect(page).toHaveURL('http://localhost:2020/admin/alerts');
            await expect(page.locator('[data-testid="admin-alerts-list-current-list"] tbody tr')).toHaveCount(
                1 + numRowsHiddenAsNoDataInfo,
            );
            // then we click the add button and see an empty form
            await page.getByTestId('admin-alerts-add-button').click();
            await expect(page.getByTestId('standard-card-create-alert')).toBeVisible();
            await expect(page).toHaveURL('http://localhost:2020/admin/alerts/add');
            await expect(page.locator('[data-testid="admin-alerts-form-title"] input')).toHaveValue('');
            await expect(page.locator('[data-testid="admin-alerts-form-body"] textarea').first()).toHaveValue('');
            await expect(page.getByTestId('confirm-alert-add-save-succeeded')).not.toBeVisible();
        });
        test('has a working Help button on the Add page', async ({ page }) => {
            await hasAWorkingHelpButton(page);
        });
        test('buttons are disabled unless the form is valid', async ({ page }) => {
            await expect(page.getByTestId('admin-alerts-form-button-preview')).not.toBeDisabled(); // preview button is always available
            await expect(page.getByTestId('admin-alerts-form-button-save')).toBeDisabled();

            await page.locator('[data-testid="admin-alerts-form-title"] input').fill('alert title 5');
            await expect(page.getByTestId('admin-alerts-form-button-preview')).not.toBeDisabled(); // preview button is always available
            await expect(page.getByTestId('admin-alerts-form-button-save')).toBeDisabled();

            await page
                .locator('[data-testid="admin-alerts-form-body"] textarea')
                .first()
                .fill('body 5');
            await expect(page.getByTestId('admin-alerts-form-button-preview')).not.toBeDisabled();
            await expect(page.getByTestId('admin-alerts-form-button-save')).not.toBeDisabled();

            await page.locator('[data-testid="admin-alerts-form-checkbox-linkrequired"] input').check();
            await expect(page.getByTestId('admin-alerts-form-button-preview')).not.toBeDisabled(); // preview button is always available
            await expect(page.getByTestId('admin-alerts-form-button-save')).toBeDisabled();

            await page.locator('[data-testid="admin-alerts-form-link-title"] input').fill('read more');
            await expect(page.getByTestId('admin-alerts-form-button-preview')).not.toBeDisabled(); // preview button is always available
            await expect(page.getByTestId('admin-alerts-form-button-save')).toBeDisabled();

            // start an url, but button are disabled while it isn't valid
            await page.locator('[data-testid="admin-alerts-form-link-url"] input').fill('http');
            await expect(page.getByTestId('admin-alerts-form-button-preview')).not.toBeDisabled(); // preview button is always available
            await expect(page.getByTestId('admin-alerts-form-button-save')).toBeDisabled();

            // complete to a valid url and the buttons are enabled
            await page.locator('[data-testid="admin-alerts-form-link-url"] input').pressSequentially('://example.com');
            await expect(page.getByTestId('admin-alerts-form-button-preview')).not.toBeDisabled();
            await expect(page.getByTestId('admin-alerts-form-button-save')).not.toBeDisabled();
        });
    });
    test.describe('Alert Admin Edit page Special', () => {
        test('if a non existing record is requested the edit form pops an error', async ({ page }) => {
            // this alert doesn't exist in mock, so an error pops up on edit
            await page.goto(
                'http://localhost:2020/admin/alerts/edit/232d6880-996a-11eb-8a79-e7fddae87baf?user=uqstaff',
            );
            await page.setViewportSize({ width: 1300, height: 1000 });
            // the ok button on the error returns to the list page
            await page.locator('button[data-testid="confirm-alert-error"]').click();
            await expect(page).toHaveURL('http://localhost:2020/admin/alerts');
            await expect(page.locator('button[data-testid="confirm-alert-error"]')).not.toBeVisible();
        });
    });
    test.describe('Alert Admin Edit page', () => {
        test.beforeEach(async ({ page }) => {
            await page.goto(
                'http://localhost:2020/admin/alerts/edit/1db618c0-d897-11eb-a27e-df4e46db7245?user=uqstaff',
            );
            await page.setViewportSize({ width: 1300, height: 1000 });
        });
        test('is accessible', async ({ page }) => {
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(
                page
                    .locator('h2')
                    .getByText(/Edit alert/)
                    .first(),
            ).toBeVisible();
            await expect(page.getByTestId('admin-alerts-form-checkbox-linkrequired')).toBeVisible();
            await assertAccessibility(page, '[data-testid="StandardPage"]');
        });
        test('the edit form presets the correct data', async ({ page }) => {
            await expect(page.getByTestId('admin-alerts-form-checkbox-linkrequired')).toBeVisible();
            await expect(page.locator('[data-testid="admin-alerts-form-title"] input')).toHaveValue('Example alert:');
            await expect(
                page
                    .getByTestId('admin-alerts-form-body')
                    .getByText(/This alert can be edited in mock\./)
                    .first(),
            ).toBeVisible();
            await dateHasValue(page, '[data-testid="admin-alerts-form-start-date-0"] input', '2021-06-29T15:00');
            await dateHasValue(page, '[data-testid="admin-alerts-form-end-date-0"] input', '2031-07-02T18:30');
            await expect(page.locator('[data-testid="admin-alerts-form-checkbox-linkrequired"] input')).toBeChecked();
            await expect(page.locator('[data-testid="admin-alerts-form-checkbox-permanent"] input')).toBeChecked();
            await selectPriorityType(page, 'urgent');
            await expect(page.locator('[data-testid="admin-alerts-form-link-title"] input')).toHaveValue(
                'UQ community COVID-19 advice',
            );
            await expect(page.locator('[data-testid="admin-alerts-form-link-url"] input')).toHaveValue(
                'https://about.uq.edu.au/coronavirus',
            );
            await page.goto(
                'http://localhost:2020/admin/alerts/edit/dc64fde0-9969-11eb-8dc3-1d415ccc50ec?user=uqstaff',
            );
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.getByTestId('admin-alerts-form-checkbox-linkrequired')).toBeVisible();
            await expect(page.locator('[data-testid="admin-alerts-form-title"] input')).toHaveValue('Sample alert 2:');
            await expect(
                page
                    .getByTestId('admin-alerts-form-body')
                    .getByText(/Has mock data\./)
                    .first(),
            ).toBeVisible();
            await dateHasValue(page, '[data-testid="admin-alerts-form-start-date-0"] input', '2021-06-06T00:45');
            await dateHasValue(page, '[data-testid="admin-alerts-form-end-date-0"] input', '2021-06-06T05:00');
            await expect(
                page.locator('[data-testid="admin-alerts-form-checkbox-linkrequired"] input'),
            ).not.toBeChecked();
            await expect(page.locator('[data-testid="admin-alerts-form-checkbox-permanent"] input')).not.toBeChecked();
            await selectPriorityType(page, 'info');
            await expect(page.locator('[data-testid="admin-alerts-form-link-title"] input')).not.toBeVisible();
            await expect(page.locator('[data-testid="admin-alerts-form-link-url"] input')).not.toBeVisible();
            await expect(
                page.locator('[data-testid="admin-alerts-form-checkbox-system-homepage"] input'),
            ).toBeChecked();
            await expect(page.locator('[data-testid="admin-alerts-form-checkbox-system-primo"] input')).toBeChecked();

            // the editing user displays correctly
            await expect(page.getByTestId('admin-alerts-form-created-by')).not.toBeVisible();
            await expect(page.getByTestId('admin-alerts-form-updated-by')).toHaveText(/Last Updated by: uqtest2/);
        });
        test('has a working Edit form', async ({ page }) => {
            const saveButton = page.getByTestId('admin-alerts-form-button-save');

            await expect(page.getByTestId('admin-alerts-form-checkbox-linkrequired')).toBeVisible();
            await expect(saveButton).toBeDisabled();

            const helpButton = page.getByTestId('admin-alerts-help-button');
            await expect(helpButton).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
            await expect(helpButton).toHaveCSS('border-color', COLOR_UQPURPLE);
            await expect(helpButton).toHaveCSS('color', COLOR_UQPURPLE);

            const cancelButton = page.getByTestId('admin-alerts-form-button-cancel');
            await expect(cancelButton).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
            await expect(cancelButton).toHaveCSS('border-color', COLOR_UQPURPLE);
            await expect(cancelButton).toHaveCSS('color', COLOR_UQPURPLE);

            const previewButton = page.getByTestId('admin-alerts-form-button-preview');
            await expect(previewButton).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
            await expect(previewButton).toHaveCSS('border-color', 'rgb(255, 255, 255)');
            await expect(previewButton).toHaveCSS('color', COLOR_UQPURPLE);

            // before fields entered, Save button looks disabled
            await expect(saveButton).toHaveCSS('background-color', 'rgba(0, 0, 0, 0.12)');
            await expect(saveButton).toHaveCSS('border-color', 'rgba(0, 0, 0, 0.12)');
            await expect(saveButton).toHaveCSS('color', 'rgba(0, 0, 0, 0.26)');

            await page.locator('[data-testid="admin-alerts-form-title"] input').fill('Updated alert');
            await expect(saveButton).not.toBeDisabled();
            // after fields entered, looks like Primary button
            await expect(saveButton).toHaveCSS('background-color', COLOR_UQPURPLE);
            await expect(saveButton).toHaveCSS('border-color', COLOR_UQPURPLE);
            await expect(saveButton).toHaveCSS('color', 'rgb(255, 255, 255)');

            // after clicking, the preview button looks like Primary button
            await previewButton.click();
            await expect(previewButton).toHaveCSS('background-color', COLOR_UQPURPLE);
            await expect(previewButton).toHaveCSS('border-color', COLOR_UQPURPLE);
            await expect(previewButton).toHaveCSS('color', 'rgb(255, 255, 255)');

            await saveButton.click();
            await expect(
                page
                    .locator('[data-testid="dialogbox-alert-edit-save-succeeded"] h2')
                    .getByText(/The alert has been updated/)
                    .first(),
            ).toBeVisible();
            // can't do much checking here that it saves properly
            await page.locator('button[data-testid="confirm-alert-edit-save-succeeded"]').click();
            await expect(page).toHaveURL('http://localhost:2020/admin/alerts');
        });
        test('changing a system enables the save button', async ({ page }) => {
            await expect(page.getByTestId('admin-alerts-form-checkbox-linkrequired')).toBeVisible();

            // the editing user displays correctly
            await expect(page.getByTestId('admin-alerts-form-created-by')).toHaveText(/Created by: uqtest1/);
            await expect(page.getByTestId('admin-alerts-form-updated-by')).toHaveText(/Last Updated by: uqtest2/);
            await expect(page.getByTestId('admin-alerts-form-button-save')).toBeDisabled();
            await expect(
                page.locator('[data-testid="admin-alerts-form-checkbox-system-primo"] input'),
            ).not.toBeChecked();
            await page.locator('[data-testid="admin-alerts-form-checkbox-system-primo"] input').check();
            await expect(page.getByTestId('admin-alerts-form-button-save')).not.toBeDisabled();
            await page.getByTestId('admin-alerts-form-button-save').click();
            await expect(
                page
                    .locator('[data-testid="dialogbox-alert-edit-save-succeeded"] h2')
                    .getByText(/The alert has been updated/)
                    .first(),
            ).toBeVisible();
            // can't do much checking here that it saves properly
            await page.locator('button[data-testid="confirm-alert-edit-save-succeeded"]').click();
            await expect(page).toHaveURL('http://localhost:2020/admin/alerts');
        });
        test('has a working Help button on the Edit page', async ({ page }) => {
            await hasAWorkingHelpButton(page);
        });
        test('tells the user which systems the alert will appear on', async ({ page }) => {
            await page.goto(
                'http://localhost:2020/admin/alerts/edit/dc64fde0-9969-11eb-8dc3-1d415ccc50ec?user=uqstaff',
            );
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(
                page
                    .getByTestId('admin-alerts-form-checkbox-system-homepage')
                    .locator('..')
                    .getByText(/Home page/)
                    .first(),
            ).toBeVisible();
            await expect(
                page.locator('[data-testid="admin-alerts-form-checkbox-system-homepage"] input'),
            ).toBeChecked();
            await expect(
                page
                    .getByTestId('admin-alerts-form-checkbox-system-primo')
                    .locator('..')
                    .getByText(/Primo/)
                    .first(),
            ).toBeVisible();
            await expect(page.locator('[data-testid="admin-alerts-form-checkbox-system-primo"] input')).toBeChecked();
        });
    });
    test.describe('Alert Admin Clone page', () => {
        test.beforeEach(async ({ page }) => {
            await page.goto(
                'http://localhost:2020/admin/alerts/clone/1db618c0-d897-11eb-a27e-df4e46db7245?user=uqstaff',
            );
            await page.setViewportSize({ width: 1300, height: 1000 });
        });
        test('is accessible', async ({ page }) => {
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(
                page
                    .locator('h2')
                    .getByText(/Clone alert/)
                    .first(),
            ).toBeVisible();
            await expect(page.getByTestId('admin-alerts-form-checkbox-linkrequired')).toBeVisible();
            await assertAccessibility(page, '[data-testid="StandardPage"]');
        });
        test('can clone an alert and return to list', async ({ page }) => {
            const helpButton = page.getByTestId('admin-alerts-help-button');
            await expect(helpButton).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
            await expect(helpButton).toHaveCSS('border-color', COLOR_UQPURPLE);
            await expect(helpButton).toHaveCSS('color', COLOR_UQPURPLE);

            const cancelButton = page.getByTestId('admin-alerts-form-button-cancel');
            await expect(cancelButton).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
            await expect(cancelButton).toHaveCSS('border-color', COLOR_UQPURPLE);
            await expect(cancelButton).toHaveCSS('color', COLOR_UQPURPLE);

            const previewButton = page.getByTestId('admin-alerts-form-button-preview');
            await expect(previewButton).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
            await expect(previewButton).toHaveCSS('border-color', 'rgb(255, 255, 255)');
            await expect(previewButton).toHaveCSS('color', COLOR_UQPURPLE);

            await expect(page.getByTestId('admin-alerts-form-checkbox-linkrequired')).toBeVisible();
            await expect(
                page
                    .locator('h2')
                    .getByText(/Clone alert/)
                    .first(),
            ).toBeVisible();
            await page.locator('[data-testid="admin-alerts-form-title"] input').focus();
            await page.locator('[data-testid="admin-alerts-form-title"] input').clear();
            await expect(page.getByTestId('admin-alerts-form-created-by')).not.toBeVisible();
            await expect(page.getByTestId('admin-alerts-form-updated-by')).not.toBeVisible();
            await page.locator('[data-testid="admin-alerts-form-title"] input').fill('alert title 7');

            // // before fields entered, Save button looks disabled
            const saveButton = page.getByTestId('admin-alerts-form-button-save');
            await expect(saveButton).toHaveCSS('background-color', COLOR_UQPURPLE);
            await expect(saveButton).toHaveCSS('border-color', COLOR_UQPURPLE);
            await expect(saveButton).toHaveCSS('color', 'rgb(255, 255, 255)');

            await page.locator('[data-testid="admin-alerts-form-title"] input').fill('Updated alert');
            await expect(saveButton).not.toBeDisabled();
            // after fields entered, looks like Primary button
            await expect(saveButton).toHaveCSS('background-color', COLOR_UQPURPLE);
            await expect(saveButton).toHaveCSS('border-color', COLOR_UQPURPLE);
            await expect(saveButton).toHaveCSS('color', 'rgb(255, 255, 255)');

            // after clicking, the preview button looks like Primary button
            await previewButton.click();
            await expect(previewButton).toHaveCSS('background-color', COLOR_UQPURPLE);
            await expect(previewButton).toHaveCSS('border-color', COLOR_UQPURPLE);
            await expect(previewButton).toHaveCSS('color', 'rgb(255, 255, 255)');

            await saveButton.click();
            await expect(page.getByTestId('confirm-alert-clone-save-succeeded')).toBeVisible();
            await expect(
                page
                    .locator('.MuiDialog-container')
                    .getByText(/The alert has been cloned/)
                    .first(),
            ).toBeVisible();
            // click 'view alert list' button in dialog
            await page.getByTestId('cancel-alert-clone-save-succeeded').click();
            // the alert list reloads
            await expect(page).toHaveURL('http://localhost:2020/admin/alerts');
            await expect(page.getByTestId('admin-alerts-list-future-list')).toBeVisible();
        });
        test('can clone an alert and then clone again', async ({ page }) => {
            await expect(page.getByTestId('admin-alerts-form-checkbox-linkrequired')).toBeVisible();
            await expect(
                page
                    .locator('h2')
                    .getByText(/Clone alert/)
                    .first(),
            ).toBeVisible();
            await page.locator('[data-testid="admin-alerts-form-title"] input').focus();
            await page.locator('[data-testid="admin-alerts-form-title"] input').clear();
            await page.locator('[data-testid="admin-alerts-form-title"] input').fill('alert title 10');
            // click "Add new"
            await page.getByTestId('admin-alerts-form-button-save').click();
            await expect(page.getByTestId('confirm-alert-clone-save-succeeded')).toBeVisible();
            await expect(
                page
                    .locator('.MuiDialog-container')
                    .getByText(/The alert has been cloned/)
                    .first(),
            ).toBeVisible();
            // click 'clone again' button in dialog
            await page.getByTestId('confirm-alert-clone-save-succeeded').click();
            await expect(page).toHaveURL(
                'http://localhost:2020/admin/alerts/clone/1db618c0-d897-11eb-a27e-df4e46db7245?user=uqstaff',
            );
            // click "Add new"
            await page.getByTestId('admin-alerts-form-button-save').click();
            await expect(page.getByTestId('confirm-alert-clone-save-succeeded')).toBeVisible();
            await expect(
                page
                    .locator('.MuiDialog-container')
                    .getByText(/The alert has been cloned/)
                    .first(),
            ).toBeVisible();
        });

        async function clickPlusButton(page: Page, buttonId: string) {
            await page.getByTestId('admin-alerts-form-another-date-button-' + buttonId).click();
        }

        test('the "add a date set button" works', async ({ page }) => {
            await expect(page.locator('[data-testid="admin-alerts-form-start-date-0"] input')).toBeVisible();
            await expect(page.locator('[data-testid="admin-alerts-form-end-date-0"] input')).toBeVisible();
            await page.getByTestId('admin-alerts-form-another-date-button-0').click();
            await expect(page.locator('[data-testid="admin-alerts-form-start-date-1"] input')).toBeVisible();
            await expect(page.locator('[data-testid="admin-alerts-form-end-date-1"] input')).toBeVisible();
            await expect(page.getByTestId('admin-alerts-form-another-date-button-0')).not.toBeVisible();
            await page.getByTestId('admin-alerts-form-another-date-button-1').click();
            await expect(page.locator('[data-testid="admin-alerts-form-start-date-2"] input')).toBeVisible();
            await expect(page.locator('[data-testid="admin-alerts-form-end-date-2"] input')).toBeVisible();
            await expect(page.getByTestId('admin-alerts-form-another-date-button-0')).not.toBeVisible();
            await expect(page.getByTestId('admin-alerts-form-another-date-button-1')).not.toBeVisible();
            await expect(page.getByTestId('admin-alerts-form-another-date-button-2')).toBeVisible();
            await page.locator('button[data-testid="admin-alerts-form-button-save"]').click();
            await expect(page.getByTestId('confirm-alert-clone-save-succeeded')).toBeVisible();

            await page.getByTestId('confirm-alert-clone-save-succeeded').click();
            await expect(page.locator('[data-testid="admin-alerts-form-start-date-0"] input')).toBeVisible();
            await expect(page.locator('[data-testid="admin-alerts-form-end-date-0"] input')).toBeVisible();
            await clickPlusButton(page, '0');
            await expect(page.locator('[data-testid="admin-alerts-form-start-date-1"] input')).toBeVisible();
            await expect(page.locator('[data-testid="admin-alerts-form-end-date-1"] input')).toBeVisible();
            await expect(page.getByTestId('admin-alerts-form-another-date-button-0')).not.toBeVisible();
            await expect(page.getByTestId('admin-alerts-form-another-date-button-1')).toBeVisible();

            await page.locator('button[data-testid="admin-alerts-form-button-save"]').click();
            await expect(page.getByTestId('confirm-alert-clone-save-succeeded')).toBeVisible();
        });

        test('has a working Help button on the Clone page', async ({ page }) => {
            await expect(page.getByTestId('admin-alerts-help-button')).toBeVisible();
            await hasAWorkingHelpButton(page);
        });

        test('tells the user which systems the alert will appear on', async ({ page }) => {
            await page.goto(
                'http://localhost:2020/admin/alerts/clone/dc64fde0-9969-11eb-8dc3-1d415ccc50ec?user=uqstaff',
            );
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(
                page
                    .getByTestId('admin-alerts-form-checkbox-system-homepage')
                    .locator('..')
                    .getByText(/Home page/)
                    .first(),
            ).toBeVisible();
            await expect(
                page.locator('[data-testid="admin-alerts-form-checkbox-system-homepage"] input'),
            ).toBeChecked();
            await expect(
                page
                    .getByTestId('admin-alerts-form-checkbox-system-primo')
                    .locator('..')
                    .getByText(/Primo/)
                    .first(),
            ).toBeVisible();
            await expect(page.locator('[data-testid="admin-alerts-form-checkbox-system-primo"] input')).toBeChecked();
            await page.locator('[data-testid="admin-alerts-form-checkbox-system-primo"] input').uncheck();
            await expect(
                page.locator('[data-testid="admin-alerts-form-checkbox-system-primo"] input'),
            ).not.toBeChecked();
            await page.locator('[data-testid="admin-alerts-form-checkbox-system-primo"] input').check();
            await expect(page.locator('[data-testid="admin-alerts-form-checkbox-system-primo"] input')).toBeChecked();
        });
    });
});
