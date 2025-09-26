import { expect, Page, test } from '@uq/pw/test';
import { assertAccessibility } from '@uq/pw/lib/axe';

import { COLOR_UQPURPLE } from '@uq/pw/lib/constants';

const inputField = (fieldName: string, page: Page) => page.getByTestId(fieldName).locator('input');

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
        await expect(page.getByTestId('add-space-precise-location').locator('input')).toBeVisible();

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
        await context.addCookies([
            {
                name: 'CYPRESS_TEST_DATA',
                value: 'active',
                url: 'http://localhost:2020',
            },
        ]);

        const cookie = await page.context().cookies();
        expect(cookie.some(c => c.name === 'CYPRESS_TEST_DATA' && c.value === 'active')).toBeTruthy();

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
            locationType: 'space',
            space_floor_id: 1,
            space_name: 'W12343',
            space_type: 'Computer room',
        };
        const cookieValue = await page.evaluate(() => {
            return document.cookie
                .split('; ')
                .find(row => row.startsWith('CYPRESS_DATA_SAVED='))
                ?.split('=')[1];
        });
        expect(cookieValue).toBeDefined();
        const decodedValue = !!cookieValue && decodeURIComponent(cookieValue);
        const sentValues = !!decodedValue && JSON.parse(decodedValue);
        expect(sentValues).toEqual(expectedValues);
    });
    test('can add new space, with all fields', async ({ page, context }) => {
        await context.addCookies([
            {
                name: 'CYPRESS_TEST_DATA',
                value: 'active',
                url: 'http://localhost:2020',
            },
        ]);

        const cookie = await page.context().cookies();
        expect(cookie.some(c => c.name === 'CYPRESS_TEST_DATA' && c.value === 'active')).toBeTruthy();

        await expect(inputField('space-name', page)).toBeVisible();
        inputField('space-name', page).fill('W12343');
        await expect(inputField('space-type', page)).toBeVisible();
        inputField('space-type', page).fill('Computer room');

        // choose a different location

        // open the campus dropdown
        await expect(page.getByTestId('add-space-select-campus')).toBeVisible();
        await expect(page.getByTestId('add-space-select-campus')).toContainText('St Lucia');
        page.getByText(/St Lucia/).click();

        // click in campus list to change to campus "Gatton"
        await expect(page.locator('[aria-labelledby="add-space-select-campus-label"] li:last-of-type')).toBeVisible();
        await expect(page.locator('[aria-labelledby="add-space-select-campus-label"] li:last-of-type')).toContainText(
            'Gatton',
        );
        page.getByText(/Gatton/).click();

        // open the building dropdown to change building
        await expect(page.getByTestId('add-space-select-building')).toBeVisible();
        await expect(page.getByTestId('add-space-select-building')).toContainText('J.K. Murray Library');
        // page.getByText(/J.K. Murray Library/).click();
        page.getByTestId('add-space-select-building').click();

        // click in building list to change to building "warehouse"
        await expect(page.locator('[aria-labelledby="add-space-select-building-label"] li:last-of-type')).toBeVisible();
        await expect(page.locator('[aria-labelledby="add-space-select-building-label"] li:last-of-type')).toContainText(
            'Library Warehouse',
        );
        page.locator('[aria-labelledby="add-space-select-building-label"] li:last-of-type').click();

        // open the floor dropdown to change floor
        await expect(page.getByTestId('add-space-select-floor')).toBeVisible();
        await expect(page.getByTestId('add-space-select-floor')).toContainText('Library Warehouse - 31');
        page.getByTestId('add-space-select-floor').click();

        // click on floor to change the floor
        await expect(page.locator('[aria-labelledby="add-space-select-floor-label"] li:last-of-type')).toBeVisible();
        await expect(page.locator('[aria-labelledby="add-space-select-floor-label"] li:last-of-type')).toContainText(
            'Library Warehouse - 32',
        );
        page.locator('[aria-labelledby="add-space-select-floor-label"] li:last-of-type').click();

        await expect(inputField('add-space-precise-location', page)).toBeVisible();
        inputField('add-space-precise-location', page).fill('northwest corner');

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
            locationType: 'space',
            space_floor_id: 32,
            space_name: 'W12343',
            space_photo_description: 'a table and chairs in a stark white room',
            space_photo_url: 'https://example.com/image.jpg',
            space_precise: 'northwest corner',
            space_description: 'This is a sunny corner in the Law library where you blah blah blah',
            space_type: 'Computer room',
            space_opening_hours_id: 3841,
            space_services_page: 'https://web.library.uq.edu.au/visit/walter-harrison-law-library',
        };
        const cookieValue = await page.evaluate(() => {
            return document.cookie
                .split('; ')
                .find(row => row.startsWith('CYPRESS_DATA_SAVED='))
                ?.split('=')[1];
        });
        expect(cookieValue).toBeDefined();
        const decodedValue = !!cookieValue && decodeURIComponent(cookieValue);
        const sentValues = !!decodedValue && JSON.parse(decodedValue);
        // console.log('expectedValues=', expectedValues);
        // console.log('sentValues=', sentValues);

        expect(sentValues).toEqual(expectedValues);
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

        // user enters the name, but its still an error
        await expect(page.getByTestId('space-name').locator('input')).toBeVisible();
        page.getByTestId('space-name')
            .locator('input')
            .fill('W12343');
        await expect(page.getByTestId('admin-spaces-save-button-submit')).toBeVisible();
        page.getByTestId('admin-spaces-save-button-submit').click();
        await expect(page.getByTestId('toast-corner-message')).toBeVisible();
        await expect(page.getByTestId('toast-corner-message p[data-count="1"]')).toBeDefined();
        await expect(page.getByTestId('toast-corner-message')).toContainText('These errors occurred');
        await expect(page.getByTestId('toast-corner-message')).toContainText('A Type is required.');

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
        // the page loads with the expected campus-building-floor
        await expect(page.getByTestId('add-space-select-campus').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-select-campus')).toContainText('St Lucia');
        await expect(page.getByTestId('add-space-select-building').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-select-building')).toContainText('Forgan Smith Building');
        await expect(page.getByTestId('add-space-select-floor').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-select-floor')).toContainText('Forgan Smith Building - 1');
        await expect(page.getByTestId('add-space-select-floor')).not.toContainText('Ground floor');

        // open the campus dropdown
        page.getByTestId('add-space-select-campus').click();

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
        await expect(page.getByTestId('add-space-select-campus').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-select-campus')).toContainText('Gatton');
        await expect(page.getByTestId('add-space-select-building').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-select-building')).toContainText('J.K. Murray Library');
        await expect(page.getByTestId('add-space-select-floor').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-select-floor')).toContainText('J.K. Murray Library - 29');
        await expect(page.getByTestId('add-space-select-floor')).toContainText('Ground floor');

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

        // choose 'Warehouse' inn the building dropdown to change the building and floor
        page.locator('ul[aria-labelledby="add-space-select-building-label"] li:last-of-type').click();

        // the displayed building and floors have changed; campus is unchanged
        await expect(page.getByTestId('add-space-select-campus').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-select-campus')).toContainText('Gatton');
        await expect(page.getByTestId('add-space-select-building').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-select-building')).toContainText('Library Warehouse');
        await expect(page.getByTestId('add-space-select-floor').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-select-floor')).toContainText('Library Warehouse - 31');
        await expect(page.getByTestId('add-space-select-floor')).not.toContainText('Ground floor');

        // open the floor dropdown to change floor
        page.getByTestId('add-space-select-floor').click();

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
        await expect(page.getByTestId('add-space-select-campus').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-select-campus')).toContainText('Gatton');
        await expect(page.getByTestId('add-space-select-building').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-select-building')).toContainText('Library Warehouse');
        await expect(page.getByTestId('add-space-select-floor').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-select-floor')).toContainText('Library Warehouse - 32');
        await expect(page.getByTestId('add-space-select-floor')).not.toContainText('Ground floor');

        // test we can change it twice
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

        // click on building 'Duhig Tower' to change the building and floor
        await expect(page.locator('[aria-labelledby="add-space-select-building-label"] li:last-of-type')).toBeVisible();
        await expect(page.locator('[aria-labelledby="add-space-select-building-label"] li:last-of-type')).toContainText(
            'Duhig Tower',
        );
        page.locator('ul[aria-labelledby="add-space-select-building-label"] li:last-of-type').click();

        // the displayed building and floors have changed; campus is unchanged
        await expect(page.getByTestId('add-space-select-campus').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-select-campus')).toContainText('St Lucia');
        await expect(page.getByTestId('add-space-select-building').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-select-building')).toContainText('Duhig Tower');
        await expect(page.getByTestId('add-space-select-floor').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-select-floor')).toContainText('Duhig Tower - 4');

        // open the floor dropdown to change floor
        page.getByTestId('add-space-select-floor').click();

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
        await expect(page.getByTestId('add-space-select-campus').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-select-campus')).toContainText('St Lucia');
        await expect(page.getByTestId('add-space-select-building').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-select-building')).toContainText('Duhig Tower');
        await expect(page.getByTestId('add-space-select-floor').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-select-floor')).toContainText('Duhig Tower - 5');
        await expect(page.getByTestId('add-space-select-floor')).not.toContainText('Ground floor');
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
