context('AskUs', () => {
    it('Renders as expected', () => {
        cy.visit('/');
        cy.viewport(1300, 1000);
        cy.get('button[data-testid="mylibrary-button"]').contains('My library');
    });

    it('Shows correct menu for a vanilla user', () => {
        cy.visit('/');
        cy.viewport(1300, 1000);
        cy.get('button[data-testid="mylibrary-button"]').contains('My library');
        cy.get('button[data-testid="mylibrary-button"]').click();
        cy.get('ul[data-testid="mylibrary-menulist"]')
            .children()
            .should('have.length', 8);
    });

    it('Shows correct menu for a staff user', () => {
        cy.visit('/?user=uqstaff');
        cy.viewport(1300, 1000);
        cy.get('button[data-testid="mylibrary-button"]').contains('My library');
        cy.get('button[data-testid="mylibrary-button"]').click();
        cy.get('ul[data-testid="mylibrary-menulist"]')
            .children()
            .should('have.length', 10);
    });

    it('Shows correct menu for a non-loggedin user', () => {
        cy.visit('/?user=public');
        cy.viewport(1300, 1000);
        cy.get('button[data-testid="mylibrary-button"]').should('not.exist');
    });

    it('Shows correct menu for a researcher', () => {
        cy.visit('/?user=uqresearcher');
        cy.viewport(1300, 1000);
        cy.get('button[data-testid="mylibrary-button"]').contains('My library');
        cy.get('button[data-testid="mylibrary-button"]').click();
        cy.get('ul[data-testid="mylibrary-menulist"]')
            .children()
            .should('have.length', 8);
    });
});
