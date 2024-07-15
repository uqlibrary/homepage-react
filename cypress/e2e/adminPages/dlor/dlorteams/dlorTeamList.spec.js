import { DLOR_ADMIN_USER } from '../../../../support/constants';

describe('Digital Learning Hub admin Teams management', () => {
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
            cy.get('h1').should('contain', 'Digital Learning Hub - Team management');

            cy.checkA11y('[data-testid="StandardPage"]', {
                reportName: 'dlor teams management',
                scopeName: 'Content',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
        it('loads as expected', () => {
            cy.get('uq-site-header')
                .shadow()
                .within(() => {
                    cy.get('[data-testid="subsite-title"]')
                        .should('exist')
                        .should('be.visible')
                        .contains('Digital learning hub admin');
                });
            cy.get('a[data-testid="dlor-breadcrumb-admin-homelink"]')
                .contains('Digital Learning Hub admin')
                .should('have.attr', 'href', `http://localhost:2020/admin/dlor?user=${DLOR_ADMIN_USER}`);
            cy.get('[data-testid="dlor-breadcrumb-team-management-label-0"]').contains('Team management');

            // team name shows correctly
            cy.get('[data-testid="dlor-teamlist-panel-1"]')
                .should('exist')
                .contains('LIB DX Digital Content');

            // only one delete buttons appears
            cy.get('[data-testid="dlor-teamlist-delete-1"]').should('not.exist');
            cy.get('[data-testid="dlor-teamlist-delete-2"]').should('not.exist');
            cy.get('[data-testid="dlor-teamlist-delete-3"]').should('exist');

            // three edit buttons appears
            cy.get('[data-testid="dlor-teamlist-edit-1"]').should('exist');
            cy.get('[data-testid="dlor-teamlist-edit-2"]').should('exist');
            cy.get('[data-testid="dlor-teamlist-edit-3"]').should('exist');

            // object counts are correct
            cy.get('[data-testid="dlor-team-object-list-1"]')
                .should('exist')
                .contains('21 Objects');
            cy.get('[data-testid="dlor-team-object-list-2"]')
                .should('exist')
                .contains('3 Objects');
            cy.get('[data-testid="dlor-team-object-list-3"]').should('not.exist');
        });
        it('has a working "view a dlor" button', () => {
            // can open a list and click view an object
            cy.get('[data-testid="dlor-team-object-list-1"] summary')
                .should('exist')
                .click();
            cy.get('[data-testid="dlor-team-object-list-item-view-1"]')
                .should('exist')
                .click();
            cy.url().should('eq', 'http://localhost:2020/digital-learning-hub/view/987y_isjgt_9866?user=dloradmn');
        });
        it('has a working "edit a dlor" button', () => {
            // can open a list and click edit
            cy.get('[data-testid="dlor-team-object-list-1"] summary')
                .should('exist')
                .click();
            cy.get('[data-testid="dlor-team-object-list-item-1"]')
                .should('exist')
                .click();
            cy.url().should('eq', 'http://localhost:2020/admin/dlor/edit/987y_isjgt_9866?user=dloradmn');
        });
        it('has a working "add a team" button', () => {
            cy.get('[data-testid="admin-dlor-visit-add-button"]')
                .should('exist')
                .should('contain', 'Add team')
                .click();
            cy.location('href').should('eq', `http://localhost:2020/admin/dlor/team/add?user=${DLOR_ADMIN_USER}`);
        });
        it('has a working "edit a team" button', () => {
            cy.get('[data-testid="dlor-teamlist-edit-2"]')
                .should('exist')
                .click();
            cy.location('href').should('eq', `http://localhost:2020/admin/dlor/team/edit/2?user=${DLOR_ADMIN_USER}`);
        });
        it('can cancel deletion of a Team', () => {
            // click delete icon on first Object
            cy.get('[data-testid="dlor-teamlist-delete-3"]')
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
            cy.get('[data-testid="dlor-teamlist-delete-3"]')
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

            // it worked!
            cy.waitUntil(() => cy.get('[data-testid="dialogbox-dlor-team-delete-confirm"]').should('be.visible'));
            cy.get('[data-testid="dialogbox-dlor-team-delete-confirm"] h2').contains('The team has been deleted.');
            cy.get('[data-testid="cancel-dlor-team-delete-confirm"]').should('not.exist');
            cy.get('[data-testid="confirm-dlor-team-delete-confirm"]')
                .should('exist')
                .contains('Close');

            cy.get('[data-testid="confirm-dlor-team-delete-confirm"]').click();

            // cant really test it was deleted - that will happen in canary. just confirm the page reloads
            cy.get('[data-testid="dlor-teamlist-list"]')
                .should('exist')
                .children()
                .should('have.length', 4);

            // a second delte throw up the correct dialog boxes
            // (and doesnt think it is already done
            cy.get('[data-testid="dlor-teamlist-delete-4"]')
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

            // it worked!
            cy.waitUntil(() => cy.get('[data-testid="dialogbox-dlor-team-delete-confirm"]').should('be.visible'));
            cy.get('[data-testid="dialogbox-dlor-team-delete-confirm"] h2').contains('The team has been deleted.');
            cy.get('[data-testid="cancel-dlor-team-delete-confirm"]').should('not.exist');
            cy.get('[data-testid="confirm-dlor-team-delete-confirm"]')
                .should('exist')
                .contains('Close');

            cy.get('[data-testid="confirm-dlor-team-delete-confirm"]').click();
        });
    });
    context('failed actions', () => {
        it('a failed api load shows correctly', () => {
            cy.visit(
                `http://localhost:2020/admin/dlor/team/manage?user=${DLOR_ADMIN_USER}&responseType=teamsLoadError`,
            );
            cy.viewport(1300, 1000);
            cy.waitUntil(() => cy.get('[data-testid="dlor-teamlist-error"]').should('exist'));
            cy.get('[data-testid="dlor-teamlist-error"]').contains('An error has occurred during the request');
        });
        it('a failed deletion is handled properly', () => {
            cy.visit(`http://localhost:2020/admin/dlor/team/manage?user=${DLOR_ADMIN_USER}&responseType=saveError`);
            cy.viewport(1300, 1000);
            // click delete icon on first Object
            cy.get('[data-testid="dlor-teamlist-delete-3"]')
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

            // it failed! just what we wanted :)
            cy.waitUntil(() => cy.get('[data-testid="dialogbox-dlor-team-delete-confirm"]').should('be.visible'));
            cy.get('[data-testid="dialogbox-dlor-team-delete-confirm"] h2').contains(
                'An error has occurred during the request and this request cannot be processed.',
            );
            cy.get('[data-testid="cancel-dlor-team-delete-confirm"]').should('not.exist');
            cy.get('[data-testid="confirm-dlor-team-delete-confirm"]')
                .should('exist')
                .contains('Close');
            cy.get('[data-testid="confirm-dlor-team-delete-confirm"]').click();

            // cant really test it was deleted - that will happen in canary. just confirm the page reloads
            cy.get('[data-testid="dlor-teamlist-list"]')
                .should('exist')
                .children()
                .should('have.length', 4);
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
            cy.get('h1').should('contain', 'Digital Learning Hub - Team management');
        });
    });
});
