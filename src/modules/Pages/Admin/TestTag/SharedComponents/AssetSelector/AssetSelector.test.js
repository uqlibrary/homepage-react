import React from 'react';
import AssetSelector from './AssetSelector';
import { render, act, fireEvent, WithReduxStore, waitFor } from 'test-utils';
import Immutable from 'immutable';

import * as actions from '../../../../../../data/actions/actionTypes';
import * as tntActions from '../../../../../../data/actions/testTagActions';
import * as repositories from 'repositories';

import userData from '../../../../../../data/mock/data/testing/testTagUser';
import assetData from '../../../../../../data/mock/data/testing/testTagAssets';
import locale from '../../testTag.locale.js';

/*

    id,
    locale,
    selectedAsset,
    masked = true,
    required = true,
    canAddNew = true,
    clearOnSelect = false,
    headless = false, // if true, no popup is shown and the calling component is expected to intercept the Redux store
    minAssetIdLength = MINIMUM_ASSET_ID_PATTERN_LENGTH,
    user,
    classNames,
    inputRef,
    onChange,
    onReset,
    onSearch,
    validateAssetId,
    filter,
    */

const selectOptionFromListByIndex = (index, actions) => {
    expect(actions.getByRole('listbox')).not.toEqual(null);
    act(() => {
        const options = actions.getAllByRole('option');

        fireEvent.mouseDown(options[index]);
        options[index].click();
    });
};

function setup(testProps = {}, renderer = render) {
    const { state = {}, ...props } = testProps;

    const _state = {
        testTagAssetsReducer: { assetsList: assetData, assetsListLoading: false },
        ...state,
    };
    return renderer(
        <WithReduxStore initialState={Immutable.Map(_state)}>
            <AssetSelector id={props.id} locale={locale.pages.inspect.form.asset} user={userData} {...props} />
        </WithReduxStore>,
    );
}

