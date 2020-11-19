context('Homepage Search Panel', () => {
    it('Acts as expected', () => {
        cy.visit('/');
        cy.viewport(1300, 1000);
        cy.get('form[data-testid="primo-search"]').contains('Search');
        cy.get('div[data-testid="primo-search-select"]').click();
        cy.get('li[data-testid="primo-search-item-0"]')
            .parent()
            .find('li')
            .its('length')
            .should('eq', 9);
        cy.get('li[data-testid="primo-search-item-0"]').click();
        cy.get('div[data-testid="primo-search-links"]')
            .find('div')
            .its('length')
            .should('eq', 4 + 1);

        cy.get('div[data-testid="primo-search-select"]').click();
        cy.get('li[data-testid="primo-search-item-6"]').click();
        cy.get('div[data-testid="primo-search-links"]')
            .find('div')
            .its('length')
            .should('eq', 2 + 1);

        cy.get('div[data-testid="primo-search-select"]').click();
        cy.get('li[data-testid="primo-search-item-7"]').click();
        cy.get('div[data-testid="primo-search-links"]')
            .find('div')
            .its('length')
            .should('eq', 1 + 1);

        cy.get('div[data-testid="primo-search-select"]').click();
        cy.get('li[data-testid="primo-search-item-8"]').click();
        cy.get('div[data-testid="primo-search-links"]')
            .find('div')
            .its('length')
            .should('eq', 1 + 1);

        cy.get('input[data-testid="primo-search-autocomplete-input"]').type('acct', 100);
        cy.get('ul[data-testid="primo-search-autocomplete-listbox"]')
            .find('li')
            .its('length')
            .should('eq', 10);

        cy.get('div[data-testid="primo-search-select"]').click();
        cy.get('li[data-testid="primo-search-item-0"]').click();
        cy.get('button[data-testid="primo-search-voice-clear"]').click();
        cy.get('input[data-testid="primo-search-autocomplete-input"]').type('beard', 100);
        cy.get('ul[data-testid="primo-search-autocomplete-listbox"]')
            .find('li')
            .its('length')
            .should('eq', 10);

        cy.get('div[data-testid="primo-search-select"]').click();
        cy.get('li[data-testid="primo-search-item-7"]').click();
        cy.get('button[data-testid="primo-search-voice-clear"]').click();
        cy.get('input[data-testid="primo-search-autocomplete-input"]').type('acct', 100);
        cy.get('ul[data-testid="primo-search-autocomplete-listbox"]')
            .find('li')
            .its('length')
            .should('eq', 21);
    });
});
