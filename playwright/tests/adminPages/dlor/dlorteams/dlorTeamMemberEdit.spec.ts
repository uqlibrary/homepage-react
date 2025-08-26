import { test, expect } from '@uq/pw/test';
import { DLOR_ADMIN_USER } from '@uq/pw/lib/constants';
import { assertAccessibility } from '@uq/pw/lib/axe';

test.describe('Digital Learning Hub admin Teams Members management', () => {
    test.beforeEach(async ({ page }) => await page.context().clearCookies());

    test.describe('Teams member management', () => {
        test.beforeEach(async ({ page }) => {
            await page.goto(`http://localhost:2020/admin/dlor/team/manage?user=${DLOR_ADMIN_USER}`);
            await page.setViewportSize({ width: 1300, height: 1000 });
        });
        test('is accessible', async ({ page }) => {
            await page.setViewportSize({ width: 1300, height: 1000 });
            await page.waitForSelector('h1');
            await expect(page.locator('h1')).toContainText('Digital Learning Hub - Team management');

            await assertAccessibility(page, '[data-testid="StandardPage"]');
        });
        test('team user management - add member', async ({ page }) => {
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.locator('h1')).toContainText('Digital Learning Hub - Team management');
            await page.locator('[data-testid="dlor-teamlist-edit-1"]').click();
            await expect(page.locator('[data-testid="team-members-title"]')).toBeVisible();
            // spaces and length check
            await page.locator('[data-testid="add-team-member-username"] input').fill('user name with spaces');
            await expect(page.locator('[data-testid="add-team-member-username"] input')).toHaveValue('usernamewithspa');
            // email check
            await page.locator('[data-testid="add-team-member-email"] input').fill('username@uq');
            // disabled button
            await expect(page.locator('[data-testid="add-team-member-button"]')).toBeDisabled();
            await page.locator('[data-testid="add-team-member-email"] input').fill('username@uq.edu.au');
            // enabled button
            await page.locator('[data-testid="add-team-member-button"]').click();
            await expect(page.locator('h1')).toContainText('Digital Learning Hub - Edit Team');
            await expect(page.locator('[data-testid="dlor-breadcrumb-edit-team-label-1"]')).toContainText(
                'Edit team: LIB DX Digital Content',
            );
        });
        test('team user management - edit member', async ({ page }) => {
            await page.setViewportSize({ width: 1300, height: 1000 });
            await page.waitForSelector('h1');
            await expect(page.locator('h1')).toContainText('Digital Learning Hub - Team management');
            await page.locator('[data-testid="dlor-teamlist-edit-1"]').click();
            await expect(page.locator('[data-testid="team-members-title"]')).toBeVisible();
            // Edit first user
            await page.locator('[data-testid="team-member-edit-0"]').click();
            await page.locator('input[value="uqstaff"]').fill('uqstaffedit');
            await page.locator('input[value="uqstaff@uq.edu.au"]').fill('uqstaffedit@uq.edu.au');
            await page.locator('[data-testid="team-member-save-0"]').click();
            // Test Cancel button
            await page.locator('[data-testid="team-member-edit-0"]').click();
            await page.locator('input[value="uqstaff"]').fill('uqstaffedit');
            await page.locator('input[value="uqstaff@uq.edu.au"]').fill('uqstaffedit@uq.edu.au');
            await page.locator('[data-testid="team-member-cancel-0"]').click();
            await expect(page.locator('[data-testid="team-member-cancel-0"]')).not.toBeVisible();
        });
        test('team user management - delete member', async ({ page }) => {
            await page.setViewportSize({ width: 1300, height: 1000 });
            await page.waitForSelector('h1');
            await expect(page.locator('h1')).toContainText('Digital Learning Hub - Team management');
            await page.locator('[data-testid="dlor-teamlist-edit-1"]').click();
            await expect(page.locator('[data-testid="team-members-title"]')).toBeVisible();
            // Delete first user
            await page.locator('[data-testid="team-member-delete-0"]').click();
            // Cancel delete
            await page.locator('[data-testid="cancel-dlor-team-member-delete-confirm"]').click();
            await page.locator('[data-testid="team-member-delete-0"]').click();
            // Confirm delete
            await page.locator('[data-testid="confirm-dlor-team-member-delete-confirm"]').click();
            // confirm we returned to the management page for testing.
            await expect(page.locator('[data-testid="team-member-delete-0"]')).toBeVisible();
        });
    });
    test.describe('Teams member restrictions', () => {
        test('team user management - no access', async ({ page }) => {
            await page.goto('http://localhost:2020/digital-learning-hub/team/edit/2?user=uqstaff');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.locator('[data-testid="dlor-teamItem-error-message"]')).toContainText(
                'You are not a member of this team and cannot edit it.',
            );
        });
    });
});
