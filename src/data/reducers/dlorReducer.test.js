import dlorListReducer, { initialState } from './dlorListReducer';
import * as actions from '../actions/actionTypes';

describe('dlor list reducer', () => {
    let emptyState;
    let mockDlorList;

    beforeEach(() => {
        mockDlorList = [{}];
        emptyState = {
            ...initialState,
        };
    });

    it('should set dlor values when successfully loaded', () => {
        const test = dlorListReducer(emptyState, { type: actions.DLOR_LIST_LOADED, payload: mockDlorList });
        expect(test).toEqual({
            ...emptyState,
            dlorList: mockDlorList,
            dlorListLoading: false,
            dlorListError: false,
        });
    });

    it('should handle a failing Dlor API call', () => {
        const test = dlorListReducer(emptyState, {
            type: actions.DLOR_LIST_FAILED,
            payload: 'failed!',
        });
        expect(test).toEqual({
            ...emptyState,
            dlorListLoading: false,
            dlorListError: 'failed!',
        });
    });

    it('should set dlor Status flags to loading when loading dlor', () => {
        const test = dlorListReducer(emptyState, { type: actions.DLOR_LIST_LOADING });
        expect(test).toEqual({
            ...emptyState,
            dlorList: null,
            dlorListLoading: true,
            dlorListError: false,
        });
    });
});
