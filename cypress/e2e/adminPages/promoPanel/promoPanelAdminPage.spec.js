import { saveButtonIsDisabled, previewIsDisabled, testId } from '../../../support/promopanel';

describe('Promopanel Admin Form Pages', () => {
    context('Promopanel Admin Add page', () => {
        beforeEach(() => {
            cy.visit('http://localhost:2020/admin/promopanel?user=uqstaff');
            cy.viewport(1300, 1400);
        });

        it('Admin page is accessible', () => {
            cy.injectAxe();
            cy.viewport(1300, 1400);
            cy.get('h2')
                .should('be.visible')
                .contains('panel');
            cy.waitUntil(() => testId('admin-promopanel-help-button').should('exist'));

            // Below test consistantly passes locally, however occasionally fails on build.
            // To review.

            // cy.checkA11y('[data-testid="StandardPage"]', {
            //     reportName: 'Promopanel List page',
            //     scopeName: 'Content',
            //     includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            // });
        });
        it('Help page functions', () => {
            cy.viewport(1300, 1400);
            cy.get('h2')
                .should('be.visible')
                .contains('panel');
            cy.waitUntil(() => testId('admin-promopanel-help-button').should('exist'));
            testId('admin-promopanel-help-button').click();
            testId('help-drawer-title')
                .should('exist')

                .should('be.visible');
            testId('promopanel-helpdrawer-close-button').click();
            testId('admin-promopanel-add-display-button').click();
            cy.waitUntil(() => testId('standard-card-create-a-promo-header').should('exist'));
        });

        it('Filter works correctly', () => {
            cy.viewport(1300, 1400);
            cy.get('h2')
                .should('be.visible')
                .contains('panel');
            cy.waitUntil(() => testId('admin-promopanel-help-button').should('exist'));
            testId('block-student').should('exist');
            testId('group-filter').click();
            testId('filter-select-hdr').click();
            cy.get('body').type('{esc}');
            testId('block-student').should('not.exist');
            testId('group-filter').click();
            testId('filter-select-hdr').click();
            cy.get('body').type('{esc}');
            testId('block-student').should('exist');
            testId('group-filter').click();
            testId('filter-select-hdr').click();
            cy.get('body').type('{esc}');
            testId('block-student').should('not.exist');
            testId('group-filter').click();
            testId('filter-clear-all').click();
            cy.get('body').type('{esc}');
            testId('block-student').should('exist');
        });
        it('can preview a past panel', () => {
            cy.viewport(1300, 1400);
            cy.get('h2')
                .should('be.visible')
                .contains('panel');
            cy.waitUntil(() => testId('admin-promopanel-help-button').should('exist'));
            testId('panel-list-item-preview-50-none').click();
            testId('promo-panel-header')
                .should('exist')
                .should('contain', 'past panel');
            testId('admin-promopanel-preview-button-cancel').click();
            testId('promo-panel-header').should('not.exist');
        });

        it('List Scheduler works correctly', () => {
            cy.viewport(1300, 1400);
            cy.get('h2')
                .should('be.visible')
                .contains('panel');
            cy.waitUntil(() => testId('admin-promopanel-help-button').should('exist'));
            testId('schedule-panel-hdr').click();
            cy.get('[data-testid="admin-promopanel-group-start-date-button"]').click();
            cy.get('.MuiDayCalendar-weekContainer:first-of-type > button:first-of-type').click();
            cy.get('body').type('{esc}');
            cy.get('[data-testid="admin-promopanel-group-end-date-button"]').click();
            cy.get(
                '.MuiPaper-root[style*="opacity: 1"] .MuiDayCalendar-weekContainer:last-of-type > button:first-of-type',
            ).click();
            cy.get('body').type('{esc}');

            cy.get('#group-selector').click({ force: true });
            cy.get('#new-scheduled-panel-for-group').click();
            cy.get('[data-value="7"]').click();
            testId('admin-promopanel-group-button-save').click();
            testId('ListTableSpinner-groupPanels').should('exist'); // Loading
            testId('ListTableSpinner-groupPanels').should('not.exist'); // Loading Finished
        });
        it('Can clone a panel as a scheduled panel', () => {
            cy.viewport(1300, 1400);
            cy.get('h2')
                .should('be.visible')
                .contains('panel');
            cy.waitUntil(() => testId('admin-promopanel-help-button').should('exist'));
            testId('panel-list-arrowicon-2-none').click();
            testId('2-clone-button-none').click();
            testId('admin-promoPanel-help-button').click();
            testId('help-drawer-title').should('exist');
            testId('promopanel-helpdrawer-close-button').click();
            testId('admin-promopanel-form-admin-note').type('Test Admin Note');
            testId('admin-promopanel-form-title')
                .clear()
                .type('Test Admin Title');
            // It's possible to test bold italic etc with {cmd or ctrl}, but the results differ
            // depending on the platform. Best to just leave as plain text for testing.
            cy.typeCKEditor('.ck-content[contenteditable=true]', 'This is the content of the panel');
            saveButtonIsDisabled(false);
            previewIsDisabled(false);
            cy.get('#group-multiple-checkbox').click();
            cy.get('[data-value="alumni"]').click();
            cy.get('body').type('{esc}');
            testId('admin-promopanel-form-button-addSchedule').click();
            testId('admin-promopanel-form-button-save').click();
            testId('panel-save-or-schedule-title').should('contain', 'Panel has been created');
        });

        it('can detect dates in the past', () => {
            cy.viewport(1300, 1400);
            cy.get('h2')
                .should('be.visible')
                .contains('panel');
            cy.waitUntil(() => testId('admin-promopanel-help-button').should('exist'));
            testId('schedule-panel-hdr').click();
            cy.get('[data-testid="admin-promopanel-group-start-date-button"]').click();
            cy.contains(new Date().getFullYear()).click();
            cy.get('.MuiPickersYear-root')
                .contains('1999')
                .click({ force: true });
            cy.get('body').type('{esc}');
            testId('start-date-error').should('contain', 'This date is in the past');

            cy.get('[data-testid="admin-promopanel-group-end-date-button"]').click();
            cy.contains(new Date().getFullYear()).click();
            cy.get('.MuiPickersYear-root')
                .contains('1999')
                .click({ force: true });
            cy.get('body').type('{esc}');

            testId('end-date-error').should('contain', 'This date is in the past');
        });
        it('can unschedule a panel', () => {
            cy.viewport(1300, 1400);
            cy.get('h2')
                .should('be.visible')
                .contains('panel');
            cy.waitUntil(() => testId('admin-promopanel-help-button').should('exist'));
            testId('panel-list-arrowicon-8-student').click();
            testId('8-delete-button').click();
            testId('cancel-panel-delete-confirm').click();
            testId('panel-list-arrowicon-8-student').click();
            testId('8-delete-button').click();
            testId('confirm-panel-delete-confirm').click();
            testId('ListTableSpinner-groupPanels').should('exist'); // Loading
            testId('ListTableSpinner-groupPanels').should('not.exist'); // Loading Finished
        });
        it('can delete a panel', () => {
            cy.viewport(1300, 1400);
            cy.get('h2')
                .should('be.visible')
                .contains('panel');
            cy.waitUntil(() => testId('admin-promopanel-help-button').should('exist'));
            testId('panel-list-arrowicon-2-none').click();
            testId('2-delete-button').click();
            testId('confirm-panel-delete-confirm').click();
            testId('message-title').should('contain', 'Some records did not delete successfully');
            testId('confirm-panel-delete-error-dialog').click();
            testId('panel-list-arrowicon-99-none').click();
            testId('99-delete-button').click();
            testId('confirm-panel-delete-confirm').click();
            testId('message-title').should('not.be.visible');
        });
    });
});
