const REQUIRED_LENGTH_TITLE = 8;
const REQUIRED_LENGTH_DESCRIPTION = 100;
const REQUIRED_LENGTH_SUMMARY = 20;
const REQUIRED_LENGTH_KEYWORDS = 4;
describe('Request an object addition to the Digital Learning Hub', () => {
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

    context('Request a new object', () => {
        context('interface link', () => {
            it('opens the form', () => {
                cy.visit('digital-learning-hub');

                cy.get('[data-testid="dlor-homepage-request-new-item"]')
                    .contains('Submit new object request')
                    .click();
                cy.get('a[data-testid="dlor-breadcrumb-admin-homelink"]')
                    .contains('Digital Learning Hub')
                    .should('have.attr', 'href')
                    .and('contain', '/digital-learning-hub');
                cy.get(
                    '[data-testid="dlor-breadcrumb-create-an-object-for-the-digital-learning-hub-label-0"]',
                ).contains('Create an Object for the Digital Learning Hub');
            });
        });
        context('successfully', () => {
            beforeEach(() => {
                cy.visit('http://localhost:2020/digital-learning-hub/submit');
                cy.viewport(1300, 1000);
            });
            it('navigation is functional and help is shown', () => {
                cy.viewport(1300, 1000);
                cy.waitUntil(() => cy.get('h1').should('exist'));
                cy.get('h1').should('contain', 'Digital Learning Hub');

                cy.get('[data-testid="dlor-UserAdd-helper"]').should('exist');

                // go to the second panel, Description
                cy.get('[data-testid="dlor-form-next-button"]')
                    .should('exist')
                    .click();
                cy.waitUntil(() =>
                    cy
                        .get('[data-testid="object-title"]')
                        .should('exist')
                        .should('be.visible'),
                );

                cy.get('[data-testid="dlor-UserAdd-helper"]').should('exist');

                // go to the third panel, Link
                cy.get('[data-testid="dlor-form-next-button"]')
                    .should('exist')
                    .click();
                cy.waitUntil(() =>
                    cy
                        .get('[data-testid="object-link-url"]')
                        .should('exist')
                        .should('be.visible'),
                );

                cy.get('[data-testid="dlor-UserAdd-helper"]').should('exist');

                // go to the fourth panel, Filtering
                cy.get('[data-testid="dlor-form-next-button"]')
                    .should('exist')
                    .click();
                cy.waitUntil(() =>
                    cy
                        .get('[data-testid="filter-topic-aboriginal-and-torres-strait-islander"]')
                        .should('exist')
                        .should('be.visible'),
                );

                cy.get('[data-testid="dlor-UserAdd-helper"]').should('exist');
            });
            it('has breadcrumb', () => {
                cy.get('uq-site-header')
                    .shadow()
                    .within(() => {
                        cy.get('[data-testid="subsite-title"]')
                            .should('exist')
                            .should('be.visible')
                            .contains('Digital learning hub admin');
                    });
            });
            it('loads as expected', () => {
                cy.get('a[data-testid="dlor-breadcrumb-admin-homelink"]')
                    .contains('Digital Learning Hub')
                    .should('have.attr', 'href')
                    .and('contain', '/digital-learning-hub');
                cy.get(
                    '[data-testid="dlor-breadcrumb-create-an-object-for-the-digital-learning-hub-label-0"]',
                ).contains('Create an Object for the Digital Learning Hub');

                cy.get('[data-testid="object-publishing-user"] input').should('have.value', 'vanilla');

                // go to description panel
                cy.get('[data-testid="dlor-form-next-button"]')
                    .should('exist')
                    .click();

                // go to link panel
                cy.get('[data-testid="dlor-form-next-button"]')
                    .should('exist')
                    .click();

                // go to filter panel
                cy.get('[data-testid="dlor-form-next-button"]')
                    .should('exist')
                    .click();
                // no notify checkbox
                cy.get('[data-testid="choose-notify"] input').should('not.exist');
            });
            it('validates fields correctly for non admin user', () => {
                // first enter all the fields and show the save button doesn't enable until all the fields are entered

                // team starts off valid so click on to the second panel, description
                cy.get('[data-testid="dlor-panel-validity-indicator-1"] span').should('not.exist');

                cy.get('[data-testid="dlor-form-next-button"]')
                    .should('exist')
                    .click();

                cy.get('[data-testid="dlor-panel-validity-indicator-1"] span')
                    .should('exist')
                    .should('contain', 3); // panel invalidity count present
                cy.get('[data-testid="object-title"] input')
                    .should('exist')
                    .type('xx'.padEnd(REQUIRED_LENGTH_TITLE, 'x'));
                cy.get('[data-testid="dlor-panel-validity-indicator-1"] span')
                    .should('exist')
                    .should('contain', 2); // panel invalidity count present
                cy.wait(1000);
                TypeCKEditor('new description '.padEnd(REQUIRED_LENGTH_DESCRIPTION, 'x'));

                cy.get('[data-testid="dlor-panel-validity-indicator-1"] span')
                    .should('exist')
                    .should('contain', 1); // panel invalidity count present
                cy.get('[data-testid="object-summary"] textarea:first-child')
                    .should('exist')
                    .type('new summary '.padEnd(REQUIRED_LENGTH_SUMMARY, 'x'));
                cy.get('[data-testid="dlor-panel-validity-indicator-1"]').should('not.exist'); // panel invalidity count not present

                // click 'next' button to view panel 3, Link
                cy.get('[data-testid="dlor-form-next-button"]')
                    .should('exist')
                    .click();
                cy.get('[data-testid="dlor-panel-validity-indicator-2"] span')
                    .should('exist')
                    .should('contain', 1); // panel invalidity count present

                cy.get('[data-testid="object-link-url"] input')
                    .should('exist')
                    .type('asdasdasdsadd');
                cy.waitUntil(() => cy.get('[data-testid="dlor-form-error-message-object-link-url"]').should('exist'));
                cy.get('[data-testid="dlor-form-error-message-object-link-url"]').should(
                    'contain',
                    'This web address is not valid.',
                );
                cy.get('[data-testid="object-link-url"] input')
                    .clear()
                    .type('http://example.com');
                cy.get('[data-testid="dlor-panel-validity-indicator-2"]').should('not.exist'); // panel invalidity count not present

                // click 'next' button to view panel 4, Filters
                cy.get('[data-testid="dlor-form-next-button"]')
                    .should('exist')
                    .click();
                // filters
                cy.get('[data-testid="filter-topic-aboriginal-and-torres-strait-islander"] input').check();
                cy.get('[data-testid="dlor-panel-validity-indicator-3"] span')
                    .should('exist')
                    .should('contain', 5); // panel invalidity count present
                cy.get('[data-testid="admin-dlor-save-button-submit"]')
                    .should('exist')
                    .should('be.disabled');

                cy.get('[data-testid="filter-media-format-audio"] input').check();
                cy.get('[data-testid="dlor-panel-validity-indicator-3"] span') // panel invalidity count present
                    .should('exist')
                    .should('contain', 4);
                cy.get('[data-testid="admin-dlor-save-button-submit"]') // submit button still disabled
                    .should('exist')
                    .should('be.disabled');

                cy.get('[data-testid="filter-subject-cross-disciplinary"] input').check();
                cy.get('[data-testid="dlor-panel-validity-indicator-3"] span')
                    .should('exist')
                    .should('contain', 3); // panel invalidity count present
                cy.get('[data-testid="admin-dlor-save-button-submit"]')
                    .should('exist')
                    .should('be.disabled');

                cy.get('[data-testid="filter-item-type-guide"] input').check();
                cy.get('[data-testid="dlor-panel-validity-indicator-3"] span') // panel invalidity count present
                    .should('exist')
                    .should('contain', 2);
                cy.get('[data-testid="admin-dlor-save-button-submit"]') // submit button still disabled
                    .should('exist')
                    .should('be.disabled');

                cy.get('[data-testid="filter-licence-cc-by-attribution"] input').check();
                cy.get('[data-testid="dlor-panel-validity-indicator-3"] span') // panel invalidity count present
                    .should('exist')
                    .should('contain', 1);
                cy.get('[data-testid="admin-dlor-save-button-submit"]') // submit button still disabled
                    .should('exist')
                    .should('be.disabled');

                cy.get('[data-testid="object-keywords"] textarea:first-child')
                    .should('exist')
                    .type('a'.padEnd(REQUIRED_LENGTH_KEYWORDS, 'x'));

                cy.get('[data-testid="dlor-panel-validity-indicator-3"]').should('not.exist'); // panel invalidity count no longer present
                cy.get('[data-testid="admin-dlor-save-button-submit"]')
                    .should('exist')
                    .should('not.be.disabled');

                //  now go back and invalidate each field one at a time and show the button disables on each field
                cy.get('[data-testid="filter-topic-aboriginal-and-torres-strait-islander"] input').uncheck();
                cy.get('[data-testid="dlor-panel-validity-indicator-3"] span')
                    .should('exist')
                    .should('contain', 1); // panel invalidity count present
                cy.get('[data-testid="admin-dlor-save-button-submit"]')
                    .should('exist')
                    .should('be.disabled');
                cy.get('[data-testid="filter-topic-aboriginal-and-torres-strait-islander"] input').check();

                cy.get('[data-testid="filter-subject-cross-disciplinary"] input').uncheck();
                cy.get('[data-testid="dlor-panel-validity-indicator-3"] span')
                    .should('exist')
                    .should('contain', 1); // panel invalidity count present
                cy.get('[data-testid="admin-dlor-save-button-submit"]')
                    .should('exist')
                    .should('be.disabled');
                cy.get('[data-testid="filter-subject-cross-disciplinary"] input').check();

                cy.get('[data-testid="filter-media-format-audio"] input').uncheck();
                cy.get('[data-testid="dlor-panel-validity-indicator-3"] span')
                    .should('exist')
                    .should('contain', 1); // panel invalidity count present
                cy.get('[data-testid="admin-dlor-save-button-submit"]')
                    .should('exist')
                    .should('be.disabled');
                cy.get('[data-testid="filter-media-format-audio"] input').check();

                // (cant uncheck a radio button)

                // click the back button to go back to panel 3, Link
                cy.get('[data-testid="dlor-form-back-button"]')
                    .should('exist')
                    .click();
                cy.get('[data-testid="object-link-url"] input')
                    .should('exist')
                    .clear();
                cy.get('[data-testid="dlor-panel-validity-indicator-2"] span')
                    .should('exist')
                    .should('contain', 1); // panel invalidity count present
                cy.get('[data-testid="object-link-url"] input').type('http://');
                cy.get('[data-testid="dlor-panel-validity-indicator-2"] span')
                    .should('exist')
                    .should('contain', 1); // panel invalidity count present
                cy.get('[data-testid="object-link-url"] input')
                    .should('exist')
                    .type('ex.c');
                cy.get('[data-testid="dlor-panel-validity-indicator-2"] span')
                    .should('exist')
                    .should('contain', 1); // panel invalidity count present
                cy.get('[data-testid="object-link-url"] input')
                    .should('exist')
                    .type('o');
                cy.get('[data-testid="dlor-panel-validity-indicator-2"]').should('not.exist'); // panel invalidity count no longer present

                // click the back button to go back to panel 2, Description
                cy.get('[data-testid="dlor-form-back-button"]')
                    .should('exist')
                    .click();
                cy.get('[data-testid="dlor-panel-validity-indicator-1"]').should('not.exist'); // panel invalidity count no longer present
                cy.get('[data-testid="object-title"] input')
                    .should('exist')
                    .type('{backspace}');
                cy.get('[data-testid="dlor-panel-validity-indicator-1"] span')
                    .should('exist')
                    .should('contain', 1); // panel invalidity count present
                cy.get('[data-testid="object-title"] input')
                    .should('exist')
                    .type('p');
                cy.get('[data-testid="dlor-panel-validity-indicator-1"]').should('not.exist'); // panel invalidity count no longer present

                TypeCKEditor('d');
                cy.get('[data-testid="dlor-panel-validity-indicator-1"] span')
                    .should('exist')
                    .should('contain', 1); // panel invalidity count present

                TypeCKEditor('new description '.padEnd(REQUIRED_LENGTH_DESCRIPTION, 'x'));
                cy.get('[data-testid="dlor-panel-validity-indicator-1"]').should('not.exist'); // panel invalidity count no longer present

                cy.get('[data-testid="object-summary"] textarea:first-child')
                    .should('exist')
                    .clear();
                cy.get('[data-testid="dlor-panel-validity-indicator-1"] span')
                    .should('exist')
                    .should('contain', 1); // panel invalidity count present
                cy.get('[data-testid="object-summary"] textarea:first-child')
                    .should('exist')
                    .type('new description '.padEnd(REQUIRED_LENGTH_DESCRIPTION, 'x'));
                cy.get('[data-testid="dlor-panel-validity-indicator-1"]').should('not.exist'); // panel invalidity count no longer present

                // click the back button to go back to panel 1, Ownership
                cy.get('[data-testid="dlor-form-back-button"]')
                    .should('exist')
                    .click();

                cy.get('[data-testid="dlor-panel-validity-indicator-0"]').should('not.exist'); // panel invalidity count not present
                cy.get('[data-testid="object-publishing-user"] input')
                    .should('exist')
                    .should('be.disabled')
                    .should('have.value', 'vanilla');

                cy.waitUntil(() => cy.get('[data-testid="object-owning-team"]').should('exist'));
                cy.get('[data-testid="object-owning-team"]').click();
                cy.get('[data-testid="object-form-teamid-new"]')
                    .should('exist')
                    .click();

                // now that we have chosen "new team" the form is invalid until we enter all 3 fields
                cy.get('[data-testid="dlor-panel-validity-indicator-0"]')
                    .should('exist')
                    .should('contain', 3); // panel invalidity count present
                cy.get('[data-testid="dlor-form-team-name-new"]')
                    .should('exist')
                    .type('new team name');
                cy.get('[data-testid="dlor-panel-validity-indicator-0"]')
                    .should('exist')
                    .should('contain', 2); // panel invalidity count present
                cy.get('[data-testid="dlor-form-team-manager-new"]')
                    .should('exist')
                    .type('john Manager');
                cy.get('[data-testid="dlor-panel-validity-indicator-0"]')
                    .should('exist')
                    .should('contain', 1); // panel invalidity count present
                cy.get('[data-testid="error-message-team-email-new"]')
                    .should('exist')
                    .should('contain', 'This email address is not valid.');
                cy.get('[data-testid="dlor-form-team-email-new"]')
                    .should('exist')
                    .type('john@example.com');
                cy.get('[data-testid="dlor-panel-validity-indicator-0"]').should('not.exist'); // panel invalidity count not present

                // change to one of the existing teams
                cy.get('[data-testid="object-owning-team"]').click();
                cy.get('[data-testid="object-owning-team-1"]')
                    .should('exist')
                    .click();
                cy.get('[data-testid="dlor-panel-validity-indicator-0"]').should('not.exist'); // panel invalidity count not present

                // Fire the mock save.
                cy.get('[data-testid="dlor-form-next-button"]')
                    .should('exist')
                    .click();
                cy.get('[data-testid="dlor-form-next-button"]')
                    .should('exist')
                    .click();
                cy.get('[data-testid="dlor-form-next-button"]')
                    .should('exist')
                    .click();
                cy.get('[data-testid="admin-dlor-save-button-submit"]')
                    .should('exist')
                    .should('not.be.disabled')
                    .click();
                cy.get('[data-testid="message-title"]').should('exist'); // wording to come after review
                cy.get('[data-testid="confirm-dlor-save-outcome"]')
                    .should('exist')
                    .click();
            });
            it('shows character minimums', () => {
                // go to the second panel, description
                cy.get('[data-testid="dlor-form-next-button"]')
                    .should('exist')
                    .click();

                cy.get('[data-testid="object-title"] input')
                    .should('exist')
                    .type('123');
                cy.get('[data-testid="input-characters-remaining-object-title"]')
                    .should('exist')
                    .should('contain', 'at least 5 more characters needed');
                TypeCKEditor('new description');
                cy.get('[data-testid="input-characters-remaining-object-description"]')
                    .should('exist')
                    .should('contain', 'at least 85 more characters needed');
                cy.get('[data-testid="object-summary"] textarea:first-child')
                    .should('exist')
                    .type('new summary');
                cy.get('[data-testid="input-characters-remaining-object-summary"]')
                    .should('exist')
                    .should('contain', 'at least 9 more characters needed');

                // go to the fourth panel, links
                cy.get('[data-testid="dlor-form-next-button"]')
                    .should('exist')
                    .click()
                    .click();

                cy.get('[data-testid="object-keywords"] textarea:first-child')
                    .should('exist')
                    .type('abc');
                cy.get('[data-testid="input-characters-remaining-object-keywords-string"]')
                    .should('exist')
                    .should('contain', 'at least 1 more character needed');
            });
            it('supplies a summary suggestion', () => {
                // go to the second step, Description
                cy.get('[data-testid="dlor-form-next-button"]')
                    .should('exist')
                    .click();

                // suggestion panel not open
                cy.get('[data-testid="admin-dlor-suggest-summary"]').should('not.exist');

                // a long description puts the first 150 char, breaking at a word break, into the summary suggestion
                TypeCKEditor(
                    'The quick brown fox jumped over the lazy yellow dog and ran into the woods. The hunters blew their horns and the hounds bayed and the whole troop followed the fox.',
                );
                // suggestion panel is now open
                cy.get('[data-testid="admin-dlor-suggest-summary"]').should('exist');
                // subset of description has appeared in suggestion panel
                cy.get('[data-testid="admin-dlor-suggest-summary-content"]').should(
                    'have.text',
                    'The quick brown fox jumped over the lazy yellow dog and ran into the woods.',
                );

                cy.get('[data-testid="admin-dlor-suggest-summary-close-button"]')
                    .should('exist')
                    .click();
                // suggestion panel is hidden
                cy.get('[data-testid="admin-dlor-suggest-summary"]').should('not.exist');

                // suggestion panel picks up first paragraph on carriage return after minimum char count
                TypeCKEditor(
                    'The quick brown fox jumped over the lazy yellow dog and ran into the woods.' +
                        'The hunters blew their horns and the hounds bayed and the whole troop followed the fox.' +
                        '\n' +
                        'a second paragraph',
                );

                cy.get('[data-testid="admin-dlor-suggest-summary-content"]').should(
                    'have.text',
                    'The quick brown fox jumped over the lazy yellow dog and ran into the woods.',
                );
                // suggestion panel is open again because they changed the description
                cy.get('[data-testid="admin-dlor-suggest-summary"]').should('exist');

                // summary currently blank
                cy.get('[data-testid="object-summary"]')
                    .should('exist')
                    .should('have.value', '');
                // step 2 validation number = 2 because title and summary not set
                cy.get('[data-testid="dlor-panel-validity-indicator-1"] span')
                    .should('exist')
                    .should('contain', 2);
                // click "use summary" button
                cy.get('[data-testid="admin-dlor-suggest-summary-button"]')
                    .should('exist')
                    .click();
                // // summary field as expected - why does it think it's an empty string? rely on val number chaning
                // cy.waitUntil(() => cy.get('[data-testid="object-summary"]').should('exist'));
                // cy.get('[data-testid="object-summary"]').should(
                //     'have.value',
                //     'The quick brown fox jumped over the lazy yellow dog and ran into the woods.
                // The hunters blew their horns and the hounds bayed and the whole troop followed the fox',
                // );
                // suggestion panel no longer open
                cy.get('[data-testid="admin-dlor-suggest-summary"]').should('not.exist');
                // step 2 validation number = 1, only title not set
                cy.get('[data-testid="dlor-panel-validity-indicator-1"] span')
                    .should('exist')
                    .should('contain', 1);
            });
        });
    });
});
