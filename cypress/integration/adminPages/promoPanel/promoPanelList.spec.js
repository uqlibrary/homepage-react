import { testId } from '../../../support/promopanel';

describe('Promo Panel List', () => {
    context('List Page', () => {
        it('is accessible', () => {
            cy.visit('http://localhost:2020/admin/promopanel?user=uqstaff');
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Promo panel management');
            cy.injectAxe();
            cy.checkA11y('[data-testid="StandardPage"]', {
                reportName: 'Promopanel Admin List',
                scopeName: 'Content',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });

        it('Split buttons work as expected', () => {
            cy.visit('http://localhost:2020/admin/promopanel?user=uqstaff');
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Promo panel management');
            testId('alert-list-arrowicon-1-student').click();
            testId('1-preview-button-student').click();
            testId('promopanel-preview-title').should('contain', 'Preview');
            testId('admin-promopanel-preview-button-cancel').click();
            testId('alert-list-arrowicon-2-none').click();
            testId('2-delete-button').click();
            testId('cancel-panel-delete-confirm').click();
            testId('alert-list-arrowicon-1-student').click();
            testId('1-clone-button-student').click();
            cy.get('h1').should('be.visible');
            testId('standard-card-clone-a-promo-header').should('be.visible');
        });
        it('Split delete work as expected', () => {
            cy.visit('http://localhost:2020/admin/promopanel?user=uqstaff');
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Promo panel management');
            testId('alert-list-arrowicon-1-student').click();
            testId('1-preview-button-student').click();
            testId('promopanel-preview-title').should('contain', 'Preview');
            testId('admin-promopanel-preview-button-cancel').click();
            // test for error
            testId('alert-list-arrowicon-2-none').click();
            testId('2-delete-button').click();
            testId('confirm-panel-delete-confirm').click();
            testId('message-title').should('contain', 'Some records did not delete successfully');
            testId('confirm-panel-delete-error-dialog').click();
            // test for successful
            testId('alert-list-arrowicon-99-none').click();
            testId('99-delete-button').click();
            testId('confirm-panel-delete-confirm').click();
        });
    });
});
