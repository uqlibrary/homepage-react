context('ACCESSIBILITY', () => {
    it('Primo Search', () => {
        cy.visit('/');
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('div#primo-search').contains('Search');
        cy.log('Primo Search');
        cy.checkA11y('div#primo-search', {
            reportName: 'Primo Search',
            scopeName: 'Accessibility',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
    });
});
