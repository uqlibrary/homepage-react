import * as actions from 'data/actions/actionTypes';

export const initialState = {
    dlorTeamDeleting: null,
    dlorTeamDeleted: null,
    dlorTeamDeleteError: null,
};

const handlers = {
    [actions.DLOR_TEAM_DELETING]: state => ({
        ...initialState,
        ...state,
        dlorTeamDeleting: true,
        dlorTeamDeleteError: false,
    }),
    [actions.DLOR_TEAM_DELETED]: (state, action) => ({
        ...initialState,
        ...state,
        dlorTeamDeleting: false,
        dlorTeamDeleteError: false,
        dlorTeamDeleted: action.payload,
    }),
    [actions.DLOR_TEAM_DELETE_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        dlorTeamDeleting: false,
        dlorTeamDeleteError: action.payload,
    }),
};

export default function dlorTeamDeleteReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    const handler1 = handler(state, action);
    console.log('reducer dlorTeamDeleteReducer:', action.type, handler1);
    return handler1;
}
