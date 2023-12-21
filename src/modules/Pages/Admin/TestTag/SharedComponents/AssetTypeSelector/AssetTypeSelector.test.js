import React from 'react';

import * as actions from '../../../../../../data/actions/actionTypes';
import * as tntActions from '../../../../../../data/actions/testTagActions';
import * as repositories from 'repositories';

import AssetTypeSelector, { ADD_NEW_ID } from './AssetTypeSelector';
import assetTypeData from '../../../../../../data/mock/data/testing/testAndTag/testTagAssetTypes';
import { render, act, fireEvent, WithReduxStore, waitFor } from 'test-utils';
import Immutable from 'immutable';

/*
    id,
    title,
    locale,
    actions,
    value,
    required = true,
    canAddNew = false,
    hasAllOption = false,
    disabled = false,
    onChange,
    validateAssetTypeId,
    classNames = {},
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
    const { state = {}, ...rest } = testProps;
    const {
        id = 'test',
        locale = {
            props: {
                label: 'Asset type',
            },
            title: 'Asset Type',
            labelAll: 'All Asset Types',
            addNewLabel: 'ADD NEW ASSET TYPE',
        },
        actions = tntActions,
        ...props
    } = rest;

    const _state = {
        testTagAssetTypesReducer: {
            assetTypesList: assetTypeData,
            assetTypesListLoading: false,
            assetTypesListError: null,
        },
        ...state,
    };
    return renderer(
        <WithReduxStore initialState={Immutable.Map(_state)}>
            <AssetTypeSelector id={id} locale={locale} actions={actions} {...props} />
        </WithReduxStore>,
    );
}

describe('AssetTypeSelector', () => {
    it('renders component', () => {
        const mockLoadAssetTypes = jest.fn();
        const { getByTestId, getByText } = setup({
            state: { testTagAssetTypesReducer: { assetTypesList: [] } },
            actions: { loadAssetTypes: mockLoadAssetTypes },
        });
        expect(getByTestId('asset_type_selector-test')).toBeInTheDocument();
        expect(getByText('Asset type')).toBeInTheDocument();
        expect(getByTestId('asset_type_selector-test-input')).toHaveAttribute('value', '');
        expect(mockLoadAssetTypes).toHaveBeenCalled();
    });

    it('renders component with spinner when loading data', () => {
        const mockLoadAssetTypes = jest.fn();
        const { getByTestId } = setup({
            state: { testTagAssetTypesReducer: { assetTypesList: [], assetTypesListLoading: true } },
            actions: { loadAssetTypes: mockLoadAssetTypes },
        });
        expect(getByTestId('asset_type_selector-test')).toBeInTheDocument();
        expect(getByTestId('asset_type_selector-test-progress')).toBeInTheDocument();
        expect(mockLoadAssetTypes).toHaveBeenCalled();
    });

    it('renders component but shouldnt call action if error state set (coverage)', () => {
        const mockLoadAssetTypes = jest.fn();
        const { getByTestId, queryByTestId } = setup({
            state: {
                testTagAssetTypesReducer: {
                    assetTypesList: [],
                    assetTypesListLoading: false,
                    assetTypesListError: 'some error',
                },
            },
            actions: { loadAssetTypes: mockLoadAssetTypes },
        });
        expect(getByTestId('asset_type_selector-test')).toBeInTheDocument();
        expect(queryByTestId('asset_type_selector-test-progress')).not.toBeInTheDocument();
        expect(mockLoadAssetTypes).not.toHaveBeenCalled();
    });

    it('renders component with Add New option', () => {
        const mockLoadAssetTypes = jest.fn();
        const mockChangeFn = jest.fn();
        const { getByTestId, getByRole, getAllByRole } = setup({
            state: {
                testTagAssetTypesReducer: {
                    assetTypesList: [
                        { asset_type_id: 1, asset_type_name: 'Asset Type One' },
                        { asset_type_id: 2, asset_type_name: 'Asset Type Two' },
                    ],
                },
            },
            actions: { loadAssetTypes: mockLoadAssetTypes },
            canAddNew: true,
            onChange: mockChangeFn,
        });
        expect(getByTestId('asset_type_selector-test')).toBeInTheDocument();

        act(() => {
            fireEvent.mouseDown(getByTestId('asset_type_selector-test-input'));
        });
        selectOptionFromListByIndex(2, { getByRole, getAllByRole });

        expect(mockChangeFn).toHaveBeenCalledWith(
            expect.objectContaining({ asset_type_id: ADD_NEW_ID, asset_type_name: 'ADD NEW ASSET TYPE' }),
        );
    });

    it('renders component in disabled state', () => {
        const { getByTestId } = setup({
            disabled: true,
        });
        expect(getByTestId('asset_type_selector-test')).toBeInTheDocument();
        expect(getByTestId('asset_type_selector-test-input')).toHaveAttribute('disabled');
    });

    it('renders component in error state when required', () => {
        const mockValidateFn = jest.fn(() => false);
        setup({
            required: true,
            validateAssetTypeId: mockValidateFn,
        });
        expect(mockValidateFn).toHaveBeenCalled();
        const label = document.querySelector('#asset_type_selector-test-label');
        expect(label.classList.contains('Mui-error')).toBe(true);
    });

    describe('calling the API', () => {
        beforeEach(() => {
            mockActionsStore = setupStoreForActions();
            mockApi = setupMockAdapter();
            mockApi.onGet(repositories.routes.TEST_TAG_ASSETTYPE_API().apiUrl).reply(200, { data: assetTypeData });
        });
        afterEach(() => {
            mockApi.reset();
        });
        it('renders component with options but none selected by default', async () => {
            const { getByTestId } = setup();
            expect(getByTestId('asset_type_selector-test')).toBeInTheDocument();

            const expectedActions = [actions.TESTTAG_ASSET_TYPES_LIST_LOADING, actions.TESTTAG_ASSET_TYPES_LIST_LOADED];

            await mockActionsStore.dispatch(tntActions.loadAssetTypes());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);

            expect(getByTestId('asset_type_selector-test-input')).toHaveAttribute('value', '');
        });

        it('renders component with options and selection by default', async () => {
            const { getByTestId } = setup({ value: 1 });
            expect(getByTestId('asset_type_selector-test')).toBeInTheDocument();

            const expectedActions = [actions.TESTTAG_ASSET_TYPES_LIST_LOADING, actions.TESTTAG_ASSET_TYPES_LIST_LOADED];

            await mockActionsStore.dispatch(tntActions.loadAssetTypes());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);

            expect(getByTestId('asset_type_selector-test-input')).toHaveAttribute('value', 'Power Cord - C13');
        });

        it('renders component with options and All option selected by default', async () => {
            const { getByTestId } = setup({ hasAllOption: true });
            expect(getByTestId('asset_type_selector-test')).toBeInTheDocument();

            const expectedActions = [actions.TESTTAG_ASSET_TYPES_LIST_LOADING, actions.TESTTAG_ASSET_TYPES_LIST_LOADED];

            await mockActionsStore.dispatch(tntActions.loadAssetTypes());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);

            waitFor(() =>
                expect(getByTestId('asset_type_selector-test-input')).toHaveAttribute('value', 'All Asset Types'),
            );
        });

        it('renders component and fires onChange function when option selected from list', async () => {
            const mockChangeFn = jest.fn();
            const { getByTestId, getByRole, getAllByRole } = setup({ onChange: mockChangeFn });
            expect(getByTestId('asset_type_selector-test')).toBeInTheDocument();

            const expectedActions = [actions.TESTTAG_ASSET_TYPES_LIST_LOADING, actions.TESTTAG_ASSET_TYPES_LIST_LOADED];

            await mockActionsStore.dispatch(tntActions.loadAssetTypes());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);

            expect(getByTestId('asset_type_selector-test-input')).toHaveAttribute('value', '');

            act(() => {
                fireEvent.mouseDown(getByTestId('asset_type_selector-test-input'));
            });

            selectOptionFromListByIndex(2, { getByRole, getAllByRole });
            expect(mockChangeFn).toHaveBeenCalledWith(expect.objectContaining({ asset_type_id: 3 }));
        });
    });
});
