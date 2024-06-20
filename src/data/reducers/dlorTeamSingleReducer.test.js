import dlorTeamSingleReducer, { initialState } from './dlorTeamSingleReducer';
import * as actions from '../actions/actionTypes';

describe('dlor single team reducer', () => {
    let emptyState;
    let mockDlorEntry;

    beforeEach(() => {
        mockDlorEntry = {};
        emptyState = {
            ...initialState,
        };
    });

    it('should set dlor team when successfully loaded', () => {
        const test = dlorTeamSingleReducer(emptyState, { type: actions.DLOR_TEAM_LOADED, payload: mockDlorEntry });
        expect(test).toEqual({
            ...emptyState,
            dlorTeam: mockDlorEntry,
            dlorTeamLoading: false,
            dlorTeamError: false,
        });
    });

    it('should handle a failing dlor team load API call', () => {
        const test = dlorTeamSingleReducer(emptyState, {
            type: actions.DLOR_TEAM_FAILED,
            payload: 'failed!',
        });
        expect(test).toEqual({
            ...emptyState,
            dlorTeamLoading: false,
            dlorTeamError: 'failed!',
        });
    });

    it('should set dlor Status flags to loading when loading a single dlor team', () => {
        const test = dlorTeamSingleReducer(emptyState, { type: actions.DLOR_TEAM_LOADING });
        expect(test).toEqual({
            ...emptyState,
            dlorTeam: null,
            dlorTeamLoading: true,
            dlorTeamError: false,
        });
    });
});
