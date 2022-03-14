import { initialState } from './examSuggestionReducer';
import * as actions from '../actions/actionTypes';
import { examSuggestionReducer } from './index';

describe('account reducer', () => {
    let emptyState;

    beforeEach(() => {
        emptyState = {
            ...initialState,
        };
    });

    it('should handle a failing Exams API call', () => {
        const test = examSuggestionReducer(emptyState, {
            type: actions.EXAM_SUGGESTIONS_FAILED,
            payload: 'failed!',
        });
        expect(test).toEqual({
            ...emptyState,
            examSearchListLoading: false,
            examSearchListError: 'failed!',
        });
    });

    it('should handle clearing the exams', () => {
        const test = examSuggestionReducer(emptyState, { type: actions.EXAM_SUGGESTIONS_CLEAR });
        expect(test).toEqual({
            ...emptyState,
        });
    });

    it('should set exams values when successfully loaded', () => {
        const test = examSuggestionReducer(emptyState, {
            type: actions.EXAM_SUGGESTIONS_LOADED,
            payload: [],
        });
        expect(test).toEqual({
            ...emptyState,
            examSearchList: [],
            examSearchListError: false,
            examSearchListLoading: false,
        });
    });

    it('should set exams Status flags to loading when loading', () => {
        const test = examSuggestionReducer(emptyState, {
            type: actions.EXAM_SUGGESTIONS_LOADING,
        });
        expect(test).toEqual({
            ...emptyState,
            examSearchList: null,
            examSearchListError: false,
            examSearchListLoading: true,
        });
    });
});
