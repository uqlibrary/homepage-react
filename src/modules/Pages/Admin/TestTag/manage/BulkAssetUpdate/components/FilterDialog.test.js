import React from 'react';
import { rtlRender, WithRouter, WithReduxStore, waitFor, userEvent, within } from 'test-utils';
import Immutable from 'immutable';

import assetsList from '../../../../../../../data/mock/data/testing/testAndTag/testTagAssetsMine';
import siteList from '../../../../../../../data/mock/data/testing/testAndTag/testTagSites';
import floorList from '../../../../../../../data/mock/data/testing/testAndTag/testTagFloors';
import roomList from '../../../../../../../data/mock/data/testing/testAndTag/testTagRooms';
import assetTypeData from '../../../../../../../data/mock/data/testing/testAndTag/testTagAssetTypes';

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

import FilterDialog from './FilterDialog';
import pageLocale from '../../../testTag.locale';
import pageConfig from './config';

import userData from '../../../../../../../data/mock/data/testing/testAndTag/testTagUser';

function setup(testProps = {}, renderer = rtlRender) {
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
            assetsMineList: assetsList,
            assetsMineListLoading: false,
            assetsMineListError: null,
        },
        ...state,
    };

    return renderer(
        <WithReduxStore initialState={Immutable.Map(_state)}>
            <WithRouter>
                <FilterDialog
                    id="test"
                    locale={locale}
                    actions={actions}
                    config={config}
                    locationLocale={locationLocale}
                    assetTypeLocale={assetTypeLocale}
                    errorMessageFormatter={errorMessageFormatter}
                    {...props}
                />
            </WithRouter>
        </WithReduxStore>,
    );
}

