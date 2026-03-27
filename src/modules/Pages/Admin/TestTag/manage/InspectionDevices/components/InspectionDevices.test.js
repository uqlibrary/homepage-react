import React from 'react';
import InspectionDevices from './InspectionDevices';
import { rtlRender, WithRouter, act, fireEvent, waitFor, WithReduxStore } from 'test-utils';
import Immutable from 'immutable';
import { PERMISSIONS } from '../../../config/auth';

import userData from '../../../../../../../data/mock/data/testing/testAndTag/testTagUser';
import inspectionDevices from '../../../../../../../data/mock/data/records/testAndTag/test_tag_inspection_devices';
import locale from '../../../testTag.locale';
import config from './config';

jest.mock('moment', () => {
    const actual = jest.requireActual('moment');
    return (...args) => {
        if (args.length === 0) {
            return actual('2026-01-01');
        }
        return actual(...args);
    };
});

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
        accountReducer: {
            accountLoading: false,
            account: { tnt: userData },
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
    jest.useFakeTimers();

    beforeEach(() => {
        jest.spyOn(console, 'error');
        console.error.mockImplementation(() => null);
    });

    afterEach(() => {
        console.error.mockRestore();
    });
    it('renders component standard', () => {
        const { getByText } = setup({ actions: actions });
        expect(
            getByText(locale.pages.manage.inspectiondevices.header.pageSubtitle('Work Station Support', 'Library')),
        ).toBeInTheDocument();
        expect(getByText('AV 025')).toBeInTheDocument();
    });
    it('catches error on loadInspectionDevices', async () => {
        actions.loadInspectionDevices = jest.fn(() => {
            return Promise.reject('Error');
        });

        const { getByText } = setup({ actions: actions });
        await waitFor(() => {
            expect(
                getByText(locale.pages.manage.inspectiondevices.header.pageSubtitle('Work Station Support', 'Library')),
            ).toBeInTheDocument();
        });
        expect(actions.loadInspectionDevices).rejects.toEqual('Error');
    });

    it('Add Inspection Device functions correctly', async () => {
        actions.loadInspectionDevices = jest.fn(() => {
            return Promise.resolve();
        });
        const { getByText, getByTestId } = setup({ actions: actions });

        expect(
            getByText(locale.pages.manage.inspectiondevices.header.pageSubtitle('Work Station Support', 'Library')),
        ).toBeInTheDocument();
        expect(getByTestId('test-data-table-toolbar-export-menu')).toBeInTheDocument();
        await act(async () => {
            await fireEvent.click(getByTestId('test-data-table-toolbar-add-button'));
        });

        await waitFor(() => {
            expect(getByTestId('device_model_name-input')).toBeInTheDocument();
        });

        const addButton = getByTestId('update_dialog-action-button');
        fireEvent.change(getByTestId('device_model_name-input'), { target: { value: 'TEST MODELX' } });
        fireEvent.change(getByTestId('device_serial_number-input'), { target: { value: 'TEST SNX' } });
        fireEvent.change(getByTestId('device_calibrated_by_last-input'), { target: { value: 'PersonX' } });

        fireEvent.change(getByTestId('device_calibration_due_date-input'), { target: { value: '2026-02-01' } });
        fireEvent.change(getByTestId('device_calibrated_date_last-input'), { target: { value: '2025-02-01' } });

        // commit the change
        await act(async () => {
            await fireEvent.click(addButton);
        });
        await waitFor(() =>
            expect(actions.addInspectionDevice).toHaveBeenCalledWith({
                device_model_name: 'TEST MODELX',
                device_serial_number: 'TEST SNX',
                device_calibrated_by_last: 'PersonX',
                device_calibration_due_date: '2026-02-01 00:00:00',
                device_calibrated_date_last: '2025-02-01 00:00:00',
                device_department: 'UQL',
            }),
        );
        // Check error condition for add
        actions.addInspectionDevice = jest.fn(() => Promise.reject('Testing 2'));

        await act(async () => {
            await fireEvent.click(getByTestId('test-data-table-toolbar-add-button'));
        });

        await waitFor(() => {
            expect(getByTestId('device_model_name-input')).toBeInTheDocument();
        });

        fireEvent.change(getByTestId('device_model_name-input'), { target: { value: 'TEST MODELX' } });
        fireEvent.change(getByTestId('device_serial_number-input'), { target: { value: 'TEST SNX' } });
        fireEvent.change(getByTestId('device_calibrated_by_last-input'), { target: { value: 'PersonX' } });

        await act(async () => {
            fireEvent.click(addButton);
        });
        expect(actions.addInspectionDevice).rejects.toEqual('Testing 2');
    });
    it('Edit Inspection Device functions correctly', async () => {
        const { getByText, getByTestId } = setup({
            actions: actions,
        });
        expect(
            getByText(locale.pages.manage.inspectiondevices.header.pageSubtitle('Work Station Support', 'Library')),
        ).toBeInTheDocument();
        await waitFor(() => {
            expect(getByText('AV 025')).toBeVisible();
        });
        await act(async () => {
            await fireEvent.click(getByTestId('action_cell-1-edit-button'));
        });
        await waitFor(() => {
            expect(getByTestId('device_model_name-input')).toBeInTheDocument();
        });
        fireEvent.change(getByTestId('device_model_name-input'), { target: { value: 'EDIT NAME' } });
        fireEvent.change(getByTestId('device_serial_number-input'), { target: { value: 'EDIT SN' } });
        fireEvent.change(getByTestId('device_calibrated_by_last-input'), { target: { value: 'EDIT PERSON' } });
        // dates will be update below - this is to make sure data range validation work for unchanged dates

        // commit the change
        await act(async () => {
            await fireEvent.click(getByTestId('update_dialog-action-button'));
        });
        expect(actions.updateInspectionDevice).toHaveBeenLastCalledWith(1, {
            device_calibrated_by_last: 'EDIT PERSON',
            device_calibrated_date_last: '2022-10-17 00:00:00',
            device_calibration_due_date: '2023-10-17 00:00:00',
            device_department: 'UQL',
            device_id: 1,
            device_model_name: 'EDIT NAME',
            device_serial_number: 'EDIT SN',
            has_inspections: 1,
        });

        // test date range validation
        await act(async () => {
            await fireEvent.click(getByTestId('action_cell-1-edit-button'));
        });
        await waitFor(() => {
            expect(getByTestId('device_model_name-input')).toBeInTheDocument();
        });
        fireEvent.change(getByTestId('device_calibration_due_date-input'), { target: { value: '2027-01-01' } });
        fireEvent.change(getByTestId('device_calibrated_date_last-input'), { target: { value: '2026-01-01' } });
        await act(async () => {
            await fireEvent.click(getByTestId('update_dialog-action-button'));
        });
        expect(actions.updateInspectionDevice).toHaveBeenLastCalledWith(
            1,
            expect.objectContaining({
                device_calibrated_date_last: '2026-01-01 00:00:00',
                device_calibration_due_date: '2027-01-01 00:00:00',
            }),
        );

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
        expect(
            getByText(locale.pages.manage.inspectiondevices.header.pageSubtitle('Work Station Support', 'Library')),
        ).toBeInTheDocument();
        await waitFor(() => {
            expect(getByText('AV 025')).toBeVisible();
        });
        fireEvent.click(getByTestId('action_cell-1-delete-button'));
        expect(getByTestId('confirm-test')).toHaveAttribute('disabled');
        // advance past the 3000ms delay in handleDeleteClick
        act(() => {
            jest.advanceTimersByTime(3100);
        });
        expect(getByTestId('confirm-test')).not.toHaveAttribute('disabled');
        await act(async () => {
            fireEvent.click(getByTestId('confirm-test'));
        });

        expect(actions.deleteInspectionDevice).toHaveBeenCalledWith(1);
    });
    it('Delete Inspection Device Error handles correctly', async () => {
        // Deletion of device with existing tests
        const { getByText, getByTestId } = setup({
            actions: actions,
        });
        expect(
            getByText(locale.pages.manage.inspectiondevices.header.pageSubtitle('Work Station Support', 'Library')),
        ).toBeInTheDocument();
        await waitFor(() => {
            expect(getByText('AV 025')).toBeVisible();
        });
        // Simulate an error
        actions.deleteInspectionDevice = jest.fn(() => Promise.reject('Error Delete'));
        fireEvent.click(getByTestId('action_cell-1-delete-button'));
        expect(getByTestId('confirm-test')).toHaveAttribute('disabled');
        // advance past the 3000ms delay in handleDeleteClick
        act(() => {
            jest.advanceTimersByTime(3100);
        });
        expect(getByTestId('confirm-test')).not.toHaveAttribute('disabled');

        await act(async () => {
            fireEvent.click(getByTestId('confirm-test'));
        });
        await waitFor(() => {
            expect(actions.deleteInspectionDevice).rejects.toEqual('Error Delete');
        });
    });
});