describe('AssetSelector', () => {
    beforeEach(() => {
        jest.spyOn(console, 'error');
        console.error.mockImplementation(() => null);
    });

    afterEach(() => {
        console.error.mockRestore();
    });
    it('renders component', () => {
        const { getByTestId, getByText, getByRole, getAllByRole } = setup({
            state: { testTagAssetsReducer: { assetsList: [] } },
            id: 'test',
        });
        expect(getByTestId('asset_selector-test')).toBeInTheDocument();
        expect(getByText('Scan or enter a barcode')).toBeInTheDocument();
        expect(getByText('Asset ID')).toBeInTheDocument();

        act(() => {
            fireEvent.click(getByTestId('asset_selector-test-input'));
        });
        selectOptionFromListByIndex(0, { getByRole, getAllByRole });
        expect(getByTestId('asset_selector-test-input')).toHaveAttribute('value', 'NEW ASSET');
    });
    it('renders component without ADD NEW option', () => {
        const { getByTestId, getByText, queryByRole } = setup({
            state: { testTagAssetsReducer: { assetsList: [] } },
            canAddNew: false,
            id: 'test',
        });
        expect(getByTestId('asset_selector-test')).toBeInTheDocument();
        expect(getByText('Scan or enter a barcode')).toBeInTheDocument();
        expect(getByText('Asset ID')).toBeInTheDocument();

        act(() => {
            fireEvent.click(getByTestId('asset_selector-test-input'));
        });
        expect(queryByRole('listbox')).toEqual(null);
    });
    it('renders component with selected value', () => {
        const { getByTestId } = setup({
            selectedAsset: 'UQL200000',
            id: 'test',
        });
        expect(getByTestId('asset_selector-test')).toBeInTheDocument();
        expect(getByTestId('asset_selector-test-input')).toHaveAttribute('value', 'UQL200000');
    });

    it('renders spinner when loading assets', () => {
        const { getByTestId, queryByTestId, rerender } = setup({
            state: { testTagAssetsReducer: { assetsList: [], assetsListLoading: true } },
            id: 'test',
        });
        expect(getByTestId('asset_selector-test')).toBeInTheDocument();
        expect(getByTestId('asset_selector-test-progress')).toBeInTheDocument();

        setup({ id: 'test' }, rerender);
        expect(queryByTestId('asset_selector-test-progress')).not.toBeInTheDocument();
    });

    describe('calling the API', () => {
        const patternMasked = '310000';
        const patternUnmasked = 'UQL31';
        const filter = { status: { discarded: true } };

        beforeEach(() => {
            mockActionsStore = setupStoreForActions();
            mockApi = setupMockAdapter();
            mockApi
                .onGet(repositories.routes.TEST_TAG_ASSETS_API(patternUnmasked).apiUrl)
                .reply(200, { data: assetData })
                .onGet(repositories.routes.TEST_TAG_ASSETS_FILTERED_API(patternMasked, filter).apiUrl)
                .reply(200, { data: assetData });
        });
        afterEach(() => {
            mockApi.reset();
        });

        it('should fire action when text is entered with filters enabled', async () => {
            const onSearchFn = jest.fn();
            const { getByTestId } = setup({
                state: { testTagAssetsReducer: { assetsList: [] } },
                id: 'test',
                filter: filter,
                onSearch: onSearchFn,
            });
            expect(getByTestId('asset_selector-test')).toBeInTheDocument();

            act(() => {
                fireEvent.click(getByTestId('asset_selector-test-input'));
                fireEvent.change(getByTestId('asset_selector-test-input'), { target: { value: patternMasked } });
            });
            const expectedActions = [actions.TESTTAG_ASSETS_LOADING, actions.TESTTAG_ASSETS_LOADED];

            await waitFor(() => expect(onSearchFn).toHaveBeenCalledWith(`UQL${patternMasked}`));
            await mockActionsStore.dispatch(tntActions.loadAssetsFiltered(patternMasked, filter));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('should fire action when text is entered without filters enabled', async () => {
            const onSearchFn = jest.fn();
            const { getByTestId, getByRole } = setup({
                state: { testTagAssetsReducer: { assetsList: [] } },
                id: 'test',
                onSearch: onSearchFn,
            });
            expect(getByTestId('asset_selector-test')).toBeInTheDocument();

            act(() => {
                fireEvent.click(getByTestId('asset_selector-test-input'));
                fireEvent.change(getByTestId('asset_selector-test-input'), { target: { value: patternUnmasked } });
            });
            const expectedActions = [actions.TESTTAG_ASSETS_LOADING, actions.TESTTAG_ASSETS_LOADED];

            await waitFor(() => expect(onSearchFn).toHaveBeenCalledWith(patternUnmasked));
            await mockActionsStore.dispatch(tntActions.loadAssets(patternUnmasked));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);

            expect(getByRole('listbox')).not.toEqual(null);
        });

        it('should fire validation function when text is entered', async () => {
            const validateFn = jest.fn();
            const { getByTestId } = setup({
                state: { testTagAssetsReducer: { assetsList: [] } },
                id: 'test',
                validateAssetId: validateFn,
            });
            expect(getByTestId('asset_selector-test')).toBeInTheDocument();

            act(() => {
                fireEvent.click(getByTestId('asset_selector-test-input'));
                fireEvent.change(getByTestId('asset_selector-test-input'), { target: { value: patternUnmasked } });
            });

            await waitFor(() => expect(validateFn).toHaveBeenCalledWith(patternUnmasked));
        });

        it('should fire action when text is entered with mask disabled', async () => {
            const onSearchFn = jest.fn();
            const { getByTestId, getByRole } = setup({
                state: { testTagAssetsReducer: { assetsList: [] } },
                id: 'test',
                masked: false,
                onSearch: onSearchFn,
            });
            expect(getByTestId('asset_selector-test')).toBeInTheDocument();

            act(() => {
                fireEvent.click(getByTestId('asset_selector-test-input'));
                fireEvent.change(getByTestId('asset_selector-test-input'), { target: { value: patternMasked } });
            });
            const expectedActions = [actions.TESTTAG_ASSETS_LOADING, actions.TESTTAG_ASSETS_LOADED];

            await waitFor(() => expect(onSearchFn).toHaveBeenCalledWith(patternMasked));
            await mockActionsStore.dispatch(tntActions.loadAssetsFiltered(patternMasked, filter));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);

            expect(getByRole('listbox')).not.toEqual(null);
        });

        it('should fire action when text is entered with headless enabled', async () => {
            const onSearchFn = jest.fn();
            const { getByTestId, queryByRole } = setup({
                state: { testTagAssetsReducer: { assetsList: [] } },
                id: 'test',
                headless: true,
                onSearch: onSearchFn,
            });
            expect(getByTestId('asset_selector-test')).toBeInTheDocument();

            act(() => {
                fireEvent.click(getByTestId('asset_selector-test-input'));
                fireEvent.change(getByTestId('asset_selector-test-input'), { target: { value: patternMasked } });
            });
            const expectedActions = [actions.TESTTAG_ASSETS_LOADING, actions.TESTTAG_ASSETS_LOADED];

            await waitFor(() => expect(onSearchFn).toHaveBeenCalledWith(`UQL${patternMasked}`));
            await mockActionsStore.dispatch(tntActions.loadAssetsFiltered(patternMasked, filter));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);

            expect(queryByRole('listbox')).toEqual(null); // no list box shown in headless mode
        });

        it('should fire clear action when clearOnSelect is enabled', async () => {
            const onSearchFn = jest.fn();

            const { getByTestId, getByRole, getAllByRole } = setup({
                state: { testTagAssetsReducer: { assetsList: [] } },
                id: 'test',
                clearOnSelect: true,
                onSearch: onSearchFn,
            });
            expect(getByTestId('asset_selector-test')).toBeInTheDocument();

            act(() => {
                fireEvent.click(getByTestId('asset_selector-test-input'));
                fireEvent.change(getByTestId('asset_selector-test-input'), { target: { value: patternUnmasked } });
            });
            const expectedActions = [actions.TESTTAG_ASSETS_LOADING, actions.TESTTAG_ASSETS_LOADED];

            await waitFor(() => expect(onSearchFn).toHaveBeenCalledWith(patternUnmasked));
            await mockActionsStore.dispatch(tntActions.loadAssets(patternUnmasked));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);

            selectOptionFromListByIndex(0, { getByRole, getAllByRole });

            await mockActionsStore.dispatch(tntActions.clearAssets());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions([
                ...expectedActions,
                actions.TESTTAG_ASSETS_CLEAR,
            ]);
            expect(getByTestId('asset_selector-test-input')).toHaveAttribute('value', '');
        });
        it('should fire reset function when no matches are found', async () => {
            const onResetFn = jest.fn();

            const { getByTestId } = setup({
                state: { testTagAssetsReducer: { assetsList: [] } },
                id: 'test',
                onSearch: jest.fn(),
                onReset: onResetFn,
            });
            expect(getByTestId('asset_selector-test')).toBeInTheDocument();

            act(() => {
                fireEvent.click(getByTestId('asset_selector-test-input'));
                fireEvent.change(getByTestId('asset_selector-test-input'), { target: { value: 'UQL99999' } });
            });
            const expectedActions = [actions.TESTTAG_ASSETS_LOADING, actions.TESTTAG_ASSETS_LOADED];

            await waitFor(() => expect(onResetFn).toHaveBeenCalled());
            await mockActionsStore.dispatch(tntActions.loadAssets(patternUnmasked));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
        it('should auto select asset when exactly one match is returned', async () => {
            const patternExact = 'UQL100000';
            const onSearchFn = jest.fn();
            mockApi
                .onGet(repositories.routes.TEST_TAG_ASSETS_API(patternExact).apiUrl)
                .reply(200, { data: [assetData[0]] });

            const { getByTestId } = setup({
                state: { testTagAssetsReducer: { assetsList: [] } },
                id: 'test',
                onSearch: onSearchFn,
            });
            expect(getByTestId('asset_selector-test')).toBeInTheDocument();

            act(() => {
                fireEvent.click(getByTestId('asset_selector-test-input'));
                fireEvent.change(getByTestId('asset_selector-test-input'), { target: { value: patternExact } });
            });
            const expectedActions = [actions.TESTTAG_ASSETS_LOADING, actions.TESTTAG_ASSETS_LOADED];

            await waitFor(() => expect(onSearchFn).toHaveBeenCalledWith(patternExact));
            await mockActionsStore.dispatch(tntActions.loadAssets(patternExact));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);

            await mockActionsStore.dispatch(tntActions.clearAssets());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions([
                ...expectedActions,
                actions.TESTTAG_ASSETS_CLEAR,
            ]);
            expect(getByTestId('asset_selector-test-input')).toHaveAttribute('value', patternExact);
        });
    });
});
