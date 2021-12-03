import moment from 'moment';
import { default as locale } from '../../../src/modules/Pages/Admin/Spotlights/spotlightsadmin.locale';

const numberCurrentPublishedSpotlights = 4;
const totalCountPastRecords = 34;

function getFooterLabel(
    totalCountRecordsAvailable,
    highestRecordNumberDisplayedOnPage = 5,
    lowestRecordNumberDisplayedOnPage = 1,
) {
    // eg '1-5 of 34'
    return `${lowestRecordNumberDisplayedOnPage}-${highestRecordNumberDisplayedOnPage} of ${totalCountRecordsAvailable}`;
}

function dragzoneIsReadyForDrag() {
    cy.get('[data-testid="dropzone-dragarea"]').should('exist');
    cy.get('[data-testid="dropzone-preview"]').should('not.exist');
    cy.get('[data-testid="spotlights-form-upload-dropzone"').should('contain', 'Drag and drop a spotlight image');
}
function dragzoneContainsAnImage() {
    cy.get('[data-testid="dropzone-dragarea"]').should('not.exist');
    cy.get('[data-testid="dropzone-preview"]').should('exist');
    cy.get('[data-testid="spotlights-form-upload-dropzone"').should('not.contain', 'Drag and drop a spotlight image');
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

function showUnpublishedSpotlights() {
    cy.get('[data-testid="spotlights-hideshow-unpublished"] input').check();
}

// we test on 2 different images:
// spotlight-just-right.png and spotlight-too-large.jpg
// we know what the specific dimensions are for each, so can hard code them
function assertImageWarningIsPresent(dataTestid, isUpload = true) {
    cy.get(`[data-testid="${dataTestid}"]`)
        .should('exist')
        .find('svg path[d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"]')
        .should('exist');
    cy.get(`[data-testid="${dataTestid}"]`).should('contain', 'Dimensions: 1967px by 721px (aspect ratio: 2.73).');
    if (isUpload) {
        cy.get(`[data-testid="${dataTestid}"]`).should(
            'contain',
            'Larger images will affect page load time and smaller ones may be pixelated',
        );
    }
}
function assertImageOKIsPresent(dataTestid) {
    cy.get(`[data-testid="${dataTestid}"]`)
        .should('exist')
        .should('contain', 'Dimensions: 813px by 298px (aspect ratio: 2.73).')
        .find('svg path[d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"]')
        .should('exist');
}

function removeImageFromDragzone() {
    cy.get('button[data-testid="spotlights-form-remove-image"]').click();
}

const placeholderImage = 'https://app-testing.library.uq.edu.au/file/public/3530e810-40e5-11ec-b167-ad28af8d7358.png';

describe('Spotlights Admin Pages', () => {
    before(() => {
        const FILTER_STORAGE_NAME = 'alert-admin-filter-term'; // match to SpotlightsListAsTable
        sessionStorage.removeItem(FILTER_STORAGE_NAME);
    });
    const numRowsHiddenAsNoDatainfo = 1;
    context('access to Spotlight Admin is controlled', () => {
        context('unauthenticated users cannot access Spotlight Admin', () => {
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
                cy.visit(
                    'http://localhost:2020/admin/spotlights/edit/9eab3aa0-82c1-11eb-8896-eb36601837f5?user=public',
                );
                cy.viewport(1300, 1000);
                cy.get('h1').should('be.visible');
                cy.get('h1').contains('Authentication required');
            });
            it('the view page is not available to public users', () => {
                cy.visit(
                    'http://localhost:2020/admin/spotlights/view/9eab3aa0-82c1-11eb-8896-eb36601837f5?user=public',
                );
                cy.viewport(1300, 1000);
                cy.get('h1').should('be.visible');
                cy.get('h1').contains('Authentication required');
            });
            it('the clone page is not available to public users', () => {
                cy.visit(
                    'http://localhost:2020/admin/spotlights/clone/9eab3aa0-82c1-11eb-8896-eb36601837f5?user=public',
                );
                cy.viewport(1300, 1000);
                cy.get('h1').should('be.visible');
                cy.get('h1').contains('Authentication required');
            });
        });
        context('unauthorised users cannot access Spotlight Admin', () => {
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
            it('the view page is not available to non-authorised users', () => {
                cy.visit(
                    'http://localhost:2020/admin/spotlights/view/9eab3aa0-82c1-11eb-8896-eb36601837f5?user=uqstaffnonpriv',
                );
                cy.viewport(1300, 1000);
                cy.get('h1').should('be.visible');
                cy.get('h1').contains('Permission denied');
            });
            it('the clone page is not available to non-authorised users', () => {
                cy.visit(
                    'http://localhost:2020/admin/spotlights/clone/9eab3aa0-82c1-11eb-8896-eb36601837f5?user=uqstaffnonpriv',
                );
                cy.viewport(1300, 1000);
                cy.get('h1').should('be.visible');
                cy.get('h1').contains('Permission denied');
            });
        });
    });
    context('Spotlights list page', () => {
        beforeEach(() => {
            cy.visit('http://localhost:2020/admin/spotlights?user=uqstaff');
            cy.viewport(1300, 1000);
        });

        function loadTheViewByImageLightbox() {
            cy.get('button[data-testid="admin-spotlights-view-by-image-button"]')
                .should('exist')
                .click();
        }

        context('Spotlights list page - general', () => {
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
                cy.get('[data-testid="confirm-spotlight-save-error-dialog"]').click();
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
                    .should('have.length', 3 + numRowsHiddenAsNoDatainfo);
                cy.get('[data-testid="admin-spotlights-list-past-list"] tfoot').contains(getFooterLabel(3, 3));

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
                cy.get('button[data-testid="admin-spotlights-add-display-button"]')
                    .should('exist')
                    .click();
                cy.location('href').should('eq', 'http://localhost:2020/admin/spotlights/add');
            });
            it('the edit button loads the edit page', () => {
                cy.get('button[data-testid="spotlight-list-item-edit-9eab3aa0-82c1-11eb-8896-eb36601837f5"]')
                    .should('exist')
                    .click();
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
                cy.get('button[data-testid="spotlight-list-item-view-1e1b0e10-c400-11e6-a8f0-47525a49f469"]')
                    .should('exist')
                    .click();
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
                        expect(titleAttribute.endsWith('Run between 2021-03-01 00:01:00  and  2099-12-07 23:59:00')).to
                            .be.true;
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
                // typing "can" in the filter reduces the number of thumbnails to 7
                cy.get('[data-testid="spotlights-viewbyimage-filter-text-field"] input')
                    .should('exist')
                    .type('can');
                cy.get('[data-testid="spotlights-viewbyimage-lightbox-content"] div')
                    .should('exist')
                    .children()
                    .should('have.length', 7);
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
                cy.get('[data-testid="spotlights-viewbyhistory-lightbox-close-button"]')
                    .should('exist')
                    .click();
                // the view-by-image lightbox is back in focus
                cy.get('[data-testid="spotlights-viewbyhistory-lightbox-title"]').should('not.exist');
                cy.get('[data-testid="spotlights-viewbyimage-lightbox-title"]').should('exist');
            });
            it('the view-by-image help button works', () => {
                // help is not inittially displayed
                cy.get('[data-testid="admin-spotlights-view-by-image-help-example"]').should('not.exist');

                // click the help button
                cy.get('[data-testid="admin-spotlights-viewbyimage-help-button"]').should('be.visible');
                cy.get('[data-testid="admin-spotlights-viewbyimage-help-button"]')
                    .should('exist')
                    .click();

                // we can see the help contents
                cy.get('[data-testid="admin-spotlights-view-by-image-help-example"]').scrollIntoView();
                cy.get('[data-testid="admin-spotlights-view-by-image-help-example"]').should('be.visible');

                // the close button works
                cy.get('[data-testid="spotlights-helpdrawer-close-button"]')
                    .should('exist')
                    .click();
                cy.get('[data-testid="admin-spotlights-view-by-image-help-example"]').should('not.exist');
            });
            it('the view-by-image close button works', () => {
                cy.get('[data-testid="spotlights-viewbyimage-lightbox-close-button"]')
                    .should('exist')
                    .click();
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

            it('it shows a view-by-history lightbox and can exit with the close button', () => {
                loadTheHistoryLightbox('298288b0-605c-11eb-ad87-357f112348ef', 'scheduled');

                // confirm random piece of content
                assertImageWarningIsPresent('spotlights-viewbyhistory-lightbox-dimensions', false);

                cy.get('[data-testid="spotlights-viewbyhistory-lightbox-holder"] ul')
                    .children()
                    .should('have.length', 2);

                // use the close button
                cy.get('[data-testid="spotlights-viewbyhistory-lightbox-close-button"]')
                    .should('exist')
                    .click();
                cy.location('href').should('eq', `${Cypress.config('baseUrl')}/admin/spotlights?user=uqstaff`);
                cy.get('[data-testid="spotlights-viewbyhistory-lightbox-title"]').should('not.exist');
            });
            it('it shows a view-by-history and can open clone form', () => {
                loadTheHistoryLightbox('9eab3aa0-82c1-11eb-8896-eb36601837f5');

                // confirm random piece of content
                assertImageWarningIsPresent('spotlights-viewbyhistory-lightbox-dimensions', false);

                cy.get('[data-testid="spotlights-viewbyhistory-lightbox-holder"] ul')
                    .children()
                    .should('have.length', 23);

                cy.get('[data-testid="spotlight-list-item-clone-9eab3aa0-82c1-11eb-8896-eb36601837f5"]')
                    .should('exist')
                    .should('contain', 'Clone')
                    .click();
                cy.location('href').should('contain', `${Cypress.config('baseUrl')}/admin/spotlights/clone`);
            });
            it('it shows a view-by-history and can open edit form', () => {
                loadTheHistoryLightbox('9eab3aa0-82c1-11eb-8896-eb36601837f5');

                // confirm random piece of content
                assertImageWarningIsPresent('spotlights-viewbyhistory-lightbox-dimensions', false);

                cy.get('[data-testid="spotlights-viewbyhistory-lightbox-holder"] ul')
                    .children()
                    .should('have.length', 23);

                cy.get('[data-testid="spotlight-viewhistory-button-edit-9eab3aa0-82c1-11eb-8896-eb36601837f5"]')
                    .should('exist')
                    .should('contain', 'Edit')
                    .click();
                cy.location('href').should('contain', `${Cypress.config('baseUrl')}/admin/spotlights/edit`);
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
                // open the help pop up
                cy.get('[data-testid="admin-spotlights-view-by-history-help-example"]').should('not.exist');
                cy.get('[data-testid="spotlights-viewbyhistory-lightbox-help-button"]').should('be.visible');
                cy.get('[data-testid="spotlights-viewbyhistory-lightbox-help-button"]').click();

                // we can see the help contents
                cy.get('[data-testid="admin-spotlights-view-by-history-help-example"]').scrollIntoView();
                cy.get('[data-testid="admin-spotlights-view-by-history-help-example"]').should('be.visible');

                // the close button works
                cy.get('[data-testid="spotlights-helpdrawer-close-button"]').click();
                cy.get('[data-testid="admin-spotlights-view-by-history-help-example"]').should('not.exist');
            });
        });
        context('Spotlight Admin session storage', () => {
            beforeEach(() => {
                cy.visit('http://localhost:2020/admin/spotlights?user=uqstaff');
                cy.viewport(1300, 1000);
            });
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
                    .should('have.length', 3 + numRowsHiddenAsNoDatainfo);

                // we load the view page, then click the cancel button to come back to the list page
                cy.get('[data-testid="spotlight-list-past"] tbody tr:first-child button:first-child')
                    .should('exist')
                    .should('contain', 'View')
                    .click();
                cy.location('href').should(
                    'eq',
                    'http://localhost:2020/admin/spotlights/view/1e1b0e10-c400-11e6-a8f0-47525a49f469',
                );
                cy.get('h2')
                    .should('be.visible')
                    .contains('View spotlight');
                cy.get('[data-testid="admin-spotlights-form-button-cancel"]')
                    .should('exist')
                    .click();
                cy.location('href').should('eq', 'http://localhost:2020/admin/spotlights');

                // the filter text field still has the previously typed word and only 3 rows are present
                cy.get('[data-testid="admin-spotlights-list-past-list"]').scrollIntoView();
                cy.get('[data-testid="spotlights-list-clear-text-field"]').should('exist');
                cy.get('[data-testid="spotlights-list-clear-text-field"] input').should('have.value', 'can');
                cy.get('[data-testid="spotlight-list-past"] tbody')
                    .children()
                    .should('have.length', 3 + numRowsHiddenAsNoDatainfo);
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

                // we reduce the number of rows to 3 by typing into the filter input field
                cy.get('[data-testid="spotlights-list-clear-text-field"]').should('exist');
                cy.get('[data-testid="spotlights-list-clear-text-field"] input').type('can');
                cy.get('[data-testid="spotlight-list-past"] tbody')
                    .children()
                    .should('have.length', 3 + numRowsHiddenAsNoDatainfo);

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

                // the filter text field still has the previously typed word and only 3 rows are present
                cy.get('[data-testid="admin-spotlights-list-past-list"]').scrollIntoView();
                cy.get('[data-testid="spotlights-list-clear-text-field"]').should('exist');
                cy.get('[data-testid="spotlights-list-clear-text-field"] input').should('have.value', 'can');
                cy.get('[data-testid="spotlight-list-past"] tbody')
                    .children()
                    .should('have.length', 3 + numRowsHiddenAsNoDatainfo);

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
                cy.get('[data-testid="cancel-spotlight-delete-confirm"]').click();
                cy.get('[data-testid="dialogbox-spotlight-delete-confirm"]').should('not.exist');
            });

            it('can delete Current spotlights', () => {
                // header count is correct initially
                cy.get('[data-testid="headerRow-current"] span').should('contain', '- 4 spotlights');
                cy.get('[data-testid="admin-spotlights-list-current-list"]').should(
                    'contain',
                    'Can be deleted and edited',
                );
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
                cy.get('[data-testid="confirm-spotlight-delete-confirm"]').should('exist');
                cy.get('[data-testid="confirm-spotlight-delete-confirm"]').contains('Proceed');
                cy.get('[data-testid="confirm-spotlight-delete-confirm"]').click();
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
                cy.get('[data-testid="confirm-spotlight-delete-confirm"]').should('exist');
                cy.get('[data-testid="confirm-spotlight-delete-confirm"]').contains('Proceed');
                cy.get('[data-testid="confirm-spotlight-delete-confirm"]').click();
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
                cy.get('[data-testid="admin-spotlights-list-current-list"]').should(
                    'contain',
                    'Can be deleted and edited',
                );
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
                cy.get('[data-testid="confirm-spotlight-delete-confirm"]').should('exist');
                cy.get('[data-testid="confirm-spotlight-delete-confirm"]').contains('Proceed');
                cy.get('[data-testid="confirm-spotlight-delete-confirm"]').click();
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
                cy.get('[data-testid="confirm-spotlight-delete-confirm"]').click();
                cy.get('[data-testid="dialogbox-spotlight-delete-confirm"]').should('not.exist');
                cy.wait(500);
                // the error dialog doesnt appear
                cy.get('[data-testid="dialogbox-spotlight-delete-error-dialog"]').should('not.exist');
                // the row is gone
                cy.get('[data-testid="admin-spotlights-list-past-list"]').should(
                    'not.contain',
                    'Can be deleted past #2',
                );

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
                cy.get('[data-testid="confirm-spotlight-delete-confirm"]')
                    .should('exist')
                    .contains('Proceed')
                    .click();
                cy.get('[data-testid="dialogbox-spotlight-delete-confirm"]').should('not.exist');
                cy.get('[data-testid="admin-spotlights-list-past-list"]').should(
                    'not.contain',
                    'Can be viewed or deleted past #1',
                );
                cy.get('[data-testid="admin-spotlights-list-past-list"]').should(
                    'not.contain',
                    'Can be deleted past #3',
                );
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
    context('Spotlight Admin Forms', () => {
        context('Spotlight Admin Add page', () => {
            beforeEach(() => {
                cy.visit('http://localhost:2020/admin/spotlights/add?user=uqstaff');
                cy.viewport(1300, 1000);
            });

            it('add page is accessible', () => {
                cy.injectAxe();
                cy.viewport(1300, 1000);
                cy.get('h2')
                    .should('be.visible')
                    .contains('Create a new spotlight');
                cy.wait(1000);
                cy.checkA11y('[data-testid="StandardPage"]', {
                    reportName: 'Spotlights Admin Add',
                    scopeName: 'Content',
                    includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
                });
            });
            it('an url must be valid', () => {
                cy.get('[data-testid="admin-spotlights-form-link-url"]').should('be.visible');
                cy.get('[data-testid="admin-spotlights-form-title"] textarea').type('Read more');
                cy.get('[data-testid="admin-spotlights-form-link-url"] input').type('http://x.c');
                cy.get('[data-testid="admin-spotlights-form-link-url"]').should('have.class', 'Mui-error');
                // one more character
                cy.get('[data-testid="admin-spotlights-form-link-url"] input').type('o');
                cy.get('[data-testid="admin-spotlights-form-link-url"]').should('not.have.class', 'Mui-error');
            });

            it('Entering the fields works', () => {
                saveButtonisDisabled();
                cy.get('[data-testid="admin-spotlights-form-title"]').type('spotlight title 3');
                cy.get('[data-testid="admin-spotlights-form-title"] textarea').should(
                    'have.value',
                    'spotlight title 3',
                );

                cy.get('[data-testid="admin-spotlights-form-tooltip"]').type('spotlight image alt 3');
                cy.get('[data-testid="admin-spotlights-form-tooltip"] textarea').should(
                    'have.value',
                    'spotlight image alt 3',
                );

                cy.get('[data-testid="admin-spotlights-form-link-url"]').type('http://example.com');
                cy.get('[data-testid="admin-spotlights-form-link-url"] input').should(
                    'have.value',
                    'http://example.com',
                );

                dragFileToDropzone('spotlight-too-large.jpg');
                assertImageWarningIsPresent('dropzone-dimension-warning');
                saveButtonNOTDisabled();

                cy.get('[data-testid="admin-spotlights-form-checkbox-published"] input').check();
                cy.get('[data-testid="admin-spotlights-form-checkbox-published"] input').should('be.checked');

                // cant test end or start date initial value here - would just be reimplementing the algorithm.
                // Tested in Jest
                cy.get('[data-testid="admin-spotlights-form-start-date"] button').click();
                // advance the start date two months forward
                // (picking a date that far forward lets us test the error on the end date)
                cy.get('.MuiPickersCalendarHeader-switchHeader button:nth-of-type(2)')
                    .as('next-month-button')
                    .click();
                cy.get('.MuiPickersCalendarHeader-switchHeader p').then(monthLabel => {
                    // towards the end of the month, the default start date is already into _next_ month,
                    // only click a second time if we need to, to get Month 2
                    const nextmonth = moment()
                        .add(1, 'M')
                        .startOf('month');
                    let month;
                    if (monthLabel.length > 1) {
                        month = monthLabel[0].textContent || monthLabel[0].innerText || '';
                    } else {
                        month = monthLabel.val();
                    }
                    if (month === nextmonth.format('MMMM YYYY')) {
                        cy.get('@next-month-button').click(); // and on to the next month
                    } else {
                        cy.log('2 months already', nextmonth);
                    }
                });

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
                cy.get('[data-testid="admin-spotlights-form-end-date"] p.Mui-error')
                    .should('exist')
                    .and('contain', 'Date should not be before minimal date');
                // open the end date so we can fix the date
                cy.get('[data-testid="admin-spotlights-form-end-date"] button').click();
                // advance the end date another month
                cy.get('.MuiPickersCalendarHeader-switchHeader button:not([disabled])')
                    .as('next-month-button')
                    .click();
                // and pick the first of the month
                cy.get('.MuiPickersCalendar-week button:not(.MuiPickersDay-hidden')
                    .first()
                    .contains('1')
                    .click();
                // the time dialog loads, but lets just ok out
                cy.get('.MuiDialogActions-spacing button:nth-child(2)')
                    .contains('OK')
                    .click();
                // and date is set to next month
                cy.get('[data-testid="admin-spotlights-form-end-date"] input').should($input => {
                    const defaultDate = $input.val();
                    const nextmonth = moment()
                        .add(3, 'M')
                        .startOf('month');
                    expect(defaultDate).to.include(nextmonth.format('DD/MM/YYYY'));
                });
                // all is good so the create button enables
                saveButtonNOTDisabled();

                // can clear the upload with the Trashcan button
                cy.get('[data-testid="dropzone-preview"] button')
                    .should('exist')
                    .click();
                dragzoneIsReadyForDrag();
                saveButtonisDisabled();

                cy.get('[data-testid="admin-spotlights-form-admin-note"]').type('spotlight admin note 3');
                cy.get('[data-testid="admin-spotlights-form-admin-note"] textarea').should(
                    'have.value',
                    'spotlight admin note 3',
                );
            });

            it('can save a spotlight on the add page', () => {
                cy.get('[data-testid="admin-spotlights-form-title"]').type('spotlight title 4');
                cy.get('[data-testid="admin-spotlights-form-tooltip"]').type('spotlight image alt 4');
                cy.get('[data-testid="admin-spotlights-form-link-url"] input').type('http://example.com');
                dragFileToDropzone('spotlight-too-large.jpg');
                assertImageWarningIsPresent('dropzone-dimension-warning');
                cy.get('[data-testid="admin-spotlights-form-admin-note"]').type('spotlight admin note 4');
                cy.get('[data-testid="admin-spotlights-form-button-save"]')
                    .should('not.be.disabled')
                    .click();
                cy.wait(50);
                cy.get('body').contains('A spotlight has been added');
                // click 'add another spotlight' button in dialog
                cy.get('[data-testid="confirm-spotlight-add-save-succeeded"]').click();
                // the spotlight page reloads with a blank form
                cy.location('href').should('eq', 'http://localhost:2020/admin/spotlights/add?user=uqstaff');
                cy.get('[data-testid="admin-spotlights-form-title"]').should('have.value', '');
                cy.get('[data-testid="admin-spotlights-form-link-url"] input').should('have.value', '');
                cy.get('[data-testid="admin-spotlights-form-admin-note"]').should('have.value', '');
                dragzoneIsReadyForDrag();
            });
            it('the cancel button on the add page returns to the list page', () => {
                cy.get('[data-testid="admin-spotlights-form-button-cancel"]').click();
                cy.wait(500);
                cy.location('href').should('eq', 'http://localhost:2020/admin/spotlights');
                cy.get('[data-testid="spotlight-list-current"]').should('be.visible');
                cy.get('[data-testid="spotlight-list-current"] tbody')
                    .children()
                    .should('have.length', numberCurrentPublishedSpotlights + numRowsHiddenAsNoDatainfo);
            });
            it('has a working Help button on the Add page', () => {
                // open the help pop up
                cy.get('[data-testid="admin-spotlights-help-example"]').should('not.exist');
                cy.get('[data-testid="admin-spotlights-help-button"]').should('be.visible');
                cy.get('[data-testid="admin-spotlights-help-button"]').click();

                // we can see the help contents
                cy.get('[data-testid="admin-spotlights-help-example"]').scrollIntoView();
                cy.get('[data-testid="admin-spotlights-help-example"]').should('be.visible');

                // the close button works
                cy.get('button:contains("Close")').click();
                cy.get('[data-testid="admin-spotlights-help-example"]').should('not.exist');
            });
            it('save button on the add page is disabled unless the form is valid', () => {
                // fill out the form from the bottom up to double-check the "button enables properly"
                saveButtonisDisabled();

                dragFileToDropzone('spotlight-just-right.png');
                assertImageOKIsPresent('dropzone-dimension-warning');
                saveButtonisDisabled();

                cy.get('[data-testid="admin-spotlights-form-title"]').type('spotlight title 5');
                saveButtonisDisabled();

                cy.get('[data-testid="admin-spotlights-form-tooltip"]').type('spotlight img alt 5');
                saveButtonisDisabled();

                // start an url, but button are disabled while it isnt valid
                cy.get('[data-testid="admin-spotlights-form-link-url"]').type('http://e');
                saveButtonisDisabled();

                // complete to a valid url
                cy.get('[data-testid="admin-spotlights-form-link-url"]').type('xample.com');

                saveButtonNOTDisabled(); // OK!!!!

                // as we clear fields the form is not valid
                removeImageFromDragzone();
                saveButtonisDisabled();
                dragFileToDropzone('spotlight-just-right.png');
                assertImageOKIsPresent('dropzone-dimension-warning');
                saveButtonNOTDisabled();

                cy.get('[data-testid="admin-spotlights-form-title"]')
                    .type('y')
                    .clear();
                saveButtonisDisabled();
                cy.get('[data-testid="admin-spotlights-form-title"]').type('xxx');
                saveButtonNOTDisabled();

                cy.get('[data-testid="admin-spotlights-form-tooltip"]').clear();
                saveButtonisDisabled();
                cy.get('[data-testid="admin-spotlights-form-tooltip"]').type('xxx');
                saveButtonNOTDisabled();

                cy.get('[data-testid="admin-spotlights-form-link-url"]').clear();
                saveButtonisDisabled();
                cy.get('[data-testid="admin-spotlights-form-link-url"]').type('http://example.com');
                saveButtonNOTDisabled();
            });
            it('add form shows the reorderable thumbs block', () => {
                cy.visit('http://localhost:2020/admin/spotlights/add?user=uqstaff');
                cy.viewport(1300, 1000);

                // set date to now
                cy.get('[data-testid="admin-spotlights-form-start-date"] button').click();
                cy.get('.MuiPickersModal-withAdditionalAction button:first-child span.MuiButton-label')
                    .should('be.visible')
                    .contains(locale.form.labels.datePopupNowButton)
                    .click();
                cy.get('.MuiPickersModal-withAdditionalAction button:nth-child(3)')
                    .contains('OK')
                    .click();

                // we cant current do any interactive testing, so a basic check is the best we can do
                cy.get('[data-testid="spotlights-thumbs-reorder"]')
                    .should('exist')
                    .scrollIntoView();
                cy.get('[data-testid="spotlights-thumbs-reorder"]')
                    .children()
                    .should('have.length', 5);
                cy.get('[data-testid="spotlights-thumbs-reorder"] span:last-child img')
                    .should('exist')
                    .and('have.css', 'border-left-style', 'solid'); // proxy for "the span is highlighted"
                cy.get('[data-testid="spotlights-thumbs-reorder"] span:last-child span')
                    .should('exist')
                    .should('contain', '5');

                // the grey place holder shows as the last img
                cy.get('[data-testid="spotlights-thumbs-reorder"] > span:last-child img')
                    .should('exist')
                    .and('have.attr', 'src', placeholderImage);

                // drag in a new image and it is reflected in the 'reorderable thumbs'
                dragFileToDropzone('spotlight-just-right.png');
                assertImageOKIsPresent('dropzone-dimension-warning');
                cy.get('[data-testid="spotlights-thumbs-reorder"] span:last-child img')
                    .invoke('attr', 'src')
                    .then(src => {
                        expect(src).to.contains('blob:http://localhost:2020');
                    });
                cy.get('[data-testid="spotlights-thumbs-reorder"] > span:last-child img')
                    .should('exist')
                    .invoke('attr', 'src')
                    .then(src => {
                        // this is as close as we can get to the actual image
                        expect(src).to.contains('blob:http://localhost:2020');
                    });

                removeImageFromDragzone();
                cy.get('[data-testid="spotlights-thumbs-reorder"] > span:last-child img')
                    .should('exist')
                    .and('have.attr', 'src', placeholderImage);
                dragFileToDropzone('spotlight-too-large.jpg');
                cy.get('[data-testid="spotlights-thumbs-reorder"] > span:last-child img')
                    .should('exist')
                    .invoke('attr', 'src')
                    .then(src => {
                        // this is as close as we can get to the actual image
                        expect(src).to.contains('blob:http://localhost:2020');
                    });
            });
        });
        context('Spotlight Admin Edit page', () => {
            beforeEach(() => {
                cy.visit(
                    'http://localhost:2020/admin/spotlights/edit/9eab3aa0-82c1-11eb-8896-eb36601837f5?user=uqstaff',
                );
                cy.viewport(1300, 1000);
            });

            it('edit page is accessible', () => {
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
            it('can make changes to spotlight fields on the edit form', () => {
                cy.wait(1000); // these waits fix "this element is detached from the DOM" errors :(
                cy.get('[data-testid="admin-spotlights-form-title"] textarea')
                    .clear()
                    .type('spotlight title 3');
                cy.get('[data-testid="admin-spotlights-form-tooltip"] textarea')
                    .clear()
                    .type('spotlight image alt 3');
                cy.get('[data-testid="admin-spotlights-form-link-url"] input')
                    .clear()
                    .type('http://example.com');

                cy.get('[data-testid="admin-spotlights-form-start-date"] button').click();
                cy.get('.MuiPickersModal-withAdditionalAction button:first-child span.MuiButton-label')
                    .should('be.visible')
                    .contains(locale.form.labels.datePopupNowButton)
                    .click();
                cy.get('.MuiPickersModal-withAdditionalAction button:nth-child(3)')
                    .contains('OK')
                    .click();

                cy.get('[data-testid="admin-spotlights-form-button-save"]').should('not.be.disabled');
            });
            it('the edit form can save a spotlight', () => {
                cy.get('[data-testid="admin-spotlights-form-button-save"]')
                    .should('not.be.disabled')
                    .click();
                cy.wait(50);
                cy.get('body').contains('The spotlight has been updated');
                cy.wait(50);
                cy.get('[data-testid="confirm-spotlight-edit-save-succeeded"]')
                    .should('exist')
                    .click(); // click 'view list' button in dialog
                cy.location('href').should('eq', 'http://localhost:2020/admin/spotlights'); // the list page reloads
            });
            it('the cancel button on the edit page returns to the list page', () => {
                cy.wait(100);
                cy.get('[data-testid="admin-spotlights-form-button-cancel"]')
                    .should('exist')
                    .click();
                cy.location('href').should('eq', 'http://localhost:2020/admin/spotlights');
                cy.get('[data-testid="spotlight-list-current"]').should('be.visible');
                cy.get('[data-testid="spotlight-list-current"] tbody')
                    .children()
                    .should('have.length', numberCurrentPublishedSpotlights + numRowsHiddenAsNoDatainfo);
            });
            it('has a working Help button on the Edit page', () => {
                // open the help pop up
                cy.get('[data-testid="admin-spotlights-help-example"]').should('not.exist');
                cy.get('[data-testid="admin-spotlights-help-button"]').should('be.visible');
                cy.wait(100);
                cy.get('[data-testid="admin-spotlights-help-button"]').click();

                // we can see the help contents
                cy.get('[data-testid="admin-spotlights-help-example"]').scrollIntoView();
                cy.get('[data-testid="admin-spotlights-help-example"]').should('be.visible');

                // the close button works
                cy.get('button:contains("Close")').click();
                cy.get('[data-testid="admin-spotlights-help-example"]').should('not.exist');
            });
            it('the edit form presets the correct data', () => {
                cy.wait(100);
                cy.get('[data-testid="admin-spotlights-form-title"] textarea').should(
                    'have.value',
                    'Can be deleted and edited',
                );
                cy.get('[data-testid="admin-spotlights-form-tooltip"] textarea').should(
                    'have.value',
                    'Dorothy Hill Engineering & Sciences Library. Meeting rooms, low-light spaces, quiet spaces & more.',
                );
                cy.get('[data-testid="admin-spotlights-form-start-date"] input').should(
                    'have.value',
                    '15/03/2021 00:02 am',
                );
                cy.get('[data-testid="admin-spotlights-form-end-date"] input').should(
                    'have.value',
                    '21/03/2099 23:59 pm',
                );
                cy.get('[data-testid="spotlights-form-upload-dropzone"] img').should(
                    'have.attr',
                    'src',
                    'http://localhost:2020/public/images/spotlights/babcccc0-e0e4-11ea-b159-6dfe174e1a21.jpg',
                );
                cy.get('[data-testid="admin-spotlights-form-checkbox-published"] input').should('be.checked');
            });
            it('Edit save button is disabled when the form is invalid', () => {
                // this is an edit page, so the page loads valid
                saveButtonNOTDisabled();

                cy.get('[data-testid="admin-spotlights-form-title"] textarea').clear();
                saveButtonisDisabled();
                cy.get('[data-testid="admin-spotlights-form-title"] textarea').type('spotlight title 5');
                saveButtonNOTDisabled();
                cy.get('[data-testid="admin-spotlights-form-title"] textarea').should(
                    'have.value',
                    'spotlight title 5',
                );

                cy.get('[data-testid="admin-spotlights-form-tooltip"] textarea').clear();
                saveButtonisDisabled();
                cy.get('[data-testid="admin-spotlights-form-tooltip"] textarea').type('spotlight img alt 5');
                saveButtonNOTDisabled();

                // start an url, but button are disabled while it isnt valid
                cy.get('[data-testid="admin-spotlights-form-link-url"] input').clear();
                saveButtonisDisabled();
                cy.get('[data-testid="admin-spotlights-form-link-url"] input').type('http://e');
                saveButtonisDisabled();
                // complete to a valid url
                cy.get('[data-testid="admin-spotlights-form-link-url"] input').type('xample.com');
                saveButtonNOTDisabled();
                cy.get('[data-testid="admin-spotlights-form-link-url"] input').should(
                    'have.value',
                    'http://example.com',
                );
            });
            it('can delete the current spotlight image on the edit form and upload a different image', () => {
                dragzoneContainsAnImage();
                removeImageFromDragzone();
                saveButtonisDisabled();

                dragzoneIsReadyForDrag();
                dragFileToDropzone('spotlight-just-right.png');
                dragzoneContainsAnImage();
                saveButtonNOTDisabled();

                assertImageOKIsPresent('dropzone-dimension-warning');
            });
            it('edit form shows the reorderable thumbs block', () => {
                cy.visit(
                    'http://localhost:2020/admin/spotlights/edit/9eab3aa0-82c1-11eb-8896-eb36601837f5?user=uqstaff',
                );
                cy.viewport(1300, 1000);
                dragzoneContainsAnImage();

                // we cant current do any interactive testing, so a basic check is the best we can do
                cy.get('[data-testid="spotlights-thumbs-reorder"]')
                    .should('exist')
                    .scrollIntoView();
                cy.get('[data-testid="spotlights-thumbs-reorder"]')
                    .children()
                    .should('have.length', 4);
                cy.get('[data-testid="spotlights-thumbs-reorder"] span:first-child img').should(
                    'have.css', // proxy for "the img is highlighted"
                    'border-left-style',
                    'solid',
                );

                // the thumb for the current spotlight changes correctly as we load and unload the dragzone
                cy.get('[data-testid="spotlights-thumbs-reorder"] > span:first-child img')
                    .should('exist')
                    .and(
                        'have.attr',
                        'src',
                        'http://localhost:2020/public/images/spotlights/babcccc0-e0e4-11ea-b159-6dfe174e1a21.jpg',
                    );
                removeImageFromDragzone();
                cy.get('[data-testid="spotlights-thumbs-reorder"] > span:first-child img')
                    .should('exist')
                    .and('have.attr', 'src', placeholderImage);
                dragFileToDropzone('spotlight-too-large.jpg');
                cy.get('[data-testid="spotlights-thumbs-reorder"] > span:first-child img')
                    .should('exist')
                    .invoke('attr', 'src')
                    .then(src => {
                        // this is as close as we can get to the actual image
                        expect(src).to.contains('blob:http://localhost:2020');
                    });
            });
        });
        context('Spotlight Admin Clone page', () => {
            beforeEach(() => {
                cy.visit(
                    'http://localhost:2020/admin/spotlights/clone/9eab3aa0-82c1-11eb-8896-eb36601837f5?user=uqstaff',
                );
                cy.viewport(1300, 1000);
            });

            it('clone page is accessible', () => {
                cy.injectAxe();
                cy.viewport(1300, 1000);
                cy.get('h2').should('be.visible');
                cy.get('h2').contains('Clone spotlight');
                cy.wait(1000);
                cy.checkA11y('[data-testid="StandardPage"]', {
                    reportName: 'Spotlights Admin Clone',
                    scopeName: 'Content',
                    includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
                });
            });
            it('the cancel button on the clone page returns to the list page', () => {
                cy.wait(100);
                cy.get('[data-testid="admin-spotlights-form-button-cancel"]')
                    .should('exist')
                    .click();
                cy.location('href').should('eq', 'http://localhost:2020/admin/spotlights');
                cy.get('[data-testid="spotlight-list-current"]').should('be.visible');
                cy.get('[data-testid="spotlight-list-current"] tbody')
                    .children()
                    .should('have.length', numberCurrentPublishedSpotlights + numRowsHiddenAsNoDatainfo);
            });
            it('has a working Help button on the Clone page', () => {
                // open the help pop up
                cy.get('[data-testid="admin-spotlights-help-example"]').should('not.exist');
                cy.get('[data-testid="admin-spotlights-help-button"]').should('be.visible');
                cy.wait(100);
                cy.get('[data-testid="admin-spotlights-help-button"]').click();

                // we can see the help contents
                cy.get('[data-testid="admin-spotlights-help-example"]').scrollIntoView();
                cy.get('[data-testid="admin-spotlights-help-example"]').should('be.visible');

                // the close button works
                cy.get('button:contains("Close")').click();
                cy.get('[data-testid="admin-spotlights-help-example"]').should('not.exist');
            });
            it('the clone form presets the correct data', () => {
                cy.wait(100);
                cy.get('[data-testid="admin-spotlights-form-title"] textarea').should(
                    'have.value',
                    'Can be deleted and edited',
                );
                cy.get('[data-testid="admin-spotlights-form-tooltip"] textarea').should(
                    'have.value',
                    'Dorothy Hill Engineering & Sciences Library. Meeting rooms, low-light spaces, quiet spaces & more.',
                );
                cy.get('[data-testid="admin-spotlights-form-link-url"] input').should(
                    'have.value',
                    'https://web.library.uq.edu.au/locations-hours/dorothy-hill-engineering-and-sciences-library',
                );
                cy.get('[data-testid="spotlights-form-upload-dropzone"] img')
                    .should('exist')
                    .and(
                        'have.attr',
                        'src',
                        'http://localhost:2020/public/images/spotlights/babcccc0-e0e4-11ea-b159-6dfe174e1a21.jpg',
                    );
            });
            it('Save button is disabled when the clone form is invalid', () => {
                // this is an clone page, so the page loads valid
                saveButtonNOTDisabled();

                cy.get('[data-testid="admin-spotlights-form-title"] textarea').clear();
                saveButtonisDisabled();
                cy.get('[data-testid="admin-spotlights-form-title"] textarea').type('spotlight title 5');
                saveButtonNOTDisabled();
                cy.get('[data-testid="admin-spotlights-form-title"] textarea').should(
                    'have.value',
                    'spotlight title 5',
                );

                cy.get('[data-testid="admin-spotlights-form-tooltip"] textarea').clear();
                saveButtonisDisabled();
                cy.get('[data-testid="admin-spotlights-form-tooltip"] textarea').type('spotlight img alt 5');
                saveButtonNOTDisabled();

                // start an url, but button are disabled while it isnt valid
                cy.get('[data-testid="admin-spotlights-form-link-url"] input').clear();
                saveButtonisDisabled();
                cy.get('[data-testid="admin-spotlights-form-link-url"] input').type('http://e');
                saveButtonisDisabled();
                // complete to a valid url
                cy.get('[data-testid="admin-spotlights-form-link-url"] input').type('xample.com');
                saveButtonNOTDisabled();
                cy.get('[data-testid="admin-spotlights-form-link-url"] input').should(
                    'have.value',
                    'http://example.com',
                );
            });
            it('can make changes to spotlight fields on the clone form', () => {
                cy.wait(1000); // these waits fix "this element is detached from the DOM" errors :(
                cy.get('[data-testid="admin-spotlights-form-title"] textarea')
                    .clear()
                    .type('spotlight title 3');
                cy.get('[data-testid="admin-spotlights-form-tooltip"] textarea')
                    .clear()
                    .type('spotlight image alt 3');
                cy.get('[data-testid="admin-spotlights-form-link-url"] input')
                    .clear()
                    .type('http://example.com');

                cy.get('[data-testid="admin-spotlights-form-start-date"] button').click();
                cy.get('.MuiPickersModal-withAdditionalAction button:first-child span.MuiButton-label')
                    .should('be.visible')
                    .contains(locale.form.labels.datePopupNowButton)
                    .click();
                cy.get('.MuiPickersModal-withAdditionalAction button:nth-child(3)')
                    .contains('OK')
                    .click();

                cy.get('[data-testid="admin-spotlights-form-button-save"]').should('not.be.disabled');
            });
            it('the save on the clone page runs correctly and can reclone', () => {
                cy.get('[data-testid="admin-spotlights-form-title"] textarea')
                    .clear()
                    .type('a cloned spotlight');
                cy.get('[data-testid="admin-spotlights-form-button-save"]')
                    .should('not.be.disabled')
                    .click();
                cy.wait(50);
                cy.get('body').contains('The spotlight has been cloned');
                // click 'view list' button in dialog
                cy.wait(50);
                cy.get('[data-testid="confirm-spotlight-clone-save-succeeded"]')
                    .should('exist')
                    .click();
                // the list page reloads
                cy.location('href').should(
                    'eq',
                    'http://localhost:2020/admin/spotlights/clone/9eab3aa0-82c1-11eb-8896-eb36601837f5?user=uqstaff',
                );
                // dialog has closed
                cy.get('[data-testid="dialogbox-spotlight-clone-save-succeeded"]').should('not.exist');
                // the original clone reloads correctly
                cy.get('[data-testid="admin-spotlights-form-title"] textarea').should(
                    'have.value',
                    'Can be deleted and edited',
                );
            });
            it('the save on the clone form runs correctly and can return to list', () => {
                cy.get('[data-testid="admin-spotlights-form-button-save"]')
                    .should('not.be.disabled')
                    .click();
                cy.wait(50);
                cy.get('body').contains('The spotlight has been cloned');
                // click ''view list'' button in dialog
                cy.get('[data-testid="cancel-spotlight-clone-save-succeeded"]').click();
                // the list page reloads
                cy.location('href').should('eq', 'http://localhost:2020/admin/spotlights');
            });
            it('can delete the current spotlight image on the clone form and upload a different image', () => {
                dragzoneContainsAnImage();
                removeImageFromDragzone();
                dragzoneIsReadyForDrag();
                dragFileToDropzone('spotlight-just-right.png');
                dragzoneContainsAnImage();
                assertImageOKIsPresent('dropzone-dimension-warning');
            });
            it('clone form shows the reorderable thumbs block', () => {
                cy.visit(
                    'http://localhost:2020/admin/spotlights/clone/9eab3aa0-82c1-11eb-8896-eb36601837f5?user=uqstaff',
                );
                cy.viewport(1300, 1000);
                dragzoneContainsAnImage();

                // set date to now so the thumbs are available
                cy.get('[data-testid="admin-spotlights-form-start-date"] button').click();
                cy.get('.MuiPickersModal-withAdditionalAction button:first-child span.MuiButton-label')
                    .should('be.visible')
                    .contains(locale.form.labels.datePopupNowButton)
                    .click();
                cy.get('.MuiPickersModal-withAdditionalAction button:nth-child(3)')
                    .contains('OK')
                    .click();

                // we cant current do any interactive testing, so a basic check is the best we can do
                cy.get('[data-testid="spotlights-thumbs-reorder"]')
                    .should('exist')
                    .scrollIntoView();
                cy.get('[data-testid="spotlights-thumbs-reorder"]')
                    .children()
                    .should('have.length', 5);
                cy.get('[data-testid="spotlights-thumbs-reorder"] span:last-child img')
                    .should('exist')
                    .and('have.css', 'border-left-style', 'solid'); // proxy for "the img is highlighted"
                cy.get('[data-testid="spotlights-thumbs-reorder"] span:last-child span')
                    .should('exist')
                    .should('contain', '5');

                // the thumb for the current spotlight changes correctly as we load and unload the dragzone
                removeImageFromDragzone();
                cy.get('[data-testid="spotlights-thumbs-reorder"] > span:last-child img')
                    .should('exist')
                    .and('have.attr', 'src', placeholderImage);
                dragFileToDropzone('spotlight-too-large.jpg');
                cy.get('[data-testid="spotlights-thumbs-reorder"] > span:last-child img')
                    .should('exist')
                    .invoke('attr', 'src')
                    .then(src => {
                        // this is as close as we can get to the actual image
                        expect(src).to.contains('blob:http://localhost:2020');
                    });
            });
        });
    });
    context('Spotlight Admin View page', () => {
        beforeEach(() => {
            cy.visit('http://localhost:2020/admin/spotlights/view/1e1b0e10-c400-11e6-a8f0-47525a49f469?user=uqstaff');
            cy.viewport(1300, 1000);
        });

        it('view page is accessible', () => {
            cy.injectAxe();
            cy.viewport(1300, 1000);
            cy.get('h2').should('be.visible');
            cy.get('h2').contains('View spotlight');
            cy.wait(1000);
            cy.checkA11y('[data-testid="StandardPage"]', {
                reportName: 'Spotlights Admin View',
                scopeName: 'Content',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
        it('the cancel button on the view page returns to the list page', () => {
            cy.wait(100);
            cy.get('[data-testid="admin-spotlights-form-button-cancel"]')
                .should('exist')
                .click();
            cy.location('href').should('eq', 'http://localhost:2020/admin/spotlights');
            cy.get('[data-testid="spotlight-list-current"]').should('be.visible');
            cy.get('[data-testid="spotlight-list-current"] tbody')
                .children()
                .should('have.length', numberCurrentPublishedSpotlights + numRowsHiddenAsNoDatainfo);
        });
        it('has a working Help button on the View page', () => {
            cy.get('[data-testid="admin-spotlights-view-help-example"]').should('not.exist');
            cy.get('[data-testid="admin-spotlights-help-button"]').should('be.visible');
            cy.wait(100);
            cy.get('[data-testid="admin-spotlights-help-button"]').click();
            cy.get('[data-testid="admin-spotlights-view-help-example"]').should('be.visible');
            cy.get('button:contains("Close")').click();
            cy.get('[data-testid="admin-spotlights-view-help-example"]').should('not.exist');
        });
        it('the view page displays the correct data', () => {
            cy.wait(100);
            cy.get('[data-testid="admin-spotlights-form-admin-note"] textarea')
                .should('exist')
                .should('have.value', 'sample admin note 2');
            cy.get('[data-testid="admin-spotlights-form-title"] textarea')
                .should('exist')
                .should('have.value', 'Can be viewed or deleted past #1');
            cy.get('[data-testid="admin-spotlights-form-tooltip"] textarea')
                .should('exist')
                .should('have.value', 'Feedback on library services');
            cy.get('[data-testid="admin-spotlights-form-start-date"] input')
                .should('exist')
                .should('have.value', '2016-12-17T12:24:00');
            cy.get('[data-testid="admin-spotlights-form-end-date"] input')
                .should('exist')
                .should('have.value', '2021-02-28T23:59:00');
            cy.get('img[data-testid="admin-spotlights-view-img"]')
                .should('exist')
                .and(
                    'have.attr',
                    'src',
                    'http://localhost:2020/public/images/spotlights/52d3e090-d096-11ea-916e-092f3af3e8ac.jpg',
                );
        });
        it('can visit the clone page from the view page', () => {
            cy.wait(50);
            cy.get('button[data-testid="admin-spotlights-form-button-save"]').click();
            cy.location('href').should(
                'eq',
                'http://localhost:2020/admin/spotlights/clone/1e1b0e10-c400-11e6-a8f0-47525a49f469',
            );
        });
    });
});
