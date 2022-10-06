import examSearchReducer, { initialState } from './examSearchReducer';
import { EXAM_SEARCH_CLEAR, EXAM_SEARCH_FAILED, EXAM_SEARCH_LOADED, EXAM_SEARCH_LOADING } from '../actions/actionTypes';

describe('account reducer', () => {
    let emptyState;

    beforeEach(() => {
        emptyState = {
            ...initialState,
        };
    });

    it('should set exams Status flags to loading when loading', () => {
        const test = examSearchReducer(emptyState, {
            type: EXAM_SEARCH_LOADING,
        });
        expect(test).toEqual({
            ...emptyState,
            examSearchList: null,
            examSearchListError: false,
            examSearchListLoading: true,
        });
    });

    it('should set exams values when successfully loaded', () => {
        const test = examSearchReducer(emptyState, {
            type: EXAM_SEARCH_LOADED,
            payload: [],
        });
        expect(test).toEqual({
            ...emptyState,
            examSearchList: [],
            examSearchListError: false,
            examSearchListLoading: false,
        });
    });

    it('should handle clearing the exams', () => {
        const test = examSearchReducer(emptyState, { type: EXAM_SEARCH_CLEAR });
        expect(test).toEqual({
            ...emptyState,
        });
    });

    it('should handle a failing Exams API call', () => {
        const test = examSearchReducer(emptyState, {
            type: EXAM_SEARCH_FAILED,
            payload: 'failed!',
        });
        expect(test).toEqual({
            ...emptyState,
            examSearchListLoading: false,
            examSearchListError: 'failed!',
        });
    });
});
