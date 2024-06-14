import React from 'react';
import InspectionDevices from './InspectionDevices';
import { rtlRender, WithRouter, act, fireEvent, waitFor, WithReduxStore, userEvent } from 'test-utils';
import Immutable from 'immutable';
import { PERMISSIONS } from '../../../config/auth';

import userData from '../../../../../../../data/mock/data/testing/testAndTag/testTagUser';
import inspectionDevices from '../../../../../../../data/mock/data/records/testAndTag/test_tag_inspection_devices';
import { getUserPermissions } from '../../../helpers/auth';
import locale from '../../../testTag.locale';
import config from './config';

const actions = {
    clearInspectionDevicesError: jest.fn(),
    loadInspectionDevices: jest.fn(() => Promise.resolve()),
    addInspectionDevice: jest.fn(() => Promise.resolve()),
    updateInspectionDevice: jest.fn(() => Promise.resolve()),
    deleteInspectionDevice: jest.fn(() => Promise.resolve()),
};
function setup(testProps = {}, renderer = rtlRender) {
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
            <WithRouter>
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
            </WithRouter>
        </WithReduxStore>,
    );
}
describe('InspectionDevices', () => {
    beforeEach(() => {
        jest.spyOn(console, 'error');
        console.error.mockImplementation(() => null);
    });

    afterEach(() => {
        console.error.mockRestore();
    });
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

        userEvent.type(getByTestId('device_model_name-input'), 'TEST MODELX');
        userEvent.type(getByTestId('device_serial_number-input'), 'TEST SNX');
        userEvent.type(getByTestId('device_calibrated_by_last-input'), 'PersonX');

        userEvent.type(getByTestId('device_calibration_due_date-input'), '2030-01-01');
        userEvent.type(getByTestId('device_calibrated_date_last-input'), '2020-01-01');

        // preview.debug();
        // commit the change
        await act(async () => {
            await fireEvent.click(getByTestId('update_dialog-action-button'));
        });
        await waitFor(() =>
            expect(actions.addInspectionDevice).toHaveBeenCalledWith({
                device_model_name: 'TEST MODELX',
                device_serial_number: 'TEST SNX',
                device_calibrated_by_last: 'PersonX',
                device_calibration_due_date: '2030-01-01 00:00:00',
                device_calibrated_date_last: '2020-01-01 00:00:00',
                device_department: 'UQL',
            }),
        );
        // Check error condition for add
        actions.addInspectionDevice = jest.fn(() => Promise.reject('Testing 2'));

        await act(async () => {
            await fireEvent.click(getByTestId('add_toolbar-test-add-button'));
        });

        await waitFor(() => {
            expect(getByTestId('device_model_name-input')).toBeInTheDocument();
        });

        userEvent.type(getByTestId('device_model_name-input'), 'TEST MODELX');
        userEvent.type(getByTestId('device_serial_number-input'), 'TEST SNX');
        userEvent.type(getByTestId('device_calibrated_by_last-input'), 'PersonX');

        userEvent.type(getByTestId('device_calibration_due_date-input'), '2030-01-01');
        userEvent.type(getByTestId('device_calibrated_date_last-input'), '2020-01-01');

        await act(async () => {
            await userEvent.click(getByTestId('update_dialog-action-button'));
        });
        expect(actions.addInspectionDevice).rejects.toEqual('Testing 2');
    });
    it('Edit Inspection Device functions correctly', async () => {
        const { getByText, getByTestId } = setup({
            actions: actions,
        });
        expect(getByText(locale.pages.manage.inspectiondevices.header.pageSubtitle('Library'))).toBeInTheDocument();
        await waitFor(() => {
            expect(getByText('AV 025')).toBeVisible();
        });
        await act(async () => {
            await fireEvent.click(getByTestId('action_cell-1-edit-button'));
        });
        await waitFor(() => {
            expect(getByTestId('device_model_name-input')).toBeInTheDocument();
        });
        userEvent.clear(getByTestId('device_model_name-input'));
        userEvent.type(getByTestId('device_model_name-input'), 'EDIT NAME');
        userEvent.clear(getByTestId('device_serial_number-input'));
        userEvent.type(getByTestId('device_serial_number-input'), 'EDIT SN');
        userEvent.clear(getByTestId('device_calibrated_by_last-input'));
        userEvent.type(getByTestId('device_calibrated_by_last-input'), 'EDIT PERSON');
        userEvent.clear(getByTestId('device_calibration_due_date-input'));
        userEvent.type(getByTestId('device_calibration_due_date-input'), '2031-01-01');
        userEvent.clear(getByTestId('device_calibrated_date_last-input'));
        userEvent.type(getByTestId('device_calibrated_date_last-input'), '2030-01-01');

        // // commit the change
        await act(async () => {
            await fireEvent.click(getByTestId('update_dialog-action-button'));
        });
        expect(actions.updateInspectionDevice).toHaveBeenCalledWith(1, {
            device_calibrated_by_last: 'EDIT PERSON',
            device_calibrated_date_last: '2030-01-01 00:00:00',
            device_calibration_due_date: '2031-01-01 00:00:00',
            device_department: 'UQL',
            device_id: 1,
            device_model_name: 'EDIT NAME',
            device_serial_number: 'EDIT SN',
            has_inspections: 1,
        });
        // Check Save Asset Types fail on save.
        actions.updateInspectionDevice = jest.fn(() => Promise.reject('Testing Update 1'));
        await act(async () => {
            await fireEvent.click(getByTestId('action_cell-1-edit-button'));
        });
        await act(async () => {
            await fireEvent.click(getByTestId('update_dialog-action-button'));
        });
        expect(actions.updateInspectionDevice).rejects.toEqual('Testing Update 1');
    });

    it('Delete Inspection Device functions correctly', async () => {
        // Deletion of device with existing tests
        const { getByText, getByTestId } = setup({
            actions: actions,
        });
        expect(getByText(locale.pages.manage.inspectiondevices.header.pageSubtitle('Library'))).toBeInTheDocument();
        await waitFor(() => {
            expect(getByText('AV 025')).toBeVisible();
        });
        await act(async () => {
            await fireEvent.click(getByTestId('action_cell-1-delete-button'));
        });
        expect(getByTestId('confirm-test')).toHaveAttribute('disabled');
        // delay inherit in the system before attr removal
        await new Promise(resolve => setTimeout(resolve, 3100));
        await waitFor(() => {
            expect(getByTestId('confirm-test')).not.toHaveAttribute('disabled');
        });
        await act(async () => {
            await userEvent.click(getByTestId('confirm-test'));
        });

        expect(actions.deleteInspectionDevice).toHaveBeenCalledWith(1);
    });
    it('Delete Inspection Device Error handles correctly', async () => {
        // Deletion of device with existing tests
        const { getByText, getByTestId } = setup({
            actions: actions,
        });
        expect(getByText(locale.pages.manage.inspectiondevices.header.pageSubtitle('Library'))).toBeInTheDocument();
        await waitFor(() => {
            expect(getByText('AV 025')).toBeVisible();
        });
        // Simulate an error
        actions.deleteInspectionDevice = jest.fn(() => Promise.reject('Error Delete'));
        await act(async () => {
            await fireEvent.click(getByTestId('action_cell-1-delete-button'));
        });
        expect(getByTestId('confirm-test')).toHaveAttribute('disabled');
        // delay inherit in the system before attr removal
        await new Promise(resolve => setTimeout(resolve, 3100));
        await waitFor(() => {
            expect(getByTestId('confirm-test')).not.toHaveAttribute('disabled');
        });

        await act(async () => {
            await fireEvent.click(getByTestId('confirm-test'));
        });
        await waitFor(() => {
            expect(actions.deleteInspectionDevice).rejects.toEqual('Error Delete');
        });
    });
});
