import { expect, test } from '@uq/pw/test';
import { assertAccessibility } from '@uq/pw/lib/axe';

test.describe('Spaces Admin - manage locations', () => {
    test('page has correct data', async ({ page }) => {
        await page.goto('/admin/spaces?user=libSpaces');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(page.getByTestId('admin-spaces-page-title').getByText(/Manage Spaces/)).toBeVisible(); // page had loaded

        await expect(page.getByTestId('space-123456-facilitytype-Noise level')).toBeVisible();
        await expect(page.getByTestId('space-123456-facilitytype-Noise level')).toContainText('Low');

        await expect(page.getByTestId('space-1234544-facilitytype-Noise level')).toBeVisible();
        await expect(page.getByTestId('space-1234544-facilitytype-Noise level')).toContainText('High');

        await expect(page.getByTestId('space-43534-facilitytype-Noise level')).toBeVisible();
        await expect(page.getByTestId('space-43534-facilitytype-Noise level')).toContainText('Medium');
    });
    test('add spaces page is accessible', async ({ page }) => {
        await page.goto('/admin/spaces?user=libSpaces');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(page.getByTestId('admin-spaces-page-title').getByText(/Manage Spaces/)).toBeVisible(); // page had loaded

        await assertAccessibility(page, '[data-testid="StandardPage"]', {
            disabledRules: ['empty-table-header', 'scrollable-region-focusable'], // as this is an admin page we don't care that much
        });
    });
});
