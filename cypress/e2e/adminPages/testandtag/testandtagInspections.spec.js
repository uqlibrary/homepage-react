import moment from 'moment';
import { default as locale } from '../../../../src/modules/Pages/Admin/TestTag/testTag.locale';

describe('Test and Tag Admin Inspection page', () => {
    beforeEach(() => {
        cy.setCookie('UQ_CULTURAL_ADVICE', 'hidden');
        cy.visit('http://localhost:2020/admin/testntag/inspect?user=uqtesttag');
    });

    const selectListbox = pattern => {
        cy.get('[role=listbox]').within(() => {
            cy.get('li')
                .contains(pattern)
                .click();
        });
    };
    const selectAssetId = pattern => {
        cy.data('asset_selector-asset-panel-input').click();
        selectListbox(pattern);
        cy.data('asset_selector-asset-panel-input').should('have.value', pattern);
    };
    const selectTestingDevice = pattern => {
        cy.data('inspection_panel-inspection-device-select').click();
        selectListbox(pattern);
        cy.data('inspection_panel-inspection-device-select').should('contain', pattern);
    };
    const selectAssetType = pattern => {
        cy.data('asset_type_selector-asset-panel-input').should('not.be.disabled');
        cy.data('asset_type_selector-asset-panel-input').click();
        selectListbox(pattern);
        cy.data('asset_type_selector-asset-panel-input').should('have.value', pattern);
    };
    const selectLocation = ({ site, building, floor, room }) => {
        // Site
        if (!!site) {
            cy.data('location_picker-event-panel-site').click();
            selectListbox(site);
        }
        if (!!building) {
            // Building
            cy.data('location_picker-event-panel-building').click();
            selectListbox(building);

            !!floor && cy.wait(1500);
        }

        // Floor
        if (!!floor) {
            cy.data('location_picker-event-panel-floor').click();
            selectListbox(floor);
            !!room && cy.wait(1500);
        }

        // Room
        if (!!room) {
            cy.data('location_picker-event-panel-room').click();
            selectListbox(room);
        }
    };

    const runAllTests = () => {
        it('page is accessible', () => {
            cy.injectAxe();
            cy.viewport(1300, 1000);
            cy.get('h1').contains('UQ Asset Test and Tag');
            cy.get('h2').contains('Testing assets for Library');
            cy.waitUntil(() => cy.data('location_picker-event-panel-site-input').should('have.value', 'St Lucia'));
            cy.wait(1000);
            cy.checkA11y(
                { include: ['[data-testid="StandardPage"]'] },
                {
                    reportName: 'Test and Tag Inspection Form',
                    scopeName: 'Content',
                    includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
                },
            );
        });
        describe('Event panel functionality', () => {
            const today = moment();
            it('should show correct dates', () => {
                cy.data('event_panel-event-date-input').should(
                    'have.value',
                    today.format(locale.pages.inspect.config.dateFormatDisplay),
                );
            });

            it('should allow entry of new date', () => {
                const invalidDate = today.add(1, 'day').format(locale.pages.inspect.config.dateFormatDisplay);
                const validDate = today.subtract(1, 'day').format(locale.pages.inspect.config.dateFormatDisplay);
                cy.data('event_panel-event-date-button').click();
                cy.get('[role="dialog"]').should('exist');
                cy.get('button')
                    .contains('Cancel')
                    .parent()
                    .click();
                cy.get('[role="dialog"]').should('not.exist');

                cy.data('event_panel-event-date-input').clear();
                cy.data('event_panel-event-date-input').type(invalidDate);
                cy.get('#event_panel-event-date-helper-text').contains(
                    locale.pages.inspect.form.event.date.maxDateMessage,
                );
                cy.data('event_panel-event-date-input').clear();
                cy.data('event_panel-event-date-input').type(validDate);
                cy.get('#event_panel-event-date-helper-text').should('not.exist');
            });

            it('should allow selection of location', () => {
                // Site
                cy.data('location_picker-event-panel-site-input').should('have.value', 'St Lucia');
                cy.data('location_picker-event-panel-site').click();
                cy.get('#location_picker-event-panel-site-option-1').click();
                cy.data('location_picker-event-panel-site-input').should('have.value', 'Gatton');

                // Building
                cy.data('location_picker-event-panel-building').click();
                cy.get('#location_picker-event-panel-building-option-0').click();
                cy.data('location_picker-event-panel-building-input').should(
                    'have.value',
                    '8102 - J.K. Murray Library',
                );

                // Floor
                cy.wait(1500);
                cy.data('location_picker-event-panel-floor').click();
                cy.get('#location_picker-event-panel-floor-option-0').click();
                cy.data('location_picker-event-panel-floor-input').should('have.value', '1');

                // Room
                cy.wait(1500);
                cy.data('location_picker-event-panel-room').click();
                cy.get('#location_picker-event-panel-room-option-0').click();
                cy.data('location_picker-event-panel-room-input').should('have.value', '101');

                // Reset by changing site
                cy.data('location_picker-event-panel-site').click();
                cy.get('#location_picker-event-panel-site-option-0').click();
                cy.data('location_picker-event-panel-site-input').should('have.value', 'St Lucia');
                cy.data('location_picker-event-panel-building-input').should(
                    'not.have.value',
                    '8102 - J.K. Murray Library',
                );
                cy.data('location_picker-event-panel-floor-input').should('not.have.value', '1');
                cy.data('location_picker-event-panel-room-input').should('not.have.value', '101');
            });

            it('should reset location when fields change', () => {
                cy.data('location_picker-event-panel-site-input').should('have.value', 'St Lucia');
                // set location so that we can test it clears later
                selectLocation({ building: 'Forgan Smith Building', floor: '2', room: 'W212' });
                cy.data('location_picker-event-panel-site-input').should('have.value', 'St Lucia');
                cy.data('location_picker-event-panel-building-input').should(
                    'have.value',
                    '0001 - Forgan Smith Building',
                );
                cy.data('location_picker-event-panel-floor-input').should('have.value', '2');
                cy.data('location_picker-event-panel-room-input').should('have.value', 'W212');
                selectLocation({ floor: '3' });
                cy.data('location_picker-event-panel-site-input').should('have.value', 'St Lucia');
                cy.data('location_picker-event-panel-building-input').should(
                    'have.value',
                    '0001 - Forgan Smith Building',
                );
                cy.data('location_picker-event-panel-floor-input').should('have.value', '3');
                cy.data('location_picker-event-panel-room-input').should('have.value', '');
                selectLocation({ building: 'Duhig' });
                cy.data('location_picker-event-panel-site-input').should('have.value', 'St Lucia');
                cy.data('location_picker-event-panel-building-input').should('have.value', '0002 - Duhig Tower');
                cy.data('location_picker-event-panel-floor-input').should('have.value', '');
                cy.data('location_picker-event-panel-room-input').should('have.value', '');
                selectLocation({ site: 'Gatton' });
                cy.data('location_picker-event-panel-site-input').should('have.value', 'Gatton');
                cy.data('location_picker-event-panel-building-input').should('have.value', '');
                cy.data('location_picker-event-panel-floor-input').should('have.value', '');
                cy.data('location_picker-event-panel-room-input').should('have.value', '');
            });
        });

        describe('Asset panel functionality', () => {
            it('should allow auto complete of asset ID as mask', () => {
                cy.data('location_picker-event-panel-site-input').should('have.value', 'St Lucia');
                // Enter partial asset ID for mask search
                cy.data('asset_selector-asset-panel-input').click();
                cy.data('asset_selector-asset-panel-input').type('123');
                cy.wait(3000);
                // Asset found
                cy.data('last_inspection_panel-header-fail-chip').should('exist');
            });
            it('should restrict length of asset IDs', () => {
                const initialText = 'ABCDEFGHIJKLMNOP'; // not a long enough text
                const croppedText = 'ABCDEFGHIJKL';
                // this is for code coverage. Will be removed post MVP
                cy.data('asset_selector-asset-panel-input').click();
                cy.data('asset_selector-asset-panel-input').type(`${initialText}{enter}`);
                cy.data('asset_selector-asset-panel-input').should('have.value', croppedText);
            });
            it('should allow selection of new asset and type', () => {
                cy.data('asset_type_selector-asset-panel-input').should('be.disabled');
                cy.data('asset_selector-asset-panel-input').click();
                cy.get('#asset_selector-asset-panel-option-0').should('exist');
                cy.get('#asset_selector-asset-panel-option-0').click();
                cy.data('asset_selector-asset-panel-input').should('have.value', 'NEW ASSET');
                cy.data('asset_type_selector-asset-panel-input').should('not.be.disabled');
                // select asset type
                selectAssetType('PowerBoard');
            });
            it('should allow creation of new asset type', () => {
                cy.data('asset_type_selector-asset-panel-input').should('be.disabled');
                cy.data('asset_selector-asset-panel-input').click();
                cy.get('#asset_selector-asset-panel-option-0').should('exist');
                cy.get('#asset_selector-asset-panel-option-0').click();
                cy.data('asset_selector-asset-panel-input').should('have.value', 'NEW ASSET');
                cy.data('asset_type_selector-asset-panel-input').should('not.be.disabled');

                cy.data('asset_type_selector-asset-panel-input')
                    .should('not.be.disabled')
                    .click();
                selectListbox('ADD NEW ASSET TYPE');
                // popup has loaded as it has header
                cy.data('asset_type_name-label').should('contain', 'Asset type name');
                cy.data('update_dialog-action-button').should('be.disabled');
                cy.data('asset_type_name-input').type('an asset type');

                // the popup is accessible
                cy.injectAxe();
                cy.checkA11y('[data-testid="StandardPage"]', {
                    reportName: 'Test and Tag Asset Type Creation Popup',
                    scopeName: 'Content',
                    includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
                });

                cy.data('update_dialog-action-button')
                    .should('not.be.disabled')
                    .should('contain', 'Add')
                    .click();
                // the user is acknowledged that the asset type was saved
                // cy.waitUntil(() =>
                //     cy
                //         .data('dialogbox-tnt-assettype-add-confirmation')
                //         // .find('message-title')
                //         .should('contain', 'The asset type has been added'),
                // );

                // click ok on the notice and both dialogs go away
                cy.data('confirmation_alert-success').should('exist');
                cy.data('confirmation_alert-success').within(() => {
                    cy.get('[type=button]').click();
                });
                cy.data('confirmation_alert-success').should('not.exist');
            });
            it('should allow selection of existing asset', () => {
                cy.data('asset_type_selector-asset-panel-input').should('be.disabled');
                cy.data('asset_selector-asset-panel-input').type('UQL3100');
                cy.wait(3000);
                cy.get('#asset_selector-asset-panel-option-0').contains('UQL31000');
                cy.get('#asset_selector-asset-panel-option-0').click();
                cy.data('asset_selector-asset-panel-input').should('have.value', 'UQL310000');
                cy.data('asset_type_selector-asset-panel-input').should('not.be.disabled');
                cy.data('asset_type_selector-asset-panel-input').should('have.value', 'Power Cord - C13');
            });

            it('should show passed Previous Inspection panel', () => {
                cy.data('asset_type_selector-asset-panel-input').should('be.disabled');
                cy.data('asset_selector-asset-panel-input').type('UQL3100');
                cy.wait(3000);
                cy.get('#asset_selector-asset-panel-option-0').click();
                cy.data('asset_selector-asset-panel-input').should('have.value', 'UQL310000');
                cy.data('last_inspection_panel')
                    .should('not.be.disabled')
                    .and('have.css', 'border-color', 'rgb(0, 114, 0)');
                cy.data('last_inspection_panel-header-pass-chip').should('exist');
                cy.data('last_inspection_panel-header-mismatch-icon').should('exist');
                cy.data('last_inspection_panel').within(() => {
                    cy.data('last_inspection_panel-expand-button')
                        .should('have.attr', 'aria-expanded', 'false')
                        .click();
                    cy.data('last_inspection_panel-expand-button').should('have.attr', 'aria-expanded', 'true');
                    cy.contains('CURRENT');
                    cy.contains('Locations do not match');
                });
                // make locations match
                selectLocation({ site: 'St Lucia', building: 'Forgan Smith Building', floor: '2', room: 'W212' });
                cy.data('last_inspection_panel-header-mismatch-icon').should('not.exist');
                cy.data('last_inspection_panel').within(() => {
                    cy.contains('Locations do not match').should('not.exist');
                });
            });

            it('should show failed Previous Inspection panel', () => {
                cy.data('asset_type_selector-asset-panel-input').should('be.disabled');
                cy.data('asset_selector-asset-panel-input').type('UQL20000');
                cy.wait(2000);
                // only 1 item should match and should be auto selected
                cy.data('asset_selector-asset-panel-input').should('have.value', 'UQL200000');
                cy.data('last_inspection_panel')
                    .should('not.be.disabled')
                    .and('have.css', 'border-color', 'rgb(149, 17, 38)');
                cy.data('last_inspection_panel-header-fail-chip').should('exist');
                cy.data('last_inspection_panel-header-mismatch-icon').should('exist');
                cy.data('last_inspection_panel').within(() => {
                    cy.data('last_inspection_panel-expand-button')
                        .should('have.attr', 'aria-expanded', 'false')
                        .click();
                    cy.data('last_inspection_panel-expand-button').should('have.attr', 'aria-expanded', 'true');
                    cy.contains('OUTFORREPAIR');
                    cy.contains('Locations do not match');
                });
                // make locations match
                selectLocation({ site: 'St Lucia', building: 'Forgan Smith Building', floor: '2', room: 'W212' });
                cy.data('last_inspection_panel-header-mismatch-icon').should('not.exist');
                cy.data('last_inspection_panel').within(() => {
                    cy.contains('Locations do not match').should('not.exist');
                });
            });

            it('should show DISCARDED Previous Inspection panel', () => {
                cy.data('asset_type_selector-asset-panel-input').should('be.disabled');
                cy.data('asset_selector-asset-panel-input').type('UQL300000');
                cy.wait(2000);
                // only 1 item should match and should be auto selected
                cy.data('asset_selector-asset-panel-input').should('have.value', 'UQL300000');
                cy.data('last_inspection_panel')
                    .should('not.be.disabled')
                    .and('have.css', 'border-color', 'rgb(0, 114, 0)');
                cy.data('last_inspection_panel-header-pass-chip').should('exist');
                cy.data('last_inspection_panel').within(() => {
                    cy.data('last_inspection_panel-expand-button').should('have.attr', 'aria-expanded', 'true'); // inspection auto expands
                    cy.contains('DISCARDED');
                    cy.contains('Locations do not match');
                });
                cy.data('inspection_panel').should('not.exist');
                cy.data('inspection-save-button').should('be.disabled');
                cy.data('inspection-reset-button').click(); // reset form
                cy.data('inspection_panel').should('exist');
                cy.data('last_inspection_panel-expand-button').should('have.attr', 'aria-expanded', 'false');
            });
        });

        describe('Inspection panel functionality', () => {
            it('should allow entry of inspection details', () => {
                cy.data('inspection_panel-inspection-result-passed-button').should('be.disabled');
                cy.data('inspection_panel-inspection-result-failed-button').should('be.disabled');
                selectAssetId('NEW ASSET');
                selectAssetType('PowerBoard');

                cy.data('inspection_panel-inspection-result-passed-button').should('not.be.disabled');
                cy.data('inspection_panel-inspection-result-failed-button').should('not.be.disabled');
                cy.data('inspection_panel-inspection-device-select').click();
                selectListbox('AV 025');
                cy.data('inspection_panel-inspection-device-select').should('contain', 'AV 025');
                cy.data('inspection_panel-inspection-result-passed-button').click();

                const today = moment();

                const plus3months = locale.pages.inspect.form.inspection.nextTestDateFormatted(
                    moment(today, locale.pages.inspect.config.dateFormat)
                        .add(3, 'months')
                        .format(locale.pages.inspect.config.dateFormatDisplay),
                );
                const plus6months = locale.pages.inspect.form.inspection.nextTestDateFormatted(
                    moment(today, locale.pages.inspect.config.dateFormat)
                        .add(6, 'months')
                        .format(locale.pages.inspect.config.dateFormatDisplay),
                );
                const plus12months = locale.pages.inspect.form.inspection.nextTestDateFormatted(
                    moment(today, locale.pages.inspect.config.dateFormat)
                        .add(12, 'months')
                        .format(locale.pages.inspect.config.dateFormatDisplay),
                );
                const plus60months = locale.pages.inspect.form.inspection.nextTestDateFormatted(
                    moment(today, locale.pages.inspect.config.dateFormat)
                        .add(60, 'months')
                        .format(locale.pages.inspect.config.dateFormatDisplay),
                );

                cy.data('months_selector-inspection-panel-select').should('exist');
                cy.data('months_selector-inspection-panel-next-date-label').should('contain', plus12months); // default 12 months
                // 3 months
                cy.data('months_selector-inspection-panel-select').click();
                selectListbox('3 months');
                cy.data('months_selector-inspection-panel-next-date-label').should('contain', plus3months);
                // 6 months
                cy.data('months_selector-inspection-panel-select').click();
                selectListbox('6 months');
                cy.data('months_selector-inspection-panel-next-date-label').should('contain', plus6months);
                // 5 years
                cy.data('months_selector-inspection-panel-select').click();
                selectListbox('5 years');
                cy.data('months_selector-inspection-panel-next-date-label').should('contain', plus60months);

                cy.data('inspection_panel-inspection-notes-input').type('Test notes');

                cy.data('inspection_panel-inspection-result-failed-button').click();
                cy.data('months_selector-inspection-panel-select').should('not.exist');
                cy.data('inspection_panel-fail-reason-input').should('exist');
                cy.data('inspection_panel-fail-reason-input').type('failed reason');

                cy.data('inspection-reset-button').click();
                cy.data('inspection_panel-inspection-result-passed-button').should('be.disabled');
                cy.data('inspection_panel-inspection-result-failed-button').should('be.disabled');
            });

            it('should show error for a PASS inspection if visual device is selected', () => {
                cy.data('inspection_panel-inspection-result-passed-button').should('be.disabled');
                cy.data('inspection_panel-inspection-result-failed-button').should('be.disabled');
                selectAssetId('NEW ASSET');
                selectAssetType('PowerBoard');

                cy.data('inspection_panel-inspection-result-passed-button').should('not.be.disabled');
                cy.data('inspection_panel-inspection-result-failed-button').should('not.be.disabled');
                cy.data('inspection_panel-inspection-device-select').click();
                selectListbox('Visual Inspection');
                cy.data('inspection_panel-inspection-device-select').should('contain', 'Visual Inspection');
                cy.data('inspection_panel-inspection-device-validation-text').should('not.exist');
                cy.data('inspection_panel-inspection-result-passed-button').click();
                cy.data('inspection_panel-inspection-device-validation-text')
                    .should('exist')
                    .should('contain', 'Visual Inspection can not be used for a PASS test');
                cy.data('inspection_panel-inspection-result-failed-button').click();
                cy.data('inspection_panel-inspection-device-validation-text').should('not.exist');
                cy.data('inspection_panel-inspection-result-passed-button').click();
                cy.data('inspection_panel-inspection-device-validation-text')
                    .should('exist')
                    .should('contain', 'Visual Inspection can not be used for a PASS test');
                cy.data('inspection_panel-inspection-device-select').click();
                selectListbox('AV 025');
                cy.data('inspection_panel-inspection-device-validation-text').should('not.exist');
            });
        });

        describe('Action panel functionality', () => {
            it('should allow enter of repair/discard details', () => {
                selectAssetId('NEW ASSET');
                selectAssetType('PowerBoard');
                cy.data('inspection_panel-inspection-result-passed-button').click();
                cy.data('action_panel-repair-tab-button').should('be.disabled');
                cy.data('action_panel-discard-tab-button').should('not.be.disabled');
                cy.data('inspection_panel-inspection-result-failed-button').click();
                cy.data('action_panel-repair-tab-button').should('not.be.disabled');
                cy.data('action_panel-discard-tab-button').should('not.be.disabled');

                cy.data('asset_selector-asset-panel-input').type('UQL310000'); // last inspection = passed
                cy.wait(2000);
                cy.data('asset_selector-asset-panel-input').should('have.value', 'UQL310000');
                cy.data('action_panel-repair-tab-button').should('be.disabled'); // shouldnt be able to send for repair
                cy.data('action_panel-discard-tab-button').should('not.be.disabled');

                cy.data('asset_selector-asset-panel-input')
                    // need 2 clears because the first only clears the asset lists returned
                    // by the last search. second clear actually empties the input
                    .clear()
                    .clear()
                    .type('UQL20000'); // last inspection = failed
                cy.wait(2000);
                cy.data('asset_selector-asset-panel-input').should('have.value', 'UQL200000');
                cy.data('action_panel-repair-tab-button').should('not.be.disabled'); // failed should be able send for repair
                cy.data('action_panel-discard-tab-button').should('not.be.disabled');

                cy.data('action_panel-discard-reason-input').should('be.disabled');
                cy.data('action_panel-is-discard-select').click();
                selectListbox('YES');
                cy.data('action_panel-repair-tab-button').should('be.disabled'); // can only enter details for one tab at a time
                cy.data('action_panel-discard-reason-input').should('not.be.disabled');
                cy.data('action_panel-discard-reason-input').type('Discard reason');
                cy.data('action_panel-is-discard-select').click();
                selectListbox('NO');
                cy.data('action_panel-repair-tab-button').should('not.be.disabled'); // can only enter details for one tab at a time

                cy.data('action_panel-repair-tab-button').click();
                cy.data('action_panel-is-repair-select').click();
                selectListbox('YES');
                cy.data('action_panel-discard-tab-button').should('be.disabled'); // can only enter details for one tab at a time
                cy.data('action_panel-repairer-details-input').should('exist');
                cy.data('action_panel-repairer-details-input').should('not.be.disabled');
                cy.data('action_panel-repairer-details-input').type('Repair reason');

                cy.data('inspection_panel-inspection-result-passed-button').click(); // can't allow repair option if test passes
                cy.data('action_panel-repair-tab-button').should('be.disabled'); // make sure repair tab disables
                cy.data('action_panel-discard-tab-button').should('not.be.disabled'); // discard tab should be enabled and auto selected
                cy.data('action_panel-discard-tab-button').should('have.class', 'Mui-selected'); // check it is selected

                cy.data('inspection-reset-button').click();
                cy.data('action_panel-repair-tab-button').should('be.disabled');
                cy.data('action_panel-discard-tab-button').should('be.disabled');
            });
        });

        describe('saving values', () => {
            it('should enable save button and show active saved message', () => {
                cy.data('inspection-save-button').should('be.disabled');
                cy.data('location_picker-event-panel-site-input').should('have.value', 'St Lucia');
                selectLocation({ building: 'Forgan Smith Building', floor: '2', room: 'W212' });
                selectAssetId('NEW ASSET');
                selectAssetType('PowerBoard');
                selectTestingDevice('ITS-PAT-06');
                cy.data('inspection_panel-inspection-result-passed-button').click();
                cy.data('inspection_panel-inspection-notes-input').type('Test notes');
                cy.data('inspection-save-button').should('not.be.disabled');
                cy.data('inspection-save-button').click();
                cy.wait(2000);
                cy.get('[role=presentation]').within(() => {
                    cy.contains('Asset saved');
                    cy.contains('UQL000298');
                    cy.data('confirm-inspection-save-success').click();
                });

                cy.data('asset_selector-asset-panel-input').should('have.value', '');
            });
        });
    };

    describe('Desktop', () => {
        beforeEach(() => {
            cy.viewport(1300, 1000);
        });

        runAllTests();
    });

    // describe('Mobile', () => {
    //     beforeEach(() => {
    //         cy.viewport(320, 480);
    //     });

    //     runAllTests();
    // });
});
