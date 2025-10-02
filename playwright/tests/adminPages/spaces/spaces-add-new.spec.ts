import { BrowserContext, expect, Page, test } from '@uq/pw/test';
import { assertAccessibility } from '@uq/pw/lib/axe';

import { COLOR_UQPURPLE } from '@uq/pw/lib/constants';

const inputField = (fieldName: string, page: Page) => page.getByTestId(fieldName).locator('input');

// this function sets up a cookie which will record the data that would be sent to the server
// this will let us confirm that what we _expected_ is what actually would go to the server
const setTestDataCookie = async (context: BrowserContext, page: Page) => {
    await context.addCookies([
        {
            name: 'CYPRESS_TEST_DATA',
            value: 'active',
            url: 'http://localhost:2020',
        },
    ]);

    const cookie = await page.context().cookies();
    expect(cookie.some(c => c.name === 'CYPRESS_TEST_DATA' && c.value === 'active')).toBeTruthy();
};

const assertExpectedDataSentToServer = async (page: Page, expectedValues: unknown) => {
    // make input fields focus
    const cookie = await page.context().cookies();
    expect(cookie.some(c => c.name === 'CYPRESS_DATA_SAVED')).toBeTruthy();

    // check the data we pretended to send to the server matches what we expect
    // acts as check of what we sent to api
    const cookieValue = await page.evaluate(() => {
        return document.cookie
            .split('; ')
            .find(row => row.startsWith('CYPRESS_DATA_SAVED='))
            ?.split('=')[1];
    });
    expect(cookieValue).toBeDefined();
    const decodedValue = !!cookieValue && decodeURIComponent(cookieValue);
    const sentValues = !!decodedValue && JSON.parse(decodedValue);
    // console.log('sentValues=', sentValues);
    // console.log('expectedValues=', expectedValues);
    expect(sentValues).toEqual(expectedValues);
};

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
        navigationMenuButton.click();

        await expect(navigationDropdownMenu).toBeVisible();
        await expect(addNewSpaceOption).toBeVisible();

        addNewSpaceOption.click();
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
        await expect(page.getByTestId('space-name').locator('input')).toBeVisible();
        await expect(page.getByTestId('space-type').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-select-campus').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-select-campus')).toContainText('St Lucia');
        await expect(page.getByTestId('add-space-select-building').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-select-building')).toContainText('Forgan Smith Building');
        await expect(page.getByTestId('add-space-select-floor').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-select-floor')).toContainText('Forgan Smith Building - 1');
        await expect(page.getByTestId('add-space-precise-location').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-pretty-location')).toBeVisible();
        await expect(page.getByTestId('add-space-pretty-location')).toContainText('2nd Floor');
        await expect(page.getByTestId('add-space-pretty-location')).toContainText('Forgan Smith Building');
        await expect(page.getByTestId('add-space-pretty-location')).toContainText('St Lucia Campus');

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
    test('can add new space, with only required fields', async ({ page, context }) => {
        await setTestDataCookie(context, page);

        await expect(page.getByTestId('space-name').locator('input')).toBeVisible();
        page.getByTestId('space-name')
            .locator('input')
            .fill('W12343');
        await expect(page.getByTestId('space-type').locator('input')).toBeVisible();
        page.getByTestId('space-type')
            .locator('input')
            .fill('Computer room');

        // click save button
        await expect(page.getByTestId('admin-spaces-save-button-submit')).toBeVisible();
        page.getByTestId('admin-spaces-save-button-submit').click();

        await expect(page.getByTestId('message-title')).toBeVisible();
        await expect(page.getByTestId('message-title')).toContainText('A Space has been added');

        // check the data we pretended to send to the server matches what we expect
        // acts as check of what we sent to api
        const expectedValues = {
            // locationType: 'space',
            space_floor_id: 1,
            space_name: 'W12343',
            space_type: 'Computer room',
        };
        await assertExpectedDataSentToServer(page, expectedValues);
    });
    test('can add new space, with all fields', async ({ page, context }) => {
        await setTestDataCookie(context, page);

        await expect(inputField('space-name', page)).toBeVisible();
        inputField('space-name', page).fill('W12343');
        await expect(inputField('space-type', page)).toBeVisible();
        inputField('space-type', page).fill('Computer room');

        // choose a different location

        // change campus
        page.getByTestId('add-space-select-campus').click();
        await expect(page.locator('ul[aria-labelledby="add-space-select-campus-label"] li:last-of-type')).toBeVisible();
        page.locator('ul[aria-labelledby="add-space-select-campus-label"] li:last-of-type').click();

        // change building
        page.getByTestId('add-space-select-building').click();
        await expect(
            page.locator('ul[aria-labelledby="add-space-select-building-label"] li:last-of-type'),
        ).toBeVisible();
        page.locator('ul[aria-labelledby="add-space-select-building-label"] li:last-of-type').click();

        // change floor
        page.getByTestId('add-space-select-floor').click();
        await expect(page.locator('[aria-labelledby="add-space-select-floor-label"] li:last-of-type')).toBeVisible();
        page.locator('[aria-labelledby="add-space-select-floor-label"] li:last-of-type').click();

        await expect(page.getByTestId('add-space-select-campus').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-select-campus')).toContainText('Gatton');
        await expect(page.getByTestId('add-space-select-building').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-select-building')).toContainText('Library Warehouse');
        await expect(page.getByTestId('add-space-select-floor').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-select-floor')).toContainText('Library Warehouse - 32');
        await expect(page.getByTestId('add-space-select-floor')).not.toContainText('Ground floor');
        await expect(inputField('add-space-precise-location', page)).toBeVisible();
        inputField('add-space-precise-location', page).fill('Northwest corner');

        await expect(page.getByTestId('add-space-pretty-location')).toBeVisible();
        await expect(page.getByTestId('add-space-pretty-location')).toContainText('Northwest corner, 1st Floor');
        await expect(page.getByTestId('add-space-pretty-location')).toContainText('Library Warehouse');
        await expect(page.getByTestId('add-space-pretty-location')).toContainText('Gatton Campus');

        await expect(page.getByTestId('add-space-springshare-id-autocomplete-input-wrapper')).toBeVisible();

        await page.getByTestId('add-space-springshare-id-autocomplete-input-wrapper').click();
        await page.getByRole('option', { name: 'Walter Harrison Law' }).click();

        await expect(page.getByTestId('add-space-description')).toBeVisible();
        page.getByTestId('add-space-description').fill(
            'This is a sunny corner in the Law library where you blah blah blah',
        );

        await expect(inputField('space-photo-url', page)).toBeVisible();
        inputField('space-photo-url', page).fill('https://example.com/image.jpg');

        await expect(page.getByTestId('add-space-photo-description')).toBeVisible();
        page.getByTestId('add-space-photo-description').fill('a table and chairs in a stark white room');

        await expect(inputField('space_services_page', page)).toBeVisible();
        inputField('space_services_page', page).fill('https://web.library.uq.edu.au/visit/walter-harrison-law-library');

        // click save button
        await expect(page.getByTestId('admin-spaces-save-button-submit')).toBeVisible();
        page.getByTestId('admin-spaces-save-button-submit').click();

        await expect(page.getByTestId('toast-corner-message')).not.toBeVisible();

        await expect(page.getByTestId('message-title')).toBeVisible();
        await expect(page.getByTestId('message-title')).toContainText('A Space has been added');

        // check the data we pretended to send to the server matches what we expect
        // acts as check of what we sent to api
        const expectedValues = {
            // locationType: 'space',
            space_floor_id: 32,
            space_name: 'W12343',
            space_photo_description: 'a table and chairs in a stark white room',
            space_photo_url: 'https://example.com/image.jpg',
            space_precise: 'Northwest corner',
            space_description: 'This is a sunny corner in the Law library where you blah blah blah',
            space_type: 'Computer room',
            space_opening_hours_id: 3841,
            space_services_page: 'https://web.library.uq.edu.au/visit/walter-harrison-law-library',
        };
        await assertExpectedDataSentToServer(page, expectedValues);
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
    test('add new space - validation - required fields 1', async ({ page }) => {
        // when the user has not entered required fields, they get an error

        //  blank form gives an error
        await expect(page.getByTestId('admin-spaces-save-button-submit')).toBeVisible();
        page.getByTestId('admin-spaces-save-button-submit').click();
        await expect(page.getByTestId('toast-corner-message')).toBeVisible();
        await expect(page.getByTestId('toast-corner-message p[data-count="2"]')).toBeDefined();
        await expect(page.getByTestId('toast-corner-message')).toContainText('These errors occurred');
        await expect(page.getByTestId('toast-corner-message')).toContainText('A Name is required.');
        await expect(page.getByTestId('toast-corner-message')).toContainText('A Type is required.');
        await expect(page.getByTestId('toast-corner-message')).not.toBeVisible(); // wait for it to close

        // user enters the name, but its still an error
        const spaceNameInputField = page.getByTestId('space-name').locator('input');
        await expect(spaceNameInputField).toBeVisible();
        spaceNameInputField.fill('W12343');
        await expect(page.getByTestId('admin-spaces-save-button-submit')).toBeVisible();
        page.getByTestId('admin-spaces-save-button-submit').click();
        await expect(page.getByTestId('toast-corner-message')).toBeVisible();
        await expect(page.getByTestId('toast-corner-message p[data-count="1"]')).toBeDefined();
        await expect(page.getByTestId('toast-corner-message')).toContainText('These errors occurred');
        await expect(page.getByTestId('toast-corner-message')).toContainText('A Type is required.');
        await expect(page.getByTestId('toast-corner-message')).not.toBeVisible(); // wait for it to close

        // they enter the type
        await expect(page.getByTestId('space-type').locator('input')).toBeVisible();
        page.getByTestId('space-type')
            .locator('input')
            .fill('Computer room');
        page.getByTestId('admin-spaces-save-button-submit').click();

        // now the form is valid!
        await expect(page.getByTestId('message-title')).toBeVisible();
        await expect(page.getByTestId('message-title')).toContainText('A Space has been added');
    });
    test('add new space - validation - required fields 2', async ({ page }) => {
        // when the user has not entered required fields, they get an error

        // user enters the name
        await expect(page.getByTestId('space-name').locator('input')).toBeVisible();
        page.getByTestId('space-name')
            .locator('input')
            .fill('W12343');
        // they enter the type
        await expect(page.getByTestId('space-type').locator('input')).toBeVisible();
        page.getByTestId('space-type')
            .locator('input')
            .fill('Computer room');

        // they enter the url, but neglect the description
        await expect(page.getByTestId('space-photo-url').locator('input')).toBeVisible();
        page.getByTestId('space-photo-url')
            .locator('input')
            .fill('https://example.com/image.jpg');
        await expect(page.getByTestId('admin-spaces-save-button-submit')).toBeVisible();
        page.getByTestId('admin-spaces-save-button-submit').click();
        await expect(page.getByTestId('toast-corner-message')).toBeVisible();
        await expect(page.getByTestId('toast-corner-message p[data-count="1"]')).toBeDefined();
        await expect(page.getByTestId('toast-corner-message')).toContainText('These errors occurred');
        await expect(page.getByTestId('toast-corner-message')).toContainText(
            'When a photo is supplied, a description must be supplied.',
        );

        await expect(page.getByTestId('add-space-photo-description')).toBeVisible();
        // page.getByTestId('add-space-photo-description').fill('a description of a room');
        page.getByTestId('add-space-photo-description').fill(
            'This is a sunny corner in the Law library where you blah blah blah',
        );

        page.getByTestId('admin-spaces-save-button-submit').click();

        // finally the form is valid!
        await expect(page.getByTestId('message-title')).toBeVisible();
        await expect(page.getByTestId('message-title')).toContainText('A Space has been added');
    });
    test('add new space - can change the location', async ({ page }) => {
        const campusSelector = page.getByTestId('add-space-select-campus');
        const buildingSelector = page.getByTestId('add-space-select-building');
        const floorSelector = page.getByTestId('add-space-select-floor');
        const springshareSelector = page.getByTestId('add-space-springshare-id').locator('input');
        const aboutPageInputField = page.getByTestId('add-space-about-page');

        // the page loads with the expected campus-building-floor
        await expect(campusSelector.locator('input')).toBeVisible();
        await expect(campusSelector).toContainText('St Lucia');
        await expect(buildingSelector.locator('input')).toBeVisible();
        await expect(buildingSelector).toContainText('Forgan Smith Building');
        await expect(floorSelector.locator('input')).toBeVisible();
        await expect(floorSelector).toContainText('Forgan Smith Building - 1');
        await expect(floorSelector).not.toContainText('Ground floor');

        await expect(aboutPageInputField).toContainText(
            'https://web.library.uq.edu.au/visit/walter-harrison-law-library',
        );
        await expect(springshareSelector).toHaveValue('Walter Harrison Law');

        // open the campus dropdown
        campusSelector.click();

        // the popup that opens holds the two valid campuses
        await expect(page.locator('[aria-labelledby="add-space-select-campus-label"]')).toBeVisible();
        await expect(page.locator('[aria-labelledby="add-space-select-campus-label"]').locator(' > *')).toHaveCount(2);
        await expect(page.locator('[aria-labelledby="add-space-select-campus-label"] li:first-of-type')).toBeVisible();
        await expect(page.locator('[aria-labelledby="add-space-select-campus-label"] li:first-of-type')).toContainText(
            'St Lucia',
        );
        await expect(page.locator('ul[aria-labelledby="add-space-select-campus-label"] li:last-of-type')).toBeVisible();
        await expect(page.locator('ul[aria-labelledby="add-space-select-campus-label"] li:last-of-type')).toContainText(
            'Gatton',
        );

        // click on "Gatton" to change campus
        page.locator('ul[aria-labelledby="add-space-select-campus-label"] li:last-of-type').click();

        // the displayed campus, building and floor shown have changed
        await expect(campusSelector.locator('input')).toBeVisible();
        await expect(campusSelector).toContainText('Gatton');
        await expect(buildingSelector.locator('input')).toBeVisible();
        await expect(buildingSelector).toContainText('J.K. Murray Library');
        await expect(floorSelector.locator('input')).toBeVisible();
        await expect(floorSelector).toContainText('J.K. Murray Library - 29');
        await expect(floorSelector).toContainText('Ground floor');

        await expect(aboutPageInputField).toContainText(
            'https://web.library.uq.edu.au/visit/jk-murray-library-uq-gatton',
        );
        await expect(springshareSelector).toHaveValue('JK Murray (UQ Gatton)');

        // open the building dropdown to change building
        buildingSelector.click();

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

        // choose 'Warehouse' in the building dropdown to change the building and floor
        page.locator('ul[aria-labelledby="add-space-select-building-label"] li:last-of-type').click();

        // the displayed building and floors have changed; campus is unchanged
        await expect(campusSelector.locator('input')).toBeVisible();
        await expect(campusSelector).toContainText('Gatton');
        await expect(buildingSelector.locator('input')).toBeVisible();
        await expect(buildingSelector).toContainText('Library Warehouse');
        await expect(floorSelector.locator('input')).toBeVisible();
        await expect(floorSelector).toContainText('Library Warehouse - 31');
        await expect(floorSelector).not.toContainText('Ground floor');

        await expect(aboutPageInputField).toContainText('none');
        await expect(springshareSelector).toHaveValue('No Springshare building hours will display (click to change)');

        // open the floor dropdown to change floor
        floorSelector.click();

        // the popup has the two valid floors
        await expect(page.locator('[aria-labelledby="add-space-select-floor-label"]')).toBeVisible();
        await expect(page.locator('[aria-labelledby="add-space-select-floor-label"]').locator(' > *')).toHaveCount(2);
        await expect(page.locator('[aria-labelledby="add-space-select-floor-label"] li:first-child')).toBeVisible();
        await expect(page.locator('[aria-labelledby="add-space-select-floor-label"] li:first-of-type')).toContainText(
            'Library Warehouse - 31',
        );
        await expect(page.locator('[aria-labelledby="add-space-select-floor-label"] li:last-of-type')).toBeVisible();
        await expect(page.locator('[aria-labelledby="add-space-select-floor-label"] li:last-of-type')).toContainText(
            'Library Warehouse - 32',
        );

        // click on other floor to change the floor
        page.locator('[aria-labelledby="add-space-select-floor-label"] li:last-of-type').click();

        // the displayed floor has changed; campus & building is unchanged
        await expect(campusSelector.locator('input')).toBeVisible();
        await expect(campusSelector).toContainText('Gatton');
        await expect(buildingSelector.locator('input')).toBeVisible();
        await expect(buildingSelector).toContainText('Library Warehouse');
        await expect(floorSelector.locator('input')).toBeVisible();
        await expect(floorSelector).toContainText('Library Warehouse - 32');
        await expect(floorSelector).not.toContainText('Ground floor');

        await expect(aboutPageInputField).toContainText('none');
        await expect(springshareSelector).toHaveValue('No Springshare building hours will display (click to change)');

        // test we can change it twice

        // open the building dropdown to change building
        buildingSelector.click();

        // the popup has the two valid buildings (this was showing all 3 at one point)
        await expect(page.locator('[aria-labelledby="add-space-select-building-label"]')).toBeVisible();
        await expect(page.locator('[aria-labelledby="add-space-select-building-label"]').locator(' > *')).toHaveCount(
            2,
        );
        await expect(
            page.locator('ul[aria-labelledby="add-space-select-building-label"] li:first-child'),
        ).toBeVisible();
        page.locator('ul[aria-labelledby="add-space-select-building-label"] li:first-of-type').click();

        // open the campus dropdown
        campusSelector.click();

        // the popup that opens holds the two valid campuses
        await expect(page.locator('[aria-labelledby="add-space-select-campus-label"]')).toBeVisible();
        await expect(page.locator('[aria-labelledby="add-space-select-campus-label"]').locator(' > *')).toHaveCount(2);

        // click on "St Lucia" to change campus
        page.locator('ul[aria-labelledby="add-space-select-campus-label"] li:first-of-type').click();

        // the displayed campus, building and floor shown have changed
        await expect(campusSelector.locator('input')).toBeVisible();
        await expect(campusSelector).toContainText('St Lucia');
        await expect(buildingSelector.locator('input')).toBeVisible();
        await expect(buildingSelector).toContainText('Forgan Smith Building');
        await expect(floorSelector.locator('input')).toBeVisible();
        await expect(floorSelector).toContainText('Forgan Smith Building - 1');

        await expect(aboutPageInputField).toContainText(
            'https://web.library.uq.edu.au/visit/walter-harrison-law-library',
        );
        await expect(springshareSelector).toHaveValue('Walter Harrison Law');

        // open the building dropdown to change building
        buildingSelector.click();

        // the popup has the two valid buildings
        await expect(page.locator('[aria-labelledby="add-space-select-building-label"]')).toBeVisible();
        await expect(page.locator('[aria-labelledby="add-space-select-building-label"]').locator(' > *')).toHaveCount(
            2,
        );

        // click on building 'Duhig Tower' to change the building and floor
        await expect(page.locator('[aria-labelledby="add-space-select-building-label"] li:last-of-type')).toBeVisible();
        await expect(page.locator('[aria-labelledby="add-space-select-building-label"] li:last-of-type')).toContainText(
            'Duhig Tower',
        );
        page.locator('ul[aria-labelledby="add-space-select-building-label"] li:last-of-type').click();

        // the displayed building and floors have changed; campus is unchanged
        await expect(campusSelector.locator('input')).toBeVisible();
        await expect(campusSelector).toContainText('St Lucia');
        await expect(buildingSelector.locator('input')).toBeVisible();
        await expect(buildingSelector).toContainText('Duhig Tower');
        await expect(floorSelector.locator('input')).toBeVisible();
        await expect(floorSelector).toContainText('Duhig Tower - 4');

        await expect(aboutPageInputField).toContainText('https://web.library.uq.edu.au/visit/duhig-tower');
        await expect(springshareSelector).toHaveValue('Duhig Tower');

        // open the floor dropdown to change floor
        floorSelector.click();

        // the popup has the two valid floors
        await expect(page.locator('[aria-labelledby="add-space-select-floor-label"]')).toBeVisible();
        await expect(page.locator('[aria-labelledby="add-space-select-floor-label"]').locator(' > *')).toHaveCount(2);
        await expect(page.locator('[aria-labelledby="add-space-select-floor-label"] li:first-child')).toBeVisible();
        await expect(page.locator('[aria-labelledby="add-space-select-floor-label"] li:first-of-type')).toContainText(
            'Duhig Tower - 4',
        );
        await expect(page.locator('[aria-labelledby="add-space-select-floor-label"] li:last-of-type')).toBeVisible();
        await expect(page.locator('[aria-labelledby="add-space-select-floor-label"] li:last-of-type')).toContainText(
            'Duhig Tower - 5',
        );

        // click on other floor to change the floor
        page.locator('[aria-labelledby="add-space-select-floor-label"] li:last-of-type').click();

        // the displayed floor has changed; campus & building is unchanged
        await expect(campusSelector.locator('input')).toBeVisible();
        await expect(campusSelector).toContainText('St Lucia');
        await expect(buildingSelector.locator('input')).toBeVisible();
        await expect(buildingSelector).toContainText('Duhig Tower');
        await expect(floorSelector.locator('input')).toBeVisible();
        await expect(floorSelector).toContainText('Duhig Tower - 5');
        await expect(floorSelector).not.toContainText('Ground floor');

        await expect(aboutPageInputField).toContainText('https://web.library.uq.edu.au/visit/duhig-tower');
        await expect(springshareSelector).toHaveValue('Duhig Tower');
    });
});
test.describe('Spaces Admin - errors', () => {
    test('add new space - empty locations redirects', async ({ page }) => {
        await page.goto('/admin/spaces/add?user=libSpaces&responseType=empty-spaces');
        await page.setViewportSize({ width: 1300, height: 1000 });
        // wait for page to load
        await expect(page.getByTestId('admin-spaces-page-title').getByText(/Add a new Space/)).toBeVisible();

        await expect(page.getByTestId('add-space-no-locations')).toBeVisible();
        await expect(page.getByTestId('add-space-no-locations')).toContainText('No buildings currently in system');
    });
    test('add new space - error locations', async ({ page }) => {
        await page.goto('/admin/spaces/add?user=libSpaces&responseType=error-spaces');
        await page.setViewportSize({ width: 1300, height: 1000 });
        // wait for page to load
        await expect(page.getByTestId('admin-spaces-page-title').getByText(/Add a new Space/)).toBeVisible();

        await expect(page.getByTestId('add-space-error')).toBeVisible();
        await expect(page.getByTestId('add-space-error')).toContainText(
            'Something went wrong - please try again later.',
        );
    });
    test('add new space - 404 locations', async ({ page }) => {
        await page.goto('/admin/spaces/add?user=libSpaces&responseType=404-spaces');
        await page.setViewportSize({ width: 1300, height: 1000 });
        // wait for page to load
        await expect(page.getByTestId('admin-spaces-page-title').getByText(/Add a new Space/)).toBeVisible();

        await expect(page.getByTestId('add-space-error')).toBeVisible();
        await expect(page.getByTestId('add-space-error')).toContainText(
            'Something went wrong - please try again later.',
        );
    });
});
