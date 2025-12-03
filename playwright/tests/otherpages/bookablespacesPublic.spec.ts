import { expect, Page, test } from '@uq/pw/test';
import { assertAccessibility } from '@uq/pw/lib/axe';

const FORGEN = 'space-123456';
const PACE = 'space-1234544';
const LIVERIS = 'space-43534';

test.describe('Spaces', () => {
    test('Shows a basic page for Spaces', async ({ page }) => {
        await page.goto('spaces');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(page.locator('body').getByText(/Library spaces/)).toBeVisible();

        // there are 3 spaces on the demo page
        await expect(page.getByTestId('space-wrapper').locator('> *')).toHaveCount(3);

        // the friendly location shows correctly
        await expect(page.getByTestId('standard-card-01-w431---collaborative-space')).toBeVisible();
        await expect(page.getByTestId('standard-card-01-w431---collaborative-space')).toContainText(
            'Westernmost corner, 2nd Floor',
        );
        await expect(page.getByTestId('standard-card-01-w431---collaborative-space')).toContainText(
            'Forgan Smith Building',
        );
        await expect(page.getByTestId('standard-card-01-w431---collaborative-space')).toContainText('St Lucia Campus');

        // the first and second opening hours are labelled 'today' and 'tomorrow'
        await expect(page.getByTestId(`${FORGEN}-openingHours-0`)).toBeVisible();
        await expect(page.getByTestId(`${FORGEN}-openingHours-0`)).toContainText('Today');
        await expect(page.getByTestId(`${FORGEN}-openingHours-1`)).toContainText('Tomorrow');

        // only the second and third panels have override opening hours
        await expect(page.getByTestId(`${FORGEN}-override_opening_hours`)).not.toBeVisible();
        await expect(page.getByTestId(`${PACE}-override_opening_hours`)).toContainText('this space opens at 8am');
        await expect(page.getByTestId(`${LIVERIS}-override_opening_hours`)).toBeVisible();
        await expect(page.getByTestId(`${LIVERIS}-override_opening_hours`)).toContainText(
            'open from 7am Monday - Friday',
        );

        // description only displayed where provided
        await expect(page.getByTestId(`${FORGEN}-description`)).toHaveCount(1);
        await expect(page.getByTestId(`${PACE}-description`)).toHaveCount(1);
        await expect(page.getByTestId(`${LIVERIS}-description`)).toHaveCount(0);

        // facilities are correct
        await expect(page.getByTestId(`${FORGEN}-facility`)).toBeDefined();
        await expect(page.getByTestId(`${FORGEN}-facility`)).not.toBeVisible();
        page.getByTestId(`${FORGEN}-expand-button`).click();
        await expect(page.getByTestId(`${FORGEN}-facility`)).toBeVisible();
        await expect(page.getByTestId(`${FORGEN}-facility`).locator(' > *')).toHaveCount(13);
        await expect(page.getByTestId(`${FORGEN}-facility-23`)).toContainText('Toilets, female');
        await expect(page.getByTestId(`${FORGEN}-facility-22`)).toContainText('Toilets, male');
        await expect(page.getByTestId(`${FORGEN}-facility-29`)).toContainText('Recharge Station');
        await expect(page.getByTestId(`${FORGEN}-facility-31`)).toContainText('Self-printing & scanning');
        await expect(page.getByTestId(`${FORGEN}-facility-17`)).toContainText('Low noise level');
        await expect(page.getByTestId(`${FORGEN}-facility-5`)).toContainText('Computer');
        await expect(page.getByTestId(`${FORGEN}-facility-33`)).toContainText('Client accessible power point');
        await expect(page.getByTestId(`${FORGEN}-facility-38`)).toContainText('Whiteboard');
        await expect(page.getByTestId(`${FORGEN}-facility-39`)).toContainText('Adjustable desks');
        await expect(page.getByTestId(`${FORGEN}-facility-8`)).toContainText('AV equipment');
        await expect(page.getByTestId(`${FORGEN}-facility-13`)).toContainText('Postgraduate spaces');
        await expect(page.getByTestId(`${FORGEN}-facility-14`)).toContainText('Undergrad spaces');
        await expect(page.getByTestId(`${FORGEN}-facility-57`)).toContainText('Contains Artwork');

        await expect(page.getByTestId(`${PACE}-facility`)).toBeDefined();
        await expect(page.getByTestId(`${PACE}-facility`)).not.toBeVisible();
        page.getByTestId(`${PACE}-expand-button`).click();
        await expect(page.getByTestId(`${PACE}-facility`)).toBeVisible();
        await expect(page.getByTestId(`${PACE}-facility`).locator(' > *')).toHaveCount(15);
        await expect(page.getByTestId(`${PACE}-facility-23`)).toContainText('Toilets, female');
        await expect(page.getByTestId(`${PACE}-facility-22`)).toContainText('Toilets, male');
        await expect(page.getByTestId(`${PACE}-facility-29`)).toContainText('Recharge Station');
        await expect(page.getByTestId(`${PACE}-facility-31`)).toContainText('Self-printing & scanning');
        await expect(page.getByTestId(`${PACE}-facility-5`)).toContainText('Computer');
        await expect(page.getByTestId(`${PACE}-facility-32`)).toContainText('BYOD station');
        await expect(page.getByTestId(`${PACE}-facility-33`)).toContainText('Client accessible power point');
        await expect(page.getByTestId(`${PACE}-facility-34`)).toContainText('on-desk USB-A');
        await expect(page.getByTestId(`${PACE}-facility-35`)).toContainText('Qi chargers');
        await expect(page.getByTestId(`${PACE}-facility-36`)).toContainText('On-desk USB-C, Low Power');
        await expect(page.getByTestId(`${PACE}-facility-42`)).toContainText('General Collections');
        await expect(page.getByTestId(`${PACE}-facility-44`)).toContainText('Requested items');
        await expect(page.getByTestId(`${PACE}-facility-45`)).toContainText('Lending');
        await expect(page.getByTestId(`${PACE}-facility-46`)).toContainText('Return station');
        await expect(page.getByTestId(`${PACE}-facility-10`)).toContainText('High noise level');

        await expect(page.getByTestId(`${LIVERIS}-facility`)).toBeDefined();
        await expect(page.getByTestId(`${LIVERIS}-facility`)).not.toBeVisible();
        page.getByTestId(`${LIVERIS}-expand-button`).click();
        await expect(page.getByTestId(`${LIVERIS}-facility`)).toBeVisible();
        await expect(page.getByTestId(`${LIVERIS}-facility`).locator(' > *')).toHaveCount(10);
        await expect(page.getByTestId(`${LIVERIS}-facility-19`)).toContainText('Bookable');
        await expect(page.getByTestId(`${LIVERIS}-facility-23`)).toContainText('Toilets, female');
        await expect(page.getByTestId(`${LIVERIS}-facility-22`)).toContainText('Toilets, male');
        await expect(page.getByTestId(`${LIVERIS}-facility-29`)).toContainText('Recharge Station');
        await expect(page.getByTestId(`${LIVERIS}-facility-31`)).toContainText('Self-printing & scanning');
        await expect(page.getByTestId(`${LIVERIS}-facility-33`)).toContainText('Client accessible power point');
        await expect(page.getByTestId(`${LIVERIS}-facility-8`)).toContainText('AV equipment');
        await expect(page.getByTestId(`${LIVERIS}-facility-50`)).toContainText('Natural');
        await expect(page.getByTestId(`${LIVERIS}-facility-13`)).toContainText('Postgraduate spaces');
        await expect(page.getByTestId(`${LIVERIS}-facility-14`)).toContainText('Undergrad spaces');

        // TODO: show breadrumbs are correct
    });
    test('is accessible', async ({ page }) => {
        await page.goto('spaces');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(page.locator('body').getByText(/Library spaces/)).toBeVisible();

        await assertAccessibility(page, '[data-testid="StandardPage"]');
    });
    test('no spaces yet', async ({ page }) => {
        await page.goto('spaces?responseType=empty-spaces');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(page.locator('body').getByText(/Library spaces/)).toBeVisible();

        await expect(page.getByTestId('no-spaces')).toBeVisible();
        await expect(page.getByTestId('no-spaces')).toContainText('No locations found - please try again soon.');
    });
    test('can open collapse block contents', async ({ page }) => {
        await page.goto('spaces');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(page.locator('body').getByText(/Library spaces/)).toBeVisible();

        await expect(page.getByTestId(`${FORGEN}`).locator('h2')).toBeVisible();
        await expect(page.getByTestId(`${FORGEN}-expand-button`)).toBeVisible();
        await expect(page.getByTestId(`${FORGEN}-collapse-button`)).not.toBeVisible();

        // initially the lower block is hidden
        await expect(page.getByTestId(`${FORGEN}-facility`)).not.toBeVisible();
        await expect(page.getByTestId(`${PACE}-facility`)).not.toBeVisible();
        await expect(page.getByTestId(`${LIVERIS}-facility`)).not.toBeVisible();

        // and description is truncated
        await expect(page.getByTestId(`${FORGEN}-description`)).toBeVisible();
        await expect(page.getByTestId(`${FORGEN}-description`)).toHaveClass(/truncated/);

        // expand the bottom space
        page.getByTestId(`${FORGEN}-expand-button`).click();

        // the lower block is visible
        await expect(page.getByTestId(`${FORGEN}-facility`)).not.toBeVisible();
        // the other blocks have not appeared
        await expect(page.getByTestId(`${PACE}-facility`)).not.toBeVisible();
        await expect(page.getByTestId(`${LIVERIS}-facility`)).not.toBeVisible();
        // and description is NOTtruncated
        await expect(page.getByTestId(`${FORGEN}-description`)).toBeVisible();
        await expect(page.getByTestId(`${FORGEN}-description`)).not.toHaveClass(/truncated/);
        // and the controls have swapped
        await expect(page.getByTestId(`${FORGEN}-expand-button`)).not.toBeVisible();
        await expect(page.getByTestId(`${FORGEN}-collapse-button`)).toBeVisible();

        // collapse the bottom space
        page.getByTestId(`${FORGEN}-collapse-button`).click();

        // and the lower details are hidden again
        await expect(page.getByTestId(`${FORGEN}-facility`)).toBeVisible();
        // the other blocks have not appeared (button only affects one space)
        await expect(page.getByTestId(`${PACE}-facility`)).not.toBeVisible();
        await expect(page.getByTestId(`${LIVERIS}-facility`)).not.toBeVisible();
        // and description is truncated
        await expect(page.getByTestId(`${FORGEN}-description`)).toBeVisible();
        await expect(page.getByTestId(`${FORGEN}-description`)).toHaveClass(/truncated/);
        // and the controls have swapped
        await expect(page.getByTestId(`${FORGEN}-expand-button`)).toBeVisible();
        await expect(page.getByTestId(`${FORGEN}-collapse-button`)).not.toBeVisible();
    });
    test('can filter with sidebar checkboxes', async ({ page }) => {
        await page.goto('spaces');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(page.locator('body').getByText(/Library spaces/)).toBeVisible();

        const bookableId = 19;
        const bookableCheckbox = page.getByTestId(`facility-type-listitem-${bookableId}`);
        const bookableExcludeCheckboxlabel = page.getByTestId(`reject-filtertype-label-${bookableId}`);
        const adjustableDeskCheckbox = page.getByTestId('facility-type-listitem-39');
        const avEquipmentCheckbox = page.getByTestId('facility-type-listitem-8');
        const byodStationCheckbox = page.getByTestId('facility-type-listitem-32');

        const forganSmithCollaborativeSpace = page.getByTestId(`${FORGEN}`).locator('h2');
        const duttonParkGroupStudyRoom = page.getByTestId(`${PACE}`).locator('h2');
        const andrewLiverisComputerRoom = page.getByTestId(`${LIVERIS}`).locator('h2');

        // there are initially 3 Spaces visible on the page
        await expect(page.getByTestId('space-wrapper').locator(':scope > *')).toHaveCount(3);
        await expect(page.getByTestId('no-spaces-visible')).not.toBeVisible();
        await expect(forganSmithCollaborativeSpace).toBeVisible();
        await expect(duttonParkGroupStudyRoom).toBeVisible();
        await expect(andrewLiverisComputerRoom).toBeVisible();

        // filter to show "Bookable" only
        await expect(bookableCheckbox.locator('label:first-of-type')).toBeVisible();
        await expect(bookableCheckbox.locator('label:first-of-type')).toContainText('Bookable');
        await bookableCheckbox.locator('span input').check();

        // selecting "Bookable" makes two disappear
        await expect(page.getByTestId('space-wrapper').locator(':scope > *')).toHaveCount(1);
        await expect(page.getByTestId('no-spaces-visible')).not.toBeVisible();
        await expect(forganSmithCollaborativeSpace).not.toBeVisible();
        await expect(duttonParkGroupStudyRoom).not.toBeVisible();
        await expect(andrewLiverisComputerRoom).toBeVisible();

        // add 'Adjustable desks'
        await expect(adjustableDeskCheckbox.locator('label:first-of-type')).toBeVisible();
        await expect(adjustableDeskCheckbox.locator('label:first-of-type')).toContainText('Adjustable desks');
        await adjustableDeskCheckbox.locator('span input').check();

        // selecting "Adjustable desks" & "Bookable" means none are visible, and the user is notified
        await expect(page.getByTestId('space-wrapper').locator(':scope > *')).toHaveCount(1); // "no spaces" message
        await expect(page.getByTestId('no-spaces-visible')).toBeVisible();
        await expect(forganSmithCollaborativeSpace).not.toBeVisible();
        await expect(duttonParkGroupStudyRoom).not.toBeVisible();
        await expect(andrewLiverisComputerRoom).not.toBeVisible();

        // uncheck "Bookable" makes Forgan smith (#1) appear
        await bookableCheckbox.locator('span input').uncheck();
        await expect(page.getByTestId('space-wrapper').locator(':scope > *')).toHaveCount(1);
        await expect(page.getByTestId('no-spaces-visible')).not.toBeVisible();
        await expect(forganSmithCollaborativeSpace).toBeVisible();
        await expect(duttonParkGroupStudyRoom).not.toBeVisible();
        await expect(andrewLiverisComputerRoom).not.toBeVisible();

        // uncheck other filter and all the Spaces appear
        await adjustableDeskCheckbox.locator('span input').uncheck();

        await expect(page.getByTestId('space-wrapper').locator(':scope > *')).toHaveCount(3);
        await expect(page.getByTestId('no-spaces-visible')).not.toBeVisible();
        await expect(forganSmithCollaborativeSpace).toBeVisible();
        await expect(duttonParkGroupStudyRoom).toBeVisible();
        await expect(andrewLiverisComputerRoom).toBeVisible();

        // show checkboxes do an 'OR' within groups
        // choose AV equipment, 1 Space disappears
        await expect(avEquipmentCheckbox.locator('label:first-of-type')).toBeVisible();
        await expect(avEquipmentCheckbox.locator('label:first-of-type')).toContainText('AV equipment');
        await avEquipmentCheckbox.locator('span input').check();

        await expect(page.getByTestId('space-wrapper').locator(':scope > *')).toHaveCount(2);
        await expect(page.getByTestId('no-spaces-visible')).not.toBeVisible();
        await expect(forganSmithCollaborativeSpace).toBeVisible();
        await expect(duttonParkGroupStudyRoom).not.toBeVisible();
        await expect(andrewLiverisComputerRoom).toBeVisible();

        // add byod station, which is in the same group, and all appear
        await expect(byodStationCheckbox.locator('label:first-of-type')).toBeVisible();
        await expect(byodStationCheckbox.locator('label:first-of-type')).toContainText('BYOD station');
        await byodStationCheckbox.locator('span input').check();

        await expect(page.getByTestId('space-wrapper').locator(':scope > *')).toHaveCount(3);
        await expect(page.getByTestId('no-spaces-visible')).not.toBeVisible();
        await expect(forganSmithCollaborativeSpace).toBeVisible();
        await expect(duttonParkGroupStudyRoom).toBeVisible();
        await expect(andrewLiverisComputerRoom).toBeVisible();

        // select "exclude bookable" filter
        await bookableCheckbox.locator('span.fortestfocus').click(); // a hack of the page so playwright can tap on the exclude filter
        await expect(bookableExcludeCheckboxlabel).toBeVisible();
        await bookableExcludeCheckboxlabel.check();

        // and we are down to 2 showing
        await expect(page.getByTestId('space-wrapper').locator(':scope > *')).toHaveCount(2);
        await expect(page.getByTestId('no-spaces-visible')).not.toBeVisible();
        await expect(forganSmithCollaborativeSpace).toBeVisible();
        await expect(duttonParkGroupStudyRoom).toBeVisible();
        await expect(andrewLiverisComputerRoom).not.toBeVisible();
    });
    test('can unfilter by cartouche', async ({ page }) => {
        await page.goto('spaces');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(page.locator('body').getByText(/Library spaces/)).toBeVisible();

        const bookableId = 19;
        const bookableCheckbox = page.getByTestId(`facility-type-listitem-${bookableId}`);
        const bookableExcludeCheckboxlabel = page.getByTestId(`reject-filtertype-label-${bookableId}`);
        const bookableUnsetCartouche = page.getByTestId(`button-deselect-unselected-${bookableId}`);
        const avEquipmentId = 8;
        const avEquipmentCheckbox = page.getByTestId(`facility-type-listitem-${avEquipmentId}`);
        const avEquipmentUnsetCartouche = page.getByTestId(`button-deselect-selected-${avEquipmentId}`);

        const forganSmithCollaborativeSpace = page.getByTestId(`${FORGEN}`).locator('h2');
        const duttonParkGroupStudyRoom = page.getByTestId(`${PACE}`).locator('h2');
        const andrewLiverisComputerRoom = page.getByTestId(`${LIVERIS}`).locator('h2');

        // there are initially 3 Spaces visible on the page
        await expect(page.getByTestId('space-wrapper').locator(':scope > *')).toHaveCount(3);
        await expect(page.getByTestId('no-spaces-visible')).not.toBeVisible();
        await expect(forganSmithCollaborativeSpace).toBeVisible();
        await expect(duttonParkGroupStudyRoom).toBeVisible();
        await expect(andrewLiverisComputerRoom).toBeVisible();

        // filter to show "AV equipment" only
        await expect(avEquipmentCheckbox.locator('label:first-of-type')).toBeVisible();
        await expect(avEquipmentCheckbox.locator('label:first-of-type')).toContainText('AV equipment');
        await avEquipmentCheckbox.locator('span input').check();

        // only 2 Spaces visible on the page
        await expect(page.getByTestId('space-wrapper').locator(':scope > *')).toHaveCount(2);
        await expect(page.getByTestId('no-spaces-visible')).not.toBeVisible();
        await expect(forganSmithCollaborativeSpace).toBeVisible();
        await expect(duttonParkGroupStudyRoom).not.toBeVisible();

        // cartouche visible
        await expect(avEquipmentUnsetCartouche).toBeVisible();
        await expect(avEquipmentUnsetCartouche).toContainText('AV equipment');
        await expect(page.getByTestId('button-deselect-list').locator(':scope > *')).toHaveCount(1);

        // select "exclude bookable" filter
        await bookableCheckbox.locator('span.fortestfocus').click(); // a hack of the page so playwright can tap on the exclude filter
        await expect(bookableExcludeCheckboxlabel).toBeVisible();
        await bookableExcludeCheckboxlabel.check();

        // and we are down to 1 showing
        await expect(page.getByTestId('space-wrapper').locator(':scope > *')).toHaveCount(1);
        await expect(page.getByTestId('no-spaces-visible')).not.toBeVisible();
        await expect(forganSmithCollaborativeSpace).toBeVisible();
        await expect(duttonParkGroupStudyRoom).not.toBeVisible();
        await expect(andrewLiverisComputerRoom).not.toBeVisible();

        // cartouche visible
        await expect(avEquipmentUnsetCartouche).toBeVisible();
        await expect(avEquipmentUnsetCartouche).toContainText('AV equipment');
        await expect(bookableUnsetCartouche).toBeVisible();
        await expect(bookableUnsetCartouche).toContainText('Bookable');
        await expect(page.getByTestId('button-deselect-list').locator(':scope > *')).toHaveCount(2);

        // now unfilter using the cartouches
        await avEquipmentUnsetCartouche.click();

        // back to 2 Spaces visible on the page
        await expect(page.getByTestId('space-wrapper').locator(':scope > *')).toHaveCount(2);
        await expect(page.getByTestId('no-spaces-visible')).not.toBeVisible();
        await expect(forganSmithCollaborativeSpace).toBeVisible();
        await expect(duttonParkGroupStudyRoom).toBeVisible();
        await expect(andrewLiverisComputerRoom).not.toBeVisible();

        await bookableUnsetCartouche.click();

        // back to 3 Spaces visible on the page
        await expect(page.getByTestId('space-wrapper').locator(':scope > *')).toHaveCount(3);
        await expect(page.getByTestId('no-spaces-visible')).not.toBeVisible();
        await expect(forganSmithCollaborativeSpace).toBeVisible();
        await expect(duttonParkGroupStudyRoom).toBeVisible();
        await expect(andrewLiverisComputerRoom).toBeVisible();

        // no cartouches left
        await expect(page.getByTestId('button-deselect-list').locator(':scope > *')).toHaveCount(0);
    });
    test('can clear all filters with one click', async ({ page }) => {
        await page.goto('spaces');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(page.locator('body').getByText(/Library spaces/)).toBeVisible();

        await page.goto('spaces');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(page.locator('body').getByText(/Library spaces/)).toBeVisible();

        const bookableId = 19;
        const bookableCheckbox = page.getByTestId(`facility-type-listitem-${bookableId}`);
        const bookableExcludeCheckboxlabel = page.getByTestId(`reject-filtertype-label-${bookableId}`);
        const avEquipmentId = 8;
        const avEquipmentCheckbox = page.getByTestId(`facility-type-listitem-${avEquipmentId}`);

        // select some filters
        await avEquipmentCheckbox.locator('span input').check();

        await bookableCheckbox.locator('span.fortestfocus').click(); // a hack of the page so playwright can tap on the exclude filter
        await expect(bookableExcludeCheckboxlabel).toBeVisible();
        await bookableExcludeCheckboxlabel.check();

        // correct number of cartouches showing
        await expect(page.getByTestId('button-deselect-list').locator(':scope > *')).toHaveCount(2);
        // correct number of panels showing
        await expect(page.getByTestId('space-wrapper').locator(':scope > *')).toHaveCount(1);

        // click deselect-all-cartouches
        await expect(page.getByTestId('button-deselect-all-filters')).toBeVisible();
        page.getByTestId('button-deselect-all-filters').click();

        // all panels visible
        await expect(page.getByTestId('space-wrapper').locator(':scope > *')).toHaveCount(3);
        // all cartouches removed
        await expect(page.getByTestId('button-deselect-list').locator(':scope > *')).toHaveCount(0);
        // no checkboxes checked
        await expect(page.getByTestId('sidebarCheckboxes').locator(':scope > *[type="checkbox"]:checked')).toHaveCount(
            0,
        );
    });
    test.describe('sidebar filter type group can open-collapse', () => {
        const FILTER_GROUP_EDIA = 8;
        const FILTER_GROUP_SPACE_ROOM_TYPE = 1;
        const FILTER_GROUP_ON_THIS_FLOOR = 2;
        const FILTER_GROUP_LIGHTING = 4;
        const FILTER_GROUP_NOISE_LEVEL = 5;
        const FILTER_GROUP_ROOM_FEATURES = 6;
        const FILTER_GROUP_SPACE_FEATURES = 3;

        const filterGroup = (groupId: string | number, page: Page) => page.getByTestId('filter-group-block-' + groupId);

        test('sidebar filter type group open-collapse loads correctly', async ({ page }) => {
            await page.goto('spaces');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.getByTestId('sidebarCheckboxes').getByText(/Filter Spaces/)).toBeVisible();

            await expect(filterGroup(FILTER_GROUP_EDIA, page)).toBeVisible();
            await expect(
                filterGroup(FILTER_GROUP_EDIA, page)
                    .locator('h3')
                    .getByText(/EDIA filters/),
            ).toBeVisible();
            await expect(page.getByTestId('facility-type-group-8-open')).toBeVisible();
            await expect(page.getByTestId('facility-type-group-8-collapsed')).not.toBeVisible();

            await expect(filterGroup(FILTER_GROUP_SPACE_ROOM_TYPE, page)).toBeVisible();
            await expect(
                filterGroup(FILTER_GROUP_SPACE_ROOM_TYPE, page)
                    .locator('h3')
                    .getByText(/Space\/Room Type/),
            ).toBeVisible();
            await expect(page.getByTestId('facility-type-group-1-open')).toBeVisible();
            await expect(page.getByTestId('facility-type-group-1-collapsed')).not.toBeVisible();

            // ON THIS FLOOR LOADS CLOSED
            await expect(filterGroup(FILTER_GROUP_ON_THIS_FLOOR, page)).toBeVisible();
            await expect(
                filterGroup(FILTER_GROUP_ON_THIS_FLOOR, page)
                    .locator('h3')
                    .getByText(/On this floor/),
            ).toBeVisible();
            await expect(page.getByTestId('facility-type-group-2-open')).not.toBeVisible();
            await expect(page.getByTestId('facility-type-group-2-collapsed')).toBeVisible();

            await expect(filterGroup(FILTER_GROUP_LIGHTING, page)).toBeVisible();
            await expect(
                filterGroup(FILTER_GROUP_LIGHTING, page)
                    .locator('h3')
                    .getByText(/Lighting/),
            ).toBeVisible();
            await expect(page.getByTestId('facility-type-group-4-open')).toBeVisible();
            await expect(page.getByTestId('facility-type-group-4-collapsed')).not.toBeVisible();

            await expect(filterGroup(FILTER_GROUP_NOISE_LEVEL, page)).toBeVisible();
            await expect(
                filterGroup(FILTER_GROUP_NOISE_LEVEL, page)
                    .locator('h3')
                    .getByText(/Acceptable noise/),
            ).toBeVisible();
            await expect(page.getByTestId('facility-type-group-5-open')).toBeVisible();
            await expect(page.getByTestId('facility-type-group-5-collapsed')).not.toBeVisible();

            // ROOM FEATURES LOADS CLOSED
            await expect(filterGroup(FILTER_GROUP_ROOM_FEATURES, page)).toBeVisible();
            await expect(
                filterGroup(FILTER_GROUP_ROOM_FEATURES, page)
                    .locator('h3')
                    .getByText(/Room features/),
            ).toBeVisible();
            await expect(page.getByTestId('facility-type-group-6-open')).not.toBeVisible();
            await expect(page.getByTestId('facility-type-group-6-collapsed')).toBeVisible();

            await expect(filterGroup(FILTER_GROUP_SPACE_FEATURES, page)).toBeVisible();
            await expect(
                filterGroup(FILTER_GROUP_SPACE_FEATURES, page)
                    .locator('h3')
                    .getByText(/Space features/),
            ).toBeVisible();
            await expect(page.getByTestId('facility-type-group-3-open')).toBeVisible();
            await expect(page.getByTestId('facility-type-group-3-collapsed')).not.toBeVisible();
        });
        test('collapsing an open sidebar filter type group shows correctly', async ({ page }) => {
            await page.goto('spaces');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.getByTestId('sidebarCheckboxes').getByText(/Filter Spaces/)).toBeVisible();

            await expect(filterGroup(FILTER_GROUP_EDIA, page)).toBeVisible();
            await expect(
                filterGroup(FILTER_GROUP_EDIA, page)
                    .locator('h3')
                    .getByText(/EDIA filters/),
            ).toBeVisible();
            await expect(page.getByTestId(`facility-type-group-${FILTER_GROUP_EDIA}-open`)).toBeVisible();
            await expect(page.getByTestId(`facility-type-group-${FILTER_GROUP_EDIA}-collapsed`)).not.toBeVisible();
            await expect(filterGroup(FILTER_GROUP_EDIA, page).locator('ul')).toBeVisible();
            await expect(
                filterGroup(FILTER_GROUP_EDIA, page)
                    .locator('ul')
                    .locator(':scope > *'),
            ).toHaveCount(1);

            await expect(filterGroup(FILTER_GROUP_EDIA, page).locator('ul')).toBeVisible();
            await expect(filterGroup(FILTER_GROUP_EDIA, page).locator('ul li')).toBeVisible();
            await expect(page.getByTestId(`facility-type-group-${FILTER_GROUP_EDIA}-open`)).toBeVisible();
            await expect(page.getByTestId(`facility-type-group-${FILTER_GROUP_EDIA}-collapsed`)).not.toBeVisible();

            // the state of the other groups is known (and won't change after click)
            await expect(filterGroup(FILTER_GROUP_SPACE_ROOM_TYPE, page).locator('ul')).toBeVisible();
            await expect(filterGroup(FILTER_GROUP_ON_THIS_FLOOR, page).locator('ul')).not.toBeVisible();
            await expect(filterGroup(FILTER_GROUP_LIGHTING, page).locator('ul')).toBeVisible();
            await expect(filterGroup(FILTER_GROUP_NOISE_LEVEL, page).locator('ul')).toBeVisible();
            await expect(filterGroup(FILTER_GROUP_ROOM_FEATURES, page).locator('ul')).not.toBeVisible();
            await expect(filterGroup(FILTER_GROUP_SPACE_FEATURES, page).locator('ul')).toBeVisible();

            // open "edia"
            await page.getByTestId(`facility-type-group-${FILTER_GROUP_EDIA}-open`).click();

            // visibility flips
            await expect(filterGroup(FILTER_GROUP_EDIA, page).locator('ul')).not.toBeVisible();
            await expect(filterGroup(FILTER_GROUP_EDIA, page).locator('ul li')).not.toBeVisible();
            await expect(page.getByTestId(`facility-type-group-${FILTER_GROUP_EDIA}-open`)).not.toBeVisible();
            await expect(page.getByTestId(`facility-type-group-${FILTER_GROUP_EDIA}-collapsed`)).toBeVisible();

            // the state of the other groups is unchanged
            await expect(filterGroup(FILTER_GROUP_SPACE_ROOM_TYPE, page).locator('ul')).toBeVisible();
            await expect(filterGroup(FILTER_GROUP_ON_THIS_FLOOR, page).locator('ul')).not.toBeVisible();
            await expect(filterGroup(FILTER_GROUP_LIGHTING, page).locator('ul')).toBeVisible();
            await expect(filterGroup(FILTER_GROUP_NOISE_LEVEL, page).locator('ul')).toBeVisible();
            await expect(filterGroup(FILTER_GROUP_ROOM_FEATURES, page).locator('ul')).not.toBeVisible();
            await expect(filterGroup(FILTER_GROUP_SPACE_FEATURES, page).locator('ul')).toBeVisible();
        });
        test('opening a collapsed sidebar filter type group shows correctly', async ({ page }) => {
            await page.goto('spaces');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.getByTestId('sidebarCheckboxes').getByText(/Filter Spaces/)).toBeVisible();

            // the group we will open appears as expected
            await expect(filterGroup(FILTER_GROUP_ON_THIS_FLOOR, page)).toBeVisible();
            await expect(
                filterGroup(FILTER_GROUP_ON_THIS_FLOOR, page)
                    .locator('h3')
                    .getByText(/On this floor/),
            ).toBeVisible();
            await expect(
                filterGroup(FILTER_GROUP_ON_THIS_FLOOR, page)
                    .locator('ul')
                    .locator(':scope > *'),
            ).toHaveCount(4);

            // certain groups are showing or hiding
            await expect(page.getByTestId(`facility-type-group-${FILTER_GROUP_ON_THIS_FLOOR}-open`)).not.toBeVisible();
            await expect(page.getByTestId(`facility-type-group-${FILTER_GROUP_ON_THIS_FLOOR}-collapsed`)).toBeVisible();
            await expect(filterGroup(FILTER_GROUP_ON_THIS_FLOOR, page).locator('ul')).not.toBeVisible();
            await expect(
                filterGroup(FILTER_GROUP_ON_THIS_FLOOR, page).locator('ul li:first-of-type'),
            ).not.toBeVisible();
            await expect(page.getByTestId(`facility-type-group-${FILTER_GROUP_ON_THIS_FLOOR}-open`)).not.toBeVisible();
            await expect(page.getByTestId(`facility-type-group-${FILTER_GROUP_ON_THIS_FLOOR}-collapsed`)).toBeVisible();

            // the state of the other groups is known (and won't change after click)
            await expect(filterGroup(FILTER_GROUP_EDIA, page).locator('ul')).toBeVisible();
            await expect(filterGroup(FILTER_GROUP_SPACE_ROOM_TYPE, page).locator('ul')).toBeVisible();
            await expect(filterGroup(FILTER_GROUP_LIGHTING, page).locator('ul')).toBeVisible();
            await expect(filterGroup(FILTER_GROUP_NOISE_LEVEL, page).locator('ul')).toBeVisible();
            await expect(filterGroup(FILTER_GROUP_ROOM_FEATURES, page).locator('ul')).not.toBeVisible();
            await expect(filterGroup(FILTER_GROUP_SPACE_FEATURES, page).locator('ul')).toBeVisible();

            // open "on this floor" sidebar filter type group
            await page.getByTestId(`facility-type-group-${FILTER_GROUP_ON_THIS_FLOOR}-collapsed`).click();

            // the group we opened has completely changed - visibility flips
            await expect(filterGroup(FILTER_GROUP_ON_THIS_FLOOR, page).locator('ul')).toBeVisible();
            await expect(filterGroup(FILTER_GROUP_ON_THIS_FLOOR, page).locator('ul li:first-of-type')).toBeVisible();
            await expect(page.getByTestId(`facility-type-group-${FILTER_GROUP_ON_THIS_FLOOR}-open`)).toBeVisible();
            await expect(
                page.getByTestId(`facility-type-group-${FILTER_GROUP_ON_THIS_FLOOR}-collapsed`),
            ).not.toBeVisible();

            // the state of the other groups is unchanged
            await expect(filterGroup(FILTER_GROUP_EDIA, page).locator('ul')).toBeVisible();
            await expect(filterGroup(FILTER_GROUP_SPACE_ROOM_TYPE, page).locator('ul')).toBeVisible();
            await expect(filterGroup(FILTER_GROUP_LIGHTING, page).locator('ul')).toBeVisible();
            await expect(filterGroup(FILTER_GROUP_NOISE_LEVEL, page).locator('ul')).toBeVisible();
            await expect(filterGroup(FILTER_GROUP_ROOM_FEATURES, page).locator('ul')).not.toBeVisible();
            await expect(filterGroup(FILTER_GROUP_SPACE_FEATURES, page).locator('ul')).toBeVisible();
        });
        test('multiple open-collapse sidebar filter type group shows correctly', async ({ page }) => {
            await page.goto('spaces');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.getByTestId('sidebarCheckboxes').getByText(/Filter Spaces/)).toBeVisible();

            // sidebar filter types group load open-collapsedness as expected
            await expect(filterGroup(FILTER_GROUP_EDIA, page).locator('ul')).toBeVisible();
            await expect(filterGroup(FILTER_GROUP_SPACE_ROOM_TYPE, page).locator('ul')).toBeVisible();
            await expect(filterGroup(FILTER_GROUP_ON_THIS_FLOOR, page).locator('ul')).not.toBeVisible();
            await expect(filterGroup(FILTER_GROUP_LIGHTING, page).locator('ul')).toBeVisible();
            await expect(filterGroup(FILTER_GROUP_NOISE_LEVEL, page).locator('ul')).toBeVisible();
            await expect(filterGroup(FILTER_GROUP_ROOM_FEATURES, page).locator('ul')).not.toBeVisible();
            await expect(filterGroup(FILTER_GROUP_SPACE_FEATURES, page).locator('ul')).toBeVisible();

            // open "on this floor" sidebar filter type group
            await page.getByTestId(`facility-type-group-${FILTER_GROUP_ON_THIS_FLOOR}-collapsed`).click();

            await expect(filterGroup(FILTER_GROUP_EDIA, page).locator('ul')).toBeVisible();
            await expect(filterGroup(FILTER_GROUP_SPACE_ROOM_TYPE, page).locator('ul')).toBeVisible();
            await expect(filterGroup(FILTER_GROUP_ON_THIS_FLOOR, page).locator('ul')).toBeVisible();
            await expect(filterGroup(FILTER_GROUP_LIGHTING, page).locator('ul')).toBeVisible();
            await expect(filterGroup(FILTER_GROUP_NOISE_LEVEL, page).locator('ul')).toBeVisible();
            await expect(filterGroup(FILTER_GROUP_ROOM_FEATURES, page).locator('ul')).not.toBeVisible();
            await expect(filterGroup(FILTER_GROUP_SPACE_FEATURES, page).locator('ul')).toBeVisible();

            // collapse "edia" sidebar filter type group
            await page.getByTestId(`facility-type-group-${FILTER_GROUP_EDIA}-open`).click();

            await expect(filterGroup(FILTER_GROUP_EDIA, page).locator('ul')).not.toBeVisible();
            await expect(filterGroup(FILTER_GROUP_SPACE_ROOM_TYPE, page).locator('ul')).toBeVisible();
            await expect(filterGroup(FILTER_GROUP_ON_THIS_FLOOR, page).locator('ul')).toBeVisible();
            await expect(filterGroup(FILTER_GROUP_LIGHTING, page).locator('ul')).toBeVisible();
            await expect(filterGroup(FILTER_GROUP_NOISE_LEVEL, page).locator('ul')).toBeVisible();
            await expect(filterGroup(FILTER_GROUP_ROOM_FEATURES, page).locator('ul')).not.toBeVisible();
            await expect(filterGroup(FILTER_GROUP_SPACE_FEATURES, page).locator('ul')).toBeVisible();

            // collapse "noise level" sidebar filter type roup
            await page.getByTestId(`facility-type-group-${FILTER_GROUP_NOISE_LEVEL}-open`).click();

            await expect(filterGroup(FILTER_GROUP_EDIA, page).locator('ul')).not.toBeVisible();
            await expect(filterGroup(FILTER_GROUP_SPACE_ROOM_TYPE, page).locator('ul')).toBeVisible();
            await expect(filterGroup(FILTER_GROUP_ON_THIS_FLOOR, page).locator('ul')).toBeVisible();
            await expect(filterGroup(FILTER_GROUP_LIGHTING, page).locator('ul')).toBeVisible();
            await expect(filterGroup(FILTER_GROUP_NOISE_LEVEL, page).locator('ul')).not.toBeVisible();
            await expect(filterGroup(FILTER_GROUP_ROOM_FEATURES, page).locator('ul')).not.toBeVisible();
            await expect(filterGroup(FILTER_GROUP_SPACE_FEATURES, page).locator('ul')).toBeVisible();

            // re-open "edia" sidebar filter type roup
            await page.getByTestId(`facility-type-group-${FILTER_GROUP_EDIA}-collapsed`).click();

            await expect(filterGroup(FILTER_GROUP_EDIA, page).locator('ul')).toBeVisible();
            await expect(filterGroup(FILTER_GROUP_SPACE_ROOM_TYPE, page).locator('ul')).toBeVisible();
            await expect(filterGroup(FILTER_GROUP_ON_THIS_FLOOR, page).locator('ul')).toBeVisible();
            await expect(filterGroup(FILTER_GROUP_LIGHTING, page).locator('ul')).toBeVisible();
            await expect(filterGroup(FILTER_GROUP_NOISE_LEVEL, page).locator('ul')).not.toBeVisible();
            await expect(filterGroup(FILTER_GROUP_ROOM_FEATURES, page).locator('ul')).not.toBeVisible();
            await expect(filterGroup(FILTER_GROUP_SPACE_FEATURES, page).locator('ul')).toBeVisible();

            // re-collapse "on this floor" sidebar filter type roup
            await page.getByTestId(`facility-type-group-${FILTER_GROUP_ON_THIS_FLOOR}-open`).click();

            await expect(filterGroup(FILTER_GROUP_EDIA, page).locator('ul')).toBeVisible();
            await expect(filterGroup(FILTER_GROUP_SPACE_ROOM_TYPE, page).locator('ul')).toBeVisible();
            await expect(filterGroup(FILTER_GROUP_ON_THIS_FLOOR, page).locator('ul')).not.toBeVisible();
            await expect(filterGroup(FILTER_GROUP_LIGHTING, page).locator('ul')).toBeVisible();
            await expect(filterGroup(FILTER_GROUP_NOISE_LEVEL, page).locator('ul')).not.toBeVisible();
            await expect(filterGroup(FILTER_GROUP_ROOM_FEATURES, page).locator('ul')).not.toBeVisible();
            await expect(filterGroup(FILTER_GROUP_SPACE_FEATURES, page).locator('ul')).toBeVisible();
        });
        test('sidebar filter type groups show count when selected and collapsed', async ({ page }) => {
            await page.goto('spaces');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.getByTestId('sidebarCheckboxes').getByText(/Filter Spaces/)).toBeVisible();

            const openCountTestId = (groupId: number) => `facility-type-group-${groupId}-open-count`;

            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_EDIA))).not.toBeVisible();
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_SPACE_ROOM_TYPE))).not.toBeVisible();
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_ON_THIS_FLOOR))).not.toBeVisible();
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_LIGHTING))).not.toBeVisible();
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_NOISE_LEVEL))).not.toBeVisible();
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_ROOM_FEATURES))).not.toBeVisible();
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_SPACE_FEATURES))).not.toBeVisible();

            // open "on this floor" sidebar filter type group
            await page.getByTestId(`facility-type-group-${FILTER_GROUP_ON_THIS_FLOOR}-collapsed`).click();

            // filter to show "Recharge Station" only
            const rechargeStationId = 29;
            const rechargeStationCheckbox = page.getByTestId(`facility-type-listitem-${rechargeStationId}`);
            await expect(rechargeStationCheckbox.locator('label:first-of-type')).toBeVisible();
            await expect(rechargeStationCheckbox.locator('label:first-of-type')).toContainText('Recharge Station');
            await rechargeStationCheckbox.locator('span input').check();

            // still no counts show
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_EDIA))).not.toBeVisible();
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_SPACE_ROOM_TYPE))).not.toBeVisible();
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_ON_THIS_FLOOR))).not.toBeVisible();
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_LIGHTING))).not.toBeVisible();
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_NOISE_LEVEL))).not.toBeVisible();
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_ROOM_FEATURES))).not.toBeVisible();
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_SPACE_FEATURES))).not.toBeVisible();

            // re-collapse "on this floor" sidebar filter type group
            await page.getByTestId(`facility-type-group-${FILTER_GROUP_ON_THIS_FLOOR}-open`).click();

            // NOW a count shows on that single collapsed group
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_ON_THIS_FLOOR))).toBeVisible();
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_ON_THIS_FLOOR))).toHaveText('(1 of 4)');

            // collapse a few more, to be sure
            await page.getByTestId(`facility-type-group-${FILTER_GROUP_EDIA}-open`).click();
            await page.getByTestId(`facility-type-group-${FILTER_GROUP_NOISE_LEVEL}-open`).click();
            await page.getByTestId(`facility-type-group-${FILTER_GROUP_SPACE_FEATURES}-open`).click();

            // other counts still don't show
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_EDIA))).not.toBeVisible();
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_SPACE_ROOM_TYPE))).not.toBeVisible();
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_LIGHTING))).not.toBeVisible();
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_NOISE_LEVEL))).not.toBeVisible();
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_ROOM_FEATURES))).not.toBeVisible();
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_SPACE_FEATURES))).not.toBeVisible();
        });
        test('sidebar filter type groups show count when selected and collapsed with single entry', async ({
            page,
        }) => {
            await page.goto('spaces');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.getByTestId('sidebarCheckboxes').getByText(/Filter Spaces/)).toBeVisible();

            const openCountTestId = (groupId: number) => `facility-type-group-${groupId}-open-count`;

            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_EDIA))).not.toBeVisible();
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_SPACE_ROOM_TYPE))).not.toBeVisible();
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_ON_THIS_FLOOR))).not.toBeVisible();
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_LIGHTING))).not.toBeVisible();
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_NOISE_LEVEL))).not.toBeVisible();
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_ROOM_FEATURES))).not.toBeVisible();
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_SPACE_FEATURES))).not.toBeVisible();

            // filter to show "Contains Artwork" only
            const containsArtworkId = 57;
            const containsArtworkCheckbox = page.getByTestId(`facility-type-listitem-${containsArtworkId}`);
            await expect(containsArtworkCheckbox.locator('label:first-of-type')).toBeVisible();
            await expect(containsArtworkCheckbox.locator('label:first-of-type')).toContainText('Contains Artwork');
            await containsArtworkCheckbox.locator('span input').check();

            // still no counts show
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_EDIA))).not.toBeVisible();
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_SPACE_ROOM_TYPE))).not.toBeVisible();
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_ON_THIS_FLOOR))).not.toBeVisible();
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_LIGHTING))).not.toBeVisible();
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_NOISE_LEVEL))).not.toBeVisible();
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_ROOM_FEATURES))).not.toBeVisible();
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_SPACE_FEATURES))).not.toBeVisible();

            // collapse "on this floor" sidebar filter type group
            await page.getByTestId(`facility-type-group-${FILTER_GROUP_EDIA}-open`).click();

            // NOW a count shows on that single collapsed group
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_EDIA))).toBeVisible();
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_EDIA))).toHaveText('(1 of 1)');

            // collapse a few more, to be sure
            await page.getByTestId(`facility-type-group-${FILTER_GROUP_NOISE_LEVEL}-open`).click();
            await page.getByTestId(`facility-type-group-${FILTER_GROUP_SPACE_FEATURES}-open`).click();

            // other counts still don't show
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_SPACE_ROOM_TYPE))).not.toBeVisible();
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_ON_THIS_FLOOR))).not.toBeVisible();
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_LIGHTING))).not.toBeVisible();
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_NOISE_LEVEL))).not.toBeVisible();
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_ROOM_FEATURES))).not.toBeVisible();
            await expect(page.getByTestId(openCountTestId(FILTER_GROUP_SPACE_FEATURES))).not.toBeVisible();
        });
    });
});
test.describe('Spaces errors', () => {
    test('spaces list load error', async ({ page }) => {
        await page.goto('spaces?responseType=error-spaces');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(page.locator('body').getByText(/Library spaces/)).toBeVisible();

        await expect(page.getByTestId('spaces-error')).toBeVisible();
        await expect(page.getByTestId('spaces-error')).toContainText('Something went wrong - please try again later.');
    });
    test('facilities list load error', async ({ page }) => {
        await page.goto('spaces?responseType=facilityTypesAllError');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(page.locator('body').getByText(/Library spaces/)).toBeVisible();

        await expect(page.getByTestId('spaces-error')).toBeVisible();
        await expect(page.getByTestId('spaces-error')).toContainText('Something went wrong - please try again later.');
    });
    test('weekly hours list load error', async ({ page }) => {
        await page.goto('spaces?responseType=weeklyHoursError');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(page.locator('body').getByText(/Library spaces/)).toBeVisible();

        // page.getByTestId(`expand-button-${FORGEN}`).click();
        await expect(page.getByTestId(`${FORGEN}-weekly-hours-error`)).toBeVisible();
        await expect(page.getByTestId(`${FORGEN}-weekly-hours-error`)).toContainText(
            'General opening hours currently unavailable - please try again later.',
        );
    });
});
