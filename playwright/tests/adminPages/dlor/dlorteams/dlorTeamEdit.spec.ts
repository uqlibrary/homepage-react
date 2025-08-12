import { test, expect } from '@uq/pw/test';
import { DLOR_ADMIN_USER } from '@uq/pw/lib/constants';
import { assertAccessibility } from '@uq/pw/lib/axe';
test.describe('Digital Learning Hub admin Edit Team', () => {
    test.beforeEach(async ({ page }) => {
        await page.context().clearCookies();
    });
    test.describe('Edit DLOR Team', () => {
        test.beforeEach(async ({ page }) => {
            await page.goto(`http://localhost:2020/admin/dlor/team/edit/2?user=${DLOR_ADMIN_USER}`);
            await page.setViewportSize({ width: 1300, height: 1000 });
        });
        test('is accessible', async ({ page }) => {
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.locator('h1')).toContainText('Digital Learning Hub - Edit Team');
            await assertAccessibility(page, '[data-testid="StandardPage"]');
        });
        test('has breadcrumbs', async ({ page }) => {
            await expect(
                page
                    .getByTestId('subsite-title')
                    .getByText(/Digital learning hub admin/)
                    .first(),
            ).toBeVisible();
        });
        test('appears as expected', async ({ page }) => {
            await expect(page.getByTestId('StandardPage-title')).toBeVisible();
            await expect(
                page
                    .getByTestId('StandardPage-title')
                    .getByText(/Digital Learning Hub - Edit Team/)
                    .first(),
            ).toBeVisible();
            await expect(page.locator('[data-testid="admin-dlor-team-form-team-name"] input')).toHaveValue(
                'Lib train Library Corporate Services',
            );
            await expect(page.locator('[data-testid="admin-dlor-team-form-team-manager"] input')).toHaveValue(
                'Jane Green',
            );
            await expect(page.locator('[data-testid="admin-dlor-team-form-team-email"] input')).toHaveValue(
                'train@library.uq.edu',
            );
            await expect(page.getByTestId('admin-dlor-team-form-error-message-team-name')).not.toBeVisible();
            await expect(page.getByTestId('admin-dlor-team-form-error-message-team-email')).not.toBeVisible();
            await expect(page.getByTestId('admin-dlor-team-form-save-button')).toBeDisabled();
            await expect(
                page
                    .locator('a[data-testid="dlor-breadcrumb-admin-homelink"]')
                    .getByText(/Digital Learning Hub admin/)
                    .first(),
            ).toHaveAttribute('href', `http://localhost:2020/admin/dlor?user=${DLOR_ADMIN_USER}`);
            await expect(
                page
                    .locator('a[data-testid="dlor-breadcrumb-team-management-link-0"]')
                    .getByText(/Team management/)
                    .first(),
            ).toHaveAttribute('href', `http://localhost:2020/admin/dlor/team/manage?user=${DLOR_ADMIN_USER}`);
        });
        test('validates correctly', async ({ page }) => {
            // initially, save button is disabled - the form is invalid, but no errors appear
            await page.locator('[data-testid="admin-dlor-team-form-team-name"] input').clear();
            await expect(
                page
                    .getByTestId('admin-dlor-team-form-error-message-team-name')
                    .getByText(/This team name is not valid\./)
                    .first(),
            ).toHaveCSS('color', 'rgb(214, 41, 41)'); // #d62929
            await expect(page.getByTestId('admin-dlor-team-form-error-message-team-email')).not.toBeVisible();
            await expect(page.getByTestId('admin-dlor-team-form-save-button')).toBeDisabled();

            await page.locator('[data-testid="admin-dlor-team-form-team-name"] input').fill('something');
            await expect(page.getByTestId('admin-dlor-team-form-error-message-team-name')).not.toBeVisible();
            await expect(page.getByTestId('admin-dlor-team-form-error-message-team-email')).not.toBeVisible();
            await expect(page.getByTestId('admin-dlor-team-form-save-button')).not.toBeDisabled();

            // enter a partial email - invalid because not valid
            await page.locator('[data-testid="admin-dlor-team-form-team-email"] input').clear();
            await page.locator('[data-testid="admin-dlor-team-form-team-email"] input').fill('lea');
            await expect(page.getByTestId('admin-dlor-team-form-error-message-team-name')).not.toBeVisible();
            await expect(page.getByTestId('admin-dlor-team-form-error-message-team-email')).toBeVisible();
            await expect(
                page
                    .getByTestId('admin-dlor-team-form-error-message-team-email')
                    .getByText(/This email address is not valid\./)
                    .first(),
            ).toHaveCSS('color', 'rgb(214, 41, 41)'); // #d62929;
            await expect(page.getByTestId('admin-dlor-team-form-save-button')).toBeDisabled();

            // complete email - now valid
            await page
                .locator('[data-testid="admin-dlor-team-form-team-email"] input')
                .pressSequentially('@example.com');
            await expect(page.getByTestId('admin-dlor-team-form-error-message-team-name')).not.toBeVisible();
            await expect(page.getByTestId('admin-dlor-team-form-error-message-team-email')).not.toBeVisible();
            await expect(page.getByTestId('admin-dlor-team-form-save-button')).not.toBeDisabled();

            // enter a manager, validity unaffected
            await page.locator('[data-testid="admin-dlor-team-form-team-manager"] input').fill('valid team manager');
            await expect(page.getByTestId('admin-dlor-team-form-error-message-team-name')).not.toBeVisible();
            await expect(page.getByTestId('admin-dlor-team-form-error-message-team-email')).not.toBeVisible();
            await expect(page.getByTestId('admin-dlor-team-form-save-button')).not.toBeDisabled();

            // wipe team name - form invalid
            await page.locator('[data-testid="admin-dlor-team-form-team-name"] input').clear();
            await expect(page.getByTestId('admin-dlor-team-form-error-message-team-name')).toBeVisible();
            await expect(page.getByTestId('admin-dlor-team-form-error-message-team-email')).not.toBeVisible();
            await expect(page.getByTestId('admin-dlor-team-form-save-button')).toBeDisabled();
        });
        test('has a working "cancel edit" button', async ({ page }) => {
            await expect(
                page
                    .getByTestId('admin-dlor-team-form-button-cancel')
                    .getByText(/Cancel/)
                    .first(),
            ).toBeVisible();

            await page.getByTestId('admin-dlor-team-form-button-cancel').click();
            await expect(page.getByTestId('dlor-teamlist-edit-1')).toBeVisible();
            await expect(page).toHaveURL(`http://localhost:2020/admin/dlor/team/manage?user=${DLOR_ADMIN_USER}`);
        });
    });
    test.describe('save test', () => {
        test.beforeEach(async ({ page, context }) => {
            // This is an edit test, so we simulate a pre-existing team by setting a cookie.
            await context.addCookies([
                {
                    name: 'CYPRESS_TEST_DATA',
                    value: 'active',
                    url: 'http://localhost',
                },
            ]);
            // The URL for editing is not provided, so we'll use a placeholder for a team ID.
            await page.goto(`http://localhost:2020/admin/dlor/team/edit/2?user=${DLOR_ADMIN_USER}`);
            await page.setViewportSize({ width: 1300, height: 1000 });
        });
        test('saves correctly', async ({ page, context }) => {
            const teamNameInput = page.getByTestId('admin-dlor-team-form-team-name').locator('input');
            const teamManagerInput = page.getByTestId('admin-dlor-team-form-team-manager').locator('input');
            const teamEmailInput = page.getByTestId('admin-dlor-team-form-team-email').locator('input');
            const saveButton = page.getByTestId('admin-dlor-team-form-save-button');

            // Modify the input fields
            await teamNameInput.fill('Lib train Library Corporate Services changed');
            await teamManagerInput.fill('Jane Green changed');
            await teamEmailInput.fill('train@library.uq.edu.au');

            // Click the save button
            await saveButton.click();

            // Wait for the save-confirmation popup to appear and check its content
            const dialog = page.getByTestId('dialogbox-dlor-team-save-outcome');
            await dialog.waitFor({ state: 'visible' });

            await expect(dialog).toContainText('Changes have been saved');
            await expect(page.getByTestId('confirm-dlor-team-save-outcome')).toHaveText('Return to Admin Teams page');
            await expect(page.getByTestId('cancel-dlor-team-save-outcome')).toHaveText('Re-edit Team');

            // Check the data that was "sent" to the server via the cookie
            const expectedValues = {
                team_name: 'Lib train Library Corporate Services changed',
                team_manager: 'Jane Green changed',
                team_email: 'train@library.uq.edu.au',
            };

            const cookies = await context.cookies();
            const savedCookie = cookies.find(c => c.name === 'CYPRESS_DATA_SAVED');
            expect(savedCookie).toBeDefined();

            const decodedValue = decodeURIComponent(savedCookie!.value);
            const sentValues = JSON.parse(decodedValue);
            expect(sentValues).toEqual(expectedValues);

            // Clear the cookies to clean up the test state
            await context.clearCookies({ name: 'CYPRESS_DATA_SAVED' });
            await context.clearCookies({ name: 'CYPRESS_TEST_DATA' });

            // Click the "Return to Admin Teams page" button and verify the navigation
            await page.getByTestId('confirm-dlor-team-save-outcome').click();
            await expect(page).toHaveURL(`http://localhost:2020/admin/dlor/team/manage?user=${DLOR_ADMIN_USER}`);
            await expect(page.getByTestId('StandardPage-title')).toHaveText('Digital Learning Hub - Team management');
        });
    });
    test.describe('failures', () => {
        test('a failed api load shows correctly', async ({ page }) => {
            await page.goto(`http://localhost:2020/admin/dlor/team/edit/1?user=${DLOR_ADMIN_USER}&responseType=error`);
            await expect(
                page
                    .getByTestId('dlor-teamItem-error')
                    .getByText(/An error has occurred during the request/)
                    .first(),
            ).toBeVisible();
        });
    });
    test.describe('user access', () => {
        test('displays an "unauthorised" page to public users', async ({ page }) => {
            await page.goto('http://localhost:2020/admin/dlor/team/edit/2?user=public');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(
                page
                    .locator('h1')
                    .getByText(/Authentication required/)
                    .first(),
            ).toBeVisible();
        });
        test('displays an "unauthorised" page to non-authorised users', async ({ page }) => {
            await page.goto('http://localhost:2020/admin/dlor/team/edit/2?user=uqstaff');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(
                page
                    .locator('h1')
                    .getByText(/Permission denied/)
                    .first(),
            ).toBeVisible();
        });
        test('displays correct page for admin users (list)', async ({ page }) => {
            await page.goto(`http://localhost:2020/admin/dlor/team/edit/2?user=${DLOR_ADMIN_USER}`);
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.locator('h1')).toContainText('Digital Learning Hub - Edit Team');
        });
    });
});
