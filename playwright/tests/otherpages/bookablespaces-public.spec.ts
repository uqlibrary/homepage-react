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

        // TODO: show breadrumbs are correct
    });
    test('is accessible', async ({ page }) => {
        await page.goto('spaces');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(page.locator('body').getByText(/Library spaces/)).toBeVisible();

        await assertAccessibility(page, '[data-testid="StandardPage"]');
    });
});
