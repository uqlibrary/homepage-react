import { test, expect } from '@uq/pw/test';
import { assertAccessibility } from '@uq/pw/lib/axe';
import moment from 'moment-timezone';
import { typeCKEditor } from '@uq/pw/lib/ckeditor';
import { DLOR_NO_EDIT_USER } from '@uq/pw/lib/constants';
import { setInputValue } from '@uq/pw/lib/helpers';

test.describe('Digital Learning Hub View page', () => {
    test.describe('details page', () => {
        test('appears as expected', async ({ page }) => {
            await page.route('https://uq.h5p.com/**', route => {
                route.fulfill({
                    status: 200,
                    body: 'user has navigated to pressbook link',
                });
            });
            await page.goto('digital-learning-hub/view/938h_4986_654f');
            await expect(page.locator('[data-testid="dlor-detailpage"] h1')).toHaveText(
                /Artificial Intelligence - Digital Essentials/,
            );
            await expect(
                page
                    .getByTestId('subsite-title')
                    .getByText(/Digital learning hub/)
                    .first(),
            ).toBeVisible();
            await expect(page.getByTestId('dlor-detailpage-cultural-advice-custom-indicator')).not.toBeVisible();
            await expect(page.getByTestId('dlor-detailpage-featured-custom-indicator')).not.toBeVisible();
            await expect(
                page
                    .getByTestId('dlor-detailpage-object-series-name-custom-indicator')
                    .getByText(/Series: Digital Essentials/)
                    .first(),
            ).toBeVisible();
            await expect(page.getByTestId('dlor-detailpage-description')).toHaveText(
                /Types of AI, implications for society, using AI in your studies and how UQ is involved\. \(longer lines\)/,
            );
            await expect(
                page.locator('[data-testid="dlor-detailpage"] h2').getByText(/Add the object to your course/),
            ).toBeVisible();

            // meta data in sidebar is as expected
            await expect(
                page
                    .locator('[data-testid="detailpage-filter-topic"] h3')
                    .getByText(/Topic/)
                    .first(),
            ).toBeVisible();
            await expect(page.locator('[data-testid="detailpage-filter-topic"] ul').locator(' > *')).toHaveCount(2);
            await expect(page.locator('[data-testid="detailpage-filter-topic"] ul li:first-child')).toHaveText(
                /Assignments/,
            );
            // not effective.
            await expect(
                page.locator('[data-testid="detailpage-filter-topic"] ul li:first-child a:nth-of-type(2)'),
            ).not.toBeVisible(); // no help link

            await expect(page.locator('[data-testid="detailpage-filter-topic"] ul li:nth-child(2)')).toHaveText(
                /Software/,
            );

            await expect(
                page
                    .locator('[data-testid="detailpage-filter-item-type"] h3')
                    .getByText(/Item type/)
                    .first(),
            ).toBeVisible();
            await expect(page.locator('[data-testid="detailpage-filter-item-type"] ul').locator('> *')).toHaveCount(1);
            await expect(page.locator('[data-testid="detailpage-filter-item-type"] ul li:first-child')).toHaveText(
                /Module/,
            );
            await expect(
                page.locator('[data-testid="detailpage-filter-item-type"] ul li:first-child a:nth-of-type(2)'),
            ).not.toBeVisible(); // no help link

            await expect(
                page
                    .locator('[data-testid="detailpage-filter-media-format"] h3')
                    .getByText(/Media format/)
                    .first(),
            ).toBeVisible();
            await expect(page.locator('[data-testid="detailpage-filter-media-format"] ul').locator('> *')).toHaveCount(
                1,
            );
            await expect(page.locator('[data-testid="detailpage-filter-media-format"] ul li:first-child')).toHaveText(
                /H5P/,
            );
            await expect(
                page.locator('[data-testid="detailpage-filter-media-format"] ul li:first-child a:nth-of-type(2)'),
            ).not.toBeVisible(); // no help link

            await expect(
                page
                    .locator('[data-testid="detailpage-filter-subject"] h3')
                    .getByText(/Subject/)
                    .first(),
            ).toBeVisible();
            await expect(page.locator('[data-testid="detailpage-filter-subject"] ul').locator('> *')).toHaveCount(2);
            await expect(page.locator('[data-testid="detailpage-filter-subject"] ul li:first-child')).toHaveText(
                /Health; Behavioural Sciences/,
            );
            await expect(
                page.locator('[data-testid="detailpage-filter-subject"] ul li:first-child a:nth-of-type(2)'),
            ).not.toBeVisible(); // no help link
            await expect(page.locator('[data-testid="detailpage-filter-subject"] ul li:nth-child(2)')).toHaveText(
                /Medicine; Biomedical Sciences/,
            );

            await expect(
                page
                    .locator('[data-testid="detailpage-filter-licence"] h3')
                    .getByText(/Licence/)
                    .first(),
            ).toBeVisible();
            await expect(page.locator('[data-testid="detailpage-filter-licence"] ul').locator('> *')).toHaveCount(1);
            await expect(page.locator('[data-testid="detailpage-filter-licence"] ul li:first-child')).toHaveText(
                /UQ copyright/,
            );
            await expect(
                page.locator('[data-testid="detailpage-filter-licence"] ul li:first-child a:nth-of-type(2)'),
            ).toBeVisible(); // help link exists

            await expect(
                page
                    .locator('[data-testid="detailpage-filter-graduate-attributes"] h3')
                    .getByText(/Graduate attributes/)
                    .first(),
            ).toBeVisible();
            await expect(
                page.locator('[data-testid="detailpage-filter-graduate-attributes"] ul').locator('> *'),
            ).toHaveCount(2);
            await expect(
                page.locator('[data-testid="detailpage-filter-graduate-attributes"] ul li:first-child'),
            ).toHaveText(/Accomplished scholars/);
            await expect(
                page.locator(
                    '[data-testid="detailpage-filter-graduate-attributes"] ul li:first-child a:nth-of-type(2)',
                ),
            ).not.toBeVisible(); // no help link

            await expect(
                page.locator('[data-testid="detailpage-filter-graduate-attributes"] ul li:nth-child(2)'),
            ).toHaveText(/Influential communicators/);

            {
                const scope = page.getByTestId('detailpage-metadata-keywords');
                await expect(scope.locator('h3')).toHaveText(/Keywords/);
                await expect(scope.locator('li')).toHaveCount(8);
                await expect(scope.getByText(/Generative AI/).first()).toBeVisible();
            }

            // the series footer appears as expected (shows the sorting is working)
            await expect(
                page
                    .getByTestId('dlor-view-series-item-98j3-fgf95-8j34-order-0')
                    .getByText(/Digital security - Digital Essentials/)
                    .first(),
            ).toBeVisible();
            await expect(
                page
                    .getByTestId('dlor-view-series-item-938h-4986-654f-order-1')
                    .getByText(/Artificial Intelligence - Digital Essentials/)
                    .first(),
            ).toBeVisible();
            // and is starred as the current item
            await expect(
                page.locator('[data-testid="dlor-view-series-item-938h-4986-654f-order-1"] [data-testid="StarIcon"]'),
            ).toBeVisible();
            await expect(
                page
                    .getByTestId('dlor-view-series-item-0h4y-87f3-6js7-order-2')
                    .getByText(/Choose the right tool - Digital Essentials/)
                    .first(),
            ).toBeVisible();
            await expect(
                page
                    .getByTestId('dlor-view-series-item-987y-isjgt-9866-order-3')
                    .getByText(/Accessibility - Digital Essentials \(has Youtube link\)/)
                    .first(),
            ).toBeVisible();
            await expect(
                page
                    .getByTestId('dlor-view-series-item-0j45-87h4-23hd7-order-4')
                    .getByText(/Communicate and collaborate - Digital Essentials/)
                    .first(),
            ).toBeVisible();

            // the link can be clicked
            await expect(page.getByTestId('detailpage-clicklink')).toHaveText(/Access the object/);
            await page.getByTestId('detailpage-clicklink').click();
            await expect(
                page
                    .locator('body')
                    .getByText(/user has navigated to pressbook link/)
                    .first(),
            ).toBeVisible();
        });

        test('shows correct button for different types of records', async ({ page }) => {
            await page.goto('/digital-learning-hub/view/987y-dfgrf4-76gsg-16');
            await expect(page.getByTestId('detailpage-clicklink')).toHaveText(/Access the object \(205m 45s\)/);

            await page.goto('/digital-learning-hub/view/987y-dfgrf4-76gsg-15');
            await expect(page.getByTestId('detailpage-clicklink')).toHaveText(/\(video\)/);
            await page.goto('/digital-learning-hub/view/987y-dfgrf4-76gsg-14');
            await expect(page.getByTestId('detailpage-clicklink')).toHaveText(/\(123\.5 MB\)/);
            await page.goto('/digital-learning-hub/view/987y-dfgrf4-76gsg-13');
            await expect(page.getByTestId('detailpage-clicklink')).toHaveText(/\(video\)/);
            // ensure cancel button works.
            await page.getByTestId('detailpage-demographics-button').click();
            await page.getByTestId('demographics-cancel').click();
            await expect(page.getByTestId('demographics-cancel')).not.toBeVisible();
            await page.getByTestId('detailpage-notify-button').click();
            await page.getByTestId('notifications-cancel').click();
            await expect(page.getByTestId('notifications-cancel')).not.toBeVisible();
        });
        test('has expected cultural advice', async ({ page }) => {
            // custom indicators appears
            await page.goto('http://localhost:2020/digital-learning-hub/view/kj5t_8yg4_kj4f');
            await expect(
                page
                    .getByTestId('dlor-detailpage-cultural-advice-custom-indicator')
                    .getByText(/Cultural advice/)
                    .first(),
            ).toBeVisible();

            await expect(
                page
                    .getByTestId('dlor-detailpage-featured-custom-indicator')
                    .getByText(/Featured/)
                    .first(),
            ).toBeVisible();
            await expect(page.getByTestId('dlor-detailpage-object-series-name-custom-indicator')).not.toBeVisible();
            await expect(
                page
                    .getByTestId('dlor-detailpage-cultural-advice')
                    .getByText(/Aboriginal and Torres Strait Islander peoples are warned/)
                    .first(),
            ).toBeVisible();
        });
        test('is accessible', async ({ page }) => {
            await page.goto('digital-learning-hub/view/98s0_dy5k3_98h4');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.locator('[data-testid="dlor-detailpage"] h1')).toHaveText(
                /Advanced literature searching/,
            );
            await assertAccessibility(page, '[data-testid="StandardPage"]');
        });
        test('a view page without keywords has a sensible sidebar', async ({ page }) => {
            await page.goto('digital-learning-hub/view/9k45_hgr4_876h');

            await expect(page.locator('[data-testid="dlor-detailpage"] h1')).toHaveText(/EndNote 20: Getting started/);
            await expect(page.getByTestId('detailpage-metadata-keywords')).not.toBeVisible();
        });
        test('can handle an error', async ({ page }) => {
            await page.goto('digital-learning-hub/view/98s0_dy5k3_98h4?responseType=error');
            await page.setViewportSize({ width: 1300, height: 1000 });

            await expect(
                page
                    .getByTestId('dlor-detailpage-error')
                    .getByText(/An error has occurred during the request and this request cannot be processed/)
                    .first(),
            ).toBeVisible();
        });
        test('can handle an empty result', async ({ page }) => {
            // this should never happen. Maybe immediately after initial upload
            await page.goto('digital-learning-hub/view/missingRecord');
            await page.setViewportSize({ width: 1300, height: 1000 });

            await expect(
                page
                    .getByTestId('dlor-detailpage-empty')
                    .getByText(/We could not find the requested entry - please check the web address\./)
                    .first(),
            ).toBeVisible();
        });
    });
    test.describe('demographics & notifications send properly', () => {
        test.beforeEach(async ({ page, context }) => {
            // setup so we can check what we "sent" to the db
            await context.addCookies([
                {
                    name: 'CYPRESS_TEST_DATA',
                    value: 'active',
                    url: 'http://localhost',
                },
            ]);
        });

        test('can visit the object link without gathering demographics', async ({ page, context }) => {
            await page.goto('digital-learning-hub/view/9bc174f7-5326-4a8b-bfab-d5081c688597');
            await page.setViewportSize({ width: 1300, height: 1000 });

            // user chooses not to enter data
            await page.getByTestId('detailpage-clicklink').click();

            const cookies = await context.cookies();
            const cookie = cookies.find(c => c.name === 'CYPRESS_DATA_SAVED');
            expect(cookie).toBeUndefined();

            await expect(page).toHaveURL(/exams/);
        });

        test('Notify requires you to enter an email address', async ({ page }) => {
            await page.goto('digital-learning-hub/view/9bc174f7-5326-4a8b-bfab-d5081c688597?user=s2222222');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.getByTestId('dlor-detailpage').locator('h1')).toBeVisible();

            // enter a subject so that something is sent even thoiught they uncheck notify
            await page.getByTestId('detailpage-notify-button').click();
            await expect(page.getByTestId('notifications-capture')).not.toBeDisabled();

            const userEmailInput = page.locator('#userEmail');
            await expect(async () => {
                await setInputValue(userEmailInput, '');
                await expect(page.getByTestId('notifications-capture')).toBeDisabled({ timeout: 2000 });
            }).toPass();

            await expect(async () => {
                await setInputValue(userEmailInput, 'test');
                await expect(page.getByTestId('notifications-capture')).toBeDisabled({ timeout: 2000 });
            }).toPass();

            await expect(async () => {
                await setInputValue(userEmailInput, 'test@test.com');
                await expect(page.getByTestId('notifications-capture')).not.toBeDisabled({ timeout: 2000 });
            }).toPass();

            await expect(async () => {
                await setInputValue(userEmailInput, 'thisfails');
                await expect(page.getByTestId('notifications-capture')).toBeDisabled({ timeout: 2000 });
            }).toPass();
        });

        test('sends demographics correctly', async ({ page, context }) => {
            await page.goto('digital-learning-hub/view/9bc174f7-5326-4a8b-bfab-d5081c688597');
            await page.setViewportSize({ width: 1300, height: 1000 });

            const typeSubject = 'PHIL1001';
            const typeSchoolName = 'School of Mathematics';
            await page.getByTestId('detailpage-demographics-button').click();
            await page
                .getByTestId('view-demographics-subject-code')
                .locator('input')
                .fill(typeSubject);
            await page
                .getByTestId('view-demographics-school-name')
                .locator('input')
                .fill(typeSchoolName);
            const captureButton = page.getByTestId('demographics-capture');
            await expect(captureButton).not.toBeDisabled();
            await captureButton.click();
            await expect(page.getByTestId('message-title').getByText('Demographic information saved')).toBeVisible();

            const expectedValues = {
                dlorUuid: '9bc174f7-5326-4a8b-bfab-d5081c688597',
                demographics: {
                    comments: '',
                    subject: typeSubject,
                    school: typeSchoolName,
                },
                subscribeRequest: {
                    userName: '',
                    userEmail: '',
                    loggedin: true,
                },
            };
            const cookies = await context.cookies();
            const cookie = cookies.find(c => c.name === 'CYPRESS_DATA_SAVED');
            expect(cookie).toBeDefined();
            const decodedValue = decodeURIComponent(cookie!.value);
            const sentValues = JSON.parse(decodedValue);

            expect(sentValues).toEqual(expectedValues);

            await context.clearCookies({ name: 'CYPRESS_DATA_SAVED' });
            await context.clearCookies({ name: 'CYPRESS_TEST_DATA' });
        });

        test('sends notifications correctly', async ({ page, context }) => {
            await page.goto('digital-learning-hub/view/9bc174f7-5326-4a8b-bfab-d5081c688597?user=digiteamMember');
            await page.setViewportSize({ width: 1300, height: 1000 });

            await page.getByTestId('detailpage-notify-button').click();

            await expect(page.getByTestId('view-notify-preferredName').locator('input')).toHaveValue('Caroline');
            await expect(page.getByTestId('view-notify-userEmail').locator('input')).toHaveValue(
                'j.Researcher@uq.edu.au',
            );

            await page.getByTestId('notifications-capture').click();

            const expectedValues = {
                dlorUuid: '9bc174f7-5326-4a8b-bfab-d5081c688597',
                demographics: {
                    comments: '',
                    subject: '',
                    school: '',
                },
                subscribeRequest: {
                    userName: 'Caroline',
                    userEmail: 'j.Researcher@uq.edu.au',
                    loggedin: true,
                },
            };
            const cookies = await context.cookies();
            const cookie = cookies.find(c => c.name === 'CYPRESS_DATA_SAVED');
            expect(cookie).toBeDefined();
            const decodedValue = decodeURIComponent(cookie!.value);
            const sentValues = JSON.parse(decodedValue);

            expect(sentValues).toEqual(expectedValues);

            await context.clearCookies({ name: 'CYPRESS_DATA_SAVED' });
            await context.clearCookies({ name: 'CYPRESS_TEST_DATA' });

            await expect(
                page
                    .getByTestId('dialogbox-dlor-save-notification')
                    .locator('text=/Please check your email to confirm your subscription request/'),
            ).toBeVisible();
            await expect(page.getByTestId('cancel-dlor-save-notification')).not.toBeVisible();
        });

        test('handles a failure to save notify properly', async ({ page, context }) => {
            await page.goto(
                'digital-learning-hub/view/9bc174f7-5326-4a8b-bfab-d5081c688597?user=digiteamMember&responseType=notifyError',
            );
            await page.setViewportSize({ width: 1300, height: 1000 });

            // reveal the notify fields
            await page.getByTestId('detailpage-notify-button').click();

            await expect(page.getByTestId('view-notify-preferredName').locator('input')).toHaveValue('Caroline');
            await expect(page.getByTestId('view-notify-userEmail').locator('input')).toHaveValue(
                'j.Researcher@uq.edu.au',
            );

            await page.getByTestId('notifications-capture').click();

            const expectedValues = {
                dlorUuid: '9bc174f7-5326-4a8b-bfab-d5081c688597',
                demographics: {
                    comments: '',
                    subject: '',
                    school: '',
                },
                subscribeRequest: {
                    userName: 'Caroline',
                    userEmail: 'j.Researcher@uq.edu.au',
                    loggedin: true,
                },
            };
            const cookies = await context.cookies();
            const cookie = cookies.find(c => c.name === 'CYPRESS_DATA_SAVED');
            expect(cookie).toBeDefined();
            const decodedValue = decodeURIComponent(cookie!.value);
            const sentValues = JSON.parse(decodedValue);

            expect(sentValues).toEqual(expectedValues);

            await context.clearCookies({ name: 'CYPRESS_DATA_SAVED' });
            await context.clearCookies({ name: 'CYPRESS_TEST_DATA' });

            await expect(
                page.getByTestId('dialogbox-dlor-save-notification').locator('text=/There was a problem/'),
            ).toBeVisible();
            await expect(page.getByTestId('cancel-dlor-save-notification')).not.toBeVisible();
            await page.getByTestId('confirm-dlor-save-notification').click();
        });

        test('handles where the user was already subscribed', async ({ page, context }) => {
            await page.goto(
                'digital-learning-hub/view/9bc174f7-5326-4a8b-bfab-d5081c688597?user=digiteamMember&responseType=alreadysubscribed',
            );
            await page.setViewportSize({ width: 1300, height: 1000 });

            await page.getByTestId('detailpage-notify-button').click();

            await expect(page.getByTestId('view-notify-preferredName').locator('input')).toHaveValue('Caroline');
            await expect(page.getByTestId('view-notify-userEmail').locator('input')).toHaveValue(
                'j.Researcher@uq.edu.au',
            );

            await page.getByTestId('notifications-capture').click();
            await expect(
                page.getByTestId('dialogbox-dlor-save-notification').locator('text=/You are already subscribed/'),
            ).toBeVisible();
            await expect(page.getByTestId('cancel-dlor-save-notification')).not.toBeVisible();
            await page.getByTestId('confirm-dlor-save-notification').click();
        });
    });
    test.describe('"Access it" units show properly', () => {
        test('A watchable object shows the correct units on the Get It button', async ({ page }) => {
            await page.goto('digital-learning-hub/view/987y_isjgt_9866');
            await page.setViewportSize({ width: 1300, height: 1000 });

            await expect(page.getByTestId('detailpage-clicklink')).toHaveText('Access the object (video 47m 44s)');
        });

        test('A downloadable object shows the correct units on the Get It button', async ({ page }) => {
            await page.goto('digital-learning-hub/view/9bc192a8-324c-4f6b-ac50-07e7ff2df240');
            await page.setViewportSize({ width: 1300, height: 1000 });

            await expect(page.getByTestId('detailpage-clicklink')).toHaveText('Access the object (XLS 3.4 GB)');
        });

        test('A neither watchable nor downloadable object shows just "Access the object" on the Get It button', async ({
            page,
        }) => {
            await page.goto('digital-learning-hub/view/98s0_dy5k3_98h4');
            await page.setViewportSize({ width: 1300, height: 1000 });

            await expect(page.getByTestId('detailpage-clicklink')).toHaveText('Access the object');
        });
    });
    test.describe('user-level privilege', () => {
        test('the non-logged in user is prompted to login', async ({ page }) => {
            await page.goto('digital-learning-hub/view/987y_isjgt_9866?user=public');
            await page.setViewportSize({ width: 1300, height: 1000 });

            await expect(
                page
                    .getByTestId('dlor-homepage-loginprompt')
                    .getByText(/for extra features/)
                    .first(),
            ).toBeVisible();
            await expect(page.getByTestId('detailpage-notify-button')).toHaveAttribute('aria-disabled', 'true');
            await expect(page.getByTestId('detailpage-demographics-button')).toHaveAttribute('aria-disabled', 'true');
        });
        test('Loggedin user sees demographics/notify prompt', async ({ page }) => {
            await page.goto('digital-learning-hub/view/98s0_dy5k3_98h4?user=s2222222');

            // the logged in user is prompted to enter fields
            await expect(page.getByTestId('detailpage-getit-button')).not.toBeVisible();
            await expect(
                page
                    .getByTestId('detailpage-clicklink')
                    .getByText(/Access the object/)
                    .first(),
            ).toBeVisible();

            // reveal the notify fields
            await page.getByTestId('detailpage-notify-button').click();
            await expect(page.locator('[data-testid="view-notify-preferredName"] input')).toHaveValue('Jane');
            await expect(page.locator('[data-testid="view-notify-userEmail"] input')).toHaveValue(
                'rhd@student.uq.edu.au',
            );
        });
        test('Admin sees an edit button', async ({ page }) => {
            await page.goto('digital-learning-hub/view/98s0_dy5k3_98h4?user=dloradmn');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await page.getByTestId('detailpage-admin-edit-button').click();
            await expect(page).toHaveURL('http://localhost:2020/admin/dlor/edit/98s0_dy5k3_98h4?user=dloradmn');
        });
        test('Non-Admin does NOT see an edit button', async ({ page }) => {
            await page.goto('digital-learning-hub/view/98s0_dy5k3_98h4?user=uqstaff');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(
                page
                    .getByTestId('dlor-detailpage')
                    .getByText(/Advanced literature searching/)
                    .first(),
            ).toBeVisible();
            await expect(page.getByTestId('detailpage-admin-edit-button')).not.toBeVisible();
        });
    });
    test.describe('Graduate Attribute helpers on homepage', () => {
        test('Graduate attribute detailed information shows on the index page, and can be shown / hid', async ({
            page,
        }) => {
            await page.goto('digital-learning-hub?filters=10%2C11%2C12%2C13%2C14');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(
                page
                    .getByTestId('graduate-attribute-10-name')
                    .getByText(/Accomplished scholars/)
                    .first(),
            ).toBeVisible();
            await expect(page.locator('#accomplished-scholars-dlor-filter-checkbox')).toBeChecked();
            await expect(page.locator('#connected-citizens-dlor-filter-checkbox')).toBeChecked();
            await expect(page.locator('#courageous-thinkers-dlor-filter-checkbox')).toBeChecked();
            await expect(page.locator('#culturally-capable-dlor-filter-checkbox')).toBeChecked();
            await page.locator('#accomplished-scholars-dlor-filter-checkbox').click();
            await expect(page.getByTestId('graduate-attribute-10-name')).not.toBeVisible();
            await page.locator('#connected-citizens-dlor-filter-checkbox').click();
            await expect(page.getByTestId('graduate-attribute-11-name')).not.toBeVisible();
            await page.locator('#courageous-thinkers-dlor-filter-checkbox').click();
            await expect(page.getByTestId('graduate-attribute-12-name')).not.toBeVisible();
            await page.locator('#culturally-capable-dlor-filter-checkbox').click();
            await expect(page.getByTestId('graduate-attribute-13-name')).not.toBeVisible();
        });
    });
    test.describe('User can edit their own objects', () => {
        test('User sees edit on objects they own', async ({ page }) => {
            await page.goto(`digital-learning-hub/view/987y-dfgrf4-76gsg-01?user=${DLOR_NO_EDIT_USER}`);
            await page.setViewportSize({ width: 1300, height: 1000 });
            await page.getByTestId('detailpage-admin-edit-button').click();
            await expect(page).toHaveURL(
                `http://localhost:2020/digital-learning-hub/edit/987y-dfgrf4-76gsg-01?user=${DLOR_NO_EDIT_USER}`,
            );
            await expect(page.getByTestId('dlor-breadcrumb-edit-object-label-0')).toHaveText(/Dummy entry/);
            await page.goto(`digital-learning-hub/view/kj5t_8yg4_kj4f?user=${DLOR_NO_EDIT_USER}`);
            await expect(page.getByTestId('detailpage-admin-edit-button')).not.toBeVisible();
        });
        test('User can edit the object they own', async ({ page }) => {
            const testData =
                'This is a test. This information is not used in the real system. This is simply content that is big enough to test the CKEditor - it is at least sufficient characters long for the editor to accept the content.';
            await page.goto(`digital-learning-hub/view/987y-dfgrf4-76gsg-01?user=${DLOR_NO_EDIT_USER}`);
            await page.setViewportSize({ width: 1300, height: 1000 });

            await page.getByTestId('detailpage-admin-edit-button').click();
            await expect(page).toHaveURL(
                `http://localhost:2020/digital-learning-hub/edit/987y-dfgrf4-76gsg-01?user=${DLOR_NO_EDIT_USER}`,
            );
            await expect(page.getByTestId('dlor-breadcrumb-edit-object-label-0')).toHaveText(/Dummy entry/);
            const today = moment().format('DD/MM/YYYY'); // Australian format to match the display format

            await page.locator('[data-testid="object-review-date"] input').click();
            await page.locator('[data-testid="object-review-date"] input').clear();
            await page.locator('[data-testid="object-review-date"] input').fill(today);
            await page.locator('[data-testid="object-review-date"] input').blur();

            // Force a change event
            await page.locator('[data-testid="object-review-date"] input').dispatchEvent('change');
            await page.getByTestId('dlor-form-next-button').click();
            await typeCKEditor(page, testData);
            await page.getByTestId('dlor-form-next-button').click();
            await page.getByTestId('dlor-form-next-button').click();
            await page.getByTestId('admin-dlor-save-button-submit').click();
            await expect(
                page
                    .getByTestId('message-title')
                    .getByText(/Your request has been submitted/)
                    .first(),
            ).toBeVisible();
        });
    });
    test.describe('Component shows correct visibility information', () => {
        test('Freely available object', async ({ page }) => {
            await page.goto(`digital-learning-hub/view/987y-dfgrf4-76gsg-01?user=${DLOR_NO_EDIT_USER}`);
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.getByTestId('detailpage-visibility')).toHaveText(/Anyone can access this object\./);
        });
        test('UQ users only object', async ({ page }) => {
            await page.goto('digital-learning-hub/view/987y-dfgrf4-76gsg-01-uqonly?user=dloradmn');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.getByTestId('detailpage-visibility')).toHaveText(
                /This object is available to UQ staff and students\./,
            );
        });
        test('UQ staff only object', async ({ page }) => {
            await page.goto('digital-learning-hub/view/987y-dfgrf4-76gsg-01-staff?user=dloradmn');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.getByTestId('detailpage-visibility')).toHaveText(
                /This object is available to UQ staff members only\./,
            );
        });
        test('UQ Library Staff only', async ({ page }) => {
            await page.goto('digital-learning-hub/view/987y-dfgrf4-76gsg-01-libstaff?user=dloradmn');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.getByTestId('detailpage-visibility')).toHaveText(
                /This object is available to UQ Library staff members only\./,
            );
        });
        test('Access Denied messages', async ({ page }) => {
            await page.goto('digital-learning-hub/view/987y-dfgrf4-76gsg-01-libstaff?user=anon');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.getByTestId('access-denied-message')).toHaveText(
                /You need to be a UQ Library staff member to access this object/,
            );
            await page.goto('digital-learning-hub/view/987y-dfgrf4-76gsg-01-staff?user=anon');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.getByTestId('access-denied-message')).toHaveText(
                /You need to be a UQ staff member to access this object/,
            );
            await page.goto('digital-learning-hub/view/987y-dfgrf4-76gsg-01-uqonly?user=anon');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.getByTestId('access-denied-message')).toHaveText(
                /You need to be a UQ staff or student to access this object/,
            );
        });
    });
});
