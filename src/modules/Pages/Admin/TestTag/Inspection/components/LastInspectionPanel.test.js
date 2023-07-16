import React from 'react';
import LastInspectionPanel from './LastInspectionPanel';
import { rtlRender, act, fireEvent } from 'test-utils';

import locale from '../../testTag.locale.js';

const moment = require('moment');

function setup(testProps = {}, renderer = rtlRender) {
    return renderer(<LastInspectionPanel {...testProps} />);
}

describe('LastInspectionPanel Renders component', () => {
    let asset;

    beforeEach(() => {
        asset = {
            asset_id: 100000,
            asset_next_test_due_date: '2027-10-01 00:00',
            asset_status: 'CURRENT',
            last_location: {
                room_id: 1,
                room_id_displayed: 'W111',
                room_id_description: 'Projector Room',
                floor_id: 1,
                floor_id_displayed: '1',
                building_id: 1,
                building_id_displayed: '0001',
                building_name: 'BSL',
                site_id: 1,
                site_id_displayed: '001',
                site_name: 'St Lucia',
            },
            last_inspection: {
                inspect_status: 'PASSED',
                inspect_device_id: 1,
                inspect_device_model_name: 'TESTER 620-1',
                inspect_device_serial_number: 'W309876',
                inspect_device_department: 'UQL_WSS',
                inspect_device_calibrated_date_last: '2016-01-02 00:00',
                inspect_device_calibrated_by_last: 1,
                inspect_device_calibration_due_date: '2022-10-01 00:00',
                inspect_date: '2016-10-01 00:00',
                inspect_fail_reason: 'Fail reason',
                inspect_notes: 'Some notes',
            },
            last_repair: {
                repair_date: '2022-12-14 10:14:00',
                repairer_name: 'Some repair',
            },
            last_discard: {
                discard_date: '2022-12-14 10:14:00',
                discard_reason: 'Some discard',
            },
        };
    });

    const dateFormatPattern = locale.pages.inspect.config.dateFormatDisplay;
    const formLocale = locale.pages.inspect.form.lastInspectionPanel;

    const assertFormText = ({ getByText, asset, disabled = false }) => {
        const title = formLocale.title(disabled ? formLocale.statusUnavailableLabel : '');
        expect(getByText(title.trimEnd())).toBeInTheDocument();
        expect(getByText(asset.asset_status?.toUpperCase() ?? formLocale.statusUnknownLabel)).toBeInTheDocument();
        expect(
            getByText(
                asset.last_inspection.inspect_date &&
                    moment(asset.last_inspection.inspect_date).format(dateFormatPattern),
            ),
        ).toBeInTheDocument();
        expect(
            getByText(`${asset.last_location.site_id_displayed} - ${asset.last_location.site_name}`),
        ).toBeInTheDocument();
        expect(
            getByText(`${asset.last_location.building_id_displayed} - ${asset.last_location.building_name}`),
        ).toBeInTheDocument();
        expect(getByText(asset.last_location.floor_id_displayed)).toBeInTheDocument();
        expect(getByText(asset.last_location.room_id_displayed)).toBeInTheDocument();
        if (asset.last_inspection.inspect_status === 'FAILED') {
            expect(getByText(asset.last_inspection.inspect_fail_reason ?? formLocale.noneLabel)).toBeInTheDocument();
        }
        if (!!asset.last_inspection.inspect_notes) {
            expect(getByText(asset.last_inspection.inspect_notes)).toBeInTheDocument();
        } else {
            // TODO, a better test for None as it may appear via missing inspect_fail_reason too
            expect(getByText(formLocale.noneLabel)).toBeInTheDocument();
        }
        if (asset.last_inspection.inspect_status === 'PASSED') {
            expect(
                getByText(
                    !!asset.asset_next_test_due_date &&
                        moment(asset.asset_next_test_due_date).format(dateFormatPattern),
                ),
            ).toBeInTheDocument();
        }
        expect(getByText(asset.last_repair.repairer_name)).toBeInTheDocument();
        expect(getByText(asset.last_discard.discard_reason)).toBeInTheDocument();
    };

    it('should render disabled panel', () => {
        const currentLocation = {
            site: 1,
            building: 1,
            floor: 1,
            room: 1,
        };
        const { getByText } = setup({
            asset,
            currentLocation,
            dateFormatPattern,
            disabled: true,
            forceOpen: false,
        });
        const disabledTitle = formLocale.title(formLocale.statusUnavailableLabel);
        expect(getByText(disabledTitle)).toBeInTheDocument();
    });

    it('should render PASS panel with mismatch location alert, no notes', () => {
        const currentLocation = {
            site: 2,
            building: 1,
            floor: 1,
            room: 1,
        };
        const testAsset = { ...asset };
        testAsset.last_inspection.inspect_notes = undefined;
        const { getByText, getByTestId } = setup({
            asset: testAsset,
            currentLocation,
            dateFormatPattern, // use defaults for disabled and forceOpen for cc
        });
        expect(getByText(formLocale.alertLocationMismatch)).toBeInTheDocument();
        expect(getByTestId('last_inspection_panel-header-pass-chip')).toBeInTheDocument();

        assertFormText({ getByText, asset: testAsset });
    });

    it('should render Unavailable title if disabled', () => {
        const currentLocation = {
            site: 1,
            building: 1,
            floor: 1,
            room: 1,
        };
        const { getByText } = setup({
            asset,
            currentLocation,
            dateFormatPattern,
            disabled: true,
            forceOpen: false,
        });

        assertFormText({ getByText, asset, disabled: true });
    });

    it('should render Unavailable title if no asset status', () => {
        const testAsset = { ...asset };
        testAsset.asset_status = undefined;
        const currentLocation = {
            site: 1,
            building: 1,
            floor: 1,
            room: 1,
        };
        const { getByText } = setup({
            asset: testAsset,
            currentLocation,
            dateFormatPattern,
            disabled: false,
            forceOpen: false,
        });

        assertFormText({ getByText, asset: testAsset });
    });

    it('should render FAIL panel without mismatch location alert, with No reason', () => {
        const currentLocation = {
            site: 1,
            building: 1,
            floor: 1,
            room: 1,
        };
        const testAsset = { ...asset };
        testAsset.last_inspection.inspect_status = 'FAILED';
        testAsset.last_inspection.inspect_fail_reason = undefined;
        testAsset.last_inspection.inspect_notes = 'Some notes';
        const { queryByText, getByText, getByTestId } = setup({
            asset: testAsset,
            currentLocation,
            dateFormatPattern,
            disabled: false,
            forceOpen: false,
        });
        expect(queryByText(formLocale.alertLocationMismatch)).not.toBeInTheDocument();
        expect(getByTestId('last_inspection_panel-header-fail-chip')).toBeInTheDocument();
        assertFormText({ getByText, asset: testAsset });
    });

    it('should respond to collapse button when clicked', () => {
        const setStateMock = jest.fn();
        const spyState = useState => [useState, setStateMock];
        jest.spyOn(React, 'useState').mockImplementationOnce(spyState);
        const currentLocation = {
            site: 1,
            building: 1,
            floor: 1,
            room: 1,
        };
        const { getByTestId } = setup({
            asset,
            currentLocation,
            dateFormatPattern,
            disabled: false,
            forceOpen: false,
        });

        act(() => {
            fireEvent.click(getByTestId('last_inspection_panel-expand-button'));
        });
        expect(setStateMock).toHaveBeenCalledWith(false);
    });

    it('should not respond to collapse when clicked', () => {
        const setStateMock = jest.fn();
        const spyState = useState => [useState, setStateMock];
        jest.spyOn(React, 'useState').mockImplementationOnce(spyState);
        const currentLocation = {
            site: 1,
            building: 1,
            floor: 1,
            room: 1,
        };
        const { getByTestId } = setup({
            asset,
            currentLocation,
            dateFormatPattern,
            disabled: false,
            forceOpen: true,
        });

        act(() => {
            fireEvent.click(getByTestId('last_inspection_panel-expand-button'));
        });
        expect(setStateMock).not.toHaveBeenCalled();
    });

    it('should handle defaults (coverage)', () => {
        const currentLocation = {
            site: 2,
            building: 1,
            floor: 1,
            room: 1,
        };
        const testAsset = { ...asset, last_location: { ...asset.last_location } };
        delete testAsset.last_location.site_id_displayed;
        delete testAsset.last_location.site_name;
        delete testAsset.last_location.building_id_displayed;
        delete testAsset.last_location.building_name;
        const { getByText, getByTestId, queryByText } = setup({
            asset: testAsset,
            currentLocation,
            dateFormatPattern,
        });

        expect(getByText(formLocale.alertLocationMismatch)).toBeInTheDocument();
        expect(getByTestId('last_inspection_panel-header-pass-chip')).toBeInTheDocument();
        expect(queryByText(asset.last_location.site_id_displayed)).not.toBeInTheDocument();
        expect(queryByText(asset.last_location.site_name)).not.toBeInTheDocument();
        expect(queryByText(asset.last_location.building_id_displayed)).not.toBeInTheDocument();
        expect(queryByText(asset.last_location.building_name)).not.toBeInTheDocument();
    });
});
