import { test, expect } from '@uq/pw/test';
import { assertAccessibility } from '@uq/pw/lib/axe';

// The community application form. Runs against the mock server: the form data (account_types, titles) is
// served by the mock, and a submission is answered with a saved record, landing the applicant on the received
// page.

const selectOption = async (page, id: string, value: string) => {
    await page.getByTestId(`${id}-select`).click();
    await page.getByTestId(`${id}-option-${value}`).click();
};

const fillCommunityForm = async page => {
    await selectOption(page, 'title', 'Mr');
    await page.getByTestId('first_name-input').fill('Ada');
    await page.getByTestId('sn-input').fill('Lovelace');
    await selectOption(page, 'date_of_birth_day', '1');
    await selectOption(page, 'date_of_birth_month', '01');
    await selectOption(page, 'date_of_birth_year', '1990');
    await page.getByTestId('mail-input').fill('ada@example.com');
    await page.getByTestId('home_address_0-input').fill('123 Library Way');
    await page.getByTestId('home_address_city-input').fill('Brisbane');
    await page.getByTestId('home_address_state-input').fill('QLD');
    await page.getByTestId('home_address_postcode-input').fill('4000');
    await page.getByTestId('phone-input').fill('0733654000');
};

test.describe('Membership application form (community)', () => {
    test('a community applicant can fill and submit the form and reach the received page', async ({ page }) => {
        await page.goto('/membership/form/community?user=public');
        await expect(page.getByTestId('membership-form')).toBeVisible();

        await fillCommunityForm(page);
        await page.getByTestId('membership-form-submit').click();

        await expect(page).toHaveURL(/\/membership\/received\//);
        await expect(page.getByTestId('membership-received')).toBeVisible();
        await expect(page.getByTestId('membership-received-reference')).toContainText('123');
    });

    test('submitting an incomplete form reports the problem instead of proceeding', async ({ page }) => {
        await page.goto('/membership/form/community?user=public');
        await expect(page.getByTestId('membership-form')).toBeVisible();

        await page.getByTestId('membership-form-submit').click();

        await expect(page.getByTestId('membership-form-error-summary')).not.toBeEmpty();
        await expect(page).toHaveURL(/\/membership\/form\/community/);
    });

    test('an unrecognised type is sent back to the landing chooser', async ({ page }) => {
        await page.goto('/membership/form/not-a-type?user=public');

        await expect(page).toHaveURL(/\/membership(\?|$)/);
        await expect(page.getByTestId('membership-type-list')).toBeVisible();
    });

    test('the form meets accessibility requirements', async ({ page }) => {
        await page.goto('/membership/form/community?user=public');
        await expect(page.getByTestId('membership-form')).toBeVisible();

        await assertAccessibility(page, '[data-testid="membership-form"]');
    });
});
