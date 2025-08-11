import { test, expect } from '../../test';

import { assertAccessibility } from '../../lib/axe';
test.describe('Digital Learning Hub', () => {
    test.describe('desktop homepage visits', () => {
        test('is accessible', async ({ page }) => {
            await page.goto('digital-learning-hub/confirm/subscribe/a_conf_code_that_is_known');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.locator('[data-testid="dlor-confirm-line-1"]')).toHaveText(
                /Thank you for your interest in following Artificial Intelligence - Digital Essentials\./,
            );
            await assertAccessibility(page, '[data-testid="StandardPage"]');
        });
        test('a successful confirmation appears as expected', async ({ page }) => {
            await page.goto('digital-learning-hub/confirm/subscribe/a_conf_code_that_is_known');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.locator('[data-testid="dlor-confirm-line-1"]')).toHaveText(
                /Thank you for your interest in following Artificial Intelligence - Digital Essentials\./,
            );
            await expect(
                page
                    .locator('[data-testid="subsite-title"]')
                    .getByText(/Digital learning hub/)
                    .first(),
            ).toBeVisible();
            await expect(page.locator('[data-testid="dlor-confirm-line-2"]')).toHaveText(
                /Your request has been confirmed\. We will send an email when we update the object\./,
            );
            await expect(page.locator('[data-testid="dlor-confirm-line-3"]').locator('a')).toHaveAttribute(
                'href',
                'http://localhost:2020/digital-learning-hub/view/938h_4986_654f',
            );
        });
        test('an expired confirmation appears as expected', async ({ page }) => {
            await page.goto('digital-learning-hub/confirm/subscribe/a_known_conf_code_that_has_expired');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.locator('[data-testid="dlor-confirm-line-1"]')).toHaveText(
                /Thank you for your interest in following Artificial Intelligence - Digital Essentials\./,
            );
            await expect(page.locator('[data-testid="dlor-confirm-line-2"]')).toHaveText(
                /Unfortunately, your confirmation period expired before you were able to visit this link\./,
            );
            await expect(page.locator('[data-testid="dlor-confirm-line-3"]').locator('a')).toHaveAttribute(
                'href',
                'http://localhost:2020/digital-learning-hub/view/938h_4986_654f',
            );
        });
        test('a second click on a confirmation link appears as expected', async ({ page }) => {
            await page.goto('digital-learning-hub/confirm/subscribe/a_conf_code_that_has_already_been_used');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.locator('[data-testid="dlor-confirm-line-1"]')).toHaveText(
                /Thank you for your interest in following Artificial Intelligence - Digital Essentials\./,
            );
            await expect(page.locator('[data-testid="dlor-confirm-line-2"]')).toHaveText(
                /You have already confirmed this notification request\./,
            );
            await expect(page.locator('[data-testid="dlor-confirm-line-3"]').locator('a')).toHaveAttribute(
                'href',
                'http://localhost:2020/digital-learning-hub/view/938h_4986_654f',
            );
        });
        test('a click on an unknown confirmation link appears as expected', async ({ page }) => {
            await page.goto('digital-learning-hub/confirm/subscribe/a_conf_code_that_is_not_known');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.locator('[data-testid="dlor-confirm-line-1"]')).toHaveText(
                /Thank you for your interest in our Digital learning hub\./,
            );
            await expect(page.locator('[data-testid="dlor-confirm-line-2"]')).toHaveText(
                /Unfortunately, your confirmation code isn't one that is currently available\./,
            );
            await expect(
                page.locator('[data-testid="dlor-confirm-line-3"]').getByText(/check your email and try again/),
            ).toBeVisible();
        });
        test('handles an unexpected response type', async ({ page }) => {
            await page.goto('digital-learning-hub/confirm/subscribe/an_unexpected_response_type');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.locator('[data-testid="dlor-confirm-error"]')).toHaveText(
                /Something seems to have gone wrong - please check your email and try again\./,
            );
        });
        test('an error appears as expected', async ({ page }) => {
            await page.goto('digital-learning-hub/confirm/subscribe/error');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.locator('[data-testid="dlor-confirm-error"]')).toHaveText(
                /An error has occurred during the request/,
            );
        });
    });
});
