import { test, expect } from '@uq/pw/test';
import { assertAccessibility } from '@uq/pw/lib/axe';
import { assertTitles, forcePageRefresh, getFieldValue } from '../helpers';
import { default as locale } from '../../../../../src/modules/Pages/Admin/TestTag/testTag.locale';

test.describe('Test and Tag Report - RecalibrationsDue due', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:2020/admin/testntag/report/recalibrationsdue?user=uqtesttag');
    });

    test('page is accessible and renders base', async ({ page }) => {
        await page.setViewportSize({ width: 1300, height: 1000 });
        await assertTitles(page, locale.pages.report.recalibrationsDue.header.pageSubtitle('Library'));
        await forcePageRefresh(page);
        await expect(await getFieldValue(page, 'device_model_name', 0)).toContainText('AV 025');
        await assertAccessibility(page, '[data-testid="StandardPage"]', {
            disabledRules: ['aria-required-children', 'aria-progressbar-name'],
        });
    });

    test('has breadcrumbs', async ({ page }) => {
        await expect(page.locator('uq-site-header').getByTestId('subsite-title')).toContainText('Test and tag');
    });

    test('sorting works as expected, and indicates overdue', async ({ page }) => {
        await page.setViewportSize({ width: 1300, height: 1000 });
        await assertTitles(page, locale.pages.report.recalibrationsDue.header.pageSubtitle('Library'));
        await forcePageRefresh(page);
        await expect(await getFieldValue(page, 'device_model_name', 0)).toContainText('AV 025');

        // Change the sort order
        await page.locator('.MuiDataGrid-columnHeader--sorted [aria-label="Sort"]').click();
        await expect(await getFieldValue(page, 'device_model_name', 0)).toContainText('Visual inspection');
        await page.locator('.MuiDataGrid-columnHeader--sorted [aria-label="Sort"]').click();
        await expect(await getFieldValue(page, 'device_model_name', 0)).toContainText('AV 025');

        // Check for overdue icon
        const dueDateCell = await getFieldValue(page, 'device_calibration_due_date', 2);
        await expect(dueDateCell.locator('svg')).toBeVisible();
    });
});
