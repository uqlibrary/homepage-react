describe('LibraryUpdates', () => {
    context('content', () => {
        it('loads as expected on desktop', () => {
            cy.visit('/');
            cy.viewport(1300, 1000);
            cy.get('[data-testid="drupal-article-0"]')
                .should('exist')
                .contains('Rae and George Hammer memorial');
        });
        it('loads as expected on mobile', () => {
            cy.visit('/');
            cy.viewport(390, 736);
            cy.get('[data-testid="drupal-article-0"]')
                .should('exist')
                .contains('Rae and George Hammer memorial');
        });
        it('handles an error correctly', () => {
            cy.visit('/?responseType=drupalError');
            cy.viewport(1300, 1000);
            cy.get('[data-testid="drupal-error"]')
                .should('exist')
                .contains('No articles found');
        });
    });
    context('accessibility', () => {
        it('is accessible at 1300 1000', () => {
            cy.visit('/');
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
        it('is accessible at 550 750', () => {
            cy.visit('/');
            cy.injectAxe();
            cy.wait(2000);
            cy.viewport(550, 750);

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
