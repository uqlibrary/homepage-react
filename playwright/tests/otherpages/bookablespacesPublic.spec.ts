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
        await expect(page.getByTestId('facility-123456').locator(' > *')).toHaveCount(4);
        await expect(page.getByTestId('facility-123456-1')).toContainText('Noise level Low');
        await expect(page.getByTestId('facility-123456-11')).toContainText('Whiteboard');
        await expect(page.getByTestId('facility-123456-8')).toContainText('Postgraduate spaces');
        await expect(page.getByTestId('facility-123456-15')).toContainText('Production Printing Services');

        await expect(page.getByTestId('facility-1234544')).toBeDefined();
        await expect(page.getByTestId('facility-1234544')).not.toBeVisible();
        await expect(page.getByTestId('facility-1234544').locator(' > *')).toHaveCount(4);
        await expect(page.getByTestId('facility-1234544-3')).toContainText('Noise level High');
        await expect(page.getByTestId('facility-1234544-9')).toContainText('Power outlets');
        await expect(page.getByTestId('facility-1234544-10')).toContainText('Undergrad spaces');
        await expect(page.getByTestId('facility-1234544-11')).toContainText('Whiteboard');

        await expect(page.getByTestId('facility-43534')).toBeDefined();
        await expect(page.getByTestId('facility-43534')).not.toBeVisible();
        await expect(page.getByTestId('facility-43534').locator(' > *')).toHaveCount(4);
        await expect(page.getByTestId('facility-43534-2')).toContainText('Noise level Medium');
        await expect(page.getByTestId('facility-43534-14')).toContainText('Food outlets');
        await expect(page.getByTestId('facility-43534-7')).toContainText('Exam Friendly');
        await expect(page.getByTestId('facility-43534-19')).toContainText('Landmark');

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

        const lowNoiseCheckbox = page.getByTestId('facility-type-listitem-1');
        const examFriendlyCheckbox = page.getByTestId('facility-type-listitem-7');
        const foodOutletsCheckbox = page.getByTestId('facility-type-listitem-14');
        const prodPrintingCheckbox = page.getByTestId('facility-type-listitem-15');
        const lowNoiseExcludeCheckboxlabel = page.getByTestId('reject-filtertype-label-1');

        const forganSmithCollaborativeSpace = page.getByTestId('space-123456').locator('h2');
        const duttonParkGroupStudyRoom = page.getByTestId('space-1234544').locator('h2');
        const andrewLiverisComputerRoom = page.getByTestId('space-43534').locator('h2');

        // there are initially 3 Spaces visible on the page
        await expect(page.getByTestId('space-wrapper').locator(':scope > *')).toHaveCount(3);
        await expect(page.getByTestId('no-spaces-visible')).not.toBeVisible();
        await expect(forganSmithCollaborativeSpace).toBeVisible();
        await expect(duttonParkGroupStudyRoom).toBeVisible();
        await expect(andrewLiverisComputerRoom).toBeVisible();

        // filter to show "Low Noise" only
        await expect(lowNoiseCheckbox.locator('label:first-of-type')).toBeVisible();
        await expect(lowNoiseCheckbox.locator('label:first-of-type')).toContainText('Noise level Low');
        await lowNoiseCheckbox.locator('span input').check();

        // selecting "Low Noise" makes two disappear
        await expect(page.getByTestId('space-wrapper').locator(':scope > *')).toHaveCount(1);
        await expect(page.getByTestId('no-spaces-visible')).not.toBeVisible();
        await expect(forganSmithCollaborativeSpace).toBeVisible();
        await expect(duttonParkGroupStudyRoom).not.toBeVisible();
        await expect(andrewLiverisComputerRoom).not.toBeVisible();

        // add 'exam friendly'
        await expect(examFriendlyCheckbox.locator('label:first-of-type')).toBeVisible();
        await expect(examFriendlyCheckbox.locator('label:first-of-type')).toContainText('Exam Friendly');
        await examFriendlyCheckbox.locator('span input').check();

        // selecting "exam friendly" & "Low Noise" means none are visible, and the user is prompted
        await expect(page.getByTestId('space-wrapper').locator(':scope > *')).toHaveCount(1); // "no spaces" message
        await expect(page.getByTestId('no-spaces-visible')).toBeVisible();
        await expect(forganSmithCollaborativeSpace).not.toBeVisible();
        await expect(duttonParkGroupStudyRoom).not.toBeVisible();
        await expect(andrewLiverisComputerRoom).not.toBeVisible();

        // uncheck "Low Noise" makes Computer room (#3) appear
        await lowNoiseCheckbox.locator('span input').uncheck();
        await expect(page.getByTestId('space-wrapper').locator(':scope > *')).toHaveCount(1);
        await expect(page.getByTestId('no-spaces-visible')).not.toBeVisible();
        await expect(forganSmithCollaborativeSpace).not.toBeVisible();
        await expect(duttonParkGroupStudyRoom).not.toBeVisible();
        await expect(andrewLiverisComputerRoom).toBeVisible();

        // uncheck other filter and all the Spaces appear
        await examFriendlyCheckbox.locator('span input').uncheck();

        await expect(page.getByTestId('space-wrapper').locator(':scope > *')).toHaveCount(3);
        await expect(page.getByTestId('no-spaces-visible')).not.toBeVisible();
        await expect(forganSmithCollaborativeSpace).toBeVisible();
        await expect(duttonParkGroupStudyRoom).toBeVisible();
        await expect(andrewLiverisComputerRoom).toBeVisible();

        // show checkboxes do an 'OR' within groups
        // choose food outlets, 1 Space appears
        await expect(foodOutletsCheckbox.locator('label:first-of-type')).toBeVisible();
        await expect(foodOutletsCheckbox.locator('label:first-of-type')).toContainText('Food outlets');
        await foodOutletsCheckbox.locator('span input').check();

        await expect(page.getByTestId('space-wrapper').locator(':scope > *')).toHaveCount(1);
        await expect(page.getByTestId('no-spaces-visible')).not.toBeVisible();
        await expect(forganSmithCollaborativeSpace).not.toBeVisible();
        await expect(duttonParkGroupStudyRoom).not.toBeVisible();
        await expect(andrewLiverisComputerRoom).toBeVisible();

        // add production printing, which is in the same group, and a second one appears
        await expect(prodPrintingCheckbox.locator('label:first-of-type')).toBeVisible();
        await expect(prodPrintingCheckbox.locator('label:first-of-type')).toContainText('Production Printing Services');
        await prodPrintingCheckbox.locator('span input').check();

        await expect(page.getByTestId('space-wrapper').locator(':scope > *')).toHaveCount(2);
        await expect(page.getByTestId('no-spaces-visible')).not.toBeVisible();
        await expect(forganSmithCollaborativeSpace).toBeVisible();
        await expect(duttonParkGroupStudyRoom).not.toBeVisible();
        await expect(andrewLiverisComputerRoom).toBeVisible();

        // select "exclude low noise areas" filter
        await lowNoiseCheckbox.locator('span.fortestfocus').click(); // a hack of the page so playwright can tap on the exclude filter
        await expect(lowNoiseExcludeCheckboxlabel).toBeVisible();
        await lowNoiseExcludeCheckboxlabel.check();
        await expect(page.getByTestId('space-wrapper').locator(':scope > *')).toHaveCount(1);
        await expect(page.getByTestId('no-spaces-visible')).not.toBeVisible();
        await expect(forganSmithCollaborativeSpace).not.toBeVisible();
        await expect(duttonParkGroupStudyRoom).not.toBeVisible();
        await expect(andrewLiverisComputerRoom).toBeVisible();
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
