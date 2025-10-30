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

        // this is flakey on AWS. try different method of showing this is the current field
        // await expect(page.getByTestId('add-space-springshare-id-autocomplete-input-wrapper')).toHaveValue(
        //     'Walter Harrison Law',
        // );

        // show the current selection is correct by opening the dropdown and showing the correct entry has the mui "focused" style
        await page.getByTestId('add-space-springshare-id-autocomplete-input-wrapper').click();
        await expect(page.getByRole('option', { name: 'Walter Harrison Law' })).toHaveClass(
            'MuiAutocomplete-option Mui-focused',
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
    test('can save with only required fields', async ({ page, context }) => {
        await setTestDataCookie(context, page);

        // clear as many of the non-required fields as is possible and confirm will submit

        await expect(page.getByTestId('add-space-description')).toBeVisible();
        await page.getByTestId('add-space-description').fill('');

        // // clear facility types - playwright doesnt seem to be able to click these chips :(
        // await page.locator('[data-tag-index="0"]').click();
        // await page.locator('[data-tag-index="1"]').click();
        // await page.locator('[data-tag-index="2"]').click();
        // await page.locator('[data-tag-index="3"]').click();

        // locations are inherently unclearable

        await expect(page.getByTestId('add-space-precise-location').locator('input')).toBeVisible();
        await page
            .getByTestId('add-space-precise-location')
            .locator('input')
            .fill('');

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

        await expect(page.getByTestId('message-title')).toBeVisible();
        await expect(page.getByTestId('message-title')).toContainText('The Space has been updated');

        // check the data we pretended to send to the server matches what we expect
        // acts as check of what we sent to api
        const expectedValues = {
            space_floor_id: 1,
            space_name: '01-W431', // required field
            space_type: 'Collaborative space', // required field
            facility_types: [1, 4, 8, 14],
            space_precise: '',
            space_description: '',
            space_photo_url: '',
            space_photo_description: '',
            space_opening_hours_id: -1,
            space_services_page: '',
            space_opening_hours_override: null,
            space_latitude: '-27.496955206561836', // when we have fields for these, they should be cleared
            space_longitude: '153.01308753792662',
        };
        await assertExpectedDataSentToServer(page, expectedValues);
    });
    test('can change all fields in edit', async ({ page, context }) => {
        await setTestDataCookie(context, page);

        await expect(page.getByTestId('space-name').locator('input')).toBeVisible();
        page.getByTestId('space-name')
            .locator('input')
            .fill('New space name');
        await expect(page.getByTestId('space-type').locator('input')).toBeVisible();
        page.getByTestId('space-type')
            .locator('input')
            .fill('New space type');

        await expect(page.getByTestId('add-space-description')).toBeVisible();
        await page.getByTestId('add-space-description').fill('a long description that has a number of words');

        await page.getByTestId('facilityType-input').click();
        await page.getByRole('option', { name: 'Noise level: Noise level Medium' }).click();

        await page.getByRole('combobox', { name: 'Campus * St Lucia' }).click();
        await page.getByRole('option', { name: 'Gatton' }).click();
        await page.getByRole('combobox', { name: 'Library * J.K. Murray Library' }).click();
        await page.getByRole('option', { name: 'Library Warehouse' }).click();
        await page.getByRole('combobox', { name: 'Floor * 1 [Library Warehouse' }).click();
        await page.getByRole('option', { name: '[Library Warehouse - 32]' }).click();

        await expect(page.getByTestId('add-space-precise-location').locator('input')).toBeVisible();
        await page
            .getByTestId('add-space-precise-location')
            .locator('input')
            .fill('somewhere deep in the bowels of the warehouse');

        // await expect(page.getByTestId('add-space-springshare-id-autocomplete-input-wrapper')).toBeVisible();
        // await page.getByTestId('add-space-springshare-id-autocomplete-input-wrapper').click();
        // await page.getByRole('option', { name: 'No Springshare opening hours' }).click();
        await page.getByTestId('add-space-springshare-id-autocomplete-input-wrapper').click();
        await page.getByRole('option', { name: 'Dorothy Hill Engineering and' }).click();

        await expect(page.getByTestId('space_services_page').locator('input')).toBeVisible();
        await expect(page.getByTestId('space_services_page').locator('input')).toBeVisible();
        await page
            .getByTestId('space_services_page')
            .locator('input')
            .fill('http://example.com');

        // await expect(page.getByTestId('space_opening_hours_override').locator('input')).toBeVisible();
        // await page
        //     .getByTestId('space_opening_hours_override')
        //     .locator('input')
        //     .fill('space is open from 7am');
        // await page.getByRole('textbox', { name: 'An extra line about opening' }).click();
        await page.getByRole('textbox', { name: 'An extra line about opening' }).fill('space is open from 7am');

        await expect(page.getByTestId('space-photo-url').locator('input')).toBeVisible();
        await page
            .getByTestId('space-photo-url')
            .locator('input')
            .fill('http://example.com/x.png');

        await expect(page.getByTestId('add-space-photo-description')).toBeVisible();
        await page.getByTestId('add-space-photo-description').fill('words about the photo');

        // click save button
        await expect(page.getByTestId('admin-spaces-save-button-submit')).toBeVisible();
        page.getByTestId('admin-spaces-save-button-submit').click();

        await expect(page.getByTestId('message-title')).toBeVisible();
        await expect(page.getByTestId('message-title')).toContainText('The Space has been updated');

        // check the data we pretended to send to the server matches what we expect
        // acts as check of what we sent to api
        const expectedValues = {
            space_floor_id: 32,
            space_name: 'New space name', // required field
            space_type: 'New space type', // required field
            facility_types: [1, 4, 8, 14, 2],
            space_precise: 'somewhere deep in the bowels of the warehouse',
            space_description: 'a long description that has a number of words',
            space_photo_url: 'http://example.com/x.png',
            space_photo_description: 'words about the photo',
            space_opening_hours_id: 3825,
            space_services_page: 'http://example.com',
            space_opening_hours_override: 'space is open from 7am',
            space_latitude: '-27.496955206561836', // when we have fields for these, they should be changed
            space_longitude: '153.01308753792662',
        };
        await assertExpectedDataSentToServer(page, expectedValues);
    });

    test('edit spaces page save dialog is accessible', async ({ page }) => {
        await expect(page.getByTestId('admin-spaces-save-button-submit')).toBeVisible();
        page.getByTestId('admin-spaces-save-button-submit').click();

        await expect(page.getByTestId('message-title')).toBeVisible();
        await expect(page.getByTestId('message-title')).toContainText('The Space has been updated');

        await assertAccessibility(page, '[data-testid="dialogbox-spaces-save-outcome"]');
    });

    test.describe('Spaces Admin - errors', () => {
        test('edit new space - error locations', async ({ page }) => {
            await page.goto('/admin/spaces/edit/error?user=libSpaces');
            await page.setViewportSize({ width: 1300, height: 1000 });
            // wait for page to load
            await expect(page.getByTestId('admin-spaces-page-title').getByText(/Edit Space/)).toBeVisible();

            await expect(page.getByTestId('add-space-error')).toBeVisible();
            await expect(page.getByTestId('add-space-error')).toContainText(
                'Something went wrong - please try again later.',
            );
            await expect(page.getByTestId('add-space-error')).toContainText('Space details currently unavailable.');
        });
        test('edit new space - 404 locations', async ({ page }) => {
            await page.goto('/admin/spaces/edit/missingRecord?user=libSpaces');
            await page.setViewportSize({ width: 1300, height: 1000 });
            // wait for page to load
            await expect(page.getByTestId('admin-spaces-page-title').getByText(/Edit Space/)).toBeVisible();

            await expect(page.getByTestId('missing-record')).toBeVisible();
            await expect(page.getByTestId('missing-record')).toContainText('There is no Space with ID "missingRecord"'); // 'missingRecord' is the id in mock when it is missing
        });
    });
});
