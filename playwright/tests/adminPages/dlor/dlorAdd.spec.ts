import { test, expect } from '@uq/pw/test';
import { assertAccessibility } from '@uq/pw/lib/axe';
import { DLOR_ADMIN_USER } from '@uq/pw/lib/constants';
import moment from 'moment-timezone';
import { typeCKEditor } from '@uq/pw/lib/ckeditor';

const REQUIRED_LENGTH_TITLE = 8;
const REQUIRED_LENGTH_DESCRIPTION = 100;
const REQUIRED_LENGTH_SUMMARY = 20;
const REQUIRED_LENGTH_KEYWORDS = 4;

test.describe('Add an object to the Digital Learning Hub', () => {
    test.describe('adding a new object', () => {
        test.describe('successfully', () => {
            test.beforeEach(async ({ page }) => {
                await page.goto(`http://localhost:2020/admin/dlor/add?user=${DLOR_ADMIN_USER}`);
                await page.setViewportSize({ width: 1300, height: 1000 });
            });

            test('is accessible', async ({ page }) => {
                await page.setViewportSize({ width: 1300, height: 1000 });
                await expect(page.locator('h1')).toContainText('Digital Learning Hub Management');

                // First panel accessibility check
                await assertAccessibility(page, '[data-testid="StandardPage"]', {
                    disabledRules: ['aria-required-children'],
                    reportName: 'dlor form panel 1',
                    scopeName: 'Content',
                });

                const today = moment().format('DD/MM/YYYY');
                const reviewDateInput = page.locator('[data-testid="object-review-date"] input');
                await reviewDateInput.click();
                await reviewDateInput.fill(today);
                await reviewDateInput.blur();
                await page.waitForTimeout(500);
                await expect(reviewDateInput).toHaveValue(today);

                await typeCKEditor(page, undefined, 'This is the admin notes');

                // Go to second panel
                await page.getByTestId('dlor-form-next-button').click();
                await expect(page.getByTestId('object-title')).toBeVisible();

                // Second panel accessibility check
                await assertAccessibility(page, '[data-testid="StandardPage"]', {
                    disabledRules: ['aria-required-children'],
                    reportName: 'dlor form panel 2',
                    scopeName: 'Content',
                });

                // Go to third panel
                await page.getByTestId('dlor-form-next-button').click();
                await expect(page.getByTestId('object-link-url')).toBeVisible();

                // Third panel accessibility check
                await assertAccessibility(page, '[data-testid="StandardPage"]', {
                    disabledRules: ['aria-required-children'],
                    reportName: 'dlor form panel 3',
                    scopeName: 'Content',
                });

                // Go to fourth panel
                await page.getByTestId('dlor-form-next-button').click();
                await expect(page.getByTestId('filter-topic-aboriginal-and-torres-strait-islander')).toBeVisible();

                // Fourth panel accessibility check
                await assertAccessibility(page, '[data-testid="StandardPage"]', {
                    disabledRules: ['aria-required-children'],
                    reportName: 'dlor form panel 4',
                    scopeName: 'Content',
                });
            });

            test('has breadcrumb', async ({ page }) => {
                await expect(page.locator('uq-site-header').getByTestId('subsite-title')).toContainText(
                    'Digital learning hub admin',
                );
            });

            test('loads as expected', async ({ page }) => {
                const homeLink = page.locator('a[data-testid="dlor-breadcrumb-admin-homelink"]');
                await expect(homeLink).toContainText('Digital Learning Hub admin');
                await expect(homeLink).toHaveAttribute(
                    'href',
                    `http://localhost:2020/admin/dlor?user=${DLOR_ADMIN_USER}`,
                );

                await expect(
                    page.locator(
                        '[data-testid="dlor-breadcrumb-create-an-object-for-the-digital-learning-hub-label-0"]',
                    ),
                ).toContainText('Create an Object for the Digital Learning Hub');

                await expect(page.locator('[data-testid="object-publishing-user"] input')).toHaveValue('dloradmn');

                // Navigate through panels
                await page.getByTestId('dlor-form-next-button').click();
                await page.getByTestId('dlor-form-next-button').click();
                await page.getByTestId('dlor-form-next-button').click();

                await expect(page.locator('[data-testid="choose-notify"] input')).not.toBeVisible();
            });

            test('validates fields correctly', async ({ page }) => {
                // first enter all the fields and show the save button doesn't enable until all the fields are entered

                // team starts off valid so click on to the second panel, description
                const today = moment().format('DD/MM/YYYY'); // Australian format to match the display format

                await expect(page.locator('[data-testid="dlor-panel-validity-indicator-1"] span')).not.toBeVisible();

                await page.locator('[data-testid="object-review-date"] input').click();
                await page.locator('[data-testid="object-review-date"] input').fill('');
                await page.locator('[data-testid="object-review-date"] input').fill(today);
                await page.locator('[data-testid="object-review-date"] input').blur();
                await page.waitForTimeout(500);
                await expect(page.locator('[data-testid="object-review-date"] input')).toHaveValue(today);

                await page.getByTestId('dlor-form-next-button').click();

                await expect(page.locator('[data-testid="dlor-panel-validity-indicator-1"] span')).toContainText('3'); // panel invalidity count present
                await page.locator('[data-testid="object-title"] input').fill('xx'.padEnd(REQUIRED_LENGTH_TITLE, 'x'));
                await expect(page.locator('[data-testid="dlor-panel-validity-indicator-1"] span')).toContainText('2'); // panel invalidity count present
                await page.waitForTimeout(1000);
                await typeCKEditor(page, undefined, 'new description '.padEnd(REQUIRED_LENGTH_DESCRIPTION, 'x'));

                await expect(page.locator('[data-testid="dlor-panel-validity-indicator-1"] span')).toContainText('1'); // panel invalidity count present
                await page
                    .locator('[data-testid="object-summary"] textarea:first-child')
                    .fill('new summary '.padEnd(REQUIRED_LENGTH_SUMMARY, 'x'));
                await expect(page.getByTestId('dlor-panel-validity-indicator-1')).not.toBeVisible(); // panel invalidity count not present

                // click 'next' button to view panel 3, Link
                await page.getByTestId('dlor-form-next-button').click();
                await expect(page.locator('[data-testid="dlor-panel-validity-indicator-2"] span')).toContainText('1'); // panel invalidity count present

                await page.locator('[data-testid="object-link-url"] input').fill('asdasdasdsadd');
                await page.waitForSelector('[data-testid="dlor-form-error-message-object-link-url"]');
                await expect(page.getByTestId('dlor-form-error-message-object-link-url')).toContainText(
                    'This web address is not valid.',
                );
                await page.locator('[data-testid="object-link-url"] input').fill('');
                await page.locator('[data-testid="object-link-url"] input').fill('http://example.com');
                await expect(page.getByTestId('dlor-panel-validity-indicator-2')).not.toBeVisible(); // panel invalidity count not present

                // click 'next' button to view panel 4, Filters
                await page.getByTestId('dlor-form-next-button').click();
                // filters
                await page.locator('[data-testid="filter-topic-aboriginal-and-torres-strait-islander"] input').check();
                await expect(page.locator('[data-testid="dlor-panel-validity-indicator-3"] span')).toContainText('5'); // panel invalidity count present
                await expect(page.getByTestId('admin-dlor-save-button-submit')).toBeDisabled();

                await page.locator('[data-testid="filter-media-format-audio"] input').check();
                await expect(page.locator('[data-testid="dlor-panel-validity-indicator-3"] span')).toContainText('4');
                await expect(page.getByTestId('admin-dlor-save-button-submit')).toBeDisabled();

                await page.locator('[data-testid="filter-subject-cross-disciplinary"] input').check();
                await expect(page.locator('[data-testid="dlor-panel-validity-indicator-3"] span')).toContainText('3');
                await expect(page.getByTestId('admin-dlor-save-button-submit')).toBeDisabled();

                await page.locator('[data-testid="filter-item-type-guide"] input').check();
                await expect(page.locator('[data-testid="dlor-panel-validity-indicator-3"] span')).toContainText('2');
                await expect(page.getByTestId('admin-dlor-save-button-submit')).toBeDisabled();

                await page.locator('[data-testid="filter-licence-cc-by-attribution"] input').check();
                await expect(page.locator('[data-testid="dlor-panel-validity-indicator-3"] span')).toContainText('1');
                await expect(page.getByTestId('admin-dlor-save-button-submit')).toBeDisabled();

                await page
                    .locator('[data-testid="object-keywords"] textarea:first-child')
                    .fill('a'.padEnd(REQUIRED_LENGTH_KEYWORDS, 'x'));

                await expect(page.getByTestId('dlor-panel-validity-indicator-3')).not.toBeVisible();
                await expect(page.getByTestId('admin-dlor-save-button-submit')).toBeEnabled();

                // now go back and invalidate each field one at a time and show the button disables on each field
                await page
                    .locator('[data-testid="filter-topic-aboriginal-and-torres-strait-islander"] input')
                    .uncheck();
                await expect(page.locator('[data-testid="dlor-panel-validity-indicator-3"] span')).toContainText('1');
                await expect(page.getByTestId('admin-dlor-save-button-submit')).toBeDisabled();
                await page.locator('[data-testid="filter-topic-aboriginal-and-torres-strait-islander"] input').check();

                await page.locator('[data-testid="filter-subject-cross-disciplinary"] input').uncheck();
                await expect(page.locator('[data-testid="dlor-panel-validity-indicator-3"] span')).toContainText('1');
                await expect(page.getByTestId('admin-dlor-save-button-submit')).toBeDisabled();
                await page.locator('[data-testid="filter-subject-cross-disciplinary"] input').check();

                await page.locator('[data-testid="filter-media-format-audio"] input').uncheck();
                await expect(page.locator('[data-testid="dlor-panel-validity-indicator-3"] span')).toContainText('1');
                await expect(page.getByTestId('admin-dlor-save-button-submit')).toBeDisabled();
                await page.locator('[data-testid="filter-media-format-audio"] input').check();

                // (cant uncheck a radio button)

                // click the back button to go back to panel 3, Link
                await page.getByTestId('dlor-form-back-button').click();
                await page.locator('[data-testid="object-link-url"] input').fill('');
                await expect(page.locator('[data-testid="dlor-panel-validity-indicator-2"] span')).toContainText('1');
                await page.locator('[data-testid="object-link-url"] input').fill('http://');
                await expect(page.locator('[data-testid="dlor-panel-validity-indicator-2"] span')).toContainText('1');
                await page.locator('[data-testid="object-link-url"] input').fill('http://ex.c');
                await expect(page.locator('[data-testid="dlor-panel-validity-indicator-2"] span')).toContainText('1');
                await page.locator('[data-testid="object-link-url"] input').fill('http://example.com');
                await expect(page.getByTestId('dlor-panel-validity-indicator-2')).not.toBeVisible();

                // click the back button to go back to panel 2, Description
                await page.getByTestId('dlor-form-back-button').click();
                await expect(page.getByTestId('dlor-panel-validity-indicator-1')).not.toBeVisible();
                await page.locator('[data-testid="object-title"] input').press('End');
                await page.locator('[data-testid="object-title"] input').press('Backspace');
                await expect(page.locator('[data-testid="dlor-panel-validity-indicator-1"] span')).toContainText('1');
                await page.locator('[data-testid="object-title"] input').pressSequentially('p');
                await expect(page.getByTestId('dlor-panel-validity-indicator-1')).not.toBeVisible();

                await typeCKEditor(page, undefined, 'd');
                await expect(page.locator('[data-testid="dlor-panel-validity-indicator-1"] span')).toContainText('1');

                await typeCKEditor(page, undefined, 'new description '.padEnd(REQUIRED_LENGTH_DESCRIPTION, 'x'));
                await expect(page.getByTestId('dlor-panel-validity-indicator-1')).not.toBeVisible();

                await page.locator('[data-testid="object-summary"] textarea:first-child').fill('');
                await expect(page.locator('[data-testid="dlor-panel-validity-indicator-1"] span')).toContainText('1');
                await page
                    .locator('[data-testid="object-summary"] textarea:first-child')
                    .fill('new description '.padEnd(REQUIRED_LENGTH_DESCRIPTION, 'x'));
                await expect(page.getByTestId('dlor-panel-validity-indicator-1')).not.toBeVisible();

                // click the back button to go back to panel 1, Ownership
                await page.getByTestId('dlor-form-back-button').click();

                await expect(page.getByTestId('dlor-panel-validity-indicator-0')).not.toBeVisible();
                for (let i = 0; i < 5; i++) {
                    await page.locator('[data-testid="object-publishing-user"] input').press('End');
                    await page.locator('[data-testid="object-publishing-user"] input').press('Backspace');
                }
                await expect(page.getByTestId('dlor-form-error-message-object-publishing-user')).toContainText(
                    'This username is not valid.',
                );
                await expect(page.locator('[data-testid="dlor-panel-validity-indicator-0"] span')).toContainText('1');
                await page.locator('[data-testid="object-publishing-user"] input').press('p');
                await expect(page.getByTestId('dlor-panel-validity-indicator-0')).not.toBeVisible();
                await expect(page.getByTestId('dlor-form-error-message-object-publishing-user')).not.toBeVisible();

                await page.waitForSelector('[data-testid="object-owning-team"]');
                await page.getByTestId('object-owning-team').click();
                await page.getByTestId('object-form-teamid-new').click();

                // now that we have chosen "new team" the form is invalid until we enter all 3 fields
                await expect(page.locator('[data-testid="dlor-panel-validity-indicator-0"] span')).toContainText('3');
                await page.locator('[data-testid="dlor-form-team-name-new"] input').fill('new team name');
                await expect(page.locator('[data-testid="dlor-panel-validity-indicator-0"] span')).toContainText('2');
                await page.locator('[data-testid="dlor-form-team-manager-new"] input').fill('john Manager');
                await expect(page.locator('[data-testid="dlor-panel-validity-indicator-0"] span')).toContainText('1');
                await expect(page.getByTestId('error-message-team-email-new')).toContainText(
                    'This email address is not valid.',
                );
                await page.locator('[data-testid="dlor-form-team-email-new"] input').fill('john@example.com');
                await expect(page.getByTestId('dlor-panel-validity-indicator-0')).not.toBeVisible();

                // change to one of the existing teams
                await page.getByTestId('object-owning-team').click();
                await page.getByTestId('object-owning-team-1').click();
                await expect(page.getByTestId('dlor-panel-validity-indicator-0')).not.toBeVisible();
            });

            test('shows character minimums', async ({ page }) => {
                await page.getByTestId('dlor-form-next-button').click();

                const titleInput = page.locator('[data-testid="object-title"] input');
                await titleInput.fill('123');
                await expect(page.getByTestId('input-characters-remaining-object-title')).toContainText(
                    'at least 5 more characters needed',
                );

                await typeCKEditor(page, undefined, 'new description');
                await expect(page.getByTestId('input-characters-remaining-object-description')).toContainText(
                    'at least 85 more characters needed',
                );

                const summaryInput = page.locator('[data-testid="object-summary"] textarea:first-child');
                await summaryInput.fill('new summary');
                await expect(page.getByTestId('input-characters-remaining-object-summary')).toContainText(
                    'at least 9 more characters needed',
                );

                // Go to panel 4
                await page.getByTestId('dlor-form-next-button').click();
                await page.getByTestId('dlor-form-next-button').click();

                const keywordsInput = page.locator('[data-testid="object-keywords"] textarea:first-child');
                await keywordsInput.fill('abc');
                await expect(page.getByTestId('input-characters-remaining-object-keywords-string')).toContainText(
                    'at least 1 more character needed',
                );
            });

            test('supplies a summary suggestion', async ({ page }) => {
                await page.getByTestId('dlor-form-next-button').click();

                await expect(page.getByTestId('admin-dlor-suggest-summary')).not.toBeVisible();

                const longDescription =
                    'The quick brown fox jumped over the lazy yellow dog and ran into the woods. The hunters blew their horns and the hounds bayed and the whole troop followed the fox.';
                await typeCKEditor(page, undefined, longDescription);

                await expect(page.getByTestId('admin-dlor-suggest-summary')).toBeVisible();
                await expect(page.getByTestId('admin-dlor-suggest-summary-content')).toHaveText(
                    'The quick brown fox jumped over the lazy yellow dog and ran into the woods.',
                );

                await page.getByTestId('admin-dlor-suggest-summary-close-button').click();
                await expect(page.getByTestId('admin-dlor-suggest-summary')).not.toBeVisible();

                await typeCKEditor(page, undefined, `${longDescription}\na second paragraph`);

                await expect(page.getByTestId('admin-dlor-suggest-summary-content')).toHaveText(
                    'The quick brown fox jumped over the lazy yellow dog and ran into the woods.',
                );
                await expect(page.getByTestId('admin-dlor-suggest-summary')).toBeVisible();

                await expect(page.locator('[data-testid="object-summary"] textarea').first()).toHaveValue('');
                await expect(page.locator('[data-testid="dlor-panel-validity-indicator-1"] span')).toContainText('2');

                await page.getByTestId('admin-dlor-suggest-summary-button').click();
                await expect(page.getByTestId('admin-dlor-suggest-summary')).not.toBeVisible();
                await expect(page.locator('[data-testid="dlor-panel-validity-indicator-1"] span')).toContainText('1');
            });

            test('shows a "will preview" notice correctly', async ({ page }) => {
                await page.getByTestId('dlor-form-next-button').click();
                await page.getByTestId('dlor-form-next-button').click();

                const urlInput = page.locator('[data-testid="object-link-url"] input');
                await urlInput.fill('http://www.youtube.com/rew');
                await expect(page.getByTestId('object-link-url-preview')).not.toBeVisible();

                await urlInput.fill('http://www.youtube.com/rewdf');
                await expect(page.getByTestId('object-link-url-preview')).toContainText(
                    'A preview will show on the View page.',
                );

                await urlInput.fill('http://www.youtube.com/?g=123456');
                await expect(page.getByTestId('object-link-url-preview')).not.toBeVisible();

                await urlInput.fill('http://www.youtube.com/?v=123456');
                await expect(page.getByTestId('object-link-url-preview')).toContainText(
                    'A preview will show on the View page.',
                );

                await urlInput.fill('http://www.example.com/something');
                await expect(page.getByTestId('object-link-url-preview')).not.toBeVisible();
            });
        });

        test.describe('successfully mock to db', () => {
            test.beforeEach(async ({ page, context }) => {
                await context.addCookies([
                    {
                        name: 'CYPRESS_TEST_DATA',
                        value: 'active',
                        url: 'http://localhost:2020',
                    },
                ]);
                await page.goto(`http://localhost:2020/admin/dlor/add?user=${DLOR_ADMIN_USER}`);
                await page.setViewportSize({ width: 1300, height: 1000 });
            });

            test('when the admin changes their mind about a new team, an old team is saved', async ({ page }) => {
                const cookie = await page.context().cookies();
                expect(cookie.some(c => c.name === 'CYPRESS_TEST_DATA' && c.value === 'active')).toBeTruthy();

                await page.getByTestId('object-owning-team').click();
                await page.getByTestId('object-form-teamid-new').click();

                await page.locator('[data-testid="dlor-form-team-name-new"] input').fill('new team name');
                await page.locator('[data-testid="dlor-form-team-manager-new"] input').fill('john Manager');
                await page.locator('[data-testid="dlor-form-team-email-new"] input').fill('john@example.com');

                await typeCKEditor(page, undefined, 'This is the admin notes');
                await page.getByTestId('dlor-form-next-button').click();

                await page.locator('[data-testid="object-title"] input').fill('x'.padEnd(REQUIRED_LENGTH_TITLE, 'x'));
                await typeCKEditor(page, undefined, 'new description'.padEnd(REQUIRED_LENGTH_DESCRIPTION, 'x'));
                await page
                    .locator('[data-testid="object-summary"] textarea:first-child')
                    .fill('new summary '.padEnd(REQUIRED_LENGTH_SUMMARY, 'x'));
                await page.locator('[data-testid="object-is-featured"] input').check();

                await page.getByTestId('dlor-form-back-button').click();
                await page.getByTestId('object-owning-team').click();
                await page.locator('[data-value="3"]').click();

                await page.getByTestId('dlor-form-next-button').click();
                await page.getByTestId('dlor-form-next-button').click();

                await page.locator('[data-testid="object-link-url"] input').fill('http://example.com');
                await page.getByTestId('dlor-form-next-button').click();

                await page.locator('[data-testid="filter-topic-aboriginal-and-torres-strait-islander"] input').check();
                await page.locator('[data-testid="filter-topic-assignments"] input').check();
                await page.locator('[data-testid="filter-media-format-audio"] input').check();
                await page.locator('[data-testid="filter-media-format-h5p"] input').check();
                await page.locator('[data-testid="filter-subject-cross-disciplinary"] input').check();
                await page.locator('[data-testid="filter-subject-business-economics"] input').check();
                await page.locator('[data-testid="filter-item-type-interactive"] input').check();
                await page.locator('[data-testid="filter-licence-cc-by-nc-attribution-noncommercial"] input').check();
                await page.locator('[data-testid="object-keywords"] textarea:first-child').fill('cat, dog');

                await page.getByTestId('admin-dlor-save-button-submit').click();

                await expect(page.locator('[data-testid="dialogbox-dlor-save-outcome"] h2')).toContainText(
                    'The object has been created',
                );
                await expect(page.getByTestId('confirm-dlor-save-outcome')).toContainText('Return to list page');
                await expect(page.getByTestId('cancel-dlor-save-outcome')).toContainText('Add another Object');

                const expectedValues = {
                    object_admin_notes: '<p>This is the admin notes</p>',
                    object_title: 'xxxxxxxx',
                    object_description:
                        '<p>new descriptionxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</p>',
                    object_summary: 'new summary xxxxxxxx',
                    object_link_interaction_type: 'none',
                    object_link_url: 'http://example.com',
                    object_download_instructions: 'Add this object to your course.',
                    object_is_featured: 1,
                    object_cultural_advice: 0,
                    object_publishing_user: 'dloradmn',
                    object_review_date_next: '2025-03-26T00:01',
                    object_status: 'new',
                    object_restrict_to: 'none',
                    object_owning_team_id: 3,
                    object_keywords: ['cat', 'dog'],
                    facets: [
                        1, // aboriginal_and_torres_strait_islander
                        2, // assignments
                        22, // media_audio
                        24, // media_h5p
                        34, // all_cross_disciplinary
                        35, // business_economics
                        17, // type_interactive_activity
                        45, // cc_by_nc_attribution_noncommercial
                    ],
                };

                const cookieValue = await page.evaluate(() => {
                    return document.cookie
                        .split('; ')
                        .find(row => row.startsWith('CYPRESS_DATA_SAVED='))
                        ?.split('=')[1];
                });

                expect(cookieValue).toBeDefined();
                const decodedValue = decodeURIComponent(cookieValue);
                const sentValues = JSON.parse(decodedValue);

                // had trouble comparing the entire structure
                const sentFacets = sentValues.facets;
                const expectedFacets = expectedValues.facets;
                const sentKeywords = sentValues.object_keywords;
                const expectedKeywords = expectedValues.object_keywords;
                delete sentValues.facets;
                delete expectedValues.facets;
                // delete sentValues.object_description;
                // delete expectedValues.object_description;
                delete sentValues.object_keywords;
                delete expectedValues.object_keywords;
                delete sentValues.object_review_date_next; // doesn't seem valid to figure out the date
                delete expectedValues.object_review_date_next;

                expect(sentValues).toEqual(expectedValues);
                expect(sentFacets).toEqual(expectedFacets);
                expect(sentKeywords).toEqual(expectedKeywords);

                await page.getByTestId('confirm-dlor-save-outcome').click();
                await expect(page).toHaveURL(`http://localhost:2020/admin/dlor?user=${DLOR_ADMIN_USER}`);
                await expect(page.getByTestId('StandardPage-title')).toContainText('Digital Learning Hub Management');
            });
        });

        test.describe('fails correctly', () => {
            test('admin gets an error when Teams list api doesnt load', async ({ page }) => {
                await page.goto(
                    `http://localhost:2020/admin/dlor/add?user=${DLOR_ADMIN_USER}&responseType=teamsLoadError`,
                );
                await expect(page.getByTestId('dlor-form-addedit-error')).toContainText(
                    'An error has occurred during the request and this request cannot be processed',
                );
            });

            test('admin gets an error when Filter list api doesnt load', async ({ page }) => {
                await page.goto(
                    `http://localhost:2020/admin/dlor/add?user=${DLOR_ADMIN_USER}&responseType=filterLoadError`,
                );
                await expect(page.getByTestId('dlor-homepage-error')).toContainText(
                    'An error has occurred during the request and this request cannot be processed',
                );
            });

            test('admin gets an error when Filter list is empty', async ({ page }) => {
                await page.goto(
                    `http://localhost:2020/admin/dlor/add?user=${DLOR_ADMIN_USER}&responseType=filterLoadEmpty`,
                );
                await expect(page.getByTestId('dlor-homepage-noresult')).toContainText(
                    'Missing filters: We did not find any entries in the system - please try again later.',
                );
            });

            test('admin gets an error on a failed save', async ({ page }) => {
                await page.goto(`http://localhost:2020/admin/dlor/add?user=${DLOR_ADMIN_USER}&responseType=saveError`);

                await page.getByTestId('dlor-form-next-button').click();
                await page.locator('[data-testid="object-title"] input').fill('x'.padEnd(REQUIRED_LENGTH_TITLE, 'x'));
                await typeCKEditor(page, undefined, 'new description'.padEnd(REQUIRED_LENGTH_DESCRIPTION, 'x'));
                await page
                    .locator('[data-testid="object-summary"] textarea:first-child')
                    .fill('new summary '.padEnd(REQUIRED_LENGTH_SUMMARY, 'x'));

                await page.getByTestId('dlor-form-next-button').click();
                await page.locator('[data-testid="object-link-url"] input').fill('http://example.com');

                await page.getByTestId('dlor-form-next-button').click();
                await page.locator('[data-testid="filter-topic-digital-skills"] input').check();
                await page.locator('[data-testid="filter-media-format-dataset"] input').check();
                await page
                    .locator('[data-testid="filter-subject-engineering-architecture-information-technology"] input')
                    .check();
                await page.locator('[data-testid="filter-item-type-module"] input').check();
                await page.locator('[data-testid="filter-licence-cc0public-domain"] input').check();
                await page.locator('[data-testid="object-keywords"] textarea:first-child').fill('cat, dog');

                await page.getByTestId('admin-dlor-save-button-submit').click();

                await expect(page.locator('[data-testid="dialogbox-dlor-save-outcome"] h2')).toContainText(
                    'An error has occurred during the request and this request cannot be processed',
                );
                await expect(page.getByTestId('confirm-dlor-save-outcome')).toContainText('Return to list page');
                await expect(page.getByTestId('cancel-dlor-save-outcome')).toContainText('Add another Object');
            });
        });
    });

    test.describe('user access', () => {
        test('displays an "unauthorised" page to public users', async ({ page }) => {
            await page.goto('http://localhost:2020/admin/dlor/add?user=public');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.locator('h1').first()).toContainText('Authentication required');
        });

        test('displays an "unauthorised" page to non-authorised users', async ({ page }) => {
            await page.goto('http://localhost:2020/admin/dlor/add?user=uqstaff');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.locator('h1').first()).toContainText('Permission denied');
        });

        test('displays correct page for admin users (list)', async ({ page }) => {
            await page.goto(`http://localhost:2020/admin/dlor/add?user=${DLOR_ADMIN_USER}`);
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.locator('h1').first()).toContainText('Digital Learning Hub Management');
        });
    });
});
