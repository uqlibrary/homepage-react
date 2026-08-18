import { test, expect } from '@uq/pw/test';
import { assertAccessibility } from '@uq/pw/lib/axe';

// Renewing from an emailed link. The link carries the member's id and a one-time code; the form opens
// prefilled from the record they resolve to, with the identity fields locked so a renewal cannot change who
// the member is. The record the mock returns is a paying (community) member, so a successful renewal is
// carried on to the payment gateway's return leg, the same as a fresh paying application.

const RENEWAL_LINK = '/membership/form/community/00000000-0000-0000-0000-000000000009/renew-me-123?user=public';

test.describe('Membership renewal', () => {
    test('opens a renewal prefilled, with identity locked, and submits', async ({ page }) => {
        await page.goto(RENEWAL_LINK);
        await expect(page.getByTestId('membership-form')).toBeVisible();

        // Prefilled from the record the link points at.
        await expect(page.getByTestId('first_name-input')).toHaveValue('Renewing');
        await expect(page.getByTestId('mail-input')).toHaveValue('renewing.member@example.org');

        // Identity is locked so a renewal cannot rewrite who the member is; contact details stay editable.
        await expect(page.getByTestId('first_name-input')).toBeDisabled();
        await expect(page.getByTestId('sn-input')).toBeDisabled();
        await expect(page.getByTestId('mail-input')).toBeEnabled();

        // A renewal keeps the address it already has, so the postcode helper drops away.
        await expect(page.getByTestId('membership-form-postcode-help')).toHaveCount(0);
        await expect(page.getByTestId('membership-form-submit')).toHaveText(/renew membership/i);

        await assertAccessibility(page, '[data-testid="membership-form"]');

        await page.getByTestId('membership-form-submit').click();
        // A community renewal pays, so it is carried on to the gateway return leg.
        await expect(page).toHaveURL(/\/membership\/paymentconfirmation/);
    });

    test('the renewal acknowledgement page confirms and offers a way back', async ({ page }) => {
        await page.goto('/membership/renewed?user=public');

        await expect(page.getByTestId('membership-renewed')).toBeVisible();
        await expect(page.getByRole('link', { name: /back to uq library home page/i })).toBeVisible();

        await assertAccessibility(page, '[data-testid="membership-renewed"]');
    });
});
