import { expect, Page, test } from '@uq/pw/test';
import { assertAccessibility } from '@uq/pw/lib/axe';
import { assertExpectedDataSentToServer, setTestDataCookie } from '@uq/pw/lib/helpers';
import { assertToastHasMessage } from '@uq/pw/tests/adminPages/spaces/spacesTestHelper';

const LAW_DEFAULT_LATITUDE = '-27.49718';
const LAW_DEFAULT_LONGITUDE = '153.01214';
const CENTRAL_SPRINGSHARE_SPACE_ID = '10457';

const openLocationsPage = async (page: Page) => {
    await page.goto('/admin/spaces/manage/locations?user=libSpaces');
    await page.setViewportSize({ width: 1300, height: 1000 });
    await expect(page.getByTestId('admin-spaces-page-title').getByText(/Manage locations/)).toBeVisible();
};

const openEditCampusDialog = async (page: Page, campusId: number) => {
    await openLocationsPage(page);
    await expect(page.getByTestId(`edit-campus-${campusId}-button`)).toBeVisible();
    await page.getByTestId(`edit-campus-${campusId}-button`).click();
    await expect(page.getByTestId('main-dialog').locator('h2')).toContainText('Edit campus details');
};

const openEditLibraryDialog = async (page: Page, libraryId: number) => {
    await openLocationsPage(page);
    await expect(page.getByTestId(`edit-library-${libraryId}-button`)).toBeVisible();
    await page.getByTestId(`edit-library-${libraryId}-button`).click();
    await expect(page.getByTestId('main-dialog').locator('h2')).toContainText('Edit Library details');
};

const openDeleteConfirmation = async (page: Page) => {
    const dialog = page.getByTestId('main-dialog');
    await expect(page.getByTestId('confirmation-dialog')).not.toBeVisible();
    await dialog.getByTestId('dialog-delete-button').click({ force: true });
    await expect(page.getByTestId('confirmation-dialog')).toBeVisible();
};

