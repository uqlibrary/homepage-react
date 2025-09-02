import { test, expect } from '@uq/pw/test';
import { assertAccessibility } from '@uq/pw/lib/axe';

test.describe('Spaces', () => {
    test('Shows a basic page for Spaces', async ({ page }) => {
        await page.goto('spaces');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(page.locator('body').getByText(/Library bookable spaces/)).toBeVisible();

        // there are 3 spaces on the demo page
        await expect(page.getByTestId('library-spaces').locator('> *')).toHaveCount(3);
    });
    test('is accessible', async ({ page }) => {
        await page.goto('spaces');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(page.locator('body').getByText(/Library bookable spaces/)).toBeVisible();

        await assertAccessibility(page, '[data-testid="StandardPage"]');
    });
});
