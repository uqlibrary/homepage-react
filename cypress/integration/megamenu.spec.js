import menu from '../../src/locale/menu';

context('Megamenu', () => {
    it('Megamenu Mobile', () => {
        cy.visit('/');
        cy.viewport(414, 736);
        cy.log('Megamenu mobile');

        // open menu via hamburger button
        cy.get('[data-testid=mobile-menu]')
            .contains('Menu')
            .click();
        // open first menu
        cy.get('[data-testid=megamenu-submenus-item-0]').click();

        cy.get('[data-testid=megamenu-group-1-item-1]').contains(menu.publicmenu[0].submenuItems[1].primaryText);

        // open a lower menu
        cy.get('[data-testid=megamenu-submenus-item-4]').click();
        // the screen should scroll up and show the full menus, otherwise we often end with the menu off screen
        cy.get('div[data-testid="megamenu-submenus-item-0"]').should('be.visible');

        // close the hamburger menu
        cy.get('[data-testid=mobile-menu]')
            .contains('Menu')
            .click();

        // menu items no longer available
        cy.get('[data-testid=mega-menu-empty]').should('have.length', 1);
    });

    it('Megamenu Desktop', () => {
        cy.visit('/');
        cy.viewport(1300, 1000);
        cy.log('Megamenu Desktop');

        cy.get('[data-testid=main-menu]').contains('Library services');

        // open first menu
        cy.get('[data-testid=megamenu-submenus-item-0').click();
        cy.get('[data-testid=megamenu-group-1-item-0]').should('be.visible');

        // menus close when user tabs out of end of menu or
        // shift-tabs out of the beginning of a menu and then off the header
        // tbd - cypress support coming https://github.com/cypress-io/cypress/issues/299

        // a menu can be closed with an escape key click
        cy.get('[data-testid=megamenu-submenus-item-0]').type('{esc}', { force: true });
        cy.get('[data-testid=megamenu-group-1-item-0]').should('not.be.visible');

        // the menu items contain the correct labels
        cy.get('[data-testid=megamenu-submenus-item-0]')
            .contains(menu.publicmenu[0].primaryText)
            .click();
        cy.get('[data-testid=megamenu-group-1-item-0] span').contains(menu.publicmenu[0].submenuItems[0].secondaryText);
        cy.get('[data-testid=megamenu-group-1-item-0]')
            .contains(menu.publicmenu[0].submenuItems[0].primaryText)
            .click();

        // this isnt working yet (unsure why)
        // just check the domain - less likely to change and good enough as most menu items go there
        // cy.url().should('include', 'web.library.uq.edu.au');
        // .should('have.attr', 'href')
        // .and('include', 'web.library.uq.edu.au');
    });
});
