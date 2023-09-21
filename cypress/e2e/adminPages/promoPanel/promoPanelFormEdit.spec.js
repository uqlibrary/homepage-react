import { saveButtonIsDisabled, addScheduleIsDisabled, previewIsDisabled, testId } from '../../../support/promopanel';

describe('Promopanel Admin Form Pages', () => {
    context('Promopanel Admin Edit page - defaults', () => {
        beforeEach(() => {
            cy.visit('http://localhost:2020/admin/promopanel/edit/1?user=uqstaff');
            cy.viewport(1300, 1400);
        });
        it('edit page is accessible', () => {
            cy.injectAxe();
            cy.viewport(1300, 1400);
            cy.get('h2')
                .should('be.visible')
                .contains('Edit a promo');
            cy.waitUntil(() => cy.get('[data-testid="admin-promopanel-form-button-cancel"]').should('exist'));

            cy.checkA11y('[data-testid="StandardPage"]', {
                reportName: 'Promopanel Admin Edit',
                scopeName: 'Content',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
            testId('admin-promopanel-form-button-cancel').click();
        });
        it('can update data into form fields for a default panel', () => {
            testId('admin-promoPanel-help-button').click();
            testId('help-drawer-title').should('exist');
            testId('promopanel-helpdrawer-close-button').click();
            saveButtonIsDisabled(false);
            addScheduleIsDisabled(true);
            previewIsDisabled(false);
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
            cy.get('#group-multiple-checkbox').click();
            cy.get('[data-value="alumni"]').click();
            cy.get('body').type('{esc}');
            testId('admin-promopanel-form-button-addSchedule').click();
            testId('admin-promopanel-form-button-save').click();
            testId('admin-promopanel-group-button-cancel').click();
            testId('admin-promopanel-form-button-save').click();
            testId('admin-promopanel-group-button-save').click();
            testId('panel-save-or-schedule-title').should('contain', 'Panel has been updated');
            testId('admin-promopanel-group-button-save').click();
        });
        // it('can enter new data into form fields for a scheduled panel, detecting conflicts', () => {
        //     saveButtonIsDisabled(true);
        //     addScheduleIsDisabled(true);
        //     previewIsDisabled(true);
        //     testId('admin-promopanel-form-admin-note').type('Test Admin Note');
        //     testId('admin-promopanel-form-title').type('Test Admin Title');
        //     cy.get('.ck-content')
        //         .clear()
        //         // It's possible to test bold italic etc with {cmd or ctrl}, but the results differ
        //         // depending on the platform. Best to just leave as plain text for testing.
        //         .type('This is the content of the panel');
        //     saveButtonIsDisabled(false);
        //     previewIsDisabled(false);
        //     testId('admin-promopanel-form-button-preview').click();
        //     testId('promopanel-preview-title').should('be.visible');
        //     testId('admin-promopanel-preview-button-cancel').click();
        //     testId('promopanel-preview-title').should('not.be.visible');
        //     testId('standard-card-schedule-or-set-a-default-panel-content').should('be.visible');
        //     // testId('admin-promopanel-form-default-panel').click();
        //     cy.get('#group-multiple-checkbox').click();
        //     cy.get('[data-value="student"]').click();
        //     cy.get('body').click();
        //     testId('admin-promopanel-form-button-addSchedule').click();
        //     testId('panel-save-or-schedule-title').should('contain', 'Schedule Conflict');
        //     testId('admin-promopanel-group-button-cancel').click();
        //     cy.get('#group-multiple-checkbox').click();
        //     cy.get('[data-value="student"]').click();
        //     cy.get('[data-value="hdr"]').click();
        //     cy.get('body').click();
        //     testId('admin-promopanel-form-button-addSchedule').click();
        //     testId('admin-promopanel-form-button-save').click();
        //     testId('panel-save-or-schedule-title').should('contain', 'Panel has been created');
        //     testId('admin-promopanel-group-button-cancel').click();
        // });
    });
    context('Promopanel Admin Edit page - schedules', () => {
        beforeEach(() => {
            cy.visit('http://localhost:2020/admin/promopanel/edit/7?user=uqstaff');
            cy.viewport(1300, 1400);
        });
        it('edit page for schedules is accessible', () => {
            cy.injectAxe();
            cy.viewport(1300, 1400);
            cy.get('h2')
                .should('be.visible')
                .contains('Edit a promo');
            cy.waitUntil(() => cy.get('[data-testid="admin-promopanel-form-button-cancel"]').should('exist'));

            cy.checkA11y('[data-testid="StandardPage"]', {
                reportName: 'Promopanel Admin Edit',
                scopeName: 'Content',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
            testId('admin-promopanel-form-button-cancel').click();
        });
        it('can update data in form fields for a scheduled panel', () => {
            cy.viewport(1600, 1400);
            saveButtonIsDisabled(false);
            addScheduleIsDisabled(true);
            previewIsDisabled(false);
            testId('admin-promopanel-form-admin-note').type('Edit Admin Note');
            testId('admin-promopanel-form-title')
                .clear()

                .type('Edit Admin Title');
            cy.get('.ck-content')
                .clear()
                // It's possible to test bold italic etc with {cmd or ctrl}, but the results differ
                // depending on the platform. Best to just leave as plain text for testing.
                .type('Editing the content of the panel');
            saveButtonIsDisabled(false);
            previewIsDisabled(false);
            cy.get('#group-multiple-checkbox').click();
            cy.get('[data-value="hdr"]').click();
            cy.get('body').type('{esc}');
            testId('admin-promopanel-form-button-addSchedule').click();
            testId('admin-promopanel-form-button-removeSchedule-1').click();
            cy.get('#group-multiple-checkbox').click();
            cy.get('[data-value="hdr"]').click();
            cy.get('body').type('{esc}');
            testId('admin-promopanel-form-button-addSchedule').click();
            testId('admin-promopanel-form-button-save').click();
            //     testId('admin-promopanel-group-button-cancel').click();
            //     testId('admin-promopanel-form-button-save').click();
            testId('admin-promopanel-group-button-save').click();
            //     testId('panel-save-or-schedule-title').should('contain', 'Panel has been created');
            //     testId('admin-promopanel-group-button-save').click();
        });
        it('can close without modification', () => {
            cy.get('[data-testid="admin-promopanel-form-button-editSchedule-0"]').click();
            cy.get('[data-testid="admin-promopanel-group-button-cancel"]').click();
        });
        it('can edit an existing schedule', () => {
            cy.get('[data-testid="admin-promopanel-form-button-editSchedule-0"]').click();
            cy.get('[data-testid="admin-promopanel-form-start-date-edit-container"] button').click();
            cy.get('.MuiPickersCalendarHeader-labelContainer > .MuiButtonBase-root').click();

            cy.get('.MuiYearPicker-root')
                .contains('2049')
                .click({ force: true });
            cy.get('body').type('{esc}');
            cy.get('[data-testid="admin-promopanel-group-button-save"]').click();
            testId('admin-promopanel-form-button-save').click();
            testId('admin-promopanel-group-button-save').click();
        });
        it('can detect dates in the past', () => {
            cy.get('[data-testid="admin-promopanel-form-button-editSchedule-0"]').click();

            cy.get('[data-testid="admin-promopanel-form-start-date-edit-container"] button').click();
            cy.get('.MuiPickersCalendarHeader-labelContainer > .MuiButtonBase-root').click();
            cy.get('.MuiYearPicker-root')
                .contains('1999')
                .click({ force: true });
            cy.get('body').type('{esc}');

            cy.get('[data-testid="admin-promopanel-form-start-date-edit-container"] button').click();
            cy.get('.MuiPickersCalendarHeader-labelContainer > .MuiButtonBase-root').click();
            cy.get('.MuiYearPicker-root')
                .contains('2000')
                .click({ force: true });
            cy.get('body').type('{esc}');
            testId('start-date-warning').should('exist');
        });
    });
});
