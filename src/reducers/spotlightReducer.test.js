import spotlightReducer, { initialState } from './spotlightReducer';
import * as actions from '../actions/actionTypes';
import { SPOTLIGHT_CREATED } from '../actions/actionTypes';

describe('spotlight reducer', () => {
    let emptyState;
    let mockSpotlightList;

    beforeEach(() => {
        mockSpotlightList = [{}];
        emptyState = {
            ...initialState,
        };
    });

    it('should set spotlight values when successfully loaded', () => {
        const test = spotlightReducer(emptyState, { type: actions.SPOTLIGHT_LOADED, payload: mockSpotlightList });
        expect(test).toEqual({
            ...emptyState,
            spotlight: mockSpotlightList,
            spotlightStatus: 'loaded',
            spotlightError: false,
        });
    });

    it('should set spotlights value when successfully created', () => {
        const test = spotlightReducer(emptyState, { type: actions.SPOTLIGHT_CREATED, payload: mockSpotlightList });
        expect(test).toEqual({
            ...emptyState,
            spotlight: mockSpotlightList,
            spotlightStatus: 'created',
            spotlightError: false,
        });
    });

    it('should set spotlights value when successfully saved', () => {
        const test = spotlightReducer(emptyState, { type: actions.SPOTLIGHT_SAVED, payload: mockSpotlightList });
        expect(test).toEqual({
            ...emptyState,
            spotlight: mockSpotlightList,
            spotlightStatus: 'saved',
            spotlightError: false,
        });
    });

    it('should set spotlights value when successfully deleted', () => {
        const test = spotlightReducer(emptyState, { type: actions.SPOTLIGHT_DELETED, payload: [] });
        expect(test).toEqual({
            ...emptyState,
            spotlight: [],
            spotlightStatus: 'deleted',
            spotlightError: false,
        });
    });

    it('should handle a failing Spotlight API call', () => {
        const test = spotlightReducer(emptyState, {
            type: actions.SPOTLIGHT_FAILED,
            payload: 'failed!',
        });
        expect(test).toEqual({
            ...emptyState,
            spotlightStatus: 'error',
            spotlightError: 'failed!',
        });
    });

    it('should handle clearing the spotlights', () => {
        const test = spotlightReducer(emptyState, { type: actions.SPOTLIGHT_CLEAR });
        expect(test).toEqual({
            ...emptyState,
        });
    });
});
