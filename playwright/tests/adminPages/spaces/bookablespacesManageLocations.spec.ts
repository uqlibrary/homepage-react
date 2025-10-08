import { expect, Page, test } from '@uq/pw/test';
import { assertAccessibility } from '@uq/pw/lib/axe';
import { ARMUS_SPRINGSHARE_ID, CENTRAL_SPRINGSHARE_ID } from '../../../../src/config/locale';
import { assertExpectedDataSentToServer, setTestDataCookie } from '@uq/pw/lib/helpers';

async function assertToastHasMessage(page: Page, msg: string) {
    await expect(page.getByTestId('toast-corner-message')).toBeVisible();
    await expect(page.getByTestId('toast-corner-message')).toContainText(msg);
}

async function clickDeleteButton(page: Page) {
    const mainDialog = page.getByTestId('main-dialog');
    await expect(page.getByTestId('confirmation-dialog')).not.toBeVisible();
    await mainDialog.getByTestId('dialog-delete-button').click();
    await expect(page.getByTestId('confirmation-dialog')).toBeVisible();
}

test.describe('Spaces Admin - manage locations', () => {
    test('can navigate from dashboard to manage locations', async ({ page }) => {
        await page.goto('/admin/spaces?user=libSpaces');
        await page.setViewportSize({ width: 1300, height: 1000 });

        await expect(page.getByTestId('admin-spaces-page-title').getByText(/Manage Spaces/)).toBeVisible();

        const visitManageLocationsButton = page.getByTestId('admin-spaces-visit-manage-locations-button');

        await expect(visitManageLocationsButton).not.toBeVisible();
        await expect(page.getByTestId('admin-spaces-menu')).not.toBeVisible();
        await expect(page.getByTestId('admin-spaces-menu-button')).toBeVisible();
        page.getByTestId('admin-spaces-menu-button').click();
        await expect(page.getByTestId('admin-spaces-menu')).toBeVisible();
        await expect(visitManageLocationsButton).toBeVisible();

        visitManageLocationsButton.click();
        await expect(page).toHaveURL('http://localhost:2020/admin/spaces/manage/locations?user=libSpaces');
    });
});

