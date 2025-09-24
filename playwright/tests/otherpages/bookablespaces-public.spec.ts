import { test, expect } from '@uq/pw/test';
import { assertAccessibility } from '@uq/pw/lib/axe';

test.describe('Spaces', () => {
    test('Shows a basic page for Spaces', async ({ page }) => {
        await page.goto('spaces');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(page.locator('body').getByText(/Library spaces/)).toBeVisible();

        // there are 3 spaces on the demo page
        await expect(page.getByTestId('library-spaces').locator('> *')).toHaveCount(3);

        // the first and second opening hours are labelled 'tiday' and 'tomorrow'
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
            'Westernmost corner, 3rd Floor',
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
});
