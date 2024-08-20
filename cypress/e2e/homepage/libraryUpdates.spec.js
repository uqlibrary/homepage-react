describe('LibraryUpdates', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.viewport(1300, 1000);
    });
    context('accessibility', () => {
        it('is accessible at 1300 1000', () => {
            cy.injectAxe();
            cy.wait(2000);
            cy.viewport(1300, 1000);

            cy.log('Homepage - Library Updates');
            cy.waitUntil(() => cy.get('[data-testid="article-1-title"]').should('exist'));
            cy.checkA11y('div[data-testid="library-updates-parent"]', {
                reportName: 'Library Updates',
                scopeName: 'As loaded',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
    });
});
