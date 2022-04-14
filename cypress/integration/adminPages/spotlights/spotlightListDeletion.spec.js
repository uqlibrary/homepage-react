import { FILTER_STORAGE_NAME, getFooterLabel } from '../../../support/spotlights';
import { clickButton } from '../../../support/helpers';

function noErrorDialogShows() {
    // we give it a period of time and then determine that no error happened
    cy.wait(500);
    cy.get('[data-testid="dialogbox-spotlight-delete-error-dialog"]').should('not.exist');
}

describe('Spotlight Admin: delete from List', () => {
    before(() => {
        sessionStorage.removeItem(FILTER_STORAGE_NAME);
    });
    beforeEach(() => {
        cy.visit('http://localhost:2020/admin/spotlights?user=uqstaff');
        cy.viewport(1300, 1000);
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
            noErrorDialogShows();

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
            noErrorDialogShows();

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
            noErrorDialogShows();

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
            noErrorDialogShows();
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
            noErrorDialogShows();
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
            noErrorDialogShows();
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
