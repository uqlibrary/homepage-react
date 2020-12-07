context('ACCESSIBILITY Megamenu', () => {
    it('Megamenu Desktop', () => {
        cy.visit('/');
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('[data-testid=main-menu]').contains('Library services');
        cy.log('Megamenu Desktop');
        // open first menu
        cy.get('[data-testid=submenus-item-0').click();
        cy.checkA11y('[data-testid=main-menu]', {
            reportName: 'Megamenu',
            scopeName: 'Content',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
    });

    it('Megamenu Mobile', () => {
        cy.viewport(414, 736);
        cy.get('[data-testid=mobile-menu]');
        cy.log('Megamenu mobile');
        // open menu
        cy.get('[data-testid=mobile-menu]').click();
        cy.checkA11y('[data-testid=mobile-menu]', {
            reportName: 'Megamenu',
            scopeName: 'Content',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
    });
});
