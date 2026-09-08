import { expect, test } from '@uq/pw/test';

test.describe('Spaces Admin shell', () => {
    test('admin dashboard menu opens and routes to the locations page', async ({ page }) => {
        await page.goto('/admin/spaces?user=libSpaces');
        await page.setViewportSize({ width: 1300, height: 1000 });

        const menuButton = page.getByTestId('admin-spaces-menu-button');
        await expect(menuButton).toBeVisible();
        await expect(page.getByTestId('admin-spaces-page-title')).toContainText('Manage Spaces');

        await menuButton.click();
        await expect(page.getByTestId('admin-spaces-menu')).toBeVisible();
        await expect(page.getByTestId('admin-spaces-visit-dashboard-button')).toContainText('Manage Spaces');
        await expect(page.getByTestId('admin-spaces-visit-manage-locations-button')).toContainText('Manage Locations');

        await page.getByTestId('admin-spaces-visit-manage-locations-button').click();
        await expect(page).toHaveURL('http://localhost:2020/admin/spaces/manage/locations?user=libSpaces');
    });

    test('the manage locations page loads its top-level admin title', async ({ page }) => {
        await page.goto('/admin/spaces/manage/locations?user=libSpaces');
        await page.setViewportSize({ width: 1300, height: 1000 });

        await expect(page.getByTestId('admin-spaces-page-title')).toContainText('Manage locations');
        await expect(page.getByTestId('SpacesAdminPage-systemTitle')).toContainText('Spaces');
    });
});
