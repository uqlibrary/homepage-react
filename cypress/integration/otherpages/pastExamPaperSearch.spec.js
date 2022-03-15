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
