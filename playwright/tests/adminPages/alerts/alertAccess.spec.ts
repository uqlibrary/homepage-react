import { test, expect } from '../../../test';
test.describe('Alerts Admin Page access', () => {
    test.describe('Alert Admin public access blocked', () => {
        test('displays an "unauthorised" page to public users', async ({ page }) => {
            await page.goto('http://localhost:2020/admin/alerts?user=public');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.locator('h1')).toBeVisible();
            await expect(
                page
                    .locator('h1')
                    .getByText(/Authentication required/)
                    .first(),
            ).toBeVisible();
        });
        test('add page displays an "unauthorised" page to public users', async ({ page }) => {
            await page.goto('http://localhost:2020/admin/alerts/add?user=public');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.locator('h1')).toBeVisible();
            await expect(
                page
                    .locator('h1')
                    .getByText(/Authentication required/)
                    .first(),
            ).toBeVisible();
        });
        test('edit page displays an "unauthorised" page to public users', async ({ page }) => {
            await page.goto('http://localhost:2020/admin/alerts/edit/1db618c0-d897-11eb-a27e-df4e46db7245?user=public');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.locator('h1')).toBeVisible();
            await expect(
                page
                    .locator('h1')
                    .getByText(/Authentication required/)
                    .first(),
            ).toBeVisible();
        });
        test('clone page displays an "unauthorised" page to public users', async ({ page }) => {
            await page.goto(
                'http://localhost:2020/admin/alerts/clone/1db618c0-d897-11eb-a27e-df4e46db7245?user=public',
            );
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.locator('h1')).toBeVisible();
            await expect(
                page
                    .locator('h1')
                    .getByText(/Authentication required/)
                    .first(),
            ).toBeVisible();
        });
        test('view page displays an "unauthorised" page to public users', async ({ page }) => {
            await page.goto('http://localhost:2020/admin/alerts/view/1db618c0-d897-11eb-a27e-df4e46db7245?user=public');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.locator('h1')).toBeVisible();
            await expect(
                page
                    .locator('h1')
                    .getByText(/Authentication required/)
                    .first(),
            ).toBeVisible();
        });
    });
    test.describe('Alert Admin non admin access blocked', () => {
        test('displays an "unauthorised" page to non-authorised users', async ({ page }) => {
            await page.goto('http://localhost:2020/admin/alerts?user=uqstaffnonpriv');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.locator('h1')).toBeVisible();
            await expect(
                page
                    .locator('h1')
                    .getByText(/Permission denied/)
                    .first(),
            ).toBeVisible();
        });
        test('add page displays an "unauthorised" page to non-authorised users', async ({ page }) => {
            await page.goto('http://localhost:2020/admin/alerts/add?user=uqstaffnonpriv');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.locator('h1')).toBeVisible();
            await expect(
                page
                    .locator('h1')
                    .getByText(/Permission denied/)
                    .first(),
            ).toBeVisible();
        });
        test('edit page displays an "unauthorised" page to non-authorised users', async ({ page }) => {
            await page.goto(
                'http://localhost:2020/admin/alerts/edit/1db618c0-d897-11eb-a27e-df4e46db7245?user=uqstaffnonpriv',
            );
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.locator('h1')).toBeVisible();
            await expect(
                page
                    .locator('h1')
                    .getByText(/Permission denied/)
                    .first(),
            ).toBeVisible();
        });
        test('clone page displays an "unauthorised" page to non-authorised users', async ({ page }) => {
            await page.goto(
                'http://localhost:2020/admin/alerts/clone/1db618c0-d897-11eb-a27e-df4e46db7245?user=uqstaffnonpriv',
            );
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.locator('h1')).toBeVisible();
            await expect(
                page
                    .locator('h1')
                    .getByText(/Permission denied/)
                    .first(),
            ).toBeVisible();
        });
        test('view page displays an "unauthorised" page to non-authorised users', async ({ page }) => {
            await page.goto(
                'http://localhost:2020/admin/alerts/view/1db618c0-d897-11eb-a27e-df4e46db7245?user=uqstaffnonpriv',
            );
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.locator('h1')).toBeVisible();
            await expect(
                page
                    .locator('h1')
                    .getByText(/Permission denied/)
                    .first(),
            ).toBeVisible();
        });
    });
});
