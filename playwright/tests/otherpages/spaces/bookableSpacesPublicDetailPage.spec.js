import { expect, test } from '@uq/pw/test';
import { COLOR_UQPURPLE, COLOUR_UQ_WARNING_50, COLOR_UQ_ERROR_50 } from '@uq/pw/lib/constants';

test.describe('Spaces Detail page', () => {
    test.beforeEach(async ({ context }) => {
        await context.clearCookies();
    });
    test.describe('Outage blocks', () => {
        test('spaces detail page has appropriate Current Closure block', async ({ page }) => {
            await page.goto('/spaces/detail/a00de509-570b-4acb-9ca1-89c4baebe2e6');
            await page.setViewportSize({ width: 1300, height: 1000 });

            // page has loaded
            const SPACE_ID = 2;
            await expect(page.getByTestId(`space-${SPACE_ID}-details-name`)).toBeVisible();
            await expect(page.getByTestId(`space-${SPACE_ID}-details-name`)).toContainText('339');

            // outage block appears as expected
            await expect(page.getByTestId(`space-${SPACE_ID}-outage`).locator('> div')).toBeVisible();
            await expect(page.getByTestId(`space-${SPACE_ID}-outage`).locator('> div')).toHaveCSS(
                'background-color',
                COLOR_UQ_ERROR_50,
            );

            await expect(page.getByTestId(`space-${SPACE_ID}-outage-message`)).toBeVisible();
            await expect(page.getByTestId(`space-${SPACE_ID}-outage-message`)).toContainText(
                'Currently unavailable until',
            );
            await expect(page.getByTestId(`space-${SPACE_ID}-outage-reason`)).toBeVisible();
            await expect(page.getByTestId(`space-${SPACE_ID}-outage-reason`)).toContainText(
                'Reason: Lighting maintenance',
            );
        });
        test('spaces detail page has appropriate Upcoming Closure block', async ({ page }) => {
            await page.goto('/spaces/detail/a0298845-9999-4bb7-a6d5-666f1999c3d4');
            await page.setViewportSize({ width: 1300, height: 1000 });

            // page has loaded
            const SPACE_ID = 5;
            await expect(page.getByTestId(`space-${SPACE_ID}-details-name`)).toBeVisible();
            await expect(page.getByTestId(`space-${SPACE_ID}-details-name`)).toContainText('342');

            // outage block appears as expected
            await expect(page.getByTestId(`space-${SPACE_ID}-outage`).locator('> div')).toBeVisible();
            await expect(page.getByTestId(`space-${SPACE_ID}-outage`).locator('> div')).toHaveCSS(
                'background-color',
                COLOUR_UQ_WARNING_50,
            );
            await expect(page.getByTestId(`space-${SPACE_ID}-outage`).locator('h4')).toContainText('Upcoming closure');
            await expect(page.getByTestId(`space-${SPACE_ID}-outage-message`)).toBeVisible();
            await expect(page.getByTestId(`space-${SPACE_ID}-outage-message`)).toContainText('Closed');
            await expect(page.getByTestId(`space-${SPACE_ID}-outage-reason`)).toBeVisible();
            await expect(page.getByTestId(`space-${SPACE_ID}-outage-reason`)).toContainText(
                'Reason: Air conditioning maintenance',
            );
        });
    });
    test.describe('Favourites', () => {
        test('spaces detail page can UNfavourite', async ({ page }) => {
            await page.goto('/spaces/detail/a00de3d4-7e11-47eb-8079-532bdef80def');
            await page.setViewportSize({ width: 1300, height: 1000 });

            // page has loaded
            await expect(page.getByTestId('space-1-details-name')).toBeVisible();
            await expect(page.getByTestId('space-1-details-name')).toContainText('354');

            // the space is currently favourited
            await expect(page.getByTestId('space-1-detail-unfavourite')).toBeVisible();
            await expect(page.getByTestId('space-1-detail-favourite')).not.toBeVisible();

            // unfavourite it
            await page.getByTestId('space-1-detail-unfavourite').click();

            // the space is now UNfavourited
            await expect(page.getByTestId('space-1-detail-favourite')).toBeVisible();
            await expect(page.getByTestId('space-1-detail-unfavourite')).not.toBeVisible();
        });
        test('spaces detail page can unfavourite', async ({ page }) => {
            await page.goto('/spaces/detail/97fd5_nm39_gh29');
            await page.setViewportSize({ width: 1300, height: 1000 });

            // page has loaded
            await expect(page.getByTestId('space-43534-details-name')).toBeVisible();
            await expect(page.getByTestId('space-43534-details-name')).toContainText('46-342/343');

            // the space is currently UNfavourited
            await expect(page.getByTestId('space-43534-detail-favourite')).toBeVisible();
            await expect(page.getByTestId('space-43534-detail-unfavourite')).not.toBeVisible();

            // favourite it
            await page.getByTestId('space-43534-detail-favourite').click();

            // the space is now favourited
            await expect(page.getByTestId('space-43534-detail-unfavourite')).toBeVisible();
            await expect(page.getByTestId('space-43534-detail-favourite')).not.toBeVisible();
        });
    });
    test.describe('Booking links', () => {
        test('spaces detail page can book a room', async ({ page }) => {
            await page.goto('/spaces/detail/a029666f-16e1-4dea-968b-31440e6bfaee');
            await page.setViewportSize({ width: 1300, height: 1000 });

            // page has loaded
            await expect(page.getByTestId('space-4-details-name')).toBeVisible();
            await expect(page.getByTestId('space-4-details-name')).toContainText('341');

            // the booking link is present
            await expect(page.locator('a[data-testid="space-4-booking-link"]')).toBeVisible();
            await expect(page.getByTestId('space-4-booking-icon')).toBeVisible();
            await expect(page.getByTestId('space-4-not-bookable')).not.toBeVisible();
        });
        test('spaces detail page shows the correct message when there is no linked booking', async ({ page }) => {
            await page.goto('/spaces/detail/a00de3d4-7e11-47eb-8079-532bdef80def');
            await page.setViewportSize({ width: 1300, height: 1000 });

            // page has loaded
            await expect(page.getByTestId('space-1-details-name')).toBeVisible();
            await expect(page.getByTestId('space-1-details-name')).toContainText('354');

            // the book it link appears
            await expect(page.getByTestId('space-1-booking-link')).not.toBeVisible();
            await expect(page.getByTestId('space-1-not-bookable')).toBeVisible();
            // data-testid={`space-1-booking-icon`}
        });
    });
});
