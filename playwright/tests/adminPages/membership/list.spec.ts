import { test, expect } from '@uq/pw/test';
import { assertAccessibility } from '@uq/pw/lib/axe';

// The admin back-office queue at /admin/membership. The real queue is thousands deep, so the list is served a
// searched, filtered, ordered page at a time: triage tiles carry the true per-status counts, the toolbar
// searches and sorts, and a pager walks the pages. It is gated on the membership-admin AD group.

const ADMIN = 'uqpkopit';

const ROW = {
    newlyApplied: 'membership-row-00000000-0000-0000-0000-000000000101',
    alreadyConfirmed: 'membership-row-00000000-0000-0000-0000-000000000102',
    renewingMember: 'membership-row-00000000-0000-0000-0000-000000000103',
    withDocuments: 'membership-row-00000000-0000-0000-0000-000000000105',
};

test.describe('Membership admin list', () => {
    test('an admin gets the first page, real per-status counts, and a pager', async ({ page }) => {
        await page.goto(`/admin/membership?user=${ADMIN}`);

        await expect(page.getByTestId('membership-status-tile-all')).toContainText('25');
        await expect(page.getByTestId('membership-status-tile-unconfirmed')).toContainText('11');
        await expect(page.getByTestId('membership-status-tile-renewing')).toContainText('7');
        await expect(page.getByTestId('membership-list-status')).toContainText(/Showing 1.20 of 25 applications/);
        await expect(page.getByTestId(ROW.newlyApplied).getByRole('heading')).toContainText('Newly Applied');
        await expect(page.getByTestId('membership-pager')).toBeVisible();
    });

    test('the pager fetches the next page', async ({ page }) => {
        await page.goto(`/admin/membership?user=${ADMIN}`);
        await expect(page.getByTestId(ROW.newlyApplied)).toBeVisible();

        await page.getByRole('button', { name: 'Go to page 2' }).click();

        await expect(page.getByTestId('membership-list-status')).toContainText(/Showing 21.25 of 25 applications/);
        await expect(page.getByTestId(ROW.newlyApplied)).toHaveCount(0);
    });

    test('a triage tile filters to that status while the counts hold steady', async ({ page }) => {
        await page.goto(`/admin/membership?user=${ADMIN}`);

        await page.getByTestId('membership-status-tile-unconfirmed').click();

        await expect(page.getByTestId('membership-list-status')).toContainText(/Showing 1.11 of 11 applications/);
        // The tiles still show the whole-queue totals, not the filtered count.
        await expect(page.getByTestId('membership-status-tile-all')).toContainText('25');
        await expect(page.getByTestId(ROW.newlyApplied)).toBeVisible();
        await expect(page.getByTestId(ROW.alreadyConfirmed)).toHaveCount(0);
    });

    test('the search narrows across name and email', async ({ page }) => {
        await page.goto(`/admin/membership?user=${ADMIN}`);

        await page.getByTestId('membership-search-name').fill('renewing');

        await expect(page.getByTestId('membership-list-status')).toContainText('Showing 1');
        await expect(page.getByTestId(ROW.renewingMember)).toBeVisible();
        await expect(page.getByTestId(ROW.newlyApplied)).toHaveCount(0);
    });

    test('the type filter narrows the queue', async ({ page }) => {
        await page.goto(`/admin/membership?user=${ADMIN}`);

        await page.getByTestId('membership-filter-type').selectOption('hospital');

        await expect(page.getByTestId(ROW.withDocuments)).toBeVisible();
        await expect(page.getByTestId(ROW.renewingMember)).toHaveCount(0);
    });

    test('a search that matches nothing offers a way back', async ({ page }) => {
        await page.goto(`/admin/membership?user=${ADMIN}`);

        await page.getByTestId('membership-search-name').fill('Nobody At All');
        await expect(page.getByTestId('membership-list-empty')).toContainText('No applications match your filters');

        await page.getByTestId('membership-clear-filters').click();
        await expect(page.getByTestId('membership-list')).toBeVisible();
    });

    test('the queue meets accessibility requirements', async ({ page }) => {
        await page.goto(`/admin/membership?user=${ADMIN}`);
        await expect(page.getByTestId('membership-list')).toBeVisible();

        await assertAccessibility(page, '[data-testid="StandardPage"]');
    });

    test('a signed-in user without the membership-admin group is turned away', async ({ page }) => {
        await page.goto('/admin/membership?user=uqstaff');

        await expect(page.locator('h1').first().getByText('Permission denied')).toBeVisible();
        await expect(page.getByTestId('membership-status-tiles')).toHaveCount(0);
    });

    test('a signed-out visitor is asked to authenticate', async ({ page }) => {
        await page.goto('/admin/membership?user=public');

        await expect(page.locator('h1').first().getByText('Authentication required')).toBeVisible();
    });
});
