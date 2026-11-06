import moment from 'moment-timezone';
import { BrowserContext, Page } from '@playwright/test';

import { expect, test } from '@uq/pw/test';
import { DLOR_ADMIN_USER } from '@uq/pw/lib/constants';
import { typeRichTextEditor } from '@uq/pw/lib/richTextEditor';
import {
    assertDlorFormSubmittedData,
    assertHasLinkFileTabError,
    assertMissingLinkFileTabError,
    createFileMock,
    selectFileForUpload,
} from '@uq/pw/tests/adminPages/dlor/helpers';

/* -------------------------------------------------------------------------- */
/* Constants                                                                  */
/* -------------------------------------------------------------------------- */

const BASE_URL = 'http://localhost:2020';
const PAGE_VIEWPORT = { width: 1300, height: 1000 };
const EDIT_OBJECT_ID = '987y_isjgt_9866';
const PRESIGNED_URL = 's3.amazonaws.com/object/123/image.png';

const REQUIRED_LENGTH_TITLE = 8;
const REQUIRED_LENGTH_DESCRIPTION = 100;
const REQUIRED_LENGTH_SUMMARY = 20;

const FILE_PROCESSING_NOTICE = 'Please expect a delay before newly uploaded files are fully processed';

const notAllowedFile = createFileMock('app.bin', 'application/octet-stream');
const image = createFileMock('image.gif', 'image/png', 'a'.repeat(1000));
const newFilePayload = { path: './image.gif', relativePath: './image.gif' };

/* -------------------------------------------------------------------------- */
/* Expected payloads                                                          */
/* -------------------------------------------------------------------------- */

// fields shared by every edit of the mocked "Accessibility" object
const existingObjectBase = {
    object_title: 'Accessibility - Digital Essentials (has Youtube link)',
    object_description:
        '<p>Understanding the importance of accessibility online and creating accessible content with a longer first line. Ramble a little.</p><p>and a second line of detail in the description</p>',
    object_summary: 'Understanding the importance of accessibility online and creating accessible content.',
    object_owning_team_id: 1,
    object_publishing_user: 'uqldegro',
    object_status: 'current',
    object_restrict_to: 'none',
    object_is_featured: 1,
    object_cultural_advice: 0,
    notificationText: '',
    team_name: 'LIB DX Digital Content',
    team_manager: 'John Smith',
    team_email: 'dlor@library.uq.edu.au',
    facets: [3, 11, 14, 18, 30, 34, 45],
    object_keywords: ['accessible content', 'study hacks', 'universal design'],
};

// object that has a link (no file)
const existingObjectLinkFields = {
    object_link_url: 'https://www.youtube.com/watch?v=jwKH6X3cGMg',
    object_download_instructions:
        "<p>Download the Common Cartridge file and H5P quiz to embed in Blackboard.</p><p>and a second line of detail in the description, looking at an <a href='http://example.com'>example link</a></p>",
    object_link_interaction_type: 'view',
    object_link_file_type: 'video',
    object_link_size: 2864,
};

// object that has a file (link fields cleared)
const existingObjectFileFields = {
    object_link_url: null,
    object_download_instructions: 'Add this object to your course.',
    object_link_interaction_type: 'none',
};

// mocked getDlorObject response for an object that has a file
const existingFileOverwrites = (fileName: string) => ({
    object_review_date_next: moment().format('YYYY-MM-DD'),
    object_file_name: fileName,
    object_file_size: 1000,
    object_download_instructions: null,
    object_link_url: null,
    object_link_interaction_type: null,
    object_link_file_type: null,
    object_link_size: null,
});

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const LINK_FIELD_TEST_IDS = [
    'object-link-url',
    'object-link-interaction-type',
    'object-link-file-type',
    'object-link-duration-minutes',
    'object-link-duration-seconds',
];

const enableMockData = (context: BrowserContext) =>
    context.addCookies([{ name: 'CYPRESS_TEST_DATA', value: 'active', url: BASE_URL }]);

const addUrl = (params = '') => `${BASE_URL}/admin/dlor/add?user=${DLOR_ADMIN_USER}${params ? `&${params}` : ''}`;

