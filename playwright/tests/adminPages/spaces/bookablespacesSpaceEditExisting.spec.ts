import { expect, test } from '@uq/pw/test';
import type { Page } from '@playwright/test';

import { assertAccessibility } from '@uq/pw/lib/axe';
import { setTestDataCookie } from '@uq/pw/lib/helpers';

const EDIT_SPACE_VIEWPORT = { width: 1300, height: 1000 };
const TAB_ABOUT = 'tab-about';

const openEditSpacePage = async (page: Page, spaceUuid: string, search = '?user=libSpaces') => {
    await page.goto(`http://localhost:2020/admin/spaces/edit/${spaceUuid}${search}`);
    await page.setViewportSize(EDIT_SPACE_VIEWPORT);
    await expect(page).toHaveURL(new RegExp(`/admin/spaces/edit/${spaceUuid}`), { timeout: 30_000 });
    await expect(page.getByTestId('admin-spaces-page-title')).toBeVisible({ timeout: 30_000 });
    await expect(page.getByTestId('space-name').locator('input')).toBeVisible({ timeout: 30_000 });
    await expect(page.getByTestId('admin-spaces-save-button-submit')).toBeVisible({ timeout: 30_000 });
};

const waitForSaveOutcomeDialog = async (page: Page, expectedTitleText: string) => {
    await expect(page.getByTestId('dialogbox-spaces-save-outcome')).toBeVisible({ timeout: 30_000 });
    await expect(page.getByTestId('message-title')).toContainText(expectedTitleText);
};

const chooseAnySpaceType = async (page: Page) => {
    const spaceTypeSelector = page.getByTestId('space-type');
    await expect(spaceTypeSelector).toBeVisible();
    await spaceTypeSelector.click();

    const firstOption = page.locator('ul[aria-labelledby="add-space-type-label"] li[role="option"]').first();
    await expect(firstOption).toBeVisible();
    const selectedSpaceTypeId = await firstOption.getAttribute('data-value');
    await firstOption.click();

    expect(selectedSpaceTypeId).toBeTruthy();
    return Number(selectedSpaceTypeId);
};

const ensureSpaceTypeSelected = async (page: Page) => {
    await page.getByTestId(TAB_ABOUT).click();
    const nativeSpaceTypeInput = page.locator('#add-space-type-input');
    await expect(nativeSpaceTypeInput).toBeAttached();

    if (await nativeSpaceTypeInput.inputValue()) {
        return;
    }

    await chooseAnySpaceType(page);
};

test.describe('Spaces Admin - edit spaces', () => {
    test('navigates from the dashboard to an existing edit form', async ({ page }) => {
        await page.goto('/admin/spaces?user=libSpaces');
        await page.setViewportSize(EDIT_SPACE_VIEWPORT);

        await expect(page.getByTestId('admin-spaces-page-title').getByText(/Manage Spaces/)).toBeVisible();
        await page.getByTestId('edit-space-123456-button').click();

        await expect(page).toHaveURL('http://localhost:2020/admin/spaces/edit/f98g_fwas_5g33?user=libSpaces');
        await expect(page.getByTestId('space-name').locator('input')).toHaveValue('01-W431', { timeout: 30_000 });
    });

    test('loads an existing space and keeps the edit page accessible', async ({ page }) => {
        await openEditSpacePage(page, 'f98g_fwas_5g33');

        await expect(page.getByTestId('space-name').locator('input')).toHaveValue('01-W431');
        await assertAccessibility(page, '[data-testid="SpacesAdminPage"]');

        await page.getByTestId('tab-location-hours').click();
        await expect(page.getByTestId('add-space-pretty-location')).toContainText('Walter Harrison Law Library');
        await expect(page.getByTestId('add-space-pretty-location')).toContainText('Westernmost corner');

        await page.getByTestId('tab-imagery').click();
        await expect(page.getByTestId('dropzone-preview').locator('img')).toHaveAttribute(
            'src',
            'https://campuses.uq.edu.au/files/35116/01-E107%20%28Resize%29.jpg',
        );
    });
});

test.describe('Spaces Admin - edit outcomes', () => {
    test.beforeEach(async ({ page, context }) => {
        await setTestDataCookie(context, page);
        await openEditSpacePage(page, 'f98g_fwas_5g33');
    });

    test('re-edits the record after saving', async ({ page }) => {
        const nameField = page.getByTestId('space-name').locator('input');
        await expect(nameField).toHaveValue('01-W431');
        await nameField.fill('New space name');
        await ensureSpaceTypeSelected(page);

        await page.getByTestId('admin-spaces-save-button-submit').click();
        await waitForSaveOutcomeDialog(page, 'The Space has been updated');

        await Promise.all([
            page.waitForURL('**/admin/spaces/edit/f98g_fwas_5g33?user=libSpaces', { timeout: 30_000 }),
            page.getByTestId('cancel-spaces-save-outcome').click(),
        ]);

        await expect(page.getByTestId('admin-spaces-page-title')).toBeVisible({ timeout: 30_000 });
        await expect(page.getByTestId('message-title')).toBeHidden({ timeout: 30_000 });
        await expect(page.getByTestId('space-name').locator('input')).toHaveValue('01-W431');
    });

    test('shows an accessible save result and returns to the dashboard', async ({ page }) => {
        await page.getByTestId('admin-spaces-save-button-submit').click();
        await waitForSaveOutcomeDialog(page, 'The Space has been updated');

        await assertAccessibility(page, '[data-testid="dialogbox-spaces-save-outcome"]');
        await expect(page.getByTestId('confirm-spaces-save-outcome')).toContainText('Return to dashboard');
        await expect(page.getByTestId('cancel-spaces-save-outcome')).toContainText('Edit record again');

        await Promise.all([
            page.waitForURL('http://localhost:2020/admin/spaces?user=libSpaces', { timeout: 30_000 }),
            page.getByTestId('confirm-spaces-save-outcome').click(),
        ]);
    });
});
