import spotlightsReducer, { initialState } from './spotlightsReducer';
import * as actions from '../actions/actionTypes';

describe('spotlights reducer', () => {
    let emptyState;
    let mockSpotlightList;

    beforeEach(() => {
        mockSpotlightList = [{}];
        emptyState = {
            ...initialState,
        };
    });

    it('should set spotlights Status flags to loading when loading spotlights', () => {
        const test = spotlightsReducer(emptyState, { type: actions.SPOTLIGHTS_LOADING });
        expect(test).toEqual({
            ...emptyState,
            spotlights: null,
            spotlightsLoading: true,
            spotlightsError: false,
        });
    });

    it('should set spotlights value when successfully loaded', () => {
        const test = spotlightsReducer(emptyState, { type: actions.SPOTLIGHTS_LOADED, payload: mockSpotlightList });
        expect(test).toEqual({
            ...emptyState,
            spotlights: mockSpotlightList,
            spotlightsLoading: false,
            spotlightsError: false,
        });
    });

    it('should handle a failing Spotlights API call', () => {
        const test = spotlightsReducer(emptyState, {
            type: actions.SPOTLIGHTS_FAILED,
            payload: 'failed!',
        });
        expect(test).toEqual({
            ...emptyState,
            spotlightsLoading: false,
            spotlightsError: 'failed!',
        });
    });

    it('should handle clearing the spotlights', () => {
        const test = spotlightsReducer(emptyState, { type: actions.SPOTLIGHTS_CLEAR });
        expect(test).toEqual({
            ...emptyState,
        });
    });
});
