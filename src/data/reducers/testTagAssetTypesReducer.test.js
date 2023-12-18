import testTagAssetTypesReducer, { initialState } from './testTagAssetTypesReducer';
import * as actions from '../actions/actionTypes';

describe('testTagAssetTypeReducer', () => {
    let emptyState;
    let mockAssetTypeList;

    beforeEach(() => {
        mockAssetTypeList = [];

        emptyState = {
            ...initialState,
        };
    });

    describe('asset types loading', () => {
        it('should set onLoad status flags to loading when loading asset type data', () => {
            const test = testTagAssetTypesReducer(emptyState, { type: actions.TESTTAG_ASSET_TYPES_LIST_LOADING });
            expect(test).toEqual({
                ...emptyState,
                assetTypesActionError: false,
                assetTypesActionType: '',
                assetTypesList: [],
                assetTypesListError: null,
                assetTypesListLoading: true,
                assetTypesListLoaded: false,
            });
        });

        it('should set asset types values when successfully loaded', () => {
            const test = testTagAssetTypesReducer(emptyState, {
                type: actions.TESTTAG_ASSET_TYPES_LIST_LOADED,
                payload: mockAssetTypeList,
            });
            expect(test).toEqual({
                ...emptyState,
                assetTypesActionError: false,
                assetTypesActionType: '',
                assetTypesList: mockAssetTypeList,
                assetTypesListError: null,
                assetTypesListLoading: false,
                assetTypesListLoaded: true,
            });
        });

        it('should handle a failing asset list API call', () => {
            const test = testTagAssetTypesReducer(emptyState, {
                type: actions.TESTTAG_ASSET_TYPES_LIST_FAILED,
                payload: 'error',
            });
            expect(test).toEqual({
                ...emptyState,
                assetTypesActionError: false,
                assetTypesActionType: '',
                assetTypesList: mockAssetTypeList,
                assetTypesListError: 'error',
                assetTypesListLoading: false,
                assetTypesListLoaded: false,
            });
        });
    });

    describe('adding, saving and deleting an asset type', () => {
        it('should set correct state when saving or adding', () => {
            const test = testTagAssetTypesReducer(emptyState, { type: actions.TESTTAG_ASSET_TYPES_SAVING });
            expect(test).toEqual({
                ...emptyState,
                assetTypesActionError: false,
                assetTypesActionType: 'SAVE',
                assetTypesList: mockAssetTypeList,
                assetTypesListError: null,
                assetTypesListLoading: true,
            });
        });

        it('should set correct state when saving or adding succeded', () => {
            const test = testTagAssetTypesReducer(emptyState, { type: actions.TESTTAG_ASSET_TYPES_SAVED });
            expect(test).toEqual({
                ...emptyState,
                assetTypesActionError: false,
                assetTypesActionType: '',
                assetTypesList: mockAssetTypeList,
                assetTypesListError: null,
                assetTypesListLoading: false,
            });
        });

        it('should set correct state when deleting an asset type', () => {
            const test = testTagAssetTypesReducer(emptyState, {
                type: actions.TESTTAG_ASSET_TYPES_DELETING,
            });
            expect(test).toEqual({
                ...emptyState,
                assetTypesActionError: false,
                assetTypesActionType: 'DELETE',
                assetTypesList: mockAssetTypeList,
                assetTypesListError: null,
                assetTypesListLoading: false,
            });
        });
        it('should set correct state when an asset type is deleted', () => {
            const test = testTagAssetTypesReducer(emptyState, {
                type: actions.TESTTAG_ASSET_TYPES_DELETED,
            });
            expect(test).toEqual({
                ...emptyState,
                assetTypesActionError: false,
                assetTypesActionType: '',
                assetTypesList: mockAssetTypeList,
                assetTypesListError: null,
                assetTypesListLoading: false,
            });
        });
        it('should set correct state when adding or saving failed', () => {
            const test = testTagAssetTypesReducer(emptyState, {
                type: actions.TESTTAG_ASSET_TYPES_SAVE_FAILED,
            });
            expect(test).toEqual({
                ...emptyState,
                assetTypesActionError: true,
                assetTypesActionType: 'SAVE',
                assetTypesList: mockAssetTypeList,
                assetTypesListError: null,
                assetTypesListLoading: false,
            });
        });
        it('should set correct state when deleting failed', () => {
            const test = testTagAssetTypesReducer(emptyState, {
                type: actions.TESTTAG_ASSET_TYPES_DELETE_FAILED,
            });
            expect(test).toEqual({
                ...emptyState,
                assetTypesActionError: true,
                assetTypesActionType: 'DELETE',
                assetTypesList: mockAssetTypeList,
                assetTypesListError: null,
                assetTypesListLoading: false,
            });
        });
    });

    describe('Reallocating an asset type', () => {
        it('should set correct state when reassigning', () => {
            const test = testTagAssetTypesReducer(emptyState, { type: actions.TESTTAG_ASSET_TYPES_REASSIGNING });
            expect(test).toEqual({
                ...emptyState,
                assetTypesActionError: false,
                assetTypesActionType: 'REASSIGN',
                assetTypesList: mockAssetTypeList,
                assetTypesListError: null,
                assetTypesListLoading: true,
            });
        });

        it('should set correct state when reassigning succeded', () => {
            const test = testTagAssetTypesReducer(emptyState, { type: actions.TESTTAG_ASSET_TYPES_REASSIGNED });
            expect(test).toEqual({
                ...emptyState,
                assetTypesActionError: false,
                assetTypesActionType: '',
                assetTypesList: mockAssetTypeList,
                assetTypesListError: null,
                assetTypesListLoading: false,
            });
        });

        it('should set correct state when reassigning failed', () => {
            const test = testTagAssetTypesReducer(emptyState, { type: actions.TESTTAG_ASSET_TYPES_REASSIGN_FAILED });
            expect(test).toEqual({
                ...emptyState,
                assetTypesActionError: true,
                assetTypesActionType: 'REASSIGN',
                assetTypesList: mockAssetTypeList,
                assetTypesListError: null,
                assetTypesListLoading: false,
            });
        });
    });
});
