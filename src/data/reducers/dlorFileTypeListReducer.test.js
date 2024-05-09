import dlorFileTypeListReducer, { initialState } from './dlorFileTypeListReducer';
import * as actions from '../actions/actionTypes';

describe('dlor file type list reducer', () => {
    let emptyState;
    let mockDlorFileTypeList;

    beforeEach(() => {
        mockDlorFileTypeList = [{}];
        emptyState = {
            ...initialState,
        };
    });

    it('should set dlor values when file type list loading', () => {
        const test = dlorFileTypeListReducer(emptyState, { type: actions.DLOR_FILETYPE_LOADING });
        expect(test).toEqual({
            // ...emptyState,
            dlorFileTypeList: null,
            dlorFileTypeListLoading: true,
            dlorFileTypeListError: false,
        });
    });

    it('should set dlor values when file type list successfully loaded', () => {
        const test = dlorFileTypeListReducer(emptyState, {
            type: actions.DLOR_FILETYPE_LOADED,
            payload: mockDlorFileTypeList,
        });
        expect(test).toEqual({
            ...emptyState,
            dlorFileTypeList: mockDlorFileTypeList,
            dlorFileTypeListLoading: false,
            dlorFileTypeListError: false,
        });
    });

    it('should handle a failing Dlor API file type list call', () => {
        const test = dlorFileTypeListReducer(emptyState, {
            type: actions.DLOR_FILETYPE_FAILED,
            payload: 'failed!',
        });
        expect(test).toEqual({
            ...emptyState,
            dlorFileTypeListLoading: false,
            dlorFileTypeListError: 'failed!',
        });
    });

    it('should set dlor Status flags to loading when loading dlor file type list', () => {
        const test = dlorFileTypeListReducer(emptyState, { type: actions.DLOR_FILETYPE_LOADING });
        expect(test).toEqual({
            ...emptyState,
            dlorFileTypeList: null,
            dlorFileTypeListLoading: true,
            dlorFileTypeListError: false,
        });
    });
});
