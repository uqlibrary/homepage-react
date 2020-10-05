context('ACCESSIBILITY Megamenu', () => {
    it('Megamenu Desktop', () => {
        cy.visit('/');
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('[data-testid=mainMenu]').contains('Library services');
        cy.log('Megamenu Desktop');
        // open first menu
        cy.get('#mainMenu span:first-child div:first-child div span').click();
        cy.checkA11y('[data-testid=mainMenu]', {
            reportName: 'Megamenu',
            scopeName: 'Content',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
    });

    it('Megamenu Mobile', () => {
        cy.viewport(414, 736);
        cy.get('[data-testid=hamburger]');
        cy.log('Megamenu mobile');
        // open first menu
        cy.get('[data-testid=hamburger]').click();
        cy.checkA11y('[data-testid=hamburger]', {
            reportName: 'Megamenu',
            scopeName: 'Content',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
    });
});