test.describe('Spaces Location admin', () => {
    test('Shows a basic page for Spaces Location Admin', async ({ page }) => {
        await page.goto('/admin/spaces/manage/locations?user=libSpaces');
        await page.setViewportSize({ width: 1300, height: 1000 });

        // wait for page to load
        await expect(page.getByTestId('admin-spaces-page-title').getByText(/Manage locations/)).toBeVisible();
        await expect(page.getByTestId('spaces-location-wrapper').locator('> *')).toHaveCount(16); // 3 locations with 4 libraries 9 floors
        await expect(page.getByTestId('add-new-campus-button')).toBeVisible();

        // ground floors correctly marked
        await expect(page.getByTestId('groundfloor-for-1')).not.toBeVisible(); // forgan, floor 2
        await expect(page.getByTestId('groundfloor-for-2')).not.toBeVisible(); // forgan, floor 3A
        await expect(page.getByTestId('groundfloor-for-4')).toBeVisible(); // duhig tower, floor 1
        await expect(page.getByTestId('groundfloor-for-5')).not.toBeVisible(); // duhig tower, floor 2
        await expect(page.getByTestId('groundfloor-for-29')).toBeVisible(); // jk murray, floor 1
        await expect(page.getByTestId('groundfloor-for-30')).not.toBeVisible(); // jk murray, floor 2
        await expect(page.getByTestId('groundfloor-for-31')).not.toBeVisible(); // warehouse, floor 1
        await expect(page.getByTestId('groundfloor-for-32')).not.toBeVisible(); // warehouse, floor 2
    });
    test('full list is accessible', async ({ page }) => {
        await page.goto('/admin/spaces/manage/locations?user=libSpaces');
        await page.setViewportSize({ width: 1300, height: 1000 });

        // wait for page to load
        await expect(page.getByTestId('admin-spaces-page-title').getByText(/Manage locations/)).toBeVisible();

        await assertAccessibility(page, '[data-testid="StandardPage"]');
    });

    test.describe('Add a campus', () => {
        async function assertCanOpenAddNewCampusDialog(page: Page) {
            await page.goto('/admin/spaces/manage/locations?user=libSpaces');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.getByTestId('add-new-campus-button')).toContainText('Add new Campus');
            await page.getByTestId('add-new-campus-button').click();
        }

        test('campus add form has expected fields', async ({ page }) => {
            await assertCanOpenAddNewCampusDialog(page);

            const dialog = page.getByTestId('main-dialog');

            await expect(dialog.getByTestId('add-campus-heading')).toContainText('Add campus');
            await expect(dialog.getByTestId('add-campus-name').locator('label')).toContainText('New campus name');
            await expect(dialog.getByTestId('add-campus-name').locator('input')).toBeVisible();
            await expect(dialog.getByTestId('add-campus-number').locator('label')).toContainText('Campus number');
            await expect(dialog.getByTestId('add-campus-number').locator('input')).toBeVisible();

            await expect(dialog.getByTestId('dialog-delete-button')).not.toBeVisible();
            await expect(dialog.getByTestId('dialog-addnew-button')).not.toBeVisible();
            await expect(dialog.getByTestId('dialog-cancel-button')).toBeVisible();
            await expect(dialog.getByTestId('dialog-cancel-button')).toContainText('Cancel');
            await expect(dialog.getByTestId('dialog-save-button')).toBeVisible();
            await expect(dialog.getByTestId('dialog-save-button')).toContainText('Save');
        });
        test('add campus dialog is accessible', async ({ page }) => {
            await assertCanOpenAddNewCampusDialog(page);

            await assertAccessibility(page, '[data-testid="main-dialog"]');
        });
        test('validates properly for two empty campus fields', async ({ page }) => {
            await assertCanOpenAddNewCampusDialog(page);

            // save without entering anything in the form
            await page.getByTestId('dialog-save-button').click();
            await assertToastHasMessage(page, 'Please enter campus name and number');
        });
        test('validates properly - campus number field empty gives an error', async ({ page }) => {
            await assertCanOpenAddNewCampusDialog(page);

            // save after not entering the number field
            await expect(page.getByTestId('add-campus-name').locator('input')).toBeVisible();
            await page
                .getByTestId('add-campus-name')
                .locator('input')
                .fill('name of new campus');
            await page.getByTestId('dialog-save-button').click();

            await assertToastHasMessage(page, 'Please enter campus name and number');
        });
        test('validates properly - campus name field empty gives an error', async ({ page }) => {
            await assertCanOpenAddNewCampusDialog(page);

            // save after not entering the name field
            await expect(page.getByTestId('add-campus-number').locator('input')).toBeVisible();
            await page
                .getByTestId('add-campus-number')
                .locator('input')
                .fill('number of new campus');
            await page.getByTestId('dialog-save-button').click();
            await assertToastHasMessage(page, 'Please enter campus name and number');
        });
        test('can save with valid campus data', async ({ page, context }) => {
            await setTestDataCookie(context, page);

            await page.goto('/admin/spaces/manage/locations?user=libSpaces');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.getByTestId('add-new-campus-button')).toContainText('Add new Campus');
            await page.getByTestId('add-new-campus-button').click();

            await expect(page.getByTestId('add-campus-name').locator('input')).toBeVisible();
            await page
                .getByTestId('add-campus-name')
                .locator('input')
                .fill('name of new campus');
            await expect(page.getByTestId('add-campus-number').locator('input')).toBeVisible();
            await page
                .getByTestId('add-campus-number')
                .locator('input')
                .fill('0076');
            await page.getByTestId('dialog-save-button').click();
            await assertToastHasMessage(page, 'Campus added');
            // cant assert change happens as mock list reloads

            const expectedValues = {
                campus_name: 'name of new campus',
                campus_number: '0076',
            };
            await assertExpectedDataSentToServer(page, expectedValues);
        });
    });

    async function assertCanOpenEditCampusDialog(page: Page, campusId: number) {
        await page.goto('/admin/spaces/manage/locations?user=libSpaces');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(page.getByTestId(`edit-campus-${campusId}-button`)).toBeVisible();
        await page.getByTestId(`edit-campus-${campusId}-button`).click();

        await expect(page.getByTestId('main-dialog').locator('h2')).toBeVisible();
        await expect(page.getByTestId('main-dialog').locator('h2')).toContainText('Edit campus details');
    }
    test.describe('Edit a campus', () => {
        test('edit campus form has expected entries', async ({ page }) => {
            await assertCanOpenEditCampusDialog(page, 1);

            const dialog = page.getByTestId('main-dialog');
            await expect(dialog.locator('h2')).toContainText('Edit campus details');
            await expect(dialog.getByTestId('edit-campus-name').locator('label')).toContainText('Campus name');
            await expect(dialog.getByTestId('edit-campus-name').locator('input')).toHaveValue('St Lucia');
            await expect(dialog.getByTestId('edit-campus-number').locator('label')).toContainText('Campus number');
            await expect(dialog.getByTestId('edit-campus-number').locator('input')).toHaveValue('01');

            const libraryDropdown = dialog.getByTestId('campus-library-list');
            await expect(dialog.locator('h3')).toContainText('Libraries');
            await expect(libraryDropdown).toBeVisible();
            await expect(libraryDropdown.locator('> *')).toHaveCount(2);
            await expect(libraryDropdown.locator('li:first-of-type')).toContainText('Walter Harrison Law');
            await expect(libraryDropdown.locator('li:last-of-type')).toContainText('Central');

            const deleteButton = dialog.getByTestId('dialog-delete-button');
            const addNewbutton = dialog.getByTestId('dialog-addnew-button');
            const cancelButton = dialog.getByTestId('dialog-cancel-button');
            const saveButton = dialog.getByTestId('dialog-save-button');
            await expect(deleteButton).toBeVisible();
            await expect(deleteButton).toContainText('Delete');
            await expect(addNewbutton).toBeVisible();
            await expect(addNewbutton).toContainText('Add Library');
            await expect(cancelButton).toBeVisible();
            await expect(cancelButton).toContainText('Cancel');
            await expect(deleteButton).toBeVisible();
            await expect(saveButton).toBeVisible();
            await expect(saveButton).toContainText('Save');
        });
        test('edit campus dialog is accessible', async ({ page }) => {
            await assertCanOpenEditCampusDialog(page, 1);

            await assertAccessibility(page, '[data-testid="main-dialog"]');
        });

        test('validates properly - name field empty gives an error', async ({ page }) => {
            await assertCanOpenEditCampusDialog(page, 1);
            const dialog = page.getByTestId('main-dialog');

            await dialog
                .getByTestId('edit-campus-name')
                .locator('input')
                .clear();
            await dialog.getByTestId('dialog-save-button').click();

            await assertToastHasMessage(page, 'Please enter campus name and number');
        });
        test('validates properly - number field empty gives an error', async ({ page }) => {
            await assertCanOpenEditCampusDialog(page, 1);
            const dialog = page.getByTestId('main-dialog');

            await dialog
                .getByTestId('edit-campus-number')
                .locator('input')
                .clear();
            await dialog.getByTestId('dialog-save-button').click();

            await assertToastHasMessage(page, 'Please enter campus name and number');
        });
        test('validates properly - both fields empty gives an error', async ({ page }) => {
            await assertCanOpenEditCampusDialog(page, 1);
            const dialog = page.getByTestId('main-dialog');

            await dialog
                .getByTestId('edit-campus-number')
                .locator('input')
                .clear();
            await dialog
                .getByTestId('edit-campus-number')
                .locator('input')
                .clear();
            await dialog.getByTestId('dialog-save-button').click();

            await assertToastHasMessage(page, 'Please enter campus name and number');
        });
        test('can save changes to a campus', async ({ page, context }) => {
            await setTestDataCookie(context, page);

            await assertCanOpenEditCampusDialog(page, 1);
            const dialog = page.getByTestId('main-dialog');

            await dialog
                .getByTestId('edit-campus-name')
                .locator('input')
                .type(' append');
            await dialog
                .getByTestId('edit-campus-number')
                .locator('input')
                .type('9');
            await dialog.getByTestId('dialog-save-button').click();

            await assertToastHasMessage(page, 'Change to campus saved');
            // cant assert change happens as mock list reloads

            const expectedValues = {
                campus_name: ' appendSt Lucia',
                campus_number: '901',
            };
            await assertExpectedDataSentToServer(page, expectedValues);
        });
        test('can close the campus dialog with the cancel button', async ({ page }) => {
            await assertCanOpenEditCampusDialog(page, 1);
            const dialog = page.getByTestId('main-dialog');

            await expect(dialog).toBeVisible();
            await dialog.getByTestId('dialog-cancel-button').click();

            await expect(page.getByTestId('main-dialog')).not.toBeVisible();
        });
        test('can close the campus dialog with the escape key', async ({ page }) => {
            await assertCanOpenEditCampusDialog(page, 1);
            const dialog = page.getByTestId('main-dialog');

            await dialog.press('Escape');

            await expect(page.getByTestId('main-dialog')).not.toBeVisible();
        });
        test('delete a campus dialog is accessible', async ({ page }) => {
            await assertCanOpenEditCampusDialog(page, 1);
            await clickDeleteButton(page);

            await assertAccessibility(page, '[data-testid="confirmation-dialog"]');
        });
        test('can delete a campus', async ({ page }) => {
            await assertCanOpenEditCampusDialog(page, 1);
            const editDialog = page.getByTestId('main-dialog');

            await clickDeleteButton(page);

            const confirmationDialog = page.getByTestId('confirmation-dialog');
            await expect(confirmationDialog.getByTestId('confirmation-dialog-message')).toBeVisible();
            await expect(confirmationDialog.getByTestId('confirmation-dialog-message')).toContainText(
                'Do you really want to delete St Lucia campus?',
            );
            await expect(confirmationDialog.getByTestId('confirmation-dialog-message')).toContainText(
                'This will also delete associated Libraries.',
            );
            await expect(confirmationDialog.getByTestId('confirmation-dialog-accept-button')).toBeVisible();
            await expect(confirmationDialog.getByTestId('confirmation-dialog-accept-button')).toContainText('Yes');
            await confirmationDialog.getByTestId('confirmation-dialog-accept-button').click();

            await assertToastHasMessage(page, 'St Lucia campus deleted');
            await expect(page.getByTestId('confirmation-dialog')).not.toBeVisible(); // conf dialog closed
            await expect(editDialog.getByTestId('edit-campus-dialog-heading')).not.toBeVisible(); // the main dialog closed
            // cant assert change happens as mock list reloads
        });
        test('can cancel a deletion of a campus', async ({ page }) => {
            await assertCanOpenEditCampusDialog(page, 1);
            const editDialog = page.getByTestId('main-dialog');
            await expect(editDialog.getByTestId('edit-campus-dialog-heading')).toBeVisible();

            await clickDeleteButton(page);

            const confirmationDialog = page.getByTestId('confirmation-dialog');
            await expect(confirmationDialog.getByTestId('confirmation-dialog-reject-button')).toBeVisible();
            await expect(confirmationDialog.getByTestId('confirmation-dialog-reject-button')).toContainText('No');
            await confirmationDialog.getByTestId('confirmation-dialog-reject-button').click();

            await expect(page.getByTestId('confirmation-dialog')).not.toBeVisible();
            await expect(editDialog).toBeVisible();
            await expect(editDialog.getByTestId('edit-campus-dialog-heading')).toBeVisible(); // the main dialog has not closed
        });
    });
    test.describe('Add a library to a campus', () => {
        async function assertCanOpenAddLibraryDialog(page: Page) {
            await assertCanOpenEditCampusDialog(page, 1);
            const dialog = page.getByTestId('main-dialog');

            await expect(dialog.getByTestId('dialog-addnew-button')).toBeVisible();
            await expect(dialog.getByTestId('dialog-addnew-button')).toContainText('Add Library');
            await dialog.getByTestId('dialog-addnew-button').click();

            // the new dialog contents have loaded
            await expect(dialog.locator('h2')).toContainText('Add a library to St Lucia campus\n');
            return dialog;
        }

        test('library add form loads properly', async ({ page }) => {
            await assertCanOpenAddLibraryDialog(page);
            const dialog = page.getByTestId('main-dialog');

            await expect(dialog.getByTestId('library-name').locator('label')).toContainText('New Library name');
            await expect(dialog.getByTestId('library-name').locator('input')).toBeVisible();
            await expect(dialog.getByTestId('building-name').locator('label')).toContainText('Building name');
            await expect(dialog.getByTestId('building-name').locator('input')).toBeVisible();
            await expect(dialog.getByTestId('building-number').locator('label')).toContainText('Building number');
            await expect(dialog.getByTestId('building-number').locator('input')).toBeVisible();

            await expect(dialog.getByTestId('dialog-delete-button')).not.toBeVisible();
            await expect(dialog.getByTestId('dialog-addnew-button')).not.toBeVisible();
            await expect(dialog.getByTestId('dialog-cancel-button')).toBeVisible();
            await expect(dialog.getByTestId('dialog-cancel-button')).toContainText('Cancel');
            await expect(dialog.getByTestId('dialog-save-button')).toBeVisible();
            await expect(dialog.getByTestId('dialog-save-button')).toContainText('Save');
        });
        test('add library dialog is accessible', async ({ page }) => {
            await assertCanOpenAddLibraryDialog(page);

            await assertAccessibility(page, '[data-testid="main-dialog"]');
        });
        test('validates properly for empty library field', async ({ page }) => {
            await assertCanOpenAddLibraryDialog(page);
            const dialog = page.getByTestId('main-dialog');

            // save without entering anything in the form
            await dialog.getByTestId('dialog-save-button').click();
            await assertToastHasMessage(page, 'Please enter building name and number');
        });
        test('validates properly for invalid library fields', async ({ page }) => {
            await assertCanOpenAddLibraryDialog(page);
            const dialog = page.getByTestId('main-dialog');

            // save without entering anything in the form
            await dialog.getByTestId('dialog-save-button').click();
            await assertToastHasMessage(page, 'Please enter building name and number');
        });
        test('validates properly for two empty building fields', async ({ page }) => {
            await assertCanOpenAddLibraryDialog(page);
            const dialog = page.getByTestId('main-dialog');

            // save without entering anything in the form
            await dialog.getByTestId('dialog-save-button').click();
            await assertToastHasMessage(page, 'Please enter building name and number');
        });
        test('validates properly - building number field empty gives an error', async ({ page }) => {
            await assertCanOpenAddLibraryDialog(page);
            const dialog = page.getByTestId('main-dialog');

            // save after not entering the number field
            await expect(dialog.getByTestId('building-name').locator('input')).toBeVisible();
            await dialog
                .getByTestId('building-name')
                .locator('input')
                .fill('name of new building');
            await dialog.getByTestId('dialog-save-button').click();

            await assertToastHasMessage(page, 'Please enter building name and number');
        });
        test('validates properly - building name field empty gives an error', async ({ page }) => {
            await assertCanOpenAddLibraryDialog(page);
            const dialog = page.getByTestId('main-dialog');

            // save after not entering the name field
            await expect(dialog.getByTestId('building-number').locator('input')).toBeVisible();
            await dialog
                .getByTestId('building-number')
                .locator('input')
                .fill('number of new building');
            await dialog.getByTestId('dialog-save-button').click();
            await assertToastHasMessage(page, 'Please enter building name and number');
        });
        test('can save with valid building data', async ({ page, context }) => {
            await setTestDataCookie(context, page);

            await assertCanOpenAddLibraryDialog(page);
            const dialog = page.getByTestId('main-dialog');

            const libraryNameInputField = dialog.getByTestId('library-name').locator('input');
            await expect(libraryNameInputField).toBeVisible();
            await libraryNameInputField.fill('name of new library');

            const buildingNameInputField = dialog.getByTestId('building-name').locator('input');
            await expect(buildingNameInputField).toBeVisible();
            await buildingNameInputField.fill('name of new building');

            const buildingNumberInputField = dialog.getByTestId('building-number').locator('input');
            await expect(buildingNumberInputField).toBeVisible();
            await buildingNumberInputField.fill('0084');

            const armusRadioButton = page.getByTestId(`library_springshare_id-${CENTRAL_SPRINGSHARE_ID}`);
            await expect(armusRadioButton).toBeVisible();
            await armusRadioButton.click();

            const libraryAboutPageInputField = dialog.getByTestId('library_about_page_default').locator('input');
            await expect(libraryAboutPageInputField).toBeVisible();
            await libraryAboutPageInputField.fill('https://example.com');

            await dialog.getByTestId('dialog-save-button').click();
            await assertToastHasMessage(page, 'Library added');
            // cant assert change happens as mock list reloads

            const expectedValues = {
                library_name: 'name of new library',
                building_name: 'name of new building',
                library_campus_id: '1',
                building_number: '0084',
                library_about_page_default: 'https://example.com',
                library_springshare_id: '3842',
            };
            await assertExpectedDataSentToServer(page, expectedValues);
        });
        test('can close the add library dialog with the cancel button', async ({ page }) => {
            await assertCanOpenAddLibraryDialog(page);
            const dialog = page.getByTestId('main-dialog');

            await expect(dialog).toBeVisible();
            await dialog.getByTestId('dialog-cancel-button').click();

            await expect(dialog).not.toBeVisible();
        });
        test('can close the add library dialog with the escape key', async ({ page }) => {
            await assertCanOpenAddLibraryDialog(page);
            const dialog = page.getByTestId('main-dialog');
            await expect(dialog).toBeVisible();

            await dialog.press('Escape');

            await expect(dialog).not.toBeVisible();
        });
    });

    async function assertCanOpenEditLibraryDialog(page: Page, libraryId: number) {
        await page.goto('/admin/spaces/manage/locations?user=libSpaces');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(page.getByTestId(`edit-library-${libraryId}-button`)).toBeVisible();
        await page.getByTestId(`edit-library-${libraryId}-button`).click();
    }
    test.describe('Edit a library', () => {
        test('edit library form has expected entries', async ({ page }) => {
            await assertCanOpenEditLibraryDialog(page, 1);
            const dialog = page.getByTestId('main-dialog');

            await expect(dialog.locator('h2')).toContainText('Edit Library details');
            await expect(dialog.getByTestId('library-name').locator('label')).toContainText('Library name');
            await expect(dialog.getByTestId('library-name').locator('input')).toHaveValue(
                'Walter Harrison Law Library',
            );
            await expect(dialog.getByTestId('building-name').locator('label')).toContainText('Building name');
            await expect(dialog.getByTestId('building-name').locator('input')).toHaveValue('Forgan Smith Building');
            await expect(dialog.getByTestId('building-number').locator('label')).toContainText('Building number');
            await expect(dialog.getByTestId('building-number').locator('input')).toHaveValue('0001');

            const floorList = dialog.getByTestId('library-floor-list');
            await expect(floorList.locator('h3')).toContainText('Floors - Choose ground floor:');
            await expect(floorList).toBeVisible();
            await expect(floorList.locator('ul > *')).toHaveCount(3);
            await expect(floorList.locator('ul li:first-of-type label')).toContainText('Floor 2');
            await expect(floorList.locator('ul li:nth-of-type(2) label')).toContainText('Floor 3A');
            await expect(floorList.locator('ul li:last-of-type label')).toContainText('None');
            await expect(floorList.locator('ul li:last-of-type input')).toBeChecked();

            const campusList = dialog.getByTestId('library-campus-list');
            await expect(campusList.locator('h3')).toContainText('Change Campus');
            await expect(campusList).toBeVisible();
            await expect(campusList.locator('ul > *')).toHaveCount(3);
            await expect(campusList.locator('ul li:first-of-type label')).toContainText('St Lucia');
            await expect(campusList.locator('ul li:nth-of-type(2) label')).toContainText('Gatton');
            await expect(campusList.locator('ul li:last-of-type label')).toContainText('Newsite');
            await expect(campusList.locator('ul li:first-of-type input')).toBeChecked();

            await expect(dialog.getByTestId('dialog-delete-button')).toBeVisible();
            await expect(dialog.getByTestId('dialog-delete-button')).toContainText('Delete');
            await expect(dialog.getByTestId('dialog-addnew-button')).toBeVisible();
            await expect(dialog.getByTestId('dialog-addnew-button')).toContainText('Add floor');
            await expect(dialog.getByTestId('dialog-cancel-button')).toBeVisible();
            await expect(dialog.getByTestId('dialog-cancel-button')).toContainText('Cancel');
            await expect(dialog.getByTestId('dialog-delete-button')).toBeVisible();
            await expect(dialog.getByTestId('dialog-save-button')).toBeVisible();
            await expect(dialog.getByTestId('dialog-save-button')).toContainText('Save');
        });
        test('edit library dialog is accessible', async ({ page }) => {
            await assertCanOpenEditLibraryDialog(page, 1);

            await assertAccessibility(page, '[data-testid="main-dialog"]');
        });
        test('can cancel a deletion of a library', async ({ page }) => {
            await assertCanOpenEditLibraryDialog(page, 1);
            const mainDialog = page.getByTestId('main-dialog');
            await expect(mainDialog.locator('h2')).toBeVisible();

            await clickDeleteButton(page);

            const confirmationDialog = page.getByTestId('confirmation-dialog');
            await expect(confirmationDialog.getByTestId('confirmation-dialog-reject-button')).toBeVisible();
            await expect(confirmationDialog.getByTestId('confirmation-dialog-reject-button')).toContainText('No');
            await confirmationDialog.getByTestId('confirmation-dialog-reject-button').click();

            await expect(page.getByTestId('confirmation-dialog')).not.toBeVisible(); // confirmation dialog has closed
            await expect(mainDialog).toBeVisible(); // but the main dialog is still open
            await expect(mainDialog.locator('h2')).toBeVisible();
            await expect(mainDialog.locator('h2')).toContainText('Edit Library details'); // and is the expected dialog
        });
        test('library delete is accessible', async ({ page }) => {
            await assertCanOpenEditLibraryDialog(page, 1);
            await clickDeleteButton(page);

            await assertAccessibility(page, '[data-testid="confirmation-dialog"]');
        });
        test('can delete a library', async ({ page }) => {
            await assertCanOpenEditLibraryDialog(page, 1);
            const editDialog = page.getByTestId('main-dialog');

            await clickDeleteButton(page);

            const confirmationDialog = page.getByTestId('confirmation-dialog');
            await expect(confirmationDialog.getByTestId('confirmation-dialog-message')).toBeVisible();
            await expect(confirmationDialog.getByTestId('confirmation-dialog-message')).toContainText(
                'Do you really want to delete Walter Harrison Law Library?',
            );
            await expect(confirmationDialog.getByTestId('confirmation-dialog-message')).toContainText(
                'This will also delete associated floors.',
            );
            await expect(confirmationDialog.getByTestId('confirmation-dialog-accept-button')).toBeVisible();
            await expect(confirmationDialog.getByTestId('confirmation-dialog-accept-button')).toContainText('Yes');
            await confirmationDialog.getByTestId('confirmation-dialog-accept-button').click();

            await assertToastHasMessage(page, ' Walter Harrison Law Library deleted');
            await expect(page.getByTestId('confirmation-dialog')).not.toBeVisible(); // conf dialog closed
            await expect(editDialog.locator('h2')).not.toBeVisible(); // the main dialog closed
            // cant assert change happens as mock list reloads
        });
        test('validates properly - library name field empty gives an error', async ({ page }) => {
            await assertCanOpenEditLibraryDialog(page, 1);
            const dialog = page.getByTestId('main-dialog');

            await dialog
                .getByTestId('library-name')
                .locator('input')
                .clear();
            await dialog.getByTestId('dialog-save-button').click();

            await assertToastHasMessage(page, 'Please enter the Library name');
        });
        test('validates properly - building name field empty gives an error', async ({ page }) => {
            await assertCanOpenEditLibraryDialog(page, 1);
            const dialog = page.getByTestId('main-dialog');

            await dialog
                .getByTestId('building-name')
                .locator('input')
                .clear();
            await dialog.getByTestId('dialog-save-button').click();

            await assertToastHasMessage(page, 'Please enter building name and number');
        });
        test('validates properly - building number field empty gives an error', async ({ page }) => {
            await assertCanOpenEditLibraryDialog(page, 1);
            const dialog = page.getByTestId('main-dialog');

            await dialog
                .getByTestId('building-number')
                .locator('input')
                .clear();
            await dialog.getByTestId('dialog-save-button').click();

            await assertToastHasMessage(page, 'Please enter building name and number');
        });
        test('validates properly - all required fields empty gives an error', async ({ page }) => {
            await assertCanOpenEditLibraryDialog(page, 1);
            const dialog = page.getByTestId('main-dialog');

            await dialog
                .getByTestId('library-name')
                .locator('input')
                .clear();
            await dialog
                .getByTestId('building-name')
                .locator('input')
                .clear();
            await dialog
                .getByTestId('building-number')
                .locator('input')
                .clear();
            await dialog.getByTestId('dialog-save-button').click();

            await assertToastHasMessage(page, 'Please enter the Library name; Please enter building name and number');
        });
        test('can save changes to a library', async ({ page, context }) => {
            await setTestDataCookie(context, page);

            await assertCanOpenEditLibraryDialog(page, 1);
            const dialog = page.getByTestId('main-dialog');

            const libraryNameinputElement = dialog.getByTestId('library-name').locator('input');
            await expect(libraryNameinputElement).toBeVisible();
            await expect(libraryNameinputElement).toHaveValue('Walter Harrison Law Library');
            await libraryNameinputElement.type(' append');

            const buildingNameinputElement = dialog.getByTestId('building-name').locator('input');
            await expect(buildingNameinputElement).toBeVisible();
            await expect(buildingNameinputElement).toHaveValue('Forgan Smith Building');
            await buildingNameinputElement.type(' append');

            const buildingNumberInputElement = dialog.getByTestId('building-number').locator('input');
            await expect(buildingNumberInputElement).toBeVisible();
            await expect(buildingNumberInputElement).toHaveValue('0001');
            await buildingNumberInputElement.type('9');
            const armusRadioButton = page.getByTestId(`library_springshare_id-${ARMUS_SPRINGSHARE_ID}`);
            await expect(armusRadioButton).toBeVisible();
            await armusRadioButton.click();

            await dialog.getByTestId('dialog-save-button').click();

            await assertToastHasMessage(page, 'Change to library saved');
            // cant assert change happens as mock list reloads

            const expectedValues = {
                library_name: ' appendWalter Harrison Law Library',
                building_name: ' appendForgan Smith Building',
                building_number: '90001',
                library_about_page_default: 'https://web.library.uq.edu.au/visit/walter-harrison-law-library', // unchanged
                library_campus_id: '1', // unchanged
                building_ground_floor_id: undefined, // unchanged
                library_springshare_id: '3823',
            };
            await assertExpectedDataSentToServer(page, expectedValues);
        });
        test('can close the edit library dialog with the cancel button', async ({ page }) => {
            await assertCanOpenEditLibraryDialog(page, 1);
            const dialog = page.getByTestId('main-dialog');

            await expect(dialog).toBeVisible();
            await dialog.getByTestId('dialog-cancel-button').click();

            await expect(dialog).not.toBeVisible();
        });
        test('can close the edit library dialog with the escape key', async ({ page }) => {
            await assertCanOpenEditLibraryDialog(page, 1);
            const dialog = page.getByTestId('main-dialog');

            await expect(dialog).toBeVisible();
            await dialog.press('Escape');

            await expect(dialog).not.toBeVisible();
        });
    });
    test.describe('Add a floor to a library', () => {
        async function assertCanOpenAddFloorDialog(page: Page, libraryId: number) {
            await assertCanOpenEditLibraryDialog(page, libraryId);
            const dialog = page.getByTestId('main-dialog');
            await expect(dialog.locator('h2')).toContainText('Edit Library details');

            await expect(dialog.getByTestId('dialog-addnew-button')).toBeVisible();
            await expect(dialog.getByTestId('dialog-addnew-button')).toContainText('Add floor');
            await dialog.getByTestId('dialog-addnew-button').click();

            // the new dialog contents have loaded
            await expect(dialog.locator('h2')).toContainText('Add a floor to');
        }
        test('add floor dialog is accessible', async ({ page }) => {
            await assertCanOpenAddFloorDialog(page, 1);

            await assertAccessibility(page, '[data-testid="main-dialog"]');
        });

        test('floor add form loads properly', async ({ page }) => {
            await assertCanOpenAddFloorDialog(page, 1);
            const dialog = page.getByTestId('main-dialog');

            await expect(dialog.getByTestId('floor-name').locator('label')).toContainText('New floor name');
            await expect(dialog.getByTestId('floor-name').locator('input')).toBeVisible();

            await expect(dialog.getByTestId('dialog-delete-button')).not.toBeVisible();
            await expect(dialog.getByTestId('dialog-addnew-button')).not.toBeVisible();
            await expect(dialog.getByTestId('dialog-cancel-button')).toBeVisible();
            await expect(dialog.getByTestId('dialog-cancel-button')).toContainText('Cancel');
            await expect(dialog.getByTestId('dialog-save-button')).toBeVisible();
            await expect(dialog.getByTestId('dialog-save-button')).toContainText('Save');
        });
        test('validates properly for empty floor field', async ({ page, context }) => {
            await assertCanOpenAddFloorDialog(page, 1);
            const dialog = page.getByTestId('main-dialog');

            // save without entering anything in the form
            await dialog.getByTestId('dialog-save-button').click();
            await assertToastHasMessage(page, 'Please enter floor name');
        });
        test('can save with valid floor data, ground floor not requested', async ({ page, context }) => {
            await setTestDataCookie(context, page);

            await assertCanOpenAddFloorDialog(page, 1);
            const dialog = page.getByTestId('main-dialog');

            await expect(dialog.getByTestId('floor-name').locator('input')).toBeVisible();
            await dialog
                .getByTestId('floor-name')
                .locator('input')
                .fill('new name');
            await dialog.getByTestId('dialog-save-button').click();

            await assertToastHasMessage(page, 'Floor added');
            // cant assert change happens as mock list reloads

            const expectedValues = {
                floor_name: 'new name',
                floor_library_id: '1',
            };
            await assertExpectedDataSentToServer(page, expectedValues);
        });
        test('can save with valid floor data, ground floor requested, no current ground floor', async ({
            page,
            context,
        }) => {
            await setTestDataCookie(context, page);

            await assertCanOpenAddFloorDialog(page, 1);
            const dialog = page.getByTestId('main-dialog');

            await expect(dialog.getByTestId('floor-name').locator('input')).toBeVisible();
            await expect(dialog.getByTestId('mark-ground-floor').locator('label')).toContainText(
                'No floor is currently marked as the ground floor',
            );

            await dialog
                .getByTestId('floor-name')
                .locator('input')
                .fill('new name');
            await dialog
                .getByTestId('mark-ground-floor')
                .locator('input')
                .setChecked(true);
            await dialog.getByTestId('dialog-save-button').click();

            await assertToastHasMessage(page, 'Floor added');
            // cant assert change happens as mock list reloads

            const expectedValues = {
                floor_name: 'new name',
                floor_library_id: '1',
            };
            await assertExpectedDataSentToServer(page, expectedValues);
        });
        test('can save with valid floor data, ground floor requested, override current ground floor', async ({
            page,
            context,
        }) => {
            await setTestDataCookie(context, page);

            await assertCanOpenAddFloorDialog(page, 2);
            const dialog = page.getByTestId('main-dialog');

            await expect(dialog.getByTestId('floor-name').locator('input')).toBeVisible();
            await expect(dialog.getByTestId('mark-ground-floor').locator('label')).toContainText(
                'Current ground floor is Floor 1',
            );

            await dialog
                .getByTestId('floor-name')
                .locator('input')
                .fill('new name');
            await dialog
                .getByTestId('mark-ground-floor')
                .locator('input')
                .setChecked(true);
            await dialog.getByTestId('dialog-save-button').click();

            await assertToastHasMessage(page, 'Floor added');
            // cant assert change happens as mock list reloads

            const expectedValues = {
                floor_name: 'new name',
                floor_library_id: '2',
            };
            await assertExpectedDataSentToServer(page, expectedValues);
        });
        test('can close the add floor dialog with the cancel button', async ({ page }) => {
            await assertCanOpenAddFloorDialog(page, 1);
            const dialog = page.getByTestId('main-dialog');

            await expect(dialog).toBeVisible();
            await dialog.getByTestId('dialog-cancel-button').click();

            await expect(dialog).not.toBeVisible();
        });
        test('can close the add floor dialog with the escape key', async ({ page }) => {
            await assertCanOpenAddFloorDialog(page, 1);
            const dialog = page.getByTestId('main-dialog');
            await expect(dialog).toBeVisible();

            await dialog.press('Escape');

            await expect(dialog).not.toBeVisible();
        });
    });
    test.describe('Edit a floor', () => {
        async function assertCanOpenEditFloorDialog(page: Page, floorId: number) {
            await page.goto('/admin/spaces/manage/locations?user=libSpaces');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.getByTestId(`edit-floor-${floorId}-button`)).toBeVisible();
            await page.getByTestId(`edit-floor-${floorId}-button`).click();
        }
        test('edit floor form has expected entries', async ({ page }) => {
            await assertCanOpenEditFloorDialog(page, 1);
            const dialog = page.getByTestId('main-dialog');

            await expect(dialog.locator('h2')).toContainText('Edit floor details');
            await expect(dialog.getByTestId('floor-name').locator('label')).toContainText('Floor name');
            await expect(dialog.getByTestId('floor-name').locator('input')).toHaveValue('2');

            await expect(dialog.getByTestId('dialog-delete-button')).toBeVisible();
            await expect(dialog.getByTestId('dialog-delete-button')).toContainText('Delete');
            await expect(dialog.getByTestId('dialog-addnew-button')).not.toBeVisible();
            await expect(dialog.getByTestId('dialog-cancel-button')).toBeVisible();
            await expect(dialog.getByTestId('dialog-cancel-button')).toContainText('Cancel');
            await expect(dialog.getByTestId('dialog-delete-button')).toBeVisible();
            await expect(dialog.getByTestId('dialog-save-button')).toBeVisible();
            await expect(dialog.getByTestId('dialog-save-button')).toContainText('Save');
        });
        test('edit floor dialog is accessible', async ({ page }) => {
            await assertCanOpenEditFloorDialog(page, 1);

            await assertAccessibility(page, '[data-testid="main-dialog"]');
        });
        test('can cancel a deletion of a floor', async ({ page }) => {
            await assertCanOpenEditFloorDialog(page, 1);
            const mainDialog = page.getByTestId('main-dialog');
            await expect(mainDialog.locator('h2')).toBeVisible();

            await clickDeleteButton(page);

            const confirmationDialog = page.getByTestId('confirmation-dialog');
            await expect(confirmationDialog.getByTestId('confirmation-dialog-reject-button')).toBeVisible();
            await expect(confirmationDialog.getByTestId('confirmation-dialog-reject-button')).toContainText('No');
            await confirmationDialog.getByTestId('confirmation-dialog-reject-button').click();

            await expect(page.getByTestId('confirmation-dialog')).not.toBeVisible(); // confirmation dialog has closed
            await expect(mainDialog).toBeVisible(); // but the main dialog is still open
            await expect(mainDialog.locator('h2')).toBeVisible();
            await expect(mainDialog.locator('h2')).toContainText('Edit floor details'); // and is the expected dialog
        });
        test('delete floor dialog is accessible', async ({ page }) => {
            await assertCanOpenEditFloorDialog(page, 1);
            await clickDeleteButton(page);

            await assertAccessibility(page, '[data-testid="confirmation-dialog"]');
        });
        test('can delete a floor', async ({ page }) => {
            await assertCanOpenEditFloorDialog(page, 1);
            const mainDialog = page.getByTestId('main-dialog');

            await clickDeleteButton(page);

            const confirmationDialog = page.getByTestId('confirmation-dialog');
            await expect(confirmationDialog.getByTestId('confirmation-dialog-message')).toBeVisible();
            await expect(confirmationDialog.getByTestId('confirmation-dialog-message')).toContainText(
                'Do you really want to delete floor 2?',
            );
            await expect(confirmationDialog.getByTestId('confirmation-dialog-message')).toContainText(
                'This will also delete associated rooms.',
            );
            await expect(confirmationDialog.getByTestId('confirmation-dialog-accept-button')).toBeVisible();
            await expect(confirmationDialog.getByTestId('confirmation-dialog-accept-button')).toContainText('Yes');
            await confirmationDialog.getByTestId('confirmation-dialog-accept-button').click();

            await assertToastHasMessage(page, 'Floor 2 in Walter Harrison Law Library deleted');
            await expect(page.getByTestId('confirmation-dialog')).not.toBeVisible(); // conf dialog closed
            await expect(mainDialog.locator('h2')).not.toBeVisible(); // the main dialog closed
            // cant assert change happens as mock list reloads
        });
        test('validates properly - name field empty gives an error', async ({ page }) => {
            await assertCanOpenEditFloorDialog(page, 1);
            const dialog = page.getByTestId('main-dialog');

            await dialog
                .getByTestId('floor-name')
                .locator('input')
                .clear();
            await dialog.getByTestId('dialog-save-button').click();

            await assertToastHasMessage(page, 'Please enter floor name');
        });
        test('can save changes to a floor', async ({ page, context }) => {
            await setTestDataCookie(context, page);

            await assertCanOpenEditFloorDialog(page, 1);
            const dialog = page.getByTestId('main-dialog');

            await dialog
                .getByTestId('floor-name')
                .locator('input')
                .type(' append');
            await dialog.getByTestId('dialog-save-button').click();

            await assertToastHasMessage(page, 'Changes to floor saved');
            // cant assert change happens as mock list reloads

            const expectedValues = {
                floor_name: ' append2',
            };
            await assertExpectedDataSentToServer(page, expectedValues);
        });
        test('can close the floor dialog with the cancel button', async ({ page }) => {
            await assertCanOpenEditFloorDialog(page, 1);

            await expect(page.getByTestId('main-dialog')).toBeVisible();
            await page
                .getByTestId('main-dialog')
                .getByTestId('dialog-cancel-button')
                .click();

            await expect(page.getByTestId('main-dialog')).not.toBeVisible();
        });
        test('can close the floor dialog with the escape key', async ({ page }) => {
            await assertCanOpenEditFloorDialog(page, 1);

            await expect(page.getByTestId('main-dialog')).toBeVisible();
            await page.getByTestId('main-dialog').press('Escape');

            await expect(page.getByTestId('main-dialog')).not.toBeVisible();
        });
    });
    test('repeated actions dont cause a problem', async ({ page }) => {
        // can we open and close dialogs repeatedly without problem
        await page.goto('/admin/spaces/manage/locations?user=libSpaces');

        // open main dialog to edit campus
        await expect(page.getByTestId('main-dialog')).not.toBeVisible();
        await expect(page.getByTestId(`edit-campus-1-button`)).toBeVisible();
        await page.getByTestId(`edit-campus-1-button`).click();
        await expect(page.getByTestId('main-dialog').locator('h2')).toBeVisible();
        await expect(page.getByTestId('main-dialog').locator('h2')).toContainText('Edit campus details');

        // close the main dialog
        await expect(page.getByTestId('main-dialog').getByTestId(`dialog-cancel-button`)).toBeVisible();
        await page
            .getByTestId('main-dialog')
            .getByTestId(`dialog-cancel-button`)
            .click();
        await expect(page.getByTestId('main-dialog').locator('h2')).not.toBeVisible();

        // open main dialog to edit campus
        await expect(page.getByTestId('main-dialog')).not.toBeVisible();
        await expect(page.getByTestId(`edit-campus-1-button`)).toBeVisible();
        await page.getByTestId(`edit-campus-1-button`).click();
        await expect(page.getByTestId('main-dialog').locator('h2')).toBeVisible();
        await expect(page.getByTestId('main-dialog').locator('h2')).toContainText('Edit campus details');

        // close the main dialog
        await expect(page.getByTestId('main-dialog').getByTestId(`dialog-cancel-button`)).toBeVisible();
        await page
            .getByTestId('main-dialog')
            .getByTestId(`dialog-cancel-button`)
            .click();
        await expect(page.getByTestId('main-dialog').locator('h2')).not.toBeVisible();

        // open main dialog to edit campus
        await expect(page.getByTestId('main-dialog')).not.toBeVisible();
        await expect(page.getByTestId(`edit-campus-1-button`)).toBeVisible();
        await page.getByTestId(`edit-campus-1-button`).click();
        await expect(page.getByTestId('main-dialog').locator('h2')).toBeVisible();
        await expect(page.getByTestId('main-dialog').locator('h2')).toContainText('Edit campus details');

        // open confirmation dialog
        await expect(page.getByTestId('confirmation-dialog')).not.toBeVisible();
        await page
            .getByTestId('main-dialog')
            .getByTestId('dialog-delete-button')
            .click();
        await expect(page.getByTestId('confirmation-dialog')).toBeVisible();

        // close confirmation dialog
        const confirmationDialog = page.getByTestId('confirmation-dialog');
        await expect(confirmationDialog.getByTestId('confirmation-dialog-reject-button')).toBeVisible();
        await expect(confirmationDialog.getByTestId('confirmation-dialog-reject-button')).toContainText('No');
        await confirmationDialog.getByTestId('confirmation-dialog-reject-button').click();
        await expect(page.getByTestId('confirmation-dialog')).not.toBeVisible();

        // open confirmation dialog
        await expect(page.getByTestId('confirmation-dialog')).not.toBeVisible();
        await page
            .getByTestId('main-dialog')
            .getByTestId('dialog-delete-button')
            .click();
        await expect(page.getByTestId('confirmation-dialog')).toBeVisible();

        // close confirmation dialog
        await expect(confirmationDialog.getByTestId('confirmation-dialog-reject-button')).toBeVisible();
        await expect(confirmationDialog.getByTestId('confirmation-dialog-reject-button')).toContainText('No');
        await confirmationDialog.getByTestId('confirmation-dialog-reject-button').click();
        await expect(page.getByTestId('confirmation-dialog')).not.toBeVisible();

        // close the main dialog
        await expect(page.getByTestId('main-dialog').getByTestId(`dialog-cancel-button`)).toBeVisible();
        await page
            .getByTestId('main-dialog')
            .getByTestId(`dialog-cancel-button`)
            .click();
        await expect(page.getByTestId('main-dialog').locator('h2')).not.toBeVisible();
    });
    test('can navigate from manage locations to dashboard', async ({ page }) => {
        await page.goto('/admin/spaces/manage/locations?user=libSpaces');
        await page.setViewportSize({ width: 1300, height: 1000 });

        // wait for page to load
        await expect(page.getByTestId('admin-spaces-page-title').getByText(/Manage locations/)).toBeVisible();

        const visitDashBoardButton = page.getByTestId('admin-spaces-visit-dashboard-button');

        await expect(visitDashBoardButton).not.toBeVisible();
        await expect(page.getByTestId('admin-spaces-menu')).not.toBeVisible();
        await expect(page.getByTestId('admin-spaces-menu-button')).toBeVisible();
        page.getByTestId('admin-spaces-menu-button').click();
        await expect(page.getByTestId('admin-spaces-menu')).toBeVisible();
        await expect(visitDashBoardButton).toBeVisible();

        visitDashBoardButton.click();
        await expect(page).toHaveURL('http://localhost:2020/admin/spaces?user=libSpaces');
    });
});
