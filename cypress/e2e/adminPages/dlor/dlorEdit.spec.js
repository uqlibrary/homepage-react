// these constants must match the constants, eg titleMinimumLength in Dlor Admin components
const REQUIRED_LENGTH_TITLE = 8;
const REQUIRED_LENGTH_DESCRIPTION = 100;
describe('Edit an object on the Digital learning hub', () => {
    beforeEach(() => {
        cy.clearCookies();
        cy.setCookie('UQ_CULTURAL_ADVICE', 'hidden');
    });

    const mockDlorAdminUser = 'dloradmn';
    context('editing an object', () => {
        context('successfully', () => {
            beforeEach(() => {
                cy.visit(`http://localhost:2020/admin/dlor/edit/98s0_dy5k3_98h4?user=${mockDlorAdminUser}`);
                cy.viewport(1300, 1000);
            });
            it('is accessible', () => {
                cy.injectAxe();
                cy.viewport(1300, 1000);
                cy.waitUntil(() => cy.get('h1').should('exist'));
                cy.get('h1').should('contain', 'Digital learning hub Management');

                cy.checkA11y('[data-testid="StandardPage"]', {
                    reportName: 'edit dlor Panel 1',
                    scopeName: 'Panel 1',
                    includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
                });

                // go to panel 2
                cy.get('[data-testid="dlor-form-next-button"]')
                    .should('exist')
                    .click();
                cy.waitUntil(() => cy.get('[data-testid="object_title"] input').should('exist'));
                cy.checkA11y('[data-testid="StandardPage"]', {
                    reportName: 'edit dlor Panel 2',
                    scopeName: 'Panel 2',
                    includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
                });

                // go to panel 3
                cy.get('[data-testid="dlor-form-next-button"]')
                    .should('exist')
                    .click();
                cy.waitUntil(() => cy.get('[data-testid="object_link_url"] input').should('exist'));
                cy.checkA11y('[data-testid="StandardPage"]', {
                    reportName: 'edit dlor Panel 3',
                    scopeName: 'Panel 3',
                    includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
                });

                // go to panel 4
                cy.get('[data-testid="dlor-form-next-button"]')
                    .should('exist')
                    .click();
                cy.waitUntil(() => cy.get('[data-testid="object_keywords"] textarea:first-child').should('exist'));
                cy.checkA11y('[data-testid="StandardPage"]', {
                    reportName: 'edit dlor Panel 4',
                    scopeName: 'Panel 4',
                    includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
                });
            });
            it('loads fields correctly', () => {
                cy.waitUntil(() => cy.get('[data-testid="object_publishing_user"] input').should('exist'));
                cy.get('[data-testid="object_publishing_user"] input').should('have.value', 'uqjsmith');
                cy.get('[data-testid="error-message-object_publishing_user"]').should('not.exist');
                // TODO teams

                // go to panel 2
                cy.get('[data-testid="dlor-form-next-button"]')
                    .should('exist')
                    .click();
                cy.waitUntil(() => cy.get('[data-testid="object_title"] input').should('exist'));
                cy.get('[data-testid="object_title"] input').should('have.value', 'Advanced literature searching');
                cy.get('[data-testid="object_description"] textarea:first-child')
                    .should('exist')
                    .contains(
                        'This tutorial covers the advanced searching techniques that can be used for all topics when conducting a scoping',
                    );
                cy.get('[data-testid="object_summary"] textarea:first-child')
                    .should('exist')
                    .should('have.value', 'Using advanced searching techniques.');

                // go to panel 3
                cy.get('[data-testid="dlor-form-next-button"]')
                    .should('exist')
                    .click();
                cy.waitUntil(() => cy.get('[data-testid="object_link_url"] input').should('exist'));
                cy.get('[data-testid="object_link_url"] input').should(
                    'have.value',
                    'https://uq.h5p.com/content/1291624605868350759',
                );

                // accessible link message is "no message"
                cy.get('[data-testid="interaction_type"]')
                    .should('exist')
                    .contains('No message');
                cy.get('[data-testid="object_link_file_type"]').should('not.exist');
                cy.get('[data-testid="object_link_duration"]').should('not.exist');
                cy.get('[data-testid="object_link_file_size"]').should('not.exist');

                cy.get('[data-testid="object_download_instructions"] textarea:first-child')
                    .should('exist')
                    .contains('some download instructions');

                // go to panel 4
                cy.get('[data-testid="dlor-form-next-button"]')
                    .should('exist')
                    .click();
                cy.waitUntil(() => cy.get('[data-testid="object_keywords"] textarea:first-child').should('exist'));
                cy.get('[data-testid="object_keywords"] textarea:first-child').should(
                    'have.value',
                    'search, evaluate, literature, strategy',
                );

                const numCheckboxes = 51;
                const checkedCheckboxes = [2, 7, 10, 14, 16, 27, 34, 46];
                let currentCheckboxId = 1;
                while (currentCheckboxId < numCheckboxes) {
                    cy.log(`check checkbox/radio ${checkedCheckboxes}`);
                    if (checkedCheckboxes.includes(currentCheckboxId)) {
                        cy.get(`[data-testid="filter-${currentCheckboxId}"] input`)
                            .should('exist')
                            .should('be.checked');
                    } else {
                        cy.get(`[data-testid="filter-${currentCheckboxId}"] input`)
                            .should('exist')
                            .should('not.be.checked');
                    }
                    currentCheckboxId++;
                }
            });
        });
        it('loads "download" url type correctly', () => {
            cy.visit('http://localhost:2020/admin/dlor/edit/9bc192a8-324c-4f6b-ac50-07e7ff2df240?user=dloradmn');
            // go to panel 2
            cy.get('[data-testid="dlor-form-next-button"]')
                .should('exist')
                .click();
            // go to panel 3
            cy.get('[data-testid="dlor-form-next-button"]')
                .should('exist')
                .click();

            // accessible link message is "no message"
            cy.get('[data-testid="interaction_type"]')
                .should('exist')
                .contains('can Download');
            cy.get('[data-testid="object_link_file_type"]')
                .should('exist')
                .contains('XLS');
            cy.get('[data-testid="object_link_file_size"] input')
                .should('exist')
                .should('have.value', '3.4 GB');
            cy.get('[data-testid="object_link_duration"]').should('not.exist');
        });
        it('loads "view" url type correctly', () => {
            cy.visit('http://localhost:2020/admin/dlor/edit/987y_isjgt_9866?user=dloradmn');
            // go to panel 2
            cy.get('[data-testid="dlor-form-next-button"]')
                .should('exist')
                .click();
            // go to panel 3
            cy.get('[data-testid="dlor-form-next-button"]')
                .should('exist')
                .click();

            // accessible link message is "no message"
            cy.get('[data-testid="interaction_type"]')
                .should('exist')
                .contains('can View');
            cy.get('[data-testid="object_link_file_type"]')
                .should('exist')
                .contains('video');
            cy.get('[data-testid="object_link_duration"] input')
                .should('exist')
                .should('have.value', '47m44s');
            cy.get('[data-testid="object_link_file_size"]').should('not.exist');
        });
        context('successfully mock to db', () => {
            beforeEach(() => {
                cy.setCookie('CYPRESS_TEST_DATA', 'active'); // setup so we can check what we "sent" to the db
                cy.visit(`http://localhost:2020/admin/dlor/edit/98s0_dy5k3_98h4?user=${mockDlorAdminUser}`);
                cy.viewport(1300, 1000);
            });
            it('admin can edit an object for a new team and return to list', () => {
                cy.getCookie('CYPRESS_TEST_DATA').then(cookie => {
                    expect(cookie).to.exist;
                    expect(cookie.value).to.equal('active');
                });

                // open teams drop down
                cy.waitUntil(() => cy.get('[data-testid="object_owning_team"]').should('exist'));
                cy.get('[data-testid="object_owning_team"]').click();
                cy.get('[data-testid="object-form-teamid-new"]')
                    .should('exist')
                    .click();

                // enter a new team
                cy.get('[data-testid="team_name"]')
                    .should('exist')
                    .type('new team name');
                cy.get('[data-testid="team_manager"]')
                    .should('exist')
                    .type('john Manager');
                cy.get('[data-testid="team_email"]')
                    .should('exist')
                    .type('john@example.com');

                // go to the second panel, Description
                cy.get('[data-testid="dlor-form-next-button"]')
                    .should('exist')
                    .click();

                cy.get('[data-testid="object_title"] input')
                    .should('exist')
                    .type('xx');
                cy.get('[data-testid="object_description"] textarea:first-child')
                    .should('exist')
                    .clear()
                    .type('new description '.padEnd(REQUIRED_LENGTH_DESCRIPTION, 'x'));
                cy.get('[data-testid="object_summary"] textarea:first-child')
                    .should('exist')
                    .type('xx');

                // go to the third panel, Link
                cy.get('[data-testid="dlor-form-next-button"]')
                    .should('exist')
                    .click();

                cy.get('[data-testid="object_link_url"] input')
                    .should('exist')
                    .type('/page');
                const typeableDownloadInstructions = 'xxx';
                cy.get('[data-testid="object_download_instructions"] textarea:first-child')
                    .should('exist')
                    .type(typeableDownloadInstructions);
                cy.get('[data-testid="dlor-massaged-download-instructions"]')
                    .should('exist')
                    .should('contain', 'xxx');

                // go to the fourth panel, Filtering
                cy.get('[data-testid="dlor-form-next-button"]')
                    .should('exist')
                    .click();

                cy.get('[data-testid="filter-2"] input').uncheck(); // Topic : Assignments
                cy.get('[data-testid="filter-7"] input').uncheck(); // Topic : Research
                cy.get('[data-testid="filter-1"] input').check(); // Topic : aboriginal_and_torres_strait_islander

                cy.get('[data-testid="filter-22"] input').check(); // Media format : audio
                cy.get('[data-testid="filter-24"] input').check(); // Media format : h5p
                cy.get('[data-testid="filter-27"] input').uncheck(); // Media format : Pressbook

                // cy.get('[data-testid="filter-34"] input').check(); // Subject: all_cross_disciplinary
                cy.get('[data-testid="filter-35"] input').check(); // Subject: business_economics
                cy.get('[data-testid="filter-34"] input').uncheck(); // Subject: all_cross_disciplinary

                cy.get('[data-testid="filter-17"] input').check(); // Item type : interactive_activity #radio, no uncheck

                cy.get('[data-testid="filter-45"] input').check(); // Licence : cc_by_nc_attribution_noncommercial #radio, no uncheck

                cy.get('[data-testid="object_keywords"] textarea:first-child')
                    .should('exist')
                    .clear()
                    .type('cat, dog');

                cy.get('[data-testid="admin-dlor-save-button-submit"]')
                    .should('exist')
                    .should('not.be.disabled')
                    .click();

                cy.waitUntil(() => cy.get('[data-testid="cancel-dlor-save-outcome"]').should('exist'));

                // check the data we pretended to send to the server matches what we expect
                // acts as check of what we sent to api

                const expectedValues = {
                    object_title: 'Advanced literature searchingxx',
                    object_description:
                        'new description xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
                    object_summary: 'Using advanced searching techniques.xx',
                    object_link_url: 'https://uq.h5p.com/content/1291624605868350759/page',
                    object_download_instructions: 'some download instructionsxxx',
                    object_embed_type: 'link',
                    object_publishing_user: 'uqjsmith',
                    object_review_date_next: '2025-03-26T00:01',
                    object_status: 'current',
                    team_email: 'john@example.com',
                    team_manager: 'john Manager',
                    team_name: 'new team name',
                    object_keywords: ['cat', 'dog'],
                    facets: [
                        10, // Graduate attributes : Accomplished scholars
                        14, // Graduate attributes : Influential communicator
                        1, // aboriginal_and_torres_strait_islander
                        22, // media_audio
                        24, // media_h5p
                        35, // business_economics
                        17, // type_interactive_activity
                        45, // cc_by_nc_attribution_noncommercial
                    ],
                };
                cy.getCookie('CYPRESS_DATA_SAVED').then(cookie => {
                    expect(cookie).to.exist;
                    const decodedValue = decodeURIComponent(cookie.value);
                    const sentValues = JSON.parse(decodedValue);

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

                    expect(sentValues).to.deep.equal(expectedValues);
                    expect(sentFacets).to.deep.equal(expectedFacets);
                    expect(sentKeywords).to.deep.equal(expectedKeywords);

                    cy.clearCookie('CYPRESS_DATA_SAVED');
                    cy.clearCookie('CYPRESS_TEST_DATA');
                });

                // and navigate back to the list page
                cy.get('[data-testid="confirm-dlor-save-outcome"]')
                    .should('contain', 'Return to list page')
                    .click();
                cy.url().should('eq', `http://localhost:2020/admin/dlor?user=${mockDlorAdminUser}`);
                cy.get('[data-testid="StandardPage-title"]')
                    .should('exist')
                    .should('contain', 'Digital learning hub Management');
            });
            it('admin can edit, choose a different existing team and re-edit', () => {
                cy.getCookie('CYPRESS_TEST_DATA').then(cookie => {
                    expect(cookie).to.exist;
                    expect(cookie.value).to.equal('active');
                });

                // first panel, Ownership, loads

                // change teams
                cy.waitUntil(() => cy.get('[data-testid="object_owning_team"]').should('exist'));
                cy.get('[data-testid="object_owning_team"]').click();
                cy.get('[data-value="3"]')
                    .should('exist')
                    .click();

                // go to the second panel, Description
                cy.get('[data-testid="dlor-form-next-button"]')
                    .should('exist')
                    .click();

                cy.get('[data-testid="object_title"] input')
                    .should('exist')
                    .type('x'.padEnd(REQUIRED_LENGTH_TITLE, 'x'));
                cy.get('[data-testid="object_description"] textarea:first-child')
                    .should('exist')
                    .clear()
                    .type('new description '.padEnd(REQUIRED_LENGTH_DESCRIPTION, 'x'));
                cy.get('[data-testid="object_summary"] textarea:first-child')
                    .should('exist')
                    .type('xxx');

                // go to the third panel, Link
                cy.get('[data-testid="dlor-form-next-button"]')
                    .should('exist')
                    .click();
                const downloadInstructionText = 'updated download instructions';

                cy.get('[data-testid="object_link_url"] input')
                    .should('exist')
                    .clear()
                    .type('http://example.com');
                cy.get('[data-testid="object_download_instructions"] textarea:first-child')
                    .should('exist')
                    .clear()
                    .type(downloadInstructionText);

                // go to the fourth panel, Filtering
                cy.get('[data-testid="dlor-form-next-button"]')
                    .should('exist')
                    .click();

                cy.get('[data-testid="filter-3"] input').check(); // digital_skills
                cy.get('[data-testid="filter-4"] input').check(); // employability
                cy.get('[data-testid="filter-23"] input').check(); // media_dataset
                cy.get('[data-testid="filter-36"] input').check(); // engineering_architecture_information_technology

                cy.get('[data-testid="filter-40"] input').check(); // medicine_biomedical_sciences

                cy.get('[data-testid="filter-18"] input').check(); // module
                cy.get('[data-testid="filter-50"] input').check(); // cco_public_domain
                cy.get('[data-testid="filter-11"] input').check(); // connected_citizens

                cy.get('[data-testid="filter-40"] input').uncheck(); // medicine_biomedical_sciences - coverage and confirm it doesnt end up in the "sent to server"

                cy.get('[data-testid="object_keywords"] textarea:first-child')
                    .should('exist')
                    .type('cat, dog');

                // save record
                cy.get('[data-testid="admin-dlor-save-button-submit"]')
                    .should('exist')
                    .should('not.be.disabled')
                    .click();
                cy.waitUntil(() => cy.get('[data-testid="dialogbox-dlor-save-outcome"]').should('exist'));
                cy.get('[data-testid="dialogbox-dlor-save-outcome"] h2').contains('Changes have been saved');

                // wait for the save to complete
                cy.waitUntil(() => cy.get('[data-testid="cancel-dlor-save-outcome"]').should('exist'));

                // check the data we pretended to send to the server matches what we expect
                // acts as check of what we sent to api
                const expectedValues = {
                    object_title: 'Advanced literature searchingxxxxxxxx',
                    object_description:
                        'new description xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
                    object_summary: 'Using advanced searching techniques.xxx',
                    object_link_url: 'http://example.com',
                    object_download_instructions: downloadInstructionText,
                    object_embed_type: 'link',
                    object_publishing_user: 'uqjsmith',
                    object_review_date_next: '2025-03-26T00:01',
                    object_status: 'current',
                    object_owning_team_id: 3,
                    facets: [
                        2, // Topic : Assignments
                        7, // Topic : Research
                        10, // Graduate attributes : Accomplished scholars
                        14, // Graduate attributes : Influential communicators
                        27, // Media format : Pressbook
                        34, // Subject : Cross-disciplinary
                        3, // Topic : Digital skills
                        4, // Topic : Employability
                        23, // Media format : Dataset
                        36, // Subject : Engineering: Architecture; Information Technology
                        18, // Item type : Module #radio
                        50, // licence : CC0/Public domain #radio
                        11, // Graduate attributes : Connected citizens
                    ],
                    object_keywords: ['cat', 'dog'],
                };
                cy.getCookie('CYPRESS_DATA_SAVED').then(cookie => {
                    expect(cookie).to.exist;
                    const decodedValue = decodeURIComponent(cookie.value);
                    const sentValues = JSON.parse(decodedValue);

                    // it doesnt seem valid to recalc the calculated date to test it
                    expect(sentValues.hasOwnProperty('object_review_date_next')).to.be.true;
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

                    console.log('sentValues=', sentValues);
                    console.log('expectedValues=', expectedValues);
                    expect(sentValues).to.deep.equal(expectedValues);
                    expect(sentFacets).to.deep.equal(expectedFacets);
                    expect(sentKeywords).to.deep.equal(expectedKeywords);
                    cy.clearCookie('CYPRESS_DATA_SAVED');
                    cy.clearCookie('CYPRESS_TEST_DATA');
                });

                // now clear the form to create another Object
                cy.get('[data-testid="cancel-dlor-save-outcome"]')
                    .should('contain', 'Re-edit Object')
                    .click();
                cy.waitUntil(() => cy.get('[data-testid="object_publishing_user"] input').should('exist'));
                cy.get('[data-testid="dlor-form-next-button"]')
                    .should('exist')
                    .click();

                cy.get('[data-testid="standard-card-edit-an-object-for-the-digital-learning-hub-header"]')
                    .should('exist')
                    .should('contain', 'Edit an Object for the Digital learning hub');
            });
        });
        context('fails correctly', () => {
            it('404 page return correctly', () => {
                cy.visit('http://localhost:2020/admin/dlor/edit/object_404?user=dloradmn');
                cy.waitUntil(() => cy.get('[data-testid="dlor-form-error"]').should('exist'));
                cy.get('[data-testid="dlor-form-error"]').contains('The requested page could not be found.');
            });
            it('admin gets an error on a failed save', () => {
                cy.visit(
                    `http://localhost:2020/admin/dlor/edit/98s0_dy5k3_98h4?user=${mockDlorAdminUser}&responseType=saveError`,
                );

                // team is valid as is, so go to the second panel, Description
                cy.waitUntil(() => cy.get('[data-testid="dlor-form-next-button"]').should('exist'));
                cy.get('[data-testid="dlor-form-next-button"]').click();

                // go to the third panel, Link
                cy.waitUntil(() => cy.get('[data-testid="dlor-form-next-button"]').should('exist'));
                cy.get('[data-testid="dlor-form-next-button"]')
                    .should('exist')
                    .click();

                // go to the fourth panel, Filtering
                cy.waitUntil(() => cy.get('[data-testid="dlor-form-next-button"]').should('exist'));
                cy.get('[data-testid="dlor-form-next-button"]')
                    .should('exist')
                    .click();

                // form filled out. now save
                cy.get('[data-testid="admin-dlor-save-button-submit"]')
                    .should('exist')
                    .should('not.be.disabled')
                    .click();
                // "responseType=saveError" on the url forces an error from mock api
                cy.waitUntil(() => cy.get('[data-testid="dialogbox-dlor-save-outcome"]').should('exist'));
                cy.get('[data-testid="dialogbox-dlor-save-outcome"] h2').contains(
                    'An error has occurred during the request and this request cannot be processed',
                );
            });
        });
    });
    context('user access', () => {
        it('displays an "unauthorised" page to public users', () => {
            cy.visit('http://localhost:2020/admin/dlor/edit/98s0_dy5k3_98h4?user=public');
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Authentication required');
        });
        it('displays an "unauthorised" page to non-authorised users', () => {
            cy.visit('http://localhost:2020/admin/dlor/edit/98s0_dy5k3_98h4?user=uqstaff');
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Permission denied');
        });
        it('displays correct page for admin users (list)', () => {
            cy.visit(`http://localhost:2020/admin/dlor/edit/98s0_dy5k3_98h4?user=${mockDlorAdminUser}`);
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').should('contain', 'Digital learning hub Management');
        });
    });
});
