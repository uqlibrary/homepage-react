import { DLOR_ADMIN_USER } from '../../../../support/constants';

describe('Digital learning hub admin Add Team', () => {
    beforeEach(() => {
        cy.clearCookies();
    });

    context('Add DLOR Team', () => {
        beforeEach(() => {
            cy.visit('http://localhost:2020/admin/dlor/team/add?user=dloradmn');
            cy.viewport(1300, 1000);
        });
        it('is accessible', () => {
            cy.injectAxe();
            cy.viewport(1300, 1000);
            cy.waitUntil(() => cy.get('h1').should('exist'));
            cy.get('h1').should('contain', 'Digital learning hub - Add a new Team');

            cy.checkA11y('[data-testid="StandardPage"]', {
                reportName: 'dlor add a team',
                scopeName: 'Content',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
        it('loads as expected', () => {
            cy.get('[data-testid="StandardPage-title"]')
                .should('exist')
                .should('be.visible')
                .contains('Digital learning hub - Add a new Team');

            cy.get('[data-testid="team_name"] input')
                .should('exist')
                .should('be.visible')
                .should('be.empty');
            cy.get('[data-testid="team_manager"] input')
                .should('exist')
                .should('be.visible')
                .should('be.empty');
            cy.get('[data-testid="team_email"] input')
                .should('exist')
                .should('be.visible')
                .should('be.empty');

            cy.get('a[data-testid="dlor-add-form-homelink"]')
                .contains('Digital learning hub admin')
                .should('have.attr', 'href', 'http://localhost:2020/admin/dlor?user=dloradmn');
            cy.get('a[data-testid="dlor-add-form-uplink"]')
                .contains('Team management')
                .should('have.attr', 'href', 'http://localhost:2020/admin/dlor/team/manage?user=dloradmn');
        });
        it('validates correctly', () => {
            // initially, save button is disabled - the form is invalid, but no errors appear
            cy.get('[data-testid="error-message-team_name"]')
                .should('exist')
                .contains('This team name is not valid.')
                .should('have.css', 'color', 'rgb(214, 41, 41)'); // #d62929
            cy.get('[data-testid="error-message-team_email"]')
                .should('exist')
                .contains('This email address is not valid.')
                .should('have.css', 'color', 'rgb(214, 41, 41)'); // #d62929;
            cy.get('[data-testid="admin-dlor-team-form-save-button"]')
                .should('exist')
                .should('be.disabled');

            // enter a team name - invalid because no email
            cy.get('[data-testid="team_name"] input')
                .should('exist')
                .type('Valid Team name');
            cy.get('[data-testid="error-message-team_name"]').should('not.exist');
            cy.get('[data-testid="error-message-team_email"]').should('exist');
            cy.get('[data-testid="admin-dlor-team-form-save-button"]')
                .should('exist')
                .should('be.disabled');

            // enter a partial email - invalid because not valid
            cy.get('[data-testid="team_email"] input')
                .should('exist')
                .type('lea');
            cy.get('[data-testid="error-message-team_name"]').should('not.exist');
            cy.get('[data-testid="error-message-team_email"]').should('exist');
            cy.get('[data-testid="admin-dlor-team-form-save-button"]')
                .should('exist')
                .should('be.disabled');

            // complete email - now valid
            cy.get('[data-testid="team_email"] input')
                .should('exist')
                .type('@example.com');
            cy.get('[data-testid="error-message-team_name"]').should('not.exist');
            cy.get('[data-testid="error-message-team_email"]').should('not.exist');
            cy.get('[data-testid="admin-dlor-team-form-save-button"]')
                .should('exist')
                .should('not.be.disabled');

            // enter a manager, validity unaffected
            cy.get('[data-testid="team_manager"] input')
                .should('exist')
                .type('valid team manager');
            cy.get('[data-testid="error-message-team_name"]').should('not.exist');
            cy.get('[data-testid="error-message-team_email"]').should('not.exist');
            cy.get('[data-testid="admin-dlor-team-form-save-button"]')
                .should('exist')
                .should('not.be.disabled');

            // wipe team name - form invalid
            cy.get('[data-testid="team_name"] input')
                .should('exist')
                .clear();
            cy.get('[data-testid="error-message-team_name"]').should('exist');
            cy.get('[data-testid="error-message-team_email"]').should('not.exist');
            cy.get('[data-testid="admin-dlor-team-form-save-button"]')
                .should('exist')
                .should('be.disabled');
        });
    });
    context('save test', () => {
        beforeEach(() => {
            cy.setCookie('CYPRESS_TEST_DATA', 'active'); // setup so we can check what we "sent" to the db
            cy.visit('http://localhost:2020/admin/dlor/team/add?user=dloradmn');
            cy.viewport(1300, 1000);
        });
        it('saves correctly and starts another add', () => {
            cy.get('[data-testid="team_name"] input')
                .should('exist')
                .type('Valid Team name');
            // team_manager is not required
            cy.get('[data-testid="team_email"] input')
                .should('exist')
                .type('lea@example.com');
            cy.get('[data-testid="admin-dlor-team-form-save-button"]')
                .should('exist')
                .should('not.be.disabled')
                .click();

            // check save-confirmation popup
            cy.waitUntil(() => cy.get('[data-testid="confirm-dlor-team-save-outcome"]').should('exist'));
            cy.get('[data-testid="dialogbox-dlor-team-save-outcome"] h2').contains('The team has been created');
            cy.get('[data-testid="confirm-dlor-team-save-outcome"]')
                .should('exist')
                .contains('Return to Admin Teams page');
            cy.get('[data-testid="cancel-dlor-team-save-outcome"]')
                .should('exist')
                .contains('Add another Team');

            // check the data we pretended to send to the server matches what we expect
            // acts as check of what we sent to api
            const expectedValues = {
                team_name: 'Valid Team name',
                team_manager: '',
                team_email: 'lea@example.com',
            };
            console.log('document.cookies', document.cookie);
            cy.getCookie('CYPRESS_DATA_SAVED').then(cookie => {
                expect(cookie).to.exist;
                const decodedValue = decodeURIComponent(cookie.value);
                const sentValues = JSON.parse(decodedValue);

                console.log('sentValues=', sentValues);
                console.log('expectedValues=', expectedValues);

                expect(sentValues).to.deep.equal(expectedValues);

                cy.clearCookie('CYPRESS_DATA_SAVED');
                cy.clearCookie('CYPRESS_TEST_DATA');
            });

            // choose to add another team
            cy.get('[data-testid="cancel-dlor-team-save-outcome"]')
                .should('exist')
                .click();

            // start of new Add form
            cy.get('[data-testid="StandardPage-title"]')
                .should('exist')
                .should('be.visible')
                .contains('Digital learning hub - Add a new Team');

            cy.url().should('eq', `http://localhost:2020/admin/dlor/team/add?user=${DLOR_ADMIN_USER}`);
            cy.get('[data-testid="StandardPage-title"]')
                .should('exist')
                .should('contain', 'Digital learning hub - Add a new Team');
            cy.get('[data-testid="team_name"] input')
                .should('exist')
                .should('be.visible')
                .should('be.empty'); // has reloaded blank
        });
        it('saves correctly and navigates to team list', () => {
            cy.get('[data-testid="team_name"] input')
                .should('exist')
                .type('Valid Team Name');
            cy.get('[data-testid="team_manager"] input')
                .should('exist')
                .type('Valid Team manager name');
            cy.get('[data-testid="team_email"] input')
                .should('exist')
                .type('lea@example.com');
            cy.get('[data-testid="admin-dlor-team-form-save-button"]')
                .should('exist')
                .click();

            cy.waitUntil(() => cy.get('[data-testid="confirm-dlor-team-save-outcome"]').should('exist'));
            cy.get('[data-testid="dialogbox-dlor-team-save-outcome"] h2').contains('The team has been created');
            cy.get('[data-testid="confirm-dlor-team-save-outcome"]')
                .should('exist')
                .contains('Return to Admin Teams page');
            cy.get('[data-testid="cancel-dlor-team-save-outcome"]')
                .should('exist')
                .contains('Add another Team');

            // check the data we pretended to send to the server matches what we expect
            // acts as check of what we sent to api
            const expectedValues = {
                team_name: 'Valid Team Name',
                team_manager: 'Valid Team manager name',
                team_email: 'lea@example.com',
            };
            console.log('document.cookies', document.cookie);
            cy.getCookie('CYPRESS_DATA_SAVED').then(cookie => {
                expect(cookie).to.exist;
                const decodedValue = decodeURIComponent(cookie.value);
                const sentValues = JSON.parse(decodedValue);

                console.log('sentValues=', sentValues);
                console.log('expectedValues=', expectedValues);

                expect(sentValues).to.deep.equal(expectedValues);

                cy.clearCookie('CYPRESS_DATA_SAVED');
                cy.clearCookie('CYPRESS_TEST_DATA');
            });

            // check save-confirmation popup
            cy.waitUntil(() => cy.get('[data-testid="cancel-dlor-team-save-outcome"]').should('exist'));
            cy.get('[data-testid="dialogbox-dlor-team-save-outcome"] h2').contains('The team has been created');
            cy.get('[data-testid="confirm-dlor-team-save-outcome"]')
                .should('exist')
                .contains('Return to Admin Teams page');
            cy.get('[data-testid="cancel-dlor-team-save-outcome"]')
                .should('exist')
                .contains('Add another Team');

            // and navigate back to the team list page
            cy.get('[data-testid="confirm-dlor-team-save-outcome"]')
                .contains('Return to Admin Teams page')
                .click();
            cy.url().should('eq', `http://localhost:2020/admin/dlor/team/manage?user=${DLOR_ADMIN_USER}`);
            cy.get('[data-testid="StandardPage-title"]')
                .should('exist')
                .should('contain', 'Digital learning hub - Team Management');
        });
    });

    context('user access', () => {
        it('displays an "unauthorised" page to public users', () => {
            cy.visit('http://localhost:2020/admin/dlor/team/add?user=public');
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Authentication required');
        });
        it('displays an "unauthorised" page to non-authorised users', () => {
            cy.visit('http://localhost:2020/admin/dlor/team/add?user=uqstaff');
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Permission denied');
        });
        it('displays correct page for admin users', () => {
            cy.visit(`http://localhost:2020/admin/dlor/team/add?user=${DLOR_ADMIN_USER}`);
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').should('contain', 'Digital learning hub - Add a new Team');
        });
    });
});