describe('FilterDialog', () => {
    jest.setTimeout(30000);
    it('renders component', async () => {
        const loadAssetsMineFn = jest.fn();
        const loadSitesFn = jest.fn();
        const { getByText, getByTestId, getAllByRole } = setup({
            isOpen: true,
            actions: { loadAssetsMine: loadAssetsMineFn, loadSites: loadSitesFn, clearRooms: jest.fn() },
        });

        expect(getByText('Select assets by feature')).toBeInTheDocument();

        expect(getByTestId('location_picker-filter-dialog-site-input')).toHaveAttribute('value', 'All sites');
        expect(getByTestId('location_picker-filter-dialog-site-input')).not.toHaveAttribute('disabled');

        expect(getByTestId('location_picker-filter-dialog-building-input')).toHaveAttribute('value', 'All buildings');
        expect(getByTestId('location_picker-filter-dialog-building-input')).toHaveAttribute('disabled');

        expect(getByTestId('location_picker-filter-dialog-floor-input')).toHaveAttribute('value', 'All floors');
        expect(getByTestId('location_picker-filter-dialog-floor-input')).toHaveAttribute('disabled');

        expect(getByTestId('location_picker-filter-dialog-room-input')).toHaveAttribute('value', 'All rooms');
        expect(getByTestId('location_picker-filter-dialog-room-input')).toHaveAttribute('disabled');

        expect(getByTestId('asset_type_selector-filter-dialog-input')).toHaveAttribute('value', 'All Asset Types');

        expect(getByTestId('filter_dialog-test-search-notes-input')).toHaveAttribute('value', '');

        expect(getByTestId('data_table-filter-dialog')).toBeInTheDocument();

        // check first row is as expected
        const row = within(getAllByRole('row')[1]);
        expect(row.getByText('UQL000001')).toBeInTheDocument();
        expect(row.getByText('BRK-DELL')).toBeInTheDocument();
        expect(row.getByText('1-W212 Forgan Smith Building, St Lucia')).toBeInTheDocument();
        expect(row.getByText('AWAITINGTEST')).toBeInTheDocument();

        expect(getByText('1–5 of 5')).toBeInTheDocument();

        expect(loadAssetsMineFn).toHaveBeenCalled();
        expect(loadSitesFn).toHaveBeenCalled();
    });

    it('tests actions.loadAssetsMine when filters are selected', async () => {
        const loadAssetsMineFn = jest.fn();
        const { getByText, getByTestId, getByRole } = setup({
            isOpen: true,
            actions: { loadAssetsMine: loadAssetsMineFn, loadSites: jest.fn(), clearRooms: jest.fn() },
            state: {
                testTagLocationReducer: {
                    ...defaultLocationState,
                },
            },
        });

        expect(getByText('Select assets by feature')).toBeInTheDocument();

        userEvent.click(getByTestId('location_picker-filter-dialog-site-input'));
        await userEvent.selectOptions(getByRole('listbox'), 'St Lucia');

        await waitFor(() => expect(loadAssetsMineFn).toHaveBeenLastCalledWith({ textSearch: '' }));

        userEvent.click(getByTestId('location_picker-filter-dialog-building-input'));
        await userEvent.selectOptions(getByRole('listbox'), '0001 - Forgan Smith Building');

        await waitFor(() =>
            expect(loadAssetsMineFn).toHaveBeenLastCalledWith({
                locationId: 1,
                locationType: 'building',
                textSearch: '',
            }),
        );

        userEvent.click(getByTestId('location_picker-filter-dialog-floor-input'));
        await userEvent.selectOptions(getByRole('listbox'), '2');

        await waitFor(() =>
            expect(loadAssetsMineFn).toHaveBeenLastCalledWith({ locationType: 'floor', locationId: 1, textSearch: '' }),
        );

        userEvent.click(getByTestId('location_picker-filter-dialog-room-input'));
        await userEvent.selectOptions(getByRole('listbox'), 'W212');

        await waitFor(() =>
            expect(loadAssetsMineFn).toHaveBeenLastCalledWith({ locationType: 'room', locationId: 1, textSearch: '' }),
        );

        await userEvent.type(getByTestId('filter_dialog-test-search-notes-input'), 'Test notes');

        await waitFor(() =>
            expect(loadAssetsMineFn).toHaveBeenLastCalledWith({
                locationType: 'room',
                locationId: 1,
                textSearch: 'Test notes',
            }),
        );

        userEvent.click(getByTestId('asset_type_selector-filter-dialog-input'));
        await userEvent.selectOptions(getByRole('listbox'), 'PowerBoard');

        await waitFor(() =>
            expect(loadAssetsMineFn).toHaveBeenLastCalledWith({
                assetTypeId: 3,
                locationType: 'room',
                locationId: 1,
                textSearch: 'Test notes',
            }),
        );

        // clear some fields (coverage)
        await userEvent.click(getByTestId('asset_type_selector-filter-dialog-input'));
        const selectList = getByTestId('asset_type_selector-filter-dialog');
        const typesButton = within(selectList).getByTitle('Clear');
        await userEvent.click(typesButton);
        await userEvent.selectOptions(getByRole('listbox'), 'All Asset Types');
        await userEvent.clear(getByTestId('filter_dialog-test-search-notes-input'));

        await waitFor(() =>
            expect(loadAssetsMineFn).toHaveBeenLastCalledWith({
                locationType: 'room',
                locationId: 1,
                textSearch: '',
            }),
        );
    });

    it('renders component and allows selection of rows', async () => {
        const loadAssetsMineFn = jest.fn();
        const loadSitesFn = jest.fn();
        const onActionFn = jest.fn();
        const { getByText, getByTestId, getAllByRole } = setup({
            isOpen: true,
            onAction: onActionFn,
            actions: { loadAssetsMine: loadAssetsMineFn, loadSites: loadSitesFn, clearRooms: jest.fn() },
        });

        expect(getByText('Select assets by feature')).toBeInTheDocument();
        const row1 = within(getAllByRole('row')[1]);
        userEvent.click(row1.getByLabelText('Select row'));
        const row2 = within(getAllByRole('row')[2]);
        userEvent.click(row2.getByLabelText('Select row'));

        userEvent.click(getByTestId('filter_dialog-test-action-button'));

        expect(onActionFn).toHaveBeenCalledWith(
            expect.arrayContaining([
                expect.objectContaining({ asset_barcode: 'UQL000001' }),
                expect.objectContaining({ asset_barcode: 'UQL000002' }),
            ]),
        );
        expect(onActionFn).not.toHaveBeenCalledWith(
            expect.arrayContaining([
                expect.objectContaining({ asset_barcode: 'UQL001991' }),
                expect.objectContaining({ asset_barcode: 'UQL001992' }),
                expect.objectContaining({ asset_barcode: 'UQL001993' }),
            ]),
        );
    });

    describe('coverage', () => {
        it('renders nothing if isOpen is false', async () => {
            const { queryByText } = setup({});
            expect(queryByText('Select assets by feature')).not.toBeInTheDocument();
        });

        it('shows alert if assetsMineListError is set', async () => {
            const clearAssetsMineErrorFn = jest.fn();

            const { getByTitle, getByTestId, queryByTestId } = setup({
                isOpen: true,
                state: {
                    testTagAssetsReducer: {
                        assetsMineList: assetsList,
                        assetsMineListLoading: false,
                        assetsMineListError: 'Test assetsMineListError error',
                    },
                },
                actions: {
                    loadAssetsMine: jest.fn(),
                    loadSites: jest.fn(),
                    clearAssetsMineError: clearAssetsMineErrorFn,
                    clearRooms: jest.fn(),
                },
            });

            expect(getByTestId('confirmation_alert-error-alert')).toHaveTextContent('Test assetsMineListError error');
            userEvent.click(getByTitle('Close'));
            await waitFor(() => expect(queryByTestId('confirmation_alert-error-alert')).not.toBeInTheDocument());

            expect(clearAssetsMineErrorFn).toHaveBeenCalled();
        });

        it('fires the cancel button action', () => {
            const onCancelFn = jest.fn();
            const { getByText, getByTestId } = setup({
                isOpen: true,
                onCancel: onCancelFn,
                actions: { loadAssetsMine: jest.fn(), loadSites: jest.fn(), clearRooms: jest.fn() },
            });

            expect(getByText('Select assets by feature')).toBeInTheDocument();
            userEvent.click(getByTestId('filter_dialog-test-cancel-button'));
            expect(onCancelFn).toHaveBeenCalled();
        });
    });
});
