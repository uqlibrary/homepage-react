import dlorGetSingleReducer, { initialState } from './dlorGetSingleReducer';
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
        const test = dlorGetSingleReducer(emptyState, { type: actions.DLOR_DETAIL_LOADED, payload: mockDlorEntry });
        expect(test).toEqual({
            ...emptyState,
            dlorItem: mockDlorEntry,
            dlorItemLoading: false,
            dlorItemError: false,
        });
    });

    it('should handle a failing Dlor load API call', () => {
        const test = dlorGetSingleReducer(emptyState, {
            type: actions.DLOR_DETAIL_FAILED,
            payload: 'failed!',
        });
        expect(test).toEqual({
            ...emptyState,
            dlorItemLoading: false,
            dlorItemError: 'failed!',
        });
    });

    it('should set dlor Status flags to loading when loading dlor', () => {
        const test = dlorGetSingleReducer(emptyState, { type: actions.DLOR_DETAIL_LOADING });
        expect(test).toEqual({
            ...emptyState,
            dlorItem: null,
            dlorItemLoading: true,
            dlorItemError: false,
        });
    });

    it('should set dlor values when successfully created', () => {
        const test = dlorGetSingleReducer(emptyState, { type: actions.DLOR_CREATED, payload: mockDlorEntry });
        expect(test).toEqual({
            ...emptyState,
            dlorItem: mockDlorEntry,
            dlorItemCreating: false,
            dlorItemError: false,
        });
    });

    it('should handle a failing Dlor load API call', () => {
        const test = dlorGetSingleReducer(emptyState, {
            type: actions.DLOR_CREATE_FAILED,
            payload: 'failed!',
        });
        expect(test).toEqual({
            ...emptyState,
            dlorItemCreating: false,
            dlorItemError: 'failed!',
        });
    });
});
