import dlorTeamListReducer, { initialState } from './dlorTeamListReducer';
import * as actions from '../actions/actionTypes';

describe('dlor team list reducer', () => {
    let emptyState;
    let mockDlorTeamList;

    beforeEach(() => {
        mockDlorTeamList = [{}];
        emptyState = {
            ...initialState,
        };
    });

    it('should set dlor values when team list loading', () => {
        const test = dlorTeamListReducer(emptyState, { type: actions.DLOR_TEAMLIST_LOADING });
        expect(test).toEqual({
            // ...emptyState,
            dlorTeamList: null,
            dlorTeamListLoading: true,
            dlorTeamListError: false,
        });
    });

    it('should set dlor values when team list successfully loaded', () => {
        const test = dlorTeamListReducer(emptyState, { type: actions.DLOR_TEAMLIST_LOADED, payload: mockDlorTeamList });
        expect(test).toEqual({
            ...emptyState,
            dlorTeamList: mockDlorTeamList,
            dlorTeamListLoading: false,
            dlorTeamListError: false,
        });
    });

    it('should handle a failing Dlor API team list call', () => {
        const test = dlorTeamListReducer(emptyState, {
            type: actions.DLOR_TEAMLIST_FAILED,
            payload: 'failed!',
        });
        expect(test).toEqual({
            ...emptyState,
            dlorTeamListLoading: false,
            dlorTeamListError: 'failed!',
        });
    });
});
