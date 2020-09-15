context('Primo Search', () => {
    it('Acts as expected', () => {
        cy.visit('/');
        cy.get('div#primo-search').contains('Search');
    });
});
