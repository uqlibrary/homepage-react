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
        it('can enter new data into form fields for non-assigned panel', () => {
            testId('admin-promoPanel-help-button').click();
            testId('help-drawer-title').should('exist');
            testId('promopanel-helpdrawer-close-button').click();
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
            testId('admin-promopanel-form-button-save').click();
            testId('panel-save-or-schedule-title').should('contain', 'Panel has been created');
            testId('admin-promopanel-group-button-save').click();
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
            cy.get('[data-value="alumni"]').click();
            cy.get('body').click();
            // testId('standard-card-create-a-promo-header').click();
            testId('admin-promopanel-form-button-addSchedule').click();
            testId('admin-promopanel-form-button-save').click();
            testId('admin-promopanel-group-button-cancel').click();
            testId('admin-promopanel-form-button-save').click();
            testId('admin-promopanel-group-button-save').click();
            // testId('panel-save-or-schedule-title').should('contain', 'Panel has been created');
            // testId('admin-promopanel-group-button-save').click();
        });
        it('can detect overlaps on start and end for new panels', () => {
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
            cy.get('#group-multiple-checkbox').click();
            cy.get('[data-value="hdr"]').click();
            // cy.get('#new-scheduled-panel-for-group').click();
            cy.get('body').click();
            // Create first date range
            cy.get(
                '[data-testid="admin-promopanel-form-start-date"] > .MuiInputBase-root > .MuiInputAdornment-root > .MuiButtonBase-root',
            ).click();
            cy.contains(new Date().getFullYear()).click();
            cy.get('.MuiPickersYearSelection-container')
                .contains('2050')
                .click({ force: true });
            cy.get('.MuiDialogActions-root > :nth-child(3)').click();
            cy.get(
                '[data-testid="admin-promopanel-form-end-date"] > .MuiInputBase-root > .MuiInputAdornment-root > .MuiButtonBase-root',
            ).click();
            cy.get('.MuiToolbar-root')
                .contains('2050')

                .click();
            cy.get('.MuiPickersYearSelection-container')
                .contains('2052')
                .click({ force: true });
            cy.get('.MuiDialogActions-root > :nth-child(2)').click();
            cy.get('[data-testid="admin-promopanel-form-button-addSchedule"]').click();
            // Add new record, overlapping start date.
            cy.get('#group-multiple-checkbox').click();
            cy.get('[data-value="hdr"]').click();
            cy.get('body').click();
            // Create second date range
            cy.get(
                '[data-testid="admin-promopanel-form-start-date"] > .MuiInputBase-root > .MuiInputAdornment-root > .MuiButtonBase-root',
            ).click();
            cy.get('.MuiToolbar-root')
                .contains('2050')

                .click({ force: true });
            cy.get('.MuiPickersYearSelection-container')
                .contains('2049')
                .click({ force: true });
            cy.get('.MuiDialogActions-root > :nth-child(3)').click();
            cy.get(
                '[data-testid="admin-promopanel-form-end-date"] > .MuiInputBase-root > .MuiInputAdornment-root > .MuiButtonBase-root',
            ).click();
            cy.get('.MuiToolbar-root')
                .contains('2052')

                .click();
            cy.get('.MuiPickersYearSelection-container')
                .contains('2049')
                .click({ force: true });
            cy.get('.MuiDialogActions-root > :nth-child(2)').click();
            cy.get('[data-testid="admin-promopanel-form-button-addSchedule"]').click();
            testId('admin-promopanel-form-button-editSchedule-1').click();
            cy.get('#admin-promopanel-group-end-date').click();
            cy.get('.MuiToolbar-root')
                .contains('2049')
                .click({ force: true });
            cy.get('.MuiPickersYearSelection-container')
                .contains('2051')
                .click();
            cy.get('.MuiDialogActions-root > :nth-child(3)').click();
            cy.get('[data-testid="admin-promopanel-group-button-save"]').click();
            cy.get('[data-testid="panel-save-or-schedule-title"]').should('contain', 'Schedule Conflict');
            cy.get('[data-testid="admin-promopanel-group-button-cancel"]').click({ multiple: true, force: true });
            // cy.get('[data-testid="panel-save-or-schedule-title"]').should('not.be.visible');
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