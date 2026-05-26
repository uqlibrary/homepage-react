import { default as locale } from '../../../../../src/modules/Pages/Admin/TestTag/testTag.locale';
import { test, expect, Page } from '@uq/pw/test';
import { assertAccessibility } from '@uq/pw/lib/axe';
import { assertTitles, forcePageRefresh, getFieldValue } from '@uq/pw/tests/adminPages/testandtag/helpers';

test.describe('Test and Tag Manage Inspection Notes', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:2020/admin/testntag/manage/inspectiondetails?user=uqtesttag');
    });

    const checkBaseline = async (page: Page) => {
        await page.setViewportSize({ width: 1300, height: 1000 });
        await assertTitles(page, locale.pages.manage.inspectiondetails.header.pageSubtitle(null, 'Library'));
        await forcePageRefresh(page);
    };

    test('page is accessible and renders base', async ({ page }) => {
        await checkBaseline(page);
        await assertAccessibility(page, '[data-testid="StandardPage"]');
    });

    test('allows wildcard searching of assets', async ({ page }) => {
        await checkBaseline(page);
        // Enter search criteria
        await page.getByTestId('asset_selector-inspection-details-input').fill('UQL00001');
        await expect((await getFieldValue(page, 'asset_id_displayed', 0)).getByText('UQL000010')).toBeVisible();
        await expect((await getFieldValue(page, 'asset_id_displayed', 9)).getByText('UQL000019')).toBeVisible();
        await expect(page.locator('.MuiTablePagination-displayedRows').getByText('1–10 of 10')).toBeVisible();
    });

    test('allows wildcard searching of assets across all teams', async ({ page }) => {
        await checkBaseline(page);
        // Check the "All team assets" checkbox

        const checkbox = page.getByRole('checkbox', { name: 'All team assets' });
        if (await checkbox.isChecked()) {
            await checkbox.uncheck();
        }

        // Enter search criteria
        await page.getByTestId('asset_selector-inspection-details-input').fill('UQL00SP29'); // wont return any results without the "All team assets" checkbox selected
        await expect((await getFieldValue(page, 'asset_id_displayed', 0)).getByText('UQL00SP29')).not.toBeVisible();
        await expect(page.locator('.MuiTablePagination-displayedRows').getByText('0–0 of 0')).toBeVisible();

        await checkbox.check();

        await expect((await getFieldValue(page, 'asset_id_displayed', 0)).getByText('UQL00SP29')).toBeVisible();
        await expect(page.locator('.MuiTablePagination-displayedRows').getByText('1–1 of 1')).toBeVisible();

        // now test clear button works as expected with "All team assets" checkbox selected
        await page.getByTestId('asset_selector-inspection-details-input').click();
        await page.getByRole('button', { name: 'Clear' }).click();
        await expect(page.getByTestId('asset_selector-inspection-details-input')).toHaveValue('');
        await expect((await getFieldValue(page, 'asset_id_displayed', 0)).getByText('UQL00SP29')).not.toBeVisible();
        await expect(page.locator('.MuiTablePagination-displayedRows').getByText('0–0 of 0')).toBeVisible();

        await checkbox.uncheck();
        await expect(page.getByTestId('asset_selector-inspection-details-input')).toHaveValue(''); // still empty
        await expect((await getFieldValue(page, 'asset_id_displayed', 0)).getByText('UQL00SP29')).not.toBeVisible();
        await expect(page.locator('.MuiTablePagination-displayedRows').getByText('0–0 of 0')).toBeVisible();
    });

    test('allows searching and editing of discard assets', async ({ page }) => {
        await checkBaseline(page);
        // Enter search criteria
        await page.getByTestId('asset_selector-inspection-details-input').fill('1');
        await expect((await getFieldValue(page, 'asset_id_displayed', 0)).getByText('UQL000001')).toBeVisible();

        // Edit details
        await page.getByTestId('action_cell-UQL000001-edit-button').click();
        await assertAccessibility(page, '[data-testid="StandardPage"]');
        await expect(page.getByTestId('update_dialog-inspection-details-content').getByText('UQL000001')).toBeVisible();
        await expect(
            page.getByTestId('update_dialog-inspection-details-content').getByText('No defects detected'),
        ).toBeVisible();
        await page.getByTestId('inspect_notes-input').clear();
        await page.getByTestId('inspect_notes-input').fill('Cypress test notes');
        await expect(page.getByTestId('inspect_fail_reason-input')).toBeDisabled();
        await expect(page.getByTestId('discard_reason-input')).toHaveAttribute('required');
        await expect(page.getByTestId('update_dialog-action-button')).toBeDisabled();
        await page.getByTestId('discard_reason-input').fill('Cypress discard reason');
        await expect(page.getByTestId('update_dialog-action-button')).not.toBeDisabled();
        await page.getByTestId('update_dialog-action-button').click();
        await expect(page.getByTestId('confirmation_alert-success')).toBeVisible();
        // Test cancel of dialog
        await page.getByTestId('action_cell-UQL000001-edit-button').click();
        await page.getByTestId('update_dialog-cancel-button').click();
        await expect(page.getByTestId('confirmation_alert-success')).not.toBeVisible();
    });

    test('allows searching and editing of current assets', async ({ page }) => {
        await checkBaseline(page);
        // Enter search criteria
        await page.getByTestId('asset_selector-inspection-details-input').fill('UQL000010');
        await expect((await getFieldValue(page, 'asset_id_displayed', 0)).getByText('UQL000010')).toBeVisible();

        // Edit details
        await page.getByTestId('action_cell-UQL000010-edit-button').click();
        await expect(page.getByTestId('update_dialog-inspection-details-content').getByText('UQL000010')).toBeVisible();
        await page.getByTestId('inspect_notes-input').clear();
        await page.getByTestId('inspect_notes-input').fill('Cypress test notes');
        await expect(page.getByTestId('inspect_fail_reason-input')).toBeDisabled();
        await expect(page.getByTestId('discard_reason-input')).toBeDisabled();
        await expect(page.getByTestId('update_dialog-action-button')).not.toBeDisabled();
        await page.getByTestId('update_dialog-action-button').click();
        await expect(page.getByTestId('confirmation_alert-success')).toBeVisible();
        await page.locator('#confirmation_alert-success-alert button').click();
        await expect(page.getByTestId('confirmation_alert-success')).not.toBeVisible();
    });
});
