import { expect, test } from '@uq/pw/test';
import { COLOR_UQPURPLE } from '@uq/pw/lib/constants';
import { assertAccessibility } from '@uq/pw/lib/axe';
import { assertExpectedDataSentToServer, setTestDataCookie } from '@uq/pw/lib/helpers';
import { assertToastHasMessage } from '@uq/pw/tests/adminPages/spaces/spacesTestHelper';

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
test.describe('Spaces Admin - manage facility types page', () => {
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

        const servicesGroup = page.getByTestId('facilitygroup-services');
        const ediaGroup = page.getByTestId('facilitygroup-edia-filters');
        const spaceTypeGroup = page.getByTestId('facilitygroup-spaceroom-type');
        const floorGroup = page.getByTestId('facilitygroup-on-this-floor');
        const featuresGroup = page.getByTestId('facilitygroup-space-features');
        const lightingGroup = page.getByTestId('facilitygroup-lighting');
        const noiseLevelGroup = page.getByTestId('facilitygroup-acceptable-noise');
        const roomFeatureGroup = page.getByTestId('facilitygroup-room-features');

        await expect(servicesGroup.getByTestId('facilitytype-name-54')).toBeVisible();
        await expect(servicesGroup.getByTestId('facilitytype-name-54')).toContainText('AskUs service');

        await expect(servicesGroup.getByTestId('facilitytype-name-53')).toBeVisible();
        await expect(servicesGroup.getByTestId('facilitytype-name-53')).toContainText('Food outlets');

        await expect(servicesGroup.getByTestId('facilitytype-name-55')).toBeVisible();
        await expect(servicesGroup.getByTestId('facilitytype-name-55')).toContainText('Production Printing Services');

        await expect(servicesGroup.getByTestId('facilitytype-name-56')).toBeVisible();
        await expect(servicesGroup.getByTestId('facilitytype-name-56')).toContainText('Retail Outlets');

        await expect(ediaGroup.getByTestId('facilitytype-name-57')).toBeVisible();
        await expect(ediaGroup.getByTestId('facilitytype-name-57')).toContainText('Contains Artwork');

        await expect(spaceTypeGroup.getByTestId('facilitytype-name-19')).toBeVisible();
        await expect(spaceTypeGroup.getByTestId('facilitytype-name-19')).toContainText('Bookable');

        await expect(floorGroup.getByTestId('facilitytype-name-30')).toBeVisible();
        await expect(floorGroup.getByTestId('facilitytype-name-30')).toContainText('Energy pod');

        await expect(floorGroup.getByTestId('facilitytype-name-26')).toBeVisible();
        await expect(floorGroup.getByTestId('facilitytype-name-26')).toContainText(
            'Food & Drink Vending Machine/Snack Bar',
        );

        await expect(floorGroup.getByTestId('facilitytype-name-20')).toBeVisible();
        await expect(floorGroup.getByTestId('facilitytype-name-20')).toContainText('Fridge');

        await expect(floorGroup.getByTestId('facilitytype-name-21')).toBeVisible();
        await expect(floorGroup.getByTestId('facilitytype-name-21')).toContainText('Hot/ Cold Water');

        await expect(floorGroup.getByTestId('facilitytype-name-3')).toBeVisible();
        await expect(floorGroup.getByTestId('facilitytype-name-3')).toContainText('Kitchen');

        await expect(floorGroup.getByTestId('facilitytype-name-4')).toBeVisible();
        await expect(floorGroup.getByTestId('facilitytype-name-4')).toContainText('Microwave');

        await expect(floorGroup.getByTestId('facilitytype-name-28')).toBeVisible();
        await expect(floorGroup.getByTestId('facilitytype-name-28')).toContainText(
            'Pharmacy Vending Machine/Snack Bar',
        );

        await expect(floorGroup.getByTestId('facilitytype-name-25')).toBeVisible();
        await expect(floorGroup.getByTestId('facilitytype-name-25')).toContainText('PWD toilets - Automatic Door');

        await expect(floorGroup.getByTestId('facilitytype-name-24')).toBeVisible();
        await expect(floorGroup.getByTestId('facilitytype-name-24')).toContainText('PWD toilets - Lie flat');

        await expect(floorGroup.getByTestId('facilitytype-name-29')).toBeVisible();
        await expect(floorGroup.getByTestId('facilitytype-name-29')).toContainText('Recharge Station');

        await expect(floorGroup.getByTestId('facilitytype-name-31')).toBeVisible();
        await expect(floorGroup.getByTestId('facilitytype-name-31')).toContainText('Self-printing & scanning');

        await expect(floorGroup.getByTestId('facilitytype-name-27')).toBeVisible();
        await expect(floorGroup.getByTestId('facilitytype-name-27')).toContainText(
            'Stationery Vending Machine/Snack Bar',
        );

        await expect(floorGroup.getByTestId('facilitytype-name-23')).toBeVisible();
        await expect(floorGroup.getByTestId('facilitytype-name-23')).toContainText('Toilets, female');

        await expect(floorGroup.getByTestId('facilitytype-name-22')).toBeVisible();
        await expect(floorGroup.getByTestId('facilitytype-name-22')).toContainText('Toilets, male');

        await expect(featuresGroup.getByTestId('facilitytype-name-39')).toBeVisible();
        await expect(featuresGroup.getByTestId('facilitytype-name-39')).toContainText('Adjustable desks');

        await expect(featuresGroup.getByTestId('facilitytype-name-8')).toBeVisible();
        await expect(featuresGroup.getByTestId('facilitytype-name-8')).toContainText('AV equipment');

        await expect(featuresGroup.getByTestId('facilitytype-name-32')).toBeVisible();
        await expect(featuresGroup.getByTestId('facilitytype-name-32')).toContainText('BYOD station');

        await expect(featuresGroup.getByTestId('facilitytype-name-33')).toBeVisible();
        await expect(featuresGroup.getByTestId('facilitytype-name-33')).toContainText('Client accessible power point');

        await expect(featuresGroup.getByTestId('facilitytype-name-5')).toBeVisible();
        await expect(featuresGroup.getByTestId('facilitytype-name-5')).toContainText('Computer');

        await expect(featuresGroup.getByTestId('facilitytype-name-42')).toBeVisible();
        await expect(featuresGroup.getByTestId('facilitytype-name-42')).toContainText('General Collections');

        await expect(featuresGroup.getByTestId('facilitytype-name-41')).toBeVisible();
        await expect(featuresGroup.getByTestId('facilitytype-name-41')).toContainText('High Use Collections');

        await expect(featuresGroup.getByTestId('facilitytype-name-45')).toBeVisible();
        await expect(featuresGroup.getByTestId('facilitytype-name-45')).toContainText('Lending');

        await expect(featuresGroup.getByTestId('facilitytype-name-40')).toBeVisible();
        await expect(featuresGroup.getByTestId('facilitytype-name-40')).toContainText('Lockers');

        await expect(featuresGroup.getByTestId('facilitytype-name-47')).toBeVisible();
        await expect(featuresGroup.getByTestId('facilitytype-name-47')).toContainText('Lounge chairs');

        await expect(featuresGroup.getByTestId('facilitytype-name-7')).toBeVisible();
        await expect(featuresGroup.getByTestId('facilitytype-name-7')).toContainText('On-desk power point');

        await expect(featuresGroup.getByTestId('facilitytype-name-34')).toBeVisible();
        await expect(featuresGroup.getByTestId('facilitytype-name-34')).toContainText('on-desk USB-A');

        await expect(featuresGroup.getByTestId('facilitytype-name-37')).toBeVisible();
        await expect(featuresGroup.getByTestId('facilitytype-name-37')).toContainText('On-desk USB-C, High Power');

        await expect(featuresGroup.getByTestId('facilitytype-name-36')).toBeVisible();
        await expect(featuresGroup.getByTestId('facilitytype-name-36')).toContainText('On-desk USB-C, Low Power ');

        await expect(featuresGroup.getByTestId('facilitytype-name-35')).toBeVisible();
        await expect(featuresGroup.getByTestId('facilitytype-name-35')).toContainText('Qi chargers');

        await expect(featuresGroup.getByTestId('facilitytype-name-43')).toBeVisible();
        await expect(featuresGroup.getByTestId('facilitytype-name-43')).toContainText(
            'Recreational reading collection',
        );

        await expect(featuresGroup.getByTestId('facilitytype-name-44')).toBeVisible();
        await expect(featuresGroup.getByTestId('facilitytype-name-44')).toContainText('Requested items');

        await expect(featuresGroup.getByTestId('facilitytype-name-46')).toBeVisible();
        await expect(featuresGroup.getByTestId('facilitytype-name-46')).toContainText('Return station');

        await expect(featuresGroup.getByTestId('facilitytype-name-38')).toBeVisible();
        await expect(featuresGroup.getByTestId('facilitytype-name-38')).toContainText('Whiteboard');

        await expect(lightingGroup.getByTestId('facilitytype-name-16')).toBeVisible();
        await expect(lightingGroup.getByTestId('facilitytype-name-16')).toContainText('Desk lamp');

        await expect(lightingGroup.getByTestId('facilitytype-name-48')).toBeVisible();
        await expect(lightingGroup.getByTestId('facilitytype-name-48')).toContainText('Dimmable');

        await expect(lightingGroup.getByTestId('facilitytype-name-49')).toBeVisible();
        await expect(lightingGroup.getByTestId('facilitytype-name-49')).toContainText('Low Light');

        await expect(lightingGroup.getByTestId('facilitytype-name-50')).toBeVisible();
        await expect(lightingGroup.getByTestId('facilitytype-name-50')).toContainText('Natural');

        await expect(noiseLevelGroup.getByTestId('facilitytype-name-10')).toBeVisible();
        await expect(noiseLevelGroup.getByTestId('facilitytype-name-10')).toContainText('High noise level ');

        await expect(noiseLevelGroup.getByTestId('facilitytype-name-17')).toBeVisible();
        await expect(noiseLevelGroup.getByTestId('facilitytype-name-17')).toContainText('Low noise level');

        await expect(roomFeatureGroup.getByTestId('facilitytype-name-11')).toBeVisible();
        await expect(roomFeatureGroup.getByTestId('facilitytype-name-11')).toContainText('AT technology');

        await expect(roomFeatureGroup.getByTestId('facilitytype-name-52')).toBeVisible();
        await expect(roomFeatureGroup.getByTestId('facilitytype-name-52')).toContainText('Exam Friendly');

        await expect(roomFeatureGroup.getByTestId('facilitytype-name-13')).toBeVisible();
        await expect(roomFeatureGroup.getByTestId('facilitytype-name-13')).toContainText('Postgraduate spaces');

        await expect(roomFeatureGroup.getByTestId('facilitytype-name-12')).toBeVisible();
        await expect(roomFeatureGroup.getByTestId('facilitytype-name-12')).toContainText('Power outlets');

        await expect(roomFeatureGroup.getByTestId('facilitytype-name-14')).toBeVisible();
        await expect(roomFeatureGroup.getByTestId('facilitytype-name-14')).toContainText('Undergrad spaces');
    });
    test('is accessible on initial load', async ({ page }) => {
        await assertAccessibility(page, '[data-testid="StandardPage"]');
    });
});
test.describe('Spaces Admin - create new group dialog', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/admin/spaces/manage/facilitytypes?user=libSpaces');
        await page.setViewportSize({ width: 1300, height: 1000 });
        // wait for page to load
        await expect(page.getByTestId('admin-spaces-page-title').getByText(/Manage Facility types/)).toBeVisible();
    });
    test('dialog loads as expected', async ({ page }) => {
        // form fields not present
        await expect(page.getByTestId('new-group-name')).not.toBeVisible();
        await expect(page.getByTestId('new-group-first')).not.toBeVisible();
        await expect(page.getByTestId('dialog-cancel-button')).not.toBeVisible();
        await expect(page.getByTestId('dialog-save-button')).not.toBeVisible();

        // open the dialog
        await expect(page.getByTestId('add-new-group-button')).toBeVisible();
        await expect(page.getByTestId('add-new-group-button')).toHaveText('Add new Facility type group');
        await page.getByTestId('add-new-group-button').click();

        // form fields present
        await expect(page.getByTestId('new-group-name')).toBeVisible();
        await expect(page.getByTestId('new-group-first')).toBeVisible();
        await expect(page.getByTestId('dialog-cancel-button')).toBeVisible();
        await expect(page.getByTestId('dialog-save-button')).toBeVisible();

        // close the dialog
        await page.getByTestId('dialog-cancel-button').click();

        // form fields not present
        await expect(page.getByTestId('new-group-name')).not.toBeVisible();
        await expect(page.getByTestId('new-group-first')).not.toBeVisible();
        await expect(page.getByTestId('dialog-cancel-button')).not.toBeVisible();
        await expect(page.getByTestId('dialog-save-button')).not.toBeVisible();

        // open the dialog
        await expect(page.getByTestId('add-new-group-button')).toBeVisible();
        await expect(page.getByTestId('add-new-group-button')).toHaveText('Add new Facility type group');
        await page.getByTestId('add-new-group-button').click();

        // form fields present
        await expect(page.getByTestId('new-group-name')).toBeVisible();
        await expect(page.getByTestId('new-group-first')).toBeVisible();
        await expect(page.getByTestId('dialog-cancel-button')).toBeVisible();
        await expect(page.getByTestId('dialog-save-button')).toBeVisible();
    });
    test('can save new group', async ({ page }) => {
        await expect(page.getByTestId('new-group-name')).not.toBeVisible();
        await expect(page.getByTestId('new-group-first')).not.toBeVisible();

        await expect(page.getByTestId('add-new-group-button')).toBeVisible();
        await expect(page.getByTestId('add-new-group-button')).toHaveText('Add new Facility type group');
        await page.getByTestId('add-new-group-button').click();
        await expect(page.getByTestId('new-group-name')).toBeVisible();
        await expect(page.getByTestId('new-group-first')).toBeVisible();

        await page.getByTestId('new-group-name').click();
        await page.getByTestId('new-group-name').fill('New group');

        await page.getByTestId('new-group-first').click();
        await page.getByTestId('new-group-first').fill('First type in group');

        await page.getByTestId('dialog-save-button').click();

        await assertToastHasMessage(page, 'Facility type created');
        // not testing content as the double send confuses this
    });
    test('new group dialog is accessible', async ({ page }) => {
        await expect(page.getByTestId('new-group-name')).not.toBeVisible();
        await expect(page.getByTestId('new-group-first')).not.toBeVisible();

        await expect(page.getByTestId('add-new-group-button')).toBeVisible();
        await expect(page.getByTestId('add-new-group-button')).toHaveText('Add new Facility type group');
        await page.getByTestId('add-new-group-button').click();
        await expect(page.getByTestId('new-group-name')).toBeVisible();
        await expect(page.getByTestId('new-group-first')).toBeVisible();
        await assertAccessibility(page, '[data-testid="main-dialog"]');
    });
    test('save new group has required fields, no fields', async ({ page }) => {
        await expect(page.getByTestId('new-group-name')).not.toBeVisible();
        await expect(page.getByTestId('new-group-first')).not.toBeVisible();

        await expect(page.getByTestId('add-new-group-button')).toBeVisible();
        await expect(page.getByTestId('add-new-group-button')).toHaveText('Add new Facility type group');
        await page.getByTestId('add-new-group-button').click();
        await expect(page.getByTestId('new-group-name')).toBeVisible();
        await expect(page.getByTestId('new-group-first')).toBeVisible();

        // no fields gives error
        await page.getByTestId('dialog-save-button').click();
        await assertToastHasMessage(page, 'Please enter both fields.');
    });
    test('save new group has required fields, group only', async ({ page }) => {
        await expect(page.getByTestId('new-group-name')).not.toBeVisible();
        await expect(page.getByTestId('new-group-first')).not.toBeVisible();

        await expect(page.getByTestId('add-new-group-button')).toBeVisible();
        await expect(page.getByTestId('add-new-group-button')).toHaveText('Add new Facility type group');
        await page.getByTestId('add-new-group-button').click();
        await expect(page.getByTestId('new-group-name')).toBeVisible();
        await expect(page.getByTestId('new-group-first')).toBeVisible();

        // one field gives error
        await page.getByTestId('new-group-name').click();
        await page.getByTestId('new-group-name').fill('New group');
        await page.getByTestId('dialog-save-button').click();
        await assertToastHasMessage(page, 'Please enter both fields.');
    });
    test('save new group has required fields, type only', async ({ page }) => {
        await expect(page.getByTestId('new-group-name')).not.toBeVisible();
        await expect(page.getByTestId('new-group-first')).not.toBeVisible();

        await expect(page.getByTestId('add-new-group-button')).toBeVisible();
        await expect(page.getByTestId('add-new-group-button')).toHaveText('Add new Facility type group');
        await page.getByTestId('add-new-group-button').click();
        await expect(page.getByTestId('new-group-name')).toBeVisible();
        await expect(page.getByTestId('new-group-first')).toBeVisible();

        await page.getByTestId('new-group-name').clear();
        await page.getByTestId('new-group-first').click();
        await page.getByTestId('new-group-first').fill('First type in group');
        await page.getByTestId('dialog-save-button').click();
        await assertToastHasMessage(page, 'Please enter both fields.');
    });
});
test.describe('Spaces Admin - edit group dialog', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/admin/spaces/manage/facilitytypes?user=libSpaces');
        await page.setViewportSize({ width: 1300, height: 1000 });
        // wait for page to load
        await expect(page.getByTestId('admin-spaces-page-title').getByText(/Manage Facility types/)).toBeVisible();
    });
    test('edit group dialog loads as expected', async ({ page }) => {
        const deleteButton = page.getByTestId('dialog-delete-button');
        const cancelButton = page.getByTestId('dialog-cancel-button');
        const saveButton = page.getByTestId('dialog-save-button');
        const groupNameEditField = page.getByTestId('facility_type_group_name');

        const noiseLevelGroupEditButton = page.getByTestId('edit-group-5-button');
        const groupNameLabel = 'Acceptable noise';

        await expect(groupNameEditField).not.toBeVisible();
        await expect(deleteButton).not.toBeVisible();
        await expect(cancelButton).not.toBeVisible();
        await expect(saveButton).not.toBeVisible();

        // open the dialog
        await expect(noiseLevelGroupEditButton).toBeVisible();
        await noiseLevelGroupEditButton.click();

        // form fields present
        await expect(groupNameEditField).toBeVisible();
        await expect(groupNameEditField).toHaveValue(groupNameLabel);
        await expect(deleteButton).toBeVisible();
        await expect(cancelButton).toBeVisible();
        await expect(saveButton).toBeVisible();

        // close the dialog
        await cancelButton.click();

        // form fields not present
        await expect(groupNameEditField).not.toBeVisible();
        await expect(deleteButton).not.toBeVisible();
        await expect(cancelButton).not.toBeVisible();
        await expect(saveButton).not.toBeVisible();

        // open the dialog and the form appears again (check for redraw failures)
        await expect(page.getByTestId('add-new-group-button')).toBeVisible();
        await expect(page.getByTestId('add-new-group-button')).toHaveText('Add new Facility type group');
        await noiseLevelGroupEditButton.click();

        // form fields present
        await expect(groupNameEditField).toBeVisible();
        await expect(groupNameEditField).toHaveValue(groupNameLabel);
        await expect(deleteButton).toBeVisible();
        await expect(cancelButton).toBeVisible();
        await expect(saveButton).toBeVisible();
    });
    test('has correct deletion warnings for different groups', async ({ page }) => {
        const cancelButton = page.getByTestId('dialog-cancel-button');

        const noiseLevelGroupEditButton = page.getByTestId('edit-group-5-button');
        await noiseLevelGroupEditButton.click();
        await expect(page.getByTestId(`dialogMessage`)).toBeVisible();
        await expect(page.getByTestId(`dialogMessage`)).toContainText(
            "This facility group's child types will be removed from 2 Spaces if you delete it. Those Spaces will not be deleted.",
        );
        await cancelButton.click();

        const ediaGroupEditButton = page.getByTestId('edit-group-8-button');
        await ediaGroupEditButton.click();
        await expect(page.getByTestId(`dialogMessage`)).toBeVisible();
        await expect(page.getByTestId(`dialogMessage`)).not.toContainText(
            "This facility group's child types will be removed from 2 Spaces if you delete it. Those Spaces will not be deleted.",
        );
        await expect(page.getByTestId(`dialogMessage`)).toContainText(
            "This facility group's child types will be removed from 1 Space if you delete it. The Space will not be deleted.",
        );
        await cancelButton.click();

        const unusedGroupEditButton = page.getByTestId('edit-group-9-button');
        await unusedGroupEditButton.click();
        await expect(page.getByTestId(`dialogMessage`)).toBeVisible();
        await expect(page.getByTestId(`dialogMessage`)).not.toContainText(
            "This facility group's child types will be removed from 1 Space if you delete it. The Space will not be deleted.",
        );
        await expect(page.getByTestId(`dialogMessage`)).toContainText(
            'This facility group can be deleted - none of its child types are currently showing for any Spaces.',
        );
    });
    test('can save a group name change', async ({ page, context }) => {
        await setTestDataCookie(context, page);

        const noiseLevelGroupEditButton = page.getByTestId('edit-group-4-button');
        const saveButton = page.getByTestId('dialog-save-button');
        const groupNameField = page.getByTestId('facility_type_group_name');

        await noiseLevelGroupEditButton.click();

        await groupNameField.click();
        await groupNameField.fill('Noise level appended');

        await saveButton.click();

        const expectedValues = {
            facility_type_group_name: 'Noise level appended',
            facility_type_group_loads_open: '1',
        };
        await assertExpectedDataSentToServer(page, expectedValues);
    });
    test('can change a group to open UNcollapsed', async ({ page, context }) => {
        await setTestDataCookie(context, page);

        const noiseLevelGroupEditButton = page.getByTestId('edit-group-5-button');
        const saveButton = page.getByTestId('dialog-save-button');
        const radioCollapsedField = page.getByTestId('facility_type_group_loads_open-collapsed');

        await noiseLevelGroupEditButton.click();

        await radioCollapsedField.click();

        await saveButton.click();

        const expectedValues = {
            facility_type_group_name: 'Acceptable noise',
            facility_type_group_loads_open: '0',
        };
        await assertExpectedDataSentToServer(page, expectedValues);
    });
    test('can change a group to open collapsed', async ({ page, context }) => {
        await setTestDataCookie(context, page);

        const noiseLevelGroupEditButton = page.getByTestId('edit-group-2-button');
        const saveButton = page.getByTestId('dialog-save-button');
        const radioUnCollapsedField = page.getByTestId('facility_type_group_loads_open-open');

        await noiseLevelGroupEditButton.click();

        await radioUnCollapsedField.click();

        await saveButton.click();

        const expectedValues = {
            facility_type_group_name: 'On this floor',
            facility_type_group_loads_open: '1',
        };
        await assertExpectedDataSentToServer(page, expectedValues);
    });
    test('save group name change is accessible', async ({ page }) => {
        const noiseLevelGroupEditButton = page.getByTestId('edit-group-4-button');

        await noiseLevelGroupEditButton.click();

        await assertAccessibility(page, '[data-testid="main-dialog"]');
    });
    test('can delete groups', async ({ page }) => {
        const deleteButton = page.getByTestId('dialog-delete-button');
        const confirmationDialog = page.getByTestId('confirmation-dialog');
        const deleteRejectButton = confirmationDialog.getByTestId('confirmation-dialog-reject-button');
        const deleteAcceptButton = confirmationDialog.getByTestId('confirmation-dialog-accept-button');
        const confirmationPrompt = confirmationDialog.getByTestId(`confirmation-dialog-message`);

        const noiseLevelGroupEditButton = page.getByTestId(`edit-group-5-button`);
        const groupName = 'Acceptable noise';

        // open edit dialog
        await noiseLevelGroupEditButton.click();

        // check dialog contents as expected
        await expect(page.getByTestId(`facility_type_group_name`)).toHaveValue(groupName);
        await expect(deleteButton).toBeVisible();
        await expect(confirmationDialog).not.toBeVisible();

        // click 'delete' button
        await deleteButton.click();

        // delete confirmation dialog looks as expected
        await expect(confirmationDialog).toBeVisible();
        await expect(confirmationPrompt).toContainText(`Do you really want to delete ${groupName}?`);
        await expect(deleteRejectButton).toBeVisible();
        await expect(deleteAcceptButton).toBeVisible();

        // can reject the deletion
        await deleteRejectButton.click();
        await expect(confirmationDialog).not.toBeVisible();

        // reopen it
        await deleteButton.click();

        // delete confirmation dialog looks as expected
        await expect(confirmationDialog).toBeVisible();
        await expect(confirmationPrompt).toContainText(`Do you really want to delete ${groupName}?`);
        await expect(deleteRejectButton).toBeVisible();
        await expect(deleteAcceptButton).toBeVisible();
        await expect(deleteAcceptButton).toContainText('Yes');

        // now delete it
        await deleteAcceptButton.click();

        // success
        await assertToastHasMessage(page, `${groupName} deleted`);
    });

    // dialog closes after save
});
test.describe('Spaces Admin - edit facility type dialog', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/admin/spaces/manage/facilitytypes?user=libSpaces');
        await page.setViewportSize({ width: 1300, height: 1000 });
        // wait for page to load
        await expect(page.getByTestId('admin-spaces-page-title').getByText(/Manage Facility types/)).toBeVisible();
    });
    test('the edit facility type dialog loads as expected', async ({ page }) => {
        const facilityTypeId = '17';

        // open edit dialog
        await expect(page.getByTestId(`edit-facility-type-${facilityTypeId}-button`)).toBeVisible();
        await page.getByTestId(`edit-facility-type-${facilityTypeId}-button`).click();

        // check dialog contents as expected
        await expect(page.getByTestId('dialog-delete-button')).toBeVisible();
        await expect(page.getByTestId('dialog-cancel-button')).toBeVisible();
        await expect(page.getByTestId('dialog-save-button')).toBeVisible();
        await expect(page.getByTestId('main-dialog').locator('h2')).toBeVisible();
        await expect(page.getByTestId('main-dialog').locator('h2')).toContainText('Edit a Facility Type');
        await expect(page.getByTestId(`facilitytype-name-${facilityTypeId}`)).toContainText('Low noise level');
        await expect(page.getByTestId('dialogMessage')).toContainText(
            'This facility type will be removed from 1 Space if you delete it. The Space will not be deleted.',
        );
    });
    test('can edit facility type successfully', async ({ page, context }) => {
        await setTestDataCookie(context, page);

        const facilityTypeId = '17';

        // open edit dialog
        await expect(page.getByTestId(`edit-facility-type-${facilityTypeId}-button`)).toBeVisible();
        await page.getByTestId(`edit-facility-type-${facilityTypeId}-button`).click();

        await page.getByTestId('facility_type_name').type('prepend ');
        await page.getByTestId('dialog-save-button').click();

        // success
        await assertToastHasMessage(page, 'Facility type updated');

        const expectedValues = {
            facility_type_name: 'prepend Low noise level',
            facility_type_id: facilityTypeId,
        };
        await assertExpectedDataSentToServer(page, expectedValues);
    });
    test('the edit facility type dialog is accessible', async ({ page }) => {
        const facilityTypeId = '17';

        // open edit dialog
        await expect(page.getByTestId(`edit-facility-type-${facilityTypeId}-button`)).toBeVisible();
        await page.getByTestId(`edit-facility-type-${facilityTypeId}-button`).click();

        await assertAccessibility(page, '[data-testid="main-dialog"]');
    });
    test('has correct deletion warnings for different types', async ({ page }) => {
        const noiseLevelLowEditButton = page.getByTestId(`edit-facility-type-17-button`);
        const computerEditButton = page.getByTestId(`edit-facility-type-5-button`);
        const containsUnuseditemEditButton = page.getByTestId(`edit-facility-type-58-button`);

        const hasONEspaceWarningMessage =
            'This facility type will be removed from 1 Space if you delete it. The Space will not be deleted.';
        const hasTWOspacesWarningMessage =
            'This facility type will be removed from 2 Spaces if you delete it. Those Spaces will not be deleted.';
        const hasNoSpacesWarninhMessage =
            'This facility type can be deleted - it is not currently showing for any Spaces.';

        await expect(noiseLevelLowEditButton).toBeVisible();
        await noiseLevelLowEditButton.click();
        await expect(page.getByText(hasONEspaceWarningMessage)).toBeVisible();
        await expect(page.getByTestId('warning-icon')).toBeVisible();
        await expect(page.getByTestId('dialog-cancel-button')).toBeVisible();
        await page.getByTestId('dialog-cancel-button').click();

        await expect(computerEditButton).toBeVisible();
        await computerEditButton.click();
        // the old text was removed from the page
        await expect(page.getByText(hasONEspaceWarningMessage)).not.toBeVisible();
        // the new text is present
        await expect(page.getByText(hasTWOspacesWarningMessage)).toBeVisible();
        await expect(page.getByTestId('warning-icon')).toBeVisible();
        await expect(page.getByTestId('dialog-cancel-button')).toBeVisible();
        await page.getByTestId('dialog-cancel-button').click();

        await expect(containsUnuseditemEditButton).toBeVisible();
        await containsUnuseditemEditButton.click();
        // the old text was removed from the page
        await expect(page.getByText(hasTWOspacesWarningMessage)).not.toBeVisible();
        // the new text is present
        await expect(page.getByText(hasNoSpacesWarninhMessage)).toBeVisible();
        await expect(page.getByTestId('warning-icon')).not.toBeVisible();
        await expect(page.getByTestId('dialog-cancel-button')).toBeVisible();
        await page.getByTestId('dialog-cancel-button').click();

        // check the warning icon comes back on later click
        await expect(noiseLevelLowEditButton).toBeVisible();
        await noiseLevelLowEditButton.click();
        await expect(page.getByTestId('warning-icon')).toBeVisible();
    });
    test('can delete facility type successfully', async ({ page }) => {
        const facilityTypeId = 57;
        const facilityTypeName = 'Contains Artwork';

        // open edit dialog
        await expect(page.getByTestId(`edit-facility-type-${facilityTypeId}-button`)).toBeVisible();
        await page.getByTestId(`edit-facility-type-${facilityTypeId}-button`).click();

        // check dialog contents as expected
        await expect(page.getByTestId('dialog-delete-button')).toBeVisible();
        await expect(page.getByTestId(`facilitytype-name-${facilityTypeId}`)).toContainText(facilityTypeName);
        await expect(page.getByTestId('confirmation-dialog')).not.toBeVisible();
        await page.getByTestId('dialog-delete-button').click();

        await expect(page.getByTestId('confirmation-dialog')).toBeVisible();
        const confirmationDialog = page.getByTestId('confirmation-dialog');
        await expect(confirmationDialog.getByTestId('confirmation-dialog-message')).toContainText(
            `Do you really want to delete ${facilityTypeName}?`,
        );
        await expect(confirmationDialog.getByTestId('confirmation-dialog-accept-button')).toBeVisible();
        await expect(confirmationDialog.getByTestId('confirmation-dialog-accept-button')).toContainText('Yes');
        await confirmationDialog.getByTestId('confirmation-dialog-accept-button').click();

        // success
        await assertToastHasMessage(page, `${facilityTypeName} deleted`);
    });
});
test.describe('Spaces Admin - adding new facility types', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/admin/spaces/manage/facilitytypes?user=libSpaces');
        await page.setViewportSize({ width: 1300, height: 1000 });
        // wait for page to load
        await expect(page.getByTestId('admin-spaces-page-title').getByText(/Manage Facility types/)).toBeVisible();
    });
    test('the add facility type dialog loads as expected', async ({ page }) => {
        const addDialog = page.getByTestId('main-dialog');
        const addDialogHeading = addDialog.locator('h2');
        const addDialogTextField = addDialog.getByTestId('facility_type_name');
        const addDialogCancelButton = addDialog.getByTestId('dialog-cancel-button');
        const addDialogSaveButton = addDialog.getByTestId('dialog-save-button');

        const addTypetoNoiseLevelGroupButton = page.getByTestId('add-group-5-button');
        const noiseLevelGroupName = 'Acceptable noise';

        // the form fields are not visible on load
        await expect(addDialog).not.toBeVisible();
        await expect(addDialogHeading).not.toBeVisible();
        await expect(addDialogTextField).not.toBeVisible();
        await expect(addDialogCancelButton).not.toBeVisible();
        await expect(addDialogSaveButton).not.toBeVisible();

        // load the "add facility type to group" dialog
        await addTypetoNoiseLevelGroupButton.click();

        // confirm the dialog is as expected
        await expect(addDialog).toBeVisible();
        await expect(addDialogHeading).toBeVisible();
        await expect(addDialogHeading).toContainText(`Add a Facility Type to ${noiseLevelGroupName}`);
        await expect(addDialogTextField).toBeVisible();
        await expect(addDialogTextField).toBeEmpty();
        await expect(addDialogCancelButton).toBeVisible();
        await expect(addDialogSaveButton).toBeVisible();

        // close the dialog
        addDialogCancelButton.click();

        // the form fields are gone again
        await expect(addDialog).toBeVisible();
        await expect(addDialogHeading).not.toBeVisible();
        await expect(addDialogTextField).not.toBeVisible();
        await expect(addDialogCancelButton).not.toBeVisible();
        await expect(addDialogSaveButton).not.toBeVisible();

        // reload the dialog
        await addTypetoNoiseLevelGroupButton.click();

        // and the dialog reloads
        await expect(addDialog).toBeVisible();
        await expect(addDialogHeading).toBeVisible();
        await expect(addDialogHeading).toContainText(`Add a Facility Type to ${noiseLevelGroupName}`);
        await expect(addDialogTextField).toBeVisible();
        await expect(addDialogTextField).toBeEmpty();
        await expect(addDialogCancelButton).toBeVisible();
        await expect(addDialogSaveButton).toBeVisible();
    });
    test('can save new type', async ({ page, context }) => {
        await setTestDataCookie(context, page);

        const noiseLevelGroupId = '5';
        const noiseLevelGroupName = 'Acceptable noise';

        await expect(page.getByTestId('add-facility-type-heading')).not.toBeVisible();
        await page.getByTestId(`add-group-${noiseLevelGroupId}-button`).click();

        await expect(page.getByTestId('add-facility-type-heading')).toBeVisible();
        await expect(page.getByTestId('add-facility-type-heading')).toHaveText(
            `Add a Facility Type to ${noiseLevelGroupName}`,
        );
        await page.getByRole('textbox', { name: 'New Facility type for Group' }).fill('New type');
        await page.getByTestId('dialog-save-button').click();

        const expectedValues = {
            facility_type__group_id: noiseLevelGroupId,
            facility_type_name: 'New type',
        };
        await assertExpectedDataSentToServer(page, expectedValues);
    });
    test('add new group dialog is accessible', async ({ page }) => {
        await expect(page.getByTestId('add-facility-type-heading')).not.toBeVisible();
        await page.getByTestId('add-group-1-button').click();
        await expect(page.getByTestId('add-facility-type-heading')).toBeVisible();
        await expect(page.getByTestId('add-facility-type-heading')).toHaveText(
            'Add a Facility Type to Space/Room Type',
        );

        await assertAccessibility(page, '[data-testid="main-dialog"]');
    });
    test('can cancel add new group dialog', async ({ page }) => {
        await expect(page.getByTestId('main-dialog')).not.toBeVisible();

        await page.getByTestId('add-group-2-button').click();
        await expect(page.getByTestId('main-dialog')).toBeVisible();
        await expect(page.getByTestId('add-facility-type-heading')).toBeVisible();
        await expect(page.getByTestId('add-facility-type-heading')).toHaveText('Add a Facility Type to On this floor');

        await page.getByTestId('dialog-cancel-button').click();
        await expect(page.getByTestId('main-dialog')).not.toBeVisible();
    });
});
test.describe('Spaces Admin - other pages', () => {
    test('can save new group when none current', async ({ page }) => {
        await page.goto('/admin/spaces/manage/facilitytypes?user=libSpaces&responseType=facilityTypesAllEmpty');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(page.getByTestId('admin-spaces-page-title').getByText(/Manage Facility types/)).toBeVisible();
    });
    test('as expected when there are no facility types', async ({ page }) => {
        await page.goto('/admin/spaces/manage/facilitytypes?user=libSpaces&responseType=facilityTypesAllEmpty');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(page.getByTestId('admin-spaces-page-title').getByText(/Manage Facility types/)).toBeVisible();

        await expect(
            page.getByTestId('space-facility-types-empty-message').getByText(/No facility types currently in system/),
        ).toBeVisible();
        await expect(page.getByTestId('add-new-group-button')).toBeVisible();

        // there is no data so a table of current facility types does not appear
        await expect(page.getByTestId('spaces-facility-groups').locator('> *')).toHaveCount(0);

        // the 'add new group" form is not open
        await expect(page.getByTestId('new-group-name')).not.toBeVisible();
        await expect(page.getByTestId('new-group-first')).not.toBeVisible();

        // open the "add new group" form
        await expect(page.getByTestId('add-new-group-button')).toHaveText('Add new Facility type group');
        await page.getByTestId('add-new-group-button').click();

        // form is now ready to add
        await expect(page.getByTestId('new-group-name')).toBeVisible();
        await expect(page.getByTestId('new-group-first')).toBeVisible();
        // the add process is no different to when there are children, so don't bother testing it here
    });
    test('api error 404', async ({ page }) => {
        await page.goto('/admin/spaces/manage/facilitytypes?user=libSpaces&responseType=facilityTypesAll404');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(page.getByTestId('admin-spaces-page-title').getByText(/Manage Facility types/)).toBeVisible();

        await expect(page.getByTestId('apiError').getByText(/Something went wrong/)).toBeVisible();
    });
    test('api error 500', async ({ page }) => {
        await page.goto('/admin/spaces/manage/facilitytypes?user=libSpaces&responseType=facilityTypesAllError');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(page.getByTestId('admin-spaces-page-title').getByText(/Manage Facility types/)).toBeVisible();

        await expect(page.getByTestId('apiError').getByText(/Something went wrong/)).toBeVisible();
    });
});
