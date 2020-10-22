context('Not found (404)', () => {
    it('page that requires Admin returns an error to unprivileged users', () => {
        // masquerade may be a special case, but we dont have a better example atm
        // if we end up with other admin pages, swap this out
        cy.visit('/admin/masquerade/?user=s1111111');
        cy.viewport(1300, 1000);
        cy.get('body').contains('The requested page could not be found.');
    });

    it('pages that require login return an error for non-loggedin user', () => {
        cy.visit('/courseresources?user=public');
        cy.viewport(1300, 1000);
        cy.get('body').contains('The requested page is available to authorised users only.');
    });

    it('a missing page generates an error', () => {
        cy.visit('/xxxxxx/?user=vanilla');
        cy.viewport(1300, 1000);
        cy.get('body').contains('The requested page could not be found.');
    });
});
