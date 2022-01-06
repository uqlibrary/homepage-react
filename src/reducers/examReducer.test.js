import examReducer, { initialState } from './examReducer';
import * as actions from '../actions/actionTypes';

describe('account reducer', () => {
    let emptyState;

    beforeEach(() => {
        emptyState = {
            ...initialState,
        };
    });

    it('should handle a failing Exams API call', () => {
        const test = examReducer(emptyState, {
            type: actions.EXAMS_FAILED,
            payload: 'failed!',
        });
        expect(test).toEqual({
            ...emptyState,
            examListLoading: false,
            examListError: 'failed!',
        });
    });

    it('should handle clearing the exams', () => {
        const test = examReducer(emptyState, { type: actions.EXAMS_CLEAR });
        expect(test).toEqual({
            ...emptyState,
        });
    });

    it('should set exams values when successfully loaded', () => {
        const test = examReducer(emptyState, {
            type: actions.EXAMS_LOADED,
            payload: [],
        });
        expect(test).toEqual({
            ...emptyState,
            examList: [],
            examListError: false,
            examListLoading: false,
        });
    });

    it('should set exams Status flags to loading when loading', () => {
        const test = examReducer(emptyState, {
            type: actions.EXAMS_LOADING,
        });
        expect(test).toEqual({
            ...emptyState,
            examList: null,
            examListError: false,
            examListLoading: true,
        });
    });
});