const editUrl = (overwrites: object, params = '') =>
    `${BASE_URL}/admin/dlor/edit/${EDIT_OBJECT_ID}?user=${DLOR_ADMIN_USER}&responseBody[getDlorObject]=${JSON.stringify(overwrites)}${params ? `&${params}` : ''}`;

const nextPanel = async (page: Page, times = 1) => {
    for (let i = 0; i < times; i++) {
        await page.getByTestId('dlor-form-next-button').click();
    }
};

const save = (page: Page) => page.getByTestId('admin-dlor-save-button-submit').click();

// add form, panel 2 (Description)
const fillDescriptionPanel = async (page: Page) => {
    await page.locator('[data-testid="object-title"] input').fill('x'.padEnd(REQUIRED_LENGTH_TITLE, 'x'));
    await typeRichTextEditor(page, 'new description'.padEnd(REQUIRED_LENGTH_DESCRIPTION, 'x'));
    await page
        .locator('[data-testid="object-summary"] textarea:first-child')
        .fill('new summary '.padEnd(REQUIRED_LENGTH_SUMMARY, 'x'));
};

// add form, panel 4 (Filtering)
const fillFilteringPanel = async (page: Page) => {
    await page.locator('[data-testid="filter-topic-aboriginal-and-torres-strait-islander"] input').check();
    await page.locator('[data-testid="filter-media-format-h5p"] input').check();
    await page.locator('[data-testid="filter-subject-business-economics"] input').check();
    await page.locator('[data-testid="filter-item-type-interactive"] input').check();
    await page.locator('[data-testid="filter-licence-cc-by-nc-attribution-noncommercial"] input').check();
    // a keyword is required to save
    await page.locator("[data-testid='fuzzy-search-input'] input").fill('test');
    await page.locator('#fuzzy-search-option-3').click();
};

const assertLinkFieldsState = async (page: Page, state: 'enabled' | 'disabled') => {
    for (const testId of LINK_FIELD_TEST_IDS) {
        const input = page.getByTestId(testId).locator('input');
        await (state === 'enabled' ? expect(input).toBeEnabled() : expect(input).toBeDisabled());
    }
};

const assertFileListed = async (page: Page, fileName: string) =>
    expect(page.getByTestId('dlor-object-file-list-filename')).toHaveText(`${fileName} 1 KB`);

const assertFileNotListed = async (page: Page) =>
    expect(page.getByTestId('dlor-object-file-list-filename')).not.toBeVisible();

const assertSaveOutcome = async (
    page: Page,
    { title, confirm, cancel, fileNotice }: { title: string; confirm: string; cancel: string; fileNotice?: boolean },
) => {
    await expect(page.locator('[data-testid="dialogbox-dlor-save-outcome"] h2').getByText(title)).toBeVisible();
    await expect(page.getByTestId('confirm-dlor-save-outcome').getByText(confirm)).toBeVisible();
    await expect(page.getByTestId('cancel-dlor-save-outcome').getByText(cancel)).toBeVisible();
    if (fileNotice === true) {
        await expect(page.getByText(FILE_PROCESSING_NOTICE)).toBeVisible();
    } else if (fileNotice === false) {
        await expect(page.getByText(FILE_PROCESSING_NOTICE)).not.toBeVisible();
    }
};

const assertEditSaved = (page: Page, fileNotice?: boolean) =>
    assertSaveOutcome(page, {
        title: 'Changes have been saved',
        confirm: 'View Object',
        cancel: 'Re-edit Object',
        fileNotice,
    });

const assertProgressThenError = async (page: Page, progress: string, error: string) => {
    await expect(page.getByText(progress)).toBeVisible();
    await expect(page.getByText(error)).toBeVisible();
    await expect(page.getByText(FILE_PROCESSING_NOTICE)).not.toBeVisible();
};

const assertUploadFailure = (page: Page) =>
    assertProgressThenError(page, `Uploading file ${image.name}`, `Error while uploading file ${image.name}`);

