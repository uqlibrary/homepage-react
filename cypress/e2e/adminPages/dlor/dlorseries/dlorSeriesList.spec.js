import { DLOR_ADMIN_USER } from '../../../../support/constants';

describe('Digital Learning Hub admin Series management', () => {
    beforeEach(() => {
        cy.clearCookies();
    });

    context('Series management', () => {
        beforeEach(() => {
            cy.visit(`http://localhost:2020/admin/dlor/series/manage?user=${DLOR_ADMIN_USER}`);
            cy.viewport(1300, 1000);
        });
        it('is accessible', () => {
            cy.injectAxe();
            cy.viewport(1300, 1000);
            cy.waitUntil(() => cy.get('h1').should('exist'));
            cy.get('h1').should('contain', 'Digital Learning Hub - Series management');

            cy.checkA11y('[data-testid="StandardPage"]', {
                reportName: 'dlor series management',
                scopeName: 'Content',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
        it('loads as expected', () => {
            // series name shows correctly
            cy.get('[data-testid="dlor-serieslist-panel-1"]')
                .should('exist')
                .contains('Advanced literature searching');
            cy.get('[data-testid="dlor-serieslist-panel-2"]')
                .should('exist')
                .contains('Digital Essentials');
            cy.get('[data-testid="dlor-serieslist-panel-3"]')
                .should('exist')
                .contains('EndNote');
            cy.get('[data-testid="dlor-serieslist-panel-4"]')
                .should('exist')
                .contains('Python');
            cy.get('[data-testid="dlor-serieslist-panel-5"]')
                .should('exist')
                .contains('R with RStudio');
            cy.get('[data-testid="dlor-serieslist-panel-6"]')
                .should('exist')
                .contains('Research techniques');
            cy.get('[data-testid="dlor-serieslist-panel-7"]')
                .should('exist')
                .contains('How to find guides');
            cy.get('[data-testid="dlor-serieslist-panel-8"]')
                .should('exist')
                .contains('Indigenising curriculum');
            cy.get('[data-testid="dlor-serieslist-panel-9"]')
                .should('exist')
                .contains('Subject guides');
            cy.get('[data-testid="dlor-serieslist-panel-null"]')
                .should('exist')
                .contains('Not in a series');

            // there is no delete button where the series has associated objects
            cy.get('[data-testid="dlor-serieslist-delete-1"]').should('not.exist');
            cy.get('[data-testid="dlor-serieslist-delete-2"]').should('not.exist');
            cy.get('[data-testid="dlor-serieslist-delete-3"]').should('not.exist');
            cy.get('[data-testid="dlor-serieslist-delete-4"]').should('exist');
            cy.get('[data-testid="dlor-serieslist-delete-5"]').should('exist');
            cy.get('[data-testid="dlor-serieslist-delete-6"]').should('not.exist');
            cy.get('[data-testid="dlor-serieslist-delete-7"]').should('exist');
            cy.get('[data-testid="dlor-serieslist-delete-8"]').should('not.exist');
            cy.get('[data-testid="dlor-serieslist-delete-9"]').should('exist');
            cy.get('[data-testid="dlor-serieslist-delete-10"]').should('not.exist');

            // all have edit buttons
            const listLength = 9;
            const numbers = Array.from({ length: listLength }, (_, index) => index + 1);
            numbers.forEach(ii => {
                cy.get(`[data-testid="dlor-serieslist-edit-${ii}"]`).should('exist');
            });

            // object counts are correct
            cy.get('[data-testid="dlor-series-object-list-1"]')
                .should('exist')
                .contains('2 Objects');
            cy.get('[data-testid="dlor-series-object-list-2"]')
                .should('exist')
                .contains('7 Objects');
            cy.get('[data-testid="dlor-series-object-list-3"]')
                .should('exist')
                .contains('1 Object');
            cy.get('[data-testid="dlor-series-object-list-4"]').should('not.exist');
            cy.get('[data-testid="dlor-series-object-list-5"]').should('not.exist');
            cy.get('[data-testid="dlor-series-object-list-6"]')
                .should('exist')
                .contains('1 Object');
            cy.get('[data-testid="dlor-series-object-list-7"]').should('not.exist');
            cy.get('[data-testid="dlor-series-object-list-8"]')
                .should('exist')
                .contains('1 Object');
            cy.get('[data-testid="dlor-series-object-list-9"]').should('not.exist');
            cy.get('[data-testid="dlor-series-object-list-null"]')
                .should('exist')
                .contains('other Objects');
        });
        it('has a working "view a dlor" button', () => {
            // can open a list and click edit
            cy.get('[data-testid="dlor-series-object-list-1"] summary')
                .should('exist')
                .click();
            cy.get('[data-testid="dlor-series-object-list-item-view-2"]')
                .should('exist')
                .click();
            cy.url().should('eq', 'http://localhost:2020/digital-learning-hub/view/98s0_dy5k3_98h4');
        });
        it('has a working "edit a dlor" button', () => {
            // can open a list and click edit
            cy.get('[data-testid="dlor-series-object-list-1"] summary')
                .should('exist')
                .click();
            cy.get('[data-testid="dlor-series-object-list-item-2"]')
                .should('exist')
                .click();
            cy.url().should('eq', 'http://localhost:2020/admin/dlor/edit/98s0_dy5k3_98h4?user=dloradmn');
        });
        it.skip('has a working "add a series" button', () => {
            cy.get('[data-testid="admin-dlor-visit-add-button"]')
                .should('exist')
                .should('contain', 'Add series')
                .click();
            cy.location('href').should('eq', `http://localhost:2020/admin/dlor/series/add?user=${DLOR_ADMIN_USER}`);
        });
        it('has a working "edit a series" button', () => {
            cy.get('[data-testid="dlor-serieslist-edit-2"]')
                .should('exist')
                .click();
            cy.location('href').should('eq', `http://localhost:2020/admin/dlor/series/edit/2?user=${DLOR_ADMIN_USER}`);
        });
        it('can cancel deletion of a Series', () => {
            // click delete icon on first Object
            cy.get('[data-testid="dlor-serieslist-delete-4"]')
                .should('exist')
                .click();
            // confirm delete box is open
            cy.get('[data-testid="dialogbox-dlor-series-delete-confirm"]')
                .should('exist')
                .contains('Do you want to delete this series?');
            // say "no, I dont want to delete" and the dialog just closes
            cy.get('[data-testid="cancel-dlor-series-delete-confirm"]')
                .should('exist')
                .contains('No')
                .click();
            cy.get('[data-testid="dialogbox-dlor-series-delete-confirm"]').should('not.exist');
        });
        it('can delete a series', () => {
            // click delete icon on first Object
            cy.get('[data-testid="dlor-serieslist-delete-4"]')
                .should('exist')
                .click();
            // "confirm delete" box is open
            cy.get('[data-testid="dialogbox-dlor-series-delete-confirm"]')
                .should('exist')
                .contains('Do you want to delete this series?');
            // say "yes"
            cy.get('[data-testid="confirm-dlor-series-delete-confirm"]')
                .should('exist')
                .contains('Yes'); // new
            // cy.wait(2000);
            cy.get('[data-testid="confirm-dlor-series-delete-confirm"]')
                .should('exist')
                .click();

            // "confirm delete" box is closed
            cy.get('[data-testid="dialogbox-dlor-series-delete-confirm"]').should('not.exist');

            // it worked!
            cy.waitUntil(() => cy.get('[data-testid="dialogbox-dlor-series-delete-confirm"]').should('be.visible'));
            cy.get('[data-testid="dialogbox-dlor-series-delete-confirm"] h2').contains('The series has been deleted.');
            cy.get('[data-testid="cancel-dlor-series-delete-confirm"]').should('not.exist');
            cy.get('[data-testid="confirm-dlor-series-delete-confirm"]')
                .should('exist')
                .contains('Close')
                .click();

            // cant really test it was deleted - that will happen in canary. just confirm the page reloads
            cy.get('[data-testid="dlor-serieslist-list"]')
                .should('exist')
                .children()
                .should('have.length', 10);

            // a second delete throws up the correct dialog boxes
            // (and doesnt think it is already done
            cy.get('[data-testid="dlor-serieslist-delete-4"]')
                .should('exist')
                .click();
            // "confirm delete" box is open
            cy.get('[data-testid="dialogbox-dlor-series-delete-confirm"]')
                .should('exist')
                .contains('Do you want to delete this series?');
            // say "yes"
            cy.get('[data-testid="confirm-dlor-series-delete-confirm"]')
                .should('exist')
                .click();

            // it worked!
            cy.waitUntil(() => cy.get('[data-testid="dialogbox-dlor-series-delete-confirm"]').should('be.visible'));
            cy.get('[data-testid="dialogbox-dlor-series-delete-confirm"] h2').contains('The series has been deleted.');
            cy.get('[data-testid="cancel-dlor-series-delete-confirm"]').should('not.exist');
            cy.get('[data-testid="confirm-dlor-series-delete-confirm"]')
                .should('exist')
                .contains('Close');

            cy.get('[data-testid="confirm-dlor-series-delete-confirm"]').click();
        });
    });
    context('failed actions', () => {
        beforeEach(() => {
            cy.visit(`http://localhost:2020/admin/dlor/series/manage?user=${DLOR_ADMIN_USER}&responseType=saveError`);
            cy.viewport(1300, 1000);
        });
        it('a failed deletion is handled properly', () => {
            // click delete icon on first Object
            cy.get('[data-testid="dlor-serieslist-delete-4"]')
                .should('exist')
                .click();
            // confirm delete box is open
            cy.get('[data-testid="dialogbox-dlor-series-delete-confirm"]')
                .should('exist')
                .contains('Do you want to delete this series?');
            // say "yes"
            cy.get('[data-testid="confirm-dlor-series-delete-confirm"]')
                .should('exist')
                .click();

            // it failed! just what we wanted :)
            cy.waitUntil(() => cy.get('[data-testid="dialogbox-dlor-series-delete-confirm"]').should('be.visible'));
            cy.get('[data-testid="dialogbox-dlor-series-delete-confirm"] h2').contains(
                'An error has occurred during the request and this request cannot be processed.',
            );
            cy.get('[data-testid="cancel-dlor-series-delete-confirm"]').should('not.exist');
            cy.get('[data-testid="confirm-dlor-series-delete-confirm"]')
                .should('exist')
                .contains('Close');
            cy.get('[data-testid="confirm-dlor-series-delete-confirm"]').click();

            // cant really test it was deleted - that will happen in canary. just confirm the page reloads
            cy.get('[data-testid="dlor-serieslist-list"]')
                .should('exist')
                .children()
                .should('have.length', 10);
        });
    });
    context('user access', () => {
        it('displays an "unauthorised" page to public users', () => {
            cy.visit('http://localhost:2020/admin/dlor/series/manage?user=public');
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Authentication required');
        });
        it('displays an "unauthorised" page to non-authorised users', () => {
            cy.visit('http://localhost:2020/admin/dlor/series/manage?user=uqstaff');
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Permission denied');
        });
        it('displays correct page for admin users (list)', () => {
            cy.visit(`http://localhost:2020/admin/dlor/series/manage?user=${DLOR_ADMIN_USER}`);
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').should('contain', 'Digital Learning Hub - Series management');
        });
    });
});
