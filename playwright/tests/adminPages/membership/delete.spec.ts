import { test, expect } from '@uq/pw/test';

// Deleting an application from the admin queue. Delete is destructive and cannot be undone, so it is asked for
// through a confirmation prompt; once taken, the card reads as deleted rather than leaving the queue. Gated on
// the membership-admin AD group, the same as the list.

const ADMIN = 'uqpkopit';

const ID = { newlyApplied: '00000000-0000-0000-0000-000000000101' };
const ROW = { newlyApplied: `membership-row-${ID.newlyApplied}` };

test.describe('Membership admin delete', () => {
    test('an admin deletes an application after confirming the prompt', async ({ page }) => {
        await page.goto(`/admin/membership?user=${ADMIN}`);

        const row = page.getByTestId(ROW.newlyApplied);
        await expect(row).toBeVisible();

        await row.getByTestId(`membership-delete-${ID.newlyApplied}`).click();

        // The prompt names the applicant and has to be confirmed before anything is removed.
        await expect(page.getByTestId('dialogbox-membership-delete')).toBeVisible();
        await expect(page.getByTestId('message-content')).toContainText('Newly Applied');

        await page.getByTestId('confirm-membership-delete').click();

        // The card reflects the deletion: a Deleted chip, and no delete button left to press.
        await expect(row.getByTestId(`membership-deleted-${ID.newlyApplied}`)).toContainText('Deleted');
        await expect(row.getByTestId(`membership-delete-${ID.newlyApplied}`)).toHaveCount(0);
    });

    test('dismissing the prompt leaves the application untouched', async ({ page }) => {
        await page.goto(`/admin/membership?user=${ADMIN}`);

        const row = page.getByTestId(ROW.newlyApplied);
        await row.getByTestId(`membership-delete-${ID.newlyApplied}`).click();

        await page.getByTestId('cancel-membership-delete').click();

        await expect(page.getByTestId('dialogbox-membership-delete')).toHaveCount(0);
        await expect(row.getByTestId(`membership-delete-${ID.newlyApplied}`)).toBeVisible();
    });
});
