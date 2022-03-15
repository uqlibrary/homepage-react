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
    it('when I type FREN in the search bar, appropriate suggestions load', () => {
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
        cy.get('[data-testid="past-exam-paper-search-autocomplete-input"]').type('fren1');
        // suggestions load
        cy.checkA11y('[data-testid="StandardPage"]', {
            reportName: 'past exam paper suggestions',
            scopeName: 'Content',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
    });
    it('when I type nonsense in the search bar, a hint shows', () => {
        cy.visit('/exams');
        cy.get('[data-testid="past-exam-paper-search-autocomplete-input"]').type('XYZA');
        // suggestions dont load
        cy.get('.MuiAutocomplete-listbox').should('have.length', 0);
        cy.get('.MuiAutocomplete-noOptions')
            .should('exist')
            .contains('Enter at least 2 characters to see relevant courses');
    });
    it('when the api fails I get an appropriate error message', () => {
        cy.visit('/exams');
        cy.get('[data-testid="past-exam-paper-search-autocomplete-input"]').type('fail');
        // suggestions dont load
        cy.get('.MuiAutocomplete-listbox').should('have.length', 0);
        cy.get('.MuiAutocomplete-noOptions')
            .should('exist')
            .contains('Enter at least 2 characters to see relevant courses');
    });
});
