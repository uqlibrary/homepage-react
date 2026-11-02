import React from 'react';
import AssetSelector, { maskNumber } from './AssetSelector';
import { render, act, fireEvent, WithReduxStore, waitFor } from 'test-utils';
import Immutable from 'immutable';

import * as actions from '../../../../../../data/actions/actionTypes';
import * as tntActions from '../../../../../../data/actions/testTagActions';
import * as repositories from 'repositories';

import userData from '../../../../../../data/mock/data/testing/testAndTag/testTagUser';
import assetData from '../../../../../../data/mock/data/testing/testAndTag/testTagAssets';
import locale from '../../testTag.locale.js';

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
    it('renders component', async () => {
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
        // assert that barcode scanner trigger is present
        expect(getByTestId('barcode-scanner-open-button')).toBeEnabled();
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

    it('should clear input when clear button is clicked', async () => {
        const onClearFn = jest.fn();
        const onChangeFn = jest.fn();
        const { getByTestId, getByRole, getAllByRole } = setup({
            id: 'test',
            state: { testTagAssetsReducer: { assetsList: [] } },
            onClear: onClearFn,
            onChange: onChangeFn,
        });
        expect(getByTestId('asset_selector-test')).toBeInTheDocument();

        // Click to open, select the ADD NEW option
        act(() => {
            fireEvent.click(getByTestId('asset_selector-test-input'));
        });
        selectOptionFromListByIndex(0, { getByRole, getAllByRole });
        expect(getByTestId('asset_selector-test-input')).toHaveAttribute('value', 'NEW ASSET');

        // Now click the clear button rendered by Autocomplete
        const clearButton = getByTestId('asset_selector-test').querySelector('.MuiAutocomplete-clearIndicator');
        act(() => {
            fireEvent.click(clearButton);
        });

        await waitFor(() => expect(onClearFn).toHaveBeenCalledWith('clear'));
        expect(getByTestId('asset_selector-test-input')).toHaveAttribute('value', '');
    });

    it('should apply autoFocus when prop is set', () => {
        const { getByTestId } = setup({
            state: { testTagAssetsReducer: { assetsList: [] } },
            id: 'test',
            autoFocus: true,
        });
        expect(getByTestId('asset_selector-test-input')).toHaveFocus();
    });

    it('should render as not required when required is false', () => {
        const { getByTestId } = setup({
            state: { testTagAssetsReducer: { assetsList: [] } },
            id: 'test',
            required: false,
        });
        expect(getByTestId('asset_selector-test-input')).not.toBeRequired();
    });

    it('should call onChange with the selected asset object', async () => {
        const onChangeFn = jest.fn();
        const { getByTestId, getAllByRole } = setup({
            id: 'test',
            onChange: onChangeFn,
        });
        expect(getByTestId('asset_selector-test')).toBeInTheDocument();

        act(() => {
            fireEvent.click(getByTestId('asset_selector-test-input'));
        });

        // The last option should be "ADD NEW ASSET", the first real options are from assetData
        const options = getAllByRole('option');
        // First option is from assetData
        act(() => {
            fireEvent.mouseDown(options[0]);
            options[0].click();
        });

        expect(onChangeFn).toHaveBeenCalledWith(assetData[0]);
    });

    it('should call onChange with inputValue when ADD NEW is selected', () => {
        const onChangeFn = jest.fn();
        const { getByTestId, getByRole, getAllByRole } = setup({
            state: { testTagAssetsReducer: { assetsList: [] } },
            id: 'test',
            onChange: onChangeFn,
        });

        act(() => {
            fireEvent.click(getByTestId('asset_selector-test-input'));
        });
        selectOptionFromListByIndex(0, { getByRole, getAllByRole });

        expect(onChangeFn).toHaveBeenCalledWith({ asset_id_displayed: 'NEW ASSET' });
    });

    it('should not search when input length is below minAssetIdLength', async () => {
        const onSearchFn = jest.fn();
        setup({
            state: { testTagAssetsReducer: { assetsList: [] } },
            id: 'test',
            onSearch: onSearchFn,
            minAssetIdLength: 10,
        });

        act(() => {
            fireEvent.change(document.querySelector('[data-testid="asset_selector-test-input"]'), {
                target: { value: 'UQL31' },
            });
        });

        // Wait for debounce (500ms)
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 600));
        });

        expect(onSearchFn).not.toHaveBeenCalled();
    });

    describe('coverage', () => {
        it('should close popup on blur', () => {
            const { getByTestId, queryByRole } = setup({
                state: { testTagAssetsReducer: { assetsList: assetData } },
                id: 'test',
            });

            act(() => {
                fireEvent.focus(getByTestId('asset_selector-test-input'));
            });

            act(() => {
                fireEvent.blur(getByTestId('asset_selector-test-input'));
            });
            expect(queryByRole('listbox')).toEqual(null);
        });

        it('should apply classNames to form control and autocomplete', () => {
            const { getByTestId, container } = setup({
                state: { testTagAssetsReducer: { assetsList: [] } },
                id: 'test',
                classNames: { formControl: 'custom-form-control', autocomplete: 'custom-autocomplete' },
            });
            expect(container.querySelector('.custom-form-control')).toBeInTheDocument();
            expect(getByTestId('asset_selector-test')).toHaveClass('custom-autocomplete');
        });
    });
    describe('maskNumber', () => {
        it('should prepend department and zero-pad when input is purely numeric', () => {
            expect(maskNumber('310000', 'UQL')).toBe('UQL310000');
        });
        it('should zero-pad short numeric input', () => {
            expect(maskNumber('123', 'UQL')).toBe('UQL000123');
        });
        it('should return as-is when input already has a prefix', () => {
            expect(maskNumber('UQL310000', 'UQL')).toBe('UQL310000');
        });
    });
});
