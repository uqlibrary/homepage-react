import { test, expect } from '@uq/pw/test';
import { assertAccessibility } from '@uq/pw/lib/axe';
import { assertTitles, forcePageRefresh, getFieldValue } from '../helpers';
import { default as locale } from '../../../../../src/modules/Pages/Admin/TestTag/testTag.locale';

test.describe('Test and Tag Report - Asset inspection by filters', () => {
    const zeroPad = (num: number, places: number) => String(num).padStart(places, '0');

    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:2020/admin/testntag/report/assetsbyfilter?user=uqtesttag');
    });

    test('page is accessible and renders base', async ({ page }) => {
        await page.setViewportSize({ width: 1300, height: 1000 });
        await assertTitles(page, locale.pages.report.assetReportByFilters.header.pageSubtitle('Library'));
        await forcePageRefresh(page);
        await expect((await getFieldValue(page, 'asset_barcode', 0)).getByText('UQL000001')).toBeVisible();
        await assertAccessibility(page, '[data-testid="StandardPage"]');
    });

    test('has breadcrumbs', async ({ page }) => {
        await expect(
            page
                .locator('uq-site-header')
                .getByTestId('subsite-title')
                .getByText('Test and tag'),
        ).toBeVisible();
    });

    test('UI Dropdown for Status and building function correctly', async ({ page }) => {
        await assertTitles(page, locale.pages.report.assetReportByFilters.header.pageSubtitle('Library'));
        await forcePageRefresh(page);
        await expect((await getFieldValue(page, 'asset_barcode', 0)).getByText('UQL000001')).toBeVisible();

        // Status Dropdown
        await expect(page.getByTestId('asset_status_selector-assets-inspected-input')).toHaveValue('All');
        await page.getByTestId('asset_status_selector-assets-inspected-input').click();
        await page.locator('#asset_status_selector-assets-inspected-option-1').click();
        await expect(page.getByTestId('asset_status_selector-assets-inspected-input')).toHaveValue('Out for repair');
        await page.getByTestId('asset_status_selector-assets-inspected-input').click();
        await page.locator('#asset_status_selector-assets-inspected-option-0').click();
        await expect(page.getByTestId('asset_status_selector-assets-inspected-input')).toHaveValue('All');
        await expect((await getFieldValue(page, 'asset_barcode', 0)).getByText('UQL000001')).toBeVisible();
        // Building Dropdown - all
        await expect(page.getByTestId('location_picker-assets_inspected-building-input')).toHaveValue(
            'All - All buildings',
        );
        await page.getByTestId('location_picker-assets_inspected-building-input').click();
        await page.locator('#location_picker-assets_inspected-building-option-5').click();
        await expect((await getFieldValue(page, 'asset_barcode', 0)).getByText('UQL000001')).toBeVisible();
        // Building Dropdown - selected
        await expect(page.getByTestId('location_picker-assets_inspected-building-input')).toHaveValue(
            '0050 - Hawken Engineering Building',
        );
        await page.getByTestId('location_picker-assets_inspected-building-input').click();
        await page.locator('#location_picker-assets_inspected-building-option-0').click();
        await expect(page.getByTestId('location_picker-assets_inspected-building-input')).toHaveValue(
            'All - All buildings',
        );
        await expect((await getFieldValue(page, 'asset_barcode', 0)).getByText('UQL000001')).toBeVisible();
    });
    test('UI for date pickers function correctly', async ({ page }) => {
        const currentYear = new Date().getFullYear();
        const currentMonth = zeroPad(new Date().getMonth() + 1, 2);
        await assertTitles(page, locale.pages.report.assetReportByFilters.header.pageSubtitle('Library'));
        await forcePageRefresh(page);
        await expect((await getFieldValue(page, 'asset_barcode', 0)).getByText('UQL000001')).toBeVisible();
        // Select a Tagged from Date
        await expect(async () => {
            await page.getByTestId('assets_inspected-tagged-start-button').click({ timeout: 1000 });
            await page.locator('.MuiPickersDay-root:has-text("11")').click({ timeout: 1000 });
            await expect(
                page.getByTestId('assets_inspected-tagged-start-input'),
            ).toHaveValue(`${currentYear}-${currentMonth}-11`, { timeout: 1000 });
        }).toPass();
        await expect((await getFieldValue(page, 'asset_barcode', 0)).getByText('UQL000001')).toBeVisible();
        // Select a Tagged to Date.
        await expect(async () => {
            await page.getByTestId('assets_inspected-tagged-end-button').click({ timeout: 1000 });
            await page.locator('.MuiPickersDay-root:has-text("12")').click({ timeout: 1000 });
            await expect(
                page.getByTestId('assets_inspected-tagged-end-input'),
            ).toHaveValue(`${currentYear}-${currentMonth}-12`, { timeout: 1000 });
        }).toPass();
        // Select invalid end date.
        await expect(async () => {
            await page.getByTestId('assets_inspected-tagged-end-button').click({ timeout: 1000 });
            await page.locator('.MuiPickersDay-root:has-text("10")').click({ timeout: 1000 });
            await expect(page.locator('#assets_inspected-tagged-start-input-label')).toHaveClass(/Mui-error/, {
                timeout: 1000,
            });
        }).toPass();

        // select a valid date.
        await expect(async () => {
            await page.getByTestId('assets_inspected-tagged-end-button').click({ timeout: 1000 });
            await page.locator('.MuiPickersDay-root:has-text("12")').click({ timeout: 1000 });
            await expect(page.locator('#assets_inspected-tagged-start-input-label')).not.toHaveClass(/Mui-error/, {
                timeout: 1000,
            });
        }).toPass();
        // Clear both dates.
        await expect(async () => {
            await page.getByTestId('assets_inspected-tagged-start-input').click({ timeout: 1000 });
            await page.getByTestId('assets_inspected-tagged-end-input').click({ timeout: 1000 });
            await expect(page.locator('#assets_inspected-tagged-start-input-label')).not.toHaveClass(/Mui-error/, {
                timeout: 1000,
            });
            await expect(page.locator('#assets_inspected-tagged-end-input-label')).not.toHaveClass(/Mui-error/, {
                timeout: 1000,
            });
        }).toPass();
    });

    test('Sorting should work correctly', async ({ page }) => {
        await assertTitles(page, locale.pages.report.assetReportByFilters.header.pageSubtitle('Library'));
        await forcePageRefresh(page);
        await expect((await getFieldValue(page, 'asset_barcode', 0)).getByText('UQL000001')).toBeVisible();
        await page.locator('.MuiDataGrid-columnHeader--sorted .MuiDataGrid-iconButtonContainer button').click();
        await expect((await getFieldValue(page, 'asset_barcode', 0)).getByText('UQL001993')).toBeVisible();
        await page.locator('.MuiDataGrid-columnHeader--sorted .MuiDataGrid-iconButtonContainer button').click();
        await expect((await getFieldValue(page, 'asset_barcode', 0)).getByText('UQL000001')).toBeVisible();
    });
});
