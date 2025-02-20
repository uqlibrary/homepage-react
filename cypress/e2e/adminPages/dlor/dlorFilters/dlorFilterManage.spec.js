import { DLOR_ADMIN_USER } from '../../../../support/constants';


describe('Digital Learning Hub admin filter management', () => {
    beforeEach(() => {
        cy.clearCookies();
    });
    context('Admin page', () => {
        it('navigates to the filter management page', () => {
            cy.visit(`http://localhost:2020/admin/dlor?user=${DLOR_ADMIN_USER}`);
            cy.get('[data-testid="admin-dlor-visit-manage-filters-button"]').click();
            cy.get('[data-testid="StandardPage-title"]').should('contain', 'Digital Learning Hub - Facet Management');
        });
    });
    context('filters list', () => {
        beforeEach(() => {
            cy.visit(`http://localhost:2020/admin/dlor/filters?user=${DLOR_ADMIN_USER}`);
            cy.viewport(1300, 1000);
        });
        it('loads as expected', () => {
            cy.get('[data-testid="StandardPage-title"]')
                .should('exist')
                .should('contain', 'Digital Learning Hub - Facet Management');

            cy.get('a[data-testid="dlor-breadcrumb-admin-homelink"]')
                .contains('Digital Learning Hub admin')
                .should('have.attr', 'href', `http://localhost:2020/admin/dlor?user=${DLOR_ADMIN_USER}`);
            cy.get('[data-testid="dlor-breadcrumb-facet-management-label-0"]')
                .contains('Facet management')

            cy.get('[data-testid="facet-type-1-name"]').should('contain', 'Topic');
            
            cy.get('[data-testid="add-facet-1"]').should('exist').should('be.visible');
        });
        it('Allows the creation of a new filter', () => {
            cy.get('[data-testid="StandardPage-title"]')
                .should('exist')
                .should('contain', 'Digital Learning Hub - Facet Management');

            cy.get('[data-testid="add-facet-1"]').should('exist').click();
            // popup
            cy.get('#modal-modal-title').should('contain', 'Add new facet');
            cy.get('#modal-modal-existingName').should('contain', 'Topic');
            // content entry
            cy.get('#facet_name').type('New filter');
            cy.get('#facet_order').invoke('val', '1').trigger('change');
            cy.get('#facet_help').type('This is a new filter');
            cy.get('[data-testid="admin-dlor-filter-confirm-button"]').click();
            cy.get('#modal-modal-title').should('not.exist');
        });

        it('Allows the editing of an existing filter', () => {
            cy.get('[data-testid="StandardPage-title"]')
                .should('exist')
                .should('contain', 'Digital Learning Hub - Facet Management');

            cy.get('[data-testid="edit-facet-1"]').should('exist').click();
            // popup
            cy.get('#modal-modal-title').should('contain', 'Edit facet');
            cy.get('#modal-modal-existingName').should('contain', 'Original Name')
                .should('contain', 'Aboriginal and Torres Strait Islander');
            // content entry
            cy.get('#facet_name').clear().type('Adjusted Name');
            // Original name should still reflect the original name
            cy.get('#modal-modal-existingName').should('contain', 'Original Name')
                .should('contain', 'Aboriginal and Torres Strait Islander');
            cy.get('#facet_order').invoke('val', '2').trigger('change');
            // check input mechanism
            cy.get('#facet_order').focus().type('{uparrow}').blur();
            cy.get('#facet_order').focus().type('{downarrow}').blur();
            
            cy.get('#facet_help').clear();
            cy.get('[data-testid="admin-dlor-filter-confirm-button"]').click();
            cy.get('#modal-modal-title').should('not.exist');
        });

        it('Allows for the deletion of filters', () => {
            cy.get('[data-testid="StandardPage-title"]')
                .should('exist')
                .should('contain', 'Digital Learning Hub - Facet Management');

            cy.get('[data-testid="delete-facet-1"]').should('exist').click();
            cy.get('[data-testid="message-title"]').should('contain', 'Delete facet');
            cy.get('[data-testid="message-content"]').should('contain', 'Aboriginal and Torres Strait Islander');
            cy.get('[data-testid="confirm-alert-edit-save-succeeded"]').click()
            cy.get('[data-testid="delete-facet-1"]').should('exist').click();
            cy.get('[data-testid="message-title"]').should('contain', 'Delete facet');
            cy.get('[data-testid="message-content"]').should('contain', 'Aboriginal and Torres Strait Islander');
            cy.get('[data-testid="cancel-alert-edit-save-succeeded"]').click()
            // popup
           
        });
        // it('is accessible', () => {
        //     cy.injectAxe();
        //     cy.viewport(1300, 1000);
        //     cy.waitUntil(() => cy.get('h1').should('exist'));
        //     cy.get('h1').should('contain', 'Digital Learning Hub - Add Series');

        //     cy.checkA11y('[data-testid="StandardPage"]', {
        //         reportName: 'dlor series management edit',
        //         scopeName: 'Content',
        //         includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        //     });
        // });
        // it('functions as expected', () => {
        //     cy.get('[data-testid="object-series-order-9bc192a8-324c-4f6b-ac50-02"] input').then($el => {
        //         const isVisible = $el[0].checkVisibility();
        //         expect(isVisible).to.eq(false);
        //     });
        //     cy.get('[data-testid="admin-dlor-series-summary-button"]').click();

        //     // Now, the div should be visible
        //     cy.get('[data-testid="object-series-order-9bc192a8-324c-4f6b-ac50-02"] input').then($el => {
        //         const isVisible = $el[0].checkVisibility();
        //         expect(isVisible).to.eq(true);
        //     });
        // });
        // it('can add a series without objects', () => {
        //     cy.waitUntil(() =>
        //         cy
        //             .get('[data-testid="admin-dlor-series-form-button-cancel"]')
        //             .should('exist')
        //             .contains('Cancel'),
        //     );
        //     cy.get('[data-testid="series-name"] input').type('Series without objects');
        //     TypeCKEditor("This is a series without any objects");
        //     //should have no current objects already in the series
        //     cy.get('#dragLandingAarea')
        //         .should('contain', '(None yet)');

        //     cy.get('[data-testid="admin-dlor-series-form-save-button"]').click();

        //     cy.get('[data-testid="message-title"]').should('contain', 'Series has been created')

        // });
        // it('can navigate to and from the add series page', () => {
        //     cy.waitUntil(() =>
        //         cy
        //             .get('[data-testid="admin-dlor-series-form-button-cancel"]')
        //             .should('exist')
        //             .contains('Cancel'),
        //     );
        //     cy.get('[data-testid="dlor-breadcrumb-admin-homelink"]').click();
        //     cy.get('[data-testid="admin-dlor-visit-add-series-button"]').click();
           
        //     cy.get('[data-testid="StandardPage-title"]')
        //         .should('exist')
        //         .should('contain', 'Digital Learning Hub - Add Series');

        // });
        
    });
});
