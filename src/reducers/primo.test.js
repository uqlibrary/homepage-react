import primoReducer, { initialState } from './primo';
import * as actions from '../actions/actionTypes';

describe('account reducer', () => {
    let emptyState;

    beforeEach(() => {
        emptyState = {
            ...initialState,
        };
    });

    it('should handle a failing Homepage Search API call', () => {
        const test = primoReducer(emptyState, {
            type: actions.PRIMO_SUGGESTIONS_FAILED,
            payload: 'failed!',
        });
        expect(test).toEqual({
            ...emptyState,
            suggestionsLoading: false,
            suggestionsError: 'failed!',
        });
    });
});
