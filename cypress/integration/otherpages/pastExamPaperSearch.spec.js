describe('Past Exam Papers Pages', () => {
    context('past exam paper search page', () => {
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
        it('when I type a valid course code fragment in the search bar, appropriate suggestions load', () => {
            cy.visit('/exams');
            cy.get('[data-testid="past-exam-paper-search-autocomplete-input"]').type('fren1');
            // suggestions load
            cy.get('.MuiAutocomplete-listbox')
                .children()
                .should('have.length', 2);
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
    context('past exam paper result page', () => {
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
        it('the past exam paper result page is correct', () => {
            cy.visit('/exams/course/fren');
            cy.get('div[id="content-container"]').contains('Past Exam Papers from 2017 to 2022 for "FREN"');
            cy.get('[data-testid="exampaper-results-table-header"]')
                .children()
                .should('have.length', 4);
            cy.get('[data-testid="exampaper-results-table-body"]')
                .children()
                .should('have.length', 22);
            cy.get('[data-testid="exampaper-results-bodycell-0-0"]').contains('FREN1010');
            cy.get('[data-testid="exampaper-results-bodycell-0-0"]').contains('Sample');
            cy.get('[data-testid="exampaper-results-bodycell-1-2"]').contains('FREN2010');
            cy.get('[data-testid="exampaper-results-bodycell-1-2"]').contains('Final');
        });
        it('a search with no results shows a message', () => {
            cy.visit('/exams/course/empt');
            cy.get('div[id="content-container"]').contains('Past Exam Papers by Subject');
            cy.get('div[data-testid="past-exam-paper-missing"]').contains(
                'We have not found any past exams for this course (EMPT) because either',
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
