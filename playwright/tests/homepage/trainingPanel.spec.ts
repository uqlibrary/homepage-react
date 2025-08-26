import { test, expect } from '@playwright/test';
import { assertAccessibility } from '@uq/pw/lib/axe';

test.describe('Training', () => {
    test('content is correct', async ({ page }) => {
        await page.goto('/?user=s1111111');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(
            page
                .getByTestId('standard-card-training-header')
                .getByText(/Training/)
                .first(),
        ).toBeVisible();
        await page.getByTestId('training-event-detail-button-0').scrollIntoViewIfNeeded();
        await expect(
            page
                .getByTestId('training-event-detail-button-0')
                .getByText(/EndNote: getting started/)
                .first(),
        ).toBeVisible();
        await expect(
            page
                .getByTestId('training-event-date-range-0')
                .getByText(/24 November/)
                .first(),
        ).toBeVisible();
        await expect(
            page
                .getByTestId('training-event-detail-button-1')
                .getByText(/UQRDM for researchers/)
                .first(),
        ).toBeVisible();
        await expect(
            page
                .getByTestId('training-event-date-range-1')
                .getByText(/24 - 25 November/)
                .first(),
        ).toBeVisible();
        await expect(
            page
                .getByTestId('training-event-detail-button-2')
                .getByText(/SciFinder n/)
                .first(),
        ).toBeVisible();
        await expect(
            page
                .getByTestId('training-event-date-range-2')
                .getByText(/24 November - 1 December/)
                .first(),
        ).toBeVisible();
    });

    test('list is Accessible', async ({ page }) => {
        await page.goto('/');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(page.locator('div[data-testid="training-panel"]')).toBeVisible();
        await page.getByTestId('training-event-detail-button-0').scrollIntoViewIfNeeded();
        await expect(
            page
                .getByTestId('training-event-detail-button-0')
                .getByText(/EndNote: getting started/)
                .first(),
        ).toBeVisible();
        await assertAccessibility(page, '[data-testid="training-panel"]');
        await expect(page.locator('h3 h3')).not.toBeVisible(); // we managed to nest the heading at one point
    });

    test('detail panel is accessible', async ({ page }) => {
        await page.goto('/');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(page.locator('div[data-testid="training-panel"]')).toBeVisible();
        await page.getByTestId('training-event-detail-button-0').scrollIntoViewIfNeeded();
        await expect(
            page
                .getByTestId('training-event-detail-button-0')
                .getByText(/EndNote: getting started/)
                .first(),
        ).toBeVisible();
        await page.locator('button[data-testid="training-event-detail-button-0"]').click();
        await expect(
            page
                .getByTestId('training-events-detail-2824657')
                .getByText(/Places still available/)
                .first(),
        ).toBeVisible();
        await assertAccessibility(page, '[data-testid="training-panel"]');
    });

    test('detail pane shows the details correctly', async ({ page }) => {
        await page.goto('/');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(
            page
                .locator('button[data-testid="training-event-detail-button-0"]')
                .getByText(/EndNote: getting started/)
                .first(),
        ).toBeVisible();
        await page.locator('button[data-testid="training-event-detail-button-0"]').click();
        await expect(
            page
                .getByTestId('event-detail-open-summary')
                .getByText(/Learn how to use EndNote referencing software/)
                .first(),
        ).toBeVisible();

        // when placesRemaining > 0 we see 'places available'
        await expect(
            page
                .locator('div[data-testid="training-events-detail-2824657"]')
                .getByText(/Places still available/)
                .first(),
        ).toBeVisible();
        await expect(
            page
                .getByTestId('training-event-detail-training-login-button')
                .getByText(/Log in and book now/)
                .first(),
        ).toBeVisible();
        // date is correct
        await expect(
            page
                .getByTestId('training-detail-date-range-2824657')
                .getByText(/24 November at 10am/)
                .first(),
        ).toBeVisible();
        await page.locator('button[data-testid="training-event-detail-close-button"]').click(); // close it
        await expect(
            page
                .locator('button[data-testid="training-event-detail-button-1"]')
                .getByText(/UQRDM for researchers/)
                .first(),
        ).toBeVisible();
        await page.locator('button[data-testid="training-event-detail-button-1"]').click(); // open
        await expect(
            page
                .getByTestId('event-detail-open-summary')
                .getByText(
                    /A short hands-on course that introduces some intermediate level tools and skills with Adobe Illustrator\./,
                )
                .first(),
        ).toBeVisible();
        await expect(
            page
                .locator('div[data-testid="training-events-detail-2870806"]')
                .getByText(/Event is fully booked/)
                .first(),
        ).toBeVisible();
        await expect(
            page
                .getByTestId('training-event-detail-training-login-button')
                .getByText(/Log in to join wait list/)
                .first(),
        ).toBeVisible();
        // date is correct
        await expect(
            page
                .getByTestId('training-detail-date-range-2870806')
                .getByText(/24 November at 9am - 25 November at 4pm/)
                .first(),
        ).toBeVisible();
        await page.locator('button[data-testid="training-event-detail-close-button"]').click(); // close it
        await expect(
            page
                .locator('button[data-testid="training-event-detail-button-2"]')
                .getByText(/SciFinder n/)
                .first(),
        ).toBeVisible();
        await page.locator('button[data-testid="training-event-detail-button-2"]').click(); // open it
        await expect(
            page
                .getByTestId('event-detail-open-summary')
                .getByText(/This is a hands on session/)
                .first(),
        ).toBeVisible();
        await expect(
            page
                .locator('div[data-testid="training-events-detail-2873532"]')
                .getByText(/Booking is not required/)
                .first(),
        ).toBeVisible();
        await expect(
            page
                .getByTestId('training-event-detail-training-login-button')
                .getByText(/Log in for more details/)
                .first(),
        ).toBeVisible();
        await expect(
            page
                .getByTestId('training-detail-date-range-2873532')
                .getByText(/24 November at 9am - 1 December at 3pm/)
                .first(),
        ).toBeVisible();
    });

    test('can close a detail pane from a click', async ({ page }) => {
        await page.goto('/');
        await page.setViewportSize({ width: 1300, height: 1000 });
        // we brng the detail pane over these fields to make the pane bigger,
        // but we have to manually display: hidden them or we get an accessibility issue
        await page.locator('button[data-testid="training-event-detail-button-0"]').scrollIntoViewIfNeeded();
        await expect(
            page
                .locator('button[data-testid="training-event-detail-button-0"]')
                .getByText(/EndNote: getting started/)
                .first(),
        ).toBeVisible();
        await page.locator('button[data-testid="training-event-detail-button-0"]').click();
        await page.waitForTimeout(500);
        // cy.get('#seeAllTrainingLink').should('not.be.visible');
        await expect(
            page
                .getByTestId('training-events-detail-2824657')
                .getByText(/EndNote: getting started/)
                .first(),
        ).toBeVisible();
        await page.getByTestId('training-event-detail-close-button').click();
        await expect(page.getByTestId('training-events-detail-2824657')).not.toBeVisible();
    });
    test('can navigate to event page', async ({ page }) => {
        await page.route(/studenthub/, route =>
            route.fulfill({
                status: 200,
                body: 'user has navigated to Studenthub page',
            }),
        );
        await page.goto('/');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await page.locator('button[data-testid="training-event-detail-button-0"]').scrollIntoViewIfNeeded();
        await expect(
            page
                .locator('button[data-testid="training-event-detail-button-0"]')
                .getByText(/EndNote: getting started/)
                .first(),
        ).toBeVisible();
        await page.locator('button[data-testid="training-event-detail-button-0"]').click();
        await page.waitForTimeout(500);
        await expect(
            page
                .getByTestId('training-events-detail-2824657')
                .getByText(/EndNote: getting started/)
                .first(),
        ).toBeVisible();
        await page.getByTestId('training-event-detail-training-login-button').click();
        await expect(
            page
                .locator('body')
                .getByText(/user has navigated to Studenthub page/)
                .first(),
        ).toBeVisible();
    });

    test('when there is no training it shows a friendly message', async ({ page }) => {
        await page.goto('/?user=s1111111&responseType=empty');
        await expect(
            page
                .getByTestId('standard-card-training-header')
                .getByText(/Training/)
                .first(),
        ).toBeVisible();
        await expect(
            page
                .getByTestId('training-api-error')
                .getByText(/There are no training sessions available at the moment\./)
                .first(),
        ).toBeVisible();
    });

    test('when the api 404s, it shows a friendly message', async ({ page }) => {
        await page.goto('/?user=s1111111&responseType=404');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(
            page
                .getByTestId('standard-card-training-header')
                .getByText(/Training/)
                .first(),
        ).toBeVisible();
        await expect(
            page
                .getByTestId('training-api-error')
                .getByText(/We can’t load training events right now/)
                .first(),
        ).toBeVisible();
    });

    test('shows an api error correctly', async ({ page }) => {
        await page.goto('/?user=s1111111&responseType=error');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(
            page
                .getByTestId('standard-card-training-header')
                .getByText(/Training/)
                .first(),
        ).toBeVisible();
        await expect(
            page
                .getByTestId('training-api-error')
                .getByText(/We can’t load training events right now/)
                .first(),
        ).toBeVisible();
    });
});
