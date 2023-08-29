import React from 'react';
import { renderWithRouter, WithReduxStore, waitFor, userEvent, within } from 'test-utils';
import Immutable from 'immutable';

import AssetReportByFilters from './AssetReportByFilters';

import assetData from '../../../../../../../data/mock/data/testing/testTagAssetsReportAssets';
import userData from '../../../../../../../data/mock/data/testing/testTagUser';
import buildingList from '../../../../../../../data/mock/data/testing/testTagTaggedBuildingList';

import { getUserPermissions } from '../../../helpers/auth';

function setup(testProps = {}, renderer = renderWithRouter) {
    const {
        state = {},
        actions = {},
        assetList = assetData,
        assetListLoading = false,
        assetListLoaded = true,
        assetListError = null,
        taggedBuildingList = buildingList,
        taggedBuildingListLoading = false,
        taggedBuildingListLoaded = true,
        taggedBuildingListError = null,
        ...props
    } = testProps;

    const _state = {
        testTagUserReducer: {
            userLoading: false,
            userLoaded: true,
            userError: false,
            user: userData,
            privilege: getUserPermissions(userData.privileges ?? {}),
        },
        ...state,
    };

    return renderer(
        <WithReduxStore initialState={Immutable.Map(_state)}>
            <AssetReportByFilters
                actions={actions}
                assetList={assetList}
                assetListLoading={assetListLoading}
                assetListLoaded={assetListLoaded}
                assetListError={assetListError}
                taggedBuildingList={taggedBuildingList}
                taggedBuildingListLoading={taggedBuildingListLoading}
                taggedBuildingListLoaded={taggedBuildingListLoaded}
                taggedBuildingListError={taggedBuildingListError}
                {...props}
            />
        </WithReduxStore>,
    );
}

