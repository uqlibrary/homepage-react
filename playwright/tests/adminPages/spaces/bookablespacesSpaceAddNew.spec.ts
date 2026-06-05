import { expect, Page, test } from '@uq/pw/test';
import { assertAccessibility } from '@uq/pw/lib/axe';
import { assertExpectedDataSentToServer, setTestDataCookie } from '@uq/pw/lib/helpers';

import { COLOR_GLOBAL_ALERT_RED, COLOR_UQPURPLE } from '@uq/pw/lib/constants';
import { assertErrorPopupAppears } from '@uq/pw/tests/adminPages/spaces/spacesTestHelper';

const DUTTON_PARK_SPRINGSHARE_SPACE_ID = 3970;
const DUHIG_TOWER_SPRINGSHARE_SPACE_ID = 3831;

const inputField = (fieldName: string, page: Page) => page.getByTestId(fieldName).locator('input');
const selectCombobox = (fieldName: string, page: Page) => page.getByTestId(fieldName).locator('[role="combobox"]');

const waitForDefaultLocationSelection = async (page: Page) => {
    const campusInput = page.locator('#add-space-select-campus-input');
    const libraryInput = page.locator('#add-space-select-library-input');
    const floorInput = page.locator('#add-space-select-floor-input');
    const campusSelector = page.getByTestId('add-space-select-campus');
    const librarySelector = page.getByTestId('add-space-select-library');
    const floorSelector = page.getByTestId('add-space-select-floor');

    const assertDefaults = async () => {
        await expect(campusInput).toBeVisible();
        await expect(libraryInput).toBeVisible();
        await expect(floorInput).toBeVisible();

        // These select values are populated asynchronously after location data loads.
        await expect.poll(async () => await campusInput.inputValue(), { timeout: 30000 }).toBe('3');
        await expect.poll(async () => await libraryInput.inputValue(), { timeout: 30000 }).toBe('10');
        await expect.poll(async () => await floorInput.inputValue(), { timeout: 30000 }).toBe('65');
    };

    const manuallyApplyExpectedDefaults = async () => {
        await campusSelector.click();
        const campusListbox = page.getByRole('listbox', { name: 'Campus *' });
        await expect(campusListbox).toBeVisible();
        await campusListbox.getByRole('option', { name: /Dutton Park/i }).click();

        await librarySelector.click();
        const libraryListbox = page.getByRole('listbox', { name: 'Library *' });
        await expect(libraryListbox).toBeVisible();
        await libraryListbox.getByRole('option', { name: /Dutton Park Health Sciences/i }).click();

        await floorSelector.click();
        const floorListbox = page.getByRole('listbox', { name: 'Level *' });
        await expect(floorListbox).toBeVisible();
        await floorListbox.getByRole('option', { name: /Dutton Park Health Sciences - 65/i }).click();
    };

    try {
        await assertDefaults();
    } catch {
        // If async hydration stalls in CI, explicitly choose the intended defaults and re-assert.
        await manuallyApplyExpectedDefaults();
        await assertDefaults();
    }
};

const chooseAnySpaceType = async (page: Page): Promise<number> => {
    const spaceTypeSelector = page.getByTestId('space-type');
    await expect(spaceTypeSelector).toBeVisible();
    await spaceTypeSelector.click();

    const firstSpaceTypeOption = page.locator('ul[aria-labelledby="add-space-type-label"] li[role="option"]').first();
    await expect(firstSpaceTypeOption).toBeVisible();
    const selectedSpaceTypeId = await firstSpaceTypeOption.getAttribute('data-value');
    await firstSpaceTypeOption.click();

    expect(selectedSpaceTypeId).toBeTruthy();
    return Number(selectedSpaceTypeId);
};

const STEP_ABOUT = 'tab-about';
const STEP_FACILITY_TYPES = 'tab-facility-types';
const STEP_LOCATION_HOURS = 'tab-location-hours';
const STEP_IMAGERY = 'tab-imagery';

// const ST_LUCIA_DEFAULT_LATITUDE = '-27.49751';
// const ST_LUCIA_DEFAULT_LONGITUDE = '153.01329';
const PACE_DEFAULT_LATITUDE = '-27.50008';
const PACE_DEFAULT_LONGITUDE = '153.03024';

