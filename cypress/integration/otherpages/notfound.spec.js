context('not found page accessibility', () => {
    it('unprivileged user on an admin-only page is accessible', () => {
        cy.visit('/admin/alerts?user=s1111111');
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('div[id="content-container"]').contains('Permission denied');
        cy.checkA11y('[data-testid="StandardPage"]', {
            reportName: 'Not found admin only',
            scopeName: 'Content',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
    });

    it('non-loggedin user on a page that requires login is accessible', () => {
        cy.visit('/courseresources?user=public');
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('div[id="content-container"]').contains('authenticated users only');
        cy.checkA11y('[data-testid="StandardPage"]', {
            reportName: 'Not found unauthorised',
            scopeName: 'Content',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
    });

    it('pages that arent available to all logged in users are accessible', () => {
        cy.visit('/courseresources?user=emcommunity');
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('div[id="content-container"]').contains('authorised users only');
        cy.checkA11y('[data-testid="StandardPage"]', {
            reportName: 'Not found unauthorised',
            scopeName: 'Content',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
    });

    it('genuine 404 is accessible', () => {
        cy.visit('/xxxxxx/?user=vanilla');
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('div[id="content-container"]').contains('Page not found');
        cy.checkA11y('[data-testid="StandardPage"]', {
            reportName: 'Not found 404',
            scopeName: 'Content',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
    });
});
context('authorisation errors', () => {
    it('page that requires Admin returns an error to unprivileged users', () => {
        cy.visit('/admin/alerts?user=s1111111');
        cy.viewport(1300, 1000);
        cy.get('h1').should('be.visible');
        cy.get('h1').contains('Permission denied');
    });
    it('page that isnt available to all logged in users returns an authorisation error for non privileged users', () => {
        cy.visit('/courseresources?user=emcommunity');
        cy.viewport(1300, 1000);
        cy.get('[data-testid=permission-denied]').should('exist');
        cy.get('body').contains('Permission denied');
    });
    it('page that requires Admin does not return a not found error to privileged users', () => {
        cy.visit('/admin/alerts?user=uqstaff');
        cy.viewport(1300, 1000);
        cy.get('[data-testid=page-not-found]').should('not.exist');
        cy.get('h1').should('not.contain', 'Permission denied');
    });
    it('page that isnt available to all logged in users does not return an authorisation error for privileged users', () => {
        cy.visit('/courseresources?user=s1111111');
        cy.viewport(1300, 1000);
        cy.get('[data-testid=permission-denied]').should('not.exist');
        cy.get('h1').should('not.contain', 'Permission denied');
    });
});
context('authentication errors', () => {
    it('page that requires login returns an authentication error for non-loggedin user', () => {
        cy.visit('/courseresources?user=public');
        cy.viewport(1300, 1000);
        cy.get('[data-testid=user-not-loggedin]').should('exist');
        cy.get('body').contains('Authentication required');
    });
    it('page that requires login does not return an authentication error for loggedin user', () => {
        cy.visit('/courseresources?user=uqstaff');
        cy.viewport(1300, 1000);
        cy.get('[data-testid=user-not-loggedin]').should('not.exist');
    });
});
context('404 errors', () => {
    it('an unknown page generates a not found error', () => {
        cy.visit('/thisPageDoesntExist?user=vanilla');
        cy.viewport(1300, 1000);
        cy.get('body').contains('The requested page could not be found.');
    });
});
