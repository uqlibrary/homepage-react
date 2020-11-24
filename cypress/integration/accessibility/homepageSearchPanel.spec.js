context('ACCESSIBILITY', () => {
    it('Homepage Search', () => {
        cy.visit('/');
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('div#primo-search').contains('Search');
        cy.log('Primo Search - not yet touched');
        cy.checkA11y('div#primo-search', {
            reportName: 'Primo Search',
            scopeName: 'Pristine',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
        cy.get('input[data-testid="primo-search-autocomplete-input"]').type('beard', 100);
        cy.get('ul[data-testid="primo-search-autocomplete-listbox"]').contains('beard');
        cy.log('Primo Search - with autosuggestions present');
        cy.checkA11y('ul[data-testid="primo-search-autocomplete-listbox"]', {
            reportName: 'Primo Search',
            scopeName: 'Options list',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
    });
});
