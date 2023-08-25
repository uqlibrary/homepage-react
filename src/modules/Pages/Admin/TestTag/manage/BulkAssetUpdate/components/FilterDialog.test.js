import React from 'react';
import { renderWithRouter, WithReduxStore, waitFor, userEvent, within, preview } from 'test-utils';
import Immutable from 'immutable';

import assetsList from '../../../../../../../data/mock/data/testing/testTagAssetsMine';
import siteList from '../../../../../../../data/mock/data/testing/testTagSites';
import floorList from '../../../../../../../data/mock/data/testing/testTagFloors';
import roomList from '../../../../../../../data/mock/data/testing/testTagRooms';
import assetTypeData from '../../../../../../../data/mock/data/testing/testTagAssetTypes';

import { getUserPermissions } from '../../../helpers/auth';

const defaultLocationState = {
    siteList,
    siteListLoading: false,
    siteListLoaded: false,
    buildingList: siteList[0].buildings,
    buildingListLoading: false,
    floorList: floorList[0],
    floorListLoading: false,
    floorListLoaded: false,
    roomList: roomList[0],
    roomListLoading: false,
    roomListLoaded: false,
};

import FilterDialog from './FilterDialog';
import pageLocale from '../../../testTag.locale';
import pageConfig from './config';

import userData from '../../../../../../../data/mock/data/testing/testTagUser';

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
            assetsMineList: assetsList,
            assetsMineListLoading: false,
            assetsMineListError: null,
        },
        ...state,
    };

    return renderer(
        <WithReduxStore initialState={Immutable.Map(_state)}>
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
        </WithReduxStore>,
    );
}

describe('FilterDialog', () => {
    it('renders component', async () => {
        const loadAssetsMineFn = jest.fn();
        const loadSitesFn = jest.fn();
        const { getByText, getByTestId, getAllByRole } = setup({
            isOpen: true,
            actions: { loadAssetsMine: loadAssetsMineFn, loadSites: loadSitesFn },
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

        expect(getByText('1-5 of 5')).toBeInTheDocument();

        expect(loadAssetsMineFn).toHaveBeenCalled();
        expect(loadSitesFn).toHaveBeenCalled();
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
                },
            });
            preview.debug();
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
                actions: { loadAssetsMine: jest.fn(), loadSites: jest.fn() },
            });

            expect(getByText('Select assets by feature')).toBeInTheDocument();
            userEvent.click(getByTestId('filter_dialog-test-cancel-button'));
            expect(onCancelFn).toHaveBeenCalled();
        });
    });
});
