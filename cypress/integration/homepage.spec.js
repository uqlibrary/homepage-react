context('Homepage', () => {
    const checkMenuItemCount = expectedCount => {
        cy.get('button[aria-label="Click to open the main navigation"]').click();
        cy.get('nav#mainMenu')
            .get('div[role="button"]')
            .should('have.length', expectedCount);
    };

    it('Renders the tabbed panes as expected', () => {
        cy.visit('/');
        checkMenuItemCount(9);
    });
});
