import { test, expect } from '@uq/pw/test';
import { typeCKEditor } from '@uq/pw/lib/ckeditor';

const REQUIRED_LENGTH_TITLE = 8;
const REQUIRED_LENGTH_DESCRIPTION = 100;
const REQUIRED_LENGTH_SUMMARY = 20;
const REQUIRED_LENGTH_KEYWORDS = 4;
test.describe('Request an object addition to the Digital Learning Hub', () => {
    test.describe('Request a new object', () => {
        test.describe('interface link', () => {
            test('opens the form', async ({ page }) => {
                await page.goto('digital-learning-hub');
                await page
                    .getByTestId('dlor-homepage-request-new-item')
                    .getByText(/Submit new object request/)
                    .first()
                    .click();
                await expect(
                    page
                        .locator('a[data-testid="dlor-breadcrumb-admin-homelink"]')
                        .getByText(/Digital Learning Hub/)
                        .first(),
                ).toHaveAttribute('href', `/digital-learning-hub`);
                await expect(
                    page
                        .locator(
                            '[data-testid="dlor-breadcrumb-create-an-object-for-the-digital-learning-hub-label-0"]',
                        )
                        .getByText(/Create an Object for the Digital Learning Hub/)
                        .first(),
                ).toBeVisible();
            });
        });
        test.describe('successfully', () => {
            test.beforeEach(async ({ page }) => {
                await page.goto(`http://localhost:2020/digital-learning-hub/submit`);
                await page.setViewportSize({ width: 1300, height: 1000 });
            });
            test('navigation is functional and help is shown', async ({ page }) => {
                await page.setViewportSize({ width: 1300, height: 1000 });
                await expect(page.locator('h1')).toContainText('Digital Learning Hub');
                await expect(page.getByTestId('dlor-UserAdd-helper')).toBeVisible();
                // go to the second panel, Description
                await page.getByTestId('dlor-form-next-button').click();
                await expect(page.getByTestId('object-title')).toBeVisible();
                await expect(page.getByTestId('dlor-UserAdd-helper')).toBeVisible();
                // go to the third panel, Link
                await page.getByTestId('dlor-form-next-button').click();
                await expect(page.getByTestId('object-link-url')).toBeVisible();
                await expect(page.getByTestId('dlor-UserAdd-helper')).toBeVisible();
                // go to the fourth panel, Filtering
                await page.getByTestId('dlor-form-next-button').click();
                await expect(page.getByTestId('filter-topic-aboriginal-and-torres-strait-islander')).toBeVisible();
                await expect(page.getByTestId('dlor-UserAdd-helper')).toBeVisible();
            });
            test('has breadcrumb', async ({ page }) => {
                await expect(
                    page
                        .getByTestId('subsite-title')
                        .getByText(/Digital learning hub admin/)
                        .first(),
                ).toBeVisible();
            });
            test('loads as expected', async ({ page }) => {
                await expect(
                    page
                        .locator('a[data-testid="dlor-breadcrumb-admin-homelink"]')
                        .getByText(/Digital Learning Hub/)
                        .first(),
                ).toHaveAttribute('href', `/digital-learning-hub`);
                await expect(
                    page
                        .locator(
                            '[data-testid="dlor-breadcrumb-create-an-object-for-the-digital-learning-hub-label-0"]',
                        )
                        .getByText(/Create an Object for the Digital Learning Hub/)
                        .first(),
                ).toBeVisible();

                await expect(page.locator('[data-testid="object-publishing-user"] input')).toHaveValue('vanilla');
                // go to description panel
                await page.getByTestId('dlor-form-next-button').click();
                // go to link panel
                await page.getByTestId('dlor-form-next-button').click();
                // go to filter panel
                await page.getByTestId('dlor-form-next-button').click();
                // no notify checkbox
                await expect(page.locator('[data-testid="choose-notify"] input')).not.toBeVisible();
            });
            test('validates fields correctly for non admin user', async ({ page }) => {
                // first enter all the fields and show the save button doesn't enable until all the fields are entered
                // team starts off valid so click on to the second panel, description

                // TODO fix incorrect assertion below
                // await expect(page.locator('[data-testid="dlor-panel-validity-indicator-1"] span')).not.toBeAttached();

                await page.getByTestId('dlor-form-next-button').click();
                await expect(page.locator('[data-testid="dlor-panel-validity-indicator-1"] span')).toHaveText(/3/);

                // panel invalidity count present
                await page.locator('[data-testid="object-title"] input').fill('xx'.padEnd(REQUIRED_LENGTH_TITLE, 'x'));
                await expect(page.locator('[data-testid="dlor-panel-validity-indicator-1"] span')).toHaveText(/2/);

                // panel invalidity count present
                await page.waitForTimeout(1000);
                await typeCKEditor(page, 'new description '.padEnd(REQUIRED_LENGTH_DESCRIPTION, 'x'));
                await expect(page.locator('[data-testid="dlor-panel-validity-indicator-1"] span')).toHaveText(/1/);

                // panel invalidity count present
                await page
                    .locator('[data-testid="object-summary"] textarea:first-child')
                    .fill('new summary '.padEnd(REQUIRED_LENGTH_SUMMARY, 'x'));
                await expect(page.getByTestId('dlor-panel-validity-indicator-1')).not.toBeVisible(); // panel invalidity count not present
                // click 'next' button to view panel 3, Link
                await page.getByTestId('dlor-form-next-button').click();
                await expect(page.locator('[data-testid="dlor-panel-validity-indicator-2"] span')).toHaveText(/1/);

                // panel invalidity count present
                await page.locator('[data-testid="object-link-url"] input').fill('asdasdasdsadd');
                await expect(page.getByTestId('dlor-form-error-message-object-link-url')).toContainText(
                    'This web address is not valid.',
                );
                await page.locator('[data-testid="object-link-url"] input').clear();
                await page.locator('[data-testid="object-link-url"] input').fill('http://example.com');
                await expect(page.getByTestId('dlor-panel-validity-indicator-2')).not.toBeVisible(); // panel invalidity count not present
                // click 'next' button to view panel 4, Filters
                await page.getByTestId('dlor-form-next-button').click();

                await page.locator('[data-testid="filter-topic-aboriginal-and-torres-strait-islander"] input').check();
                await expect(page.locator('[data-testid="dlor-panel-validity-indicator-3"] span')).toHaveText(/5/);

                // panel invalidity count present
                await expect(page.getByTestId('admin-dlor-save-button-submit')).toBeDisabled();

                await page.locator('[data-testid="filter-media-format-audio"] input').check();
                await expect(page.locator('[data-testid="dlor-panel-validity-indicator-3"] span')).toHaveText(/4/);
                await expect(page.getByTestId('admin-dlor-save-button-submit')).toBeDisabled();

                await page.locator('[data-testid="filter-subject-cross-disciplinary"] input').check();
                await expect(page.locator('[data-testid="dlor-panel-validity-indicator-3"] span')).toHaveText(/3/);

                // panel invalidity count present
                await expect(page.getByTestId('admin-dlor-save-button-submit')).toBeDisabled();

                await page.locator('[data-testid="filter-item-type-guide"] input').check();
                await expect(page.locator('[data-testid="dlor-panel-validity-indicator-3"] span')).toHaveText(/2/);
                await expect(page.getByTestId('admin-dlor-save-button-submit')).toBeDisabled();

                await page.locator('[data-testid="filter-licence-cc-by-attribution"] input').check();
                await expect(page.locator('[data-testid="dlor-panel-validity-indicator-3"] span')).toHaveText(/1/);
                await expect(page.getByTestId('admin-dlor-save-button-submit')).toBeDisabled();
                await page
                    .locator('[data-testid="object-keywords"] textarea:first-child')
                    .fill('a'.padEnd(REQUIRED_LENGTH_KEYWORDS, 'x'));
                await expect(page.getByTestId('dlor-panel-validity-indicator-3')).not.toBeVisible(); // panel invalidity count no longer present
                await expect(page.getByTestId('admin-dlor-save-button-submit')).not.toBeDisabled();

                await page
                    .locator('[data-testid="filter-topic-aboriginal-and-torres-strait-islander"] input')
                    .uncheck();
                await expect(page.locator('[data-testid="dlor-panel-validity-indicator-3"] span')).toHaveText(/1/);

                // panel invalidity count present
                await expect(page.getByTestId('admin-dlor-save-button-submit')).toBeDisabled();

                await page.locator('[data-testid="filter-topic-aboriginal-and-torres-strait-islander"] input').check();
                await page.locator('[data-testid="filter-subject-cross-disciplinary"] input').uncheck();
                await expect(page.locator('[data-testid="dlor-panel-validity-indicator-3"] span')).toHaveText(/1/);

                // panel invalidity count present
                await expect(page.getByTestId('admin-dlor-save-button-submit')).toBeDisabled();

                await page.locator('[data-testid="filter-subject-cross-disciplinary"] input').check();
                await page.locator('[data-testid="filter-media-format-audio"] input').uncheck();
                await expect(page.locator('[data-testid="dlor-panel-validity-indicator-3"] span')).toHaveText(/1/);

                // panel invalidity count present
                await expect(page.getByTestId('admin-dlor-save-button-submit')).toBeDisabled();

                await page.locator('[data-testid="filter-media-format-audio"] input').check();
                // (cant uncheck a radio button)
                // click the back button to go back to panel 3, Link
                await page.getByTestId('dlor-form-back-button').click();
                await page.locator('[data-testid="object-link-url"] input').clear();
                await expect(page.locator('[data-testid="dlor-panel-validity-indicator-2"] span')).toHaveText(/1/);

                // panel invalidity count present
                await page.locator('[data-testid="object-link-url"] input').fill('http://');
                await expect(page.locator('[data-testid="dlor-panel-validity-indicator-2"] span')).toHaveText(/1/);

                // panel invalidity count present
                await page.locator('[data-testid="object-link-url"] input').pressSequentially('ex.c');
                await expect(page.locator('[data-testid="dlor-panel-validity-indicator-2"] span')).toHaveText(/1/);

                // panel invalidity count present
                await page.locator('[data-testid="object-link-url"] input').pressSequentially('o');
                await expect(page.getByTestId('dlor-panel-validity-indicator-2')).not.toBeVisible(); // panel invalidity count no longer present
                // click the back button to go back to panel 2, Description
                await page.getByTestId('dlor-form-back-button').click();
                await expect(page.getByTestId('dlor-panel-validity-indicator-1')).not.toBeVisible(); // panel invalidity count no longer present
                await page.locator('[data-testid="object-title"] input').press('Delete');
                await expect(page.getByTestId('dlor-panel-validity-indicator-1')).toHaveText(/1/);

                // panel invalidity count present
                await page.locator('[data-testid="object-title"] input').pressSequentially('p');
                await expect(page.getByTestId('dlor-panel-validity-indicator-1')).not.toBeVisible(); // panel invalidity count no longer present
                await typeCKEditor(page, 'd');
                await expect(page.getByTestId('dlor-panel-validity-indicator-1')).toHaveText(/1/);

                // panel invalidity count present
                await typeCKEditor(page, 'new description '.padEnd(REQUIRED_LENGTH_DESCRIPTION, 'x'));
                await expect(page.getByTestId('dlor-panel-validity-indicator-1')).not.toBeVisible(); // panel invalidity count no longer present
                await page.locator('[data-testid="object-summary"] textarea:first-child').clear();
                await expect(page.getByTestId('dlor-panel-validity-indicator-1')).toHaveText(/1/);

                // panel invalidity count present
                await page
                    .locator('[data-testid="object-summary"] textarea:first-child')
                    .fill('new description '.padEnd(REQUIRED_LENGTH_DESCRIPTION, 'x'));
                await expect(page.getByTestId('dlor-panel-validity-indicator-1')).not.toBeVisible(); // panel invalidity count no longer present
                // click the back button to go back to panel 1, Ownership
                await page.getByTestId('dlor-form-back-button').click();
                await expect(page.getByTestId('dlor-panel-validity-indicator-0')).not.toBeVisible(); // panel invalidity count not present
                await expect(page.locator('[data-testid="object-publishing-user"] input')).toBeDisabled();
                await expect(page.locator('[data-testid="object-publishing-user"] input')).toHaveValue('vanilla');
                await page.getByTestId('object-owning-team').click();
                await page.getByTestId('object-form-teamid-new').click();

                // now that we have chosen "new team" the form is invalid until we enter all 3 fields
                await expect(page.getByTestId('dlor-panel-validity-indicator-0')).toHaveText(/3/);

                // panel invalidity count present
                await page.locator('[data-testid="dlor-form-team-name-new"] input').fill('new team name');
                await expect(page.getByTestId('dlor-panel-validity-indicator-0')).toHaveText(/2/);

                // panel invalidity count present
                await page.locator('[data-testid="dlor-form-team-manager-new"] input').fill('john Manager');
                await expect(page.getByTestId('dlor-panel-validity-indicator-0')).toHaveText(/1/);

                // panel invalidity count present
                await expect(page.getByTestId('error-message-team-email-new')).toHaveText(
                    /This email address is not valid\./,
                );
                await page.locator('[data-testid="dlor-form-team-email-new"] input').fill('john@example.com');
                await expect(page.getByTestId('dlor-panel-validity-indicator-0')).not.toBeVisible(); // panel invalidity count not present
                await page.getByTestId('object-owning-team').click();
                await page.getByTestId('object-owning-team-1').click();
                await expect(page.getByTestId('dlor-panel-validity-indicator-0')).not.toBeVisible(); // panel invalidity count not present
                // Fire the mock save.
                await page.getByTestId('dlor-form-next-button').click();
                await page.getByTestId('dlor-form-next-button').click();
                await page.getByTestId('dlor-form-next-button').click();
                await expect(page.getByTestId('admin-dlor-save-button-submit')).not.toBeDisabled();
                await page.getByTestId('admin-dlor-save-button-submit').click();
                await expect(page.getByTestId('message-title')).toBeVisible(); // wording to come after review
                await expect(page.getByTestId('confirm-dlor-save-outcome')).toBeVisible();
                await page.getByTestId('confirm-dlor-save-outcome').click();
            });
            test('shows character minimums', async ({ page }) => {
                // go to the second panel, description
                await page.getByTestId('dlor-form-next-button').click();
                await page.locator('[data-testid="object-title"] input').fill('123');
                await expect(page.getByTestId('input-characters-remaining-object-title')).toHaveText(
                    /at least 5 more characters needed/,
                );

                await typeCKEditor(page, 'new description');
                await expect(page.getByTestId('input-characters-remaining-object-description')).toHaveText(
                    /at least 85 more characters needed/,
                );
                await page.locator('[data-testid="object-summary"] textarea:first-child').fill('new summary');
                await expect(page.getByTestId('input-characters-remaining-object-summary')).toHaveText(
                    /at least 9 more characters needed/,
                );

                // go to the fourth panel, links
                await page.getByTestId('dlor-form-next-button').click();
                await page.getByTestId('dlor-form-next-button').click();
                await page.locator('[data-testid="object-keywords"] textarea:first-child').fill('abc');
                await expect(page.getByTestId('input-characters-remaining-object-keywords-string')).toHaveText(
                    /at least 1 more character needed/,
                );
            });
            test('supplies a summary suggestion', async ({ page }) => {
                // go to the second step, Description
                await page.getByTestId('dlor-form-next-button').click();

                // suggestion panel not open
                await expect(page.getByTestId('admin-dlor-suggest-summary')).not.toBeVisible();
                // a long description puts the first 150 char, breaking at a word break, into the summary suggestion
                await typeCKEditor(
                    page,
                    'The quick brown fox jumped over the lazy yellow dog and ran into the woods. The hunters blew their horns and the hounds bayed and the whole troop followed the fox.',
                );
                // suggestion panel is now open
                await expect(page.getByTestId('admin-dlor-suggest-summary-content')).toHaveText(
                    'The quick brown fox jumped over the lazy yellow dog and ran into the woods.',
                );
                await page.getByTestId('admin-dlor-suggest-summary-close-button').click();

                // suggestion panel is hidden
                await expect(page.getByTestId('admin-dlor-suggest-summary')).not.toBeVisible();
                // suggestion panel picks up first paragraph on carriage return after minimum char count
                await typeCKEditor(
                    page,
                    'The quick brown fox jumped over the lazy yellow dog and ran into the woods.' +
                        'The hunters blew their horns and the hounds bayed and the whole troop followed the fox.' +
                        '\n' +
                        'a second paragraph',
                );
                await expect(page.getByTestId('admin-dlor-suggest-summary-content')).toHaveText(
                    'The quick brown fox jumped over the lazy yellow dog and ran into the woods.',
                );
                // suggestion panel is open again because they changed the description
                await expect(page.getByTestId('admin-dlor-suggest-summary')).toBeVisible();
                // summary currently blank
                await expect(page.locator('[data-testid="object-summary"] textarea').first()).toHaveValue('');
                // step 2 validation number = 2 because title and summary not set
                await expect(page.locator('[data-testid="dlor-panel-validity-indicator-1"] span')).toHaveText(/2/);

                // click "use summary" button
                await page.getByTestId('admin-dlor-suggest-summary-button').click();

                // suggestion panel no longer open
                await expect(page.getByTestId('admin-dlor-suggest-summary')).not.toBeVisible();
                // step 2 validation number = 1, only title not set
                await expect(page.locator('[data-testid="dlor-panel-validity-indicator-1"] span')).toHaveText(/1/);
            });
        });
    });
});
