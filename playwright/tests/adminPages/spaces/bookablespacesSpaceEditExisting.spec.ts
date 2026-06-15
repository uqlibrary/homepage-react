import { expect, test } from '@uq/pw/test';
import { assertAccessibility } from '@uq/pw/lib/axe';
import { assertExpectedDataSentToServer, setTestDataCookie } from '@uq/pw/lib/helpers';

import { COLOR_UQPURPLE } from '@uq/pw/lib/constants';

import { default as bookableSpaces } from '../../../../src/data/mock/data/records/bookableSpaces/bookableSpaces_all.js';

const TAB_ABOUT = 'tab-about';
const TAB_FACILITY_TYPES = 'tab-facility-types';
const TABS_LOCATION_HOURS = 'tab-location-hours';
const TAB_UNAVAILABILITY = 'tab-unavailability';
const TAB_IMAGERY = 'tab-imagery';

const LAW_DEFAULT_LATITUDE = '-27.49718';
const LAW_DEFAULT_LONGITUDE = '153.01214';

const DUHIG_TOWER_SPRINGSHARE_SPACE_ID = 3831;
const EDIT_SPACE_VIEWPORT = { width: 1300, height: 1000 };

import { Page } from '@playwright/test';

const chooseAnySpaceType = async (page: Page) => {
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

const selectCombobox = (fieldName: string, page: Page) => page.getByTestId(fieldName).locator('[role="combobox"]');

const openEditSpacePage = async (
    page: Page,
    spaceUuid: string,
    search = '?user=libSpaces',
    options: { waitForTitle?: boolean; waitForForm?: boolean } = {},
) => {
    const { waitForTitle = true, waitForForm = true } = options;
    await page.goto(`/admin/spaces/edit/${spaceUuid}${search}`);
    await page.setViewportSize(EDIT_SPACE_VIEWPORT);
    await expect(page).toHaveURL(new RegExp(`/admin/spaces/edit/${spaceUuid}`), { timeout: 30_000 });
    if (waitForTitle) {
        await expect(page.getByTestId('admin-spaces-page-title')).toBeVisible({ timeout: 30_000 });
    }
    if (waitForForm) {
        await expect(page.getByTestId('space-name').locator('input')).toBeVisible({ timeout: 30_000 });
        await expect(page.getByTestId('admin-spaces-save-button-submit')).toBeVisible({ timeout: 30_000 });
    }
};

const waitForSaveOutcomeDialog = async (page: Page, expectedTitleText: string) => {
    await expect(page.getByTestId('dialogbox-spaces-save-outcome')).toBeVisible({ timeout: 30_000 });
    await expect(page.getByTestId('message-title')).toBeVisible({ timeout: 30_000 });
    await expect(page.getByTestId('message-title')).toContainText(expectedTitleText);
};

const ensureSpaceTypeSelected = async (page: Page) => {
    await page.getByTestId(TAB_ABOUT).click();
    const nativeSpaceTypeInput = page.locator('#add-space-type-input');
    await expect(nativeSpaceTypeInput).toBeAttached();

    const currentSelectionId = await nativeSpaceTypeInput.inputValue();
    if (currentSelectionId) {
        return null;
    }

    return chooseAnySpaceType(page);
};

const chooseDifferentSpaceType = async (page: Page) => {
    const spaceTypeCombobox = page.getByRole('combobox', { name: 'Choose an existing Space type *' });
    await expect(spaceTypeCombobox).toBeVisible();
    const currentSpaceTypeName = ((await spaceTypeCombobox.textContent()) || '').trim();

    const spaceTypeSelector = page.getByTestId('space-type');
    await spaceTypeSelector.click();

    const spaceTypeOptions = page.locator('ul[aria-labelledby="add-space-type-label"] li[role="option"]');
    const optionCount = await spaceTypeOptions.count();
    for (let i = 0; i < optionCount; i += 1) {
        const option = spaceTypeOptions.nth(i);
        const optionText = (await option.textContent())?.trim() || '';
        if (optionText !== currentSpaceTypeName) {
            const selectedSpaceTypeId = await option.getAttribute('data-value');
            await option.click();
            expect(selectedSpaceTypeId).toBeTruthy();
            return Number(selectedSpaceTypeId);
        }
    }

    throw new Error('No alternate space type option available in dropdown');
};

const originalMockData = (spaceUud: string) => {
    const mockData = bookableSpaces?.data?.locations?.find(b => b.space_uuid === spaceUud);
    const mockDataFacilities = mockData?.facility_types?.map(ft => ft.facility_type_id) || [];
    return {
        space_id: mockData?.space_id,
        space_floor_id: mockData?.space_floor_id,
        space_name: mockData?.space_name, // required field
        space_type_id: mockData?.space_type_id, // required field
        facility_types: [...mockDataFacilities],
        space_capacity: mockData?.space_capacity,
        space_precise: mockData?.space_precise,
        space_description: mockData?.space_description,
        space_photo_url: mockData?.space_photo_url,
        space_photo_description: mockData?.space_photo_description,
        space_opening_hours_id: mockData?.space_opening_hours_id,
        space_services_page: mockData?.space_services_page,
        space_latitude: mockData?.space_latitude,
        space_longitude: mockData?.space_longitude,
        space_zlevel: mockData?.space_zlevel,
        space_external_book_url: mockData?.space_external_book_url,
        space_draftmode: mockData?.space_draftmode,
    };
};

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
        await openEditSpacePage(page, 'f98g_fwas_5g33');
        await expect(page.getByTestId('space-name').locator('input')).toBeVisible();
        await expect(page.getByTestId('space-name').locator('input')).toHaveValue('01-W431');
        await expect(page.getByRole('combobox', { name: 'Choose an existing Space type *' })).toBeVisible();

        // change to facility type tab
        await page.getByTestId(TAB_FACILITY_TYPES).click();

        // all the facility types appear in the "space form", not just the ones currently attached to a space
        const numberFacilityTypesInMockFacilityTypes = 51;
        await expect(page.getByTestId('facility-type-checkbox-list').locator('input[type="checkbox"]')).toHaveCount(
            numberFacilityTypesInMockFacilityTypes,
        );

        await page.getByTestId(TAB_ABOUT).click();

        await expect(page.getByTestId('add-space-select-campus').locator('input')).toBeVisible();
        await expect(selectCombobox('add-space-select-campus', page)).toContainText('St Lucia');
        await expect(page.getByTestId('add-space-select-library').locator('input')).toBeVisible();
        await expect(selectCombobox('add-space-select-library', page)).toContainText('Walter Harrison Law Library');
        await expect(page.getByTestId('add-space-select-floor').locator('input')).toBeVisible();
        await expect(selectCombobox('add-space-select-floor', page)).toContainText('Walter Harrison Law Library - 1');

        // change to Location tab
        await page.getByTestId(TABS_LOCATION_HOURS).click();
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
        await openEditSpacePage(page, 'df40_2jsf_zdk5');

        await expect(page.getByTestId('space-name').locator('input')).toBeVisible();
        await expect(page.getByTestId('space-name').locator('input')).toHaveValue('6078');
        await expect(page.getByRole('combobox', { name: 'Choose an existing Space type *' })).toBeVisible();

        // change to Facility-type tab
        await page.getByTestId(TAB_FACILITY_TYPES).click();

        // all the facility types appear in the "space form", not just the ones currently attached to a space
        const numberFacilityTypesInMockFacilityTypes = 51;
        await expect(page.getByTestId('facility-type-checkbox-list').locator('input[type="checkbox"]')).toHaveCount(
            numberFacilityTypesInMockFacilityTypes,
        );

        await page.getByTestId(TAB_ABOUT).click();

        await expect(page.getByTestId('add-space-select-campus').locator('input')).toBeVisible();
        await expect(selectCombobox('add-space-select-campus', page)).toContainText('Dutton Park');
        await expect(page.getByTestId('add-space-select-library').locator('input')).toBeVisible();
        await expect(selectCombobox('add-space-select-library', page)).toContainText('Dutton Park Health Sciences');
        await expect(page.getByTestId('add-space-select-floor').locator('input')).toBeVisible();
        await expect(selectCombobox('add-space-select-floor', page)).toContainText('Dutton Park Health Sciences - 65');

        // change to Location tab
        await page.getByTestId(TABS_LOCATION_HOURS).click();
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
        await openEditSpacePage(page, '97fd5_nm39_gh29');

        await expect(page.getByTestId('space-name').locator('input')).toBeVisible();
        await expect(page.getByTestId('space-name').locator('input')).toHaveValue('46-342/343');
        await expect(page.getByRole('combobox', { name: 'Choose an existing Space type *' })).toBeVisible();

        // change to Facility type tab
        await page.getByTestId(TAB_FACILITY_TYPES).click();

        // all the facility types appear in the "space form", not just the ones currently attached to a space
        const numberFacilityTypesInMockFacilityTypes = 51;
        await expect(page.getByTestId('facility-type-checkbox-list').locator('input[type="checkbox"]')).toHaveCount(
            numberFacilityTypesInMockFacilityTypes,
        );

        await page.getByTestId(TAB_ABOUT).click();

        await expect(page.getByTestId('add-space-select-campus').locator('input')).toBeVisible();
        await expect(selectCombobox('add-space-select-campus', page)).toContainText('St Lucia');
        await expect(page.getByTestId('add-space-select-library').locator('input')).toBeVisible();
        await expect(selectCombobox('add-space-select-library', page)).toContainText('imaginary Liveris Library');
        await expect(page.getByTestId('add-space-select-floor').locator('input')).toBeVisible();
        await expect(selectCombobox('add-space-select-floor', page)).toContainText('imaginary Liveris Library - 72');

        // change to Location tab
        await page.getByTestId(TABS_LOCATION_HOURS).click();
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
        await expect(page.getByTestId('add-space-springshare-id')).toContainText('Architecture and Music');

        const mapTab = (tabId: number) =>
            page.getByTestId('spaces-campus-maps-tabs').locator(`button:nth-of-type(${tabId})`);
        await expect(mapTab(1)).toHaveCSS('color', COLOR_UQPURPLE);
        await expect(mapTab(2)).toHaveCSS('color', 'rgba(0, 0, 0, 0.6)');
        await expect(mapTab(3)).toHaveCSS('color', 'rgba(0, 0, 0, 0.6)');

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
    test.beforeEach(async ({ page, context }) => {
        await setTestDataCookie(context, page);
        await openEditSpacePage(page, 'f98g_fwas_5g33');
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
    // const SINGLE_OCCUPANCY = 51;

    // to test the required fields are the only required fields, we have to clear all the other fields!!! Not a realistic thing a user would do, but it meets the mentioned need
    test('can save with only required fields', async ({ page, context }) => {
        await setTestDataCookie(context, page);

        await expect(page.getByTestId('space-name').locator('input')).toBeVisible();
        await expect(page.getByTestId('space-name').locator('input')).toHaveValue('01-W431');

        await ensureSpaceTypeSelected(page);

        // clear as many of the non-required fields as is possible and confirm will submit

        // clear description field manually
        const descriptionField = page.getByRole('textbox', { name: /Editing area: main/i });
        await expect(descriptionField).toBeVisible({ timeout: 30_000 });
        await descriptionField.click();
        await descriptionField.press('ControlOrMeta+a');
        await descriptionField.press('ControlOrMeta+x');

        await expect(page.getByTestId('space-can-book').locator('input')).toBeChecked();
        await page
            .getByTestId('space-can-book')
            .locator('input')
            .click();

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
            // SINGLE_OCCUPANCY,
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
            ...originalMockData('f98g_fwas_5g33'),
            facility_types: [],
            space_precise: '',
            space_description: '',
            space_external_book_url: null,
            space_photo_url: '',
            space_photo_description: '',
            space_opening_hours_id: -1,
            space_services_page: '',
            uploadedFile: [],
            archibus_room_id: null,
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
        await expect(page.getByTestId(TAB_UNAVAILABILITY)).toBeVisible();
        await expect(page.getByTestId(TAB_UNAVAILABILITY)).toHaveAttribute('aria-selected', 'false');
        await expect(page.getByTestId(TAB_IMAGERY)).toBeVisible();
        await expect(page.getByTestId(TAB_IMAGERY)).toHaveAttribute('aria-selected', 'false');

        // panel 1 fields visible
        await expect(spaceNameField).toBeVisible();
        await expect(page.getByRole('combobox', { name: 'Choose an existing Space type *' })).toBeVisible();

        // other panel fields NOT visible
        await expect(firstFacilityTypeCheckbox).toBeDefined();
        await expect(firstFacilityTypeCheckbox).not.toBeVisible();
        await expect(LocationCampusSelector).toBeVisible();
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
        await expect(page.getByTestId(TAB_UNAVAILABILITY)).toBeVisible();
        await expect(page.getByTestId(TAB_UNAVAILABILITY)).toHaveAttribute('aria-selected', 'false');
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
        await expect(page.getByTestId(TAB_UNAVAILABILITY)).toBeVisible();
        await expect(page.getByTestId(TAB_UNAVAILABILITY)).toHaveAttribute('aria-selected', 'false');
        await expect(page.getByTestId(TAB_IMAGERY)).toBeVisible();
        await expect(page.getByTestId(TAB_IMAGERY)).toHaveAttribute('aria-selected', 'false');

        // panel 3 fields visible
        await expect(page.getByTestId('add-space-precise-location').locator('input')).toBeVisible();

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
        await expect(page.getByTestId(TAB_UNAVAILABILITY)).toBeVisible();
        await expect(page.getByTestId(TAB_UNAVAILABILITY)).toHaveAttribute('aria-selected', 'false');
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
    test('can return to unavailability after visiting about', async ({ page }) => {
        await page.getByTestId(TAB_UNAVAILABILITY).click();

        await expect(page.getByTestId(TAB_UNAVAILABILITY)).toHaveAttribute('aria-selected', 'true');
        await expect(page.getByTestId('spaces-tabpanel-unavailability')).toBeVisible();
        await expect(page.getByTestId('space-outage-summary')).toBeVisible();
        await expect(page.getByTestId('space-outage-scheduled-heading')).toBeVisible();
        await expect(page.getByTestId('space-outage-past-heading')).toBeVisible();

        await page.getByTestId(TAB_ABOUT).click();

        await expect(page.getByTestId(TAB_ABOUT)).toHaveAttribute('aria-selected', 'true');
        await expect(page.getByTestId('spaces-tabpanel-about')).toBeVisible();
        await expect(page.getByTestId('space-name').locator('input')).toBeVisible();

        await page.getByTestId(TAB_UNAVAILABILITY).click();

        await expect(page.getByTestId(TAB_UNAVAILABILITY)).toHaveAttribute('aria-selected', 'true');
        await expect(page.getByTestId('spaces-tabpanel-unavailability')).toBeVisible();
        await expect(page.getByTestId('space-outage-summary')).toBeVisible();
        await expect(page.getByTestId('space-outage-scheduled-heading')).toBeVisible();
        await expect(page.getByTestId('space-outage-past-heading')).toBeVisible();
    });
    test('unavailability tab separates scheduled and past outages', async ({ page }) => {
        await page.getByTestId(TAB_UNAVAILABILITY).click();

        await expect(page.getByTestId('spaces-tabpanel-unavailability')).toBeVisible();
        await expect(page.getByTestId('space-outage-scheduled-table')).toBeVisible();
        await expect(page.getByTestId('space-outage-past-empty-state')).toBeVisible();

        // Check that at least one scheduled outage row is present (dynamic data)
        const scheduledRows = await page.locator('[data-testid^="space-outage-row-"]').count();
        expect(scheduledRows).toBeGreaterThanOrEqual(1);

        await openEditSpacePage(page, '97fd5_nm39_gh29');
        await ensureSpaceTypeSelected(page);

        await page.getByTestId(TAB_UNAVAILABILITY).click();

        await expect(page.getByTestId('space-outage-scheduled-empty-state')).toBeVisible();
        await expect(page.getByTestId('space-outage-past-table')).toBeVisible();
        await expect(page.getByTestId('space-outage-row-9004')).toBeVisible();
        await expect(page.getByTestId('space-outage-edit-9004')).toBeDisabled();
        await expect(page.getByTestId('space-outage-delete-9004')).toBeDisabled();
    });
    test('can re-edit after save', async ({ page }) => {
        // change the title before save so we can confirm edit-again performs a true reload
        await expect(page.getByTestId('space-name').locator('input')).toBeVisible();
        await expect(page.getByTestId('space-name').locator('input')).toHaveValue('01-W431');
        await page
            .getByTestId('space-name')
            .locator('input')
            .fill('New space name');

        await ensureSpaceTypeSelected(page);

        // click save button
        await expect(page.getByTestId('admin-spaces-save-button-submit')).toBeVisible();
        await page.getByTestId('admin-spaces-save-button-submit').click();

        await waitForSaveOutcomeDialog(page, 'The Space has been updated');
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

        await waitForSaveOutcomeDialog(page, 'The Space has been updated');
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

        const nameField = page.getByTestId('space-name').locator('input');
        await expect(nameField).toBeVisible();
        await nameField.press('ControlOrMeta+a');
        await nameField.fill('New space name');
        await nameField.press('Tab');

        await ensureSpaceTypeSelected(page);

        const selectedSpaceTypeId = await chooseDifferentSpaceType(page);

        await page.getByText('Ut enim ad minim veniam, quis').click();
        const descriptionField = page.getByRole('textbox', { name: /Editing area: main/i });
        await descriptionField.press('ControlOrMeta+a');
        await descriptionField.fill('a long description that has a number of words');

        await nameField.click();

        const isBookableCheckbox = page.getByTestId('space-can-book').locator('input');
        await expect(isBookableCheckbox).toBeChecked();
        const bookingUrlField = page.getByTestId('space_external_book_url').locator('input');
        await expect(bookingUrlField).toHaveValue('https://uqbookit.uq.edu.au/#/app/booking-types/111');
        await bookingUrlField.fill('http://example.com');

        // enter a Space capacity
        await expect(page.getByTestId('capacity-details')).toBeVisible();
        const capacityNumberField = page.getByTestId('space-capacity').locator('input');
        await capacityNumberField.click(); // focus
        await capacityNumberField.clear();
        await capacityNumberField.fill('32');

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
            // SINGLE_OCCUPANCY,
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

        await page.getByTestId(TAB_ABOUT).click();

        await page.getByRole('combobox', { name: 'Campus * St Lucia' }).click();
        await page.getByRole('option', { name: 'Gatton' }).click();
        await page.getByRole('combobox', { name: 'Library * J.K. Murray Library' }).click();
        await page.getByRole('option', { name: 'Library Warehouse' }).click();
        await page.getByRole('combobox', { name: 'Level * 1 [Library Warehouse' }).click();
        await page.getByRole('option', { name: '[Library Warehouse - 32]' }).click();

        // change to Location tab
        await page.getByTestId(TABS_LOCATION_HOURS).click();

        await expect(page.getByTestId('add-space-precise-location').locator('input')).toBeVisible();
        await page
            .getByTestId('add-space-precise-location')
            .locator('input')
            .fill('somewhere deep in the bowels of the warehouse');

        await page.getByRole('combobox', { name: 'Choose the Springshare' }).click();
        await page.getByRole('option', { name: 'Duhig Tower' }).click();

        await expect(page.getByTestId('space_services_page').locator('input')).toBeVisible();
        await expect(page.getByTestId('space_services_page').locator('input')).toBeVisible();
        await page
            .getByTestId('space_services_page')
            .locator('input')
            .fill('http://example.com');

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

        await waitForSaveOutcomeDialog(page, 'The Space has been updated');

        // check the data we pretended to send to the server matches what we expect
        // acts as check of what we sent to api
        const expectedValues = {
            space_id: 123456,
            space_floor_id: 32,
            space_name: 'New space name', // required field
            space_type_id: selectedSpaceTypeId, // required field
            space_draftmode: true,
            facility_types: finalFilters,
            space_precise: 'somewhere deep in the bowels of the warehouse',
            space_description: '<p>a long description that has a number of words</p>',
            space_external_book_url: 'http://example.com',
            space_photo_url: 'https://campuses.uq.edu.au/files/35116/01-E107%20%28Resize%29.jpg',
            // space_photo_url: 'http://example.com/x.png',
            space_photo_description: 'words about the photo',
            space_opening_hours_id: DUHIG_TOWER_SPRINGSHARE_SPACE_ID,
            space_services_page: 'http://example.com',
            space_latitude: LAW_DEFAULT_LATITUDE, // TODO: drag an drop to change these
            space_longitude: LAW_DEFAULT_LONGITUDE,
            space_zlevel: 1,
            space_capacity: '32',
            archibus_room_id: null,
        };
        await assertExpectedDataSentToServer(page, expectedValues);
    });

    test('edit spaces page save dialog is accessible', async ({ page }) => {
        await expect(page.getByTestId('admin-spaces-save-button-submit')).toBeVisible();
        await page.getByTestId('admin-spaces-save-button-submit').click();

        await waitForSaveOutcomeDialog(page, 'The Space has been updated');

        await assertAccessibility(page, '[data-testid="dialogbox-spaces-save-outcome"]');
    });

    test.describe('Spaces Admin - load errors', () => {
        test('edit space - error locations', async ({ page }) => {
            await page.goto('/admin/spaces/edit/error?user=libSpaces');
            await page.setViewportSize(EDIT_SPACE_VIEWPORT);

            await expect(page.getByTestId('load-space-form-error')).toBeVisible({ timeout: 30_000 });
            await expect(page.getByTestId('load-space-form-error')).toContainText(
                'Something went wrong - please try again later.',
            );
            await expect(page.getByTestId('load-space-form-error')).toContainText('Space details had a problem.');
        });
        test('edit space - 404 locations', async ({ page }) => {
            await page.goto('/admin/spaces/edit/missingRecord?user=libSpaces');
            await page.setViewportSize(EDIT_SPACE_VIEWPORT);

            await expect(page.getByTestId('missing-record')).toBeVisible({ timeout: 30_000 });
            await expect(page.getByTestId('missing-record')).toContainText('There is no Space with ID "missingRecord"'); // 'missingRecord' is the id in mock when it is missing
        });
        test('edit space - weeklyHours api error', async ({ page }) => {
            await openEditSpacePage(page, 'f98g_fwas_5g33', '?user=libSpaces&responseType=weeklyHoursError', {
                waitForTitle: false,
                waitForForm: false,
            });

            await expect(page.getByTestId('load-space-form-error')).toBeVisible({ timeout: 30_000 });
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
            await openEditSpacePage(page, 'f98g_fwas_5g33', '?user=libSpaces&responseType=spaceUpdate500Error');

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

            await waitForSaveOutcomeDialog(
                page,
                'An error has occurred during the request and this request cannot be processed. Please contact webmaster@library.uq.edu.au or try again later.',
            );
        });
    });
});
test.describe('Spaces admin - edit other spaces', () => {
    test('a bookable space can change capacity', async ({ page, context }) => {
        const testSpaceUuid = 'df40_2jsf_zdk5';
        const spaceCapacityValue = '5';

        await setTestDataCookie(context, page);

        await openEditSpacePage(page, testSpaceUuid);

        await expect(page.getByTestId(TAB_ABOUT).locator('.MuiBadge-badge')).not.toBeVisible();
        await page.getByTestId('space-can-book').scrollIntoViewIfNeeded();
        await expect(page.getByTestId('space-can-book').locator('input')).toBeVisible();
        await expect(page.getByTestId('space-can-book').locator('input')).toBeChecked();
        await expect(page.getByTestId('capacity-required-indicator')).toBeVisible();
        await expect(page.getByTestId('space-capacity').locator('input')).toBeVisible();
        await expect(page.getByTestId('space-capacity').locator('input')).toHaveValue(spaceCapacityValue);
        await expect(page.getByTestId('space-capacity-error')).not.toBeVisible();

        // make non-bookable
        await page
            .getByTestId('space-can-book')
            .locator('input')
            .uncheck();

        // the capacity field is no longer required, and its value is unchanged
        await expect(page.getByTestId('capacity-required-indicator')).not.toBeVisible();
        await expect(page.getByTestId('space-capacity').locator('input')).toBeVisible();
        await expect(page.getByTestId('space-capacity').locator('input')).toHaveValue(spaceCapacityValue);
        await expect(page.getByTestId('space-capacity-error')).not.toBeVisible();

        await expect(page.getByTestId('admin-spaces-save-button-submit')).toBeVisible();
        await page.getByTestId('admin-spaces-save-button-submit').click();

        await expect(page.getByTestId('message-title')).toBeVisible();
        await expect(page.getByTestId('message-title')).toContainText('The Space has been updated');

        const expectedValues = {
            ...originalMockData(testSpaceUuid),
            space_capacity: Number(spaceCapacityValue),
            space_external_book_url: null,
            archibus_room_id: null,
        };
        await assertExpectedDataSentToServer(page, expectedValues);
    });

    test('when a test becomes non-bookable the capacity is no longer required', async ({ page, context }) => {
        const testSpaceUuid = 'df40_2jsf_zdk5';

        await setTestDataCookie(context, page);

        await openEditSpacePage(page, testSpaceUuid);

        await expect(page.getByTestId(TAB_ABOUT).locator('.MuiBadge-badge')).not.toBeVisible();
        await page.getByTestId('space-can-book').scrollIntoViewIfNeeded();
        await expect(page.getByTestId('space-can-book').locator('input')).toBeVisible();
        await expect(page.getByTestId('space-can-book').locator('input')).toBeChecked();
        await expect(page.getByTestId('capacity-required-indicator')).toBeVisible();
        await expect(page.getByTestId('space-capacity').locator('input')).toBeVisible();
        await expect(page.getByTestId('space-capacity').locator('input')).toHaveValue('5');
        await expect(page.getByTestId('space-capacity-error')).not.toBeVisible();

        // update the Space capacity
        const capacityNumberField = page.getByTestId('space-capacity').locator('input');
        await expect(capacityNumberField).toBeVisible();
        await capacityNumberField.clear();
        await capacityNumberField.fill('8');

        await expect(page.getByTestId('admin-spaces-save-button-submit')).toBeVisible();
        await page.getByTestId('admin-spaces-save-button-submit').click();

        await expect(page.getByTestId('message-title')).toBeVisible();
        await expect(page.getByTestId('message-title')).toContainText('The Space has been updated');

        const expectedValues = {
            ...originalMockData(testSpaceUuid),
            space_capacity: '8',
            archibus_room_id: null,
        };
        await assertExpectedDataSentToServer(page, expectedValues);
    });

    test('a non-bookable space can add a capacity value', async ({ page, context }) => {
        const testSpaceuuid = '9a7796e0-b708-45c0-a8de-1183282e0b62';
        const newCapacityValue = '7';

        await setTestDataCookie(context, page);

        await openEditSpacePage(page, testSpaceuuid);

        await expect(page.getByTestId(TAB_ABOUT).locator('.MuiBadge-badge')).not.toBeVisible();
        await page.getByTestId('space-can-book').scrollIntoViewIfNeeded();
        await expect(page.getByTestId('space-can-book').locator('input')).toBeVisible();
        await expect(page.getByTestId('space-can-book').locator('input')).not.toBeChecked();
        // capacity for a non-bookable space is not required
        await expect(page.getByTestId('capacity-required-indicator')).not.toBeVisible();
        await expect(page.getByTestId('space-capacity').locator('input')).toBeVisible();
        await expect(page.getByTestId('space-capacity').locator('input')).toHaveValue('0');
        await expect(page.getByTestId('space-capacity-error')).not.toBeVisible();

        // update the Space capacity
        const capacityNumberField = page.getByTestId('space-capacity').locator('input');
        await expect(capacityNumberField).toBeVisible();
        await capacityNumberField.clear();
        await capacityNumberField.fill(newCapacityValue);

        // now save
        await expect(page.getByTestId('admin-spaces-save-button-submit')).toBeVisible();
        await page.getByTestId('admin-spaces-save-button-submit').click();

        await expect(page.getByTestId('message-title')).toBeVisible();
        await expect(page.getByTestId('message-title')).toContainText('The Space has been updated');

        const expectedValues = {
            ...originalMockData(testSpaceuuid),
            space_opening_hours_id: -1,
            space_capacity: newCapacityValue,
            archibus_room_id: null,
        };
        await assertExpectedDataSentToServer(page, expectedValues);
    });

    test('can clear a capacity value on a non bookable space', async ({ page, context }) => {
        const testSpaceuuid = '97fd5_nm39_gh29';

        const capacityNumberField = page.getByTestId('space-capacity').locator('input');

        await setTestDataCookie(context, page);

        await openEditSpacePage(page, testSpaceuuid);
        await page.getByTestId('space-can-book').scrollIntoViewIfNeeded();
        await expect(capacityNumberField).toBeVisible();
        await expect(capacityNumberField).toHaveValue('1');

        // clear the Space capacity
        await capacityNumberField.clear();

        // now save
        await expect(page.getByTestId('admin-spaces-save-button-submit')).toBeVisible();
        await page.getByTestId('admin-spaces-save-button-submit').click();

        await expect(page.getByTestId('message-title')).toBeVisible();
        await expect(page.getByTestId('message-title')).toContainText('The Space has been updated');

        const expectedValues = {
            ...originalMockData(testSpaceuuid),
            space_capacity: 0,
            archibus_room_id: null,
        };
        await assertExpectedDataSentToServer(page, expectedValues);
    });
});
test.describe('booking link controller works properly', () => {
    test('can clear booking link', async ({ page, context }) => {
        const testSpaceUuid = 'f98g_fwas_5g33';

        await setTestDataCookie(context, page);

        const bookingUrlField = page.getByTestId('space_external_book_url').locator('input');

        await openEditSpacePage(page, testSpaceUuid);

        // bookable is checked
        await expect(page.getByTestId('space-can-book').locator('input')).toBeChecked();
        await expect(page.getByTestId('booking-link-details')).toBeVisible();
        await expect(bookingUrlField).toHaveValue('https://uqbookit.uq.edu.au/#/app/booking-types/111');

        // remove booking url (uncheck box)
        await page
            .getByTestId('contains-bookable-checkbox')
            .locator('input')
            .uncheck();
        await expect(page.getByTestId('booking-link-details')).not.toBeVisible();

        // save changes
        // click save button
        await expect(page.getByTestId('admin-spaces-save-button-submit')).toBeVisible();
        await page.getByTestId('admin-spaces-save-button-submit').click();

        await expect(page.getByTestId('message-title')).toBeVisible();
        await expect(page.getByTestId('message-title')).toContainText('The Space has been updated');

        // check the data we pretended to send to the server matches what we expect
        // acts as check of what we sent to api
        const expectedValues = {
            ...originalMockData(testSpaceUuid),
            // space_type_id: 1,
            space_draftmode: true,
            space_capacity: 7,
            space_external_book_url: null,
            archibus_room_id: null,
        };
        await assertExpectedDataSentToServer(page, expectedValues);
    });
    test('an unchanged empty booking link remains empty', async ({ page, context }) => {
        const testSpaceUuid = '97fd5_nm39_gh29';

        await setTestDataCookie(context, page);

        await openEditSpacePage(page, testSpaceUuid);

        // bookable is checked
        await expect(page.getByTestId('space-can-book').locator('input')).not.toBeChecked();
        await expect(page.getByTestId('booking-link-details')).not.toBeVisible();

        // click save button (there aren't any changes)
        await expect(page.getByTestId('admin-spaces-save-button-submit')).toBeVisible();
        await page.getByTestId('admin-spaces-save-button-submit').click();

        await expect(page.getByTestId('message-title')).toBeVisible();
        await expect(page.getByTestId('message-title')).toContainText('The Space has been updated');

        // check the data we pretended to send to the server matches what we expect
        // acts as check of what we sent to api
        const expectedValues = {
            ...originalMockData(testSpaceUuid),
            // space_type_id: originalMockData('97fd5_nm39_gh29')?.space_type_id,
            // space_draftmode: false,
            archibus_room_id: null,
        };
        await assertExpectedDataSentToServer(page, expectedValues);
    });
    test('can add a booking link', async ({ page, context }) => {
        await setTestDataCookie(context, page);

        const bookingUrlField = page.getByTestId('space_external_book_url').locator('input');

        const testSpaceUuid = '97fd5_nm39_gh29';
        await openEditSpacePage(page, testSpaceUuid);

        // bookable is not checked
        await expect(page.getByTestId('space-can-book').locator('input')).not.toBeChecked();
        await expect(page.getByTestId('booking-link-details')).not.toBeVisible();

        // make the space bookable (check box)
        await page
            .getByTestId('contains-bookable-checkbox')
            .locator('input')
            .check();
        await expect(page.getByTestId('booking-link-details')).toBeVisible();

        await expect(page.getByTestId('spaces-button-error-list')).toBeVisible();
        await expect(page.getByTestId('spaces-button-error-list')).toContainText('Please fix 1 error.');
        await expect(page.getByTestId('spaces-button-error-list')).toContainText(
            'Provide the booking link, or uncheck the checkbox',
        );

        await expect(page.getByTestId('admin-spaces-save-button-submit')).toBeVisible();
        await expect(page.getByTestId('admin-spaces-save-button-submit')).toBeDisabled();

        // ok, save failed - now enter a url
        await bookingUrlField.click();
        await bookingUrlField.fill('http://example.com');

        // save our changes
        await expect(page.getByTestId('admin-spaces-save-button-submit')).toBeVisible();
        await expect(page.getByTestId('admin-spaces-save-button-submit')).toBeEnabled();
        await page.getByTestId('admin-spaces-save-button-submit').click();

        // check the data we pretended to send to the server matches what we expect
        // acts as check of what we sent to api
        const expectedValues = {
            ...originalMockData(testSpaceUuid),
            space_external_book_url: 'http://example.com',
            archibus_room_id: null,
        };
        await assertExpectedDataSentToServer(page, expectedValues);
    });
});
