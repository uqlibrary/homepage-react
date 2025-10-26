import { expect, Page, test } from '@uq/pw/test';
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

        await expect(page.getByTestId('facilitygroup-noise-level').getByTestId('facilitytype-input-1')).toBeVisible();
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

        const saveButton = page.getByTestId('spaces-facilitytypes-save-button');
        await expect(saveButton).toBeVisible();
        await expect(saveButton).toHaveCSS('background-color', COLOR_UQPURPLE);
        await expect(saveButton).toHaveCSS('border-color', COLOR_UQPURPLE);
        await expect(saveButton).toHaveCSS('color', 'rgb(255, 255, 255)');
    });
    test('is accessible on initial load', async ({ page }) => {
        await assertAccessibility(page, '[data-testid="StandardPage"]');
    });
    test('can clear new group form', async ({ page }) => {
        await expect(page.getByTestId('add-new-group-button')).toBeVisible();
        await expect(page.getByTestId('add-new-group-button')).toHaveText('Add new Facility group');
        await page.getByTestId('add-new-group-button').click();

        await expect(page.getByTestId('new-group-name')).toHaveText('');
        await page.getByTestId('new-group-name').click();
        await page.getByTestId('new-group-name').fill('New group');

        await expect(page.getByTestId('new-group-first')).toHaveText('');
        await page.getByTestId('new-group-first').click();
        await page.getByTestId('new-group-first').fill('First type in group');

        // close the form
        await expect(page.getByTestId('add-new-group-button')).toHaveText('Clear new Group form');
        await page.getByTestId('add-new-group-button').click();

        // reopen the form
        await expect(page.getByTestId('add-new-group-button')).toHaveText('Add new Facility group');
        await page.getByTestId('add-new-group-button').click();

        // the text fields are empty
        await expect(page.getByTestId('new-group-name')).toHaveText('');
        await expect(page.getByTestId('new-group-first')).toHaveText('');
    });
    test('can save new group', async ({ page, context }) => {
        await setTestDataCookie(context, page);

        await expect(page.getByTestId('new-group-name')).not.toBeVisible();
        await expect(page.getByTestId('new-group-first')).not.toBeVisible();

        await expect(page.getByTestId('add-new-group-button')).toBeVisible();
        await expect(page.getByTestId('add-new-group-button')).toHaveText('Add new Facility group');
        await page.getByTestId('add-new-group-button').click();
        await expect(page.getByTestId('new-group-name')).toBeVisible();
        await expect(page.getByTestId('new-group-first')).toBeVisible();
        await expect(page.getByTestId('add-new-group-button')).toHaveText('Clear new Group form');

        await page.getByTestId('new-group-name').click();
        await page.getByTestId('new-group-name').fill('New group');

        await page.getByTestId('new-group-first').click();
        await page.getByTestId('new-group-first').fill('First type in group');

        await page.getByTestId('spaces-facilitytypes-save-button').click();

        const expectedValues = {
            facility_type_group_name: 'New group',
        };
        await assertExpectedDataSentToServer(page, expectedValues);
    });
    test('can edit facility type successfully', async ({ page, context }) => {
        await setTestDataCookie(context, page);

        const facilityTypeId = '1';

        // open edit dialog
        await expect(page.getByTestId(`edit-facility-type-${facilityTypeId}-button`)).toBeVisible();
        await page.getByTestId(`edit-facility-type-${facilityTypeId}-button`).click();

        // check dialog contents as expected
        await expect(page.getByTestId('dialog-delete-button')).toBeVisible();
        await expect(page.getByTestId('dialog-cancel-button')).toBeVisible();
        await expect(page.getByTestId('dialog-save-button')).toBeVisible();
        await expect(page.getByTestId('main-dialog').locator('h2')).toBeVisible();
        await expect(page.getByTestId('main-dialog').locator('h2')).toContainText('Edit a Facility Type');
        await expect(page.getByTestId(`facilitytype-name-${facilityTypeId}`)).toContainText('Noise level Low');
        await expect(page.getByTestId('dialogMessage')).toContainText(
            'This facility type will be removed from 1 Space if you delete it. The Space will not be deleted.',
        );

        await page.getByTestId('facility_type_name').type('prepend ');
        await page.getByTestId('dialog-save-button').click();

        // success
        await assertToastHasMessage(page, 'Facility type updated');

        const expectedValues = {
            facility_type_name: 'prepend Noise level Low',
            facility_type_id: facilityTypeId,
        };
        await assertExpectedDataSentToServer(page, expectedValues);
    });
    test('has correct deletion warnings fpr different types', async ({ page, context }) => {
        await expect(page.getByTestId(`edit-facility-type-2-button`)).toBeVisible();
        await page.getByTestId(`edit-facility-type-2-button`).click();
        await expect(
            page.getByText(
                'This facility type will be removed from 1 Space if you delete it. The Space will not be deleted.',
            ),
        ).toBeVisible();
        await expect(page.getByTestId('dialog-cancel-button')).toBeVisible();
        await page.getByTestId('dialog-cancel-button').click();

        await expect(page.getByTestId(`edit-facility-type-4-button`)).toBeVisible();
        await page.getByTestId(`edit-facility-type-4-button`).click();
        // the old text was removed from the page
        await expect(
            page.getByText(
                'This facility type will be removed from 1 Space if you delete it. The Space will not be deleted.',
            ),
        ).not.toBeVisible();
        // the new text is present
        await expect(
            page.getByText(
                'This facility type will be removed from 2 Spaces if you delete it. The Spaces will not be deleted.',
            ),
        ).toBeVisible();
        await expect(page.getByTestId('dialog-cancel-button')).toBeVisible();
        await page.getByTestId('dialog-cancel-button').click();

        await expect(page.getByTestId(`edit-facility-type-17-button`)).toBeVisible();
        await page.getByTestId(`edit-facility-type-17-button`).click();
        // the old text was removed from the page
        await expect(
            page.getByText(
                'This facility type will be removed from 2 Spaces if you delete it. The Spaces will not be deleted.',
            ),
        ).not.toBeVisible();
        // the new text is present
        await expect(
            page.getByText('This facility type can be deleted - it is not currently showing for any Spaces.'),
        ).toBeVisible();
    });
    test.only('can delete facility type successfully', async ({ page }) => {
        const facilityTypeId = 17;
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
    test('can save new type', async ({ page, context }) => {
        await setTestDataCookie(context, page);

        await expect(page.getByTestId('add-facility-type-heading')).not.toBeVisible();
        await page.getByTestId('add-group-4-button').click();

        await expect(page.getByTestId('add-facility-type-heading')).toBeVisible();
        await expect(page.getByTestId('add-facility-type-heading')).toHaveText('Add a Facility Type to Noise level');
        await page.getByRole('textbox', { name: 'New Facility type for Group' }).fill('New type');
        await page.getByTestId('dialog-save-button').click();

        const expectedValues = {
            facility_type__group_id: '4',
            facility_type_name: 'New type',
        };
        await assertExpectedDataSentToServer(page, expectedValues);
    });
    test('dialog is accessible', async ({ page }) => {
        await expect(page.getByTestId('add-facility-type-heading')).not.toBeVisible();
        await page.getByTestId('add-group-1-button').click();
        await expect(page.getByTestId('add-facility-type-heading')).toBeVisible();
        await expect(page.getByTestId('add-facility-type-heading')).toHaveText('Add a Facility Type to Room Features');

        await assertAccessibility(page, '[data-testid="main-dialog"]');
    });
    test('can cancel dialog', async ({ page }) => {
        await expect(page.getByTestId('main-dialog')).not.toBeVisible();

        await page.getByTestId('add-group-2-button').click();
        await expect(page.getByTestId('main-dialog')).toBeVisible();
        await expect(page.getByTestId('add-facility-type-heading')).toBeVisible();
        await expect(page.getByTestId('add-facility-type-heading')).toHaveText('Add a Facility Type to Services');

        await page.getByTestId('dialog-cancel-button').click();
        await expect(page.getByTestId('main-dialog')).not.toBeVisible();
    });
});
test.describe('Spaces Admin - other pages', () => {
    test('can save new group when none current', async ({ page }) => {
        await page.goto('/admin/spaces/manage/facilitytypes?user=libSpaces&responseType=facilityTypesAllEmpty');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(page.getByTestId('admin-spaces-page-title').getByText(/Manage Facility types/)).toBeVisible();

        // TODO
        // no showhide button
        // no table showing
        // form shows
        // form works
    });
    test('works with single entry', async ({ page }) => {
        await page.goto('/admin/spaces/manage/facilitytypes?user=libSpaces&responseType=facilityTypesWithOne');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(page.getByTestId('admin-spaces-page-title').getByText(/Manage Facility types/)).toBeVisible();

        // TODO looks as expected
    });
    test('as expected when there are no facility types', async ({ page }) => {
        await page.goto('/admin/spaces/manage/facilitytypes?user=libSpaces&responseType=facilityTypesAllEmpty');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(page.getByTestId('admin-spaces-page-title').getByText(/Manage Facility types/)).toBeVisible();

        await expect(
            page.getByTestId('space-facility-types-empty-message').getByText(/No facility types currently in system/),
        ).toBeVisible();
        await expect(page.getByTestId('add-new-group-button')).toBeVisible();
        await expect(page.getByTestId('spaces-facilitytypes-save-button')).not.toBeVisible();

        // there is no data so a table of current facility types does not appear
        await expect(page.getByTestId('spaces-facility-groups').locator('> *')).toHaveCount(0);

        // the 'add new group" form is not open
        await expect(page.getByTestId('new-group-name')).not.toBeVisible();
        await expect(page.getByTestId('new-group-first')).not.toBeVisible();
        await expect(page.getByTestId('spaces-facilitytypes-save-button')).not.toBeVisible();

        // open the "add new group" form
        await expect(page.getByTestId('add-new-group-button')).toHaveText('Add new Facility group');
        await page.getByTestId('add-new-group-button').click();

        // form is now ready to add
        await expect(page.getByTestId('new-group-name')).toBeVisible();
        await expect(page.getByTestId('new-group-first')).toBeVisible();
        await expect(page.getByTestId('spaces-facilitytypes-save-button')).toBeVisible();
        // the add process is no different to when there are children, so don't bother testing it here

        // close the form and the save button disappears, because there aren't currently any facility types
        await expect(page.getByTestId('add-new-group-button')).toHaveText('Clear new Group form');
        await page.getByTestId('add-new-group-button').click();
        await expect(page.getByTestId('spaces-facilitytypes-save-button')).not.toBeVisible();
    });
    test('api error', async ({ page }) => {
        await page.goto('/admin/spaces/manage/facilitytypes?user=libSpaces&responseType=facilityTypesAll404');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(page.getByTestId('admin-spaces-page-title').getByText(/Manage Facility types/)).toBeVisible();

        await expect(page.getByTestId('apiError').getByText(/Something went wrong/)).toBeVisible();
    });
});
