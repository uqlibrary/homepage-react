import { test, expect } from '@uq/pw/test';

// The supporting documents an application carries, shown on the card so an admin can read the proof behind a
// reciprocal or hospital application - the evidence to confirm or delete it on - without opening the record.
// Each document opens in a new tab from a signed link fetched when it is asked for. Gated on the membership-admin
// AD group.

const ADMIN = 'uqpkopit';

const WITH_DOCUMENTS = '00000000-0000-0000-0000-000000000105';
const NO_DOCUMENTS = '00000000-0000-0000-0000-000000000101';
const ROW = (id: string) => `membership-row-${id}`;

test.describe('Membership admin attachments', () => {
    test('an application with a document lists it and opens it in a new tab', async ({ page }) => {
        await page.goto(`/admin/membership?user=${ADMIN}`);

        const row = page.getByTestId(ROW(WITH_DOCUMENTS));
        await expect(row).toBeVisible();

        const attachment = row.getByTestId(`membership-attachment-${WITH_DOCUMENTS}-0`);
        await expect(attachment).toHaveText('proof-of-employment.pdf');

        // The click opens a fresh tab, then points it at the signed URL the API answers with once it arrives.
        const popupPromise = page.waitForEvent('popup');
        await attachment.click();
        const popup = await popupPromise;
        await popup.waitForURL(/favicon\.ico/);
    });

    test('an application with no document shows no attachments block', async ({ page }) => {
        await page.goto(`/admin/membership?user=${ADMIN}`);

        const row = page.getByTestId(ROW(NO_DOCUMENTS));
        await expect(row).toBeVisible();
        await expect(row.getByTestId(`membership-attachments-${NO_DOCUMENTS}`)).toHaveCount(0);
    });
});
