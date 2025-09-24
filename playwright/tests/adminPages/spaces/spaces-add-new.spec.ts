import { expect, test } from '@uq/pw/test';
import { assertAccessibility } from '@uq/pw/lib/axe';

import { COLOR_UQPURPLE } from '@uq/pw/lib/constants';

test.describe('Spaces Admin - manage locations', () => {
    test('can navigate from dashboard to add new', async ({ page }) => {
        await page.goto('/admin/spaces?user=libSpaces');
        await page.setViewportSize({ width: 1300, height: 1000 });

        await expect(page.getByTestId('admin-spaces-page-title').getByText(/Manage Spaces/)).toBeVisible();

        const navigationMenuButton = page.getByTestId('admin-spaces-menu-button');
        const navigationDropdownMenu = page.getByTestId('admin-spaces-menu');
        const addNewSpaceOption = page.getByTestId('admin-spaces-visit-add-space-button');

        await expect(addNewSpaceOption).not.toBeVisible();
        await expect(navigationDropdownMenu).not.toBeVisible();
        await expect(navigationMenuButton).toBeVisible();
        navigationMenuButton.click();

        await expect(navigationDropdownMenu).toBeVisible();
        await expect(addNewSpaceOption).toBeVisible();

        addNewSpaceOption.click();
        await expect(page).toHaveURL('http://localhost:2020/admin/spaces/add?user=libSpaces');
    });
});
test.describe('Spaces Admin - manage locations', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/admin/spaces/add?user=libSpaces');
        await page.setViewportSize({ width: 1300, height: 1000 });
        // wait for page to load
        await expect(page.getByTestId('admin-spaces-page-title').getByText(/Add a new Space/)).toBeVisible();
    });
    test('add new space appears as expected onload', async ({ page }) => {
        await expect(page.getByTestId('space-name').locator('input')).toBeVisible();
        await expect(page.getByTestId('space-type').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-select-campus').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-select-building').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-select-floor').locator('input')).toBeVisible();

        const cancelButton = page.getByTestId('admin-spaces-form-button-cancel');
        await expect(cancelButton).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
        await expect(cancelButton).toHaveCSS('border-color', COLOR_UQPURPLE);
        await expect(cancelButton).toHaveCSS('color', COLOR_UQPURPLE);

        const saveButton = page.getByTestId('admin-spaces-save-button-submit');
        await expect(saveButton).toHaveCSS('background-color', COLOR_UQPURPLE);
        await expect(saveButton).toHaveCSS('border-color', COLOR_UQPURPLE);
        await expect(saveButton).toHaveCSS('color', 'rgb(255, 255, 255)');
    });
    test('add spaces page is accessible', async ({ page }) => {
        await assertAccessibility(page, '[data-testid="StandardPage"]');
    });
    test('can add new space', async ({ page }) => {
        await expect(page.getByTestId('space-name').locator('input')).toBeVisible();
        page.getByTestId('space-name')
            .locator('input')
            .fill('W12343');
        await expect(page.getByTestId('space-type').locator('input')).toBeVisible();
        page.getByTestId('space-type')
            .locator('input')
            .fill('Computer room');
        await expect(page.getByTestId('admin-spaces-save-button-submit')).toBeVisible();
        page.getByTestId('admin-spaces-save-button-submit').click();

        await expect(page.getByTestId('message-title')).toBeVisible();
        await expect(page.getByTestId('message-title')).toContainText('A Space has been added');
    });
    test('add spaces page save dialog is accessible', async ({ page }) => {
        await expect(page.getByTestId('space-name').locator('input')).toBeVisible();
        page.getByTestId('space-name')
            .locator('input')
            .fill('W12343');
        await expect(page.getByTestId('space-type').locator('input')).toBeVisible();
        page.getByTestId('space-type')
            .locator('input')
            .fill('Computer room');
        await expect(page.getByTestId('admin-spaces-save-button-submit')).toBeVisible();
        page.getByTestId('admin-spaces-save-button-submit').click();

        await expect(page.getByTestId('message-title')).toBeVisible();
        await expect(page.getByTestId('message-title')).toContainText('A Space has been added');

        await assertAccessibility(page, '[aria-labelledby=":r1:"]');
    });
    test('add new space - validation - required fields', async ({ page }) => {
        // when the user has not entered required fields, they get an error
        await expect(page.getByTestId('admin-spaces-save-button-submit')).toBeVisible();
        page.getByTestId('admin-spaces-save-button-submit').click();
        await expect(page.getByTestId('toast-corner-message')).toBeVisible();
        await expect(page.getByTestId('toast-corner-message')).toContainText('Please enter all required fields');
    });
    test.only('add new space - can change the location', async ({ page }) => {
        // the page loads with the expected campus-building-floor
        await expect(page.getByTestId('add-space-select-campus').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-select-campus')).toContainText('St Lucia');
        await expect(page.getByTestId('add-space-select-building').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-select-building')).toContainText('Forgan Smith Building');
        await expect(page.getByTestId('add-space-select-floor').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-select-floor')).toContainText('Forgan Smith Building - 1');

        // open the campus dropdown
        page.getByTestId('add-space-select-campus').click();

        // the popup that opens holds the two valid campuses
        await expect(page.locator('[aria-labelledby="add-space-select-campus-label"]')).toBeVisible();
        await expect(page.locator('[aria-labelledby="add-space-select-campus-label"]').locator(' > *')).toHaveCount(2);
        await expect(page.locator('[aria-labelledby="add-space-select-campus-label"] li:first-of-type')).toBeVisible();
        await expect(page.locator('[aria-labelledby="add-space-select-campus-label"] li:first-of-type')).toContainText(
            'St Lucia',
        );
        await expect(page.locator('[aria-labelledby="add-space-select-campus-label"] li:last-of-type')).toBeVisible();
        await expect(page.locator('[aria-labelledby="add-space-select-campus-label"] li:last-of-type')).toContainText(
            'Gatton',
        );

        // click on "Gatton" to change campus
        page.locator('ul[aria-labelledby="add-space-select-campus-label"] li:last-of-type').click();

        // the displayed campus, building and floor shown have changed
        await expect(page.getByTestId('add-space-select-campus').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-select-campus')).toContainText('Gatton');
        await expect(page.getByTestId('add-space-select-building').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-select-building')).toContainText('J.K. Murray Library');
        await expect(page.getByTestId('add-space-select-floor').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-select-floor')).toContainText('J.K. Murray Library - 29');

        // open the building dropdown to change building
        page.getByTestId('add-space-select-building').click();

        // the popup has the two valid buildings
        await expect(page.locator('[aria-labelledby="add-space-select-building-label"]')).toBeVisible();
        await expect(page.locator('[aria-labelledby="add-space-select-building-label"]').locator(' > *')).toHaveCount(
            2,
        );
        await expect(page.locator('[aria-labelledby="add-space-select-building-label"] li:first-child')).toBeVisible();
        await expect(
            page.locator('[aria-labelledby="add-space-select-building-label"] li:first-of-type'),
        ).toContainText('J.K. Murray Library');
        await expect(page.locator('[aria-labelledby="add-space-select-building-label"] li:last-of-type')).toBeVisible();
        await expect(page.locator('[aria-labelledby="add-space-select-building-label"] li:last-of-type')).toContainText(
            'Library Warehouse',
        );

        // click on building 'Warehouse' to change the building and floor
        page.locator('ul[aria-labelledby="add-space-select-building-label"] li:last-of-type').click();

        // the displayed building and floors have changed; campus is unchanged
        await expect(page.getByTestId('add-space-select-campus').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-select-campus')).toContainText('Gatton');
        await expect(page.getByTestId('add-space-select-building').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-select-building')).toContainText('J.K. Murray Library');
        await expect(page.getByTestId('add-space-select-floor').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-select-floor')).toContainText('Library Warehouse - 31');

        // open the campus dropdown
        page.getByTestId('add-space-select-campus').click();

        // the popup that opens holds the two valid campuses
        await expect(page.locator('[aria-labelledby="add-space-select-campus-label"]')).toBeVisible();
        await expect(page.locator('[aria-labelledby="add-space-select-campus-label"]').locator(' > *')).toHaveCount(2);

        // click on "St Lucia" to change campus
        page.locator('ul[aria-labelledby="add-space-select-campus-label"] li:first-of-type').click();

        // the displayed campus, building and floor shown have changed
        await expect(page.getByTestId('add-space-select-campus').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-select-campus')).toContainText('St Lucia');
        await expect(page.getByTestId('add-space-select-building').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-select-building')).toContainText('Forgan Smith Building');
        await expect(page.getByTestId('add-space-select-floor').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-select-floor')).toContainText('Forgan Smith Building - 1');

        // open the building dropdown to change building
        page.getByTestId('add-space-select-building').click();

        // the popup has the two valid buildings
        await expect(page.locator('[aria-labelledby="add-space-select-building-label"]')).toBeVisible();
        await expect(page.locator('[aria-labelledby="add-space-select-building-label"]').locator(' > *')).toHaveCount(
            2,
        );
        await expect(page.locator('[aria-labelledby="add-space-select-building-label"] li:first-child')).toBeVisible();
        await expect(
            page.locator('[aria-labelledby="add-space-select-building-label"] li:first-of-type'),
        ).toContainText('Forgan Smith Building');
        await expect(page.locator('[aria-labelledby="add-space-select-building-label"] li:last-of-type')).toBeVisible();
        await expect(page.locator('[aria-labelledby="add-space-select-building-label"] li:last-of-type')).toContainText(
            'Duhig Tower',
        );

        // click on building 'Duhig Tower' to change the building and floor
        page.locator('ul[aria-labelledby="add-space-select-building-label"] li:last-of-type').click();

        // the displayed building and floors have changed; campus is unchanged
        await expect(page.getByTestId('add-space-select-campus').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-select-campus')).toContainText('St Lucia');
        await expect(page.getByTestId('add-space-select-building').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-select-building')).toContainText('Duhig Tower');
        await expect(page.getByTestId('add-space-select-floor').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-select-floor')).toContainText('Duhig Tower - 4');
    });
});
