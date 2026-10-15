import { test, expect } from '@uq/pw/test';
import { assertAccessibility } from '@uq/pw/lib/axe';

test.describe('Digital Learning Hub Series page.', () => {
    test.describe('series page', () => {
        test('is accessible and navigates to the correct location', async ({ page }) => {
            await page.goto('digital-learning-hub/series/1');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.locator('[data-testid="dlor-seriespage"] h1').getByText('Series Name')).toBeVisible();
            await assertAccessibility(page, '[data-testid="StandardPage"]');

            await page.locator('[data-testid="dlor-homepage-panel-98s0-dy5k3-98h4"] button').click();
            await expect(page.getByTestId('dlor-detailpage').getByText('Advanced literature searching').first()).toBeVisible();
        });
    });
});
