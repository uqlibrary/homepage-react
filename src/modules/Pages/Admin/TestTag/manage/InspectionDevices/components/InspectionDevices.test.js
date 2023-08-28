import React from 'react';
import InspectionDevices from './InspectionDevices';
import { renderWithRouter, act, fireEvent, waitFor, WithReduxStore, preview } from 'test-utils';
import Immutable from 'immutable';
import { PERMISSIONS } from '../../../config/auth';

import userData from '../../../../../../../data/mock/data/testing/testTagUser';
// import assetTypeData from '../../../../../../../data/mock/data/records/test_tag_asset_types';
import inspectionDevices from '../../../../../../../data/mock/data/records/test_tag_inspection_devices';
import { getUserPermissions } from '../../../helpers/auth';
import locale from '../../../testTag.locale';
import config from './config';

const actions = {
    clearInspectionDevicesError: jest.fn(),
    loadInspectionDevices: jest.fn(() => Promise.resolve()),
    addInspectionDevice: jest.fn(() => Promise.resolve()),
    updateInspectionDevice: jest.fn(() => Promise.resolve()),
    deleteInspectionDevice: jest.fn(() => Promise.resolve()),
    deleteAssetType: jest.fn(() => Promise.resolve()),
};
function setup(testProps = {}, renderer = renderWithRouter) {
    const { state = {}, actions = {}, ...props } = testProps;
    const _state = {
        testTagUserReducer: {
            userLoading: false,
            userLoaded: true,
            userError: false,
            user: userData,
            privilege: getUserPermissions(userData.privileges ?? {}),
        },

        testTagInspectionDevicesReducer: {
            inspectionDevices: inspectionDevices.data,
            inspectionDevicesLoading: false,
            inspectionDevicesLoaded: false,
            inspectionDevicesError: null,
        },
        ...state,
    };
    return renderer(
        <WithReduxStore initialState={Immutable.Map(_state)}>
            <InspectionDevices
                componentId="test"
                componentIdLower="test"
                actions={actions}
                config={config}
                pageLocale={locale.pages.manage.inspectiondevices}
                inspectionDevices={inspectionDevices.data}
                inspectionDevicesLoading={false}
                inspectionDevicesError={null}
                requiredPermissions={[PERMISSIONS.can_inspect, PERMISSIONS.can_alter]}
                {...props}
            />
        </WithReduxStore>,
    );
}

const selectOptionFromListByIndex = (index, actions) => {
    expect(actions.getByRole('listbox')).not.toEqual(null);
    act(() => {
        const options = actions.getAllByRole('option');

        fireEvent.mouseDown(options[index]);
        options[index].click();
    });
};

describe('InspectionDevices', () => {
    it('renders component standard', () => {
        const { getByText } = setup({ actions: actions });
        expect(getByText(locale.pages.manage.inspectiondevices.header.pageSubtitle('Library'))).toBeInTheDocument();
        expect(getByText('AV 025')).toBeInTheDocument();
    });
    it('catches error on loadInspectionDevices', async () => {
        actions.loadInspectionDevices = jest.fn(() => {
            return Promise.reject('Error');
        });

        const { getByText } = setup({ actions: actions });
        await waitFor(() => {
            expect(getByText(locale.pages.manage.inspectiondevices.header.pageSubtitle('Library'))).toBeInTheDocument();
        });
        expect(actions.loadInspectionDevices).rejects.toEqual('Error');
    });

    it('Add Inspection Device functions correctly', async () => {
        actions.loadInspectionDevices = jest.fn(() => {
            return Promise.resolve();
        });
        const { getByText, getByTestId } = setup({ actions: actions });

        expect(getByText(locale.pages.manage.inspectiondevices.header.pageSubtitle('Library'))).toBeInTheDocument();
        expect(getByTestId('add_toolbar-test-add-button')).toBeInTheDocument();
        await act(async () => {
            await fireEvent.click(getByTestId('add_toolbar-test-add-button'));
        });

        await waitFor(() => {
            expect(getByTestId('device_model_name-input')).toBeInTheDocument();
        });

        await act(async () => {
            await fireEvent.change(getByTestId('device_model_name-input'), { target: { value: 'TEST MODEL' } });
            await fireEvent.change(getByTestId('device_serial_number-input'), { target: { value: 'TEST SN' } });
            await fireEvent.change(getByTestId('device_calibration_due_date-input'), {
                target: { value: '01/01/2030' },
            });
            await fireEvent.change(getByTestId('device_calibrated_date_last-input'), {
                target: { value: '01/01/2020' },
            });
            await fireEvent.change(getByTestId('device_calibrated_by_last-input'), { target: { value: 'Person' } });
        });
        preview.debug();
    });
});
