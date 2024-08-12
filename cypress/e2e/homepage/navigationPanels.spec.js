describe('header', () => {
    context('Big 6 Nav', () => {
        it('displays correctly', () => {
            cy.visit('http://localhost:2020/?user=s1111111');
            cy.viewport(1300, 1000);

            cy.get('[data-testid="help-navigation-panel"]')
                .should('exist')
                .children()
                .should('have.length', 6);
        });
        it('is accessible', () => {
            cy.visit('http://localhost:2020/?user=s1111111');
            cy.injectAxe();
            cy.viewport(1300, 1000);
            cy.waitUntil(() => cy.get('[data-testid="help-navigation-panel"]').should('exist'));
            cy.checkA11y('[data-testid="help-navigation-panel"]', {
                reportName: 'Web Help Navigation Edit',
                scopeName: 'Content',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
    });
});
