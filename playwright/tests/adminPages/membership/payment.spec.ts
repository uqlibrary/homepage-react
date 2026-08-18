import { test, expect } from '@uq/pw/test';

// The payment state each card carries, so an admin can tell a paid application from a refused one from a type
// that never pays, and decide whether to confirm or delete. A success leaves its receipt as evidence; a failure
// is flagged in words; a type that never paid shows neither. Gated on the membership-admin AD group.

const ADMIN = 'uqpkopit';

const PAID = '00000000-0000-0000-0000-000000000101';
const DECLINED = '00000000-0000-0000-0000-000000000106';
const NEVER_PAID = '00000000-0000-0000-0000-000000000105';
const ROW = (id: string) => `membership-row-${id}`;

test.describe('Membership admin payment status', () => {
    test('a paid application shows its receipt as the evidence to confirm it on', async ({ page }) => {
        await page.goto(`/admin/membership?user=${ADMIN}`);

        const row = page.getByTestId(ROW(PAID));
        await expect(row).toBeVisible();
        await expect(row.getByTestId(`membership-receipt-${PAID}`)).toHaveText('R7654321');
        // A success does not linger as a status of its own - the receipt stands for it.
        await expect(row.getByTestId(`membership-payment-failed-${PAID}`)).toHaveCount(0);
    });

    test('a refused payment is flagged in words, and the application can still be deleted', async ({ page }) => {
        await page.goto(`/admin/membership?user=${ADMIN}`);

        const row = page.getByTestId(ROW(DECLINED));
        await expect(row).toBeVisible();
        await expect(row.getByTestId(`membership-payment-failed-${DECLINED}`)).toContainText('Failed');
        // The refused payment writes a "-" sentinel, which is no receipt to show.
        await expect(row.getByTestId(`membership-receipt-${DECLINED}`)).toHaveCount(0);
        // A failed payment behind an unconfirmed application is the case for Delete.
        await expect(row.getByTestId(`membership-delete-${DECLINED}`)).toBeVisible();
    });

    test('an application that never had a payment to make shows no payment panel', async ({ page }) => {
        await page.goto(`/admin/membership?user=${ADMIN}`);

        const row = page.getByTestId(ROW(NEVER_PAID));
        await expect(row).toBeVisible();
        await expect(row.getByTestId(`membership-panel-${NEVER_PAID}`)).toHaveCount(0);
    });
});
