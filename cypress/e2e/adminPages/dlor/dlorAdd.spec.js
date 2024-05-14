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

    function TypeCKEditor(content) {
        cy.get('.ck-content')
            .should('exist')
            // .click()
            .type(content);
    }

    const mockDlorAdminUser = 'dloradmn';
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
                cy.get('h1').should('contain', 'Digital learning hub Management');

                cy.checkA11y('[data-testid="StandardPage"]', {
                    reportName: 'dlor form panel 1',
                    scopeName: 'Content',
                    includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
                });

                // go to the second panel, Description
                cy.get('[data-testid="dlor-form-next-button"]')
                    .should('exist')
                    .click();
                cy.waitUntil(() =>
                    cy
                        .get('[data-testid="object_title"]')
                        .should('exist')
                        .should('be.visible'),
                );
                cy.checkA11y('[data-testid="StandardPage"]', {
                    reportName: 'dlor form panel 2',
                    scopeName: 'Content',
                    includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
                });

                // go to the third panel, Link
                cy.get('[data-testid="dlor-form-next-button"]')
                    .should('exist')
                    .click();
                cy.waitUntil(() =>
                    cy
                        .get('[data-testid="object_link_url"]')
                        .should('exist')
                        .should('be.visible'),
                );
                cy.checkA11y('[data-testid="StandardPage"]', {
                    reportName: 'dlor form panel 3',
                    scopeName: 'Content',
                    includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
                });

                // go to the fourth panel, Filtering
                cy.get('[data-testid="dlor-form-next-button"]')
                    .should('exist')
                    .click();
                cy.waitUntil(() =>
                    cy
                        .get('[data-testid="filter-1"]')
                        .should('exist')
                        .should('be.visible'),
                );
                cy.checkA11y('[data-testid="StandardPage"]', {
                    reportName: 'dlor form panel 4',
                    scopeName: 'Content',
                    includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
                });
            });
            it('validates fields correctly', () => {
                // first enter all the fields and show the save button doesnt enable until all the fields are entered

                // team starts off valid so click on to the second panel, description
                cy.get('[data-testid="dlor-form-next-button"]')
                    .should('exist')
                    .click();

                cy.get('[data-testid="dlor-panel-validity-indicator-1"] span')
                    .should('exist')
                    .should('contain', 3); // panel invalidity count present
                cy.get('[data-testid="object_title"] input')
                    .should('exist')
                    .type('xx'.padEnd(REQUIRED_LENGTH_TITLE, 'x'));
                cy.get('[data-testid="dlor-panel-validity-indicator-1"] span')
                    .should('exist')
                    .should('contain', 2); // panel invalidity count present
                cy.wait(1000);
                TypeCKEditor('new description '.padEnd(REQUIRED_LENGTH_DESCRIPTION, 'x'));
                // cy.get('.ck-content')
                //     .should('exist')
                //     // .click()
                //     .type('new description '.padEnd(REQUIRED_LENGTH_DESCRIPTION, 'x'));

                cy.get('[data-testid="dlor-panel-validity-indicator-1"] span')
                    .should('exist')
                    .should('contain', 1); // panel invalidity count present
                cy.get('[data-testid="object_summary"] textarea:first-child')
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
                // cy.waitUntil(() => cy.get('[data-testid="error-message-object_link_url"]').should('not.exist'));
                cy.get('[data-testid="dlor-panel-validity-indicator-2"]').should('not.exist'); // panel invalidity count not present

                // click 'next' button to view panel 4, Filters
                cy.get('[data-testid="dlor-form-next-button"]')
                    .should('exist')
                    .click();
                // filters
                cy.get('[data-testid="filter-1"] input').check(); // aboriginal_and_torres_strait_islander
                cy.get('[data-testid="dlor-panel-validity-indicator-3"] span')
                    .should('exist')
                    .should('contain', 5); // panel invalidity count present
                cy.get('[data-testid="admin-dlor-save-button-submit"]')
                    .should('exist')
                    .should('be.disabled');

                cy.get('[data-testid="filter-22"] input').check(); // choose a "media format" checkbox
                cy.get('[data-testid="dlor-panel-validity-indicator-3"] span') // panel invalidity count present
                    .should('exist')
                    .should('contain', 4);
                cy.get('[data-testid="admin-dlor-save-button-submit"]') // submit button still disabled
                    .should('exist')
                    .should('be.disabled');

                cy.get('[data-testid="filter-34"] input').check(); // all_cross_disciplinary
                cy.get('[data-testid="dlor-panel-validity-indicator-3"] span')
                    .should('exist')
                    .should('contain', 3); // panel invalidity count present
                cy.get('[data-testid="admin-dlor-save-button-submit"]')
                    .should('exist')
                    .should('be.disabled');

                cy.get('[data-testid="filter-16"] input').check(); // choose an "item type" radio button (type guide)
                cy.get('[data-testid="dlor-panel-validity-indicator-3"] span') // panel invalidity count present
                    .should('exist')
                    .should('contain', 2);
                cy.get('[data-testid="admin-dlor-save-button-submit"]') // submit button still disabled
                    .should('exist')
                    .should('be.disabled');

                cy.get('[data-testid="filter-44"] input').check(); // choose a "licence" radio button (choose cc_by_attribution)
                cy.get('[data-testid="dlor-panel-validity-indicator-3"] span') // panel invalidity count present
                    .should('exist')
                    .should('contain', 1);
                cy.get('[data-testid="admin-dlor-save-button-submit"]') // submit button still disabled
                    .should('exist')
                    .should('be.disabled');

                cy.get('[data-testid="object_keywords"] textarea:first-child')
                    .should('exist')
                    .type('a'.padEnd(REQUIRED_LENGTH_KEYWORDS, 'x'));

                cy.get('[data-testid="dlor-panel-validity-indicator-3"]').should('not.exist'); // panel invalidity count no longer present
                cy.get('[data-testid="admin-dlor-save-button-submit"]')
                    .should('exist')
                    .should('not.be.disabled');

                //  now go back and invalidate each field one at a time and show the button disables on each field
                cy.get('[data-testid="filter-1"] input').uncheck(); // aboriginal_and_torres_strait_islander
                cy.get('[data-testid="dlor-panel-validity-indicator-3"] span')
                    .should('exist')
                    .should('contain', 1); // panel invalidity count present
                cy.get('[data-testid="admin-dlor-save-button-submit"]')
                    .should('exist')
                    .should('be.disabled');
                cy.get('[data-testid="filter-1"] input').check(); // aboriginal_and_torres_strait_islander

                cy.get('[data-testid="filter-34"] input').uncheck(); // all_cross_disciplinary
                cy.get('[data-testid="dlor-panel-validity-indicator-3"] span')
                    .should('exist')
                    .should('contain', 1); // panel invalidity count present
                cy.get('[data-testid="admin-dlor-save-button-submit"]')
                    .should('exist')
                    .should('be.disabled');
                cy.get('[data-testid="filter-34"] input').check(); // all_cross_disciplinary

                cy.get('[data-testid="filter-22"] input').uncheck(); // media_audio
                cy.get('[data-testid="dlor-panel-validity-indicator-3"] span')
                    .should('exist')
                    .should('contain', 1); // panel invalidity count present
                cy.get('[data-testid="admin-dlor-save-button-submit"]')
                    .should('exist')
                    .should('be.disabled');
                cy.get('[data-testid="filter-22"] input').check(); // media_audio

                // (cant uncheck a radio button)

                // click the back button to go back to panel 3, Link
                cy.get('[data-testid="dlor-form-back-button"]')
                    .should('exist')
                    .click();
                cy.get('[data-testid="object_link_url"] input')
                    .should('exist')
                    .clear();
                cy.get('[data-testid="dlor-panel-validity-indicator-2"] span')
                    .should('exist')
                    .should('contain', 1); // panel invalidity count present
                cy.get('[data-testid="object_link_url"] input').type('http://');
                cy.get('[data-testid="dlor-panel-validity-indicator-2"] span')
                    .should('exist')
                    .should('contain', 1); // panel invalidity count present
                cy.get('[data-testid="object_link_url"] input')
                    .should('exist')
                    .type('ex.c');
                cy.get('[data-testid="dlor-panel-validity-indicator-2"] span')
                    .should('exist')
                    .should('contain', 1); // panel invalidity count present
                cy.get('[data-testid="object_link_url"] input')
                    .should('exist')
                    .type('o');
                cy.get('[data-testid="dlor-panel-validity-indicator-2"]').should('not.exist'); // panel invalidity count no longer present

                // click the back button to go back to panel 2, Description
                cy.get('[data-testid="dlor-form-back-button"]')
                    .should('exist')
                    .click();
                cy.get('[data-testid="dlor-panel-validity-indicator-1"]').should('not.exist'); // panel invalidity count no longer present
                cy.get('[data-testid="object_title"] input')
                    .should('exist')
                    .type('{backspace}');
                cy.get('[data-testid="dlor-panel-validity-indicator-1"] span')
                    .should('exist')
                    .should('contain', 1); // panel invalidity count present
                cy.get('[data-testid="object_title"] input')
                    .should('exist')
                    .type('p');
                cy.get('[data-testid="dlor-panel-validity-indicator-1"]').should('not.exist'); // panel invalidity count no longer present

                // cy.get('.ck-content')
                //     .should('exist')
                //     // .click()
                //     .type('{backspace}');
                TypeCKEditor('{backspace}');

                cy.get('[data-testid="dlor-panel-validity-indicator-1"] span')
                    .should('exist')
                    .should('contain', 1); // panel invalidity count present
                // cy.get('.ck-content')
                //     .should('exist')
                //     // .click()
                //     .type('{p}');
                TypeCKEditor('{p}');
                cy.get('[data-testid="dlor-panel-validity-indicator-1"]').should('not.exist'); // panel invalidity count no longer present

                cy.get('[data-testid="object_summary"] textarea:first-child')
                    .should('exist')
                    .type('{backspace}');
                cy.get('[data-testid="dlor-panel-validity-indicator-1"] span')
                    .should('exist')
                    .should('contain', 1); // panel invalidity count present
                cy.get('[data-testid="object_summary"] textarea:first-child')
                    .should('exist')
                    .type('p');
                cy.get('[data-testid="dlor-panel-validity-indicator-1"]').should('not.exist'); // panel invalidity count no longer present

                // click the back button to go back to panel 1, Ownership
                cy.get('[data-testid="dlor-form-back-button"]')
                    .should('exist')
                    .click();

                cy.get('[data-testid="dlor-panel-validity-indicator-0"]').should('not.exist'); // panel invalidity count not present
                cy.get('[data-testid="object_publishing_user"] input')
                    .should('exist')
                    .type('{backspace}')
                    .type('{backspace}')
                    .type('{backspace}')
                    .type('{backspace}')
                    .type('{backspace}'); // username no longer long enough
                cy.get('[data-testid="error-message-object_publishing_user"]')
                    .should('exist')
                    .should('contain', 'This username is not valid.');
                cy.get('[data-testid="dlor-panel-validity-indicator-0"]')
                    .should('exist')
                    .should('contain', 1); // panel invalidity count present
                cy.get('[data-testid="object_publishing_user"] input')
                    .should('exist')
                    .type('p');
                cy.get('[data-testid="dlor-panel-validity-indicator-0"]').should('not.exist'); // panel invalidity count not present
                cy.get('[data-testid="error-message-object_publishing_user"]').should('not.exist');

                cy.waitUntil(() => cy.get('[data-testid="object_owning_team"]').should('exist'));
                cy.get('[data-testid="object_owning_team"]').click();
                cy.get('[data-testid="object-form-teamid-new"]')
                    .should('exist')
                    .click();

                // now that we have chosen "new team" the form is invalid until we enter all 3 fields
                cy.get('[data-testid="dlor-panel-validity-indicator-0"]')
                    .should('exist')
                    .should('contain', 3); // panel invalidity count present
                cy.get('[data-testid="team_name"]')
                    .should('exist')
                    .type('new team name');
                cy.get('[data-testid="dlor-panel-validity-indicator-0"]')
                    .should('exist')
                    .should('contain', 2); // panel invalidity count present
                cy.get('[data-testid="team_manager"]')
                    .should('exist')
                    .type('john Manager');
                cy.get('[data-testid="dlor-panel-validity-indicator-0"]')
                    .should('exist')
                    .should('contain', 1); // panel invalidity count present
                cy.get('[data-testid="error-message-team_email"]')
                    .should('exist')
                    .should('contain', 'This email address is not valid.');
                cy.get('[data-testid="team_email"]')
                    .should('exist')
                    .type('john@example.com');
                cy.get('[data-testid="dlor-panel-validity-indicator-0"]').should('not.exist'); // panel invalidity count not present
            });
            it('shows character minimums', () => {
                // go to the second panel, description
                cy.get('[data-testid="dlor-form-next-button"]')
                    .should('exist')
                    .click();

                cy.get('[data-testid="object_title"] input')
                    .should('exist')
                    .type('123');
                cy.get('[data-testid="input-characters-remaining-object_title"]')
                    .should('exist')
                    .should('contain', 'at least 5 more characters needed');
                // cy.get('[data-testid="object_description"] textarea:first-child')
                //     .should('exist')
                //     .type('new description');
                TypeCKEditor('new description');
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
                cy.get('[data-testid="dlor-form-next-button"]')
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
            it('supplies a summary suggestion', () => {
                // go to the second step, Description
                cy.get('[data-testid="dlor-form-next-button"]')
                    .should('exist')
                    .click();

                // suggestion panel not open
                cy.get('[data-testid="admin-dlor-suggest-summary"]').should('not.exist');

                // a long description puts the first 150 char, breaking at a word break, into the summary suggestion
                // cy.get('[data-testid="object_description"] textarea:first-child')
                //     .should('exist')
                //     .type(
                //         'The quick brown fox jumped over the lazy yellow dog and ran into the woods.
                // The hunters blew their horns and the hounds bayed and the whole troop followed the fox.',
                //     );
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
                // cy.get('[data-testid="object_description"] textarea:first-child')
                //     .clear()
                //     .type(
                //         'The quick brown fox jumped over the lazy yellow dog and ran into the woods.
                // The hunters blew their horns and the hounds bayed and the whole troop followed the fox.' +
                //             '\n' +
                //             'a second paragraph',
                //     );
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
                cy.get('[data-testid="object_summary"]')
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
                // cy.waitUntil(() => cy.get('[data-testid="object_summary"]').should('exist'));
                // cy.get('[data-testid="object_summary"]').should(
                //     'have.value',
                //     'The quick brown fox jumped over the lazy yellow dog and ran into the woods. The hunters blew their horns and the hounds bayed and the whole troop followed the fox',
                // );
                // suggestion panel no longer open
                cy.get('[data-testid="admin-dlor-suggest-summary"]').should('not.exist');
                // step 2 validation number = 1, only title not set
                cy.get('[data-testid="dlor-panel-validity-indicator-1"] span')
                    .should('exist')
                    .should('contain', 1);
            });

            it('shows a "will preview" notice correctly', () => {
                // go to the third step, links
                cy.get('[data-testid="dlor-form-next-button"]')
                    .should('exist')
                    .click();
                cy.get('[data-testid="dlor-form-next-button"]')
                    .should('exist')
                    .click();

                // youtube link in shorthand format
                // a youtube link that they havent yet typed completely doesnt give a message
                // (although hopefully they will paste and wont see this - pasting is more accurate)
                cy.get('[data-testid="object_link_url"] input')
                    .should('exist')
                    .type('http://www.youtube.com/rew');
                cy.get('[data-testid="object_link_url_preview"]').should('not.exist');

                // finish typing to make a valid youtube shorthand url
                cy.get('[data-testid="object_link_url"] input')
                    .should('exist')
                    .type('df');
                // once the youtube link is long enough to maybe be a valid youtube link, show a "will preview" message
                cy.get('[data-testid="object_link_url_preview"]')
                    .should('exist')
                    .contains('A preview will show on the View page.');

                // youtube link that is missing the v= paramater (and isnt a shorthand link)
                cy.get('[data-testid="object_link_url"] input')
                    .should('exist')
                    .clear()
                    .type('http://www.youtube.com/?g=123456'); // 'g' is not a valid parameter name
                cy.get('[data-testid="object_link_url_preview"]').should('not.exist');

                // youtube link that is a valid link with v= parameter
                cy.get('[data-testid="object_link_url"] input')
                    .should('exist')
                    .clear()
                    .type('http://www.youtube.com/?v=123456');
                cy.get('[data-testid="object_link_url_preview"]')
                    .should('exist')
                    .contains('A preview will show on the View page.');

                // a link that won't preview doesn't show the "will preview" message
                cy.get('[data-testid="object_link_url"] input')
                    .should('exist')
                    .clear()
                    .type('http://www.example.com/something');
                cy.get('[data-testid="object_link_url_preview"]').should('not.exist');
            });
        });
        context('successfully mock to db', () => {
            beforeEach(() => {
                cy.setCookie('CYPRESS_TEST_DATA', 'active'); // setup so we can check what we "sent" to the db
                cy.visit(`http://localhost:2020/admin/dlor/add?user=${mockDlorAdminUser}`);
                cy.viewport(1300, 1000);
            });
            it('admin can create a new object for a new team and make it featured and return to list', () => {
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
                    .type('xx'.padEnd(REQUIRED_LENGTH_TITLE, 'x'));
                // cy.get('[data-testid="object_description"] textarea:first-child')
                //     .should('exist')
                //     .type('new description '.padEnd(REQUIRED_LENGTH_DESCRIPTION, 'x'));
                TypeCKEditor('new description'.padEnd(REQUIRED_LENGTH_DESCRIPTION, 'x'));
                cy.get('[data-testid="object_summary"] textarea:first-child')
                    .should('exist')
                    .type('new summary '.padEnd(REQUIRED_LENGTH_SUMMARY, 'x'));

                cy.get('[data-testid="object_is_featured"] input')
                    .should('exist')
                    .should('not.be.checked');
                cy.get('[data-testid="object_is_featured"] input').check();

                // go to the third panel, Link
                cy.get('[data-testid="dlor-form-next-button"]')
                    .should('exist')
                    .click();

                cy.get('[data-testid="object_link_url"] input')
                    .should('exist')
                    .type('http://example.com');

                // accessible link message: a downloadable file that is an XLS of size 36 meg
                cy.get('[data-testid="object_link_interaction_type"]')
                    .should('exist')
                    .contains('No message');

                cy.get('[data-testid="object_link_file_type"]').should('not.exist');
                cy.get('[data-testid="object_link_duration_minutes"]').should('not.exist');
                cy.get('[data-testid="object_link_duration_seconds"]').should('not.exist');
                cy.get('[data-testid="object_link_size_units"]').should('not.exist');
                cy.get('[data-testid="object_link_size_amount"]').should('not.exist');
                cy.get('[data-testid="object_link_interaction_type"]').click();
                cy.get('[data-testid="object_link_interaction_type-download"]')
                    .should('exist')
                    .click();
                cy.get('[data-testid="object_link_file_type"]').should('exist');
                cy.get('[data-testid="object_link_size_amount"]').should('exist');
                cy.get('[data-testid="object_link_size_units"]').should('exist');
                cy.get('[data-testid="object_link_duration_minutes"]').should('not.exist');
                cy.get('[data-testid="object_link_duration_seconds"]').should('not.exist');
                // shows an error because they havent chosen a file type and a file size
                cy.get('[data-testid="dlor-panel-validity-indicator-2"] span')
                    .should('exist')
                    .should('contain', 2); // panel invalidity count present

                // choose file type
                cy.waitUntil(() => cy.get('[data-testid="object_link_file_type"]').should('exist'));
                cy.get('[data-testid="object_link_file_type"]').click();
                cy.get('[data-value="XLS"]')
                    .should('exist')
                    .click();

                cy.get('[data-testid="dlor-panel-validity-indicator-2"] span')
                    .should('exist')
                    .should('contain', 1); // panel invalidity count present

                // enter file size
                cy.get('[data-testid="object_link_size_amount"] input')
                    .should('exist')
                    .type('36');
                cy.waitUntil(() => cy.get('[data-testid="object_link_size_units"]').should('exist'));
                cy.get('[data-testid="object_link_size_units"]').click();
                cy.get('[data-value="MB"]')
                    .should('exist')
                    .click();

                cy.get('[data-testid="dlor-panel-validity-indicator-2"]').should('not.exist'); // panel invalidity count no longer present

                const typeableDownloadInstructions =
                    'Lorem ipsum dolor sit amet. In at sapien vel nisi congue fringilla. Maecenas non lacus dolor. Phasellus ornare condimentum est in cursus. Nam ac felis neque. Nulla at neque a mauris tristique ultrices ac ultrices ex. Suspendisse iaculis fermentum mi, non cursus augue eleifend in. Maecenas ut faucibus est. Phasellus a diam eget mauris feugiat vestibulum.';
                // cy.get('[data-testid="object_download_instructions"] textarea:first-child')
                //     .should('exist')
                //     .type(typeableDownloadInstructions);
                TypeCKEditor(typeableDownloadInstructions);
                // cy.get('[data-testid="dlor-massaged-download-instructions"]')
                //     .should('exist')
                //     .should('contain', 'Lorem ipsum dolor sit amet');
                // cy.get('[data-testid="dlor-massaged-download-instructions"] a')
                //     .should('exist')
                //     .contains('consectetur adipiscing elit')
                //     .should('have.attr', 'href', 'http://example.com');

                // go to the fourth panel, Filtering
                cy.get('[data-testid="dlor-form-next-button"]')
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
                cy.get('[data-testid="admin-dlor-save-button-submit"]')
                    .should('exist')
                    .should('not.be.disabled');

                // save new dlor
                cy.get('[data-testid="admin-dlor-save-button-submit"]')
                    .should('exist')
                    .should('not.be.disabled')
                    .click();

                cy.waitUntil(() => cy.get('[data-testid="cancel-dlor-save-outcome"]').should('exist'));

                // check the data we pretended to send to the server matches what we expect
                // acts as check of what we sent to api
                const expectedValues = {
                    object_title: 'xxxxxxxx',
                    object_description:
                        'new description xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
                    object_summary: 'new summary xxxxxxxx',
                    object_link_file_type: 'XLS',
                    object_link_interaction_type: 'download',
                    object_link_size: '36000',
                    object_link_url: 'http://example.com',
                    object_download_instructions: typeableDownloadInstructions,
                    object_embed_type: 'link',
                    object_is_featured: 1,
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
                    const decodedValue = decodeURIComponent(cookie.value);
                    const sentValues = JSON.parse(decodedValue);
                    expectedValues.object_description =
                        '<p>new descriptionxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</p>';

                    expectedValues.object_download_instructions = '<p>' + typeableDownloadInstructions + '</p>';
                    console.log('sentValues=', sentValues);
                    console.log('expectedValues=', expectedValues);

                    // had trouble comparing the entire structure
                    const sentFacets = sentValues.facets;
                    const expectedFacets = expectedValues.facets;
                    const sentKeywords = sentValues.object_keywords;
                    const expectedKeywords = expectedValues.object_keywords;
                    delete sentValues.facets;
                    delete expectedValues.facets;
                    // delete sentValues.object_description;
                    // delete expectedValues.object_description;
                    delete sentValues.object_keywords;
                    delete expectedValues.object_keywords;
                    delete sentValues.object_review_date_next; // doesn't seem valid to figure out the date
                    delete expectedValues.object_review_date_next;

                    console.log('Comparison', sentValues, expectedValues);

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
            it('admin can create a new object for an existing team and start a fresh form', () => {
                cy.getCookie('CYPRESS_TEST_DATA').then(cookie => {
                    expect(cookie).to.exist;
                    expect(cookie.value).to.equal('active');
                });

                const downloadInstructionText = 'some download instructions';

                // confirm team-changer works
                cy.get('[data-testid="object_owning_team"]')
                    .should('exist')
                    .click();
                cy.get('[data-testid="object_owning_team-2"]')
                    .should('exist')
                    .contains('Lib train Library Corporate Services');
                cy.get('[data-testid="object_owning_team-2"]').click();
                cy.get('[data-testid="dlor-panel-validity-indicator-0"]').should('not.exist'); // panel invalidity count not present

                cy.get('[data-testid="dlor-form-next-button"]')
                    .should('exist')
                    .click();

                cy.get('[data-testid="object_title"] input')
                    .should('exist')
                    .type('x'.padEnd(REQUIRED_LENGTH_TITLE, 'x'));
                // cy.get('[data-testid="object_description"] textarea:first-child')
                //     .should('exist')
                //     .type('new description '.padEnd(REQUIRED_LENGTH_DESCRIPTION, 'x'));
                TypeCKEditor('new description'.padEnd(REQUIRED_LENGTH_DESCRIPTION, 'x'));
                cy.get('[data-testid="object_summary"] textarea:first-child')
                    .should('exist')
                    .type('new summary '.padEnd(REQUIRED_LENGTH_SUMMARY, 'x'));

                // go to the third panel, Link
                cy.get('[data-testid="dlor-form-next-button"]')
                    .should('exist')
                    .click();

                cy.get('[data-testid="object_link_url"] input')
                    .should('exist')
                    .type('http://example.com');

                // accessible link message: save a Viewable file that is a video that is 3min 47 secs long
                cy.get('[data-testid="object_link_interaction_type"]')
                    .should('exist')
                    .contains('No message');
                cy.get('[data-testid="object_link_file_type"]').should('not.exist');
                cy.get('[data-testid="object_link_duration_minutes"]').should('not.exist');
                cy.get('[data-testid="object_link_duration_seconds"]').should('not.exist');
                cy.get('[data-testid="object_link_size_units"]').should('not.exist');
                cy.get('[data-testid="object_link_size_amount"]').should('not.exist');
                cy.get('[data-testid="object_link_interaction_type"]').click();
                cy.get('[data-testid="object_link_interaction_type-view"]')
                    .should('exist')
                    .click();
                cy.get('[data-testid="object_link_file_type"]').should('exist');
                cy.get('[data-testid="object_link_size_amount"]').should('not.exist');
                cy.get('[data-testid="object_link_size_units"]').should('not.exist');
                cy.get('[data-testid="object_link_duration_minutes"]').should('exist');
                cy.get('[data-testid="object_link_duration_seconds"]').should('exist');
                // shows an error because they havent chosen a file type and a file size
                cy.get('[data-testid="dlor-panel-validity-indicator-2"] span')
                    .should('exist')
                    .should('contain', 2); // panel invalidity count present
                cy.waitUntil(() => cy.get('[data-testid="object_link_file_type"]').should('exist'));
                cy.get('[data-testid="object_link_file_type"]').click();
                cy.get('[data-value="video"]')
                    .should('exist')
                    .click();
                cy.get('[data-testid="object_link_duration_minutes"] input')
                    .should('exist')
                    .type('3');
                cy.get('[data-testid="object_link_duration_seconds"] input')
                    .should('exist')
                    .type('47');

                // cy.get('[data-testid="object_download_instructions"] textarea:first-child')
                //     .should('exist')
                //     .type(downloadInstructionText);
                TypeCKEditor(downloadInstructionText);
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
                cy.get('[data-testid="dialogbox-dlor-save-outcome"] h2').contains('The object has been created');

                // wait for the save to complete
                cy.waitUntil(() => cy.get('[data-testid="cancel-dlor-save-outcome"]').should('exist'));

                // check the data we pretended to send to the server matches what we expect
                // acts as check of what we sent to api
                const expectedValues = {
                    object_title: 'xxxxxxxx',
                    object_description:
                        'new description xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
                    object_summary: 'new summary xxxxxxxx',
                    object_link_interaction_type: 'view',
                    object_link_file_type: 'video',
                    object_link_size: 227,
                    object_link_url: 'http://example.com',
                    object_download_instructions: downloadInstructionText,
                    object_embed_type: 'link',
                    object_is_featured: 0,
                    object_publishing_user: 'dloradmn',
                    object_review_date_next: '2025-03-26T00:01',
                    object_status: 'new',
                    object_owning_team_id: 2,
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

                    expectedValues.object_description =
                        '<p>new descriptionxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</p>';
                    expectedValues.object_download_instructions = '<p>' + downloadInstructionText + '</p>';

                    console.log('sentFacets=', sentFacets);
                    console.log('expectedFacets=', expectedFacets);
                    expect(sentValues).to.deep.equal(expectedValues);
                    expect(sentFacets).to.deep.equal(expectedFacets);
                    expect(sentKeywords).to.deep.equal(expectedKeywords);
                    cy.clearCookie('CYPRESS_DATA_SAVED');
                    cy.clearCookie('CYPRESS_TEST_DATA');
                });

                // now clear the form to create another Object
                cy.get('[data-testid="cancel-dlor-save-outcome"]')
                    .should('contain', 'Add another Object')
                    .click();
                cy.waitUntil(() => cy.get('[data-testid="object_publishing_user"] input').should('exist'));
                cy.get('[data-testid="dlor-form-next-button"]')
                    .should('exist')
                    .click();

                cy.get('[data-testid="object_title"] input').should('have.value', '');
            });
            it('after swapping between interaction types', () => {
                cy.getCookie('CYPRESS_TEST_DATA').then(cookie => {
                    expect(cookie).to.exist;
                    expect(cookie.value).to.equal('active');
                });

                // go to panel 2
                cy.get('[data-testid="dlor-form-next-button"]')
                    .should('exist')
                    .click();
                cy.get('[data-testid="object_title"] input')
                    .should('exist')
                    .type('x'.padEnd(REQUIRED_LENGTH_TITLE, 'x'));
                TypeCKEditor('x'.padEnd(REQUIRED_LENGTH_DESCRIPTION, 'x'));
                // cy.get('[data-testid="object_description"] textarea:first-child')
                //     .should('exist')
                //     .type('x'.padEnd(REQUIRED_LENGTH_DESCRIPTION, 'x'));
                cy.get('[data-testid="admin-dlor-suggest-summary-button"]')
                    .should('exist')
                    .click();
                cy.get('[data-testid="dlor-panel-validity-indicator-1"]').should('not.exist'); // panel invalidity count not present

                // go to panel 3
                cy.get('[data-testid="dlor-form-next-button"]')
                    .should('exist')
                    .click();

                cy.get('[data-testid="object_link_url"] input')
                    .should('exist')
                    .type('http://example.com');

                // accessible link message is "no message"
                // cy.get('[data-testid="object_link_interaction_type"]')
                //     .should('exist')
                //     .contains('No Message');
                cy.get('[data-testid="object_link_file_type"]').should('not.exist');
                cy.get('[data-testid="object_link_duration_minutes"]').should('not.exist');
                cy.get('[data-testid="object_link_duration_seconds"]').should('not.exist');
                cy.get('[data-testid="object_link_size_units"]').should('not.exist');
                cy.get('[data-testid="object_link_size_amount"]').should('not.exist');
                cy.get('[data-testid="object_link_interaction_type"]')
                    .should('exist')
                    .click();
                cy.get('[data-testid="object_link_interaction_type-view"]')
                    .should('exist')
                    .click();
                cy.get('[data-testid="object_link_file_type"]').should('exist');
                cy.get('[data-testid="object_link_size_amount"]').should('not.exist');
                cy.get('[data-testid="object_link_size_units"]').should('not.exist');
                cy.get('[data-testid="object_link_duration_minutes"]').should('exist');
                cy.get('[data-testid="object_link_duration_seconds"]').should('exist');
                cy.get('[data-testid="object_link_file_type"]')
                    .should('exist')
                    .contains('New type');
                cy.get('[data-testid="object_link_file_type"]').click();
                cy.get('[data-value="video"]')
                    .should('exist')
                    .click();
                cy.get('[data-testid="object_link_duration_minutes"] input')
                    .should('exist')
                    .type('3');
                cy.get('[data-testid="object_link_duration_seconds"] input')
                    .should('exist')
                    .type('47');

                // now change the interactivity type
                // (this test will confirm that when we wipe the other fields they arent sent

                cy.get('[data-testid="object_link_interaction_type"]')
                    .should('exist')
                    .click();
                cy.get('[data-testid="object_link_interaction_type-none"]')
                    .should('exist')
                    .click();

                // cy.get('[data-testid="object_download_instructions"] textarea:first-child')
                //     .should('exist')
                //     .type('words');
                TypeCKEditor('words');
                cy.get('[data-testid="dlor-panel-validity-indicator-2"]').should('not.exist'); // panel invalidity count not present

                // next panel
                cy.get('[data-testid="dlor-form-next-button"]')
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
                cy.get('[data-testid="admin-dlor-save-button-submit"]')
                    .should('exist')
                    .should('not.be.disabled');

                // save new dlor
                cy.get('[data-testid="admin-dlor-save-button-submit"]')
                    .should('exist')
                    .should('not.be.disabled')
                    .click();

                cy.waitUntil(() => cy.get('[data-testid="cancel-dlor-save-outcome"]').should('exist'));

                // check the data we pretended to send to the server matches what we expect
                // acts as check of what we sent to api
                const expectedValues = {
                    object_description: 'x'.padEnd(REQUIRED_LENGTH_DESCRIPTION, 'x'),
                    object_download_instructions: 'words',
                    object_link_interaction_type: 'none',
                    object_link_url: 'http://example.com',
                    object_owning_team_id: 1,
                    object_embed_type: 'link',
                    object_is_featured: 0,
                    object_publishing_user: 'dloradmn',
                    object_review_date_next: '2025-03-26T00:01',
                    object_status: 'new',
                    object_summary: 'x'.padEnd(REQUIRED_LENGTH_DESCRIPTION, 'x'),
                    object_title: 'x'.padEnd(REQUIRED_LENGTH_TITLE, 'x'),
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
                    const decodedValue = decodeURIComponent(cookie.value);
                    const sentValues = JSON.parse(decodedValue);
                    console.log('sentValues=', sentValues);
                    console.log('expectedValues=', expectedValues);

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
                    expectedValues.object_description =
                        '<p>xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</p>';
                    expectedValues.object_download_instructions = '<p>words</p>';
                    expect(sentValues).to.deep.equal(expectedValues);
                    expect(sentFacets).to.deep.equal(expectedFacets);
                    expect(sentKeywords).to.deep.equal(expectedKeywords);

                    cy.clearCookie('CYPRESS_DATA_SAVED');
                    cy.clearCookie('CYPRESS_TEST_DATA');
                });
            });
            it('with a new interaction type', () => {
                cy.getCookie('CYPRESS_TEST_DATA').then(cookie => {
                    expect(cookie).to.exist;
                    expect(cookie.value).to.equal('active');
                });

                // go to panel 2
                cy.get('[data-testid="dlor-form-next-button"]')
                    .should('exist')
                    .click();
                cy.get('[data-testid="object_title"] input')
                    .should('exist')
                    .type('x'.padEnd(REQUIRED_LENGTH_TITLE, 'x'));
                // cy.get('[data-testid="object_description"] textarea:first-child')
                //     .should('exist')
                //     .type('x'.padEnd(REQUIRED_LENGTH_DESCRIPTION, 'x'));
                TypeCKEditor('x'.padEnd(REQUIRED_LENGTH_DESCRIPTION, 'x'));
                cy.get('[data-testid="admin-dlor-suggest-summary-button"]')
                    .should('exist')
                    .click();
                cy.get('[data-testid="dlor-panel-validity-indicator-1"]').should('not.exist'); // panel invalidity count not present

                // go to panel 3
                cy.get('[data-testid="dlor-form-next-button"]')
                    .should('exist')
                    .click();

                cy.get('[data-testid="object_link_url"] input')
                    .should('exist')
                    .type('http://example.com');

                // accessible link message is "no message"
                cy.get('[data-testid="object_link_file_type"]').should('not.exist');
                cy.get('[data-testid="object_link_duration_minutes"]').should('not.exist');
                cy.get('[data-testid="object_link_duration_seconds"]').should('not.exist');
                cy.get('[data-testid="object_link_size_units"]').should('not.exist');
                cy.get('[data-testid="object_link_size_amount"]').should('not.exist');
                cy.get('[data-testid="object_link_interaction_type"]')
                    .should('exist')
                    .click();
                cy.get('[data-testid="object_link_interaction_type-view"]')
                    .should('exist')
                    .click();
                cy.get('[data-testid="object_link_file_type"]').should('exist');
                cy.get('[data-testid="object_link_size_amount"]').should('not.exist');
                cy.get('[data-testid="object_link_size_units"]').should('not.exist');
                cy.get('[data-testid="object_link_duration_minutes"]').should('exist');
                cy.get('[data-testid="object_link_duration_seconds"]').should('exist');
                cy.get('[data-testid="object_link_file_type"]')
                    .should('exist')
                    .contains('New type');

                cy.get('[data-testid="new_file_type"]')
                    .should('exist')
                    .type('docx');
                cy.get('[data-testid="object_link_duration_minutes"] input')
                    .should('exist')
                    .type('3');
                cy.get('[data-testid="object_link_duration_seconds"] input')
                    .should('exist')
                    .type('47');

                // cy.get('[data-testid="object_download_instructions"] textarea:first-child')
                //     .should('exist')
                //     .type('words');
                TypeCKEditor('words');
                cy.get('[data-testid="dlor-panel-validity-indicator-2"]').should('not.exist'); // panel invalidity count not present

                // next panel
                cy.get('[data-testid="dlor-form-next-button"]')
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
                cy.get('[data-testid="admin-dlor-save-button-submit"]')
                    .should('exist')
                    .should('not.be.disabled');

                // save new dlor
                cy.get('[data-testid="admin-dlor-save-button-submit"]')
                    .should('exist')
                    .should('not.be.disabled')
                    .click();

                cy.waitUntil(() => cy.get('[data-testid="cancel-dlor-save-outcome"]').should('exist'));

                // check the data we pretended to send to the server matches what we expect
                // acts as check of what we sent to api
                const expectedValues = {
                    object_description: 'x'.padEnd(REQUIRED_LENGTH_DESCRIPTION, 'x'),
                    object_download_instructions: 'words',
                    object_link_interaction_type: 'view',
                    object_link_file_type: 'docx',
                    object_link_size: 227,
                    object_link_url: 'http://example.com',
                    object_owning_team_id: 1,
                    object_embed_type: 'link',
                    object_is_featured: 0,
                    object_publishing_user: 'dloradmn',
                    object_review_date_next: '2025-03-26T00:01',
                    object_status: 'new',
                    object_summary: 'x'.padEnd(REQUIRED_LENGTH_DESCRIPTION, 'x'),
                    object_title: 'x'.padEnd(REQUIRED_LENGTH_TITLE, 'x'),
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
                cy.getCookie('CYPRESS_DATA_SAVED').then(cookie => {
                    expect(cookie).to.exist;
                    const decodedValue = decodeURIComponent(cookie.value);
                    const sentValues = JSON.parse(decodedValue);
                    console.log('sentValues=', sentValues);
                    console.log('expectedValues=', expectedValues);

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
                    expectedValues.object_description =
                        '<p>xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</p>';
                    expectedValues.object_download_instructions = '<p>words</p>';
                    expect(sentValues).to.deep.equal(expectedValues);
                    expect(sentFacets).to.deep.equal(expectedFacets);
                    expect(sentKeywords).to.deep.equal(expectedKeywords);

                    cy.clearCookie('CYPRESS_DATA_SAVED');
                    cy.clearCookie('CYPRESS_TEST_DATA');
                });
            });
        });
        context('fails correctly', () => {
            it('admin gets an error when Teams list api doesnt load', () => {
                cy.visit(`http://localhost:2020/admin/dlor/add?user=${mockDlorAdminUser}&responseType=teamsLoadError`);
                // "responseType=teamsLoadError" on the url forces an error from mock api
                cy.get('[data-testid="dlor-form-addedit-error"]').contains(
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
                cy.waitUntil(() => cy.get('[data-testid="dlor-form-next-button"]').should('exist'));
                cy.get('[data-testid="dlor-form-next-button"]').click();

                cy.get('[data-testid="object_title"] input')
                    .should('exist')
                    .type('x'.padEnd(REQUIRED_LENGTH_TITLE, 'x'));
                // cy.get('[data-testid="object_description"] textarea:first-child')
                //     .should('exist')
                //     .type('new description '.padEnd(REQUIRED_LENGTH_DESCRIPTION, 'x'));
                TypeCKEditor('new description'.padEnd(REQUIRED_LENGTH_DESCRIPTION, 'x'));
                cy.get('[data-testid="object_summary"] textarea:first-child')
                    .should('exist')
                    .type('new summary '.padEnd(REQUIRED_LENGTH_SUMMARY, 'x'));

                // go to the third panel, Link
                cy.get('[data-testid="dlor-form-next-button"]')
                    .should('exist')
                    .click();
                cy.get('[data-testid="object_link_url"] input')
                    .should('exist')
                    .type('http://example.com');

                // go to the fourth panel, Filtering
                cy.get('[data-testid="dlor-form-next-button"]')
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
            cy.get('h1').should('contain', 'Digital learning hub Management');
        });
    });
});
