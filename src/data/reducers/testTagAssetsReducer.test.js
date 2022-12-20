import testTagAssetsReducer, { initialState } from './testTagAssetsReducer';
import * as actions from '../actions/actionTypes';

describe('testTagAssetsReducer reducer', () => {
    let emptyState;
    let mockTestTagList;

    beforeEach(() => {
        mockTestTagList = [{}];
        emptyState = {
            ...initialState,
        };
    });

    it('should set asset status flags to loading when loading asset data', () => {
        const test = testTagAssetsReducer(emptyState, { type: actions.TESTTAG_ASSETS_LOADING });
        expect(test).toEqual({
            ...emptyState,
            assetsList: [],
            assetsListLoading: true,
            assetsListError: false,
        });
    });

    it('should set asset values when successfully loaded', () => {
        const test = testTagAssetsReducer(emptyState, {
            type: actions.TESTTAG_ASSETS_LOADED,
            payload: mockTestTagList,
        });
        expect(test).toEqual({
            ...emptyState,
            assetsList: mockTestTagList,
            assetsListLoading: false,
            assetsListError: false,
        });
    });

    it('should handle a failing asset API call', () => {
        const test = testTagAssetsReducer(emptyState, {
            type: actions.TESTTAG_ASSETS_FAILED,
            payload: 'failed!',
        });
        expect(test).toEqual({
            ...emptyState,
            assetsList: [],
            assetsListLoading: false,
            assetsListError: 'failed!',
        });
    });

    it('should handle clearing the assets', () => {
        const test = testTagAssetsReducer(emptyState, { type: actions.TESTTAG_ASSETS_CLEAR });
        expect(test).toEqual({
            ...emptyState,
        });
    });
});
