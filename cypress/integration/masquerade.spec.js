context('ACCESSIBILITY', () => {
    it('Homepage Admin', () => {
        cy.visit('/admin/masquerade?user=uqstaff');
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('div#masquerade').contains('Masquerade');
        cy.log('Masquerade');
        cy.checkA11y('div#masquerade', {
            reportName: 'Masquerade',
            scopeName: 'Content',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
    });

    it('Homepage Readonly', () => {
        cy.visit('/admin/masquerade?user=uqmasquerade');
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('div#masquerade').contains('Masquerade');
        cy.log('Masquerade');
        cy.checkA11y('div#masquerade', {
            reportName: 'Masquerade',
            scopeName: 'Content',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
    });
});
context('Masquerade', () => {
    it('unprivileged users cant masquerade', () => {
        cy.visit('/admin/masquerade?user=s1111111');
        cy.viewport(1300, 1000);
        cy.get('body').contains('The requested page is available to authorised users only.');
    });

    it('readonly users can masquerade', () => {
        cy.visit('/admin/masquerade/?user=uqmasquerade');
        cy.viewport(1300, 1000);
        cy.get('#userName').type('s1111111');
        cy.get('button')
            .contains('Masquerade')
            .click();
        cy.url().should('include', 'https://auth.library.uq.edu.au/masquerade?user=s1111111');
    });

    it('admin users can masquerade', () => {
        cy.visit('/admin/masquerade/?user=uqstaff');
        cy.viewport(1300, 1000);
        cy.get('#userName').type('s1111111');
        cy.get('button')
            .contains('Masquerade')
            .click();
        cy.url().should('include', 'https://auth.library.uq.edu.au/masquerade?user=s1111111');
    });

    it('has a working back button', () => {
        cy.visit('/?user=uqstaff'); // supply a page the back button can return to

        cy.visit('/admin/masquerade/?user=uqstaff');
        cy.get('body').contains('When masquerading');

        cy.get('button[data-testid=StandardPage-goback-button]').click();
        cy.url().should('eq', 'http://localhost:2020/?user=uqstaff');
    });
});
