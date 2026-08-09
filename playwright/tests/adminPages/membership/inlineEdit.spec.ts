import { test, expect } from '@uq/pw/test';

// Correcting an issued account's expiry and barcode where they sit on the card. The value is checked for shape
// before it is sent, and a barcode the backend already holds comes back refused with a reason the admin can
// read. Gated on the membership-admin AD group, the same as the list.

const ADMIN = 'uqpkopit';

const CONFIRMED = '00000000-0000-0000-0000-000000000102';
const RENEWING = '00000000-0000-0000-0000-000000000103';
// A confirmed account with no barcode or expiry set yet, so its fields read "Not set" and start empty.
const UNSET = '00000000-0000-0000-0000-000000000202';
const ROW = (id: string) => `membership-row-${id}`;

test.describe('Membership admin inline edit', () => {
    test('an admin corrects the barcode of a confirmed account', async ({ page }) => {
        await page.goto(`/admin/membership?user=${ADMIN}`);

        const row = page.getByTestId(ROW(CONFIRMED));
        await expect(row).toBeVisible();

        await row.getByTestId(`barcode-${CONFIRMED}-edit-button`).click();
        const input = row.getByTestId(`barcode-${CONFIRMED}-input`);
        await input.fill('2406700054321');
        await row.getByTestId(`barcode-${CONFIRMED}-save-button`).click();

        // The card shows the stored value once the save lands.
        await expect(row.getByTestId(`barcode-${CONFIRMED}-value`)).toHaveText('2406700054321');
    });

    test('a barcode already in use is refused with a readable reason, and the stored value is kept', async ({
        page,
    }) => {
        await page.goto(`/admin/membership?user=${ADMIN}`);

        const row = page.getByTestId(ROW(CONFIRMED));
        await row.getByTestId(`barcode-${CONFIRMED}-edit-button`).click();
        const input = row.getByTestId(`barcode-${CONFIRMED}-input`);
        await input.fill('2406700010000');
        await row.getByTestId(`barcode-${CONFIRMED}-save-button`).click();

        // The refusal is explained in a dialog, in words rather than the backend's internal text.
        await expect(page.getByTestId('dialogbox-membership-error')).toBeVisible();
        await expect(page.getByTestId('message-content')).toContainText('already be in use by another member');

        await page.getByTestId('confirm-membership-error').click();
        // The save did not take, so the card keeps the barcode the server still holds.
        await expect(row.getByTestId(`barcode-${CONFIRMED}-value`)).toHaveText('2406700012345');
    });

    test('cancelling an unset field closes the editor in a single click', async ({ page }) => {
        await page.goto(`/admin/membership?user=${ADMIN}`);

        const row = page.getByTestId(ROW(UNSET));
        await expect(row.getByTestId(`barcode-${UNSET}-value`)).toHaveText('Not set');

        await row.getByTestId(`barcode-${UNSET}-edit-button`).click();
        await expect(row.getByTestId(`barcode-${UNSET}-input`)).toBeVisible();

        // A single cancel closes the editor: pressing it must not first surface the validation message and
        // shift itself out from under the pointer.
        await row.getByTestId(`barcode-${UNSET}-cancel-button`).click();
        await expect(row.getByTestId(`barcode-${UNSET}-input`)).toHaveCount(0);
        await expect(row.getByTestId(`barcode-${UNSET}-value`)).toHaveText('Not set');
    });

    test('a renewing account shows its expiry and barcode read-only', async ({ page }) => {
        await page.goto(`/admin/membership?user=${ADMIN}`);

        const row = page.getByTestId(ROW(RENEWING));
        await expect(row.getByTestId(`membership-account-${RENEWING}`)).toBeVisible();
        await expect(row.getByTestId(`barcode-${RENEWING}-value`)).toHaveText('2406700067890');
        // Its details are settled by confirming the renewal, not edited here, so there is no edit affordance.
        await expect(row.getByTestId(`barcode-${RENEWING}-edit-button`)).toHaveCount(0);
    });
});
