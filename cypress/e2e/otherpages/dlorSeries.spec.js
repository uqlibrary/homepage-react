describe('Digital Learning Hub Series page.', () => {
    context('series page', () => {
        it('appears as expected', () => {
            
            cy.visit('digital-learning-hub/series/1');
            cy.get('[data-testid="dlor-seriespage"] h1').should(
                'contain',
                'Series Name',
            );
            cy.visit('digital-learning-hub/series/2');
            cy.get('[data-testid="dlor-seriespage"] h1').should(
                'contain',
                'Series Name',
            );
            cy.get('[data-testid="dlor-homepage-panel-987y-isjgt-9866"]').should('contain', 'Accessibility - Digital Essentials (has Youtube link)')
            cy.visit('digital-learning-hub/series/2');
            cy.get('[data-testid="dlor-seriespage"] h1').should(
                'contain',
                'Series Name',
            );
            cy.visit('digital-learning-hub/series/9');
            cy.get('[data-testid="dlor-seriespage-description"]').should(
                'contain',
                'This series does not have a detailed description at this time.',
            );
            cy.visit('digital-learning-hub/series/5');
            cy.get('[data-testid="dlor-seriespage-description"]').should(
                'not.exist'
            );
            cy.get('[data-testid="dlor-seriespage-loadError"]').should(
                'exist'
            ).should('contain', 'An error has occurred during the request and this request cannot be processed');
        });

        it('navigates to the correct location', () => {
            
            cy.visit('digital-learning-hub/series/1');
            cy.get('[data-testid="dlor-seriespage"] h1').should(
                'contain',
                'Series Name',
            );
            cy.get('[data-testid="dlor-homepage-panel-98s0-dy5k3-98h4"] button').click();
            cy.get('[data-testid="dlor-detailpage"]').should('contain', 'Advanced literature searching');

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
