import { test, expect, Page } from '@uq/pw/test';
import { assertAccessibility } from '@uq/pw/lib/axe';
import { assertTitles, forcePageRefresh, getFieldValue } from '@uq/pw/tests/adminPages/testandtag/helpers';
import { default as locale } from '../../../../../src/modules/Pages/Admin/TestTag/testTag.locale';

test.describe('Test and Tag manage inspection devices', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:2020/admin/testntag/manage/inspectiondevices?user=uqtesttag');
    });

    const checkBaseline = async (page: Page) => {
        await page.setViewportSize({ width: 1300, height: 1000 });
        await assertTitles(
            page,
            locale.pages.manage.inspectiondevices.header.pageSubtitle('Work Station Support', 'Library'),
        );
        await forcePageRefresh(page);
        await expect((await getFieldValue(page, 'device_model_name', 0)).getByText('AV 025')).toBeVisible();
    };

    test('page is accessible and renders base', async ({ page }) => {
        await checkBaseline(page);
        const dueDateCell = await getFieldValue(page, 'device_calibration_due_date', 2);
        await expect(dueDateCell.locator('svg')).toBeVisible();
        await assertAccessibility(page, '[data-testid="StandardPage"]');
    });

    test('Add and Edit Inspection Device functions correctly', async ({ page }) => {
        await checkBaseline(page);

        // Adding an Inspection Device
        await page.getByTestId('inspection-devices-data-table-toolbar-add-button').click();

        await assertAccessibility(page, '[data-testid="StandardPage"]');

        await page.getByTestId('device_model_name-input').clear();
        await page.getByTestId('device_model_name-input').fill('Test Device');
        await page.getByTestId('device_serial_number-input').clear();
        await page.getByTestId('device_serial_number-input').fill('Test Serial No');
        await page.getByTestId('device_calibrated_by_last-input').clear();
        await page.getByTestId('device_calibrated_by_last-input').fill('Calibration Person');
        await page.getByTestId('update_dialog-action-button').click();
        await expect(page.locator('.MuiAlert-message').getByText('Request successfully completed')).toBeVisible();

        // Editing an asset type
        await page.getByTestId('action_cell-2-edit-button').click();
        await assertAccessibility(page, '[data-testid="StandardPage"]');

        await page.getByTestId('device_model_name-input').clear();
        await page.getByTestId('device_model_name-input').fill('Test Device Edited');
        await page.getByTestId('device_serial_number-input').clear();
        await page.getByTestId('device_serial_number-input').fill('Test Serial No Edited');
        await page.getByTestId('device_calibrated_by_last-input').clear();
        await page.getByTestId('device_calibrated_by_last-input').fill('Calibration Person Edited');
        await page.getByTestId('update_dialog-action-button').click();
        await expect(page.locator('.MuiAlert-message').getByText('Request successfully completed')).toBeVisible();

        // Cancel button - Add
        await page.getByTestId('inspection-devices-data-table-toolbar-add-button').click();
        await page.getByTestId('update_dialog-cancel-button').click();
        await expect(page.locator('.MuiAlert-message')).not.toBeVisible();

        // Cancel button - Edit
        await page.getByTestId('action_cell-2-edit-button').click();
        await page.getByTestId('update_dialog-cancel-button').click();
        await expect(page.locator('.MuiAlert-message')).not.toBeVisible();

        // Delete Button - Confirm
        await page.getByTestId('action_cell-2-delete-button').click();
        await page.getByTestId('confirm-inspection-devices').click();
        await expect(page.locator('.MuiAlert-message').getByText('Request successfully completed')).toBeVisible();

        // Delete Button - Cancel
        await page.getByTestId('action_cell-2-delete-button').click();
        await page.getByTestId('cancel-inspection-devices').click();
        await expect(page.locator('.MuiAlert-message')).not.toBeVisible();
    });
});
