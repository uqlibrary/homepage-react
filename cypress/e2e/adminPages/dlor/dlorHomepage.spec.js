describe('Digital learning hub admin homepage', () => {
    beforeEach(() => {
        cy.clearCookies();
        cy.setCookie('UQ_CULTURAL_ADVICE', 'hidden');
    });

    const itemsPerPage = 10; // matches value in DLOAdminHomepage
    const gridFromExpectedRowCount = (expected = 23) => (expected > itemsPerPage ? itemsPerPage : expected) + 1;

    const mockDlorAdminUser = 'dloradmn';
    context('homepage', () => {
        beforeEach(() => {
            cy.visit(`http://localhost:2020/admin/dlor?user=${mockDlorAdminUser}`);
            cy.viewport(1300, 1000);
        });
        it('is accessible', () => {
            cy.injectAxe();
            cy.viewport(1300, 1000);
            cy.waitUntil(() => cy.get('h1').should('exist'));
            cy.get('h1').should('contain', 'Digital learning hub Management');

            cy.checkA11y('[data-testid="StandardPage"]', {
                reportName: 'dlor homepage',
                scopeName: 'Content',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
        it('has a working "add an object" button', () => {
            cy.get('[data-testid="admin-dlor-visit-add-button"]')
                .should('exist')
                .should('contain', 'Add object')
                .click();
            cy.location('href').should('eq', 'http://localhost:2020/admin/dlor/add?user=dloradmn');
        });
        it('has a working "edit an object" button', () => {
            cy.get('[data-testid="admin-dlor-visit-add-button"]')
                .should('exist')
                .should('contain', 'Add object')
                .click();
            cy.location('href').should('eq', 'http://localhost:2020/admin/dlor/add?user=dloradmn');
        });
        it('shows a list of objects to manage', () => {
            cy.get('[data-testid="dlor-homepage-list"]')
                .should('exist')
                .children()
                .should('have.length', gridFromExpectedRowCount());

            // sorts properly ('UQ has a Blak History' moves from position 3 to 2)
            cy.get('[data-testid="dlor-homepage-list"] > div:first-child h2')
                .should('exist')
                .should('be.visible')
                .should('contain', 'Accessibility - Digital Essentials');
            cy.get('[data-testid="dlor-homepage-list"] > div:first-child svg')
                .should('exist')
                .should('have.attr', 'style', 'color: green;'); // has green tick
            cy.get('[data-testid="dlor-homepage-list"] > div:nth-child(2) h2')
                .should('exist')
                .should('contain', 'UQ has a Blak History');
            cy.get('[data-testid="dlor-homepage-list"] > div:nth-child(2) svg')
                .should('exist')
                .should('have.attr', 'style', 'color: green;'); // has green tick
            cy.get('[data-testid="dlor-homepage-list"] > div:nth-child(3) h2')
                .should('exist')
                .should('contain', 'Advanced literature searching');
            cy.get('[data-testid="dlor-homepage-featured-98s0_dy5k3_98h4"]').should('not.exist'); // unfeatured: no green tick
        });
        it('pagination works', () => {
            // no data-testids in pagination :(

            const numPages = 3;
            const numExtraButtons = 4; // first, prev, next, last
            // there are the expected number of buttons in pagination widget
            cy.get('nav[aria-label="pagination navigation"] li')
                .should('exist')
                .children()
                .should('have.length', numPages + numExtraButtons);

            // button 1 has focus
            cy.get('nav[aria-label="pagination navigation"] li:nth-child(3) button')
                .should('exist')
                // .should('have.value', '1')
                .should('have.class', 'Mui-selected');

            // the displayed entries are what is expected
            cy.get('[data-testid="dlor-homepage-list"] > div:nth-child(1) h2')
                .should('exist')
                .should('be.visible')
                .should('contain', 'Accessibility - Digital Essentials');

            // click pagination for next page
            cy.get('nav[aria-label="pagination navigation"] li:nth-child(4) button')
                .should('exist')
                // .should('have.value', '2')
                .click();

            // the displayed entries have updated
            cy.get('[data-testid="dlor-homepage-list"] button:first-child')
                .should('exist')
                .should('be.visible');
            cy.get('[data-testid="dlor-homepage-list"] > div:nth-child(1) h2').should(
                'contain',
                'Dummy entry to increase list size 3',
            );

            // click pagination to go to first page
            cy.get('nav[aria-label="pagination navigation"] li:first-child button')
                .should('exist')
                .click();
        });
        it('can filter on keyword', () => {
            cy.get('[data-testid="dlor-homepage-list"]')
                .should('exist')
                .children()
                .should('have.length', gridFromExpectedRowCount());
            cy.get('[data-testid="dlor-homepage-list"] > div:nth-child(1) h2')
                .should('exist')
                .should('be.visible')
                .should('contain', 'Accessibility - Digital Essentials');
            const numExtraButtons = 4; // first, prev, next, last
            // there are the expected number of buttons in pagination widget
            cy.get('nav[aria-label="pagination navigation"] li')
                .should('exist')
                .children()
                .should('have.length', 3 + numExtraButtons);
            cy.get('[data-testid="dlor-homepage-keyword"]')
                .should('exist')
                .should('be.visible');

            cy.get('[data-testid="dlor-homepage-keyword"]').type('d');
            cy.get('[data-testid="dlor-homepage-list"]')
                .should('exist')
                .children()
                .should('have.length', gridFromExpectedRowCount()); // no change with one char
            cy.get('[data-testid="dlor-homepage-list"] > div:nth-child(1) h2')
                .should('exist')
                .should('be.visible')
                .should('contain', 'Accessibility - Digital Essentials');

            cy.get('[data-testid="dlor-homepage-keyword"]').type('ummy');
            cy.get('[data-testid="dlor-homepage-list"] > div:nth-child(1) h2')
                .should('exist')
                .should('be.visible')
                .should('contain', 'Dummy entry to increase list size A');
            // there are the expected number of buttons in pagination widget
            cy.get('nav[aria-label="pagination navigation"] li')
                .should('exist')
                .children()
                .should('have.length', 2 + numExtraButtons); // now only 2 pages
        });
        it('can cancel deletion of an Object', () => {
            // click delete icon on first Object
            cy.get('[data-testid="dlor-homepage-delete-987y_isjgt_9866"]')
                .should('exist')
                .click();
            // confirm delete box is open
            cy.get('[data-testid="dialogbox-dlor-item-delete-confirm"]')
                .should('exist')
                .contains('Do you want to delete this object?');
            // say "no, I dont want to delete" and the dialog just closes
            cy.get('[data-testid="cancel-dlor-item-delete-confirm"]')
                .should('exist')
                .click();
            cy.get('[data-testid="dialogbox-dlor-item-delete-confirm"]').should('not.exist');
        });
        it('can delete an object', () => {
            // click delete icon on first Object
            cy.get('[data-testid="dlor-homepage-delete-98s0_dy5k3_98h4"]')
                .should('exist')
                .click();
            // confirm delete box is open
            cy.get('[data-testid="dialogbox-dlor-item-delete-confirm"]')
                .should('exist')
                .contains('Do you want to delete this object?');
            // say "yes"
            cy.get('[data-testid="confirm-dlor-item-delete-confirm"]')
                .should('exist')
                .click();
            // cant really test it was deleted - that will happen in canary. just confirm the list page reloads
            cy.get('[data-testid="dlor-homepage-list"]')
                .should('exist')
                .children()
                .should('have.length', gridFromExpectedRowCount());
        });
        it('can filter objects', () => {
            const numDraft = 1;
            const numPublished = 23;
            const numRejected = 0;
            const numDeprecated = 1;
            const numDeleted = 1;
            cy.get('[data-testid="dlor-homepage-list"]')
                .should('exist')
                .children()
                .should('have.length', gridFromExpectedRowCount());

            // label counts are correct
            cy.get('[data-testid="checkbox-status-new"]')
                .parent()
                .parent()
                .find('span:nth-child(2)')
                .contains(`New/ Draft (${numDraft})`);
            cy.get('[data-testid="checkbox-status-current"]')
                .parent()
                .parent()
                .find('span:nth-child(2)')
                .contains(`Published (${numPublished})`);
            cy.get('[data-testid="checkbox-status-rejected"]')
                .parent()
                .find('span:nth-child(2)')
                .contains(`Rejected (${numRejected})`);
            cy.get('[data-testid="checkbox-status-deprecated"]')
                .parent()
                .parent()
                .find('span:nth-child(2)')
                .contains(`Deprecated (unpublished) (${numDeprecated})`);
            cy.get('[data-testid="checkbox-status-deleted"]')
                .parent()
                .parent()
                .find('span:nth-child(2)')
                .contains(`Deleted (${numDeleted})`);

            // check "new"
            cy.get('[data-testid="checkbox-status-new"] input[type=checkbox]')
                .should('exist')
                .should('not.be.checked')
                .check();
            cy.get('[data-testid="dlor-homepage-list"]')
                .should('exist')
                .children()
                .should('have.length', gridFromExpectedRowCount(numPublished + numDraft));

            // check "rejected"
            cy.get('[data-testid="checkbox-status-rejected"] input[type=checkbox]')
                .should('exist')
                .should('not.be.checked')
                .check();
            cy.get('[data-testid="dlor-homepage-list"]')
                .should('exist')
                .children()
                .should('have.length', gridFromExpectedRowCount(numPublished + numDraft + numRejected)); // no rejected entries, nothing changed

            // check "deleted"
            cy.get('[data-testid="checkbox-status-deleted"] input[type=checkbox]')
                .should('exist')
                .should('not.be.checked')
                .check();
            cy.get('[data-testid="dlor-homepage-list"]')
                .should('exist')
                .children()
                .should('have.length', gridFromExpectedRowCount(numPublished + numDraft + numRejected + numDeleted));

            // check "deprecated"
            cy.get('[data-testid="checkbox-status-deprecated"] input[type=checkbox]')
                .should('exist')
                .should('not.be.checked')
                .check();
            cy.get('[data-testid="dlor-homepage-list"]')
                .should('exist')
                .children()
                .should(
                    'have.length',
                    gridFromExpectedRowCount(numPublished + numDraft + numRejected + numDeleted + numDeprecated),
                );

            // UNcheck "published"
            cy.get('[data-testid="checkbox-status-current"] input[type=checkbox]')
                .should('exist')
                .should('be.checked')
                .uncheck();
            cy.get('[data-testid="dlor-homepage-list"]')
                .should('exist')
                .children()
                .should('have.length', gridFromExpectedRowCount(numDraft + numRejected + numDeleted + numDeprecated));

            // UNcheck "deleted"
            cy.get('[data-testid="checkbox-status-deleted"] input[type=checkbox]')
                .should('exist')
                .should('be.checked')
                .uncheck();
            cy.get('[data-testid="dlor-homepage-list"]')
                .should('exist')
                .children()
                .should('have.length', gridFromExpectedRowCount(numDraft + numRejected + numDeprecated));
        });
        it.skip('deleted objects are immutable', () => {
            // the history should work though
            cy.get('[data-testid="checkbox-status-current"] input')
                .should('exist')
                .should('be.checked')
                .uncheck();
            cy.get('[data-testid="checkbox-status-deleted"] input')
                .should('exist')
                .should('not.be.checked')
                .check();
            cy.get('[data-testid="dlor-homepage-list"]')
                .should('exist')
                .children()
                .should('have.length', gridFromExpectedRowCount(1));
            // buttons are disabled
            cy.get('[data-testid="dlor-homepage-list"] button:first-child')
                .should('exist')
                .should('be.disabled');
            cy.get('[data-testid="dlor-homepage-list"] button:nth-child(2)')
                .should('exist')
                .should('be.disabled');
        });
    });
    context('error handling', () => {
        it('deletion failure pops up an error', () => {
            cy.visit(`http://localhost:2020/admin/dlor?user=${mockDlorAdminUser}&responseType=saveError`);
            cy.viewport(1300, 1000);

            // click delete icon on first Object
            cy.get('[data-testid="dlor-homepage-delete-kj5t_8yg4_kj4f"]')
                .should('exist')
                .click();
            // confirm delete box is open
            cy.get('[data-testid="dialogbox-dlor-item-delete-confirm"]')
                .should('exist')
                .contains('Do you want to delete this object?');
            // say "yes"
            cy.get('[data-testid="confirm-dlor-item-delete-confirm"]')
                .should('exist')
                .click();
            // special url, above, forces an error - dialog reports error
            cy.waitUntil(() => cy.get('[data-testid="dialogbox-dlor-item-delete-failure-notice"]').should('exist'));
            cy.get('[data-testid="dialogbox-dlor-item-delete-failure-notice"]').should('be.visible');
            // has correct error message
            cy.get('[data-testid="dialogbox-dlor-item-delete-failure-notice"] [data-testid="message-title"]')
                .should('exist')
                .contains('An error occurred deleting the Object');
            // close the dialog
            cy.get('button[data-testid="confirm-dlor-item-delete-failure-notice"]').click();
            // dialog closed
            cy.get('button[data-testid="confirm-dlor-item-delete-failure-notice"]').should('not.exist');
            // list has reloaded
            cy.get('[data-testid="dlor-homepage-list"]')
                .should('exist')
                .children()
                .should('have.length', gridFromExpectedRowCount());
        });
    });
    context('user access', () => {
        it('displays an "unauthorised" page to public users', () => {
            cy.visit('http://localhost:2020/admin/dlor?user=public');
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Authentication required');
        });
        it('displays an "unauthorised" page to non-authorised users', () => {
            cy.visit('http://localhost:2020/admin/dlor?user=uqstaff');
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').contains('Permission denied');
        });
        it('displays correct page for admin users (list)', () => {
            cy.visit(`http://localhost:2020/admin/dlor?user=${mockDlorAdminUser}`);
            cy.viewport(1300, 1000);
            cy.get('h1').should('be.visible');
            cy.get('h1').should('contain', 'Digital learning hub Management');
        });
    });
});
