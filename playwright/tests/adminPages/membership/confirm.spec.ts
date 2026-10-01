import { test, expect } from '@uq/pw/test';

// Confirming an application from the admin queue. Confirm turns an application into an issued library account;
// the backend posts to Alma and Prism, which the mock stands in for. A confirmation the backend has begun but
// not finished is guarded - the card offers no confirm while it is in flight. Gated on the membership-admin AD
// group, the same as the list.

const ADMIN = 'uqpkopit';

const ID = {
    newlyApplied: '00000000-0000-0000-0000-000000000101',
    halfwayThrough: '00000000-0000-0000-0000-000000000104',
};

const ROW = {
    newlyApplied: `membership-row-${ID.newlyApplied}`,
    halfwayThrough: `membership-row-${ID.halfwayThrough}`,
};

test.describe('Membership admin confirm', () => {
    test('an admin confirms an application and the card takes on the issued account', async ({ page }) => {
        await page.goto(`/admin/membership?user=${ADMIN}`);

        const row = page.getByTestId(ROW.newlyApplied);
        await expect(row).toBeVisible();
        await expect(row.getByTestId(`membership-status-${ID.newlyApplied}`)).toContainText('Unconfirmed');

        await row.getByTestId(`membership-confirm-${ID.newlyApplied}`).click();

        // The card reflects the confirmed account: its status reads Confirmed and there is no confirm to press.
        await expect(row.getByTestId(`membership-status-${ID.newlyApplied}`)).toContainText('Confirmed');
        await expect(row.getByTestId(`membership-confirm-${ID.newlyApplied}`)).toHaveCount(0);
    });

    test('a confirmation already in progress offers no confirm button', async ({ page }) => {
        await page.goto(`/admin/membership?user=${ADMIN}`);

        const row = page.getByTestId(ROW.halfwayThrough);
        await expect(row).toBeVisible();

        await expect(row.getByTestId(`membership-inprogress-${ID.halfwayThrough}`)).toContainText('In progress');
        await expect(row.getByTestId(`membership-confirm-${ID.halfwayThrough}`)).toHaveCount(0);
    });
});
