import { test, expect } from '@uq/pw/test';

test.describe('header', () => {
    // really this ought to be in reusable
    // but we are testing how it appears _in_ homepage so we need homepage available
    // so it has to be here :(
    test.describe('breadcrumbs', () => {
        test('loads the breadcrumbs correctly', async ({ page }) => {
            await page.goto('http://localhost:2020/?user=s1111111');
            await page.setViewportSize({ width: 1280, height: 900 });

            // once the page has loaded
            await expect(
                page
                    .getByTestId('help-navigation-panel')
                    .getByText(/Find and borrow/)
                    .first(),
            ).toBeVisible();

            // then the homepage has the correct breadcrumbs
            await expect(
                page
                    .getByTestId('site-title')
                    .getByText(/Library Local/)
                    .first(),
            ).toHaveAttribute('href', /http:\/\/localhost:2020\/\?user=s1111111/);
            await expect(page.getByTestId('secondlevel-site-title')).not.toBeVisible();

            // when we visit a subsystem
            // (could have been any of the subsystems, but this one has a link on page
            // and its valuable to test the actual navigation)
            await page
                .getByTestId('learning-resource-panel-course-link-0')
                .getByText(/FREN1010/)
                .first()
                .click();

            // the Learning Resource page loads
            await expect(page).toHaveURL(
                'http://localhost:2020/learning-resources?user=s1111111&coursecode=FREN1010&campus=St%20Lucia&semester=Semester%202%202020',
            );
            await expect(
                page
                    .getByTestId('StandardPage')
                    .getByText(/Learning resources/)
                    .first(),
            ).toBeVisible();

            // and the correct breadcrumbs are present
            {
                const scope = page.locator('uq-site-header');
                await expect(
                    scope
                        .getByTestId('site-title')
                        .getByText(/Library Local/)
                        .first(),
                ).toHaveAttribute('href', /http:\/\/localhost:2020\/\?user=s1111111/);
                await expect(
                    scope
                        .getByTestId('secondlevel-site-title')
                        .getByText(/Learning resource/)
                        .first(),
                ).toHaveAttribute('href', /\/learning-resources/);

                // ok now the important test: nav back to homepage and then show third breadcrumb removed
                await scope.getByTestId('site-title').click();
            }

            // show the page has fully loaded
            await expect(page).toHaveURL('http://localhost:2020/?user=s1111111');
            await expect(
                page
                    .getByTestId('help-navigation-panel')
                    .getByText(/Find and borrow/)
                    .first(),
            ).toBeVisible();

            // and the breadcrumbs are as expected:  learning resource breadcrumb has been removed :)
            {
                const scope = page.locator('uq-site-header');
                await expect(
                    scope
                        .getByTestId('site-title')
                        .getByText(/Library Local/)
                        .first(),
                ).toHaveAttribute('href', /http:\/\/localhost:2020\/\?user=s1111111/);
                await expect(scope.getByTestId('secondlevel-site-title')).not.toBeVisible();
            }
        });
        test('clears breadcrumbs on back button', async ({ page }) => {
            await page.goto('http://localhost:2020/?user=s1111111');
            await page.setViewportSize({ width: 1280, height: 900 });

            // once the page has loaded
            await expect(
                page
                    .getByTestId('help-navigation-panel')
                    .getByText(/Find and borrow/)
                    .first(),
            ).toBeVisible();

            // then the homepage has the correct breadcrumbs
            await expect(
                page
                    .getByTestId('site-title')
                    .getByText(/Library Local/)
                    .first(),
            ).toHaveAttribute('href', 'http://localhost:2020/?user=s1111111');
            await expect(page.getByTestId('secondlevel-site-title')).not.toBeVisible();

            // when we visit a subsystem
            // (could have been any of the subsystems, but this one has a link on page
            // and its valuable to test the actual navigation)
            await page
                .getByTestId('learning-resource-panel-course-link-0')
                .getByText(/FREN1010/)
                .first()
                .click();

            // the Learning Resource page loads
            await expect(page).toHaveURL(
                'http://localhost:2020/learning-resources?user=s1111111&coursecode=FREN1010&campus=St%20Lucia&semester=Semester%202%202020',
            );
            await expect(
                page
                    .getByTestId('StandardPage')
                    .getByText(/Learning resources/)
                    .first(),
            ).toBeVisible();

            // and the correct breadcrumbs are present
            {
                const scope = page.locator('uq-site-header');
                await expect(
                    scope
                        .getByTestId('site-title')
                        .getByText(/Library Local/)
                        .first(),
                ).toHaveAttribute('href', /http:\/\/localhost:2020\/\?user=s1111111/);
                await expect(
                    scope
                        .getByTestId('secondlevel-site-title')
                        .getByText(/Learning resource/)
                        .first(),
                ).toHaveAttribute('href', /\/learning-resources/);
                // ok now the important test: use the back button to homepage and then show third breadcrumb removed
                await page.goBack();
            }

            // show the page has fully loaded
            await expect(page).toHaveURL('http://localhost:2020/?user=s1111111');
            await expect(
                page
                    .getByTestId('help-navigation-panel')
                    .getByText(/Find and borrow/)
                    .first(),
            ).toBeVisible();

            // and the breadcrumbs are as expected:  learning resource breadcrumb has been removed :)
            {
                const scope = page.locator('uq-site-header');
                await expect(
                    scope
                        .getByTestId('site-title')
                        .getByText(/Library Local/)
                        .first(),
                ).toHaveAttribute('href', /http:\/\/localhost:2020\/\?user=s1111111/);
                await expect(scope.getByTestId('secondlevel-site-title')).not.toBeVisible();
            }
        });
    });
    test('changes on mobile correctly', async ({ page }) => {
        // again, ideally this would be tested in reusable, but we dont have a page there that shows it own breadcrumb
        await page.goto('http://localhost:2020/learning-resources?user=s1111111');
        await expect(
            page
                .getByTestId('StandardPage-title')
                .getByText(/Learning resources/)
                .first(),
        ).toBeVisible();

        // and the correct breadcrumbs are present
        await expect(
            page
                .getByTestId('root-link')
                .getByText(/UQ home/)
                .first(),
        ).toHaveAttribute('href', /https:\/\/uq\.edu\.au\//);
        await expect(
            page
                .getByTestId('site-title')
                .getByText(/Library Local/)
                .first(),
        ).toHaveAttribute('href', /http:\/\/localhost:2020\/\?user=s1111111/);
        await expect(
            page
                .getByTestId('secondlevel-site-title')
                .getByText(/Learning resource/)
                .first(),
        ).toHaveAttribute('href', /\/learning-resources/);

        // on the mobile view
        await page.setViewportSize({ width: 590, height: 1024 });

        // we only see the library homepage link
        {
            const scope = page.locator('uq-site-header');
            await expect(scope.getByTestId('root-link')).not.toBeVisible();
            await expect(
                scope
                    .getByTestId('site-title')
                    .getByText(/Library Local/)
                    .first(),
            ).toHaveAttribute('href', /http:\/\/localhost:2020\/\?user=s1111111/);
            await expect(scope.getByTestId('secondlevel-site-title')).not.toBeVisible();
        }
    });
});
