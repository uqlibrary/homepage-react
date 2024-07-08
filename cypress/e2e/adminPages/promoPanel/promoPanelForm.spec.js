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
            cy.get('uq-site-header')
                .shadow()
                .within(() => {
                    cy.get('[data-testid="subsite-title"]')
                        .should('exist')
                        .should('be.visible')
                        .contains('Promo panel admin');
                });
            testId('admin-promoPanel-help-button').click();
            testId('help-drawer-title').should('exist');
            testId('promopanel-helpdrawer-close-button').click();
            saveButtonIsDisabled(true);
            addScheduleIsDisabled(true);
            previewIsDisabled(true);
            testId('admin-promopanel-form-admin-note').type('Test Admin Note');
            testId('admin-promopanel-form-title').type('Test Admin Title');

            // It's possible to test bold italic etc with {cmd or ctrl}, but the results differ
            // depending on the platform. Best to just leave as plain text for testing.
            cy.typeCKEditor('.ck-content[contenteditable=true]', 'This is the content of the panel');
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
            // It's possible to test bold italic etc with {cmd or ctrl}, but the results differ
            // depending on the platform. Best to just leave as plain text for testing.
            cy.typeCKEditor('.ck-content[contenteditable=true]', 'This is the content of the panel');
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
            cy.get('body').type('{esc}');
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
            // It's possible to test bold italic etc with {cmd or ctrl}, but the results differ
            // depending on the platform. Best to just leave as plain text for testing.
            cy.typeCKEditor('.ck-content[contenteditable=true]', 'This is the content of the panel');
            saveButtonIsDisabled(false);
            previewIsDisabled(false);
            cy.get('#group-multiple-checkbox').click();
            cy.get('[data-value="hdr"]').click();
            // cy.get('#new-scheduled-panel-for-group').click();
            cy.get('body').type('{esc}');
            // Create first date range
            cy.get('[data-testid="admin-promopanel-form-start-date-container"] button').click();
            cy.contains(new Date().getFullYear()).click();
            cy.get('.MuiYearPicker-root')
                .contains('2050')
                .click({ force: true });
            cy.get('body').type('{esc}');

            cy.get('[data-testid="admin-promopanel-form-end-date-container"] button').click();
            cy.contains(new Date().getFullYear()).click();
            cy.get('.MuiYearPicker-root')
                .contains('2052')
                .click({ force: true });
            cy.get('body').type('{esc}');

            cy.get('[data-testid="admin-promopanel-form-button-addSchedule"]').click();

            // Add new record, overlapping start date.
            cy.get('#group-multiple-checkbox').click();
            cy.get('[data-value="hdr"]').click();
            cy.get('body').type('{esc}');
            // Create second date range
            cy.get('[data-testid="admin-promopanel-form-start-date-container"] button').click();
            cy.get('.MuiPickersCalendarHeader-labelContainer > .MuiButtonBase-root').click();

            cy.get('.MuiYearPicker-root')
                .contains('2049')
                .click({ force: true });
            cy.get('body').type('{esc}');

            cy.wait(200); // allow time for the previous calendar to be fully removed from the dom, or it gets confused
            cy.get('[data-testid="admin-promopanel-form-end-date-container"] button').click();
            cy.get('.MuiPickersCalendarHeader-labelContainer > .MuiButtonBase-root').click();
            cy.get('.MuiYearPicker-root')
                .contains('2051')
                .click({ force: true });
            cy.get('body').type('{esc}');
            cy.get('[data-testid="admin-promopanel-form-button-addSchedule"]').click();
            cy.get('[data-testid="panel-save-or-schedule-title"]').should('contain', 'Schedule Conflict');
            cy.get('[data-testid="admin-promopanel-group-button-cancel"]').click({ multiple: true, force: true });
            cy.get('[data-testid="panel-save-or-schedule-title"]').should('not.exist');
        });
        it('can enter new data into form fields for a scheduled panel, detecting conflicts', () => {
            saveButtonIsDisabled(true);
            addScheduleIsDisabled(true);
            previewIsDisabled(true);
            testId('admin-promopanel-form-admin-note').type('Test Admin Note');
            testId('admin-promopanel-form-title').type('Test Admin Title');
            // It's possible to test bold italic etc with {cmd or ctrl}, but the results differ
            // depending on the platform. Best to just leave as plain text for testing.
            cy.typeCKEditor('.ck-content[contenteditable=true]', 'This is the content of the panel');
            saveButtonIsDisabled(false);
            previewIsDisabled(false);
            cy.wait(200);
            testId('admin-promopanel-form-button-preview').click();
            testId('promopanel-preview-title').should('be.visible');
            testId('admin-promopanel-preview-button-cancel').click();
            testId('promopanel-preview-title').should('not.be.visible');
            testId('standard-card-schedule-or-set-a-default-panel-content').should('be.visible');
            // testId('admin-promopanel-form-default-panel').click();
            cy.get('#group-multiple-checkbox').click();
            cy.get('[data-value="student"]').click();
            cy.get('body').type('{esc}');
            testId('admin-promopanel-form-button-addSchedule').click();
            testId('panel-save-or-schedule-title').should('contain', 'Schedule Conflict');
            testId('admin-promopanel-group-button-cancel').click();
            cy.get('#group-multiple-checkbox').click();
            cy.get('[data-value="student"]').click();
            cy.get('[data-value="hdr"]').click();
            cy.get('body').type('{esc}');
            cy.wait(200);
            testId('admin-promopanel-form-button-addSchedule').click();
            testId('admin-promopanel-form-button-save').click();
            testId('panel-save-or-schedule-title').should('contain', 'Panel has been created');
            testId('admin-promopanel-group-button-cancel').click();
        });

        const createGroupConflict = pass => {
            cy.get('#group-multiple-checkbox').click();
            cy.get('[data-value="other"]').click();
            // cy.get('[data-value="Other"]').click();
            cy.get('body').type('{esc}');
            cy.wait(100);
            // Start Date
            cy.get('[data-testid="admin-promopanel-form-start-date-container"] button').click();
            cy.get('.MuiPickersCalendarHeader-label').click();
            cy.get('.MuiYearPicker-root')
                .contains(pass === 1 ? '2060' : '2071')
                .click({ force: true });
            cy.get('body').type('{esc}');

            // End Date
            cy.wait(200); // allow time for the previous calendar to be fully removed from the dom, or it gets confused
            cy.get('[data-testid="admin-promopanel-form-end-date-container"] button').click();
            cy.get('.MuiPickersCalendarHeader-label').click();
            cy.get('.MuiYearPicker-root')
                .contains(pass === 1 ? '2070' : '2081')
                .click({ force: true });
            cy.get('body').type('{esc}');

            testId('admin-promopanel-form-button-addSchedule').click();
        };

        it('handles new and existing group date conflicts', () => {
            saveButtonIsDisabled(true);
            addScheduleIsDisabled(true);
            previewIsDisabled(true);
            testId('admin-promopanel-form-admin-note').type('Test Admin Note');
            testId('admin-promopanel-form-title').type('Test Admin Title');
            // It's possible to test bold italic etc with {cmd or ctrl}, but the results differ
            // depending on the platform. Best to just leave as plain text for testing.
            cy.typeCKEditor('.ck-content[contenteditable=true]', 'This is the content of the panel');
            saveButtonIsDisabled(false);
            previewIsDisabled(false);
            cy.wait(200);
            testId('admin-promopanel-form-button-preview').click();
            testId('promopanel-preview-title').should('be.visible');
            testId('admin-promopanel-preview-button-cancel').click();
            testId('promopanel-preview-title').should('not.be.visible');
            testId('standard-card-schedule-or-set-a-default-panel-content').should('be.visible');
            createGroupConflict(1);
            createGroupConflict(2);
            // Now cause the list conflict, start date inside schedule
            cy.data('admin-promopanel-form-button-editSchedule-1').click();
            cy.get('[data-testid="admin-promopanel-form-start-date-edit-container"] .MuiButtonBase-root').click();
            cy.get('.MuiPickersCalendarHeader-labelContainer').click();
            cy.get('.MuiYearPicker-root')
                .contains('2062')
                .click({ force: true });
            cy.get('body').type('{esc}');
            cy.get('[data-testid="admin-promopanel-group-button-save"]').click();
            cy.get('[data-testid="panel-save-or-schedule-title"]')
                .should('contain', 'Schedule Conflict')
                .should('be.visible');
            cy.get('[data-testid="admin-promopanel-group-button-cancel"]:last-of-type').click();
            // Fix the start
            cy.get('[data-testid="admin-promopanel-form-start-date-edit-container"] .MuiButtonBase-root').click();
            cy.get('.MuiPickersCalendarHeader-labelContainer').click();
            cy.get('.MuiYearPicker-root')
                .contains('2059')
                .click({ force: true });
            cy.get('body').type('{esc}');
            // Error the end date
            cy.wait(200); // allow time for the previous calendar to be fully removed from the dom, or it gets confused
            cy.get('[data-testid="admin-promopanel-form-end-date-edit-container"] .MuiButtonBase-root').click();
            cy.get('.MuiPickersCalendarHeader-labelContainer').click();
            cy.get('.MuiYearPicker-root')
                .contains('2069')
                .click({ force: true });
            cy.get('body').type('{esc}');
            cy.get('[data-testid="admin-promopanel-group-button-save"]').click();
            cy.get('[data-testid="panel-save-or-schedule-title"]')
                .should('contain', 'Schedule Conflict')
                .should('be.visible');
        });
    });
});
