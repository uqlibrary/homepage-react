// import componentsLocale from '../../src/locale/components';

context('Megamenu', () => {
    it('Megamenu Mobile', () => {
        cy.visit('/');
        cy.viewport(414, 736);
        cy.get('[data-testid=hamburger]');
        cy.log('Megamenu mobile');
        // open menu via hamburger button
        cy.get('[data-testid=hamburger]').click();
        // open first menu
        // cy.get('#mainMenu span:first-child div:first-child div span').click();
        cy.get('[data-testid=submenus-item-0]').click();
        // if the menu locale changes, the contains text may need updating
        cy.get('[data-testid=menu-group-1-item-1]').contains('for Researchers');
        // close sub menu so the Close button isnt covered up
        cy.get('[data-testid=submenus-item-0]').click();

        cy.get('[data-testid=submenus-item-close]').contains('Close');
        cy.get('[data-testid=submenus-item-close]').click();
    });

    it('Megamenu Desktop', () => {
        cy.visit('/');
        cy.viewport(1300, 1000);
        cy.get('[data-testid=mainMenu]').contains('Library services');
        cy.log('Megamenu Desktop');
        // open first menu
        cy.get('[data-testid=submenus-item-0').click();
        // if the menu locale changes, this test may need updating
        cy.get('[data-testid=menu-group-1-item-0')
            .contains('for Students')
            .click();
        // just check the domain - less likely to change and good enough as most menu items go there
        cy.url().should('include', 'web.library.uq.edu.au');
        // .should('have.attr', 'href')
        // .and('include', 'web.library.uq.edu.au');
    });
});
