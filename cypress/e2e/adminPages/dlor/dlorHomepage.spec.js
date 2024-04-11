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
        it('shows a list of objects to manage', () => {
            cy.get('[data-testid="dlor-homepage-list"]')
                .should('exist')
                .children()
                .should('have.length', 8);
        });
        it('can cancel deletion of an Object', () => {
            // click delete icon on first Object
            cy.get('[data-testid="dlor-homepage-list"]')
                .should('exist')
                .find('button')
                .first()
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
            cy.get('[data-testid="dlor-homepage-list"]')
                .should('exist')
                .find('button')
                .first()
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
                .should('have.length', 8);
        });
    });
    context('error handling', () => {
        it('deletion failure pops up an error', () => {
            cy.visit(`http://localhost:2020/admin/dlor?user=${mockDlorAdminUser}&responseType=saveError`);
            cy.viewport(1300, 1000);

            // click delete icon on first Object
            cy.get('[data-testid="dlor-homepage-list"]')
                .should('exist')
                .find('button')
                .first()
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
            cy.get('[data-testid="dialogbox-dlor-item-delete-failure-notice"] [data-testid="message-content"]')
                .should('exist')
                .contains('An error has occurred during the request and this request cannot be processed');
            // close the dialog
            cy.get('button[data-testid="confirm-dlor-item-delete-failure-notice"]').click();
            // dialog closed
            cy.get('button[data-testid="confirm-dlor-item-delete-failure-notice"]').should('not.exist');
            // list has reloaded
            cy.get('[data-testid="dlor-homepage-list"]')
                .should('exist')
                .children()
                .should('have.length', 8);
        });
    });
});
