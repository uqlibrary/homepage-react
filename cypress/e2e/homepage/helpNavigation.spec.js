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
        context('loads the correct heights', () => {
            it('on a desktop width screen', () => {
                cy.visit('http://localhost:2020/?user=public');
                cy.viewport(1300, 1000);
                cy.get('[data-testid="help-navigation-panel"] li:first-child')
                    .should('exist')
                    .scrollIntoView()
                    // .contains('Find and Borrow')
                    .should('have.css', 'height', '104px'); // 6.5em @ 16px = 104
            });
            it('on a tablet screen, in portait mode', () => {
                cy.visit('http://localhost:2020/?user=public');
                cy.viewport(985, 1200);
                cy.get('[data-testid="help-navigation-panel"] li:first-child')
                    .should('exist')
                    .scrollIntoView()
                    // .contains('Find and Borrow')
                    .should('have.css', 'height', '128px'); // 8em @ 16px = 128
            });
            it('on a mobile, in portrait mode', () => {
                cy.visit('http://localhost:2020/?user=public');
                cy.viewport(390, 844);
                cy.get('[data-testid="help-navigation-panel"] li:first-child')
                    .should('exist')
                    .scrollIntoView()
                    // .contains('Find and Borrow')
                    .should('have.css', 'height', '104px'); // 6.5em @ 16px = 104
            });
        });
    });
});
