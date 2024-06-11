import * as actions from 'data/actions/actionTypes';

export const initialState = {
    dlorTeamListLoading: null,
    dlorTeamListError: null,
    dlorTeamList: null,
};

const handlers = {
    [actions.DLOR_TEAMLIST_LOADING]: state => ({
        ...initialState,
        ...state,
        dlorTeamListLoading: true,
        dlorTeamListError: false,
    }),
    [actions.DLOR_TEAMLIST_LOADED]: (state, action) => ({
        ...initialState,
        ...state,
        dlorTeamListLoading: false,
        dlorTeamListError: false,
        dlorTeamList: action.payload,
    }),
    [actions.DLOR_TEAMLIST_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        dlorTeamListLoading: false,
        dlorTeamListError: action.payload,
    }),
};

export default function dlorTeamListReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    const handler1 = handler(state, action);
    console.log('reducer dlorTeamListReducer:', action.type, handler1);
    return handler1;
}
