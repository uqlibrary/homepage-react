import { test, expect } from '@uq/pw/test';
import { assertAccessibility } from '@uq/pw/lib/axe';
import { DLOR_ADMIN_USER } from '@uq/pw/lib/constants';

test.describe('Digital Learning Hub admin Add Team', () => {
    test.beforeEach(async ({ context }) => {
        await context.clearCookies();
    });

    test.describe('Add DLOR Team', () => {
        test.beforeEach(async ({ page }) => {
            await page.goto(`http://localhost:2020/admin/dlor/team/add?user=${DLOR_ADMIN_USER}`);
            await page.setViewportSize({ width: 1300, height: 1000 });
        });

        test('is accessible', async ({ page }) => {
            await expect(page.locator('h1').getByText('Digital Learning Hub - Add a new Team')).toBeVisible();
            await assertAccessibility(page, '[data-testid="StandardPage"]');
        });

        test('loads as expected', async ({ page }) => {
            await expect(page.getByTestId('StandardPage-title')).toHaveText(/Digital Learning Hub - Add a new Team/);
            await expect(page.getByTestId('admin-dlor-team-form-team-name').locator('input')).toBeEmpty();
            await expect(page.getByTestId('admin-dlor-team-form-team-manager').locator('input')).toBeEmpty();
            await expect(page.getByTestId('admin-dlor-team-form-team-email').locator('input')).toBeEmpty();
            await expect(page.getByTestId('dlor-breadcrumb-admin-homelink')).toHaveAttribute(
                'href',
                `http://localhost:2020/admin/dlor?user=${DLOR_ADMIN_USER}`,
            );
            await expect(page.getByTestId('dlor-breadcrumb-team-management-link-0')).toHaveAttribute(
                'href',
                `http://localhost:2020/admin/dlor/team/manage?user=${DLOR_ADMIN_USER}`,
            );
            await expect(page.getByTestId('dlor-breadcrumb-add-new-team-label-1')).toHaveText(/Add new team/);
        });

        test('validates correctly', async ({ page }) => {
            const teamNameError = page.getByTestId('admin-dlor-team-form-error-message-team-name');
            const teamEmailError = page.getByTestId('admin-dlor-team-form-error-message-team-email');
            const saveButton = page.getByTestId('admin-dlor-team-form-save-button');
            const teamNameInput = page.getByTestId('admin-dlor-team-form-team-name').locator('input');
            const teamEmailInput = page.getByTestId('admin-dlor-team-form-team-email').locator('input');
            const teamManagerInput = page.getByTestId('admin-dlor-team-form-team-manager').locator('input');

            await expect(teamNameError).toHaveCSS('color', 'rgb(214, 41, 41)');
            await expect(teamEmailError).toHaveCSS('color', 'rgb(214, 41, 41)');
            await expect(saveButton).toBeDisabled();

            await teamNameInput.fill('Valid Team name');
            await expect(teamNameError).not.toBeVisible();
            await expect(teamEmailError).toBeVisible();
            await expect(saveButton).toBeDisabled();

            await teamEmailInput.fill('lea');
            await expect(teamNameError).not.toBeVisible();
            await expect(teamEmailError).toBeVisible();
            await expect(saveButton).toBeDisabled();

            await teamEmailInput.fill('lea@example.com');
            await expect(teamNameError).not.toBeVisible();
            await expect(teamEmailError).not.toBeVisible();
            await expect(saveButton).not.toBeDisabled();

            await teamManagerInput.fill('valid team manager');
            await expect(teamNameError).not.toBeVisible();
            await expect(teamEmailError).not.toBeVisible();
            await expect(saveButton).not.toBeDisabled();

            await teamNameInput.clear();
            await expect(teamNameError).toBeVisible();
            await expect(teamEmailError).not.toBeVisible();
            await expect(saveButton).toBeDisabled();
        });
    });

    test.describe('save test', () => {
        test.beforeEach(async ({ page, context }) => {
            await context.addCookies([
                {
                    name: 'CYPRESS_TEST_DATA',
                    value: 'active',
                    url: 'http://localhost',
                },
            ]);
            await page.goto(`http://localhost:2020/admin/dlor/team/add?user=${DLOR_ADMIN_USER}`);
            await page.setViewportSize({ width: 1300, height: 1000 });
        });

        test('saves correctly and starts another add', async ({ page, context }) => {
            const teamNameInput = page.getByTestId('admin-dlor-team-form-team-name').locator('input');
            const teamEmailInput = page.getByTestId('admin-dlor-team-form-team-email').locator('input');
            const saveButton = page.getByTestId('admin-dlor-team-form-save-button');

            await teamNameInput.fill('Valid Team name');
            await teamEmailInput.fill('lea@example.com');
            await expect(saveButton).not.toBeDisabled();
            await saveButton.click();

            await expect(
                page.getByTestId('dialogbox-dlor-team-save-outcome').getByText(/The team has been created/),
            ).toBeVisible();
            await expect(page.getByTestId('confirm-dlor-team-save-outcome')).toHaveText(/Return to Admin Teams page/);
            await expect(page.getByTestId('cancel-dlor-team-save-outcome')).toHaveText(/Add another Team/);

            const expectedValues = {
                team_name: 'Valid Team name',
                team_manager: '',
                team_email: 'lea@example.com',
            };

            const cookies = await context.cookies();
            const savedCookie = cookies.find(c => c.name === 'CYPRESS_DATA_SAVED');
            expect(savedCookie).toBeDefined();

            const decodedValue = decodeURIComponent(savedCookie!.value);
            const sentValues = JSON.parse(decodedValue);
            expect(sentValues).toEqual(expectedValues);
            await context.clearCookies({ name: 'CYPRESS_DATA_SAVED' });
            await context.clearCookies({ name: 'CYPRESS_TEST_DATA' });

            await page.getByTestId('cancel-dlor-team-save-outcome').click();

            await expect(page.getByTestId('StandardPage-title')).toHaveText(/Digital Learning Hub - Add a new Team/);
            await expect(page).toHaveURL(`http://localhost:2020/admin/dlor/team/add?user=${DLOR_ADMIN_USER}`);
        });

        test('saves correctly and navigates to team list', async ({ page, context }) => {
            const teamNameInput = page.getByTestId('admin-dlor-team-form-team-name').locator('input');
            const teamManagerInput = page.getByTestId('admin-dlor-team-form-team-manager').locator('input');
            const teamEmailInput = page.getByTestId('admin-dlor-team-form-team-email').locator('input');
            const saveButton = page.getByTestId('admin-dlor-team-form-save-button');

            await teamNameInput.fill('Valid Team Name');
            await teamManagerInput.fill('Valid Team manager name');
            await teamEmailInput.fill('lea@example.com');
            await saveButton.click();

            const dialog = page.getByTestId('dialogbox-dlor-team-save-outcome');
            await dialog.waitFor({ state: 'visible' });

            await expect(dialog).toContainText(/The team has been created/);
            await expect(page.getByTestId('confirm-dlor-team-save-outcome')).toHaveText(/Return to Admin Teams page/);
            await expect(page.getByTestId('cancel-dlor-team-save-outcome')).toHaveText(/Add another Team/);

            const expectedValues = {
                team_name: 'Valid Team Name',
                team_manager: 'Valid Team manager name',
                team_email: 'lea@example.com',
            };
            const cookies = await context.cookies();
            const savedCookie = cookies.find(c => c.name === 'CYPRESS_DATA_SAVED');
            expect(savedCookie).toBeDefined();

            const decodedValue = decodeURIComponent(savedCookie!.value);
            const sentValues = JSON.parse(decodedValue);
            expect(sentValues).toEqual(expectedValues);
            await context.clearCookies({ name: 'CYPRESS_DATA_SAVED' });
            await context.clearCookies({ name: 'CYPRESS_TEST_DATA' });

            await expect(dialog).toContainText(/The team has been created/);
            await expect(page.getByTestId('confirm-dlor-team-save-outcome')).toHaveText(/Return to Admin Teams page/);
            await expect(page.getByTestId('cancel-dlor-team-save-outcome')).toHaveText(/Add another Team/);

            await page.getByTestId('confirm-dlor-team-save-outcome').click();
            await expect(page).toHaveURL(`http://localhost:2020/admin/dlor/team/manage?user=${DLOR_ADMIN_USER}`);
            await expect(page.getByTestId('StandardPage-title')).toHaveText(/Digital Learning Hub - Team management/);
        });
    });

    test.describe('failed saving', () => {
        test('a failed save shows correctly', async ({ page }) => {
            const teamNameInput = page.getByTestId('admin-dlor-team-form-team-name').locator('input');
            const teamManagerInput = page.getByTestId('admin-dlor-team-form-team-manager').locator('input');
            const teamEmailInput = page.getByTestId('admin-dlor-team-form-team-email').locator('input');
            const saveButton = page.getByTestId('admin-dlor-team-form-save-button');

            await page.goto(`http://localhost:2020/admin/dlor/team/add?user=${DLOR_ADMIN_USER}&responseType=saveError`);
            await teamNameInput.fill('Valid Team Name');
            await teamManagerInput.fill('Valid Team manager name');
            await teamEmailInput.fill('lea@example.com');
            await saveButton.click();

            const dialog = page.getByTestId('dialogbox-dlor-team-save-outcome');
            await dialog.waitFor({ state: 'visible' });

            await expect(dialog).toContainText(/There was a problem with the input./);
            await expect(page.getByTestId('confirm-dlor-team-save-outcome')).toHaveText(/Close/);
            await page.getByTestId('confirm-dlor-team-save-outcome').click();

            await expect(page.getByTestId('dialogbox-dlor-team-save-outcome')).not.toBeVisible();
        });
    });

    test.describe('user access', () => {
        test('displays an "unauthorised" page to public users', async ({ page }) => {
            await page.goto('http://localhost:2020/admin/dlor/team/add?user=public');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.locator('h1')).toHaveText(/Authentication required/);
        });

        test('displays an "unauthorised" page to non-authorised users', async ({ page }) => {
            await page.goto('http://localhost:2020/admin/dlor/team/add?user=uqstaff');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.locator('h1')).toHaveText(/Permission denied/);
        });

        test('displays correct page for admin users', async ({ page }) => {
            await page.goto(`http://localhost:2020/admin/dlor/team/add?user=${DLOR_ADMIN_USER}`);
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.locator('h1').getByText('Digital Learning Hub - Add a new Team')).toBeVisible();
        });
    });
});
