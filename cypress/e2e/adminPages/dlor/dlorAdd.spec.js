const REQUIRED_LENGTH_TITLE = 10;
const REQUIRED_LENGTH_DESCRIPTION = 100;
const REQUIRED_LENGTH_SUMMARY = 20;
describe('Digital Object learning Repository (DLOR)', () => {
    beforeEach(() => {
        cy.clearCookies();
        cy.setCookie('UQ_CULTURAL_ADVICE', 'hidden');
    });

    const mockDlorAdminUser = 'dloradmin';
    context('adding a new object', () => {
        context('successfully', () => {
            beforeEach(() => {
                cy.visit(`http://localhost:2020/admin/dlor/add?user=${mockDlorAdminUser}`);
                cy.viewport(1300, 1000);
            });
            it('is accessible', () => {
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
            it('validates fields correctly', () => {
                cy.get('[data-testid="admin-dlor-add-button-submit"]')
                    .should('exist')
                    .should('be.disabled');
                cy.get('[data-testid="object_title"] input')
                    .should('exist')
                    .type('new title'.padEnd(REQUIRED_LENGTH_TITLE, 'x'));
                cy.get('[data-testid="admin-dlor-add-button-submit"]')
                    .should('exist')
                    .should('be.disabled');
                cy.get('[data-testid="object_description"] textarea:first-child')
                    .should('exist')
                    .type('new description '.padEnd(REQUIRED_LENGTH_DESCRIPTION, 'x'));
                cy.get('[data-testid="admin-dlor-add-button-submit"]')
                    .should('exist')
                    .should('be.disabled');
                cy.get('[data-testid="object_summary"] textarea:first-child')
                    .should('exist')
                    .type('new summary '.padEnd(REQUIRED_LENGTH_SUMMARY, 'x'));
                cy.get('[data-testid="admin-dlor-add-button-submit"]')
                    .should('exist')
                    .should('not.be.disabled');

                // and it validates on each field
                cy.get('[data-testid="object_title"] input')
                    .should('exist')
                    .type('{backspace}');
                cy.get('[data-testid="admin-dlor-add-button-submit"]')
                    .should('exist')
                    .should('be.disabled');
                cy.get('[data-testid="object_title"] input')
                    .should('exist')
                    .type('p');
                cy.get('[data-testid="admin-dlor-add-button-submit"]')
                    .should('exist')
                    .should('not.be.disabled');

                cy.get('[data-testid="object_description"] textarea:first-child')
                    .should('exist')
                    .type('{backspace}');
                cy.get('[data-testid="admin-dlor-add-button-submit"]')
                    .should('exist')
                    .should('be.disabled');
                cy.get('[data-testid="object_description"] textarea:first-child')
                    .should('exist')
                    .type('p');
                cy.get('[data-testid="admin-dlor-add-button-submit"]')
                    .should('exist')
                    .should('not.be.disabled');

                cy.get('[data-testid="object_summary"] textarea:first-child')
                    .should('exist')
                    .type('{backspace}');
                cy.get('[data-testid="admin-dlor-add-button-submit"]')
                    .should('exist')
                    .should('be.disabled');
                cy.get('[data-testid="object_summary"] textarea:first-child')
                    .should('exist')
                    .type('p');
                cy.get('[data-testid="admin-dlor-add-button-submit"]')
                    .should('exist')
                    .should('not.be.disabled');

                cy.get('[data-testid="object_publishing_user"] input')
                    .should('exist')
                    .type('{backspace}')
                    .type('{backspace}');
                cy.get('[data-testid="admin-dlor-add-button-submit"]')
                    .should('exist')
                    .should('be.disabled');
                cy.get('[data-testid="object_publishing_user"] input')
                    .should('exist')
                    .type('p');
                cy.get('[data-testid="admin-dlor-add-button-submit"]')
                    .should('exist')
                    .should('not.be.disabled');
            });
            it('shows character minimums', () => {
                cy.get('[data-testid="object_title"] input')
                    .should('exist')
                    .type('123');
                cy.get('[data-testid="input-characters-remaining-object_title"]')
                    .should('exist')
                    .should('contain', '7 more characters needed');
                cy.get('[data-testid="object_description"] textarea:first-child')
                    .should('exist')
                    .type('new description');
                cy.get('[data-testid="input-characters-remaining-object_description"]')
                    .should('exist')
                    .should('contain', '85 more characters needed');
                cy.get('[data-testid="object_summary"] textarea:first-child')
                    .should('exist')
                    .type('new summary');
                cy.get('[data-testid="input-characters-remaining-object_summary"]')
                    .should('exist')
                    .should('contain', '9 more characters needed');
            });
            it('admin can save a new object', () => {
                cy.get('[data-testid="object_title"] input')
                    .should('exist')
                    .type('new title'.padEnd(REQUIRED_LENGTH_TITLE, 'x'));
                cy.get('[data-testid="object_description"] textarea:first-child')
                    .should('exist')
                    .type('new description '.padEnd(REQUIRED_LENGTH_DESCRIPTION, 'x'));
                cy.get('[data-testid="object_summary"] textarea:first-child')
                    .should('exist')
                    .type('new summary '.padEnd(REQUIRED_LENGTH_SUMMARY, 'x'));
                cy.get('[data-testid="admin-dlor-add-button-submit"]')
                    .should('exist')
                    .click();
                cy.waitUntil(() => cy.get('[data-testid="dialogbox-dlor-creation-outcome"]').should('exist'));
                cy.get('[data-testid="dialogbox-dlor-creation-outcome"] h2').contains('The object has been created');
            });
        });
        context('fails correctly', () => {
            it('admin gets an error when Teams list api doesnt load', () => {
                cy.visit(`http://localhost:2020/admin/dlor/add?user=${mockDlorAdminUser}&responseType=teamsLoadError`);
                // "responseType=teamsLoadError" on the url forces an error from mock api
                cy.get('[data-testid="dlor-addObject-error"]').contains('Error has occurred during request');
            });
            it('admin gets an error on a failed save', () => {
                cy.visit(`http://localhost:2020/admin/dlor/add?user=${mockDlorAdminUser}&responseType=saveError`);
                cy.get('[data-testid="object_title"] input')
                    .should('exist')
                    .type('new title'.padEnd(REQUIRED_LENGTH_TITLE, 'x'));
                cy.get('[data-testid="object_description"] textarea:first-child')
                    .should('exist')
                    .type('new description '.padEnd(REQUIRED_LENGTH_DESCRIPTION, 'x'));
                cy.get('[data-testid="object_summary"] textarea:first-child')
                    .should('exist')
                    .type('new summary '.padEnd(REQUIRED_LENGTH_SUMMARY, 'x'));
                cy.get('[data-testid="admin-dlor-add-button-submit"]')
                    .should('exist')
                    .click();
                // "responseType=saveError" on the url forces an error from mock api
                cy.waitUntil(() => cy.get('[data-testid="dialogbox-dlor-creation-outcome"]').should('exist'));
                cy.get('[data-testid="dialogbox-dlor-creation-outcome"] h2').contains(
                    'Error has occurred during request',
                );
            });
        });
    });
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
});
