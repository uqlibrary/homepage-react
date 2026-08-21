import { test, expect } from '@uq/pw/test';
import { assertAccessibility } from '@uq/pw/lib/axe';

// The received page after an application is submitted. The record normally arrives from the submit that reached
// this page; on a reload or a bookmarked link it is fetched instead. The API serves a membership record to
// Library staff alone, so an applicant reloading is refused - the page then reassures them the application is
// safe and hands them the reference to quote, rather than claiming anything failed.

const RECEIPT_ID = '00000000-0000-0000-0000-000000000123';

test.describe('Membership received', () => {
    test('reassures an applicant who reloads their receipt, and gives them the reference to quote', async ({
        page,
    }) => {
        await page.goto(`/membership/received/${RECEIPT_ID}?user=public`);
        await expect(page.getByTestId('membership-received')).toBeVisible();

        // The record is admin-only, so reading it back is refused. The page says the application is safe
        // rather than looking broken.
        const fallback = page.getByTestId('membership-received-load-error');
        await expect(fallback).toBeVisible();
        await expect(fallback.getByTestId('membership-received-reference')).toContainText('123');

        // It never tells them the application or the payment failed - neither did.
        await expect(fallback).not.toContainText(/fail|unsuccessful/i);

        // The way to reach AskUs carries the reference with it.
        const askUs = page.getByTestId('membership-received-askus');
        await expect(askUs).toHaveAttribute('href', /mailto:askus@library\.uq\.edu\.au/);
        await expect(askUs).toHaveAttribute('href', /123/);
    });

    test('the reloaded receipt meets accessibility requirements', async ({ page }) => {
        await page.goto(`/membership/received/${RECEIPT_ID}?user=public`);
        await expect(page.getByTestId('membership-received-load-error')).toBeVisible();

        await assertAccessibility(page, '[data-testid="membership-received"]');
    });
});
