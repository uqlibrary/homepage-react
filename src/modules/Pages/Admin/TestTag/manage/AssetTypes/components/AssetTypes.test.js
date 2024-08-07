import React from 'react';
import ManageAssetTypes from './AssetTypes';
import { rtlRender, WithRouter, act, fireEvent, waitFor, WithReduxStore } from 'test-utils';
import Immutable from 'immutable';

import userData from '../../../../../../../data/mock/data/testing/testAndTag/testTagUser';
import assetTypeData from '../../../../../../../data/mock/data/records/testAndTag/test_tag_asset_types';
import { getUserPermissions } from '../../../helpers/auth';
import locale from '../../../testTag.locale';

const actions = {
    clearAssetTypesError: jest.fn(),
    loadAssetTypes: jest.fn(() => Promise.resolve()),
    addAssetType: jest.fn(() => Promise.resolve()),
    saveAssetType: jest.fn(() => Promise.resolve()),
    deleteAndReassignAssetType: jest.fn(() => Promise.resolve()),
    deleteAssetType: jest.fn(() => Promise.resolve()),
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

        testTagAssetTypesReducer: {
            assetTypesList: assetTypeData,
            assetTypesListLoading: false,
            assetTypesListError: null,
        },
        ...state,
    };
    return renderer(
        <WithReduxStore initialState={Immutable.Map(_state)}>
            <WithRouter>
                <ManageAssetTypes
                    id="test"
                    actions={actions}
                    assetTypesList={assetTypeData.data}
                    assetTypesListLoading={false}
                    assetTypesListError={null}
                    {...props}
                />
            </WithRouter>
        </WithReduxStore>,
    );
}

