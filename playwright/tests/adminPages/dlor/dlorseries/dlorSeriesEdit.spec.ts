import { test, expect } from '../../../../test';
import { DLOR_ADMIN_USER } from '../../../../lib/constants';
import { assertAccessibility } from '../../../../lib/axe';
import { getOpenedLink } from '../../../../lib/helpers';

test.describe('Digital Learning Hub admin Series management - edit item', () => {
    test.beforeEach(async ({ context }) => {
        await context.clearCookies();
    });

    test.describe('Series management', () => {
        test.beforeEach(async ({ page }) => {
            await page.goto(`http://localhost:2020/admin/dlor/series/edit/1?user=${DLOR_ADMIN_USER}`);
            await page.setViewportSize({ width: 1300, height: 1000 });
        });

        test('has breadcrumbs', async ({ page }) => {
            await expect(page.getByTestId('subsite-title')).toHaveText(/Digital learning hub admin/);
        });

        test('loads as expected', async ({ page }) => {
            await expect(page.getByTestId('StandardPage-title')).toHaveText(/Digital Learning Hub - Edit Series/);

            await expect(page.getByTestId('dlor-breadcrumb-admin-homelink')).toHaveAttribute(
                'href',
                `http://localhost:2020/admin/dlor?user=${DLOR_ADMIN_USER}`,
            );
            await expect(page.getByTestId('dlor-breadcrumb-series-management-link-0')).toHaveAttribute(
                'href',
                `http://localhost:2020/admin/dlor/series/manage?user=${DLOR_ADMIN_USER}`,
            );
            await expect(page.getByTestId('dlor-breadcrumb-edit-series-label-1')).toHaveText(
                /Edit series: Advanced literature searching/,
            );

            // series name shows correctly
            await expect(page.getByTestId('series-name').locator('input')).toHaveValue('Advanced literature searching');
            await expect(
                page.getByTestId('dlor-series-edit-draggable-title-9bc1894a-8b0d-46da-a25e-02d26e2e056c'),
            ).toHaveText(/\(Deprecated\)/);
        });

        test('is accessible', async ({ page }) => {
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.locator('h1')).toContainText('Digital Learning Hub - Edit Series');
            await assertAccessibility(page, '[data-testid="StandardPage"]', { disabledRules: ['link-name'] });
        });

        test('drag drop functions as expected', async ({ page }) => {
            const firstItem = page.getByTestId('dlor-series-edit-draggable-title-98s0_dy5k3_98h4');
            const secondItem = page.getByTestId(
                'dlor-series-edit-draggable-title-9bc1894a-8b0d-46da-a25e-02d26e2e056c',
            );

            // Drag first item to second item's position
            await firstItem.dragTo(secondItem);

            // Wait for the list to be updated
            await page.waitForSelector('#dragLandingAarea li');

            const listItems = page.locator('#dragLandingAarea li');
            await expect(listItems.first()).toContainText('for science');
            await expect(listItems.nth(1)).toHaveText(/Advanced literature searching/);

            // Drag first item to second item's position again to revert
            await firstItem.dragTo(secondItem);

            // Wait for the list to be updated
            await page.waitForSelector('#dragLandingAarea li');

            const updatedListItems = page.locator('#dragLandingAarea li');
            await expect(updatedListItems.first()).toContainText('Advanced literature searching');
            await expect(updatedListItems.nth(1)).toHaveText(/for science/);
        });

        test('has a working "cancel edit" button', async ({ page }) => {
            const cancelButton = page.getByTestId('admin-dlor-series-form-button-cancel');
            await expect(cancelButton).toHaveText(/Cancel/);
            await cancelButton.click();
            await expect(page).toHaveURL(`http://localhost:2020/admin/dlor/series/manage?user=${DLOR_ADMIN_USER}`);
        });

        test('has a working "view a dlor" button', async ({ page, context }) => {
            const tab = await getOpenedLink(context, page.getByTestId('dlor-series-edit-view-2'));
            await expect(tab).toHaveURL(
                `http://localhost:2020/digital-learning-hub/view/98s0_dy5k3_98h4?user=${DLOR_ADMIN_USER}`,
            );
            await tab.close();
        });
    });

    test.describe('Series management - second describe block', () => {
        test.beforeEach(async ({ page }) => {
            await page.goto(`http://localhost:2020/admin/dlor/series/edit/1?user=${DLOR_ADMIN_USER}`);
            await page.setViewportSize({ width: 1300, height: 1000 });
        });

        test('can add a series with objects', async ({ page }) => {
            await page.getByTestId('admin-dlor-series-summary-button').click();
            await page.getByTestId('admin-series-add-object-button-980').click();
            await page.getByTestId('admin-series-add-object-button-981').click();
            await page.getByTestId('admin-series-remove-object-button-2').click();
            await page.getByTestId('admin-series-remove-object-button-2').click();

            const listItems = page.locator('#dragLandingAarea li');
            await expect(listItems.nth(1)).toHaveText(/for science/);
            await expect(listItems.first()).toContainText('Advanced literature searching');

            const seriesNameInput = page.locator('#series_name');
            await seriesNameInput.clear();
            await seriesNameInput.fill('Advanced literature searching xxx');
            await page.getByTestId('admin-dlor-series-form-save-button').click();
            await expect(page.getByTestId('message-title')).toContainText('Changes have been saved');
        });
    });

    test.describe('successfully mock to db', () => {
        test.beforeEach(async ({ page, context }) => {
            await context.addCookies([
                {
                    name: 'CYPRESS_TEST_DATA',
                    value: 'active',
                    url: 'http://localhost',
                },
            ]);
            await page.goto(`http://localhost:2020/admin/dlor/series/edit/1?user=${DLOR_ADMIN_USER}`);
            await page.setViewportSize({ width: 1300, height: 1000 });
        });

        test('saves correctly with reload form', async ({ page, context }) => {
            const cookies = await context.cookies();
            const cookie = cookies.find(c => c.name === 'CYPRESS_DATA_SAVED');
            expect(cookie).toBeUndefined(); // The original Cypress test had a bug here, expecting a non-existent cookie. The fix is to expect it not to exist.

            const seriesNameInput = page.getByTestId('series-name').locator('input');
            await expect(seriesNameInput).toHaveValue('Advanced literature searching');
            await seriesNameInput.focus();
            await seriesNameInput.pressSequentially(' xxx');
            await page.getByTestId('admin-dlor-series-form-save-button').click();

            const expectedValues = {
                series_name: 'Advanced literature searching xxx',
                series_description: 'Advanced literature description',
                series_list: [
                    {
                        object_public_uuid: '98s0_dy5k3_98h4',
                        object_series_order: 1,
                    },
                    {
                        object_public_uuid: '9bc1894a-8b0d-46da-a25e-02d26e2e056c',
                        object_series_order: 2,
                    },
                ],
            };
            const updatedCookies = await context.cookies();
            const savedCookie = updatedCookies.find(c => c.name === 'CYPRESS_DATA_SAVED');
            expect(savedCookie).toBeDefined();

            const decodedValue = decodeURIComponent(savedCookie!.value);
            const sentValues = JSON.parse(decodedValue);
            expect(sentValues).toEqual(expectedValues);
            await context.clearCookies({ name: 'CYPRESS_DATA_SAVED' });
            await context.clearCookies({ name: 'CYPRESS_TEST_DATA' });

            // prompted when save succeeds
            const dialog = page.getByTestId('dialogbox-dlor-series-save-outcome');
            await expect(dialog).toContainText(/Changes have been saved/);
            await expect(page.getByTestId('confirm-dlor-series-save-outcome')).toHaveText(
                /Return to Admin Series page/,
            );
            await expect(page.getByTestId('cancel-dlor-series-save-outcome')).toHaveText(/Re-edit Series/);

            // choose to re-edit series
            await page.getByTestId('cancel-dlor-series-save-outcome').click();

            // form reloads
            await expect(page).toHaveURL(`http://localhost:2020/admin/dlor/series/edit/1?user=${DLOR_ADMIN_USER}`);
            await expect(page.getByTestId('StandardPage-title')).toHaveText(/Digital Learning Hub - Edit Series/);
            await expect(page.getByTestId('series-name').locator('input')).toHaveValue('Advanced literature searching');
        });

        test('saves correctly with return to list', async ({ page, context }) => {
            const cookies = await context.cookies();
            const testCookie = cookies.find(c => c.name === 'CYPRESS_TEST_DATA');
            expect(testCookie).toBeDefined();
            expect(testCookie!.value).toBe('active');

            const seriesNameInput = page.getByTestId('series-name').locator('input');
            await expect(seriesNameInput).toHaveValue('Advanced literature searching');
            await seriesNameInput.focus();
            await seriesNameInput.pressSequentially(' yyy');
            await page.getByTestId('admin-dlor-series-form-save-button').click();

            const expectedValues = {
                series_name: 'Advanced literature searching yyy',
                series_description: 'Advanced literature description',
                series_list: [
                    {
                        object_public_uuid: '98s0_dy5k3_98h4',
                        object_series_order: 1,
                    },
                    {
                        object_public_uuid: '9bc1894a-8b0d-46da-a25e-02d26e2e056c',
                        object_series_order: 2,
                    },
                ],
            };
            const updatedCookies = await context.cookies();
            const savedCookie = updatedCookies.find(c => c.name === 'CYPRESS_DATA_SAVED');
            expect(savedCookie).toBeDefined();

            const decodedValue = decodeURIComponent(savedCookie!.value);
            const sentValues = JSON.parse(decodedValue);
            expect(sentValues).toEqual(expectedValues);
            await context.clearCookies({ name: 'CYPRESS_DATA_SAVED' });
            await context.clearCookies({ name: 'CYPRESS_TEST_DATA' });

            // prompted when save succeeds
            const dialog = page.getByTestId('dialogbox-dlor-series-save-outcome');
            await expect(dialog).toContainText(/Changes have been saved/);
            await expect(page.getByTestId('confirm-dlor-series-save-outcome')).toHaveText(
                /Return to Admin Series page/,
            );
            await expect(page.getByTestId('cancel-dlor-series-save-outcome')).toHaveText(/Re-edit Series/);

            // choose to Return to Admin Series page
            await page.getByTestId('confirm-dlor-series-save-outcome').click();

            // list page loads
            await expect(page).toHaveURL(`http://localhost:2020/admin/dlor/series/manage?user=${DLOR_ADMIN_USER}`);
            await expect(page.getByTestId('StandardPage-title')).toHaveText(/Digital Learning Hub - Series management/);
        });
    });

    test.describe('failures', () => {
        test('a failed save shows correctly', async ({ page }) => {
            await page.goto(
                `http://localhost:2020/admin/dlor/series/edit/1?user=${DLOR_ADMIN_USER}&responseType=saveError`,
            );
            await page.setViewportSize({ width: 1300, height: 1000 });

            await page
                .getByTestId('series-name')
                .locator('input')
                .type(' yyy');
            await page.getByTestId('admin-dlor-series-form-save-button').click();

            const dialog = page.getByTestId('dialogbox-dlor-series-save-outcome');
            await expect(dialog).toContainText(
                /An error has occurred during the request and this request cannot be processed\./,
            );
            await expect(page.getByTestId('cancel-dlor-series-save-outcome')).not.toBeVisible();
            await expect(page.getByTestId('confirm-dlor-series-save-outcome')).toHaveText(/Close/);
            await page.getByTestId('confirm-dlor-series-save-outcome').click();
        });

        test('a failed api load shows correctly', async ({ page }) => {
            await page.goto(
                `http://localhost:2020/admin/dlor/series/edit/1?user=${DLOR_ADMIN_USER}&responseType=fullListError`,
            );
            await expect(page.getByTestId('dlor-seriesItem-error')).toContainText(
                /An error has occurred during the request/,
            );
        });
    });

    test.describe('user access', () => {
        test('displays an "unauthorised" page to public users', async ({ page }) => {
            await page.goto('http://localhost:2020/admin/dlor/series/edit/1?user=public');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.locator('h1')).toHaveText(/Authentication required/);
        });

        test('displays an "unauthorised" page to non-authorised users', async ({ page }) => {
            await page.goto('http://localhost:2020/admin/dlor/series/edit/1?user=uqstaff');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.locator('h1')).toHaveText(/Permission denied/);
        });

        test('displays correct page for admin users (list)', async ({ page }) => {
            await page.goto(`http://localhost:2020/admin/dlor/series/edit/1?user=${DLOR_ADMIN_USER}`);
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.locator('h1')).toHaveText('Digital Learning Hub - Edit Series');
        });
    });
});
