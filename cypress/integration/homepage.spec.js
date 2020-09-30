context('Homepage', () => {
    it('Renders something', () => {
        cy.visit('/');
        cy.viewport(1300, 1000);
        cy.get('div#content-container').contains('Search');
    });
});
