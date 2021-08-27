import moment from 'moment';

const numberCurrentPublishedSpotlights = 3;
const totalCountPastRecords = 34;

function getFooterLabel(totalCountRecordsAvailable, numberDisplayedOnPage = 5) {
    // eg '1-5 of 34'
    return `1-${numberDisplayedOnPage} of ${totalCountRecordsAvailable}`;
}

function dragzoneIsReadyForDrag() {
    cy.get('[data-testid="dropzone-dragarea"]').should('exist');
    cy.get('[data-testid="dropzone-preview"]').should('not.exist');
}

function dragFileToDropzone(uploadableFile) {
    dragzoneIsReadyForDrag();
    cy.fixture(uploadableFile, 'base64').then(content => {
        cy.get('[data-testid="spotlights-form-upload-dropzone"]')
            // uploadFile is a custom command - see commands.js
            .uploadFile(content, uploadableFile);
    });
    cy.get('[data-testid="dropzone-dragarea"]').should('not.exist');
    cy.get('[data-testid="dropzone-preview"]').should('exist');
}

function saveButtonisDisabled() {
    cy.get('[data-testid="admin-spotlights-form-button-save"]').should('be.disabled');
}

function saveButtonNOTDisabled() {
    cy.get('[data-testid="admin-spotlights-form-button-save"]').should('not.be.disabled');
}

