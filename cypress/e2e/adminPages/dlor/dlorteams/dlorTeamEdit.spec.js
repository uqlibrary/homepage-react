import { DLOR_ADMIN_USER } from '../../../../support/constants';

describe('Digital learning hub admin Edit Team', () => {
    beforeEach(() => {
        cy.clearCookies();
    });

    context('Edit DLOR Team', () => {
        beforeEach(() => {
            cy.visit('http://localhost:2020/admin/dlor/team/edit/2?user=dloradmn');
            cy.viewport(1300, 1000);
        });
        it('is accessible', () => {
            cy.injectAxe();
            cy.viewport(1300, 1000);
            cy.waitUntil(() => cy.get('h1').should('exist'));
            cy.get('h1').should('contain', 'Digital learning hub - Edit Team');

            cy.checkA11y('[data-testid="StandardPage"]', {
                reportName: 'dlor teams management',
                scopeName: 'Content',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
        it('appears as expected', () => {
            cy.get('[data-testid="StandardPage-title"]')
                .should('exist')
                .should('be.visible')
                .contains('Digital learning hub - Edit Team');

            cy.get('[data-testid="team_name"] input')
                .should('exist')
                .should('be.visible')
                .should('have.value', 'Lib train Library Corporate Services');
            cy.get('[data-testid="team_manager"] input')
                .should('exist')
                .should('be.visible')
                .should('have.value', 'Jane Green');
            cy.get('[data-testid="team_email"] input')
                .should('exist')
                .should('be.visible')
                .should('have.value', 'train@library.uq.edu.au');

            cy.get('a[data-testid="dlor-edit-form-homelink"]')
                .contains('Digital learning hub admin')
                .should('have.attr', 'href', 'http://localhost:2020/admin/dlor?user=dloradmn');
            cy.get('a[data-testid="dlor-edit-form-tmlink"]')
                .contains('Team management')
                .should('have.attr', 'href', 'http://localhost:2020/admin/dlor/team/manage?user=dloradmn');
        });
    });
    context('save test', () => {
        beforeEach(() => {
            cy.setCookie('CYPRESS_TEST_DATA', 'active'); // setup so we can check what we "sent" to the db
            cy.visit('http://localhost:2020/admin/dlor/team/edit/2?user=dloradmn');
            cy.viewport(1300, 1000);
        });
        it('saves correctly', () => {
            cy.get('[data-testid="team_name"] input')
                .should('exist')
                .type(' changed');
            cy.get('[data-testid="team_manager"] input')
                .should('exist')
                .type(' changed');
            cy.get('[data-testid="team_email"] input')
                .should('exist')
                .type(' changed');
            cy.get('[data-testid="admin-dlor-teamedit-save-button"]')
                .should('exist')
                .click();

            // check the data we pretended to send to the server matches what we expect
            // acts as check of what we sent to api
            const expectedValues = {
                team_name: 'Lib train Library Corporate Services changed',
                team_manager: 'Jane Green changed',
                team_email: 'train@library.uq.edu.au changed',
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
            cy.get('h1').should('contain', 'Digital learning hub - Edit Team');
        });
    });
});
