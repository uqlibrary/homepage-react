import { test, expect } from '@uq/pw/test';
import { assertAccessibility } from '@uq/pw/lib/axe';
import { dateHasValue } from './helpers';

test.describe('Alerts Admin View Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:2020/admin/alerts/view/1db618c0-d897-11eb-a27e-df4e46db7245?user=uqstaff');
        await page.setViewportSize({ width: 1300, height: 1000 });
    });
    test('is accessible', async ({ page }) => {
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(
            page
                .locator('h2')
                .getByText(/View alert/)
                .first(),
        ).toBeVisible();
        await assertAccessibility(page, '[data-testid="StandardPage"]');
    });
    test('can view an alert without being able to edit any fields', async ({ page }) => {
        await expect(
            page
                .locator('h2')
                .getByText(/View alert/)
                .first(),
        ).toBeVisible();
        await expect(page.locator('[data-testid="admin-alerts-view-title"] input')).toHaveValue('Example alert:');
        await expect(page.locator('[data-testid="admin-alerts-view-title"] input')).toBeDisabled();
        await expect(page.locator('[data-testid="admin-alerts-view-body"] #alertBody')).toHaveValue(
            'This alert can be edited in mock.',
        );
        await expect(page.locator('[data-testid="admin-alerts-view-body"] #alertBody')).toBeDisabled();
        await dateHasValue(page, '[data-testid="admin-alerts-view-start-date"] input', '2021-06-29T15:00');
        await expect(page.locator('[data-testid="admin-alerts-view-start-date"] input')).toBeDisabled();
        await dateHasValue(page, '[data-testid="admin-alerts-view-end-date"] input', '2031-07-02T18:30');
        await expect(page.locator('[data-testid="admin-alerts-view-end-date"] input')).toBeDisabled();
        await expect(page.locator('[data-testid="admin-alerts-view-checkbox-linkrequired"] input')).toBeChecked();
        await expect(page.locator('[data-testid="admin-alerts-view-checkbox-linkrequired"] input')).toBeDisabled();
        await expect(page.locator('[data-testid="admin-alerts-view-link-title"] input')).toHaveValue(
            'UQ community COVID-19 advice',
        );
        await expect(page.locator('[data-testid="admin-alerts-view-link-title"] input')).toBeDisabled();
        await expect(page.locator('[data-testid="admin-alerts-view-link-url"] input')).toHaveValue(
            'https://about.uq.edu.au/coronavirus',
        );
        await expect(page.locator('[data-testid="admin-alerts-view-link-url"] input')).toBeDisabled();
        await expect(page.locator('[data-testid="admin-alerts-view-checkbox-permanent"] input')).toBeChecked();
        await expect(page.locator('[data-testid="admin-alerts-view-checkbox-permanent"] input')).toBeDisabled();
        await expect(page.locator('[data-testid="admin-alerts-view-select-priority-type"] div')).toHaveAttribute(
            'aria-disabled',
            'true',
        );
        await expect(page.locator('[data-testid="admin-alerts-view-select-priority-type"] input')).toHaveValue(
            'urgent',
        );
    });
    test('can return to the list page from the view page', async ({ page }) => {
        await expect(page.locator('[data-testid="admin-alerts-view-title"] input')).toHaveValue('Example alert:');
        await expect(page.getByTestId('admin-alerts-view-button-block').locator(':scope > *')).toHaveCount(2);

        await page.locator('button[data-testid="admin-alerts-view-button-cancel"]').click();
        await expect(page).toHaveURL('http://localhost:2020/admin/alerts');
    });
    test('can visit the clone page from the view page', async ({ page }) => {
        await expect(page.locator('[data-testid="admin-alerts-view-title"] input')).toHaveValue('Example alert:');
        await expect(page.getByTestId('admin-alerts-view-button-block').locator(':scope > *')).toHaveCount(2);

        await expect(async () => {
            await page.locator('button[data-testid="admin-alerts-view-button-save"]').click({ timeout: 2000 });
            await expect(page).toHaveURL(
                'http://localhost:2020/admin/alerts/clone/1db618c0-d897-11eb-a27e-df4e46db7245',
                {
                    timeout: 2000,
                },
            );
        }).toPass();
    });
});
test.describe('Alerts Admin View Page - other page tests', () => {
    test('the editing user displays correctly', async ({ page }) => {
        await page.goto('http://localhost:2020/admin/alerts/view/dc64fde0-9969-11eb-8dc3-1d415ccc50ec?user=uqstaff');
        await page.setViewportSize({ width: 1300, height: 1000 });

        // the editing user displays correctly
        await expect(page.getByTestId('admin-alerts-view-created-by')).not.toBeVisible();
        await expect(
            page.getByTestId('admin-alerts-view-updated-by').getByText('Last Updated by: uqtest2'),
        ).toBeVisible();
    });
    test('tells the user when alert appeared on all systems', async ({ page }) => {
        await page.goto('http://localhost:2020/admin/alerts/view/cc0ab120-d4a3-11eb-b5ee-6593c1ac8f09?user=uqstaff');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(
            page
                .getByTestId('admin-alerts-view-systems')
                .getByText(/This alert appeared on all systems/)
                .first(),
        ).toBeVisible();

        // the editing user displays correctly
        await expect(page.getByTestId('admin-alerts-view-created-by').getByText('Created by: uqtest1')).toBeVisible();
        await expect(
            page.getByTestId('admin-alerts-view-updated-by').getByText('Last Updated by: uqtest2'),
        ).toBeVisible();
    });
    test('tells the user which systems the alert appeared on', async ({ page }) => {
        await page.goto('http://localhost:2020/admin/alerts/view/dc64fde0-9969-11eb-8dc3-1d415ccc50ec?user=uqstaff');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(
            page
                .getByTestId('admin-alerts-view-checkbox-system-primo')
                .getByText(/Primo/)
                .first(),
        ).toBeVisible();
        await expect(page.locator('[data-testid="admin-alerts-view-checkbox-system-primo"] input')).toBeChecked();
    });
});
