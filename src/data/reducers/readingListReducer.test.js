import readingListReducer, { initialState } from './readingListReducer';
import * as actions from '../actions/actionTypes';

describe('account reducer', () => {
    let emptyState;

    beforeEach(() => {
        emptyState = {
            ...initialState,
        };
    });

    it('should handle a failing Reading List API call', () => {
        const test = readingListReducer(emptyState, {
            type: actions.READING_LIST_FAILED,
            payload: 'failed!',
        });
        expect(test).toEqual({
            ...emptyState,
            readingListLoading: false,
            readingListError: 'failed!',
        });
    });

    it('should handle clearing the Reading List', () => {
        const test = readingListReducer(emptyState, { type: actions.READING_LIST_CLEAR });
        expect(test).toEqual({
            ...emptyState,
        });
    });

    it('should set Reading List values when successfully loaded', () => {
        const test = readingListReducer(emptyState, {
            type: actions.READING_LIST_LOADED,
            payload: [],
        });
        expect(test).toEqual({
            ...emptyState,
            readingList: [],
            readingListError: false,
            readingListLoading: false,
        });
    });

    it('should set Reading List Status flags to loading when loading', () => {
        const test = readingListReducer(emptyState, {
            type: actions.READING_LIST_LOADING,
        });
        expect(test).toEqual({
            ...emptyState,
            readingList: null,
            readingListError: false,
            readingListLoading: true,
        });
    });
});
