import { expect, test } from '@uq/pw/test';
import { assertAccessibility } from '@uq/pw/lib/axe';

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
        await expect(page.getByTestId('space-123456-openingHours-0')).toBeDefined();
        await expect(page.getByTestId('space-123456-openingHours-0')).not.toBeVisible(); // hidden on load
        await expect(page.getByTestId('space-123456-openingHours-0')).toContainText('Today');
        await expect(page.getByTestId('space-123456-openingHours-1')).toContainText('Tomorrow');

        // second and third panels have override opening hours
        await expect(page.getByTestId('override_opening_hours_987y_isjgt_9866')).not.toBeVisible();
        await expect(page.getByTestId('override_opening_hours_9867y_isjgt_9866')).toContainText(
            'this space opens at 8am',
        );
        await expect(page.getByTestId('override_opening_hours_987y_isjgt_9867')).toContainText(
            'open from 7am Monday - Friday',
        );

        // description only displayed where provided
        await expect(page.getByTestId('space-description-123456')).toHaveCount(1);
        await expect(page.getByTestId('space-description-1234544')).toHaveCount(1);
        await expect(page.getByTestId('space-description-43534')).toHaveCount(0);

        // facilities are correct
        await expect(page.getByTestId('facility-123456')).toBeDefined();
        await expect(page.getByTestId('facility-123456')).not.toBeVisible();
        await expect(page.getByTestId('facility-123456').locator(' > *')).toHaveCount(13);
        await expect(page.getByTestId('facility-123456-23')).toContainText('Toilets, female');
        await expect(page.getByTestId('facility-123456-22')).toContainText('Toilets, male');
        await expect(page.getByTestId('facility-123456-29')).toContainText('Recharge Station');
        await expect(page.getByTestId('facility-123456-31')).toContainText('Self-printing & scanning');
        await expect(page.getByTestId('facility-123456-17')).toContainText('Low noise level');
        await expect(page.getByTestId('facility-123456-5')).toContainText('Computer');
        await expect(page.getByTestId('facility-123456-33')).toContainText('Client accessible power point');
        await expect(page.getByTestId('facility-123456-38')).toContainText('Whiteboard');
        await expect(page.getByTestId('facility-123456-39')).toContainText('Adjustable desks');
        await expect(page.getByTestId('facility-123456-8')).toContainText('AV equipment');
        await expect(page.getByTestId('facility-123456-13')).toContainText('Postgraduate spaces');
        await expect(page.getByTestId('facility-123456-14')).toContainText('Undergrad spaces');
        await expect(page.getByTestId('facility-123456-57')).toContainText('Contains Artwork');

        await expect(page.getByTestId('facility-1234544')).toBeDefined();
        await expect(page.getByTestId('facility-1234544')).not.toBeVisible();
        await expect(page.getByTestId('facility-1234544').locator(' > *')).toHaveCount(15);
        await expect(page.getByTestId('facility-1234544-23')).toContainText('Toilets, female');
        await expect(page.getByTestId('facility-1234544-22')).toContainText('Toilets, male');
        await expect(page.getByTestId('facility-1234544-29')).toContainText('Recharge Station');
        await expect(page.getByTestId('facility-1234544-31')).toContainText('Self-printing & scanning');
        await expect(page.getByTestId('facility-1234544-5')).toContainText('Computer');
        await expect(page.getByTestId('facility-1234544-32')).toContainText('BYOD station');
        await expect(page.getByTestId('facility-1234544-33')).toContainText('Client accessible power point');
        await expect(page.getByTestId('facility-1234544-34')).toContainText('on-desk USB-A');
        await expect(page.getByTestId('facility-1234544-35')).toContainText('Qi chargers');
        await expect(page.getByTestId('facility-1234544-36')).toContainText('On-desk USB-C, Low Power');
        await expect(page.getByTestId('facility-1234544-42')).toContainText('General Collections');
        await expect(page.getByTestId('facility-1234544-44')).toContainText('Requested items');
        await expect(page.getByTestId('facility-1234544-45')).toContainText('Lending');
        await expect(page.getByTestId('facility-1234544-46')).toContainText('Return station');
        await expect(page.getByTestId('facility-1234544-10')).toContainText('High noise level');

        await expect(page.getByTestId('facility-43534')).toBeDefined();
        await expect(page.getByTestId('facility-43534')).not.toBeVisible();
        await expect(page.getByTestId('facility-43534').locator(' > *')).toHaveCount(10);
        await expect(page.getByTestId('facility-43534-19')).toContainText('Bookable');
        await expect(page.getByTestId('facility-43534-23')).toContainText('Toilets, female');
        await expect(page.getByTestId('facility-43534-22')).toContainText('Toilets, male');
        await expect(page.getByTestId('facility-43534-29')).toContainText('Recharge Station');
        await expect(page.getByTestId('facility-43534-31')).toContainText('Self-printing & scanning');
        await expect(page.getByTestId('facility-43534-33')).toContainText('Client accessible power point');
        await expect(page.getByTestId('facility-43534-8')).toContainText('AV equipment');
        await expect(page.getByTestId('facility-43534-50')).toContainText('Natural');
        await expect(page.getByTestId('facility-43534-13')).toContainText('Postgraduate spaces');
        await expect(page.getByTestId('facility-43534-14')).toContainText('Undergrad spaces');

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
    test('can show-hide block contents', async ({ page }) => {
        await page.goto('spaces');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(page.locator('body').getByText(/Library spaces/)).toBeVisible();

        await expect(page.getByTestId('space-123456').locator('h2')).toBeVisible();
        await expect(page.getByTestId('expand-button-space-123456')).toBeVisible();
        await expect(page.getByTestId('collapse-button-space-123456')).not.toBeVisible();

        // initially the lower block is hidden
        await expect(page.getByTestId('facility-123456')).not.toBeVisible();
        await expect(page.getByTestId('facility-1234544')).not.toBeVisible();
        await expect(page.getByTestId('facility-43534')).not.toBeVisible();

        // and description is truncated
        await expect(page.getByTestId('space-description-123456')).toBeVisible();
        await expect(page.getByTestId('space-description-123456')).toHaveClass(/truncated/);

        // expand the bottom space
        page.getByTestId('expand-button-space-123456').click();

        // the lower block is visible
        await expect(page.getByTestId('facility-123456')).not.toBeVisible();
        // the other blocks have not appeared
        await expect(page.getByTestId('facility-1234544')).not.toBeVisible();
        await expect(page.getByTestId('facility-43534')).not.toBeVisible();
        // and description is NOTtruncated
        await expect(page.getByTestId('space-description-123456')).toBeVisible();
        await expect(page.getByTestId('space-description-123456')).not.toHaveClass(/truncated/);
        // and the controls have swapped
        await expect(page.getByTestId('expand-button-space-123456')).not.toBeVisible();
        await expect(page.getByTestId('collapse-button-space-123456')).toBeVisible();

        // collapse the bottom space
        page.getByTestId('collapse-button-space-123456').click();

        // and the lower details are hidden again
        await expect(page.getByTestId('facility-123456')).toBeVisible();
        // the other blocks have not appeared
        await expect(page.getByTestId('facility-1234544')).not.toBeVisible();
        await expect(page.getByTestId('facility-43534')).not.toBeVisible();
        // and description is truncated
        await expect(page.getByTestId('space-description-123456')).toBeVisible();
        await expect(page.getByTestId('space-description-123456')).toHaveClass(/truncated/);
        // and the controls have swapped
        await expect(page.getByTestId('expand-button-space-123456')).toBeVisible();
        await expect(page.getByTestId('collapse-button-space-123456')).not.toBeVisible();
    });
    test('can filter', async ({ page }) => {
        await page.goto('spaces');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(page.locator('body').getByText(/Library spaces/)).toBeVisible();

        const bookableId = 19;
        const bookableCheckbox = page.getByTestId(`facility-type-listitem-${bookableId}`);
        const bookableExcludeCheckboxlabel = page.getByTestId(`reject-filtertype-label-${bookableId}`);
        const adjustableDeskCheckbox = page.getByTestId('facility-type-listitem-39');
        const avEquipmentCheckbox = page.getByTestId('facility-type-listitem-8');
        const byodStationCheckbox = page.getByTestId('facility-type-listitem-32');

        const forganSmithCollaborativeSpace = page.getByTestId('space-123456').locator('h2');
        const duttonParkGroupStudyRoom = page.getByTestId('space-1234544').locator('h2');
        const andrewLiverisComputerRoom = page.getByTestId('space-43534').locator('h2');

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

        // select "exclude bookable" filter, and we are down to 2 showing
        await bookableCheckbox.locator('span.fortestfocus').click(); // a hack of the page so playwright can tap on the exclude filter
        await expect(bookableExcludeCheckboxlabel).toBeVisible();
        await bookableExcludeCheckboxlabel.check();
        await expect(page.getByTestId('space-wrapper').locator(':scope > *')).toHaveCount(2);
        await expect(page.getByTestId('no-spaces-visible')).not.toBeVisible();
        await expect(forganSmithCollaborativeSpace).toBeVisible();
        await expect(duttonParkGroupStudyRoom).toBeVisible();
        await expect(andrewLiverisComputerRoom).not.toBeVisible();
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

        page.getByTestId('expand-button-space-123456').click();
        await expect(page.getByTestId('weekly-hours-error-123456')).toBeVisible();
        await expect(page.getByTestId('weekly-hours-error-123456')).toContainText(
            'General opening hours currently unavailable - please try again later.',
        );
    });
});
