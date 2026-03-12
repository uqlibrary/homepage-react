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
        await assertTitles(
            page,
            locale.pages.report.recalibrationsDue.header.pageSubtitle('Work Station Support', 'Library'),
        );
        await forcePageRefresh(page);
        await expect((await getFieldValue(page, 'device_model_name', 0)).getByText('AV 025')).toBeVisible();
        await assertAccessibility(page, '[data-testid="StandardPage"]');
    });

    test('sorting works as expected, and indicates overdue', async ({ page }) => {
        await page.setViewportSize({ width: 1300, height: 1000 });
        await assertTitles(
            page,
            locale.pages.report.recalibrationsDue.header.pageSubtitle('Work Station Support', 'Library'),
        );
        await forcePageRefresh(page);
        await expect((await getFieldValue(page, 'device_model_name', 0)).getByText('AV 025')).toBeVisible();
        // Change the sort order
        await page.locator('.MuiDataGrid-columnHeader--sorted [aria-label="Sort"]').click();
        await expect((await getFieldValue(page, 'device_model_name', 0)).getByText('Visual inspection')).toBeVisible();
        await page.locator('.MuiDataGrid-columnHeader--sorted [aria-label="Sort"]').click();
        await expect((await getFieldValue(page, 'device_model_name', 0)).getByText('AV 025')).toBeVisible();
        // Check for overdue icon
        const dueDateCell = await getFieldValue(page, 'device_calibration_due_date', 2);
        await expect(dueDateCell.locator('svg')).toBeVisible();
    });
});
