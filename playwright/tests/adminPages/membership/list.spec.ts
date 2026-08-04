import { test, expect } from '@uq/pw/test';
import { assertAccessibility } from '@uq/pw/lib/axe';

// The admin back-office queue at /admin/membership. It is gated on the membership-admin AD group: an admin sees
// the search and the card-per-application listing; a signed-in user without the group is turned away, and a
// signed-out visitor is asked to authenticate.

const ADMIN = 'uqpkopit';

test.describe('Membership admin list', () => {
    test('an admin can search the queue and read an application per card', async ({ page }) => {
        await page.goto(`/admin/membership?user=${ADMIN}`);

        await expect(page.getByTestId('membership-search-form')).toBeVisible();

        await page.getByTestId('membership-search-button').click();

        // The count is announced, and each application is its own card.
        await expect(page.getByTestId('membership-list-status')).toContainText('membership application');
        await expect(page.getByTestId('membership-row-00000000-0000-0000-0000-000000000101')).toBeVisible();
        await expect(
            page.getByTestId('membership-row-00000000-0000-0000-0000-000000000101').getByRole('heading'),
        ).toContainText('Newly Applied');
        // The status reads as a word, not colour alone.
        await expect(page.getByTestId('membership-status-00000000-0000-0000-0000-000000000102')).toContainText(
            'Confirmed',
        );
    });

    test('the name filter narrows the queue to the matching applicants', async ({ page }) => {
        await page.goto(`/admin/membership?user=${ADMIN}`);

        await page.getByTestId('membership-search-name-input').fill('Renewing');
        await page.getByTestId('membership-search-button').click();

        await expect(page.getByTestId('membership-list-status')).toContainText('1 membership application found');
        await expect(page.getByTestId('membership-row-00000000-0000-0000-0000-000000000103')).toBeVisible();
        await expect(page.getByTestId('membership-row-00000000-0000-0000-0000-000000000101')).toHaveCount(0);
    });

    test('a search that matches nothing shows the empty state', async ({ page }) => {
        await page.goto(`/admin/membership?user=${ADMIN}`);

        await page.getByTestId('membership-search-name-input').fill('Nobody At All');
        await page.getByTestId('membership-search-button').click();

        await expect(page.getByTestId('membership-list-empty')).toBeVisible();
    });

    test('the loaded queue meets accessibility requirements', async ({ page }) => {
        await page.goto(`/admin/membership?user=${ADMIN}`);
        await page.getByTestId('membership-search-button').click();
        await expect(page.getByTestId('membership-list')).toBeVisible();

        await assertAccessibility(page, '[data-testid="StandardPage"]');
    });

    test('a signed-in user without the membership-admin group is turned away', async ({ page }) => {
        await page.goto('/admin/membership?user=uqstaff');

        await expect(page.locator('h1').first().getByText('Permission denied')).toBeVisible();
        await expect(page.getByTestId('membership-search-form')).toHaveCount(0);
    });

    test('a signed-out visitor is asked to authenticate', async ({ page }) => {
        await page.goto('/admin/membership?user=public');

        await expect(page.locator('h1').first().getByText('Authentication required')).toBeVisible();
    });
});
