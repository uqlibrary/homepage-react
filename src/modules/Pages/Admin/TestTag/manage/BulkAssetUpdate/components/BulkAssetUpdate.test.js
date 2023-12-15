import React from 'react';
import {
    renderWithRouter,
    WithReduxStore,
    waitFor,
    userEvent,
    within,
    act,
    waitForElementToBeRemoved,
} from 'test-utils';
import Immutable from 'immutable';

import assetsList from '../../../../../../../data/mock/data/testAndTag/testTagAssets';
import assetsListMine from '../../../../../../../data/mock/data/testAndTag/testTagAssetsMine';
import siteList from '../../../../../../../data/mock/data/testAndTag/testTagSites';
import floorList from '../../../../../../../data/mock/data/testAndTag/testTagFloors';
import roomList from '../../../../../../../data/mock/data/testAndTag/testTagRooms';
import assetTypeData from '../../../../../../../data/mock/data/testAndTag/testTagAssetTypes';

import * as actions from '../../../../../../../data/actions/actionTypes';
import * as tntActions from '../../../../../../../data/actions/testTagActions';
import * as repositories from 'repositories';

import { getUserPermissions } from '../../../helpers/auth';

const defaultLocationState = {
    siteList,
    siteListLoading: false,
    siteListLoaded: true,
    buildingList: siteList[0].buildings,
    buildingListLoading: true,
    floorList: floorList[0],
    floorListLoading: false,
    floorListLoaded: true,
    roomList: roomList[0],
    roomListLoading: false,
    roomListLoaded: true,
};

import BulkAssetUpdate from './BulkAssetUpdate';
import pageLocale from '../../../testTag.locale';
import pageConfig from './config';

import userData from '../../../../../../../data/mock/data/testAndTag/testTagUser';

function setup(testProps = {}, renderer = renderWithRouter) {
    const {
        state = {},
        actions = {},
        config = pageConfig.filterDialog,
        locale = pageLocale.pages.manage.bulkassetupdate.form.filterDialog,
        locationLocale = pageLocale.pages.general.locationPicker,
        assetTypeLocale = pageLocale.pages.manage.bulkassetupdate.form.filterDialog.form.assetType,
        errorMessageFormatter = jest.fn(message => `Formatted ${message}`),
        ...props
    } = testProps;

    const _state = {
        testTagLocationReducer: {
            ...defaultLocationState,
        },
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
        testTagAssetsReducer: {
            assetsList: assetsList,
            assetsListLoading: false,
            assetsListError: null,
            assetsMineList: assetsListMine,
            assetsMineListLoading: false,
            assetsMineListError: null,
        },
        ...state,
    };

    return renderer(
        <WithReduxStore initialState={Immutable.Map(_state)}>
            <BulkAssetUpdate
                id="test"
                locale={locale}
                actions={actions}
                config={config}
                locationLocale={locationLocale}
                assetTypeLocale={assetTypeLocale}
                errorMessageFormatter={errorMessageFormatter}
                {...props}
            />
        </WithReduxStore>,
    );
}

