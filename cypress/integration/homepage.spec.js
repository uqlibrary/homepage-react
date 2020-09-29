context('Homepage', () => {
    it('Renders something', () => {
        cy.visit('/');
        cy.get('div#content-container').contains('Search');
    });
});
