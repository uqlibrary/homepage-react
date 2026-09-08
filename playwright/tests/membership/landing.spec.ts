import { test, expect } from '@uq/pw/test';
import { assertAccessibility } from '@uq/pw/lib/axe';

// The membership landing / type chooser. Runs against the mock server, where `?user=` selects the account:
//   public       -> no session (returning-member intro)
//   vanilla      -> signed in, nothing due (welcome)
//   emcommunity  -> signed in, renewal due (renewal prompt)
test.describe('Membership landing', () => {
    test('lists every membership type and links each to its application form', async ({ page }) => {
        await page.goto('/membership?user=public');
        await page.setViewportSize({ width: 1300, height: 1000 });

        const list = page.getByTestId('membership-type-list');
        await expect(list).toBeVisible();
        await expect(list.getByRole('listitem')).toHaveCount(12);

        await expect(page.getByTestId('membership-type-community')).toContainText('Community');
        await expect(page.getByTestId('membership-type-community-apply')).toHaveAttribute(
            'href',
            /\/membership\/form\/community/,
        );
    });

    test('offers an anonymous visitor a way to log in, not a welcome', async ({ page }) => {
        await page.goto('/membership?user=public');

        await expect(page.getByTestId('membership-landing-returning')).toBeVisible();
        await expect(page.getByTestId('membership-landing-login')).toBeVisible();
        await expect(page.getByTestId('membership-landing-welcome')).toBeHidden();
        await expect(page.getByTestId('membership-landing-renewal')).toBeHidden();
    });

    test('welcomes a signed-in member with nothing to renew', async ({ page }) => {
        await page.goto('/membership?user=vanilla');

        await expect(page.getByTestId('membership-landing-welcome')).toBeVisible();
        await expect(page.getByTestId('membership-landing-returning')).toBeHidden();
        await expect(page.getByTestId('membership-landing-renewal')).toBeHidden();
    });

    test('sends a member whose membership is due straight to their renewal', async ({ page }) => {
        await page.goto('/membership?user=emcommunity');

        await expect(page.getByTestId('membership-landing-renewal')).toBeVisible();
        await expect(page.getByTestId('membership-landing-renew-link')).toBeVisible();
        await expect(page.getByTestId('membership-landing-welcome')).toBeHidden();
    });

    test('the landing meets accessibility requirements', async ({ page }) => {
        await page.goto('/membership?user=public');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(page.getByTestId('membership-type-list')).toBeVisible();

        await assertAccessibility(page, '[data-testid="membership-landing"]');
    });
});
