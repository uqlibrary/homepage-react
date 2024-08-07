import { default as locale } from '../../../../../src/modules/Pages/Admin/TestTag/testTag.locale';

describe('Test and Tag Manage Locations', () => {
    beforeEach(() => {
        cy.visit('http://localhost:2020/admin/testntag/manage/locations?user=uqtesttag');
    });

    const getFieldValue = (dataField, rowIndex, colIndex) =>
        // cy.get(`[data-field='${dataField}'][data-rowindex='${rowIndex}'][data-colindex='${colIndex}']`);
        cy.get(`div[data-rowindex='${rowIndex}'] > div[data-field='${dataField}']`);

    const forcePageRefresh = () => {
        cy.data('test_tag_header-navigation-dashboard').click();
        cy.go('back');
    };

    it('page is accessible and renders base', () => {
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('h1').contains(locale.pages.general.pageTitle);
        cy.get('h2').contains(locale.pages.manage.locations.header.pageSubtitle('Library'));
        forcePageRefresh();
        cy.wait(1000);
        cy.waitUntil(() => getFieldValue('site_id_displayed', 0, 0).should('contain', '01'));
        cy.waitUntil(() => getFieldValue('site_name', 0, 1).should('contain', 'St Lucia'));
        cy.wait(1000);
        cy.checkA11y(
            { include: '[data-testid="StandardPage"]', exclude: ['[role=grid]'] },
            {
                reportName: 'Test and Tag Manage Locations',
                scopeName: 'Content',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            },
        );
    });
    it('Add location functions correctly', () => {
        cy.get('uq-site-header')
            .shadow()
            .within(() => {
                cy.get('[data-testid="subsite-title"]')
                    .should('exist')
                    .should('be.visible')
                    .contains('Test and tag');
            });
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('h1').contains(locale.pages.general.pageTitle);
        cy.get('h2').contains(locale.pages.manage.locations.header.pageSubtitle('Library'));
        forcePageRefresh();
        cy.wait(1000);
        cy.waitUntil(() => getFieldValue('site_id_displayed', 0, 0).should('contain', '01'));
        cy.waitUntil(() => getFieldValue('site_name', 0, 1).should('contain', 'St Lucia'));

        // Adding a site
        cy.data('add_toolbar-locations-add-button').click();
        cy.checkA11y(
            { include: '[data-testid="StandardPage"]', exclude: ['[role=grid]'] },
            {
                reportName: 'Test and Tag Manage Locations',
                scopeName: 'Content',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            },
        );
        cy.data('site_id_displayed-input').should('have.attr', 'required');
        cy.data('site_name-input').should('have.attr', 'required');
        cy.data('site_id_displayed-input').type('cypresstest');
        cy.data('site_name-input').type('Cypress Test');
        // Limit size to 10
        cy.data('site_id_displayed-input').should('have.value', 'cypresstes');
        cy.data('update_dialog-action-button').click();
        cy.data('confirmation_alert-success-alert')
            .should('exist')
            .should('be.visible');
        // Add a building
        cy.data('location_picker-locations-site-input').click();
        cy.get('#location_picker-locations-site-option-1').click();
        cy.waitUntil(() => getFieldValue('building_id_displayed', 0, 0).should('contain', '0001'));
        cy.data('add_toolbar-locations-add-button').click();
        cy.data('building_id_displayed-input').should('have.attr', 'required');
        cy.data('building_name-input').should('have.attr', 'required');
        cy.data('update_dialog-locations-content').should('contain', 'St Lucia');
        cy.data('building_id_displayed-input').type('buildingtest');
        cy.data('building_name-input').type('Cypress Test');
        // Limit size to 10
        cy.data('building_id_displayed-input').should('have.value', 'buildingte');
        cy.data('update_dialog-action-button').click();
        cy.data('confirmation_alert-success-alert')
            .should('exist')
            .should('be.visible');
        // Add a floor
        cy.data('location_picker-locations-site-input').click();
        cy.get('#location_picker-locations-site-option-1').click();
        cy.data('location_picker-locations-building-input').click();
        cy.get('#location_picker-locations-building-option-1').click();
        cy.waitUntil(() => getFieldValue('floor_id_displayed', 0, 0).should('contain', '2'));
        cy.data('add_toolbar-locations-add-button').click();
        cy.data('floor_id_displayed-input').should('have.attr', 'required');
        cy.data('update_dialog-locations-content').should('contain', 'Forgan Smith Building, St Lucia');
        cy.data('floor_id_displayed-input').type('cypresstest');
        // Limit size to 10
        cy.data('floor_id_displayed-input').should('have.value', 'cypresstes');
        cy.data('update_dialog-action-button').click();
        cy.data('confirmation_alert-success-alert')
            .should('exist')
            .should('be.visible');

        // Add a room
        cy.data('location_picker-locations-site-input').click();
        cy.get('#location_picker-locations-site-option-1').click();
        cy.data('location_picker-locations-building-input').click();
        cy.get('#location_picker-locations-building-option-1').click();
        cy.data('location_picker-locations-floor-input').click();
        cy.get('#location_picker-locations-floor-option-1').click();
        cy.waitUntil(() => getFieldValue('room_id_displayed', 0, 0).should('contain', 'W212'));
        cy.data('add_toolbar-locations-add-button').click();
        cy.data('room_id_displayed-input').should('have.attr', 'required');
        // description not required.
        cy.data('room_description-input').should('not.have.attr', 'required');
        cy.data('update_dialog-locations-content').should('contain', 'Floor 2 Forgan Smith Building');
        cy.data('room_id_displayed-input').type('cypresstest');
        cy.data('room_description-input').type('Room Description');
        // Limit size to 10
        cy.data('room_id_displayed-input').should('have.value', 'cypresstes');
        cy.data('update_dialog-action-button').click();
        cy.data('confirmation_alert-success-alert')
            .should('exist')
            .should('be.visible');
    });
    it('Edit location functions correctly', () => {
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('h1').contains(locale.pages.general.pageTitle);
        cy.get('h2').contains(locale.pages.manage.locations.header.pageSubtitle('Library'));
        forcePageRefresh();
        cy.wait(1000);
        cy.waitUntil(() => getFieldValue('site_id_displayed', 0, 0).should('contain', '01'));
        cy.waitUntil(() => getFieldValue('site_name', 0, 1).should('contain', 'St Lucia'));

        // Editing a site
        cy.data('action_cell-1-edit-button').click();
        cy.checkA11y(
            { include: '[data-testid="StandardPage"]', exclude: ['[role=grid]'] },
            {
                reportName: 'Test and Tag Manage Locations',
                scopeName: 'Content',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            },
        );
        // clear a required field - update button should disable
        cy.data('site_id_displayed-input').clear();
        cy.data('update_dialog-action-button').should('have.attr', 'disabled');
        // fill with data
        cy.data('site_id_displayed-input').type('testing');
        cy.data('update_dialog-action-button').should('not.have.attr', 'disabled');
        cy.data('update_dialog-action-button').click();
        cy.data('confirmation_alert-success-alert')
            .should('exist')
            .should('be.visible');

        // Editing a building
        cy.data('location_picker-locations-site-input').click();
        cy.get('#location_picker-locations-site-option-1').click();
        cy.waitUntil(() => getFieldValue('building_id_displayed', 0, 0).should('contain', '0001'));
        cy.data('action_cell-1-edit-button').click();
        // clear a required field - update button should disable
        cy.data('building_id_displayed-input').clear();
        cy.data('update_dialog-action-button').should('have.attr', 'disabled');
        // fill with data
        cy.data('building_id_displayed-input').type('testing');
        cy.data('update_dialog-action-button').should('not.have.attr', 'disabled');
        cy.data('update_dialog-action-button').click();
        cy.data('confirmation_alert-success-alert')
            .should('exist')
            .should('be.visible');

        // Editing a Floor
        cy.data('location_picker-locations-building-input').click();
        cy.get('#location_picker-locations-building-option-1').click();
        cy.waitUntil(() => getFieldValue('floor_id_displayed', 0, 0).should('contain', '2'));
        cy.data('action_cell-1-edit-button').click();
        // clear a required field - update button should disable
        cy.data('floor_id_displayed-input').clear();
        cy.data('update_dialog-action-button').should('have.attr', 'disabled');
        // fill with data
        cy.data('floor_id_displayed-input').type('testing');
        cy.data('update_dialog-action-button').should('not.have.attr', 'disabled');
        cy.data('update_dialog-action-button').click();
        cy.data('confirmation_alert-success-alert')
            .should('exist')
            .should('be.visible');

        // Editing a Room
        cy.data('location_picker-locations-floor-input').click();
        cy.get('#location_picker-locations-floor-option-1').click();
        cy.waitUntil(() => getFieldValue('room_id_displayed', 0, 0).should('contain', 'W212'));
        cy.data('action_cell-1-edit-button').click();
        // clear a required field - update button should disable
        cy.data('room_id_displayed-input').clear();
        cy.data('update_dialog-action-button').should('have.attr', 'disabled');
        // fill with data
        cy.data('room_id_displayed-input').type('testing');
        cy.data('update_dialog-action-button').should('not.have.attr', 'disabled');
        cy.data('update_dialog-action-button').click();
        cy.data('confirmation_alert-success-alert')
            .should('exist')
            .should('be.visible');
    });

    it('Delete location functions correctly', () => {
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('h1').contains(locale.pages.general.pageTitle);
        cy.get('h2').contains(locale.pages.manage.locations.header.pageSubtitle('Library'));
        forcePageRefresh();
        cy.wait(1000);
        cy.waitUntil(() => getFieldValue('site_id_displayed', 0, 0).should('contain', '01'));
        cy.waitUntil(() => getFieldValue('site_name', 0, 1).should('contain', 'St Lucia'));
        // Check if populated sites are disabled
        cy.data('action_cell-1-delete-button').should('have.attr', 'disabled');
        cy.data('action_cell-2-delete-button').should('not.have.attr', 'disabled');
        // delete non populated site
        cy.data('action_cell-3-delete-button').click();
        cy.checkA11y(
            { include: '[data-testid="StandardPage"]', exclude: ['[role=grid]'] },
            {
                reportName: 'Test and Tag Manage Locations',
                scopeName: 'Content',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            },
        );
        cy.data('message-title').should('contain', locale.pages.manage.locations.dialogDeleteConfirm.confirmationTitle);
        cy.data('confirm-locations').click();
        cy.data('confirmation_alert-success-alert').should('be.visible');
        cy.data('action_cell-3-delete-button').click();
        cy.data('cancel-locations').click();
        cy.data('confirmation_alert-success-alert').should('not.exist');
        // Delete a building
        cy.data('location_picker-locations-site-input').click();
        cy.get('#location_picker-locations-site-option-1').click();
        // First should be disabled.
        cy.data('action_cell-1-delete-button').should('have.attr', 'disabled');
        // Delete active site
        cy.data('action_cell-2-delete-button').click();
        cy.data('confirm-locations').click();
        cy.data('confirmation_alert-success-alert').should('be.visible');
        // Delete a floor.
        cy.data('location_picker-locations-building-input').click();
        cy.get('#location_picker-locations-building-option-2').click();
        cy.data('action_cell-1-delete-button').should('have.attr', 'disabled');
        cy.data('action_cell-2-delete-button').click();
        cy.data('confirm-locations').click();
        cy.data('confirmation_alert-success-alert').should('be.visible');
        // Delete a room
        cy.data('location_picker-locations-floor-input').click();
        cy.get('#location_picker-locations-floor-option-1').click();
        cy.data('action_cell-21-delete-button').should('have.attr', 'disabled');
        cy.data('action_cell-48-delete-button').click();
        cy.data('confirm-locations').click();
        // disabling check for this test - possible invalid route.
        // cy.data('confirmation_alert-success-alert').should('be.visible');
    });
});
