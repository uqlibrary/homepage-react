import { expect, test } from '@uq/pw/test';

test.describe('Spaces Admin - manage space types', () => {
    test('can navigate from dashboard to manage space types', async ({ page }) => {
        await page.goto('/admin/spaces?user=libSpaces');
        await page.setViewportSize({ width: 1300, height: 1000 });

        await expect(page.getByTestId('admin-spaces-page-title').getByText(/Manage Spaces/)).toBeVisible();

        const visitSpaceTypesButton = page.getByTestId('admin-spacetypes-visit-dashboard-button');

        await expect(visitSpaceTypesButton).not.toBeVisible();
        await expect(page.getByTestId('admin-spaces-menu')).not.toBeVisible();
        await expect(page.getByTestId('admin-spaces-menu-button')).toBeVisible();

        await page.getByTestId('admin-spaces-menu-button').click();
        await expect(page.getByTestId('admin-spaces-menu')).toBeVisible();
        await expect(visitSpaceTypesButton).toBeVisible();

        await visitSpaceTypesButton.click();
        await expect(page).toHaveURL('http://localhost:2020/admin/spacetypes?user=libSpaces');
    });

    test('manage space types page appears as expected onload', async ({ page }) => {
        await page.goto('/admin/spacetypes?user=libSpaces');
        await page.setViewportSize({ width: 1300, height: 1000 });

        await expect(page.getByTestId('admin-spaces-page-title').getByText(/Manage Space Types/)).toBeVisible();
        await expect(page.getByTestId('space-types-add-button')).toBeVisible();
        await expect(page.getByTestId('space-types-table')).toBeVisible();

        await expect(page.getByTestId('space-type-row-1-name')).toContainText('Communal space');
        await expect(page.getByTestId('space-type-row-2-name')).toContainText('Training room');
        await expect(page.getByTestId('space-type-row-4-name')).toContainText('Individual study');

        await page.getByTestId('space-types-add-button').click();
        await expect(page.getByTestId('space-types-add-dialog')).toBeVisible();
        await expect(page.getByTestId('space-types-add-name-input')).toBeVisible();
        await expect(page.getByTestId('space-types-add-ok-button')).toBeDisabled();
    });
});