describe('AssetReportByFilters', () => {
    it('renders component', async () => {
        const loadTaggedBuildingListFn = jest.fn();
        const loadAssetReportByFiltersFn = jest.fn();
        const { getByText, getByTestId, getAllByRole } = setup({
            actions: {
                loadAssetReportByFilters: loadAssetReportByFiltersFn,
                loadTaggedBuildingList: loadTaggedBuildingListFn,
            },
        });
        expect(loadAssetReportByFiltersFn).toHaveBeenCalled();
        expect(loadTaggedBuildingListFn).toHaveBeenCalled();
        expect(getByText('Asset tests report for Library')).toBeInTheDocument();
        expect(getByTestId('asset_status_selector-assets-inspected')).toBeInTheDocument();
        expect(getByTestId('asset_status_selector-assets-inspected-input')).toHaveAttribute('value', 'All');
        expect(getByTestId('location_picker-assets_inspected-building')).toBeInTheDocument();
        expect(getByTestId('location_picker-assets_inspected-building-input')).toHaveAttribute(
            'value',
            'All - All buildings',
        );
        expect(getByTestId('assets_inspected-tagged-start')).toBeInTheDocument();
        expect(getByTestId('assets_inspected-tagged-start-input')).toHaveAttribute('value', '');
        expect(getByTestId('assets_inspected-tagged-end')).toBeInTheDocument();
        expect(getByTestId('assets_inspected-tagged-end-input')).toHaveAttribute('value', '');
        expect(getByTestId('data_table-assets-inspected')).toBeInTheDocument();

        // check first row is as expected
        const row = within(getAllByRole('row')[1]);
        expect(row.getByText('UQL000004')).toBeInTheDocument();
        expect(row.getByText('J.K. Murray Library')).toBeInTheDocument();
        expect(row.getByText('PowerBoard')).toBeInTheDocument();
        expect(row.getByText('2015-10-01')).toBeInTheDocument();

        // expect a red cell with alert icon
        expect(row.getAllByRole('cell')[4]).toHaveStyle('background-color: #951126');
        expect(row.getByText('2016-10-01')).toBeInTheDocument();
        expect(row.getByTestId('tooltip-overdue')).toBeInTheDocument();

        expect(row.getByText('CURRENT')).toBeInTheDocument();

        // check pagination counter shows expected number of rows
        expect(getByText('1-6 of 6')).toBeInTheDocument();
    });

    it('fires action when status is changed', async () => {
        const clearDateErrorsFn = jest.fn();
        const loadAssetReportByFiltersFn = jest.fn();
        const { getByText, getByTestId, getByRole } = setup({
            actions: {
                clearDateErrors: clearDateErrorsFn,
                loadAssetReportByFilters: loadAssetReportByFiltersFn,
                loadTaggedBuildingList: jest.fn(),
            },
        });

        expect(getByText('Asset tests report for Library')).toBeInTheDocument();

        // select site
        userEvent.click(getByTestId('asset_status_selector-assets-inspected-input'));
        await userEvent.selectOptions(getByRole('listbox'), 'Out for repair');

        await waitFor(() =>
            expect(loadAssetReportByFiltersFn).toHaveBeenLastCalledWith({
                assetStatus: 'OUTFORREPAIR',
                inspectionDateFrom: null,
                inspectionDateTo: null,
                locationId: null,
                locationType: 'building',
            }),
        );
    });

    it('fires action when building is changed', async () => {
        const clearDateErrorsFn = jest.fn();
        const loadAssetReportByFiltersFn = jest.fn();
        const { getByText, getByTestId, getByRole } = setup({
            actions: {
                clearDateErrors: clearDateErrorsFn,
                loadAssetReportByFilters: loadAssetReportByFiltersFn,
                loadTaggedBuildingList: jest.fn(),
            },
        });

        expect(getByText('Asset tests report for Library')).toBeInTheDocument();

        // select site
        userEvent.click(getByTestId('location_picker-assets_inspected-building-input'));
        await userEvent.selectOptions(getByRole('listbox'), '0910 - Block 6');

        await waitFor(() =>
            expect(loadAssetReportByFiltersFn).toHaveBeenLastCalledWith({
                assetStatus: null,
                inspectionDateFrom: null,
                inspectionDateTo: null,
                locationId: 11,
                locationType: 'building',
            }),
        );
    });

    it('fires action when valid dates are entered', async () => {
        const clearDateErrorsFn = jest.fn();
        const loadAssetReportByFiltersFn = jest.fn();
        const { getByText, getByTestId } = setup({
            actions: {
                clearDateErrors: clearDateErrorsFn,
                loadAssetReportByFilters: loadAssetReportByFiltersFn,
                loadTaggedBuildingList: jest.fn(),
            },
        });
        expect(getByText('Asset tests report for Library')).toBeInTheDocument();

        userEvent.type(getByTestId('assets_inspected-tagged-start-input'), '20220101'); // input formats as date is typed
        userEvent.type(getByTestId('assets_inspected-tagged-end-input'), '20230101'); // input formats as date is typed

        await waitFor(() =>
            expect(loadAssetReportByFiltersFn).toHaveBeenLastCalledWith({
                assetStatus: null,
                inspectionDateFrom: '2022-01-01',
                inspectionDateTo: '2023-01-01',
                locationId: null,
                locationType: 'building',
            }),
        );
    });

    it('shows error message when invalid dates are entered', async () => {
        const clearDateErrorsFn = jest.fn();
        const loadAssetReportByFiltersFn = jest.fn();
        const { getByText, getByTestId, queryByText } = setup({
            actions: {
                clearDateErrors: clearDateErrorsFn,
                loadAssetReportByFilters: loadAssetReportByFiltersFn,
                loadTaggedBuildingList: jest.fn(),
            },
        });
        expect(getByText('Asset tests report for Library')).toBeInTheDocument();

        userEvent.type(getByTestId('assets_inspected-tagged-start-input'), '20210101');
        userEvent.type(getByTestId('assets_inspected-tagged-end-input'), '20200101');

        await waitFor(() =>
            expect(loadAssetReportByFiltersFn).toHaveBeenLastCalledWith({
                assetStatus: null,
                inspectionDateFrom: '2021-01-01',
                inspectionDateTo: null, // invalid dates wont fire an api request
                locationId: null,
                locationType: 'building',
            }),
        );

        expect(getByText('Start date must be before End Date')).toBeInTheDocument();
        expect(getByText('End date must be after Start Date')).toBeInTheDocument();

        userEvent.clear(getByTestId('assets_inspected-tagged-start-input'));

        expect(queryByText('Start date must be before End Date')).not.toBeInTheDocument();
        expect(queryByText('End date must be after Start Date')).not.toBeInTheDocument();

        await waitFor(() =>
            expect(loadAssetReportByFiltersFn).toHaveBeenLastCalledWith({
                assetStatus: null,
                inspectionDateFrom: null,
                inspectionDateTo: '2020-01-01', // new request should fire as one date is supplied and valid
                locationId: null,
                locationType: 'building',
            }),
        );

        userEvent.type(getByTestId('assets_inspected-tagged-start-input'), '20210101');

        expect(getByText('Start date must be before End Date')).toBeInTheDocument();
        expect(getByText('End date must be after Start Date')).toBeInTheDocument();

        userEvent.clear(getByTestId('assets_inspected-tagged-end-input'));

        expect(queryByText('Start date must be before End Date')).not.toBeInTheDocument();
        expect(queryByText('End date must be after Start Date')).not.toBeInTheDocument();

        await waitFor(() =>
            expect(loadAssetReportByFiltersFn).toHaveBeenLastCalledWith({
                assetStatus: null,
                inspectionDateFrom: '2021-01-01',
                inspectionDateTo: null, // new request should fire as one date is supplied and valid
                locationId: null,
                locationType: 'building',
            }),
        );
    });

    describe('coverage', () => {
        it('shows alert if taggedBuildingListError is set', async () => {
            const clearTaggedBuildingListErrorFn = jest.fn();

            const { getByTitle, getByTestId, queryByTestId } = setup({
                actions: {
                    loadAssetReportByFilters: jest.fn(),
                    loadTaggedBuildingList: jest.fn(),
                    clearTaggedBuildingListError: clearTaggedBuildingListErrorFn,
                },
                taggedBuildingListError: 'Test taggedBuildingListError error',
            });
            expect(getByTestId('confirmation_alert-error-alert')).toHaveTextContent(
                'Test taggedBuildingListError error',
            );
            userEvent.click(getByTitle('Close'));
            await waitFor(() => expect(queryByTestId('confirmation_alert-error-alert')).not.toBeInTheDocument());

            expect(clearTaggedBuildingListErrorFn).toHaveBeenCalled();
        });

        it('shows alert if assetListError is set', async () => {
            const clearAssetReportByFiltersErrorFn = jest.fn();

            const { getByTitle, getByTestId, queryByTestId } = setup({
                actions: {
                    loadAssetReportByFilters: jest.fn(),
                    loadTaggedBuildingList: jest.fn(),
                    clearAssetReportByFiltersError: clearAssetReportByFiltersErrorFn,
                },
                assetListError: 'Test assetListError error',
            });

            expect(getByTestId('confirmation_alert-error-alert')).toHaveTextContent('Test assetListError error');
            userEvent.click(getByTitle('Close'));

            await waitFor(() => expect(queryByTestId('confirmation_alert-error-alert')).not.toBeInTheDocument());

            expect(clearAssetReportByFiltersErrorFn).toHaveBeenCalled();
        });
    });
});
