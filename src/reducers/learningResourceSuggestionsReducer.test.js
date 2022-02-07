import learningResourceSuggestionsReducer, { initialState } from './learningResourceSuggestionsReducer';
import * as actions from '../actions/actionTypes';

describe('account reducer', () => {
    let emptyState;

    beforeEach(() => {
        emptyState = {
            ...initialState,
        };
    });

    it('should handle a failing Learning Resource Suggestions API call', () => {
        const test = learningResourceSuggestionsReducer(emptyState, {
            type: actions.LEARNING_RESOURCE_SUGGESTIONS_FAILED,
            payload: 'failed!',
        });
        expect(test).toEqual({
            ...emptyState,
            CRsuggestionsLoading: false,
            CRsuggestionsError: 'failed!',
        });
    });

    it('should set Learning Resource Suggestions values when successfully loaded', () => {
        const test = learningResourceSuggestionsReducer(emptyState, {
            type: actions.LEARNING_RESOURCE_SUGGESTIONS_LOADED,
            payload: [],
        });
        expect(test).toEqual({
            ...emptyState,
            CRsuggestions: [],
            CRsuggestionsError: null,
            CRsuggestionsLoading: false,
        });
    });

    it('should handle clearing the Learning Resource Suggestions', () => {
        const test = learningResourceSuggestionsReducer(emptyState, {
            type: actions.LEARNING_RESOURCE_SUGGESTIONS_CLEAR,
        });
        expect(test).toEqual({
            ...emptyState,
        });
    });

    it('should set Learning Resource Suggestions Status flags to loading when loading', () => {
        const test = learningResourceSuggestionsReducer(emptyState, {
            type: actions.LEARNING_RESOURCE_SUGGESTIONS_LOADING,
        });
        expect(test).toEqual({
            ...emptyState,
            CRsuggestions: null,
            CRsuggestionsError: null,
            CRsuggestionsLoading: true,
        });
    });
});
