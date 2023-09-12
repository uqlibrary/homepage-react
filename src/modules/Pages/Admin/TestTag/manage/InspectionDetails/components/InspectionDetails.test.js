import React from 'react';
import InspectionDetails from './InspectionDetails';
import { renderWithRouter, waitFor, WithReduxStore, userEvent, act } from 'test-utils';
import Immutable from 'immutable';
import * as tntActions from '../../../../../../../data/actions/testTagActions';
import * as repositories from 'repositories';
import * as actions from '../../../../../../../data/actions/actionTypes';

import userData from '../../../../../../../data/mock/data/testing/testTagUser';
import { getUserPermissions } from '../../../helpers/auth';
import locale from '../../../testTag.locale';

const testActions = {
    clearAssets: jest.fn(),
    clearAssetsError: jest.fn(),
    updateInspectionDetails: jest.fn(() => Promise.resolve()),
    loadAssets: jest.fn(() => Promise.resolve()),
};
const mockAPIReturn = [
    {
        asset_id: 123,
        asset_id_displayed: 'UQL000123',
        asset_next_test_due_date: '2023-05-10',
        asset_status: 'CURRENT',
        last_location: {
            room_id: 404,
            room_id_displayed: 'L412',
            room_description: 'LTS Workroom',
            floor_id: 22,
            floor_id_displayed: '4',
            building_id: 4,
            building_id_displayed: '0050',
            building_name: 'Hawken Engineering Building',
            site_id: 1,
            site_id_displayed: '01',
            site_name: 'St Lucia',
        },
        asset_type: {
            asset_type_id: 2,
            asset_type_name: 'Power Cord - C5',
            asset_type_class: '',
            asset_type_power_rating: '',
            asset_type: '',
            asset_type_notes: '',
        },
        last_inspection: {
            inspect_status: 'PASSED',
            inspect_date: '2022-11-10 00:00:00',
            inspect_fail_reason: '',
            inspect_notes: '',
            inspect_device_id: 2,
            inspect_device_model_name: 'AV 025',
            inspect_device_serial_number: '1499928',
            inspect_device_department: 'UQL',
            inspect_device_calibrated_date_last: '2022-10-17 00:00:00',
            inspect_device_calibrated_by_last: 'Test and Tag Supplies Pty Ltd',
            inspect_device_calibration_due_date: '2023-10-17 00:00:00',
            user_id: 4,
            user_uid: 'uqasato',
            user_licence_number: '13962560',
            user_name: 'Aki Sato',
            user_department: 'UQL',
            user_current_flag: 1,
        },
        last_repair: null,
        last_discard: null,
    },
];
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
        testTagAssetsReducer: {
            assetsList: mockAPIReturn,
            assetsListLoading: false,
            assetsListError: null,
            assetsMineList: [],
            assetsMineListLoading: false,
            assetsMineListError: null,
        },
        testTagInspectionDetailsUpdateReducer: {
            inspectionDetailsUpdating: false,
            inspectionDetailsUpdated: false,
            inspectionDetailsError: null,
        },
        ...state,
    };
    return renderer(
        <WithReduxStore initialState={Immutable.Map(_state)}>
            <InspectionDetails
                actions={actions}
                assetsList={[]}
                assetsListLoading={false}
                assetsListError={null}
                {...props}
            />
        </WithReduxStore>,
    );
}
describe('InspectionDetails', () => {
    it('renders component standard', () => {
        const { getByText } = setup({ actions: tntActions });
        expect(getByText(locale.pages.manage.inspectiondetails.header.pageSubtitle('Library'))).toBeInTheDocument();
    });
    it('loads an asset by value', async () => {
        mockApi = setupMockAdapter();
        mockApi
            .onGet(repositories.routes.TEST_TAG_ASSETS_FILTERED_API('UQL000123').apiUrl)
            .reply(200, { status: 'OK', data: [mockAPIReturn] });
        mockActionsStore = setupStoreForActions();
        const { getByText, getByTestId } = setup({ actions: tntActions, assetsList: mockAPIReturn });
        await waitFor(() => {
            expect(getByTestId('asset_selector-inspection-details-input')).toBeInTheDocument();
        });
        expect(getByText(locale.pages.manage.inspectiondetails.header.pageSubtitle('Library'))).toBeInTheDocument();

        await userEvent.type(getByTestId('asset_selector-inspection-details-input'), '123');
        await mockActionsStore.dispatch(tntActions.loadAssets('UQL000123'));
        const expectedActions = [actions.TESTTAG_ASSETS_LOADING, actions.TESTTAG_ASSETS_LOADED];
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });
    it('Catches load error correctly', async () => {
        testActions.loadAssets = jest.fn(() => Promise.reject('load error'));

        const { getByText, getByTestId } = setup({
            actions: testActions,
            assetsList: mockAPIReturn,
        });
        await waitFor(() => {
            expect(getByTestId('asset_selector-inspection-details-input')).toBeInTheDocument();
        });
        expect(getByText(locale.pages.manage.inspectiondetails.header.pageSubtitle('Library'))).toBeInTheDocument();

        userEvent.type(getByTestId('asset_selector-inspection-details-input'), '123');
        await waitFor(() => {
            expect(testActions.loadAssets).rejects.toEqual('load error');
        });
    });
    it('Editing works correctly', async () => {
        testActions.loadAssets = jest.fn(() => Promise.resolve());
        const { getByText, getByTestId } = setup({
            actions: testActions,
            assetsList: mockAPIReturn,
        });
        await waitFor(() => {
            expect(getByTestId('asset_selector-inspection-details-input')).toBeInTheDocument();
        });
        expect(getByText(locale.pages.manage.inspectiondetails.header.pageSubtitle('Library'))).toBeInTheDocument();
        expect(getByText('Power Cord - C5')).toBeInTheDocument();
        act(() => {
            userEvent.click(getByTestId('action_cell-UQL000123-edit-button'));
        });
        expect(getByTestId('inspect_notes-input')).toBeInTheDocument();
        expect(getByTestId('discard_reason-input')).toHaveAttribute('disabled');

        userEvent.type(getByTestId('inspect_notes-input'), 'TEST NOTES');
        userEvent.type(getByTestId('inspect_fail_reason-input'), 'TEST FAIL REASON');
        userEvent.tab();
        userEvent.click(getByTestId('update_dialog-action-button'));

        await expect(testActions.updateInspectionDetails).toHaveBeenCalledWith(123, { inspect_notes: 'TEST NOTES' });
        await expect(getByTestId('confirmation_alert-success-alert')).toHaveTextContent(
            'Request successfully completed',
        );
    });
    it('Error on Edit captured correctly', async () => {
        testActions.updateInspectionDetails = jest.fn(() => Promise.reject('edit error'));
        const { getByText, getByTestId } = setup({
            actions: testActions,
            assetsList: mockAPIReturn,
        });
        await waitFor(() => {
            expect(getByTestId('asset_selector-inspection-details-input')).toBeInTheDocument();
        });
        expect(getByText(locale.pages.manage.inspectiondetails.header.pageSubtitle('Library'))).toBeInTheDocument();
        expect(getByText('Power Cord - C5')).toBeInTheDocument();
        userEvent.click(getByTestId('action_cell-UQL000123-edit-button'));

        expect(getByTestId('inspect_notes-input')).toBeInTheDocument();
        expect(getByTestId('discard_reason-input')).toHaveAttribute('disabled');
        userEvent.click(getByTestId('update_dialog-action-button'));

        await expect(testActions.updateInspectionDetails).rejects.toEqual('edit error');
        await expect(getByTestId('confirmation_alert-error-alert')).toHaveTextContent(
            'Operation failed: Unable to update the test notes',
        );
    });
});
