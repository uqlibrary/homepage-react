const REQUIRED_LENGTH_TITLE = 10;
const REQUIRED_LENGTH_DESCRIPTION = 100;
const REQUIRED_LENGTH_SUMMARY = 20;
describe('Add an object to the Digital Learning Object Repository (DLOR)', () => {
    beforeEach(() => {
        cy.clearCookies();
        cy.setCookie('UQ_CULTURAL_ADVICE', 'hidden');
    });

    const mockDlorAdminUser = 'dloradmin';
    context('adding a new object', () => {
        context('successfully', () => {
            beforeEach(() => {
                cy.visit(`http://localhost:2020/admin/dlor/add?user=${mockDlorAdminUser}`);
                cy.viewport(1300, 1000);
            });
            it('is accessible', () => {
                cy.injectAxe();
                cy.viewport(1300, 1000);
                cy.waitUntil(() => cy.get('h1').should('exist'));
                cy.get('h1').should('contain', 'DLOR Management');

                cy.checkA11y('[data-testid="StandardPage"]', {
                    reportName: 'add dlor',
                    scopeName: 'Content',
                    includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
                });
            });
            it('validates fields correctly', () => {
                cy.get('[data-testid="admin-dlor-add-button-submit"]')
                    .should('exist')
                    .should('be.disabled');
                cy.get('[data-testid="object_title"] input')
                    .should('exist')
                    .type('new title'.padEnd(REQUIRED_LENGTH_TITLE, 'x'));
                cy.get('[data-testid="admin-dlor-add-button-submit"]')
                    .should('exist')
                    .should('be.disabled');
                cy.get('[data-testid="object_description"] textarea:first-child')
                    .should('exist')
                    .type('new description '.padEnd(REQUIRED_LENGTH_DESCRIPTION, 'x'));
                cy.get('[data-testid="admin-dlor-add-button-submit"]')
                    .should('exist')
                    .should('be.disabled');
                cy.get('[data-testid="object_summary"] textarea:first-child')
                    .should('exist')
                    .type('new summary '.padEnd(REQUIRED_LENGTH_SUMMARY, 'x'));

                // filters
                cy.get('[data-testid="admin-dlor-add-button-submit"]')
                    .should('exist')
                    .should('be.disabled');
                cy.get('[data-testid="filter-aboriginal_and_torres_strait_islander"] input').check();
                cy.get('[data-testid="admin-dlor-add-button-submit"]')
                    .should('exist')
                    .should('be.disabled');
                cy.get('[data-testid="filter-media_audio"] input').check();
                cy.get('[data-testid="admin-dlor-add-button-submit"]')
                    .should('exist')
                    .should('be.disabled');
                cy.get('[data-testid="filter-all_cross_disciplinary"] input').check();
                cy.get('[data-testid="admin-dlor-add-button-submit"]')
                    .should('exist')
                    .should('be.disabled');
                cy.get('[data-testid="filter-media_audio"] input').check();
                cy.get('[data-testid="admin-dlor-add-button-submit"]')
                    .should('exist')
                    .should('be.disabled');
                cy.get('[data-testid="filter-type_guide"] input').check();
                cy.get('[data-testid="admin-dlor-add-button-submit"]')
                    .should('exist')
                    .should('be.disabled');
                cy.get('[data-testid="filter-cc_by_attribution"] input').check();

                cy.get('[data-testid="admin-dlor-add-button-submit"]')
                    .should('exist')
                    .should('not.be.disabled');

                // and it validates on each field
                cy.get('[data-testid="object_title"] input')
                    .should('exist')
                    .type('{backspace}');
                cy.get('[data-testid="admin-dlor-add-button-submit"]')
                    .should('exist')
                    .should('be.disabled');
                cy.get('[data-testid="object_title"] input')
                    .should('exist')
                    .type('p');
                cy.get('[data-testid="admin-dlor-add-button-submit"]')
                    .should('exist')
                    .should('not.be.disabled');

                cy.get('[data-testid="object_description"] textarea:first-child')
                    .should('exist')
                    .type('{backspace}');
                cy.get('[data-testid="admin-dlor-add-button-submit"]')
                    .should('exist')
                    .should('be.disabled');
                cy.get('[data-testid="object_description"] textarea:first-child')
                    .should('exist')
                    .type('p');
                cy.get('[data-testid="admin-dlor-add-button-submit"]')
                    .should('exist')
                    .should('not.be.disabled');

                cy.get('[data-testid="object_summary"] textarea:first-child')
                    .should('exist')
                    .type('{backspace}');
                cy.get('[data-testid="admin-dlor-add-button-submit"]')
                    .should('exist')
                    .should('be.disabled');
                cy.get('[data-testid="object_summary"] textarea:first-child')
                    .should('exist')
                    .type('p');
                cy.get('[data-testid="admin-dlor-add-button-submit"]')
                    .should('exist')
                    .should('not.be.disabled');

                cy.get('[data-testid="object_publishing_user"] input')
                    .should('exist')
                    .type('{backspace}')
                    .type('{backspace}');
                cy.get('[data-testid="admin-dlor-add-button-submit"]')
                    .should('exist')
                    .should('be.disabled');
                cy.get('[data-testid="object_publishing_user"] input')
                    .should('exist')
                    .type('p');
                cy.get('[data-testid="admin-dlor-add-button-submit"]')
                    .should('exist')
                    .should('not.be.disabled');

                cy.get('[data-testid="filter-aboriginal_and_torres_strait_islander"] input').uncheck();
                cy.get('[data-testid="admin-dlor-add-button-submit"]')
                    .should('exist')
                    .should('be.disabled');
                cy.get('[data-testid="filter-aboriginal_and_torres_strait_islander"] input').check();

                cy.get('[data-testid="filter-all_cross_disciplinary"] input').uncheck();
                cy.get('[data-testid="admin-dlor-add-button-submit"]')
                    .should('exist')
                    .should('be.disabled');
                cy.get('[data-testid="filter-all_cross_disciplinary"] input').check();

                cy.get('[data-testid="filter-media_audio"] input').uncheck();
                cy.get('[data-testid="admin-dlor-add-button-submit"]')
                    .should('exist')
                    .should('be.disabled');
                cy.get('[data-testid="filter-media_audio"] input').check();

                // (cant uncheck a radio button)

                cy.get('[data-testid="admin-dlor-add-button-submit"]')
                    .should('exist')
                    .should('not.be.disabled');
            });
            it('shows character minimums', () => {
                cy.get('[data-testid="object_title"] input')
                    .should('exist')
                    .type('123');
                cy.get('[data-testid="input-characters-remaining-object_title"]')
                    .should('exist')
                    .should('contain', 'at least 7 more characters needed');
                cy.get('[data-testid="object_description"] textarea:first-child')
                    .should('exist')
                    .type('new description');
                cy.get('[data-testid="input-characters-remaining-object_description"]')
                    .should('exist')
                    .should('contain', 'at least 85 more characters needed');
                cy.get('[data-testid="object_summary"] textarea:first-child')
                    .should('exist')
                    .type('new summary');
                cy.get('[data-testid="input-characters-remaining-object_summary"]')
                    .should('exist')
                    .should('contain', 'at least 9 more characters needed');
            });
            it('admin can create a new object for a new team and return to list', () => {
                cy.setCookie('CYPRESS_TEST_DATA', 'active');
                const teamEmail = 'john@example.com';
                const teamManager = 'john Manager';
                const teamName = 'new team name';

                cy.get('[data-testid="admin-dlor-add-button-submit"]')
                    .should('exist')
                    .should('be.disabled');
                cy.get('[data-testid="object_title"] input')
                    .should('exist')
                    .type('new title'.padEnd(REQUIRED_LENGTH_TITLE, 'x'));
                cy.get('[data-testid="object_description"] textarea:first-child')
                    .should('exist')
                    .type('new description '.padEnd(REQUIRED_LENGTH_DESCRIPTION, 'x'));
                cy.get('[data-testid="admin-dlor-add-button-submit"]')
                    .should('exist')
                    .should('be.disabled');
                cy.get('[data-testid="object_summary"] textarea:first-child')
                    .should('exist')
                    .type('new summary '.padEnd(REQUIRED_LENGTH_SUMMARY, 'x'));
                cy.get('[data-testid="filter-aboriginal_and_torres_strait_islander"] input').check();
                cy.get('[data-testid="filter-assignments"] input').check();
                cy.get('[data-testid="filter-media_audio"] input').check();
                cy.get('[data-testid="filter-media_h5p"] input').check();
                cy.get('[data-testid="filter-all_cross_disciplinary"] input').check();
                cy.get('[data-testid="filter-business_economics"] input').check();
                cy.get('[data-testid="filter-type_interactive_activity"] input').check();
                cy.get('[data-testid="filter-cc_by_nc_attribution_noncommercial"] input').check();
                cy.get('[data-testid="admin-dlor-add-button-submit"]')
                    .should('exist')
                    .should('not.be.disabled');
                // open teams drop down
                cy.waitUntil(() => cy.get('[data-testid="object_owning_team"]').should('exist'));
                cy.get('[data-testid="object_owning_team"]').click();
                cy.get('[data-testid="object-add-teamid-new"]')
                    .should('exist')
                    .click();

                // now that we have chosen "new team" the submit button is disabled
                // until we enter all 3 fields
                cy.get('[data-testid="admin-dlor-add-button-submit"]')
                    .should('exist')
                    .should('be.disabled');
                cy.get('[data-testid="team_name"]')
                    .should('exist')
                    .type(teamName);
                cy.get('[data-testid="admin-dlor-add-button-submit"]')
                    .should('exist')
                    .should('be.disabled');
                cy.get('[data-testid="team_manager"]')
                    .should('exist')
                    .type(teamManager);
                cy.get('[data-testid="admin-dlor-add-button-submit"]')
                    .should('exist')
                    .should('be.disabled');
                cy.get('[data-testid="team_email"]')
                    .should('exist')
                    .type(teamEmail);

                cy.get('[data-testid="admin-dlor-add-button-submit"]')
                    .should('exist')
                    .should('not.be.disabled')
                    .click();

                // and navigate back to the list page
                cy.waitUntil(() => cy.get('[data-testid="cancel-dlor-creation-outcome"]').should('exist'));

                // check the data we pretended to send to the server matches what we expect
                // acts as check of what we sent to api
                const expectedFacetTypes = {
                    item_type: ['type_interactive_activity'],
                    licence: ['cc_by_nc_attribution_noncommercial'],
                    media_format: ['media_audio', 'media_h5p'],
                    subject: ['all_cross_disciplinary', 'business_economics'],
                    topic: ['aboriginal_and_torres_strait_islander', 'assignments'],
                };
                const expectedValues = {
                    object_title: 'new titlex',
                    object_description:
                        'new description xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
                    object_summary: 'new summary xxxxxxxx',
                    object_download_instructions: '',
                    object_embed_type: 'link',
                    object_publishing_user: 'dloradmin',
                    // object_review_date_next: '2025-03-26T00:01',
                    object_status: 'new',
                    team_email: teamEmail,
                    team_manager: teamManager,
                    team_name: teamName,
                    // facetType: expectedFacetTypes,
                };
                cy.getCookie('CYPRESS_DATA_SAVED').then(cookie => {
                    const decodedValue = decodeURIComponent(cookie.value);
                    const sentValues = JSON.parse(decodedValue);
                    expect(sentValues).to.contains(expectedValues);
                    expect(sentValues.facetType).to.deep.equal(expectedFacetTypes);
                    cy.clearCookie('CYPRESS_DATA_SAVED');
                    cy.clearCookie('CYPRESS_TEST_DATA');
                });

                cy.get('[data-testid="confirm-dlor-creation-outcome"]')
                    .should('contain', 'Return to list page')
                    .click();
                cy.url().should('eq', 'http://localhost:2020/admin/dlor');
            });
            it('admin can create a new object for an existing team and start a fresh form', () => {
                cy.setCookie('CYPRESS_TEST_DATA', 'active');

                const downloadInstructionText = 'some download instructions';
                cy.get('[data-testid="object_title"] input')
                    .should('exist')
                    .type('new title'.padEnd(REQUIRED_LENGTH_TITLE, 'x'));
                cy.get('[data-testid="object_description"] textarea:first-child')
                    .should('exist')
                    .type('new description '.padEnd(REQUIRED_LENGTH_DESCRIPTION, 'x'));
                cy.get('[data-testid="object_summary"] textarea:first-child')
                    .should('exist')
                    .type('new summary '.padEnd(REQUIRED_LENGTH_SUMMARY, 'x'));
                cy.get('[data-testid="object_download_instructions"] textarea:first-child')
                    .should('exist')
                    .type(downloadInstructionText);
                cy.get('[data-testid="filter-digital_skills"] input').check();
                cy.get('[data-testid="filter-media_dataset"] input').check();
                cy.get('[data-testid="filter-engineering_architecture_information_technology"] input').check();
                cy.get('[data-testid="filter-module"] input').check();
                cy.get('[data-testid="filter-cco_public_domain"] input').check();
                cy.get('[data-testid="filter-connected_citizens"] input').check();
                cy.get('[data-testid="admin-dlor-add-button-submit"]')
                    .should('exist')
                    .click();
                cy.waitUntil(() => cy.get('[data-testid="dialogbox-dlor-creation-outcome"]').should('exist'));
                cy.get('[data-testid="dialogbox-dlor-creation-outcome"] h2').contains('The object has been created');

                // now clear the form to create another Object
                cy.waitUntil(() => cy.get('[data-testid="cancel-dlor-creation-outcome"]').should('exist'));

                // check the data we pretended to send to the server matches what we expect
                // acts as check of what we sent to api
                const expectedFacetTypes = {
                    graduate_attributes: ['connected_citizens'],
                    item_type: ['module'],
                    licence: ['cco_public_domain'],
                    media_format: ['media_dataset'],
                    subject: ['engineering_architecture_information_technology'],
                    topic: ['digital_skills'],
                };
                const expectedValues = {
                    object_title: 'new titlex',
                    object_description:
                        'new description xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
                    object_summary: 'new summary xxxxxxxx',
                    object_download_instructions: downloadInstructionText,
                    object_embed_type: 'link',
                    object_publishing_user: 'dloradmin',
                    // object_review_date_next: '2025-03-26T00:01',
                    object_status: 'new',
                    object_owning_team_id: 1,
                };
                cy.getCookie('CYPRESS_DATA_SAVED').then(cookie => {
                    const decodedValue = decodeURIComponent(cookie.value);
                    const sentValues = JSON.parse(decodedValue);
                    expect(sentValues).to.contains(expectedValues);
                    console.log('sentValues.facetType=', sentValues.facetType);
                    console.log('expectedFacetTypes=', expectedFacetTypes);
                    expect(sentValues.facetType).to.deep.equal(expectedFacetTypes);
                    cy.clearCookie('CYPRESS_DATA_SAVED');
                    cy.clearCookie('CYPRESS_TEST_DATA');
                });

                cy.get('[data-testid="cancel-dlor-creation-outcome"]')
                    .should('contain', 'Add another Object')
                    .click();
                cy.waitUntil(() => cy.get('[data-testid="object_title"] input').should('exist'));
                cy.get('[data-testid="object_title"] input').should('have.value', '');
            });
        });
        context('fails correctly', () => {
            it('admin gets an error when Teams list api doesnt load', () => {
                cy.visit(`http://localhost:2020/admin/dlor/add?user=${mockDlorAdminUser}&responseType=teamsLoadError`);
                // "responseType=teamsLoadError" on the url forces an error from mock api
                cy.get('[data-testid="dlor-addObject-error"]').contains('Error has occurred during request');
            });
            it('admin gets an error on a failed save', () => {
                cy.visit(`http://localhost:2020/admin/dlor/add?user=${mockDlorAdminUser}&responseType=saveError`);
                cy.get('[data-testid="object_title"] input')
                    .should('exist')
                    .type('new title'.padEnd(REQUIRED_LENGTH_TITLE, 'x'));
                cy.get('[data-testid="object_description"] textarea:first-child')
                    .should('exist')
                    .type('new description '.padEnd(REQUIRED_LENGTH_DESCRIPTION, 'x'));
                cy.get('[data-testid="object_summary"] textarea:first-child')
                    .should('exist')
                    .type('new summary '.padEnd(REQUIRED_LENGTH_SUMMARY, 'x'));
                cy.get('[data-testid="filter-digital_skills"] input').check();
                cy.get('[data-testid="filter-media_dataset"] input').check();
                cy.get('[data-testid="filter-engineering_architecture_information_technology"] input').check();
                cy.get('[data-testid="filter-module"] input').check();
                cy.get('[data-testid="filter-cco_public_domain"] input').check();
                cy.get('[data-testid="admin-dlor-add-button-submit"]')
                    .should('exist')
                    .should('not.be.disabled')
                    .click();
                // "responseType=saveError" on the url forces an error from mock api
                cy.waitUntil(() => cy.get('[data-testid="dialogbox-dlor-creation-outcome"]').should('exist'));
                cy.get('[data-testid="dialogbox-dlor-creation-outcome"] h2').contains(
                    'Error has occurred during request',
                );
            });
        });
    });
    context('user access', () => {
        it('displays an "unauthorised" page to public users', () => {
            cy.visit('http://localhost:2020/admin/dlor/add?user=public');
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Authentication required');
        });
        it('displays an "unauthorised" page to non-authorised users', () => {
            cy.visit('http://localhost:2020/admin/dlor/add?user=uqstaff');
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Permission denied');
        });
        it('displays correct page for admin users (list)', () => {
            cy.visit(`http://localhost:2020/admin/dlor/add?user=${mockDlorAdminUser}`);
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').should('contain', 'DLOR Management');
        });
    });
});
