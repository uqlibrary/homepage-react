import spotlightCurrentReducer, { initialState } from './spotlightsCurrentReducer';
import * as actions from '../actions/actionTypes';

describe('current spotlight reducer', () => {
    let emptyState;

    beforeEach(() => {
        emptyState = {
            ...initialState,
        };
    });

    it('should handle a failing Spotlights API call', () => {
        const test = spotlightCurrentReducer(emptyState, {
            type: actions.SPOTLIGHTS_CURRENT_FAILED,
            payload: 'failed!',
        });
        expect(test).toEqual({
            ...emptyState,
            currentSpotlightsLoading: false,
            currentSpotlightsError: 'failed!',
        });
    });
});
