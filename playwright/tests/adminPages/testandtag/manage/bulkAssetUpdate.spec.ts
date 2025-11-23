import { test, expect, Page } from '@uq/pw/test';
import { assertAccessibility } from '@uq/pw/lib/axe';
import { assertTitles, forcePageRefresh, getFieldValue } from '@uq/pw/tests/adminPages/testandtag/helpers';
import { assertEnabled, assertDisabled, assertChecked } from '@uq/pw/lib/helpers';
import { default as locale } from '../../../../../src/modules/Pages/Admin/TestTag/testTag.locale';

const assertAlert = async (page: Page, text: string) => {
    await expect(page.getByTestId('bulk_asset_update_step_two-summary-alert').getByText(text)).toBeVisible();
};

test.describe('Test and Tag bulk asset update', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:2020/admin/testntag/manage/bulkassetupdate?user=uqtesttag');
        const fixedDate = new Date('2025-01-01T09:00:00Z'); // Example: January 1, 2024, 9:00 AM UTC
        await page.clock.setFixedTime(fixedDate);
    });

    const selectAllRows = async (page: Page) => {
        await page.getByTestId('bulk_asset_update-step-one-feature-button').click();
        await expect(
            page
                .getByTestId('filter_dialog-bulk-asset-update-step-one-title')
                .getByText(locale.pages.manage.bulkassetupdate.form.filterDialog.title),
        ).toBeVisible();
        await expect((await getFieldValue(page, 'asset_barcode', 0)).getByText('UQL000001')).toBeVisible();
        await page.locator('input[aria-label="Select all rows"]').click();
        await page.getByTestId('filter_dialog-bulk-asset-update-step-one-action-button').click();
        await expect((await getFieldValue(page, 'asset_id_displayed', 0)).getByText('UQL000001')).toBeVisible();
        await expect((await getFieldValue(page, 'asset_id_displayed', 4)).getByText('UQL001993')).toBeVisible();
        await page.getByTestId('footer_bar-bulk-asset-update-step-one-action-button').click();
        await expect(page.getByTestId('bulk_asset_update_step_two-summary-alert')).toBeVisible();
    };

    const checkBaseline = async (page: Page) => {
        await page.setViewportSize({ width: 1300, height: 1000 });
        await assertTitles(page, locale.pages.manage.bulkassetupdate.header.pageSubtitle('Library'));
        await forcePageRefresh(page);
    };

    test.describe('step 1', () => {
        test('Page is accessible and renders base', async ({ page }) => {
            await checkBaseline(page);
            await assertAccessibility(page, '[data-testid="StandardPage"]');
        });

        test('Asset id search functions correctly', async ({ page }) => {
            await checkBaseline(page);
            // Search for an asset
            await page.getByTestId('asset_selector-bulk-asset-update-step-one-input').fill('5');
            await expect((await getFieldValue(page, 'asset_id_displayed', 0)).getByText('UQL000005')).toBeVisible();

            // Search for an additional asset
            await page.getByTestId('asset_selector-bulk-asset-update-step-one-input').fill('6');
            await expect((await getFieldValue(page, 'asset_id_displayed', 1)).getByText('UQL000006')).toBeVisible();

            // Search for an exact asset
            await page.getByTestId('asset_selector-bulk-asset-update-step-one-input').fill('UQL310000');
            await expect((await getFieldValue(page, 'asset_id_displayed', 2)).getByText('UQL310000')).toBeVisible();
            await expect(page.getByTestId('bulk_asset_update-step-one-count-alert')).toBeVisible();

            // Clear the assets
            await page.getByTestId('action_cell-5-delete-button').click();
            await page.getByTestId('action_cell-6-delete-button').click();
            await page.getByTestId('action_cell-310000-delete-button').click();
            await expect(page.getByTestId('bulk_asset_update-step-one-count-alert')).not.toBeVisible();

            // coverage ==>
            await page.getByTestId('asset_selector-bulk-asset-update-step-one-input').click();
            await page
                .getByTestId('asset_selector-bulk-asset-update-step-one')
                .locator('[type="button"][title="Clear"]')
                .click();
            await expect(page.getByTestId('asset_selector-bulk-asset-update-step-one-input')).toHaveValue('');
            // <== end coverage

            await page.getByTestId('asset_selector-bulk-asset-update-step-one-input').click();
        });

        test.describe('filter dialog', () => {
            test('all components respond to user input', async ({ page }) => {
                await page.getByTestId('bulk_asset_update-step-one-feature-button').click();
                await expect(
                    page
                        .getByTestId('filter_dialog-bulk-asset-update-step-one-title')
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
                await expect(page.getByTestId('asset_type_selector-filter-dialog-input')).toHaveValue(
                    'Power Cord - C13',
                );

                // notes
                await page
                    .getByTestId('filter_dialog-bulk-asset-update-step-one-search-notes-input')
                    .fill('Test notes');
                await expect(
                    page.getByTestId('filter_dialog-bulk-asset-update-step-one-search-notes-input'),
                ).toHaveValue('Test notes');

                await assertAccessibility(page, '[data-testid="StandardPage"]');

                // clear fields
                await page.getByTestId('location_picker-filter-dialog-site-input').click();
                await page.locator('#location_picker-filter-dialog-site-option-0').click();
                await expect(page.getByTestId('location_picker-filter-dialog-site-input')).toHaveValue('All sites');
                await expect(page.getByTestId('location_picker-filter-dialog-building-input')).toHaveValue(
                    'All buildings',
                );
                await expect(page.getByTestId('location_picker-filter-dialog-floor-input')).toHaveValue('All floors');
                await expect(page.getByTestId('location_picker-filter-dialog-room-input')).toHaveValue('All rooms');
                await page.getByTestId('asset_type_selector-filter-dialog-input').click();
                await page
                    .getByTestId('asset_type_selector-filter-dialog')
                    .locator('[type="button"][title="Clear"]')
                    .click();
                await expect(page.getByTestId('asset_type_selector-filter-dialog-input')).toHaveValue('');
                await page.getByTestId('filter_dialog-bulk-asset-update-step-one-clear-search-notes').click();
                await expect(
                    page.getByTestId('filter_dialog-bulk-asset-update-step-one-search-notes-input'),
                ).toHaveValue('');
            });

            test('Asset search by feature works correctly', async ({ page }) => {
                await checkBaseline(page);
                // Search for an asset by feature (default)
                await selectAllRows(page);
            });
        });
    });
    test.describe('step 2', () => {
        test('Updates locations of assets', async ({ page }) => {
            await checkBaseline(page);
            // Select all rows
            await selectAllRows(page);

            await assertAccessibility(page, '[data-testid="StandardPage"]');

            assertEnabled(page, '#accordionWithCheckbox-assetStatus-checkbox');
            assertEnabled(page, '#bulk_asset_update_step_two-notes-checkbox');
            assertDisabled(page, '#accordionWithCheckbox-assetType-checkbox');
            assertDisabled(page, '#accordionWithCheckbox-discardStatus-checkbox');
            assertDisabled(page, '#bulk_asset_update_step_two-submit-button');

            // Update location
            await expect(page.getByTestId('location_picker-bulk-asset-update-step-two-site-input')).toHaveAttribute(
                'required',
            );
            await page.getByTestId('location_picker-bulk-asset-update-step-two-site-input').click();
            await page.locator('#location_picker-bulk-asset-update-step-two-site-option-0').click();
            await expect(page.getByTestId('location_picker-bulk-asset-update-step-two-building-input')).toHaveAttribute(
                'required',
            );
            await page.getByTestId('location_picker-bulk-asset-update-step-two-building-input').click();
            await page.locator('#location_picker-bulk-asset-update-step-two-building-option-0').click();
            await expect(page.getByTestId('location_picker-bulk-asset-update-step-two-floor-input')).toHaveAttribute(
                'required',
            );
            await page.getByTestId('location_picker-bulk-asset-update-step-two-floor-input').click();
            await page.locator('#location_picker-bulk-asset-update-step-two-floor-option-0').click();
            await expect(page.getByTestId('location_picker-bulk-asset-update-step-two-room-input')).toHaveAttribute(
                'required',
            );
            await page.getByTestId('location_picker-bulk-asset-update-step-two-room-input').click();
            await page.locator('#location_picker-bulk-asset-update-step-two-room-option-0').click();

            // coverage ==>
            // test clearing selected room by unselecting a floor
            await page.getByTestId('location_picker-bulk-asset-update-step-two-floor-input').click();
            await page.locator('#location_picker-bulk-asset-update-step-two-floor-option-1').click(); // change floor
            await expect(page.getByTestId('location_picker-bulk-asset-update-step-two-floor-input')).toHaveValue('3');
            await expect(page.getByTestId('location_picker-bulk-asset-update-step-two-room-input')).toHaveValue('');

            // reset
            await page.getByTestId('location_picker-bulk-asset-update-step-two-floor-input').click();
            await page.locator('#location_picker-bulk-asset-update-step-two-floor-option-0').click();
            await page.getByTestId('location_picker-bulk-asset-update-step-two-room-input').click();
            await page.locator('#location_picker-bulk-asset-update-step-two-room-option-0').click();
            // <== end coverage

            // Commit the change
            await page.getByTestId('bulk_asset_update_step_two-submit-button').click();
            // Confirmation showing?
            await expect(page.getByTestId('dialogbox-bulk-asset-update')).toBeVisible();
            // Commit
            await page.getByTestId('confirm-bulk-asset-update').click();
            await expect(page.getByTestId('confirmation_alert-success-alert')).toBeVisible();
        });

        test('Updates locations of assets with duration', async ({ page }) => {
            await checkBaseline(page);
            // Select all rows
            await selectAllRows(page);

            await assertAccessibility(page, '[data-testid="StandardPage"]');

            assertEnabled(page, '#accordionWithCheckbox-assetStatus-checkbox');
            assertEnabled(page, '#bulk_asset_update_step_two-notes-checkbox');
            assertDisabled(page, '#accordionWithCheckbox-assetType-checkbox');
            assertDisabled(page, '#accordionWithCheckbox-discardStatus-checkbox');
            assertDisabled(page, '#bulk_asset_update_step_two-submit-button');

            // Update location
            await expect(page.getByTestId('location_picker-bulk-asset-update-step-two-site-input')).toHaveAttribute(
                'required',
            );
            await page.getByTestId('location_picker-bulk-asset-update-step-two-site-input').click();
            await page.locator('#location_picker-bulk-asset-update-step-two-site-option-0').click();
            await expect(page.getByTestId('location_picker-bulk-asset-update-step-two-building-input')).toHaveAttribute(
                'required',
            );
            await page.getByTestId('location_picker-bulk-asset-update-step-two-building-input').click();
            await page.locator('#location_picker-bulk-asset-update-step-two-building-option-0').click();
            await expect(page.getByTestId('location_picker-bulk-asset-update-step-two-floor-input')).toHaveAttribute(
                'required',
            );
            await page.getByTestId('location_picker-bulk-asset-update-step-two-floor-input').click();
            await page.locator('#location_picker-bulk-asset-update-step-two-floor-option-0').click();
            await expect(page.getByTestId('location_picker-bulk-asset-update-step-two-room-input')).toHaveAttribute(
                'required',
            );
            await page.getByTestId('location_picker-bulk-asset-update-step-two-room-input').click();
            await page.locator('#location_picker-bulk-asset-update-step-two-room-option-0').click();

            // check updated alert message
            await assertAlert(page, 'You have selected 5 assets to bulk update');

            // select month range
            await page.getByTestId('months_selector-bulk-asset-update-step-two-select').click();
            await page.getByTestId('months_selector-bulk-asset-update-step-two-option-1').click();
            await expect(page.getByTestId('months_selector-bulk-asset-update-step-two-input')).toHaveValue('12');
            await expect(
                page
                    .getByTestId('months_selector-bulk-asset-update-step-two-next-date-label')
                    .getByText('(Includes assets up to 01 January 2026)'),
            ).toBeVisible();

            // check updated alert message
            await assertAlert(page, 'You have selected 1 asset to bulk update');
            // check updated alert message
            await assertAlert(page, 'Excluded 4 assets');

            assertEnabled(page, '#bulk_asset_update_step_two-submit-button');

            // coverage ==>
            // test clearing selected room by clicking clear button
            await page.getByTestId('bulk_asset_update_step_two-location-accordion-action').click();
            await expect(page.getByTestId('location_picker-bulk-asset-update-step-two-site-input')).toHaveValue('');
            await expect(page.getByTestId('location_picker-bulk-asset-update-step-two-building-input')).toHaveValue('');
            await expect(page.getByTestId('location_picker-bulk-asset-update-step-two-floor-input')).toHaveValue('');
            await expect(page.getByTestId('location_picker-bulk-asset-update-step-two-room-input')).toHaveValue('');
            await expect(page.getByTestId('months_selector-bulk-asset-update-step-two-input')).toHaveValue('-1');
            await expect(
                page
                    .getByTestId('months_selector-bulk-asset-update-step-two-next-date-label')
                    .getByText('(Includes all assets)'),
            ).toBeVisible();

            // reset
            await page.getByTestId('location_picker-bulk-asset-update-step-two-site-input').click();
            await page.locator('#location_picker-bulk-asset-update-step-two-site-option-0').click();
            await page.getByTestId('location_picker-bulk-asset-update-step-two-building-input').click();
            await page.locator('#location_picker-bulk-asset-update-step-two-building-option-0').click();
            await page.getByTestId('location_picker-bulk-asset-update-step-two-floor-input').click();
            await page.locator('#location_picker-bulk-asset-update-step-two-floor-option-0').click();
            await page.getByTestId('location_picker-bulk-asset-update-step-two-room-input').click();
            await page.locator('#location_picker-bulk-asset-update-step-two-room-option-0').click();
            await page.getByTestId('months_selector-bulk-asset-update-step-two-select').click();
            await page.getByTestId('months_selector-bulk-asset-update-step-two-option-1').click();

            // <== end coverage

            // Commit the change
            await page.getByTestId('bulk_asset_update_step_two-submit-button').click();
            // Confirmation showing?
            await expect(page.getByTestId('dialogbox-bulk-asset-update')).toBeVisible();
            await expect(
                page
                    .getByTestId('dialogbox-bulk-asset-update')
                    .getByText('Are you sure you wish to proceed with this bulk update of 1 selected assets?'),
            ).toBeVisible();

            // Commit
            await page.getByTestId('confirm-bulk-asset-update').click();
            await expect(page.getByTestId('confirmation_alert-success-alert')).toBeVisible();
        });

        test('Updates locations of assets with status and clears notes', async ({ page }) => {
            await checkBaseline(page);
            // Select all rows
            await selectAllRows(page);

            await assertAccessibility(page, '[data-testid="StandardPage"]');

            assertEnabled(page, '#accordionWithCheckbox-assetStatus-checkbox');
            assertEnabled(page, '#bulk_asset_update_step_two-notes-checkbox');
            assertDisabled(page, '#accordionWithCheckbox-assetType-checkbox');
            assertDisabled(page, '#accordionWithCheckbox-discardStatus-checkbox');
            assertDisabled(page, '#bulk_asset_update_step_two-submit-button');

            // Update location
            await expect(page.getByTestId('location_picker-bulk-asset-update-step-two-site-input')).toHaveAttribute(
                'required',
            );
            await page.getByTestId('location_picker-bulk-asset-update-step-two-site-input').click();
            await page.locator('#location_picker-bulk-asset-update-step-two-site-option-0').click();
            await expect(page.getByTestId('location_picker-bulk-asset-update-step-two-building-input')).toHaveAttribute(
                'required',
            );
            await page.getByTestId('location_picker-bulk-asset-update-step-two-building-input').click();
            await page.locator('#location_picker-bulk-asset-update-step-two-building-option-0').click();
            await expect(page.getByTestId('location_picker-bulk-asset-update-step-two-floor-input')).toHaveAttribute(
                'required',
            );
            await page.getByTestId('location_picker-bulk-asset-update-step-two-floor-input').click();
            await page.locator('#location_picker-bulk-asset-update-step-two-floor-option-0').click();
            await expect(page.getByTestId('location_picker-bulk-asset-update-step-two-room-input')).toHaveAttribute(
                'required',
            );
            await page.getByTestId('location_picker-bulk-asset-update-step-two-room-input').click();
            await page.locator('#location_picker-bulk-asset-update-step-two-room-option-0').click();

            // check updated alert message
            await assertAlert(page, 'You have selected 5 assets to bulk update');

            // select asset status
            await page.locator('#accordionWithCheckbox-assetStatus-checkbox').click();

            assertDisabled(page, '#bulk_asset_update_step_two-submit-button');

            await expect(page.getByTestId('asset_status_selector-bulk-asset-update-step-two-input')).toHaveAttribute(
                'required',
            );
            await page.getByTestId('asset_status_selector-bulk-asset-update-step-two-input').click();
            await page.locator('#asset_status_selector-bulk-asset-update-step-two-option-0').click();

            assertEnabled(page, '#bulk_asset_update_step_two-submit-button');

            await page.getByTestId('bulk_asset_update_step_two-notes-checkbox').click();

            // assert the expected checkboxes are still disabled
            assertChecked(page, '#bulk_asset_update_step_two-notes-checkbox');
            assertDisabled(page, '#accordionWithCheckbox-assetType-checkbox');
            assertDisabled(page, '#accordionWithCheckbox-discardStatus-checkbox');

            // Commit the change
            await page.getByTestId('bulk_asset_update_step_two-submit-button').click();
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

            // uncheck location
            await page.locator('#accordionWithCheckbox-location-checkbox').click();

            // Update asset type
            await page.locator('#accordionWithCheckbox-assetType-checkbox').click();

            // assert checkbox logic
            assertEnabled(page, '#accordionWithCheckbox-assetType-checkbox');
            assertEnabled(page, '#bulk_asset_update_step_two-notes-checkbox');
            assertDisabled(page, '#accordionWithCheckbox-assetStatus-checkbox');
            assertDisabled(page, '#accordionWithCheckbox-discardStatus-checkbox');
            assertDisabled(page, '#bulk_asset_update_step_two-submit-button');

            await expect(page.getByTestId('asset_type_selector-bulk-asset-update-step-two-input')).toHaveAttribute(
                'required',
            );
            await page.getByTestId('asset_type_selector-bulk-asset-update-step-two-input').click();
            await page.locator('#asset_type_selector-bulk-asset-update-step-two-option-1').click();

            // check updated alert message
            await assertAlert(page, 'You have selected 5 assets to bulk update');

            assertEnabled(page, '#bulk_asset_update_step_two-submit-button');

            // Commit the change
            await page.getByTestId('bulk_asset_update_step_two-submit-button').click();
            // Confirmation showing?
            await expect(page.getByTestId('dialogbox-bulk-asset-update')).toBeVisible();
            // Commit
            await page.getByTestId('confirm-bulk-asset-update').click();
            await expect(page.getByTestId('confirmation_alert-success-alert')).toBeVisible();
        });

        test('Updates Asset Status only', async ({ page }) => {
            await checkBaseline(page);
            // Select all rows
            await selectAllRows(page);

            // uncheck location
            await page.locator('#accordionWithCheckbox-location-checkbox').click();

            // Update asset status
            await page.locator('#accordionWithCheckbox-assetStatus-checkbox').click();

            assertDisabled(page, '#bulk_asset_update_step_two-submit-button');

            await expect(page.getByTestId('asset_status_selector-bulk-asset-update-step-two-input')).toHaveAttribute(
                'required',
            );
            await page.getByTestId('asset_status_selector-bulk-asset-update-step-two-input').click();
            await page.locator('#asset_status_selector-bulk-asset-update-step-two-option-0').click();

            assertEnabled(page, '#bulk_asset_update_step_two-submit-button');

            // Commit the change
            await page.getByTestId('bulk_asset_update_step_two-submit-button').click();
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

            // uncheck location
            await page.locator('#accordionWithCheckbox-location-checkbox').click();

            // Update discard reason
            await page.locator('#accordionWithCheckbox-discardStatus-checkbox').click();

            assertDisabled(page, '#bulk_asset_update_step_two-submit-button');

            await expect(page.getByTestId('bulk_asset_update_step_two-discard-reason-input')).toHaveAttribute(
                'required',
            );
            await page.getByTestId('bulk_asset_update_step_two-discard-reason-input').fill('Cypress test');

            assertEnabled(page, '#bulk_asset_update_step_two-submit-button');

            // Commit the change
            await page.getByTestId('bulk_asset_update_step_two-submit-button').click();
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

            // uncheck location
            await page.locator('#accordionWithCheckbox-location-checkbox').click();

            assertDisabled(page, '#bulk_asset_update_step_two-submit-button');

            // Update notes
            await page.getByTestId('bulk_asset_update_step_two-notes-checkbox').click();

            assertEnabled(page, '#bulk_asset_update_step_two-submit-button');

            // Commit the change
            await page.getByTestId('bulk_asset_update_step_two-submit-button').click();
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

            // uncheck location
            await page.locator('#accordionWithCheckbox-location-checkbox').click();

            // select notes
            await page.locator('#bulk_asset_update_step_two-notes-checkbox').click();
            await page.getByTestId('bulk_asset_update_step_two-submit-button').click();
            // Cancel
            await page.getByTestId('cancel-bulk-asset-update').click();
            await page.getByTestId('bulk_asset_update_step_two-back-button').click();
            await page.getByTestId('footer_bar-bulk-asset-update-step-one-alt-button').click();
            await expect(page.getByTestId('confirmation_alert-success-alert')).not.toBeVisible();
        });

        test('assets not updated are added in to list at step 1', async ({ page }) => {
            await checkBaseline(page);
            // Select all rows
            await selectAllRows(page);

            await assertAccessibility(page, '[data-testid="StandardPage"]');

            assertEnabled(page, '#accordionWithCheckbox-assetStatus-checkbox');
            assertEnabled(page, '#bulk_asset_update_step_two-notes-checkbox');
            assertDisabled(page, '#accordionWithCheckbox-assetType-checkbox');
            assertDisabled(page, '#accordionWithCheckbox-discardStatus-checkbox');
            assertDisabled(page, '#bulk_asset_update_step_two-submit-button');

            // Update location
            await expect(page.getByTestId('location_picker-bulk-asset-update-step-two-site-input')).toHaveAttribute(
                'required',
            );
            await page.getByTestId('location_picker-bulk-asset-update-step-two-site-input').click();
            await page.locator('#location_picker-bulk-asset-update-step-two-site-option-0').click();
            await expect(page.getByTestId('location_picker-bulk-asset-update-step-two-building-input')).toHaveAttribute(
                'required',
            );
            await page.getByTestId('location_picker-bulk-asset-update-step-two-building-input').click();
            await page.locator('#location_picker-bulk-asset-update-step-two-building-option-0').click();
            await expect(page.getByTestId('location_picker-bulk-asset-update-step-two-floor-input')).toHaveAttribute(
                'required',
            );
            await page.getByTestId('location_picker-bulk-asset-update-step-two-floor-input').click();
            await page.locator('#location_picker-bulk-asset-update-step-two-floor-option-0').click();
            await expect(page.getByTestId('location_picker-bulk-asset-update-step-two-room-input')).toHaveAttribute(
                'required',
            );
            await page.getByTestId('location_picker-bulk-asset-update-step-two-room-input').click();
            await page.locator('#location_picker-bulk-asset-update-step-two-room-option-0').click();

            // check updated alert message
            await assertAlert(page, 'You have selected 5 assets to bulk update');

            // select month range
            await page.getByTestId('months_selector-bulk-asset-update-step-two-select').click();
            await page.getByTestId('months_selector-bulk-asset-update-step-two-option-1').click();
            await expect(page.getByTestId('months_selector-bulk-asset-update-step-two-input')).toHaveValue('12');
            await expect(
                page
                    .getByTestId('months_selector-bulk-asset-update-step-two-next-date-label')
                    .getByText('(Includes assets up to 01 January 2026)'),
            ).toBeVisible();

            // check updated alert message
            await assertAlert(page, 'You have selected 1 asset to bulk update');
            // check updated alert message
            await assertAlert(page, 'Excluded 4 assets');

            assertEnabled(page, '#bulk_asset_update_step_two-submit-button');

            // Commit the change
            await page.getByTestId('bulk_asset_update_step_two-submit-button').click();
            // Confirmation showing?
            await expect(page.getByTestId('dialogbox-bulk-asset-update')).toBeVisible();
            await expect(
                page
                    .getByTestId('dialogbox-bulk-asset-update')
                    .getByText('Are you sure you wish to proceed with this bulk update of 1 selected assets?'),
            ).toBeVisible();

            // Commit
            await page.getByTestId('confirm-bulk-asset-update').click();
            await expect(page.getByTestId('confirmation_alert-success-alert')).toBeVisible();

            await expect(page.getByTestId('standard_card-bulk-asset-update-step-one-step-1-header')).toBeVisible();

            // assert the excluded assets in step 2 are back in to the list in step 1
            await expect((await getFieldValue(page, 'asset_id_displayed', 0)).getByText('UQL000001')).toBeVisible();
            await expect((await getFieldValue(page, 'asset_id_displayed', 1)).getByText('UQL000002')).toBeVisible();
            await expect((await getFieldValue(page, 'asset_id_displayed', 2)).getByText('UQL001992')).toBeVisible();
            await expect((await getFieldValue(page, 'asset_id_displayed', 3)).getByText('UQL001993')).toBeVisible();
            // and the one asset that _was_ updated is not present
            await expect(page.locator('div[data-field=asset_id_displayed]').getByText('UQL001991')).not.toBeVisible();
        });
    });
});
