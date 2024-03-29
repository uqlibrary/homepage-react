import * as actions from 'data/actions/actionTypes';

export const initialState = {
    userList: [],
    userListLoading: false,
    userListLoaded: false,
    userListError: null,
};

const handlers = {
    [actions.TESTTAG_USER_LIST_LOADING]: state => ({
        ...initialState,
        ...state,
        userListLoading: true,
        userListLoaded: false,
        userListError: null,
    }),
    [actions.TESTTAG_USER_LIST_LOADED]: (state, action) => ({
        ...initialState,
        ...state,
        userList: action?.payload ?? [],
        userListLoading: false,
        userListLoaded: true,
        userListError: null,
    }),
    [actions.TESTTAG_USER_LIST_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        userListLoading: false,
        userListLoaded: false,
        userListError: action?.payload ?? null,
    }),
    [actions.TESTTAG_USER_LIST_UPDATING]: state => ({
        ...initialState,
        ...state,
        userListLoading: true,
        userListLoaded: false,
        userListError: null,
    }),
    [actions.TESTTAG_USER_LIST_UPDATED]: state => ({
        ...initialState,
        ...state,
        userListLoading: false,
        userListLoaded: false,
        userListError: null,
    }),
    [actions.TESTTAG_USER_LIST_UPDATE_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        userListLoading: false,
        userListLoaded: false,
        userListError: action.payload,
    }),
    [actions.TESTTAG_USER_LIST_ADDING]: state => ({
        ...initialState,
        ...state,
        userListLoading: true,
        userListLoaded: false,
        userListError: null,
    }),
    [actions.TESTTAG_USER_LIST_ADDED]: state => ({
        ...initialState,
        ...state,
        userListLoading: false,
        userListLoaded: false,
        userListError: null,
    }),
    [actions.TESTTAG_USER_LIST_ADD_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        userListLoading: false,
        userListLoaded: false,
        userListError: action.payload,
    }),
    [actions.TESTTAG_USER_LIST_DELETING]: state => ({
        ...initialState,
        ...state,
        userListLoading: true,
        userListLoaded: false,
        userListError: null,
    }),
    [actions.TESTTAG_USER_LIST_DELETED]: state => ({
        ...initialState,
        ...state,
        userListLoading: false,
        userListLoaded: false,
        userListError: null,
    }),
    [actions.TESTTAG_USER_LIST_DELETE_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        userListLoading: false,
        userListLoaded: false,
        userListError: action.payload,
    }),
    [actions.TESTTAG_USER_LIST_CLEAR_ERROR]: state => ({
        ...initialState,
        ...state,
        userListError: null,
    }),
};

export default function testTagUserListReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
