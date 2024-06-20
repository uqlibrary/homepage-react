import dlorTeamDeleteReducer, { initialState } from './dlorTeamDeleteReducer';
import * as actions from '../actions/actionTypes';

describe('dlor delete team reducer', () => {
    let emptyState;
    let mockDlorEntry;

    beforeEach(() => {
        mockDlorEntry = {};
        emptyState = {
            ...initialState,
        };
    });

    it('should set dlor values when team successfully deleted', () => {
        const test = dlorTeamDeleteReducer(emptyState, { type: actions.DLOR_TEAM_DELETED, payload: mockDlorEntry });
        expect(test).toEqual({
            ...emptyState,
            dlorTeamDeleted: mockDlorEntry,
            dlorTeamDeleting: false,
            dlorTeamDeleteError: false,
        });
    });

    it('should set dlor values when team successfully deleted', () => {
        const test = dlorTeamDeleteReducer(emptyState, { type: actions.DLOR_TEAM_DELETED, payload: mockDlorEntry });
        expect(test).toEqual({
            ...emptyState,
            dlorTeamDeleted: mockDlorEntry,
            dlorTeamDeleting: false,
            dlorTeamDeleteError: false,
        });
    });

    it('should handle a failing Dlor team delete API call', () => {
        const test = dlorTeamDeleteReducer(emptyState, {
            type: actions.DLOR_TEAM_DELETE_FAILED,
            payload: 'failed!',
        });
        expect(test).toEqual({
            ...emptyState,
            dlorTeamDeleting: false,
            dlorTeamDeleteError: 'failed!',
        });
    });
});
