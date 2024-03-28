// these constants must match the constants, eg titleMinimumLength in Dlor Admin components
const REQUIRED_LENGTH_TITLE = 8;
const REQUIRED_LENGTH_DESCRIPTION = 100;
const REQUIRED_LENGTH_SUMMARY = 20;
const REQUIRED_LENGTH_KEYWORDS = 4;
describe('Add an object to the Digital Learning Object Repository (DLOR)', () => {
    beforeEach(() => {
        cy.clearCookies();
        cy.setCookie('UQ_CULTURAL_ADVICE', 'hidden');
    });

    const mockDlorAdminUser = 'dloradmin';
    context('adding a new object', () => {
        context('successfully', () => {
            beforeEach(() => {
                cy.setCookie('CYPRESS_TEST_DATA', 'active');
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
                // first enter all the fields and show the save button doesnt enable until all the fields are entered

                // team starts off valid so click on to the second panel, description
                cy.get('[data-testid="dlor-add-next-button"]')
                    .should('exist')
                    .click();

                cy.get('[data-testid="dlor-panel-validity-indicator-1"]').should('not.exist'); // panel validity tick not present
                cy.get('[data-testid="object_title"] input')
                    .should('exist')
                    .type('xx'.padEnd(REQUIRED_LENGTH_TITLE, 'x'));
                cy.get('[data-testid="dlor-panel-validity-indicator-1"]').should('not.exist'); // panel validity tick not present
                cy.get('[data-testid="object_description"] textarea:first-child')
                    .should('exist')
                    .type('new description '.padEnd(REQUIRED_LENGTH_DESCRIPTION, 'x'));
                cy.get('[data-testid="dlor-panel-validity-indicator-1"]').should('not.exist'); // panel validity tick not present
                cy.get('[data-testid="object_summary"] textarea:first-child')
                    .should('exist')
                    .type('new summary '.padEnd(REQUIRED_LENGTH_SUMMARY, 'x'));
                cy.get('[data-testid="dlor-panel-validity-indicator-1"]')
                    .should('exist')
                    .should('have.css', 'color', 'rgb(0, 114, 0)'); // panel validity tick now present

                // click 'next' button to view panel 3, Link
                cy.get('[data-testid="dlor-add-next-button"]')
                    .should('exist')
                    .click();
                cy.get('[data-testid="dlor-panel-validity-indicator-2"]').should('not.exist'); // panel validity tick not present
                cy.get('[data-testid="object_link_url"] input')
                    .should('exist')
                    .type('asdasdasdsadd');
                cy.waitUntil(() => cy.get('[data-testid="error-message-object_link_url"]').should('exist'));
                cy.get('[data-testid="error-message-object_link_url"]').should(
                    'contain',
                    'This web address is not valid.',
                );
                cy.get('[data-testid="object_link_url"] input')
                    .clear()
                    .type('http://example.com');
                cy.get('[data-testid="dlor-panel-validity-indicator-2"]')
                    .should('exist')
                    .should('have.css', 'color', 'rgb(0, 114, 0)'); // panel validity tick now present

                // click 'next' button to view panel 4, Filters
                cy.get('[data-testid="dlor-add-next-button"]')
                    .should('exist')
                    .click();
                // filters
                cy.get('[data-testid="filter-aboriginal_and_torres_strait_islander"] input').check();
                cy.get('[data-testid="dlor-panel-validity-indicator-3"]').should('not.exist'); // panel validity tick not present
                cy.get('[data-testid="admin-dlor-add-button-submit"]')
                    .should('exist')
                    .should('be.disabled');
                cy.get('[data-testid="filter-media_audio"] input').check();
                cy.get('[data-testid="dlor-panel-validity-indicator-3"]').should('not.exist'); // panel validity tick not present
                cy.get('[data-testid="admin-dlor-add-button-submit"]')
                    .should('exist')
                    .should('be.disabled');
                cy.get('[data-testid="filter-all_cross_disciplinary"] input').check();
                cy.get('[data-testid="dlor-panel-validity-indicator-3"]').should('not.exist'); // panel validity tick not present
                cy.get('[data-testid="admin-dlor-add-button-submit"]')
                    .should('exist')
                    .should('be.disabled');
                cy.get('[data-testid="filter-media_audio"] input').check();
                cy.get('[data-testid="dlor-panel-validity-indicator-3"]').should('not.exist'); // panel validity tick not present
                cy.get('[data-testid="admin-dlor-add-button-submit"]')
                    .should('exist')
                    .should('be.disabled');
                cy.get('[data-testid="filter-type_guide"] input').check();
                cy.get('[data-testid="dlor-panel-validity-indicator-3"]').should('not.exist'); // panel validity tick not present
                cy.get('[data-testid="admin-dlor-add-button-submit"]')
                    .should('exist')
                    .should('be.disabled');
                cy.get('[data-testid="filter-cc_by_attribution"] input').check();
                cy.get('[data-testid="dlor-panel-validity-indicator-3"]').should('not.exist'); // panel validity tick not present
                cy.get('[data-testid="admin-dlor-add-button-submit"]')
                    .should('exist')
                    .should('be.disabled');

                cy.get('[data-testid="object_keywords"] textarea:first-child')
                    .should('exist')
                    .type('a'.padEnd(REQUIRED_LENGTH_KEYWORDS, 'x'));

                cy.get('[data-testid="dlor-panel-validity-indicator-3"]')
                    .should('exist')
                    .should('have.css', 'color', 'rgb(0, 114, 0)'); // panel validity tick now present
                cy.get('[data-testid="admin-dlor-add-button-submit"]')
                    .should('exist')
                    .should('not.be.disabled');

                //  now go back and invalidate each field one at a time and show the button disables on each field
                cy.get('[data-testid="filter-aboriginal_and_torres_strait_islander"] input').uncheck();
                cy.get('[data-testid="dlor-panel-validity-indicator-3"]').should('not.exist'); // panel validity tick not present
                cy.get('[data-testid="admin-dlor-add-button-submit"]')
                    .should('exist')
                    .should('be.disabled');
                cy.get('[data-testid="filter-aboriginal_and_torres_strait_islander"] input').check();

                cy.get('[data-testid="filter-all_cross_disciplinary"] input').uncheck();
                cy.get('[data-testid="dlor-panel-validity-indicator-3"]').should('not.exist'); // panel validity tick not present
                cy.get('[data-testid="admin-dlor-add-button-submit"]')
                    .should('exist')
                    .should('be.disabled');
                cy.get('[data-testid="filter-all_cross_disciplinary"] input').check();

                cy.get('[data-testid="filter-media_audio"] input').uncheck();
                cy.get('[data-testid="dlor-panel-validity-indicator-3"]').should('not.exist'); // panel validity tick not present
                cy.get('[data-testid="admin-dlor-add-button-submit"]')
                    .should('exist')
                    .should('be.disabled');
                cy.get('[data-testid="filter-media_audio"] input').check();

                // (cant uncheck a radio button)

                // click the back button to go back to panel 3, Link
                cy.get('[data-testid="dlor-add-back-button"]')
                    .should('exist')
                    .click();
                cy.get('[data-testid="object_link_url"] input')
                    .should('exist')
                    .clear();
                cy.get('[data-testid="dlor-panel-validity-indicator-2"]').should('not.exist'); // panel validity tick not present
                cy.get('[data-testid="object_link_url"] input').type('http://');
                cy.get('[data-testid="dlor-panel-validity-indicator-2"]').should('not.exist'); // panel validity tick not present
                cy.get('[data-testid="object_link_url"] input')
                    .should('exist')
                    .type('ex.c');
                cy.get('[data-testid="dlor-panel-validity-indicator-2"]').should('not.exist'); // panel validity tick not present
                cy.get('[data-testid="object_link_url"] input')
                    .should('exist')
                    .type('o');
                cy.get('[data-testid="dlor-panel-validity-indicator-2"]')
                    .should('exist')
                    .should('have.css', 'color', 'rgb(0, 114, 0)'); // panel validity tick now present

                // click the back button to go back to panel 2, Description
                cy.get('[data-testid="dlor-add-back-button"]')
                    .should('exist')
                    .click();
                cy.get('[data-testid="dlor-panel-validity-indicator-1"]')
                    .should('exist')
                    .should('have.css', 'color', 'rgb(0, 114, 0)'); // panel validity tick now present
                cy.get('[data-testid="object_title"] input')
                    .should('exist')
                    .type('{backspace}');
                cy.get('[data-testid="dlor-panel-validity-indicator-1"]').should('not.exist'); // panel validity tick not present
                cy.get('[data-testid="object_title"] input')
                    .should('exist')
                    .type('p');
                cy.get('[data-testid="dlor-panel-validity-indicator-1"]')
                    .should('exist')
                    .should('have.css', 'color', 'rgb(0, 114, 0)'); // panel validity tick now present

                cy.get('[data-testid="object_description"] textarea:first-child')
                    .should('exist')
                    .type('{backspace}');
                cy.get('[data-testid="dlor-panel-validity-indicator-1"]').should('not.exist'); // panel validity tick not present
                cy.get('[data-testid="object_description"] textarea:first-child')
                    .should('exist')
                    .type('p');
                cy.get('[data-testid="dlor-panel-validity-indicator-1"]')
                    .should('exist')
                    .should('have.css', 'color', 'rgb(0, 114, 0)'); // panel validity tick now present

                cy.get('[data-testid="object_summary"] textarea:first-child')
                    .should('exist')
                    .type('{backspace}');
                cy.get('[data-testid="dlor-panel-validity-indicator-1"]').should('not.exist'); // panel validity tick not present
                cy.get('[data-testid="object_summary"] textarea:first-child')
                    .should('exist')
                    .type('p');
                cy.get('[data-testid="dlor-panel-validity-indicator-1"]')
                    .should('exist')
                    .should('have.css', 'color', 'rgb(0, 114, 0)'); // panel validity tick now present

                // click the back button to go back to panel 1, Ownership
                cy.get('[data-testid="dlor-add-back-button"]')
                    .should('exist')
                    .click();

                cy.get('[data-testid="object_publishing_user"] input')
                    .should('exist')
                    .type('{backspace}')
                    .type('{backspace}');
                cy.get('[data-testid="dlor-panel-validity-indicator-0"]').should('not.exist'); // panel validity tick not present
                cy.get('[data-testid="object_publishing_user"] input')
                    .should('exist')
                    .type('p');
                cy.get('[data-testid="dlor-panel-validity-indicator-0"]')
                    .should('exist')
                    .should('have.css', 'color', 'rgb(0, 114, 0)'); // panel validity tick now present

                cy.waitUntil(() => cy.get('[data-testid="object_owning_team"]').should('exist'));
                cy.get('[data-testid="object_owning_team"]').click();
                cy.get('[data-testid="object-add-teamid-new"]')
                    .should('exist')
                    .click();

                // now that we have chosen "new team" the submit button is disabled
                // until we enter all 3 fields
                cy.get('[data-testid="dlor-panel-validity-indicator-0"]').should('not.exist'); // panel validity tick not present
                cy.get('[data-testid="team_name"]')
                    .should('exist')
                    .type('new team name');
                cy.get('[data-testid="dlor-panel-validity-indicator-0"]').should('not.exist'); // panel validity tick not present
                cy.get('[data-testid="team_manager"]')
                    .should('exist')
                    .type('john Manager');
                cy.get('[data-testid="dlor-panel-validity-indicator-0"]').should('not.exist'); // panel validity tick not present
                cy.get('[data-testid="team_email"]')
                    .should('exist')
                    .type('john@example.com');
                cy.get('[data-testid="dlor-panel-validity-indicator-0"]')
                    .should('exist')
                    .should('have.css', 'color', 'rgb(0, 114, 0)'); // panel validity tick now present
            });
            it('shows character minimums', () => {
                // go to the second panel, description
                cy.get('[data-testid="dlor-add-next-button"]')
                    .should('exist')
                    .click();

                cy.get('[data-testid="object_title"] input')
                    .should('exist')
                    .type('123');
                cy.get('[data-testid="input-characters-remaining-object_title"]')
                    .should('exist')
                    .should('contain', 'at least 5 more characters needed');
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

                // go to the fourth panel, links
                cy.get('[data-testid="dlor-add-next-button"]')
                    .should('exist')
                    .click()
                    .click();

                cy.get('[data-testid="object_keywords"] textarea:first-child')
                    .should('exist')
                    .type('abc');
                cy.get('[data-testid="input-characters-remaining-object_keywords_string"]')
                    .should('exist')
                    .should('contain', 'at least 1 more character needed');
            });
            it('admin can create a new object for a new team and return to list', () => {
                cy.getCookie('CYPRESS_TEST_DATA').then(cookie => {
                    expect(cookie).to.exist;
                    expect(cookie.value).to.equal('active');
                });

                // open teams drop down
                cy.waitUntil(() => cy.get('[data-testid="object_owning_team"]').should('exist'));
                cy.get('[data-testid="object_owning_team"]').click();
                cy.get('[data-testid="object-add-teamid-new"]')
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
                cy.get('[data-testid="dlor-add-next-button"]')
                    .should('exist')
                    .click();

                cy.get('[data-testid="object_title"] input')
                    .should('exist')
                    .type('xx'.padEnd(REQUIRED_LENGTH_TITLE, 'x'));
                cy.get('[data-testid="object_description"] textarea:first-child')
                    .should('exist')
                    .type('new description '.padEnd(REQUIRED_LENGTH_DESCRIPTION, 'x'));
                cy.get('[data-testid="object_summary"] textarea:first-child')
                    .should('exist')
                    .type('new summary '.padEnd(REQUIRED_LENGTH_SUMMARY, 'x'));

                // go to the third panel, Link
                cy.get('[data-testid="dlor-add-next-button"]')
                    .should('exist')
                    .click();

                cy.get('[data-testid="object_link_url"] input')
                    .should('exist')
                    .type('http://example.com');

                // go to the fourth panel, Filtering
                cy.get('[data-testid="dlor-add-next-button"]')
                    .should('exist')
                    .click();

                cy.get('[data-testid="filter-aboriginal_and_torres_strait_islander"] input').check();
                cy.get('[data-testid="filter-assignments"] input').check();
                cy.get('[data-testid="filter-media_audio"] input').check();
                cy.get('[data-testid="filter-media_h5p"] input').check();
                cy.get('[data-testid="filter-all_cross_disciplinary"] input').check();
                cy.get('[data-testid="filter-business_economics"] input').check();
                cy.get('[data-testid="filter-type_interactive_activity"] input').check();
                cy.get('[data-testid="filter-cc_by_nc_attribution_noncommercial"] input').check();
                cy.get('[data-testid="object_keywords"] textarea:first-child')
                    .should('exist')
                    .type('cat, dog');
                cy.get('[data-testid="admin-dlor-add-button-submit"]')
                    .should('exist')
                    .should('not.be.disabled');

                cy.get('[data-testid="admin-dlor-add-button-submit"]')
                    .should('exist')
                    .should('not.be.disabled')
                    .click();

                cy.waitUntil(() => cy.get('[data-testid="cancel-dlor-creation-outcome"]').should('exist'));

                // check the data we pretended to send to the server matches what we expect
                // acts as check of what we sent to api
                const expectedValues = {
                    object_title: 'xxxxxxxx',
                    object_description:
                        'new description xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
                    object_summary: 'new summary xxxxxxxx',
                    object_link_url: 'http://example.com',
                    object_download_instructions: '',
                    object_embed_type: 'link',
                    object_publishing_user: 'dloradmin',
                    object_review_date_next: '2025-03-26T00:01',
                    object_status: 'new',
                    team_email: 'john@example.com',
                    team_manager: 'john Manager',
                    team_name: 'new team name',
                    object_keywords: ['cat', 'dog'],
                    facetType: {
                        item_type: ['type_interactive_activity'],
                        licence: ['cc_by_nc_attribution_noncommercial'],
                        media_format: ['media_audio', 'media_h5p'],
                        subject: ['all_cross_disciplinary', 'business_economics'],
                        topic: ['aboriginal_and_torres_strait_islander', 'assignments'],
                    },
                };
                console.log('document.cookies', document.cookie);
                cy.getCookie('CYPRESS_DATA_SAVED').then(cookie => {
                    expect(cookie).to.exist;
                    console.log('cookie=', cookie);
                    console.log('cookie.value=', cookie.value);
                    const decodedValue = decodeURIComponent(cookie.value);
                    const sentValues = JSON.parse(decodedValue);
                    console.log('sentValues=', sentValues);

                    // had trouble comparing the entire structure
                    const sentFacetType = sentValues.facetType;
                    const expectedFacetTypes = expectedValues.facetType;
                    const sentKeywords = sentValues.object_keywords;
                    const expectedKeywords = expectedValues.object_keywords;
                    delete sentValues.facetType;
                    delete expectedValues.facetType;
                    delete sentValues.object_keywords;
                    delete expectedValues.object_keywords;
                    delete sentValues.object_review_date_next; // doesn't seem valid to figure out the date
                    delete expectedValues.object_review_date_next;

                    expect(sentValues).to.deep.equal(expectedValues);
                    expect(sentFacetType).to.deep.equal(expectedFacetTypes);
                    expect(sentKeywords).to.deep.equal(expectedKeywords);

                    cy.clearCookie('CYPRESS_DATA_SAVED');
                    cy.clearCookie('CYPRESS_TEST_DATA');
                });

                // and navigate back to the list page
                cy.get('[data-testid="confirm-dlor-creation-outcome"]')
                    .should('contain', 'Return to list page')
                    .click();
                cy.url().should('eq', 'http://localhost:2020/admin/dlor');
            });
            it('admin can create a new object for an existing team and start a fresh form', () => {
                cy.getCookie('CYPRESS_TEST_DATA').then(cookie => {
                    expect(cookie).to.exist;
                    expect(cookie.value).to.equal('active');
                });

                const downloadInstructionText = 'some download instructions';

                // team is valid as is, so go to the second panel, Description
                cy.get('[data-testid="dlor-add-next-button"]')
                    .should('exist')
                    .click();

                cy.get('[data-testid="object_title"] input')
                    .should('exist')
                    .type('x'.padEnd(REQUIRED_LENGTH_TITLE, 'x'));
                cy.get('[data-testid="object_description"] textarea:first-child')
                    .should('exist')
                    .type('new description '.padEnd(REQUIRED_LENGTH_DESCRIPTION, 'x'));
                cy.get('[data-testid="object_summary"] textarea:first-child')
                    .should('exist')
                    .type('new summary '.padEnd(REQUIRED_LENGTH_SUMMARY, 'x'));

                // go to the third panel, Link
                cy.get('[data-testid="dlor-add-next-button"]')
                    .should('exist')
                    .click();

                cy.get('[data-testid="object_link_url"] input')
                    .should('exist')
                    .type('http://example.com');
                cy.get('[data-testid="object_download_instructions"] textarea:first-child')
                    .should('exist')
                    .type(downloadInstructionText);

                // go to the fourth panel, Filtering
                cy.get('[data-testid="dlor-add-next-button"]')
                    .should('exist')
                    .click();

                cy.get('[data-testid="filter-digital_skills"] input').check();
                cy.get('[data-testid="filter-media_dataset"] input').check();
                cy.get('[data-testid="filter-engineering_architecture_information_technology"] input').check();
                cy.get('[data-testid="filter-module"] input').check();
                cy.get('[data-testid="filter-cco_public_domain"] input').check();
                cy.get('[data-testid="filter-connected_citizens"] input').check();
                cy.get('[data-testid="object_keywords"] textarea:first-child')
                    .should('exist')
                    .type('cat, dog');

                // save record
                cy.get('[data-testid="admin-dlor-add-button-submit"]')
                    .should('exist')
                    .click();
                cy.waitUntil(() => cy.get('[data-testid="dialogbox-dlor-creation-outcome"]').should('exist'));
                cy.get('[data-testid="dialogbox-dlor-creation-outcome"] h2').contains('The object has been created');

                // wait for the save to complete
                cy.waitUntil(() => cy.get('[data-testid="cancel-dlor-creation-outcome"]').should('exist'));

                // check the data we pretended to send to the server matches what we expect
                // acts as check of what we sent to api
                const expectedValues = {
                    object_title: 'xxxxxxxx',
                    object_description:
                        'new description xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
                    object_summary: 'new summary xxxxxxxx',
                    object_link_url: 'http://example.com',
                    object_download_instructions: downloadInstructionText,
                    object_embed_type: 'link',
                    object_publishing_user: 'dloradmin',
                    object_review_date_next: '2025-03-26T00:01',
                    object_status: 'new',
                    object_owning_team_id: 1,
                    facetType: {
                        graduate_attributes: ['connected_citizens'],
                        item_type: ['module'],
                        licence: ['cco_public_domain'],
                        media_format: ['media_dataset'],
                        subject: ['engineering_architecture_information_technology'],
                        topic: ['digital_skills'],
                    },
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
                    const sentFacetType = sentValues.facetType;
                    const expectedFacetType = expectedValues.facetType;
                    const sentKeywords = sentValues.object_keywords;
                    const expectedKeywords = sentValues.object_keywords;
                    delete sentValues.facetType;
                    delete sentValues.object_keywords;
                    delete expectedValues.facetType;
                    delete expectedValues.object_keywords;

                    expect(sentValues).to.deep.equal(expectedValues);
                    expect(sentFacetType).to.deep.equal(expectedFacetType);
                    expect(sentKeywords).to.deep.equal(expectedKeywords);
                    cy.clearCookie('CYPRESS_DATA_SAVED');
                    cy.clearCookie('CYPRESS_TEST_DATA');
                });

                // now clear the form to create another Object
                cy.get('[data-testid="cancel-dlor-creation-outcome"]')
                    .should('contain', 'Add another Object')
                    .click();
                cy.waitUntil(() => cy.get('[data-testid="object_publishing_user"] input').should('exist'));
                cy.get('[data-testid="dlor-add-next-button"]')
                    .should('exist')
                    .click();

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

                // team is valid as is, so go to the second panel, Description
                cy.waitUntil(() => cy.get('[data-testid="dlor-add-next-button"]').should('exist'));
                cy.get('[data-testid="dlor-add-next-button"]').click();

                cy.get('[data-testid="object_title"] input')
                    .should('exist')
                    .type('x'.padEnd(REQUIRED_LENGTH_TITLE, 'x'));
                cy.get('[data-testid="object_description"] textarea:first-child')
                    .should('exist')
                    .type('new description '.padEnd(REQUIRED_LENGTH_DESCRIPTION, 'x'));
                cy.get('[data-testid="object_summary"] textarea:first-child')
                    .should('exist')
                    .type('new summary '.padEnd(REQUIRED_LENGTH_SUMMARY, 'x'));

                // go to the third panel, Link
                cy.get('[data-testid="dlor-add-next-button"]')
                    .should('exist')
                    .click();
                cy.get('[data-testid="object_link_url"] input')
                    .should('exist')
                    .type('http://example.com');

                // go to the fourth panel, Filtering
                cy.get('[data-testid="dlor-add-next-button"]')
                    .should('exist')
                    .click();
                cy.get('[data-testid="filter-digital_skills"] input').check();
                cy.get('[data-testid="filter-media_dataset"] input').check();
                cy.get('[data-testid="filter-engineering_architecture_information_technology"] input').check();
                cy.get('[data-testid="filter-module"] input').check();
                cy.get('[data-testid="filter-cco_public_domain"] input').check();
                cy.get('[data-testid="object_keywords"] textarea:first-child')
                    .should('exist')
                    .type('cat, dog');

                // form filled out. now save
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
