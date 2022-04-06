import {
    assertImageWarningIsPresent,
    FILTER_STORAGE_NAME,
    getFooterLabel,
    hasAWorkingHelpButton,
    numberCurrentPublishedSpotlights,
    showUnpublishedSpotlights,
    totalCountPastRecords,
} from '../../../support/spotlights';
import { clickButton } from '../../../support/helpers';

const numRowsHiddenAsNoDatainfo = 1;

describe('Spotlights Admin List Page', () => {
    before(() => {
        sessionStorage.removeItem(FILTER_STORAGE_NAME);
    });
    beforeEach(() => {
        cy.visit('http://localhost:2020/admin/spotlights?user=uqstaff');
        cy.viewport(1300, 1000);
    });

    function loadTheViewByImageLightbox() {
        clickButton('button[data-testid="admin-spotlights-view-by-image-button"]', 'View by image');
    }

    context('Spotlight Admin session storage', () => {
        it('the filter text is maintained when the user visits a View page', () => {
            // the list page loads
            cy.get('[data-testid="admin-spotlights-list-past-list"]').scrollIntoView();
            cy.wait(50);
            // initally, all 5 records show
            cy.get('[data-testid="spotlight-list-past"] tbody')
                .children()
                .should('have.length', 5 + numRowsHiddenAsNoDatainfo);
            cy.get('[data-testid="admin-spotlights-list-past-list"] tfoot').contains(
                getFooterLabel(totalCountPastRecords),
            );

            // we reduce the number of rows to 3 by typing into the filter input field
            cy.get('[data-testid="spotlights-list-clear-text-field"]').should('exist');
            cy.get('[data-testid="spotlights-list-clear-text-field"] input').type('can');
            cy.get('[data-testid="spotlight-list-past"] tbody')
                .children()
                .should('have.length', 4 + numRowsHiddenAsNoDatainfo);

            // we load the view page, then click the cancel button to come back to the list page
            clickButton('[data-testid="spotlight-list-past"] tbody tr:first-child button:first-child', 'View');
            cy.location('href').should(
                'eq',
                'http://localhost:2020/admin/spotlights/view/1e1b0e10-c400-11e6-a8f0-47525a49f469',
            );
            cy.get('h2')
                .should('be.visible')
                .contains('View spotlight');
            clickButton('[data-testid="admin-spotlights-form-button-cancel"]', 'Cancel');
            cy.location('href').should('eq', 'http://localhost:2020/admin/spotlights');

            // the filter text field still has the previously typed word and only 3 rows are present
            cy.get('[data-testid="admin-spotlights-list-past-list"]').scrollIntoView();
            cy.get('[data-testid="spotlights-list-clear-text-field"]').should('exist');
            cy.get('[data-testid="spotlights-list-clear-text-field"] input').should('have.value', 'can');
            cy.get('[data-testid="spotlight-list-past"] tbody')
                .children()
                .should('have.length', 4 + numRowsHiddenAsNoDatainfo);
            // the current and scheduled lists arent filtered
            cy.get('[data-testid="admin-spotlights-list-current-list"] tbody')
                .children()
                .should('have.length', 4 + numRowsHiddenAsNoDatainfo);
            cy.get('[data-testid="admin-spotlights-list-scheduled-list"] tbody')
                .children()
                .should('have.length', 9 + numRowsHiddenAsNoDatainfo);

            // we use the 'x' button to clear the text field which restores the rows to 5
            cy.get('[data-testid="spotlights-list-clear-text-filter-clear-button"]')
                .should('exist')
                .click();
            cy.get('[data-testid="spotlights-list-clear-text-field"] input').should('have.value', '');
            cy.get('[data-testid="spotlight-list-past"] tbody')
                .children()
                .should('have.length', 5 + numRowsHiddenAsNoDatainfo);
        });
        it('the filter text is maintained when the user visits a Clone page', () => {
            // the list page loads
            cy.get('[data-testid="admin-spotlights-list-past-list"]').scrollIntoView();
            cy.wait(50);
            // initally, all 5 records show
            cy.get('[data-testid="spotlight-list-past"] tbody')
                .children()
                .should('have.length', 5 + numRowsHiddenAsNoDatainfo);
            cy.get('[data-testid="admin-spotlights-list-past-list"] tfoot').contains(
                getFooterLabel(totalCountPastRecords),
            );

            // we reduce the number of rows to 4 by typing into the filter input field
            cy.get('[data-testid="spotlights-list-clear-text-field"]').should('exist');
            cy.get('[data-testid="spotlights-list-clear-text-field"] input').type('can');
            cy.get('[data-testid="spotlight-list-past"] tbody')
                .children()
                .should('have.length', 4 + numRowsHiddenAsNoDatainfo);

            // we load the Clone page, then click the cancel button to come back to the List page
            cy.get('[data-testid="spotlight-list-past"] tbody tr:first-child button:nth-child(2)')
                .should('exist')
                .click();
            cy.get('[data-testid="spotlight-list-past"] tbody tr:first-child ul li:first-child')
                .should('exist')
                .should('contain', 'Clone')
                .click();
            cy.location('href').should(
                'eq',
                'http://localhost:2020/admin/spotlights/clone/1e1b0e10-c400-11e6-a8f0-47525a49f469',
            );
            cy.get('[data-testid="admin-spotlights-form-button-cancel"]')
                .should('exist')
                .click();
            cy.location('href').should('eq', 'http://localhost:2020/admin/spotlights');

            // the filter text field still has the previously typed word and only 4 rows are present
            cy.get('[data-testid="admin-spotlights-list-past-list"]').scrollIntoView();
            cy.get('[data-testid="admin-spotlights-list-past-list"] h3').should('be.visible');
            cy.get('[data-testid="spotlights-list-clear-text-field"]').should('exist');
            cy.get('[data-testid="spotlights-list-clear-text-field"] input').should('have.value', 'can');
            cy.get('[data-testid="spotlight-list-past"] tbody')
                .children()
                .should('have.length', 4 + numRowsHiddenAsNoDatainfo);

            // we use the 'x' button to clear the text field and restore the rows to 5
            cy.get('[data-testid="spotlights-list-clear-text-filter-clear-button"]')
                .should('exist')
                .click();
            cy.get('[data-testid="spotlights-list-clear-text-field"] input').should('have.value', '');
            cy.get('[data-testid="spotlight-list-past"] tbody')
                .children()
                .should('have.length', 5 + numRowsHiddenAsNoDatainfo);
        });
    });
    context('Spotlight Admin general tests', () => {
        it('displays a list of spotlights to the authorised user', () => {
            cy.get('[data-testid="spotlight-list-current"]').should('be.visible');
            cy.wait(100);
            cy.get('[data-testid="spotlight-list-current"] tbody')
                .children()
                .should('have.length', numberCurrentPublishedSpotlights + numRowsHiddenAsNoDatainfo);

            cy.get('tr[data-testid="spotlight-list-row-9eab3aa0-82c1-11eb-8896-eb36601837f5"]').should('exist');

            // the spotlight that ends today has the end date highlighted;
            // one that does not end today has a normal color
            cy.get('tr[data-testid="spotlight-list-row-9eab3aa0-82c1-11eb-8896-eb36601837f5"] td:nth-child(6)')
                .should('exist')
                .should('have.css', 'color', 'rgb(191, 80, 0)');
            cy.get('tr[data-testid="spotlight-list-row-fba95ec0-77f5-11eb-8c73-9734f9d4b368"] td:nth-child(6)')
                .should('exist')
                .should('have.css', 'color', 'rgba(0, 0, 0, 0.87)');

            cy.get('[data-testid="admin-spotlights-list-past-list"]').scrollIntoView();
            cy.get('[data-testid="admin-spotlights-list-past-list"]').should('be.visible');
            cy.get('[data-testid="admin-spotlights-list-past-list"] tbody ')
                .children()
                .should('have.length', 5 + numRowsHiddenAsNoDatainfo);
            cy.get('[data-testid="admin-spotlights-list-past-list"] tfoot').should('exist');
            cy.get('[data-testid="admin-spotlights-list-past-list"] tfoot').contains(
                getFooterLabel(totalCountPastRecords),
            );
        });
        it('the spotlights list page is accessible', () => {
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
        it('the footer paginator shows max links when max is selected', () => {
            const highestDisplayCount = '100';
            cy.get('[data-testid="admin-spotlights-list-past-list"] tfoot').contains(
                getFooterLabel(totalCountPastRecords),
            );
            cy.get(
                '[data-testid="admin-spotlights-list-past-list"] [data-testid="admin-spotlights-list-paginator-select"]',
            ).select(highestDisplayCount);
            cy.get(
                '[data-testid="admin-spotlights-list-past-list"] [data-testid="admin-spotlights-list-paginator-select"]',
            ).should('have.value', highestDisplayCount);
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

        // it seems cypress doesnt support "drag and drop" as a function yet :(
        // test left as pre work in case this changes in future
        // try https://github.com/atlassian/react-beautiful-dnd/blob/master/docs/sensors/keyboard.md
        // or does the tab hold it up?
        it.skip('can drag and drop to reorder the list', () => {
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
            cy.get('[data-testid="spotlights-hideshow-scheduled"] input').check();
            showUnpublishedSpotlights();

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

        it('can publish and unpublish spotlights', () => {
            cy.get('[data-testid="spotlight-list-item-publish-9eab3aa0-82c1-11eb-8896-eb36601837f5"]').should(
                'be.checked',
            );
            cy.get('[data-testid="spotlight-list-item-publish-9eab3aa0-82c1-11eb-8896-eb36601837f5"]').uncheck();
            cy.get('[data-testid="spotlight-list-item-publish-9eab3aa0-82c1-11eb-8896-eb36601837f5"]').should(
                'not.be.checked',
            );
            // 4 published showing
            cy.get('[data-testid="spotlight-list-current"] tbody')
                .children()
                .should('have.length', 4 + numRowsHiddenAsNoDatainfo);

            // also check the "publish" dialog is correct
            cy.get('[data-testid="spotlight-list-item-publish-fba95ec0-77f5-11eb-8c73-9734f9d4b368"]').should(
                'not.be.checked',
            );
            cy.get('[data-testid="spotlight-list-item-publish-fba95ec0-77f5-11eb-8c73-9734f9d4b368"]').check();
            cy.get('[data-testid="spotlight-list-item-publish-fba95ec0-77f5-11eb-8c73-9734f9d4b368"]').should(
                'be.checked',
            );
        });
        it('an error displays when a save-on-change-publish api error occurs', () => {
            cy.get('[data-testid="spotlight-list-item-publish-1e7a5980-d7d6-11eb-a4f2-fd60c7694898"]').uncheck();

            // failure is reported in a dialog
            cy.get('[data-testid="dialogbox-spotlight-save-error-dialog"]').should('exist');
            cy.get('[data-testid="dialogbox-spotlight-save-error-dialog"] h2').contains(
                'We are unable to save this change right now',
            );

            // dialog can be closed
            cy.get('[data-testid="confirm-spotlight-save-error-dialog"]').should('exist');
            clickButton('[data-testid="confirm-spotlight-save-error-dialog"]', 'OK');
            cy.get('[data-testid="dialogbox-spotlight-delete-error-dialog"]').should('not.exist');
        });
        it('can filter the Past Spotlights by text string', () => {
            cy.get('[data-testid="admin-spotlights-list-past-list"]').scrollIntoView();
            cy.wait(50);
            cy.get('[data-testid="spotlight-list-past"] tbody')
                .children()
                .should('have.length', 5 + numRowsHiddenAsNoDatainfo);
            cy.get('[data-testid="admin-spotlights-list-past-list"] tfoot').contains(
                getFooterLabel(totalCountPastRecords),
            );

            cy.get('[data-testid="spotlights-list-clear-text-field"]').should('exist');
            cy.get('[data-testid="spotlights-list-clear-text-field"] input').type('can');
            cy.get('[data-testid="spotlight-list-past"] tbody')
                .children()
                .should('have.length', 4 + numRowsHiddenAsNoDatainfo);
            cy.get('[data-testid="admin-spotlights-list-past-list"] tfoot').contains(getFooterLabel(4, 4));

            cy.get('[data-testid="spotlights-list-clear-text-filter-clear-button"]')
                .should('exist')
                .click();
            cy.get('[data-testid="spotlight-list-past"] tbody')
                .children()
                .should('have.length', 5 + numRowsHiddenAsNoDatainfo);
            cy.get('[data-testid="admin-spotlights-list-past-list"] tfoot').contains(
                getFooterLabel(totalCountPastRecords),
            );

            cy.get('[data-testid="spotlights-list-clear-text-field"] input')
                .clear()
                .type('u');
            cy.get('[data-testid="spotlight-list-past"] tbody')
                .children()
                .should('have.length', 5 + numRowsHiddenAsNoDatainfo);
            cy.get('[data-testid="admin-spotlights-list-past-list"] tfoot').contains(getFooterLabel(20));
            // change the page-size selector and more records appear
            cy.get(
                '[data-testid="admin-spotlights-list-past-list"] [data-testid="admin-spotlights-list-paginator-select"]',
            ).select('25');
            cy.get('[data-testid="admin-spotlights-list-past-list"] tfoot').contains(getFooterLabel(20, 20));
        });
        it('can change pages in the paginater', () => {
            cy.get('[data-testid="admin-spotlights-list-past-list"]').scrollIntoView();
            cy.get('[data-testid="admin-spotlights-list-past-list"]').should('be.visible');

            cy.get('[data-testid="admin-spotlights-list-past-list"] tbody tr:first-child').should(
                'contain',
                'Can be viewed or deleted past #1',
            );
            cy.get('[data-testid="admin-spotlights-list-past-list"] tfoot button[aria-label="next page"]')
                .should('exist')
                .click();
            cy.get('[data-testid="admin-spotlights-list-past-list"] tbody tr:first-child').should(
                'contain',
                'Find past exam papers',
            );
            cy.get('[data-testid="admin-spotlights-list-past-list"] tfoot').contains(getFooterLabel(34, 10, 6));
        });
        it('the add button loads the add page', () => {
            clickButton('button[data-testid="admin-spotlights-add-display-button"]', 'Add spotlight');
            cy.location('href').should('eq', 'http://localhost:2020/admin/spotlights/add');
        });
        it('the edit button loads the edit page', () => {
            clickButton('button[data-testid="spotlight-list-item-edit-9eab3aa0-82c1-11eb-8896-eb36601837f5"]', 'Edit');
            cy.location('href').should(
                'eq',
                'http://localhost:2020/admin/spotlights/edit/9eab3aa0-82c1-11eb-8896-eb36601837f5',
            );
        });
        it('the clone button loads the clone page', () => {
            cy.get('[data-testid="spotlight-list-arrowicon-9eab3aa0-82c1-11eb-8896-eb36601837f5"]')
                .should('exist')
                .click();

            // click the 'clone' action
            cy.get('[data-testid="9eab3aa0-82c1-11eb-8896-eb36601837f5-clone-button"]')
                .should('exist')
                .click();
            cy.location('href').should(
                'eq',
                'http://localhost:2020/admin/spotlights/clone/9eab3aa0-82c1-11eb-8896-eb36601837f5',
            );
        });
        it('the help button opens the help drawer on the list page', () => {
            hasAWorkingHelpButton();
        });
        it('the split button closes when the user clicks away', () => {
            // open the split button
            cy.get('[data-testid="spotlight-list-arrowicon-9eab3aa0-82c1-11eb-8896-eb36601837f5"]')
                .should('exist')
                .click();
            cy.get('[data-testid="9eab3aa0-82c1-11eb-8896-eb36601837f5-delete-button"]').should('exist');

            // click away from the split button
            cy.get('[data-testid="standard-card-all-spotlights-header"]').click();

            cy.get('[data-testid="9eab3aa0-82c1-11eb-8896-eb36601837f5-delete-button"]').should('not.exist');
        });
        it('the view button loads the view page', () => {
            cy.get('[data-testid="admin-spotlights-list-past-list"]').scrollIntoView();
            clickButton('button[data-testid="spotlight-list-item-view-1e1b0e10-c400-11e6-a8f0-47525a49f469"]', 'View');
            cy.location('href').should(
                'eq',
                'http://localhost:2020/admin/spotlights/view/1e1b0e10-c400-11e6-a8f0-47525a49f469',
            );
        });
        it('the view-by-image button loads the view-by-image lightbox', () => {
            cy.get('[data-testid="spotlights-viewbyimage-lightbox-title"]').should('not.exist');
            loadTheViewByImageLightbox();
            cy.get('[data-testid="spotlights-viewbyimage-lightbox-title"]').should('exist');
        });
        it('can change sort order', () => {
            cy.get('[data-testid="admin-spotlights-list-current-list"] tbody tr:first-child').should(
                'contain',
                'Can be deleted and edited',
            );
            cy.get('[data-testid="admin-spotlights-list-current-list"] thead tr:nth-child(2) th:nth-child(5) span')
                .should('exist')
                .click();
            cy.get('[data-testid="admin-spotlights-list-current-list"] tbody tr:first-child').should(
                'contain',
                'Study outdoors in Duhig Place - Study space',
            );
        });
        it('the admin notes display on the list page', () => {
            cy.get('[data-testid="admin-spotlights-list-current-list"] tbody tr:first-child')
                .should('contain', '*')
                .and('contain', 'sample admin note');
        });

        context('Spotlight Admin session storage', () => {
            it('the filter text is maintained when the user visits a View page', () => {
                // the list page loads
                cy.get('[data-testid="admin-spotlights-list-past-list"]').scrollIntoView();
                cy.wait(50);
                // initally, all 5 records show
                cy.get('[data-testid="spotlight-list-past"] tbody')
                    .children()
                    .should('have.length', 5 + numRowsHiddenAsNoDatainfo);
                cy.get('[data-testid="admin-spotlights-list-past-list"] tfoot').contains(
                    getFooterLabel(totalCountPastRecords),
                );

                // we reduce the number of rows to 3 by typing into the filter input field
                cy.get('[data-testid="spotlights-list-clear-text-field"]').should('exist');
                cy.get('[data-testid="spotlights-list-clear-text-field"] input').type('can');
                cy.get('[data-testid="spotlight-list-past"] tbody')
                    .children()
                    .should('have.length', 4 + numRowsHiddenAsNoDatainfo);

                // we load the view page, then click the cancel button to come back to the list page
                clickButton('[data-testid="spotlight-list-past"] tbody tr:first-child button:first-child', 'View');
                cy.location('href').should(
                    'eq',
                    'http://localhost:2020/admin/spotlights/view/1e1b0e10-c400-11e6-a8f0-47525a49f469',
                );
                cy.get('h2')
                    .should('be.visible')
                    .contains('View spotlight');
                clickButton('[data-testid="admin-spotlights-form-button-cancel"]', 'Cancel');
                cy.location('href').should('eq', 'http://localhost:2020/admin/spotlights');

                // the filter text field still has the previously typed word and only 3 rows are present
                cy.get('[data-testid="admin-spotlights-list-past-list"]').scrollIntoView();
                cy.get('[data-testid="spotlights-list-clear-text-field"]').should('exist');
                cy.get('[data-testid="spotlights-list-clear-text-field"] input').should('have.value', 'can');
                cy.get('[data-testid="spotlight-list-past"] tbody')
                    .children()
                    .should('have.length', 4 + numRowsHiddenAsNoDatainfo);
                // the current and scheduled lists arent filtered
                cy.get('[data-testid="admin-spotlights-list-current-list"] tbody')
                    .children()
                    .should('have.length', 4 + numRowsHiddenAsNoDatainfo);
                cy.get('[data-testid="admin-spotlights-list-scheduled-list"] tbody')
                    .children()
                    .should('have.length', 9 + numRowsHiddenAsNoDatainfo);

                // we use the 'x' button to clear the text field which restores the rows to 5
                cy.get('[data-testid="spotlights-list-clear-text-filter-clear-button"]')
                    .should('exist')
                    .click();
                cy.get('[data-testid="spotlights-list-clear-text-field"] input').should('have.value', '');
                cy.get('[data-testid="spotlight-list-past"] tbody')
                    .children()
                    .should('have.length', 5 + numRowsHiddenAsNoDatainfo);
            });
            it('the filter text is maintained when the user visits a Clone page', () => {
                // the list page loads
                cy.get('[data-testid="admin-spotlights-list-past-list"]').scrollIntoView();
                cy.wait(50);
                // initally, all 5 records show
                cy.get('[data-testid="spotlight-list-past"] tbody')
                    .children()
                    .should('have.length', 5 + numRowsHiddenAsNoDatainfo);
                cy.get('[data-testid="admin-spotlights-list-past-list"] tfoot').contains(
                    getFooterLabel(totalCountPastRecords),
                );

                // we reduce the number of rows to 4 by typing into the filter input field
                cy.get('[data-testid="spotlights-list-clear-text-field"]').should('exist');
                cy.get('[data-testid="spotlights-list-clear-text-field"] input').type('can');
                cy.get('[data-testid="spotlight-list-past"] tbody')
                    .children()
                    .should('have.length', 4 + numRowsHiddenAsNoDatainfo);

                // we load the Clone page, then click the cancel button to come back to the List page
                cy.get('[data-testid="spotlight-list-past"] tbody tr:first-child button:nth-child(2)')
                    .should('exist')
                    .click();
                cy.get('[data-testid="spotlight-list-past"] tbody tr:first-child ul li:first-child')
                    .should('exist')
                    .should('contain', 'Clone')
                    .click();
                cy.location('href').should(
                    'eq',
                    'http://localhost:2020/admin/spotlights/clone/1e1b0e10-c400-11e6-a8f0-47525a49f469',
                );
                cy.get('[data-testid="admin-spotlights-form-button-cancel"]')
                    .should('exist')
                    .click();
                cy.location('href').should('eq', 'http://localhost:2020/admin/spotlights');

                // the filter text field still has the previously typed word and only 4 rows are present
                cy.get('[data-testid="admin-spotlights-list-past-list"]').scrollIntoView();
                cy.get('[data-testid="admin-spotlights-list-past-list"] h3').should('be.visible');
                cy.get('[data-testid="spotlights-list-clear-text-field"]').should('exist');
                cy.get('[data-testid="spotlights-list-clear-text-field"] input').should('have.value', 'can');
                cy.get('[data-testid="spotlight-list-past"] tbody')
                    .children()
                    .should('have.length', 4 + numRowsHiddenAsNoDatainfo);

                // we use the 'x' button to clear the text field and restore the rows to 5
                cy.get('[data-testid="spotlights-list-clear-text-filter-clear-button"]')
                    .should('exist')
                    .click();
                cy.get('[data-testid="spotlights-list-clear-text-field"] input').should('have.value', '');
                cy.get('[data-testid="spotlight-list-past"] tbody')
                    .children()
                    .should('have.length', 5 + numRowsHiddenAsNoDatainfo);
            });
        });
    });
    context('the view-by-image lightbox works', () => {
        beforeEach(() => {
            loadTheViewByImageLightbox();
        });
        it('the view-by-image loads correctly', () => {
            cy.get('[data-testid="spotlights-viewbyimage-lightbox-content"] div')
                .should('exist')
                .children()
                .should('have.length', 47);
            // the first image has the expected values
            cy.get('[data-testid="spotlights-viewbyimage-lightbox-content"] div > a:first-child')
                .should('have.attr', 'title')
                .then(titleAttribute => {
                    // too hard to test for the complete string with carriage return in the middle
                    expect(titleAttribute.startsWith('Study outdoors in Duhig Place - Study space')).to.be.true;
                    expect(titleAttribute.endsWith('Run between 2021-03-01 00:01:00  and  2099-12-07 23:59:00')).to.be
                        .true;
                });
            // the same element
            cy.get('[data-testid="fba95ec0-77f5-11eb-8c73-9734f9d4b368-lightbox-item"] img')
                .should('exist')
                .and(
                    'have.attr',
                    'alt',
                    'Study outdoors in Duhig Place. Shade, wifi, tables, bubbler, fairy lights and fresh air.',
                )
                .and(
                    'have.attr',
                    'src',
                    'http://localhost:2020/public/images/spotlights/52d3e090-d096-11ea-916e-092f3af3e8ac.jpg',
                );
        });
        it('the view-by-image filter works', () => {
            cy.get('[data-testid="spotlights-viewbyimage-lightbox-content"] div')
                .should('exist')
                .children()
                .should('have.length', 47);
            // typing "can" in the filter reduces the number of thumbnails to 8
            cy.get('[data-testid="spotlights-viewbyimage-filter-text-field"] input')
                .should('exist')
                .type('can');
            cy.get('[data-testid="spotlights-viewbyimage-lightbox-content"] div')
                .should('exist')
                .children()
                .should('have.length', 8);
            // an alert with title containing "can" displays
            cy.get('[data-testid="3fa92cc0-6ab9-11e7-839f-a1392c2927cc-lightbox-item"]').should('exist');
            // an alert with img_alt containing "can" displays
            cy.get('[data-testid="298288b0-605c-11eb-ad87-357f112348ef-lightbox-item"]').should('exist');
            // an alert with admin note containing "can" displays
            cy.get('[data-testid="f0a1de60-1999-11e7-af36-7d945160e88f-lightbox-item"]').should('exist');
            // the clear-filter text field 'x' buttons works
            cy.get('[data-testid="spotlights-viewbyimage-filter-text-clear-button"]')
                .should('exist')
                .click();
            // all thumbnails are again displayed
            cy.get('[data-testid="spotlights-viewbyimage-lightbox-content"] div')
                .should('exist')
                .children()
                .should('have.length', 47);
        });
        it('the view-by-history loads correctly from view-by-image', () => {
            // click the top left image in the lightbox
            cy.get('[data-testid="spotlights-viewbyimage-lightbox-content"] div > a:first-child')
                .should('exist')
                .click();
            // the view-by-history lightbox loads (it overlays the view-by-image lightbox)
            cy.get('[data-testid="spotlights-viewbyhistory-lightbox-title"]').should('exist');
            // view-by-history close button works
            clickButton('[data-testid="spotlights-viewbyhistory-lightbox-close-button"]', 'Close');
            // the view-by-image lightbox is back in focus
            cy.get('[data-testid="spotlights-viewbyhistory-lightbox-title"]').should('not.exist');
            cy.get('[data-testid="spotlights-viewbyimage-lightbox-title"]').should('exist');
        });
        it('the view-by-image help button works', () => {
            hasAWorkingHelpButton('admin-spotlights-viewbyimage-help-button');
        });
        it('the view-by-image close button works', () => {
            clickButton('[data-testid="spotlights-viewbyimage-lightbox-close-button"]', 'Close');
            cy.location('href').should('eq', `${Cypress.config('baseUrl')}/admin/spotlights?user=uqstaff`);
            cy.get('[data-testid="spotlights-viewbyimage-lightbox-title"]').should('not.exist');
        });
    });
    context('the view-by-history lightbox works', () => {
        function loadTheHistoryLightbox(spotlightid, listType = 'current') {
            // open the split button
            cy.get(`[data-testid="admin-spotlights-list-${listType}-list"]`).scrollIntoView();
            cy.get(`[data-testid="spotlight-list-arrowicon-${spotlightid}"]`)
                .should('exist')
                .click();

            // click the 'view by history' action
            cy.get('[data-testid="' + spotlightid + '-viewbyhistory-button"]')
                .should('exist')
                .click();

            // view-by-history lightbox loads
            cy.get('[data-testid="spotlights-viewbyhistory-lightbox-title"]').should('exist');
        }

        it('the view-by-history lightbox can be closed with the close button', () => {
            loadTheHistoryLightbox('298288b0-605c-11eb-ad87-357f112348ef', 'scheduled');

            // confirm random piece of content
            assertImageWarningIsPresent('spotlights-viewbyhistory-lightbox-dimensions', false);

            cy.get('[data-testid="spotlights-viewbyhistory-lightbox-holder"] ul')
                .children()
                .should('have.length', 2);

            // use the close button
            clickButton('[data-testid="spotlights-viewbyhistory-lightbox-close-button"]', 'Close');
            cy.location('href').should('eq', `${Cypress.config('baseUrl')}/admin/spotlights?user=uqstaff`);
            cy.get('[data-testid="spotlights-viewbyhistory-lightbox-title"]').should('not.exist');
        });
        it('the view-by-history can open the clone form for a spotlight', () => {
            loadTheHistoryLightbox('9eab3aa0-82c1-11eb-8896-eb36601837f5');

            // confirm random piece of content
            assertImageWarningIsPresent('spotlights-viewbyhistory-lightbox-dimensions', false);

            cy.get('[data-testid="spotlights-viewbyhistory-lightbox-holder"] ul')
                .children()
                .should('have.length', 23);

            clickButton('[data-testid="spotlight-list-item-clone-9eab3aa0-82c1-11eb-8896-eb36601837f5"]', 'Clone');
            cy.location('href').should('contain', `${Cypress.config('baseUrl')}/admin/spotlights/clone`);
        });
        it('the view-by-history can open the edit form for a spotlight', () => {
            loadTheHistoryLightbox('9eab3aa0-82c1-11eb-8896-eb36601837f5');

            // confirm random piece of content
            assertImageWarningIsPresent('spotlights-viewbyhistory-lightbox-dimensions', false);

            cy.get('[data-testid="spotlights-viewbyhistory-lightbox-holder"] ul')
                .children()
                .should('have.length', 23);

            clickButton(
                '[data-testid="spotlight-viewhistory-button-edit-9eab3aa0-82c1-11eb-8896-eb36601837f5"]',
                'Edit',
            );
            cy.location('href').should('contain', `${Cypress.config('baseUrl')}/admin/spotlights/edit`);
        });
        it('the view-by-history can open the view page for a spotlight', () => {
            loadTheHistoryLightbox('1e1b0e10-c400-11e6-a8f0-47525a49f469');

            cy.get('[data-testid="spotlights-viewbyhistory-lightbox-holder"] ul')
                .children()
                .should('have.length', 20);

            clickButton(
                '[data-testid="spotlight-viewhistory-button-view-1e1b0e10-c400-11e6-a8f0-47525a49f469"]',
                'View',
            );
            cy.location('href').should('contain', `${Cypress.config('baseUrl')}/admin/spotlights/view`);
        });
        it('the spotlight that had its view-by-history button clicked is highlighted', () => {
            const theSpotlightThatWasClickedOnID = '9eab3aa0-82c1-11eb-8896-eb36601837f5';
            const editButton = `[data-testid="spotlight-viewhistory-button-edit-${theSpotlightThatWasClickedOnID}"]`;
            loadTheHistoryLightbox(theSpotlightThatWasClickedOnID);

            cy.get(editButton).scrollIntoView();
            cy.get(editButton)
                .parent()
                .parent()
                .should('exist')
                .and('have.css', 'background-color', 'rgba(0, 0, 0, 0.65)');

            // a random different one is not hlighlighted
            cy.get('[data-testid="spotlight-viewhistory-button-view-d8ec8820-07b1-11e7-a7ef-ef4338d401a6"]')
                .parent()
                .parent()
                .should('exist')
                .and('have.css', 'background-color', 'rgba(0, 0, 0, 0)');
        });
        it('the view-by-history has a working Help button', () => {
            loadTheHistoryLightbox('9eab3aa0-82c1-11eb-8896-eb36601837f5');
            hasAWorkingHelpButton('spotlights-viewbyhistory-lightbox-help-button');
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
        it('the user can select a spotlight to delete', () => {
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
            clickButton('[data-testid="cancel-spotlight-delete-confirm"]', 'Cancel');
            cy.get('[data-testid="dialogbox-spotlight-delete-confirm"]').should('not.exist');
        });

        it('can delete Current spotlights', () => {
            // header count is correct initially
            cy.get('[data-testid="headerRow-current"] span').should('contain', '- 4 spotlights');
            cy.get('[data-testid="admin-spotlights-list-current-list"]').should('contain', 'Can be deleted and edited');
            cy.get(
                '[data-testid="spotlight-list-row-38cbf430-8693-11e9-98ab-9d52a58e86ca"] input[type="checkbox"]',
            ).should('not.be.disabled');

            // open the split button
            cy.get('[data-testid="spotlight-list-arrowicon-9eab3aa0-82c1-11eb-8896-eb36601837f5"]')
                .should('exist')
                .click();

            // click the 'delete' action
            cy.get('[data-testid="9eab3aa0-82c1-11eb-8896-eb36601837f5-delete-button"]').should('exist');
            cy.get('[data-testid="9eab3aa0-82c1-11eb-8896-eb36601837f5-delete-button"]').click();

            // click the Proceed button and the spotlight is deleted
            clickButton('[data-testid="confirm-spotlight-delete-confirm"]', 'Proceed');
            // dialog disappears
            cy.get('[data-testid="dialogbox-spotlight-delete-confirm"]').should('not.exist');
            cy.wait(500);
            cy.get('[data-testid="dialogbox-spotlight-delete-error-dialog"]').should('not.exist');

            // and the display has updated appropriately
            // deleted record is gone
            cy.get('[data-testid="admin-spotlights-list-current-list"]').should(
                'not.contain',
                'Can be deleted and edited',
            );
            // the checkboxes in the other section have been enabled
            cy.get(
                '[data-testid="spotlight-list-row-38cbf430-8693-11e9-98ab-9d52a58e86ca"] input[type="checkbox"]',
            ).should('not.be.disabled');
            // the pagination updates
            // header count has updated
            cy.get('[data-testid="headerRow-current"] span').should('contain', '- 3 spotlights');
        });
        it('the user can delete a spotlight with the split button', () => {
            cy.get('[data-testid="admin-spotlights-list-past-list"]').should(
                'contain',
                'Can be viewed or deleted past #1',
            );
            cy.get('[data-testid="admin-spotlights-list-past-list"] tfoot').contains(getFooterLabel(34, 5));
            cy.get(
                '[data-testid="spotlight-list-row-38cbf430-8693-11e9-98ab-9d52a58e86ca"] input[type="checkbox"]',
            ).should('not.be.disabled');

            // user checks the checkbox for no good reason given they plan to use the Split action button
            // (we must check the checkboxes get re-enabled after)
            cy.get('[data-testid="spotlight-list-item-checkbox-1e1b0e10-c400-11e6-a8f0-47525a49f469"]').check();
            cy.get(
                '[data-testid="spotlight-list-row-38cbf430-8693-11e9-98ab-9d52a58e86ca"] input[type="checkbox"]',
            ).should('be.disabled');

            // open the split button
            cy.get('[data-testid="spotlight-list-arrowicon-1e1b0e10-c400-11e6-a8f0-47525a49f469"]')
                .should('exist')
                .click();

            // click the 'delete' action
            cy.get('[data-testid="1e1b0e10-c400-11e6-a8f0-47525a49f469-delete-button"]').should('exist');
            cy.get('[data-testid="1e1b0e10-c400-11e6-a8f0-47525a49f469-delete-button"]').click();

            // click the Proceed button and the spotlight is deleted
            clickButton('[data-testid="confirm-spotlight-delete-confirm"]', 'Proceed');
            // dialog disappears
            cy.get('[data-testid="dialogbox-spotlight-delete-confirm"]').should('not.exist');
            cy.wait(500);
            cy.get('[data-testid="dialogbox-spotlight-delete-error-dialog"]').should('not.exist');

            // and the display has updated appropriately
            // deleted record is gone
            cy.get('[data-testid="admin-spotlights-list-current-list"]').should(
                'not.contain',
                'Can be viewed or deleted past #1',
            );
            // the checkboxes in the other section have been enabled
            cy.get(
                '[data-testid="spotlight-list-row-38cbf430-8693-11e9-98ab-9d52a58e86ca"] input[type="checkbox"]',
            ).should('not.be.disabled');
            // the pagination updates
            cy.get('[data-testid="admin-spotlights-list-past-list"] tfoot').contains(getFooterLabel(33, 5));
        });

        it('the user can delete a spotlight using a checkbox', () => {
            cy.get('[data-testid="admin-spotlights-list-current-list"]').should('contain', 'Can be deleted and edited');
            cy.get(
                '[data-testid="spotlight-list-row-1e1b0e10-c400-11e6-a8f0-47525a49f469"] input[type="checkbox"]',
            ).should('not.be.disabled');

            cy.get('[data-testid="spotlight-list-item-checkbox-9eab3aa0-82c1-11eb-8896-eb36601837f5"]').check();
            cy.get('[data-testid="headerRow-current"] span span').contains('1 spotlight selected');
            cy.get('[data-testid="spotlight-list-current-delete-button"]').should('exist');
            cy.get(
                '[data-testid="spotlight-list-row-1e1b0e10-c400-11e6-a8f0-47525a49f469"] input[type="checkbox"]',
            ).should('be.disabled');

            // click the Proceed button and the spotlight is deleted
            cy.get('[data-testid="spotlight-list-current-delete-button"]').click();
            clickButton('[data-testid="confirm-spotlight-delete-confirm"]', 'Proceed');
            // dialog disappears
            cy.get('[data-testid="dialogbox-spotlight-delete-confirm"]').should('not.exist');
            cy.wait(500);
            cy.get('[data-testid="dialogbox-spotlight-delete-error-dialog"]').should('not.exist');

            // and the display has updated appropriately
            cy.get('[data-testid="admin-spotlights-list-current-list"]').should(
                'not.contain',
                'Can be deleted and edited',
            );
            cy.get(
                '[data-testid="spotlight-list-row-1e1b0e10-c400-11e6-a8f0-47525a49f469"] input[type="checkbox"]',
            ).should('not.be.disabled');

            cy.get('[data-testid="headerRow-current"]').should('not.contain', '1 spotlight selected');
            cy.get('[data-testid="spotlight-list-current-delete-button"]').should('not.exist');
        });

        // now that we are requesting a bulk delete method from api, we can only test one: success or failure :(
        it.skip('reports when a delete fails', () => {
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
                'Some records did not delete successfully',
            );
            // dialog can be closed
            cy.get('[data-testid="confirm-spotlight-delete-error-dialog"]').should('exist');
            cy.get('[data-testid="confirm-spotlight-delete-error-dialog"]').click();
            cy.get('[data-testid="dialogbox-spotlight-delete-error-dialog"]').should('not.exist');
        });
        it('sequential deletion of spotlights does not fail', () => {
            cy.get('[data-testid="admin-spotlights-list-past-list"]').should('contain', 'Can be deleted past #2');
            cy.get('[data-testid="spotlight-list-item-checkbox-d8ec8820-07b1-11e7-a7ef-ef4338d401a6"]').check();
            cy.get('[data-testid="headerRow-past"] span span').contains('1 spotlight selected');
            // checkbox in other section is disabled
            cy.get(
                '[data-testid="spotlight-list-row-9eab3aa0-82c1-11eb-8896-eb36601837f5"] input[type="checkbox"]',
            ).should('be.disabled');
            // click bin icon
            cy.get('[data-testid="spotlight-list-past-delete-button"]').click();
            // a confirm dialog popsup
            cy.get('[data-testid="confirm-spotlight-delete-confirm"]').should('exist');
            cy.get('[data-testid="confirm-spotlight-delete-confirm"]').contains('Proceed');
            // click the Proceed button and delete is attempted
            clickButton('[data-testid="confirm-spotlight-delete-confirm"]', 'Proceed');
            cy.get('[data-testid="dialogbox-spotlight-delete-confirm"]').should('not.exist');
            cy.wait(500);
            // the error dialog doesnt appear
            cy.get('[data-testid="dialogbox-spotlight-delete-error-dialog"]').should('not.exist');
            // the row is gone
            cy.get('[data-testid="admin-spotlights-list-past-list"]').should('not.contain', 'Can be deleted past #2');

            // subsequent deletes also succeed
            cy.get('[data-testid="admin-spotlights-list-past-list"]').should(
                'contain',
                'Can be viewed or deleted past #1',
            );
            cy.get('[data-testid="spotlight-list-item-checkbox-1e1b0e10-c400-11e6-a8f0-47525a49f469"]').check();
            cy.get('[data-testid="headerRow-past"] span span').contains('1 spotlight selected');
            cy.get('[data-testid="admin-spotlights-list-past-list"]').should('contain', 'Can be deleted past #3');
            cy.get('[data-testid="spotlight-list-item-checkbox-a7764f90-198d-11e7-9f30-3dc758d83fd5"]').check();
            cy.get('[data-testid="headerRow-past"] span span').contains('2 spotlights selected');
            // click bin icon
            cy.get('[data-testid="spotlight-list-past-delete-button"]').click();
            // a confirm dialog pops up - click the Proceed button and delete is attempted
            clickButton('[data-testid="confirm-spotlight-delete-confirm"]', 'Proceed');
            cy.get('[data-testid="dialogbox-spotlight-delete-confirm"]').should('not.exist');
            cy.get('[data-testid="admin-spotlights-list-past-list"]').should(
                'not.contain',
                'Can be viewed or deleted past #1',
            );
            cy.get('[data-testid="admin-spotlights-list-past-list"]').should('not.contain', 'Can be deleted past #3');
            // the error dialog doesnt appear
            cy.get('[data-testid="dialogbox-spotlight-delete-error-dialog"]').should('not.exist');
            // nothing on the screen is checked for deletion
            cy.get('.markForDeletion input[type="checkbox"]:checked').should('not.exist');
            // checkbox in other section no longer disabled
            cy.get(
                '[data-testid="spotlight-list-row-9eab3aa0-82c1-11eb-8896-eb36601837f5"] input[type="checkbox"]',
            ).should('not.be.disabled');
            cy.get('[data-testid="admin-spotlights-list-past-list"] tfoot').contains(getFooterLabel(31, 5));

            cy.get('[data-testid="admin-spotlights-list-past-list"]').should('contain', 'Past spotlights');

            cy.get('[data-testid="headerRow-past"]').should('not.contain', '1 spotlight selected');
            cy.get('[data-testid="spotlight-list-past-delete-button"]').should('not.exist');
        });
        it('during delete, selection checkboxes in other sections are disabled', () => {
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
});
