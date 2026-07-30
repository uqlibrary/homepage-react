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

// The same form, driven by the field rules, presents a different shape per type. These cover the
// type-specific rendering: which sections show, how a section is titled, and — for a type collecting no
// address — that the postcode helper drops away and a minimal application still submits.

const fillBaseIdentity = async page => {
    await selectOption(page, 'title', 'Ms');
    await page.getByTestId('first_name-input').fill('Ada');
    await page.getByTestId('sn-input').fill('Lovelace');
    await selectOption(page, 'date_of_birth_day', '1');
    await selectOption(page, 'date_of_birth_month', '01');
    await selectOption(page, 'date_of_birth_year', '1990');
    await page.getByTestId('mail-input').fill('ada@example.com');
    await page.getByTestId('phone-input').fill('0733654000');
};

test.describe('Membership application form (type-specific rendering)', () => {
    test('a Fryer applicant is asked for no address, is shown no postcode helper, and can still apply', async ({
        page,
    }) => {
        await page.goto('/membership/form/fryer?user=public');
        await expect(page.getByTestId('membership-form')).toBeVisible();

        await expect(page.getByTestId('membership-form-section-organisation')).toBeVisible();
        await expect(page.getByTestId('membership-form-group-home-address')).toHaveCount(0);
        await expect(page.getByTestId('membership-form-postcode-help')).toHaveCount(0);

        await fillBaseIdentity(page);
        await page.getByTestId('membership-form-submit').click();

        await expect(page).toHaveURL(/\/membership\/received\//);
        await expect(page.getByTestId('membership-received-reference')).toContainText('123');
    });

    test('a proxy application is about the nominated borrower and names both parties', async ({ page }) => {
        await page.goto('/membership/form/proxy?user=public');
        await expect(page.getByTestId('membership-form')).toBeVisible();

        await expect(page.getByTestId('membership-form-section-account')).toContainText('Nominated borrower details');
        await expect(page.getByTestId('membership-form-section-nominated')).toBeVisible();
        await expect(page.getByTestId('membership-form-section-authorising')).toBeVisible();
        await expect(page.getByTestId('proxy_org-input')).toBeVisible();

        await assertAccessibility(page, '[data-testid="membership-form"]');
    });

    test('a hospital application asks for employment details and a work address', async ({ page }) => {
        await page.goto('/membership/form/hospital?user=public');
        await expect(page.getByTestId('membership-form')).toBeVisible();

        await expect(page.getByTestId('membership-form-conditions')).toContainText('Royal Brisbane and Women');
        await expect(page.getByTestId('membership-form-section-employment')).toBeVisible();
        await expect(page.getByTestId('hospital_class-select')).toBeVisible();
        await expect(page.getByTestId('membership-form-group-work-address')).toBeVisible();

        await assertAccessibility(page, '[data-testid="membership-form"]');
    });

    test('an alumni application asks for UQ student information', async ({ page }) => {
        await page.goto('/membership/form/alumni?user=public');
        await expect(page.getByTestId('membership-form')).toBeVisible();

        // The conditions text links new graduates to the new-graduates form in this app, navigating in place
        // rather than opening a new tab.
        const newGraduatesLink = page
            .getByTestId('membership-form-conditions')
            .getByRole('link', { name: /application for new graduates/i });
        await expect(newGraduatesLink).toHaveAttribute('href', '/membership/form/alumninew');
        await expect(newGraduatesLink).not.toHaveAttribute('target', '_blank');
        await expect(page.getByTestId('membership-form-section-student')).toBeVisible();
        await expect(page.getByTestId('alumni_num-input')).toBeVisible();
        await expect(page.getByTestId('alumni_graduated-input')).toBeVisible();

        await assertAccessibility(page, '[data-testid="membership-form"]');
    });
});
