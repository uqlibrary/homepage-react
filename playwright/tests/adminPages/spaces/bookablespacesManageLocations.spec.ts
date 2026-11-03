import { expect, test } from '@uq/pw/test';
import { assertAccessibility } from '@uq/pw/lib/axe';
import { assertExpectedDataSentToServer, setTestDataCookie } from '@uq/pw/lib/helpers';
import { assertToastHasMessage } from '@uq/pw/tests/adminPages/spaces/spacesTestHelper';

const LAW_DEFAULT_LATITUDE = '-27.49718';
const LAW_DEFAULT_LONGITUDE = '153.01214';

test.describe('Spaces Admin - manage locations', () => {
    test('loads locations accessibly and adds a campus through the API', async ({ page, context }) => {
        await setTestDataCookie(context, page);
        await page.goto('/admin/spaces/manage/locations?user=libSpaces');
        await page.setViewportSize({ width: 1300, height: 1000 });

        await expect(page.getByTestId('admin-spaces-page-title').getByText(/Manage locations/)).toBeVisible();
        await expect(page.getByTestId('spaces-location-wrapper').locator('> *')).toHaveCount(23);
        await expect(page.getByTestId('groundfloor-for-4')).toBeVisible();
        await expect(page.getByTestId('groundfloor-for-5')).not.toBeVisible();
        await assertAccessibility(page, '[data-testid="SpacesAdminPage"]');

        await page.getByTestId('add-new-campus-button').click();
        const dialog = page.getByTestId('main-dialog');
        await expect(dialog.getByTestId('add-campus-heading')).toContainText('Add campus');
        await assertAccessibility(page, '[data-testid="main-dialog"]');

        await dialog.press('Escape');
        await expect(dialog).not.toBeVisible();
        await page.getByTestId('add-new-campus-button').click();

        await dialog.getByTestId('add-campus-name').locator('input').fill('name of new campus');
        await dialog.getByTestId('add-campus-number').locator('input').fill('0076');
        await dialog.getByTestId('dialog-save-button').click();

        await assertToastHasMessage(page, 'Campus added');
        await assertExpectedDataSentToServer(page, {
            campus_name: 'name of new campus',
            campus_number: '0076',
            campus_latitude: LAW_DEFAULT_LATITUDE,
            campus_longitude: LAW_DEFAULT_LONGITUDE,
        });
    });
});
