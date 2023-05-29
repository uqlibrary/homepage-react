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
        cy.data('testntagFormAssetIdInput').click();
        selectListbox(pattern);
        cy.data('testntagFormAssetIdInput').should('have.value', pattern);
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
            cy.data('testntag-form-siteid').click();
            selectListbox(site);
        }
        if (!!building) {
            // Building
            cy.data('testntag-form-buildingid').click();
            selectListbox(building);

            !!floor && cy.wait(1500);
        }

        // Floor
        if (!!floor) {
            cy.data('testntag-form-floorid').click();
            selectListbox(floor);
            !!room && cy.wait(1500);
        }

        // Room
        if (!!room) {
            cy.data('testntag-form-roomid').click();
            selectListbox(room);
        }
    };

    it('page is accessible', () => {
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('h1').contains('UQ Asset Test and Tag');
        cy.get('h2').contains('Managing Assets for Library');
        cy.waitUntil(() => cy.data('testntag-form-siteid').should('contain', 'St Lucia'));
        cy.wait(1000);
        cy.checkA11y('[data-testid="StandardPage"]', {
            reportName: 'Test and Tag Inspection Form',
            scopeName: 'Content',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
    });

    const runAllTests = () => {
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
                cy.data('testntag-form-siteid').should('contain', 'St Lucia');
                cy.data('testntag-form-siteid').click();
                cy.get('[data-testid="testntag-form-siteid-site.site_id-2"]').click();
                cy.data('testntag-form-siteid').should('contain', 'Gatton');

                // Building
                cy.data('testntag-form-buildingid').click();
                cy.get('#testntag-form-buildingid-option-0').click();
                cy.data('testntag-form-buildingid-input').should('have.value', '8102 - J.K. Murray Library');

                // Floor
                cy.wait(1500);
                cy.data('testntag-form-floorid').click();
                cy.get('#testntag-form-floorid-option-0').click();
                cy.data('testntag-form-floorid-input').should('have.value', '1');

                // Room
                cy.wait(1500);
                cy.data('testntag-form-roomid').click();
                cy.get('#testntag-form-roomid-option-0').click();
                cy.data('testntag-form-roomid-input').should('have.value', '101');

                // Reset by changing site
                cy.data('testntag-form-siteid').click();
                cy.get('[data-testid="testntag-form-siteid-site.site_id-1"]').click();
                cy.data('testntag-form-siteid').should('contain', 'St Lucia');
                cy.data('testntag-form-buildingid-input').should('not.have.value', '8102 - J.K. Murray Library');
                cy.data('testntag-form-floorid-input').should('not.have.value', '1');
                cy.data('testntag-form-roomid-input').should('not.have.value', '101');
            });

            it('should reset location when fields change', () => {
                cy.data('testntag-form-siteid').should('contain', 'St Lucia');
                // set location so that we can test it clears later
                selectLocation({ building: 'Forgan Smith Building', floor: '2', room: 'W212' });
                cy.data('testntag-form-siteid').should('contain', 'St Lucia');
                cy.data('testntag-form-buildingid-input').should('have.value', '0001 - Forgan Smith Building');
                cy.data('testntag-form-floorid-input').should('have.value', '2');
                cy.data('testntag-form-roomid-input').should('have.value', 'W212');
                selectLocation({ floor: '3' });
                cy.data('testntag-form-siteid').should('contain', 'St Lucia');
                cy.data('testntag-form-buildingid-input').should('have.value', '0001 - Forgan Smith Building');
                cy.data('testntag-form-floorid-input').should('have.value', '3');
                cy.data('testntag-form-roomid-input').should('have.value', '');
                selectLocation({ building: 'Duhig' });
                cy.data('testntag-form-siteid').should('contain', 'St Lucia');
                cy.data('testntag-form-buildingid-input').should('have.value', '0002 - Duhig Tower');
                cy.data('testntag-form-floorid-input').should('have.value', '');
                cy.data('testntag-form-roomid-input').should('have.value', '');
                selectLocation({ site: 'Gatton' });
                cy.data('testntag-form-siteid').should('contain', 'Gatton');
                cy.data('testntag-form-buildingid-input').should('have.value', '');
                cy.data('testntag-form-floorid-input').should('have.value', '');
                cy.data('testntag-form-roomid-input').should('have.value', '');
            });
        });

        describe('Asset panel functionality', () => {
            it('should allow entry of new asset IDs (temporary)', () => {
                cy.data('testntag-form-siteid').should('contain', 'St Lucia');
                // this is for code coverage. Will be removed post MVP
                cy.data('testntagFormAssetIdInput').click();
                cy.data('testntagFormAssetIdInput').type('AN ASSET ID{enter}');
                cy.data('testntagFormAssetIdInput').should('have.value', 'AN ASSET ID');
                cy.data('testntagFormAssetTypeInput').should('not.be.disabled');
            });
            it('should allow auto complete of asset ID as mask', () => {
                cy.data('testntag-form-siteid').should('contain', 'St Lucia');
                // Enter partial asset ID for mask search
                cy.data('testntagFormAssetIdInput').click();
                cy.data('testntagFormAssetIdInput').type('123');
                cy.wait(3000);
                // Asset found
                cy.data('lastInspectionFailChip').should('exist');
            });
            it('should restrict length of asset IDs', () => {
                const initialText = 'ABCDEFGHIJKLMNOP'; // not a long enough text
                const croppedText = 'ABCDEFGHIJKL';
                // this is for code coverage. Will be removed post MVP
                cy.data('testntagFormAssetIdInput').click();
                cy.data('testntagFormAssetIdInput').type(`${initialText}{enter}`);
                cy.data('testntagFormAssetIdInput').should('have.value', croppedText);
            });
            it('should allow selection of new asset and type', () => {
                cy.data('testntagFormAssetTypeInput').should('be.disabled');
                cy.data('testntagFormAssetIdInput').click();
                cy.get('#testntagFormAssetId-option-0').should('exist');
                cy.get('#testntagFormAssetId-option-0').click();
                cy.data('testntagFormAssetIdInput').should('have.value', 'NEW ASSET');
                cy.data('testntagFormAssetTypeInput').should('not.be.disabled');
                // select asset type
                selectAssetType('PowerBoard');
            });
            it('should allow selection of existing asset', () => {
                cy.data('testntagFormAssetTypeInput').should('be.disabled');
                cy.data('testntagFormAssetIdInput').type('UQL3100');
                cy.wait(3000);
                cy.get('#testntagFormAssetId-option-0').contains('UQL31000');
                cy.get('#testntagFormAssetId-option-0').click();
                cy.data('testntagFormAssetIdInput').should('have.value', 'UQL310000');
                cy.data('testntagFormAssetTypeInput').should('not.be.disabled');
                cy.data('testntagFormAssetTypeInput').should('have.value', 'Power Cord - C13');
            });

            it('should show PASSED Previous Inspection panel', () => {
                cy.data('testntagFormAssetTypeInput').should('be.disabled');
                cy.data('testntagFormAssetIdInput').type('UQL3100');
                cy.wait(3000);
                cy.get('#testntagFormAssetId-option-0').click();
                cy.data('testntagFormAssetIdInput').should('have.value', 'UQL310000');
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
                cy.data('testntagFormAssetIdInput').type('UQL20000');
                cy.wait(2000);
                // only 1 item should match and should be auto selected
                cy.data('testntagFormAssetIdInput').should('have.value', 'UQL200000');
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
                cy.data('testntagFormAssetIdInput').type('UQL300000');
                cy.wait(2000);
                // only 1 item should match and should be auto selected
                cy.data('testntagFormAssetIdInput').should('have.value', 'UQL300000');
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

                cy.data('testResultNextDate').should('exist');
                cy.data('testResultNextDate-value').should('contain', plus12months); // default 12 months
                // 3 months
                cy.data('testResultNextDate').click();
                selectListbox('3 months');
                cy.data('testResultNextDate-value').should('contain', plus3months);
                // 6 months
                cy.data('testResultNextDate').click();
                selectListbox('6 months');
                cy.data('testResultNextDate-value').should('contain', plus6months);
                // 5 years
                cy.data('testResultNextDate').click();
                selectListbox('5 years');
                cy.data('testResultNextDate-value').should('contain', plus60months);

                cy.data('inspectionNotes-input').type('Test notes');

                cy.data('testResultToggleButtons-FAILED').click();
                cy.data('testResultNextDate').should('not.exist');
                cy.data('inspectionFailReason').should('exist');
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

                cy.data('testntagFormAssetIdInput').type('UQL310000'); // last inspection = passed
                cy.wait(2000);
                cy.data('testntagFormAssetIdInput').should('have.value', 'UQL310000');
                cy.data('tab-repair').should('be.disabled'); // shouldnt be able to send for repair
                cy.data('tab-discard').should('not.be.disabled');

                cy.data('testntagFormAssetIdInput')
                    .clear()
                    .type('UQL20000'); // last inspection = failed
                cy.wait(2000);
                cy.data('testntagFormAssetIdInput').should('have.value', 'UQL200000');
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
                cy.data('testntag-form-siteid').should('contain', 'St Lucia');
                selectLocation({ building: 'Forgan Smith Building', floor: '2', room: 'W212' });
                selectAssetId('NEW ASSET');
                selectAssetType('PowerBoard');
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

                cy.data('testntagFormAssetIdInput').should('have.value', '');
            });
        });
    };

    describe('Desktop', () => {
        beforeEach(() => {
            cy.viewport(1300, 1000);
        });

        runAllTests();
    });

    describe('Mobile', () => {
        beforeEach(() => {
            cy.viewport(320, 480);
        });

        runAllTests();
    });
});
