import guidesReducer, { initialState } from './guidesReducer';
import * as actions from '../actions/actionTypes';

describe('account reducer', () => {
    let emptyState;

    beforeEach(() => {
        emptyState = {
            ...initialState,
        };
    });

    it('should handle a failing Guides API call', () => {
        const test = guidesReducer(emptyState, {
            type: actions.GUIDES_FAILED,
            payload: 'failed!',
        });
        expect(test).toEqual({
            ...emptyState,
            guideListLoading: false,
            guideListError: 'failed!',
        });
    });

    it('should handle clearing the guides', () => {
        const test = guidesReducer(emptyState, { type: actions.GUIDES_CLEAR });
        expect(test).toEqual({
            ...emptyState,
        });
    });

    it('should set guides values when successfully loaded', () => {
        const test = guidesReducer(emptyState, {
            type: actions.GUIDES_LOADED,
            payload: [],
        });
        expect(test).toEqual({
            ...emptyState,
            guideList: [],
            guideListError: false,
            guideListLoading: false,
        });
    });

    it('should set guides Status flags to loading when loading', () => {
        const test = guidesReducer(emptyState, {
            type: actions.GUIDES_LOADING,
        });
        expect(test).toEqual({
            ...emptyState,
            guideList: null,
            guideListError: false,
            guideListLoading: true,
        });
    });
});
