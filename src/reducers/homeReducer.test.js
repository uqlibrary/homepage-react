import homeReducer, { initialState } from './homeReducer';
import * as actions from '../actions/actionTypes';

describe('account reducer', () => {
    let emptyState;

    beforeEach(() => {
        emptyState = {
            ...initialState,
        };
    });

    it('should set Spotlights values when successfully loaded', () => {
        const test = homeReducer(emptyState, {
            type: actions.SPOTLIGHTS_HOMEPAGE_LOADED,
            payload: [],
        });
        expect(test).toEqual({
            ...emptyState,
            spotlightsCurrent: [],
            spotlightsCurrentError: null,
            spotlightsCurrentLoading: false,
        });
    });

    it('should set Spotlights Status flags to loading when loading', () => {
        const test = homeReducer(emptyState, {
            type: actions.SPOTLIGHTS_HOMEPAGE_LOADING,
        });
        expect(test).toEqual({
            ...emptyState,
            spotlightsCurrent: null,
            spotlightsCurrentError: null,
            spotlightsCurrentLoading: true,
        });
    });

    it('should handle a failing Spotlights API call', () => {
        const test = homeReducer(emptyState, {
            type: actions.SPOTLIGHTS_HOMEPAGE_FAILED,
            payload: 'failed!',
        });
        expect(test).toEqual({
            ...emptyState,
            spotlightsCurrentLoading: false,
            spotlightsCurrentError: 'failed!',
        });
    });

    it('should set Print balance values when successfully loaded', () => {
        const test = homeReducer(emptyState, {
            type: actions.PRINT_BALANCE_LOADED,
            payload: [],
        });
        expect(test).toEqual({
            ...emptyState,
            printBalance: [],
            printBalanceLoading: false,
        });
    });

    it('should set Print balance Status flags to loading when loading', () => {
        const test = homeReducer(emptyState, {
            type: actions.PRINT_BALANCE_LOADING,
        });
        expect(test).toEqual({
            ...emptyState,
            printBalance: null,
            printBalanceLoading: true,
        });
    });

    it('should handle a failing Print balance API call', () => {
        const test = homeReducer(emptyState, {
            type: actions.PRINT_BALANCE_FAILED,
        });
        expect(test).toEqual({
            ...emptyState,
            printBalanceLoading: false,
            printBalance: null,
        });
    });

    it('should set Loans values when successfully loaded', () => {
        const test = homeReducer(emptyState, {
            type: actions.LOANS_LOADED,
            payload: [],
        });
        expect(test).toEqual({
            ...emptyState,
            loans: [],
            loansLoading: false,
        });
    });

    it('should set Loans Status flags to loading when loading', () => {
        const test = homeReducer(emptyState, {
            type: actions.LOANS_LOADING,
        });
        expect(test).toEqual({
            ...emptyState,
            loans: null,
            loansLoading: true,
        });
    });

    it('should handle a failing Loans API call', () => {
        const test = homeReducer(emptyState, {
            type: actions.LOANS_FAILED,
        });
        expect(test).toEqual({
            ...emptyState,
            loansLoading: false,
            loans: null,
        });
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