test.describe('Spaces Admin - manage locations', () => {
    test('navigates to locations, renders the list accessibly, and returns to the dashboard', async ({ page }) => {
        await page.goto('/admin/spaces?user=libSpaces');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(page.getByTestId('admin-spaces-page-title').getByText(/Manage Spaces/)).toBeVisible();

        await page.getByTestId('admin-spaces-menu-button').click();
        await page.getByTestId('admin-spaces-visit-manage-locations-button').click();
        await expect(page).toHaveURL('http://localhost:2020/admin/spaces/manage/locations?user=libSpaces');

        await expect(page.getByTestId('spaces-location-wrapper').locator('> *')).toHaveCount(23);
        await expect(page.getByTestId('add-new-campus-button')).toBeVisible();
        await expect(page.getByTestId('groundfloor-for-4')).toBeVisible();
        await expect(page.getByTestId('groundfloor-for-5')).not.toBeVisible();
        await assertAccessibility(page, '[data-testid="SpacesAdminPage"]');

        await page.getByTestId('admin-spaces-menu-button').click();
        await page.getByTestId('admin-spaces-visit-dashboard-button').click();
        await expect(page).toHaveURL('http://localhost:2020/admin/spaces?user=libSpaces');
    });

    test('adds a campus through the edit page API', async ({ page, context }) => {
        await setTestDataCookie(context, page);
        await openLocationsPage(page);
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

    test('updates a campus through the edit page API', async ({ page, context }) => {
        await setTestDataCookie(context, page);
        await openEditCampusDialog(page, 1);

        const dialog = page.getByTestId('main-dialog');
        await assertAccessibility(page, '[data-testid="main-dialog"]');
        const campusNameInput = dialog.getByTestId('edit-campus-name').locator('input');
        const campusNumberInput = dialog.getByTestId('edit-campus-number').locator('input');
        await expect(campusNameInput).toHaveValue('St Lucia');
        await expect(campusNumberInput).toHaveValue('01');
        await campusNameInput.fill('St Lucia append');
        await campusNumberInput.fill('019');
        await expect(campusNameInput).toHaveValue('St Lucia append');
        await expect(campusNumberInput).toHaveValue('019');
        await dialog.getByTestId('dialog-save-button').click();

        await assertToastHasMessage(page, 'Change to campus saved');
        await assertExpectedDataSentToServer(page, {
            campus_name: 'St Lucia append',
            campus_number: '019',
            campus_latitude: LAW_DEFAULT_LATITUDE,
            campus_longitude: LAW_DEFAULT_LONGITUDE,
        });
    });

    test('adds a library with its campus and Springshare details', async ({ page, context }) => {
        await setTestDataCookie(context, page);
        await openEditCampusDialog(page, 1);
        await page.getByTestId('dialog-addnew-button').click();

        const dialog = page.getByTestId('main-dialog');
        await expect(dialog.locator('h2')).toContainText('Add a library to St Lucia campus');
        await assertAccessibility(page, '[data-testid="main-dialog"]');

        await dialog.getByTestId('library-name').locator('input').fill('name of new library');
        await dialog.getByTestId('building-name').locator('input').fill('name of new building');
        await dialog.getByTestId('building-number').locator('input').fill('0084');
        await page.getByTestId(`library_springshare_id-${CENTRAL_SPRINGSHARE_SPACE_ID}`).click();
        await dialog.getByTestId('library_about_page_default').locator('input').fill('https://example.com');
        await dialog.getByTestId('dialog-save-button').click();

        await assertExpectedDataSentToServer(page, {
            library_name: 'name of new library',
            building_name: 'name of new building',
            library_campus_id: '1',
            building_number: '0084',
            library_about_page_default: 'https://example.com',
            library_springshare_id: CENTRAL_SPRINGSHARE_SPACE_ID,
        });
    });

    test('adds a ground floor and keeps the ground-floor workflow accessible', async ({ page, context }) => {
        await setTestDataCookie(context, page);
        await openEditLibraryDialog(page, 2);

        const dialog = page.getByTestId('main-dialog');
        await assertAccessibility(page, '[data-testid="main-dialog"]');
        await dialog.getByTestId('dialog-addnew-button').click();
        await expect(dialog.locator('h2')).toContainText('Add a floor to');
        await expect(dialog.getByTestId('mark-ground-floor').locator('label')).toContainText(
            'Current ground floor is Level 1',
        );
        await assertAccessibility(page, '[data-testid="main-dialog"]');

        await dialog.getByTestId('floor-name').locator('input').fill('new name');
        await dialog.getByTestId('mark-ground-floor').locator('input').check();
        await dialog.getByTestId('dialog-save-button').click();

        await assertToastHasMessage(page, 'Level added');
        await assertExpectedDataSentToServer(page, {
            floor_name: 'new name',
            floor_library_id: '2',
        });
    });

    test('deletes a library through its confirmation dialog', async ({ page }) => {
        await openEditLibraryDialog(page, 1);
        const editDialog = page.getByTestId('main-dialog');

        await openDeleteConfirmation(page);
        await assertAccessibility(page, '[data-testid="confirmation-dialog"]');

        const confirmationDialog = page.getByTestId('confirmation-dialog');
        await expect(confirmationDialog.getByTestId('confirmation-dialog-message')).toContainText(
            'Do you really want to delete Walter Harrison Law Library?',
        );
        await expect(confirmationDialog.getByTestId('confirmation-dialog-message')).toContainText(
            'This will also delete associated floors.',
        );
        await confirmationDialog.getByTestId('confirmation-dialog-accept-button').click();

        await assertToastHasMessage(page, ' Walter Harrison Law Library deleted');
        await expect(confirmationDialog).not.toBeVisible();
        await expect(editDialog.locator('h2')).not.toBeVisible();
    });
});
