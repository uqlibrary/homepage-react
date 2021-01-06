import homeReducer, { initialState } from './homeIndex';
import * as actions from '../actions/actionTypes';

describe('account reducer', () => {
    let emptyState;

    beforeEach(() => {
        emptyState = {
            ...initialState,
        };
    });

    it('should handle a failing Spotlights API call', () => {
        const test = homeReducer(emptyState, {
            type: actions.SPOTLIGHTS_FAILED,
            payload: 'failed!',
        });
        expect(test).toEqual({
            ...emptyState,
            spotlightsLoading: false,
            spotlightsError: 'failed!',
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
