import { test, expect } from '@uq/pw/test';
import { assertAccessibility } from '@uq/pw/lib/axe';

// The payment gateway's return leg. By the time the applicant lands here the money has changed hands; the page
// records what the gateway reported and confirms it. The return URL carries the result as query parameters.

const RETURN_QUERY =
    '?UQ_LIB_ID=00000000-0000-0000-0000-000000000123&ReceiptNo=R123456&MembershipCode=COM&Success=Y&AmountPaid=25.00';

const selectOption = async (page, id: string, value: string) => {
    await page.getByTestId(`${id}-select`).click();
    await page.getByTestId(`${id}-option-${value}`).click();
};

const fillCommunityForm = async page => {
    await selectOption(page, 'title', 'Ms');
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

test.describe('Membership payment confirmation', () => {
    test('records the payment and thanks the applicant when the gateway returns', async ({ page }) => {
        await page.goto(`/membership/paymentconfirmation${RETURN_QUERY}&user=public`);

        await expect(page.getByTestId('membership-payment-thankyou')).toBeVisible();
        await expect(page.getByTestId('membership-payment-record-failed')).toHaveCount(0);
        await expect(page.getByRole('link', { name: /back to uq library home page/i })).toBeVisible();

        await assertAccessibility(page, '[data-testid="membership-payment-confirmation"]');
    });

    test('a community applicant who pays is carried from the form through to the confirmation', async ({ page }) => {
        await page.goto('/membership/form/community?user=public');
        await expect(page.getByTestId('membership-form')).toBeVisible();

        await fillCommunityForm(page);
        await page.getByTestId('membership-form-submit').click();

        // The form takes the paying applicant to the gateway, which returns them here, where the payment is
        // recorded and confirmed.
        await expect(page).toHaveURL(/\/membership\/paymentconfirmation/);
        await expect(page.getByTestId('membership-payment-thankyou')).toBeVisible();
    });
});
