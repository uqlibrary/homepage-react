import { saveButtonIsDisabled, addScheduleIsDisabled, previewIsDisabled, testId } from '../../../support/promopanel';

describe('Promopanel Admin Form Pages', () => {
    context('Promopanel Admin Add page', () => {
        beforeEach(() => {
            cy.visit('http://localhost:2020/admin/promopanel/add?user=uqstaff');
            cy.viewport(1300, 1400);
        });
        it('add page is accessible', () => {
            cy.injectAxe();
            cy.viewport(1300, 1400);
            cy.get('h2')
                .should('be.visible')
                .contains('Create a promo');
            cy.waitUntil(() => cy.get('[data-testid="admin-promopanel-form-button-cancel"]').should('exist'));

            // cy.checkA11y('[data-testid="StandardPage"]', {
            //     reportName: 'Promopanel Admin Add',
            //     scopeName: 'Content',
            //     includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            // });
        });
        it('can enter data into form fields', () => {
            saveButtonIsDisabled(true);
            addScheduleIsDisabled(true);
            previewIsDisabled(true);
            testId('admin-promopanel-form-admin-note').type('Test Admin Note');
            testId('admin-promopanel-form-title').type('Test Admin Title');
            cy.get('.ck-content')
                .clear()
                // It's possible to test bold italic etc with {cmd or ctrl}, but the results differ
                // depending on the platform. Best to just leave as plain text for testing.
                .type('This is the content of the panel');
            saveButtonIsDisabled(false);
            previewIsDisabled(false);
            testId('admin-promopanel-form-button-preview').click();
            testId('promopanel-preview-title').should('be.visible');
            testId('admin-promopanel-preview-button-cancel').click();
            testId('promopanel-preview-title').should('not.be.visible');
            testId('standard-card-schedule-or-set-a-default-panel-content').should('be.visible');
            testId('admin-promopanel-form-default-panel').click();
            cy.get('#group-multiple-checkbox').click();
            cy.get('[data-value="student"]').click();
            // cy.get('#group-multiple-checkbox').type('{esc}', { force: true });
            testId('standard-card-create-a-promo-header').click({ force: true });
            testId('admin-promopanel-form-button-addSchedule').click({ force: true });
            testId('admin-promopanel-form-button-editSchedule').should('exist');
            testId('admin-promopanel-form-button-editSchedule').click({ force: true });
            testId('admin-promopanel-form-button-cancel').click({ force: true });
            testId('StandardPage-title').should('contain', 'Promo panel management');
        });
    });
});
