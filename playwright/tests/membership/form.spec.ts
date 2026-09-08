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
    test('a community applicant can fill and submit the form and is taken to pay', async ({ page }) => {
        await page.goto('/membership/form/community?user=public');
        await expect(page.getByTestId('membership-form')).toBeVisible();

        await fillCommunityForm(page);
        await page.getByTestId('membership-form-submit').click();

        // Community is a paying type, so a successful submit takes the applicant on to the payment gateway,
        // carrying the new application's reference with it.
        await expect(page).toHaveURL(/\/membership\/paymentconfirmation\?.*UQ_LIB_ID=[^&]*123/);
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

        // Fryer does not pay, so a successful submit lands on the received page telling them what happens next.
        await expect(page).toHaveURL(/\/membership\/received\//);
        await expect(page.getByTestId('membership-received')).toBeVisible();
        await expect(page.getByTestId('membership-received-notified')).toBeVisible();
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

// Terms, conditions & privacy consent: the two alumni types must tick a box before applying; every other type
// agrees by submitting. The privacy notice and policy links show for everyone.

const fillAlumniForm = async page => {
    await fillBaseIdentity(page);
    await page.getByTestId('home_address_0-input').fill('123 Library Way');
    await page.getByTestId('home_address_city-input').fill('Brisbane');
    await page.getByTestId('alumni_num-input').fill('s1234567');
    await page.getByTestId('alumni_awards-input').fill('BSc');
    await page.getByTestId('alumni_graduated-input').fill('2000');
};

test.describe('Membership terms & consent', () => {
    test('shows the terms, privacy notice and entitlements for an alumni applicant', async ({ page }) => {
        await page.goto('/membership/form/alumni?user=public');
        await expect(page.getByTestId('membership-form')).toBeVisible();

        await expect(page.getByTestId('membership-terms')).toBeVisible();
        await expect(page.getByTestId('accept_mandatory_terms-input')).toBeVisible();
        await expect(
            page.getByTestId('membership-terms').getByRole('link', { name: /list of services/i }),
        ).toBeVisible();
        await expect(page.getByTestId('membership-privacy')).toContainText(/personal information/i);

        await assertAccessibility(page, '[data-testid="membership-form"]');
    });

    test('an alumni applicant cannot apply without accepting, then can once accepted', async ({ page }) => {
        await page.goto('/membership/form/alumni?user=public');
        await expect(page.getByTestId('membership-form')).toBeVisible();

        await fillAlumniForm(page);
        await page.getByTestId('membership-form-submit').click();

        // Everything else is filled, so the unticked box is what holds the application back.
        await expect(page.getByTestId('accept_mandatory_terms-error')).toBeVisible();
        await expect(page).toHaveURL(/\/membership\/form\/alumni/);

        await page.getByTestId('accept_mandatory_terms-input').check();
        await page.getByTestId('membership-form-submit').click();

        // Alumni does not pay, so a successful submit lands on the received page with the entitlements
        // acknowledgement it shows to alumni applicants.
        await expect(page).toHaveURL(/\/membership\/received\//);
        await expect(page.getByTestId('membership-received')).toBeVisible();
        await expect(page.getByTestId('membership-alumni-ack')).toBeVisible();
    });

    test('a community applicant agrees by submitting, with no checkbox', async ({ page }) => {
        await page.goto('/membership/form/community?user=public');
        await expect(page.getByTestId('membership-form')).toBeVisible();

        await expect(page.getByTestId('membership-terms')).toContainText(/submission of this form indicates/i);
        await expect(page.getByTestId('accept_mandatory_terms-input')).toHaveCount(0);
        await expect(page.getByTestId('membership-privacy')).toBeVisible();
    });
});

// Planned outages: both configured windows are in the past, so we move the browser clock into them to prove
// the form is replaced by the maintenance / gateway-outage message during a window, and shows outside it.

test.describe('Membership planned outages', () => {
    test('closes the form for everyone during a maintenance freeze', async ({ page }) => {
        await page.clock.setFixedTime(new Date('2017-06-15T03:00:00Z'));
        await page.goto('/membership/form/community?user=public');

        await expect(page.getByTestId('membership-form-frozen')).toBeVisible();
        await expect(page.getByTestId('membership-form')).toHaveCount(0);
    });

    test('turns paying types away during a payment gateway outage, but not free types', async ({ page }) => {
        await page.clock.setFixedTime(new Date('2025-01-19T22:00:00Z'));

        await page.goto('/membership/form/community?user=public');
        await expect(page.getByTestId('membership-form-outage')).toBeVisible();
        await expect(page.getByTestId('membership-form')).toHaveCount(0);

        // Fryer never reaches the gateway, so the outage does not stop it.
        await page.goto('/membership/form/fryer?user=public');
        await expect(page.getByTestId('membership-form')).toBeVisible();
        await expect(page.getByTestId('membership-form-outage')).toHaveCount(0);
    });
});
