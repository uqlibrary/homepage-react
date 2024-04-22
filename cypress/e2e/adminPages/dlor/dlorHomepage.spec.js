const gridFromExpectedRowCount = expected => expected * 3;

describe('Digital learning hub admin homepage', () => {
    beforeEach(() => {
        cy.clearCookies();
        cy.setCookie('UQ_CULTURAL_ADVICE', 'hidden');
    });

    const mockDlorAdminUser = 'dloradmn';
    context('homepage', () => {
        beforeEach(() => {
            cy.visit(`http://localhost:2020/admin/dlor?user=${mockDlorAdminUser}`);
            cy.viewport(1300, 1000);
        });
        it('is accessible', () => {
            cy.injectAxe();
            cy.viewport(1300, 1000);
            cy.waitUntil(() => cy.get('h1').should('exist'));
            cy.get('h1').should('contain', 'Digital learning hub Management');

            cy.checkA11y('[data-testid="StandardPage"]', {
                reportName: 'dlor homepage',
                scopeName: 'Content',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
        it('has a working "add an object" button', () => {
            cy.get('[data-testid="admin-dlor-visit-add-button"]')
                .should('exist')
                .should('contain', 'Add object')
                .click();
            cy.location('href').should('eq', 'http://localhost:2020/admin/dlor/add?user=dloradmn');
        });
        it('has a working "edit an object" button', () => {
            cy.get('[data-testid="admin-dlor-visit-add-button"]')
                .should('exist')
                .should('contain', 'Add object')
                .click();
            cy.location('href').should('eq', 'http://localhost:2020/admin/dlor/add?user=dloradmn');
        });
        it('shows a list of objects to manage', () => {
            cy.get('[data-testid="dlor-homepage-list"]')
                .should('exist')
                .children()
                .should('have.length', gridFromExpectedRowCount(8)); // all current objects show, plus the div with the checkbox list
        });
        it('can cancel deletion of an Object', () => {
            // click delete icon on first Object
            cy.get('[data-testid="dlor-homepage-delete-987y_isjgt_9866"]')
                .should('exist')
                .click();
            // confirm delete box is open
            cy.get('[data-testid="dialogbox-dlor-item-delete-confirm"]')
                .should('exist')
                .contains('Do you want to delete this object?');
            // say "no, I dont want to delete" and the dialog just closes
            cy.get('[data-testid="cancel-dlor-item-delete-confirm"]')
                .should('exist')
                .click();
            cy.get('[data-testid="dialogbox-dlor-item-delete-confirm"]').should('not.exist');
        });
        it('can delete an object', () => {
            // click delete icon on first Object
            cy.get('[data-testid="dlor-homepage-delete-98s0_dy5k3_98h4"]')
                .should('exist')
                .click();
            // confirm delete box is open
            cy.get('[data-testid="dialogbox-dlor-item-delete-confirm"]')
                .should('exist')
                .contains('Do you want to delete this object?');
            // say "yes"
            cy.get('[data-testid="confirm-dlor-item-delete-confirm"]')
                .should('exist')
                .click();
            // cant really test it was deleted - that will happen in canary. just confirm the list page reloads
            cy.get('[data-testid="dlor-homepage-list"]')
                .should('exist')
                .children()
                .should('have.length', gridFromExpectedRowCount(8)); // all current objects show, plus the div with the checkbox list
        });
        it('can filter objects', () => {
            cy.get('[data-testid="dlor-homepage-list"]')
                .should('exist')
                .children()
                .should('have.length', gridFromExpectedRowCount(8)); // all current objects show, plus the div with the checkbox list

            // label counts are correct
            cy.get('[data-testid="checkbox-status-new"]')
                .parent()
                .parent()
                .find('span:nth-child(2)')
                .contains('New/ Draft (1)');
            cy.get('[data-testid="checkbox-status-current"]')
                .parent()
                .parent()
                .find('span:nth-child(2)')
                .contains('Published (8)');
            cy.get('[data-testid="checkbox-status-rejected"]')
                .parent()
                .parent()
                .find('span:nth-child(2)')
                .contains('Published (8)');
            cy.get('[data-testid="checkbox-status-deprecated"]')
                .parent()
                .parent()
                .find('span:nth-child(2)')
                .contains('Deprecated (unpublished) (1)');
            cy.get('[data-testid="checkbox-status-deleted"]')
                .parent()
                .parent()
                .find('span:nth-child(2)')
                .contains('Deleted (1)');

            // check "new"
            cy.get('[data-testid="checkbox-status-new"] input[type=checkbox]')
                .should('exist')
                .should('not.be.checked')
                .check();
            cy.get('[data-testid="dlor-homepage-list"]')
                .should('exist')
                .children()
                .should('have.length', gridFromExpectedRowCount(9));

            // check "rejected"
            cy.get('[data-testid="checkbox-status-rejected"] input[type=checkbox]')
                .should('exist')
                .should('not.be.checked')
                .check();
            cy.get('[data-testid="dlor-homepage-list"]')
                .should('exist')
                .children()
                .should('have.length', gridFromExpectedRowCount(9)); // no rejected entries, nothing changed

            // check "deleted"
            cy.get('[data-testid="checkbox-status-deleted"] input[type=checkbox]')
                .should('exist')
                .should('not.be.checked')
                .check();
            cy.get('[data-testid="dlor-homepage-list"]')
                .should('exist')
                .children()
                .should('have.length', gridFromExpectedRowCount(10));

            // check "deprecated"
            cy.get('[data-testid="checkbox-status-deprecated"] input[type=checkbox]')
                .should('exist')
                .should('not.be.checked')
                .check();
            cy.get('[data-testid="dlor-homepage-list"]')
                .should('exist')
                .children()
                .should('have.length', gridFromExpectedRowCount(11));

            // UNcheck "published"
            cy.get('[data-testid="checkbox-status-current"] input[type=checkbox]')
                .should('exist')
                .should('be.checked')
                .uncheck();
            cy.get('[data-testid="dlor-homepage-list"]')
                .should('exist')
                .children()
                .should('have.length', gridFromExpectedRowCount(3));

            // UNcheck "deleted"
            cy.get('[data-testid="checkbox-status-deleted"] input[type=checkbox]')
                .should('exist')
                .should('be.checked')
                .uncheck();
            cy.get('[data-testid="dlor-homepage-list"]')
                .should('exist')
                .children()
                .should('have.length', gridFromExpectedRowCount(2));
        });
        it.skip('deleted objects are immutable', () => {
            // the history should work though
            cy.get('[data-testid="checkbox-status-current"] input')
                .should('exist')
                .should('be.checked')
                .uncheck();
            cy.get('[data-testid="checkbox-status-deleted"] input')
                .should('exist')
                .should('not.be.checked')
                .check();
            cy.get('[data-testid="dlor-homepage-list"]')
                .should('exist')
                .children()
                .should('have.length', gridFromExpectedRowCount(1));
            // buttons are disabled
            cy.get('[data-testid="dlor-homepage-list"] button:first-child')
                .should('exist')
                .should('be.disabled');
            cy.get('[data-testid="dlor-homepage-list"] button:nth-child(2)')
                .should('exist')
                .should('be.disabled');
        });
    });
    context('error handling', () => {
        it('deletion failure pops up an error', () => {
            cy.visit(`http://localhost:2020/admin/dlor?user=${mockDlorAdminUser}&responseType=saveError`);
            cy.viewport(1300, 1000);

            // click delete icon on first Object
            cy.get('[data-testid="dlor-homepage-delete-kj5t_8yg4_kj4f"]')
                .should('exist')
                .click();
            // confirm delete box is open
            cy.get('[data-testid="dialogbox-dlor-item-delete-confirm"]')
                .should('exist')
                .contains('Do you want to delete this object?');
            // say "yes"
            cy.get('[data-testid="confirm-dlor-item-delete-confirm"]')
                .should('exist')
                .click();
            // special url, above, forces an error - dialog reports error
            cy.waitUntil(() => cy.get('[data-testid="dialogbox-dlor-item-delete-failure-notice"]').should('exist'));
            cy.get('[data-testid="dialogbox-dlor-item-delete-failure-notice"]').should('be.visible');
            // has correct error message
            cy.get('[data-testid="dialogbox-dlor-item-delete-failure-notice"] [data-testid="message-title"]')
                .should('exist')
                .contains('An error occurred deleting the Object');
            // close the dialog
            cy.get('button[data-testid="confirm-dlor-item-delete-failure-notice"]').click();
            // dialog closed
            cy.get('button[data-testid="confirm-dlor-item-delete-failure-notice"]').should('not.exist');
            // list has reloaded
            cy.get('[data-testid="dlor-homepage-list"]')
                .should('exist')
                .children()
                .should('have.length', gridFromExpectedRowCount(8)); // all current objects show, plus the div with the checkbox list
        });
    });
});
