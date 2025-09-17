import * as actions from 'data/actions/actionTypes';

export const initialState = {
    siteList: null,
    siteListLoading: null,
    siteListError: null,
};

const handlers = {
    [actions.SPACES_SITE_LIST_LOADING]: state => ({
        ...initialState,
        ...state,
        siteListLoading: true,
        siteListError: null,
    }),
    [actions.SPACES_SITE_LIST_LOADED]: (state, action) => ({
        ...initialState,
        ...state,
        siteListLoading: false,
        siteListError: false,
        siteList: action.payload,
    }),
    [actions.SPACES_SITE_LIST_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        siteListLoading: false,
        siteListError: action.payload,
    }),
};

export default function bookableSpaceLocationReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