describe('AssetTypes', () => {
    jest.useFakeTimers();
    jest.setTimeout(30000);
    beforeEach(() => {
        jest.spyOn(console, 'error');
        console.error.mockImplementation(() => null);
    });

    afterEach(() => {
        console.error.mockRestore();
    });
    it('renders component standard', () => {
        const { getByText } = setup({ actions: actions });
        expect(getByText(locale.pages.manage.assetTypes.header.pageSubtitle('Library'))).toBeInTheDocument();
        expect(getByText('Power Tower')).toBeInTheDocument();
    });
    it('catches error on loadAssetTypes', async () => {
        actions.loadAssetTypes = jest.fn(() => {
            return Promise.reject('Error');
        });

        const { getByText } = setup({ actions: actions });
        await waitFor(() => {
            expect(getByText(locale.pages.manage.assetTypes.header.pageSubtitle('Library'))).toBeInTheDocument();
        });
    });

    it('Add Asset Type functions correctly', async () => {
        actions.addAssetType = jest.fn(() => {
            return Promise.resolve();
        });
        actions.loadAssetTypes = jest.fn(() => {
            return Promise.resolve();
        });
        const { getByText, getByTestId } = setup({ actions: actions });

        expect(getByText(locale.pages.manage.assetTypes.header.pageSubtitle('Library'))).toBeInTheDocument();
        expect(getByText('Power Tower')).toBeInTheDocument();
        expect(getByTestId('add_toolbar-asset-types-add-button')).toBeInTheDocument();
        await act(async () => {
            await fireEvent.click(getByTestId('add_toolbar-asset-types-add-button'));
        });

        await waitFor(() => {
            expect(getByTestId('asset_type_name-input')).toBeInTheDocument();
        });
        await act(async () => {
            await fireEvent.change(getByTestId('asset_type_name-input'), { target: { value: 'TEST NAME' } });
            await fireEvent.change(getByTestId('asset_type_class-input'), { target: { value: 'TEST CLASS' } });
            await fireEvent.change(getByTestId('asset_type_power_rating-input'), { target: { value: 'TEST PR' } });
            await fireEvent.change(getByTestId('asset_type-input'), { target: { value: 'TEST TYPE' } });
            await fireEvent.change(getByTestId('asset_type_notes-input'), { target: { value: 'TEST NOTES' } });
        });
        // commit the change
        await act(async () => {
            await fireEvent.click(getByTestId('update_dialog-action-button'));
        });
        expect(actions.addAssetType).toHaveBeenCalledWith({
            asset_type: 'TEST TYPE',
            asset_type_name: 'TEST NAME',
            asset_type_class: 'TEST CLASS',
            asset_type_notes: 'TEST NOTES',
            asset_type_power_rating: 'TEST PR',
        });

        // Check error condition for add
        actions.addAssetType = jest.fn(() => Promise.reject('AAT TESTING'));
        await act(async () => {
            await fireEvent.click(getByTestId('add_toolbar-asset-types-add-button'));
        });

        await waitFor(() => {
            expect(getByTestId('asset_type_name-input')).toBeInTheDocument();
            fireEvent.change(getByTestId('asset_type_name-input'), { target: { value: 'TEST NAME' } });
        });
        await act(async () => {
            await fireEvent.click(getByTestId('update_dialog-action-button'));
        });
        expect(actions.addAssetType).rejects.toEqual('AAT TESTING');

        // Check error condition for add success, load fail
        actions.loadAssetTypes = jest.fn(() => Promise.reject('LAA TESTING'));
        actions.addAssetType = jest.fn(() => Promise.resolve());
        await act(async () => {
            await fireEvent.click(getByTestId('add_toolbar-asset-types-add-button'));
        });

        await waitFor(() => {
            expect(getByTestId('asset_type_name-input')).toBeInTheDocument();
            fireEvent.change(getByTestId('asset_type_name-input'), { target: { value: 'TEST NAME' } });
        });
        await act(async () => {
            await fireEvent.click(getByTestId('update_dialog-action-button'));
        });
        expect(actions.loadAssetTypes).rejects.toEqual('LAA TESTING');
    });
    it('Edit Asset Type functions correctly', async () => {
        const mockTypes = [
            {
                asset_type_id: 1,
                asset_type_name: 'Test 1',
                asset_type_class: 'Class 1',
                asset_type_power_rating: 'Rating 1',
                asset_type: 'Type 1',
                asset_type_notes: 'Notes 1',
                asset_count: 1,
            },
            {
                asset_type_id: 2,
                asset_type_name: 'Test 2',
                asset_type_class: 'Class 2',
                asset_type_power_rating: 'Rating 2',
                asset_type: 'Type 2',
                asset_type_notes: 'Notes 2',
                asset_count: 2,
            },
        ];
        actions.loadAssetTypes = jest.fn(() => {
            return Promise.resolve(mockTypes);
        });
        const { getByText, getByTestId } = setup({
            disableVirtualization: true,
            actions: actions,
            assetTypesList: mockTypes,
        });

        expect(getByText(locale.pages.manage.assetTypes.header.pageSubtitle('Library'))).toBeInTheDocument();
        await waitFor(() => {
            expect(getByText('Test 2')).toBeVisible();
        });
        await act(async () => {
            await fireEvent.click(getByTestId('action_cell-1-edit-button'));
        });

        await waitFor(() => {
            expect(getByTestId('asset_type_name-input')).toBeInTheDocument();
        });
        await act(async () => {
            await fireEvent.change(getByTestId('asset_type_name-input'), { target: { value: 'TEST NAME' } });
            await fireEvent.change(getByTestId('asset_type_class-input'), { target: { value: 'TEST CLASS' } });
            await fireEvent.change(getByTestId('asset_type_power_rating-input'), { target: { value: 'TEST PR' } });
            await fireEvent.change(getByTestId('asset_type-input'), { target: { value: 'TEST TYPE' } });
            await fireEvent.change(getByTestId('asset_type_notes-input'), { target: { value: 'TEST NOTES' } });
        });
        // // commit the change
        await act(async () => {
            await fireEvent.click(getByTestId('update_dialog-action-button'));
        });
        expect(actions.saveAssetType).toHaveBeenCalledWith(1, {
            asset_count: 1,
            asset_type: 'TEST TYPE',
            asset_type_class: 'TEST CLASS',
            asset_type_id: 1,
            asset_type_name: 'TEST NAME',
            asset_type_notes: 'TEST NOTES',
            asset_type_power_rating: 'TEST PR',
        });
        // Check Save Asset Types fail on save.
        actions.saveAssetType = jest.fn(() => Promise.reject('SAA TESTING'));
        await act(async () => {
            await fireEvent.click(getByTestId('action_cell-1-edit-button'));
        });
        await act(async () => {
            await fireEvent.click(getByTestId('update_dialog-action-button'));
        });
        expect(actions.saveAssetType).rejects.toEqual('SAA TESTING');

        // Simulate a failed load on successful save.
        actions.loadAssetTypes = jest.fn(() => Promise.reject('LAA TESTING'));
        actions.saveAssetType = jest.fn(() => Promise.resolve());
        await act(async () => {
            await fireEvent.click(getByTestId('action_cell-1-edit-button'));
        });
        await act(async () => {
            await fireEvent.click(getByTestId('update_dialog-action-button'));
        });
        expect(actions.loadAssetTypes).rejects.toEqual('LAA TESTING');
    });

    it('Delete functions correctly', async () => {
        const mockTypes = [
            {
                asset_type_id: 1,
                asset_type_name: 'Test 1',
                asset_type_class: 'Class 1',
                asset_type_power_rating: 'Rating 1',
                asset_type: 'Type 1',
                asset_type_notes: 'Notes 1',
                asset_count: 0,
            },
            {
                asset_type_id: 2,
                asset_type_name: 'Test 2',
                asset_type_class: 'Class 2',
                asset_type_power_rating: 'Rating 2',
                asset_type: 'Type 2',
                asset_type_notes: 'Notes 2',
                asset_count: 2,
            },
        ];
        actions.loadAssetTypes = jest.fn(() => {
            return Promise.resolve(mockTypes);
        });
        const { getByText, getByTestId } = setup({
            disableVirtualization: true,
            actions: actions,
            assetTypesList: mockTypes,
        });

        expect(getByText(locale.pages.manage.assetTypes.header.pageSubtitle('Library'))).toBeInTheDocument();
        await waitFor(() => {
            expect(getByText('Test 2')).toBeVisible();
        });

        fireEvent.click(getByTestId('action_cell-1-delete-button'));
        await waitFor(() => getByTestId('confirm-asset-types'));

        fireEvent.click(getByTestId('confirm-asset-types'));
        expect(actions.deleteAssetType).toHaveBeenCalledWith(1);
        // Simulate an error
        actions.deleteAssetType = jest.fn(() => Promise.reject('ATD TEST'));

        fireEvent.click(getByTestId('action_cell-1-delete-button'));
        await waitFor(() => getByTestId('confirm-asset-types'));
        fireEvent.click(getByTestId('confirm-asset-types'));

        expect(actions.deleteAssetType).rejects.toEqual('ATD TEST');
        // simulate successful delete, load error.
        actions.deleteAssetType = jest.fn(() => Promise.resolve());
        actions.loadAssetTypes = jest.fn(() => Promise.reject('ATD ERROR TEST'));

        fireEvent.click(getByTestId('action_cell-1-delete-button'));
        await waitFor(() => getByTestId('confirm-asset-types'));
        fireEvent.click(getByTestId('confirm-asset-types'));
        expect(actions.loadAssetTypes).rejects.toEqual('ATD ERROR TEST');
    });

    it('Delete and Reassign Asset Type functions correctly', async () => {
        const mockTypes = [
            {
                asset_type_id: 1,
                asset_type_name: 'Test 1',
                asset_type_class: 'Class 1',
                asset_type_power_rating: 'Rating 1',
                asset_type: 'Type 1',
                asset_type_notes: 'Notes 1',
                asset_count: 0,
            },
            {
                asset_type_id: 2,
                asset_type_name: 'Test 2',
                asset_type_class: 'Class 2',
                asset_type_power_rating: 'Rating 2',
                asset_type: 'Type 2',
                asset_type_notes: 'Notes 2',
                asset_count: 2,
            },
        ];
        actions.loadAssetTypes = jest.fn(() => {
            return Promise.resolve(mockTypes);
        });
        const { getByTestId, getByRole } = setup({
            disableVirtualization: true,
            actions: actions,
            assetTypesList: mockTypes,
        });

        // Delete and Reassign
        actions.loadAssetTypes = jest.fn(() => Promise.resolve());
        fireEvent.click(getByTestId('action_cell-2-delete-button'));

        fireEvent.mouseDown(getByTestId('action_dialogue-asset-types-reassign-select'));
        fireEvent.click(getByRole('option', { name: 'Test 1' }));
        expect(getByTestId('action_dialogue-asset-types-reassign-input')).toHaveAttribute('value', '1');
        expect(getByTestId('action_dialogue-asset-types-action-button')).not.toHaveAttribute('disabled');

        fireEvent.click(getByTestId('action_dialogue-asset-types-action-button'));

        expect(actions.deleteAndReassignAssetType).toHaveBeenCalledWith({
            new_asset_type_id: 1,
            old_asset_type_id: 2,
        });
    });

    it('Delete and Reassign Asset Type functions delete and reassign error correctly', async () => {
        const mockTypes = [
            {
                asset_type_id: 1,
                asset_type_name: 'Test 1',
                asset_type_class: 'Class 1',
                asset_type_power_rating: 'Rating 1',
                asset_type: 'Type 1',
                asset_type_notes: 'Notes 1',
                asset_count: 0,
            },
            {
                asset_type_id: 2,
                asset_type_name: 'Test 2',
                asset_type_class: 'Class 2',
                asset_type_power_rating: 'Rating 2',
                asset_type: 'Type 2',
                asset_type_notes: 'Notes 2',
                asset_count: 2,
            },
        ];
        actions.loadAssetTypes = jest.fn(() => {
            return Promise.resolve(mockTypes);
        });
        const { getByTestId, getByRole } = setup({
            disableVirtualization: true,
            actions: actions,
            assetTypesList: mockTypes,
        });

        // Simulate a reassign error
        actions.deleteAndReassignAssetType = jest.fn(() => Promise.reject('DAR ERROR TEST'));

        fireEvent.click(getByTestId('action_cell-2-delete-button'));

        fireEvent.mouseDown(getByTestId('action_dialogue-asset-types-reassign-select'));
        fireEvent.click(getByRole('option', { name: 'Test 1' }));
        expect(getByTestId('action_dialogue-asset-types-reassign-input')).toHaveAttribute('value', '1');

        fireEvent.click(getByTestId('action_dialogue-asset-types-action-button'));
        expect(actions.deleteAndReassignAssetType).rejects.toEqual('DAR ERROR TEST');
    });

    it('Delete and Reassign Asset Type functions load error correctly', async () => {
        const mockTypes = [
            {
                asset_type_id: 1,
                asset_type_name: 'Test 1',
                asset_type_class: 'Class 1',
                asset_type_power_rating: 'Rating 1',
                asset_type: 'Type 1',
                asset_type_notes: 'Notes 1',
                asset_count: 0,
            },
            {
                asset_type_id: 2,
                asset_type_name: 'Test 2',
                asset_type_class: 'Class 2',
                asset_type_power_rating: 'Rating 2',
                asset_type: 'Type 2',
                asset_type_notes: 'Notes 2',
                asset_count: 2,
            },
        ];
        actions.loadAssetTypes = jest.fn(() => {
            return Promise.resolve(mockTypes);
        });
        const { getByTestId, getByRole } = setup({
            disableVirtualization: true,
            actions: actions,
            assetTypesList: mockTypes,
        });

        // Simulate a reassign success, load error
        actions.deleteAndReassignAssetType = jest.fn(() => Promise.resolve());
        actions.loadAssetTypes = jest.fn(() => Promise.reject('DAR LOAD ERROR TEST'));

        fireEvent.click(getByTestId('action_cell-2-delete-button'));

        fireEvent.mouseDown(getByTestId('action_dialogue-asset-types-reassign-select'));
        fireEvent.click(getByRole('option', { name: 'Test 1' }));
        expect(getByTestId('action_dialogue-asset-types-reassign-input')).toHaveAttribute('value', '1');

        fireEvent.click(getByTestId('action_dialogue-asset-types-action-button'));
        expect(actions.loadAssetTypes).rejects.toEqual('DAR LOAD ERROR TEST');
    });
});
