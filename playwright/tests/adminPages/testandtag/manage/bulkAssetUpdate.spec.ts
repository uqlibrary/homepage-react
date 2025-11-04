import { test, expect, Page } from '@uq/pw/test';
import { assertAccessibility } from '@uq/pw/lib/axe';
import { assertTitles, forcePageRefresh, getFieldValue } from '@uq/pw/tests/adminPages/testandtag/helpers';
import { default as locale } from '../../../../../src/modules/Pages/Admin/TestTag/testTag.locale';

test.describe('Test and Tag bulk asset update', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:2020/admin/testntag/manage/bulkassetupdate?user=uqtesttag');
    });

    const selectAllRows = async (page: Page) => {
        await page.getByTestId('bulk_asset_update-feature-button').click();
        await expect(
            page
                .getByTestId('filter_dialog-bulk-asset-update-title')
                .getByText(locale.pages.manage.bulkassetupdate.form.filterDialog.title),
        ).toBeVisible();
        await expect((await getFieldValue(page, 'asset_barcode', 0)).getByText('UQL000001')).toBeVisible();
        await page.locator('input[aria-label="Select all rows"]').click();
        await page.getByTestId('filter_dialog-bulk-asset-update-action-button').click();
        await expect((await getFieldValue(page, 'asset_id_displayed', 0)).getByText('UQL000001')).toBeVisible();
        await expect((await getFieldValue(page, 'asset_id_displayed', 4)).getByText('UQL001993')).toBeVisible();
        await page.getByTestId('footer_bar-bulk-asset-update-action-button').click();
        await expect(page.getByTestId('bulk_asset_update-summary-alert')).toBeVisible();
    };

    const checkBaseline = async (page: Page) => {
        await page.setViewportSize({ width: 1300, height: 1000 });
        await assertTitles(page, locale.pages.manage.bulkassetupdate.header.pageSubtitle('Library'));
        await forcePageRefresh(page);
    };

    test('Page is accessible and renders base', async ({ page }) => {
        await checkBaseline(page);
        await assertAccessibility(page, '[data-testid="StandardPage"]');
    });

    test('Asset id search functions correctly', async ({ page }) => {
        await checkBaseline(page);
        // Search for an asset
        await page.getByTestId('asset_selector-bulk-asset-update-input').fill('5');
        await expect((await getFieldValue(page, 'asset_id_displayed', 0)).getByText('UQL000005')).toBeVisible();

        // Search for an additional asset
        await page.getByTestId('asset_selector-bulk-asset-update-input').fill('6');
        await expect((await getFieldValue(page, 'asset_id_displayed', 1)).getByText('UQL000006')).toBeVisible();

        // Search for an exact asset
        await page.getByTestId('asset_selector-bulk-asset-update-input').fill('UQL310000');
        await expect((await getFieldValue(page, 'asset_id_displayed', 2)).getByText('UQL310000')).toBeVisible();
        await expect(page.getByTestId('bulk_asset_update-count-alert')).toBeVisible();

        // Clear the assets
        await page.getByTestId('action_cell-5-delete-button').click();
        await page.getByTestId('action_cell-6-delete-button').click();
        await page.getByTestId('action_cell-310000-delete-button').click();
        await expect(page.getByTestId('bulk_asset_update-count-alert')).not.toBeVisible();

        // coverage ==>
        await page.getByTestId('asset_selector-bulk-asset-update-input').click();
        await page
            .getByTestId('asset_selector-bulk-asset-update')
            .locator('[type="button"][title="Clear"]')
            .click();
        await expect(page.getByTestId('asset_selector-bulk-asset-update-input')).toHaveValue('');
        // <== end coverage

        await page.getByTestId('asset_selector-bulk-asset-update-input').click();
    });

    test.describe('filter dialog', () => {
        test('all components respond to user input', async ({ page }) => {
            await page.getByTestId('bulk_asset_update-feature-button').click();
            await expect(
                page
                    .getByTestId('filter_dialog-bulk-asset-update-title')
                    .getByText(locale.pages.manage.bulkassetupdate.form.filterDialog.title),
            ).toBeVisible();

            // site
            await page.getByTestId('location_picker-filter-dialog-site-input').click();
            await page.locator('#location_picker-filter-dialog-site-option-1').click();
            await expect(page.getByTestId('location_picker-filter-dialog-site-input')).toHaveValue('St Lucia');

            // building
            await page.getByTestId('location_picker-filter-dialog-building-input').click();
            await page.locator('#location_picker-filter-dialog-building-option-1').click();
            await expect(page.getByTestId('location_picker-filter-dialog-building-input')).toHaveValue(
                '0001 - Forgan Smith Building',
            );

            // floor
            await page.getByTestId('location_picker-filter-dialog-floor-input').click();
            await page.locator('#location_picker-filter-dialog-floor-option-1').click();
            await expect(page.getByTestId('location_picker-filter-dialog-floor-input')).toHaveValue('2');

            // room
            await page.getByTestId('location_picker-filter-dialog-room-input').click();
            await page.locator('#location_picker-filter-dialog-room-option-1').click();
            await expect(page.getByTestId('location_picker-filter-dialog-room-input')).toHaveValue('W212');

            // asset type
            await page.getByTestId('asset_type_selector-filter-dialog-input').click();
            await page.locator('#asset_type_selector-filter-dialog-option-1').click();
            await expect(page.getByTestId('asset_type_selector-filter-dialog-input')).toHaveValue('Power Cord - C13');

            // notes
            await page.getByTestId('filter_dialog-bulk-asset-update-search-notes-input').fill('Test notes');
            await expect(page.getByTestId('filter_dialog-bulk-asset-update-search-notes-input')).toHaveValue(
                'Test notes',
            );

            await assertAccessibility(page, '[data-testid="StandardPage"]');

            // clear fields
            await page.getByTestId('location_picker-filter-dialog-site-input').click();
            await page.locator('#location_picker-filter-dialog-site-option-0').click();
            await expect(page.getByTestId('location_picker-filter-dialog-site-input')).toHaveValue('All sites');
            await expect(page.getByTestId('location_picker-filter-dialog-building-input')).toHaveValue('All buildings');
            await expect(page.getByTestId('location_picker-filter-dialog-floor-input')).toHaveValue('All floors');
            await expect(page.getByTestId('location_picker-filter-dialog-room-input')).toHaveValue('All rooms');
            await page.getByTestId('asset_type_selector-filter-dialog-input').click();
            await page
                .getByTestId('asset_type_selector-filter-dialog')
                .locator('[type="button"][title="Clear"]')
                .click();
            await expect(page.getByTestId('asset_type_selector-filter-dialog-input')).toHaveValue('');
            await page.getByTestId('filter_dialog-bulk-asset-update-clear-search-notes').click();
            await expect(page.getByTestId('filter_dialog-bulk-asset-update-search-notes-input')).toHaveValue('');
        });

        test('Asset search by feature works correctly', async ({ page }) => {
            await checkBaseline(page);
            // Search for an asset by feature (default)
            await selectAllRows(page);
        });
    });

    test('Updates locations of assets', async ({ page }) => {
        await checkBaseline(page);
        // Select all rows
        await selectAllRows(page);

        await assertAccessibility(page, '[data-testid="StandardPage"]');

        // Update location
        await page.locator('#bulk_asset_update-location-checkbox').click();
        await expect(page.getByTestId('location_picker-bulk-asset-update-site-input')).toHaveAttribute('required');
        await page.getByTestId('location_picker-bulk-asset-update-site-input').click();
        await page.locator('#location_picker-bulk-asset-update-site-option-0').click();
        await expect(page.getByTestId('location_picker-bulk-asset-update-building-input')).toHaveAttribute('required');
        await page.getByTestId('location_picker-bulk-asset-update-building-input').click();
        await page.locator('#location_picker-bulk-asset-update-building-option-0').click();
        await expect(page.getByTestId('location_picker-bulk-asset-update-floor-input')).toHaveAttribute('required');
        await page.getByTestId('location_picker-bulk-asset-update-floor-input').click();
        await page.locator('#location_picker-bulk-asset-update-floor-option-0').click();
        await expect(page.getByTestId('location_picker-bulk-asset-update-room-input')).toHaveAttribute('required');
        await page.getByTestId('location_picker-bulk-asset-update-room-input').click();
        await page.locator('#location_picker-bulk-asset-update-room-option-0').click();

        // coverage ==>
        // test clearing selected room by unselecting a floor
        await page.getByTestId('location_picker-bulk-asset-update-floor-input').click();
        await page.locator('#location_picker-bulk-asset-update-floor-option-1').click(); // change floor
        await expect(page.getByTestId('location_picker-bulk-asset-update-floor-input')).toHaveValue('3');
        await expect(page.getByTestId('location_picker-bulk-asset-update-room-input')).toHaveValue('');

        // reset
        await page.getByTestId('location_picker-bulk-asset-update-floor-input').click();
        await page.locator('#location_picker-bulk-asset-update-floor-option-0').click();
        await page.getByTestId('location_picker-bulk-asset-update-room-input').click();
        await page.locator('#location_picker-bulk-asset-update-room-option-0').click();
        // <== end coverage

        // Commit the change
        await page.getByTestId('bulk_asset_update-submit-button').click();
        // Confirmation showing?
        await expect(page.getByTestId('dialogbox-bulk-asset-update')).toBeVisible();
        // Commit
        await page.getByTestId('confirm-bulk-asset-update').click();
        await expect(page.getByTestId('confirmation_alert-success-alert')).toBeVisible();
    });

    test('Updates Asset Type', async ({ page }) => {
        await checkBaseline(page);
        // Select all rows
        await selectAllRows(page);
        // Update asset type
        await page.locator('#bulk_asset_update-asset-type-checkbox').click();
        await expect(page.getByTestId('asset_type_selector-bulk-asset-update-input')).toHaveAttribute('required');
        await page.getByTestId('asset_type_selector-bulk-asset-update-input').click();
        await page.locator('#asset_type_selector-bulk-asset-update-option-1').click();

        // Commit the change
        await page.getByTestId('bulk_asset_update-submit-button').click();
        // Confirmation showing?
        await expect(page.getByTestId('dialogbox-bulk-asset-update')).toBeVisible();
        // Commit
        await page.getByTestId('confirm-bulk-asset-update').click();
        await expect(page.getByTestId('confirmation_alert-success-alert')).toBeVisible();
    });

    test('Updates Asset Status', async ({ page }) => {
        await checkBaseline(page);
        // Select all rows
        await selectAllRows(page);
        // Update asset type
        await page.locator('#bulk_asset_update-asset-status-checkbox').click();
        await expect(page.getByTestId('asset_status_selector-bulk-asset-update-input')).toHaveAttribute('required');
        await page.getByTestId('asset_status_selector-bulk-asset-update-input').click();
        await page.locator('#asset_status_selector-bulk-asset-update-option-0').click();

        // Commit the change
        await page.getByTestId('bulk_asset_update-submit-button').click();
        // Confirmation showing?
        await expect(page.getByTestId('dialogbox-bulk-asset-update')).toBeVisible();
        // Commit
        await page.getByTestId('confirm-bulk-asset-update').click();
        await expect(page.getByTestId('confirmation_alert-success-alert')).toBeVisible();
    });

    test('Clear Test notes', async ({ page }) => {
        await checkBaseline(page);
        // Select all rows
        await selectAllRows(page);
        // Update notes
        await page.locator('#bulk_asset_update-notes-checkbox').click();
        // Commit the change
        await page.getByTestId('bulk_asset_update-submit-button').click();
        // Confirmation showing?
        await expect(page.getByTestId('dialogbox-bulk-asset-update')).toBeVisible();
        // Commit
        await page.getByTestId('confirm-bulk-asset-update').click();
        await expect(page.getByTestId('confirmation_alert-success-alert')).toBeVisible();
    });

    test('Discard Asset', async ({ page }) => {
        await checkBaseline(page);
        // Select all rows
        await selectAllRows(page);
        // Update status
        await page.locator('#bulk_asset_update-status-checkbox').click();
        await expect(page.getByTestId('bulk-asset-update-discard-reason-input')).toHaveAttribute('required');
        await page.getByTestId('bulk-asset-update-discard-reason-input').fill('Cypress test');
        // Commit the change
        await page.getByTestId('bulk_asset_update-submit-button').click();
        // Confirmation showing?
        await expect(page.getByTestId('dialogbox-bulk-asset-update')).toBeVisible();
        // Commit
        await page.getByTestId('confirm-bulk-asset-update').click();
        await expect(page.getByTestId('confirmation_alert-success-alert')).toBeVisible();
    });

    test('Cancel Asset changes', async ({ page }) => {
        await checkBaseline(page);
        // Select all rows
        await selectAllRows(page);
        await page.locator('#bulk_asset_update-notes-checkbox').click();
        await page.getByTestId('bulk_asset_update-submit-button').click();
        // Cancel
        await page.getByTestId('cancel-bulk-asset-update').click();
        await page.getByTestId('bulk_asset_update-back-button').click();
        await page.getByTestId('footer_bar-bulk-asset-update-alt-button').click();
        await expect(page.getByTestId('confirmation_alert-success-alert')).not.toBeVisible();
    });
});
