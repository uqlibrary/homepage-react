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
        cy.data('asset_selector-testntagFormAssetId-input').click();
        selectListbox(pattern);
        cy.data('asset_selector-testntagFormAssetId-input').should('have.value', pattern);
    };
    const selectTestingDevice = pattern => {
        cy.data('testResultTestingDevice').click();
        selectListbox(pattern);
        cy.data('testResultTestingDevice').should('contain', pattern);
    };
    const selectAssetType = pattern => {
        cy.data('testntagFormAssetTypeInput').should('not.be.disabled');
        cy.data('testntagFormAssetTypeInput').click();
        selectListbox(pattern);
        cy.data('testntagFormAssetTypeInput').should('have.value', pattern);
    };
    const selectLocation = ({ site, building, floor, room }) => {
        // Site
        if (!!site) {
            cy.data('location_picker-eventPanel-site').click();
            selectListbox(site);
        }
        if (!!building) {
            // Building
            cy.data('location_picker-eventPanel-building').click();
            selectListbox(building);

            !!floor && cy.wait(1500);
        }

        // Floor
        if (!!floor) {
            cy.data('location_picker-eventPanel-floor').click();
            selectListbox(floor);
            !!room && cy.wait(1500);
        }

        // Room
        if (!!room) {
            cy.data('location_picker-eventPanel-room').click();
            selectListbox(room);
        }
    };

    const runAllTests = () => {
        it('page is accessible', () => {
            cy.injectAxe();
            cy.viewport(1300, 1000);
            cy.get('h1').contains('UQ Asset Test and Tag');
            cy.get('h2').contains('Managing Assets for Library');
            cy.waitUntil(() => cy.data('location_picker-eventPanel-site-input').should('have.value', 'St Lucia'));
            cy.wait(1000);
            cy.checkA11y('[data-testid="StandardPage"]', {
                reportName: 'Test and Tag Inspection Form',
                scopeName: 'Content',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            });
        });
        describe('Event panel functionality', () => {
            const today = moment();
            it('should show correct dates', () => {
                cy.data('testntag-form-event-date').should(
                    'have.value',
                    today.format(locale.pages.inspect.config.dateFormatNoTime),
                );
            });

            it('should allow entry of new date', () => {
                const invalidDate = today.add(1, 'day').format(locale.pages.inspect.config.dateFormatNoTime);
                const validDate = today.subtract(1, 'day').format(locale.pages.inspect.config.dateFormatNoTime);
                cy.data('testntag-form-event-date-button').click();
                cy.get('[role="dialog"]').should('exist');
                cy.get('button')
                    .contains('Cancel')
                    .parent()
                    .click();
                cy.get('[role="dialog"]').should('not.exist');

                cy.data('testntag-form-event-date').clear();
                cy.data('testntag-form-event-date').type(invalidDate);
                cy.get('#testntag-form-event-date-helper-text').contains('Date should not be after maximal date');
                cy.data('testntag-form-event-date').clear();
                cy.data('testntag-form-event-date').type(validDate);
                cy.get('#testntag-form-event-date-helper-text').should('not.exist');
            });

            it('should allow selection of location', () => {
                // Site
                cy.data('location_picker-eventPanel-site-input').should('have.value', 'St Lucia');
                cy.data('location_picker-eventPanel-site').click();
                cy.get('#location_picker-eventPanel-site-option-1').click();
                cy.data('location_picker-eventPanel-site-input').should('have.value', 'Gatton');

                // Building
                cy.data('location_picker-eventPanel-building').click();
                cy.get('#location_picker-eventPanel-building-option-0').click();
                cy.data('location_picker-eventPanel-building-input').should('have.value', 'J.K. Murray Library');

                // Floor
                cy.wait(1500);
                cy.data('location_picker-eventPanel-floor').click();
                cy.get('#location_picker-eventPanel-floor-option-0').click();
                cy.data('location_picker-eventPanel-floor-input').should('have.value', '1');

                // Room
                cy.wait(1500);
                cy.data('location_picker-eventPanel-room').click();
                cy.get('#location_picker-eventPanel-room-option-0').click();
                cy.data('location_picker-eventPanel-room-input').should('have.value', '101');

                // Reset by changing site
                cy.data('location_picker-eventPanel-site').click();
                cy.get('#location_picker-eventPanel-site-option-0').click();
                cy.data('location_picker-eventPanel-site-input').should('have.value', 'St Lucia');
                cy.data('location_picker-eventPanel-building-input').should('not.have.value', 'J.K. Murray Library');
                cy.data('location_picker-eventPanel-floor-input').should('not.have.value', '1');
                cy.data('location_picker-eventPanel-room-input').should('not.have.value', '101');
            });

            it('should reset location when fields change', () => {
                cy.data('location_picker-eventPanel-site-input').should('have.value', 'St Lucia');
                // set location so that we can test it clears later
                selectLocation({ building: 'Forgan Smith Building', floor: '2', room: 'W212' });
                cy.data('location_picker-eventPanel-site-input').should('have.value', 'St Lucia');
                cy.data('location_picker-eventPanel-building-input').should('have.value', 'Forgan Smith Building');
                cy.data('location_picker-eventPanel-floor-input').should('have.value', '2');
                cy.data('location_picker-eventPanel-room-input').should('have.value', 'W212');
                selectLocation({ floor: '3' });
                cy.data('location_picker-eventPanel-site-input').should('have.value', 'St Lucia');
                cy.data('location_picker-eventPanel-building-input').should('have.value', 'Forgan Smith Building');
                cy.data('location_picker-eventPanel-floor-input').should('have.value', '3');
                cy.data('location_picker-eventPanel-room-input').should('have.value', '');
                selectLocation({ building: 'Duhig' });
                cy.data('location_picker-eventPanel-site-input').should('have.value', 'St Lucia');
                cy.data('location_picker-eventPanel-building-input').should('have.value', 'Duhig Tower');
                cy.data('location_picker-eventPanel-floor-input').should('have.value', '');
                cy.data('location_picker-eventPanel-room-input').should('have.value', '');
                selectLocation({ site: 'Gatton' });
                cy.data('location_picker-eventPanel-site-input').should('have.value', 'Gatton');
                cy.data('location_picker-eventPanel-building-input').should('have.value', '');
                cy.data('location_picker-eventPanel-floor-input').should('have.value', '');
                cy.data('location_picker-eventPanel-room-input').should('have.value', '');
            });
        });

        describe('Asset panel functionality', () => {
            it('should allow entry of new asset IDs (temporary)', () => {
                cy.data('location_picker-eventPanel-site-input').should('have.value', 'St Lucia');
                // this is for code coverage. Will be removed post MVP
                cy.data('asset_selector-testntagFormAssetId-input').click();
                cy.data('asset_selector-testntagFormAssetId-input').type('AN ASSET ID{enter}');
                cy.data('asset_selector-testntagFormAssetId-input').should('have.value', 'AN ASSET ID');
                cy.data('testntagFormAssetTypeInput').should('not.be.disabled');
            });
            it('should allow auto complete of asset ID as mask', () => {
                cy.data('location_picker-eventPanel-site-input').should('have.value', 'St Lucia');
                // Enter partial asset ID for mask search
                cy.data('asset_selector-testntagFormAssetId-input').click();
                cy.data('asset_selector-testntagFormAssetId-input').type('123');
                cy.wait(3000);
                // Asset found
                cy.data('lastInspectionFailChip').should('exist');
            });
            it('should restrict length of asset IDs', () => {
                const initialText = 'ABCDEFGHIJKLMNOP'; // not a long enough text
                const croppedText = 'ABCDEFGHIJKL';
                // this is for code coverage. Will be removed post MVP
                cy.data('asset_selector-testntagFormAssetId-input').click();
                cy.data('asset_selector-testntagFormAssetId-input').type(`${initialText}{enter}`);
                cy.data('asset_selector-testntagFormAssetId-input').should('have.value', croppedText);
            });
            it('should allow selection of new asset and type', () => {
                cy.data('testntagFormAssetTypeInput').should('be.disabled');
                cy.data('asset_selector-testntagFormAssetId-input').click();
                cy.get('#asset_selector-testntagFormAssetId-option-0').should('exist');
                cy.get('#asset_selector-testntagFormAssetId-option-0').click();
                cy.data('asset_selector-testntagFormAssetId-input').should('have.value', 'NEW ASSET');
                cy.data('testntagFormAssetTypeInput').should('not.be.disabled');
                // select asset type
                selectAssetType('PowerBoard');
            });
            it('should allow creation of new asset type', () => {
                cy.data('testntagFormAssetTypeInput').should('be.disabled');
                cy.data('asset_selector-testntagFormAssetId-input').click();
                cy.get('#asset_selector-testntagFormAssetId-option-0').should('exist');
                cy.get('#asset_selector-testntagFormAssetId-option-0').click();
                cy.data('asset_selector-testntagFormAssetId-input').should('have.value', 'NEW ASSET');
                cy.data('testntagFormAssetTypeInput').should('not.be.disabled');

                cy.data('testntagFormAssetTypeInput')
                    .should('not.be.disabled')
                    .click();
                selectListbox('Add new asset type');
                // popup has loaded as it has header
                cy.get('[data-testid="asset_type_name_field"] label').should('contain', 'Asset type name');
                cy.data('testntagAssetTypeSubmitButton').should('be.disabled');
                cy.get('[data-testid="asset_type_name_field"] input').type('an asset type');

                // the popup is accessible
                cy.injectAxe();
                cy.checkA11y('[data-testid="StandardPage"]', {
                    reportName: 'Test and Tag Asset Type Creation Popup',
                    scopeName: 'Content',
                    includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
                });

                cy.data('testntagAssetTypeSubmitButton')
                    .should('not.be.disabled')
                    .should('contain', 'SAVE')
                    .click();
                // the user is acknowledged that the asset type was saved
                cy.waitUntil(() =>
                    cy
                        .data('dialogbox-tnt-assettype-add-confirmation')
                        // .find('message-title')
                        .should('contain', 'The asset type has been added'),
                );

                // click ok on the notice and both dialogs go away
                cy.data('tntAssetTypeAddDialog').should('exist');
                cy.data('confirm-tnt-assettype-add-confirmation')
                    .should('exist')
                    .click();
                cy.data('confirm-tnt-assettype-add-confirmation').should('not.exist');
                cy.data('tntAssetTypeAddDialog').should('not.exist');
            });
            it('should allow selection of existing asset', () => {
                cy.data('testntagFormAssetTypeInput').should('be.disabled');
                cy.data('asset_selector-testntagFormAssetId-input').type('UQL3100');
                cy.wait(3000);
                cy.get('#asset_selector-testntagFormAssetId-option-0').contains('UQL31000');
                cy.get('#asset_selector-testntagFormAssetId-option-0').click();
                cy.data('asset_selector-testntagFormAssetId-input').should('have.value', 'UQL310000');
                cy.data('testntagFormAssetTypeInput').should('not.be.disabled');
                cy.data('testntagFormAssetTypeInput').should('have.value', 'Power Cord - C13');
            });

            it('should show PASSED Previous Inspection panel', () => {
                cy.data('testntagFormAssetTypeInput').should('be.disabled');
                cy.data('asset_selector-testntagFormAssetId-input').type('UQL3100');
                cy.wait(3000);
                cy.get('#asset_selector-testntagFormAssetId-option-0').click();
                cy.data('asset_selector-testntagFormAssetId-input').should('have.value', 'UQL310000');
                cy.data('lastInspectionPanel')
                    .should('not.be.disabled')
                    .and('have.css', 'border-color', 'rgb(0, 114, 0)');
                cy.data('lastInspectionPassChip').should('exist');
                cy.data('lastInspectionLocationMismatch').should('exist');
                cy.data('lastInspectionPanel').within(() => {
                    cy.data('headerExpandButton')
                        .should('have.attr', 'aria-expanded', 'false')
                        .click();
                    cy.data('headerExpandButton').should('have.attr', 'aria-expanded', 'true');
                    cy.contains('CURRENT');
                    cy.contains('Locations do not match');
                });
                // make locations match
                selectLocation({ site: 'St Lucia', building: 'Forgan Smith Building', floor: '2', room: 'W212' });
                cy.data('lastInspectionLocationMismatch').should('not.exist');
                cy.data('lastInspectionPanel').within(() => {
                    cy.contains('Locations do not match').should('not.exist');
                });
            });

            it('should show FAILED Previous Inspection panel', () => {
                cy.data('testntagFormAssetTypeInput').should('be.disabled');
                cy.data('asset_selector-testntagFormAssetId-input').type('UQL20000');
                cy.wait(2000);
                // only 1 item should match and should be auto selected
                cy.data('asset_selector-testntagFormAssetId-input').should('have.value', 'UQL200000');
                cy.data('lastInspectionPanel')
                    .should('not.be.disabled')
                    .and('have.css', 'border-color', 'rgb(149, 17, 38)');
                cy.data('lastInspectionFailChip').should('exist');
                cy.data('lastInspectionLocationMismatch').should('exist');
                cy.data('lastInspectionPanel').within(() => {
                    cy.data('headerExpandButton')
                        .should('have.attr', 'aria-expanded', 'false')
                        .click();
                    cy.data('headerExpandButton').should('have.attr', 'aria-expanded', 'true');
                    cy.contains('OUTFORREPAIR');
                    cy.contains('Locations do not match');
                });
                // make locations match
                selectLocation({ site: 'St Lucia', building: 'Forgan Smith Building', floor: '2', room: 'W212' });
                cy.data('lastInspectionLocationMismatch').should('not.exist');
                cy.data('lastInspectionPanel').within(() => {
                    cy.contains('Locations do not match').should('not.exist');
                });
            });

            it('should show DISCARDED Previous Inspection panel', () => {
                cy.data('testntagFormAssetTypeInput').should('be.disabled');
                cy.data('asset_selector-testntagFormAssetId-input').type('UQL300000');
                cy.wait(2000);
                // only 1 item should match and should be auto selected
                cy.data('asset_selector-testntagFormAssetId-input').should('have.value', 'UQL300000');
                cy.data('lastInspectionPanel')
                    .should('not.be.disabled')
                    .and('have.css', 'border-color', 'rgb(0, 114, 0)');
                cy.data('lastInspectionPassChip').should('exist');
                cy.data('lastInspectionPanel').within(() => {
                    cy.data('headerExpandButton').should('have.attr', 'aria-expanded', 'true'); // inspection auto expands
                    cy.contains('DISCARDED');
                    cy.contains('Locations do not match');
                });
                cy.data('standard-card-inspection').should('not.exist');
                cy.data('testntagFormSubmitButton').should('be.disabled');
                cy.data('testntagFormResetButton').click(); // reset form
                cy.data('standard-card-inspection').should('exist');
                cy.data('headerExpandButton').should('have.attr', 'aria-expanded', 'false');
            });
        });

        describe('Inspection panel functionality', () => {
            it('should allow entry of inspection details', () => {
                cy.data('testResultToggleButtons-PASSED').should('be.disabled');
                cy.data('testResultToggleButtons-FAILED').should('be.disabled');
                selectAssetId('NEW ASSET');
                selectAssetType('PowerBoard');

                cy.data('testResultToggleButtons-PASSED').should('not.be.disabled');
                cy.data('testResultToggleButtons-FAILED').should('not.be.disabled');
                cy.data('testResultTestingDevice').click();
                selectListbox('AV 025');
                cy.data('testResultTestingDevice').should('contain', 'AV 025');
                cy.data('testResultToggleButtons-PASSED').click();

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

                cy.data('months_selector-testResultNextDate').should('exist');
                cy.data('months_selector-testResultNextDate-next-date-label').should('contain', plus12months); // default 12 months
                // 3 months
                cy.data('months_selector-testResultNextDate').click();
                selectListbox('3 months');
                cy.data('months_selector-testResultNextDate-next-date-label').should('contain', plus3months);
                // 6 months
                cy.data('months_selector-testResultNextDate').click();
                selectListbox('6 months');
                cy.data('months_selector-testResultNextDate-next-date-label').should('contain', plus6months);
                // 5 years
                cy.data('months_selector-testResultNextDate').click();
                selectListbox('5 years');
                cy.data('months_selector-testResultNextDate-next-date-label').should('contain', plus60months);

                cy.data('inspectionNotes-input').type('Test notes');

                cy.data('testResultToggleButtons-FAILED').click();
                cy.data('months_selector-testResultNextDate').should('not.exist');
                cy.data('inspectionFailReason-input').should('exist');
                cy.data('inspectionFailReason-input').type('Failed reason');

                cy.data('testntagFormResetButton').click();
                cy.data('testResultToggleButtons-PASSED').should('be.disabled');
                cy.data('testResultToggleButtons-FAILED').should('be.disabled');
            });
        });

        describe('Action panel functionality', () => {
            it('should allow enter of repair/discard details', () => {
                selectAssetId('NEW ASSET');
                selectAssetType('PowerBoard');
                cy.data('testResultToggleButtons-PASSED').click();
                cy.data('tab-repair').should('be.disabled');
                cy.data('tab-discard').should('not.be.disabled');
                cy.data('testResultToggleButtons-FAILED').click();
                cy.data('tab-repair').should('not.be.disabled');
                cy.data('tab-discard').should('not.be.disabled');

                cy.data('asset_selector-testntagFormAssetId-input').type('UQL310000'); // last inspection = passed
                cy.wait(2000);
                cy.data('asset_selector-testntagFormAssetId-input').should('have.value', 'UQL310000');
                cy.data('tab-repair').should('be.disabled'); // shouldnt be able to send for repair
                cy.data('tab-discard').should('not.be.disabled');

                cy.data('asset_selector-testntagFormAssetId-input')
                    // need 2 clears because the first only clears the asset lists returned
                    // by the last search. second clear actually empties the input
                    .clear()
                    .clear()
                    .type('UQL20000'); // last inspection = failed
                cy.wait(2000);
                cy.data('asset_selector-testntagFormAssetId-input').should('have.value', 'UQL200000');
                cy.data('tab-repair').should('not.be.disabled'); // failed should be able send for repair
                cy.data('tab-discard').should('not.be.disabled');

                cy.data('discardReason-input').should('be.disabled');
                cy.data('selectIsDiscarded').click();
                selectListbox('YES');
                cy.data('tab-repair').should('be.disabled'); // can only enter details for one tab at a time
                cy.data('discardReason-input').should('not.be.disabled');
                cy.data('discardReason-input').type('Discard reason');
                cy.data('selectIsDiscarded').click();
                selectListbox('NO');
                cy.data('tab-repair').should('not.be.disabled'); // can only enter details for one tab at a time

                cy.data('tab-repair').click();
                cy.data('selectIsRepair').click();
                selectListbox('YES');
                cy.data('tab-discard').should('be.disabled'); // can only enter details for one tab at a time
                cy.data('repairerDetails-input').should('exist');
                cy.data('repairerDetails-input').should('not.be.disabled');
                cy.data('repairerDetails-input').type('Repair reason');

                cy.data('testResultToggleButtons-PASSED').click(); // can't allow repair option if test passes
                cy.data('tab-repair').should('be.disabled'); // make sure repair tab disables
                cy.data('tab-discard').should('not.be.disabled'); // discard tab should be enabled and auto selected
                cy.data('tab-discard').should('have.class', 'Mui-selected'); // check it is selected

                cy.data('testntagFormResetButton').click();
                cy.data('tab-repair').should('be.disabled');
                cy.data('tab-discard').should('be.disabled');
            });
        });

        describe('saving values', () => {
            it('should enable save button and show saved message', () => {
                cy.data('testntagFormSubmitButton').should('be.disabled');
                cy.data('location_picker-eventPanel-site-input').should('have.value', 'St Lucia');
                selectLocation({ building: 'Forgan Smith Building', floor: '2', room: 'W212' });
                selectAssetId('NEW ASSET');
                selectAssetType('PowerBoard');
                selectTestingDevice('ITS-PAT-06');
                cy.data('testResultToggleButtons-PASSED').click();
                cy.data('inspectionNotes-input').type('Test notes');
                cy.data('testntagFormSubmitButton').should('not.be.disabled');
                cy.data('testntagFormSubmitButton').click();
                cy.wait(2000);
                cy.get('[role=presentation]').within(() => {
                    cy.contains('Asset saved');
                    cy.contains('UQL000298');
                    cy.data('confirm-testTag-save-succeeded').click();
                });

                cy.data('asset_selector-testntagFormAssetId-input').should('have.value', '');
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
