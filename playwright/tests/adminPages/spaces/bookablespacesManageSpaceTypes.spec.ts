import { expect, test } from '@uq/pw/test';
import { assertToastHasMessage } from '@uq/pw/tests/adminPages/spaces/spacesTestHelper';

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

    test('can add a space type with valid data', async ({ page }) => {
        await page.goto('/admin/spacetypes?user=libSpaces');
        await page.setViewportSize({ width: 1300, height: 1000 });

        await page.getByTestId('space-types-add-button').click();
        await page.getByTestId('space-types-add-name-input').locator('input').fill('New test room');
        await page
            .getByTestId('space-types-add-description-input')
            .locator('textarea')
            .first()
            .fill('For accessibility tests');
        await page.getByTestId('space-types-add-ok-button').click();

        await assertToastHasMessage(page, 'Space type created');
        await expect(page.getByTestId('space-types-add-dialog')).not.toBeVisible();
    });

    test('can cancel the add dialog and clear pending values', async ({ page }) => {
        await page.goto('/admin/spacetypes?user=libSpaces');
        await page.setViewportSize({ width: 1300, height: 1000 });

        await page.getByTestId('space-types-add-button').click();
        await page.getByTestId('space-types-add-name-input').locator('input').fill('Draft value');
        await page
            .getByTestId('space-types-add-description-input')
            .locator('textarea')
            .first()
            .fill('Temporary description');
        await page.getByTestId('space-types-add-cancel-button').click();

        await page.getByTestId('space-types-add-button').click();
        await expect(page.getByTestId('space-types-add-name-input').locator('input')).toHaveValue('');
        await expect(page.getByTestId('space-types-add-description-input').locator('textarea').first()).toHaveValue('');
    });

    test('can edit an existing space type inline and save', async ({ page }) => {
        await page.goto('/admin/spacetypes?user=libSpaces');
        await page.setViewportSize({ width: 1300, height: 1000 });

        await page.getByTestId('space-type-row-1-edit-button').click();
        await page.getByTestId('space-type-row-1-name-input').locator('input').fill('Updated communal space');
        await page
            .getByTestId('space-type-row-1-description-input')
            .locator('textarea')
            .first()
            .fill('Updated description');
        await page.getByTestId('space-type-row-1-save-button').click();

        await assertToastHasMessage(page, 'Space type updated');
        await expect(page.getByTestId('space-type-row-1-name')).toContainText('Updated communal space');
        await expect(page.getByTestId('space-type-row-1-description')).toContainText('Updated description');
    });
});
