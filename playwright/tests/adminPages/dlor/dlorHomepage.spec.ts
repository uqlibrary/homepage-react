import { test, expect, Page } from '@uq/pw/test';
import { DLOR_ADMIN_USER } from '@uq/pw/lib/constants';
import { assertAccessibility } from '@uq/pw/lib/axe';

test.describe('Digital Learning Hub admin homepage', () => {
    test.beforeEach(async ({}, testInfo) => {
        test.setTimeout(testInfo.timeout + 30_000);
    });

    const itemsPerPage = 10; // matches value in DLOAdminHomepage
    const gridFromExpectedRowCount = (expected = 23) => (expected > itemsPerPage ? itemsPerPage : expected);
    test.describe('homepage', () => {
        test.beforeEach(async ({ page }) => {
            await page.goto(`http://localhost:2020/admin/dlor?user=${DLOR_ADMIN_USER}`);
            await page.setViewportSize({ width: 1300, height: 1000 });
        });
        test('is accessible', async ({ page }) => {
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(
                page
                    .locator('h1')
                    .first()
                    .getByText('Digital Learning Hub Management'),
            ).toBeVisible();
            await assertAccessibility(page, '[data-testid="StandardPage"]', { disabledRules: ['button-name'] });
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
            await expect(
                page
                    .locator('uq-site-header')
                    .getByTestId('subsite-title')
                    .getByText('Digital learning hub admin'),
            ).toBeVisible();
        });
        test('shows a list of objects to manage', async ({ page }) => {
            const list = page.getByTestId('dlor-homepage-list');
            await expect(list.locator('> div')).toHaveCount(gridFromExpectedRowCount());

            // sorts properly ('UQ has a Blak History' moves from position 3 to 2)
            const firstItem = list.locator('> div').first();
            await expect(firstItem.locator('h2').getByText('Accessibility - Digital Essentials')).toBeVisible();
            await expect(firstItem.locator('svg path').first()).toHaveAttribute(
                'd',
                'M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z',
            ); // has green tick
            await expect(
                firstItem
                    .locator('div:nth-child(3) p')
                    .first()
                    .getByText('uqldegro'),
            ).toBeVisible();
            await expect(
                firstItem
                    .locator('div:nth-child(3) p')
                    .nth(1)
                    .getByText('CDS DX Digital Content'),
            ).toBeVisible();

            const thirdItem = list.locator('> div').nth(2);
            await expect(thirdItem.locator('h2').getByText('UQ has a Blak History')).toBeVisible();
            await expect(thirdItem.locator('svg path').first()).toHaveAttribute(
                'd',
                'M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z',
            ); // has green tick
            await expect(
                thirdItem
                    .locator('div:nth-child(3) p')
                    .first()
                    .getByText('uquser1'),
            ).toBeVisible();
            await expect(
                thirdItem
                    .locator('div:nth-child(3) p')
                    .nth(1)
                    .getByText('CDS DX Digital Content'),
            ).toBeVisible();

            const secondItem = list.locator('> div').nth(1);
            await expect(secondItem.locator('h2').getByText('Advanced literature searching')).toBeVisible();
            await expect(secondItem.getByTestId('dlor-homepage-featured-98s0_dy5k3_98h4')).toBeVisible();
            await expect(
                secondItem
                    .locator('div:nth-child(3) p')
                    .first()
                    .getByText('uqjsmith'),
            ).toBeVisible();
            await expect(
                secondItem
                    .locator('div:nth-child(3) p')
                    .nth(1)
                    .getByText('Faculty Services Librarians'),
            ).toBeVisible();
        });

        test('pagination works', async ({ page }) => {
            // no data-testids in pagination :(

            const numPages = 3;
            const numExtraButtons = 4; // first, prev, next, last
            // there are the expected number of buttons in pagination widget
            await expect(page.locator('nav[aria-label="pagination navigation"] li').locator('button')).toHaveCount(
                numPages + numExtraButtons,
            );

            // button 1 has focus
            const firstPageButton = page.locator('nav[aria-label="pagination navigation"] li:nth-child(3) button');
            await expect(firstPageButton).toHaveClass(/Mui-selected/);

            // the displayed entries are what is expected
            const list = page.getByTestId('dlor-homepage-list');
            await expect(
                list.locator('> div:nth-child(1) h2').getByText('Accessibility - Digital Essentials'),
            ).toBeVisible();

            // click pagination for next page
            await page.locator('nav[aria-label="pagination navigation"] li:nth-child(4) button').click();

            // the displayed entries have updated
            await expect(list.locator('button').first()).toBeVisible();
            await expect(
                list.locator('> div:nth-child(1) h2').getByText('Dummy entry to increase list size 3'),
            ).toBeVisible();

            // click pagination to go to first page
            await page.locator('nav[aria-label="pagination navigation"] li:first-child button').click();
        });

        test('can filter on keyword', async ({ page }) => {
            const numExtraButtons = 4; // first, prev, next, last
            const listLocator = page.getByTestId('dlor-homepage-list');
            const firstItemTitle = listLocator.locator('> div:nth-child(1) h2');
            const keywordInput = page.getByTestId('dlor-homepage-keyword').locator('input');
            const clearKeywordButton = page.getByTestId('keyword-clear');
            const paginationItems = page.locator('nav[aria-label="pagination navigation"] li');

            // Initial state verification
            await expect(listLocator.locator('> div')).toHaveCount(gridFromExpectedRowCount());
            await expect(firstItemTitle).toContainText('Accessibility - Digital Essentials');
            await expect(paginationItems.locator('> *')).toHaveCount(3 + numExtraButtons);

            // Test filtering with single character (shouldn't change results)
            await keywordInput.fill('d');
            await expect(listLocator.locator('> div')).toHaveCount(gridFromExpectedRowCount());
            await expect(firstItemTitle).toContainText('Accessibility - Digital Essentials');

            // Filter on keyword in title
            await keywordInput.focus();
            await keywordInput.pressSequentially('ummy');
            await expect(firstItemTitle).toContainText('Dummy entry to increase list size A');
            await expect(paginationItems.locator('> *')).toHaveCount(2 + numExtraButtons); // now only 2 pages

            // Clear keyword filter
            await clearKeywordButton.click();
            await expect(listLocator.locator('> div')).toHaveCount(gridFromExpectedRowCount());

            // Filter on keyword in description
            await keywordInput.fill('Implications');
            await expect(firstItemTitle).toContainText('Artificial Intelligence - Digital Essentials');
            await expect(paginationItems.locator('> *')).toHaveCount(1 + numExtraButtons); // now only 1 page

            // Clear keyword filter
            await clearKeywordButton.click();
            await expect(listLocator.locator('> div')).toHaveCount(gridFromExpectedRowCount());

            // Filter on keyword in summary
            await keywordInput.fill('freeware');
            await expect(firstItemTitle).toContainText('Choose the right tool - Digital Essentials');
            await expect(paginationItems.locator('> *')).toHaveCount(1 + numExtraButtons); // now only 1 page

            // Clear keyword filter
            await clearKeywordButton.click();
            await expect(listLocator.locator('> div')).toHaveCount(gridFromExpectedRowCount());

            // Filter on keyword in keyword list
            await keywordInput.fill('ethics');
            await expect(firstItemTitle).toContainText('Artificial Intelligence - Digital Essentials');
            await expect(paginationItems.locator('> *')).toHaveCount(1 + numExtraButtons); // now only 1 page

            // Clear keyword filter
            await clearKeywordButton.click();
            await expect(listLocator.locator('> div')).toHaveCount(gridFromExpectedRowCount());
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
            await expect(
                page.getByTestId('dialogbox-dlor-item-delete-confirm').getByText('Do you want to delete this object?'),
            ).toBeVisible();

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
            await expect(
                page.getByTestId('dlor-homepage-error').getByText('An error has occurred during the request'),
            ).toBeVisible();
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
            await expect(
                errorDialog.getByTestId('message-title').getByText('An error occurred deleting the Object'),
            ).toBeVisible();

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
            await expect(
                page
                    .locator('h1')
                    .first()
                    .getByText('Authentication required'),
            ).toBeVisible();
        });

        test('displays an "unauthorised" page to non-authorised users', async ({ page }) => {
            await page.goto('http://localhost:2020/admin/dlor?user=uqstaff');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(
                page
                    .locator('h1')
                    .first()
                    .getByText('Permission denied'),
            ).toBeVisible();
        });

        test('displays correct page for admin users (list)', async ({ page }) => {
            await page.goto(`http://localhost:2020/admin/dlor?user=${DLOR_ADMIN_USER}`);
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(
                page
                    .locator('h1')
                    .first()
                    .getByText('Digital Learning Hub Management'),
            ).toBeVisible();
        });
    });

    test.describe('DLOR exports', () => {
        const assertDownload = async (page: Page, callback: () => Promise<void>) => {
            await expect
                .poll(
                    async () => {
                        try {
                            const downloadPromise = page.waitForEvent('download', { timeout: 30_000 });
                            await page.locator('body').click();
                            await callback();
                            const download = await downloadPromise;
                            return download?.suggestedFilename() || null;
                        } catch (err) {
                            if (err instanceof Error && (/download/.test(err.message) || /Timeout/.test(err.message))) {
                                return null;
                            }
                            throw err; // rethrow unexpected errors
                        }
                    },
                    { timeout: 30_000, intervals: [1000] },
                )
                .not.toBeNull();
        };

        test.beforeEach(async ({ page }) => {
            await page.goto(`http://localhost:2020/admin/dlor?user=${DLOR_ADMIN_USER}`);
        });

        test('should trigger a download when the Export Objects to CSV button is clicked', async ({ page }) => {
            await expect(page.getByTestId('dlor-homepage-panel-987y-isjgt-9866')).toBeVisible();
            await assertDownload(page, async () => {
                await page.getByTestId('admin-dlor-menu-button').click({ timeout: 2000 });
                await page.getByTestId('admin-dlor-export-dlordata-button').click({ timeout: 2000 });
            });
        });

        test('should trigger a download when the Export Demographics to CSV button is clicked', async ({ page }) => {
            await expect(page.getByTestId('dlor-homepage-panel-987y-isjgt-9866')).toBeVisible();
            await assertDownload(page, async () => {
                await page.getByTestId('admin-dlor-menu-button').click({ timeout: 2000 });
                await page.getByTestId('admin-dlor-export-demographicsdata-button').click({ timeout: 2000 });
            });
        });

        test('should trigger a download when the Export Favourites to CSV button is clicked', async ({ page }) => {
            await expect(page.getByTestId('dlor-homepage-panel-987y-isjgt-9866')).toBeVisible();
            await assertDownload(page, async () => {
                await page.getByTestId('admin-dlor-menu-button').click({ timeout: 2000 });
                await page.getByTestId('admin-dlor-export-favourites-button').click({ timeout: 2000 });
            });
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
            await expect(async () =>
                expect(consoleErrors.some(err => err.includes('Failed to export favourites:'))).toBeTruthy(),
            ).toPass();
        });
    });

    test.describe('Favourites', () => {
        test.beforeEach(async ({ page }) => {
            await page.goto('http://localhost:2020/digital-learning-hub/view/9k45_hgr4_876h');
        });

        test('should be able to favourite and unfavourite an object', async ({ page }) => {
            const addToFavoriteButton = page.getByTestId('favorite-star-outline-icon');
            const removeFromFavoriteButton = page.getByTestId('favorite-star-icon');

            await removeFromFavoriteButton.click();
            await expect(removeFromFavoriteButton).not.toBeVisible();
            // Verify tooltip
            await addToFavoriteButton.hover();
            await expect(page.locator('.MuiTooltip-tooltip').getByText('Add to Favourites')).toBeVisible();

            await expect(async () => {
                if (await addToFavoriteButton.isVisible()) {
                    await addToFavoriteButton.click({ timeout: 2000 });
                    await expect(removeFromFavoriteButton).toBeVisible({ timeout: 2000 });
                    return;
                }
                if (await removeFromFavoriteButton.isVisible()) {
                    await removeFromFavoriteButton.click({ timeout: 2000 });
                }
            }).toPass();

            // Verify tooltip
            await removeFromFavoriteButton.hover();
            await expect(page.locator('.MuiTooltip-tooltip').getByText('Remove from Favourites')).toBeVisible();
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
