// these constants must match the constants, eg titleMinimumLength in Dlor Admin components
const REQUIRED_LENGTH_TITLE = 8;
const REQUIRED_LENGTH_DESCRIPTION = 100;
const REQUIRED_LENGTH_SUMMARY = 20;
const REQUIRED_LENGTH_KEYWORDS = 4;
describe('Add an object to the Digital learning hub', () => {
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
                cy.get('[data-testid="dlor-add-next-button"]')
                    .should('exist')
                    .click();
                cy.waitUntil(() => cy.get('[data-testid="object_title"] input').should('exist'));
                cy.checkA11y('[data-testid="StandardPage"]', {
                    reportName: 'edit dlor Panel 2',
                    scopeName: 'Panel 2',
                    includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
                });

                // go to panel 3
                cy.get('[data-testid="dlor-add-next-button"]')
                    .should('exist')
                    .click();
                cy.waitUntil(() => cy.get('[data-testid="object_link_url"] input').should('exist'));
                cy.checkA11y('[data-testid="StandardPage"]', {
                    reportName: 'edit dlor Panel 3',
                    scopeName: 'Panel 3',
                    includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
                });

                // go to panel 4
                cy.get('[data-testid="dlor-add-next-button"]')
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
                cy.get('[data-testid="dlor-add-next-button"]')
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
                cy.get('[data-testid="dlor-add-next-button"]')
                    .should('exist')
                    .click();
                cy.waitUntil(() => cy.get('[data-testid="object_link_url"] input').should('exist'));
                cy.get('[data-testid="object_link_url"] input').should(
                    'have.value',
                    'https://uq.h5p.com/content/1291624605868350759',
                );
                cy.get('[data-testid="object_download_instructions"] textarea:first-child')
                    .should('exist')
                    .contains('some download instructions');

                // go to panel 4
                cy.get('[data-testid="dlor-add-next-button"]')
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
        context.skip('successfully mock to db', () => {
            beforeEach(() => {
                cy.setCookie('CYPRESS_TEST_DATA', 'active'); // setup so we can check what we "sent" to the db
                cy.visit(`http://localhost:2020/admin/dlor/98s0_dy5k3_98h4?user=${mockDlorAdminUser}`);
                cy.viewport(1300, 1000);
            });
            it.only('admin can edit an object for a new team and return to list', () => {
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
                const typeableDownloadInstructions =
                    'Lorem ipsum dolor sit amet, [consectetur adipiscing elit](http://example.com). In at sapien vel nisi congue fringilla. Maecenas non lacus dolor. Phasellus ornare condimentum est in cursus.' +
                    '\nNam ac felis neque. Nulla at neque a mauris tristique ultrices ac ultrices ex. Suspendisse iaculis fermentum mi, non cursus augue eleifend in. Maecenas ut faucibus est. Phasellus a diam eget mauris feugiat vestibulum. ';
                cy.get('[data-testid="object_download_instructions"] textarea:first-child')
                    .should('exist')
                    .type(typeableDownloadInstructions);
                cy.get('[data-testid="dlor-massaged-download-instructions"]')
                    .should('exist')
                    .should('contain', 'Lorem ipsum dolor sit amet');
                cy.get('[data-testid="dlor-massaged-download-instructions"] a')
                    .should('exist')
                    .contains('consectetur adipiscing elit')
                    .should('have.attr', 'href', 'http://example.com');

                // go to the fourth panel, Filtering
                cy.get('[data-testid="dlor-add-next-button"]')
                    .should('exist')
                    .click();

                cy.get('[data-testid="filter-1"] input').check(); // aboriginal_and_torres_strait_islander
                cy.get('[data-testid="filter-2"] input').check(); // assignments
                cy.get('[data-testid="filter-22"] input').check(); // media_audio
                cy.get('[data-testid="filter-24"] input').check(); // media_h5p
                cy.get('[data-testid="filter-34"] input').check(); // all_cross_disciplinary
                cy.get('[data-testid="filter-35"] input').check(); // business_economics
                cy.get('[data-testid="filter-17"] input').check(); // type_interactive_activity
                cy.get('[data-testid="filter-45"] input').check();
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
                    object_download_instructions: typeableDownloadInstructions,
                    object_embed_type: 'link',
                    object_publishing_user: 'dloradmn',
                    object_review_date_next: '2025-03-26T00:01',
                    object_status: 'new',
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
                console.log('document.cookies', document.cookie);
                cy.getCookie('CYPRESS_DATA_SAVED').then(cookie => {
                    expect(cookie).to.exist;
                    console.log('cookie=', cookie);
                    console.log('cookie.value=', cookie.value);
                    const decodedValue = decodeURIComponent(cookie.value);
                    const sentValues = JSON.parse(decodedValue);
                    console.log('sentValues=', sentValues);

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
                cy.get('[data-testid="confirm-dlor-creation-outcome"]')
                    .should('contain', 'Return to list page')
                    .click();
                cy.url().should('eq', `http://localhost:2020/admin/dlor?user=${mockDlorAdminUser}`);
                cy.get('[data-testid="StandardPage-title"]')
                    .should('exist')
                    .should('contain', 'Digital learning hub Management');
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
                cy.get('[data-testid="admin-dlor-add-button-submit"]')
                    .should('exist')
                    .should('not.be.disabled')
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
                    object_publishing_user: 'dloradmn',
                    object_review_date_next: '2025-03-26T00:01',
                    object_status: 'new',
                    object_owning_team_id: 1,
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

                    console.log('sentFacets=', sentFacets);
                    console.log('expectedFacets=', expectedFacets);
                    expect(sentValues).to.deep.equal(expectedValues);
                    expect(sentFacets).to.deep.equal(expectedFacets);
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
        context.skip('fails correctly', () => {
            it('admin gets an error when Teams list api doesnt load', () => {
                cy.visit(`http://localhost:2020/admin/dlor/add?user=${mockDlorAdminUser}&responseType=teamsLoadError`);
                // "responseType=teamsLoadError" on the url forces an error from mock api
                cy.get('[data-testid="dlor-addObject-error"]').contains(
                    'An error has occurred during the request and this request cannot be processed',
                );
            });
            it('admin gets an error when Filter list api doesnt load', () => {
                cy.visit(`http://localhost:2020/admin/dlor/add?user=${mockDlorAdminUser}&responseType=filterLoadError`);
                // "responseType=filterLoadError" on the url forces an error from mock api
                cy.get('[data-testid="dlor-homepage-error"]').contains(
                    'An error has occurred during the request and this request cannot be processed',
                );
            });
            it('admin gets an error when Filter list is empty', () => {
                cy.visit(`http://localhost:2020/admin/dlor/add?user=${mockDlorAdminUser}&responseType=filterLoadEmpty`);
                // "responseType=filterLoadEmpty" on the url forces an error from mock api
                cy.get('[data-testid="dlor-homepage-noresult"]').contains(
                    'Missing filters: We did not find any entries in the system - please try again later.',
                );
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
                cy.get('[data-testid="filter-3"] input').check(); // digital_skills
                cy.get('[data-testid="filter-23"] input').check(); // media_dataset
                cy.get('[data-testid="filter-36"] input').check(); // engineering_architecture_information_technology
                cy.get('[data-testid="filter-18"] input').check(); // module
                cy.get('[data-testid="filter-50"] input').check(); // cco_public_domain
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
