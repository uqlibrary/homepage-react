import { test, expect } from '@uq/pw/test';
import { assertAccessibility } from '@uq/pw/lib/axe';

// The per-type expiry settings screen at /admin/membership/settings: every membership type with the date its
// accounts expire on, shown as the daily-computed date or an admin override, and each editable in place. Setting
// the date to the computed one (or clearing it) returns the type to the computed date; any other date overrides
// it. Reached from the applications queue and gated on the membership-admin AD group.

const ADMIN = 'uqpkopit';

test.describe('Membership admin expiry settings', () => {
    test('an admin reaches the settings screen from the queue toolbar', async ({ page }) => {
        await page.goto(`/admin/membership?user=${ADMIN}`);

        await page.getByTestId('membership-settings-link').click();

        await expect(page.getByRole('heading', { name: 'Expiry Dates By Type' })).toBeVisible();
        await expect(page.getByTestId('membership-settings-list')).toBeVisible();
        // A type on its computed date reads as using the calculated date...
        await expect(page.getByTestId('membership-type-status-community')).toContainText(
            'Using calculated expiry date',
        );
        // ...and one pinned to another date reads as overridden.
        await expect(page.getByTestId('membership-type-status-hospital')).toContainText('Override active');
    });

    test('overriding a type pins the date, and returning it to the computed date clears the override', async ({
        page,
    }) => {
        await page.goto(`/admin/membership/settings?user=${ADMIN}`);
        await expect(page.getByTestId('membership-settings-list')).toBeVisible();

        // Pin an override on a type that is currently on its computed date.
        const input = page.getByTestId('expiry-community-input');
        await input.fill('01-01-2030');
        await page.getByTestId('membership-type-save-community').click();

        await expect(page.getByTestId('membership-type-saved-community')).toBeVisible();
        await expect(page.getByTestId('membership-type-status-community')).toContainText('Override active');

        // Clearing the field and updating returns the type to its computed date.
        await input.fill('');
        await page.getByTestId('membership-type-save-community').click();

        await expect(page.getByTestId('membership-type-status-community')).toContainText(
            'Using calculated expiry date',
        );
    });

    test('a date the backend refuses is reported on the row', async ({ page }) => {
        await page.goto(`/admin/membership/settings?user=${ADMIN}`);
        await expect(page.getByTestId('membership-settings-list')).toBeVisible();

        // Well-formed but impossible (month 45), so the backend refuses it.
        await page.getByTestId('expiry-community-input').fill('45-45-2027');
        await page.getByTestId('membership-type-save-community').click();

        await expect(page.getByTestId('membership-type-error-community')).toBeVisible();
    });

    test('the settings screen leads back to the applications queue', async ({ page }) => {
        await page.goto(`/admin/membership/settings?user=${ADMIN}`);
        await expect(page.getByTestId('membership-settings-list')).toBeVisible();

        await page.getByTestId('membership-settings-back').click();

        await expect(page.getByTestId('membership-list')).toBeVisible();
    });

    test('the settings screen meets accessibility requirements', async ({ page }) => {
        await page.goto(`/admin/membership/settings?user=${ADMIN}`);
        await expect(page.getByTestId('membership-settings-list')).toBeVisible();

        await assertAccessibility(page, '[data-testid="StandardPage"]');
    });

    test('a signed-in user without the membership-admin group is turned away', async ({ page }) => {
        await page.goto('/admin/membership/settings?user=uqstaff');

        await expect(page.locator('h1').first().getByText('Permission denied')).toBeVisible();
        await expect(page.getByTestId('membership-settings-list')).toHaveCount(0);
    });
});
