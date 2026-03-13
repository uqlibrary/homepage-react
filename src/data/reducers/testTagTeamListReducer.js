import * as actions from 'data/actions/actionTypes';

export const initialState = {
    teamList: [],
    teamListLoading: false,
    teamListLoaded: false,
    teamListError: null,
};

const handlers = {
    [actions.TESTTAG_TEAM_LIST_LOADING]: state => ({
        ...initialState,
        ...state,
        teamListLoading: true,
        teamListLoaded: false,
        teamListError: null,
    }),
    [actions.TESTTAG_TEAM_LIST_LOADED]: (state, action) => ({
        ...initialState,
        ...state,
        teamList: action?.payload ?? [],
        teamListLoading: false,
        teamListLoaded: true,
        teamListError: null,
    }),
    [actions.TESTTAG_TEAM_LIST_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        teamListLoading: false,
        teamListLoaded: false,
        teamListError: action?.payload ?? null,
    }),
    [actions.TESTTAG_TEAM_LIST_UPDATING]: state => ({
        ...initialState,
        ...state,
        teamListLoading: true,
        teamListLoaded: false,
        teamListError: null,
    }),
    [actions.TESTTAG_TEAM_LIST_UPDATED]: state => ({
        ...initialState,
        ...state,
        teamListLoading: false,
        teamListLoaded: false,
        teamListError: null,
    }),
    [actions.TESTTAG_TEAM_LIST_UPDATE_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        teamListLoading: false,
        teamListLoaded: false,
        teamListError: action.payload,
    }),
    [actions.TESTTAG_TEAM_LIST_ADDING]: state => ({
        ...initialState,
        ...state,
        teamListLoading: true,
        teamListLoaded: false,
        teamListError: null,
    }),
    [actions.TESTTAG_TEAM_LIST_ADDED]: state => ({
        ...initialState,
        ...state,
        teamListLoading: false,
        teamListLoaded: false,
        teamListError: null,
    }),
    [actions.TESTTAG_TEAM_LIST_ADD_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        teamListLoading: false,
        teamListLoaded: false,
        teamListError: action.payload,
    }),
    [actions.TESTTAG_TEAM_LIST_DELETING]: state => ({
        ...initialState,
        ...state,
        teamListLoading: true,
        teamListLoaded: false,
        teamListError: null,
    }),
    [actions.TESTTAG_TEAM_LIST_DELETED]: state => ({
        ...initialState,
        ...state,
        teamListLoading: false,
        teamListLoaded: false,
        teamListError: null,
    }),
    [actions.TESTTAG_TEAM_LIST_DELETE_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        teamListLoading: false,
        teamListLoaded: false,
        teamListError: action.payload,
    }),
    [actions.TESTTAG_TEAM_LIST_CLEAR_ERROR]: state => ({
        ...initialState,
        ...state,
        teamListError: null,
    }),
};

export default function testTagTeamListReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
