import { test, expect } from '@uq/pw/test';
import { assertAccessibility } from '@uq/pw/lib/axe';
import { readRichTextEditor, typeRichTextEditor } from '@uq/pw/lib/richTextEditor';
import { addToInputValue } from '@uq/pw/lib/helpers';
import { DLOR_ADMIN_USER } from '@uq/pw/lib/constants';
import moment from 'moment-timezone';
import type { Page } from '@playwright/test';

const REQUIRED_LENGTH_DESCRIPTION = 100;

const gotoEditPage = (page: Page, objectId: string, user: string) =>
    page.goto(`/admin/dlor/edit/${objectId}?user=${user}`, { waitUntil: 'commit' });

test.describe('Edit an object on the Digital Learning Hub', () => {
    test.describe('editing an object', () => {
        test.describe('successfully', () => {
            test('loads fields correctly', async ({ page }) => {
                await gotoEditPage(page, '98s0_dy5k3_98h4', DLOR_ADMIN_USER);
                await page.setViewportSize({ width: 1300, height: 1000 });
                await expect(page.locator('h1').getByText('Digital Learning Hub - Edit Object')).toBeVisible();
                await assertAccessibility(page, '[data-testid="StandardPage"]');

                await expect(page.locator('[data-testid="object-publishing-user"] input')).toHaveValue('uqjsmith');
                await expect(page.getByTestId('dlor-form-team-message-object-publishing-user')).not.toBeVisible();

                const homeLink = page.locator('a[data-testid="dlor-breadcrumb-admin-homelink"]');
                await expect(homeLink).toContainText('Digital Learning Hub admin');
                await expect(homeLink).toHaveAttribute('href', `/admin/dlor?user=${DLOR_ADMIN_USER}`);

                await expect(
                    page
                        .getByTestId('dlor-breadcrumb-edit-object-label-0')
                        .getByText('Edit object: Advanced literature searching'),
                ).toBeVisible();

                // Admin notes
                // Check Open.
                await page.getByTestId('ExpandMoreIcon').click();
                // Check Note 1.
                await expect(page.getByTestId('admin-note-username-0').getByText('uqtest1')).toBeVisible();
                // Check Note 2.
                await expect(page.getByTestId('admin-note-username-1').getByText('uqabcdef')).toBeVisible();
                await page.getByTestId('ExpandMoreIcon').click();

                // team editor
                await expect(page.getByTestId('object-form-teamid-change').getByText('Update contact')).toBeVisible();
                await page.getByTestId('object-form-teamid-change').click();
                await expect(page.getByTestId('dlor-form-team-email-edit')).toBeVisible();
                await assertAccessibility(page, '[data-testid="StandardPage"]', {
                    excludedSelectors: ['#team_admin_username'],
                });
                await typeRichTextEditor(page, 'This is the admin notes');
                await assertAccessibility(page, '[data-testid="StandardPage"]', {
                    excludedSelectors: ['#team_admin_username'],
                });
                await page.getByTestId('object-form-teamid-change').click();
                await expect(page.getByTestId('dlor-form-team-email-edit')).not.toBeVisible();

                // go to panel 2
                await page.getByTestId('dlor-form-next-button').click();
                await assertAccessibility(page, '[data-testid="StandardPage"]', {
                    excludedSelectors: ['#team_admin_username'],
                });
                await expect(page.locator('[data-testid="object-title"] input')).toHaveValue(
                    'Advanced literature searching',
                );
                await expect(await readRichTextEditor(page)).toContain(
                    'This tutorial covers the advanced searching techniques that can be used for all topics when conducting a scoping',
                );
                await expect(page.locator('[data-testid="object-summary"] textarea:first-child')).toHaveValue(
                    'Using advanced searching techniques.',
                );

                await expect(page.locator('[data-testid="object-is-featured"] input')).toBeChecked();
                await expect(page.locator('[data-testid="object-cultural-advice"] input')).toBeChecked();

                // go to panel 3
                await page.getByTestId('dlor-form-next-button').click();
                await assertAccessibility(page, '[data-testid="StandardPage"]', {
                    excludedSelectors: ['#team_admin_username'],
                });
                await expect(page.locator('[data-testid="object-link-url"] input')).toHaveValue(
                    'https://uq.h5p.com/content/1291624605868350759',
                );

                // accessible link message is "no message"
                await expect(page.getByTestId('object-link-interaction-type').getByText('No message')).toBeVisible();
                await expect(page.getByTestId('object-link-file-type')).not.toBeVisible();
                await expect(page.getByTestId('object-link-duration')).not.toBeVisible();
                await expect(page.getByTestId('object-link-file-size')).not.toBeVisible();

                await expect(await readRichTextEditor(page)).toEqual('some download instructions');
                // go to panel 4
                await page.getByTestId('dlor-form-next-button').click();
                await assertAccessibility(page, '[data-testid="StandardPage"]', {
                    excludedSelectors: ['#team_admin_username'],
                });
                // await expect(page.locator('[data-testid="object-keywords"] textarea:first-child')).toHaveValue(
                //     'search, evaluate, literature, strategy',
                // );

                await expect(page.locator('[data-testid="filter-topic-assignments"] input')).toBeChecked();
                await expect(page.locator('[data-testid="filter-topic-research"] input')).toBeChecked();
                await expect(
                    page.locator(
                        '[data-testid="filter-licence-cc-by-nc-nd-attribution-noncommercial-no-derivatives"] input',
                    ),
                ).toBeChecked();

                // no extra filters
                await expect(page.getByTestId('filter-group-topic').locator('> *')).toHaveCount(9 + 1);
                await expect(page.getByTestId('filter-group-media-format').locator('> *')).toHaveCount(12 + 1);
                await expect(page.getByTestId('filter-group-graduate-attributes').locator('> *')).toHaveCount(6 + 1);
                await expect(page.getByTestId('filter-group-subject').locator('> *')).toHaveCount(10 + 1);
                await expect(page.locator('[data-testid="filter-group-item-type"] div').locator('> *')).toHaveCount(6);
                await expect(page.locator('[data-testid="filter-group-licence"] div').locator('> *')).toHaveCount(8);
                await page.locator('[data-testid="choose-notify"] input').check();
                await assertAccessibility(page, '[data-testid="StandardPage"]', {
                    excludedSelectors: ['#team_admin_username'],
                });

                await page.getByTestId('notificationText').fill('Cancel the draft');
                await page.getByTestId('notify-lightbox-close-button').click();
                await page.getByTestId('admin-dlor-form-button-cancel').click();
                await expect(page).toHaveURL(`http://localhost:2020/admin/dlor?user=${DLOR_ADMIN_USER}`);
            });
        });

        test.describe('successfully mock to db', () => {
            test.beforeEach(async ({ page }) => {
                await page.context().addCookies([
                    {
                        name: 'CYPRESS_TEST_DATA',
                        value: 'active',
                        url: 'http://localhost:2020',
                    },
                ]);
            });

            test('admin can edit an object for a new team with notify and return to list', async ({ page }) => {
                await gotoEditPage(page, '98s0_dy5k3_98h4', DLOR_ADMIN_USER);
                await page.setViewportSize({ width: 1300, height: 1000 });

                // const cookies = await page.context().cookies();
                // const testCookie = cookies.find(c => c.name === 'CYPRESS_TEST_DATA');
                // expect(testCookie).toBeTruthy();
                // expect(testCookie.value).toBe('active');

                // open teams drop down
                await page.getByTestId('object-owning-team').click();
                await page.getByTestId('object-form-teamid-new').click();

                const today = moment().format('DD/MM/YYYY'); // Australian format to match the display format

                await page.locator('[data-testid="object-review-date"] input').click();
                await page.locator('[data-testid="object-review-date"] input').clear();
                await page.locator('[data-testid="object-review-date"] input').fill(today);
                await page.locator('[data-testid="object-review-date"] input').blur();
                await expect(page.locator('[data-testid="object-review-date"] input')).toHaveValue(today);

                // enter a new team
                await page.locator('[data-testid="dlor-form-team-name-new"] input').fill('new team name');
                await page.locator('[data-testid="dlor-form-team-manager-new"] input').fill('john Manager');
                await page.locator('[data-testid="dlor-form-team-admin-username-new"] input').fill('johnadmin');
                await page.locator('[data-testid="dlor-form-team-email-new"] input').fill('john@example.com');
                await typeRichTextEditor(page, 'This is the admin notes');

                // go to the second panel, Description
                await page.getByTestId('dlor-form-next-button').click();

                await addToInputValue(page.locator('[data-testid="object-title"] input'), 'xx');
                await typeRichTextEditor(page, 'new description '.padEnd(REQUIRED_LENGTH_DESCRIPTION, 'x'));
                await addToInputValue(page.locator('[data-testid="object-summary"] textarea:first-child'), 'xx');

                await page.locator('[data-testid="object-is-featured"] input').check();
                await page.locator('[data-testid="object-cultural-advice"] input').check();

                // go to the third panel, Link
                await page.getByTestId('dlor-form-next-button').click();
                await addToInputValue(page.locator('[data-testid="object-link-url"] input'), '/page');

                // select download as the url interaction type
                await page.getByTestId('object-link-interaction-type').click();
                await page.getByTestId('object-link-interaction-type-download').click();
                await page.getByTestId('object-link-file-type').click();
                await page.locator('[data-value="XLS"]').click();
                await page.locator('[data-testid="object-link-size-amount"] input').fill('36');
                await page.getByTestId('object-link-size-units').click();
                await page.locator('[data-value="MB"]').click();

                const typeableDownloadInstructions = 'xxx';
                await typeRichTextEditor(page, typeableDownloadInstructions);

                // go to the fourth panel, Filtering
                await page.getByTestId('dlor-form-next-button').click();

                await page.locator('[data-testid="filter-topic-assignments"] input').uncheck();
                await page.locator('[data-testid="filter-topic-research"] input').uncheck();
                await page.locator('[data-testid="filter-topic-aboriginal-and-torres-strait-islander"] input').check();

                await page.locator('[data-testid="filter-media-format-audio"] input').check();
                await page.locator('[data-testid="filter-media-format-h5p"] input').check();
                await page.locator('[data-testid="filter-media-format-pressbook"] input').uncheck();

                await page.locator('[data-testid="filter-subject-business-economics"] input').check();
                await page.locator('[data-testid="filter-subject-cross-disciplinary"] input').uncheck();

                await page.locator('[data-testid="filter-item-type-interactive"] input').check();

                await page.locator('[data-testid="filter-licence-cc-by-nc-attribution-noncommercial"] input').check();

                // await page.locator('[data-testid="object-keywords"] textarea:first-child').fill('cat, dog');
                // select a keyword so we can save
                await page.locator("[data-testid='fuzzy-search-input'] input").fill('test');
                await page.locator('#fuzzy-search-option-3').click();

                // add notification text
                await page.locator('[data-testid="choose-notify"] input').check();

                await expect(
                    page.getByTestId('notify-lightbox-title').getByText('Object change notification'),
                ).toBeVisible();

                await typeRichTextEditor(page, 'the words that will go in the email');

                await page.getByTestId('notify-lightbox-close-button').click();

                await page.getByTestId('admin-dlor-save-button-submit').click();

                await expect(
                    page.locator('[data-testid="dialogbox-dlor-save-outcome"] h2').getByText('Changes have been saved'),
                ).toBeVisible();
                await expect(page.getByTestId('confirm-dlor-save-outcome').getByText('View Object')).toBeVisible();
                await expect(page.getByTestId('cancel-dlor-save-outcome').getByText('Re-edit Object')).toBeVisible();

                const savedCookie = (await page.context().cookies()).find(
                    cookie => cookie.name === 'CYPRESS_DATA_SAVED',
                );
                expect(savedCookie).toBeDefined();
                const sentValues = JSON.parse(decodeURIComponent(savedCookie!.value));
                expect(sentValues).toEqual(
                    expect.objectContaining({
                        object_link_interaction_type: 'download',
                        object_link_file_type: 'XLS',
                        object_link_size: '36000',
                        team_admin_username: 'johnadmin',
                        team_email: 'john@example.com',
                        team_manager: 'john Manager',
                        team_name: 'new team name',
                    }),
                );
                await page.context().clearCookies();

                // check the data we pretended to send to the server matches what we expect
                // acts as check of what we sent to api

                // const expectedValues = {
                //     object_admin_notes: '<p>This is the admin notes</p>',
                //     object_title: 'Advanced literature searchingxx',
                //     object_description:
                //         '<p>new description xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</p>',
                //     object_summary: 'Using advanced searching techniques.xx',
                //     object_link_interaction_type: 'download',
                //     object_link_file_type: 'XLS',
                //     object_link_size: '36000',
                //     object_link_url: 'https://uq.h5p.com/content/1291624605868350759/page',
                //     object_download_instructions: '<p>' + typeableDownloadInstructions + '</p>',
                //     object_is_featured: 1,
                //     object_cultural_advice: 1,
                //     object_publishing_user: 'uqjsmith',
                //     object_review_date_next: '2025-03-26T00:01',
                //     object_status: 'current',
                //     team_admin_username: 'johnadmin',
                //     team_email: 'john@example.com',
                //     team_manager: 'john Manager',
                //     team_name: 'new team name',
                //     object_keywords: ['Research Skills', 'evaluate', 'literature', 'search', 'strategy'],
                //     object_keyword_ids: [3, 100001, 100002, 100000, 100003],
                //     facets: [
                //         10, // Graduate attributes : Accomplished scholars
                //         14, // Graduate attributes : Influential communicator
                //         1, // aboriginal_and_torres_strait_islander
                //         22, // media_audio
                //         24, // media_h5p
                //         35, // business_economics
                //         17, // type_interactive_activity
                //         45, // cc_by_nc_attribution_noncommercial
                //     ],
                //     notificationText: '<p>the words that will go in the email</p>',
                // };
                // {
                //     const cookie = await page.context().cookies();
                //     const dataSavedCookie = cookie.find(c => c.name === 'CYPRESS_DATA_SAVED');
                //     expect(dataSavedCookie).toBeTruthy();
                //     const sentValues = JSON.parse(decodeURIComponent(dataSavedCookie.value));

                //     // had trouble comparing the entire structure
                //     const sentFacets = sentValues.facets;
                //     const expectedFacets = expectedValues.facets;
                //     const sentKeywords = sentValues.object_keywords;
                //     const expectedKeywords = expectedValues.object_keywords;
                //     delete sentValues.facets;
                //     delete expectedValues.facets;
                //     delete sentValues.object_keywords;
                //     delete expectedValues.object_keywords;
                //     delete sentValues.object_review_date_next; // doesn't seem valid to figure out the date
                //     delete expectedValues.object_review_date_next;

                //     expect(sentValues).toEqual(expectedValues);
                //     expect(sentFacets).toEqual(expectedFacets);
                //     expect(sentKeywords).toEqual(expectedKeywords);

                //     await page.context().clearCookies();
                // }

                // // check save-confirmation popup
                // await expect(page.getByTestId('confirm-dlor-save-outcome').getByText('View Object')).toBeVisible();
                // await expect(page.getByTestId('cancel-dlor-save-outcome').getByText('Re-edit Object')).toBeVisible();

                // navigate back to the list page
                // await page.getByTestId('confirm-dlor-save-outcome').click();
                // await expect(page).toHaveURL(
                //     `http://localhost:2020/digital-learning-hub/view/98s0_dy5k3_98h4?user=${DLOR_ADMIN_USER}`,
                // );
                // await expect(
                //     page.getByTestId('dlor-detailpage').first().getByText('Advanced literature searching').first(),
                // ).toBeVisible();
            });

            // test('admin can edit, edit the current team, choose a different existing team and re-edit', async ({
            //     page,
            // }) => {
            //     await page.goto(`http://localhost:2020/admin/dlor/edit/98s0_dy5k3_98h4?user=${DLOR_ADMIN_USER}`);
            //     await page.setViewportSize({ width: 1300, height: 1000 });

            //     const cookies = await page.context().cookies();
            //     const testCookie = cookies.find(c => c.name === 'CYPRESS_TEST_DATA');
            //     expect(testCookie).toBeTruthy();
            //     expect(testCookie?.value).toBe('active');

            //     // first panel, Ownership, loads

            //     // edit team details for the current team
            //     await page.getByTestId('object-form-teamid-change').click();
            //     await page.locator('[data-testid="dlor-form-team-manager-edit"] input').fill('manager name');
            //     await page.locator('[data-testid="dlor-form-team-email-edit"] input').fill('lea@example.com');

            //     // and then change your mind and change teams instead
            //     await page.getByTestId('object-owning-team').click();
            //     await page.locator('[data-value="3"]').click();

            //     const today = moment().format('DD/MM/YYYY'); // Australian format to match the display format

            //     await page.locator('[data-testid="object-review-date"] input').click();
            //     await page.locator('[data-testid="object-review-date"] input').clear();
            //     await page.locator('[data-testid="object-review-date"] input').fill(today);
            //     await expect(page.locator('[data-testid="object-review-date"] input')).toHaveValue(today);

            //     // go to the second panel, Description
            //     await page.getByTestId('dlor-form-next-button').click();

            //     await addToInputValue(
            //         page.locator('[data-testid="object-title"] input'),
            //         'x'.padEnd(REQUIRED_LENGTH_TITLE, 'x'),
            //     );
            //     await typeRichTextEditor(page, 'new description '.padEnd(REQUIRED_LENGTH_DESCRIPTION, 'x'));
            //     await addToInputValue(page.locator('[data-testid="object-summary"] textarea:first-child'), 'xxx');

            //     // go to the third panel, Link
            //     await page.getByTestId('dlor-form-next-button').click();
            //     const downloadInstructionText = 'updated download instructions';

            //     // select download as the url interaction type
            //     await page.locator('[data-testid="object-link-url"] input').clear();
            //     await page.locator('[data-testid="object-link-url"] input').fill('http://example.com');
            //     await page.getByTestId('object-link-interaction-type').click();
            //     await page.getByTestId('object-link-interaction-type-view').click();
            //     await expect(page.getByTestId('object-link-file-type')).toBeVisible();
            //     await expect(page.getByTestId('object-link-size-amount')).not.toBeVisible();
            //     await expect(page.getByTestId('object-link-duration-minutes')).toBeVisible();
            //     await page.getByTestId('object-link-file-type').click();
            //     await page.locator('[data-value="video"]').click();

            //     await page.locator('[data-testid="object-link-duration-minutes"] input').fill('6');
            //     await page.locator('[data-testid="object-link-duration-seconds"] input').fill('30');

            //     await typeRichTextEditor(page, downloadInstructionText);

            //     // go to the fourth panel, Filtering
            //     await page.getByTestId('dlor-form-next-button').click();

            //     await page.locator('[data-testid="filter-topic-digital-skills"] input').check();
            //     await page.locator('[data-testid="filter-topic-employability"] input').check();
            //     await page.locator('[data-testid="filter-media-format-dataset"] input').check();
            //     await page
            //         .locator('[data-testid="filter-subject-engineering-architecture-information-technology"] input')
            //         .check();

            //     await page.locator('[data-testid="filter-subject-medicine-biomedical-sciences"] input').check();

            //     await page.locator('[data-testid="filter-item-type-module"] input').check();
            //     await page.locator('[data-testid="filter-licence-cc0public-domain"] input').check();
            //     await page.locator('[data-testid="filter-graduate-attributes-connected-citizens"] input').check();

            //     await page.locator('[data-testid="filter-subject-medicine-biomedical-sciences"] input').uncheck();

            //     // await page.locator('[data-testid="object-keywords"] textarea:first-child').fill('cat, dog');
            //     // select a keyword so we can save
            //     await page.locator("[data-testid='fuzzy-search-input'] input").fill('test');
            //     await page.locator('#fuzzy-search-option-3').click();

            //     // save record
            //     await page.getByTestId('admin-dlor-save-button-submit').click();

            //     // check save happened
            //     await expect(
            //         page.locator('[data-testid="dialogbox-dlor-save-outcome"] h2').getByText('Changes have been saved'),
            //     ).toBeVisible();
            //     await expect(page.getByTestId('confirm-dlor-save-outcome').getByText('View Object')).toBeVisible();
            //     await expect(page.getByTestId('cancel-dlor-save-outcome').getByText('Re-edit Object')).toBeVisible();

            //     // check the data we pretended to send to the server matches what we expect
            //     // acts as check of what we sent to api
            //     const expectedValues = {
            //         object_title: 'Advanced literature searchingxxxxxxxx',
            //         object_description:
            //             '<p>new description xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</p>',
            //         object_summary: 'Using advanced searching techniques.xxx',
            //         object_link_interaction_type: 'view',
            //         object_link_file_type: 'video',
            //         object_link_size: 390,
            //         object_link_url: 'http://example.com',
            //         object_download_instructions: '<p>' + downloadInstructionText + '</p>',
            //         object_is_featured: 1,
            //         object_cultural_advice: 1,
            //         object_publishing_user: 'uqjsmith',
            //         object_review_date_next: '2025-03-26T00:01',
            //         object_status: 'current',
            //         object_owning_team_id: 3,
            //         facets: [
            //             2, // Topic : Assignments
            //             7, // Topic : Research
            //             10, // Graduate attributes : Accomplished scholars
            //             14, // Graduate attributes : Influential communicators
            //             27, // Media format : Pressbook
            //             34, // Subject : Cross-disciplinary
            //             3, // Topic : Digital skills
            //             4, // Topic : Employability
            //             23, // Media format : Dataset
            //             36, // Subject : Engineering: Architecture; Information Technology
            //             18, // Item type : Module #radio
            //             50, // licence : CC0/Public domain #radio
            //             11, // Graduate attributes : Connected citizens
            //         ],
            //         object_keywords: ['cat', 'dog'],
            //         object_keyword_ids: [3, 100001, 100002, 100000, 100003],
            //         notificationText: '',
            //     };

            //     {
            //         const cookie = await page.context().cookies();
            //         const dataSavedCookie = cookie.find(c => c.name === 'CYPRESS_DATA_SAVED');
            //         expect(dataSavedCookie).toBeTruthy();
            //         const sentValues = JSON.parse(decodeURIComponent(dataSavedCookie?.value || '{}'));
            //         // it doesnt seem valid to recalc the calculated date to test it
            //         delete sentValues.object_review_date_next;
            //         delete expectedValues.object_review_date_next;

            //         // had trouble comparing the entire structure
            //         const sentFacets = sentValues.facets;
            //         const expectedFacets = expectedValues.facets;
            //         const sentKeywords = sentValues.object_keywords;
            //         const expectedKeywords = sentValues.object_keywords;
            //         delete sentValues.facets;
            //         delete sentValues.object_keywords;
            //         delete expectedValues.facets;
            //         delete expectedValues.object_keywords;

            //         expect(sentValues).toEqual(expectedValues);
            //         expect(sentFacets).toEqual(expectedFacets);
            //         expect(sentKeywords).toEqual(expectedKeywords);

            //         await page.context().clearCookies();
            //     }

            //     // confirm save happened
            //     await expect(page.getByTestId('dialogbox-dlor-save-outcome').getByText('View Object')).toBeVisible();
            //     await expect(page.getByTestId('cancel-dlor-save-outcome').getByText('Re-edit Object')).toBeVisible();

            //     // now clear the form to create another Object
            //     await page.getByTestId('cancel-dlor-save-outcome').click();
            //     await page.getByTestId('dlor-form-next-button').click();

            //     await expect(
            //         page
            //             .getByTestId('dlor-detailpage-sitelabel')
            //             .getByText('Edit object: Advanced literature searching'),
            //     ).toBeVisible();
            // });

            //     test('with a new interaction type & is featured & cancelled notification text', async ({
            //         page,
            //         context,
            //     }) => {
            //         await page.goto(`http://localhost:2020/admin/dlor/edit/987y_isjgt_9866?user=${DLOR_ADMIN_USER}`);
            //         await page.setViewportSize({ width: 1300, height: 1000 });

            //         const cookies = await context.cookies();
            //         const cypressTestDataCookie = cookies.find(cookie => cookie.name === 'CYPRESS_TEST_DATA');
            //         expect(cypressTestDataCookie).toBeDefined();
            //         expect(cypressTestDataCookie?.value).toBe('active');

            //         const today = moment().format('DD/MM/YYYY'); // Australian format to match the display format

            //         const reviewDateInput = page.locator('[data-testid="object-review-date"] input');
            //         await reviewDateInput.clear();
            //         await reviewDateInput.fill(today);
            //         await expect(reviewDateInput).toHaveValue(today);

            //         // go to the second panel, Description
            //         const nextButton = page.getByTestId('dlor-form-next-button');
            //         await nextButton.click();

            //         const isFeaturedCheckbox = page.locator('[data-testid="object-is-featured"] input');
            //         await expect(isFeaturedCheckbox).toBeChecked();
            //         await isFeaturedCheckbox.uncheck();

            //         // go to the third panel, Link
            //         await nextButton.click();

            //         await expect(async () => {
            //             // choose file type
            //             await page.getByTestId('object-link-file-type').click({ timeout: 2000 });
            //             await page.getByTestId('object-link-file-type-something').click({ timeout: 2000 });
            //             await page.getByTestId('object-link-file-type-new').click({ timeout: 2000 });
            //             // panel invalidity count present
            //             await expect(
            //                 page.locator('[data-testid="dlor-panel-validity-indicator-2"] span').getByText('1').first(),
            //             ).toBeVisible({ timeout: 3000 });
            //             await page
            //                 .locator('[data-testid="dlor-admin-form-new-file-type"] input')
            //                 .fill('docx', { timeout: 3000 });
            //         }).toPass();

            //         await expect(page.getByTestId('dlor-panel-validity-indicator-2')).toBeHidden();

            //         await typeRichTextEditor(page, 'word');

            //         // go to the fourth panel, Filtering
            //         await nextButton.click();

            //         // open the notification lightbox, type something and then uncheck the notify checkbox
            //         // should then not send text
            //         const chooseNotifyInput = page.locator('[data-testid="choose-notify"] input[type="checkbox"]');
            //         await chooseNotifyInput.click();

            //         // the lightbox opens
            //         const notifyLightboxTitle = page.getByTestId('notify-lightbox-title');
            //         await expect(notifyLightboxTitle).toContainText('Object change notification');

            //         await typeRichTextEditor(page, 'the words that will go in the email');

            //         const closeButton = page.getByTestId('notify-lightbox-close-button');
            //         await expect(closeButton).toContainText('Close');
            //         await closeButton.click();

            //         // check the edit button reopens the lightbox
            //         const reeditButton = page.getByTestId('notify-reedit-button');
            //         await expect(reeditButton).toContainText('Edit');
            //         await reeditButton.click();
            //         // the lightbox is open
            //         const lightboxModal = page.getByTestId('notify-lightbox-modal');
            //         await expect(notifyLightboxTitle).toContainText('Object change notification');
            //         await expect(lightboxModal).toContainText('the words that will go in the email');

            //         // close the box again
            //         await closeButton.click();

            //         // workaround https://github.com/microsoft/playwright/issues/13470
            //         await expect(async () => {
            //             await expect(chooseNotifyInput).toBeChecked({ timeout: 2000 });
            //             await chooseNotifyInput.dispatchEvent('click');
            //             await expect(chooseNotifyInput).not.toBeChecked({ timeout: 2000 });
            //         }).toPass({ timeout: 5000 });
            //         await expect(reeditButton).toBeHidden();

            //         // if we clicked save now, it would not send a notify message and thus wouldnt notify
            //         // but lets confirm that the form holds the previously entered text first
            //         // recheck notify, lightbox opens with previous text
            //         await expect(async () => {
            //             await expect(chooseNotifyInput).not.toBeChecked({ timeout: 2000 });
            //             await chooseNotifyInput.dispatchEvent('click');
            //             await expect(chooseNotifyInput).toBeChecked({ timeout: 2000 });
            //         }).toPass({ timeout: 5000 });
            //         await expect(notifyLightboxTitle).toContainText('Object change notification');
            //         await expect(lightboxModal).toContainText('the words that will go in the email');
            //         await closeButton.click();

            //         // uncheck, we want to check it doesnt send
            //         await expect(async () => {
            //             await expect(chooseNotifyInput).toBeChecked({ timeout: 2000 });
            //             await chooseNotifyInput.dispatchEvent('click');
            //             await expect(chooseNotifyInput).not.toBeChecked({ timeout: 2000 });
            //         }).toPass({ timeout: 5000 });

            //         // select a keyword so we can save
            //         await page.locator("[data-testid='fuzzy-search-input'] input").fill('test');
            //         await page.locator('#fuzzy-search-option-3').click();

            //         // save record
            //         const saveButton = page.getByTestId('admin-dlor-save-button-submit');
            //         await saveButton.click();

            //         // confirm save happened
            //         const cancelSaveOutcomeButton = page.getByTestId('cancel-dlor-save-outcome');
            //         const dialogTitle = page.locator('[data-testid="dialogbox-dlor-save-outcome"] h2');
            //         await expect(dialogTitle).toContainText('Changes have been saved');
            //         const viewObjectButton = page.getByTestId('confirm-dlor-save-outcome');
            //         await expect(viewObjectButton).toContainText('View Object');
            //         await expect(cancelSaveOutcomeButton).toContainText('Re-edit Object');

            //         // check the data we pretended to send to the server matches what we expect
            //         // acts as check of what we sent to api
            //         const expectedValues = {
            //             object_title: 'Accessibility - Digital Essentials (has Youtube link)',
            //             object_description:
            //                 '<p>Understanding the importance of accessibility online and creating accessible content with a longer first line. Ramble a little.</p>' +
            //                 '<p>and a second line of detail in the description</p>',
            //             object_summary:
            //                 'Understanding the importance of accessibility online and creating accessible content.',
            //             object_link_interaction_type: 'view',
            //             object_link_file_type: 'docx',
            //             object_link_size: 2864,
            //             object_link_url: 'https://www.youtube.com/watch?v=jwKH6X3cGMg',
            //             object_download_instructions: '<p>word</p>',
            //             object_is_featured: 0,
            //             object_cultural_advice: 0,
            //             object_publishing_user: 'uqldegro',
            //             object_review_date_next: '2025-03-26T00:01',
            //             object_status: 'current',
            //             object_restrict_to: 'none',
            //             object_owning_team_id: 1,
            //             facets: [
            //                 3, // Topic : Digital skills
            //                 11, // Graduate attributes : Connected citizens
            //                 14, // Graduate attributes : Influential communicators
            //                 18, // Item type : Module
            //                 30, // Media format : Video
            //                 34, // Subject : Cross-disciplinary
            //                 45, // Licence : CC BY-NC Attribution NonCommercial
            //             ],
            //             object_keywords: ['cat', 'dog'],
            //             object_keyword_ids: [3, 100000, 100001, 100002],
            //             team_email: 'dlor@library.uq.edu.au',
            //             team_manager: 'John Smith',
            //             team_name: 'LIB DX Digital Content',
            //             notificationText: '',
            //         };
            //         {
            //             const savedCookies = await context.cookies();
            //             const dataSavedCookie = savedCookies.find(cookie => cookie.name === 'CYPRESS_DATA_SAVED');
            //             expect(dataSavedCookie).toBeDefined();
            //             const decodedValue = decodeURIComponent(dataSavedCookie.value);
            //             const sentValues = JSON.parse(decodedValue);

            //             // it doesnt seem valid to recalc the calculated date to test it
            //             expect(sentValues).toHaveProperty('object_review_date_next');
            //             delete sentValues.object_review_date_next;
            //             delete expectedValues.object_review_date_next;

            //             // had trouble comparing the entire structure
            //             const sentFacets = sentValues.facets;
            //             const expectedFacets = expectedValues.facets;
            //             const sentKeywords = sentValues.object_keywords;
            //             const expectedKeywords = sentValues.object_keywords;
            //             delete sentValues.facets;
            //             delete sentValues.object_keywords;
            //             delete expectedValues.facets;
            //             delete expectedValues.object_keywords;

            //             expect(sentValues).toEqual(expectedValues);
            //             expect(sentFacets).toEqual(expectedFacets);
            //             expect(sentKeywords).toEqual(expectedKeywords);
            //             await context.clearCookies();
            //         }

            //         // confirm save happened
            //         await expect(dialogTitle).toContainText('Changes have been saved');
            //         await expect(viewObjectButton).toContainText('View Object');
            //         await expect(cancelSaveOutcomeButton).toContainText('Re-edit Object');

            //         // now clear the form to re-edit
            //         await expect(cancelSaveOutcomeButton).toContainText('Re-edit Object');
            //         await cancelSaveOutcomeButton.click();
            //         await expect(page.locator('[data-testid="object-publishing-user"] input')).toBeVisible();
            //         await nextButton.click();

            //         await expect(
            //             page
            //                 .getByTestId('dlor-detailpage-sitelabel')
            //                 .getByText('Edit object: Accessibility - Digital Essentials (has Youtube link)'),
            //         ).toBeVisible();
            //     });
        });

        test.describe('fails correctly', () => {
            test('404 page return correctly', async ({ page }) => {
                await gotoEditPage(page, 'object_404', DLOR_ADMIN_USER);
                await expect(
                    page.getByTestId('dlor-form-error').getByText('The requested page could not be found.'),
                ).toBeVisible();
            });

            // test('admin gets an error on a failed save', async ({ page }) => {
            //     await page.goto(
            //         `http://localhost:2020/admin/dlor/edit/98s0_dy5k3_98h4?user=${DLOR_ADMIN_USER}&responseType=saveError`,
            //     );

            //     const today = moment().format('DD/MM/YYYY');
            //     await page.locator('[data-testid="object-review-date"] input').click();
            //     await page.locator('[data-testid="object-review-date"] input').clear();
            //     await page.locator('[data-testid="object-review-date"] input').fill(today);
            //     await page.locator('[data-testid="object-review-date"] input').blur();
            //     await expect(page.locator('[data-testid="object-review-date"] input')).toHaveValue(today);
            //     // team is valid as is, so go to the second panel, Description
            //     await page.getByTestId('dlor-form-next-button').click();

            //     // go to the third panel, Link
            //     await page.getByTestId('dlor-form-next-button').click();

            //     // go to the fourth panel, Filtering
            //     await page.getByTestId('dlor-form-next-button').click();

            //     // select a keyword so we can save
            //     await page.locator("[data-testid='fuzzy-search-input'] input").fill('test');
            //     await page.locator('#fuzzy-search-option-3').click();

            //     // form filled out. now save
            //     await page.getByTestId('admin-dlor-save-button-submit').click();

            //     await expect(
            //         page
            //             .locator('[data-testid="dialogbox-dlor-save-outcome"] h2')
            //             .getByText('There was a problem with the input.'),
            //     ).toBeVisible();
            //     await expect(page.getByTestId('confirm-dlor-save-outcome').getByText('View Object')).toBeVisible();
            //     await expect(page.getByTestId('cancel-dlor-save-outcome').getByText('Re-edit Object')).toBeVisible();
            // });
        });
    });
    test.describe('user access', () => {
        test('displays an "unauthorised" page to public users', async ({ page }) => {
            await gotoEditPage(page, '98s0_dy5k3_98h4', 'public');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.locator('h1').getByText('Authentication required')).toBeVisible();
        });
        test('displays an "unauthorised" page to non-authorised users', async ({ page }) => {
            await gotoEditPage(page, '98s0_dy5k3_98h4', 'uqstaff');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.locator('h1').getByText('Permission denied')).toBeVisible();
        });
        // test('displays correct page for admin users (list)', async ({ page }) => {
        //     await page.goto(`http://localhost:2020/digital-learning-hub/edit/kj5t_8yg4_kj4f?user=${DLOR_ADMIN_USER}`);
        //     await page.setViewportSize({ width: 1300, height: 1000 });
        //     await expect(page.locator('h1').getByText('Digital Learning Hub - Edit Object')).toBeVisible();
        //     await expect(
        //         page.getByTestId('dlor-breadcrumb-edit-object-label-0').getByText('UQ has a Blak History'),
        //     ).toBeVisible();
        // });
        // test('is accessible for a DLOR object owner', async ({ page }) => {
        //     await page.goto(`http://localhost:2020/digital-learning-hub/edit/kj5t_8yg4_kj4f?user=${DLOR_OBJECT_OWNER}`);
        //     await page.setViewportSize({ width: 1300, height: 1000 });
        //     await expect(page.locator('h1').getByText('Digital Learning Hub - Edit Object')).toBeVisible();
        //     await expect(page.getByTestId('dlor-form-no-access')).not.toBeVisible();
        //     await expect(
        //         page.getByTestId('dlor-breadcrumb-edit-object-label-0').getByText('UQ has a Blak History'),
        //     ).toBeVisible();
        // });
        // test('is not accessible for a DLOR object owner with a different user', async ({ page }) => {
        //     await page.goto(`http://localhost:2020/digital-learning-hub/edit/kj5t_8yg4_kj4f?user=${DLOR_NO_EDIT_USER}`);
        //     await page.setViewportSize({ width: 1300, height: 1000 });
        //     await expect(page.locator('h1')).toBeVisible();
        //     await expect(page.getByTestId('dlor-form-no-access')).toBeVisible();
        // });
    });
});
