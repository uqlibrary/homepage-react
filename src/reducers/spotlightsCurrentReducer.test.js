import spotlightCurrentReducer, { initialState } from './spotlightsCurrentReducer';
import * as actions from '../actions/actionTypes';
import homeReducer from './homeReducer';

describe('current spotlight reducer', () => {
    let emptyState;

    beforeEach(() => {
        emptyState = {
            ...initialState,
        };
    });

    it('should handle a failing Spotlights API call', () => {
        const test = spotlightCurrentReducer(emptyState, {
            type: actions.SPOTLIGHTS_HOMEPAGE_FAILED,
            payload: 'failed!',
        });
        expect(test).toEqual({
            ...emptyState,
            currentSpotlightsLoading: false,
            currentSpotlightsError: 'failed!',
        });
    });

    it('should set Spotlights values when successfully loaded', () => {
        const test = spotlightCurrentReducer(emptyState, {
            type: actions.SPOTLIGHTS_HOMEPAGE_LOADED,
            payload: [],
        });
        expect(test).toEqual({
            ...emptyState,
            currentSpotlights: [],
            currentSpotlightsError: null,
            currentSpotlightsLoading: false,
        });
    });

    it('should set Spotlights Status flags to loading when loading', () => {
        const test = spotlightCurrentReducer(emptyState, {
            type: actions.SPOTLIGHTS_HOMEPAGE_LOADING,
        });
        expect(test).toEqual({
            ...emptyState,
            currentSpotlights: null,
            currentSpotlightsError: null,
            currentSpotlightsLoading: true,
        });
    });
});
