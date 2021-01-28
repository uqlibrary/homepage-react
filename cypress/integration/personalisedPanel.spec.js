context('Header', () => {
    it('location button changes location', () => {
        cy.visit('/');
        cy.viewport(1300, 1000);

        // page is initialised as default
        cy.get('[data-testid=computers-wiggler]').should('not.exist');
        cy.get('[data-testid=hours-wiggler]').should('not.exist');
        cy.get('[data-testid=computers-library-button-0]').contains('Architecture');
        cy.get('[data-testid=hours-item-0]').contains('Arch Music');

        // select a location in the Personalised Panel location selector
        cy.get('[data-testid=location]')
            .contains('Set a preferred campus')
            .click();
        cy.get('[data-testid=location-option-1]')
            .contains('St Lucia')
            .click();

        // a wiggling location button displays in both these panels
        cy.get('[data-testid=computers-wiggler]').should('exist');
        cy.get('[data-testid=hours-wiggler]').should('exist');

        // after a bit the wiggler goes away
        cy.wait(6000);
        cy.get('[data-testid=computers-wiggler]').should('not.exist');
        cy.get('[data-testid=hours-wiggler]').should('not.exist');
    });
});
