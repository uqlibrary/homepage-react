import { expect, test } from '@uq/pw/test';
import { assertAccessibility } from '@uq/pw/lib/axe';
import { assertExpectedDataSentToServer, setTestDataCookie } from '@uq/pw/lib/helpers';

import { COLOR_UQPURPLE } from '@uq/pw/lib/constants';

const TAB_ABOUT = 'tab-about';
const TAB_FACILITY_TYPES = 'tab-facility-types';
const TABS_LOCATION_HOURS = 'tab-location-hours';
const TAB_IMAGERY = 'tab-imagery';

const LAW_DEFAULT_LATITUDE = '-27.49718';
const LAW_DEFAULT_LONGITUDE = '153.01214';

test.describe('Spaces Admin - edit spaces', () => {
    test('can navigate from dashboard to edit page', async ({ page }) => {
        await page.goto('/admin/spaces?user=libSpaces');
        await page.setViewportSize({ width: 1300, height: 1000 });

        await expect(page.getByTestId('admin-spaces-page-title').getByText(/Manage Spaces/)).toBeVisible();

        const editButton1 = page.getByTestId('edit-space-123456-button');

        await expect(editButton1).toBeVisible();
        await editButton1.click();

        await expect(page).toHaveURL('http://localhost:2020/admin/spaces/edit/f98g_fwas_5g33?user=libSpaces');
    });
});
test.describe('Spaces Admin - edit pages load with correct data', () => {
    test('Library Space 1 edit page loads correctly', async ({ page }) => {
        await page.goto('/admin/spaces/edit/f98g_fwas_5g33?user=libSpaces');
        await page.setViewportSize({
            width: 1300,
            height: 1000,
        });
        // wait for page to load
        await expect(page.getByTestId('admin-spaces-page-title').getByText(/Edit Space/)).toBeVisible();
        await expect(page.getByTestId('space-name').locator('input')).toBeVisible();
        await expect(page.getByTestId('space-name').locator('input')).toHaveValue('01-W431');
        await expect(page.getByTestId('space-type').locator('input')).toBeVisible();
        await expect(page.getByTestId('space-type').locator('input')).toHaveValue('Collaborative space');

        // change to facility type tab
        await page.getByTestId(TAB_FACILITY_TYPES).click();

        // all the facility types appear in the "space form", not just the ones currently attached to a space
        const numberFacilityTypesInMockFacilityTypes = 52;
        await expect(page.getByTestId('facility-type-checkbox-list').locator('input[type="checkbox"]')).toHaveCount(
            numberFacilityTypesInMockFacilityTypes,
        );

        // change to Location tab
        await page.getByTestId(TABS_LOCATION_HOURS).click();

        await expect(page.getByTestId('add-space-select-campus').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-select-campus')).toContainText('St Lucia');
        await expect(page.getByTestId('add-space-select-library').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-select-library')).toContainText('Walter Harrison Law Library');
        await expect(page.getByTestId('add-space-select-floor').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-select-floor')).toContainText('Walter Harrison Law Library - 1');
        await expect(page.getByTestId('add-space-precise-location').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-precise-location').locator('input')).toHaveValue('Westernmost corner');
        await expect(page.getByTestId('add-space-pretty-location')).toBeVisible();
        await expect(page.getByTestId(`add-space-pretty-location`)).toBeVisible();
        await expect(page.getByTestId(`add-space-pretty-location`).locator('.location-precise')).toContainText(
            'Westernmost corner',
        );
        await expect(page.getByTestId(`add-space-pretty-location`).locator('.location-floor')).toContainText('Level 2');
        await expect(page.getByTestId(`add-space-pretty-location`).locator('.location-library')).toContainText(
            'Walter Harrison Law Library',
        );
        await expect(page.getByTestId(`add-space-pretty-location`).locator('.location-building')).toContainText(
            'Forgan Smith Building (0001)',
        );
        await expect(page.getByTestId(`add-space-pretty-location`).locator('.location-campus')).toContainText(
            'St Lucia',
        );

        await expect(page.getByTestId('add-space-springshare-id').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-springshare-id')).toContainText('Walter Harrison Law');

        const mapTab = (tabId: number) =>
            page.getByTestId('spaces-campus-maps-tabs').locator(`button:nth-of-type(${tabId})`);
        await expect(mapTab(1)).toHaveCSS('color', COLOR_UQPURPLE);
        await expect(mapTab(2)).toHaveCSS('color', 'rgba(0, 0, 0, 0.6)');
        await expect(mapTab(3)).toHaveCSS('color', 'rgba(0, 0, 0, 0.6)');

        await expect(page.getByTestId('space-opening-hours-override').locator('input')).toBeVisible();
        await expect(page.getByTestId('space-opening-hours-override').locator('input')).toHaveValue('');

        await expect(page.getByTestId('space_services_page').locator('input')).toBeVisible();
        await expect(page.getByTestId('space_services_page').locator('input')).toHaveValue(
            'https://web.library.uq.edu.au/visit/walter-harrison-law-library',
        );

        // await expect(page.getByTestId('space-photo-url').locator('input')).toBeVisible();
        // await expect(page.getByTestId('space-photo-url').locator('input')).toHaveValue(
        //     'https://campuses.uq.edu.au/files/35116/01-E107%20%28Resize%29.jpg',
        // );

        // change to imagery tab
        await page.getByTestId(TAB_IMAGERY).click();

        await expect(page.getByTestId('dropzone-preview').locator('img')).toBeVisible();
        await expect(page.getByTestId('dropzone-preview').locator('img')).toHaveAttribute(
            'src',
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
    test('Library Space 2 edit page loads correctly', async ({ page }) => {
        await page.goto('/admin/spaces/edit/df40_2jsf_zdk5?user=libSpaces');
        await page.setViewportSize({
            width: 1300,
            height: 1000,
        });
        // wait for page to load
        await expect(page.getByTestId('admin-spaces-page-title').getByText(/Edit Space/)).toBeVisible();

        await expect(page.getByTestId('space-name').locator('input')).toBeVisible();
        await expect(page.getByTestId('space-name').locator('input')).toHaveValue('6078');
        await expect(page.getByTestId('space-type').locator('input')).toBeVisible();
        await expect(page.getByTestId('space-type').locator('input')).toHaveValue('Group Study Room');

        // change to Facility-type tab
        await page.getByTestId(TAB_FACILITY_TYPES).click();

        // all the facility types appear in the "space form", not just the ones currently attached to a space
        const numberFacilityTypesInMockFacilityTypes = 52;
        await expect(page.getByTestId('facility-type-checkbox-list').locator('input[type="checkbox"]')).toHaveCount(
            numberFacilityTypesInMockFacilityTypes,
        );

        // change to Location tab
        await page.getByTestId(TABS_LOCATION_HOURS).click();

        await expect(page.getByTestId('add-space-select-campus').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-select-campus')).toContainText('Dutton Park');
        await expect(page.getByTestId('add-space-select-library').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-select-library')).toContainText('Dutton Park Health Sciences');
        await expect(page.getByTestId('add-space-select-floor').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-select-floor')).toContainText('Dutton Park Health Sciences - 65');
        await expect(page.getByTestId('add-space-precise-location').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-precise-location').locator('input')).toBeEmpty();

        await expect(page.getByTestId('add-space-pretty-location')).toBeVisible();
        await expect(page.getByTestId('add-space-pretty-location').locator('.location-precise')).not.toBeVisible();
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

        await expect(page.getByTestId('add-space-springshare-id').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-springshare-id')).toContainText('Dutton Park Health Science');

        const mapTab = (tabId: number) =>
            page.getByTestId('spaces-campus-maps-tabs').locator(`button:nth-of-type(${tabId})`);
        await expect(mapTab(1)).toHaveCSS('color', 'rgba(0, 0, 0, 0.6)');
        await expect(mapTab(2)).toHaveCSS('color', 'rgba(0, 0, 0, 0.6)');
        await expect(mapTab(3)).toHaveCSS('color', COLOR_UQPURPLE);

        await expect(page.getByTestId('space-opening-hours-override').locator('input')).toBeVisible();
        await expect(page.getByTestId('space-opening-hours-override').locator('input')).toHaveValue(
            'this space opens at 8am',
        );

        await expect(page.getByTestId('space_services_page').locator('input')).toBeVisible();
        await expect(page.getByTestId('space_services_page').locator('input')).toHaveValue(
            'https://web.library.uq.edu.au/visit/dutton-park-health-sciences-library',
        );

        // change to imagery tab
        await page.getByTestId(TAB_IMAGERY).click();

        // await expect(page.getByTestId('space-photo-url').locator('input')).toBeVisible();
        // await expect(page.getByTestId('space-photo-url').locator('input')).toBeEmpty();
        await expect(page.getByTestId('dropzone-preview')).not.toBeVisible();

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
    test('Library Space 3, Andrew Liveris building, edit page loads correctly', async ({ page }) => {
        await page.goto('/admin/spaces/edit/97fd5_nm39_gh29?user=libSpaces');
        await page.setViewportSize({
            width: 1300,
            height: 1000,
        });
        // wait for page to load
        await expect(page.getByTestId('admin-spaces-page-title').getByText(/Edit Space/)).toBeVisible();

        await expect(page.getByTestId('space-name').locator('input')).toBeVisible();
        await expect(page.getByTestId('space-name').locator('input')).toHaveValue('46-342/343');
        await expect(page.getByTestId('space-type').locator('input')).toBeVisible();
        await expect(page.getByTestId('space-type').locator('input')).toHaveValue('Computer room');

        // change to Facility type tab
        await page.getByTestId(TAB_FACILITY_TYPES).click();

        // all the facility types appear in the "space form", not just the ones currently attached to a space
        const numberFacilityTypesInMockFacilityTypes = 52;
        await expect(page.getByTestId('facility-type-checkbox-list').locator('input[type="checkbox"]')).toHaveCount(
            numberFacilityTypesInMockFacilityTypes,
        );

        // change to Location tab
        await page.getByTestId(TABS_LOCATION_HOURS).click();

        await expect(page.getByTestId('add-space-select-campus').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-select-campus')).toContainText('St Lucia');
        await expect(page.getByTestId('add-space-select-library').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-select-library')).toContainText('imaginary Liveris Library');
        await expect(page.getByTestId('add-space-select-floor').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-select-floor')).toContainText('imaginary Liveris Library - 72');
        await expect(page.getByTestId('add-space-precise-location').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-precise-location').locator('input')).toHaveValue('Eastern corner');
        await expect(page.getByTestId('add-space-pretty-location')).toBeVisible();

        await expect(page.getByTestId('add-space-pretty-location')).toBeVisible();
        await expect(page.getByTestId('add-space-pretty-location').locator('.location-precise')).toContainText(
            'Eastern corner',
        );
        await expect(page.getByTestId('add-space-pretty-location').locator('.location-floor')).toContainText('Level 1');
        await expect(page.getByTestId('add-space-pretty-location').locator('.location-library')).toContainText(
            'imaginary Liveris Library',
        );
        await expect(page.getByTestId('add-space-pretty-location').locator('.location-building')).toContainText(
            'Andrew N. Liveris (0046)',
        );
        await expect(page.getByTestId('add-space-pretty-location').locator('.location-campus')).toContainText(
            'St Lucia',
        );

        await expect(page.getByTestId('add-space-springshare-id').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-springshare-id')).toContainText(
            'No Springshare opening hours will display (click to change)',
        );

        const mapTab = (tabId: number) =>
            page.getByTestId('spaces-campus-maps-tabs').locator(`button:nth-of-type(${tabId})`);
        await expect(mapTab(1)).toHaveCSS('color', COLOR_UQPURPLE);
        await expect(mapTab(2)).toHaveCSS('color', 'rgba(0, 0, 0, 0.6)');
        await expect(mapTab(3)).toHaveCSS('color', 'rgba(0, 0, 0, 0.6)');

        await expect(page.getByTestId('space-opening-hours-override').locator('input')).toBeVisible();
        await expect(page.getByTestId('space-opening-hours-override').locator('input')).toHaveValue(
            'Open from 7am Monday - Friday',
        );

        await expect(page.getByTestId('space_services_page').locator('input')).toBeVisible();
        await expect(page.getByTestId('space_services_page').locator('input')).toBeEmpty();

        // change to imagery tab
        await page.getByTestId(TAB_IMAGERY).click();

        // await expect(page.getByTestId('space-photo-url').locator('input')).toBeVisible();
        // await expect(page.getByTestId('space-photo-url').locator('input')).toHaveValue(
        //     'https://campuses.uq.edu.au/files/35424/46-342-343.JPG',
        // );
        await expect(page.getByTestId('dropzone-preview').locator('img')).toBeVisible();
        await expect(page.getByTestId('dropzone-preview').locator('img')).toHaveAttribute(
            'src',
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
        await assertAccessibility(page, '[data-testid="SpacesAdminPage"]');
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

    // to test the required fields are the only required fields, we have to clear all the other fields!!! Not a realistic thing a user would do, but it meets the mentioned need
    test('can save with only required fields', async ({ page, context }) => {
        await setTestDataCookie(context, page);

        await expect(page.getByTestId('space-name').locator('input')).toBeVisible();
        await expect(page.getByTestId('space-name').locator('input')).toHaveValue('01-W431');

        // clear as many of the non-required fields as is possible and confirm will submit

        // clear description field manually!
        await page.getByRole('textbox', { name: 'Enter new Space type' }).click();
        await page.getByRole('textbox', { name: 'Editor editing area: main' }).press('ControlOrMeta+a');
        await page.getByRole('textbox', { name: 'Editor editing area: main' }).press('ControlOrMeta+x');

        // change to facility type tab
        await page.getByTestId(TAB_FACILITY_TYPES).click();

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

        // change to Location tab
        await page.getByTestId(TABS_LOCATION_HOURS).click();

        // locations are inherently unclearable

        await expect(page.getByTestId('add-space-precise-location').locator('input')).toBeVisible();
        await page
            .getByTestId('add-space-precise-location')
            .locator('input')
            .fill('');

        await expect(page.getByTestId('add-space-springshare-id').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-springshare-id')).toContainText('Walter Harrison Law');
        await page.getByTestId('add-space-springshare-id').click();
        await page.locator('ul[aria-labelledby="add-space-springshare-id-label"] li:first-of-type').click();
        await expect(page.getByTestId('add-space-springshare-id')).toContainText(
            'No Springshare opening hours will display',
        );

        await expect(page.getByTestId('space-opening-hours-override').locator('input')).toBeVisible();
        await page
            .getByTestId('space-opening-hours-override')
            .locator('input')
            .fill('');

        await expect(page.getByTestId('space_services_page').locator('input')).toBeVisible();
        await expect(page.getByTestId('space_services_page').locator('input')).toHaveValue(
            'https://web.library.uq.edu.au/visit/walter-harrison-law-library',
        );
        await page
            .getByTestId('space_services_page')
            .locator('input')
            .fill('');

        // change to Imagery tab
        await page.getByTestId(TAB_IMAGERY).click();

        // clear the image
        await expect(page.getByTestId('dropzone-preview').locator('img')).toBeVisible();
        await expect(page.getByTestId('dropzone-preview').locator('img')).toHaveAttribute(
            'src',
            'https://campuses.uq.edu.au/files/35116/01-E107%20%28Resize%29.jpg',
        );
        await expect(page.getByTestId('spaces-form-remove-image')).toBeVisible();
        await page.getByTestId('spaces-form-remove-image').click();

        await expect(page.getByTestId('dropzone-preview').locator('img')).not.toBeVisible();

        // clear the img alt text
        await expect(page.getByTestId('add-space-photo-description')).toBeVisible();
        await page.getByTestId('add-space-photo-description').fill('');

        // click save button
        await expect(page.getByTestId('admin-spaces-save-button-submit')).toBeVisible();
        await page.getByTestId('admin-spaces-save-button-submit').click();

        await expect(page.getByTestId('message-title')).toBeVisible();
        await expect(page.getByTestId('message-title')).toContainText('The Space has been updated');

        // check the data we pretended to send to the server matches what we expect
        // acts as check of what we sent to api
        const expectedValues = {
            space_id: 123456,
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
            space_latitude: LAW_DEFAULT_LATITUDE, // can't clear map fields
            space_longitude: LAW_DEFAULT_LONGITUDE,
            uploadedFile: [],
        };
        await assertExpectedDataSentToServer(page, expectedValues);
    });
    test('tabs work as expected', async ({ page }) => {
        const cancelButton = page.getByTestId('admin-spaces-form-button-cancel');
        const saveButton = page.getByTestId('admin-spaces-save-button-submit');
        const photoDescriptionField = page
            .getByTestId(`space_photo_description`)
            .locator('textarea')
            .first();
        const spaceNameField = page.getByTestId('space-name').locator('input');
        const ASKUS_FILTER_TYPE = 54;
        const firstFacilityTypeCheckbox = page.getByTestId(`filtertype-${ASKUS_FILTER_TYPE}`).locator('input');
        const LocationCampusSelector = page.getByTestId(`add-space-select-campus`).locator('input');

        await expect(page.getByTestId(TAB_ABOUT)).toBeVisible();
        await expect(page.getByTestId(TAB_ABOUT)).toHaveAttribute('aria-selected', 'true');
        await expect(page.getByTestId(TAB_FACILITY_TYPES)).toBeVisible();
        await expect(page.getByTestId(TAB_FACILITY_TYPES)).toHaveAttribute('aria-selected', 'false');
        await expect(page.getByTestId(TABS_LOCATION_HOURS)).toBeVisible();
        await expect(page.getByTestId(TABS_LOCATION_HOURS)).toHaveAttribute('aria-selected', 'false');
        await expect(page.getByTestId(TAB_IMAGERY)).toBeVisible();
        await expect(page.getByTestId(TAB_IMAGERY)).toHaveAttribute('aria-selected', 'false');

        // panel 1 fields visible
        await expect(spaceNameField).toBeVisible();
        await expect(page.getByTestId('space-type').locator('input')).toBeVisible();
        await expect(page.getByTestId('add-space-type-new').locator('input')).toBeVisible();

        // other panel fields NOT visible
        await expect(firstFacilityTypeCheckbox).toBeDefined();
        await expect(firstFacilityTypeCheckbox).not.toBeVisible();
        await expect(LocationCampusSelector).toBeDefined();
        await expect(LocationCampusSelector).not.toBeVisible();
        await expect(photoDescriptionField).toBeDefined();
        await expect(photoDescriptionField).not.toBeVisible();

        // form control buttons always visible
        await expect(cancelButton).toBeVisible();
        await expect(cancelButton).toContainText('Cancel');
        await expect(saveButton).toBeVisible();
        await expect(saveButton).toContainText('Save');

        // change to facility type tab
        await page.getByTestId(TAB_FACILITY_TYPES).click();

        await expect(page.getByTestId(TAB_ABOUT)).toBeVisible();
        await expect(page.getByTestId(TAB_ABOUT)).toHaveAttribute('aria-selected', 'false');
        await expect(page.getByTestId(TAB_FACILITY_TYPES)).toBeVisible();
        await expect(page.getByTestId(TAB_FACILITY_TYPES)).toHaveAttribute('aria-selected', 'true');
        await expect(page.getByTestId(TABS_LOCATION_HOURS)).toBeVisible();
        await expect(page.getByTestId(TABS_LOCATION_HOURS)).toHaveAttribute('aria-selected', 'false');
        await expect(page.getByTestId(TAB_IMAGERY)).toBeVisible();
        await expect(page.getByTestId(TAB_IMAGERY)).toHaveAttribute('aria-selected', 'false');

        // panel 2 fields visible
        await expect(firstFacilityTypeCheckbox).toBeVisible();

        // other panel fields NOT visible
        await expect(spaceNameField).toBeDefined();
        await expect(spaceNameField).not.toBeVisible();
        await expect(LocationCampusSelector).toBeDefined();
        await expect(LocationCampusSelector).not.toBeVisible();
        await expect(photoDescriptionField).toBeDefined();
        await expect(photoDescriptionField).not.toBeVisible();

        // form control buttons always visible
        await expect(cancelButton).toBeVisible();
        await expect(cancelButton).toContainText('Cancel');
        await expect(saveButton).toBeVisible();
        await expect(saveButton).toContainText('Save');

        // change to location tab
        await page.getByTestId(TABS_LOCATION_HOURS).click();

        await expect(page.getByTestId(TAB_ABOUT)).toBeVisible();
        await expect(page.getByTestId(TAB_ABOUT)).toHaveAttribute('aria-selected', 'false');
        await expect(page.getByTestId(TAB_FACILITY_TYPES)).toBeVisible();
        await expect(page.getByTestId(TAB_FACILITY_TYPES)).toHaveAttribute('aria-selected', 'false');
        await expect(page.getByTestId(TABS_LOCATION_HOURS)).toBeVisible();
        await expect(page.getByTestId(TABS_LOCATION_HOURS)).toHaveAttribute('aria-selected', 'true');
        await expect(page.getByTestId(TAB_IMAGERY)).toBeVisible();
        await expect(page.getByTestId(TAB_IMAGERY)).toHaveAttribute('aria-selected', 'false');

        // panel 3 fields visible
        await expect(LocationCampusSelector).toBeVisible();

        // other panel fields NOT visible
        await expect(spaceNameField).toBeDefined();
        await expect(spaceNameField).not.toBeVisible();
        await expect(firstFacilityTypeCheckbox).toBeDefined();
        await expect(firstFacilityTypeCheckbox).not.toBeVisible();
        await expect(photoDescriptionField).toBeDefined();
        await expect(photoDescriptionField).not.toBeVisible();

        // form control buttons always visible
        await expect(cancelButton).toBeVisible();
        await expect(cancelButton).toContainText('Cancel');
        await expect(saveButton).toBeVisible();
        await expect(saveButton).toContainText('Save');

        // change to imagery tab
        await page.getByTestId(TAB_IMAGERY).click();

        await expect(page.getByTestId(TAB_ABOUT)).toBeVisible();
        await expect(page.getByTestId(TAB_ABOUT)).toHaveAttribute('aria-selected', 'false');
        await expect(page.getByTestId(TAB_FACILITY_TYPES)).toBeVisible();
        await expect(page.getByTestId(TAB_FACILITY_TYPES)).toHaveAttribute('aria-selected', 'false');
        await expect(page.getByTestId(TABS_LOCATION_HOURS)).toBeVisible();
        await expect(page.getByTestId(TABS_LOCATION_HOURS)).toHaveAttribute('aria-selected', 'false');
        await expect(page.getByTestId(TAB_IMAGERY)).toBeVisible();
        await expect(page.getByTestId(TAB_IMAGERY)).toHaveAttribute('aria-selected', 'true');

        // panel 4 fields visible
        await expect(photoDescriptionField).toBeVisible();

        // other panel fields NOT visible
        await expect(spaceNameField).toBeDefined();
        await expect(spaceNameField).not.toBeVisible();
        await expect(firstFacilityTypeCheckbox).toBeDefined();
        await expect(firstFacilityTypeCheckbox).not.toBeVisible();
        await expect(LocationCampusSelector).toBeDefined();
        await expect(LocationCampusSelector).not.toBeVisible();

        // form control buttons always visible
        await expect(cancelButton).toBeVisible();
        await expect(cancelButton).toContainText('Cancel');
        await expect(saveButton).toBeVisible();
        await expect(saveButton).toContainText('Save');
    });
    test('can re-edit after save', async ({ page }) => {
        // click save button
        await expect(page.getByTestId('admin-spaces-save-button-submit')).toBeVisible();
        await page.getByTestId('admin-spaces-save-button-submit').click();

        // change the title so when we reload the page from "edit again" we can check the page has actually reloaded
        // by showing the immmutable mock data has reverted
        await expect(page.getByTestId('space-name').locator('input')).toBeVisible();
        await expect(page.getByTestId('space-name').locator('input')).toHaveValue('01-W431');
        await page
            .getByTestId('space-name')
            .locator('input')
            .fill('New space name');

        await expect(page.getByTestId('message-title')).toBeVisible();
        await expect(page.getByTestId('message-title')).toContainText('The Space has been updated');
        await expect(page.getByTestId('confirm-spaces-save-outcome')).toBeVisible();
        await expect(page.getByTestId('confirm-spaces-save-outcome')).toContainText('Return to dashboard');
        await expect(page.getByTestId('cancel-spaces-save-outcome')).toBeVisible();
        await expect(page.getByTestId('cancel-spaces-save-outcome')).toContainText('Edit record again');
        await page.getByTestId('cancel-spaces-save-outcome').click();

        await expect(page.getByTestId('message-title')).not.toBeVisible();
        await expect(page).toHaveURL('http://localhost:2020/admin/spaces/edit/f98g_fwas_5g33?user=libSpaces');
        await expect(page.getByTestId('space-name').locator('input')).toBeVisible();
        // page has reloaded, not just closed dialog, as mock data has reverted
        await expect(page.getByTestId('space-name').locator('input')).toHaveValue('01-W431');
    });
    test('can return to dashboard after save', async ({ page }) => {
        // click save button
        await expect(page.getByTestId('admin-spaces-save-button-submit')).toBeVisible();
        await page.getByTestId('admin-spaces-save-button-submit').click();

        await expect(page.getByTestId('message-title')).toBeVisible();
        await expect(page.getByTestId('message-title')).toContainText('The Space has been updated');
        await expect(page.getByTestId('confirm-spaces-save-outcome')).toBeVisible();
        await expect(page.getByTestId('confirm-spaces-save-outcome')).toContainText('Return to dashboard');
        await expect(page.getByTestId('cancel-spaces-save-outcome')).toBeVisible();
        await expect(page.getByTestId('cancel-spaces-save-outcome')).toContainText('Edit record again');
        await page.getByTestId('confirm-spaces-save-outcome').click();

        await expect(page.getByTestId('message-title')).not.toBeVisible();
        await expect(page).toHaveURL('http://localhost:2020/admin/spaces?user=libSpaces');
    });
    test('can change all fields in edit', async ({ page, context }) => {
        await setTestDataCookie(context, page);

        // await page.getByRole('textbox', { name: 'Space name *' }).click();
        const nameField = page.getByTestId('space-name').locator('input');
        await expect(nameField).toBeVisible();
        await nameField.press('ControlOrMeta+a');
        await nameField.fill('New space name');
        await nameField.press('Tab');

        await page.getByRole('combobox', { name: 'Choose an existing Space type' }).press('Tab');
        const typeField = page.getByRole('textbox', { name: 'Enter new Space type' });
        await typeField.fill('New space type');
        await typeField.press('Tab');

        await page.getByText('Ut enim ad minim veniam, quis').click();
        const descriptionField = page.getByRole('textbox', { name: 'Editor editing area: main' });
        await descriptionField.press('ControlOrMeta+a');
        await descriptionField.fill('a long description that has a number of words');

        // check the typed in "Enter new space type" has transferred to the dropdown
        // (the "new space type" field auto clears on blur, and the select preloads)
        await nameField.click();
        await expect(page.getByTestId('add-space-type-new').locator('input')).toBeEmpty();
        await expect(page.getByTestId('space-type').locator('input')).toHaveValue('New space type');

        // change to Facility types tab
        await page.getByTestId(TAB_FACILITY_TYPES).click();

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

        // change to Location tab
        await page.getByTestId(TABS_LOCATION_HOURS).click();

        await page
            .getByRole('combobox', {
                name: 'Campus * St Lucia',
            })
            .click();
        await page.getByRole('option', { name: 'Gatton' }).click();
        await page
            .getByRole('combobox', {
                name: 'Library * J.K. Murray Library',
            })
            .click();
        await page
            .getByRole('option', {
                name: 'Library Warehouse',
            })
            .click();
        await page
            .getByRole('combobox', {
                name: 'Level * 1 [Library Warehouse',
            })
            .click();
        await page
            .getByRole('option', {
                name: '[Library Warehouse - 32]',
            })
            .click();

        await expect(page.getByTestId('add-space-precise-location').locator('input')).toBeVisible();
        await page
            .getByTestId('add-space-precise-location')
            .locator('input')
            .fill('somewhere deep in the bowels of the warehouse');

        await page
            .getByRole('combobox', {
                name: 'Choose the Springshare',
            })
            .click();
        await page
            .getByRole('option', {
                name: 'Dorothy Hill Engineering and',
            })
            .click();

        await expect(page.getByTestId('space_services_page').locator('input')).toBeVisible();
        await expect(page.getByTestId('space_services_page').locator('input')).toBeVisible();
        await page
            .getByTestId('space_services_page')
            .locator('input')
            .fill('http://example.com');

        await page
            .getByRole('textbox', {
                name: 'An extra line about opening',
            })
            .fill('space is open from 7am');

        // change to imagery tab
        await page.getByTestId(TAB_IMAGERY).click();

        // await expect(page.getByTestId('space-photo-url').locator('input')).toBeVisible();
        // await page
        //     .getByTestId('space-photo-url')
        //     .locator('input')
        //     .fill('http://example.com/x.png');
        await expect(page.getByTestId('dropzone-preview').locator('img')).toBeVisible();
        // TODO drag img

        await expect(page.getByTestId('add-space-photo-description')).toBeVisible();
        await page.getByTestId('add-space-photo-description').fill('words about the photo');

        // click save button
        await expect(page.getByTestId('admin-spaces-save-button-submit')).toBeVisible();
        await page.getByTestId('admin-spaces-save-button-submit').click();

        await expect(page.getByTestId('message-title')).toBeVisible();
        await expect(page.getByTestId('message-title')).toContainText('The Space has been updated');

        // check the data we pretended to send to the server matches what we expect
        // acts as check of what we sent to api
        const expectedValues = {
            space_id: 123456,
            space_floor_id: 32,
            space_name: 'New space name', // required field
            space_type: 'New space type', // required field
            facility_types: finalFilters,
            space_precise: 'somewhere deep in the bowels of the warehouse',
            space_description: '<p>a long description that has a number of words</p>',
            space_photo_url: 'https://campuses.uq.edu.au/files/35116/01-E107%20%28Resize%29.jpg',
            // space_photo_url: 'http://example.com/x.png',
            space_photo_description: 'words about the photo',
            space_opening_hours_id: 3825,
            space_services_page: 'http://example.com',
            space_opening_hours_override: 'space is open from 7am',
            space_latitude: LAW_DEFAULT_LATITUDE, // TODO: drag an drop to change these
            space_longitude: LAW_DEFAULT_LONGITUDE,
        };
        await assertExpectedDataSentToServer(page, expectedValues);
    });

    test('edit spaces page save dialog is accessible', async ({ page }) => {
        await expect(page.getByTestId('admin-spaces-save-button-submit')).toBeVisible();
        await page.getByTestId('admin-spaces-save-button-submit').click();

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
            await page.setViewportSize({
                width: 1300,
                height: 1000,
            });
            // wait for page to load
            await expect(page.getByTestId('admin-spaces-page-title').getByText(/Edit Space/)).toBeVisible();

            const facilityTypeId = '7';
            const label = 'On-desk power point';

            // change to Facility type tab
            await page.getByTestId(TAB_FACILITY_TYPES).click();

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
