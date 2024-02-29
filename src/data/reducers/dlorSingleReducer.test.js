import dlorSingleReducer, { initialState } from './dlorSingleReducer';
import * as actions from '../actions/actionTypes';

describe('dlor single reducer', () => {
    let emptyState;
    let mockDlorEntry;

    beforeEach(() => {
        mockDlorEntry = {};
        emptyState = {
            ...initialState,
        };
    });

    it('should set dlor values when successfully loaded', () => {
        const test = dlorSingleReducer(emptyState, { type: actions.DLOR_VIEWPAGE_LOADED, payload: mockDlorEntry });
        expect(test).toEqual({
            ...emptyState,
            dlorItem: mockDlorEntry,
            dlorItemLoading: false,
            dlorItemError: false,
        });
    });

    it('should handle a failing Dlor API call', () => {
        const test = dlorSingleReducer(emptyState, {
            type: actions.DLOR_VIEWPAGE_FAILED,
            payload: 'failed!',
        });
        expect(test).toEqual({
            ...emptyState,
            dlorItemLoading: false,
            dlorItemError: 'failed!',
        });
    });

    it('should set dlor Status flags to loading when loading dlor', () => {
        const test = dlorSingleReducer(emptyState, { type: actions.DLOR_VIEWPAGE_LOADING });
        expect(test).toEqual({
            ...emptyState,
            dlorItem: null,
            dlorItemLoading: true,
            dlorItemError: false,
        });
    });
});
