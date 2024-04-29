import dlorTeamReducer, { initialState } from './dlorListReducer';
import * as actions from '../actions/actionTypes';

describe.skip('dlor team list reducer', () => {
    let emptyState;
    let mockDlorTeamList;

    beforeEach(() => {
        mockDlorTeamList = [{}];
        emptyState = {
            ...initialState,
        };
    });

    it('should set dlor values when team loading', () => {
        const test = dlorTeamReducer(emptyState, { type: actions.DLOR_TEAM_LOADING });
        expect(test).toEqual({
            // ...emptyState,
            dlorTeam: null,
            dlorTeamLoading: true,
            dlorTeamError: null,
        });
    });

    it('should set dlor values when team successfully loaded', () => {
        const test = dlorTeamReducer(emptyState, { type: actions.DLOR_TEAM_LOADED, payload: mockDlorTeamList });
        expect(test).toEqual({
            ...emptyState,
            dlorTeam: mockDlorTeamList,
            dlorTeamLoading: false,
            dlorTeamError: false,
        });
    });

    it('should handle a failing Dlor API team call', () => {
        const test = dlorTeamReducer(emptyState, {
            type: actions.DLOR_TEAM_FAILED,
            payload: 'failed!',
        });
        expect(test).toEqual({
            ...emptyState,
            dlorTeamLoading: false,
            dlorTeamError: 'failed!',
        });
    });

    it('should set dlor Status flags to loading when loading dlor team', () => {
        const test = dlorTeamReducer(emptyState, { type: actions.DLOR_TEAM_LOADING });
        expect(test).toEqual({
            ...emptyState,
            dlorTeam: null,
            dlorTeamLoading: true,
            dlorTeamError: false,
        });
    });
});
