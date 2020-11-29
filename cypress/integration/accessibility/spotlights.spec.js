context('ACCESSIBILITY', () => {
    it('Spotlights', () => {
        cy.visit('/');
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.log('Spootlights');
        cy.get('img[alt="Academic Integrity Modules - Everything you need to know about academic integrity at UQ"]')
            .should('be.visible')
            .and($img => {
                expect($img[0].naturalWidth).to.be.greaterThan(0);
            });
        // TODO: Does not current pass
        // cy.checkA11y('div[data-testid="spotlights"]', {
        //     reportName: 'Spotlights',
        //     scopeName: 'As loaded',
        //     includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        // });
    });
});
