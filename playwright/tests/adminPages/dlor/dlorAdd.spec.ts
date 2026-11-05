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

    // test.describe('successfully mock to db', () => {
    //             test.beforeEach(async ({ page, context }) => {
    //                 await context.addCookies([
    //                     {
    //                         name: 'CYPRESS_TEST_DATA',
    //                         value: 'active',
    //                         url: 'http://localhost:2020',
    //                     },
    //                 ]);
    //                 await page.goto(`http://localhost:2020/admin/dlor/add?user=${DLOR_ADMIN_USER}`);
    //                 await page.setViewportSize({ width: 1300, height: 1000 });
    //             });
    //
    // test('with file', async ({ page }) => {
    //     await page.goto(
    //         `http://localhost:2020/admin/dlor/add?user=${DLOR_ADMIN_USER}&responseBody[presigned]=s3.amazonaws.com/object/123/image.png`,
    //     );
    //     await assertDlorFormSubmittedData(page, async () => {
    //         // go to the second panel, Description
    //         await page.getByTestId('dlor-form-next-button').click();
    //
    //         await page
    //             .locator('[data-testid="object-title"] input')
    //             .fill('x'.padEnd(REQUIRED_LENGTH_TITLE, 'x'));
    //         await typeRichTextEditor(page, 'new description'.padEnd(REQUIRED_LENGTH_DESCRIPTION, 'x'));
    //         await page
    //             .locator('[data-testid="object-summary"] textarea:first-child')
    //             .fill('new summary '.padEnd(REQUIRED_LENGTH_SUMMARY, 'x'));
    //
    //         // go to the third panel, Link
    //         await page.getByTestId('dlor-form-next-button').click();
    //
    //         // file upload
    //         // invalid file
    //         await assertHasLinkFileTabError(page);
    //         await selectFileForUpload(page, notAllowedFile);
    //         await expect(page.getByTestId('dlor-form-new-object-file-warning')).not.toBeVisible();
    //         await expect(page.getByTestId('dlor-object-file-list-filename')).not.toBeVisible();
    //         await assertHasLinkFileTabError(page);
    //         // valid file
    //         await selectFileForUpload(page, image);
    //         await assertMissingLinkFileTabError(page);
    //         await expect(page.getByTestId('dlor-form-new-object-file-warning')).toBeVisible();
    //         await expect(page.getByTestId('dlor-object-file-list-filename')).toHaveText(`${image.name} 1 KB`);
    //         // clear
    //         await page.getByTestId('dlor-object-file-list-clear').click();
    //         await assertHasLinkFileTabError(page);
    //         await expect(page.getByTestId('dlor-form-new-object-file-warning')).not.toBeVisible();
    //         await expect(page.getByTestId('dlor-object-file-list-filename')).not.toBeVisible();
    //         // re-add
    //         await selectFileForUpload(page, image);
    //         await assertMissingLinkFileTabError(page);
    //         await expect(page.getByTestId('dlor-form-new-object-file-warning')).toBeVisible();
    //         await expect(page.getByTestId('dlor-object-file-list-filename')).toHaveText(`${image.name} 1 KB`);
    //
    //         // go to the fourth panel, Filtering
    //         await page.getByTestId('dlor-form-next-button').click();
    //
    //         await page
    //             .locator('[data-testid="filter-topic-aboriginal-and-torres-strait-islander"] input')
    //             .check();
    //         await page.locator('[data-testid="filter-media-format-h5p"] input').check();
    //         await page.locator('[data-testid="filter-subject-business-economics"] input').check();
    //         await page.locator('[data-testid="filter-item-type-interactive"] input').check();
    //         await page
    //             .locator('[data-testid="filter-licence-cc-by-nc-attribution-noncommercial"] input')
    //             .check();
    //         // select a keyword so we can save
    //         await page.locator("[data-testid='fuzzy-search-input'] input").fill('test');
    //         await page.locator('#fuzzy-search-option-3').click();
    //
    //         // save new dlor
    //         await page.getByTestId('admin-dlor-save-button-submit').click();
    //         // assert progress message
    //         await page.getByText(`Uploading file ${image.name}`);
    //
    //         // confirm save happened
    //         await expect(
    //             page
    //                 .locator('[data-testid="dialogbox-dlor-save-outcome"] h2')
    //                 .getByText('The object has been created'),
    //         ).toBeVisible();
    //         await expect(
    //             page.getByTestId('confirm-dlor-save-outcome').getByText('Return to list page'),
    //         ).toBeVisible();
    //         await expect(
    //             page.getByTestId('cancel-dlor-save-outcome').getByText('Add another Object'),
    //         ).toBeVisible();
    //         await expect(
    //             page.getByText('Please expect a delay before newly uploaded files are fully processed'),
    //         ).toBeVisible();
    //
    //         return {
    //             object_title: 'xxxxxxxx',
    //             object_description:
    //                 '<p>new descriptionxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</p>',
    //             object_summary: 'new summary xxxxxxxx',
    //             object_link_interaction_type: 'none',
    //             object_link_url: '',
    //             object_download_instructions: 'Add this object to your course.',
    //             object_is_featured: 0,
    //             object_cultural_advice: 0,
    //             object_publishing_user: 'dloradmn',
    //             object_review_date_next: '2025-03-26T00:01',
    //             object_status: 'new',
    //             object_restrict_to: 'none',
    //             object_owning_team_id: 1,
    //             object_keywords: ['Research Skills'],
    //             object_keyword_ids: [3],
    //             facets: [
    //                 1, // aboriginal_and_torres_strait_islander
    //                 24, // media_h5p
    //                 35, // business_economics
    //                 17, // type_interactive_activity
    //                 45, // cc_by_nc_attribution_noncommercial
    //             ],
    //             newFile: {
    //                 path: './image.gif',
    //                 relativePath: './image.gif',
    //             },
    //         };
    //     });
    // });
    // test.describe('fails correctly', () => {
    //     test.describe('with file', () => {
    //         const runTest = async (page: Page, context: BrowserContext, uriSuffix: string = '') => {
    //             await page.goto(`http://localhost:2020/admin/dlor/add?user=${DLOR_ADMIN_USER}&${uriSuffix}`);
    //             await page.setViewportSize({ width: 1300, height: 1000 });
    //
    //             // go to the second panel, Description
    //             await page.getByTestId('dlor-form-next-button').click();
    //
    //             await page
    //                 .locator('[data-testid="object-title"] input')
    //                 .fill('x'.padEnd(REQUIRED_LENGTH_TITLE, 'x'));
    //             await typeRichTextEditor(page, 'new description'.padEnd(REQUIRED_LENGTH_DESCRIPTION, 'x'));
    //             await page
    //                 .locator('[data-testid="object-summary"] textarea:first-child')
    //                 .fill('new summary '.padEnd(REQUIRED_LENGTH_SUMMARY, 'x'));
    //
    //             // go to the third panel, Link
    //             await page.getByTestId('dlor-form-next-button').click();
    //
    //             // file upload
    //             // invalid file
    //             await assertHasLinkFileTabError(page);
    //             await selectFileForUpload(page, notAllowedFile);
    //             await expect(page.getByTestId('dlor-object-file-list-filename')).not.toBeVisible();
    //             await assertHasLinkFileTabError(page);
    //             // valid file
    //             await selectFileForUpload(page, image);
    //             await expect(page.getByTestId('dlor-object-file-list-filename')).toHaveText(`${image.name} 1 KB`);
    //             await assertMissingLinkFileTabError(page);
    //
    //             // go to the fourth panel, Filtering
    //             await page.getByTestId('dlor-form-next-button').click();
    //
    //             await page
    //                 .locator('[data-testid="filter-topic-aboriginal-and-torres-strait-islander"] input')
    //                 .check();
    //             await page.locator('[data-testid="filter-media-format-h5p"] input').check();
    //             await page.locator('[data-testid="filter-subject-business-economics"] input').check();
    //             await page.locator('[data-testid="filter-item-type-interactive"] input').check();
    //             await page
    //                 .locator('[data-testid="filter-licence-cc-by-nc-attribution-noncommercial"] input')
    //                 .check();
    //             // select a keyword so we can save
    //             await page.locator("[data-testid='fuzzy-search-input'] input").fill('test');
    //             await page.locator('#fuzzy-search-option-3').click();
    //
    //             // save new dlor
    //             await page.getByTestId('admin-dlor-save-button-submit').click();
    //             // assert progress message
    //             await expect(page.getByText(`Uploading file ${image.name}`)).toBeVisible();
    //             // assert error message
    //             await expect(page.getByText(`Error while uploading file ${image.name}`)).toBeVisible();
    //             // should not display message about file upload
    //             await expect(
    //                 page.getByText('Please expect a delay before newly uploaded files are fully processed'),
    //             ).not.toBeVisible();
    //         };
    //
    //         test('pre-signed url failure', async ({ page, context }) => {
    //             await runTest(page, context, 'responseStatus[presigned]=500');
    //         });
    //
    //         test('S3 failure', async ({ page, context }) => {
    //             await runTest(
    //                 page,
    //                 context,
    //                 'responseBody[presigned]=s3.amazonaws.com/object/123/image.png&responseStatus[s3]=500',
    //             );
    //         });
    //     });
});
