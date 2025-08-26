context('Masquerade', () => {
    it('Masquerade Admin Accessibility', () => {
        cy.visit('/admin/masquerade?user=uqstaff');
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('[data-testid="masquerade"]').contains('Masquerade');
        cy.log('Masquerade');
        cy.checkA11y('[data-testid="masquerade"]', {
            reportName: 'Masquerade',
            scopeName: 'Content',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
    });

    it('Masquerade Readonly Accessibility', () => {
        cy.visit('/admin/masquerade?user=uqmasquerade');
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('[data-testid="masquerade"]').contains('Masquerade');
        cy.log('Masquerade');
        cy.checkA11y('[data-testid="masquerade"]', {
            reportName: 'Masquerade',
            scopeName: 'Content',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
    });

    it('unprivileged users cant masquerade', () => {
        cy.visit('/admin/masquerade?user=s1111111');
        cy.viewport(1300, 1000);
        cy.get('body').contains('The requested page is available to authorised users only.');
    });

    // we cant really test the masquerade works, checking we hit auth is really as far as we can go, but its something
    it('readonly users can masquerade', () => {
        cy.intercept('GET', /auth.library.uq.edu.au/, {
            statusCode: 200,
            body: 'user has navigated to auth for readonly',
        });

        cy.visit('/admin/masquerade/?user=uqmasquerade');
        cy.viewport(1300, 1000);
        cy.get('[data-testid="masquerade-userName"]').type('s1111111');
        cy.get('button')
            .contains('Masquerade')
            .click();
        cy.get('body').contains('user has navigated to auth for readonly');
    });

    // we cant really test the masquerade works, checking we hit auth is really as far as we can go, but its something
    it('admin users can masquerade', () => {
        cy.intercept('GET', /auth.library.uq.edu.au/, {
            statusCode: 200,
            body: 'user has navigated to auth for admin',
        });

        cy.visit('/admin/masquerade/?user=uqstaff');
        cy.viewport(1300, 1000);
        cy.get('body').contains('When masquerading');
        cy.get('[data-testid="masquerade-userName"]').type('s1111111');
        cy.get('button')
            .contains('Masquerade')
            .click();
        cy.get('body').contains('user has navigated to auth for admin');
    });
});
