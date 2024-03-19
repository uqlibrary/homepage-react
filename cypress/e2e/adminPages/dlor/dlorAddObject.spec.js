describe('Digital Object learning Repository (DLOR)', () => {
    beforeEach(() => {
        cy.clearCookies();
        cy.setCookie('UQ_CULTURAL_ADVICE', 'hidden');
    });

    const mockDlorAdminUser = 'dloradmin';
    context('user access', () => {
        it('displays an "unauthorised" page to public users', () => {
            cy.visit('http://localhost:2020/admin/dlor/add?user=public');
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Authentication required');
        });
        it('displays an "unauthorised" page to non-authorised users', () => {
            cy.visit('http://localhost:2020/admin/dlor/add?user=uqstaff');
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Permission denied');
        });
        it('displays correct page for admin users (list)', () => {
            cy.visit(`http://localhost:2020/admin/dlor/add?user=${mockDlorAdminUser}`);
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').should('contain', 'DLOR Management');
        });
    });
    context('adding a new object', () => {
        it('is accessible', () => {
            cy.visit(`http://localhost:2020/admin/dlor/add?user=${mockDlorAdminUser}`);
            cy.injectAxe();
            cy.viewport(1300, 1000);
            cy.waitUntil(() => cy.get('h1').should('exist'));
            cy.get('h1').should('contain', 'DLOR Management');

            cy.checkA11y('[data-testid="StandardPage"]', {
                reportName: 'add dlor',
                scopeName: 'Content',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
        it('admin can save a new object', () => {
            cy.visit(`http://localhost:2020/admin/dlor/add?user=${mockDlorAdminUser}`);
            cy.get('[data-testid="object_title"] input')
                .should('exist')
                .type('new title');
            cy.get('[data-testid="object_description"] textarea:first-child')
                .should('exist')
                .type('new description');
            cy.get('[data-testid="object_summary"] textarea:first-child')
                .should('exist')
                .type('new summary');
            cy.get('[data-testid="admin-dlor-add-button-submit"]')
                .should('exist')
                .click();
            cy.waitUntil(() => cy.get('[data-testid="dialogbox-dlor-creation-outcome"]').should('exist'));
            cy.get('[data-testid="dialogbox-dlor-creation-outcome"] h2').contains('The object has been created');
        });
        it('admin gets an error when Teams list api doesnt load', () => {
            cy.visit(`http://localhost:2020/admin/dlor/add?user=${mockDlorAdminUser}&responseType=teamsLoadError`);
            cy.get('[data-testid="dlor-addObject-error"]').contains('Error has occurred during request');
        });
        it('admin gets an error on a failed save', () => {
            cy.visit(`http://localhost:2020/admin/dlor/add?user=${mockDlorAdminUser}&responseType=saveError`);
            cy.get('[data-testid="object_title"] input')
                .should('exist')
                .type('new title');
            cy.get('[data-testid="object_description"] textarea:first-child')
                .should('exist')
                .type('new description');
            cy.get('[data-testid="object_summary"] textarea:first-child')
                .should('exist')
                .type('new summary');
            cy.get('[data-testid="admin-dlor-add-button-submit"]')
                .should('exist')
                .click();
            cy.waitUntil(() => cy.get('[data-testid="dialogbox-dlor-creation-outcome"]').should('exist'));
            cy.get('[data-testid="dialogbox-dlor-creation-outcome"] h2').contains('Error has occurred during request');
        });
    });
});