describe('Spotlights Admin Pages', () => {
    const numRowsHiddenAsNoDatainfo = 1;
    context('Spotlights Admin public access blocked', () => {
        it('the list page is not available to public users', () => {
            cy.visit('http://localhost:2020/admin/spotlights?user=public');
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Authentication required');
        });
        it('the add page is not available to public users', () => {
            cy.visit('http://localhost:2020/admin/spotlights/add?user=public');
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Authentication required');
        });
        it('the edit page is not available to public users', () => {
            cy.visit('http://localhost:2020/admin/spotlights/edit/9eab3aa0-82c1-11eb-8896-eb36601837f5?user=public');
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Authentication required');
        });
    });
    context('Spotlights Admin unauthorised access blocked', () => {
        it('the list page is not available to non-authorised users', () => {
            cy.visit('http://localhost:2020/admin/spotlights?user=uqstaffnonpriv');
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Permission denied');
        });
        it('the add page is not available to non-authorised users', () => {
            cy.visit('http://localhost:2020/admin/spotlights/add?user=uqstaffnonpriv');
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Permission denied');
        });
        it('the edit page is not available to non-authorised users', () => {
            cy.visit(
                'http://localhost:2020/admin/spotlights/edit/9eab3aa0-82c1-11eb-8896-eb36601837f5?user=uqstaffnonpriv',
            );
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Permission denied');
        });
    });
    context('Spotlights list page', () => {
        beforeEach(() => {
            cy.visit('http://localhost:2020/admin/spotlights?user=uqstaff');
            cy.viewport(1300, 1000);
        });

        it('displays a list of spotlights to the authorised user', () => {
            cy.get('[data-testid="spotlight-list-current"]').should('be.visible');
            cy.wait(100);
            cy.get('[data-testid="spotlight-list-current"] tbody')
                .children()
                .should('have.length', numberCurrentPublishedSpotlights + numRowsHiddenAsNoDatainfo);
            // cy.get('[data-testid="headerRow-count-current"]').contains('1 spotlight');

            // only the scheduled spotlight has a 'scheduled' icon
            // not currently visible - move to test to after toggle is turned on
            // cy.get('svg[data-testid="spotlight-current-icon-3fa92cc0-6ab9-11e7-839f-a1392c2927cc"]')
            // .should('exist');
            // current spotlight exists, but it does not have a 'scheduled' icon
            cy.get('tr[data-testid="spotlight-list-row-9eab3aa0-82c1-11eb-8896-eb36601837f5"]').should('exist');
            cy.get('svg[data-testid="spotlight-current-icon-9eab3aa0-82c1-11eb-8896-eb36601837f5"]').should(
                'not.exist',
            );

            // cy.wait(500);
            cy.get('[data-testid="admin-spotlights-list-past-list"]').should('be.visible');
            // cy.get('[data-testid="headerRow-count-past"]').contains('78 spotlights');
            cy.get('[data-testid="admin-spotlights-list-past-list"] tbody').scrollIntoView();
            cy.get('[data-testid="admin-spotlights-list-past-list"] tbody ')
                .children()
                .should('have.length', 5 + numRowsHiddenAsNoDatainfo);
            // cy.get('[data-testid="admin-spotlights-list-past-list"] tfoot').should('not.exist');
            cy.get('[data-testid="admin-spotlights-list-past-list"] tfoot').should('exist');
            cy.get('[data-testid="admin-spotlights-list-past-list"] tfoot').contains(
                getFooterLabel(totalCountPastRecords),
            );
        });
        it('is accessible', () => {
            cy.injectAxe();
            cy.viewport(1300, 1000);
            cy.get('h2').should('be.visible');
            cy.get('h2').contains('All spotlights');
            cy.wait(500);
            cy.checkA11y('[data-testid="StandardPage"]', {
                reportName: 'Spotlights Admin',
                scopeName: 'Content',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
        it('the footer paginator shows all links when "all" is selected', () => {
            cy.get('[data-testid="admin-spotlights-list-past-list"] tfoot').contains(
                getFooterLabel(totalCountPastRecords),
            );
            cy.get(
                '[data-testid="admin-spotlights-list-past-list"] [data-testid="admin-spotlights-list-paginator-select"]',
            ).select('All');
            cy.get(
                '[data-testid="admin-spotlights-list-past-list"] [data-testid="admin-spotlights-list-paginator-select"]',
            ).should('have.value', totalCountPastRecords);
            cy.get('[data-testid="admin-spotlights-list-past-list"] tbody ')
                .children()
                .should('have.length', totalCountPastRecords + numRowsHiddenAsNoDatainfo);
            cy.get('[data-testid="admin-spotlights-list-past-list"] tfoot').contains(
                getFooterLabel(totalCountPastRecords, totalCountPastRecords),
            );

            // reload the page and the cookie being set means it is still on 'all'
            cy.visit('http://localhost:2020/admin/spotlights?user=uqstaff');
            cy.viewport(1300, 1000);
            cy.get('[data-testid="admin-spotlights-list-past-list"] tfoot').contains(
                getFooterLabel(totalCountPastRecords, totalCountPastRecords),
            );
        });

        it.skip('can reorder the list', () => {
            // function moveRowTry3(dragSelector, x, y) {
            //     console.log(dragSelector, x, y);
            //     cy.get(dragSelector).should('exist');
            //     cy.wait(1000);
            //
            //     cy.get(dragSelector)
            //         .trigger('mousedown', { which: 1 })
            //         .trigger('dragstart', {})
            //         .trigger('drag', { clientX: 0, clientY: 500 });
            //     cy.get(dragSelector)
            //         .parent()
            //         .trigger('dragover')
            //         .trigger('drop')
            //         .trigger('dragend')
            //         .trigger('mouseup');
            // }

            // function moveRowTry2(dragSelector, x, y) {
            //     console.log(dragSelector, x, y);
            //     cy.get(dragSelector).should('exist');
            //     console.log('parent 0 = ', cy.get(dragSelector).parent());
            //     // console.log('parent 0 = ', cy.get(dragSelector).parent().eq(0));
            //     // console.log('parent 1 = ', cy.get(dragSelector).parent().eq(1));
            //
            //     cy.window().then(win => {
            //         console.log('dragSelector = ', cy.get(dragSelector));
            //         cy.get(dragSelector)
            //             .eq(0)
            //             .then($element =>
            //                 $element[0].dispatchEvent(
            //                     // new win.MouseEvent('mousedown', { button: 1, clientX: 100, clientY: 100 }),
            //                     new win.MouseEvent('mousedown'),
            //                 ),
            //             );
            //         cy.get(dragSelector)
            //             .parent()
            //             .eq(0)
            //             .then($element =>
            //                 $element[0].dispatchEvent(new win.MouseEvent('mousemove', {clientX: x, clientY: y})),
            //             )
            //             .then($element =>
            //                 // $element[0].dispatchEvent(
            //                 // new win.MouseEvent('mouseup', { clientX: 100, clientY: 100 })),
            //                 $element[0].dispatchEvent(new win.MouseEvent('mouseup')),
            //             );
            //     });
            //     cy.log('after dragging');
            //     // const draggable = dragSelector; // Cypress.$(dragSelector);
            //     // console.log('draggable = ', draggable);
            //     // draggable.dispatchEvent(new MouseEvent('mousedown'));
            //     // draggable.dispatchEvent(new MouseEvent('mousemove', { clientX: x, clientY: y }));
            //     // draggable.dispatchEvent(new MouseEvent('mouseup'));
            // }

            // function moveRowTry0(dragSelector, x, y) {
            //     console.log(dragSelector, x, y);
            //     // https://github.com/cypress-io/cypress-example-recipes/blob/master/examples/testing-dom__drag-drop/cypress/integration/drag_n_drop_spec.js
            //
            //     cy.get(dragSelector)
            //         .should('exist')
            //         // .parent()
            //         .trigger('mousedown', { which: 1 })
            //         .trigger('mousemove', { clientX: x, clientY: y })
            //         .trigger('mouseup', { force: true });
            // }

            function moveRow(dragSelector, x, y) {
                console.log(dragSelector, x, y);
                // https://github.com/cypress-io/cypress-example-recipes/blob/master/examples/testing-dom__drag-drop/cypress/integration/drag_n_drop_spec.js

                cy.get(dragSelector)
                    .should('exist')
                    .trigger('mouseover', { pageX: 600, pageY: 200 })
                    .trigger('mousedown', { which: 1 })
                    // .wait(1000)
                    .trigger('mousemove', { clientX: x, clientY: y })
                    .trigger('mouseup', { force: true });
                cy.wait(1000);
            }

            // function moveRowTry5(dragSelector, x, y) {
            // // from https://github.com/atlassian/react-beautiful-dnd/tree/master/cypress
            //     const space = 32;
            //     const arrowRight = 39;
            //     console.log(dragSelector, x, y);
            //     cy.get(dragSelector)
            //         .focus()
            //         .should('contain', 'Can be dragged')
            //         .trigger('keydown', { keyCode: space })
            //         .trigger('keydown', { keyCode: arrowRight, force: true })
            //         // finishing before the movement time is fine - but this looks nice
            //         // .wait(timings.outOfTheWay * 1000)
            //         .trigger('keydown', { keyCode: space, force: true });
            // }

            // show all items
            cy.get('[data-testid="spotlights-show-scheduled"] input').check();
            cy.get('[data-testid="spotlights-show-published"] input').check();

            // list is currently order 1, 2
            cy.get('div[data-testid="spotlight-list-current"] tbody tr:first-child').should(
                'contain',
                'Can be dragged',
            );
            cy.get('div[data-testid="spotlight-list-current"] tbody tr:nth-child(2)').should('contain', 'break_01');
            cy.wait(1000); // dev
            // get 1, drag to 2
            moveRow('[data-testid="spotlight-list-row-3fa92cc0-6ab9-11e7-839f-a1392c2927cc"]', 0, 500);
            // cy.wait(1000); // dev

            // list is now order 2, 1
            cy.get('div[data-testid="spotlight-list-current"] tbody tr:first-child').should('contain', 'break_01');
            cy.get('div[data-testid="spotlight-list-current"] tbody tr:nth-child(2)').should(
                'contain',
                'Can be dragged',
            );
            cy.get('div[data-testid="spotlight-list-current"] tbody tr:first-child').should(
                'contain',
                'blah blah blah',
            ); // fail test
        });
    });
    context('Spotlight Admin deletion', () => {
        /*
            9eab3aa0-82c1-11eb-8896-eb36601837f5 #1 of current - can be deleted
            1e7a5980-d7d6-11eb-a4f2-fd60c7694898 #2 of current
            38cbf430-8693-11e9-98ab-9d52a58e86ca #3 of current
            1e1b0e10-c400-11e6-a8f0-47525a49f469 #1 of past - can be deleted
            d8ec8820-07b1-11e7-a7ef-ef4338d401a6 #2 of past - can be deleted
            a7764f90-198d-11e7-9f30-3dc758d83fd5 #3 of past - can be deleted
            f0a1de60-1999-11e7-af36-7d945160e88f #4 of past)

         */
        beforeEach(() => {
            cy.visit('http://localhost:2020/admin/spotlights?user=uqstaff');
            cy.viewport(1300, 1000);
        });
        it('the user can select an spotlight to delete', () => {
            // select one spotlight and every thing looks right
            cy.get('[data-testid="headerRow-current"]').should('have.css', 'background-color', 'rgba(0, 0, 0, 0)');
            cy.get('[data-testid="headerRow-current"] span.deleteManager').should('not.exist');
            cy.get('[data-testid="spotlight-list-item-checkbox-9eab3aa0-82c1-11eb-8896-eb36601837f5"]').check();
            cy.get('[data-testid="headerRow-current"]').should('have.css', 'background-color', 'rgb(35, 119, 203)');
            cy.get('[data-testid="headerRow-current"] span.deleteManager span').contains('1 spotlight selected');
            cy.get('[data-testid="spotlight-list-item-checkbox-9eab3aa0-82c1-11eb-8896-eb36601837f5"]').uncheck();
            cy.get('[data-testid="headerRow-current"] span.deleteManager').should('not.exist');

            // select two spotlights and every thing looks right
            cy.get('[data-testid="spotlight-list-item-checkbox-38cbf430-8693-11e9-98ab-9d52a58e86ca"]').check();
            cy.get('[data-testid="spotlight-list-item-checkbox-1e7a5980-d7d6-11eb-a4f2-fd60c7694898"]').check();
            cy.get('[data-testid="headerRow-current"] span.deleteManager span').contains('2 spotlights selected');

            // back down to one spotlight selected and every thing looks right
            cy.get('[data-testid="spotlight-list-item-checkbox-38cbf430-8693-11e9-98ab-9d52a58e86ca"]').uncheck();
            cy.get('[data-testid="headerRow-current"] span.deleteManager span').contains('1 spotlight selected');

            // click the delete button and the delete confirmation dialog appears
            cy.get('[data-testid="spotlight-list-current-delete-button"]').click();
            cy.get('[data-testid="cancel-spotlight-delete-confirm"]').should('exist');
            // close dialog (without deleting)
            cy.get('[data-testid="cancel-spotlight-delete-confirm"]').click();
            cy.get('[data-testid="dialogbox-spotlight-delete-confirm"]').should('not.exist');
        });

        it('the user can delete a spotlight', () => {
            cy.get('[data-testid="spotlight-list-item-checkbox-9eab3aa0-82c1-11eb-8896-eb36601837f5"]').check();
            cy.get('[data-testid="headerRow-current"] span span').contains('1 spotlight selected');

            // click the Proceed button and the spotlight is deleted
            cy.get('[data-testid="spotlight-list-current-delete-button"]').click();
            cy.get('[data-testid="confirm-spotlight-delete-confirm"]').should('exist');
            cy.get('[data-testid="confirm-spotlight-delete-confirm"]').contains('Proceed');
            cy.get('[data-testid="confirm-spotlight-delete-confirm"]').click();
            // dialog disappears
            cy.get('[data-testid="dialogbox-spotlight-delete-confirm"]').should('not.exist');
            // cant test list further to show spotlight is gone as mock data doesnt actually delete
        });

        it('reports when a delete fails', () => {
            cy.get('[data-testid="spotlight-list-item-checkbox-38cbf430-8693-11e9-98ab-9d52a58e86ca"]').check();
            cy.get('[data-testid="headerRow-current"] span span').contains('1 spotlight selected');
            // click bin icon
            cy.get('[data-testid="spotlight-list-current-delete-button"]').click();
            // a confirm dialog popsup
            cy.get('[data-testid="confirm-spotlight-delete-confirm"]').should('exist');
            cy.get('[data-testid="confirm-spotlight-delete-confirm"]').contains('Proceed');
            // click the Proceed button and delete is attempted
            cy.get('[data-testid="confirm-spotlight-delete-confirm"]').click();
            cy.get('[data-testid="dialogbox-spotlight-delete-confirm"]').should('not.exist');
            // failure is reported in a dialog
            cy.get('[data-testid="dialogbox-spotlight-delete-error-dialog"]').should('exist');
            cy.get('[data-testid="dialogbox-spotlight-delete-error-dialog"] h2').contains(
                'Record Deletion was not successful',
            );
            // dialog can be closed
            cy.get('[data-testid="confirm-spotlight-delete-error-dialog"]').should('exist');
            cy.get('[data-testid="confirm-spotlight-delete-error-dialog"]').click();
            cy.get('[data-testid="dialogbox-spotlight-delete-error-dialog"]').should('not.exist');
        });
        it('sequential deletion of spotlights does not fail', () => {
            cy.get('[data-testid="spotlight-list-item-checkbox-1e1b0e10-c400-11e6-a8f0-47525a49f469"]').check();
            cy.get('[data-testid="headerRow-past"] span span').contains('1 spotlight selected');
            // click bin icon
            cy.get('[data-testid="spotlight-list-past-delete-button"]').click();
            // a confirm dialog popsup
            cy.get('[data-testid="confirm-spotlight-delete-confirm"]').should('exist');
            cy.get('[data-testid="confirm-spotlight-delete-confirm"]').contains('Proceed');
            // click the Proceed button and delete is attempted
            cy.get('[data-testid="confirm-spotlight-delete-confirm"]').click();
            cy.get('[data-testid="dialogbox-spotlight-delete-confirm"]').should('not.exist');
            cy.wait(500);
            // the error dialog doesnt appear
            cy.get('[data-testid="dialogbox-spotlight-delete-error-dialog"]').should('not.exist');
            // subsequent deletes also succeed
            cy.get('[data-testid="spotlight-list-item-checkbox-d8ec8820-07b1-11e7-a7ef-ef4338d401a6"]').check();
            cy.get('[data-testid="headerRow-past"] span span').contains('1 spotlight selected');
            cy.get('[data-testid="spotlight-list-item-checkbox-a7764f90-198d-11e7-9f30-3dc758d83fd5"]').check();
            cy.get('[data-testid="headerRow-past"] span span').contains('2 spotlights selected');
            // click bin icon
            cy.get('[data-testid="spotlight-list-past-delete-button"]').click();
            // a confirm dialog popsup
            cy.get('[data-testid="confirm-spotlight-delete-confirm"]').should('exist');
            cy.get('[data-testid="confirm-spotlight-delete-confirm"]').contains('Proceed');
            // click the Proceed button and delete is attempted
            cy.get('[data-testid="confirm-spotlight-delete-confirm"]').click();
            cy.get('[data-testid="dialogbox-spotlight-delete-confirm"]').should('not.exist');
            cy.wait(500);
            // the error dialog doesnt appear
            cy.get('[data-testid="dialogbox-spotlight-delete-error-dialog"]').should('not.exist');
        });
        it('during delete section checkboxes in other sections are disabled', () => {
            cy.get('[data-testid="spotlight-list-item-checkbox-9eab3aa0-82c1-11eb-8896-eb36601837f5"]').should(
                'not.be.disabled',
            );
            cy.get('[data-testid="spotlight-list-item-checkbox-f0a1de60-1999-11e7-af36-7d945160e88f"]').should(
                'not.be.disabled',
            );

            cy.get('[data-testid="spotlight-list-item-checkbox-d8ec8820-07b1-11e7-a7ef-ef4338d401a6"]').check();
            cy.get('[data-testid="spotlight-list-item-checkbox-9eab3aa0-82c1-11eb-8896-eb36601837f5"]').should(
                'be.disabled',
            );
            cy.get('[data-testid="spotlight-list-item-checkbox-f0a1de60-1999-11e7-af36-7d945160e88f"]').should(
                'not.be.disabled',
            );

            cy.get('[data-testid="spotlight-list-item-checkbox-a7764f90-198d-11e7-9f30-3dc758d83fd5"]').check();
            cy.get('[data-testid="spotlight-list-item-checkbox-1e1b0e10-c400-11e6-a8f0-47525a49f469"]').check();
            cy.get('[data-testid="spotlight-list-item-checkbox-9eab3aa0-82c1-11eb-8896-eb36601837f5"]').should(
                'be.disabled',
            );
            cy.get('[data-testid="spotlight-list-item-checkbox-f0a1de60-1999-11e7-af36-7d945160e88f"]').should(
                'not.be.disabled',
            );

            cy.get('[data-testid="spotlight-list-item-checkbox-d8ec8820-07b1-11e7-a7ef-ef4338d401a6"]').uncheck();
            cy.get('[data-testid="spotlight-list-item-checkbox-9eab3aa0-82c1-11eb-8896-eb36601837f5"]').should(
                'be.disabled',
            );
            cy.get('[data-testid="spotlight-list-item-checkbox-f0a1de60-1999-11e7-af36-7d945160e88f"]').should(
                'not.be.disabled',
            );

            cy.get('[data-testid="spotlight-list-item-checkbox-a7764f90-198d-11e7-9f30-3dc758d83fd5"]').uncheck();
            cy.get('[data-testid="spotlight-list-item-checkbox-9eab3aa0-82c1-11eb-8896-eb36601837f5"]').should(
                'be.disabled',
            );
            cy.get('[data-testid="spotlight-list-item-checkbox-f0a1de60-1999-11e7-af36-7d945160e88f"]').should(
                'not.be.disabled',
            );

            cy.get('[data-testid="spotlight-list-item-checkbox-1e1b0e10-c400-11e6-a8f0-47525a49f469"]').uncheck();
            cy.get('[data-testid="spotlight-list-item-checkbox-9eab3aa0-82c1-11eb-8896-eb36601837f5"]').should(
                'not.be.disabled',
            );
            cy.get('[data-testid="spotlight-list-item-checkbox-f0a1de60-1999-11e7-af36-7d945160e88f"]').should(
                'not.be.disabled',
            );
        });
        it('can unselect all checkboxes with the "X"', () => {
            cy.get('[data-testid="spotlight-list-item-checkbox-9eab3aa0-82c1-11eb-8896-eb36601837f5"]').should(
                'not.be.disabled',
            );
            cy.get('[data-testid="spotlight-list-item-checkbox-f0a1de60-1999-11e7-af36-7d945160e88f"]').should(
                'not.be.disabled',
            );

            cy.get('[data-testid="spotlight-list-item-checkbox-d8ec8820-07b1-11e7-a7ef-ef4338d401a6"]').check();
            cy.get('[data-testid="spotlight-list-item-checkbox-a7764f90-198d-11e7-9f30-3dc758d83fd5"]').check();
            cy.get('[data-testid="spotlight-list-item-checkbox-1e1b0e10-c400-11e6-a8f0-47525a49f469"]').check();
            cy.get('[data-testid="spotlight-list-item-checkbox-9eab3aa0-82c1-11eb-8896-eb36601837f5"]').should(
                'be.disabled',
            );
            cy.get('[data-testid="spotlight-list-item-checkbox-f0a1de60-1999-11e7-af36-7d945160e88f"]').should(
                'not.be.disabled',
            );

            cy.get('[data-testid="spotlight-list-past-deselect-button"]').should('exist');
            cy.get('[data-testid="spotlight-list-past-deselect-button"]').click();
            cy.get('[data-testid="spotlight-list-item-checkbox-9eab3aa0-82c1-11eb-8896-eb36601837f5"]').should(
                'not.be.disabled',
            );
            cy.get('[data-testid="spotlight-list-item-checkbox-f0a1de60-1999-11e7-af36-7d945160e88f"]').should(
                'not.be.disabled',
            );
            cy.get('[data-testid="spotlight-list-item-checkbox-d8ec8820-07b1-11e7-a7ef-ef4338d401a6"]').should(
                'not.be.checked',
            );
            cy.get('[data-testid="spotlight-list-item-checkbox-a7764f90-198d-11e7-9f30-3dc758d83fd5"]').should(
                'not.be.checked',
            );
            cy.get('[data-testid="spotlight-list-item-checkbox-1e1b0e10-c400-11e6-a8f0-47525a49f469"]').should(
                'not.be.checked',
            );
        });
    });
    context('Spotlight Admin Add page', () => {
        beforeEach(() => {
            cy.visit('http://localhost:2020/admin/spotlights/add?user=uqstaff');
            cy.viewport(1300, 1000);
        });

        it('is accessible', () => {
            cy.injectAxe();
            cy.viewport(1300, 1000);
            cy.get('h2').should('be.visible');
            cy.get('h2').contains('Create a new spotlight');
            cy.log(
                'This test fails locally occasionally because we had to add the aria-label to the buttons manually - try it again',
            );
            cy.wait(1000);
            cy.checkA11y('[data-testid="StandardPage"]', {
                reportName: 'Spotlights Admin Add',
                scopeName: 'Content',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
        it('an url must be valid', () => {
            cy.get('[data-testid="admin-spotlights-form-link-url"]').should('be.visible');
            cy.get('[data-testid="admin-spotlights-form-title"] input').type('Read more');
            cy.get('[data-testid="admin-spotlights-form-link-url"] input').type('http://x.c');
            cy.get('[data-testid="admin-spotlights-form-link-url"]').should('have.class', 'Mui-error');
            // one more character
            cy.get('[data-testid="admin-spotlights-form-link-url"] input').type('o');
            cy.get('[data-testid="admin-spotlights-form-link-url"]').should('not.have.class', 'Mui-error');
        });

        it('Entering the fields works', () => {
            saveButtonisDisabled();
            cy.get('[data-testid="admin-spotlights-form-title"]').type('spotlight title 3');
            cy.get('[data-testid="admin-spotlights-form-title"] input').should('have.value', 'spotlight title 3');

            cy.get('[data-testid="admin-spotlights-form-link-url"]').type('http://example.com');
            cy.get('[data-testid="admin-spotlights-form-link-url"] input').should('have.value', 'http://example.com');

            dragFileToDropzone('test.jpg');

            saveButtonNOTDisabled();

            cy.get('[data-testid="admin-spotlights-form-checkbox-published"] input').check();
            cy.get('[data-testid="admin-spotlights-form-checkbox-published"] input').should('be.checked');

            // start date starts with the correct default
            cy.get('[data-testid="admin-spotlights-form-start-date"] input').should($input => {
                const defaultDate = $input.val();
                expect(defaultDate).to.include(moment().format('DD/MM/YYYY 00:01'));
            });
            // cant test end date initial value here - would just be reimplementing the algorithm. Test in Jest
            cy.get('[data-testid="admin-spotlights-form-start-date"] button').click();
            // advance the start date two months forward
            // (picking a date that far forward lets us test the error on the end date)
            cy.get('.MuiPickersCalendarHeader-switchHeader button:not([disabled])')
                .as('next-month-button')
                .click();
            cy.get('@next-month-button').click(); // and on to the next month

            // and pick the first of the month
            cy.get('.MuiPickersCalendar-week button:not(.MuiPickersDay-hidden')
                .first()
                .contains('1')
                .click();
            // the time dialog loads, but lets just ok out
            cy.get('.MuiPickersModal-withAdditionalAction button:nth-child(3)')
                .contains('OK')
                .click();
            // and date is set to next month
            cy.get('[data-testid="admin-spotlights-form-start-date"] input').should($input => {
                const defaultDate = $input.val();
                const nextmonth = moment()
                    .add(2, 'M')
                    .startOf('month');
                expect(defaultDate).to.include(nextmonth.format('DD/MM/YYYY'));
            });
            // and the end date field now has an error, so the submit button is disabled
            saveButtonisDisabled();
            // and the end date has an error message
            // cy.get('[data-testid="admin-spotlights-form-end-date"] p.Mui-error')
            //     .should('exist')
            //     .and('contain', 'Date should not be before minimal date');
            // // open the end date so we can fix the date
            // cy.get('[data-testid="admin-spotlights-form-end-date"] button').click();
            // // advance the end date another month
            // cy.get('.MuiPickersCalendarHeader-switchHeader button:not([disabled])')
            //     .as('next-month-button')
            //     .click();
            // // and pick the first of the month
            // cy.get('.MuiPickersCalendar-week button:not(.MuiPickersDay-hidden')
            //     .first()
            //     .contains('1')
            //     .click();
            // // the time dialog loads, but lets just ok out
            // cy.get('.MuiDialogActions-spacing button:nth-child(2)')
            //     .contains('OK')
            //     .click();
            // // and date is set to next month
            // cy.get('[data-testid="admin-spotlights-form-end-date"] input').should($input => {
            //     const defaultDate = $input.val();
            //     const nextmonth = moment()
            //         .add(2, 'M')
            //         .startOf('month');
            //     expect(defaultDate).to.include(nextmonth.format('DD/MM/YYYY'));
            // });
            // // all is good so the create button enables
            // saveButtonNOTDisabled();
            //
            // // can clear the upload with the Trashcan button
            // cy.get('[data-testid="dropzone-preview"] button')
            //     .should('exist')
            //     .click();
            // dragzoneIsReadyForDrag();
            // saveButtonisDisabled();
        });

        it('can save a spotlight', () => {
            cy.get('[data-testid="admin-spotlights-form-title"]').type('spotlight title 3');
            cy.get('[data-testid="admin-spotlights-form-link-url"] input').type('http://example.com');
            dragFileToDropzone('test.jpg');
            cy.get('[data-testid="admin-spotlights-form-button-save"]')
                .should('not.be.disabled')
                .click();
            cy.wait(50);
            cy.get('.MuiDialog-container').contains('A spotlight has been added');
            // click 'add another spotlight' button in dialog
            cy.get('[data-testid="confirm-spotlight-add-save-succeeded"]').click();
            // the spotlight page reloads with a blank form
            cy.location('href').should('eq', 'http://localhost:2020/admin/spotlights/add?user=uqstaff');
            cy.get('[data-testid="admin-spotlights-form-title"]').should('have.value', '');
            cy.get('[data-testid="admin-spotlights-form-link-url"] input').should('have.value', '');
            dragzoneIsReadyForDrag();
        });
        it('the cancel button returns to the list page', () => {
            cy.get('[data-testid="admin-spotlights-form-button-cancel"]').click();
            cy.wait(500);
            cy.location('href').should('eq', 'http://localhost:2020/admin/spotlights');
            cy.get('[data-testid="spotlight-list-current"]').should('be.visible');
            cy.get('[data-testid="spotlight-list-current"] tbody')
                .children()
                .should('have.length', numberCurrentPublishedSpotlights + numRowsHiddenAsNoDatainfo);
        });
        it('has a working Help button on the Add page', () => {
            cy.get('[data-testid="admin-spotlights-help-example"]').should('not.exist');
            cy.get('[data-testid="admin-spotlights-help-button"]').should('be.visible');
            cy.get('[data-testid="admin-spotlights-help-button"]').click();
            cy.get('[data-testid="admin-spotlights-help-example"]').should('be.visible');
            cy.get('button:contains("Close")').click();
            cy.get('[data-testid="admin-spotlights-help-example"]').should('not.exist');
        });
        it('Add save button is disabled unless the form is valid', () => {
            // fill out the form from the bottom up to double-check the "button enables properly"
            saveButtonisDisabled();

            dragFileToDropzone('test.jpg');
            saveButtonisDisabled();

            cy.get('[data-testid="admin-spotlights-form-title"]').type('spotlight title 5');
            saveButtonisDisabled();

            // start an url, but button are disabled while it isnt valid
            cy.get('[data-testid="admin-spotlights-form-link-url"]').type('http://e');
            saveButtonisDisabled();
            // complete to a valid url
            cy.get('[data-testid="admin-spotlights-form-link-url"]').type('xample.com');
            saveButtonNOTDisabled();
        });
    });
    context('Spotlight Admin Edit page', () => {
        beforeEach(() => {
            cy.visit('http://localhost:2020/admin/spotlights/edit/9eab3aa0-82c1-11eb-8896-eb36601837f5?user=uqstaff');
            cy.viewport(1300, 1000);
        });

        it('is accessible', () => {
            cy.injectAxe();
            cy.viewport(1300, 1000);
            cy.get('h2').should('be.visible');
            cy.get('h2').contains('Edit spotlight');
            cy.wait(1000);
            cy.checkA11y('[data-testid="StandardPage"]', {
                reportName: 'Spotlights Admin Edit',
                scopeName: 'Content',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
        it('can update a spotlight', () => {
            cy.get('[data-testid="admin-spotlights-form-title"] input')
                .clear()
                .type('spotlight title 3');
            cy.get('[data-testid="admin-spotlights-form-link-url"] input')
                .clear()
                .type('http://example.com');
            cy.get('[data-testid="admin-spotlights-form-button-save"]')
                .should('not.be.disabled')
                .click();
            cy.wait(50);
            cy.get('.MuiDialog-container').contains('The spotlight has been updated');
            // click ''view list'' button in dialog
            cy.get('[data-testid="confirm-spotlight-edit-save-succeeded"]').click();
            // the list page reloads
            cy.location('href').should('eq', 'http://localhost:2020/admin/spotlights');
        });
        it('the cancel button returns to the list page', () => {
            cy.get('[data-testid="admin-spotlights-form-button-cancel"]')
                .should('exist')
                .click();
            cy.wait(100);
            cy.location('href').should('eq', 'http://localhost:2020/admin/spotlights');
            cy.get('[data-testid="spotlight-list-current"]').should('be.visible');
            cy.get('[data-testid="spotlight-list-current"] tbody')
                .children()
                .should('have.length', numberCurrentPublishedSpotlights + numRowsHiddenAsNoDatainfo);
        });
        it('has a working Help button on the Edit page', () => {
            cy.get('[data-testid="admin-spotlights-help-example"]').should('not.exist');
            cy.get('[data-testid="admin-spotlights-help-button"]').should('be.visible');
            cy.get('[data-testid="admin-spotlights-help-button"]').click();
            cy.get('[data-testid="admin-spotlights-help-example"]').should('be.visible');
            cy.get('button:contains("Close")').click();
            cy.get('[data-testid="admin-spotlights-help-example"]').should('not.exist');
        });
        it('Edit save button is disabled when the form is invalid', () => {
            // this is an edit page, so the page loads valid
            // (this is different to spotlights, but I think its not worth the extra work)
            saveButtonNOTDisabled();

            cy.get('[data-testid="admin-spotlights-form-title"] input').clear();
            saveButtonisDisabled();
            cy.get('[data-testid="admin-spotlights-form-title"] input').type('spotlight title 5');
            saveButtonNOTDisabled();
            cy.get('[data-testid="admin-spotlights-form-title"] input').should('have.value', 'spotlight title 5');

            cy.get('[data-testid="admin-spotlights-form-tooltip"] input').clear();
            saveButtonNOTDisabled(); // the tooltip is not required
            cy.get('[data-testid="admin-spotlights-form-tooltip"] input').type('spotlight tooltip 5');
            cy.get('[data-testid="admin-spotlights-form-tooltip"] input').should('have.value', 'spotlight tooltip 5');

            // start an url, but button are disabled while it isnt valid
            cy.get('[data-testid="admin-spotlights-form-link-url"] input').clear();
            saveButtonisDisabled();
            cy.get('[data-testid="admin-spotlights-form-link-url"] input').type('http://e');
            saveButtonisDisabled();
            // complete to a valid url
            cy.get('[data-testid="admin-spotlights-form-link-url"] input').type('xample.com');
            saveButtonNOTDisabled();
            cy.get('[data-testid="admin-spotlights-form-link-url"] input').should('have.value', 'http://example.com');
        });
        it('the edit form presets the correct data', () => {
            cy.wait(100);
            cy.get('[data-testid="admin-spotlights-form-title"] input').should(
                'have.value',
                'Library spaces 2021 - Dorothy Hill Engineering and Sciences Library',
            );
            cy.get('[data-testid="admin-spotlights-form-tooltip"] input').should(
                'have.value',
                'Dorothy Hill Engineering & Sciences Library. Meeting rooms, low-light spaces, quiet spaces & more.',
            );
            cy.get('[data-testid="admin-spotlights-form-start-date"] input').should(
                'have.value',
                '15/03/2021 00:02 am',
            );
            cy.get('[data-testid="admin-spotlights-form-end-date"] input').should('have.value', '21/03/2099 23:59 pm');
            cy.get('[data-testid="admin-spotlights-form-checkbox-published"] input').should('be.checked');
        });
    });
});
