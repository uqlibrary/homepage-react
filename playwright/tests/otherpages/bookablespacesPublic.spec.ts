import { test, expect } from '@uq/pw/test';
import { assertAccessibility } from '@uq/pw/lib/axe';

test.describe('Spaces', () => {
    test('Shows a basic page for Spaces', async ({ page }) => {
        await page.goto('spaces');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(page.locator('body').getByText(/Library spaces/)).toBeVisible();

        // there are 3 spaces on the demo page
        await expect(page.getByTestId('library-spaces').locator('> *')).toHaveCount(3);

        // the first and second opening hours are labelled 'today' and 'tomorrow'
        await expect(page.getByTestId('space-123456-openingHours-0')).toBeVisible();
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

        // the friendly location shows correctly
        await expect(page.getByTestId('standard-card-01-w431---collaborative-space')).toBeVisible();
        await expect(page.getByTestId('standard-card-01-w431---collaborative-space')).toContainText(
            'Westernmost corner, 2nd Floor',
        );
        await expect(page.getByTestId('standard-card-01-w431---collaborative-space')).toContainText(
            'Forgan Smith Building',
        );
        await expect(page.getByTestId('standard-card-01-w431---collaborative-space')).toContainText('St Lucia Campus');

        // facilities are correct
        await expect(page.getByTestId('facility-123456')).toBeVisible();
        await expect(page.getByTestId('facility-123456').locator(' > *')).toHaveCount(4);
        await expect(page.getByTestId('facility-123456-1')).toContainText('Noise level Low');
        await expect(page.getByTestId('facility-123456-4')).toContainText('Whiteboard');
        await expect(page.getByTestId('facility-123456-8')).toContainText('Postgraduate spaces');
        await expect(page.getByTestId('facility-123456-14')).toContainText('Production Printing Services');

        await expect(page.getByTestId('facility-1234544')).toBeVisible();
        await expect(page.getByTestId('facility-1234544').locator(' > *')).toHaveCount(3);
        await expect(page.getByTestId('facility-1234544-3')).toContainText('Noise level High');
        await expect(page.getByTestId('facility-1234544-6')).toContainText('Power outlets');
        await expect(page.getByTestId('facility-1234544-9')).toContainText('Undergrad spaces');

        await expect(page.getByTestId('facility-43534')).toBeVisible();
        await expect(page.getByTestId('facility-43534').locator(' > *')).toHaveCount(4);
        await expect(page.getByTestId('facility-43534-2')).toContainText('Noise level Medium');
        await expect(page.getByTestId('facility-43534-12')).toContainText('Food outlets');
        await expect(page.getByTestId('facility-43534-4')).toContainText('Moderated');
        await expect(page.getByTestId('facility-43534-18')).toContainText('Landmark');

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
    test('spaces load error', async ({ page }) => {
        await page.goto('spaces?responseType=error-spaces');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(page.locator('body').getByText(/Library spaces/)).toBeVisible();

        await expect(page.getByTestId('spaces-error')).toBeVisible();
        await expect(page.getByTestId('spaces-error')).toContainText('Something went wrong - please try again later.');
    });
    test('can filter', async ({ page }) => {
        await page.goto('spaces');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(page.locator('body').getByText(/Library spaces/)).toBeVisible();

        const lowNoiseCheckbox = page.getByTestId('facility-type-listitem-1');
        const examFriendlyCheckbox = page.getByTestId('facility-type-listitem-7');
        const foodOutletsCheckbox = page.getByTestId('facility-type-listitem-14');
        const prodPrintingCheckbox = page.getByTestId('facility-type-listitem-15');

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
        await expect(lowNoiseCheckbox.locator('label')).toBeVisible();
        await expect(lowNoiseCheckbox.locator('label')).toContainText('Noise level Low');
        await lowNoiseCheckbox.locator('input').check();

        // selecting "Low Noise" makes two disappear
        await expect(page.getByTestId('space-wrapper').locator(':scope > *')).toHaveCount(1);
        await expect(page.getByTestId('no-spaces-visible')).not.toBeVisible();
        await expect(forganSmithCollaborativeSpace).toBeVisible();
        await expect(duttonParkGroupStudyRoom).not.toBeVisible();
        await expect(andrewLiverisComputerRoom).not.toBeVisible();

        // add 'exam friendly'
        await expect(examFriendlyCheckbox.locator('label')).toBeVisible();
        await expect(examFriendlyCheckbox.locator('label')).toContainText('Exam Friendly');
        await examFriendlyCheckbox.locator('input').check();

        // selecting "exam friendly" & "Low Noise" means none are visible, and the user is prompted
        await expect(page.getByTestId('space-wrapper').locator(':scope > *')).toHaveCount(1); // "no spaces" message
        await expect(page.getByTestId('no-spaces-visible')).toBeVisible();
        await expect(forganSmithCollaborativeSpace).not.toBeVisible();
        await expect(duttonParkGroupStudyRoom).not.toBeVisible();
        await expect(andrewLiverisComputerRoom).not.toBeVisible();

        // uncheck "Low Noise" makes Computer room (#3) appear
        await lowNoiseCheckbox.locator('input').uncheck();
        await expect(page.getByTestId('space-wrapper').locator(':scope > *')).toHaveCount(1);
        await expect(page.getByTestId('no-spaces-visible')).not.toBeVisible();
        await expect(forganSmithCollaborativeSpace).not.toBeVisible();
        await expect(duttonParkGroupStudyRoom).not.toBeVisible();
        await expect(andrewLiverisComputerRoom).toBeVisible();

        // uncheck other filter and all the Spaces appear
        await examFriendlyCheckbox.locator('input').uncheck();

        await expect(page.getByTestId('space-wrapper').locator(':scope > *')).toHaveCount(3);
        await expect(page.getByTestId('no-spaces-visible')).not.toBeVisible();
        await expect(forganSmithCollaborativeSpace).toBeVisible();
        await expect(duttonParkGroupStudyRoom).toBeVisible();
        await expect(andrewLiverisComputerRoom).toBeVisible();

        // show checkboxes do an 'OR' within groups
        // choose food outlets, 1 Space appears
        await expect(foodOutletsCheckbox.locator('label')).toBeVisible();
        await expect(foodOutletsCheckbox.locator('label')).toContainText('Food outlets');
        await foodOutletsCheckbox.locator('input').check();

        await expect(page.getByTestId('space-wrapper').locator(':scope > *')).toHaveCount(1);
        await expect(page.getByTestId('no-spaces-visible')).not.toBeVisible();
        await expect(forganSmithCollaborativeSpace).not.toBeVisible();
        await expect(duttonParkGroupStudyRoom).not.toBeVisible();
        await expect(andrewLiverisComputerRoom).toBeVisible();

        // add production printing, which is in the same group, and a second one appears
        await expect(prodPrintingCheckbox.locator('label')).toBeVisible();
        await expect(prodPrintingCheckbox.locator('label')).toContainText('Production Printing Services');
        await prodPrintingCheckbox.locator('input').check();

        await expect(page.getByTestId('space-wrapper').locator(':scope > *')).toHaveCount(2);
        await expect(page.getByTestId('no-spaces-visible')).not.toBeVisible();
        await expect(forganSmithCollaborativeSpace).toBeVisible();
        await expect(duttonParkGroupStudyRoom).not.toBeVisible();
        await expect(andrewLiverisComputerRoom).toBeVisible();
    });
});