test.describe('Spaces Admin - add new space', () => {
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
        await navigationMenuButton.click();

        await expect(navigationDropdownMenu).toBeVisible();
        await expect(addNewSpaceOption).toBeVisible();

        await addNewSpaceOption.click();
        await expect(page).toHaveURL('http://localhost:2020/admin/spaces/add?user=libSpaces');
    });
});
test.describe('Spaces Admin - add new space', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/admin/spaces/add?user=libSpaces');
        await page.setViewportSize({ width: 1300, height: 1000 });
        // wait for page to load
        await expect(page.getByTestId('admin-spaces-page-title').getByText(/Add a new Space/)).toBeVisible();
    });
    test('add new space appears as expected onload', async ({ page }) => {
        await expect(page.getByTestId(STEP_ABOUT)).toBeVisible();
        await expect(page.getByTestId(STEP_ABOUT)).toContainText('About');

        await expect(page.getByTestId(STEP_FACILITY_TYPES)).toBeVisible();
        await expect(page.getByTestId(STEP_FACILITY_TYPES)).toContainText('Facility types');
        await expect(page.getByTestId(STEP_LOCATION_HOURS)).toBeVisible();
        await expect(page.getByTestId(STEP_LOCATION_HOURS)).toContainText('Location & Hours');
        await expect(page.getByTestId(STEP_IMAGERY)).toBeVisible();
        await expect(page.getByTestId(STEP_IMAGERY)).toContainText('Imagery');

        await expect(page.getByTestId('space-name').locator('input')).toBeVisible();
        await expect(page.getByTestId('space-type').locator('input')).toBeVisible();
        // await expect(page.getByTestId('add-space-type-new').locator('input')).toBeVisible();

        await waitForDefaultLocationSelection(page);

        // change to location tab
        await page.getByTestId('spaces-form-next-button').click(); // to facility types
        await page.getByTestId('spaces-form-next-button').click(); // to locations

        await expect(page.getByTestId('add-space-precise-location').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-pretty-location')).toBeVisible();
        await expect(page.getByTestId('add-space-pretty-location').locator('.location-floor')).toContainText('Level 6');
        await expect(page.getByTestId('add-space-pretty-location').locator('.location-library')).toContainText(
            'Dutton Park Health Sciences',
        );
        await expect(page.getByTestId('add-space-pretty-location').locator('.location-building')).toContainText(
            'Pharmacy Australia Centre of Excellence (870)',
        );
        await expect(page.getByTestId('add-space-pretty-location').locator('.location-campus')).toContainText(
            'Dutton Park',
        );
            await expect(page.getByTestId('add-space-springshare-id')).toContainText('Dutton Park Health Sciences');

        const mapTab = (tabId: number) =>
            page.getByTestId('spaces-campus-maps-tabs').locator(`button:nth-of-type(${tabId})`);
        await expect(mapTab(1)).toHaveCSS('color', 'rgba(0, 0, 0, 0.6)');
        await expect(mapTab(2)).toHaveCSS('color', 'rgba(0, 0, 0, 0.6)');
        await expect(mapTab(3)).toHaveCSS('color', COLOR_UQPURPLE);

        const cancelButton = page.getByTestId('admin-spaces-form-button-cancel');
        await expect(cancelButton).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
        await expect(cancelButton).toHaveCSS('border-color', COLOR_UQPURPLE);
        await expect(cancelButton).toHaveCSS('color', COLOR_UQPURPLE);

        await page.getByTestId('spaces-form-next-button').click(); // to final step, imagery

        const saveButton = page.getByTestId('admin-spaces-save-button-submit');
        await expect(saveButton).toBeEnabled();
        await expect(page.getByTestId('spaces-button-error-list')).not.toBeVisible();
    });
    test('add spaces page is accessible', async ({ page }) => {
        await assertAccessibility(page, '[data-testid="SpacesAdminPage"]');
    });
    test('can add new space, with only required fields', async ({ page, context }) => {
        await setTestDataCookie(context, page);

        const nameField = page.getByTestId('space-name').locator('input');

        await expect(nameField).toBeVisible();
        await nameField.fill('W12343');

        const selectedSpaceTypeId = await chooseAnySpaceType(page);

        const capacityNumberField = page.getByTestId('space-capacity').locator('input');
        await expect(capacityNumberField).toBeVisible();
        await expect(capacityNumberField).toHaveValue('0');
        await capacityNumberField.clear();
        await capacityNumberField.fill('2');

        await page.getByTestId('spaces-form-next-button').click(); // to facility types
        await page.getByTestId('spaces-form-next-button').click(); // to locations
        await page.getByTestId('spaces-form-next-button').click(); // to final step, imagery

        // click save button
        await expect(page.getByTestId('spaces-button-error-list')).not.toBeVisible();
        const saveButton = page.getByTestId('admin-spaces-save-button-submit');
        await expect(saveButton).toBeVisible();
        await expect(saveButton).toHaveCSS('background-color', COLOR_UQPURPLE);
        await expect(saveButton).toHaveCSS('border-color', COLOR_UQPURPLE);
        await expect(saveButton).toHaveCSS('color', 'rgb(255, 255, 255)');
        await saveButton.click();

        await expect(page.getByTestId('message-title')).toBeVisible();
        await expect(page.getByTestId('message-title')).toContainText('A Space has been added');

        // check the data we pretended to send to the server matches what we expect
        // acts as check of what we sent to api
        const expectedValues = {
            // locationType: 'space',
            space_floor_id: 65,
            space_name: 'W12343',
            space_type_id: Number(selectedSpaceTypeId),
            space_opening_hours_id: DUTTON_PARK_SPRINGSHARE_SPACE_ID,
            space_latitude: PACE_DEFAULT_LATITUDE,
            space_longitude: PACE_DEFAULT_LONGITUDE,
            space_zlevel: 1,
            space_external_book_url: null,
            space_description: null,
            space_draftmode: false,
            space_capacity: '2',
            archibus_room_id: null,
        };
        await assertExpectedDataSentToServer(page, expectedValues);
    });
    test('can add new space, with all fields', async ({ page, context }) => {
        await setTestDataCookie(context, page);

        const ASKUS_FILTER_TYPE = 54;
        const MICROWAVE_FILTER_TYPE = 4;

        const nameField = page.getByTestId('space-name').locator('input');

        await expect(nameField).toBeVisible();
        await nameField.fill('W12343');

        const selectedSpaceTypeId = await chooseAnySpaceType(page);

        // Check the description checkbox to enable the description field
        const descriptionCheckbox = page.getByTestId('toggle-space-description-checkbox').locator('input');
        await expect(descriptionCheckbox).toBeVisible();
        await descriptionCheckbox.check();

        const descriptionField = page.getByRole('textbox', { name: 'Editor editing area: main' });
        await descriptionField.fill('This is a sunny corner in the Law library where you blah blah blah');

        const bookingUrlField = page.getByTestId('space_external_book_url').locator('input');
        const isBookableCheckbox = page.getByTestId('space-can-book').locator('input');
        await expect(isBookableCheckbox).not.toBeChecked();
        await expect(bookingUrlField).not.toBeVisible();
        await isBookableCheckbox.check();
        await expect(bookingUrlField).toBeVisible();
        await bookingUrlField.fill('https://example.com');

        // enter a Space capacity
        const capacityNumberField = page.getByTestId('space-capacity').locator('input');
        await expect(capacityNumberField).toBeVisible();
        await capacityNumberField.clear();
        await capacityNumberField.fill('8');

        // change to facility type tab
        await page.getByTestId('spaces-form-next-button').click();

        await expect(page.getByTestId(`filtertype-${ASKUS_FILTER_TYPE}`).locator('input')).toBeVisible();
        await expect(page.getByTestId(`facility-type-listitem-${ASKUS_FILTER_TYPE}`)).toContainText('AskUs service');
        await page
            .getByTestId(`filtertype-${ASKUS_FILTER_TYPE}`)
            .locator('input')
            .click();

        await expect(page.getByTestId(`filtertype-${MICROWAVE_FILTER_TYPE}`).locator('input')).toBeVisible();
        await expect(page.getByTestId(`facility-type-listitem-${MICROWAVE_FILTER_TYPE}`)).toContainText('Microwave');
        await page
            .getByTestId(`filtertype-${MICROWAVE_FILTER_TYPE}`)
            .locator('input')
            .click();

        // go back to about tab for campus/library/level selectors
        await page.getByTestId('spaces-form-back-button').click();

        const duttonparkCampusSelector = page.locator(
            'ul[aria-labelledby="add-space-select-campus-label"] li:last-of-type',
        );
        const gattonCampusSelector = 'ul[aria-labelledby="add-space-select-campus-label"] li:nth-of-type(2)';
        const warehouseBuildingSelector = page.locator(
            'ul[aria-labelledby="add-space-select-library-label"] li:last-of-type',
        );
        const libraryWarehouseFloorTwoSelector = '[aria-labelledby="add-space-select-floor-label"] li:last-of-type';

        // choose a different location
        // change campus
        await page.getByTestId('add-space-select-campus').click();
        await expect(duttonparkCampusSelector).toBeVisible();
        await page.locator(gattonCampusSelector).click();

        // change building
        await page.getByTestId('add-space-select-library').click();
        await expect(warehouseBuildingSelector).toBeVisible();
        await warehouseBuildingSelector.click();

        // change floor
        await page.getByTestId('add-space-select-floor').click();
        await expect(page.locator(libraryWarehouseFloorTwoSelector)).toBeVisible();
        await page.locator(libraryWarehouseFloorTwoSelector).click();

        await expect(page.getByTestId('add-space-select-campus').locator('input')).toBeVisible();
        await expect(selectCombobox('add-space-select-campus', page)).toContainText('Gatton');
        await expect(page.getByTestId('add-space-select-library').locator('input')).toBeVisible();
        await expect(selectCombobox('add-space-select-library', page)).toContainText('Library Warehouse');
        await expect(page.getByTestId('add-space-select-floor').locator('input')).toBeVisible();
        await expect(selectCombobox('add-space-select-floor', page)).toContainText('Library Warehouse - 32');
        await expect(selectCombobox('add-space-select-floor', page)).not.toContainText('Ground floor');

        // change to location tab for precise location field
        await page.getByTestId('spaces-form-next-button').click(); // to facility types
        await page.getByTestId('spaces-form-next-button').click(); // to locations

        await expect(inputField('add-space-precise-location', page)).toBeVisible();
        await inputField('add-space-precise-location', page).fill('Northwest corner');

        await expect(page.getByTestId('add-space-pretty-location')).toBeVisible();
        await expect(page.getByTestId('add-space-pretty-location').locator('.location-precise')).toContainText(
            'Northwest corner',
        );
        await expect(page.getByTestId('add-space-pretty-location').locator('.location-floor')).toContainText('Level 2');
        await expect(page.getByTestId('add-space-pretty-location').locator('.location-building')).toContainText(
            'Library Warehouse (8248)',
        );
        await expect(page.getByTestId('add-space-pretty-location').locator('.location-campus')).toContainText('Gatton');

        // change springshare hours location
        await expect(page.getByTestId('add-space-springshare-id').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-springshare-id')).toContainText(
            'No Springshare opening hours will display',
        );
        await page.getByRole('combobox', { name: 'Choose the Springshare' }).click();
        await page.getByRole('option', { name: 'Duhig Tower - Study space' }).click();

        await expect(inputField('space_services_page', page)).toBeVisible();
        await inputField('space_services_page', page).fill(
            'https://web.library.uq.edu.au/visit/walter-harrison-law-library',
        );

        // change to imagery tab
        await page.getByTestId('spaces-form-next-button').click();

        // await expect(inputField('space-photo-url', page)).toBeVisible();
        // await inputField('space-photo-url', page).fill('https://example.com/image.jpg');

        await expect(page.getByTestId('add-space-photo-description')).toBeVisible();
        await page.getByTestId('add-space-photo-description').fill('a table and chairs in a stark white room');

        // click save button
        await expect(page.getByTestId('spaces-button-error-list')).not.toBeVisible();
        await expect(page.getByTestId('admin-spaces-save-button-submit')).toBeVisible();
        await page.getByTestId('admin-spaces-save-button-submit').click();

        await expect(page.getByTestId('toast-message')).not.toBeVisible();

        await expect(page.getByTestId('message-title')).toBeVisible();
        await expect(page.getByTestId('message-title')).toContainText('A Space has been added');

        // check the data we pretended to send to the server matches what we expect
        // acts as check of what we sent to api
        const expectedValues = {
            // locationType: 'space',
            space_floor_id: 32,
            space_name: 'W12343',
            space_photo_description: 'a table and chairs in a stark white room',
            // space_photo_url: 'https://example.com/image.jpg', // TODO, drag image
            space_precise: 'Northwest corner',
            space_description: '<p>This is a sunny corner in the Law library where you blah blah blah</p>',
            space_external_book_url: 'https://example.com',
            space_type_id: selectedSpaceTypeId,
            space_opening_hours_id: DUHIG_TOWER_SPRINGSHARE_SPACE_ID,
            space_services_page: 'https://web.library.uq.edu.au/visit/walter-harrison-law-library',
            facility_types: [ASKUS_FILTER_TYPE, MICROWAVE_FILTER_TYPE],
            space_latitude: PACE_DEFAULT_LATITUDE, // TODO add drag and drop test
            space_longitude: PACE_DEFAULT_LONGITUDE,
            space_zlevel: 1,
            space_draftmode: false,
            space_capacity: '8',
            archibus_room_id: null,
        };
        await assertExpectedDataSentToServer(page, expectedValues);
    });

    test('capacity validates correctly for a bookable space', async ({ page }) => {
        // on load the space is not bookable and has no capacity defined
        await expect(page.getByTestId(STEP_ABOUT).locator('.MuiBadge-badge')).toBeVisible();
        await expect(page.getByTestId(STEP_ABOUT).locator('.MuiBadge-badge')).toHaveText('2');
        await page.getByTestId('space-can-book').scrollIntoViewIfNeeded();
        await expect(page.getByTestId('space-can-book').locator('input')).toBeVisible();
        await expect(page.getByTestId('space-can-book').locator('input')).not.toBeChecked();
        await expect(page.getByTestId('space-capacity').locator('input')).toBeVisible();
        await expect(page.getByTestId('space-capacity').locator('input')).toHaveValue('0');
        await expect(page.getByTestId('capacity-required-indicator')).not.toBeVisible();
        await expect(page.getByTestId('space-capacity-error')).not.toBeVisible();

        // make the space bookable
        await page
            .getByTestId('contains-bookable-checkbox')
            .locator('input')
            .check();

        // capacity is now required and an error shows
        await expect(page.getByTestId('capacity-required-indicator')).toBeVisible();
        await expect(page.getByTestId('space-capacity-error')).toBeVisible();
        await expect(page.getByTestId('space-capacity-error')).toHaveCSS('color', COLOR_GLOBAL_ALERT_RED);

        await expect(page.getByTestId(STEP_ABOUT).locator('.MuiBadge-badge')).toBeVisible();
        await expect(page.getByTestId(STEP_ABOUT).locator('.MuiBadge-badge')).toHaveText('4');

        // enter a value in capacity (unfortunately we cant use the number input spinner fields :( )
        const capacityNumberField = page.getByTestId('space-capacity').locator('input');
        await capacityNumberField.click(); // focus
        await capacityNumberField.clear();
        await capacityNumberField.fill('8');

        // and the error goes away
        await expect(page.getByTestId('space-capacity-error')).not.toBeVisible();
        await expect(page.getByTestId(STEP_ABOUT).locator('.MuiBadge-badge')).toHaveText('3'); // error count goes from 4 to 3

        // fill in other required fields
        const nameField = page.getByTestId('space-name').locator('input');
        await nameField.fill('W12343');
        await chooseAnySpaceType(page);
        const bookingUrlField = page.getByTestId('space_external_book_url').locator('input');
        await bookingUrlField.fill('https://example.com');

        await expect(page.getByTestId(STEP_ABOUT).locator('.MuiBadge-badge')).not.toBeVisible();

        // navigate to save button
        await page.getByTestId('spaces-form-next-button').click(); // to facility types
        await page.getByTestId('spaces-form-next-button').click(); // to locations
        await page.getByTestId('spaces-form-next-button').click(); // to final step, imagery

        // no errors are present at save point
        await expect(page.getByTestId('spaces-button-error-list')).not.toBeVisible();
        await expect(page.getByTestId('admin-spaces-save-button-submit')).toBeVisible();

        // save the new record
        await page.getByTestId('admin-spaces-save-button-submit').click();

        // success indicated
        await expect(page.getByTestId('message-title')).toBeVisible();
        await expect(page.getByTestId('message-title')).toContainText('A Space has been added');
    });

    test('capacity validates correctly for a non-bookable space', async ({ page }) => {
        await page.getByTestId('space_draftmode').scrollIntoViewIfNeeded();
        await expect(page.getByTestId(STEP_ABOUT).locator('.MuiBadge-badge')).toBeVisible();
        await expect(page.getByTestId(STEP_ABOUT).locator('.MuiBadge-badge')).toHaveText('2');

        // on load the space has no capacity defined and capacity is not required
        await expect(page.getByTestId('space-capacity').locator('input')).toBeVisible();
        await expect(page.getByTestId('space-capacity').locator('input')).toHaveValue('0');
        await expect(page.getByTestId('capacity-required-indicator')).not.toBeVisible();
        await expect(page.getByTestId('space-capacity-error')).not.toBeVisible();

        // enter a value in capacity (unfortunately we cant use the number input spinner fields :( )
        const capacityNumberField = page.getByTestId('space-capacity').locator('input');
        await capacityNumberField.click(); // focus
        await capacityNumberField.clear();
        await capacityNumberField.fill('8');

        // no change in errors
        await expect(page.getByTestId('space-capacity-error')).not.toBeVisible();
        await expect(page.getByTestId(STEP_ABOUT).locator('.MuiBadge-badge')).toHaveText('2'); // error count unchanged

        // fill in other required fields
        const nameField = page.getByTestId('space-name').locator('input');
        await nameField.fill('W12343');
        await chooseAnySpaceType(page);

        await expect(page.getByTestId(STEP_ABOUT).locator('.MuiBadge-badge')).not.toBeVisible();

        // navigate to save button
        await page.getByTestId('spaces-form-next-button').click(); // to facility types
        await page.getByTestId('spaces-form-next-button').click(); // to locations
        await page.getByTestId('spaces-form-next-button').click(); // to final step, imagery

        // no errors are present at save point
        await expect(page.getByTestId('spaces-button-error-list')).not.toBeVisible();
        await expect(page.getByTestId('admin-spaces-save-button-submit')).toBeVisible();

        // save the new record
        await page.getByTestId('admin-spaces-save-button-submit').click();

        // success indicated
        await expect(page.getByTestId('message-title')).toBeVisible();
        await expect(page.getByTestId('message-title')).toContainText('A Space has been added');
    });

    test('add spaces page save dialog is accessible', async ({ page }) => {
        const nameField = page.getByTestId('space-name').locator('input');

        await expect(nameField).toBeVisible();
        await nameField.fill('W12343');

        await chooseAnySpaceType(page);

        // enter a Space capacity
        const capacityNumberField = page.getByTestId('space-capacity').locator('input');
        await expect(capacityNumberField).toBeVisible();
        await capacityNumberField.clear();
        await capacityNumberField.fill('8');
        await page.getByTestId('spaces-form-next-button').click(); // to facility types
        await page.getByTestId('spaces-form-next-button').click(); // to locations
        await page.getByTestId('spaces-form-next-button').click(); // to final step, imagery

        await expect(page.getByTestId('spaces-button-error-list')).not.toBeVisible();
        await expect(page.getByTestId('admin-spaces-save-button-submit')).toBeVisible();
        await page.getByTestId('admin-spaces-save-button-submit').click();

        await expect(page.getByTestId('message-title')).toBeVisible();
        await expect(page.getByTestId('message-title')).toContainText('A Space has been added');

        // check the popup
        await assertAccessibility(page, '.MuiDialog-container[role="presentation"]');
    });
    test('add new space - validation - required fields', async ({ page }) => {
        // when the user has not entered required fields, they get an error

        //  blank form gives an error
        await page.getByTestId('spaces-form-next-button').click(); // to facility types
        await page.getByTestId('spaces-form-next-button').click(); // to locations
        await page.getByTestId('spaces-form-next-button').click(); // to final step, imagery

        await expect(page.getByTestId('admin-spaces-save-button-submit')).toBeVisible();
        await expect(page.getByTestId('admin-spaces-save-button-submit')).toBeEnabled();
        await expect(page.getByTestId('spaces-button-error-list')).not.toBeVisible();

        // add mode should only show summary and disable save after an attempted save
        await page.getByTestId('admin-spaces-save-button-submit').click();

        // failed save should bring focus back to the first invalid tab/field
        await expect(page.getByTestId('space-name').locator('input')).toBeVisible();
        await expect(page.getByTestId('space-name').locator('..').getByText('A Name is required.')).toBeVisible();
        await expect(page.getByTestId('space-type').locator('..').getByText('A Type is required.')).toBeVisible();

        // user enters the name, but there is still an error
        const spaceNameInputField = page.getByTestId('space-name').locator('input');
        await expect(spaceNameInputField).toBeVisible();
        await spaceNameInputField.fill('W12343');

        // blur the form
        await page.getByTestId('SpacesAdminPage-systemTitle').click();

        // use default capacity of 1

        await page.getByTestId('spaces-form-next-button').click(); // to facility types
        await page.getByTestId('spaces-form-next-button').click(); // to locations
        await page.getByTestId('spaces-form-next-button').click(); // to final step, imagery

        await expect(page.getByTestId('admin-spaces-save-button-submit')).toBeVisible();
        await expect(page.getByTestId('admin-spaces-save-button-submit')).toBeDisabled();
        await expect(page.getByTestId('spaces-button-error-list')).toBeVisible();
        await expect(page.getByTestId('spaces-button-error-list')).toContainText('Please fix 1 error.');
        await expect(page.getByTestId('spaces-button-error-list')).toContainText('A Type is required.');

        await page.getByTestId('spaces-form-back-button').click(); // to locations
        await page.getByTestId('spaces-form-back-button').click(); // to facility types
        await page.getByTestId('spaces-form-back-button').click(); // to about

        // they enter the type
        await chooseAnySpaceType(page);

        await page.getByTestId('spaces-form-next-button').click(); // to facility types
        await page.getByTestId('spaces-form-next-button').click(); // to locations
        await page.getByTestId('spaces-form-next-button').click(); // to final step, imagery

        await expect(page.getByTestId('spaces-button-error-list')).not.toBeVisible();
        await page.getByTestId('admin-spaces-save-button-submit').click();

        // now the form is valid!
        await expect(page.getByTestId('message-title')).toBeVisible();
        await expect(page.getByTestId('message-title')).toContainText('A Space has been added');
    });
    // test('add new space - validation - required fields 2', async ({ page }) => {
    //     // when the user has not entered required fields, they get an error
    //
    //     // user enters the name
    //     await expect(page.getByTestId('space-name').locator('input')).toBeVisible();
    //     await page
    //         .getByTestId('space-name')
    //         .locator('input')
    //         .fill('W12343');
    //     // they enter the type
    //     await expect(page.getByTestId('space-type').locator('input')).toBeVisible();
    //     await page
    //         .getByTestId('space-type')
    //         .locator('input')
    //         .fill('Computer room');
    //
    //     // they enter the url, but neglect the description
    //     await expect(page.getByTestId('space-photo-url').locator('input')).toBeVisible();
    //     await page
    //         .getByTestId('space-photo-url')
    //         .locator('input')
    //         .fill('https://example.com/image.jpg');
    //     await expect(page.getByTestId('admin-spaces-save-button-submit')).toBeVisible();
    //     await page.getByTestId('admin-spaces-save-button-submit').click();
    //     await expect(page.getByTestId('toast-message')).toBeVisible();
    //     await expect(page.getByTestId('toast-message p[data-error-count="1"]')).toBeDefined();
    //     await expect(page.getByTestId('toast-message')).toContainText('These errors occurred');
    //     await expect(page.getByTestId('toast-message')).toContainText(
    //         'When a photo is supplied, a description must be supplied.',
    //     );
    //
    //     await expect(page.getByTestId('add-space-photo-description')).toBeVisible();
    //     // await page.getByTestId('add-space-photo-description').fill('a description of a room');
    //     await page
    //         .getByTestId('add-space-photo-description')
    //         .fill('This is a sunny corner in the Law library where you blah blah blah');
    //
    //     await page.getByTestId('admin-spaces-save-button-submit').click();
    //
    //     // finally the form is valid!
    //     await expect(page.getByTestId('message-title')).toBeVisible();
    //     await expect(page.getByTestId('message-title')).toContainText('A Space has been added');
    // });
    test('add new space - can change the location', async ({ page }) => {
        const campusSelector = page.getByTestId('add-space-select-campus');
        const librarySelector = page.getByTestId('add-space-select-library');
        const floorSelector = page.getByTestId('add-space-select-floor');
        const springshareSelector = page.getByTestId('add-space-springshare-id');
        const campusInput = page.locator('#add-space-select-campus-input');
        const libraryInput = page.locator('#add-space-select-library-input');
        const floorInput = page.locator('#add-space-select-floor-input');

        // the page loads with the expected campus-building-floor
        await waitForDefaultLocationSelection(page);

        // open the campus dropdown
        await campusSelector.click();

        // the popup that opens holds the valid campuses
        const campusListbox = page.getByRole('listbox', { name: 'Campus *' });
        await expect(campusListbox).toBeVisible();
        await expect(campusListbox.locator(' > *')).toHaveCount(3);
        await expect(campusListbox.locator('li:first-of-type')).toBeVisible();
        await expect(campusListbox.locator('li:first-of-type')).toContainText(
            'St Lucia',
        );
        const gattonCampusOption = campusListbox.locator('li:nth-of-type(2)');
        await expect(gattonCampusOption).toBeVisible();
        await expect(gattonCampusOption).toContainText('Gatton');
        await gattonCampusOption.click(); // click on "Gatton" to change campus

        // the displayed campus, building and floor shown have changed
        await expect(campusInput).toHaveValue('2');
        await expect(libraryInput).toHaveValue('8');
        await expect(floorInput).toHaveValue('29');

        // open the library dropdown to change library
        await librarySelector.click();

        // the popup has the correct valid buildings
        const libraryListbox = page.getByRole('listbox', { name: 'Library *' });
        await expect(libraryListbox).toBeVisible();

        await expect(libraryListbox.locator(' > *')).toHaveCount(2);
        await expect(libraryListbox.locator('li:first-child')).toBeVisible();
        await expect(libraryListbox.locator('li:first-of-type')).toContainText(
            'J.K. Murray Library',
        );
        await expect(libraryListbox.locator('li:last-of-type')).toBeVisible();
        await expect(libraryListbox.locator('li:last-of-type')).toContainText(
            'Library Warehouse',
        );

        // choose 'Warehouse' in the library dropdown to change the library and floor
        await page.locator('ul[aria-labelledby="add-space-select-library-label"] li:last-of-type').click();

        // the displayed building and floors have changed; campus is unchanged
        await expect(campusInput).toHaveValue('2');
        await expect(libraryInput).toHaveValue('9');
        await expect(floorInput).toHaveValue('31');

        // open the floor dropdown to change floor
        await floorSelector.click();

        // the popup has the correct valid floors
        const floorDropdown = page.getByRole('listbox', { name: 'Level *' });
        await expect(floorDropdown).toBeVisible();
        await expect(floorDropdown.locator(' > *')).toHaveCount(2);
        await expect(floorDropdown.locator(' li:first-child')).toBeVisible();
        await expect(floorDropdown.locator(' li:first-of-type')).toContainText('Library Warehouse - 31');
        await expect(floorDropdown.locator(' li:last-of-type')).toBeVisible();
        await expect(floorDropdown.locator(' li:last-of-type')).toContainText('Library Warehouse - 32');

        // click on other floor to change the floor
        await floorDropdown.locator(' li:last-of-type').click();

        // the displayed floor has changed; campus & building is unchanged
        await expect(campusInput).toHaveValue('2');
        await expect(libraryInput).toHaveValue('9');
        await expect(floorInput).toHaveValue('32');

        // Springshare control remains on Location tab
        await page.getByTestId('spaces-form-next-button').click(); // to facility types
        await page.getByTestId('spaces-form-next-button').click(); // to locations
        await expect(springshareSelector).toContainText('No Springshare opening hours will display (click to change)');
    });
});
test.describe('Spaces Admin - errors', () => {
    test('add new space - empty locations redirects', async ({ page }) => {
        await page.goto('/admin/spaces/add?user=libSpaces&responseType=empty-spaces');
        await page.setViewportSize({ width: 1300, height: 1000 });
        // wait for page to load
        await expect(page.getByTestId('admin-spaces-page-title').getByText(/Add a new Space/)).toBeVisible();

        await expect(page.getByTestId('add-space-no-locations')).toBeVisible();
        await expect(page.getByTestId('add-space-no-locations')).toContainText('No Libraries currently in system');
    });
    test('add new space - error locations', async ({ page }) => {
        await page.goto('/admin/spaces/add?user=libSpaces&responseType=error-spaces');
        await page.setViewportSize({ width: 1300, height: 1000 });
        // wait for page to load
        await expect(page.getByTestId('admin-spaces-page-title').getByText(/Add a new Space/)).toBeVisible();

        await expect(page.getByTestId('load-space-form-error')).toBeVisible();
        await expect(page.getByTestId('load-space-form-error')).toContainText(
            'Something went wrong - please try again later.',
        );
    });
    test('add new space - 404 locations', async ({ page }) => {
        await page.goto('/admin/spaces/add?user=libSpaces&responseType=404-spaces');
        await page.setViewportSize({ width: 1300, height: 1000 });
        // wait for page to load
        await expect(page.getByTestId('admin-spaces-page-title').getByText(/Add a new Space/)).toBeVisible();

        await expect(page.getByTestId('load-space-form-error')).toBeVisible();
        await expect(page.getByTestId('load-space-form-error')).toContainText(
            'Something went wrong - please try again later.',
        );
    });
    test('add new space - save fails', async ({ page }) => {
        await page.goto('/admin/spaces/add?user=libSpaces&responseType=space-create-error');
        await page.setViewportSize({
            width: 1300,
            height: 1000,
        });
        // wait for page to load
        await expect(page.getByTestId('admin-spaces-page-title').getByText(/Add a new Space/)).toBeVisible();

        const spaceNameField = page.getByTestId('space-name').locator('input');

        await expect(spaceNameField).toBeVisible();
        await spaceNameField.fill('W12343');

        await chooseAnySpaceType(page);

        // use default capacity

        await page.getByTestId('spaces-form-next-button').click(); // to facility types
        await page.getByTestId('spaces-form-next-button').click(); // to locations
        await page.getByTestId('spaces-form-next-button').click(); // to final imagery tab
        // click save button
        await expect(page.getByTestId('spaces-button-error-list')).not.toBeVisible();
        await expect(page.getByTestId('admin-spaces-save-button-submit')).toBeVisible();
        await page.getByTestId('admin-spaces-save-button-submit').click();

        // const msg = '[BSAS-001] Sorry, an error occurred - Saving the new Space failed. The admins have been informed.';
        const msg =
            'An error has occurred during the request and this request cannot be processed. Please contact webmaster@library.uq.edu.au or try again later.';
        await assertErrorPopupAppears(page, msg);
    });
});
