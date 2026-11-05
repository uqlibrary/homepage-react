import { test, expect } from '@uq/pw/test';
import { assertAccessibility } from '@uq/pw/lib/axe';
import { assertTitles, forcePageRefresh, getFieldValue } from '../helpers';
import { default as locale } from '../../../../../src/modules/Pages/Admin/TestTag/testTag.locale';

test.describe('Test and Tag Manage Locations', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:2020/admin/testntag/manage/locations?user=uqtesttag');
    });

    test('page is accessible and can add a site', async ({ page }) => {
        await page.setViewportSize({ width: 1300, height: 1000 });
        await assertTitles(page, locale.pages.manage.locations.header.pageSubtitle('Work Station Support', 'Library'));
        await forcePageRefresh(page);
        await expect((await getFieldValue(page, 'site_id_displayed', 0)).getByText('01')).toBeVisible();
        await expect((await getFieldValue(page, 'site_name', 0)).getByText('St Lucia')).toBeVisible();
        await assertAccessibility(page, '[data-testid="StandardPage"]');

        await page.getByTestId('locations-data-table-toolbar-add-button').click();
        await assertAccessibility(page, '[data-testid="StandardPage"]');
        await expect(page.getByTestId('site_id_displayed-input')).toHaveAttribute('required');
        await expect(page.getByTestId('site_name-input')).toHaveAttribute('required');
        await page.getByTestId('site_id_displayed-input').fill('cypresstest');
        await page.getByTestId('site_name-input').fill('Cypress Test');
        await page.getByTestId('site_excluded_cb-input').click();
        // Limit size to 10
        await expect(page.getByTestId('site_id_displayed-input')).toHaveValue('cypresstes');
        await expect(page.getByTestId('site_excluded_cb-input')).toBeChecked();

        await page.getByTestId('update_dialog-action-button').click();
        await expect(page.getByTestId('confirmation_alert-success-alert')).toBeVisible();
    });
});
