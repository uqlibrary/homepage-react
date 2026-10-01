import { test, expect } from '@uq/pw/test';
import { readFileSync } from 'fs';

// Exporting the applications matching the current search and filter to a CSV, for reporting and offline
// processing. The queue is served a page at a time, so the export gathers the whole matching set across pages,
// not only the page on screen. Gated on the membership-admin AD group, the same as the list.

const ADMIN = 'uqpkopit';

const HEADER = '"Name","Email","Type","Expiry","Barcode"';

const csvOf = async (page, trigger) => {
    const downloadPromise = page.waitForEvent('download');
    await trigger();
    const download = await downloadPromise;
    const path = await download.path();
    return { filename: download.suggestedFilename(), lines: readFileSync(path, 'utf8').split('\r\n') };
};

test.describe('Membership admin export to CSV', () => {
    test('an admin exports every matching application across pages to a named CSV', async ({ page }) => {
        await page.goto(`/admin/membership?user=${ADMIN}`);
        await expect(page.getByTestId('membership-list')).toBeVisible();
        // The queue holds 25 applications and the page shows 20, so a complete export must reach past page one.
        await expect(page.getByTestId('membership-status-tile-all')).toContainText('25');

        const { filename, lines } = await csvOf(page, () => page.getByTestId('membership-export').click());

        expect(filename).toBe('memberships.csv');
        expect(lines[0]).toBe(HEADER);
        // One row per matching application, gathered from every page rather than only the 20 on screen.
        expect(lines).toHaveLength(1 + 25);
        expect(lines.join('\n')).toContain('Newly Applied');
    });

    test('the export covers only the applications matching the current search', async ({ page }) => {
        await page.goto(`/admin/membership?user=${ADMIN}`);
        await expect(page.getByTestId('membership-list')).toBeVisible();

        await page.getByTestId('membership-search-name').fill('renewing');
        // Wait for the debounced search to actually narrow the list - the unmatched rows leaving - rather than
        // the "Showing 1..." line, which reads that way for the unfiltered first page too.
        await expect(page.getByTestId('membership-row-00000000-0000-0000-0000-000000000101')).toHaveCount(0);
        await expect(page.getByTestId('membership-row-00000000-0000-0000-0000-000000000103')).toBeVisible();

        const { lines } = await csvOf(page, () => page.getByTestId('membership-export').click());

        expect(lines[0]).toBe(HEADER);
        expect(lines).toHaveLength(1 + 1);
        expect(lines[1]).toContain('Renewing Member');
    });
});
