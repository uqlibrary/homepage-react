import { DLOR_ADMIN_USER, DLOR_OBJECT_OWNER } from '../../../../support/constants';

describe('Digital Learning Hub admin Teams Members management', () => {
    beforeEach(() => {
        cy.clearCookies();
    });

    context('Teams member management', () => {
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
        it('team user management - add member', () => {
            cy.injectAxe();
            cy.viewport(1300, 1000);
            cy.waitUntil(() => cy.get('h1').should('exist'));
            cy.get('h1').should('contain', 'Digital Learning Hub - Team management');
            cy.get('[data-testid="dlor-teamlist-edit-1"]').should('exist').click();
            cy.get('[data-testid="team-members-title"]').should('exist');
            // spaces and length check
            cy.get('[data-testid="add-team-member-username"] input')
                .type('user name with spaces').blur();
            cy.get('[data-testid="add-team-member-username"] input').should('have.value', 'usernamewithspa');
            // email check
            cy.get('[data-testid="add-team-member-email"] input')
                .type('username@uq').blur();
            // disabled button
            cy.get('[data-testid="add-team-member-button"]').should('be.disabled');
             cy.get('[data-testid="add-team-member-email"] input')
                .clear().type('username@uq.edu.au').blur();
             // enabled button
            cy.get('[data-testid="add-team-member-button"]').should('not.be.disabled').click();
            cy.get('h1').should('contain', 'Digital Learning Hub - Edit Team');
            cy.get('[data-testid="dlor-breadcrumb-edit-team-label-1"]').should('exist')
                .should('contain', 'Edit team: LIB DX Digital Content');
        });
        it('team user management - edit member', () => {
            cy.injectAxe();
            cy.viewport(1300, 1000);
            cy.waitUntil(() => cy.get('h1').should('exist'));
            cy.get('h1').should('contain', 'Digital Learning Hub - Team management');
            cy.get('[data-testid="dlor-teamlist-edit-1"]').should('exist').click();
            cy.get('[data-testid="team-members-title"]').should('exist');
            // Edit first user
            cy.get('[data-testid="team-member-edit-0"]').should('exist').click();
            cy.get('input[value="uqstaff"]').clear().type('uqstaffedit').blur();
            cy.get('input[value="uqstaff@uq.edu.au"]').clear().type('uqstaffedit@uq.edu.au').blur();
            cy.get('[data-testid="team-member-save-0"]').should('exist').click();
            // Test Cancel button 
            cy.get('[data-testid="team-member-edit-0"]').should('exist').click();
            cy.get('input[value="uqstaff"]').clear().type('uqstaffedit').blur();
            cy.get('input[value="uqstaff@uq.edu.au"]').clear().type('uqstaffedit@uq.edu.au').blur();
            cy.get('[data-testid="team-member-cancel-0"]').should('exist').click();
            cy.get('[data-testid="team-member-cancel-0"]').should('not.exist');

        });
        it('team user management - delete member', () => {
            cy.injectAxe();
            cy.viewport(1300, 1000);
            cy.waitUntil(() => cy.get('h1').should('exist'));
            cy.get('h1').should('contain', 'Digital Learning Hub - Team management');
            cy.get('[data-testid="dlor-teamlist-edit-1"]').should('exist').click();
            cy.get('[data-testid="team-members-title"]').should('exist');
            // Delete first user
            cy.get('[data-testid="team-member-delete-0"]').should('exist').click();
            // Cancel delete
            cy.get('[data-testid="cancel-dlor-team-member-delete-confirm"]').should('exist').click();
            cy.get('[data-testid="team-member-delete-0"]').should('exist').click();
            // Confirm delete
            cy.get('[data-testid="confirm-dlor-team-member-delete-confirm"]').should('exist').click();
            // confirm we returned to the management page for testing.
            cy.get('[data-testid="team-member-delete-0"]').should('exist');

        });
    });
});