describe('BulkAssetUpdate', () => {
    jest.setTimeout(30000);
    it('renders component', async () => {
        const loadAssetsMineFn = jest.fn();
        const loadSitesFn = jest.fn();
        const { getByText, getByTestId, getAllByRole } = setup({
            isOpen: true,
            actions: {
                loadAssetsMine: loadAssetsMineFn,
                loadSites: loadSitesFn,
                clearRooms: jest.fn(),
                clearAssetsMine: jest.fn(),
            },
        });

        expect(getByText('Step 1: Choose assets to update in bulk')).toBeInTheDocument();
        expect(getByTestId('asset_selector-bulk-asset-update-input')).toBeInTheDocument();
        expect(getByTestId('bulk_asset_update-feature-button')).toBeInTheDocument();
        expect(getByTestId('data_table-bulk-asset-update')).toBeInTheDocument();
        expect(getAllByRole('row').length).toBe(1); // just the header initially in the table
        expect(getByTestId('footer_bar-bulk-asset-update-action-button')).toHaveAttribute('disabled');
    });

    it('adds row items from filterDialog popup', async () => {
        const loadAssetsMineFn = jest.fn();
        const loadSitesFn = jest.fn();
        const { getByText, getByTestId, getAllByRole, queryByTestId, findByTestId } = setup({
            isOpen: true,

            actions: {
                loadAssetsMine: loadAssetsMineFn,
                loadSites: loadSitesFn,
                clearRooms: jest.fn(),
                clearAssetsMine: jest.fn(),
            },
        });

        expect(getByText('Step 1: Choose assets to update in bulk')).toBeInTheDocument();
        userEvent.click(getByTestId('bulk_asset_update-feature-button'));
        expect(getByTestId('footer_bar-bulk-asset-update-action-button')).toHaveAttribute('disabled');

        await findByTestId('filter_dialog-bulk-asset-update');

        const frow1 = within(getByTestId('filter_dialog-bulk-asset-update')).getAllByRole('row')[1];
        userEvent.click(within(frow1).getByLabelText('Select row'));
        const frow2 = within(getByTestId('filter_dialog-bulk-asset-update')).getAllByRole('row')[2];
        userEvent.click(within(frow2).getByLabelText('Select row'));

        act(() => {
            userEvent.click(getByTestId('filter_dialog-bulk-asset-update-action-button'));
        });

        await waitForElementToBeRemoved(queryByTestId('filter_dialog-bulk-asset-update'));

        await waitFor(() =>
            expect(getByTestId('bulk_asset_update-count-alert')).toHaveTextContent(
                'You have selected 2 assets to bulk update.',
            ),
        );

        // check first row is as expected
        const row1 = within(getAllByRole('row')[1]);
        expect(row1.getByText('UQL000001')).toBeInTheDocument();
        expect(row1.getByText('BRK-DELL')).toBeInTheDocument();
        expect(row1.getByText('1-W212 Forgan Smith Building, St Lucia')).toBeInTheDocument();
        expect(row1.getByText('AWAITINGTEST')).toBeInTheDocument();

        const row2 = within(getAllByRole('row')[2]);
        expect(row2.getByText('UQL000002')).toBeInTheDocument();
        expect(row2.getByText('PWRC13-10')).toBeInTheDocument();
        expect(row2.getByText('1-W212 Forgan Smith Building, St Lucia')).toBeInTheDocument();
        expect(row2.getByText('CURRENT')).toBeInTheDocument();

        // delete 1 item from the list
        userEvent.click(getByTestId('action_cell-2-delete-button'));

        await waitFor(() => expect(getAllByRole('row').length).toBe(2), { timeout: 2000 }); // header and 1 row

        await waitFor(() =>
            expect(getByTestId('bulk_asset_update-count-alert')).toHaveTextContent(
                'You have selected 1 asset to bulk update.',
            ),
        );

        expect(getByTestId('footer_bar-bulk-asset-update-action-button')).not.toHaveAttribute('disabled');
    });

    it('shows step 2', async () => {
        const loadAssetsMineFn = jest.fn();
        const loadSitesFn = jest.fn();
        const { getByText, getByTestId, queryByTestId, findByTestId } = setup({
            isOpen: true,

            actions: {
                loadAssetsMine: loadAssetsMineFn,
                loadSites: loadSitesFn,
                clearRooms: jest.fn(),
                clearAssetsMine: jest.fn(),
            },
        });

        expect(getByText('Step 1: Choose assets to update in bulk')).toBeInTheDocument();
        userEvent.click(getByTestId('bulk_asset_update-feature-button'));
        expect(getByTestId('footer_bar-bulk-asset-update-action-button')).toHaveAttribute('disabled');

        await findByTestId('filter_dialog-bulk-asset-update');

        const frow1 = within(getByTestId('filter_dialog-bulk-asset-update')).getAllByRole('row')[1];
        userEvent.click(within(frow1).getByLabelText('Select row'));
        const frow2 = within(getByTestId('filter_dialog-bulk-asset-update')).getAllByRole('row')[2];
        userEvent.click(within(frow2).getByLabelText('Select row'));

        act(() => {
            userEvent.click(getByTestId('filter_dialog-bulk-asset-update-action-button'));
        });

        await waitForElementToBeRemoved(queryByTestId('filter_dialog-bulk-asset-update'));

        await waitFor(() =>
            expect(getByTestId('bulk_asset_update-count-alert')).toHaveTextContent(
                'You have selected 2 assets to bulk update.',
            ),
        );

        expect(getByTestId('footer_bar-bulk-asset-update-action-button')).not.toHaveAttribute('disabled');
        userEvent.click(getByTestId('footer_bar-bulk-asset-update-action-button'));

        expect(getByText('Step 2: Choose bulk update actions')).toBeInTheDocument();

        // check state of UI elements
        // location
        expect(getByTestId('bulk_asset_update-location-checkbox')).not.toHaveClass('Mui-checked');
        expect(getByTestId('location_picker-bulk-asset-update-site-input')).toHaveAttribute('disabled');
        expect(getByTestId('location_picker-bulk-asset-update-building-input')).toHaveAttribute('disabled');
        expect(getByTestId('location_picker-bulk-asset-update-floor-input')).toHaveAttribute('disabled');
        expect(getByTestId('location_picker-bulk-asset-update-room-input')).toHaveAttribute('disabled');
        // asset type
        expect(getByTestId('bulk_asset_update-asset-type-checkbox')).not.toHaveClass('Mui-checked');
        expect(getByTestId('asset_type_selector-bulk-asset-update-input')).toHaveAttribute('disabled');
        // discard reason
        expect(getByTestId('bulk_asset_update-notes-checkbox')).not.toHaveClass('Mui-checked');
        expect(getByTestId('bulk-asset-update-discard-reason-input')).toHaveAttribute('disabled');
        // clear test notes
        expect(getByTestId('bulk_asset_update-status-checkbox')).not.toHaveClass('Mui-checked');
        // submit button
        expect(getByTestId('bulk_asset_update-submit-button')).toHaveAttribute('disabled');

        // Nav back to step 1
        userEvent.click(getByTestId('bulk_asset_update-back-button'));

        expect(getByText('Step 1: Choose assets to update in bulk')).toBeInTheDocument();
    });

    it('handles update request not including discard asset', async () => {
        const loadAssetsMineFn = jest.fn();
        const loadSitesFn = jest.fn();
        const bulkAssetUpdateFn = jest.fn(() => Promise.resolve());

        const { getByText, getByTestId, queryByTestId, getByRole, findByTestId } = setup({
            isOpen: true,

            actions: {
                loadAssetsMine: loadAssetsMineFn,
                loadSites: loadSitesFn,
                clearRooms: jest.fn(),
                clearAssetsMine: jest.fn(),
                bulkAssetUpdate: bulkAssetUpdateFn,
            },
        });

        expect(getByText('Step 1: Choose assets to update in bulk')).toBeInTheDocument();
        userEvent.click(getByTestId('bulk_asset_update-feature-button'));
        expect(getByTestId('footer_bar-bulk-asset-update-action-button')).toHaveAttribute('disabled');

        await findByTestId('filter_dialog-bulk-asset-update');

        const frow1 = within(getByTestId('filter_dialog-bulk-asset-update')).getAllByRole('row')[1];
        userEvent.click(within(frow1).getByLabelText('Select row'));
        const frow2 = within(getByTestId('filter_dialog-bulk-asset-update')).getAllByRole('row')[2];
        userEvent.click(within(frow2).getByLabelText('Select row'));

        act(() => {
            userEvent.click(getByTestId('filter_dialog-bulk-asset-update-action-button'));
        });

        await waitForElementToBeRemoved(queryByTestId('filter_dialog-bulk-asset-update'));

        await waitFor(() =>
            expect(getByTestId('bulk_asset_update-count-alert')).toHaveTextContent(
                'You have selected 2 assets to bulk update.',
            ),
        );

        expect(getByTestId('footer_bar-bulk-asset-update-action-button')).not.toHaveAttribute('disabled');
        userEvent.click(getByTestId('footer_bar-bulk-asset-update-action-button'));

        expect(getByText('Step 2: Choose bulk update actions')).toBeInTheDocument();

        // check state of UI elements
        // location
        userEvent.click(getByTestId('bulk_asset_update-location-checkbox'));

        userEvent.click(getByTestId('location_picker-bulk-asset-update-site-input'));
        await userEvent.selectOptions(getByRole('listbox'), 'St Lucia');
        userEvent.click(getByTestId('location_picker-bulk-asset-update-building-input'));
        await userEvent.selectOptions(getByRole('listbox'), '0001 - Forgan Smith Building');
        userEvent.click(getByTestId('location_picker-bulk-asset-update-floor-input'));
        await userEvent.selectOptions(getByRole('listbox'), '2');
        userEvent.click(getByTestId('location_picker-bulk-asset-update-room-input'));
        await userEvent.selectOptions(getByRole('listbox'), 'W212');

        expect(getByTestId('bulk_asset_update-status-checkbox')).toHaveClass('Mui-disabled');

        // asset type
        userEvent.click(getByTestId('bulk_asset_update-asset-type-checkbox'));
        userEvent.click(getByTestId('asset_type_selector-bulk-asset-update-input'));
        await userEvent.selectOptions(getByRole('listbox'), 'PowerBoard');

        // clear test notes
        userEvent.click(getByTestId('bulk_asset_update-notes-checkbox'));

        // submit button
        expect(getByTestId('bulk_asset_update-submit-button')).not.toHaveAttribute('disabled');

        act(() => {
            userEvent.click(getByTestId('bulk_asset_update-submit-button'));
        });
        // confirmation panel
        await findByTestId('dialogbox-bulk-asset-update');

        expect(getByText('Bulk Update Selected Assets')).toBeInTheDocument();
        expect(
            getByText('Are you sure you wish to proceed with this bulk update of selected assets?'),
        ).toBeInTheDocument();
        userEvent.click(getByTestId('confirm-bulk-asset-update'));
        expect(getByTestId('confirm-bulk-asset-update')).toHaveAttribute('disabled');
        expect(getByTestId('cancel-bulk-asset-update')).toHaveAttribute('disabled');
        expect(
            within(getByTestId('confirm-bulk-asset-update')).getByTestId('bulk_asset_update-confirmation-progress'),
        ).toBeInTheDocument();

        expect(bulkAssetUpdateFn).toHaveBeenCalledWith({
            asset: [1, 2],
            asset_room_id_last_seen: 1,
            asset_type_id: 3,
            clear_comments: 1,
        });
    });

    it('handles update request including discard asset', async () => {
        const loadAssetsMineFn = jest.fn();
        const loadSitesFn = jest.fn();
        const bulkAssetUpdateFn = jest.fn(() => Promise.resolve());

        const { getByText, getByTestId, queryByTestId, findByTestId } = setup({
            isOpen: true,

            actions: {
                loadAssetsMine: loadAssetsMineFn,
                loadSites: loadSitesFn,
                clearRooms: jest.fn(),
                clearAssetsMine: jest.fn(),
                bulkAssetUpdate: bulkAssetUpdateFn,
            },
        });

        expect(getByText('Step 1: Choose assets to update in bulk')).toBeInTheDocument();
        userEvent.click(getByTestId('bulk_asset_update-feature-button'));
        expect(getByTestId('footer_bar-bulk-asset-update-action-button')).toHaveAttribute('disabled');

        await findByTestId('filter_dialog-bulk-asset-update');

        const frow1 = within(getByTestId('filter_dialog-bulk-asset-update')).getAllByRole('row')[1];
        userEvent.click(within(frow1).getByLabelText('Select row'));
        const frow2 = within(getByTestId('filter_dialog-bulk-asset-update')).getAllByRole('row')[2];
        userEvent.click(within(frow2).getByLabelText('Select row'));

        act(() => {
            userEvent.click(getByTestId('filter_dialog-bulk-asset-update-action-button'));
        });

        await waitForElementToBeRemoved(queryByTestId('filter_dialog-bulk-asset-update'));

        await waitFor(() =>
            expect(getByTestId('bulk_asset_update-count-alert')).toHaveTextContent(
                'You have selected 2 assets to bulk update.',
            ),
        );

        expect(getByTestId('footer_bar-bulk-asset-update-action-button')).not.toHaveAttribute('disabled');
        userEvent.click(getByTestId('footer_bar-bulk-asset-update-action-button'));

        expect(getByText('Step 2: Choose bulk update actions')).toBeInTheDocument();

        // discard reason - checking this option disables the others
        userEvent.click(getByTestId('bulk_asset_update-status-checkbox'));
        expect(getByTestId('bulk-asset-update-discard-reason-input')).not.toHaveAttribute('disabled');
        await userEvent.type(getByTestId('bulk-asset-update-discard-reason-input'), 'Test discard notes');

        // location
        expect(getByTestId('bulk_asset_update-location-checkbox')).toHaveClass('Mui-disabled');
        // asset type
        expect(getByTestId('bulk_asset_update-asset-type-checkbox')).toHaveClass('Mui-disabled');
        // clear test notes
        expect(getByTestId('bulk_asset_update-notes-checkbox')).toHaveClass('Mui-disabled');

        // submit button
        expect(getByTestId('bulk_asset_update-submit-button')).not.toHaveAttribute('disabled');

        act(() => {
            userEvent.click(getByTestId('bulk_asset_update-submit-button'));
        });

        // confirmation panel
        await findByTestId('dialogbox-bulk-asset-update');

        expect(
            within(getByTestId('dialogbox-bulk-asset-update')).getByText('Bulk Update Selected Assets'),
        ).toBeInTheDocument();
        expect(
            within(getByTestId('dialogbox-bulk-asset-update')).getByText(
                'Are you sure you wish to proceed with this bulk update of selected assets?',
            ),
        ).toBeInTheDocument();
        userEvent.click(getByTestId('confirm-bulk-asset-update'));
        expect(getByTestId('confirm-bulk-asset-update')).toHaveAttribute('disabled');
        expect(getByTestId('cancel-bulk-asset-update')).toHaveAttribute('disabled');
        expect(
            within(getByTestId('confirm-bulk-asset-update')).getByTestId('bulk_asset_update-confirmation-progress'),
        ).toBeInTheDocument();

        expect(bulkAssetUpdateFn).toHaveBeenCalledWith({
            asset: [1, 2],
            discard_reason: 'Test discard notes',
            is_discarding: 1,
        });
    });

    describe('calling the API', () => {
        const patternMasked = '310000';
        const filter = { status: { discarded: true } };

        beforeEach(() => {
            mockActionsStore = setupStoreForActions();
            mockApi = setupMockAdapter();
            mockApi
                .onGet(repositories.routes.TEST_TAG_ASSETS_FILTERED_API(patternMasked, filter).apiUrl)
                .reply(200, { data: assetsList });
        });
        afterEach(() => {
            mockApi.reset();
        });
        it('fires expected actions when entering text in to the asset selector field', async () => {
            const { getByText, getByTestId } = setup({
                isOpen: true,
                actions: tntActions,
            });

            expect(getByText('Step 1: Choose assets to update in bulk')).toBeInTheDocument();
            await userEvent.type(getByTestId('asset_selector-bulk-asset-update-input'), 'UQL310000');

            const expectedActions = [actions.TESTTAG_ASSETS_LOADING, actions.TESTTAG_ASSETS_LOADED];

            await mockActionsStore.dispatch(tntActions.loadAssetsFiltered(patternMasked, filter));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });

    describe('coverage', () => {
        it('closes dialogs as expected and handles promise rejection', async () => {
            const loadAssetsMineFn = jest.fn();
            const loadSitesFn = jest.fn();
            const bulkAssetUpdateFn = jest.fn(() => Promise.reject());
            const { getByText, getByTitle, getByTestId, queryByTestId, findByTestId } = setup({
                isOpen: true,

                actions: {
                    loadAssetsMine: loadAssetsMineFn,
                    loadSites: loadSitesFn,
                    clearRooms: jest.fn(),
                    clearAssetsMine: jest.fn(),
                    bulkAssetUpdate: bulkAssetUpdateFn,
                },
            });

            expect(getByText('Step 1: Choose assets to update in bulk')).toBeInTheDocument();
            userEvent.click(getByTestId('bulk_asset_update-feature-button'));

            await findByTestId('filter_dialog-bulk-asset-update');

            // click cancel button
            userEvent.click(getByTestId('filter_dialog-bulk-asset-update-cancel-button'));

            await waitForElementToBeRemoved(() => queryByTestId('filter_dialog-bulk-asset-update'));

            // reopen filter so we can test things in step 2
            userEvent.click(getByTestId('bulk_asset_update-feature-button'));

            await findByTestId('filter_dialog-bulk-asset-update');
            const frow1 = within(getByTestId('filter_dialog-bulk-asset-update')).getAllByRole('row')[1];
            userEvent.click(within(frow1).getByLabelText('Select row'));
            const frow2 = within(getByTestId('filter_dialog-bulk-asset-update')).getAllByRole('row')[2];
            userEvent.click(within(frow2).getByLabelText('Select row'));

            act(() => {
                userEvent.click(getByTestId('filter_dialog-bulk-asset-update-action-button'));
            });

            await waitForElementToBeRemoved(() => queryByTestId('filter_dialog-bulk-asset-update'));

            await waitFor(() =>
                expect(getByTestId('bulk_asset_update-count-alert')).toHaveTextContent(
                    'You have selected 2 assets to bulk update.',
                ),
            );

            expect(getByTestId('footer_bar-bulk-asset-update-action-button')).not.toHaveAttribute('disabled');
            userEvent.click(getByTestId('footer_bar-bulk-asset-update-action-button'));

            expect(getByText('Step 2: Choose bulk update actions')).toBeInTheDocument();

            // clear test notes
            userEvent.click(getByTestId('bulk_asset_update-notes-checkbox'));

            // submit button
            expect(getByTestId('bulk_asset_update-submit-button')).not.toHaveAttribute('disabled');

            userEvent.click(getByTestId('bulk_asset_update-submit-button'));

            // confirmation panel
            await findByTestId('dialogbox-bulk-asset-update');
            expect(
                within(getByTestId('dialogbox-bulk-asset-update')).getByText('Bulk Update Selected Assets'),
            ).toBeInTheDocument();
            expect(
                within(getByTestId('dialogbox-bulk-asset-update')).getByText(
                    'Are you sure you wish to proceed with this bulk update of selected assets?',
                ),
            ).toBeInTheDocument();

            // click confirm button - this should cause an error alert due to the promise reject
            userEvent.click(getByTestId('confirm-bulk-asset-update'));
            await waitForElementToBeRemoved(() => queryByTestId('bulk_asset_update-confirmation-progress'));

            expect(getByTestId('confirmation_alert-error-alert')).toHaveTextContent(
                'Operation failed: Unable to bulk update Assets',
            );

            userEvent.click(getByTitle('Close'));

            await waitForElementToBeRemoved(() => queryByTestId('confirmation_alert-error-alert'));

            // cancel & close dialog
            userEvent.click(getByTestId('cancel-bulk-asset-update'));

            await waitForElementToBeRemoved(() => queryByTestId('dialogbox-bulk-asset-update'));
        });
    });
});
