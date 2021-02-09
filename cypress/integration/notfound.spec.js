context('authorisation errors', () => {
    it('page that requires Admin returns a not found error to unprivileged users', () => {
        // masquerade may be a special case, but we dont have a better example atm
        // if we end up with other admin pages, swap this out
        cy.visit('/admin/masquerade/?user=s1111111');
        cy.viewport(1300, 1000);
        cy.get('[data-testid=page-not-found]').should('exist');
    });
    it('page that requires Admin does not return a not found error to privileged users', () => {
        // masquerade may be a special case, but we dont have a better example atm
        // if we end up with other admin pages, swap this out
        cy.visit('/admin/masquerade/?user=uqstaff');
        cy.viewport(1300, 1000);
        cy.get('[data-testid=page-not-found]').should('not.exist');
    });
    it('page that isnt available to all logged in users returns an authorisation error for non privileged users', () => {
        cy.visit('/courseresources?user=emcommunity');
        cy.viewport(1300, 1000);
        cy.get('[data-testid=permission-denied]').should('exist');
    });
    it('page that isnt available to all logged in users does not return an authorisation error for privileged users', () => {
        cy.visit('/courseresources?user=s1111111');
        cy.viewport(1300, 1000);
        cy.get('[data-testid=permission-denied]').should('not.exist');
    });
    it('page with an authorisation error has a working back button', () => {
        cy.visit('/?user=emcommunity'); // supply a page the back button can return to

        cy.visit('/courseresources?user=emcommunity');
        cy.get('body').contains('Permission denied');

        cy.get('button[data-testid=StandardPage-goback-button]').click();
        cy.url().should('eq', 'http://localhost:2020/?user=emcommunity');
    });
});
context('authentication errors', () => {
    it('page that requires login returns an authentication error for non-loggedin user', () => {
        cy.visit('/courseresources?user=public');
        cy.viewport(1300, 1000);
        cy.get('[data-testid=user-not-loggedin]').should('exist');
    });
    it('page that requires login does not return an authentication error for loggedin user', () => {
        cy.visit('/courseresources?user=uqstaff');
        cy.viewport(1300, 1000);
        cy.get('[data-testid=user-not-loggedin]').should('not.exist');
    });
    it('page with an authentication error has a working back button', () => {
        cy.visit('/?user=public'); // supply a page the back button can return to

        cy.visit('/courseresources?user=public');
        cy.get('body').contains('Authentication required');

        cy.get('button[data-testid=StandardPage-goback-button]').click();
        cy.url().should('eq', 'http://localhost:2020/?user=public');
        cy.wait(5000);
    });
});
context('404 errors', () => {
    it('an unknown page generates a not found error', () => {
        cy.visit('/thisPageDoesntExist?user=vanilla');
        cy.viewport(1300, 1000);
        cy.get('body').contains('The requested page could not be found.');
    });
    it('404 page has a working back button', () => {
        cy.visit('/?user=public'); // supply a page the back button can return to

        cy.visit('/thisPageDoesntExist?user=public');
        cy.viewport(1300, 1000);
        cy.get('body').contains('The requested page could not be found.');

        cy.get('button[data-testid=StandardPage-goback-button]').click();
        cy.url().should('eq', 'http://localhost:2020/?user=public');
    });
});
