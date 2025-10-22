import { expect, test } from '@uq/pw/test';
import { assertAccessibility } from '@uq/pw/lib/axe';
import { assertExpectedDataSentToServer, setTestDataCookie } from '@uq/pw/lib/helpers';

import { COLOR_UQPURPLE } from '@uq/pw/lib/constants';

test.describe('Spaces Admin - add new space', () => {
    test('can navigate from dashboard to edit page', async ({ page }) => {
        await page.goto('/admin/spaces?user=libSpaces');
        await page.setViewportSize({ width: 1300, height: 1000 });

        await expect(page.getByTestId('admin-spaces-page-title').getByText(/Manage Spaces/)).toBeVisible();

        const editButton1 = page.getByTestId('edit-space-123456-button');

        await expect(editButton1).toBeVisible();
        editButton1.click();

        await expect(page).toHaveURL('http://localhost:2020/admin/spaces/edit/987y_isjgt_9866?user=libSpaces');
    });
});
test.describe('Spaces Admin - edit space', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/admin/spaces/edit/987y_isjgt_9866?user=libSpaces');
        await page.setViewportSize({ width: 1300, height: 1000 });
        // wait for page to load
        await expect(page.getByTestId('admin-spaces-page-title').getByText(/Edit Space/)).toBeVisible();
    });
    test('edit space preloaded values appear as expected onload', async ({ page }) => {
        await expect(page.getByTestId('space-name').locator('input')).toBeVisible();
        await expect(page.getByTestId('space-name').locator('input')).toHaveValue('01-W431');
        await expect(page.getByTestId('space-type').locator('input')).toBeVisible();
        await expect(page.getByTestId('space-type').locator('input')).toHaveValue('Collaborative space');
        await expect(page.getByTestId('add-space-select-campus').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-select-campus')).toContainText('St Lucia');
        await expect(page.getByTestId('add-space-select-library').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-select-library')).toContainText('Walter Harrison Law Library');
        await expect(page.getByTestId('add-space-select-floor').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-select-floor')).toContainText('Walter Harrison Law Library - 1');
        await expect(page.getByTestId('add-space-precise-location').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-precise-location').locator('input')).toHaveValue('Westernmost corner');
        await expect(page.getByTestId('add-space-pretty-location')).toBeVisible();
        await expect(page.getByTestId('add-space-pretty-location')).toContainText('Westernmost corner, 2nd Floor');
        await expect(page.getByTestId('add-space-pretty-location')).toContainText('Walter Harrison Law Library');
        await expect(page.getByTestId('add-space-pretty-location')).toContainText('Forgan Smith Building');
        await expect(page.getByTestId('add-space-pretty-location')).toContainText('(Building 0001)');
        await expect(page.getByTestId('add-space-pretty-location')).toContainText('St Lucia Campus');

        await expect(page.getByTestId('add-space-springshare-id-autocomplete-input-wrapper')).toBeVisible();
        await expect(page.getByTestId('add-space-springshare-id-autocomplete-input-wrapper')).toHaveValue(
            'Walter Harrison Law',
        );

        await expect(page.getByTestId('space-opening-hours-override').locator('input')).toBeVisible();
        await expect(page.getByTestId('space-opening-hours-override').locator('input')).toHaveValue('');

        await expect(page.getByTestId('space_services_page').locator('input')).toBeVisible();
        await expect(page.getByTestId('space_services_page').locator('input')).toHaveValue(
            'https://web.library.uq.edu.au/visit/walter-harrison-law-library',
        );

        await expect(page.getByTestId('space-photo-url').locator('input')).toBeVisible();
        await expect(page.getByTestId('space-photo-url').locator('input')).toHaveValue(
            'https://campuses.uq.edu.au/files/35116/01-E107%20%28Resize%29.jpg',
        );

        await expect(page.getByTestId('add-space-photo-description')).toBeVisible();
        await expect(page.getByTestId('add-space-photo-description')).toHaveValue(
            'a large room with 6 large round tables, each wih multiple chairs',
        );

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
    test.only('can save with only required fields', async ({ page, context }) => {
        await setTestDataCookie(context, page);

        // await expect(page.getByTestId('space-name').locator('input')).toBeVisible();
        // page.getByTestId('space-name')
        //     .locator('input')
        //     .fill('W12343');
        // await expect(page.getByTestId('space-type').locator('input')).toBeVisible();
        // page.getByTestId('space-type')
        //     .locator('input')
        //     .fill('Computer room');

        // clear all fields we can clear
        await expect(page.getByTestId('add-space-description')).toBeVisible();
        await page.getByTestId('add-space-description').fill('');

        // // clear facility types - playwright doesnt seem to be able to click these chips :(
        // await page.locator('[data-tag-index="0"]').click();
        // await page.locator('[data-tag-index="1"]').click();
        // await page.locator('[data-tag-index="2"]').click();
        // await page.locator('[data-tag-index="3"]').click();

        await expect(page.getByTestId('add-space-springshare-id-autocomplete-input-wrapper')).toBeVisible();
        await page.getByTestId('add-space-springshare-id-autocomplete-input-wrapper').click();
        await page.getByRole('option', { name: 'No Springshare opening hours' }).click();

        await expect(page.getByTestId('space-opening-hours-override').locator('input')).toBeVisible();
        await page
            .getByTestId('space-opening-hours-override')
            .locator('input')
            .fill('');

        await expect(page.getByTestId('space_services_page').locator('input')).toBeVisible();
        await page
            .getByTestId('space_services_page')
            .locator('input')
            .fill('');

        // // already blank
        // await expect(page.getByTestId('space_opening_hours_override').locator('input')).toBeVisible();
        // await page
        //     .getByTestId('space_opening_hours_override')
        //     .locator('input')
        //     .fill('');

        // // test doesnt like it
        // await page.getByTestId('space_precise').locator('input');
        // // .scrollIntoViewIfNeeded()
        // await expect(page.getByTestId('space_precise').locator('input')).toBeVisible();
        // await page
        //     .getByTestId('space_precise')
        //     .locator('input')
        //     .fill('');

        await expect(page.getByTestId('space_services_page').locator('input')).toBeVisible();
        await page
            .getByTestId('space_services_page')
            .locator('input')
            .fill('');

        await expect(page.getByTestId('space-photo-url').locator('input')).toBeVisible();
        await page
            .getByTestId('space-photo-url')
            .locator('input')
            .fill('');

        await expect(page.getByTestId('add-space-photo-description')).toBeVisible();
        await page.getByTestId('add-space-photo-description').fill('');

        // click save button
        await expect(page.getByTestId('admin-spaces-save-button-submit')).toBeVisible();
        page.getByTestId('admin-spaces-save-button-submit').click();
        //
        // await expect(page.getByTestId('message-title')).toBeVisible();
        // await expect(page.getByTestId('message-title')).toContainText('The Space has been updated');

        // check the data we pretended to send to the server matches what we expect
        // acts as check of what we sent to api
        const expectedValues = {
            space_floor_id: 1,
            space_name: '01-W431',
            space_type: 'Collaborative space',
            facility_types: [1, 4, 8, 14],
            space_precise: 'Westernmost corner',
            space_description: '',
            space_photo_url: '',
            space_photo_description: '',
            space_opening_hours_id: -1,
            space_services_page: '',
            space_opening_hours_override: null,
            space_latitude: '-27.496955206561836', // when we have fields for these, they should be cleared
            space_longitude: '153.01308753792662',
            // facility_types: [],
        };
        // await page.waitForTimeout(100000);
        await page.waitForTimeout(100); // weird, we need to wait for the cookie?
        await assertExpectedDataSentToServer(page, expectedValues);
    });
    //     test('can add new space, with all fields', async ({ page, context }) => {
    //         await setTestDataCookie(context, page);
    //
    //         await expect(inputField('space-name', page)).toBeVisible();
    //         inputField('space-name', page).fill('W12343');
    //         await expect(inputField('space-type', page)).toBeVisible();
    //         inputField('space-type', page).fill('Computer room');
    //
    //         // choose a different location
    //
    //         // change campus
    //         page.getByTestId('add-space-select-campus').click();
    //         await expect(page.locator('ul[aria-labelledby="add-space-select-campus-label"] li:last-of-type')).toBeVisible();
    //         page.locator('ul[aria-labelledby="add-space-select-campus-label"] li:last-of-type').click();
    //
    //         // change building
    //         page.getByTestId('add-space-select-library').click();
    //         await expect(
    //             page.locator('ul[aria-labelledby="add-space-select-library-label"] li:last-of-type'),
    //         ).toBeVisible();
    //         page.locator('ul[aria-labelledby="add-space-select-library-label"] li:last-of-type').click();
    //
    //         // change floor
    //         page.getByTestId('add-space-select-floor').click();
    //         await expect(page.locator('[aria-labelledby="add-space-select-floor-label"] li:last-of-type')).toBeVisible();
    //         page.locator('[aria-labelledby="add-space-select-floor-label"] li:last-of-type').click();
    //
    //         await expect(page.getByTestId('add-space-select-campus').locator('input')).toBeVisible();
    //         await expect(page.getByTestId('add-space-select-campus')).toContainText('Gatton');
    //         await expect(page.getByTestId('add-space-select-library').locator('input')).toBeVisible();
    //         await expect(page.getByTestId('add-space-select-library')).toContainText('Library Warehouse');
    //         await expect(page.getByTestId('add-space-select-floor').locator('input')).toBeVisible();
    //         await expect(page.getByTestId('add-space-select-floor')).toContainText('Library Warehouse - 32');
    //         await expect(page.getByTestId('add-space-select-floor')).not.toContainText('Ground floor');
    //         await expect(inputField('add-space-precise-location', page)).toBeVisible();
    //         inputField('add-space-precise-location', page).fill('Northwest corner');
    //
    //         await expect(page.getByTestId('add-space-pretty-location')).toBeVisible();
    //         await expect(page.getByTestId('add-space-pretty-location')).toContainText('Northwest corner, 1st Floor');
    //         await expect(page.getByTestId('add-space-pretty-location')).toContainText('Library Warehouse');
    //         await expect(page.getByTestId('add-space-pretty-location')).toContainText('Gatton Campus');
    //
    //         await expect(page.getByTestId('add-space-springshare-id-autocomplete-input-wrapper')).toBeVisible();
    //
    //         await page.getByTestId('add-space-springshare-id-autocomplete-input-wrapper').click();
    //         await page.getByRole('option', { name: 'Walter Harrison Law' }).click();
    //
    //         await expect(page.getByTestId('add-space-description')).toBeVisible();
    //         page.getByTestId('add-space-description').fill(
    //             'This is a sunny corner in the Law library where you blah blah blah',
    //         );
    //
    //         await expect(inputField('space-photo-url', page)).toBeVisible();
    //         inputField('space-photo-url', page).fill('https://example.com/image.jpg');
    //
    //         await expect(page.getByTestId('add-space-photo-description')).toBeVisible();
    //         page.getByTestId('add-space-photo-description').fill('a table and chairs in a stark white room');
    //
    //         await expect(inputField('space_services_page', page)).toBeVisible();
    //         inputField('space_services_page', page).fill('https://web.library.uq.edu.au/visit/walter-harrison-law-library');
    //
    //         await expect(page.getByTestId('facilityType-input')).toBeVisible();
    //         await page.getByTestId('facilityType-input').click();
    //         await page.getByRole('option', { name: 'Noise level Low' }).click();
    //         await page.getByTestId('facilityType-input').click();
    //         await page.getByRole('option', { name: 'Capacity (??)' }).click();
    //
    //         // click save button
    //         await expect(page.getByTestId('admin-spaces-save-button-submit')).toBeVisible();
    //         page.getByTestId('admin-spaces-save-button-submit').click();
    //
    //         await expect(page.getByTestId('toast-corner-message')).not.toBeVisible();
    //
    //         await expect(page.getByTestId('message-title')).toBeVisible();
    //         await expect(page.getByTestId('message-title')).toContainText('A Space has been added');
    //
    //         // check the data we pretended to send to the server matches what we expect
    //         // acts as check of what we sent to api
    //         const expectedValues = {
    //             // locationType: 'space',
    //             space_floor_id: 32,
    //             space_name: 'W12343',
    //             space_photo_description: 'a table and chairs in a stark white room',
    //             space_photo_url: 'https://example.com/image.jpg',
    //             space_precise: 'Northwest corner',
    //             space_description: 'This is a sunny corner in the Law library where you blah blah blah',
    //             space_type: 'Computer room',
    //             space_opening_hours_id: 3841,
    //             space_services_page: 'https://web.library.uq.edu.au/visit/walter-harrison-law-library',
    //             facility_types: ['1', '6'],
    //         };
    //         await assertExpectedDataSentToServer(page, expectedValues);
    //     });
    //
    //     test('add spaces page save dialog is accessible', async ({ page }) => {
    //         await expect(page.getByTestId('space-name').locator('input')).toBeVisible();
    //         page.getByTestId('space-name')
    //             .locator('input')
    //             .fill('W12343');
    //         await expect(page.getByTestId('space-type').locator('input')).toBeVisible();
    //         page.getByTestId('space-type')
    //             .locator('input')
    //             .fill('Computer room');
    //         await expect(page.getByTestId('admin-spaces-save-button-submit')).toBeVisible();
    //         page.getByTestId('admin-spaces-save-button-submit').click();
    //
    //         await expect(page.getByTestId('message-title')).toBeVisible();
    //         await expect(page.getByTestId('message-title')).toContainText('A Space has been added');
    //
    //         await assertAccessibility(page, '[aria-labelledby=":r1:"]');
    //     });
    //     test('add new space - validation - required fields 1', async ({ page }) => {
    //         // when the user has not entered required fields, they get an error
    //
    //         //  blank form gives an error
    //         await expect(page.getByTestId('admin-spaces-save-button-submit')).toBeVisible();
    //         page.getByTestId('admin-spaces-save-button-submit').click();
    //         await expect(page.getByTestId('toast-corner-message')).toBeVisible();
    //         await expect(page.getByTestId('toast-corner-message p[data-count="2"]')).toBeDefined();
    //         await expect(page.getByTestId('toast-corner-message')).toContainText('These errors occurred');
    //         await expect(page.getByTestId('toast-corner-message')).toContainText('A Name is required.');
    //         await expect(page.getByTestId('toast-corner-message')).toContainText('A Type is required.');
    //         await expect(page.getByTestId('toast-corner-message')).not.toBeVisible(); // wait for it to close
    //
    //         // user enters the name, but its still an error
    //         const spaceNameInputField = page.getByTestId('space-name').locator('input');
    //         await expect(spaceNameInputField).toBeVisible();
    //         spaceNameInputField.fill('W12343');
    //         await expect(page.getByTestId('admin-spaces-save-button-submit')).toBeVisible();
    //         page.getByTestId('admin-spaces-save-button-submit').click();
    //         await expect(page.getByTestId('toast-corner-message')).toBeVisible();
    //         await expect(page.getByTestId('toast-corner-message p[data-count="1"]')).toBeDefined();
    //         await expect(page.getByTestId('toast-corner-message')).toContainText('These errors occurred');
    //         await expect(page.getByTestId('toast-corner-message')).toContainText('A Type is required.');
    //         await expect(page.getByTestId('toast-corner-message')).not.toBeVisible(); // wait for it to close
    //
    //         // they enter the type
    //         await expect(page.getByTestId('space-type').locator('input')).toBeVisible();
    //         page.getByTestId('space-type')
    //             .locator('input')
    //             .fill('Computer room');
    //         page.getByTestId('admin-spaces-save-button-submit').click();
    //
    //         // now the form is valid!
    //         await expect(page.getByTestId('message-title')).toBeVisible();
    //         await expect(page.getByTestId('message-title')).toContainText('A Space has been added');
    //     });
    //     test('add new space - validation - required fields 2', async ({ page }) => {
    //         // when the user has not entered required fields, they get an error
    //
    //         // user enters the name
    //         await expect(page.getByTestId('space-name').locator('input')).toBeVisible();
    //         page.getByTestId('space-name')
    //             .locator('input')
    //             .fill('W12343');
    //         // they enter the type
    //         await expect(page.getByTestId('space-type').locator('input')).toBeVisible();
    //         page.getByTestId('space-type')
    //             .locator('input')
    //             .fill('Computer room');
    //
    //         // they enter the url, but neglect the description
    //         await expect(page.getByTestId('space-photo-url').locator('input')).toBeVisible();
    //         page.getByTestId('space-photo-url')
    //             .locator('input')
    //             .fill('https://example.com/image.jpg');
    //         await expect(page.getByTestId('admin-spaces-save-button-submit')).toBeVisible();
    //         page.getByTestId('admin-spaces-save-button-submit').click();
    //         await expect(page.getByTestId('toast-corner-message')).toBeVisible();
    //         await expect(page.getByTestId('toast-corner-message p[data-count="1"]')).toBeDefined();
    //         await expect(page.getByTestId('toast-corner-message')).toContainText('These errors occurred');
    //         await expect(page.getByTestId('toast-corner-message')).toContainText(
    //             'When a photo is supplied, a description must be supplied.',
    //         );
    //
    //         await expect(page.getByTestId('add-space-photo-description')).toBeVisible();
    //         // page.getByTestId('add-space-photo-description').fill('a description of a room');
    //         page.getByTestId('add-space-photo-description').fill(
    //             'This is a sunny corner in the Law library where you blah blah blah',
    //         );
    //
    //         page.getByTestId('admin-spaces-save-button-submit').click();
    //
    //         // finally the form is valid!
    //         await expect(page.getByTestId('message-title')).toBeVisible();
    //         await expect(page.getByTestId('message-title')).toContainText('A Space has been added');
    //     });
    //     test('add new space - can change the location', async ({ page }) => {
    //         const campusSelector = page.getByTestId('add-space-select-campus');
    //         const librarySelector = page.getByTestId('add-space-select-library');
    //         const floorSelector = page.getByTestId('add-space-select-floor');
    //         const springshareSelector = page.getByTestId('add-space-springshare-id').locator('input');
    //         const aboutPageInputField = page.getByTestId('add-space-about-page');
    //
    //         // the page loads with the expected campus-building-floor
    //         await expect(campusSelector.locator('input')).toBeVisible();
    //         await expect(campusSelector).toContainText('St Lucia');
    //         await expect(librarySelector.locator('input')).toBeVisible();
    //         await expect(librarySelector).toContainText('Walter Harrison Law Library');
    //         await expect(floorSelector.locator('input')).toBeVisible();
    //         await expect(floorSelector).toContainText('Walter Harrison Law Library - 1');
    //         await expect(floorSelector).not.toContainText('Ground floor');
    //
    //         await expect(aboutPageInputField).toContainText(
    //             'https://web.library.uq.edu.au/visit/walter-harrison-law-library',
    //         );
    //
    //         // inexplicably, this line is completely flakey on AWS, but fine locally :(
    //         // await expect(springshareSelector).toHaveValue('Walter Harrison Law');
    //
    //         // open the campus dropdown
    //         campusSelector.click();
    //
    //         // the popup that opens holds the two valid campuses
    //         await expect(page.locator('[aria-labelledby="add-space-select-campus-label"]')).toBeVisible();
    //         await expect(page.locator('[aria-labelledby="add-space-select-campus-label"]').locator(' > *')).toHaveCount(2);
    //         await expect(page.locator('[aria-labelledby="add-space-select-campus-label"] li:first-of-type')).toBeVisible();
    //         await expect(page.locator('[aria-labelledby="add-space-select-campus-label"] li:first-of-type')).toContainText(
    //             'St Lucia',
    //         );
    //         await expect(page.locator('ul[aria-labelledby="add-space-select-campus-label"] li:last-of-type')).toBeVisible();
    //         await expect(page.locator('ul[aria-labelledby="add-space-select-campus-label"] li:last-of-type')).toContainText(
    //             'Gatton',
    //         );
    //
    //         // click on "Gatton" to change campus
    //         page.locator('ul[aria-labelledby="add-space-select-campus-label"] li:last-of-type').click();
    //
    //         // the displayed campus, building and floor shown have changed
    //         await expect(campusSelector.locator('input')).toBeVisible();
    //         await expect(campusSelector).toContainText('Gatton');
    //         await expect(librarySelector.locator('input')).toBeVisible();
    //         await expect(librarySelector).toContainText('J.K. Murray Library');
    //         await expect(floorSelector.locator('input')).toBeVisible();
    //         await expect(floorSelector).toContainText('J.K. Murray Library - 29');
    //         await expect(floorSelector).toContainText('Ground floor');
    //
    //         await expect(aboutPageInputField).toContainText(
    //             'https://web.library.uq.edu.au/visit/jk-murray-library-uq-gatton',
    //         );
    //         await expect(springshareSelector).toHaveValue('JK Murray (UQ Gatton)');
    //
    //         // open the building dropdown to change building
    //         librarySelector.click();
    //
    //         // the popup has the two valid buildings
    //         await expect(page.locator('[aria-labelledby="add-space-select-library-label"]')).toBeVisible();
    //         await expect(page.locator('[aria-labelledby="add-space-select-library-label"]').locator(' > *')).toHaveCount(2);
    //         await expect(page.locator('[aria-labelledby="add-space-select-library-label"] li:first-child')).toBeVisible();
    //         await expect(page.locator('[aria-labelledby="add-space-select-library-label"] li:first-of-type')).toContainText(
    //             'J.K. Murray Library',
    //         );
    //         await expect(page.locator('[aria-labelledby="add-space-select-library-label"] li:last-of-type')).toBeVisible();
    //         await expect(page.locator('[aria-labelledby="add-space-select-library-label"] li:last-of-type')).toContainText(
    //             'Library Warehouse',
    //         );
    //
    //         // choose 'Warehouse' in the building dropdown to change the building and floor
    //         page.locator('ul[aria-labelledby="add-space-select-library-label"] li:last-of-type').click();
    //
    //         // the displayed building and floors have changed; campus is unchanged
    //         await expect(campusSelector.locator('input')).toBeVisible();
    //         await expect(campusSelector).toContainText('Gatton');
    //         await expect(librarySelector.locator('input')).toBeVisible();
    //         await expect(librarySelector).toContainText('Library Warehouse');
    //         await expect(floorSelector.locator('input')).toBeVisible();
    //         await expect(floorSelector).toContainText('Library Warehouse - 31');
    //         await expect(floorSelector).not.toContainText('Ground floor');
    //
    //         await expect(aboutPageInputField).toContainText('none');
    //         await expect(springshareSelector).toHaveValue('No Springshare opening hours will display (click to change)');
    //
    //         // open the floor dropdown to change floor
    //         floorSelector.click();
    //
    //         // the popup has the two valid floors
    //         const floorDropdown = page.locator('[aria-labelledby="add-space-select-floor-label"]');
    //         await expect(floorDropdown).toBeVisible();
    //         await expect(floorDropdown.locator(' > *')).toHaveCount(2);
    //         await expect(floorDropdown.locator(' li:first-child')).toBeVisible();
    //         await expect(floorDropdown.locator(' li:first-of-type')).toContainText('Library Warehouse - 31');
    //         await expect(floorDropdown.locator(' li:last-of-type')).toBeVisible();
    //         await expect(floorDropdown.locator(' li:last-of-type')).toContainText('Library Warehouse - 32');
    //
    //         // click on other floor to change the floor
    //         floorDropdown.locator(' li:last-of-type').click();
    //
    //         // the displayed floor has changed; campus & building is unchanged
    //         await expect(campusSelector.locator('input')).toBeVisible();
    //         await expect(campusSelector).toContainText('Gatton');
    //         await expect(librarySelector.locator('input')).toBeVisible();
    //         await expect(librarySelector).toContainText('Library Warehouse');
    //         await expect(floorSelector.locator('input')).toBeVisible();
    //         await expect(floorSelector).toContainText('Library Warehouse - 32');
    //         await expect(floorSelector).not.toContainText('Ground floor');
    //
    //         await expect(aboutPageInputField).toContainText('none');
    //         await expect(springshareSelector).toHaveValue('No Springshare opening hours will display (click to change)');
    //
    //         // test we can change it twice
    //
    //         // open the building dropdown to change building
    //         librarySelector.click();
    //
    //         // the popup has the two valid buildings (this was showing all 3 at one point)
    //         await expect(page.locator('[aria-labelledby="add-space-select-library-label"]')).toBeVisible();
    //         await expect(page.locator('[aria-labelledby="add-space-select-library-label"]').locator(' > *')).toHaveCount(2);
    //         await expect(page.locator('ul[aria-labelledby="add-space-select-library-label"] li:first-child')).toBeVisible();
    //         page.locator('ul[aria-labelledby="add-space-select-library-label"] li:first-of-type').click();
    //
    //         // open the campus dropdown
    //         campusSelector.click();
    //
    //         // the popup that opens holds the two valid campuses
    //         await expect(page.locator('[aria-labelledby="add-space-select-campus-label"]')).toBeVisible();
    //         await expect(page.locator('[aria-labelledby="add-space-select-campus-label"]').locator(' > *')).toHaveCount(2);
    //
    //         // click on "St Lucia" to change campus
    //         page.locator('ul[aria-labelledby="add-space-select-campus-label"] li:first-of-type').click();
    //
    //         // the displayed campus, building and floor shown have changed
    //         await expect(campusSelector.locator('input')).toBeVisible();
    //         await expect(campusSelector).toContainText('St Lucia');
    //         await expect(librarySelector.locator('input')).toBeVisible();
    //         await expect(librarySelector).toContainText('Walter Harrison Law Library');
    //         await expect(floorSelector.locator('input')).toBeVisible();
    //         await expect(floorSelector).toContainText('Walter Harrison Law Library - 1');
    //
    //         await expect(aboutPageInputField).toContainText(
    //             'https://web.library.uq.edu.au/visit/walter-harrison-law-library',
    //         );
    //         await expect(springshareSelector).toHaveValue('Walter Harrison Law');
    //
    //         // open the building dropdown to change building
    //         librarySelector.click();
    //
    //         // the popup has the two valid buildings
    //         await expect(page.locator('[aria-labelledby="add-space-select-library-label"]')).toBeVisible();
    //         await expect(page.locator('[aria-labelledby="add-space-select-library-label"]').locator(' > *')).toHaveCount(2);
    //
    //         // click on 'Central' Library to change the building and floor
    //         await expect(page.locator('[aria-labelledby="add-space-select-library-label"] li:last-of-type')).toBeVisible();
    //         await expect(page.locator('[aria-labelledby="add-space-select-library-label"] li:last-of-type')).toContainText(
    //             'Central Library',
    //         );
    //         page.locator('ul[aria-labelledby="add-space-select-library-label"] li:last-of-type').click();
    //
    //         // the displayed building and floors have changed; campus is unchanged
    //         await expect(campusSelector.locator('input')).toBeVisible();
    //         await expect(campusSelector).toContainText('St Lucia');
    //         await expect(librarySelector.locator('input')).toBeVisible();
    //         await expect(librarySelector).toContainText('Central Library');
    //         await expect(floorSelector.locator('input')).toBeVisible();
    //         await expect(floorSelector).toContainText('Central Library - 4');
    //
    //         await expect(aboutPageInputField).toContainText('https://web.library.uq.edu.au/visit/duhig-tower');
    //         await expect(springshareSelector).toHaveValue('Duhig Tower'); // Springshare value
    //
    //         // open the floor dropdown to change floor
    //         floorSelector.click();
    //
    //         // the popup has the two valid floors
    //         await expect(floorDropdown).toBeVisible();
    //         await expect(floorDropdown.locator(' > *')).toHaveCount(2);
    //         await expect(floorDropdown.locator(' li:first-child')).toBeVisible();
    //         await expect(floorDropdown.locator(' li:first-of-type')).toContainText('Central Library - 4');
    //         await expect(floorDropdown.locator(' li:last-of-type')).toBeVisible();
    //         await expect(floorDropdown.locator(' li:last-of-type')).toContainText('Central Library - 5');
    //
    //         // click on other floor to change the floor
    //         floorDropdown.locator(' li:last-of-type').click();
    //
    //         // the displayed floor has changed; campus & building is unchanged
    //         await expect(campusSelector.locator('input')).toBeVisible();
    //         await expect(campusSelector).toContainText('St Lucia');
    //         await expect(librarySelector.locator('input')).toBeVisible();
    //         await expect(librarySelector).toContainText('Central Library');
    //         await expect(floorSelector.locator('input')).toBeVisible();
    //         await expect(floorSelector).toContainText('Central Library - 5');
    //         await expect(floorSelector).not.toContainText('Ground floor');
    //
    //         await expect(aboutPageInputField).toContainText('https://web.library.uq.edu.au/visit/duhig-tower');
    //         await expect(springshareSelector).toHaveValue('Duhig Tower'); // Springshare value
    //     });
    // });
    // test.describe('Spaces Admin - errors', () => {
    //     test('add new space - empty locations redirects', async ({ page }) => {
    //         await page.goto('/admin/spaces/add?user=libSpaces&responseType=empty-spaces');
    //         await page.setViewportSize({ width: 1300, height: 1000 });
    //         // wait for page to load
    //         await expect(page.getByTestId('admin-spaces-page-title').getByText(/Add a new Space/)).toBeVisible();
    //
    //         await expect(page.getByTestId('add-space-no-locations')).toBeVisible();
    //         await expect(page.getByTestId('add-space-no-locations')).toContainText('No Libraries currently in system');
    //     });
    //     test('add new space - error locations', async ({ page }) => {
    //         await page.goto('/admin/spaces/add?user=libSpaces&responseType=error-spaces');
    //         await page.setViewportSize({ width: 1300, height: 1000 });
    //         // wait for page to load
    //         await expect(page.getByTestId('admin-spaces-page-title').getByText(/Add a new Space/)).toBeVisible();
    //
    //         await expect(page.getByTestId('add-space-error')).toBeVisible();
    //         await expect(page.getByTestId('add-space-error')).toContainText(
    //             'Something went wrong - please try again later.',
    //         );
    //     });
    //     test('add new space - 404 locations', async ({ page }) => {
    //         await page.goto('/admin/spaces/add?user=libSpaces&responseType=404-spaces');
    //         await page.setViewportSize({ width: 1300, height: 1000 });
    //         // wait for page to load
    //         await expect(page.getByTestId('admin-spaces-page-title').getByText(/Add a new Space/)).toBeVisible();
    //
    //         await expect(page.getByTestId('add-space-error')).toBeVisible();
    //         await expect(page.getByTestId('add-space-error')).toContainText(
    //             'Something went wrong - please try again later.',
    //         );
    //     });
});
