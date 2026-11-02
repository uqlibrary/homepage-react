import { expect, test } from '@uq/pw/test';
import { assertAccessibility } from '@uq/pw/lib/axe';
import { DLOR_ADMIN_USER } from '@uq/pw/lib/constants';

const ADD_PAGE_URL = `http://localhost:2020/admin/dlor/add?user=${DLOR_ADMIN_USER}`;
const PAGE_VIEWPORT = { width: 1300, height: 1000 };

test.describe('Add an object to the Digital Learning Hub', () => {
    test('loads the add form and keeps each step accessible', async ({ page }) => {
        await page.goto(ADD_PAGE_URL);
        await page.setViewportSize(PAGE_VIEWPORT);

        await expect(page.getByRole('heading', { name: 'Digital Learning Hub Management' })).toBeVisible();
        await expect(page.getByTestId('dlor-breadcrumb-admin-homelink')).toHaveAttribute(
            'href',
            `/admin/dlor?user=${DLOR_ADMIN_USER}`,
        );
        await expect(page.getByTestId('object-publishing-user').locator('input')).toHaveValue('dloradmn');
        await assertAccessibility(page, '[data-testid="StandardPage"]');

        await page.getByTestId('dlor-form-next-button').click();
        await expect(page.getByTestId('object-title')).toBeVisible();
        await assertAccessibility(page, '[data-testid="StandardPage"]');

        await page.getByTestId('dlor-form-next-button').click();
        await expect(page.getByTestId('object-link-url')).toBeVisible();
        await assertAccessibility(page, '[data-testid="StandardPage"]');

        await page.getByTestId('dlor-form-next-button').click();
        await expect(page.getByTestId('filter-topic-aboriginal-and-torres-strait-islander')).toBeVisible();
        await expect(page.getByTestId('choose-notify')).not.toBeVisible();
        await assertAccessibility(page, '[data-testid="StandardPage"]');
    });

    test('shows an error when the teams dependency cannot be loaded', async ({ page }) => {
        await page.goto(`${ADD_PAGE_URL}&responseType=teamsLoadError`);

        await expect(
            page
                .getByTestId('dlor-form-addedit-error')
                .getByText('An error has occurred during the request and this request cannot be processed'),
        ).toBeVisible();
    });

    test('requires authentication for public users', async ({ page }) => {
        await page.goto('http://localhost:2020/admin/dlor/add?user=public');

        await expect(page.getByRole('heading', { name: 'Authentication required' })).toBeVisible();
    });

    test('denies access to users without DLO admin permission', async ({ page }) => {
        await page.goto('http://localhost:2020/admin/dlor/add?user=uqstaff');

        await expect(page.getByRole('heading', { name: 'Permission denied' })).toBeVisible();
    });
});
