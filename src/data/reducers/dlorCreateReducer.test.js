import dlorCreateReducer, { initialState } from './dlorCreateReducer';
import * as actions from '../actions/actionTypes';

describe('dlor create reducer', () => {
    let emptyState;
    let mockDlorEntry;

    beforeEach(() => {
        mockDlorEntry = {};
        emptyState = {
            ...initialState,
        };
    });

    it('should set dlor values when successfully created', () => {
        const test = dlorCreateReducer(emptyState, { type: actions.DLOR_CREATED, payload: mockDlorEntry });
        expect(test).toEqual({
            ...emptyState,
            dlorCreatedItem: mockDlorEntry,
            dlorItemCreating: false,
            dlorCreatedItemError: false,
        });
    });

    it('should set dlor values when successfully created', () => {
        const test = dlorCreateReducer(emptyState, { type: actions.DLOR_CREATED, payload: mockDlorEntry });
        expect(test).toEqual({
            ...emptyState,
            dlorCreatedItem: mockDlorEntry,
            dlorItemCreating: false,
            dlorCreatedItemError: false,
        });
    });

    it('should handle a failing Dlor load API call', () => {
        const test = dlorCreateReducer(emptyState, {
            type: actions.DLOR_CREATE_FAILED,
            payload: 'failed!',
        });
        expect(test).toEqual({
            ...emptyState,
            dlorItemCreating: false,
            dlorCreatedItemError: 'failed!',
        });
    });
});
