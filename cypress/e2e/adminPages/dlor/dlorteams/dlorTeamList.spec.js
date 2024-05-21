import { DLOR_ADMIN_USER } from '../../../../support/constants';

describe('Digital learning hub admin Teams management', () => {
    beforeEach(() => {
        cy.clearCookies();
    });

    context('Teams management', () => {
        beforeEach(() => {
            cy.visit(`http://localhost:2020/admin/dlor/team/manage?user=${DLOR_ADMIN_USER}`);
            cy.viewport(1300, 1000);
        });
        it('is accessible', () => {
            cy.injectAxe();
            cy.viewport(1300, 1000);
            cy.waitUntil(() => cy.get('h1').should('exist'));
            cy.get('h1').should('contain', 'Digital learning hub - Team Management');

            cy.checkA11y('[data-testid="StandardPage"]', {
                reportName: 'dlor teams management',
                scopeName: 'Content',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
        it('appears as expected', () => {
            // team name shows correctly
            cy.get('[data-testid="dlor-homepage-panel-1"]')
                .should('exist')
                .contains('LIB DX Digital Content');

            // only one delete buttons appears
            cy.get('[data-testid="dlor-homepage-delete-1"]').should('not.exist');
            cy.get('[data-testid="dlor-homepage-delete-2"]').should('exist');
            cy.get('[data-testid="dlor-homepage-delete-3"]').should('not.exist');

            // three edit buttons appears
            cy.get('[data-testid="dlor-homepage-edit-1"]').should('exist');
            cy.get('[data-testid="dlor-homepage-edit-2"]').should('exist');
            cy.get('[data-testid="dlor-homepage-edit-3"]').should('exist');
        });
        it('has a working "add a team" button', () => {
            cy.get('[data-testid="admin-dlor-visit-add-button"]')
                .should('exist')
                .should('contain', 'Add team')
                .click();
            cy.location('href').should('eq', `http://localhost:2020/admin/dlor/team/add?user=${DLOR_ADMIN_USER}`);
        });
        it('has a working "edit a team" button', () => {
            cy.get('[data-testid="dlor-homepage-edit-2"]')
                .should('exist')
                .click();
            cy.location('href').should('eq', `http://localhost:2020/admin/dlor/team/edit/2?user=${DLOR_ADMIN_USER}`);
        });
        it('can cancel deletion of a Team', () => {
            // click delete icon on first Object
            cy.get('[data-testid="dlor-homepage-delete-2"]')
                .should('exist')
                .click();
            // confirm delete box is open
            cy.get('[data-testid="dialogbox-dlor-team-delete-confirm"]')
                .should('exist')
                .contains('Do you want to delete this team?');
            // say "no, I dont want to delete" and the dialog just closes
            cy.get('[data-testid="cancel-dlor-team-delete-confirm"]')
                .should('exist')
                .click();
            cy.get('[data-testid="dialogbox-dlor-team-delete-confirm"]').should('not.exist');
        });
        it('can delete a team', () => {
            // click delete icon on first Object
            cy.get('[data-testid="dlor-homepage-delete-2"]')
                .should('exist')
                .click();
            // confirm delete box is open
            cy.get('[data-testid="dialogbox-dlor-team-delete-confirm"]')
                .should('exist')
                .contains('Do you want to delete this team?');
            // say "yes"
            cy.get('[data-testid="confirm-dlor-team-delete-confirm"]')
                .should('exist')
                .click();
            // cant really test it was deleted - that will happen in canary. just confirm the page reloads
            cy.get('[data-testid="dlor-teamlist-list"]')
                .should('exist')
                .children()
                .should('have.length', 3);
        });
    });
    context('user access', () => {
        it('displays an "unauthorised" page to public users', () => {
            cy.visit('http://localhost:2020/admin/dlor/team/manage?user=public');
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Authentication required');
        });
        it('displays an "unauthorised" page to non-authorised users', () => {
            cy.visit('http://localhost:2020/admin/dlor/team/manage?user=uqstaff');
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Permission denied');
        });
        it('displays correct page for admin users (list)', () => {
            cy.visit(`http://localhost:2020/admin/dlor/team/manage?user=${DLOR_ADMIN_USER}`);
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').should('contain', 'Digital learning hub - Team Management');
        });
    });
});
