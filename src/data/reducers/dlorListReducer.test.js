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

describe('dlor team list reducer', () => {
    let emptyState;
    let mockDlorTeamList;

    beforeEach(() => {
        mockDlorTeamList = [{}];
        emptyState = {
            ...initialState,
        };
    });

    it('should set dlor values when successfully loaded', () => {
        const test = dlorListReducer(emptyState, { type: actions.DLOR_TEAM_LOADED, payload: mockDlorTeamList });
        expect(test).toEqual({
            ...emptyState,
            dlorTeam: mockDlorTeamList,
            dlorTeamLoading: false,
            dlorTeamError: false,
        });
    });

    it('should handle a failing Dlor API call', () => {
        const test = dlorListReducer(emptyState, {
            type: actions.DLOR_TEAM_FAILED,
            payload: 'failed!',
        });
        expect(test).toEqual({
            ...emptyState,
            dlorTeamLoading: false,
            dlorTeamError: 'failed!',
        });
    });

    it('should set dlor Status flags to loading when loading dlor', () => {
        const test = dlorListReducer(emptyState, { type: actions.DLOR_TEAM_LOADING });
        expect(test).toEqual({
            ...emptyState,
            dlorTeam: null,
            dlorTeamLoading: true,
            dlorTeamError: false,
        });
    });
});
