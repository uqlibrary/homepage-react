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
});
