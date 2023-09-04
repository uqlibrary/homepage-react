import { testId } from '../../../support/promopanel';

describe('Promo Panel List', () => {
    context('List Page', () => {
        it('is accessible', () => {
            cy.visit('http://localhost:2020/admin/promopanel?user=uqstaff');
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Promo panel management');
            cy.injectAxe();
            // Flakey Tests - to review.
            // cy.checkA11y('[data-testid="StandardPage"]', {
            //     reportName: 'Promopanel Admin List',
            //     scopeName: 'Content',
            //     includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            // });
        });
        it('can navigate to a panel from admin page', () => {
            cy.visit('http://localhost:2020/admin/promopanel?user=uqstaff');
            cy.viewport(1000, 1800);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Promo panel management');
            testId('panel-list-arrowicon-1-student').click();
            testId('1-edit-button-student').click();
            testId('standard-card-edit-a-promo-header').should('contain', 'Edit a promo');
            testId('admin-promopanel-form-button-cancel').click();
            testId('panel-list-arrowicon-8-student').click();
            testId('8-edit-button-student').click();
            testId('standard-card-edit-a-promo-header').should('contain', 'Edit a promo');
            testId('admin-promopanel-form-button-cancel').click();
            testId('panel-list-arrowicon-2-none').click();
            testId('2-edit-button-none').click();
            testId('admin-promopanel-form-button-cancel').click();
        });

        it('Split buttons work as expected', () => {
            cy.visit('http://localhost:2020/admin/promopanel?user=uqstaff');
            cy.viewport(1000, 1800);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Promo panel management');
            testId('panel-list-item-preview-1-student').click();
            testId('promopanel-preview-title').should('contain', 'Preview');
            testId('admin-promopanel-preview-button-cancel').click();
            testId('panel-list-arrowicon-2-none').click();
            testId('2-delete-button').click();
            testId('cancel-panel-delete-confirm').click();
            testId('panel-list-arrowicon-1-student').click();
            testId('1-clone-button-student').click();
            cy.get('h1').should('be.visible');
            testId('standard-card-clone-a-promo-header').should('be.visible');
        });
        it('Split buttons has view as default for past panels', () => {
            cy.visit('http://localhost:2020/admin/promopanel?user=uqstaff');
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Promo panel management');
            testId('panel-list-item-preview-50-none').click();
            testId('admin-promopanel-preview-button-cancel').click();
        });
        it('Split delete work as expected', () => {
            cy.visit('http://localhost:2020/admin/promopanel?user=uqstaff');
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Promo panel management');
            testId('panel-list-item-preview-1-student').click();
            testId('promopanel-preview-title').should('contain', 'Preview');
            testId('admin-promopanel-preview-button-cancel').click();
            // test for error
            testId('panel-list-arrowicon-2-none').click();
            testId('2-delete-button').click();
            testId('confirm-panel-delete-confirm').click();
            testId('message-title').should('contain', 'Some records did not delete successfully');
            testId('confirm-panel-delete-error-dialog').click();
            // test for successful
            testId('panel-list-arrowicon-99-none').click();
            testId('99-delete-button').click();
            testId('confirm-panel-delete-confirm').click();
        });
        it('handles an api error', () => {
            cy.visit('http://localhost:2020/admin/promopanel?user=s2222222');
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Promo panel management');
            // error block appears
            testId('admin-promopanel-list-api-error')
                .should('be.visible')
                .should('contain', 'There was an error loading data from the server. Please refresh and try again.');
            // page is valid
            testId('standard-card-default-and-scheduled-panels')
                .should('be.visible')
                .should('contain', 'Default and scheduled panels');
        });
    });
});
