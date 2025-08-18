import { test, expect } from '@uq/pw/test';
import { assertAccessibility } from '@uq/pw/lib/axe';

test.describe('Read and Publish (homepage)', () => {
    test.describe('is accessible', () => {
        test('at 1300 x 1000', async ({ page }) => {
            await page.goto('http://localhost:2020/?user=uqstaff');
            await page.waitForTimeout(2000);
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.getByTestId('readpublish-panel').first()).toBeVisible();
            await assertAccessibility(page, 'div[data-testid="readpublish-panel"]');
        });
        test('at 550 x 750', async ({ page }) => {
            await page.goto('http://localhost:2020/?user=uqstaff');
            await page.waitForTimeout(2000);
            await page.setViewportSize({ width: 550, height: 750 });
            await expect(page.getByTestId('readpublish-panel').first()).toBeVisible();
            await assertAccessibility(page, 'div[data-testid="readpublish-panel"]');
        });
    });
});
