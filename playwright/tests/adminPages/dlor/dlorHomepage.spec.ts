import { test, expect } from '@uq/pw/test';
import { DLOR_ADMIN_USER } from '@uq/pw/lib/constants';

test.describe('Digital Learning Hub admin homepage', () => {
    const itemsPerPage = 10; // matches value in DLOAdminHomepage
    const gridFromExpectedRowCount = (expected = 23) => (expected > itemsPerPage ? itemsPerPage : expected);
    test.describe('homepage', () => {
        test.beforeEach(async ({ page }) => {
            await page.goto(`http://localhost:2020/admin/dlor?user=${DLOR_ADMIN_USER}`);
            await page.setViewportSize({ width: 1300, height: 1000 });
        });

        test('is accessible', async ({ page }) => {
            await page.setViewportSize({ width: 1300, height: 1000 });
            await page.waitForSelector('h1');
            const h1 = page.locator('h1').first();
            await expect(h1).toContainText('Digital Learning Hub Management');
        });

        test('has a working "visit public homepage" button', async ({ page }) => {
            await page.getByTestId('admin-dlor-menu-button').click();
            await page.getByTestId('dlor-admin-public-homepage-link').click();
            await expect(page).toHaveURL('http://localhost:2020/digital-learning-hub');
        });

        test('has a working "add an object" button', async ({ page }) => {
            await page.getByTestId('admin-dlor-menu-button').click();
            const addObjectButton = page.getByTestId('admin-dlor-visit-add-button');
            await expect(addObjectButton).toContainText('Add object');
            await addObjectButton.click();
            await expect(page).toHaveURL(`http://localhost:2020/admin/dlor/add?user=${DLOR_ADMIN_USER}`);
        });

        test('has a working "manage teams" button', async ({ page }) => {
            await page.getByTestId('admin-dlor-menu-button').click();
            const manageTeamsButton = page.getByTestId('admin-dlor-visit-manage-teams-button');
            await expect(manageTeamsButton).toContainText('Manage teams');
            await manageTeamsButton.click();
            await expect(page).toHaveURL(`http://localhost:2020/admin/dlor/team/manage?user=${DLOR_ADMIN_USER}`);
        });

        test('has a working "add series" button', async ({ page }) => {
            await page.getByTestId('admin-dlor-menu-button').click();
            const addSeriesButton = page.getByTestId('admin-dlor-visit-add-series-button');
            await expect(addSeriesButton).toContainText('Add series');
            await addSeriesButton.click();
            await expect(page).toHaveURL(`http://localhost:2020/admin/dlor/series/add?user=${DLOR_ADMIN_USER}`);
        });

        test('has a working "manage series" button', async ({ page }) => {
            await page.getByTestId('admin-dlor-menu-button').click();
            const manageSeriesButton = page.getByTestId('admin-dlor-visit-manage-series-button');
            await expect(manageSeriesButton).toContainText('Manage series');
            await manageSeriesButton.click();
            await expect(page).toHaveURL(`http://localhost:2020/admin/dlor/series/manage?user=${DLOR_ADMIN_USER}`);
        });

        test('has a working "edit an object" button', async ({ page }) => {
            const editButton = page.getByTestId('dlor-homepage-edit-98s0_dy5k3_98h4');
            await editButton.click();
            await expect(page).toHaveURL(
                `http://localhost:2020/admin/dlor/edit/98s0_dy5k3_98h4?user=${DLOR_ADMIN_USER}`,
            );
        });

        test('has breadcrumbs', async ({ page }) => {
            await expect(page.locator('uq-site-header').getByTestId('subsite-title')).toContainText(
                'Digital learning hub admin',
            );
        });

        test('shows a list of objects to manage', async ({ page }) => {
            const list = page.getByTestId('dlor-homepage-list');
            await expect(list.locator('> div')).toHaveCount(gridFromExpectedRowCount());

            // Verify first item
            const firstItem = list.locator('> div').first();
            await expect(firstItem.locator('h2')).toContainText('Accessibility - Digital Essentials');
            await expect(firstItem.locator('svg path').first()).toHaveAttribute(
                'd',
                'M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z',
            );
            await expect(firstItem.locator('div:nth-child(3) p').first()).toContainText('uqldegro');
            await expect(firstItem.locator('div:nth-child(3) p').nth(1)).toContainText('CDS DX Digital Content');

            // Verify third item
            const thirdItem = list.locator('> div').nth(2);
            await expect(thirdItem.locator('h2')).toContainText('UQ has a Blak History');
            await expect(thirdItem.locator('svg path').first()).toHaveAttribute(
                'd',
                'M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z',
            );
            await expect(thirdItem.locator('div:nth-child(3) p').first()).toContainText('uquser1');
            await expect(thirdItem.locator('div:nth-child(3) p').nth(1)).toContainText('CDS DX Digital Content');

            // Verify second item
            const secondItem = list.locator('> div').nth(1);
            await expect(secondItem.locator('h2')).toContainText('Advanced literature searching');
            await expect(secondItem.getByTestId('dlor-homepage-featured-98s0_dy5k3_98h4')).toBeVisible();
            await expect(secondItem.locator('div:nth-child(3) p').first()).toContainText('uqjsmith');
            await expect(secondItem.locator('div:nth-child(3) p').nth(1)).toContainText('Faculty Services Librarians');
        });

        test('pagination works', async ({ page }) => {
            const numPages = 3;
            const numExtraButtons = 4; // first, prev, next, last

            // Verify pagination buttons
            await expect(page.locator('nav[aria-label="pagination navigation"] li').locator('button')).toHaveCount(
                numPages + numExtraButtons,
            );

            // Verify first page is selected
            const firstPageButton = page.locator('nav[aria-label="pagination navigation"] li:nth-child(3) button');
            await expect(firstPageButton).toHaveClass(/Mui-selected/);

            // Verify first item on page
            const list = page.getByTestId('dlor-homepage-list');
            await expect(list.locator('> div:nth-child(1) h2')).toContainText('Accessibility - Digital Essentials');

            // Go to next page
            await page.locator('nav[aria-label="pagination navigation"] li:nth-child(4) button').click();
            await expect(list.locator('button').first()).toBeVisible();
            await expect(list.locator('> div:nth-child(1) h2')).toContainText('Dummy entry to increase list size 3');

            // Go back to first page
            await page.locator('nav[aria-label="pagination navigation"] li:first-child button').click();
        });

        test('can filter on keyword', async ({ page }) => {
            const list = page.getByTestId('dlor-homepage-list');
            await expect(list.locator('> div')).toHaveCount(gridFromExpectedRowCount());
            await expect(list.locator('> div:nth-child(1) h2')).toContainText('Accessibility - Digital Essentials');

            const numExtraButtons = 4; // first, prev, next, last
            const paginationItems = page.locator('nav[aria-label="pagination navigation"] li');
            await expect(paginationItems.locator('button')).toHaveCount(3 + numExtraButtons);

            const keywordInput = page.getByTestId('dlor-homepage-keyword').locator('input');
            // Type partial keyword
            await keywordInput.fill('d');
            await expect(list.locator('> div')).toHaveCount(gridFromExpectedRowCount());
            await expect(list.locator('> div:nth-child(1) h2')).toContainText('Accessibility - Digital Essentials');

            // Filter on keyword in title
            await keywordInput.pressSequentially('ummy');
            await expect(list.locator('> div:nth-child(1) h2')).toContainText('Dummy entry to increase list size A');
            await expect(paginationItems.locator('button')).toHaveCount(2 + numExtraButtons);

            // Clear keyword
            await page.getByTestId('keyword-clear').click();

            // Filter on keyword in description
            await keywordInput.fill('Implications');
            await expect(list.locator('> div:nth-child(1) h2')).toContainText(
                'Artificial Intelligence - Digital Essentials',
            );
            await expect(paginationItems.locator('button')).toHaveCount(1 + numExtraButtons);
            await page.getByTestId('keyword-clear').click();

            // Filter on keyword in summary
            await keywordInput.fill('freeware');
            await expect(list.locator('> div:nth-child(1) h2')).toContainText(
                'Choose the right tool - Digital Essentials',
            );
            await expect(paginationItems.locator('button')).toHaveCount(1 + numExtraButtons);
            await page.getByTestId('keyword-clear').click();

            // Filter on keyword in keyword list
            await keywordInput.fill('ethics');
            await expect(list.locator('> div:nth-child(1) h2')).toContainText(
                'Artificial Intelligence - Digital Essentials',
            );
            await expect(paginationItems.locator('button')).toHaveCount(1 + numExtraButtons);
            await page.getByTestId('keyword-clear').click();
        });

        test('can clear a keyword', async ({ page }) => {
            const list = page.getByTestId('dlor-homepage-list');
            await expect(list.locator('> div')).toHaveCount(gridFromExpectedRowCount());

            await page
                .getByTestId('dlor-homepage-keyword')
                .locator('input')
                .fill('size A');
            await expect(list.locator('> div')).toHaveCount(gridFromExpectedRowCount(1));

            // Clear keyword
            await page.getByTestId('keyword-clear').click();
            await expect(list.locator('> div')).toHaveCount(gridFromExpectedRowCount());
        });

        test('can cancel deletion of an Object', async ({ page }) => {
            // Click delete icon
            await page.getByTestId('dlor-homepage-delete-987y_isjgt_9866').click();

            // Verify delete confirmation dialog
            const deleteDialog = page.getByTestId('dialogbox-dlor-item-delete-confirm');
            await expect(deleteDialog).toContainText('Do you want to delete this object?');

            // Cancel deletion
            await page.getByTestId('cancel-dlor-item-delete-confirm').click();
            await expect(deleteDialog).not.toBeVisible();
        });

        test('can delete an object', async ({ page }) => {
            // Click delete icon
            await page.getByTestId('dlor-homepage-delete-98s0_dy5k3_98h4').click();

            // Verify delete confirmation dialog
            await expect(page.getByTestId('dialogbox-dlor-item-delete-confirm')).toContainText(
                'Do you want to delete this object?',
            );

            // Confirm deletion
            await page.getByTestId('confirm-dlor-item-delete-confirm').click();

            // Verify list reloaded
            await expect(page.locator('[data-testid="dlor-homepage-list"] > div')).toHaveCount(
                gridFromExpectedRowCount(),
            );
        });

        test('can filter objects', async ({ page }) => {
            const numDraft = 1;
            const numPublished = 26;
            const numRejected = 16;
            const numDeprecated = 1;
            const numDeleted = 1;

            const list = page.getByTestId('dlor-homepage-list');
            await expect(list.locator('> div')).toHaveCount(gridFromExpectedRowCount());

            // Verify label counts
            await expect(
                page
                    .getByTestId('checkbox-status-new')
                    .locator('..')
                    .locator('..')
                    .locator('span:nth-child(2)')
                    .getByText(`New/ Draft (${numDraft})`),
            ).toBeVisible();
            await expect(
                page
                    .getByTestId('checkbox-status-current')
                    .locator('..')
                    .locator('..')
                    .locator('span:nth-child(2)')
                    .getByText(`Published (${numPublished})`),
            ).toBeVisible();

            await expect(
                page
                    .getByTestId('checkbox-status-rejected')
                    .locator('..')
                    .locator('span:nth-child(2)')
                    .getByText(`Rejected (${numRejected})`),
            ).toBeVisible();
            await expect(
                page
                    .getByTestId('checkbox-status-deprecated')
                    .locator('..')
                    .locator('..')
                    .locator('span:nth-child(2)')
                    .getByText(`Deprecated (unpublished) (${numDeprecated})`),
            ).toBeVisible();
            await expect(
                page
                    .getByTestId('checkbox-status-deleted')
                    .locator('..')
                    .locator('..')
                    .locator('span:nth-child(2)')
                    .getByText(`Deleted (${numDeleted})`),
            ).toBeVisible();

            // Check "new"
            const newCheckbox = page.locator('[data-testid="checkbox-status-new"] input[type=checkbox]');
            await expect(newCheckbox).not.toBeChecked();
            await newCheckbox.check();
            await expect(list.locator('> div')).toHaveCount(gridFromExpectedRowCount(numPublished + numDraft));

            // Check "rejected"
            const rejectedCheckbox = page.locator('[data-testid="checkbox-status-rejected"] input[type=checkbox]');
            await expect(rejectedCheckbox).not.toBeChecked();
            await rejectedCheckbox.check();
            await expect(list.locator('> div')).toHaveCount(
                gridFromExpectedRowCount(numPublished + numDraft + numRejected),
            );

            // Check "deleted"
            const deletedCheckbox = page.locator('[data-testid="checkbox-status-deleted"] input[type=checkbox]');
            await expect(deletedCheckbox).not.toBeChecked();
            await deletedCheckbox.check();
            await expect(list.locator('> div')).toHaveCount(
                gridFromExpectedRowCount(numPublished + numDraft + numRejected + numDeleted),
            );

            // Check "deprecated"
            const deprecatedCheckbox = page.locator('[data-testid="checkbox-status-deprecated"] input[type=checkbox]');
            await expect(deprecatedCheckbox).not.toBeChecked();
            await deprecatedCheckbox.check();
            await expect(list.locator('> div')).toHaveCount(
                gridFromExpectedRowCount(numPublished + numDraft + numRejected + numDeleted + numDeprecated),
            );

            // Uncheck "published"
            const publishedCheckbox = page.locator('[data-testid="checkbox-status-current"] input[type=checkbox]');
            await expect(publishedCheckbox).toBeChecked();
            await publishedCheckbox.uncheck();
            await expect(list.locator('> div')).toHaveCount(
                gridFromExpectedRowCount(numDraft + numRejected + numDeleted + numDeprecated),
            );

            // Uncheck "deleted"
            await expect(deletedCheckbox).toBeChecked();
            await deletedCheckbox.uncheck();
            await expect(list.locator('> div')).toHaveCount(
                gridFromExpectedRowCount(numDraft + numRejected + numDeprecated),
            );
        });
    });

    test.describe('error handling', () => {
        test('shows an error when list api fails', async ({ page }) => {
            await page.goto(`http://localhost:2020/admin/dlor?user=${DLOR_ADMIN_USER}&responseType=fullListError`);
            await expect(page.getByTestId('dlor-homepage-error')).toContainText(
                'An error has occurred during the request',
            );
        });

        test('deletion failure pops up an error', async ({ page }) => {
            await page.goto(`http://localhost:2020/admin/dlor?user=${DLOR_ADMIN_USER}&responseType=deleteError`);
            await page.setViewportSize({ width: 1300, height: 1000 });

            // Click delete icon
            await page.getByTestId('dlor-homepage-delete-kj5t_8yg4_kj4f').click();

            // Verify delete confirmation dialog
            const deleteDialog = page.getByTestId('dialogbox-dlor-item-delete-confirm');
            await expect(deleteDialog).toContainText('Do you want to delete this object?');

            // Confirm deletion
            await page.getByTestId('confirm-dlor-item-delete-confirm').click();

            // Verify error dialog
            const errorDialog = page.getByTestId('dialogbox-dlor-item-delete-failure-notice');

            // Verify error message
            await expect(errorDialog.getByTestId('message-title')).toContainText(
                'An error occurred deleting the Object',
            );

            // Close dialog
            await page.locator('button[data-testid="confirm-dlor-item-delete-failure-notice"]').click();
            await expect(errorDialog).not.toBeVisible();

            // Verify list reloaded
            await expect(page.locator('[data-testid="dlor-homepage-list"] > div')).toHaveCount(
                gridFromExpectedRowCount(),
            );
        });
    });

    test.describe('user access', () => {
        test('displays an "unauthorised" page to public users', async ({ page }) => {
            await page.goto('http://localhost:2020/admin/dlor?user=public');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.locator('h1').first()).toContainText('Authentication required');
        });

        test('displays an "unauthorised" page to non-authorised users', async ({ page }) => {
            await page.goto('http://localhost:2020/admin/dlor?user=uqstaff');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.locator('h1').first()).toContainText('Permission denied');
        });

        test('displays correct page for admin users (list)', async ({ page }) => {
            await page.goto(`http://localhost:2020/admin/dlor?user=${DLOR_ADMIN_USER}`);
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.locator('h1').first()).toContainText('Digital Learning Hub Management');
        });
    });

    test.describe('DLOR exports', () => {
        test.beforeEach(async ({ page }) => {
            await page.goto(`http://localhost:2020/admin/dlor?user=${DLOR_ADMIN_USER}`);
        });

        test('should trigger a download when the Export Objects to CSV button is clicked', async ({ page }) => {
            await expect(page.getByTestId('dlor-homepage-panel-987y-isjgt-9866')).toBeVisible();

            // Mock the download
            const [download] = await Promise.all([
                page.waitForEvent('download'),
                page.getByTestId('admin-dlor-menu-button').click(),
                page.getByTestId('admin-dlor-export-dlordata-button').click(),
            ]);

            expect(download).toBeTruthy();
        });

        test('should trigger a download when the Export Demographics to CSV button is clicked', async ({ page }) => {
            await expect(page.getByTestId('dlor-homepage-panel-987y-isjgt-9866')).toBeVisible();

            // Mock the download
            const [download] = await Promise.all([
                page.waitForEvent('download'),
                page.getByTestId('admin-dlor-menu-button').click(),
                page.getByTestId('admin-dlor-export-demographicsdata-button').click(),
            ]);

            expect(download).toBeTruthy();
        });

        test('should trigger a download when the Export Favourites to CSV button is clicked', async ({ page }) => {
            await expect(page.getByTestId('dlor-homepage-panel-987y-isjgt-9866')).toBeVisible();

            // Mock the download
            const [download] = await Promise.all([
                page.waitForEvent('download'),
                page.getByTestId('admin-dlor-menu-button').click(),
                page.getByTestId('admin-dlor-export-favourites-button').click(),
            ]);

            expect(download).toBeTruthy();
        });

        test('should handle errors when exporting favourites to CSV fails', async ({ page }) => {
            await page.goto(`http://localhost:2020/admin/dlor?user=${DLOR_ADMIN_USER}&responseType=loadError`);
            await expect(page.getByTestId('dlor-homepage-panel-987y-isjgt-9866')).toBeVisible();

            // Mock console.error
            const consoleErrors = [];
            page.on('console', msg => {
                if (msg.type() === 'error') {
                    consoleErrors.push(msg.text());
                }
            });

            await page.getByTestId('admin-dlor-menu-button').click();
            const exportButton = page.getByTestId('admin-dlor-export-favourites-button');
            await expect(exportButton).toContainText('Export Favourites Data to CSV');
            await exportButton.click();

            // Verify error was logged
            expect(async () =>
                expect(consoleErrors.some(err => err.includes('Failed to export favourites:'))).toBeTruthy(),
            ).toPass();
        });
    });

    test.describe('Favourites', () => {
        test.beforeEach(async ({ page }) => {
            await page.goto('http://localhost:2020/digital-learning-hub/view/9k45_hgr4_876h');
        });

        test('should be able to favourite and unfavourite an object', async ({ page }) => {
            const favoriteStar = page.getByTestId('favorite-star-icon');
            await favoriteStar.click();
            await expect(favoriteStar).not.toBeVisible();

            // Verify tooltip
            await expect(page.locator('.MuiTooltip-tooltip')).toContainText('Add to Favourites');

            await page.waitForTimeout(1000);

            const favoriteOutline = page.getByTestId('favorite-star-outline-icon');
            await expect(favoriteOutline).toBeVisible();
            await favoriteOutline.click();
            await expect(favoriteStar).toBeVisible();
            await expect(page.locator('.MuiTooltip-tooltip')).toContainText('Remove from Favourites');
        });
    });

    test.describe('Object Restrictions', () => {
        test('Restrictions for UQ Staff only', async ({ page }) => {
            await page.goto('http://localhost:2020/digital-learning-hub/?user=uqsfc');
            await page.locator('.MuiPagination-ul > :nth-child(5)').click();

            const restrictedObject = page.getByText('Staff Restricted Object').locator('../../..');
            await expect(restrictedObject).toContainText('You need to be UQ staff to view this object');

            await page.goto('http://localhost:2020/digital-learning-hub/?user=uqstaff');
            await page.locator('.MuiPagination-ul > :nth-child(5)').click();
            await expect(page.locator('text=Staff Restricted Object')).toBeVisible();
        });

        test('Restrictions for library Staff only', async ({ page }) => {
            await page.goto('http://localhost:2020/digital-learning-hub/?user=uqsfc');
            await page.locator('.MuiPagination-ul > :nth-child(5)').click();
            await expect(page.locator('text=Staff (library) Restricted Object')).not.toBeVisible();

            await page.goto('http://localhost:2020/digital-learning-hub/?user=uqstaff');
            await page.locator('.MuiPagination-ul > :nth-child(5)').click();
            await expect(page.locator('text=Staff (library) Restricted Object')).toBeVisible();
        });

        test('Restrictions for UQ only', async ({ page }) => {
            await page.goto('http://localhost:2020/digital-learning-hub/?user=vanilla');
            await page.locator('.MuiPagination-ul > :nth-child(5)').click();
            await expect(page.locator('text=UQ Only Restricted Object')).toBeVisible();

            await page.goto('http://localhost:2020/digital-learning-hub/?user=uqstaff');
            await page.locator('.MuiPagination-ul > :nth-child(5)').click();
            await expect(page.locator('text=UQ Only Restricted Object')).toBeVisible();

            await page.goto('http://localhost:2020/digital-learning-hub/?user=public');
            await page.locator('.MuiPagination-ul > :nth-child(5)').click();

            const restrictedObject = page.getByText('UQ Only Restricted Object').locator('../../..');
            await expect(restrictedObject).toContainText(
                'You need to be a UQ staff or student user to view this object',
            );
        });
    });
});
