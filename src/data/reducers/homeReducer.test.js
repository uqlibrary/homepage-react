import homeReducer, { initialState } from './homeReducer';
import * as actions from '../actions/actionTypes';

describe('account reducer', () => {
    let emptyState;

    beforeEach(() => {
        emptyState = {
            ...initialState,
        };
    });

    it('should set Possible publications values when successfully loaded', () => {
        const test = homeReducer(emptyState, {
            type: actions.POSSIBLY_YOUR_PUBLICATIONS_LOADED,
            payload: [],
        });
        expect(test).toEqual({
            ...emptyState,
            possibleRecords: [],
            possibleRecordsLoading: false,
        });
    });

    it('should set Possible publications Status flags to loading when loading', () => {
        const test = homeReducer(emptyState, {
            type: actions.POSSIBLY_YOUR_PUBLICATIONS_LOADING,
        });
        expect(test).toEqual({
            ...emptyState,
            possibleRecords: null,
            possibleRecordsLoading: true,
        });
    });

    it('should handle a failing Possible publications API call', () => {
        const test = homeReducer(emptyState, {
            type: actions.POSSIBLY_YOUR_PUBLICATIONS_FAILED,
        });
        expect(test).toEqual({
            ...emptyState,
            possibleRecordsLoading: false,
            possibleRecords: null,
        });
    });

    it('should set Incomplete NTRO publications values when successfully loaded', () => {
        const test = homeReducer(emptyState, {
            type: actions.INCOMPLETE_NTRO_PUBLICATIONS_LOADED,
            payload: [],
        });
        expect(test).toEqual({
            ...emptyState,
            incompleteNTRO: [],
            incompleteNTROLoading: false,
        });
    });

    it('should set Incomplete NTRO publications Status flags to loading when loading', () => {
        const test = homeReducer(emptyState, {
            type: actions.INCOMPLETE_NTRO_PUBLICATIONS_LOADING,
        });
        expect(test).toEqual({
            ...emptyState,
            incompleteNTRO: null,
            incompleteNTROLoading: true,
        });
    });

    it('should handle a failing Incomplete NTRO Publications API call', () => {
        const test = homeReducer(emptyState, {
            type: actions.INCOMPLETE_NTRO_PUBLICATIONS_FAILED,
        });
        expect(test).toEqual({
            ...emptyState,
            incompleteNTROLoading: false,
            incompleteNTRO: null,
        });
    });
});
