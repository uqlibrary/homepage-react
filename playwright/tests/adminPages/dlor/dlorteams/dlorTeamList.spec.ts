import { test, expect } from '@uq/pw/test';
import { DLOR_ADMIN_USER, DLOR_OBJECT_OWNER } from '@uq/pw/lib/constants';
import { assertAccessibility } from '@uq/pw/lib/axe';
test.describe('Digital Learning Hub admin Teams management', () => {
    test.beforeEach(async ({ page }) => {
        await page.context().clearCookies();
    });
    test.describe('Teams management', () => {
        test.beforeEach(async ({ page }) => {
            await page.goto(`http://localhost:2020/admin/dlor/team/manage?user=${DLOR_ADMIN_USER}`);
            await page.setViewportSize({ width: 1300, height: 1000 });
        });
        test('is accessible', async ({ page }) => {
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.locator('h1')).toContainText('Digital Learning Hub - Team management');
            await assertAccessibility(page, '[data-testid="StandardPage"]', { disabledRules: ['button-name'] });
        });
        test('has breadcrumbs', async ({ page }) => {
            await expect(
                page
                    .getByTestId('subsite-title')
                    .getByText(/Digital learning hub admin/)
                    .first(),
            ).toBeVisible();
        });
        test('loads as expected', async ({ page }) => {
            await expect(
                page
                    .locator('a[data-testid="dlor-breadcrumb-admin-homelink"]')
                    .getByText(/Digital Learning Hub admin/)
                    .first(),
            ).toHaveAttribute('href', `http://localhost:2020/admin/dlor?user=${DLOR_ADMIN_USER}`);
            await expect(
                page
                    .getByTestId('dlor-breadcrumb-team-management-label-0')
                    .getByText(/Team management/)
                    .first(),
            ).toBeVisible();
            // team name shows correctly
            await expect(
                page
                    .getByTestId('dlor-teamlist-panel-1')
                    .getByText(/LIB DX Digital Content/)
                    .first(),
            ).toBeVisible();

            // only one delete buttons appears
            await expect(page.getByTestId('dlor-teamlist-delete-1')).not.toBeVisible();
            await expect(page.getByTestId('dlor-teamlist-delete-2')).not.toBeVisible();
            await expect(page.getByTestId('dlor-teamlist-delete-3')).toBeVisible();
            // three edit buttons appears
            await expect(page.getByTestId('dlor-teamlist-edit-1')).toBeVisible();
            await expect(page.getByTestId('dlor-teamlist-edit-2')).toBeVisible();
            await expect(page.getByTestId('dlor-teamlist-edit-3')).toBeVisible();
            // object counts are correct
            await expect(
                page
                    .getByTestId('dlor-team-object-list-1')
                    .getByText(/21 Objects/)
                    .first(),
            ).toBeVisible();
            await expect(
                page
                    .getByTestId('dlor-team-object-list-2')
                    .getByText(/3 Objects/)
                    .first(),
            ).toBeVisible();
            await expect(page.getByTestId('dlor-team-object-list-3')).not.toBeVisible();
        });
        test('has a working "view a dlor" button', async ({ page }) => {
            // can open a list and click view an object
            await page.locator('[data-testid="dlor-team-object-list-1"] summary').click();
            await page.getByTestId('dlor-team-object-list-item-view-1').click();
            await expect(page).toHaveURL(
                'http://localhost:2020/digital-learning-hub/view/987y_isjgt_9866?user=dloradmn',
            );
        });
        test('has a working "edit a dlor" button', async ({ page }) => {
            // can open a list and click edit
            await page.locator('[data-testid="dlor-team-object-list-1"] summary').click();
            await page.getByTestId('dlor-team-object-list-item-1').click();
            await expect(page).toHaveURL('http://localhost:2020/admin/dlor/edit/987y_isjgt_9866?user=dloradmn');
        });
        test('has a working "add a team" button', async ({ page }) => {
            await expect(page.getByTestId('admin-dlor-visit-add-button')).toHaveText(/Add team/);
            await page.getByTestId('admin-dlor-visit-add-button').click();
            await expect(page).toHaveURL(`http://localhost:2020/admin/dlor/team/add?user=${DLOR_ADMIN_USER}`);
        });
        test('has a working "edit a team" button', async ({ page }) => {
            await page.getByTestId('dlor-teamlist-edit-2').click();
            await expect(page).toHaveURL(`http://localhost:2020/admin/dlor/team/edit/2?user=${DLOR_ADMIN_USER}`);
        });
        test('can cancel deletion of a Team', async ({ page }) => {
            // click delete icon on first Object
            await page.getByTestId('dlor-teamlist-delete-3').click();

            // confirm delete box is open
            await expect(
                page
                    .getByTestId('dialogbox-dlor-team-delete-confirm')
                    .getByText(/Do you want to delete this team\?/)
                    .first(),
            ).toBeVisible();

            // say "no, I dont want to delete" and the dialog just closes
            await page.getByTestId('cancel-dlor-team-delete-confirm').click();
            await expect(page.getByTestId('dialogbox-dlor-team-delete-confirm')).not.toBeVisible();
        });
        test('can delete a team', async ({ page }) => {
            // click delete icon on first Object
            await page.getByTestId('dlor-teamlist-delete-3').click();

            // confirm delete box is open
            await expect(
                page
                    .getByTestId('dialogbox-dlor-team-delete-confirm')
                    .getByText(/Do you want to delete this team\?/)
                    .first(),
            ).toBeVisible();

            // say "yes"
            await page.getByTestId('confirm-dlor-team-delete-confirm').click();

            // it worked!
            await expect(
                page
                    .locator('[data-testid="dialogbox-dlor-team-delete-confirm"] h2')
                    .getByText(/The team has been deleted\./)
                    .first(),
            ).toBeVisible();
            await expect(page.getByTestId('cancel-dlor-team-delete-confirm')).not.toBeVisible();
            await expect(page.getByTestId('confirm-dlor-team-delete-confirm')).toBeVisible();
            await expect(
                page
                    .getByTestId('confirm-dlor-team-delete-confirm')
                    .getByText(/Close/)
                    .first(),
            ).toBeVisible();

            await page.getByTestId('confirm-dlor-team-delete-confirm').click();
            // cant really test it was deleted - that will happen in canary. just confirm the page reloads
            await expect(page.getByTestId('dlor-teamlist-list').locator(':scope > *')).toHaveCount(4);
            // a second delete throw up the correct dialog boxes
            // (and doesn't think it is already done)
            await page.getByTestId('dlor-teamlist-delete-4').click();

            // confirm delete box is open
            await expect(
                page
                    .getByTestId('dialogbox-dlor-team-delete-confirm')
                    .getByText(/Do you want to delete this team\?/)
                    .first(),
            ).toBeVisible();

            // say "yes"
            await page.getByTestId('confirm-dlor-team-delete-confirm').click();

            // it worked!
            await expect(
                page
                    .locator('[data-testid="dialogbox-dlor-team-delete-confirm"] h2')
                    .getByText(/The team has been deleted\./)
                    .first(),
            ).toBeVisible();
            await expect(page.getByTestId('cancel-dlor-team-delete-confirm')).not.toBeVisible();
            await expect(
                page
                    .getByTestId('confirm-dlor-team-delete-confirm')
                    .getByText(/Close/)
                    .first(),
            ).toBeVisible();
            await page.getByTestId('confirm-dlor-team-delete-confirm').click();
        });
    });
    test.describe('failed actions', () => {
        test('a failed api load shows correctly', async ({ page }) => {
            await page.goto(
                `http://localhost:2020/admin/dlor/team/manage?user=${DLOR_ADMIN_USER}&responseType=teamsLoadError`,
            );
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(
                page
                    .getByTestId('dlor-teamlist-error')
                    .getByText(/An error has occurred during the request/)
                    .first(),
            ).toBeVisible();
        });
        test('a failed deletion is handled properly', async ({ page }) => {
            await page.goto(
                `http://localhost:2020/admin/dlor/team/manage?user=${DLOR_ADMIN_USER}&responseType=saveError`,
            );
            await page.setViewportSize({ width: 1300, height: 1000 });
            // click delete icon on first Object
            await page.getByTestId('dlor-teamlist-delete-3').click();

            // confirm delete box is open
            await expect(
                page
                    .getByTestId('dialogbox-dlor-team-delete-confirm')
                    .getByText(/Do you want to delete this team\?/)
                    .first(),
            ).toBeVisible();

            // say "yes"
            await page.getByTestId('confirm-dlor-team-delete-confirm').click();

            // it failed! just what we wanted :)
            await expect(
                page
                    .locator('[data-testid="dialogbox-dlor-team-delete-confirm"] h2')
                    .getByText(/An error has occurred during the request and this request cannot be processed\./)
                    .first(),
            ).toBeVisible();
            await expect(page.getByTestId('cancel-dlor-team-delete-confirm')).not.toBeVisible();
            await expect(
                page
                    .getByTestId('confirm-dlor-team-delete-confirm')
                    .getByText(/Close/)
                    .first(),
            ).toBeVisible();

            await page.getByTestId('confirm-dlor-team-delete-confirm').click();
            // cant really test it was deleted - that will happen in canary. just confirm the page reloads
            await expect(page.getByTestId('dlor-teamlist-list').locator(':scope > *')).toHaveCount(4);
        });
    });
    test.describe('user access', () => {
        test('displays an "unauthorised" page to public users', async ({ page }) => {
            await page.goto('http://localhost:2020/admin/dlor/team/manage?user=public');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(
                page
                    .locator('h1')
                    .getByText(/Authentication required/)
                    .first(),
            ).toBeVisible();
        });
        test('displays an "unauthorised" page to non-authorised users', async ({ page }) => {
            await page.goto('http://localhost:2020/admin/dlor/team/manage?user=uqstaff');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(
                page
                    .locator('h1')
                    .getByText(/Permission denied/)
                    .first(),
            ).toBeVisible();
        });
        test('displays correct page for admin users (list)', async ({ page }) => {
            await page.goto(`http://localhost:2020/admin/dlor/team/manage?user=${DLOR_ADMIN_USER}`);
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.locator('h1')).toContainText('Digital Learning Hub - Team management');
        });
        test('displays correct page for non admin users (list)', async ({ page }) => {
            await page.goto(`http://localhost:2020/digital-learning-hub/team/manage?user=${DLOR_OBJECT_OWNER}`);
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.locator('h1')).toContainText('Digital Learning Hub - Team management');
            await expect(page.getByTestId('dlor-teamlist-panel-1')).toBeVisible();
            await expect(page.getByTestId('admin-dlor-visit-add-button')).not.toBeVisible();
        });
    });
});
