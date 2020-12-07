context('ACCESSIBILITY', () => {
    it('Spotlights', () => {
        cy.visit('/');
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.log('Spootlights navigation tests');
        cy.get(
            '[alt="Academic Integrity Modules - Everything you need to know about academic integrity at UQ"]',
        ).should('be.visible');
    });
});
