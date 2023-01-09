import { testId } from '../../../support/promopanel';

describe('Promo Panel List Default or Schedule', () => {
    context('List page', () => {
        it('Can change default panel from list page', () => {
            cy.visit('http://localhost:2020/admin/promopanel?user=uqstaff');
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Promo panel management');
            testId('default-panel-student').click();
            cy.get('#new-default-panel-for-group').click();
            cy.get('[data-value="6"').click();
            testId('admin-promopanel-group-button-save').click();
        });
        it('Can add scheduled panel from list page for group', () => {
            cy.visit('http://localhost:2020/admin/promopanel?user=uqstaff');
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Promo panel management');
            // testId('default-panel-student').click();
            // cy.get('#new-default-panel-for-group').click();
            // cy.get('[data-value="6"').click();
            // testId('admin-promopanel-group-button-save').click();
        });
    });
});
