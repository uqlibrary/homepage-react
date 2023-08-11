import React from 'react';
import UpdateDialog from './UpdateDialog';
import { rtlRender, act, fireEvent, waitFor } from 'test-utils';

import TextField from '@material-ui/core/TextField';

import { screen } from 'test-utils';
const defaultLocale = {
    cancelButtonLabel: 'test cancel',
    confirmButtonLabel: 'test confirm',
};

function setup(testProps = {}, renderer = rtlRender) {
    const { ...props } = testProps;

    return renderer(
        <UpdateDialog action="add" locale={defaultLocale} fields={{}} columns={{}} id="test" isOpen {...props} />,
    );
}

describe('UpdateDialog Renders component', () => {
    it('renders buttons only, when isOpen is false', () => {
        const actionFn = jest.fn();
        const cancelFn = jest.fn();
        const closeFn = jest.fn();
        const { getByTestId, getByText } = setup({
            title: 'Test title',
            onAction: actionFn,
            onCancelAction: cancelFn,
            onClose: closeFn,
        });

        expect(getByTestId('update_dialog-test')).toBeInTheDocument();
        expect(getByTestId('update_dialog-cancel-button')).toHaveTextContent('test cancel');
        expect(getByTestId('update_dialog-action-button')).toHaveTextContent('test confirm');
        expect(getByText('Test title')).toBeInTheDocument();

        act(() => {
            fireEvent.click(getByTestId('update_dialog-cancel-button'));
        });
        expect(cancelFn).toHaveBeenCalled();
        expect(closeFn).toHaveBeenCalled();
        act(() => {
            fireEvent.click(getByTestId('update_dialog-action-button'));
        });
        expect(actionFn).toHaveBeenCalled();
        expect(closeFn).toHaveBeenCalledTimes(2);
    });

    it('renders simple form and returns values', async () => {
        const fields = {
            asset_id: {
                component: props => <TextField {...props} />,
                fieldParams: { canAdd: false },
            },
            asset_id_displayed: { component: props => <TextField {...props} />, fieldParams: {} },
            asset_type_name: { component: props => <TextField {...props} />, fieldParams: {} },
            asset_location: { component: props => <TextField {...props} />, fieldParams: {} },
            asset_status: { component: props => <TextField {...props} />, fieldParams: {} },
        };
        const columns = {
            asset_id: { label: 'ID' },
            asset_id_displayed: { label: 'Asset ID' },
            asset_type_name: { label: 'Type' },
            asset_location: { label: 'Location' },
            asset_status: { label: 'Status' },
        };
        const row = {};
        const actionFn = jest.fn();
        const { getByTestId, getByText, queryByTestId } = setup({
            title: 'Test title',
            isOpen: true,
            fields,
            columns,
            row,
            onAction: actionFn,
        });

        expect(getByText('Test title')).toBeInTheDocument();
        expect(queryByTestId('asset_id-input')).not.toBeInTheDocument(); // canAdd: false
        expect(getByTestId('asset_id_displayed-input')).toBeInTheDocument();
        expect(getByTestId('asset_type_name-input')).toBeInTheDocument();
        expect(getByTestId('asset_location-input')).toBeInTheDocument();
        expect(getByTestId('asset_status-input')).toBeInTheDocument();

        act(() => {
            fireEvent.click(getByTestId('asset_id_displayed-input'));
            fireEvent.change(getByTestId('asset_id_displayed-input'), { target: { value: 'Test 1' } });
            fireEvent.click(getByTestId('asset_type_name-input'));
            fireEvent.change(getByTestId('asset_type_name-input'), { target: { value: 'Test 2' } });
            fireEvent.click(getByTestId('asset_location-input'));
            fireEvent.change(getByTestId('asset_location-input'), { target: { value: 'Test 3' } });
            fireEvent.click(getByTestId('asset_status-input'));
            fireEvent.change(getByTestId('asset_status-input'), { target: { value: 'Test 4' } });
        });

        expect(getByTestId('update_dialog-action-button')).not.toHaveAttribute('disabled');
        act(() => {
            fireEvent.click(getByTestId('update_dialog-action-button'));
        });

        await waitFor(() =>
            expect(actionFn).toHaveBeenCalledWith({
                asset_id_displayed: 'Test 1',
                asset_type_name: 'Test 2',
                asset_location: 'Test 3',
                asset_status: 'Test 4',
            }),
        );
    });
});
