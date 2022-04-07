import {
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
        cy.get('[data-testid="admin-spotlights-list-past-list"] tfoot').contains(getFooterLabel(totalCountPastRecords));
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
        cy.get('[data-testid="admin-spotlights-list-past-list"] tfoot').contains(getFooterLabel(totalCountPastRecords));
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
        cy.get('div[data-testid="spotlight-list-current"] tbody tr:first-child').should('contain', 'Can be dragged');
        cy.get('div[data-testid="spotlight-list-current"] tbody tr:nth-child(2)').should('contain', 'break_01');
        cy.wait(1000); // dev
        // get 1, drag to 2
        moveRow('[data-testid="spotlight-list-row-3fa92cc0-6ab9-11e7-839f-a1392c2927cc"]', 0, 500);
        // cy.wait(1000); // dev

        // list is now order 2, 1
        cy.get('div[data-testid="spotlight-list-current"] tbody tr:first-child').should('contain', 'break_01');
        cy.get('div[data-testid="spotlight-list-current"] tbody tr:nth-child(2)').should('contain', 'Can be dragged');
        cy.get('div[data-testid="spotlight-list-current"] tbody tr:first-child').should('contain', 'blah blah blah'); // fail test
    });

    it('can publish and unpublish spotlights', () => {
        cy.get('[data-testid="spotlight-list-item-publish-9eab3aa0-82c1-11eb-8896-eb36601837f5"]').should('be.checked');
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
        cy.get('[data-testid="spotlight-list-item-publish-fba95ec0-77f5-11eb-8c73-9734f9d4b368"]').should('be.checked');
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
        cy.get('[data-testid="admin-spotlights-list-past-list"] tfoot').contains(getFooterLabel(totalCountPastRecords));

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
        cy.get('[data-testid="admin-spotlights-list-past-list"] tfoot').contains(getFooterLabel(totalCountPastRecords));

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
});
