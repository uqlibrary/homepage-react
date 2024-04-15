import * as actions from 'data/actions/actionTypes';

export const initialState = {
    dlorTeamLoading: null,
    dlorTeamError: null,
    dlorTeam: null,
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

export default function dlorTeamReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    const handler1 = handler(state, action);
    console.log('reducer dlorTeamReducer:', action.type, handler1);
    return handler1;
}
