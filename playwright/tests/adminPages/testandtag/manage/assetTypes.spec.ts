import { test, expect, Page } from '@uq/pw/test';
import { assertAccessibility } from '@uq/pw/lib/axe';
import { assertTitles, forcePageRefresh, getFieldValue } from '@uq/pw/tests/adminPages/testandtag/helpers';
import { default as locale } from '../../../../../src/modules/Pages/Admin/TestTag/testTag.locale';

test.describe('Test and Tag Manage Asset Types', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:2020/admin/testntag/manage/assettypes?user=uqtesttag');
    });

    const changeRowsPerPage = async (page: Page, rows: number) => {
        await page.locator('.MuiTablePagination-input').click();
        await page.locator(`.MuiTablePagination-menuItem[data-value="${rows}"]`).click();
    };

    test('page is accessible and renders base', async ({ page }) => {
        await page.setViewportSize({ width: 1300, height: 1000 });
        await assertTitles(page, locale.pages.manage.assetTypes.header.pageSubtitle('Library'));
        await forcePageRefresh(page);
        await expect((await getFieldValue(page, 'asset_type_name', 0)).getByText('[E2E_testing] Name')).toBeVisible();
        await assertAccessibility(page, '[data-testid="StandardPage"]');
    });

    test('has breadcrumbs', async ({ page }) => {
        await expect(page.getByTestId('subsite-title').getByText('Test and tag')).toBeVisible();
    });

    test('Page Pagination functions correctly', async ({ page }) => {
        await page.setViewportSize({ width: 1300, height: 1000 });
        await assertTitles(page, locale.pages.manage.assetTypes.header.pageSubtitle('Library'));
        await forcePageRefresh(page);
        await expect((await getFieldValue(page, 'asset_type_name', 0)).getByText('[E2E_testing] Name')).toBeVisible();

        // Change Rows to 25
        await changeRowsPerPage(page, 25);
        await expect(page.locator('.MuiTablePagination-displayedRows').getByText('1–25 of 60')).toBeVisible();

        // next page
        await page.locator('.MuiTablePagination-actions button[aria-label="Go to next page"]').click();
        await expect(page.locator('.MuiTablePagination-displayedRows').getByText('26–50 of 60')).toBeVisible();

        // previous page
        await page.locator('.MuiTablePagination-actions button[aria-label="Go to previous page"]').click();
        await expect(page.locator('.MuiTablePagination-displayedRows').getByText('1–25 of 60')).toBeVisible();
    });

    test('Add and Edit Asset type functions correctly', async ({ page }) => {
        await page.setViewportSize({ width: 1300, height: 1000 });
        await assertTitles(page, locale.pages.manage.assetTypes.header.pageSubtitle('Library'));
        await forcePageRefresh(page);
        await expect((await getFieldValue(page, 'asset_type_name', 0)).getByText('[E2E_testing] Name')).toBeVisible();

        // Adding an asset type
        await page.getByTestId('add_toolbar-asset-types-add-button').click();
        await assertAccessibility(page, '[data-testid="StandardPage"]');

        await page.getByTestId('asset_type_name-input').fill('Test Asset');
        await page.getByTestId('asset_type_class-input').fill('Test Class');
        await page.getByTestId('asset_type_power_rating-input').fill('240V');
        await page.getByTestId('asset_type-input').fill('Generic');
        await page.getByTestId('asset_type_notes-input').fill('Notes for asset type');
        await page.getByTestId('update_dialog-action-button').click();
        await expect(page.locator('.MuiAlert-message').getByText('Request successfully completed')).toBeVisible();

        // Editing an asset type
        await page.getByTestId('action_cell-1-edit-button').click();
        await assertAccessibility(page, '[data-testid="StandardPage"]');

        await page.getByTestId('asset_type_name-input').fill('Test Asset Edited');
        await page.getByTestId('asset_type_class-input').fill('Test Class Edited');
        await page.getByTestId('asset_type_power_rating-input').fill('120V');
        await page.getByTestId('asset_type-input').fill('Specific');
        await page.getByTestId('asset_type_notes-input').fill('Updated notes for asset type');
        await page.getByTestId('update_dialog-action-button').click();
        await expect(page.locator('.MuiAlert-message').getByText('Request successfully completed')).toBeVisible();

        // Cancel button - Add
        await page.getByTestId('add_toolbar-asset-types-add-button').click();
        await page.getByTestId('update_dialog-cancel-button').click();
        await expect(page.locator('.MuiAlert-message')).not.toBeVisible();

        // Cancel button - Edit
        await page.getByTestId('action_cell-1-edit-button').click();
        await page.getByTestId('update_dialog-cancel-button').click();
        await expect(page.locator('.MuiAlert-message')).not.toBeVisible();
    });

    test('Delete and Reassign work correctly', async ({ page }) => {
        await page.setViewportSize({ width: 1300, height: 1000 });
        await assertTitles(page, locale.pages.manage.assetTypes.header.pageSubtitle('Library'));
        await forcePageRefresh(page);
        await expect((await getFieldValue(page, 'asset_type_name', 0)).getByText('[E2E_testing] Name')).toBeVisible();

        // Delete an asset type - contains assets
        await page.getByTestId('action_cell-1-delete-button').click();
        await expect(
            page
                .getByTestId('action_dialogue-asset-types-title')
                .getByText(locale.pages.manage.assetTypes.actionDialogue.confirmationTitle),
        ).toBeVisible();
        await expect(
            page
                .getByTestId('action_dialogue-asset-types-alert')
                .getByText(locale.pages.manage.assetTypes.actionDialogue.deleteReassignWarningPrompt(76)),
        ).toBeVisible();

        await assertAccessibility(page, '[data-testid="StandardPage"]');

        // Fire cancel
        await page.getByTestId('action_dialogue-asset-types-cancel-button').click();

        // Reopen and confirm
        await page.getByTestId('action_cell-1-delete-button').click();
        await expect(
            page
                .getByTestId('action_dialogue-asset-types-title')
                .getByText(locale.pages.manage.assetTypes.actionDialogue.confirmationTitle),
        ).toBeVisible();
        await expect(
            page
                .getByTestId('action_dialogue-asset-types-alert')
                .getByText(locale.pages.manage.assetTypes.actionDialogue.deleteReassignWarningPrompt(76)),
        ).toBeVisible();

        await page.locator('#action_dialogue-asset-types-reassign-select').click();
        await page.getByTestId('action_dialogue-asset-types-reassign-option-6').click();
        await page.getByTestId('action_dialogue-asset-types-action-button').click();
        await expect(page.locator('.MuiAlert-message').getByText('Request successfully completed')).toBeVisible();

        // Test standard delete
        await page.getByTestId('action_cell-10-delete-button').click();
        // Fire Cancel
        await page.getByTestId('cancel-asset-types').click();
        await expect(page.locator('.MuiAlert-message')).not.toBeVisible();
        // Reopen and confirm
        await page.getByTestId('action_cell-10-delete-button').click();
        await page.getByTestId('confirm-asset-types').click();
        await expect(page.locator('.MuiAlert-message').getByText('Request successfully completed')).toBeVisible();

        // Test a fail delete
        await page.getByTestId('action_cell-52-delete-button').click();
        await page.getByTestId('confirm-asset-types').click();
        await expect(page.locator('.MuiAlert-message').getByText('Operation failed')).toBeVisible();
    });
});
