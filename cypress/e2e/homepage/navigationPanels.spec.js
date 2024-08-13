describe('header', () => {
    context('Big 6 Nav', () => {
        it('displays correctly', () => {
            cy.visit('http://localhost:2020/?user=public');
            cy.viewport(1300, 1000);

            cy.get('[data-testid="help-navigation-panel"]')
                .should('exist')
                .scrollIntoView()
                .children()
                .should('have.length', 6);
        });
        context('is accessible', () => {
            it('at desktop', () => {
                cy.visit('http://localhost:2020/?user=public');
                cy.injectAxe();
                cy.viewport(1300, 1000);
                cy.waitUntil(() => cy.get('[data-testid="help-navigation-panel"]').should('exist')).scrollIntoView();
                cy.checkA11y('[data-testid="help-navigation-panel"]', {
                    reportName: 'Web Help Navigation Edit',
                    scopeName: 'Content',
                    includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
                });
            });
            it('at tablet', () => {
                cy.visit('http://localhost:2020/?user=public');
                cy.injectAxe();
                cy.viewport(1000, 900);
                cy.waitUntil(() => cy.get('[data-testid="help-navigation-panel"]').should('exist')).scrollIntoView();
                cy.checkA11y('[data-testid="help-navigation-panel"]', {
                    reportName: 'Web Help Navigation Tablet',
                    scopeName: 'Content',
                    includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
                });
            });
            it('at mobil', () => {
                cy.visit('http://localhost:2020/?user=public');
                cy.injectAxe();
                cy.viewport(320, 480);
                cy.waitUntil(() => cy.get('[data-testid="help-navigation-panel"]').should('exist')).scrollIntoView();
                cy.checkA11y('[data-testid="help-navigation-panel"]', {
                    reportName: 'Web Help Navigation Mobile',
                    scopeName: 'Content',
                    includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
                });
            });
        });
    });
});
