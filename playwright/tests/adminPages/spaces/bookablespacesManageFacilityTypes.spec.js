import { BrowserContext, expect, Page, test } from '@uq/pw/test';
import { COLOR_UQPURPLE } from '@uq/pw/lib/constants';

test.describe('Spaces Admin - manage facility types', () => {
    test('can navigate from dashboard to manage facility types', async ({ page }) => {
        await page.goto('/admin/spaces?user=libSpaces');
        await page.setViewportSize({ width: 1300, height: 1000 });

        await expect(page.getByTestId('admin-spaces-page-title').getByText(/Manage Spaces/)).toBeVisible();

        const visitManageLocationsButton = page.getByTestId('admin-spaces-visit-manage-facilities-button');

        await expect(visitManageLocationsButton).not.toBeVisible();
        await expect(page.getByTestId('admin-spaces-menu')).not.toBeVisible();
        await expect(page.getByTestId('admin-spaces-menu-button')).toBeVisible();
        page.getByTestId('admin-spaces-menu-button').click();
        await expect(page.getByTestId('admin-spaces-menu')).toBeVisible();
        await expect(visitManageLocationsButton).toBeVisible();

        visitManageLocationsButton.click();
        await expect(page).toHaveURL('http://localhost:2020/admin/spaces/manage/facilitytypes?user=libSpaces');
    });
});
test.describe('Spaces Admin - manage facility types', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/admin/spaces/manage/facilitytypes?user=libSpaces');
        await page.setViewportSize({ width: 1300, height: 1000 });
        // wait for page to load
        await expect(page.getByTestId('admin-spaces-page-title').getByText(/Manage Facility types/)).toBeVisible();
    });
    test('manage facility types appears as expected onload', async ({ page }) => {
        const addGroupButton = page.getByTestId('add-new-group-button');
        await expect(addGroupButton).toBeVisible();
        await expect(addGroupButton).toHaveCSS('background-color', COLOR_UQPURPLE);
        await expect(addGroupButton).toHaveCSS('border-color', COLOR_UQPURPLE);
        await expect(addGroupButton).toHaveCSS('color', 'rgb(255, 255, 255)');

        await expect(page.getByTestId('facilitygroup-noise-level').getByTestId('facilitytype-input-1')).toBeVisible();
        // await expect(page.getByTestId('facilitygroup-noise-level').getByTestId('facilitytype-input-1')).toContainText(
        // await expect(page.getByTestId('facilitygroup-noise-level')).toContainText('Noise level Low');
        await expect(page.getByTestId('facilitygroup-noise-level').getByTestId('facilitytype-input-1')).toHaveValue(
            'Noise level Low',
        );
        await expect(page.getByTestId('facilitygroup-noise-level').getByTestId('facilitytype-input-2')).toHaveValue(
            'Noise level Medium',
        );
        await expect(page.getByTestId('facilitygroup-noise-level').getByTestId('facilitytype-input-3')).toHaveValue(
            'Noise level High',
        );
        await expect(page.getByTestId('facilitygroup-noise-level').getByTestId('add-type-noise-level')).toBeVisible();

        await expect(page.getByTestId('facilitygroup-room-features').getByTestId('facilitytype-input-4')).toHaveValue(
            'AT technology',
        );
        await expect(page.getByTestId('facilitygroup-room-features').getByTestId('facilitytype-input-5')).toHaveValue(
            'AV equipment',
        );
        await expect(page.getByTestId('facilitygroup-room-features').getByTestId('facilitytype-input-6')).toHaveValue(
            'Capacity (??)',
        );
        await expect(page.getByTestId('facilitygroup-room-features').getByTestId('facilitytype-input-7')).toHaveValue(
            'Exam Friendly',
        );
        await expect(page.getByTestId('facilitygroup-room-features').getByTestId('facilitytype-input-8')).toHaveValue(
            'Postgraduate spaces',
        );
        await expect(page.getByTestId('facilitygroup-room-features').getByTestId('facilitytype-input-9')).toHaveValue(
            'Power outlets',
        );
        await expect(page.getByTestId('facilitygroup-room-features').getByTestId('facilitytype-input-10')).toHaveValue(
            'Undergrad spaces',
        );
        await expect(page.getByTestId('facilitygroup-room-features').getByTestId('facilitytype-input-11')).toHaveValue(
            'Whiteboard',
        );
        await expect(
            page.getByTestId('facilitygroup-room-features').getByTestId('add-type-room-features'),
        ).toBeVisible();

        await expect(page.getByTestId('facilitygroup-opening-hours').getByTestId('facilitytype-input-12')).toHaveValue(
            'Opening hours',
        );
        await expect(
            page.getByTestId('facilitygroup-opening-hours').getByTestId('add-type-opening-hours'),
        ).toBeVisible();

        await expect(page.getByTestId('facilitygroup-services').getByTestId('facilitytype-input-13')).toHaveValue(
            'AskUs service',
        );
        await expect(page.getByTestId('facilitygroup-services').getByTestId('facilitytype-input-14')).toHaveValue(
            'Food outlets',
        );
        await expect(page.getByTestId('facilitygroup-services').getByTestId('facilitytype-input-15')).toHaveValue(
            'Production Printing Services',
        );
        await expect(page.getByTestId('facilitygroup-services').getByTestId('facilitytype-input-16')).toHaveValue(
            'Retail Outlets',
        );
        await expect(page.getByTestId('facilitygroup-services').getByTestId('add-type-services')).toBeVisible();

        await expect(page.getByTestId('facilitygroup-outdoor').getByTestId('facilitytype-input-17')).toHaveValue(
            'Contains Artwork',
        );
        await expect(page.getByTestId('facilitygroup-outdoor').getByTestId('facilitytype-input-18')).toHaveValue(
            'Displays',
        );
        await expect(page.getByTestId('facilitygroup-outdoor').getByTestId('facilitytype-input-19')).toHaveValue(
            'Landmark',
        );
        await expect(page.getByTestId('facilitygroup-outdoor').getByTestId('add-type-outdoor')).toBeVisible();

        const saveButton = page.getByTestId('spaces-facilitytypes-saveChange');
        await expect(saveButton).toBeVisible();
        await expect(saveButton).toHaveCSS('background-color', COLOR_UQPURPLE);
        await expect(saveButton).toHaveCSS('border-color', COLOR_UQPURPLE);
        await expect(saveButton).toHaveCSS('color', 'rgb(255, 255, 255)');
    });
});
