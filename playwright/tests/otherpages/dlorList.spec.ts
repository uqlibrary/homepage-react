import { test, expect } from '@uqpw/test';
import { assertAccessibility } from '@uqpw/lib/axe';

test.describe('Digital Learning Hub', () => {
    const itemsPerPage = 10; // matches value in DLOList
    const extraRowCount = 1; // pagination row + hidden mobile filter icon
    test.describe('desktop homepage visits', () => {
        test.beforeEach(async ({ page }) => {
            await page.goto('digital-learning-hub');
            await page.setViewportSize({ width: 1300, height: 1000 });
        });
        test('is accessible', async ({ page }) => {
            // sometimes this fails locally after cypress has been open for a while - it doesn't fail on the server
            await expect(page.locator('[data-testid="dlor-homepage-list"] div:nth-child(4) article h2')).toHaveText(
                /Accessibility - Digital Essentials/,
            );
            await expect(page.locator('h1').getByText('Find a digital learning object')).toBeVisible();
            await assertAccessibility(page, '[data-testid="StandardPage"]');
        });
        test('has breadcrumbs', async ({ page }) => {
            await expect(
                page
                    .getByTestId('subsite-title')
                    .getByText(/Digital learning hub/)
                    .first(),
            ).toBeVisible();
        });
        test('appears as expected', async ({ page }) => {
            await expect(page.getByTestId('hero-card-title')).toContainText('Find a digital learning object');
            await expect(page.getByTestId('dlor-homepage-list').locator(':scope > div')).toHaveCount(
                itemsPerPage + extraRowCount,
            );
            // hero card shows
            const locator = page.getByTestId('hero-card-image');
            await expect(locator).toBeVisible();
            const width = await locator.evaluate(el => {
                const style = window.getComputedStyle(el);
                return parseInt(style.width, 10);
            });
            expect(width).toBeGreaterThan(600);
            await expect(page.getByTestId('hero-card-title')).toBeVisible();
            await expect(
                page
                    .getByTestId('hero-card-title')
                    .getByText(/Find a digital learning object/)
                    .first(),
            ).toBeVisible();
            await expect(
                page
                    .getByTestId('hero-card-description')
                    .getByText(
                        /Use the Digital Learning Hub to find modules, videos and guides for teaching and study\./,
                    )
                    .first(),
            ).toBeVisible();

            await expect(page.locator('[data-testid="dlor-homepage-list"] div:nth-child(4) article h2')).toContainText(
                'Accessibility - Digital Essentials',
            );
            await expect(
                page.locator('[data-testid="dlor-homepage-list"] article h2').getByText('Artificial Intelligence'),
            ).toBeVisible();
            // article 1 contents correct
            await expect(
                page.locator('[data-testid="dlor-homepage-panel-987y-isjgt-9866"] article header h2'),
            ).toContainText('Accessibility - Digital Essentials');
            await expect(page.getByTestId('dlor-homepage-panel-987y-isjgt-9866-cultural-advice')).not.toBeVisible();
            await expect(
                page
                    .getByTestId('dlor-homepage-panel-987y-isjgt-9866-featured')
                    .getByText(/Featured/)
                    .first(),
            ).toBeVisible();
            await expect(
                page
                    .getByTestId('dlor-homepage-panel-987y-isjgt-9866-object-series-name')
                    .getByText(/Series: Digital Essentials/)
                    .first(),
            ).toBeVisible();

            await expect(page.locator('[data-testid="dlor-homepage-panel-987y-isjgt-9866"] article')).toContainText(
                'Understanding the importance of accessibility online and creating accessible content.',
            );
            await expect(
                page
                    .locator('[data-testid="dlor-homepage-panel-987y-isjgt-9866"] article footer')
                    .locator(':scope > *'),
            ).toHaveCount(6); // 3 svg, 3 spans-with-text
            await expect(
                page
                    .locator('[data-testid="dlor-homepage-panel-987y-isjgt-9866"] article footer')
                    .getByText(/Module/)
                    .first(),
            ).toBeVisible();
            await expect(
                page
                    .locator('[data-testid="dlor-homepage-panel-987y-isjgt-9866"] article footer')
                    .getByText(/Video/)
                    .first(),
            ).toBeVisible();
            await expect(
                page
                    .locator('[data-testid="dlor-homepage-panel-987y-isjgt-9866"] article footer')
                    .getByText(/Digital skills/)
                    .first(),
            ).toBeVisible();
            // article 2 has CA
            await expect(
                page
                    .getByTestId('dlor-homepage-panel-kj5t-8yg4-kj4f-cultural-advice')
                    .getByText(/Cultural advice/)
                    .first(),
            ).toBeVisible();
            await expect(
                page
                    .getByTestId('dlor-homepage-panel-kj5t-8yg4-kj4f-featured')
                    .getByText(/Featured/)
                    .first(),
            ).toBeVisible();
            await expect(
                page
                    .getByTestId('dlor-homepage-panel-kj5t-8yg4-kj4f-object-series-name')
                    .getByText(/Series: Indigenising curriculum/)
                    .first(),
            ).toBeVisible();

            // article 3 contents correct
            await expect(
                page.locator('[data-testid="dlor-homepage-panel-98s0-dy5k3-98h4"] article header h2'),
            ).toContainText('Advanced literature searching');
            await expect(page.getByTestId('dlor-homepage-panel-98s0-dy5k3-98h4-cultural-advice')).toBeVisible();
            await expect(page.getByTestId('dlor-homepage-panel-98s0-dy5k3-98h4-featured')).toBeVisible();
            await expect(
                page
                    .getByTestId('dlor-homepage-panel-98s0-dy5k3-98h4-object-series-name')
                    .getByText(/Series: Advanced literature searching/)
                    .first(),
            ).toBeVisible();

            await expect(page.locator('[data-testid="dlor-homepage-panel-98s0-dy5k3-98h4"] article')).toContainText(
                'Using advanced searching techniques',
            );
            await expect(
                page
                    .locator('[data-testid="dlor-homepage-panel-98s0-dy5k3-98h4"] article footer')
                    .locator(':scope > *'),
            ).toHaveCount(6); // 3 svg, 3 spans-with-text
            await expect(page.getByTestId('dlor-homepage-panel-98s0-dy5k3-98h4-footer-type')).toContainText('Guide');
            await expect(page.getByTestId('dlor-homepage-panel-98s0-dy5k3-98h4-footer-media')).toContainText(
                'Pressbook',
            );
            await expect(page.getByTestId('dlor-homepage-panel-98s0-dy5k3-98h4-footer-topic')).toContainText(
                'Assignments, Research',
            );
            // fourth panel
            await expect(
                page.locator('[data-testid="dlor-homepage-panel-938h-4986-654f"] article header h2'),
            ).toContainText('Artificial Intelligence - Digital Essentials');
            await expect(page.locator('[data-testid="dlor-homepage-panel-938h-4986-654f"] article')).toContainText(
                'Types of AI, implications for society, using AI in your studies and how UQ is',
            );
            await expect(
                page.locator('[data-testid="dlor-homepage-panel-938h-4986-654f"] article footer').locator(':scope > *'),
            ).toHaveCount(6); // 3 svg, 3 spans-with-text
            await expect(page.getByTestId('dlor-homepage-panel-938h-4986-654f-footer-type')).toContainText('Module');
            await expect(page.getByTestId('dlor-homepage-panel-938h-4986-654f-footer-media')).toContainText('H5P');
            await expect(page.getByTestId('dlor-homepage-panel-938h-4986-654f-footer-topic')).toContainText(
                'Assignments, Software',
            );
            // filter sidebar
            await expect(
                page
                    .locator('[data-testid="sidebar-panel-heading"] h2')
                    .getByText(/Filters/)
                    .first(),
            ).toBeVisible();

            // sidebar topic panel loads hidden
            await expect(
                page
                    .getByTestId('sidebar-panel-topic')
                    .getByText(/Aboriginal and Torres Strait Islander/)
                    .first(),
            ).toBeVisible();

            // click button, hide panel
            await page.getByTestId('panel-minimisation-icon-topic').click();
            await expect(page.getByTestId('sidebar-panel-topic')).not.toBeVisible();

            // click button again, unhide
            await page.getByTestId('panel-minimisation-icon-topic').click();
            await expect(
                page
                    .getByTestId('sidebar-panel-topic')
                    .getByText(/Aboriginal and Torres Strait Islander/)
                    .first(),
            ).toBeVisible();

            // filter item not in data is not in sidebar
            await page.getByTestId('panel-minimisation-icon-graduate-attributes').click();
            await expect(page.getByTestId('sidebar-panel-graduate-attributes').locator(':scope > *')).toHaveCount(5); // one filter removed
            await expect(page.getByTestId('checkbox-graduate-attributes-respectful-leaders')).not.toBeVisible();
            await expect(page.getByTestId('checkbox-graduate-attributes-influential-communicators')).toBeVisible();
            await expect(page.getByTestId('dlor-homepage-loginprompt')).not.toBeVisible();
            // when the object doesn't have a particular facet type, it just doesn't appear in the panel footer item
            // (in practice, I think every object should have each of these)
            await expect(page.getByTestId('dlor-homepage-panel-98j3-fgf95-8j34-footer-type')).not.toBeVisible(); // MISSING FROM API RESULT
            await expect(page.getByTestId('dlor-homepage-panel-98j3-fgf95-8j34-footer-media')).toContainText(
                'Pressbook',
            );
            await page.goto('digital-learning-hub?user=public');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.getByTestId('dlor-homepage-loginprompt')).toContainText('Log in for extra features   ');
        });
        test('can filter panels', async ({ page }) => {
            // initially, all panels are showing
            await expect(page.getByTestId('dlor-homepage-list').locator(':scope > *')).toHaveCount(
                itemsPerPage + extraRowCount,
            );
            // select the "Assignments" checkbox
            await expect(
                page.locator('[data-testid="checkbox-topic-assignments"] input[type=checkbox]'),
            ).not.toBeChecked();
            await page.locator('[data-testid="checkbox-topic-assignments"] input[type=checkbox]').check();

            // reduces panel count
            await expect(page.getByTestId('dlor-homepage-list').locator(':scope > *')).toHaveCount(4 + extraRowCount);
            // open the Licence type panel
            await expect(page.getByTestId('panel-minimisation-icon-licence')).toHaveAttribute(
                'aria-label',
                'Open this filter section',
            );
            await page.getByTestId('panel-downarrow-licence').click();

            // check UQ copyright
            await expect(
                page.locator('[data-testid="checkbox-licence-uq-copyright"] input[type=checkbox]'),
            ).not.toBeChecked();
            await page.locator('[data-testid="checkbox-licence-uq-copyright"] input[type=checkbox]').check();

            // reduces panel count
            await expect(page.getByTestId('dlor-homepage-list').locator(':scope > *')).toHaveCount(1 + extraRowCount);
            // add another checkbox: CC BY-NC Attribution NonCommercial
            await expect(
                page.locator(
                    '[data-testid="checkbox-licence-cc-by-nc-attribution-noncommercial"] input[type=checkbox]',
                ),
            ).not.toBeChecked();
            await page
                .locator('[data-testid="checkbox-licence-cc-by-nc-attribution-noncommercial"] input[type=checkbox]')
                .check();

            // INCREASES panel count!!!
            await expect(page.getByTestId('dlor-homepage-list').locator(':scope > *')).toHaveCount(3 + extraRowCount);
            // uncheck UQ copyright
            await expect(
                page.locator('[data-testid="checkbox-licence-uq-copyright"] input[type=checkbox]'),
            ).toBeChecked();
            await page.locator('[data-testid="checkbox-licence-uq-copyright"] input[type=checkbox]').uncheck();

            // reduces panel count
            await expect(page.getByTestId('dlor-homepage-list').locator(':scope > *')).toHaveCount(2 + extraRowCount);
            // remove checkbox: CC BY-NC Attribution NonCommercial
            await expect(
                page.locator(
                    '[data-testid="checkbox-licence-cc-by-nc-attribution-noncommercial"] input[type=checkbox]',
                ),
            ).toBeChecked();
            await page
                .locator('[data-testid="checkbox-licence-cc-by-nc-attribution-noncommercial"] input[type=checkbox]')
                .uncheck();

            // open the Item type panel
            await expect(page.getByTestId('panel-minimisation-icon-item-type')).toHaveAttribute(
                'aria-label',
                'Open this filter section',
            );
            await page.getByTestId('panel-downarrow-item-type').click();
            await expect(page.getByTestId('panel-minimisation-icon-item-type')).toHaveAttribute(
                'aria-label',
                'Close this filter section',
            );
            // check the "Item type, Module" checkbox
            await expect(
                page.locator('[data-testid="checkbox-item-type-module"] input[type=checkbox]'),
            ).not.toBeChecked();
            await page.locator('[data-testid="checkbox-item-type-module"] input[type=checkbox]').check();

            // 3 panels showing
            await expect(page.getByTestId('dlor-homepage-list').locator(':scope > *')).toHaveCount(3 + extraRowCount);
            // UNcheck the "assignments" checkbox
            await page.locator('[data-testid="checkbox-topic-assignments"] input[type=checkbox]').uncheck();

            // 6 panels showing
            await expect(page.getByTestId('dlor-homepage-list').locator(':scope > *')).toHaveCount(6 + extraRowCount);
            // UNcheck the "Media format, Module" checkbox
            await page.locator('[data-testid="checkbox-item-type-module"] input[type=checkbox]').uncheck();

            // all panels showing
            await expect(page.getByTestId('dlor-homepage-list').locator(':scope > *')).toHaveCount(
                itemsPerPage + extraRowCount,
            );
            // check the "ATSIC" checkbox
            await expect(
                page.locator(
                    '[data-testid="checkbox-topic-aboriginal-and-torres-strait-islander"] input[type=checkbox]',
                ),
            ).not.toBeChecked();
            await page
                .locator('[data-testid="checkbox-topic-aboriginal-and-torres-strait-islander"] input[type=checkbox]')
                .check();

            // one panel showing
            await expect(page.getByTestId('dlor-homepage-list').locator(':scope > *')).toHaveCount(1 + extraRowCount);
            // UNcheck the "ATSIC" checkbox
            await expect(
                page.locator(
                    '[data-testid="checkbox-topic-aboriginal-and-torres-strait-islander"] input[type=checkbox]',
                ),
            ).toBeChecked();
            await page
                .locator('[data-testid="checkbox-topic-aboriginal-and-torres-strait-islander"] input[type=checkbox]')
                .uncheck();

            // all panels showing again
            await expect(page.getByTestId('dlor-homepage-list').locator(':scope > *')).toHaveCount(
                itemsPerPage + extraRowCount,
            );
            await page.locator('[data-testid="dlor-homepage-keyword"] input').fill('a');
            page.locator('[data-testid="dlor-homepage-keyword"] input').press('Enter');
            // a single character does nothing
            await expect(page.getByTestId('dlor-homepage-list').locator(':scope > *')).toHaveCount(
                itemsPerPage + extraRowCount,
            );
            // one more char
            await page.locator('[data-testid="dlor-homepage-keyword"] input').pressSequentially('c');
            page.locator('[data-testid="dlor-homepage-keyword"] input').press('Enter');
            await expect(page.getByTestId('dlor-homepage-list').locator(':scope > div')).toHaveCount(3 + extraRowCount);
            // check the "Assignments" checkbox
            await expect(
                page.locator('[data-testid="checkbox-topic-assignments"] input[type=checkbox]'),
            ).not.toBeChecked();
            await page.locator('[data-testid="checkbox-topic-assignments"] input[type=checkbox]').check();

            // wipes all the panels
            await expect(
                page
                    .getByTestId('dlor-homepage-empty')
                    .getByText(/Can't find what you are looking for\?/)
                    .first(),
            ).toBeVisible();

            // use the clear button
            await expect(page.locator('[data-testid="checkbox-topic-assignments"] input[type=checkbox]')).toBeChecked();
            await page.locator('[data-testid="checkbox-topic-assignments"] input[type=checkbox]').uncheck();
            await page.getByTestId('keyword-clear').click();

            // all panels showing again & keyword search field empty
            await expect(page.getByTestId('dlor-homepage-list').locator(':scope > *')).toHaveCount(
                itemsPerPage + extraRowCount,
            );
            await page.locator('[data-testid="dlor-homepage-keyword"] input').fill('digital');
            page.locator('[data-testid="dlor-homepage-keyword"] input').press('Enter');
            await expect(page.getByTestId('dlor-homepage-list').locator(':scope > *')).toHaveCount(5 + extraRowCount);
        });
        test.describe('keyword search bar filters correctly', () => {
            test('keyword filters on description', async ({ page }) => {
                // "involved" is found only in the description of "Artificial Intelligence - Digital Essentials"
                await page.locator('[data-testid="dlor-homepage-keyword"] input').fill('involved');
                page.locator('[data-testid="dlor-homepage-keyword"] input').press('Enter');
                // now only one panel
                await expect(page.getByTestId('dlor-homepage-list').locator(':scope > *')).toHaveCount(
                    1 + extraRowCount,
                );
                await expect(page.getByTestId('dlor-homepage-panel-938h-4986-654f')).toHaveText(
                    /Artificial Intelligence - Digital Essentials/,
                );
                await expect(page).toHaveURL('http://localhost:2020/digital-learning-hub?keyword=involved');
            });
            test('keyword filters on title', async ({ page }) => {
                // "Digital security" is found only in the title of "Digital security  - Digital Essentials"
                await page.locator('[data-testid="dlor-homepage-keyword"] input').fill('Digital security');
                page.locator('[data-testid="dlor-homepage-keyword"] input').press('Enter');
                // now only one panel
                await expect(page.getByTestId('dlor-homepage-list').locator(':scope > *')).toHaveCount(
                    1 + extraRowCount,
                );
                await expect(page.getByTestId('dlor-homepage-panel-98j3-fgf95-8j34')).toHaveText(
                    /Digital security - Digital Essentials/,
                );
                await expect(page).toHaveURL('http://localhost:2020/digital-learning-hub?keyword=Digital+security');
            });
            test('keyword filters on summary', async ({ page }) => {
                await page.locator('[data-testid="dlor-homepage-keyword"] input').type('freeware tools');
                await page.getByTestId('keyword-submit').click();

                // now only one panels
                await expect(page.getByTestId('dlor-homepage-list').locator(':scope > *')).toHaveCount(
                    1 + extraRowCount,
                );
                await expect(page.getByTestId('dlor-homepage-panel-0h4y-87f3-6js7')).toHaveText(
                    /Choose the right tool - Digital Essentials/,
                );
                await expect(page).toHaveURL('http://localhost:2020/digital-learning-hub?keyword=freeware+tools');
            });
            test('keyword filters on keywords', async ({ page }) => {
                await page.locator('[data-testid="dlor-homepage-keyword"] input').type('study hacks');
                await page.getByTestId('keyword-submit').click();

                // now only one panel
                await expect(page.getByTestId('dlor-homepage-list').locator(':scope > *')).toHaveCount(
                    1 + extraRowCount,
                );
                await expect(page.getByTestId('dlor-homepage-panel-987y-isjgt-9866')).toHaveText(
                    /Accessibility - Digital Essentials \(has Youtube link\)/,
                );
                await expect(page).toHaveURL('http://localhost:2020/digital-learning-hub?keyword=study+hacks');
            });
            test('keyword clear button clears form', async ({ page }) => {
                // given a search is loaded
                await page.locator('[data-testid="dlor-homepage-keyword"] input').fill('Implications');
                page.locator('[data-testid="dlor-homepage-keyword"] input').press('Enter');
                // num pages reduced
                await expect(page.getByTestId('dlor-homepage-list').locator(':scope > *')).toHaveCount(
                    1 + extraRowCount,
                );
                // when the keyword clear button is clicked
                await page.getByTestId('keyword-clear').click();

                // then all panels showing again & keyword search field empty
                await expect(page.getByTestId('dlor-homepage-list').locator(':scope > *')).toHaveCount(
                    itemsPerPage + extraRowCount,
                );
                await expect(page.locator('[data-testid="dlor-homepage-keyword"] input')).toHaveValue('');
            });
            test('keyboard delete clears the keyword field', async ({ page }) => {
                // given something is searched for
                await page.locator('[data-testid="dlor-homepage-keyword"] input').fill('acc');
                page.locator('[data-testid="dlor-homepage-keyword"] input').press('Enter');
                await expect(page.getByTestId('dlor-homepage-list').locator(':scope > *')).toHaveCount(
                    2 + extraRowCount,
                );
                // when the user manually clears the keyword field
                await page
                    .locator('[data-testid="dlor-homepage-keyword"] input')
                    .press(process.platform === 'darwin' ? 'Meta+a' : 'Control+a');
                await page.locator('[data-testid="dlor-homepage-keyword"] input').press('Backspace');
                await page.locator('[data-testid="dlor-homepage-keyword"] input').press('Enter');
                // then all panels showing again & keyword search field empty
                await expect(page.getByTestId('dlor-homepage-list').locator(':scope > *')).toHaveCount(
                    itemsPerPage + extraRowCount,
                );
                await expect(page.locator('[data-testid="dlor-homepage-keyword"] input')).toHaveValue('');
            });
            test('searching again returns to first page of pagination', async ({ page }) => {
                // performa search that returns more than one page of results
                await page.locator('[data-testid="dlor-homepage-keyword"] input').fill('dummy');
                page.locator('[data-testid="dlor-homepage-keyword"] input').press('Enter');
                await expect(page.getByTestId('dlor-homepage-list').locator(':scope > *')).toHaveCount(
                    itemsPerPage + extraRowCount,
                );
                // click pagination for page 2
                await page.locator('nav[aria-label="pagination navigation"] li:nth-child(4) button').click();
                await expect(page.getByTestId('dlor-homepage-list').locator(':scope > *')).toHaveCount(
                    7 + extraRowCount,
                );
                // we are on second page of pagination
                await expect(
                    page.locator('nav[aria-label="pagination navigation"] li:nth-child(4) button'),
                ).toHaveClass(/Mui-selected/);

                // when we change the search term...
                await page.locator('[data-testid="dlor-homepage-keyword"] input').clear();
                await page.locator('[data-testid="dlor-homepage-keyword"] input').fill('acc');
                await page.locator('[data-testid="dlor-homepage-keyword"] input').press('Enter');
                // we are on first page of pagination
                await expect(
                    page.locator('nav[aria-label="pagination navigation"] li:nth-child(3) button'),
                ).toHaveClass(/Mui-selected/);
            });
        });
        test('reset button works', async ({ page }) => {
            // all panels showing
            await expect(page.getByTestId('dlor-homepage-list').locator(':scope > *')).toHaveCount(
                itemsPerPage + extraRowCount,
            );
            await expect(page.locator('nav[aria-label="pagination navigation"] li:nth-child(5) button')).toBeVisible();

            // check the "ATSIC" checkbox
            await expect(
                page.locator(
                    '[data-testid="checkbox-topic-aboriginal-and-torres-strait-islander"] input[type=checkbox]',
                ),
            ).not.toBeChecked();
            await page
                .locator('[data-testid="checkbox-topic-aboriginal-and-torres-strait-islander"] input[type=checkbox]')
                .check();

            // 1 panel showing
            await expect(page.getByTestId('dlor-homepage-list').locator(':scope > *')).toHaveCount(1 + extraRowCount);
            // Interactive not visible
            await expect(page.getByTestId('checkbox-item-type-interactive')).not.toBeVisible();

            await page.getByTestId('panel-downarrow-item-type').click();
            // now the element appears
            await expect(page.getByTestId('panel-help-close-graduate-attributes')).not.toBeVisible();
            await page.getByTestId('panel-help-icon-graduate-attributes').click();
            await expect(page.getByTestId('panel-help-close-graduate-attributes')).toBeVisible();

            // click reset
            await page.getByTestId('sidebar-filter-reset-button').click({
                force: true,
            });
            // popup help closes
            await expect(page.getByTestId('panel-help-close-graduate-attributes')).not.toBeVisible();

            // Interactive not visible
            await expect(page.getByTestId('checkbox-item-type-interactive')).not.toBeVisible();
            await expect(
                page.locator(
                    '[data-testid="checkbox-topic-aboriginal-and-torres-strait-islander"] input[type=checkbox]',
                ),
            ).not.toBeChecked();

            // all panels showing
            await expect(page.getByTestId('dlor-homepage-list').locator(':scope > *')).toHaveCount(
                itemsPerPage + extraRowCount,
            );
            await expect(page.locator('nav[aria-label="pagination navigation"] li:nth-child(5) button')).toBeVisible();

            // click reset
            await page.getByTestId('sidebar-filter-reset-button').click({
                force: true,
            });
            // all panels showing
            await expect(page.getByTestId('dlor-homepage-list').locator(':scope > *')).toHaveCount(
                itemsPerPage + extraRowCount,
            );
            await expect(page.locator('nav[aria-label="pagination navigation"] li:nth-child(5) button')).toBeVisible();

            await page.getByTestId('panel-minimisation-icon-licence').click();
            await expect(
                page.locator('[data-testid="checkbox-licence-cc0public-domain"] input[type=checkbox]'),
            ).not.toBeChecked();
            await page.locator('[data-testid="checkbox-licence-cc0public-domain"] input[type=checkbox]').check();

            // button for "go to first page of results" is highlighted
            await expect(page.locator('nav[aria-label="pagination navigation"] li:nth-child(3) button')).toHaveClass(
                /Mui-selected/,
            );

            // change to pagination page 2
            await page.locator('nav[aria-label="pagination navigation"] li:nth-child(4) button').click();

            // button for "go to second page of results" is highlighted
            await expect(page.locator('nav[aria-label="pagination navigation"] li:nth-child(4) button')).toHaveClass(
                /Mui-selected/,
            );

            // click reset
            await page.getByTestId('sidebar-filter-reset-button').click({
                force: true,
            });
            // has reset pagination to page 1
            await expect(page.locator('nav[aria-label="pagination navigation"] button.Mui-selected')).toBeVisible();
        });
        test('has working site navigation - can move around the pages', async ({ page }) => {
            await page.locator('[data-testid="dlor-homepage-panel-987y-isjgt-9866"] div[role="button"]').click();

            // the first detail page loads
            await expect(page).toHaveURL(/http:\/\/localhost:2020\/digital-learning-hub\/view\/987y_isjgt_9866/);
            await expect(page.locator('[data-testid="dlor-detailpage"] h1')).toContainText(
                'Accessibility - Digital Essentials',
            );
            await expect(page.locator('[data-testid="dlor-detailpage-sitelabel"] a')).toHaveAttribute(
                'href',
                'http://localhost:2020/digital-learning-hub',
            );
            await page.locator('[data-testid="dlor-detailpage-sitelabel"] a').click();

            // back to homepage
            await expect(page.locator('h1')).toContainText('Find a digital learning object');
            await expect(page).toHaveURL(/http:\/\/localhost:2020\/digital-learning-hub/);

            // check the second panel
            await page.locator('[data-testid="dlor-homepage-panel-98s0-dy5k3-98h4"] div[role="button"]').click();

            // the second detail page loads
            await expect(page).toHaveURL(/http:\/\/localhost:2020\/digital-learning-hub\/view\/98s0_dy5k3_98h4/);
            await expect(page.locator('[data-testid="dlor-detailpage"] h1')).toContainText(
                'Advanced literature searching',
            );
            // back to homepage
            await expect(page.locator('[data-testid="dlor-detailpage-sitelabel"] a')).toHaveAttribute(
                'href',
                'http://localhost:2020/digital-learning-hub',
            );
            await page.locator('[data-testid="dlor-detailpage-sitelabel"] a').click();

            await expect(page.locator('h1')).toContainText('Find a digital learning object');
            await expect(page).toHaveURL(/http:\/\/localhost:2020\/digital-learning-hub/);

            // check the fourth panel
            await page.locator('[data-testid="dlor-homepage-panel-938h-4986-654f"] div[role="button"]').click();

            // the third detail page loads
            await expect(page).toHaveURL(/http:\/\/localhost:2020\/digital-learning-hub\/view\/938h_4986_654f/);
            await expect(page.locator('[data-testid="dlor-detailpage"] h1')).toContainText(
                'Artificial Intelligence - Digital Essentials',
            );
            // back button, alternate route back to homepage, works
            await page.goBack();
            await expect(page.locator('h1')).toContainText('Find a digital learning object');
            await expect(page).toHaveURL(/http:\/\/localhost:2020\/digital-learning-hub/);
        });
        test('shows a preview appropriately', async ({ page }) => {
            await page.goto('http://localhost:2020/digital-learning-hub/view/987y_isjgt_9866');
            await expect(
                page
                    .getByTestId('detailpage-preview')
                    .getByText(/Preview/)
                    .first(),
            ).toBeVisible();
            await expect(page.locator('[data-testid="detailpage-preview"] iframe')).toBeVisible();
            await page.goto('http://localhost:2020/digital-learning-hub/view/98s0_dy5k3_98h4');
            await expect(page.getByTestId('detailpage-preview')).not.toBeVisible();
            await expect(page.locator('[data-testid="detailpage-preview"] iframe')).not.toBeVisible();
        });
        test('pagination works', async ({ page }) => {
            // no data-testids in pagination :(
            const numPages = 3;
            const numExtraButtons = 4; // first, prev, next, last
            // there are the expected number of buttons in pagination widget
            await expect(page.locator('nav[aria-label="pagination navigation"] li').locator(':scope > *')).toHaveCount(
                numPages + numExtraButtons,
            );
            // button for "go to first page of results" is highlighted
            await expect(page.locator('nav[aria-label="pagination navigation"] li:nth-child(3) button')).toHaveClass(
                /Mui-selected/,
            );

            // the displayed entries are what is expected
            await expect(
                page
                    .locator('[data-testid="dlor-homepage-list"] div[role="button"] article header h2')
                    .getByText('Accessibility - Digital Essentials'),
            ).toBeVisible();
            await expect(
                page
                    .locator('[data-testid="dlor-homepage-list"] article header h2')
                    .getByText('Dummy entry to increase list size 2'),
            ).toBeVisible();
            // click pagination for next page
            await page.locator('nav[aria-label="pagination navigation"] li:nth-child(4) button').click();

            // the displayed entries have updated
            await expect(
                page
                    .locator('[data-testid="dlor-homepage-list"] div[role="button"]:first-child article header h2')
                    .getByText('Dummy entry to increase list size 3'),
            ).toBeVisible();
            await expect(
                page
                    .locator('[data-testid="dlor-homepage-list"] div:nth-child(11) article header h2')
                    .getByText('Dummy entry to increase list size 12'),
            ).toBeVisible();
            // click pagination to go to first page
            await page
                .locator('nav[aria-label="pagination navigation"] li:first-child button')
                .first()
                .click();

            // when we filter the content the number of pagination page buttons changes
            await page.locator('[data-testid="dlor-homepage-keyword"] input').fill('digital');
            page.locator('[data-testid="dlor-homepage-keyword"] input').press('Enter');
            await expect(page.getByTestId('dlor-homepage-list').locator(':scope > *')).toHaveCount(5 + extraRowCount);
            // the number of available pages in pagination widget changes from 3 to 1
            await expect(page.locator('nav[aria-label="pagination navigation"] li').locator(':scope > *')).toHaveCount(
                1 + numExtraButtons,
            );
        });
        test('create new object works', async ({ page }) => {
            await page.getByTestId('dlor-homepage-request-new-item').click();
            await expect(page.getByTestId('dlor-UserAdd-helper')).toBeVisible();
        });
    });
    test.describe('url reflects filtering changes', () => {
        test.beforeEach(async ({ page }) => {
            await page.goto('digital-learning-hub?keyword=acc&filters=11');
            await page.setViewportSize({ width: 1300, height: 1000 });
        });
        test('loads filters correctly from url', async ({ page }) => {
            // has reduced number of panels
            await expect(page.getByTestId('dlor-homepage-list').locator(':scope > *')).toHaveCount(2 + extraRowCount);
            await expect(page.getByTestId('panel-minimisation-icon-topic')).toHaveAttribute(
                'aria-label',
                'Open this filter section',
            );
            await expect(page.getByTestId('panel-minimisation-icon-graduate-attributes')).toHaveAttribute(
                'aria-label',
                'Close this filter section',
            );
            await expect(
                page.locator('[data-testid="checkbox-graduate-attributes-accomplished-scholars"] input'),
            ).not.toBeChecked();
            await expect(
                page.locator('[data-testid="checkbox-graduate-attributes-connected-citizens"] input'),
            ).toBeChecked();
            await expect(
                page.locator('[data-testid="checkbox-graduate-attributes-courageous-thinkers"] input'),
            ).not.toBeChecked();
            await expect(
                page.locator('[data-testid="checkbox-graduate-attributes-culturally-capable"] input'),
            ).not.toBeChecked();
            await expect(
                page.locator('[data-testid="checkbox-graduate-attributes-influential-communicators"] input'),
            ).not.toBeChecked();
            await expect(page.getByTestId('panel-minimisation-icon-item-type')).toHaveAttribute(
                'aria-label',
                'Open this filter section',
            );
            await expect(page.getByTestId('panel-minimisation-icon-media-format')).toHaveAttribute(
                'aria-label',
                'Open this filter section',
            );
            await expect(page.getByTestId('panel-minimisation-icon-subject')).toHaveAttribute(
                'aria-label',
                'Open this filter section',
            );
            await expect(page.getByTestId('panel-minimisation-icon-licence')).toHaveAttribute(
                'aria-label',
                'Open this filter section',
            );
        });
        test('loads multiple filters correctly from url', async ({ page }) => {
            await page.goto('digital-learning-hub?user=public&filters=44%2C24%2C13');
            // has reduced number of panels
            await expect(page.getByTestId('dlor-homepage-list').locator(':scope > *')).toHaveCount(1 + extraRowCount);
            await expect(
                page
                    .locator('[data-testid="dlor-homepage-panel-kj5t-8yg4-kj4f"] h2')
                    .getByText(/UQ has a Blak History/)
                    .first(),
            ).toBeVisible();

            await expect(page.getByTestId('panel-minimisation-icon-topic')).toHaveAttribute(
                'aria-label',
                'Open this filter section',
            );
            await expect(page.getByTestId('sidebar-panel-topic')).not.toBeVisible();

            await expect(page.getByTestId('panel-minimisation-icon-graduate-attributes')).toHaveAttribute(
                'aria-label',
                'Close this filter section',
            );
            await expect(
                page
                    .locator('[data-testid="sidebar-panel-graduate-attributes"] label')
                    .getByText(/Accomplished scholars/)
                    .first(),
            ).toBeVisible();

            await expect(page.getByTestId('panel-minimisation-icon-item-type')).toHaveAttribute(
                'aria-label',
                'Open this filter section',
            );
            await expect(page.getByTestId('sidebar-panel-item-type')).not.toBeVisible();

            await expect(page.getByTestId('panel-minimisation-icon-media-format')).toHaveAttribute(
                'aria-label',
                'Close this filter section',
            );
            await expect(
                page
                    .locator('[data-testid="sidebar-panel-media-format"] label')
                    .getByText(/H5P/)
                    .first(),
            ).toBeVisible();

            await expect(page.getByTestId('panel-minimisation-icon-subject')).toHaveAttribute(
                'aria-label',
                'Open this filter section',
            );
            await expect(page.getByTestId('sidebar-panel-subject')).not.toBeVisible();

            await expect(page.getByTestId('panel-minimisation-icon-licence')).toHaveAttribute(
                'aria-label',
                'Close this filter section',
            );
            await expect(
                page
                    .locator('[data-testid="sidebar-panel-licence"] label')
                    .getByText(/CC BY Attribution/)
                    .first(),
            ).toBeVisible();
        });
        test('saves changes from the page to the url', async ({ page }) => {
            await expect(page).toHaveURL('http://localhost:2020/digital-learning-hub?keyword=acc&filters=11');
            await expect(page.getByTestId('dlor-homepage-list').locator(':scope > *')).toHaveCount(2 + extraRowCount);
            // open the Topic type panel
            await expect(page.getByTestId('panel-minimisation-icon-topic')).toHaveAttribute(
                'aria-label',
                'Open this filter section',
            );
            await page.getByTestId('panel-downarrow-topic').click();

            // check Digital skills
            await expect(
                page.locator('[data-testid="checkbox-topic-digital-skills"] input[type=checkbox]'),
            ).not.toBeChecked();
            await page.locator('[data-testid="checkbox-topic-digital-skills"] input[type=checkbox]').check();

            // has reduced number of panels
            await expect(page.getByTestId('dlor-homepage-list').locator(':scope > *')).toHaveCount(1 + extraRowCount);
            // url has updated
            await expect(page).toHaveURL('http://localhost:2020/digital-learning-hub?keyword=acc&filters=11%2C3');
        });
        test('url and fields clear on reset', async ({ page }) => {
            await expect(page.getByTestId('dlor-homepage-list').locator(':scope > *')).toHaveCount(2 + extraRowCount);
            await page.getByTestId('sidebar-filter-reset-button').click();
            await expect(page).toHaveURL('http://localhost:2020/digital-learning-hub');
            await expect(page.getByTestId('dlor-homepage-list').locator(':scope > div')).toHaveCount(
                itemsPerPage + extraRowCount,
            );
        });
        test('back button maintains filters', async ({ page }) => {
            // click on first Object
            await page.locator('[data-testid="dlor-homepage-panel-987y-isjgt-9866"] div[role="button"]').click();

            // the detail page loads
            await expect(page).toHaveURL('http://localhost:2020/digital-learning-hub/view/987y_isjgt_9866');
            // hit the back button
            await page.goBack();
            // url contains the same values and the display is properly displayed and filtered
            await expect(page).toHaveURL('http://localhost:2020/digital-learning-hub?keyword=acc&filters=11');
            await expect(page.getByTestId('dlor-homepage-list').locator(':scope > *')).toHaveCount(2 + extraRowCount);
            await expect(page.getByTestId('panel-minimisation-icon-topic')).toHaveAttribute(
                'aria-label',
                'Open this filter section',
            );
            await expect(page.getByTestId('panel-minimisation-icon-graduate-attributes')).toHaveAttribute(
                'aria-label',
                'Close this filter section',
            );
            await expect(
                page.locator('[data-testid="checkbox-graduate-attributes-accomplished-scholars"] input'),
            ).not.toBeChecked();
            await expect(
                page.locator('[data-testid="checkbox-graduate-attributes-connected-citizens"] input'),
            ).toBeChecked();
        });
        test('url and fields clear on reset with other values in the url', async ({ page }) => {
            await page.goto('digital-learning-hub?user=public&keyword=acc&filters=11');
            await expect(page.getByTestId('dlor-homepage-list').locator(':scope > *')).toHaveCount(2 + extraRowCount);
            await page.getByTestId('sidebar-filter-reset-button').click();
            await expect(page).toHaveURL('http://localhost:2020/digital-learning-hub?user=public');
            await expect(page.getByTestId('dlor-homepage-list').locator(':scope > *')).toHaveCount(
                itemsPerPage + extraRowCount,
            );
        });
    });
    test.describe('other homepage visits', () => {
        test('can handle an error', async ({ page }) => {
            await page.goto('digital-learning-hub?responseType=error');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(
                page
                    .getByTestId('dlor-homepage-error')
                    .getByText(/An error has occurred during the request and this request cannot be processed/)
                    .first(),
            ).toBeVisible();
            await expect(
                page
                    .getByTestId('dlor-homepage-filter-error')
                    .getByText(/Filters currently unavailable - please try again later\./)
                    .first(),
            ).toBeVisible();
        });
        test('can handle an empty result', async ({ page }) => {
            await page.goto('digital-learning-hub?responseType=emptyResult');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.getByTestId('dlor-homepage-noresult')).toBeVisible();
            await expect(
                page
                    .getByTestId('dlor-homepage-noresult')
                    .getByText(/We did not find any entries in the system - please try again later\./)
                    .first(),
            ).toBeVisible();
        });
        test('mobile page works as expected', async ({ page }) => {
            await page.goto('digital-learning-hub', { timeout: 90_000 });
            await page.setViewportSize({ width: 800, height: 900 });
            // tablet/phone hero images should be full width
            await expect(
                page
                    .getByTestId('hero-card-title')
                    .getByText(/Find a digital learning object/)
                    .first(),
            ).toBeVisible();
            await expect(
                page
                    .getByTestId('hero-card-description')
                    .getByText(
                        /Use the Digital Learning Hub to find modules, videos and guides for teaching and study\./,
                    )
                    .first(),
            ).toBeVisible();

            // filters correctly
            await expect(page.getByTestId('filter-sidebar')).not.toBeVisible();
            await page
                .getByTestId('sidebar-filter-icon')
                .locator('button')
                .click();

            await page.getByTestId('filter-sidebar').scrollIntoViewIfNeeded();
            await expect(page.getByTestId('sidebar-filter-icon')).not.toBeVisible();
            await expect(page.getByTestId('dlor-homepage-list').locator(':scope > *')).toHaveCount(
                itemsPerPage + extraRowCount,
            );
            await expect(
                page.locator(
                    '[data-testid="checkbox-topic-aboriginal-and-torres-strait-islander"] input[type=checkbox]',
                ),
            ).not.toBeChecked();
            await page
                .locator('[data-testid="checkbox-topic-aboriginal-and-torres-strait-islander"] input[type=checkbox]')
                .check();
            await expect(page.getByTestId('dlor-homepage-list').locator(':scope > *')).toHaveCount(1 + extraRowCount);
            // hide the filter section
            await page
                .getByTestId('sidebar-filter-icon-hide-id')
                .locator('button')
                .click();
            await expect(page.getByTestId('filter-sidebar')).not.toBeVisible();
        });
    });
    test.describe('authenticated page', () => {
        test('can handle non authenticated request to forced auth page', async ({ page }) => {
            await page.goto('digital-learning-hub-list?user=public');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.getByTestId('StandardPage-title')).toContainText('Authentication required');
        });
        test('can handle authenticated request to forced auth page', async ({ page }) => {
            await page.goto('digital-learning-hub-list');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.locator('h1')).toContainText('Find a digital learning object');
        });
    });
    test.describe('unavailable objects', () => {
        test('unavailable objects are shown correctly in list', async ({ page }) => {
            await page.route('https://assets.library.uq.edu.au/reusable-webcomponents/**', route => {
                route.fulfill({
                    status: 200,
                    body: '',
                });
            });
            await page.goto('digital-learning-hub?user=public');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await page.locator('[aria-label="Go to page 3"]').click();
            await expect(
                page
                    .getByText(/Staff Restricted Object/)
                    .locator('../../..')
                    .getByText(/You need to be UQ staff to view this object/i),
            ).toBeVisible();
        });
    });
});
