import { expect, Page, test } from '@uq/pw/test';
import { assertAccessibility } from '@uq/pw/lib/axe';

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

test.describe('Spaces admin', () => {
    test('Shows a basic page for Spaces Location Admin', async ({ page }) => {
        await page.goto('/admin/spaces/manage/locations?user=uqstaff');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(page.locator('body').getByText(/Library spaces Location management/)).toBeVisible();
        await expect(page.getByTestId('spaces-location-wrapper').locator('> *')).toHaveCount(16); // 3 locations with 4 buildings 8 floors + an add button

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
        await page.goto('/admin/spaces/manage/locations?user=uqstaff');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(page.locator('body').getByText(/Library spaces Location management/)).toBeVisible();

        await assertAccessibility(page, '[data-testid="StandardPage"]');
    });
    test.describe('Add a campus', () => {
        async function assertCanOpenAddNewCampusDialog(page: Page) {
            await page.goto('/admin/spaces/manage/locations?user=uqstaff');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.getByTestId('add-new-campus-button')).toContainText('Add new Campus');
            await page.getByTestId('add-new-campus-button').click();
        }

        test('campus add form has expected fields', async ({ page }) => {
            await assertCanOpenAddNewCampusDialog(page);

            const dialog = page.getByTestId('main-dialog');

            await expect(dialog.getByTestId('add-campus-heading')).toContainText('Add campus');
            await expect(dialog.getByTestId('add-campus-name').locator('label')).toContainText('Site name');
            await expect(dialog.getByTestId('add-campus-name').locator('input')).toBeVisible();
            await expect(dialog.getByTestId('add-campus-number').locator('label')).toContainText('Site number');
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
        test('validates properly for two empty site fields', async ({ page }) => {
            await assertCanOpenAddNewCampusDialog(page);

            // save without entering anything in the form
            await page.getByTestId('dialog-save-button').click();
            await assertToastHasMessage(page, 'Please enter site name and number');
        });
        test('validates properly - site number field empty gives an error', async ({ page }) => {
            await assertCanOpenAddNewCampusDialog(page);

            // save after not entering the number field
            await expect(page.getByTestId('add-campus-name').locator('input')).toBeVisible();
            await page
                .getByTestId('add-campus-name')
                .locator('input')
                .fill('name of new campus');
            await page.getByTestId('dialog-save-button').click();

            await assertToastHasMessage(page, 'Please enter site name and number');
        });
        test('validates properly - site name field empty gives an error', async ({ page }) => {
            await assertCanOpenAddNewCampusDialog(page);

            // save after not entering the name field
            await expect(page.getByTestId('add-campus-number').locator('input')).toBeVisible();
            await page
                .getByTestId('add-campus-number')
                .locator('input')
                .fill('number of new campus');
            await page.getByTestId('dialog-save-button').click();
            await assertToastHasMessage(page, 'Please enter site name and number');
        });
        test('can save with valid site data', async ({ page }) => {
            await page.goto('/admin/spaces/manage/locations?user=uqstaff');
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
            await assertToastHasMessage(page, 'Site added');
            // cant assert change happens as mock list reloads
        });
    });
    test.describe('Edit a campus', () => {
        async function assertCanOpenEditCampusDialog(page: Page, campusId: number) {
            await page.goto('/admin/spaces/manage/locations?user=uqstaff');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.getByTestId(`edit-campus-${campusId}-button`)).toBeVisible();
            await page.getByTestId(`edit-campus-${campusId}-button`).click();

            await expect(page.getByTestId('main-dialog').locator('h2')).toBeVisible();
            await expect(page.getByTestId('main-dialog').locator('h2')).toContainText('Edit campus details');
        }

        test('edit site form has expected entries', async ({ page }) => {
            await assertCanOpenEditCampusDialog(page, 1);

            const dialog = page.getByTestId('main-dialog');
            await expect(dialog.locator('h2')).toContainText('Edit campus details');
            await expect(dialog.getByTestId('edit-campus-name').locator('label')).toContainText('Site name');
            await expect(dialog.getByTestId('edit-campus-name').locator('input')).toHaveValue('St Lucia');
            await expect(dialog.getByTestId('edit-campus-number').locator('label')).toContainText('Site number');
            await expect(dialog.getByTestId('edit-campus-number').locator('input')).toHaveValue('01');

            await expect(dialog.locator('h3')).toContainText('Buildings');
            await expect(dialog.getByTestId('campus-building-list')).toBeVisible();
            await expect(dialog.getByTestId('campus-building-list').locator('> *')).toHaveCount(2);
            await expect(dialog.getByTestId('campus-building-list').locator('li:first-of-type')).toContainText(
                'Forgan Smith Building (0001)',
            );
            await expect(dialog.getByTestId('campus-building-list').locator('li:last-of-type')).toContainText(
                'Duhig Tower (0002)',
            );

            await expect(dialog.getByTestId('dialog-delete-button')).toBeVisible();
            await expect(dialog.getByTestId('dialog-delete-button')).toContainText('Delete');
            await expect(dialog.getByTestId('dialog-addnew-button')).toBeVisible();
            await expect(dialog.getByTestId('dialog-addnew-button')).toContainText('Add building');
            await expect(dialog.getByTestId('dialog-cancel-button')).toBeVisible();
            await expect(dialog.getByTestId('dialog-cancel-button')).toContainText('Cancel');
            await expect(dialog.getByTestId('dialog-delete-button')).toBeVisible();
            await expect(dialog.getByTestId('dialog-save-button')).toBeVisible();
            await expect(dialog.getByTestId('dialog-save-button')).toContainText('Save');
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

            await assertToastHasMessage(page, 'Please enter site name and number');
        });
        test('validates properly - number field empty gives an error', async ({ page }) => {
            await assertCanOpenEditCampusDialog(page, 1);
            const dialog = page.getByTestId('main-dialog');

            await dialog
                .getByTestId('edit-campus-number')
                .locator('input')
                .clear();
            await dialog.getByTestId('dialog-save-button').click();

            await assertToastHasMessage(page, 'Please enter site name and number');
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

            await assertToastHasMessage(page, 'Please enter site name and number');
        });
        test('can save changes to a site', async ({ page }) => {
            await assertCanOpenEditCampusDialog(page, 1);
            const dialog = page.getByTestId('main-dialog');

            await dialog
                .getByTestId('edit-campus-number')
                .locator('input')
                .type(' append');
            await dialog
                .getByTestId('edit-campus-number')
                .locator('input')
                .type('9');
            await dialog.getByTestId('dialog-save-button').click();

            await assertToastHasMessage(page, 'Change to site saved');
            // cant assert change happens as mock list reloads
        });
        test('can close the site dialog with the cancel button', async ({ page }) => {
            await assertCanOpenEditCampusDialog(page, 1);
            const dialog = page.getByTestId('main-dialog');

            await expect(dialog).toBeVisible();
            await dialog.getByTestId('dialog-cancel-button').click();

            await expect(page.getByTestId('main-dialog')).not.toBeVisible();
        });
        test('can close the site dialog with the escape key', async ({ page }) => {
            await assertCanOpenEditCampusDialog(page, 1);
            const dialog = page.getByTestId('main-dialog');

            await dialog.press('Escape');

            await expect(page.getByTestId('main-dialog')).not.toBeVisible();
        });
        test('delete a site dialog is accessible', async ({ page }) => {
            await assertCanOpenEditCampusDialog(page, 1);
            await clickDeleteButton(page);

            await assertAccessibility(page, '[data-testid="confirmation-dialog"]');
        });
        test('can delete a site', async ({ page }) => {
            await assertCanOpenEditCampusDialog(page, 1);
            const editDialog = page.getByTestId('main-dialog');

            await clickDeleteButton(page);

            const confirmationDialog = page.getByTestId('confirmation-dialog');
            await expect(confirmationDialog.getByTestId('confirmation-dialog-message')).toBeVisible();
            await expect(confirmationDialog.getByTestId('confirmation-dialog-message')).toContainText(
                'Do you really want to delete St Lucia campus?',
            );
            await expect(confirmationDialog.getByTestId('confirmation-dialog-message')).toContainText(
                'This will also delete associated buildings.',
            );
            await expect(confirmationDialog.getByTestId('confirmation-dialog-accept-button')).toBeVisible();
            await expect(confirmationDialog.getByTestId('confirmation-dialog-accept-button')).toContainText('Yes');
            await confirmationDialog.getByTestId('confirmation-dialog-accept-button').click();

            await assertToastHasMessage(page, 'St Lucia campus deleted');
            await expect(page.getByTestId('confirmation-dialog')).not.toBeVisible(); // conf dialog closed
            await expect(editDialog.getByTestId('edit-campus-dialog-heading')).not.toBeVisible(); // the main dialog closed
            // cant assert change happens as mock list reloads
        });
        test('can cancel a deletion of a site', async ({ page }) => {
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
        test.describe('Add a building to a site', () => {
            async function assertCanOpenAddBuildingDialog(page: Page) {
                await assertCanOpenEditCampusDialog(page, 1);
                const dialog = page.getByTestId('main-dialog');

                await expect(dialog.getByTestId('dialog-addnew-button')).toBeVisible();
                await expect(dialog.getByTestId('dialog-addnew-button')).toContainText('Add building');
                await dialog.getByTestId('dialog-addnew-button').click();

                // the new dialog contents have loaded
                await expect(dialog.locator('h2')).toContainText('Add a building to St Lucia campus\n');
                return dialog;
            }

            test('building add form loads properly', async ({ page }) => {
                await assertCanOpenAddBuildingDialog(page);
                const dialog = page.getByTestId('main-dialog');

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
            test('add building dialog is accessible', async ({ page }) => {
                await assertCanOpenAddBuildingDialog(page);

                await assertAccessibility(page, '[data-testid="main-dialog"]');
            });
            test('validates properly for two empty building fields', async ({ page }) => {
                await assertCanOpenAddBuildingDialog(page);
                const dialog = page.getByTestId('main-dialog');

                // save without entering anything in the form
                await dialog.getByTestId('dialog-save-button').click();
                await assertToastHasMessage(page, 'Please enter building name and number');
            });
            test('validates properly - building number field empty gives an error', async ({ page }) => {
                await assertCanOpenAddBuildingDialog(page);
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
                await assertCanOpenAddBuildingDialog(page);
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
            test('can save with valid building data', async ({ page }) => {
                await assertCanOpenAddBuildingDialog(page);
                const dialog = page.getByTestId('main-dialog');

                await expect(dialog.getByTestId('building-name').locator('input')).toBeVisible();
                await dialog
                    .getByTestId('building-name')
                    .locator('input')
                    .fill('name of new building');
                await expect(dialog.getByTestId('building-number').locator('input')).toBeVisible();
                await dialog
                    .getByTestId('building-number')
                    .locator('input')
                    .fill('0084');
                await dialog.getByTestId('dialog-save-button').click();
                await assertToastHasMessage(page, 'Building added');
                // cant assert change happens as mock list reloads
            });
            test('can close the add building dialog with the cancel button', async ({ page }) => {
                await assertCanOpenAddBuildingDialog(page);
                const dialog = page.getByTestId('main-dialog');

                await expect(dialog).toBeVisible();
                await dialog.getByTestId('dialog-cancel-button').click();

                await expect(dialog).not.toBeVisible();
            });
            test('can close the add building dialog with the escape key', async ({ page }) => {
                await assertCanOpenAddBuildingDialog(page);
                const dialog = page.getByTestId('main-dialog');
                await expect(dialog).toBeVisible();

                await dialog.press('Escape');

                await expect(dialog).not.toBeVisible();
            });
        });
    });
    test.describe('Edit a building', () => {
        async function assertCanOpenEditBuildingDialog(page: Page, buildingId: number) {
            await page.goto('/admin/spaces/manage/locations?user=uqstaff');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.getByTestId(`edit-building-${buildingId}-button`)).toBeVisible();
            await page.getByTestId(`edit-building-${buildingId}-button`).click();
        }
        test('edit building form has expected entries', async ({ page }) => {
            await assertCanOpenEditBuildingDialog(page, 1);
            const dialog = page.getByTestId('main-dialog');

            await expect(dialog.locator('h2')).toContainText('Edit building details');
            await expect(dialog.getByTestId('building-name').locator('label')).toContainText('Building name');
            await expect(dialog.getByTestId('building-name').locator('input')).toHaveValue('Forgan Smith Building');
            await expect(dialog.getByTestId('building-number').locator('label')).toContainText('Building number');
            await expect(dialog.getByTestId('building-number').locator('input')).toHaveValue('0001');

            const floorList = dialog.getByTestId('building-floor-list');
            await expect(floorList.locator('h3')).toContainText('Floors - Choose ground floor:');
            await expect(floorList).toBeVisible();
            await expect(floorList.locator('ul > *')).toHaveCount(3);
            await expect(floorList.locator('ul li:first-of-type label')).toContainText('Floor 2');
            await expect(floorList.locator('ul li:nth-of-type(2) label')).toContainText('Floor 3A');
            await expect(floorList.locator('ul li:last-of-type label')).toContainText('None');
            await expect(floorList.locator('ul li:last-of-type input')).toBeChecked();

            const campusList = dialog.getByTestId('building-site-list');
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
        test('edit building dialog is accessible', async ({ page }) => {
            await assertCanOpenEditBuildingDialog(page, 1);

            await assertAccessibility(page, '[data-testid="main-dialog"]');
        });
        test('can cancel a deletion of a building', async ({ page }) => {
            await assertCanOpenEditBuildingDialog(page, 1);
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
            await expect(mainDialog.locator('h2')).toContainText('Edit building details'); // and is the expected dialog
        });
        test('building delete is accessible', async ({ page }) => {
            await assertCanOpenEditBuildingDialog(page, 1);
            await clickDeleteButton(page);

            await assertAccessibility(page, '[data-testid="confirmation-dialog"]');
        });
        test('can delete a building', async ({ page }) => {
            await assertCanOpenEditBuildingDialog(page, 1);
            const editDialog = page.getByTestId('main-dialog');

            await clickDeleteButton(page);

            const confirmationDialog = page.getByTestId('confirmation-dialog');
            await expect(confirmationDialog.getByTestId('confirmation-dialog-message')).toBeVisible();
            await expect(confirmationDialog.getByTestId('confirmation-dialog-message')).toContainText(
                'Do you really want to delete Forgan Smith Building?',
            );
            await expect(confirmationDialog.getByTestId('confirmation-dialog-message')).toContainText(
                'This will also delete associated floors.',
            );
            await expect(confirmationDialog.getByTestId('confirmation-dialog-accept-button')).toBeVisible();
            await expect(confirmationDialog.getByTestId('confirmation-dialog-accept-button')).toContainText('Yes');
            await confirmationDialog.getByTestId('confirmation-dialog-accept-button').click();

            await assertToastHasMessage(page, ' Forgan Smith Building deleted');
            await expect(page.getByTestId('confirmation-dialog')).not.toBeVisible(); // conf dialog closed
            await expect(editDialog.locator('h2')).not.toBeVisible(); // the main dialog closed
            // cant assert change happens as mock list reloads
        });
        test('validates properly - name field empty gives an error', async ({ page }) => {
            await assertCanOpenEditBuildingDialog(page, 1);
            const dialog = page.getByTestId('main-dialog');

            await dialog
                .getByTestId('building-name')
                .locator('input')
                .clear();
            await dialog.getByTestId('dialog-save-button').click();

            await assertToastHasMessage(page, 'Please enter building name and number');
        });
        test('validates properly - number field empty gives an error', async ({ page }) => {
            await assertCanOpenEditBuildingDialog(page, 1);
            const dialog = page.getByTestId('main-dialog');

            await dialog
                .getByTestId('building-number')
                .locator('input')
                .clear();
            await dialog.getByTestId('dialog-save-button').click();

            await assertToastHasMessage(page, 'Please enter building name and number');
        });
        test('validates properly - both fields empty gives an error', async ({ page }) => {
            await assertCanOpenEditBuildingDialog(page, 1);
            const dialog = page.getByTestId('main-dialog');

            await dialog
                .getByTestId('building-number')
                .locator('input')
                .clear();
            await dialog
                .getByTestId('building-number')
                .locator('input')
                .clear();
            await dialog.getByTestId('dialog-save-button').click();

            await assertToastHasMessage(page, 'Please enter building name and number');
        });
        test('can save changes to a building', async ({ page }) => {
            await assertCanOpenEditBuildingDialog(page, 1);
            const dialog = page.getByTestId('main-dialog');

            await dialog
                .getByTestId('building-number')
                .locator('input')
                .type(' append');
            await dialog
                .getByTestId('building-number')
                .locator('input')
                .type('9');
            await dialog.getByTestId('dialog-save-button').click();

            await assertToastHasMessage(page, 'Change to building saved');
            // cant assert change happens as mock list reloads
        });
        test('can close the building dialog with the cancel button', async ({ page }) => {
            await assertCanOpenEditBuildingDialog(page, 1);
            const dialog = page.getByTestId('main-dialog');

            await expect(dialog).toBeVisible();
            await dialog.getByTestId('dialog-cancel-button').click();

            await expect(dialog).not.toBeVisible();
        });
        test('can close the building dialog with the escape key', async ({ page }) => {
            await assertCanOpenEditBuildingDialog(page, 1);
            const dialog = page.getByTestId('main-dialog');

            await expect(dialog).toBeVisible();
            await dialog.press('Escape');

            await expect(dialog).not.toBeVisible();
        });
        test.describe('Add a floor to a building', () => {
            async function assertCanOpenAddFloorDialog(page: Page, buildingId: number) {
                await assertCanOpenEditBuildingDialog(page, buildingId);
                const dialog = page.getByTestId('main-dialog');
                await expect(dialog.locator('h2')).toContainText('Edit building details');

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

                await expect(dialog.getByTestId('floor-name').locator('label')).toContainText('Floor name');
                await expect(dialog.getByTestId('floor-name').locator('input')).toBeVisible();

                await expect(dialog.getByTestId('dialog-delete-button')).not.toBeVisible();
                await expect(dialog.getByTestId('dialog-addnew-button')).not.toBeVisible();
                await expect(dialog.getByTestId('dialog-cancel-button')).toBeVisible();
                await expect(dialog.getByTestId('dialog-cancel-button')).toContainText('Cancel');
                await expect(dialog.getByTestId('dialog-save-button')).toBeVisible();
                await expect(dialog.getByTestId('dialog-save-button')).toContainText('Save');
            });
            test('validates properly for empty floor field', async ({ page }) => {
                await assertCanOpenAddFloorDialog(page, 1);
                const dialog = page.getByTestId('main-dialog');

                // save without entering anything in the form
                await dialog.getByTestId('dialog-save-button').click();
                await assertToastHasMessage(page, 'Please enter floor name');
            });
            test('can save with valid floor data, ground floor not requested', async ({ page }) => {
                await assertCanOpenAddFloorDialog(page, 1);
                const dialog = page.getByTestId('main-dialog');

                await expect(dialog.getByTestId('floor-name').locator('input')).toBeVisible();
                await dialog
                    .getByTestId('floor-name')
                    .locator('input')
                    .fill('name of new floor');
                await dialog.getByTestId('dialog-save-button').click();

                await assertToastHasMessage(page, 'Floor added');
                // cant assert change happens as mock list reloads
            });
            test('can save with valid floor data, ground floor requested, no current ground floor', async ({
                page,
            }) => {
                await assertCanOpenAddFloorDialog(page, 1);
                const dialog = page.getByTestId('main-dialog');

                await expect(dialog.getByTestId('floor-name').locator('input')).toBeVisible();
                await expect(dialog.getByTestId('mark-ground-floor').locator('label')).toContainText(
                    'No floor is currently marked as the ground floor',
                );

                await dialog
                    .getByTestId('floor-name')
                    .locator('input')
                    .fill('name of new floor');
                await dialog
                    .getByTestId('mark-ground-floor')
                    .locator('input')
                    .setChecked(true);
                await dialog.getByTestId('dialog-save-button').click();

                await assertToastHasMessage(page, 'Floor added');
                // cant assert change happens as mock list reloads
            });
            test('can save with valid floor data, ground floor requested, override current ground floor', async ({
                page,
            }) => {
                await assertCanOpenAddFloorDialog(page, 2);
                const dialog = page.getByTestId('main-dialog');

                await expect(dialog.getByTestId('floor-name').locator('input')).toBeVisible();
                await expect(dialog.getByTestId('mark-ground-floor').locator('label')).toContainText(
                    'Current ground floor is Floor 1',
                );

                await dialog
                    .getByTestId('floor-name')
                    .locator('input')
                    .fill('name of new floor');
                await dialog
                    .getByTestId('mark-ground-floor')
                    .locator('input')
                    .setChecked(true);
                await dialog.getByTestId('dialog-save-button').click();

                await assertToastHasMessage(page, 'Floor added');
                // cant assert change happens as mock list reloads
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
    });
    test.describe('Edit a floor', () => {
        async function assertCanOpenEditFloorDialog(page: Page, floorId: number) {
            await page.goto('/admin/spaces/manage/locations?user=uqstaff');
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

            await assertToastHasMessage(page, 'Floor 2 in Forgan Smith Building deleted');
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
        test('can save changes to a floor', async ({ page }) => {
            await assertCanOpenEditFloorDialog(page, 1);
            const dialog = page.getByTestId('main-dialog');

            await dialog
                .getByTestId('floor-name')
                .locator('input')
                .type(' append');
            await dialog.getByTestId('dialog-save-button').click();

            await assertToastHasMessage(page, 'Changes to floor saved');
            // cant assert change happens as mock list reloads
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
        await page.goto('/admin/spaces/manage/locations?user=uqstaff');

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
});
