import { expect, test } from '@uq/pw/test';
import { assertAccessibility } from '@uq/pw/lib/axe';

test.describe('Spaces Admin - manage locations', () => {
    test('page has correct data', async ({ page }) => {
        await page.goto('/admin/spaces?user=libSpaces');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(page.getByTestId('admin-spaces-page-title').getByText(/Manage Spaces/)).toBeVisible(); // page had loaded

        const greenTick = id =>
            page.getByTestId(`${id}`).locator('svg path[d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"]');

        // 01-W431 has Low noise levels
        await expect(page.getByTestId('space-123456-facilitytype-noise-level-low')).toBeVisible();
        await expect(greenTick('space-123456-facilitytype-noise-level-low')).toBeVisible(); // LOW noise

        await expect(page.getByTestId('space-123456-facilitytype-noise-level-medium')).toBeVisible();
        await expect(greenTick('space-123456-facilitytype-noise-level-medium')).not.toBeVisible();

        await expect(page.getByTestId('space-123456-facilitytype-noise-level-high')).toBeVisible();
        await expect(greenTick('space-123456-facilitytype-noise-level-high')).not.toBeVisible();

        // 6078 has High noise levels
        await expect(page.getByTestId('space-1234544-facilitytype-noise-level-low')).toBeVisible();
        await expect(greenTick('space-1234544-facilitytype-noise-level-low')).not.toBeVisible();

        await expect(page.getByTestId('space-1234544-facilitytype-noise-level-medium')).toBeVisible();
        await expect(greenTick('space-1234544-facilitytype-noise-level-medium')).not.toBeVisible();

        await expect(page.getByTestId('space-1234544-facilitytype-noise-level-high')).toBeVisible();
        await expect(greenTick('space-1234544-facilitytype-noise-level-high')).toBeVisible(); // HIGH noise

        // 46-342/343 has Medium noise levels
        await expect(page.getByTestId('space-43534-facilitytype-noise-level-low')).toBeVisible();
        await expect(greenTick('space-43534-facilitytype-noise-level-low')).not.toBeVisible();

        await expect(page.getByTestId('space-43534-facilitytype-noise-level-medium')).toBeVisible();
        await expect(greenTick('space-43534-facilitytype-noise-level-medium')).toBeVisible(); // MEDIUM noise

        await expect(page.getByTestId('space-43534-facilitytype-noise-level-high')).toBeVisible();
        await expect(greenTick('space-43534-facilitytype-noise-level-high')).not.toBeVisible();
    });
    test('single result is as expected', async ({ page }) => {
        await page.goto('/admin/spaces?user=libSpaces&responseType=facilityTypesWithOne');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(page.getByTestId('admin-spaces-page-title').getByText(/Manage Spaces/)).toBeVisible();

        await expect(page.getByTestId('spaces-dashboard-header-row').locator('> th')).toHaveCount(3);
    });
    test('spaces dashboard page is accessible', async ({ page }) => {
        await page.goto('/admin/spaces?user=libSpaces');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(page.getByTestId('admin-spaces-page-title').getByText(/Manage Spaces/)).toBeVisible(); // page had loaded

        await assertAccessibility(page, '[data-testid="StandardPage"]', {
            disabledRules: ['empty-table-header', 'scrollable-region-focusable'], // as this is an admin page we don't care that much
        });
    });
});
