import * as actions from 'data/actions/actionTypes';

export const initialState = {
    dlorTeam: null,
    dlorTeamLoading: null,
    dlorTeamError: null,
};

const handlers = {
    [actions.DLOR_TEAM_LOADING]: state => ({
        ...initialState,
        ...state,
        dlorTeamLoading: true,
        dlorTeamError: false,
    }),
    [actions.DLOR_TEAM_LOADED]: (state, action) => ({
        ...initialState,
        ...state,
        dlorTeamLoading: false,
        dlorTeamError: false,
        dlorTeam: action.payload,
    }),
    [actions.DLOR_TEAM_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        dlorTeamLoading: false,
        dlorTeamError: action.payload,
    }),
};

export default function dlorTeamSingleReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
