import { test, expect, Page } from '@uq/pw/test';
import { DLOR_ADMIN_USER } from '@uq/pw/lib/constants';
import { assertAccessibility } from '@uq/pw/lib/axe';

test.describe('Digital Learning Hub admin homepage', () => {
    test.beforeEach(async ({}, testInfo) => {
        test.setTimeout(testInfo.timeout + 30_000);
    });

    test.describe('dashboard', () => {
        test.beforeEach(async ({ page }) => {
            await page.goto(`http://localhost:2020/digital-learning-hub/dashboard?user=${DLOR_ADMIN_USER}`);
            await page.setViewportSize({ width: 1300, height: 1000 });
        });
        test('is accessible', async ({ page }) => {
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(
                page
                    .locator('h1')
                    .first()
                    .getByText('Digital Learning Object Repository - Analytics Dashboard'),
            ).toBeVisible();
            await assertAccessibility(page, '[data-testid="StandardPage"]', { disabledRules: ['button-name'] });
        });
    });
});
