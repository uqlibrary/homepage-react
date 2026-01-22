import { expect, Page, test } from '@uq/pw/test';
import { assertAccessibility } from '@uq/pw/lib/axe';
import { assertExpectedDataSentToServer, setTestDataCookie } from '@uq/pw/lib/helpers';

import { COLOR_UQPURPLE } from '@uq/pw/lib/constants';
import { assertErrorPopupAppears } from '@uq/pw/tests/adminPages/spaces/spacesTestHelper';

const inputField = (fieldName: string, page: Page) => page.getByTestId(fieldName).locator('input');

const STEP_ABOUT = 'tab-about';
const STEP_FACILITY_TYPES = 'tab-facility-types';
const STEP_LOCATION_HOURS = 'tab-location-hours';
const STEP_IMAGERY = 'tab-imagery';

const ST_LUCIA_DEFAULT_LATITUDE = '-27.49751';
const ST_LUCIA_DEFAULT_LONGITUDE = '153.01329';

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
        await expect(page.getByTestId('add-space-type-new').locator('input')).toBeVisible();

        await expect(page.getByTestId('add-space-select-campus').locator('input')).not.toBeVisible();

        // change to location tab
        await page.getByTestId('spaces-form-next-button').click(); // to facility types
        await page.getByTestId('spaces-form-next-button').click(); // to locations

        await expect(page.getByTestId('add-space-select-campus').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-select-campus')).toContainText('PACE');
        await expect(page.getByTestId('add-space-select-library').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-select-library')).toContainText(
            'Pharmacy Australia Centre of Excellence',
        );
        await expect(page.getByTestId('add-space-select-floor').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-select-floor')).toContainText(
            'Pharmacy Australia Centre of Excellence - 65',
        );
        await expect(page.getByTestId('add-space-precise-location').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-pretty-location')).toBeVisible();
        await expect(page.getByTestId('add-space-pretty-location')).toContainText('6th Floor');
        await expect(page.getByTestId('add-space-pretty-location')).toContainText(
            'Pharmacy Australia Centre of Excellence',
        );
        await expect(page.getByTestId('add-space-pretty-location')).toContainText(
            'Pharmacy Australia Centre of Excellence (Building 870)',
        );
        await expect(page.getByTestId('add-space-pretty-location')).toContainText('PACE Campus');
        await expect(page.getByTestId('add-space-springshare-id')).toContainText('Dutton Park Health Sciences');

        const mapTab = (tabId: number) =>
            page.getByTestId('spaces-campus-maps-tabs').locator(`button:nth-of-type(${tabId})`);
        await expect(mapTab(1)).toHaveCSS('color', 'rgba(0, 0, 0, 0.6)');
        await expect(mapTab(2)).toHaveCSS('color', COLOR_UQPURPLE);
        await expect(mapTab(3)).toHaveCSS('color', 'rgba(0, 0, 0, 0.6)');

        const cancelButton = page.getByTestId('admin-spaces-form-button-cancel');
        await expect(cancelButton).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
        await expect(cancelButton).toHaveCSS('border-color', COLOR_UQPURPLE);
        await expect(cancelButton).toHaveCSS('color', COLOR_UQPURPLE);

        await page.getByTestId('spaces-form-next-button').click(); // to final step, imagery

        const saveButton = page.getByTestId('admin-spaces-save-button-submit');
        await expect(saveButton).toBeDisabled();
    });
    test('add spaces page is accessible', async ({ page }) => {
        await assertAccessibility(page, '[data-testid="SpacesAdminPage"]');
    });
    test('can add new space, with only required fields', async ({ page, context }) => {
        await setTestDataCookie(context, page);

        await expect(page.getByTestId('space-name').locator('input')).toBeVisible();
        await page
            .getByTestId('space-name')
            .locator('input')
            .fill('W12343');
        await expect(page.getByTestId('space-type').locator('input')).toBeVisible();
        await page
            .getByTestId('space-type')
            .locator('input')
            .fill('Computer room');

        await page.getByTestId('spaces-form-next-button').click(); // to facility types
        await page.getByTestId('spaces-form-next-button').click(); // to locations
        await page.getByTestId('spaces-form-next-button').click(); // to final step, imagery

        // blur the form
        await page.getByTestId('SpacesAdminPage-systemTitle').click();

        // click save button
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
            space_type: 'Computer room',
            space_opening_hours_id: 3967,
            space_latitude: ST_LUCIA_DEFAULT_LATITUDE,
            space_longitude: ST_LUCIA_DEFAULT_LONGITUDE,
        };
        await assertExpectedDataSentToServer(page, expectedValues);
    });
    test('can add new space, with all fields', async ({ page, context }) => {
        await setTestDataCookie(context, page);

        const ASKUS_FILTER_TYPE = 54;
        const MICROWAVE_FILTER_TYPE = 4;

        await expect(inputField('space-name', page)).toBeVisible();
        await inputField('space-name', page).fill('W12343');
        await expect(inputField('space-type', page)).toBeVisible();
        await inputField('space-type', page).fill('Computer room');

        await expect(page.getByTestId('add-space-description')).toBeVisible();
        await page
            .getByTestId('add-space-description')
            .fill('This is a sunny corner in the Law library where you blah blah blah');

        // blur the form
        await page.getByTestId('SpacesAdminPage-systemTitle').click();

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

        // change to location tab
        await page.getByTestId('spaces-form-next-button').click(); // locations tab

        // choose a different location
        // change campus
        await page.getByTestId('add-space-select-campus').click();
        await expect(page.locator('ul[aria-labelledby="add-space-select-campus-label"] li:last-of-type')).toBeVisible();
        await page.locator('ul[aria-labelledby="add-space-select-campus-label"] li:nth-of-type(2)').click();

        // change building
        await page.getByTestId('add-space-select-library').click();
        await expect(
            page.locator('ul[aria-labelledby="add-space-select-library-label"] li:last-of-type'),
        ).toBeVisible();
        await page.locator('ul[aria-labelledby="add-space-select-library-label"] li:last-of-type').click();

        // change floor
        await page.getByTestId('add-space-select-floor').click();
        await expect(page.locator('[aria-labelledby="add-space-select-floor-label"] li:last-of-type')).toBeVisible();
        await page.locator('[aria-labelledby="add-space-select-floor-label"] li:last-of-type').click();

        await expect(page.getByTestId('add-space-select-campus').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-select-campus')).toContainText('Gatton');
        await expect(page.getByTestId('add-space-select-library').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-select-library')).toContainText('Library Warehouse');
        await expect(page.getByTestId('add-space-select-floor').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-select-floor')).toContainText('Library Warehouse - 32');
        await expect(page.getByTestId('add-space-select-floor')).not.toContainText('Ground floor');
        await expect(inputField('add-space-precise-location', page)).toBeVisible();
        await inputField('add-space-precise-location', page).fill('Northwest corner');

        await expect(page.getByTestId('add-space-pretty-location')).toBeVisible();
        await expect(page.getByTestId('add-space-pretty-location')).toContainText('Northwest corner, 2nd Floor');
        await expect(page.getByTestId('add-space-pretty-location')).toContainText('Library Warehouse');
        await expect(page.getByTestId('add-space-pretty-location')).toContainText('Gatton Campus');

        // change springshare hours location
        await expect(page.getByTestId('add-space-springshare-id').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-springshare-id')).toContainText(
            'No Springshare opening hours will display',
        );
        await await page
            .getByRole('combobox', {
                name: 'Choose the Springshare',
            })
            .click();
        await page
            .getByRole('option', {
                name: 'Dorothy Hill Engineering',
            })
            .click();

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
            space_description: 'This is a sunny corner in the Law library where you blah blah blah',
            space_type: 'Computer room',
            space_opening_hours_id: 3825, // dhesl
            space_services_page: 'https://web.library.uq.edu.au/visit/walter-harrison-law-library',
            facility_types: [ASKUS_FILTER_TYPE, MICROWAVE_FILTER_TYPE],
            space_latitude: ST_LUCIA_DEFAULT_LATITUDE, // TODO add drag and drop test
            space_longitude: ST_LUCIA_DEFAULT_LONGITUDE,
        };
        await assertExpectedDataSentToServer(page, expectedValues);
    });

    test('add spaces page save dialog is accessible', async ({ page }) => {
        await expect(page.getByTestId('space-name').locator('input')).toBeVisible();
        await page
            .getByTestId('space-name')
            .locator('input')
            .fill('W12343');
        await expect(page.getByTestId('space-type').locator('input')).toBeVisible();
        await page
            .getByTestId('space-type')
            .locator('input')
            .fill('Computer room');

        await page.getByTestId('spaces-form-next-button').click(); // to facility types
        await page.getByTestId('spaces-form-next-button').click(); // to locations
        await page.getByTestId('spaces-form-next-button').click(); // to final step, imagery

        await expect(page.getByTestId('admin-spaces-save-button-submit')).toBeVisible();
        await page.getByTestId('admin-spaces-save-button-submit').click();

        await expect(page.getByTestId('message-title')).toBeVisible();
        await expect(page.getByTestId('message-title')).toContainText('A Space has been added');

        await assertAccessibility(page, '[aria-labelledby=":r7:"]');
    });
    test('add new space - validation - required fields 1', async ({ page }) => {
        // when the user has not entered required fields, they get an error

        //  blank form gives an error
        await page.getByTestId('spaces-form-next-button').click(); // to facility types
        await page.getByTestId('spaces-form-next-button').click(); // to locations
        await page.getByTestId('spaces-form-next-button').click(); // to final step, imagery

        await expect(page.getByTestId('admin-spaces-save-button-submit')).toBeVisible();
        await expect(page.getByTestId('admin-spaces-save-button-submit')).toBeDisabled();
        // await page.getByTestId('admin-spaces-save-button-submit').click();
        await expect(page.getByTestId('spaces-button-error-list')).toBeVisible();
        await expect(page.getByTestId('spaces-button-error-list').locator('[data-error-count="2"]')).toBeDefined();
        await expect(page.getByTestId('spaces-button-error-list')).toContainText('These errors occurred');
        await expect(page.getByTestId('spaces-button-error-list')).toContainText('A Name is required.');
        await expect(page.getByTestId('spaces-button-error-list')).toContainText('A Type is required.');

        await page.getByTestId('spaces-form-back-button').click(); // to locations
        await page.getByTestId('spaces-form-back-button').click(); // to facility types
        await page.getByTestId('spaces-form-back-button').click(); // to about

        // user enters the name, but there is still an error
        const spaceNameInputField = page.getByTestId('space-name').locator('input');
        await expect(spaceNameInputField).toBeVisible();
        await spaceNameInputField.fill('W12343');

        // blur the form
        await page.getByTestId('SpacesAdminPage-systemTitle').click();

        await page.getByTestId('spaces-form-next-button').click(); // to facility types
        await page.getByTestId('spaces-form-next-button').click(); // to locations
        await page.getByTestId('spaces-form-next-button').click(); // to final step, imagery

        await expect(page.getByTestId('admin-spaces-save-button-submit')).toBeVisible();
        await expect(page.getByTestId('admin-spaces-save-button-submit')).toBeDisabled();
        await expect(page.getByTestId('spaces-button-error-list')).toBeVisible();
        await expect(page.getByTestId('spaces-button-error-list').locator('[data-error-count="1"]')).toBeDefined();
        await expect(page.getByTestId('spaces-button-error-list')).toContainText('These errors occurred');
        await expect(page.getByTestId('spaces-button-error-list')).toContainText('A Type is required.');
        // await expect(page.getByTestId('spaces-button-error-list')).not.toBeVisible(); // wait for it to close

        await page.getByTestId('spaces-form-back-button').click(); // to locations
        await page.getByTestId('spaces-form-back-button').click(); // to facility types
        await page.getByTestId('spaces-form-back-button').click(); // to about

        // they enter the type
        await expect(page.getByTestId('space-type').locator('input')).toBeVisible();
        await page
            .getByTestId('space-type')
            .locator('input')
            .fill('Computer room');

        await page.getByTestId('spaces-form-next-button').click(); // to facility types
        await page.getByTestId('spaces-form-next-button').click(); // to locations
        await page.getByTestId('spaces-form-next-button').click(); // to final step, imagery

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
        const aboutPageInputField = page.getByTestId('add-space-about-page');

        // change to location tab
        await page.getByTestId('spaces-form-next-button').click(); // to facility types
        await page.getByTestId('spaces-form-next-button').click(); // to locations

        // the page loads with the expected campus-building-floor
        await expect(campusSelector.locator('input')).toBeVisible();
        await expect(campusSelector).toContainText('PACE');
        await expect(librarySelector.locator('input')).toBeVisible();
        await expect(librarySelector).toContainText('Pharmacy Australia Centre of Excellence');
        await expect(floorSelector.locator('input')).toBeVisible();
        await expect(floorSelector).toContainText('Pharmacy Australia Centre of Excellence - 65');
        await expect(springshareSelector).toContainText('Dutton Park Health Sciences');

        await expect(aboutPageInputField).toContainText(
            'https://web.library.uq.edu.au/visit/dutton-park-health-sciences-library',
        );

        await page
            .getByRole('combobox', {
                name: 'Choose the Springshare',
            })
            .click();
        await page
            .getByRole('option', {
                name: 'Dorothy Hill Engineering',
            })
            .click();

        // open the campus dropdown
        campusSelector.click();

        // the popup that opens holds the valid campuses
        await expect(page.locator('[aria-labelledby="add-space-select-campus-label"]')).toBeVisible();
        await expect(page.locator('[aria-labelledby="add-space-select-campus-label"]').locator(' > *')).toHaveCount(3);
        await expect(page.locator('[aria-labelledby="add-space-select-campus-label"] li:first-of-type')).toBeVisible();
        await expect(page.locator('[aria-labelledby="add-space-select-campus-label"] li:first-of-type')).toContainText(
            'St Lucia',
        );
        const gattonCampusOption = page.locator('[aria-labelledby="add-space-select-campus-label"] li:nth-of-type(2)');
        await expect(gattonCampusOption).toBeVisible();
        await expect(gattonCampusOption).toContainText('Gatton');
        gattonCampusOption.click(); // click on "Gatton" to change campus

        // the displayed campus, building and floor shown have changed
        await expect(campusSelector.locator('input')).toBeVisible();
        await expect(campusSelector).toContainText('Gatton');
        await expect(librarySelector.locator('input')).toBeVisible();
        await expect(librarySelector).toContainText('J.K. Murray Library');
        await expect(floorSelector.locator('input')).toBeVisible();
        await expect(floorSelector).toContainText('J.K. Murray Library - 29');
        await expect(floorSelector).toContainText('Ground floor');
        await expect(springshareSelector).toContainText('JK Murray');

        await expect(aboutPageInputField).toContainText(
            'https://web.library.uq.edu.au/visit/jk-murray-library-uq-gatton',
        );

        // open the library dropdown to change library
        librarySelector.click();

        // the popup has the correct valid buildings
        await expect(page.locator('[aria-labelledby="add-space-select-library-label"]')).toBeVisible();

        await expect(page.locator('[aria-labelledby="add-space-select-library-label"]').locator(' > *')).toHaveCount(2);
        await expect(page.locator('[aria-labelledby="add-space-select-library-label"] li:first-child')).toBeVisible();
        await expect(page.locator('[aria-labelledby="add-space-select-library-label"] li:first-of-type')).toContainText(
            'J.K. Murray Library',
        );
        await expect(page.locator('[aria-labelledby="add-space-select-library-label"] li:last-of-type')).toBeVisible();
        await expect(page.locator('[aria-labelledby="add-space-select-library-label"] li:last-of-type')).toContainText(
            'Library Warehouse',
        );

        // choose 'Warehouse' in the library dropdown to change the library and floor
        await page.locator('ul[aria-labelledby="add-space-select-library-label"] li:last-of-type').click();

        // the displayed building and floors have changed; campus is unchanged
        await expect(campusSelector.locator('input')).toBeVisible();
        await expect(campusSelector).toContainText('Gatton');
        await expect(librarySelector.locator('input')).toBeVisible();
        await expect(librarySelector).toContainText('Library Warehouse');
        await expect(floorSelector.locator('input')).toBeVisible();
        await expect(floorSelector).toContainText('Library Warehouse - 31');
        await expect(floorSelector).not.toContainText('Ground floor');

        await expect(aboutPageInputField).toContainText('none');
        await expect(springshareSelector).toContainText('No Springshare opening hours will display');

        // open the floor dropdown to change floor
        floorSelector.click();

        // the popup has the correct valid floors
        const floorDropdown = page.locator('[aria-labelledby="add-space-select-floor-label"]');
        await expect(floorDropdown).toBeVisible();
        await expect(floorDropdown.locator(' > *')).toHaveCount(2);
        await expect(floorDropdown.locator(' li:first-child')).toBeVisible();
        await expect(floorDropdown.locator(' li:first-of-type')).toContainText('Library Warehouse - 31');
        await expect(floorDropdown.locator(' li:last-of-type')).toBeVisible();
        await expect(floorDropdown.locator(' li:last-of-type')).toContainText('Library Warehouse - 32');

        // click on other floor to change the floor
        floorDropdown.locator(' li:last-of-type').click();

        // the displayed floor has changed; campus & building is unchanged
        await expect(campusSelector.locator('input')).toBeVisible();
        await expect(campusSelector).toContainText('Gatton');
        await expect(librarySelector.locator('input')).toBeVisible();
        await expect(librarySelector).toContainText('Library Warehouse');
        await expect(floorSelector.locator('input')).toBeVisible();
        await expect(floorSelector).toContainText('Library Warehouse - 32');
        await expect(floorSelector).not.toContainText('Ground floor');

        await expect(aboutPageInputField).toContainText('none');
        await expect(springshareSelector).toContainText('No Springshare opening hours will display (click to change)');

        // test we can change it twice

        // open the building dropdown to change building
        librarySelector.click();

        // the popup has the correct valid buildings
        await expect(page.locator('[aria-labelledby="add-space-select-library-label"]')).toBeVisible();
        await expect(page.locator('[aria-labelledby="add-space-select-library-label"]').locator(' > *')).toHaveCount(2);
        await expect(page.locator('ul[aria-labelledby="add-space-select-library-label"] li:first-child')).toBeVisible();
        await page.locator('ul[aria-labelledby="add-space-select-library-label"] li:first-of-type').click();

        // open the campus dropdown
        campusSelector.click();

        // the popup that opens holds the valid campuses
        await expect(page.locator('[aria-labelledby="add-space-select-campus-label"]')).toBeVisible();
        await expect(page.locator('[aria-labelledby="add-space-select-campus-label"]').locator(' > *')).toHaveCount(3);

        // click on "St Lucia" to change campus
        await page.locator('ul[aria-labelledby="add-space-select-campus-label"] li:first-of-type').click();

        // the displayed campus, building and floor shown have changed
        await expect(campusSelector.locator('input')).toBeVisible();
        await expect(campusSelector).toContainText('St Lucia');
        await expect(librarySelector.locator('input')).toBeVisible();
        await expect(librarySelector).toContainText('Walter Harrison Law Library');
        await expect(floorSelector.locator('input')).toBeVisible();
        await expect(floorSelector).toContainText('Walter Harrison Law Library - 1');

        await expect(aboutPageInputField).toContainText(
            'https://web.library.uq.edu.au/visit/walter-harrison-law-library',
        );
        await expect(springshareSelector).toContainText('Walter Harrison Law');

        // open the building dropdown to change building
        librarySelector.click();

        // the popup has the correct valid buildings
        await expect(page.locator('[aria-labelledby="add-space-select-library-label"]')).toBeVisible();
        await expect(page.locator('[aria-labelledby="add-space-select-library-label"]').locator(' > *')).toHaveCount(4);

        // click on 'Central' Library to change the building and floor
        const centralLibraryOption = page.locator(
            '[aria-labelledby="add-space-select-library-label"] li:nth-of-type(3)',
        );
        await expect(centralLibraryOption).toBeVisible();
        await expect(centralLibraryOption).toContainText('Central Library');
        centralLibraryOption.click();

        // the displayed building and floors have changed; campus is unchanged
        await expect(campusSelector.locator('input')).toBeVisible();
        await expect(campusSelector).toContainText('St Lucia');
        await expect(librarySelector.locator('input')).toBeVisible();
        await expect(librarySelector).toContainText('Central Library');
        await expect(floorSelector.locator('input')).toBeVisible();
        await expect(floorSelector).toContainText('Central Library - 4');

        await expect(aboutPageInputField).toContainText('https://web.library.uq.edu.au/visit/duhig-tower');
        await expect(springshareSelector).toContainText('Duhig Tower'); // Springshare value

        // open the floor dropdown to change floor
        floorSelector.click();

        // the popup has the two valid floors
        await expect(floorDropdown).toBeVisible();
        await expect(floorDropdown.locator(' > *')).toHaveCount(2);
        await expect(floorDropdown.locator(' li:first-child')).toBeVisible();
        await expect(floorDropdown.locator(' li:first-of-type')).toContainText('Central Library - 4');
        await expect(floorDropdown.locator(' li:last-of-type')).toBeVisible();
        await expect(floorDropdown.locator(' li:last-of-type')).toContainText('Central Library - 5');

        // click on other floor to change the floor
        floorDropdown.locator(' li:last-of-type').click();

        // the displayed floor has changed; campus & building is unchanged
        await expect(campusSelector.locator('input')).toBeVisible();
        await expect(campusSelector).toContainText('St Lucia');
        await expect(librarySelector.locator('input')).toBeVisible();
        await expect(librarySelector).toContainText('Central Library');
        await expect(floorSelector.locator('input')).toBeVisible();
        await expect(floorSelector).toContainText('Central Library - 5');
        await expect(floorSelector).not.toContainText('Ground floor');

        await expect(aboutPageInputField).toContainText('https://web.library.uq.edu.au/visit/duhig-tower');
        await expect(springshareSelector).toContainText('Duhig Tower'); // Springshare value
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
        const spaceTypeField = page.getByTestId('add-space-type-new').locator('input');

        await expect(spaceNameField).toBeVisible();
        await spaceNameField.fill('W12343');
        await expect(spaceTypeField).toBeVisible();
        await spaceTypeField.fill('Computer room');

        // blur the form
        await page.getByTestId('SpacesAdminPage-systemTitle').click();

        await page.getByTestId('spaces-form-next-button').click(); // to facility types
        await page.getByTestId('spaces-form-next-button').click(); // to locations
        await page.getByTestId('spaces-form-next-button').click(); // to final imagery tab
        // click save button
        await expect(page.getByTestId('admin-spaces-save-button-submit')).toBeVisible();
        await page.getByTestId('admin-spaces-save-button-submit').click();

        // const msg = '[BSAS-001] Sorry, an error occurred - Saving the new Space failed. The admins have been informed.';
        const msg =
            'An error has occurred during the request and this request cannot be processed. Please contact webmaster@library.uq.edu.au or try again later.';
        await assertErrorPopupAppears(page, msg);
    });
});
