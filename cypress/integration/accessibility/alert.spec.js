context('ACCESSIBILITY', () => {
    it('Homepage', () => {
        cy.visit('/');
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('div[data-testid="alert-0"]').contains('Test urgent alert 2');
        cy.log('Alert 1');
        cy.checkA11y('div[data-testid="alert-0"]', {
            reportName: 'Homepage',
            scopeName: 'Content',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });

        cy.get('div[data-testid="alert-1"]').contains('We are open on-campus and online.');
        cy.log('Alert 2');
        cy.checkA11y('div[data-testid="alert-1"]', {
            reportName: 'Homepage',
            scopeName: 'Content',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
    });
});
