context('Not found (404)', () => {
    it('page that requires Admin returns a not found error to unprivileged users', () => {
        cy.visit('/?user=s1111111'); // supply a page the back button can return to

        // masquerade may be a special case, but we dont have a better example atm
        // if we end up with other admin pages, swap this out
        cy.visit('/admin/masquerade/?user=s1111111');
        cy.viewport(1300, 1000);
        cy.get('body').contains('The requested page could not be found.');

        cy.get('button[data-testid=StandardPage-goback-button]').click();
        cy.url().should('eq', 'http://localhost:2020/?user=s1111111');
    });

    it('page that requires login returns an authentication error for non-loggedin user', () => {
        cy.visit('/?user=public'); // supply a page the back button can return to

        cy.visit('/courseresources?user=public');
        cy.viewport(1300, 1000);
        cy.get('body').contains('The requested page is available to authenticated users only.');

        cy.get('button[data-testid=StandardPage-goback-button]').click();
        cy.url().should('eq', 'http://localhost:2020/?user=public');
        cy.wait(5000);
    });

    it('page that isnt available to all logged in users returns an authorisation error', () => {
        cy.visit('/?user=emcommunity'); // supply a page the back button can return to

        cy.visit('/courseresources?user=emcommunity');
        cy.viewport(1300, 1000);
        cy.get('body').contains('The requested page is available to authorised users only.');

        cy.get('button[data-testid=StandardPage-goback-button]').click();
        cy.url().should('eq', 'http://localhost:2020/?user=emcommunity');
        cy.wait(5000);
    });

    it('an unknown page generates a not found error', () => {
        cy.visit('/?user=vanilla'); // supply a page the back button can return to

        cy.visit('/thisPageDoesntExist?user=vanilla');
        cy.viewport(1300, 1000);
        cy.get('body').contains('The requested page could not be found.');

        cy.get('button[data-testid=StandardPage-goback-button]').click();
        cy.url().should('eq', 'http://localhost:2020/?user=vanilla');
    });
});
