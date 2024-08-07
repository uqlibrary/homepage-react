// these constants must match the constants, eg titleMinimumLength in Dlor Admin components
import { DLOR_ADMIN_USER } from '../../../support/constants';

const REQUIRED_LENGTH_TITLE = 8;
const REQUIRED_LENGTH_DESCRIPTION = 100;
describe('Edit an object on the Digital Learning Hub', () => {
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
    function CheckCKEditor(content) {
        cy.get('.ck-content')
            .should('exist')
            // .click()
            .should('contain', content);
    }

    context('editing an object', () => {
        context('successfully', () => {
            it('is accessible', () => {
                cy.visit(`http://localhost:2020/admin/dlor/edit/98s0_dy5k3_98h4?user=${DLOR_ADMIN_USER}`);
                cy.viewport(1300, 1000);
                cy.injectAxe();
                cy.viewport(1300, 1000);
                cy.waitUntil(() => cy.get('h1').should('exist'));
                cy.get('h1').should('contain', 'Digital Learning Hub - Edit Object');

                // check panel 1
                cy.checkA11y('[data-testid="StandardPage"]', {
                    reportName: 'edit dlor Panel 1',
                    scopeName: 'Panel 1',
                    includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
                });

                // open the "edit a team dialog"
                cy.waitUntil(() => cy.get('[data-testid="object-form-teamid-change"]').should('exist'));
                cy.get('[data-testid="object-form-teamid-change"]').click();
                cy.waitUntil(() => cy.get('[data-testid="dlor-form-team-manager-edit"]').should('exist'));
                cy.checkA11y('[data-testid="StandardPage"]', {
                    reportName: 'edit dlor Panel 1 with team dialog open',
                    scopeName: 'Panel 1 with team dialog',
                    includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
                });

                // go to panel 2
                cy.get('[data-testid="dlor-form-next-button"]')
                    .should('exist')
                    .click();
                cy.waitUntil(() => cy.get('[data-testid="object-title"] input').should('exist'));
                cy.checkA11y('[data-testid="StandardPage"]', {
                    reportName: 'edit dlor Panel 2',
                    scopeName: 'Panel 2',
                    includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
                });

                // go to panel 3
                cy.get('[data-testid="dlor-form-next-button"]')
                    .should('exist')
                    .click();
                cy.waitUntil(() => cy.get('[data-testid="object-link-url"] input').should('exist'));
                cy.checkA11y('[data-testid="StandardPage"]', {
                    reportName: 'edit dlor Panel 3',
                    scopeName: 'Panel 3',
                    includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
                });

                // go to panel 4
                cy.get('[data-testid="dlor-form-next-button"]')
                    .should('exist')
                    .click();
                cy.waitUntil(() => cy.get('[data-testid="object-keywords"] textarea:first-child').should('exist'));
                cy.checkA11y('[data-testid="StandardPage"]', {
                    reportName: 'edit dlor Panel 4',
                    scopeName: 'Panel 4',
                    includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
                });

                // open the notification lightbox
                cy.get('[data-testid="choose-notify"] input')
                    .should('exist')
                    .check();
                cy.waitUntil(() => cy.get('[data-testid="object-keywords"] textarea:first-child').should('exist'));
                cy.checkA11y('[data-testid="StandardPage"]', {
                    reportName: 'edit dlor notification lightbox',
                    scopeName: 'Panel 4',
                    includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
                });
            });
            it('loads fields correctly', () => {
                cy.visit(`http://localhost:2020/admin/dlor/edit/98s0_dy5k3_98h4?user=${DLOR_ADMIN_USER}`);
                cy.viewport(1300, 1000);

                cy.get('uq-site-header')
                    .shadow()
                    .within(() => {
                        cy.get('[data-testid="subsite-title"]')
                            .should('exist')
                            .should('be.visible')
                            .contains('Digital learning hub admin');
                    });
                cy.waitUntil(() => cy.get('[data-testid="object-publishing-user"] input').should('exist'));
                cy.get('[data-testid="object-publishing-user"] input').should('have.value', 'uqjsmith');
                cy.get('[data-testid="dlor-form-team-message-object-publishing-user"]').should('not.exist');

                cy.get('a[data-testid="dlor-breadcrumb-admin-homelink"]')
                    .contains('Digital Learning Hub admin')
                    .should('have.attr', 'href', `http://localhost:2020/admin/dlor?user=${DLOR_ADMIN_USER}`);
                cy.get('[data-testid="dlor-breadcrumb-edit-object-label-0"]').contains(
                    'Edit object: Advanced literature searching',
                );

                // team editor

                // swap teams and the edit button doesnt exist
                cy.get('[data-testid="object-form-teamid-change"]')
                    .should('exist')
                    .contains('Update contact');
                // swap to "team 1"
                cy.waitUntil(() => cy.get('[data-testid="object-owning-team"]').should('exist'));
                cy.get('[data-testid="object-owning-team"]').click();
                cy.get('[data-testid="object-owning-team-1"]')
                    .should('exist')
                    .click();
                cy.get('[data-testid="object-owning-team"]').contains('LIB DX Digital Content');
                cy.get('[data-testid="object-form-teamid-change"]').should('not.exist'); // button missing
                // swap to "team 3"
                cy.get('[data-testid="object-owning-team"]').click();
                cy.get('[data-testid="object-owning-team-3"]')
                    .should('exist')
                    .click();
                cy.get('[data-testid="object-owning-team"]').contains('Library Indigenous Enquiries');
                cy.get('[data-testid="object-form-teamid-change"]').should('not.exist'); // button missing

                // back to "team 2", current Team
                cy.get('[data-testid="object-owning-team"]').click();
                cy.get('[data-testid="object-owning-team-2"]')
                    .should('exist')
                    .click();

                // can open the editor for this team
                cy.get('[data-testid="dlor-form-team-manager-edit"]').should('not.exist');
                cy.get('[data-testid="dlor-form-team-email-edit"]').should('not.exist');
                cy.get('[data-testid="object-form-teamid-change"]')
                    .should('exist')
                    .click();
                cy.waitUntil(() => cy.get('[data-testid="dlor-form-team-manager-edit"]').should('exist'));
                cy.get('[data-testid="dlor-form-team-email-edit"]').should('exist');

                // check the Close button works
                cy.get('[data-testid="object-form-teamid-change"]')
                    .should('exist')
                    .click();
                cy.get('[data-testid="dlor-form-team-manager-edit"]').should('not.exist');
                cy.get('[data-testid="dlor-form-team-email-edit"]').should('not.exist');

                // ok, good - now reclick button to reopen edit team dialog so we can test the form itself
                cy.get('[data-testid="object-form-teamid-change"]')
                    .should('exist')
                    .click();

                // cy.get('[data-testid="dlor-panel-validity-indicator-0"] span').should('not.exist');
                cy.get('[data-testid="dlor-form-team-manager-edit"]').type('111');
                cy.get('[data-testid="dlor-form-team-email-edit"]')
                    .clear()
                    .type('lea');
                cy.get('[data-testid="dlor-form-team-email-edit"]').type('@example.com');

                // the user realises they actually want a new team and choose 'new' from the Owning team drop down
                cy.get('[data-testid="object-owning-team"]').click();
                cy.get('[data-testid="object-form-teamid-new"]')
                    .should('exist')
                    .click();
                // the fields _do not inherit_ from what the user types
                cy.get('[data-testid="dlor-form-team-name-new"] input')
                    .should('exist')
                    .should('have.value', '')
                    .type('new team');
                cy.get('[data-testid="dlor-form-team-manager-new"] input')
                    .should('exist')
                    .should('have.value', '')
                    .type('new name');
                cy.get('[data-testid="dlor-form-team-email-new"] input')
                    .should('exist')
                    .should('have.value', '')
                    .type('new@example.com');

                // back to current team, team 2, so we can check those values are still there
                cy.get('[data-testid="object-owning-team"]').click();
                cy.get('[data-testid="object-owning-team-2"]')
                    .should('exist')
                    .click();
                cy.get('[data-testid="object-form-teamid-change"]') // click button to open dialog
                    .should('exist')
                    .click();
                // cy.get('[data-testid="dlor-form-team-name-edit"]').should('not.exist');
                cy.get('[data-testid="dlor-form-team-manager-edit"] input')
                    .should('exist')
                    .should('have.value', 'Jane Green111');
                cy.get('[data-testid="dlor-form-team-email-edit"] input')
                    .should('exist')
                    .should('have.value', 'lea@example.com');

                // and then if we go back to the new form _again_ it has held the previous values we entered
                cy.get('[data-testid="object-owning-team"]').click();
                cy.get('[data-testid="object-form-teamid-new"]')
                    .should('exist')
                    .click();
                // the fields _do not inherit_ from what the user types on the edit-current form
                cy.get('[data-testid="dlor-form-team-name-new"] input')
                    .should('exist')
                    .should('have.value', 'new team');
                cy.get('[data-testid="dlor-form-team-manager-new"] input')
                    .should('exist')
                    .should('have.value', 'new name');
                cy.get('[data-testid="dlor-form-team-email-new"] input')
                    .should('exist')
                    .should('have.value', 'new@example.com');

                // go to panel 2
                cy.get('[data-testid="dlor-form-next-button"]')
                    .should('exist')
                    .click();
                cy.waitUntil(() => cy.get('[data-testid="object-title"] input').should('exist'));
                cy.get('[data-testid="object-title"] input').should('have.value', 'Advanced literature searching');
                CheckCKEditor(
                    'This tutorial covers the advanced searching techniques that can be used for all topics when conducting a scoping',
                );
                cy.get('[data-testid="object-summary"] textarea:first-child')
                    .should('exist')
                    .should('have.value', 'Using advanced searching techniques.');

                cy.get('[data-testid="object-is-featured"] input')
                    .should('exist')
                    .should('not.be.checked');

                cy.get('[data-testid="object-cultural-advice"] input')
                    .should('exist')
                    .should('not.be.checked');

                // go to panel 3
                cy.get('[data-testid="dlor-form-next-button"]')
                    .should('exist')
                    .click();
                cy.waitUntil(() => cy.get('[data-testid="object-link-url"] input').should('exist'));
                cy.get('[data-testid="object-link-url"] input').should(
                    'have.value',
                    'https://uq.h5p.com/content/1291624605868350759',
                );

                // accessible link message is "no message"
                cy.get('[data-testid="object-link-interaction-type"]')
                    .should('exist')
                    .contains('No message');
                cy.get('[data-testid="object-link-file-type"]').should('not.exist');
                cy.get('[data-testid="object-link-duration"]').should('not.exist');
                cy.get('[data-testid="object-link-file-size"]').should('not.exist');

                CheckCKEditor('some download instructions');
                // go to panel 4
                cy.get('[data-testid="dlor-form-next-button"]')
                    .should('exist')
                    .click();
                cy.waitUntil(() => cy.get('[data-testid="object-keywords"] textarea:first-child').should('exist'));
                cy.get('[data-testid="object-keywords"] textarea:first-child').should(
                    'have.value',
                    'search, evaluate, literature, strategy',
                );

                const checkboxStatus = {
                    'topic-aboriginal-and-torres-strait-islander': false,
                    'topic-assignments': true,
                    'topic-digital-skills': false,
                    'topic-employability': false,
                    'topic-information-literacy': false,
                    'topic-referencing': false,
                    'topic-research': true,
                    'topic-software': false,
                    'topic-other': false,
                    'graduate-attributes-accomplished-scholars': true,
                    'graduate-attributes-connected-citizens': false,
                    'graduate-attributes-courageous-thinkers': false,
                    'graduate-attributes-culturally-capable': false,
                    'graduate-attributes-influential-communicators': true,
                    'graduate-attributes-respectful-leaders': false,
                    'item-type-guide': true,
                    'item-type-interactive': false,
                    'item-type-module': false,
                    'item-type-presentation': false,
                    'item-type-training-recording': false,
                    'item-type-other': false,
                    'media-format-audio': false,
                    'media-format-dataset': false,
                    'media-format-h5p': false,
                    'media-format-image': false,
                    'media-format-powerpoint': false,
                    'media-format-pressbook': true,
                    'media-format-pdf': false,
                    'media-format-spreadsheet': false,
                    'media-format-video': false,
                    'media-format-webpage': false,
                    'media-format-word-document': false,
                    'media-format-other': false,
                    'subject-cross-disciplinary': true,
                    'subject-business-economics': false,
                    'subject-engineering-architecture-information-technology': false,
                    'subject-health-behavioural-sciences': false,
                    'subject-humanities-arts': false,
                    'subject-law': false,
                    'subject-medicine-biomedical-sciences': false,
                    'subject-science': false,
                    'subject-social-sciences': false,
                    'subject-other': false,
                    'licence-cc-by-attribution': false,
                    'licence-cc-by-nc-attribution-noncommercial': false,
                    'licence-cc-by-nc-nd-attribution-noncommercial-no-derivatives': true,
                    'licence-cc-by-nc-sa-attribution-noncommercial-share-alike': false,
                    'licence-cc-by-nd-attribution-no-derivatives': false,
                    'licence-cc-by-sa-attribution-share-alike': false,
                    'licence-cc0public-domain': false,
                    'licence-uq-copyright': false,
                };
                Object.entries(checkboxStatus).forEach(([slug, isChecked]) => {
                    cy.log(`check checkbox/radio ${slug} - "${isChecked}"`);
                    if (isChecked) {
                        cy.get(`[data-testid="filter-${slug}"] input`)
                            .should('exist')
                            .should('be.checked');
                    } else {
                        cy.get(`[data-testid="filter-${slug}"] input`)
                            .should('exist')
                            .should('not.be.checked');
                    }
                });

                // no extra filters
                cy.get('[data-testid="filter-group-topic"]')
                    .children()
                    .should('have.length', 9 + 1);
                cy.get('[data-testid="filter-group-media-format"]')
                    .children()
                    .should('have.length', 12 + 1);
                cy.get('[data-testid="filter-group-graduate-attributes"]')
                    .children()
                    .should('have.length', 6 + 1);
                cy.get('[data-testid="filter-group-subject"]')
                    .children()
                    .should('have.length', 10 + 1);
                cy.get('[data-testid="filter-group-item-type"] div') // radio group has different structure
                    .children()
                    .should('have.length', 6);
                cy.get('[data-testid="filter-group-licence"] div')
                    .children()
                    .should('have.length', 8);
            });
            it('changes "download" url accessibility message', () => {
                cy.setCookie('CYPRESS_TEST_DATA', 'active'); // setup so we can check what we "sent" to the db
                cy.visit(
                    `http://localhost:2020/admin/dlor/edit/9bc192a8-324c-4f6b-ac50-07e7ff2df240?user=${DLOR_ADMIN_USER}`,
                );
                // go to panel 2
                cy.get('[data-testid="dlor-form-next-button"]')
                    .should('exist')
                    .click();
                // go to panel 3
                cy.get('[data-testid="dlor-form-next-button"]')
                    .should('exist')
                    .click();

                // accessible link message is "no message"
                cy.get('[data-testid="object-link-interaction-type"]')
                    .should('exist')
                    .contains('can Download');
                cy.get('[data-testid="object-link-file-type"]')
                    .should('exist')
                    .contains('XLS');
                cy.get('[data-testid="object-link-size-amount"] input')
                    .should('exist')
                    .should('have.value', '3.4');
                cy.get('[data-testid="object-link-size-units"]')
                    .should('exist')
                    .contains('GB');
                cy.get('[data-testid="object-link-duration-minutes"]').should('not.exist');
                cy.get('[data-testid="object-link-duration-seconds"]').should('not.exist');

                cy.get('[data-testid="object-link-file-type"]').click();
                cy.get('[data-testid="object-link-file-type-PPT"]')
                    .should('exist')
                    .click();
                cy.get('[data-testid="object-link-size-amount"]')
                    .should('exist')
                    .type('33');
                cy.get('[data-testid="object-link-size-units"]').click();
                cy.get('[data-testid="object-link-size-units-MB"]')
                    .should('exist')
                    .click();

                // go to panel 4
                cy.get('[data-testid="dlor-form-next-button"]')
                    .should('exist')
                    .click();

                // and save
                cy.get('[data-testid="admin-dlor-save-button-submit"]')
                    .should('exist')
                    .should('not.be.disabled')
                    .click();
                cy.waitUntil(() => cy.get('[data-testid="dialogbox-dlor-save-outcome"]').should('exist'));
                cy.get('[data-testid="dialogbox-dlor-save-outcome"] h2').contains('Changes have been saved');

                // wait for the save to complete
                cy.waitUntil(() => cy.get('[data-testid="cancel-dlor-save-outcome"]').should('exist'));
                cy.get('[data-testid="confirm-dlor-save-outcome"]')
                    .should('exist')
                    .contains('Return to list page');
                cy.get('[data-testid="cancel-dlor-save-outcome"]')
                    .should('exist')
                    .contains('Re-edit Object');

                cy.getCookie('CYPRESS_DATA_SAVED').then(cookie => {
                    expect(cookie).to.exist;
                    const decodedValue = decodeURIComponent(cookie.value);
                    const sentValues = JSON.parse(decodedValue);

                    expect(sentValues.object_link_interaction_type).to.equal('download');
                    expect(sentValues.object_link_file_type).to.equal('PPT');
                    expect(sentValues.object_link_size).to.equal('3433');

                    cy.clearCookie('CYPRESS_DATA_SAVED');
                    cy.clearCookie('CYPRESS_TEST_DATA');
                });
            });
            it('changes "view" url accessibility message', () => {
                cy.setCookie('CYPRESS_TEST_DATA', 'active'); // setup so we can check what we "sent" to the db

                cy.visit(`http://localhost:2020/admin/dlor/edit/987y_isjgt_9866?user=${DLOR_ADMIN_USER}`);
                // go to panel 2
                cy.get('[data-testid="dlor-form-next-button"]')
                    .should('exist')
                    .click();
                // go to panel 3
                cy.get('[data-testid="dlor-form-next-button"]')
                    .should('exist')
                    .click();

                // accessible link message is "no message"
                cy.get('[data-testid="object-link-interaction-type"]')
                    .should('exist')
                    .contains('can View');
                cy.get('[data-testid="object-link-file-type"]')
                    .should('exist')
                    .contains('video');
                cy.get('[data-testid="object-link-duration-minutes"] input')
                    .should('exist')
                    .should('have.value', '47');
                cy.get('[data-testid="object-link-duration-seconds"] input')
                    .should('exist')
                    .should('have.value', '44');
                cy.get('[data-testid="object-link-size-amount"]').should('not.exist');
                cy.get('[data-testid="object-link-size-units"]').should('not.exist');

                cy.get('[data-testid="object-link-file-type"]').click();
                cy.get('[data-testid="object-link-file-type-something"]')
                    .should('exist')
                    .click();

                cy.get('[data-testid="object-link-duration-minutes"]')
                    .should('exist')
                    // .clear()
                    .type('3');
                cy.get('[data-testid="object-link-duration-seconds"]')
                    .should('exist')
                    .type('1');

                // go to panel 4
                cy.get('[data-testid="dlor-form-next-button"]')
                    .should('exist')
                    .click();

                // and save
                cy.get('[data-testid="admin-dlor-save-button-submit"]')
                    .should('exist')
                    .should('not.be.disabled')
                    .click();

                // wait for the save to complete
                cy.waitUntil(() => cy.get('[data-testid="dialogbox-dlor-save-outcome"]').should('exist'));
                cy.get('[data-testid="dialogbox-dlor-save-outcome"] h2').contains('Changes have been saved');
                cy.get('[data-testid="confirm-dlor-save-outcome"]')
                    .should('exist')
                    .contains('Return to list page');
                cy.get('[data-testid="cancel-dlor-save-outcome"]')
                    .should('exist')
                    .contains('Re-edit Object');

                cy.getCookie('CYPRESS_DATA_SAVED').then(cookie => {
                    expect(cookie).to.exist;
                    const decodedValue = decodeURIComponent(cookie.value);
                    const sentValues = JSON.parse(decodedValue);

                    expect(sentValues.object_link_interaction_type).to.equal('view');
                    expect(sentValues.object_link_file_type).to.equal('something');
                    expect(sentValues.object_link_size).to.equal(28821);

                    cy.clearCookie('CYPRESS_DATA_SAVED');
                    cy.clearCookie('CYPRESS_TEST_DATA');
                });
            });
            it('the form cancel button works', () => {
                cy.visit(`http://localhost:2020/admin/dlor/edit/98s0_dy5k3_98h4?user=${DLOR_ADMIN_USER}`);
                cy.waitUntil(() =>
                    cy
                        .get('[data-testid="admin-dlor-form-button-cancel"]')
                        .should('exist')
                        .scrollIntoView()
                        .contains('Cancel'),
                );
                cy.get('[data-testid="admin-dlor-form-button-cancel"]').click();
                cy.waitUntil(() => cy.get('[data-testid="checkbox-status-current"]').should('exist'));
                cy.url().should('eq', `http://localhost:2020/admin/dlor?user=${DLOR_ADMIN_USER}`);
            });
        });
        context('successfully mock to db', () => {
            beforeEach(() => {
                cy.setCookie('CYPRESS_TEST_DATA', 'active'); // setup so we can check what we "sent" to the db
            });
            it('admin can edit an object for a new team with notify and return to list', () => {
                cy.visit(`http://localhost:2020/admin/dlor/edit/98s0_dy5k3_98h4?user=${DLOR_ADMIN_USER}`);
                cy.viewport(1300, 1000);

                cy.getCookie('CYPRESS_TEST_DATA').then(cookie => {
                    expect(cookie).to.exist;
                    expect(cookie.value).to.equal('active');
                });

                // open teams drop down
                cy.waitUntil(() => cy.get('[data-testid="object-owning-team"]').should('exist'));
                cy.get('[data-testid="object-owning-team"]').click();
                cy.get('[data-testid="object-form-teamid-new"]')
                    .should('exist')
                    .click();

                // enter a new team
                cy.get('[data-testid="dlor-form-team-name-new"]')
                    .should('exist')
                    .type('new team name');
                cy.get('[data-testid="dlor-form-team-manager-new"]')
                    .should('exist')
                    .type('john Manager');
                cy.get('[data-testid="dlor-form-team-email-new"]')
                    .should('exist')
                    .type('john@example.com');

                // go to the second panel, Description
                cy.get('[data-testid="dlor-form-next-button"]')
                    .should('exist')
                    .click();

                cy.get('[data-testid="object-title"] input')
                    .should('exist')
                    .type('xx');
                TypeCKEditor('new description '.padEnd(REQUIRED_LENGTH_DESCRIPTION, 'x'));
                cy.get('[data-testid="object-summary"] textarea:first-child')
                    .should('exist')
                    .type('xx');

                cy.get('[data-testid="object-is-featured"] input')
                    .should('exist')
                    .should('not.be.checked');
                cy.get('[data-testid="object-is-featured"] input').check();

                cy.get('[data-testid="object-cultural-advice"] input')
                    .should('exist')
                    .should('not.be.checked');
                cy.get('[data-testid="object-cultural-advice"] input').check();

                // go to the third panel, Link
                cy.get('[data-testid="dlor-form-next-button"]')
                    .should('exist')
                    .click();

                cy.get('[data-testid="object-link-url"] input')
                    .should('exist')
                    .type('/page');

                // select download as the url interaction type
                cy.waitUntil(() => cy.get('[data-testid="object-link-interaction-type"]').should('exist'));
                cy.get('[data-testid="object-link-file-type"]').should('not.exist');
                cy.get('[data-testid="object-link-duration-minutes"]').should('not.exist');
                cy.get('[data-testid="object-link-duration-seconds"]').should('not.exist');
                cy.get('[data-testid="object-link-size-units"]').should('not.exist');
                cy.get('[data-testid="object-link-size-amount"]').should('not.exist');
                cy.get('[data-testid="object-link-interaction-type"]').click();
                cy.get('[data-testid="object-link-interaction-type-download"]')
                    .should('exist')
                    .click();
                cy.get('[data-testid="object-link-file-type"]').should('exist');
                cy.get('[data-testid="object-link-size-amount"]').should('exist');
                cy.get('[data-testid="object-link-size-units"]').should('exist');
                cy.get('[data-testid="object-link-duration-minutes"]').should('not.exist');
                cy.get('[data-testid="object-link-duration-seconds"]').should('not.exist');
                // shows an error because they havent chosen a file type and a file size
                cy.get('[data-testid="dlor-panel-validity-indicator-2"] span')
                    .should('exist')
                    .should('contain', 2); // panel invalidity count present

                // choose file type
                cy.waitUntil(() => cy.get('[data-testid="object-link-file-type"]').should('exist'));
                cy.get('[data-testid="object-link-file-type"]').click();
                cy.get('[data-value="XLS"]')
                    .should('exist')
                    .click();

                cy.get('[data-testid="dlor-panel-validity-indicator-2"] span')
                    .should('exist')
                    .should('contain', 1); // panel invalidity count present

                // enter file size
                cy.get('[data-testid="object-link-size-amount"] input')
                    .should('exist')
                    .type('36');
                cy.waitUntil(() => cy.get('[data-testid="object-link-size-units"]').should('exist'));
                cy.get('[data-testid="object-link-size-units"]').click();
                cy.get('[data-value="MB"]')
                    .should('exist')
                    .click();

                cy.get('[data-testid="dlor-panel-validity-indicator-2"]').should('not.exist'); // panel invalidity count no longer present

                const typeableDownloadInstructions = 'xxx';
                TypeCKEditor(typeableDownloadInstructions);

                // go to the fourth panel, Filtering
                cy.get('[data-testid="dlor-form-next-button"]')
                    .should('exist')
                    .click();

                cy.get('[data-testid="filter-topic-assignments"] input').uncheck();
                cy.get('[data-testid="filter-topic-research"] input').uncheck();
                cy.get('[data-testid="filter-topic-aboriginal-and-torres-strait-islander"] input').check();

                cy.get('[data-testid="filter-media-format-audio"] input').check();
                cy.get('[data-testid="filter-media-format-h5p"] input').check();
                cy.get('[data-testid="filter-media-format-pressbook"] input').uncheck();

                cy.get('[data-testid="filter-subject-business-economics"] input').check();
                cy.get('[data-testid="filter-subject-cross-disciplinary"] input').uncheck();

                cy.get('[data-testid="filter-item-type-interactive"] input').check();

                cy.get('[data-testid="filter-licence-cc-by-nc-attribution-noncommercial"] input').check();

                cy.get('[data-testid="object-keywords"] textarea:first-child')
                    .should('exist')
                    .clear()
                    .type('cat, dog');

                // add notification text
                cy.get('[data-testid="choose-notify"] input')
                    .should('exist')
                    .check();
                cy.waitUntil(() =>
                    cy
                        .get('[data-testid="notify-lightbox-title"]')
                        .should('exist')
                        .should('be.visible'),
                );
                // the lightbox is open
                cy.get('[data-testid="notify-lightbox-title"]').contains('Object change notification');

                TypeCKEditor('the words that will go in the email');

                cy.get('[data-testid="notify-lightbox-close-button"]')
                    .should('exist')
                    .click();

                cy.get('[data-testid="admin-dlor-save-button-submit"]')
                    .should('exist')
                    .should('not.be.disabled')
                    .click();

                cy.waitUntil(() => cy.get('[data-testid="dialogbox-dlor-save-outcome"]').should('exist'));
                cy.get('[data-testid="dialogbox-dlor-save-outcome"] h2').contains('Changes have been saved');
                cy.get('[data-testid="confirm-dlor-save-outcome"]')
                    .should('exist')
                    .contains('Return to list page');
                cy.get('[data-testid="cancel-dlor-save-outcome"]')
                    .should('exist')
                    .contains('Re-edit Object');

                // check the data we pretended to send to the server matches what we expect
                // acts as check of what we sent to api

                const expectedValues = {
                    object_title: 'Advanced literature searchingxx',
                    object_description:
                        '<p>new description xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</p>',
                    object_summary: 'Using advanced searching techniques.xx',
                    object_link_interaction_type: 'download',
                    object_link_file_type: 'XLS',
                    object_link_size: '36000',
                    object_link_url: 'https://uq.h5p.com/content/1291624605868350759/page',
                    object_download_instructions: '<p>' + typeableDownloadInstructions + '</p>',
                    object_is_featured: 1,
                    object_cultural_advice: 1,
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
                    notificationText: '<p>the words that will go in the email</p>',
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

                    console.log('sentValues=', sentValues);
                    console.log('expectedValues=', expectedValues);
                    expect(sentValues).to.deep.equal(expectedValues);
                    expect(sentFacets).to.deep.equal(expectedFacets);
                    expect(sentKeywords).to.deep.equal(expectedKeywords);

                    cy.clearCookie('CYPRESS_DATA_SAVED');
                    cy.clearCookie('CYPRESS_TEST_DATA');
                });

                // check save-confirmation popup
                cy.waitUntil(() => cy.get('[data-testid="cancel-dlor-save-outcome"]').should('exist'));
                cy.get('[data-testid="confirm-dlor-save-outcome"]').should('contain', 'Return to list page');
                cy.get('[data-testid="confirm-dlor-save-outcome"]')
                    .should('exist')
                    .contains('Return to list page');
                cy.get('[data-testid="cancel-dlor-save-outcome"]')
                    .should('exist')
                    .contains('Re-edit Object');

                // and navigate back to the list page
                cy.get('[data-testid="confirm-dlor-save-outcome"]')
                    .should('contain', 'Return to list page')
                    .click();
                cy.url().should('eq', `http://localhost:2020/admin/dlor?user=${DLOR_ADMIN_USER}`);
                cy.get('[data-testid="StandardPage-title"]')
                    .should('exist')
                    .should('contain', 'Digital Learning Hub Management');
            });
            it('admin can edit, edit the current team, choose a different existing team and re-edit', () => {
                cy.visit(`http://localhost:2020/admin/dlor/edit/98s0_dy5k3_98h4?user=${DLOR_ADMIN_USER}`);
                cy.viewport(1300, 1000);

                cy.getCookie('CYPRESS_TEST_DATA').then(cookie => {
                    expect(cookie).to.exist;
                    expect(cookie.value).to.equal('active');
                });

                // first panel, Ownership, loads

                // edit team details for the current team
                cy.waitUntil(() => cy.get('[data-testid="object-form-teamid-change"]').should('exist'));
                cy.get('[data-testid="object-form-teamid-change"]')
                    .should('exist')
                    .click();
                cy.get('[data-testid="dlor-form-team-manager-edit"]')
                    .should('exist')
                    .type('manager name');
                cy.get('[data-testid="dlor-form-team-email-edit"]')
                    .should('exist')
                    .clear()
                    .type('lea@example.com');

                // and then change your mind and change teams instead
                cy.waitUntil(() => cy.get('[data-testid="object-owning-team"]').should('exist'));
                cy.get('[data-testid="object-owning-team"]').click();
                cy.get('[data-value="3"]')
                    .should('exist')
                    .click();

                // go to the second panel, Description
                cy.get('[data-testid="dlor-form-next-button"]')
                    .should('exist')
                    .click();

                cy.get('[data-testid="object-title"] input')
                    .should('exist')
                    .type('x'.padEnd(REQUIRED_LENGTH_TITLE, 'x'));
                TypeCKEditor('new description '.padEnd(REQUIRED_LENGTH_DESCRIPTION, 'x'));
                cy.get('[data-testid="object-summary"] textarea:first-child')
                    .should('exist')
                    .type('xxx');

                // go to the third panel, Link
                cy.get('[data-testid="dlor-form-next-button"]')
                    .should('exist')
                    .click();
                const downloadInstructionText = 'updated download instructions';

                cy.get('[data-testid="object-link-url"] input')
                    .should('exist')
                    .clear()
                    .type('http://example.com');

                // select download as the url interaction type
                cy.waitUntil(() => cy.get('[data-testid="object-link-interaction-type"]').should('exist'));
                cy.get('[data-testid="object-link-file-type"]').should('not.exist');
                cy.get('[data-testid="object-link-duration-minutes"]').should('not.exist');
                cy.get('[data-testid="object-link-duration-seconds"]').should('not.exist');
                cy.get('[data-testid="object-link-size-units"]').should('not.exist');
                cy.get('[data-testid="object-link-size-amount"]').should('not.exist');

                cy.get('[data-testid="object-link-interaction-type"]').click();
                cy.get('[data-testid="object-link-interaction-type-view"]')
                    .should('exist')
                    .click();
                cy.get('[data-testid="object-link-file-type"]').should('exist');
                cy.get('[data-testid="object-link-size-amount"]').should('not.exist');
                cy.get('[data-testid="object-link-size-units"]').should('not.exist');
                cy.get('[data-testid="object-link-duration-minutes"]').should('exist');
                cy.get('[data-testid="object-link-duration-seconds"]').should('exist');
                // shows an error because they havent chosen a file type and a duration
                cy.get('[data-testid="dlor-panel-validity-indicator-2"] span')
                    .should('exist')
                    .should('contain', 2); // panel invalidity count present

                // choose file type
                cy.waitUntil(() => cy.get('[data-testid="object-link-file-type"]').should('exist'));
                cy.get('[data-testid="object-link-file-type"]').click();
                cy.get('[data-value="video"]')
                    .should('exist')
                    .click();

                cy.get('[data-testid="dlor-panel-validity-indicator-2"] span')
                    .should('exist')
                    .should('contain', 1); // panel invalidity count present

                // enter file size
                cy.get('[data-testid="object-link-duration-minutes"] input')
                    .should('exist')
                    .type('6');
                cy.get('[data-testid="object-link-duration-seconds"] input')
                    .should('exist')
                    .type('30');

                cy.get('[data-testid="dlor-panel-validity-indicator-2"]').should('not.exist'); // panel invalidity count no longer present

                TypeCKEditor(downloadInstructionText);

                // go to the fourth panel, Filtering
                cy.get('[data-testid="dlor-form-next-button"]')
                    .should('exist')
                    .click();

                cy.get('[data-testid="filter-topic-digital-skills"] input').check();
                cy.get('[data-testid="filter-topic-employability"] input').check();
                cy.get('[data-testid="filter-media-format-dataset"] input').check();
                cy.get('[data-testid="filter-subject-engineering-architecture-information-technology"] input').check();

                cy.get('[data-testid="filter-subject-medicine-biomedical-sciences"] input').check();

                cy.get('[data-testid="filter-item-type-module"] input').check();
                cy.get('[data-testid="filter-licence-cc0public-domain"] input').check();
                cy.get('[data-testid="filter-graduate-attributes-connected-citizens"] input').check();

                cy.get('[data-testid="filter-subject-medicine-biomedical-sciences"] input').uncheck(); // coverage and confirm it doesnt end up in the "sent to server"

                cy.get('[data-testid="object-keywords"] textarea:first-child')
                    .should('exist')
                    .type('cat, dog');

                // save record
                cy.get('[data-testid="admin-dlor-save-button-submit"]')
                    .should('exist')
                    .should('not.be.disabled')
                    .click();

                // check save happened
                cy.waitUntil(() => cy.get('[data-testid="dialogbox-dlor-save-outcome"]').should('exist'));
                cy.get('[data-testid="dialogbox-dlor-save-outcome"] h2').contains('Changes have been saved');
                cy.get('[data-testid="confirm-dlor-save-outcome"]')
                    .should('exist')
                    .contains('Return to list page');
                cy.get('[data-testid="cancel-dlor-save-outcome"]')
                    .should('exist')
                    .contains('Re-edit Object');

                // check the data we pretended to send to the server matches what we expect
                // acts as check of what we sent to api
                const expectedValues = {
                    object_title: 'Advanced literature searchingxxxxxxxx',
                    object_description:
                        '<p>new description xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</p>',
                    object_summary: 'Using advanced searching techniques.xxx',
                    object_link_interaction_type: 'view',
                    object_link_file_type: 'video',
                    object_link_size: 390,
                    object_link_url: 'http://example.com',
                    object_download_instructions: '<p>' + downloadInstructionText + '</p>',
                    object_is_featured: 0,
                    object_cultural_advice: 0,
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
                    notificationText: '',
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

                // confirm save happened
                cy.waitUntil(() => cy.get('[data-testid="cancel-dlor-save-outcome"]').should('exist'));
                cy.get('[data-testid="dialogbox-dlor-save-outcome"] h2').contains('Changes have been saved');
                cy.get('[data-testid="confirm-dlor-save-outcome"]')
                    .should('exist')
                    .contains('Return to list page');
                cy.get('[data-testid="cancel-dlor-save-outcome"]')
                    .should('exist')
                    .contains('Re-edit Object');

                // now clear the form to create another Object
                cy.get('[data-testid="cancel-dlor-save-outcome"]')
                    .should('contain', 'Re-edit Object')
                    .click();
                cy.waitUntil(() => cy.get('[data-testid="object-publishing-user"] input').should('exist'));
                cy.get('[data-testid="dlor-form-next-button"]')
                    .should('exist')
                    .click();

                cy.get('[data-testid="dlor-detailpage-sitelabel"]')
                    .should('exist')
                    .should('contain', 'Edit object: Advanced literature searching');
            });
            it('with a new interaction type & is featured & cancelled notification text', () => {
                cy.visit(`http://localhost:2020/admin/dlor/edit/987y_isjgt_9866?user=${DLOR_ADMIN_USER}`);
                cy.viewport(1300, 1000);

                cy.getCookie('CYPRESS_TEST_DATA').then(cookie => {
                    expect(cookie).to.exist;
                    expect(cookie.value).to.equal('active');
                });

                // go to the second panel, Description
                cy.get('[data-testid="dlor-form-next-button"]')
                    .should('exist')
                    .click();

                cy.get('[data-testid="object-is-featured"] input')
                    .should('exist')
                    .should('be.checked');
                cy.get('[data-testid="object-is-featured"] input').uncheck();

                // go to the third panel, Link
                cy.get('[data-testid="dlor-form-next-button"]')
                    .should('exist')
                    .click();

                // choose file type
                cy.waitUntil(() => cy.get('[data-testid="object-link-file-type"]').should('exist'));
                cy.get('[data-testid="object-link-file-type"]').click();
                cy.get('[data-testid="object-link-file-type-new"]')
                    .should('exist')
                    .click();

                cy.get('[data-testid="dlor-panel-validity-indicator-2"] span')
                    .should('exist')
                    .should('contain', 1); // panel invalidity count present

                cy.get('[data-testid="dlor-admin-form-new-file-type"]')
                    .should('exist')
                    .type('docx');

                cy.get('[data-testid="dlor-panel-validity-indicator-2"]').should('not.exist'); // panel invalidity count no longer present

                TypeCKEditor('word');

                // go to the fourth panel, Filtering
                cy.get('[data-testid="dlor-form-next-button"]')
                    .should('exist')
                    .click();

                // open the notification lightbox, type something and then uncheck the notify checkbox
                // should then not send text
                cy.get('[data-testid="choose-notify"] input')
                    .should('exist')
                    .check();

                // the lightbox opens
                cy.waitUntil(() =>
                    cy
                        .get('[data-testid="notify-lightbox-title"]')
                        .should('exist')
                        .should('be.visible'),
                );
                cy.get('[data-testid="notify-lightbox-title"]').contains('Object change notification');

                TypeCKEditor('the words that will go in the email');

                cy.get('[data-testid="notify-lightbox-close-button"]')
                    .should('exist')
                    .contains('Close')
                    .click();

                // check the edit button reopens the lightbox
                cy.get('[data-testid="notify-reedit-button"]')
                    .should('exist')
                    .contains('Edit')
                    .click();
                // the lightbox is open
                cy.waitUntil(() =>
                    cy
                        .get('[data-testid="notify-lightbox-title"]')
                        .should('exist')
                        .should('be.visible'),
                );
                cy.get('[data-testid="notify-lightbox-title"]').contains('Object change notification');
                cy.get('[data-testid="notify-lightbox-modal"]')
                    .should('exist')
                    .contains('the words that will go in the email');

                // close the box again
                cy.get('[data-testid="notify-lightbox-close-button"]')
                    .should('exist')
                    .click();

                cy.get('[data-testid="choose-notify"] input')
                    .should('exist')
                    .should('be.checked')
                    .uncheck();
                cy.get('[data-testid="notify-reedit-button"]').should('not.exist');

                // if we clicked save now, it would not send a notify message and thus wouldnt notify
                // but lets confirm that the form holds the previously entered text first
                // recheck notify, lightbox opens with previous text
                cy.get('[data-testid="choose-notify"] input')
                    .should('exist')
                    .click()
                    // .should('not.be.checked')
                    .check();
                cy.waitUntil(() =>
                    cy
                        .get('[data-testid="notify-lightbox-title"]')
                        .should('exist')
                        .should('be.visible'),
                );
                cy.get('[data-testid="notify-lightbox-title"]').contains('Object change notification');
                cy.get('[data-testid="notify-lightbox-modal"]')
                    .should('exist')
                    .contains('the words that will go in the email');
                cy.get('[data-testid="notify-lightbox-close-button"]')
                    .should('exist')
                    .click();

                // uncheck, we want to check it doesnt send
                cy.get('[data-testid="choose-notify"] input')
                    .should('exist')
                    .should('be.checked')
                    .uncheck();

                // save record
                cy.get('[data-testid="admin-dlor-save-button-submit"]')
                    .should('exist')
                    .should('not.be.disabled')
                    .click();

                // confirm save happened
                cy.waitUntil(() => cy.get('[data-testid="cancel-dlor-save-outcome"]').should('exist'));
                cy.get('[data-testid="dialogbox-dlor-save-outcome"] h2').contains('Changes have been saved');
                cy.get('[data-testid="confirm-dlor-save-outcome"]')
                    .should('exist')
                    .contains('Return to list page');
                cy.get('[data-testid="cancel-dlor-save-outcome"]')
                    .should('exist')
                    .contains('Re-edit Object');

                // check the data we pretended to send to the server matches what we expect
                // acts as check of what we sent to api
                const expectedValues = {
                    object_title: 'Accessibility - Digital Essentials (has Youtube link)',
                    object_description:
                        '<p>Understanding the importance of accessibility online and creating accessible content with a longer first line. Ramble a little.</p>' +
                        '<p>and a second line of detail in the description</p>',
                    object_summary:
                        'Understanding the importance of accessibility online and creating accessible content.',
                    object_link_interaction_type: 'view',
                    object_link_file_type: 'docx',
                    object_link_size: 2864,
                    object_link_url: 'https://www.youtube.com/watch?v=jwKH6X3cGMg',
                    object_download_instructions: '<p>word</p>',
                    object_is_featured: 0,
                    object_cultural_advice: 0,
                    object_publishing_user: 'uqldegro',
                    object_review_date_next: '2025-03-26T00:01',
                    object_status: 'current',
                    object_owning_team_id: 1,
                    facets: [
                        3, // Topic : Digital skills
                        11, // Graduate attributes : Connected citizens
                        14, // Graduate attributes : Influential communicators
                        18, // Item type : Module
                        30, // Media format : Video
                        34, // Subject : Cross-disciplinary
                        45, // Licence : CC BY-NC Attribution NonCommercial
                    ],
                    object_keywords: ['cat', 'dog'],
                    team_email: 'dlor@library.uq.edu.au',
                    team_manager: 'John Smith',
                    team_name: 'LIB DX Digital Content',
                    notificationText: '',
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

                // confirm save happened
                cy.waitUntil(() => cy.get('[data-testid="cancel-dlor-save-outcome"]').should('exist'));
                cy.get('[data-testid="dialogbox-dlor-save-outcome"] h2').contains('Changes have been saved');
                cy.get('[data-testid="confirm-dlor-save-outcome"]')
                    .should('exist')
                    .contains('Return to list page');
                cy.get('[data-testid="cancel-dlor-save-outcome"]')
                    .should('exist')
                    .contains('Re-edit Object');

                // now clear the form to re-edit
                cy.get('[data-testid="cancel-dlor-save-outcome"]')
                    .should('contain', 'Re-edit Object')
                    .click();
                cy.waitUntil(() => cy.get('[data-testid="object-publishing-user"] input').should('exist'));
                cy.get('[data-testid="dlor-form-next-button"]')
                    .should('exist')
                    .click();

                cy.get('[data-testid="dlor-detailpage-sitelabel"]')
                    .should('exist')
                    .should('contain', 'Edit object: Accessibility - Digital Essentials (has Youtube link)');
            });
        });
        context('fails correctly', () => {
            it('404 page return correctly', () => {
                cy.visit(`http://localhost:2020/admin/dlor/edit/object_404?user=${DLOR_ADMIN_USER}`);
                cy.waitUntil(() => cy.get('[data-testid="dlor-form-error"]').should('exist'));
                cy.get('[data-testid="dlor-form-error"]').contains('The requested page could not be found.');
            });
            it('admin gets an error on a failed save', () => {
                cy.visit(
                    `http://localhost:2020/admin/dlor/edit/98s0_dy5k3_98h4?user=${DLOR_ADMIN_USER}&responseType=saveError`,
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
                    'Request failed with status code 400',
                );
                cy.get('[data-testid="confirm-dlor-save-outcome"]')
                    .should('exist')
                    .contains('Return to list page');
                cy.get('[data-testid="cancel-dlor-save-outcome"]')
                    .should('exist')
                    .contains('Re-edit Object');
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
            cy.visit(`http://localhost:2020/admin/dlor/edit/98s0_dy5k3_98h4?user=${DLOR_ADMIN_USER}`);
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').should('contain', 'Digital Learning Hub - Edit Object');
        });
    });
});
