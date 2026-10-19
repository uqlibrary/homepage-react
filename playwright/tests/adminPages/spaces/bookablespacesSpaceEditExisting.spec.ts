import { expect, test } from '@uq/pw/test';
import { assertAccessibility } from '@uq/pw/lib/axe';
import { assertExpectedDataSentToServer, setTestDataCookie } from '@uq/pw/lib/helpers';
import { typeRichTextEditor } from '@uq/pw/lib/richTextEditor';

import { COLOR_UQPURPLE } from '@uq/pw/lib/constants';

const TAB_ABOUT = 'tab-about';
const TAB_FACILITY_TYPES = 'tab-facility-types';
const TABS_LOCATION_HOURS = 'tab-location-hours';
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
    await page.goto(`http://localhost:2020/admin/spaces/edit/${spaceUuid}${search}`);
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
        const numberFacilityTypesInMockFacilityTypes = 52;
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
        const numberFacilityTypesInMockFacilityTypes = 52;
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
        const numberFacilityTypesInMockFacilityTypes = 52;
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

    test('can re-edit after save', async ({ page }) => {
        // change the title before save so we can confirm edit-again performs a true reload
        await expect(page.getByTestId('space-name').locator('input')).toBeVisible();
        await expect(page.getByTestId('space-name').locator('input')).toHaveValue('01-W431');
        await page.getByTestId('space-name').locator('input').fill('New space name');

        await ensureSpaceTypeSelected(page);

        // click save button
        await expect(page.getByTestId('admin-spaces-save-button-submit')).toBeVisible();
        await page.getByTestId('admin-spaces-save-button-submit').click();

        await waitForSaveOutcomeDialog(page, 'The Space has been updated');
        await expect(page.getByTestId('confirm-spaces-save-outcome')).toBeVisible();
        await expect(page.getByTestId('confirm-spaces-save-outcome')).toContainText('Return to dashboard');
        await expect(page.getByTestId('cancel-spaces-save-outcome')).toBeVisible();
        await expect(page.getByTestId('cancel-spaces-save-outcome')).toContainText('Edit record again');
        await Promise.all([
            page.waitForURL('**/admin/spaces/edit/f98g_fwas_5g33?user=libSpaces', { timeout: 30_000 }),
            page.getByTestId('cancel-spaces-save-outcome').click(),
        ]);

        // Re-opening edit triggers a same-page reload; assert post-reload form readiness before value checks.
        await expect(page.getByTestId('admin-spaces-page-title')).toBeVisible({ timeout: 30_000 });
        await expect(page.getByTestId('message-title')).toBeHidden({ timeout: 30_000 });
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
        await typeRichTextEditor(page, 'a long description that has a number of words');

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
            3,
            49,
            60,
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
        await page.getByTestId(`filtertype-${EXAM_FRIENDLY}`).locator('input').click();
        finalFilters.push(EXAM_FRIENDLY);

        // unselect an existing facility type
        await expect(page.getByTestId(`filtertype-${ADJUSTABLE_DESKS}`).locator('input')).toBeVisible();
        await expect(page.getByTestId(`facility-type-listitem-${ADJUSTABLE_DESKS}`)).toContainText('Adjustable desks');
        await page.getByTestId(`filtertype-${ADJUSTABLE_DESKS}`).locator('input').click();
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
        await page.getByTestId('space_services_page').locator('input').fill('http://example.com');

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

    test('preview button works', async ({ page }) => {
        // open the preview dialog
        await expect(page.getByTestId('spaces-preview-dialog-title')).not.toBeVisible();
        await expect(page.getByTestId('admin-spaces-preview-button')).toBeVisible();
        await page.getByTestId('admin-spaces-preview-button').click();
        await expect(page.getByTestId('spaces-preview-dialog-title')).toBeVisible();
        await expect(page.getByTestId('spaces-preview-dialog-title')).toContainText('Space preview');

        await expect(page.getByTestId('space-123456-details-image').locator('img')).toBeVisible();
        await expect(page.getByTestId('space-123456-details-image').locator('img')).toHaveAttribute(
            'src',
            'https://campuses.uq.edu.au/files/35116/01-E107%20%28Resize%29.jpg',
        );
        await expect(page.getByTestId('space-123456-details-name')).toBeVisible();
        await expect(page.getByTestId('space-123456-details-name')).toContainText('Communal space 01-W431');

        await expect(page.getByTestId('space-123456-friendly-location').locator('.location-campus')).toBeVisible();
        await expect(page.getByTestId('space-123456-friendly-location').locator('.location-campus')).toContainText(
            'St Lucia',
        );
        await expect(page.getByTestId('space-123456-friendly-location').locator('.location-building')).toBeVisible();
        await expect(page.getByTestId('space-123456-friendly-location').locator('.location-building')).toContainText(
            'Forgan Smith Building (0001)',
        );
        await expect(page.getByTestId('space-123456-friendly-location').locator('.location-library')).toBeVisible();
        await expect(page.getByTestId('space-123456-friendly-location').locator('.location-library')).toContainText(
            'Walter Harrison Law Library',
        );
        await expect(page.getByTestId('space-123456-friendly-location').locator('.location-floor')).toBeVisible();
        await expect(page.getByTestId('space-123456-friendly-location').locator('.location-floor')).toContainText(
            'Level 2',
        );
        await expect(page.getByTestId('space-123456-friendly-location').locator('.location-precise')).toBeVisible();
        await expect(page.getByTestId('space-123456-friendly-location').locator('.location-precise')).toContainText(
            'Westernmost corner',
        );

        // as this is a "closing soon" Space, none of the chips display
        await expect(page.getByTestId('spaces-journey-open-status-chip-open')).not.toBeVisible();
        await expect(page.getByTestId('spaces-journey-open-status-chip-closing-soon')).not.toBeVisible();
        await expect(page.getByTestId('spaces-journey-open-status-chip-closed')).not.toBeVisible();

        await expect(page.getByTestId('space-123456-outage').locator('h4')).not.toBeVisible();
        await expect(page.getByTestId('space-123456-outage-message')).toBeVisible();
        await expect(page.getByTestId('space-123456-outage-message')).toContainText(/Unavailable/);
        await expect(page.getByTestId('space-123456-outage-reason')).toBeVisible();
        await expect(page.getByTestId('space-123456-outage-reason')).toContainText('Reason: Deep cleaning');

        await expect(page.getByTestId('spaces-123456-details-space-type-description')).toBeVisible();
        await expect(page.getByTestId('spaces-123456-details-space-type-description')).toContainText(
            'Designed for communal activities',
        );

        await expect(page.getByTestId('space-123456-details-description')).toBeVisible();
        await expect(page.getByTestId('space-123456-details-description')).toContainText(
            'A space in the Law library. Lorem ipsum dolor sit amet',
        );

        await expect(page.getByTestId('space-123456-booking-link')).toBeVisible();
        await expect(page.getByTestId('space-123456-booking-link')).toContainText('Book this space');
        await expect(page.getByTestId('space-123456-booking-link')).toHaveAttribute(
            'href',
            'https://uqbookit.uq.edu.au/#/app/booking-types/111',
        );

        await page.getByTestId('space-123456-facility').scrollIntoViewIfNeeded();

        await expect(page.getByTestId('space-123456-capacity')).toBeVisible();
        await expect(page.getByTestId('space-123456-capacity').locator('h3')).toContainText('Capacity');
        await expect(page.getByTestId('space-123456-capacity').locator('p')).toContainText('7 people');

        await expect(page.getByTestId('space-123456-facility').locator('h3')).toBeVisible();
        await expect(page.getByTestId('space-123456-facility').locator('h3')).toContainText('Facilities');
        await expect(page.getByTestId('space-123456-facility').locator('div').locator(':scope > div')).toHaveCount(16);

        await expect(page.getByTestId('space-123456-openingHours-0')).toBeVisible();
        await expect(page.getByTestId('space-123456-openingHours-0')).toContainText('Today');

        // can close dialog with button
        await expect(page.getByTestId('spaces-preview-dialog-close-button')).toBeVisible();
        await page.getByTestId('spaces-preview-dialog-close-button').click();
        await expect(page.getByTestId('spaces-preview-dialog-close-button')).not.toBeVisible();
        await expect(page.getByTestId('spaces-preview-dialog-title')).not.toBeVisible();
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
