describe('Read and Publish (homepage)', () => {
    context('is accessible', () => {
        it('at 1300 x 1000', () => {
            cy.visit('http://localhost:2020/?user=uqstaff');
            cy.injectAxe();
            cy.wait(2000);
            cy.viewport(1300, 1000);

            cy.waitUntil(() => cy.get('[data-testid="readpublish-panel"]').should('exist'));
            cy.checkA11y('[data-testid="readpublish-panel"]', {
                reportName: 'Read and Publish desktop',
                scopeName: 'As loaded',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
        it('at 550 x 750', () => {
            cy.visit('http://localhost:2020/?user=uqstaff');
            cy.injectAxe();
            cy.wait(2000);
            cy.viewport(550, 750);

            cy.waitUntil(() => cy.get('[data-testid="readpublish-panel"]').should('exist'));
            cy.checkA11y('[data-testid="readpublish-panel"]', {
                reportName: 'Read and Publish desktop',
                scopeName: 'As loaded',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
    });
});
