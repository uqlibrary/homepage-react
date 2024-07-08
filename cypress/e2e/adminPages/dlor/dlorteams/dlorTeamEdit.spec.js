import { DLOR_ADMIN_USER } from '../../../../support/constants';

describe('Digital Learning Hub admin Edit Team', () => {
    beforeEach(() => {
        cy.clearCookies();
    });

    context('Edit DLOR Team', () => {
        beforeEach(() => {
            cy.visit(`http://localhost:2020/admin/dlor/team/edit/2?user=${DLOR_ADMIN_USER}`);
            cy.viewport(1300, 1000);
        });
        it('is accessible', () => {
            cy.injectAxe();
            cy.viewport(1300, 1000);
            cy.waitUntil(() => cy.get('h1').should('exist'));
            cy.get('h1').should('contain', 'Digital Learning Hub - Edit Team');

            cy.checkA11y('[data-testid="StandardPage"]', {
                reportName: 'dlor teams management',
                scopeName: 'Content',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
        it('appears as expected', () => {
            cy.get('uq-site-header')
                .shadow()
                .within(() => {
                    cy.get('[data-testid="subsite-title"]')
                        .should('exist')
                        .should('be.visible')
                        .contains('Digital learning hub admin');
                });
            cy.get('[data-testid="StandardPage-title"]')
                .should('exist')
                .should('be.visible')
                .contains('Digital Learning Hub - Edit Team');

            cy.get('[data-testid="admin-dlor-team-form-team-name"] input')
                .should('exist')
                .should('be.visible')
                .should('have.value', 'Lib train Library Corporate Services');
            cy.get('[data-testid="admin-dlor-team-form-team-manager"] input')
                .should('exist')
                .should('be.visible')
                .should('have.value', 'Jane Green');
            cy.get('[data-testid="admin-dlor-team-form-team-email"] input')
                .should('exist')
                .should('be.visible')
                .should('have.value', 'train@library.uq.edu');

            cy.get('[data-testid="admin-dlor-team-form-error-message-team-name"]').should('not.exist');
            cy.get('[data-testid="admin-dlor-team-form-error-message-team-email"]').should('not.exist');
            cy.get('[data-testid="admin-dlor-team-form-save-button"]')
                .should('exist')
                .should('be.disabled');

            cy.get('a[data-testid="dlor-breadcrumb-admin-homelink"]')
                .contains('Digital Learning Hub admin')
                .should('have.attr', 'href', `http://localhost:2020/admin/dlor?user=${DLOR_ADMIN_USER}`);
            cy.get('a[data-testid="dlor-breadcrumb-team-management-link-0"]')
                .contains('Team management')
                .should('have.attr', 'href', `http://localhost:2020/admin/dlor/team/manage?user=${DLOR_ADMIN_USER}`);
        });
        it('validates correctly', () => {
            // initially, save button is disabled - the form is invalid, but no errors appear
            cy.get('[data-testid="admin-dlor-team-form-team-name"] input')
                .should('exist')
                .clear();
            cy.get('[data-testid="admin-dlor-team-form-error-message-team-name"]')
                .contains('This team name is not valid.')
                .should('have.css', 'color', 'rgb(214, 41, 41)'); // #d62929
            cy.get('[data-testid="admin-dlor-team-form-error-message-team-email"]').should('not.exist');
            cy.get('[data-testid="admin-dlor-team-form-save-button"]')
                .should('exist')
                .should('be.disabled');

            cy.get('[data-testid="admin-dlor-team-form-team-name"] input').type('something');
            cy.get('[data-testid="admin-dlor-team-form-error-message-team-name"]').should('not.exist');
            cy.get('[data-testid="admin-dlor-team-form-error-message-team-email"]').should('not.exist');
            cy.get('[data-testid="admin-dlor-team-form-save-button"]')
                .should('exist')
                .should('not.be.disabled');

            // enter a partial email - invalid because not valid
            cy.get('[data-testid="admin-dlor-team-form-team-email"] input')
                .should('exist')
                .clear()
                .type('lea');
            cy.get('[data-testid="admin-dlor-team-form-error-message-team-name"]').should('not.exist');
            cy.get('[data-testid="admin-dlor-team-form-error-message-team-email"]')
                .should('exist')
                .contains('This email address is not valid.')
                .should('have.css', 'color', 'rgb(214, 41, 41)'); // #d62929;
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
        it('has a working "cancel edit" button', () => {
            cy.waitUntil(() =>
                cy
                    .get('[data-testid="admin-dlor-team-form-button-cancel"]')
                    .should('exist')
                    .contains('Cancel'),
            );
            cy.get('[data-testid="admin-dlor-team-form-button-cancel"]').click();
            cy.waitUntil(() => cy.get('[data-testid="dlor-teamlist-edit-1"]').should('exist'));
            cy.url().should('eq', `http://localhost:2020/admin/dlor/team/manage?user=${DLOR_ADMIN_USER}`);
        });
    });
    context('save test', () => {
        beforeEach(() => {
            cy.setCookie('CYPRESS_TEST_DATA', 'active'); // setup so we can check what we "sent" to the db
            cy.visit(`http://localhost:2020/admin/dlor/team/edit/2?user=${DLOR_ADMIN_USER}`);
            cy.viewport(1300, 1000);
        });
        it('saves correctly', () => {
            cy.get('[data-testid="admin-dlor-team-form-team-name"] input')
                .should('exist')
                .type(' changed');
            cy.get('[data-testid="admin-dlor-team-form-team-manager"] input')
                .should('exist')
                .type(' changed');
            cy.get('[data-testid="admin-dlor-team-form-team-email"] input')
                .should('exist')
                .type('.au');
            cy.get('[data-testid="admin-dlor-team-form-save-button"]')
                .should('exist')
                .click();

            cy.waitUntil(() => cy.get('[data-testid="confirm-dlor-team-save-outcome"]').should('exist'));

            // check save-confirmation popup
            cy.get('[data-testid="dialogbox-dlor-team-save-outcome"] h2').contains('Changes have been saved');
            cy.get('[data-testid="confirm-dlor-team-save-outcome"]').should('contain', 'Return to Admin Teams page');
            cy.get('[data-testid="cancel-dlor-team-save-outcome"]')
                .should('exist')
                .contains('Re-edit Team');

            // check the data we pretended to send to the server matches what we expect
            // acts as check of what we sent to api
            const expectedValues = {
                team_name: 'Lib train Library Corporate Services changed',
                team_manager: 'Jane Green changed',
                team_email: 'train@library.uq.edu.au', // (we added .au to the email)
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

            // and navigate back to the team list page
            cy.get('[data-testid="confirm-dlor-team-save-outcome"]')
                .should('contain', 'Return to Admin Teams page')
                .click();
            cy.url().should('eq', `http://localhost:2020/admin/dlor/team/manage?user=${DLOR_ADMIN_USER}`);
            cy.get('[data-testid="StandardPage-title"]')
                .should('exist')
                .should('contain', 'Digital Learning Hub - Team management');
        });
    });
    context('failures', () => {
        it('a failed api load shows correctly', () => {
            cy.visit(`http://localhost:2020/admin/dlor/team/edit/1?user=${DLOR_ADMIN_USER}&responseType=error`);
            cy.waitUntil(() => cy.get('[data-testid="dlor-teamItem-error"]').should('exist'));
            cy.get('[data-testid="dlor-teamItem-error"]').contains('An error has occurred during the request');
        });
    });
    context('user access', () => {
        it('displays an "unauthorised" page to public users', () => {
            cy.visit('http://localhost:2020/admin/dlor/team/edit/2?user=public');
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Authentication required');
        });
        it('displays an "unauthorised" page to non-authorised users', () => {
            cy.visit('http://localhost:2020/admin/dlor/team/edit/2?user=uqstaff');
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Permission denied');
        });
        it('displays correct page for admin users (list)', () => {
            cy.visit(`http://localhost:2020/admin/dlor/team/edit/2?user=${DLOR_ADMIN_USER}`);
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').should('contain', 'Digital Learning Hub - Edit Team');
        });
    });
});
