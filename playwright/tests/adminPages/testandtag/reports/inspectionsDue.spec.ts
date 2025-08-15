import { test, expect } from '@uq/pw/test';
import { assertAccessibility } from '@uq/pw/lib/axe';
import { forcePageRefresh, getFieldValue } from '../helpers';
import { default as locale } from '../../../../../src/modules/Pages/Admin/TestTag/testTag.locale';

test.describe('Test and Tag Report - Inspections due', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:2020/admin/testntag/report/inspectionsdue?user=uqtesttag');
    });

    test('page is accessible and renders base', async ({ page }) => {
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(page.locator('h1')).toContainText(locale.pages.general.pageTitle);
        await expect(
            page.locator('h2').getByText(locale.pages.report.inspectionsDue.header.pageSubtitle('Library')),
        ).toBeVisible();
        await forcePageRefresh(page);
        await expect(await getFieldValue(page, 'asset_barcode', 0)).toContainText('UQL000007');
        await expect(page.getByTestId('location_picker-inspections-due-site-input')).toHaveValue('All sites');
        await expect(page.getByTestId('months_selector-inspections-due-select')).toContainText('3 months');
        // Default states of other selectors
        await expect(page.getByTestId('location_picker-inspections-due-building-input')).toBeDisabled();
        await expect(page.getByTestId('location_picker-inspections-due-floor-input')).toBeDisabled();
        await expect(page.getByTestId('location_picker-inspections-due-room-input')).toBeDisabled();
        await assertAccessibility(page, '[data-testid="StandardPage"]', { disabledRules: ['aria-required-children'] });
    });

    test('has breadcrumbs', async ({ page }) => {
        await expect(page.locator('uq-site-header').getByTestId('subsite-title')).toContainText('Test and tag');
    });

    test('page UI elements function as expected', async ({ page }) => {
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(page.locator('h1')).toContainText(locale.pages.general.pageTitle);
        await expect(
            page.locator('h2').getByText(locale.pages.report.inspectionsDue.header.pageSubtitle('Library')),
        ).toBeVisible();
        await forcePageRefresh(page);
        await expect(await getFieldValue(page, 'asset_barcode', 0)).toContainText('UQL000007');
        await expect(page.getByTestId('location_picker-inspections-due-site-input')).toHaveValue('All sites');
        await expect(page.getByTestId('months_selector-inspections-due-select')).toContainText('3 months');

        // Change Site
        await page.getByTestId('location_picker-inspections-due-site-input').click();
        await page.locator('#location_picker-inspections-due-site-option-1').click();
        // Check if number of results are correct
        await expect(page.locator('.MuiTablePagination-displayedRows')).toContainText('1–8 of 8');
        await expect(page.getByTestId('location_picker-inspections-due-building-input')).not.toBeDisabled();

        // Change Building
        await page.getByTestId('location_picker-inspections-due-building-input').click();
        await page.locator('#location_picker-inspections-due-building-option-1').click();
        // Check if number of results are correct
        await expect(page.locator('.MuiTablePagination-displayedRows')).toContainText('1–6 of 6');
        await expect(page.getByTestId('location_picker-inspections-due-floor-input')).not.toBeDisabled();

        // Change Floor
        await page.getByTestId('location_picker-inspections-due-floor-input').click();
        await page.locator('#location_picker-inspections-due-floor-option-1').click();
        // Check if number of results are correct
        await expect(page.locator('.MuiTablePagination-displayedRows')).toContainText('1–4 of 4');
        await expect(page.getByTestId('location_picker-inspections-due-room-input')).not.toBeDisabled();

        // Change Room
        await page.getByTestId('location_picker-inspections-due-room-input').click();
        await page.locator('#location_picker-inspections-due-room-option-1').click();
        // Check if number of results are correct
        await expect(page.locator('.MuiTablePagination-displayedRows')).toContainText('1–2 of 2');

        // Check inspection overdue classes
        const overdueCell = await getFieldValue(page, 'asset_next_test_due_date', 1);
        await expect(overdueCell).toHaveClass(/inspectionOverdue/);

        const notOverdueCell = await getFieldValue(page, 'asset_next_test_due_date', 0);
        await expect(notOverdueCell).not.toHaveClass(/inspectionOverdue/);

        // Change Date (currently throws error on mock)
        await page.getByTestId('months_selector-inspections-due-select').click();
        await page.getByTestId('months_selector-inspections-due-option-1').click();
        await page.locator('[data-testid="confirmation_alert-error-alert"] button').click();
    });
});
