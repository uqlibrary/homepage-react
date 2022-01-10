import courseResourceSuggestionsReducer, { initialState } from './courseResourceSuggestionsReducer';
import * as actions from '../actions/actionTypes';

describe('account reducer', () => {
    let emptyState;

    beforeEach(() => {
        emptyState = {
            ...initialState,
        };
    });

    it('should handle a failing Course Resource Suggestions API call', () => {
        const test = courseResourceSuggestionsReducer(emptyState, {
            type: actions.COURSE_RESOURCE_SUGGESTIONS_FAILED,
            payload: 'failed!',
        });
        expect(test).toEqual({
            ...emptyState,
            CRsuggestionsLoading: false,
            CRsuggestionsError: 'failed!',
        });
    });

    it('should set Course Resource Suggestions values when successfully loaded', () => {
        const test = courseResourceSuggestionsReducer(emptyState, {
            type: actions.COURSE_RESOURCE_SUGGESTIONS_LOADED,
            payload: [],
        });
        expect(test).toEqual({
            ...emptyState,
            CRsuggestions: [],
            CRsuggestionsError: null,
            CRsuggestionsLoading: false,
        });
    });

    it('should handle clearing the Course Resource Suggestions', () => {
        const test = courseResourceSuggestionsReducer(emptyState, { type: actions.COURSE_RESOURCE_SUGGESTIONS_CLEAR });
        expect(test).toEqual({
            ...emptyState,
        });
    });

    it('should set Course Resource Suggestions Status flags to loading when loading', () => {
        const test = courseResourceSuggestionsReducer(emptyState, {
            type: actions.COURSE_RESOURCE_SUGGESTIONS_LOADING,
        });
        expect(test).toEqual({
            ...emptyState,
            CRsuggestions: null,
            CRsuggestionsError: null,
            CRsuggestionsLoading: true,
        });
    });
});
