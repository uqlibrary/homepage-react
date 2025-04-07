import moment from 'moment-timezone';

describe('Digital Learning Hub View page', () => {
    function TypeCKEditor(content, keepExisting = false) {
        return cy
            .get('.ck-content')
            .should('exist')
            .then(el => {
                const editor = el[0].ckeditorInstance;
                editor.setData(keepExisting ? editor.getData() + content : content);
            });
        // cy.get('.ck-content')
        //     .parent.should('exist')
        //     .setData(content);
        // // .type(content);
    }
    context('details page', () => {
        it('appears as expected', () => {
            cy.intercept('GET', /uq.h5p.com/, {
                statusCode: 200,
                body: 'user has navigated to pressbook link',
            });

            cy.visit('digital-learning-hub/view/938h_4986_654f');
            cy.get('[data-testid="dlor-detailpage"] h1').should(
                'contain',
                'Artificial Intelligence - Digital Essentials',
            );
            cy.get('uq-site-header')
                .shadow()
                .within(() => {
                    cy.get('[data-testid="subsite-title"]')
                        .should('exist')
                        .should('be.visible')
                        .contains('Digital learning hub');
                });

            cy.get('[data-testid="dlor-detailpage-cultural-advice-custom-indicator"]').should('not.exist');
            cy.get('[data-testid="dlor-detailpage-featured-custom-indicator"]').should('not.exist');
            cy.get('[data-testid="dlor-detailpage-object-series-name-custom-indicator"]')
                .should('exist')
                .contains('Series: Digital Essentials');

            cy.get('[data-testid="dlor-detailpage-description"]').should(
                'contain',
                'Types of AI, implications for society, using AI in your studies and how UQ is involved. (longer lines)',
            );
            cy.get('[data-testid="dlor-detailpage"] h2').should('contain', 'How to use this object');
            // cy.get('[data-testid="dlor-massaged-download-instructions"]').should(
            //     'contain',
            //     'Download the Common Cartridge file and H5P quiz to embed in Blackboard',
            // );

            // meta data in sidebar is as expected
            cy.get('[data-testid="detailpage-filter-topic"] h3')
                .should('exist')
                .contains('Topic');
            cy.get('[data-testid="detailpage-filter-topic"] ul')
                .should('exist')
                .children()
                .should('have.length', 2);
            cy.get('[data-testid="detailpage-filter-topic"] ul li:first-child')
                .should('exist')
                .should('contain', 'Assignments');
            // not effective.
            cy.get('[data-testid="detailpage-filter-topic"] ul li:first-child a:nth-of-type(2)').should('not.exist'); // no help link

            cy.get('[data-testid="detailpage-filter-topic"] ul li:nth-child(2)')
                .should('exist')
                .should('contain', 'Software');

            cy.get('[data-testid="detailpage-filter-item-type"] h3')
                .should('exist')
                .contains('Item type');
            cy.get('[data-testid="detailpage-filter-item-type"] ul')
                .should('exist')
                .children()
                .should('have.length', 1);
            cy.get('[data-testid="detailpage-filter-item-type"] ul li:first-child')
                .should('exist')
                .should('contain', 'Module');
            cy.get('[data-testid="detailpage-filter-item-type"] ul li:first-child a:nth-of-type(2)').should(
                'not.exist',
            ); // no help link

            cy.get('[data-testid="detailpage-filter-media-format"] h3')
                .should('exist')
                .contains('Media format');
            cy.get('[data-testid="detailpage-filter-media-format"] ul')
                .should('exist')
                .children()
                .should('have.length', 1);
            cy.get('[data-testid="detailpage-filter-media-format"] ul li:first-child')
                .should('exist')
                .should('contain', 'H5P');
            cy.get('[data-testid="detailpage-filter-media-format"] ul li:first-child a:nth-of-type(2)').should(
                'not.exist',
            ); // no help link

            cy.get('[data-testid="detailpage-filter-subject"] h3')
                .should('exist')
                .contains('Subject');
            cy.get('[data-testid="detailpage-filter-subject"] ul')
                .should('exist')
                .children()
                .should('have.length', 2);
            cy.get('[data-testid="detailpage-filter-subject"] ul li:first-child')
                .should('exist')
                .should('contain', 'Health; Behavioural Sciences');
            cy.get('[data-testid="detailpage-filter-subject"] ul li:first-child a:nth-of-type(2)').should('not.exist'); // no help link
            cy.get('[data-testid="detailpage-filter-subject"] ul li:nth-child(2)')
                .should('exist')
                .should('contain', 'Medicine; Biomedical Sciences');

            cy.get('[data-testid="detailpage-filter-licence"] h3')
                .should('exist')
                .contains('Licence');
            cy.get('[data-testid="detailpage-filter-licence"] ul')
                .should('exist')
                .children()
                .should('have.length', 1);
            cy.get('[data-testid="detailpage-filter-licence"] ul li:first-child')
                .should('exist')
                .should('contain', 'UQ copyright');
            cy.get('[data-testid="detailpage-filter-licence"] ul li:first-child a:nth-of-type(2)').should('exist'); // help link exists

            cy.get('[data-testid="detailpage-filter-graduate-attributes"] h3')
                .should('exist')
                .contains('Graduate attributes');
            cy.get('[data-testid="detailpage-filter-graduate-attributes"] ul')
                .should('exist')
                .children()
                .should('have.length', 2);
            cy.get('[data-testid="detailpage-filter-graduate-attributes"] ul li:first-child')
                .should('exist')
                .should('contain', 'Accomplished scholars');
            cy.get('[data-testid="detailpage-filter-graduate-attributes"] ul li:first-child a:nth-of-type(2)').should(
                'not.exist',
            ); // no help link
            cy.get('[data-testid="detailpage-filter-graduate-attributes"] ul li:nth-child(2)')
                .should('exist')
                .should('contain', 'Influential communicators');

            cy.get('[data-testid="detailpage-metadata-keywords"]')
                .should('exist')
                .within(() => {
                    cy.get('h3').should('contain', 'Keywords');
                    cy.get('ul')
                        .children()
                        .should('have.length', 8);
                    cy.get('li:first-child').contains('Generative AI');
                });

            // the series footer appears as expected (shows the sorting is working)
            cy.get('[data-testid="dlor-view-series-item-98j3-fgf95-8j34-order-0"]')
                .should('exist')
                .contains('Digital security - Digital Essentials');
            cy.get('[data-testid="dlor-view-series-item-938h-4986-654f-order-1"]')
                .should('exist')
                .contains('Artificial Intelligence - Digital Essentials');
            // and is starred as the current item
            cy.get('[data-testid="dlor-view-series-item-938h-4986-654f-order-1"] [data-testid="StarIcon"]').should(
                'exist',
            );
            cy.get('[data-testid="dlor-view-series-item-0h4y-87f3-6js7-order-2"]')
                .should('exist')
                .contains('Choose the right tool - Digital Essentials');
            cy.get('[data-testid="dlor-view-series-item-987y-isjgt-9866-order-3"]')
                .should('exist')
                .contains('Accessibility - Digital Essentials (has Youtube link)');
            cy.get('[data-testid="dlor-view-series-item-0j45-87h4-23hd7-order-4"]')
                .should('exist')
                .contains('Communicate and collaborate - Digital Essentials');

            // the link can be clicked
            cy.get('[data-testid="detailpage-clicklink"]')
                .should('exist')
                .should('be.visible')
                .should('contain', 'Access the object')
                .click();
            cy.get('body').contains('user has navigated to pressbook link');
        });

        it('shows correct button for different types of records', () => {
            cy.visit('/digital-learning-hub/view/987y-dfgrf4-76gsg-16');
            cy.get('[data-testid="detailpage-clicklink"]')
                .should('exist')
                .should('be.visible')
                .should('contain', 'Access the object (205m 45s)');

            cy.visit('/digital-learning-hub/view/987y-dfgrf4-76gsg-15');
            cy.get('[data-testid="detailpage-clicklink"]')
                .should('exist')
                .should('be.visible')
                .should('contain', '(video)');
            cy.visit('/digital-learning-hub/view/987y-dfgrf4-76gsg-14');
            cy.get('[data-testid="detailpage-clicklink"]')
                .should('exist')
                .should('be.visible')
                .should('contain', '(123.5 MB)');
            cy.visit('/digital-learning-hub/view/987y-dfgrf4-76gsg-13');
            cy.get('[data-testid="detailpage-clicklink"]')
                .should('exist')
                .should('be.visible')
                .should('contain', '(video)');
            // ensure cancel button works.
            cy.get('[data-testid="detailpage-demographics-button"]').click();
            cy.get('[data-testid="demographics-cancel"]').click();
            cy.get('[data-testid="demographics-cancel"]').should('not.exist');
            cy.get('[data-testid="detailpage-notify-button"]').click();
            cy.get('[data-testid="notifications-cancel"]').click();
            cy.get('[data-testid="notifications-cancel"]').should('not.exist');
        });
        it('has expected cultural advice', () => {
            // custom indicators appears
            cy.visit('http://localhost:2020/digital-learning-hub/view/kj5t_8yg4_kj4f');
            cy.get('[data-testid="dlor-detailpage-cultural-advice-custom-indicator"]')
                .should('exist')
                .contains('Cultural advice');
            cy.get('[data-testid="dlor-detailpage-featured-custom-indicator"]')
                .should('exist')
                .contains('Featured');
            cy.get('[data-testid="dlor-detailpage-object-series-name-custom-indicator"]').should('not.exist');
            cy.get('[data-testid="dlor-detailpage-cultural-advice"]')
                .should('exist')
                .contains('Aboriginal and Torres Strait Islander peoples are warned');
        });
        it('is accessible', () => {
            cy.visit('digital-learning-hub/view/98s0_dy5k3_98h4');
            cy.injectAxe();
            cy.viewport(1300, 1000);

            cy.waitUntil(() => cy.get('[data-testid="dlor-detailpage"] h1').should('exist'));
            cy.get('[data-testid="dlor-detailpage"] h1').should('contain', 'Advanced literature searching');
            cy.checkA11y('[data-testid="StandardPage"]', {
                reportName: 'dlor',
                scopeName: 'Content',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
        it('a view page without keywords has a sensible sidebar', () => {
            cy.visit('digital-learning-hub/view/9k45_hgr4_876h');
            cy.get('[data-testid="dlor-detailpage"] h1').should('contain', 'EndNote 20: Getting started');
            cy.get('[data-testid="detailpage-metadata-keywords"]').should('not.exist');
        });
        it('can handle an error', () => {
            cy.visit('digital-learning-hub/view/98s0_dy5k3_98h4?responseType=error');
            cy.viewport(1300, 1000);
            cy.get('[data-testid="dlor-detailpage-error"]')
                .should('exist')
                .contains('An error has occurred during the request and this request cannot be processed');
        });
        it('can handle an empty result', () => {
            // this should never happen. Maybe immediately after initial upload
            cy.visit('digital-learning-hub/view/missingRecord');
            cy.viewport(1300, 1000);
            cy.get('[data-testid="dlor-detailpage-empty"]')
                .should('exist')
                .contains('We could not find the requested entry - please check the web address.');
        });
    });
    context('demographics & notifications send properly', () => {
        beforeEach(() => {
            cy.setCookie('CYPRESS_TEST_DATA', 'active'); // setup so we can check what we "sent" to the db
        });
        it('can visit the object link without gathering demographics', () => {
            cy.setCookie('CYPRESS_TEST_DATA', 'active'); // setup so we can check what we "sent" to the db
            cy.visit('digital-learning-hub/view/9bc174f7-5326-4a8b-bfab-d5081c688597');
            cy.viewport(1300, 1000);

            // user chooses not to enter data
            cy.get('[data-testid="detailpage-clicklink"]')
                .should('exist')
                .click();

            cy.getCookie('CYPRESS_DATA_SAVED').then(cookie => {
                expect(cookie).not.to.exist;
            });

            cy.url().should('eq', 'http://localhost:2020/exams');
        });

        it('Notify requires you to enter an email address', () => {
            cy.visit('digital-learning-hub/view/9bc174f7-5326-4a8b-bfab-d5081c688597?user=s2222222');
            cy.viewport(1300, 1000);

            // enter a subject so that something is sent even thoiught they uncheck notify
            cy.get('[data-testid="detailpage-notify-button"]').click();

            cy.get('[data-testid="notifications-capture"]').should('not.have.attr', 'disabled');

            cy.wait(1000);
            cy.get('#userEmail')
                .should('exist')
                .clear();

            cy.get('[data-testid="notifications-capture"]').should('have.attr', 'disabled');

            cy.get('#userEmail').type('joe');

            cy.get('[data-testid="notifications-capture"]').should('have.attr', 'disabled');
            cy.get('#userEmail')
                .clear()
                .type('joe@joe.com');
            cy.get('[data-testid="notifications-capture"]').should('not.have.attr', 'disabled');
            cy.get('#userEmail')
                .clear()
                .type('thisfails');
            cy.get('[data-testid="notifications-capture"]').should('have.attr', 'disabled');
        });
        it('sends demographics correctly', () => {
            cy.visit('digital-learning-hub/view/9bc174f7-5326-4a8b-bfab-d5081c688597');
            cy.viewport(1300, 1000);

            const typeSubject = 'PHIL1001';
            const typeSchoolName = 'School of Mathematics';
            cy.get('[data-testid="detailpage-demographics-button"]').click();
            cy.get('[data-testid="view-demographics-subject-code"] input')
                .should('exist')
                .type(typeSubject);
            cy.get('[data-testid="view-demographics-school-name"] input')
                .should('exist')
                .type(typeSchoolName);
            cy.get('[data-testid="demographics-capture"]').should('not.have.attr', 'disabled');
            cy.get('[data-testid="demographics-capture"]').click();
            cy.get('[data-testid="message-title"]')
                .should('exist')
                .contains('Demographic information saved');

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
            cy.getCookie('CYPRESS_DATA_SAVED').then(cookie => {
                expect(cookie).to.exist;
                const decodedValue = decodeURIComponent(cookie.value);
                const sentValues = JSON.parse(decodedValue);

                // console.log('sentValues=', sentValues);
                // console.log('expectedValues=', expectedValues);

                expect(sentValues).to.deep.equal(expectedValues);

                cy.clearCookie('CYPRESS_DATA_SAVED');
                cy.clearCookie('CYPRESS_TEST_DATA');
            });

            // cy.url().should('eq', 'http://localhost:2020/exams');
        });

        it('sends notifications correctly', () => {
            cy.visit('digital-learning-hub/view/9bc174f7-5326-4a8b-bfab-d5081c688597?user=digiteamMember');
            cy.viewport(1300, 1000);

            cy.get('[data-testid="detailpage-notify-button"]').click();

            cy.get('[data-testid="view-notify-preferredName"] input')
                .should('exist')
                .should('have.value', 'Caroline');
            cy.get('[data-testid="view-notify-userEmail"] input')
                .should('exist')
                .should('have.value', 'j.Researcher@uq.edu.au');

            cy.get('[data-testid="notifications-capture"]')
                .should('exist')
                .click();

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
            cy.getCookie('CYPRESS_DATA_SAVED').then(cookie => {
                expect(cookie).to.exist;
                const decodedValue = decodeURIComponent(cookie.value);
                const sentValues = JSON.parse(decodedValue);

                // console.log('sentValues=', sentValues);
                // console.log('expectedValues=', expectedValues);

                expect(sentValues).to.deep.equal(expectedValues);

                cy.clearCookie('CYPRESS_DATA_SAVED');
                cy.clearCookie('CYPRESS_TEST_DATA');
            });

            cy.waitUntil(() => cy.get('[data-testid="dialogbox-dlor-save-notification"]').should('exist'));
            cy.get('[data-testid="dialogbox-dlor-save-notification"]').contains(
                'Please check your email to confirm your subscription request',
            );
            cy.get('[data-testid="cancel-dlor-save-notification"]').should('not.exist');

            // cy.url().should('eq', 'http://localhost:2020/exams');
        });

        it('handles a failure to save notify properly', () => {
            cy.visit(
                'digital-learning-hub/view/9bc174f7-5326-4a8b-bfab-d5081c688597?user=digiteamMember&responseType=notifyError',
            );
            cy.viewport(1300, 1000);

            // reveal the notify fields
            cy.get('[data-testid="detailpage-notify-button"]').click();

            cy.get('[data-testid="view-notify-preferredName"] input')
                .should('exist')
                .should('have.value', 'Caroline');
            cy.get('[data-testid="view-notify-userEmail"] input')
                .should('exist')
                .should('have.value', 'j.Researcher@uq.edu.au');

            cy.get('[data-testid="notifications-capture"]')
                .should('exist')
                .click();

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
            cy.getCookie('CYPRESS_DATA_SAVED').then(cookie => {
                expect(cookie).to.exist;
                const decodedValue = decodeURIComponent(cookie.value);
                const sentValues = JSON.parse(decodedValue);

                // console.log('sentValues=', sentValues);
                // console.log('expectedValues=', expectedValues);

                expect(sentValues).to.deep.equal(expectedValues);

                cy.clearCookie('CYPRESS_DATA_SAVED');
                cy.clearCookie('CYPRESS_TEST_DATA');
            });

            cy.waitUntil(() => cy.get('[data-testid="dialogbox-dlor-save-notification"]').should('exist'));
            cy.get('[data-testid="dialogbox-dlor-save-notification"]').contains('There was a problem');
            cy.get('[data-testid="cancel-dlor-save-notification"]').should('not.exist');
            cy.get('[data-testid="confirm-dlor-save-notification"]')
                .should('exist')
                .contains('OK')
                .click();

            // cy.url().should('eq', 'http://localhost:2020/exams');
        });
        it('handles where the user was already subscribed', () => {
            cy.visit(
                'digital-learning-hub/view/9bc174f7-5326-4a8b-bfab-d5081c688597?user=digiteamMember&responseType=alreadysubscribed',
            );
            cy.viewport(1300, 1000);

            cy.get('[data-testid="detailpage-notify-button"]').click();
            cy.get('[data-testid="view-notify-preferredName"] input')
                .should('exist')
                .should('have.value', 'Caroline');
            cy.get('[data-testid="view-notify-userEmail"] input')
                .should('exist')
                .should('have.value', 'j.Researcher@uq.edu.au');

            cy.get('[data-testid="notifications-capture"]')
                .should('exist')
                .click();

            cy.waitUntil(() => cy.get('[data-testid="dialogbox-dlor-save-notification"]').should('exist'));
            cy.get('[data-testid="dialogbox-dlor-save-notification"]').contains('You are already subscribed');
            cy.get('[data-testid="cancel-dlor-save-notification"]').should('not.exist');
            cy.get('[data-testid="confirm-dlor-save-notification"]')
                .should('exist')
                .contains('OK')
                .click();

            // cy.url().should('eq', 'http://localhost:2020/exams');
        });
    });
    context('"Access it" units show properly', () => {
        it('A watchable object shows the correct units on the Get It button', () => {
            cy.visit('digital-learning-hub/view/987y_isjgt_9866');
            cy.viewport(1300, 1000);
            cy.get('[data-testid="detailpage-clicklink"]')
                .should('exist')
                .should('have.text', 'Access the object (video 47m 44s)');
        });

        it('A downloadable object shows the correct units on the Get It button', () => {
            cy.visit('digital-learning-hub/view/9bc192a8-324c-4f6b-ac50-07e7ff2df240');

            cy.viewport(1300, 1000);
            cy.get('[data-testid="detailpage-clicklink"]')
                .should('exist')
                .should('have.text', 'Access the object (XLS 3.4 GB)');
        });

        it('A neither watchable nor downloadable object shows just "Access the object" on the Get It button', () => {
            cy.visit('digital-learning-hub/view/98s0_dy5k3_98h4');
            cy.viewport(1300, 1000);
            cy.get('[data-testid="detailpage-clicklink"]')
                .should('exist')
                .should('have.text', 'Access the object');
        });
    });
    context('user-level privilege', () => {
        it('the non-logged in user is prompted to login', () => {
            cy.visit('digital-learning-hub/view/987y_isjgt_9866?user=public');
            cy.viewport(1300, 1000);

            cy.get('[data-testid="dlor-homepage-loginprompt"]')
                .should('exist')
                .contains('for extra features');
            cy.get('[data-testid="detailpage-notify-button"]').should('have.attr', 'aria-disabled', 'true');
            cy.get('[data-testid="detailpage-demographics-button"]').should('have.attr', 'aria-disabled', 'true');

            // the logged OUT user is not prompted to enter fields (until we have a captcha)
            // cy.get('[data-testid="detailpage-getit-button"]')
            //     .should('exist')
            //     .contains('Access the object');
            // cy.get('[data-testid="detailpage-getit-and demographics"]').should('not.exist');
        });
        it('Loggedin user sees demographics/notify prompt', () => {
            cy.visit('digital-learning-hub/view/98s0_dy5k3_98h4?user=s2222222');

            // the logged in user is prompted to enter fields
            cy.get('[data-testid="detailpage-getit-button"]').should('not.exist');
            cy.get('[data-testid="detailpage-clicklink"]')
                .should('exist')
                .contains('Access the object');

            // reveal the notify fields
            cy.get('[data-testid="detailpage-notify-button"]').click();
            cy.get('[data-testid="view-notify-preferredName"] input')
                .should('exist')
                .should('have.value', 'Jane');
            cy.get('[data-testid="view-notify-userEmail"] input')
                .should('exist')
                .should('have.value', 'rhd@student.uq.edu.au');
        });
        it('Admin sees an edit button', () => {
            cy.visit('digital-learning-hub/view/98s0_dy5k3_98h4?user=dloradmn');
            cy.viewport(1300, 1000);
            cy.get('[data-testid="detailpage-admin-edit-button"]')
                .should('exist')
                .contains('Edit');
            cy.get('[data-testid="detailpage-admin-edit-button"]').click();
            cy.url().should('eq', 'http://localhost:2020/admin/dlor/edit/98s0_dy5k3_98h4?user=dloradmn');
        });
        it('Non-Admin does NOT see an edit button', () => {
            cy.visit('digital-learning-hub/view/98s0_dy5k3_98h4?user=uqstaff');
            cy.viewport(1300, 1000);
            cy.waitUntil(() =>
                cy
                    .get('[data-testid="dlor-detailpage"]')
                    .should('exist')
                    .contains('Advanced literature searching'),
            );
            cy.get('[data-testid="detailpage-admin-edit-button"]').should('not.exist');
        });
    });
    context('Graduate Attribute helpers on homepage', () => {
        it('Graduate attribute detailed information shows on the index page, and can be shown / hid', () => {
            cy.visit('digital-learning-hub?filters=10%2C11%2C12%2C13%2C14');
            cy.viewport(1300, 1000);
            cy.waitUntil(() =>
                cy
                    .get('[data-testid="graduate-attribute-10-name"]')
                    .should('exist')
                    .contains('Accomplished scholars'),
            );
            cy.get('#accomplished-scholars-dlor-filter-checkbox').should('be.checked');
            cy.get('#connected-citizens-dlor-filter-checkbox').should('be.checked');
            cy.get('#courageous-thinkers-dlor-filter-checkbox').should('be.checked');
            cy.get('#culturally-capable-dlor-filter-checkbox').should('be.checked');
            cy.get('[data-testid="graduate-attribute-10-name"]').should('exist');
            cy.get('#accomplished-scholars-dlor-filter-checkbox').click();
            cy.get('[data-testid="graduate-attribute-10-name"]').should('not.exist');
            cy.get('#connected-citizens-dlor-filter-checkbox').click();
            cy.get('[data-testid="graduate-attribute-11-name"]').should('not.exist');
            cy.get('#courageous-thinkers-dlor-filter-checkbox').click();
            cy.get('[data-testid="graduate-attribute-12-name"]').should('not.exist');
            cy.get('#culturally-capable-dlor-filter-checkbox').click();
            cy.get('[data-testid="graduate-attribute-13-name"]').should('not.exist');
        });
    });
    context('User can edit their own objects', () => {
        it('User sees edit on objects they own', () => {
            cy.visit('digital-learning-hub/view/987y-dfgrf4-76gsg-01?user=s1111111');
            cy.viewport(1300, 1000);
            cy.get('[data-testid="detailpage-admin-edit-button"]')
                .should('exist')
                .contains('Edit');
            cy.get('[data-testid="detailpage-admin-edit-button"]').click();
            cy.url().should('eq', 'http://localhost:2020/digital-learning-hub/edit/987y-dfgrf4-76gsg-01');
            cy.get('[data-testid="dlor-breadcrumb-edit-object-label-0"]').should('contain', 'Dummy entry');
            cy.visit('digital-learning-hub/view/kj5t_8yg4_kj4f?user=s1111111');
            cy.get('[data-testid="detailpage-admin-edit-button"]').should('not.exist');
        });
        it('User can edit the object they own', () => {
            const testData =
                'This is a test. This information is not used in the real system. This is simply content that is big enough to test the CKEditor - it is at least sufficient characters long for the editor to accept the content.';
            cy.visit('digital-learning-hub/view/987y-dfgrf4-76gsg-01?user=s1111111');
            cy.viewport(1300, 1000);
            cy.get('[data-testid="detailpage-admin-edit-button"]').click();
            cy.url().should('eq', 'http://localhost:2020/digital-learning-hub/edit/987y-dfgrf4-76gsg-01');
            cy.get('[data-testid="dlor-breadcrumb-edit-object-label-0"]').should('contain', 'Dummy entry');
            const today = moment().format('DD/MM/YYYY'); // Australian format to match the display format

            cy.get('[data-testid="object-review-date"] input')
                .click()
                .clear()
                .type(today)
                .blur() // Force blur event
                .wait(500) // Add small wait to allow state to update
                .then(() => {
                    // Force a change event
                    cy.get('[data-testid="object-review-date"] input')
                        .trigger('change', { force: true })
                        .should('have.value', today);
                });
            cy.wait(10000);
            cy.get('[data-testid="dlor-form-next-button"]').click();
            TypeCKEditor(testData, false);
            cy.get('[data-testid="dlor-form-next-button"]').click();
            cy.get('[data-testid="dlor-form-next-button"]').click();
            cy.get('[data-testid="admin-dlor-save-button-submit"]').click();
            cy.get('[data-testid="message-title"]')
                .should('exist')
                .contains('Your request has been submitted');
        });
    });
});
