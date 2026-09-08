import { test, expect } from '@uq/pw/test';

// Resending the renewal email for a renewing application, for a member who lost or never received their link.
// The endpoint reports whether it sent, and the admin is told the outcome in a dialog. Only a renewing
// application offers it. Gated on the membership-admin AD group, the same as the list.

const ADMIN = 'uqpkopit';

const RENEWING = '00000000-0000-0000-0000-000000000103';
const UNCONFIRMED = '00000000-0000-0000-0000-000000000101';
const ROW = (id: string) => `membership-row-${id}`;

test.describe('Membership admin resend renewal email', () => {
    test('an admin resends the renewal email and is told it was sent', async ({ page }) => {
        await page.goto(`/admin/membership?user=${ADMIN}`);

        const row = page.getByTestId(ROW(RENEWING));
        await expect(row).toBeVisible();

        await row.getByTestId(`membership-resend-${RENEWING}`).click();

        // The outcome is reported in a dialog that names the applicant.
        await expect(page.getByTestId('dialogbox-membership-resend')).toBeVisible();
        await expect(page.getByTestId('message-content')).toContainText('Renewing Member');
        await expect(page.getByTestId('message-content')).toContainText('sent successfully');

        await page.getByTestId('confirm-membership-resend').click();
        await expect(page.getByTestId('dialogbox-membership-resend')).toHaveCount(0);
    });

    test('an application that is not renewing offers no resend', async ({ page }) => {
        await page.goto(`/admin/membership?user=${ADMIN}`);

        const row = page.getByTestId(ROW(UNCONFIRMED));
        await expect(row).toBeVisible();
        await expect(row.getByTestId(`membership-resend-${UNCONFIRMED}`)).toHaveCount(0);
    });
});
