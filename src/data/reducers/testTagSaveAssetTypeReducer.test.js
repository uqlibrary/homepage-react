import testTagSaveAssetTypeReducer, { initialState } from './testTagSaveAssetTypeReducer';
import * as actions from '../actions/actionTypes';

describe('testTagSaveAssetTypeReducer', () => {
    let emptyState;
    let mockTestTagList;

    beforeEach(() => {
        mockTestTagList = [{}];
        emptyState = {
            ...initialState,
        };
    });

    it('should set asset type status flags to loading when loading asset data', () => {
        const test = testTagSaveAssetTypeReducer(emptyState, { type: actions.TESTTAG_SAVE_ASSET_TYPE_SAVING });
        expect(test).toEqual({
            ...emptyState,
            saveAssetTypeSaving: true,
            saveAssetTypeSuccess: null,
            saveAssetTypeError: null,
        });
    });

    it('should set asset type values when successfully loaded', () => {
        const test = testTagSaveAssetTypeReducer(emptyState, {
            type: actions.TESTTAG_SAVE_ASSET_TYPE_SUCCESS,
            payload: mockTestTagList,
        });
        expect(test).toEqual({
            ...emptyState,
            saveAssetTypeSaving: false,
            saveAssetTypeSuccess: mockTestTagList,
            saveAssetTypeError: null,
        });
    });

    it('should handle a failing asset type API call', () => {
        const test = testTagSaveAssetTypeReducer(emptyState, {
            type: actions.TESTTAG_SAVE_ASSET_TYPE_FAILED,
            payload: 'failed!',
        });
        expect(test).toEqual({
            ...emptyState,
            saveAssetTypeSaving: false,
            saveAssetTypeSuccess: null,
            saveAssetTypeError: 'failed!',
        });
    });

    it('should handle clearing the asset types', () => {
        const test = testTagSaveAssetTypeReducer(emptyState, { type: actions.TESTTAG_SAVE_ASSET_TYPE_CLEAR });
        expect(test).toEqual({
            ...emptyState,
        });
    });
});
