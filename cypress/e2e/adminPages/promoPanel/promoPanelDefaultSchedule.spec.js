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
            testId('schedule-panel-hdr').click();
            cy.get('#new-scheduled-panel-for-group').click();
            cy.get('[data-value="2"').click();
            testId('admin-promopanel-group-button-save').click();
        });
        it('Can detect schedule conflicts for start and end dates', () => {
            cy.visit('http://localhost:2020/admin/promopanel?user=uqstaff');
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Promo panel management');
            testId('schedule-panel-hdr').click();
            cy.get('#new-scheduled-panel-for-group').click();
            cy.get('[data-value="2"').click();
            // testId('admin-promopanel-group-button-save').click();
            cy.get('#picker-start-date').click();
            cy.contains(new Date().getFullYear()).click();
            cy.get('.MuiPickersYearSelection-container')
                .contains('2090')
                .click({ force: true });
            cy.get('.MuiDialogActions-root > :nth-child(3)').click();
            cy.get('#picker-end-date').click();
            cy.wait(100);
            cy.get('.MuiToolbar-root')
                .contains('2090')
                .click();
            cy.get('.MuiPickersYearSelection-container')
                .contains('2092')
                .click({ force: true });
            cy.get('.MuiDialogActions-root > :nth-child(3)').click();
        });
        it('Can detect a schedule conflict for group', () => {
            cy.visit('http://localhost:2020/admin/promopanel?user=uqstaff');
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Promo panel management');
            testId('schedule-panel-student').click();
            cy.get('#new-scheduled-panel-for-group').click();
            cy.get('[data-value="2"]').click();
            // testId('admin-promopanel-group-button-save').click();
            testId('schedule-error-conflict').should('exist');
            testId('admin-promopanel-group-button-cancel').click();
        });
    });
});
