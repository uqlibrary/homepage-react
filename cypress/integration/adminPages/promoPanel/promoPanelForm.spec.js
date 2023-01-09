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

            cy.checkA11y('[data-testid="StandardPage"]', {
                reportName: 'Promopanel Admin Add',
                scopeName: 'Content',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
        it('can enter new data into form fields for a default panel', () => {
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
            cy.get('body').click();
            testId('standard-card-create-a-promo-header').click();
            testId('admin-promopanel-form-button-addSchedule').click();
            testId('admin-promopanel-form-button-save').click();
            testId('admin-promopanel-group-button-cancel').click();
            testId('admin-promopanel-form-button-save').click();
            testId('admin-promopanel-group-button-save').click();
            testId('panel-save-or-schedule-title').should('contain', 'Panel has been created');
            testId('admin-promopanel-group-button-save').click();
        });
        it('can enter new data into form fields for a scheduled panel, detecting conflicts', () => {
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
            // testId('admin-promopanel-form-default-panel').click();
            cy.get('#group-multiple-checkbox').click();
            cy.get('[data-value="student"]').click();
            cy.get('body').click();
            testId('admin-promopanel-form-button-addSchedule').click();
            testId('panel-save-or-schedule-title').should('contain', 'Schedule Conflict');
            testId('admin-promopanel-group-button-cancel').click();
            cy.get('#group-multiple-checkbox').click();
            cy.get('[data-value="student"]').click();
            cy.get('[data-value="hdr"]').click();
            cy.get('body').click();
            testId('admin-promopanel-form-button-addSchedule').click();
            testId('admin-promopanel-form-button-save').click();
            testId('panel-save-or-schedule-title').should('contain', 'Panel has been created');
            testId('admin-promopanel-group-button-cancel').click();
        });
    });
});
