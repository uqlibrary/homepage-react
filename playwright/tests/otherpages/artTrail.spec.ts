import { test, expect } from '@uq/pw/test';
import { assertAccessibility } from '@uq/pw/lib/axe';

// Art Trail is a standalone section: it carries its own look and feel, so App renders it without the shared
// Library chrome (the header, footer and alerts every other route is wrapped in). This is the scaffold the
// section's pages will be built out from.

test.describe('Art Trail (standalone section)', () => {
    test('renders on its own, without the shared Library chrome', async ({ page }) => {
        await page.goto('/art-trail/app?user=public');

        await expect(page.getByTestId('art-trail-app')).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Indigenous art and Library discovery trail' })).toBeVisible();

        // The chrome App wraps every other route in is absent here.
        await expect(page.locator('uq-header')).toHaveCount(0);
        await expect(page.locator('uq-footer')).toHaveCount(0);
        await expect(page.getByRole('region', { name: 'Site content' })).toHaveCount(0);

        await assertAccessibility(page, '[data-testid="art-trail-app"]');
    });
});
