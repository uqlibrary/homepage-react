import { test, expect } from '@uq/pw/test';
import { assertAccessibility } from '@uq/pw/lib/axe';
import { DLOR_ADMIN_USER } from '@uq/pw/lib/constants';
import { typeCKEditor } from '@uq/pw/lib/ckeditor';
import moment from 'moment-timezone';
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
                await expect(page.locator('h1').getByText('Digital Learning Hub Management')).toBeVisible();

                // first panel is accessible
                await assertAccessibility(page, '[data-testid="StandardPage"]');

                const today = moment().format('DD/MM/YYYY');
                const reviewDateInput = page.locator('[data-testid="object-review-date"] input');
                await reviewDateInput.click();
                await reviewDateInput.fill(today);
                await reviewDateInput.blur();
                await expect(reviewDateInput).toHaveValue(today);

                await typeCKEditor(page, 'This is the admin notes');

                // go to the second panel, Description
                await page.getByTestId('dlor-form-next-button').click();
                await expect(page.getByTestId('object-title')).toBeVisible();
                await assertAccessibility(page, '[data-testid="StandardPage"]');

                // go to the third panel, Link
                await page.getByTestId('dlor-form-next-button').click();
                await expect(page.getByTestId('object-link-url')).toBeVisible();
                await assertAccessibility(page, '[data-testid="StandardPage"]');

                // go to the fourth panel, Filtering
                await page.getByTestId('dlor-form-next-button').click();
                await expect(page.getByTestId('filter-topic-aboriginal-and-torres-strait-islander')).toBeVisible();
                await assertAccessibility(page, '[data-testid="StandardPage"]');
            });

            test('has breadcrumb', async ({ page }) => {
                await expect(
                    page
                        .locator('uq-site-header')
                        .getByTestId('subsite-title')
                        .getByText('Digital learning hub admin'),
                ).toBeVisible();
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

                // go to description panel
                await page.getByTestId('dlor-form-next-button').click();

                // go to link panel
                await page.getByTestId('dlor-form-next-button').click();

                // go to filter panel
                await page.getByTestId('dlor-form-next-button').click();

                // no notify checkbox
                await expect(page.locator('[data-testid="choose-notify"] input')).not.toBeVisible();
            });

            test('validates fields correctly', async ({ page }, testInfo) => {
                test.setTimeout(testInfo.timeout + 30_000);

                // first enter all the fields and show the save button doesn't enable until all the fields are entered

                // team starts off valid so click on to the second panel, description

                const today = moment().format('DD/MM/YYYY'); // Australian format to match the display format

                await expect(page.locator('[data-testid="dlor-panel-validity-indicator-1"] span')).not.toBeVisible();

                await page.locator('[data-testid="object-review-date"] input').click();
                await page.locator('[data-testid="object-review-date"] input').clear();
                await page.locator('[data-testid="object-review-date"] input').fill(today);
                await page.locator('[data-testid="object-review-date"] input').blur();
                await expect(page.locator('[data-testid="object-review-date"] input')).toHaveValue(today);

                await page.getByTestId('dlor-form-next-button').click();

                await expect(
                    page.locator('[data-testid="dlor-panel-validity-indicator-1"] span').getByText('3'),
                ).toBeVisible(); // panel invalidity count present
                await page.locator('[data-testid="object-title"] input').fill('xx'.padEnd(REQUIRED_LENGTH_TITLE, 'x'));
                await expect(
                    page.locator('[data-testid="dlor-panel-validity-indicator-1"] span').getByText('2'),
                ).toBeVisible(); // panel invalidity count present
                await typeCKEditor(page, 'new description '.padEnd(REQUIRED_LENGTH_DESCRIPTION, 'x'));

                await expect(
                    page.locator('[data-testid="dlor-panel-validity-indicator-1"] span').getByText('1'),
                ).toBeVisible(); // panel invalidity count present
                await page
                    .locator('[data-testid="object-summary"] textarea:first-child')
                    .fill('new summary '.padEnd(REQUIRED_LENGTH_SUMMARY, 'x'));
                await expect(page.getByTestId('dlor-panel-validity-indicator-1')).not.toBeVisible(); // panel invalidity count not present

                // click 'next' button to view panel 3, Link
                await page.getByTestId('dlor-form-next-button').click();
                await expect(
                    page.locator('[data-testid="dlor-panel-validity-indicator-2"] span').getByText('1'),
                ).toBeVisible(); // panel invalidity count present

                await page.locator('[data-testid="object-link-url"] input').fill('asdasdasdsadd');
                await page.waitForSelector('[data-testid="dlor-form-error-message-object-link-url"]');
                await expect(
                    page
                        .getByTestId('dlor-form-error-message-object-link-url')
                        .getByText('This web address is not valid.'),
                ).toBeVisible();
                await page.locator('[data-testid="object-link-url"] input').clear();
                await page.locator('[data-testid="object-link-url"] input').fill('http://example.com');
                await expect(page.getByTestId('dlor-panel-validity-indicator-2')).not.toBeVisible(); // panel invalidity count not present

                // click 'next' button to view panel 4, Filters
                await page.getByTestId('dlor-form-next-button').click();
                // filters
                await page.locator('[data-testid="filter-topic-aboriginal-and-torres-strait-islander"] input').check();
                await expect(
                    page.locator('[data-testid="dlor-panel-validity-indicator-3"] span').getByText('5'),
                ).toBeVisible(); // panel invalidity count present
                await expect(page.getByTestId('admin-dlor-save-button-submit')).toBeDisabled();

                await page.locator('[data-testid="filter-media-format-audio"] input').check();
                await expect(
                    page.locator('[data-testid="dlor-panel-validity-indicator-3"] span').getByText('4'),
                ).toBeVisible();
                await expect(page.getByTestId('admin-dlor-save-button-submit')).toBeDisabled();

                await page.locator('[data-testid="filter-subject-cross-disciplinary"] input').check();
                await expect(
                    page.locator('[data-testid="dlor-panel-validity-indicator-3"] span').getByText('3'),
                ).toBeVisible();
                await expect(page.getByTestId('admin-dlor-save-button-submit')).toBeDisabled();

                await page.locator('[data-testid="filter-item-type-guide"] input').check();
                await expect(
                    page.locator('[data-testid="dlor-panel-validity-indicator-3"] span').getByText('2'),
                ).toBeVisible();
                await expect(page.getByTestId('admin-dlor-save-button-submit')).toBeDisabled();

                await page.locator('[data-testid="filter-licence-cc-by-attribution"] input').check();
                await expect(
                    page.locator('[data-testid="dlor-panel-validity-indicator-3"] span').getByText('1'),
                ).toBeVisible();
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
                await expect(
                    page.locator('[data-testid="dlor-panel-validity-indicator-3"] span').getByText('1'),
                ).toBeVisible();
                await expect(page.getByTestId('admin-dlor-save-button-submit')).toBeDisabled();
                await page.locator('[data-testid="filter-topic-aboriginal-and-torres-strait-islander"] input').check();

                await page.locator('[data-testid="filter-subject-cross-disciplinary"] input').uncheck();
                await expect(
                    page.locator('[data-testid="dlor-panel-validity-indicator-3"] span').getByText('1'),
                ).toBeVisible();
                await expect(page.getByTestId('admin-dlor-save-button-submit')).toBeDisabled();
                await page.locator('[data-testid="filter-subject-cross-disciplinary"] input').check();

                await page.locator('[data-testid="filter-media-format-audio"] input').uncheck();
                await expect(
                    page.locator('[data-testid="dlor-panel-validity-indicator-3"] span').getByText('1'),
                ).toBeVisible();
                await expect(page.getByTestId('admin-dlor-save-button-submit')).toBeDisabled();
                await page.locator('[data-testid="filter-media-format-audio"] input').check();

                // (cant uncheck a radio button)

                // click the back button to go back to panel 3, Link
                await page.getByTestId('dlor-form-back-button').click();
                await page.locator('[data-testid="object-link-url"] input').clear();
                await expect(
                    page.locator('[data-testid="dlor-panel-validity-indicator-2"] span').getByText('1'),
                ).toBeVisible();
                await page.locator('[data-testid="object-link-url"] input').fill('http://');
                await expect(
                    page.locator('[data-testid="dlor-panel-validity-indicator-2"] span').getByText('1'),
                ).toBeVisible();
                await page.locator('[data-testid="object-link-url"] input').fill('http://ex.c');
                await expect(
                    page.locator('[data-testid="dlor-panel-validity-indicator-2"] span').getByText('1'),
                ).toBeVisible();
                await page.locator('[data-testid="object-link-url"] input').fill('http://example.com');
                await expect(page.getByTestId('dlor-panel-validity-indicator-2')).not.toBeVisible();

                // click the back button to go back to panel 2, Description
                await page.getByTestId('dlor-form-back-button').click();
                await expect(page.getByTestId('dlor-panel-validity-indicator-1')).not.toBeVisible();
                await page.locator('[data-testid="object-title"] input').fill('xxxxxxx');
                await expect(
                    page
                        .locator('[data-testid="dlor-panel-validity-indicator-1"] span')
                        .getByText('1')
                        .first(),
                ).toBeVisible();
                await page.locator('[data-testid="object-title"] input').pressSequentially('p');
                await expect(page.getByTestId('dlor-panel-validity-indicator-1')).not.toBeVisible();

                await typeCKEditor(page, 'd');
                await expect(
                    page.locator('[data-testid="dlor-panel-validity-indicator-1"] span').getByText('1'),
                ).toBeVisible();

                await typeCKEditor(page, 'new description '.padEnd(REQUIRED_LENGTH_DESCRIPTION, 'x'));
                await expect(page.getByTestId('dlor-panel-validity-indicator-1')).not.toBeVisible();

                await page.locator('[data-testid="object-summary"] textarea:first-child').clear();
                await expect(
                    page.locator('[data-testid="dlor-panel-validity-indicator-1"] span').getByText('1'),
                ).toBeVisible();
                await page
                    .locator('[data-testid="object-summary"] textarea:first-child')
                    .fill('new description '.padEnd(REQUIRED_LENGTH_DESCRIPTION, 'x'));
                await expect(page.getByTestId('dlor-panel-validity-indicator-1')).not.toBeVisible();

                // click the back button to go back to panel 1, Ownership
                await page.getByTestId('dlor-form-back-button').click();

                await expect(page.getByTestId('dlor-panel-validity-indicator-0')).not.toBeVisible();
                await page.locator('[data-testid="object-publishing-user"] input').fill('dlo');
                await expect(
                    page
                        .getByTestId('dlor-form-error-message-object-publishing-user')
                        .getByText('This username is not valid.'),
                ).toBeVisible();
                await expect(
                    page.locator('[data-testid="dlor-panel-validity-indicator-0"] span').getByText('1'),
                ).toBeVisible();
                await page.locator('[data-testid="object-publishing-user"] input').press('p');
                await expect(page.getByTestId('dlor-panel-validity-indicator-0')).not.toBeVisible();
                await expect(page.getByTestId('dlor-form-error-message-object-publishing-user')).not.toBeVisible();

                await page.getByTestId('object-owning-team').click();
                await page.getByTestId('object-form-teamid-new').click();

                // now that we have chosen "new team" the form is invalid until we enter all 3 fields
                await expect(
                    page.locator('[data-testid="dlor-panel-validity-indicator-0"] span').getByText('3'),
                ).toBeVisible();
                await page.locator('[data-testid="dlor-form-team-name-new"] input').fill('new team name');
                await expect(
                    page.locator('[data-testid="dlor-panel-validity-indicator-0"] span').getByText('2'),
                ).toBeVisible();
                await page.locator('[data-testid="dlor-form-team-manager-new"] input').fill('john Manager');
                await expect(
                    page.locator('[data-testid="dlor-panel-validity-indicator-0"] span').getByText('1'),
                ).toBeVisible();
                await expect(
                    page.getByTestId('error-message-team-email-new').getByText('This email address is not valid.'),
                ).toBeVisible();
                await page.locator('[data-testid="dlor-form-team-email-new"] input').fill('john@example.com');
                await expect(page.getByTestId('dlor-panel-validity-indicator-0')).not.toBeVisible();

                // change to one of the existing teams
                await page.getByTestId('object-owning-team').click();
                await page.getByTestId('object-owning-team-1').click();
                await expect(page.getByTestId('dlor-panel-validity-indicator-0')).not.toBeVisible();
            });

            test('shows character minimums', async ({ page }) => {
                // go to the second panel, description
                await page.getByTestId('dlor-form-next-button').click();

                const titleInput = page.locator('[data-testid="object-title"] input');
                await titleInput.fill('123');
                await expect(
                    page
                        .getByTestId('input-characters-remaining-object-title')
                        .getByText('at least 5 more characters needed'),
                ).toBeVisible();
                await typeCKEditor(page, 'new description');
                await expect(
                    page
                        .getByTestId('input-characters-remaining-object-description')
                        .getByText('at least 85 more characters needed'),
                ).toBeVisible();
                const summaryInput = page.locator('[data-testid="object-summary"] textarea:first-child');
                await summaryInput.fill('new summary');
                await expect(
                    page
                        .getByTestId('input-characters-remaining-object-summary')
                        .getByText('at least 9 more characters needed'),
                ).toBeVisible();

                // go to the fourth panel, links
                await page.getByTestId('dlor-form-next-button').click();
                await page.getByTestId('dlor-form-next-button').click();

                const keywordsInput = page.locator('[data-testid="object-keywords"] textarea:first-child');
                await keywordsInput.fill('abc');
                await expect(
                    page
                        .getByTestId('input-characters-remaining-object-keywords-string')
                        .getByText('at least 1 more character needed'),
                ).toBeVisible();
            });

            test('supplies a summary suggestion', async ({ page }) => {
                // go to the second step, Description
                await page.getByTestId('dlor-form-next-button').click();

                // suggestion panel not open
                await expect(page.getByTestId('admin-dlor-suggest-summary')).not.toBeVisible();

                // a long description puts the first 150 char, breaking at a word break, into the summary suggestion
                const longDescription =
                    'The quick brown fox jumped over the lazy yellow dog and ran into the woods. The hunters blew their horns and the hounds bayed and the whole troop followed the fox.';
                await typeCKEditor(page, longDescription);

                // suggestion panel is now open
                await expect(page.getByTestId('admin-dlor-suggest-summary')).toBeVisible();
                // subset of description has appeared in suggestion panel
                await expect(page.getByTestId('admin-dlor-suggest-summary-content')).toHaveText(
                    'The quick brown fox jumped over the lazy yellow dog and ran into the woods.',
                );

                await page.getByTestId('admin-dlor-suggest-summary-close-button').click();
                // suggestion panel is hidden
                await expect(page.getByTestId('admin-dlor-suggest-summary')).not.toBeVisible();

                // suggestion panel picks up first paragraph on carriage return after minimum char count
                await typeCKEditor(page, `${longDescription}\na second paragraph`);

                await expect(page.getByTestId('admin-dlor-suggest-summary-content')).toHaveText(
                    'The quick brown fox jumped over the lazy yellow dog and ran into the woods.',
                );
                // suggestion panel is open again because they changed the description
                await expect(page.getByTestId('admin-dlor-suggest-summary')).toBeVisible();

                // summary currently blank
                await expect(page.locator('[data-testid="object-summary"] textarea').first()).toHaveValue('');
                // step 2 validation number = 2 because title and summary not set
                await expect(
                    page.locator('[data-testid="dlor-panel-validity-indicator-1"] span').getByText('2'),
                ).toBeVisible();
                // click "use summary" button
                await page.getByTestId('admin-dlor-suggest-summary-button').click();
                await expect(page.getByTestId('admin-dlor-suggest-summary')).not.toBeVisible();
                // step 2 validation number = 1, only title not set
                await expect(
                    page.locator('[data-testid="dlor-panel-validity-indicator-1"] span').getByText('1'),
                ).toBeVisible();
            });

            test('shows a "will preview" notice correctly', async ({ page }) => {
                // go to the third step, links
                await page.getByTestId('dlor-form-next-button').click();
                await page.getByTestId('dlor-form-next-button').click();

                // youtube link in shorthand format
                // a youtube link that they havent yet typed completely doesnt give a message
                // (although hopefully they will paste and wont see this - pasting is more accurate)
                const urlInput = page.locator('[data-testid="object-link-url"] input');
                await urlInput.fill('http://www.youtube.com/rew');
                await expect(page.getByTestId('object-link-url-preview')).not.toBeVisible();

                // finish typing to make a valid youtube shorthand url
                await urlInput.pressSequentially('df');
                // once the youtube link is long enough to maybe be a valid youtube link, show a "will preview" message
                await expect(
                    page.getByTestId('object-link-url-preview').getByText('A preview will show on the View page.'),
                ).toBeVisible();

                // youtube link that is missing the v= paramater (and isnt a shorthand link)
                await urlInput.fill('http://www.youtube.com/?g=123456');
                await expect(page.getByTestId('object-link-url-preview')).not.toBeVisible();

                // youtube link that is a valid link with v= parameter
                await urlInput.fill('http://www.youtube.com/?v=123456');
                await expect(
                    page.getByTestId('object-link-url-preview').getByText('A preview will show on the View page.'),
                ).toBeVisible();

                // a link that won't preview doesn't show the "will preview" message
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

                // open teams drop down
                await page.getByTestId('object-owning-team').click();
                await page.getByTestId('object-form-teamid-new').click();

                // enter a new team
                await page.locator('[data-testid="dlor-form-team-name-new"] input').fill('new team name');
                await page.locator('[data-testid="dlor-form-team-manager-new"] input').fill('john Manager');
                await page.locator('[data-testid="dlor-form-team-email-new"] input').fill('john@example.com');

                await typeCKEditor(page, 'This is the admin notes');

                // go to the second panel, Description
                await page.getByTestId('dlor-form-next-button').click();

                await page.locator('[data-testid="object-title"] input').fill('x'.padEnd(REQUIRED_LENGTH_TITLE, 'x'));
                await typeCKEditor(page, 'new description'.padEnd(REQUIRED_LENGTH_DESCRIPTION, 'x'));
                await page
                    .locator('[data-testid="object-summary"] textarea:first-child')
                    .fill('new summary '.padEnd(REQUIRED_LENGTH_SUMMARY, 'x'));

                await page.locator('[data-testid="object-is-featured"] input').check();

                // go back to the first panel
                await page.getByTestId('dlor-form-back-button').click();
                // change mind about team and select 2nd team
                await page.getByTestId('object-owning-team').click();
                await page.locator('[data-value="3"]').click();

                // go to the third panel, Link
                await page.getByTestId('dlor-form-next-button').click();
                await page.getByTestId('dlor-form-next-button').click();

                await page.locator('[data-testid="object-link-url"] input').fill('http://example.com');

                // use default object_link_interaction_type
                // use blank download instructions

                // go to the fourth panel, Filtering
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

                // save new dlor
                await page.getByTestId('admin-dlor-save-button-submit').click();

                // confirm save happened
                await expect(
                    page
                        .locator('[data-testid="dialogbox-dlor-save-outcome"] h2')
                        .getByText('The object has been created'),
                ).toBeVisible();
                await expect(
                    page.getByTestId('confirm-dlor-save-outcome').getByText('Return to list page'),
                ).toBeVisible();
                await expect(
                    page.getByTestId('cancel-dlor-save-outcome').getByText('Add another Object'),
                ).toBeVisible();

                // check the data we pretended to send to the server matches what we expect
                // acts as check of what we sent to api
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
                {
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
                }

                // confirm save happened
                await expect(
                    page
                        .getByTestId('dialogbox-dlor-save-outcome')
                        .locator('h2')
                        .getByText('The object has been created'),
                ).toBeVisible();
                await expect(
                    page.getByTestId('confirm-dlor-save-outcome').getByText('Return to list page'),
                ).toBeVisible();
                await expect(
                    page.getByTestId('cancel-dlor-save-outcome').getByText('Add another Object'),
                ).toBeVisible();

                // and navigate back to the list page
                await page.getByTestId('confirm-dlor-save-outcome').click();
                await expect(page).toHaveURL(`http://localhost:2020/admin/dlor?user=${DLOR_ADMIN_USER}`);
                await expect(
                    page.getByTestId('StandardPage-title').getByText('Digital Learning Hub Management'),
                ).toBeVisible();
            });
            test('admin can create a new object for a new team and make it featured and return to list', async ({
                page,
                context,
            }) => {
                const cookie = await context
                    .cookies()
                    .then(cookies => cookies.find(c => c.name === 'CYPRESS_TEST_DATA'));
                expect(cookie).toBeDefined();
                expect(cookie?.value).toBe('active');

                // open teams drop down
                await page.getByTestId('object-owning-team').click();
                await page.getByTestId('object-form-teamid-new').click();

                // enter a new team
                await page.locator('[data-testid="dlor-form-team-name-new"] input').fill('new team name');
                await page.locator('[data-testid="dlor-form-team-manager-new"] input').fill('john Manager');
                await page.locator('[data-testid="dlor-form-team-email-new"] input').fill('john@example.com');

                // go to the second panel, Description
                await page.getByTestId('dlor-form-next-button').click();

                await page.locator('[data-testid="object-title"] input').fill('xx'.padEnd(REQUIRED_LENGTH_TITLE, 'x'));
                await typeCKEditor(page, 'new description'.padEnd(REQUIRED_LENGTH_DESCRIPTION, 'x'));
                await page
                    .locator('[data-testid="object-summary"] textarea:first-child')
                    .fill('new summary '.padEnd(REQUIRED_LENGTH_SUMMARY, 'x'));

                await expect(page.locator('[data-testid="object-is-featured"] input')).not.toBeChecked();
                await page.locator('[data-testid="object-is-featured"] input').check();

                // go to the third panel, Link
                await page.getByTestId('dlor-form-next-button').click();

                await page.locator('[data-testid="object-link-url"] input').fill('http://example.com');

                // accessible link message: a downloadable file that is an XLS of size 36 meg
                await expect(page.getByTestId('object-link-interaction-type').getByText('No message')).toBeVisible();

                await expect(page.getByTestId('object-link-file-type')).not.toBeVisible();
                await expect(page.getByTestId('object-link-duration-minutes')).not.toBeVisible();
                await expect(page.getByTestId('object-link-duration-seconds')).not.toBeVisible();
                await expect(page.getByTestId('object-link-size-units')).not.toBeVisible();
                await expect(page.getByTestId('object-link-size-amount')).not.toBeVisible();
                await page.getByTestId('object-link-interaction-type').click();
                await page.getByTestId('object-link-interaction-type-download').click();
                await expect(page.getByTestId('object-link-file-type')).toBeVisible();
                await expect(page.getByTestId('object-link-size-amount')).toBeVisible();
                await expect(page.getByTestId('object-link-size-units')).toBeVisible();
                await expect(page.getByTestId('object-link-duration-minutes')).not.toBeVisible();
                await expect(page.getByTestId('object-link-duration-seconds')).not.toBeVisible();
                // shows an error because they havent chosen a file type and a file size
                await expect(
                    page.locator('[data-testid="dlor-panel-validity-indicator-2"] span').getByText('2'),
                ).toBeVisible();

                // choose file type
                await page.getByTestId('object-link-file-type').click();
                await page.locator('[data-value="XLS"]').click();

                await expect(
                    page.locator('[data-testid="dlor-panel-validity-indicator-2"] span').getByText('1'),
                ).toBeVisible();

                // enter file size
                await page.locator('[data-testid="object-link-size-amount"] input').fill('36');
                await page.getByTestId('object-link-size-units').click();
                await page.locator('[data-value="MB"]').click();

                await expect(page.getByTestId('dlor-panel-validity-indicator-2')).not.toBeVisible();

                const typeableDownloadInstructions =
                    'Lorem ipsum dolor sit amet. In at sapien vel nisi congue fringilla. Maecenas non lacus dolor. Phasellus ornare condimentum est in cursus. Nam ac felis neque. Nulla at neque a mauris tristique ultrices ac ultrices ex. Suspendisse iaculis fermentum mi, non cursus augue eleifend in. Maecenas ut faucibus est. Phasellus a diam eget mauris feugiat vestibulum.';
                await typeCKEditor(page, typeableDownloadInstructions);

                // go to the fourth panel, Filtering
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
                await expect(page.getByTestId('admin-dlor-save-button-submit')).toBeEnabled();

                // save new dlor
                await page.getByTestId('admin-dlor-save-button-submit').click();

                // confirm save happened
                await expect(
                    page
                        .locator('[data-testid="dialogbox-dlor-save-outcome"] h2')
                        .getByText('The object has been created'),
                ).toBeVisible();
                await expect(
                    page.getByTestId('confirm-dlor-save-outcome').getByText('Return to list page'),
                ).toBeVisible();
                await expect(
                    page.getByTestId('cancel-dlor-save-outcome').getByText('Add another Object'),
                ).toBeVisible();

                // check the data we pretended to send to the server matches what we expect
                // acts as check of what we sent to api
                const expectedValues = {
                    object_title: 'xxxxxxxx',
                    object_description:
                        'new description xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
                    object_summary: 'new summary xxxxxxxx',
                    object_link_file_type: 'XLS',
                    object_link_interaction_type: 'download',
                    object_link_size: '36000',
                    object_link_url: 'http://example.com',
                    object_download_instructions: typeableDownloadInstructions,
                    object_is_featured: 1,
                    object_cultural_advice: 0,
                    object_publishing_user: 'dloradmn',
                    object_review_date_next: '2025-03-26T00:01',
                    object_status: 'new',
                    object_restrict_to: 'none',
                    team_email: 'john@example.com',
                    team_manager: 'john Manager',
                    team_name: 'new team name',
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

                {
                    const savedCookie = await context
                        .cookies()
                        .then(cookies => cookies.find(c => c.name === 'CYPRESS_DATA_SAVED'));
                    expect(savedCookie).toBeDefined();
                    const sentValues = JSON.parse(decodeURIComponent(savedCookie!.value));
                    expectedValues.object_description =
                        '<p>new descriptionxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</p>';

                    expectedValues.object_download_instructions = '<p>' + typeableDownloadInstructions + '</p>';

                    const sentFacets = sentValues.facets;
                    const expectedFacets = expectedValues.facets;
                    const sentKeywords = sentValues.object_keywords;
                    const expectedKeywords = expectedValues.object_keywords;
                    delete sentValues.facets;
                    delete expectedValues.facets;
                    delete sentValues.object_keywords;
                    delete expectedValues.object_keywords;
                    delete sentValues.object_review_date_next;
                    delete expectedValues.object_review_date_next;

                    expect(sentValues).toEqual(expectedValues);
                    expect(sentFacets).toEqual(expectedFacets);
                    expect(sentKeywords).toEqual(expectedKeywords);

                    await context.clearCookies();
                }

                // confirm save happened
                await expect(
                    page
                        .getByTestId('dialogbox-dlor-save-outcome')
                        .locator('h2')
                        .getByText('The object has been created'),
                ).toBeVisible();
                await expect(
                    page.getByTestId('confirm-dlor-save-outcome').getByText('Return to list page'),
                ).toBeVisible();
                await expect(
                    page.getByTestId('cancel-dlor-save-outcome').getByText('Add another Object'),
                ).toBeVisible();

                // and navigate back to the list page
                await page.getByTestId('confirm-dlor-save-outcome').click();
                await expect(page).toHaveURL(`http://localhost:2020/admin/dlor?user=${DLOR_ADMIN_USER}`);
                await expect(
                    page.getByTestId('StandardPage-title').getByText('Digital Learning Hub Management'),
                ).toBeVisible();
            });
            test('admin can create a new object for an existing team and start a fresh form', async ({
                page,
                context,
            }) => {
                // Verify cookie exists
                const cookie = await context
                    .cookies()
                    .then(cookies => cookies.find(c => c.name === 'CYPRESS_TEST_DATA'));
                expect(cookie).toBeDefined();
                expect(cookie?.value).toBe('active');

                const downloadInstructionText = 'some download instructions';

                // confirm team-changer works
                await page.getByTestId('object-owning-team').click();
                await expect(
                    page.getByTestId('object-owning-team-2').getByText('Lib train Library Corporate Services'),
                ).toBeVisible();
                await page.getByTestId('object-owning-team-2').click();
                await expect(page.getByTestId('dlor-panel-validity-indicator-0')).not.toBeVisible();

                await page.getByTestId('dlor-form-next-button').click();

                await page.locator('[data-testid="object-title"] input').fill('x'.padEnd(REQUIRED_LENGTH_TITLE, 'x'));
                await typeCKEditor(page, 'new description'.padEnd(REQUIRED_LENGTH_DESCRIPTION, 'x'));
                await page
                    .locator('[data-testid="object-summary"] textarea:first-child')
                    .fill('new summary '.padEnd(REQUIRED_LENGTH_SUMMARY, 'x'));

                await expect(page.locator('[data-testid="object-cultural-advice"] input')).not.toBeChecked();
                await page.locator('[data-testid="object-cultural-advice"] input').check();

                // go to the third panel, Link
                await page.getByTestId('dlor-form-next-button').click();

                await page.locator('[data-testid="object-link-url"] input').fill('http://example.com');

                // accessible link message: save a Viewable file that is a video that is 3min 47 secs long
                await expect(page.getByTestId('object-link-interaction-type').getByText('No message')).toBeVisible();
                await expect(page.getByTestId('object-link-file-type')).not.toBeVisible();
                await expect(page.getByTestId('object-link-duration-minutes')).not.toBeVisible();
                await expect(page.getByTestId('object-link-duration-seconds')).not.toBeVisible();
                await expect(page.getByTestId('object-link-size-units')).not.toBeVisible();
                await expect(page.getByTestId('object-link-size-amount')).not.toBeVisible();
                await page.getByTestId('object-link-interaction-type').click();
                await page.getByTestId('object-link-interaction-type-view').click();
                await expect(page.getByTestId('object-link-file-type')).toBeVisible();
                await expect(page.getByTestId('object-link-size-amount')).not.toBeVisible();
                await expect(page.getByTestId('object-link-size-units')).not.toBeVisible();
                await expect(page.getByTestId('object-link-duration-minutes')).toBeVisible();
                await expect(page.getByTestId('object-link-duration-seconds')).toBeVisible();
                // shows an error because they havent chosen a file type and a file size
                await expect(
                    page.locator('[data-testid="dlor-panel-validity-indicator-2"] span').getByText('2'),
                ).toBeVisible();
                await page.getByTestId('object-link-file-type').click();
                await page.locator('[data-value="video"]').click();
                await page.locator('[data-testid="object-link-duration-minutes"] input').fill('3');
                await page.locator('[data-testid="object-link-duration-seconds"] input').fill('47');

                await typeCKEditor(page, downloadInstructionText);
                // go to the fourth panel, Filtering
                await page.getByTestId('dlor-form-next-button').click();

                await page.locator('[data-testid="filter-topic-digital-skills"] input').check();
                await page.locator('[data-testid="filter-topic-employability"] input').check();
                await page.locator('[data-testid="filter-media-format-dataset"] input').check();
                await page
                    .locator('[data-testid="filter-subject-engineering-architecture-information-technology"] input')
                    .check();

                await page.locator('[data-testid="filter-subject-medicine-biomedical-sciences"] input').check();

                await page.locator('[data-testid="filter-item-type-module"] input').check();
                await page.locator('[data-testid="filter-licence-cc0public-domain"] input').check();
                await page.locator('[data-testid="filter-graduate-attributes-connected-citizens"] input').check();

                await page.locator('[data-testid="filter-subject-medicine-biomedical-sciences"] input').uncheck();

                await page.locator('[data-testid="object-keywords"] textarea:first-child').fill('cat, dog');

                // save record
                await page.getByTestId('admin-dlor-save-button-submit').click();

                // confirm save happened
                await expect(
                    page
                        .locator('[data-testid="dialogbox-dlor-save-outcome"] h2')
                        .getByText('The object has been created'),
                ).toBeVisible();
                await expect(
                    page.getByTestId('confirm-dlor-save-outcome').getByText('Return to list page'),
                ).toBeVisible();
                await expect(
                    page.getByTestId('cancel-dlor-save-outcome').getByText('Add another Object'),
                ).toBeVisible();

                // check the data we pretended to send to the server matches what we expect
                // acts as check of what we sent to api
                const expectedValues = {
                    object_title: 'xxxxxxxx',
                    object_description:
                        'new description xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
                    object_summary: 'new summary xxxxxxxx',
                    object_link_interaction_type: 'view',
                    object_link_file_type: 'video',
                    object_link_size: 227,
                    object_link_url: 'http://example.com',
                    object_download_instructions: downloadInstructionText,
                    object_is_featured: 0,
                    object_cultural_advice: 1,
                    object_publishing_user: 'dloradmn',
                    object_review_date_next: '2025-03-26T00:01',
                    object_status: 'new',
                    object_restrict_to: 'none',
                    object_owning_team_id: 2,
                    facets: [
                        3, // digital_skills
                        4, // employability
                        23, // media_dataset
                        36, // engineering_architecture_information_technology
                        18, // module
                        50, // cco_public_domain
                        11, // connected_citizens
                    ],
                    object_keywords: ['cat', 'dog'],
                };
                {
                    const savedCookie = await context
                        .cookies()
                        .then(cookies => cookies.find(c => c.name === 'CYPRESS_DATA_SAVED'));
                    expect(savedCookie).toBeDefined();
                    const sentValues = JSON.parse(decodeURIComponent(savedCookie!.value));

                    // it doesnt seem valid to recalc the calculated date to test it
                    expect(sentValues).toHaveProperty('object_review_date_next');
                    delete sentValues.object_review_date_next;
                    delete expectedValues.object_review_date_next;

                    // had trouble comparing the entire structure
                    const sentFacets = sentValues.facets;
                    const expectedFacets = expectedValues.facets;
                    const sentKeywords = sentValues.object_keywords;
                    const expectedKeywords = sentValues.object_keywords;
                    delete sentValues.facets;
                    delete sentValues.object_keywords;
                    delete expectedValues.facets;
                    delete expectedValues.object_keywords;

                    expectedValues.object_description =
                        '<p>new descriptionxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</p>';
                    expectedValues.object_download_instructions = '<p>' + downloadInstructionText + '</p>';

                    expect(sentValues).toEqual(expectedValues);
                    expect(sentFacets).toEqual(expectedFacets);
                    expect(sentKeywords).toEqual(expectedKeywords);

                    await context.clearCookies();
                }

                // confirm save happened
                await expect(
                    page
                        .getByTestId('dialogbox-dlor-save-outcome')
                        .locator('h2')
                        .getByText('The object has been created'),
                ).toBeVisible();
                await expect(
                    page.getByTestId('confirm-dlor-save-outcome').getByText('Return to list page'),
                ).toBeVisible();
                await expect(
                    page.getByTestId('cancel-dlor-save-outcome').getByText('Add another Object'),
                ).toBeVisible();

                // now clear the form to create another Object
                await page.getByTestId('cancel-dlor-save-outcome').click();
                await page.getByTestId('dlor-form-next-button').click();
                await expect(page.locator('[data-testid="object-title"] input')).toHaveValue('');
            });

            test('after swapping between interaction types', async ({ page, context }) => {
                const cookie = await context
                    .cookies()
                    .then(cookies => cookies.find(c => c.name === 'CYPRESS_TEST_DATA'));
                expect(cookie).toBeDefined();
                expect(cookie?.value).toBe('active');

                // go to panel 2
                await page.getByTestId('dlor-form-next-button').click();
                await page.locator('[data-testid="object-title"] input').fill('x'.padEnd(REQUIRED_LENGTH_TITLE, 'x'));
                await typeCKEditor(page, 'x'.padEnd(REQUIRED_LENGTH_DESCRIPTION, 'x'));
                await page.getByTestId('admin-dlor-suggest-summary-button').click();
                await expect(page.getByTestId('dlor-panel-validity-indicator-1')).not.toBeVisible();

                // go to panel 3
                await page.getByTestId('dlor-form-next-button').click();

                await page.locator('[data-testid="object-link-url"] input').fill('http://example.com');

                // accessible link message is "no message"
                await expect(page.getByTestId('object-link-file-type')).not.toBeVisible();
                await expect(page.getByTestId('object-link-duration-minutes')).not.toBeVisible();
                await expect(page.getByTestId('object-link-duration-seconds')).not.toBeVisible();
                await expect(page.getByTestId('object-link-size-units')).not.toBeVisible();
                await expect(page.getByTestId('object-link-size-amount')).not.toBeVisible();
                await page.getByTestId('object-link-interaction-type').click();
                await page.getByTestId('object-link-interaction-type-view').click();
                await expect(page.getByTestId('object-link-file-type')).toBeVisible();
                await expect(page.getByTestId('object-link-size-amount')).not.toBeVisible();
                await expect(page.getByTestId('object-link-size-units')).not.toBeVisible();
                await expect(page.getByTestId('object-link-duration-minutes')).toBeVisible();
                await expect(page.getByTestId('object-link-duration-seconds')).toBeVisible();
                await expect(page.getByTestId('object-link-file-type').getByText('New type')).toBeVisible();
                await page.getByTestId('object-link-file-type').click();
                await page.locator('[data-value="video"]').click();
                await page.locator('[data-testid="object-link-duration-minutes"] input').fill('3');
                await page.locator('[data-testid="object-link-duration-seconds"] input').fill('47');

                // now change the interactivity type
                // (this test will confirm that when we wipe the other fields they arent sent

                await page.getByTestId('object-link-interaction-type').click();
                await page.getByTestId('object-link-interaction-type-none').click();

                await typeCKEditor(page, 'words');
                await expect(page.getByTestId('dlor-panel-validity-indicator-2')).not.toBeVisible();

                // next panel
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
                await expect(page.getByTestId('admin-dlor-save-button-submit')).toBeEnabled();

                // save new dlor
                await page.getByTestId('admin-dlor-save-button-submit').click();

                // confirm save happened
                await page.waitForSelector('[data-testid="cancel-dlor-save-outcome"]');
                await expect(
                    page
                        .locator('[data-testid="dialogbox-dlor-save-outcome"] h2')
                        .getByText('The object has been created'),
                ).toBeVisible();
                await expect(
                    page.getByTestId('confirm-dlor-save-outcome').getByText('Return to list page'),
                ).toBeVisible();
                await expect(
                    page.getByTestId('cancel-dlor-save-outcome').getByText('Add another Object'),
                ).toBeVisible();

                // check the data we pretended to send to the server matches what we expect
                // acts as check of what we sent to api
                const expectedValues = {
                    object_description:
                        '<p>xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</p>',
                    object_download_instructions: '<p>words</p>',
                    object_link_interaction_type: 'none',
                    object_link_url: 'http://example.com',
                    object_owning_team_id: 1,
                    object_is_featured: 0,
                    object_cultural_advice: 0,
                    object_publishing_user: 'dloradmn',
                    object_review_date_next: '2025-03-26T00:01',
                    object_status: 'new',
                    object_restrict_to: 'none',
                    object_summary: 'x'.padEnd(REQUIRED_LENGTH_DESCRIPTION, 'x'),
                    object_title: 'x'.padEnd(REQUIRED_LENGTH_TITLE, 'x'),
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

                {
                    const savedCookie = await context
                        .cookies()
                        .then(cookies => cookies.find(c => c.name === 'CYPRESS_DATA_SAVED'));
                    expect(savedCookie).toBeDefined();
                    const sentValues = JSON.parse(decodeURIComponent(savedCookie!.value));

                    // had trouble comparing the entire structure
                    const sentFacets = sentValues.facets;
                    const expectedFacets = expectedValues.facets;
                    const sentKeywords = sentValues.object_keywords;
                    const expectedKeywords = expectedValues.object_keywords;
                    delete sentValues.facets;
                    delete expectedValues.facets;
                    delete sentValues.object_keywords;
                    delete expectedValues.object_keywords;
                    delete sentValues.object_review_date_next; // doesn't seem valid to figure out the date
                    delete expectedValues.object_review_date_next;
                    expect(sentValues).toEqual(expectedValues);
                    expect(sentFacets).toEqual(expectedFacets);
                    expect(sentKeywords).toEqual(expectedKeywords);

                    await context.clearCookies();
                }
            });

            test('with a new interaction type', async ({ page, context }) => {
                const cookie = await context
                    .cookies()
                    .then(cookies => cookies.find(c => c.name === 'CYPRESS_TEST_DATA'));
                expect(cookie).toBeDefined();
                expect(cookie?.value).toBe('active');

                // go to panel 2
                await page.getByTestId('dlor-form-next-button').click();
                await page.locator('[data-testid="object-title"] input').fill('x'.padEnd(REQUIRED_LENGTH_TITLE, 'x'));
                await typeCKEditor(page, 'x'.padEnd(REQUIRED_LENGTH_DESCRIPTION, 'x'));
                await page.getByTestId('admin-dlor-suggest-summary-button').click();
                await expect(page.getByTestId('dlor-panel-validity-indicator-1')).not.toBeVisible();

                // go to panel 3
                await page.getByTestId('dlor-form-next-button').click();
                await page.locator('[data-testid="object-link-url"] input').fill('http://example.com');

                // "accessible link message" is "no message"
                await expect(page.getByTestId('object-link-file-type')).not.toBeVisible();
                await expect(page.getByTestId('object-link-duration-minutes')).not.toBeVisible();
                await expect(page.getByTestId('object-link-duration-seconds')).not.toBeVisible();
                await expect(page.getByTestId('object-link-size-units')).not.toBeVisible();
                await expect(page.getByTestId('object-link-size-amount')).not.toBeVisible();
                await page.getByTestId('object-link-interaction-type').click();
                await page.getByTestId('object-link-interaction-type-view').click();
                await expect(page.getByTestId('object-link-file-type')).toBeVisible();
                await expect(page.getByTestId('object-link-size-amount')).not.toBeVisible();
                await expect(page.getByTestId('object-link-size-units')).not.toBeVisible();
                await expect(page.getByTestId('object-link-duration-minutes')).toBeVisible();
                await expect(page.getByTestId('object-link-duration-seconds')).toBeVisible();

                await expect(page.getByTestId('object-link-file-type').getByText('New type')).toBeVisible();
                await page.locator('[data-testid="dlor-admin-form-new-file-type"] input').fill('docx');
                await page.locator('[data-testid="object-link-duration-minutes"] input').fill('3');
                await page.locator('[data-testid="object-link-duration-seconds"] input').fill('47');

                await typeCKEditor(page, 'words');
                await expect(page.getByTestId('dlor-panel-validity-indicator-2')).not.toBeVisible();

                // next panel
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
                await expect(page.getByTestId('admin-dlor-save-button-submit')).toBeEnabled();

                // save new dlor
                await page.getByTestId('admin-dlor-save-button-submit').click();

                // confirm save happened
                await page.waitForSelector('[data-testid="cancel-dlor-save-outcome"]');
                await expect(
                    page
                        .locator('[data-testid="dialogbox-dlor-save-outcome"] h2')
                        .getByText('The object has been created'),
                ).toBeVisible();
                await expect(
                    page.getByTestId('confirm-dlor-save-outcome').getByText('Return to list page'),
                ).toBeVisible();
                await expect(
                    page.getByTestId('cancel-dlor-save-outcome').getByText('Add another Object'),
                ).toBeVisible();

                // check the data we pretended to send to the server matches what we expect
                // acts as check of what we sent to api
                const expectedValues = {
                    object_description:
                        '<p>xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</p>',
                    object_download_instructions: '<p>words</p>',
                    object_link_interaction_type: 'view',
                    object_link_file_type: 'docx',
                    object_link_size: 227,
                    object_link_url: 'http://example.com',
                    object_owning_team_id: 1,
                    object_is_featured: 0,
                    object_cultural_advice: 0,
                    object_publishing_user: 'dloradmn',
                    object_review_date_next: '2025-03-26T00:01',
                    object_status: 'new',
                    object_restrict_to: 'none',
                    object_summary: 'x'.padEnd(REQUIRED_LENGTH_DESCRIPTION, 'x'),
                    object_title: 'x'.padEnd(REQUIRED_LENGTH_TITLE, 'x'),
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
                {
                    const savedCookie = await context
                        .cookies()
                        .then(cookies => cookies.find(c => c.name === 'CYPRESS_DATA_SAVED'));
                    expect(savedCookie).toBeDefined();
                    const sentValues = JSON.parse(decodeURIComponent(savedCookie!.value));

                    // had trouble comparing the entire structure
                    const sentFacets = sentValues.facets;
                    const expectedFacets = expectedValues.facets;
                    const sentKeywords = sentValues.object_keywords;
                    const expectedKeywords = expectedValues.object_keywords;
                    delete sentValues.facets;
                    delete expectedValues.facets;
                    delete sentValues.object_keywords;
                    delete expectedValues.object_keywords;
                    delete sentValues.object_review_date_next; // doesn't seem valid to figure out the date
                    delete expectedValues.object_review_date_next;
                    expect(sentValues).toEqual(expectedValues);
                    expect(sentFacets).toEqual(expectedFacets);
                    expect(sentKeywords).toEqual(expectedKeywords);

                    await context.clearCookies();
                }
            });
        });
        test.describe('fails correctly', () => {
            test('admin gets an error when Teams list api doesnt load', async ({ page }) => {
                await page.goto(
                    `http://localhost:2020/admin/dlor/add?user=${DLOR_ADMIN_USER}&responseType=teamsLoadError`,
                );
                await expect(
                    page
                        .getByTestId('dlor-form-addedit-error')
                        .getByText('An error has occurred during the request and this request cannot be processed'),
                ).toBeVisible();
            });
            test('admin gets an error when Filter list api doesnt load', async ({ page }) => {
                await page.goto(
                    `http://localhost:2020/admin/dlor/add?user=${DLOR_ADMIN_USER}&responseType=filterLoadError`,
                );
                await expect(
                    page
                        .getByTestId('dlor-homepage-error')
                        .getByText('An error has occurred during the request and this request cannot be processed'),
                ).toBeVisible();
            });
            test('admin gets an error when Filter list is empty', async ({ page }) => {
                await page.goto(
                    `http://localhost:2020/admin/dlor/add?user=${DLOR_ADMIN_USER}&responseType=filterLoadEmpty`,
                );
                await expect(
                    page
                        .getByTestId('dlor-homepage-noresult')
                        .getByText(
                            'Missing filters: We did not find any entries in the system - please try again later.',
                        ),
                ).toBeVisible();
            });
            test('admin gets an error on a failed save', async ({ page }) => {
                await page.goto(`http://localhost:2020/admin/dlor/add?user=${DLOR_ADMIN_USER}&responseType=saveError`);

                // team is valid as is, so go to the second panel, Description
                await page.getByTestId('dlor-form-next-button').click();
                await page.locator('[data-testid="object-title"] input').fill('x'.padEnd(REQUIRED_LENGTH_TITLE, 'x'));
                await typeCKEditor(page, 'new description'.padEnd(REQUIRED_LENGTH_DESCRIPTION, 'x'));
                await page
                    .locator('[data-testid="object-summary"] textarea:first-child')
                    .fill('new summary '.padEnd(REQUIRED_LENGTH_SUMMARY, 'x'));

                // go to the third panel, Link
                await page.getByTestId('dlor-form-next-button').click();
                await page.locator('[data-testid="object-link-url"] input').fill('http://example.com');

                // go to the fourth panel, Filtering
                await page.getByTestId('dlor-form-next-button').click();
                await page.locator('[data-testid="filter-topic-digital-skills"] input').check();
                await page.locator('[data-testid="filter-media-format-dataset"] input').check();
                await page
                    .locator('[data-testid="filter-subject-engineering-architecture-information-technology"] input')
                    .check();
                await page.locator('[data-testid="filter-item-type-module"] input').check();
                await page.locator('[data-testid="filter-licence-cc0public-domain"] input').check();
                await page.locator('[data-testid="object-keywords"] textarea:first-child').fill('cat, dog');

                // form filled out. now save
                await page.getByTestId('admin-dlor-save-button-submit').click();

                // "responseType=saveError" on the url forces an error from mock api
                await expect(
                    page
                        .locator('[data-testid="dialogbox-dlor-save-outcome"] h2')
                        .getByText('An error has occurred during the request and this request cannot be processed'),
                ).toBeVisible();
                await expect(
                    page.getByTestId('confirm-dlor-save-outcome').getByText('Return to list page'),
                ).toBeVisible();
                await expect(
                    page.getByTestId('cancel-dlor-save-outcome').getByText('Add another Object'),
                ).toBeVisible();
            });
        });
    });
    test.describe('user access', () => {
        test('displays an "unauthorised" page to public users', async ({ page }) => {
            await page.goto('http://localhost:2020/admin/dlor/add?user=public');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(
                page
                    .locator('h1')
                    .first()
                    .getByText('Authentication required'),
            ).toBeVisible();
        });

        test('displays an "unauthorised" page to non-authorised users', async ({ page }) => {
            await page.goto('http://localhost:2020/admin/dlor/add?user=uqstaff');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(
                page
                    .locator('h1')
                    .first()
                    .getByText('Permission denied'),
            ).toBeVisible();
        });

        test('displays correct page for admin users (list)', async ({ page }) => {
            await page.goto(`http://localhost:2020/admin/dlor/add?user=${DLOR_ADMIN_USER}`);
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(
                page
                    .locator('h1')
                    .first()
                    .getByText('Digital Learning Hub Management'),
            ).toBeVisible();
        });
    });
});
