describe('Alerts Admin Pages', () => {
    context('Alert Admin List page', () => {
        it('displays an "unauthorised" page to public users', () => {
            cy.visit('http://localhost:2020/admin/alerts?user=public');
            cy.viewport(1300, 1000);
            cy.get('h2').should('be.visible');
            cy.get('h2').contains('Authentication required');
        });
        it('displays an "unauthorised" page to non-authorised users', () => {
            cy.visit('http://localhost:2020/admin/alerts?user=uqstaffnonpriv');
            cy.viewport(1300, 1000);
            cy.get('h2').should('be.visible');
            cy.get('h2').contains('Permission denied');
        });
        it('displays a list of alerts to the authorised user', () => {
            cy.visit('http://localhost:2020/admin/alerts?user=uqstaff');
            cy.viewport(1300, 1000);
            cy.get('[data-testid="admin-alerts-list-current-list"]').should('be.visible');
            cy.get('[data-testid="admin-alerts-list-current-list"] tbody')
                .children()
                .should('have.length', 1);

            cy.get('[data-testid="admin-alerts-list-future-list"]').should('be.visible');
            cy.get('[data-testid="admin-alerts-list-future-list"] tbody')
                .children()
                .should('have.length', 2);

            cy.get('[data-testid="admin-alerts-list-past-list"]').should('be.visible');
            cy.get('[data-testid="admin-alerts-list-past-list"] tbody ')
                .children()
                .should('have.length', 5);
            cy.get('[data-testid="admin-alerts-list-past-list"] tfoot').contains('1-5 of 81');
        });
        it('is accessible', () => {
            cy.visit('http://localhost:2020/admin/alerts?user=uqstaff');
            cy.injectAxe();
            cy.viewport(1300, 1000);
            cy.get('h3').should('be.visible');
            cy.get('h3').contains('All Alerts');
            cy.wait(500);
            cy.checkA11y('[data-testid="StandardPage"]', {
                reportName: 'Alerts Admin',
                scopeName: 'Content',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
        it('has a working help button on the List page', () => {
            cy.visit('http://localhost:2020/admin/alerts?user=uqstaff');
            cy.viewport(1300, 1000);
            cy.get('[data-testid="admin-alerts-list-help-example"]').should('not.exist');
            cy.get('[data-testid="admin-alerts-list-help-button"]').should('be.visible');
            cy.get('[data-testid="admin-alerts-list-help-button"]').click();
            cy.get('[data-testid="admin-alerts-list-help-example"]').should('be.visible');
        });

        it('Works as expected', () => {
            cy.visit('http://localhost:2020/admin/alerts?user=uqstaff');
            cy.viewport(1300, 1000);
            cy.get('tr[data-testid="alert-list-row-1db618c0-d897-11eb-a27e-df4e46db7245"]').within(() => {
                cy.get('td.alertText h4').contains('Important update:');
                cy.get('td.startDate').contains('Tuesday 29/Jun/2021 3pm'); // check formating
                cy.get('td.endDate').contains('Wednesday 2/Jul/2031 6.30pm');
            });
        });
    });
    context('Alert Admin Add page', () => {
        it('displays an "unauthorised" page to public users', () => {
            cy.visit('http://localhost:2020/admin/alerts/add?user=public');
            cy.viewport(1300, 1000);
            cy.get('h2').should('be.visible');
            cy.get('h2').contains('Authentication required');
        });
        it('displays an "unauthorised" page to non-authorised users', () => {
            cy.visit('http://localhost:2020/admin/alerts/add?user=uqstaffnonpriv');
            cy.viewport(1300, 1000);
            cy.get('h2').should('be.visible');
            cy.get('h2').contains('Permission denied');
        });
        it('is accessible', () => {
            cy.visit('http://localhost:2020/admin/alerts/add?user=uqstaff');
            cy.injectAxe();
            cy.viewport(1300, 1000);
            cy.get('h2').should('be.visible');
            cy.get('h2').contains('Create Alert');
            cy.wait(500);
            cy.checkA11y('[data-testid="StandardPage"]', {
                reportName: 'Alerts Admin Add',
                scopeName: 'Content',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
        it('can show a preview of an urgent non-permanent alert without link', () => {
            cy.visit('http://localhost:2020/admin/alerts/add?user=uqstaff');
            cy.viewport(1300, 1000);
            cy.get('uq-alert[id="alert-preview"]').should('not.exist');
            cy.get('[data-testid="admin-alerts-add-title"]').type('alert title');
            cy.get('[data-testid="admin-alerts-add-body"]').type('the body');
            cy.get('[data-testid="admin-alerts-add-checkbox-urgent"] input').check();
            cy.get('[data-testid="admin-alerts-add-button-preview"]').click();
            cy.get('uq-alert[id="alert-preview"]')
                .shadow()
                .within(() => {
                    cy.get('[data-testid="alert-title"]').should('have.text', 'alert title');
                    cy.get('[data-testid="alert-message"]').should('have.text', 'the body');
                    cy.get('[data-testid="alert-close"]').should('exist');
                    cy.get('[data-testid="alert-icon"] svg').should('have.attr', 'aria-label', 'Important alert.');
                });
        });
        it('can show a preview of a non-urgent permanent alert with link', () => {
            cy.visit('http://localhost:2020/admin/alerts/add?user=uqstaff');
            cy.viewport(1300, 1000);
            cy.get('uq-alert[id="alert-preview"]').should('not.exist');
            cy.get('[data-testid="admin-alerts-add-title"]').type('alert title 2');
            cy.get('[data-testid="admin-alerts-add-body"]').type('body 2');
            cy.get('[data-testid="admin-alerts-add-checkbox-permanent"] input').check();
            cy.get('[data-testid="admin-alerts-add-checkbox-linkrequired"] input').check();
            cy.get('[data-testid="admin-alerts-add-link-title"] input').type('Click here');
            cy.get('[data-testid="admin-alerts-add-link-url"] input').type('http://example.com');
            cy.get('[data-testid="admin-alerts-add-button-preview"]').click();
            cy.get('uq-alert[id="alert-preview"]')
                .shadow()
                .within(() => {
                    cy.get('[data-testid="alert-icon"] svg').should('have.attr', 'aria-label', 'Alert.');
                    cy.get('[data-testid="alert-title"]').should('have.text', 'alert title 2');
                    cy.get('[data-testid="alert-message"]').should('have.text', 'body 2');
                    cy.get('[data-testid="alert-close"]').should('not.exist');
                    cy.get(
                        '[data-testid="alert-alert-preview"] [data-testid="alert-alert-preview-action-button"]',
                    ).should('have.attr', 'title', 'Click here');
                });
        });
    });
});
