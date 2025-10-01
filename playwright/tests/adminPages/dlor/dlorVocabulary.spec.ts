import { test, expect, Page } from '@uq/pw/test';
import { DLOR_ADMIN_USER } from '@uq/pw/lib/constants';
import { assertAccessibility } from '@uq/pw/lib/axe';

test.describe('Digital Learning Hub admin', () => {
    test.beforeEach(async ({}, testInfo) => {
        test.setTimeout(testInfo.timeout + 30_000);
    });

    test.describe('vocabulary', () => {
        test.beforeEach(async ({ page }) => {
            await page.goto(`http://localhost:2020/admin/dlor/vocabulary?user=${DLOR_ADMIN_USER}`);
            await page.setViewportSize({ width: 1300, height: 1000 });
        });
        test('is accessible', async ({ page }) => {
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(
                page
                    .locator('h1')
                    .first()
                    .getByText('Digital Learning Hub - Keyword Vocabulary Management'),
            ).toBeVisible();
            await assertAccessibility(page, '[data-testid="StandardPage"]', { disabledRules: ['button-name'] });
        });
        test('can edit and add an item', async ({ page }) => {
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(
                page
                    .locator('h1')
                    .first()
                    .getByText('Digital Learning Hub - Keyword Vocabulary Management'),
            ).toBeVisible();
            await page.getByTestId('edit-synonym-1-0').click();
            await page.getByTestId("vocabulary-name").fill("test");
            await page.getByTestId('admin-dlor-filter-confirm-button').click();
            await expect(page.getByTestId('admin-dlor-filter-confirm-button')).not.toBeVisible();

            await page.getByTestId('add-synonym-1-button').click();
            await page.getByTestId("vocabulary-name").fill("test");
            await page.getByTestId('admin-dlor-filter-confirm-button').click();
            await expect(page.getByTestId('admin-dlor-filter-confirm-button')).not.toBeVisible();
            //add a vocabulary item
            await page.getByTestId('admin-dlor-add-keyword-button').click();
            await page.getByTestId("vocabulary-name").fill("test");
            await page.getByTestId('admin-dlor-filter-confirm-button').click();
            await expect(page.getByTestId('admin-dlor-filter-confirm-button')).not.toBeVisible();
            //edit a vocabulary item
            await page.getByTestId('edit-keyword-1-button').click();
            await page.getByTestId("vocabulary-name").fill("test");
            await page.getByTestId('admin-dlor-filter-confirm-button').click();
            await expect(page.getByTestId('admin-dlor-filter-confirm-button')).not.toBeVisible();

        });
        test('can delete an item', async ({ page }) => {
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(
                page
                    .locator('h1')
                    .first()
                    .getByText('Digital Learning Hub - Keyword Vocabulary Management'),
            ).toBeVisible();
            await page.getByTestId('delete-facet-1-0').click();
            await page.getByTestId('confirm-synonym-delete-confirmation').click();
            await expect(page.getByTestId('confirm-synonym-delete-confirmation')).not.toBeVisible();
            await page.getByTestId('delete-facet-1-0').click();
            await page.getByTestId('cancel-synonym-delete-confirmation').click();
            await expect(page.getByTestId('confirm-synonym-delete-confirmation')).not.toBeVisible();
        });
        test('Admin menu works', async ({ page }) => {
            await page.setViewportSize({ width: 1300, height: 1000 });
            await page.getByTestId('dlor-breadcrumb-admin-homelink').click();
            await page.getByTestId('admin-dlor-menu-button').click();
            await page.getByTestId('admin-dlor-visit-manage-vocabulary-button').click();
            await expect(
                page
                    .locator('h1')
                    .first()
                    .getByText('Digital Learning Hub - Keyword Vocabulary Management'),
            ).toBeVisible();
        });

        

    });
});