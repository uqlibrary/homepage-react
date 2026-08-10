import { test, expect } from '@uq/pw/test';
import { assertAccessibility } from '@uq/pw/lib/axe';

// The full record, opened from a card to read it whole and correct the applicant's contact details. Only the
// identity, contact and address fields can be changed; they save through the same update endpoint as the inline
// edits, and the card takes on what was saved. Gated on the membership-admin AD group, the same as the list.

const ADMIN = 'uqpkopit';

const CONFIRMED = '00000000-0000-0000-0000-000000000102';
const ROW = (id: string) => `membership-row-${id}`;

test.describe('Membership admin view/edit application', () => {
    test('an admin opens the full record and sees it read-only with the contact fields prefilled', async ({ page }) => {
        await page.goto(`/admin/membership?user=${ADMIN}`);
        await page.getByTestId(ROW(CONFIRMED)).getByTestId(`membership-view-${CONFIRMED}`).click();

        const dialog = page.getByTestId('dialogbox-membership-view');
        await expect(dialog).toBeVisible();
        // The read-only context an admin decides against.
        await expect(dialog.getByTestId('membership-view-details')).toContainText('2406700012345');
        // The editable contact fields, prefilled from the record.
        await expect(dialog.getByTestId('first_name-input')).toHaveValue('Already');
        await expect(dialog.getByTestId('home_address_city-input')).toHaveValue('Brisbane');
    });

    test('an admin edits a contact field and the card takes on the change', async ({ page }) => {
        await page.goto(`/admin/membership?user=${ADMIN}`);
        await page.getByTestId(ROW(CONFIRMED)).getByTestId(`membership-view-${CONFIRMED}`).click();

        const surname = page.getByTestId('sn-input');
        await surname.fill('Corrected');
        await page.getByTestId('save-membership-view').click();

        // The dialog closes, and the card reflects the saved surname.
        await expect(page.getByTestId('dialogbox-membership-view')).toHaveCount(0);
        await expect(page.getByTestId(ROW(CONFIRMED)).getByRole('heading')).toContainText('Corrected');
    });

    test('an admin can close the record without saving', async ({ page }) => {
        await page.goto(`/admin/membership?user=${ADMIN}`);
        await page.getByTestId(ROW(CONFIRMED)).getByTestId(`membership-view-${CONFIRMED}`).click();
        await expect(page.getByTestId('dialogbox-membership-view')).toBeVisible();

        await page.getByTestId('cancel-membership-view').click();

        await expect(page.getByTestId('dialogbox-membership-view')).toHaveCount(0);
        // The name is unchanged.
        await expect(page.getByTestId(ROW(CONFIRMED)).getByRole('heading')).toContainText('Confirmed');
    });

    test('closing the record returns focus to the control that opened it', async ({ page }) => {
        await page.goto(`/admin/membership?user=${ADMIN}`);
        const view = page.getByTestId(ROW(CONFIRMED)).getByTestId(`membership-view-${CONFIRMED}`);
        await view.click();
        await expect(page.getByTestId('dialogbox-membership-view')).toBeVisible();

        await page.getByTestId('cancel-membership-view').click();

        await expect(page.getByTestId('dialogbox-membership-view')).toHaveCount(0);
        // Focus lands back on the card's control, not at the top of the queue (WCAG 2.4.3).
        await expect(view).toBeFocused();
    });

    test('the open record meets accessibility requirements', async ({ page }) => {
        await page.goto(`/admin/membership?user=${ADMIN}`);
        await page.getByTestId(ROW(CONFIRMED)).getByTestId(`membership-view-${CONFIRMED}`).click();
        await expect(page.getByTestId('dialogbox-membership-view')).toBeVisible();

        await assertAccessibility(page, '[data-testid="dialogbox-membership-view"]');
    });
});
