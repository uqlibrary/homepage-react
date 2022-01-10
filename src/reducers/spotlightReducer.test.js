import spotlightReducer, { initialState } from './spotlightReducer';
import * as actions from '../actions/actionTypes';
import accountReducer from './account';
import spotlightsReducer from './spotlightsReducer';

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

    it('should set saving spotlights flag to true when saving spotlights', () => {
        const test = spotlightReducer(emptyState, { type: 'SPOTLIGHT_SAVING' });
        expect(test).toEqual({
            ...emptyState,
            spotlightStatus: 'saving',
            spotlightError: false,
        });
    });

    it('should set spotlight Status flags to loading when loading spotlight', () => {
        const test = spotlightReducer(emptyState, { type: actions.SPOTLIGHT_LOADING });
        expect(test).toEqual({
            ...emptyState,
            spotlight: null,
            spotlightStatus: 'loading',
            spotlightError: false,
        });
    });
});
