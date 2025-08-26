import { test, expect } from '@uqpw/test';

test.describe('Payment receipt', () => {
    test('Shows the correct messages for valid querystring', async ({ page }) => {
        await page.goto('payment-receipt?Success=1&Receipt=1234&AmountPaid=20');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(
            page
                .getByTestId('subsite-title')
                .getByText(/Payment receipt/)
                .first(),
        ).toBeVisible();
        await expect(
            page
                .locator('body')
                .getByText(/Your transaction of \$20\.00 has been successful\./)
                .first(),
        ).toBeVisible();
        await expect(
            page
                .locator('body')
                .getByText(/Please check your email for your receipt #1234/)
                .first(),
        ).toBeVisible();
    });
    test('Shows the failure messages for missing querystrings', async ({ page }) => {
        await page.goto('payment-receipt');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(
            page
                .locator('body')
                .getByText(/You have reached this page in error\. Please go back, and check what brought you here\./)
                .first(),
        ).toBeVisible();
        await page.goto('payment-receipt?Success=1');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(
            page
                .locator('body')
                .getByText(/You have reached this page in error\. Please go back, and check what brought you here\./)
                .first(),
        ).toBeVisible();
        await page.goto('payment-receipt?Success=1&Receipt=1234&AmountPaid=');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(
            page
                .locator('body')
                .getByText(/You have reached this page in error\. Please go back, and check what brought you here\./)
                .first(),
        ).toBeVisible();
    });
    test('Shows the correct messages for a failed payment request', async ({ page }) => {
        await page.goto('payment-receipt?Success=0');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(
            page
                .locator('body')
                .getByText(/The payment request was not successful/)
                .first(),
        ).toBeVisible();
    });
});
