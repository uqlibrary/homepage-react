import { test, expect } from '../../test';
import { assertAccessibility } from '../../lib/axe';
test.describe('Digital Learning Hub', () => {
    test.describe('desktop homepage visits', () => {
        test('a successful unsubscribe appears as expected', async ({ page }) => {
            await page.goto('digital-learning-hub/confirm/unsubscribe/fdsgsgsdgsd');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.getByTestId('dlor-unsubscribe-prompt')).toHaveText(
                /Do you wish to unsubscribe from notifications about Artificial Intelligence - Digital Essentials\?/,
            );
            await page.locator('[data-testid="dlor-unsubscribe-checkbox"] input').check();
            await page.getByTestId('dlor-unsubscribe-button').click();
            await expect(
                page
                    .getByTestId('dlor-unsubscribe-success')
                    .getByText(/Thank you\. You have been unsubscribed from notifications for this title\./)
                    .first(),
            ).toBeVisible();
        });
        test('is accessible', async ({ page }) => {
            await page.goto('digital-learning-hub/confirm/unsubscribe/fdsgsgsdgsd');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.getByTestId('dlor-unsubscribe-prompt')).toHaveText(
                /Do you wish to unsubscribe from notifications about Artificial Intelligence - Digital Essentials\?/,
            );

            await assertAccessibility(page, '[data-testid="StandardPage"]');
            await page.locator('[data-testid="dlor-unsubscribe-checkbox"] input').check();

            await assertAccessibility(page, '[data-testid="StandardPage"]');
            await page.getByTestId('dlor-unsubscribe-button').click();

            await assertAccessibility(page, '[data-testid="StandardPage"]');
        });
        test('has breadcrumbs', async ({ page }) => {
            await page.goto('digital-learning-hub/confirm/unsubscribe/unsubscribeExpired');
            await expect(
                page
                    .getByTestId('subsite-title')
                    .getByText(/Digital learning hub/)
                    .first(),
            ).toBeVisible();
        });
        test('an expired unsubscription appears as expected', async ({ page }) => {
            await page.goto('digital-learning-hub/confirm/unsubscribe/unsubscribeExpired');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.getByTestId('dlor-unsubscribe-error')).toHaveText(
                /That unsubscribe request doesn't exist - have you already unsubscribed\? Otherwise, something has gone wrong\./,
            );
        });
        test('a second click on a unsubscription link appears as expected', async ({ page }) => {
            await page.goto('digital-learning-hub/confirm/unsubscribe/duplicateclick');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.getByTestId('dlor-unsubscribe-error')).toHaveText(
                /That unsubscribe request doesn't exist - have you already unsubscribed\? Otherwise, something has gone wrong\./,
            );
        });
        test('a click on an unknown unsubscription link appears as expected', async ({ page }) => {
            await page.goto('digital-learning-hub/confirm/unsubscribe/noSuchConf');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.getByTestId('dlor-unsubscribe-error')).toHaveText(
                /That unsubscribe request doesn't exist - have you already unsubscribed\? Otherwise, something has gone wrong\./,
            );
        });
        test('an error on find appears as expected', async ({ page }) => {
            await page.goto('digital-learning-hub/confirm/unsubscribe/unsubscribeFindError');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.getByTestId('dlor-unsubscribe-error')).toHaveText(
                /An error has occurred during the request/,
            );
        });
        test('an error on unsubscribe appears as expected', async ({ page }) => {
            await page.goto('digital-learning-hub/confirm/unsubscribe/unsubscribeError');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.getByTestId('dlor-unsubscribe-prompt')).toHaveText(
                /Do you wish to unsubscribe from notifications about Artificial Intelligence - Digital Essentials\?/,
            );
            await page.locator('[data-testid="dlor-unsubscribe-checkbox"] input').check();
            await page.getByTestId('dlor-unsubscribe-button').click();
            await expect(page.getByTestId('dlor-unsubscribe-error')).toHaveText(
                /An error has occurred during the request/,
            );
        });
    });
});
