describe('Past Exam Papers Pages', () => {
    context('searching', () => {
        it('the past exam paper search page is accessible', () => {
            cy.visit('/exams');
            cy.injectAxe();
            cy.viewport(1300, 1000);
            cy.get('div[id="content-container"]').contains('Search for a past exam paper');
            cy.checkA11y('[data-testid="StandardPage"]', {
                reportName: 'past exam paper search',
                scopeName: 'Content',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
        it('Responsive display is accessible', () => {
            cy.visit('/exams');
            cy.injectAxe();
            cy.viewport(414, 736);
            cy.get('div[id="content-container"]').contains('Search for a past exam paper');
            cy.checkA11y('[data-testid="StandardPage"]', {
                reportName: 'past exam paper search mobile',
                scopeName: 'Content',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
        it('has breadcrumbs', () => {
            cy.visit('/exams');
            cy.get('uq-site-header')
                .shadow()
                .within(() => {
                    cy.get('[data-testid="subsite-title"]')
                        .should('exist')
                        .should('be.visible')
                        .contains('Past exam papers');
                });
        });
        it('when I type a valid course code fragment in the search bar, appropriate suggestions load', () => {
            cy.visit('/exams');
            cy.get('[data-testid="past-exam-paper-search-autocomplete-input"]').type('fren1');
            // suggestions load
            cy.get('.MuiAutocomplete-listbox')
                .children()
                .should('have.length', 3);
        });
        it('the suggestions list is accessible', () => {
            cy.visit('/exams');
            cy.injectAxe();
            cy.viewport(1300, 1000);
            cy.get('[data-testid="past-exam-paper-search-autocomplete-input"]').type('fren1'); // mock returns 200, array
            // suggestions load
            cy.checkA11y('[data-testid="StandardPage"]', {
                reportName: 'past exam paper suggestions',
                scopeName: 'Content',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
        it('when I type an invalid course code fragment in the search bar, a hint shows', () => {
            cy.visit('/exams');
            cy.get('[data-testid="past-exam-paper-search-autocomplete-input"]').type('em'); // mock returns 200 empty
            // suggestions dont load
            cy.get('.MuiAutocomplete-listbox').should('have.length', 0);
            cy.get('.MuiAutocomplete-noOptions')
                .should('exist')
                .contains('We have not found any past exams for this course');
        });
        it('when I type too short a course code fragment in the search bar, a hint shows', () => {
            cy.visit('/exams');
            cy.get('[data-testid="past-exam-paper-search-autocomplete-input"]').type('f'); // too short to send an api call
            // suggestions dont load
            cy.get('.MuiAutocomplete-listbox').should('have.length', 0);
            cy.get('.MuiAutocomplete-noOptions')
                .should('exist')
                .contains('Type more characters to search');
        });
        it('when I dont have any results yet, the "results for this search" doesnt get added to the drop down', () => {
            cy.visit('/exams');
            // typing one character doesnt add the "results for this incomplete search" option
            cy.get('[data-testid="past-exam-paper-search-autocomplete-input"]').type('f');
            cy.get('.MuiAutocomplete-listbox').should('not.exist');
            // but something with results does
            cy.get('[data-testid="past-exam-paper-search-autocomplete-input"]').type('ren');
            cy.get('.MuiAutocomplete-listbox')
                .children()
                .should('have.length', 17);
        });
        it('when I click on a suggestion from the list, the correct result page loads', () => {
            cy.visit('/exams');
            cy.get('[data-testid="past-exam-paper-search-autocomplete-input"]').type('fren');
            cy.get('.MuiAutocomplete-listbox')
                .children()
                .should('have.length', 17);
            cy.get('#exam-search-option-0').click({ force: true });
            cy.url().should('include', 'exams/course/FREN');
        });
        it('when I hit return on a search list, the result page for the first option loads', () => {
            // the "autoHighlight" option makes it take the first option when clicking return
            cy.visit('/exams');
            cy.get('[data-testid="past-exam-paper-search-autocomplete-input"]').type('fren');
            cy.get('.MuiAutocomplete-listbox')
                .children()
                .should('have.length', 17);
            cy.get('[data-testid="past-exam-paper-search-autocomplete-input"]').type('{enter}');
            cy.url().should('include', 'exams/course/FREN');
        });
        it('when my search term matches the first result I do not get a "show all" prompt', () => {
            cy.visit('/exams');
            // typing most of a course code gives the returned results plus the initial "view all results for..."
            cy.get('[data-testid="past-exam-paper-search-autocomplete-input"]').type('fren101');
            cy.get('.MuiAutocomplete-listbox')
                .children()
                .should('have.length', 2);
            cy.get('#exam-search-option-0').should('contain', 'View all exam papers for FREN101');
            cy.get('#exam-search-option-1').should('contain', 'FREN1010');

            // matching a course code exactly does not include the "view all results for..." option
            cy.get('[data-testid="past-exam-paper-search-autocomplete-input"]').type('0');
            cy.get('.MuiAutocomplete-listbox')
                .children()
                .should('have.length', 1);
            cy.get('#exam-search-option-0').should('contain', 'FREN1010');
        });
        it('when the api fails I get an appropriate error message', () => {
            cy.visit('/exams');
            cy.get('[data-testid="past-exam-paper-search-autocomplete-input"]').type('fail'); // mock returns 500
            // suggestions dont load
            cy.get('.MuiAutocomplete-listbox').should('have.length', 0);
            cy.get('div[data-testid="past-exam-paper-error"]')
                .should('exist')
                .contains('Autocomplete suggestions currently unavailable - please try again later');
        });
    });
    context('results', () => {
        it('the past exam paper result page is accessible', () => {
            cy.visit('/exams/course/fren');
            cy.injectAxe();
            cy.viewport(1300, 1000);
            cy.get('div[id="content-container"]').contains('Past Exam Papers');
            cy.checkA11y('[data-testid="StandardPage"]', {
                reportName: 'past exam paper results',
                scopeName: 'Content',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
        it('past exam paper result page responsive display is accessible', () => {
            cy.visit('/exams/course/fren');
            cy.injectAxe();
            cy.viewport(414, 736);
            cy.get('div[id="content-container"]').contains('Past Exam Papers');
            cy.checkA11y('[data-testid="StandardPage"]', {
                reportName: 'past exam paper results mobile',
                scopeName: 'Content',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
        context('a desktop page', () => {
            it(' with multiple subjects displayed shows table view for Original papers', () => {
                cy.visit('/exams/course/fren');
                cy.get('uq-site-header')
                    .shadow()
                    .within(() => {
                        cy.get('[data-testid="subsite-title"]')
                            .should('exist')
                            .should('be.visible')
                            .contains('Past exam papers');
                    });
                cy.get('div[id="content-container"]').contains('Past Exam Papers from 2017 to 2022 for "FREN"');

                // sample papers are correct
                cy.waitUntil(() => cy.get('[data-testid="exampaper-desktop-sample-link-0-0-0"]').should('exist'));
                cy.get('[data-testid="exampaper-desktop-sample-link-0-0-0"]').contains('FREN1010 Sem.2 2020');

                // original papers are correct
                cy.get('[data-testid="exampaper-desktop-originals-table-header"]')
                    .children()
                    .should('have.length', 4);
                cy.get('[data-testid="exampaper-desktop-originals-table-body"]')
                    .children()
                    .should('have.length', 22);
                cy.get('[data-testid="exampaper-desktop-originals-link-1-1-0"]').contains('FREN2010');
                cy.get('[data-testid="exampaper-desktop-originals-link-1-1-0"]').contains('Final');

                cy.get('[data-testid="exampaper-desktop-originals-link-4-1-0"]').contains('FREN2082');
                cy.get('[data-testid="exampaper-desktop-originals-link-4-1-0"]').contains('a special french paper');

                cy.get('[data-testid="exampaper-desktop-originals-link-4-0-0"]').contains('FREN2082');
                cy.get('[data-testid="exampaper-desktop-originals-link-4-0-0"] span:first-child').contains(
                    'Final Paper',
                );
            });
            it('with one subject and no sample papers shows originals in Simple view', () => {
                cy.visit('/exams/course/PHYS1001?user=s1111111');
                cy.waitUntil(() =>
                    cy
                        .get('[data-testid="exampapers-original-heading"]')
                        .should('exist')
                        .contains('Original past exam papers'),
                );

                cy.get('[data-testid="exampaper-desktop-original-line"]').should('exist');
                cy.get('[data-testid="exampaper-desktop-sample-line"]').should('not.exist');
            });
            it('with no original papers and some sample papers shows Simple view', () => {
                cy.visit('/exams/course/dent1050?user=s1111111');
                cy.waitUntil(() =>
                    cy
                        .get('[data-testid="exampapers-original-heading"]')
                        .should('exist')
                        .contains('Original past exam papers'),
                );

                cy.get('[data-testid="no-original-papers-provided"]')
                    .should('exist')
                    .contains('No original papers provided.');
                cy.get('[data-testid="original-papers-table"]').should('not.exist');

                cy.get('[data-testid="sample-papers-heading"]')
                    .should('exist')
                    .contains('Sample past exam papers');
                cy.get('[data-testid="exampaper-desktop-sample-link-0-0-0"]')
                    .should('exist')
                    .contains('DENT1050 Sem.2 2022');
            });
        });
        context('a mobile page', () => {
            it(' with multiple subjects displayed shows simple view for Original papers', () => {
                cy.visit('/exams/course/fren');
                cy.viewport(414, 736);

                // sample papers are correct
                cy.waitUntil(() => cy.get('[data-testid="exampaper-mobile-sample-link-0-0-0"]').should('exist'));
                cy.waitUntil(() =>
                    cy
                        .get('[data-testid="exampaper-mobile-sample-link-0-0-0"]')
                        .should('contain', 'FREN1010 Sem.2 2020'),
                );

                // original papers are correct
                cy.get('[data-testid="exampaper-mobile-original-link-0-0-0"]').should(
                    'contain',
                    'FREN1010 Sem.1 2020 Paper A',
                );
                cy.get('[data-testid="exampaper-mobile-original-link-0-0-1"]').should(
                    'contain',
                    'FREN1010 Sem.1 2020 Paper B',
                );
                cy.get('[data-testid="exampaper-mobile-original-link-1-0-0"]').should('contain', 'FREN2010 Sem.1 2021');
                cy.get('[data-testid="exampaper-mobile-original-link-1-1-0"]').should(
                    'contain',
                    'FREN2010 Sem.1 2019 Final',
                );
                cy.get('[data-testid="exampaper-mobile-original-link-4-1-0"]').should(
                    'contain',
                    'FREN2082 Sem.1 2020 a special french paper',
                );
                cy.get('[data-testid="exampaper-mobile-original-link-4-1-1"]').should(
                    'contain',
                    'FREN2082 Sem.1 2020 Paper 2',
                );
                cy.get('[data-testid="exampaper-mobile-original-link-4-0-0"]').should(
                    'contain',
                    'FREN2082 Sem.1 2021 (Final Paper)',
                );
            });
            it('with one subject and no sample papers shows originals in Simple view', () => {
                cy.visit('/exams/course/PHYS1001?user=s1111111');
                cy.viewport(414, 736);
                cy.waitUntil(() =>
                    cy
                        .get('[data-testid="exampapers-original-heading"]')
                        .should('exist')
                        .contains('Original past exam papers'),
                );

                cy.get('[data-testid="exampaper-mobile-original-line"]').should('exist');
                cy.get('[data-testid="exampaper-mobile-sample-line"]').should('not.exist');
            });
            it('with no original papers and some sample papers shows Simple view', () => {
                cy.visit('/exams/course/dent1050?user=s1111111');
                cy.viewport(414, 736);
                cy.waitUntil(() =>
                    cy
                        .get('[data-testid="exampapers-original-heading"]')
                        .should('exist')
                        .contains('Original past exam papers'),
                );

                cy.get('[data-testid="no-original-papers-provided"]')
                    .should('exist')
                    .contains('No original papers provided.');
                cy.get('[data-testid="original-papers-table"]').should('not.exist');

                cy.get('[data-testid="sample-papers-heading"]')
                    .should('exist')
                    .contains('Sample past exam papers');
                cy.get('[data-testid="exampaper-mobile-sample-link-0-0-0"]')
                    .should('exist')
                    .contains('DENT1050 Sem.2 2022');
            });
        });
    });
    context('search errors', () => {
        it('has breadcrumbs', () => {
            cy.visit('/exams/course/empt');
            cy.get('uq-site-header')
                .shadow()
                .within(() => {
                    cy.get('[data-testid="subsite-title"]')
                        .should('exist')
                        .should('be.visible')
                        .contains('Past exam papers');
                });
        });
        it('a search with no results shows a message', () => {
            cy.visit('/exams/course/empt');
            cy.get('div[id="content-container"]').contains('Past Exam Papers from 2017 to 2022 for "EMPT"');
            cy.get('div[data-testid="past-exam-paper-missing"]').contains(
                'We have not found any past exams for this course "EMPT".',
            );
        });
        it('a search for a true 404 shows a message', () => {
            cy.visit('/exams/course/mock404');
            cy.get('div[id="content-container"]').contains('Past Exam Papers by Subject');
            cy.get('div[data-testid="past-exam-paper-missing"]').contains(
                'We have not found any past exams for this course.',
            );
        });
        it('when the api fails I get an appropriate error message', () => {
            cy.visit('/exams/course/fail');
            cy.get('.MuiAutocomplete-listbox').should('have.length', 0);
            cy.get('div[data-testid="past-exam-paper-error"]')
                .should('exist')
                .contains('Past exam paper search is currently unavailable - please try again later');
        });
    });
});
