import { expect, test } from '@uq/pw/test';
import { assertAccessibility } from '@uq/pw/lib/axe';
import { assertExpectedDataSentToServer, setTestDataCookie } from '@uq/pw/lib/helpers';

import { COLOR_UQPURPLE } from '@uq/pw/lib/constants';

test.describe('Spaces Admin - edit spaces', () => {
    test('can navigate from dashboard to edit page', async ({ page }) => {
        await page.goto('/admin/spaces?user=libSpaces');
        await page.setViewportSize({ width: 1300, height: 1000 });

        await expect(page.getByTestId('admin-spaces-page-title').getByText(/Manage Spaces/)).toBeVisible();

        const editButton1 = page.getByTestId('edit-space-123456-button');

        await expect(editButton1).toBeVisible();
        editButton1.click();

        await expect(page).toHaveURL('http://localhost:2020/admin/spaces/edit/f98g_fwas_5g33?user=libSpaces');
    });
});
test.describe('Spaces Admin - edit pages load with correct data', () => {
    test('edit Library 1 loads correctly', async ({ page }) => {
        await page.goto('/admin/spaces/edit/f98g_fwas_5g33?user=libSpaces');
        await page.setViewportSize({ width: 1300, height: 1000 });
        // wait for page to load
        await expect(page.getByTestId('admin-spaces-page-title').getByText(/Edit Space/)).toBeVisible();
        await expect(page.getByTestId('space-name').locator('input')).toBeVisible();
        await expect(page.getByTestId('space-name').locator('input')).toHaveValue('01-W431');
        await expect(page.getByTestId('space-type').locator('input')).toBeVisible();
        await expect(page.getByTestId('space-type').locator('input')).toHaveValue('Collaborative space');

        // all the facility types appear in the "space form", not just the ones currently attached to a space
        const numberFacilityTypesInMockFacilityTypes = 52;
        await expect(page.getByTestId('facility-type-checkbox-list').locator('input[type="checkbox"]')).toHaveCount(
            numberFacilityTypesInMockFacilityTypes,
        );

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

        await expect(page.getByTestId('add-space-springshare-id').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-springshare-id')).toContainText('Walter Harrison Law');

        await expect(page.getByTestId('add-space-springshare-id').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-springshare-id')).toContainText('Walter Harrison Law');

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
    test('edit Library 2 loads correctly', async ({ page }) => {
        await page.goto('/admin/spaces/edit/df40_2jsf_zdk5?user=libSpaces');
        await page.setViewportSize({ width: 1300, height: 1000 });
        // wait for page to load
        await expect(page.getByTestId('admin-spaces-page-title').getByText(/Edit Space/)).toBeVisible();

        await expect(page.getByTestId('space-name').locator('input')).toBeVisible();
        await expect(page.getByTestId('space-name').locator('input')).toHaveValue('6078');
        await expect(page.getByTestId('space-type').locator('input')).toBeVisible();
        await expect(page.getByTestId('space-type').locator('input')).toHaveValue('Group Study Room');

        // all the facility types appear in the "space form", not just the ones currently attached to a space
        const numberFacilityTypesInMockFacilityTypes = 52;
        await expect(page.getByTestId('facility-type-checkbox-list').locator('input[type="checkbox"]')).toHaveCount(
            numberFacilityTypesInMockFacilityTypes,
        );

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
        await expect(page.getByTestId('add-space-precise-location').locator('input')).toBeEmpty();
        await expect(page.getByTestId('add-space-pretty-location')).toBeVisible();
        await expect(page.getByTestId('add-space-pretty-location')).toContainText('6th Floor');
        await expect(page.getByTestId('add-space-pretty-location')).toContainText(
            'Pharmacy Australia Centre of Excellence',
        );
        await expect(page.getByTestId('add-space-pretty-location')).toContainText(
            'Pharmacy Australia Centre of Excellence',
        );
        await expect(page.getByTestId('add-space-pretty-location')).toContainText('(Building 870)');
        await expect(page.getByTestId('add-space-pretty-location')).toContainText('PACE Campus');

        await expect(page.getByTestId('add-space-springshare-id').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-springshare-id')).toContainText('Dutton Park Health Science');

        await expect(page.getByTestId('space-opening-hours-override').locator('input')).toBeVisible();
        await expect(page.getByTestId('space-opening-hours-override').locator('input')).toHaveValue(
            'this space opens at 8am',
        );

        await expect(page.getByTestId('space_services_page').locator('input')).toBeVisible();
        await expect(page.getByTestId('space_services_page').locator('input')).toHaveValue(
            'https://web.library.uq.edu.au/visit/dutton-park-health-sciences-library',
        );

        await expect(page.getByTestId('space-photo-url').locator('input')).toBeVisible();
        await expect(page.getByTestId('space-photo-url').locator('input')).toBeEmpty();

        await expect(page.getByTestId('add-space-photo-description')).toBeVisible();
        await expect(page.getByTestId('add-space-photo-description')).toBeEmpty();

        const cancelButton = page.getByTestId('admin-spaces-form-button-cancel');
        await expect(cancelButton).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
        await expect(cancelButton).toHaveCSS('border-color', COLOR_UQPURPLE);
        await expect(cancelButton).toHaveCSS('color', COLOR_UQPURPLE);

        const saveButton = page.getByTestId('admin-spaces-save-button-submit');
        await expect(saveButton).toHaveCSS('background-color', COLOR_UQPURPLE);
        await expect(saveButton).toHaveCSS('border-color', COLOR_UQPURPLE);
        await expect(saveButton).toHaveCSS('color', 'rgb(255, 255, 255)');
    });
    test('edit Library 3, Andrew Liveris building, loads correctly', async ({ page }) => {
        await page.goto('/admin/spaces/edit/97fd5_nm39_gh29?user=libSpaces');
        await page.setViewportSize({ width: 1300, height: 1000 });
        // wait for page to load
        await expect(page.getByTestId('admin-spaces-page-title').getByText(/Edit Space/)).toBeVisible();

        // all the facility types appear in the "space form", not just the ones currently attached to a space
        const numberFacilityTypesInMockFacilityTypes = 52;
        await expect(page.getByTestId('facility-type-checkbox-list').locator('input[type="checkbox"]')).toHaveCount(
            numberFacilityTypesInMockFacilityTypes,
        );

        await expect(page.getByTestId('space-name').locator('input')).toBeVisible();
        await expect(page.getByTestId('space-name').locator('input')).toHaveValue('46-342/343');
        await expect(page.getByTestId('space-type').locator('input')).toBeVisible();
        await expect(page.getByTestId('space-type').locator('input')).toHaveValue('Computer room');
        await expect(page.getByTestId('add-space-select-campus').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-select-campus')).toContainText('St Lucia');
        await expect(page.getByTestId('add-space-select-library').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-select-library')).toContainText('imaginary Liveris Library');
        await expect(page.getByTestId('add-space-select-floor').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-select-floor')).toContainText('imaginary Liveris Library - 72');
        await expect(page.getByTestId('add-space-precise-location').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-precise-location').locator('input')).toHaveValue('Eastern corner');
        await expect(page.getByTestId('add-space-pretty-location')).toBeVisible();
        await expect(page.getByTestId('add-space-pretty-location')).toContainText('Eastern corner, 1st Floor');
        await expect(page.getByTestId('add-space-pretty-location')).toContainText('imaginary Liveris Library');
        await expect(page.getByTestId('add-space-pretty-location')).toContainText('Andrew N. Liveris');
        await expect(page.getByTestId('add-space-pretty-location')).toContainText('(Building 0046)');
        await expect(page.getByTestId('add-space-pretty-location')).toContainText('St Lucia Campus');

        await expect(page.getByTestId('add-space-springshare-id').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-springshare-id')).toContainText(
            'No Springshare opening hours will display (click to change)',
        );

        await expect(page.getByTestId('space-opening-hours-override').locator('input')).toBeVisible();
        await expect(page.getByTestId('space-opening-hours-override').locator('input')).toHaveValue(
            'open from 7am Monday - Friday',
        );

        await expect(page.getByTestId('space_services_page').locator('input')).toBeVisible();
        await expect(page.getByTestId('space_services_page').locator('input')).toBeEmpty();

        await expect(page.getByTestId('space-photo-url').locator('input')).toBeVisible();
        await expect(page.getByTestId('space-photo-url').locator('input')).toHaveValue(
            'https://campuses.uq.edu.au/files/35424/46-342-343.JPG',
        );

        await expect(page.getByTestId('add-space-photo-description')).toBeVisible();
        await expect(page.getByTestId('add-space-photo-description')).toHaveValue(
            'a large room with many tables, each wih 4 chairs',
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
});
test.describe('Spaces Admin - edit space', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/admin/spaces/edit/f98g_fwas_5g33?user=libSpaces');
        await page.setViewportSize({ width: 1300, height: 1000 });
        // wait for page to load
        await expect(page.getByTestId('admin-spaces-page-title').getByText(/Edit Space/)).toBeVisible();
    });

    test('edit spaces page is accessible', async ({ page }) => {
        await assertAccessibility(page, '[data-testid="StandardPage"]');
    });

    const CONTAINS_ARTWORK = 57;
    const EXAM_FRIENDLY = 52;
    const WHITEBOARD = 38;
    const RECHARGE_STATION = 29;
    const SELF_PRINTING = 31;
    const FEMALE_TOILETS = 23;
    const MALE_TOILETS = 22;
    const ADJUSTABLE_DESKS = 39;
    const AV_EQUIPMENT = 8;
    const POWER_POINT = 33;
    const COMPUTER = 5;
    const LOW_NOISE_LEVEL = 17;
    const POSTGRAD = 13;
    const UNDERGRAD = 14;

    test('can save with only required fields', async ({ page, context }) => {
        await setTestDataCookie(context, page);

        // clear as many of the non-required fields as is possible and confirm will submit

        await expect(page.getByTestId('add-space-description')).toBeVisible();
        await page.getByTestId('add-space-description').fill('');

        // clear facility types
        for (const facilityTypeId of [
            CONTAINS_ARTWORK,
            RECHARGE_STATION,
            SELF_PRINTING,
            FEMALE_TOILETS,
            MALE_TOILETS,
            ADJUSTABLE_DESKS,
            AV_EQUIPMENT,
            POWER_POINT,
            COMPUTER,
            WHITEBOARD,
            LOW_NOISE_LEVEL,
            POSTGRAD,
            UNDERGRAD,
        ]) {
            await expect(page.getByTestId(`filtertype-${facilityTypeId}`).locator('input')).toBeChecked();
            await page
                .getByTestId(`filtertype-${facilityTypeId}`)
                .locator('input')
                .click();
        }

        // locations are inherently unclearable

        await expect(page.getByTestId('add-space-precise-location').locator('input')).toBeVisible();
        await page
            .getByTestId('add-space-precise-location')
            .locator('input')
            .fill('');

        await expect(page.getByTestId('add-space-springshare-id').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-springshare-id')).toContainText('Walter Harrison Law');
        page.getByTestId('add-space-springshare-id').click();
        page.locator('ul[aria-labelledby="add-space-springshare-id-label"] li:first-of-type').click();
        await expect(page.getByTestId('add-space-springshare-id')).toContainText(
            'No Springshare opening hours will display',
        );

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
            facility_types: [],
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
    test('can re-edit after save', async ({ page }) => {
        // click save button
        await expect(page.getByTestId('admin-spaces-save-button-submit')).toBeVisible();
        page.getByTestId('admin-spaces-save-button-submit').click();

        // change the title so when we reload the page from "edit again" we can check the page has actually reloaded
        // by showing the immmutable mock data has reverted
        await expect(page.getByTestId('space-name').locator('input')).toBeVisible();
        await expect(page.getByTestId('space-name').locator('input')).toHaveValue('01-W431');
        page.getByTestId('space-name')
            .locator('input')
            .fill('New space name');

        await expect(page.getByTestId('message-title')).toBeVisible();
        await expect(page.getByTestId('message-title')).toContainText('The Space has been updated');
        await expect(page.getByTestId('confirm-spaces-save-outcome')).toBeVisible();
        await expect(page.getByTestId('confirm-spaces-save-outcome')).toContainText('Return to dashboard');
        await expect(page.getByTestId('cancel-spaces-save-outcome')).toBeVisible();
        await expect(page.getByTestId('cancel-spaces-save-outcome')).toContainText('Edit record again');
        page.getByTestId('cancel-spaces-save-outcome').click();

        await expect(page.getByTestId('message-title')).not.toBeVisible();
        await expect(page).toHaveURL('http://localhost:2020/admin/spaces/edit/f98g_fwas_5g33?user=libSpaces');
        await expect(page.getByTestId('space-name').locator('input')).toBeVisible();
        // page has reloaded, not just closed dialog, as mock data has reverted
        await expect(page.getByTestId('space-name').locator('input')).toHaveValue('01-W431');
    });
    test('can return to dashboard after save', async ({ page }) => {
        // click save button
        await expect(page.getByTestId('admin-spaces-save-button-submit')).toBeVisible();
        page.getByTestId('admin-spaces-save-button-submit').click();

        await expect(page.getByTestId('message-title')).toBeVisible();
        await expect(page.getByTestId('message-title')).toContainText('The Space has been updated');
        await expect(page.getByTestId('confirm-spaces-save-outcome')).toBeVisible();
        await expect(page.getByTestId('confirm-spaces-save-outcome')).toContainText('Return to dashboard');
        await expect(page.getByTestId('cancel-spaces-save-outcome')).toBeVisible();
        await expect(page.getByTestId('cancel-spaces-save-outcome')).toContainText('Edit record again');
        page.getByTestId('confirm-spaces-save-outcome').click();

        await expect(page.getByTestId('message-title')).not.toBeVisible();
        await expect(page).toHaveURL('http://localhost:2020/admin/spaces?user=libSpaces');
    });
    test('can change all fields in edit', async ({ page, context }) => {
        await setTestDataCookie(context, page);

        await expect(page.getByTestId('space-name').locator('input')).toBeVisible();
        page.getByTestId('space-name')
            .locator('input')
            .fill('New space name');

        await expect(page.getByTestId('add-space-type-new').locator('input')).toBeVisible();
        page.getByTestId('add-space-type-new')
            .locator('input')
            .fill('New space type');
        await page.keyboard.press('Tab');
        // the "new space type" field auto clears on blur, and the select preloads
        await expect(page.getByTestId('add-space-type-new').locator('input')).toBeEmpty();
        await expect(page.getByTestId('space-type').locator('input')).toHaveValue('New space type');

        await expect(page.getByTestId('add-space-description')).toBeVisible();
        await page.getByTestId('add-space-description').fill('a long description that has a number of words');

        // confirm current filter types
        const originalFilters = [
            FEMALE_TOILETS,
            MALE_TOILETS,
            ADJUSTABLE_DESKS,
            RECHARGE_STATION,
            SELF_PRINTING,
            LOW_NOISE_LEVEL,
            COMPUTER,
            POWER_POINT,
            WHITEBOARD,
            AV_EQUIPMENT,
            POSTGRAD,
            UNDERGRAD,
            CONTAINS_ARTWORK,
        ];
        for (const facilityTypeId of originalFilters) {
            await expect(page.getByTestId(`filtertype-${facilityTypeId}`).locator('input')).toBeChecked();
        }
        let finalFilters = originalFilters;

        // select a new facility type
        await expect(page.getByTestId(`filtertype-${EXAM_FRIENDLY}`).locator('input')).toBeVisible();
        await expect(page.getByTestId(`facility-type-listitem-${EXAM_FRIENDLY}`)).toContainText('Exam Friendly');
        await page
            .getByTestId(`filtertype-${EXAM_FRIENDLY}`)
            .locator('input')
            .click();
        finalFilters.push(EXAM_FRIENDLY);

        // unselect an existing facility type
        await expect(page.getByTestId(`filtertype-${ADJUSTABLE_DESKS}`).locator('input')).toBeVisible();
        await expect(page.getByTestId(`facility-type-listitem-${ADJUSTABLE_DESKS}`)).toContainText('Adjustable desks');
        await page
            .getByTestId(`filtertype-${ADJUSTABLE_DESKS}`)
            .locator('input')
            .click();
        finalFilters = originalFilters.filter(f => f !== ADJUSTABLE_DESKS);

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

        await page.getByRole('combobox', { name: 'Choose the Springshare' }).click();
        await page.getByRole('option', { name: 'Dorothy Hill Engineering and' }).click();

        await expect(page.getByTestId('space_services_page').locator('input')).toBeVisible();
        await expect(page.getByTestId('space_services_page').locator('input')).toBeVisible();
        await page
            .getByTestId('space_services_page')
            .locator('input')
            .fill('http://example.com');

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
            facility_types: finalFilters,
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

    test.describe('Spaces Admin - load errors', () => {
        test('edit space - error locations', async ({ page }) => {
            await page.goto('/admin/spaces/edit/error?user=libSpaces');
            await page.setViewportSize({ width: 1300, height: 1000 });
            // wait for page to load
            await expect(page.getByTestId('admin-spaces-page-title').getByText(/Edit Space/)).toBeVisible();

            await expect(page.getByTestId('load-space-form-error')).toBeVisible();
            await expect(page.getByTestId('load-space-form-error')).toContainText(
                'Something went wrong - please try again later.',
            );
            await expect(page.getByTestId('load-space-form-error')).toContainText('Space details had a problem.');
        });
        test('edit space - 404 locations', async ({ page }) => {
            await page.goto('/admin/spaces/edit/missingRecord?user=libSpaces');
            await page.setViewportSize({ width: 1300, height: 1000 });
            // wait for page to load
            await expect(page.getByTestId('admin-spaces-page-title').getByText(/Edit Space/)).toBeVisible();

            await expect(page.getByTestId('missing-record')).toBeVisible();
            await expect(page.getByTestId('missing-record')).toContainText('There is no Space with ID "missingRecord"'); // 'missingRecord' is the id in mock when it is missing
        });
        test('edit space - weeklyHours api error', async ({ page }) => {
            await page.goto('/admin/spaces/edit/f98g_fwas_5g33?user=libSpaces&responseType=weeklyHoursError');
            await page.setViewportSize({ width: 1300, height: 1000 });
            // wait for page to load
            await expect(page.getByTestId('admin-spaces-page-title').getByText(/Edit Space/)).toBeVisible();

            await expect(page.getByTestId('load-space-form-error')).toBeVisible();
            await expect(page.getByTestId('load-space-form-error')).toContainText(
                'Something went wrong - please try again later.',
            );
            await expect(page.getByTestId('load-space-form-error')).toContainText(
                'Opening hours details had a problem.',
            );
        });
    });

    test.describe('Spaces Admin - save errors', () => {
        test('edit space - server 500', async ({ page }) => {
            await page.goto('/admin/spaces/edit/f98g_fwas_5g33?user=libSpaces&responseType=spaceUpdate500Error');
            await page.setViewportSize({ width: 1300, height: 1000 });
            // wait for page to load
            await expect(page.getByTestId('admin-spaces-page-title').getByText(/Edit Space/)).toBeVisible();

            const facilityTypeId = '7';
            const label = 'On-desk power point';

            // change a checkbox
            const examFriendlyCheckbox = page.getByTestId(`facility-type-listitem-${facilityTypeId}`);
            await expect(examFriendlyCheckbox.locator('label')).toBeVisible();
            await expect(examFriendlyCheckbox.locator('label')).toContainText(label);
            await examFriendlyCheckbox.locator('input').check();

            // save the change
            await expect(page.getByTestId('admin-spaces-save-button-submit')).toBeVisible();
            await expect(page.getByTestId('admin-spaces-save-button-submit')).toContainText('Save');
            await page.getByTestId('admin-spaces-save-button-submit').click();

            await expect(page.getByTestId('message-title')).toBeVisible();
            await expect(page.getByTestId('message-title')).toContainText(
                'An error has occurred during the request and this request cannot be processed. Please contact webmaster@library.uq.edu.au or try again later.',
            );
        });
    });
});
