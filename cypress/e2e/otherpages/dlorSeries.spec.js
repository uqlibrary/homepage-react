describe('Digital Learning Hub Series page', () => {
    context('series page', () => {
        it('appears as expected', () => {
            
            cy.visit('digital-learning-hub/series/1');
            cy.get('[data-testid="dlor-seriespage"] h1').should(
                'contain',
                'Series Name',
            );
        });
        
        it('is accessible', () => {
            cy.visit('digital-learning-hub/series/1');
            cy.injectAxe();
            cy.viewport(1300, 1000);

            cy.waitUntil(() => cy.get('[data-testid="dlor-seriespage"] h1').should('exist'));
            cy.get('[data-testid="dlor-seriespage"] h1').should('contain', 'Series Name');
            cy.checkA11y('[data-testid="StandardPage"]', {
                reportName: 'dlor',
                scopeName: 'Content',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
    });
});
