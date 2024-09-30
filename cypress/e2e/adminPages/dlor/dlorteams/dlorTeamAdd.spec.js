import { DLOR_ADMIN_USER } from '../../../../support/constants';

describe('Digital Learning Hub admin Add Team', () => {
    beforeEach(() => {
        cy.clearCookies();
    });

    context('Add DLOR Team', () => {
        beforeEach(() => {
            cy.visit(`http://localhost:2020/admin/dlor/team/add?user=${DLOR_ADMIN_USER}`);
            cy.viewport(1300, 1000);
        });
        it('is accessible', () => {
            cy.injectAxe();
            cy.viewport(1300, 1000);
            cy.waitUntil(() => cy.get('h1').should('exist'));
            cy.get('h1').should('contain', 'Digital Learning Hub - Add a new Team');

            cy.checkA11y('[data-testid="StandardPage"]', {
                reportName: 'dlor add a team',
                scopeName: 'Content',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
        it('has breadcrumbs', () => {
            cy.get('uq-site-header')
                .shadow()
                .within(() => {
                    cy.get('[data-testid="subsite-title"]')
                        .should('exist')
                        .should('be.visible')
                        .contains('Digital learning hub admin');
                });
        });
        it('loads as expected', () => {
            cy.get('[data-testid="StandardPage-title"]')
                .should('exist')
                .should('be.visible')
                .contains('Digital Learning Hub - Add a new Team');

            cy.get('[data-testid="admin-dlor-team-form-team-name"] input')
                .should('exist')
                .should('be.visible')
                .should('be.empty');
            cy.get('[data-testid="admin-dlor-team-form-team-manager"] input')
                .should('exist')
                .should('be.visible')
                .should('be.empty');
            cy.get('[data-testid="admin-dlor-team-form-team-email"] input')
                .should('exist')
                .should('be.visible')
                .should('be.empty');

            cy.get('a[data-testid="dlor-breadcrumb-admin-homelink"]')
                .contains('Digital Learning Hub admin')
                .should('have.attr', 'href', `http://localhost:2020/admin/dlor?user=${DLOR_ADMIN_USER}`);
            cy.get('a[data-testid="dlor-breadcrumb-team-management-link-0"]')
                .contains('Team management')
                .should('have.attr', 'href', `http://localhost:2020/admin/dlor/team/manage?user=${DLOR_ADMIN_USER}`);
            cy.get('[data-testid="dlor-breadcrumb-add-new-team-label-1"]').contains('Add new team');
        });
        it('validates correctly', () => {
            // initially, save button is disabled - the form is invalid, but no errors appear
            cy.waitUntil(() => cy.get('[data-testid="admin-dlor-team-form-error-message-team-name"]').should('exist'));
            cy.get('[data-testid="admin-dlor-team-form-error-message-team-name"]')
                .contains('This team name is not valid.')
                .should('have.css', 'color', 'rgb(214, 41, 41)'); // #d62929
            cy.get('[data-testid="admin-dlor-team-form-error-message-team-email"]')
                .should('exist')
                .contains('This email address is not valid.')
                .should('have.css', 'color', 'rgb(214, 41, 41)'); // #d62929;
            cy.get('[data-testid="admin-dlor-team-form-save-button"]')
                .should('exist')
                .should('be.disabled');

            // enter a team name - invalid because no email
            cy.get('[data-testid="admin-dlor-team-form-team-name"] input')
                .should('exist')
                .type('Valid Team name');
            cy.get('[data-testid="admin-dlor-team-form-error-message-team-name"]').should('not.exist');
            cy.get('[data-testid="admin-dlor-team-form-error-message-team-email"]').should('exist');
            cy.get('[data-testid="admin-dlor-team-form-save-button"]')
                .should('exist')
                .should('be.disabled');

            // enter a partial email - invalid because not valid
            cy.get('[data-testid="admin-dlor-team-form-team-email"] input')
                .should('exist')
                .type('lea');
            cy.get('[data-testid="admin-dlor-team-form-error-message-team-name"]').should('not.exist');
            cy.get('[data-testid="admin-dlor-team-form-error-message-team-email"]').should('exist');
            cy.get('[data-testid="admin-dlor-team-form-save-button"]')
                .should('exist')
                .should('be.disabled');

            // complete email - now valid
            cy.get('[data-testid="admin-dlor-team-form-team-email"] input')
                .should('exist')
                .type('@example.com');
            cy.get('[data-testid="admin-dlor-team-form-error-message-team-name"]').should('not.exist');
            cy.get('[data-testid="admin-dlor-team-form-error-message-team-email"]').should('not.exist');
            cy.get('[data-testid="admin-dlor-team-form-save-button"]')
                .should('exist')
                .should('not.be.disabled');

            // enter a manager, validity unaffected
            cy.get('[data-testid="admin-dlor-team-form-team-manager"] input')
                .should('exist')
                .type('valid team manager');
            cy.get('[data-testid="admin-dlor-team-form-error-message-team-name"]').should('not.exist');
            cy.get('[data-testid="admin-dlor-team-form-error-message-team-email"]').should('not.exist');
            cy.get('[data-testid="admin-dlor-team-form-save-button"]')
                .should('exist')
                .should('not.be.disabled');

            // wipe team name - form invalid
            cy.get('[data-testid="admin-dlor-team-form-team-name"] input')
                .should('exist')
                .clear();
            cy.get('[data-testid="admin-dlor-team-form-error-message-team-name"]').should('exist');
            cy.get('[data-testid="admin-dlor-team-form-error-message-team-email"]').should('not.exist');
            cy.get('[data-testid="admin-dlor-team-form-save-button"]')
                .should('exist')
                .should('be.disabled');
        });
    });
    context('save test', () => {
        beforeEach(() => {
            cy.setCookie('CYPRESS_TEST_DATA', 'active'); // setup so we can check what we "sent" to the db
            cy.visit(`http://localhost:2020/admin/dlor/team/add?user=${DLOR_ADMIN_USER}`);
            cy.viewport(1300, 1000);
        });
        it('saves correctly and starts another add', () => {
            cy.get('[data-testid="admin-dlor-team-form-team-name"] input')
                .should('exist')
                .type('Valid Team name');
            // team_manager is not required
            cy.get('[data-testid="admin-dlor-team-form-team-email"] input')
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
                .contains('Digital Learning Hub - Add a new Team');

            cy.url().should('eq', `http://localhost:2020/admin/dlor/team/add?user=${DLOR_ADMIN_USER}`);
            cy.get('[data-testid="StandardPage-title"]')
                .should('exist')
                .should('contain', 'Digital Learning Hub - Add a new Team');
            cy.get('[data-testid="admin-dlor-team-form-team-name"] input')
                .should('exist')
                .should('be.visible')
                .should('be.empty'); // has reloaded blank
        });
        it('saves correctly and navigates to team list', () => {
            cy.get('[data-testid="admin-dlor-team-form-team-name"] input')
                .should('exist')
                .type('Valid Team Name');
            cy.get('[data-testid="admin-dlor-team-form-team-manager"] input')
                .should('exist')
                .type('Valid Team manager name');
            cy.get('[data-testid="admin-dlor-team-form-team-email"] input')
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
                .should('contain', 'Digital Learning Hub - Team management');
        });
    });

    context('failed saving', () => {
        it('a failed save shows correctly', () => {
            cy.visit(`http://localhost:2020/admin/dlor/team/add?user=${DLOR_ADMIN_USER}&responseType=saveError`);
            cy.get('[data-testid="admin-dlor-team-form-team-name"] input')
                .should('exist')
                .type('Valid Team Name');
            cy.get('[data-testid="admin-dlor-team-form-team-manager"] input')
                .should('exist')
                .type('Valid Team manager name');
            cy.get('[data-testid="admin-dlor-team-form-team-email"] input')
                .should('exist')
                .type('lea@example.com');
            cy.get('[data-testid="admin-dlor-team-form-save-button"]')
                .should('exist')
                .click();

            // it failed! just what we wanted :)
            cy.waitUntil(() => cy.get('[data-testid="dialogbox-dlor-team-save-outcome"]').should('be.visible'));
            cy.get('[data-testid="dialogbox-dlor-team-save-outcome"] h2').contains(
                'Request failed with status code 400',
            );
            cy.get('[data-testid="confirm-dlor-team-save-outcome"]')
                .should('exist')
                .contains('Close');
            cy.get('[data-testid="cancel-dlor-team-save-outcome"]').should('not.exist');

            cy.get('[data-testid="confirm-dlor-team-save-outcome"]')
                .contains('Close')
                .click();

            // and when we close the dialog we stay on the form
            cy.get('[data-testid="dialogbox-dlor-team-save-outcome"]').should('not.exist');
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
            cy.get('h1').should('contain', 'Digital Learning Hub - Add a new Team');
        });
    });
});