/* -------------------------------------------------------------------------- */
/* Tests                                                                      */
/* -------------------------------------------------------------------------- */
test.describe('object file', () => {
    test.describe('add object with file', () => {
        test('successfully', async ({ page, context }) => {
            await enableMockData(context);
            await page.setViewportSize(PAGE_VIEWPORT);
            await page.goto(addUrl(`responseBody[presigned]=${PRESIGNED_URL}`));

            await assertDlorFormSubmittedData(page, async () => {
                // panel 2: Description
                await nextPanel(page);
                await fillDescriptionPanel(page);

                // panel 3: Link
                await nextPanel(page);

                // invalid file
                await assertHasLinkFileTabError(page);
                await selectFileForUpload(page, notAllowedFile);
                await expect(page.getByTestId('dlor-form-new-object-file-warning')).not.toBeVisible();
                await assertFileNotListed(page);
                await assertHasLinkFileTabError(page);

                // valid file
                await selectFileForUpload(page, image);
                await assertMissingLinkFileTabError(page);
                await expect(page.getByTestId('dlor-form-new-object-file-warning')).toBeVisible();
                await assertFileListed(page, image.name);

                // clear
                await page.getByTestId('dlor-object-file-list-clear').click();
                await assertHasLinkFileTabError(page);
                await expect(page.getByTestId('dlor-form-new-object-file-warning')).not.toBeVisible();
                await assertFileNotListed(page);

                // re-add
                await selectFileForUpload(page, image);
                await assertMissingLinkFileTabError(page);
                await expect(page.getByTestId('dlor-form-new-object-file-warning')).toBeVisible();
                await assertFileListed(page, image.name);

                // panel 4: Filtering
                await nextPanel(page);
                await fillFilteringPanel(page);

                await save(page);
                await assertSaveOutcome(page, {
                    title: 'The object has been created',
                    confirm: 'Return to list page',
                    cancel: 'Add another Object',
                    fileNotice: true,
                });

                return {
                    object_title: 'xxxxxxxx',
                    object_description:
                        '<p>new descriptionxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</p>',
                    object_summary: 'new summary xxxxxxxx',
                    object_link_interaction_type: 'none',
                    object_link_url: '',
                    object_download_instructions: 'Add this object to your course.',
                    object_is_featured: 0,
                    object_cultural_advice: 0,
                    object_publishing_user: 'dloradmn',
                    object_review_date_next: '2025-03-26T00:01',
                    object_status: 'new',
                    object_restrict_to: 'none',
                    object_owning_team_id: 1,
                    object_keywords: ['Research Skills'],
                    object_keyword_ids: [3],
                    facets: [
                        1, // aboriginal_and_torres_strait_islander
                        24, // media_h5p
                        35, // business_economics
                        17, // type_interactive_activity
                        45, // cc_by_nc_attribution_noncommercial
                    ],
                    newFile: newFilePayload,
                };
            });
        });

        test.describe('error handling', () => {
            const runTest = async (page: Page, params: string) => {
                await page.setViewportSize(PAGE_VIEWPORT);
                await page.goto(addUrl(params));

                await nextPanel(page);
                await fillDescriptionPanel(page);

                await nextPanel(page);
                await assertHasLinkFileTabError(page);
                await selectFileForUpload(page, notAllowedFile);
                await assertFileNotListed(page);
                await assertHasLinkFileTabError(page);
                await selectFileForUpload(page, image);
                await assertFileListed(page, image.name);
                await assertMissingLinkFileTabError(page);

                await nextPanel(page);
                await fillFilteringPanel(page);
                await save(page);

                await assertUploadFailure(page);
            };

            test('pre-signed url error', async ({ page }) => {
                await runTest(page, 'responseStatus[presigned]=500');
            });

            test('S3 error', async ({ page }) => {
                await runTest(page, `responseBody[presigned]=${PRESIGNED_URL}&responseStatus[s3]=500`);
            });
        });
    });

    test.describe('update object', () => {
        test.describe('with file', () => {
            test.beforeEach(async ({ context }) => {
                await enableMockData(context);
            });

            test('add file', async ({ page }) => {
                const overwrites = { object_review_date_next: moment().format('YYYY-MM-DD') };
                await page.goto(editUrl(overwrites, `responseBody[presigned]=${PRESIGNED_URL}`));

                await assertDlorFormSubmittedData(page, async () => {
                    // panel 3: Link
                    await nextPanel(page, 2);

                    await assertLinkFieldsState(page, 'enabled');
                    await selectFileForUpload(page, image);
                    await assertLinkFieldsState(page, 'disabled');

                    // panel 4: Filtering
                    await nextPanel(page);
                    await save(page);
                    await assertEditSaved(page, true);

                    return { ...existingObjectBase, ...existingObjectLinkFields, newFile: newFilePayload };
                });
            });

            test('delete file', async ({ page }) => {
                const overwrites = {
                    object_review_date_next: moment().format('YYYY-MM-DD'),
                    object_file_name: image.name,
                    object_file_size: 1000,
                };
                await page.goto(editUrl(overwrites));

                await assertDlorFormSubmittedData(page, async () => {
                    // panel 3: Link
                    await nextPanel(page, 2);

                    await assertLinkFieldsState(page, 'disabled');
                    await assertFileListed(page, image.name);

                    // remove existing file
                    await page.getByTestId('dlor-object-file-list-clear').click();
                    await assertFileNotListed(page);
                    await assertLinkFieldsState(page, 'enabled');

                    // panel 4: Filtering
                    await nextPanel(page);
                    await save(page);
                    await assertEditSaved(page, false);

                    return { ...existingObjectBase, ...existingObjectLinkFields, deleteExistingFile: true };
                });
            });

            test('replace file', async ({ page }) => {
                const overwrites = existingFileOverwrites('old-image.png');
                await page.goto(editUrl(overwrites, `responseBody[presigned]=${PRESIGNED_URL}`));

                await assertDlorFormSubmittedData(page, async () => {
                    // panel 3: Link
                    await nextPanel(page, 2);

                    await assertFileListed(page, overwrites.object_file_name);
                    await assertMissingLinkFileTabError(page);
                    await page.getByTestId('dlor-object-file-list-clear').click();
                    await assertHasLinkFileTabError(page);
                    await selectFileForUpload(page, image);
                    await assertMissingLinkFileTabError(page);
                    await assertFileListed(page, image.name);

                    // panel 4: Filtering
                    await nextPanel(page);
                    await save(page);
                    await assertEditSaved(page, true);

                    return {
                        ...existingObjectBase,
                        ...existingObjectFileFields,
                        deleteExistingFile: true,
                        newFile: newFilePayload,
                    };
                });
            });

            test('without file changes', async ({ page }) => {
                const overwrites = existingFileOverwrites(image.name);
                await page.goto(editUrl(overwrites, `responseBody[presigned]=${PRESIGNED_URL}`));

                await assertDlorFormSubmittedData(page, async () => {
                    await nextPanel(page, 3);
                    await save(page);
                    await assertEditSaved(page);

                    return { ...existingObjectBase, ...existingObjectFileFields };
                });
            });
        });

        test.describe('error handling', () => {
            const oldFilename = 'another-image.png';

            // replaces the existing file, then saves
            const runTest = async (page: Page, params: string) => {
                const overwrites = {
                    object_review_date_next: moment().format('YYYY-MM-DD'),
                    object_file_name: oldFilename,
                    object_file_size: 1000,
                };
                await page.setViewportSize(PAGE_VIEWPORT);
                await page.goto(editUrl(overwrites, params));

                await nextPanel(page, 2);
                await page.getByTestId('dlor-object-file-list-clear').click();
                await selectFileForUpload(page, image);

                await nextPanel(page);
                await save(page);
            };

            test('pre-signed url error', async ({ page }) => {
                await runTest(page, 'responseStatus[presigned]=500');
                await assertUploadFailure(page);
            });

            test('S3 error', async ({ page }) => {
                await runTest(page, `responseBody[presigned]=${PRESIGNED_URL}&responseStatus[s3]=500`);
                await assertUploadFailure(page);
            });

            test('delete file error', async ({ page }) => {
                await runTest(page, 'responseStatus[dlorObjectFileDestroy]=500');
                await assertProgressThenError(
                    page,
                    `Deleting removed file ${oldFilename}`,
                    `Error while deleting file ${oldFilename}`,
                );
            });
        });
    });
});
