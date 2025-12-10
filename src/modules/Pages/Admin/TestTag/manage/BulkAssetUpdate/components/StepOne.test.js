import React from 'react';
import {
    rtlRender,
    WithRouter,
    WithReduxStore,
    waitFor,
    userEvent,
    within,
    waitForElementToBeRemoved,
    renderHook,
} from 'test-utils';
import Immutable from 'immutable';

import assetsList from '../../../../../../../data/mock/data/testing/testAndTag/testTagAssets';
import assetsListMine from '../../../../../../../data/mock/data/testing/testAndTag/testTagAssetsMine';
import siteList from '../../../../../../../data/mock/data/testing/testAndTag/testTagSites';
import floorList from '../../../../../../../data/mock/data/testing/testAndTag/testTagFloors';
import roomList from '../../../../../../../data/mock/data/testing/testAndTag/testTagRooms';
import assetTypeData from '../../../../../../../data/mock/data/testing/testAndTag/testTagAssetTypes';

import { transformRow } from './utils';

import { useObjectList } from '../../../helpers/hooks';

import StepOne from './StepOne';

import userData from '../../../../../../../data/mock/data/testing/testAndTag/testTagUser';

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

function setup(testProps = {}, renderer = rtlRender) {
    const { list, actions = {}, ...props } = testProps;

    const _state = {
        testTagLocationReducer: {
            ...defaultLocationState,
        },
        accountReducer: {
            accountLoading: false,
            account: { tnt: userData },
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
    };

    return renderer(
        <WithReduxStore initialState={Immutable.Map(_state)}>
            <WithRouter>
                <StepOne
                    id="test"
                    list={list}
                    actions={actions}
                    isFilterDialogOpen={false}
                    setIsFilterDialogOpen={jest.fn()}
                    resetForm={jest.fn()}
                    nextStep={jest.fn()}
                    {...props}
                />
            </WithRouter>
        </WithReduxStore>,
    );
}

describe('StepOne', () => {
    jest.setTimeout(30000);
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders component', async () => {
        const list = renderHook(() => useObjectList([], transformRow)).result.current;

        const loadAssetsMineFn = jest.fn();
        const loadSitesFn = jest.fn();
        const { getByText, getByTestId, getAllByRole } = setup({
            list,
            actions: {
                loadAssetsMine: loadAssetsMineFn,
                loadSites: loadSitesFn,
                clearRooms: jest.fn(),
                clearAssetsMine: jest.fn(),
            },
        });

        expect(getByText('Step 1: Choose assets to update in bulk')).toBeInTheDocument();

        expect(getByTestId('asset_selector-test-step-one-input')).toBeInTheDocument();
        expect(getByTestId('test-step-one-feature-button')).toBeInTheDocument();
        expect(getByTestId('data_table-test-step-one')).toBeInTheDocument();
        expect(getAllByRole('row').length).toBe(1); // just the header initially in the table
        expect(getByTestId('footer_bar-test-step-one-action-button')).toHaveAttribute('disabled');
    });

    it('adds row items from filterDialog popup', async () => {
        const loadAssetsMineFn = jest.fn();
        const loadSitesFn = jest.fn();
        const list = renderHook(() => useObjectList([], transformRow)).result;

        const { getByText, getByTestId, getAllByRole, findByTestId, rerender } = setup({
            isFilterDialogOpen: true,
            list: list.current,
            actions: {
                loadAssetsMine: loadAssetsMineFn,
                loadSites: loadSitesFn,
                clearRooms: jest.fn(),
                clearAssetsMine: jest.fn(),
            },
        });

        expect(getByText('Step 1: Choose assets to update in bulk')).toBeInTheDocument();
        await userEvent.click(getByTestId('test-step-one-feature-button'));
        expect(getByTestId('footer_bar-test-step-one-action-button')).toHaveAttribute('disabled');

        await findByTestId('filter_dialog-test-step-one');

        const frow1 = within(getByTestId('filter_dialog-test-step-one')).getAllByRole('row')[1];
        await userEvent.click(within(frow1).getByLabelText('Select row'));
        const frow2 = within(getByTestId('filter_dialog-test-step-one')).getAllByRole('row')[2];
        await userEvent.click(within(frow2).getByLabelText('Select row'));

        await userEvent.click(getByTestId('filter_dialog-test-step-one-action-button'));

        // rerender to reflect the changed state (dialog closed, asset list updated)
        setup(
            {
                isFilterDialogOpen: false,
                list: list.current,
                actions: {
                    loadAssetsMine: loadAssetsMineFn,
                    loadSites: loadSitesFn,
                    clearRooms: jest.fn(),
                    clearAssetsMine: jest.fn(),
                },
            },
            rerender,
        );

        await waitForElementToBeRemoved(getByTestId('filter_dialog-test-step-one'));

        await waitFor(() =>
            expect(getByTestId('test-step-one-count-alert')).toHaveTextContent(
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
        await userEvent.click(getByTestId('action_cell-2-delete-button'));

        const nextStepFn = jest.fn();
        const resetFn = jest.fn();
        // rerender again to reflect the changed state (asset deleted)
        setup(
            {
                isFilterDialogOpen: false,
                list: list.current,
                actions: {
                    loadAssetsMine: loadAssetsMineFn,
                    loadSites: loadSitesFn,
                    clearRooms: jest.fn(),
                    clearAssetsMine: jest.fn(),
                },
                nextStep: nextStepFn,
                resetForm: resetFn,
            },
            rerender,
        );

        await waitFor(() => expect(getAllByRole('row').length).toBe(2), { timeout: 2000 }); // header and 1 row

        await waitFor(() =>
            expect(getByTestId('test-step-one-count-alert')).toHaveTextContent(
                'You have selected 1 asset to bulk update.',
            ),
        );

        expect(getByTestId('footer_bar-test-step-one-action-button')).not.toHaveAttribute('disabled');

        // check submit button calls expected function
        await userEvent.click(getByTestId('footer_bar-test-step-one-action-button'));
        expect(nextStepFn).toHaveBeenCalled();

        // check reset button calls expected function
        await userEvent.click(getByTestId('footer_bar-test-step-one-alt-button'));
        expect(resetFn).toHaveBeenCalled();
    });
});
