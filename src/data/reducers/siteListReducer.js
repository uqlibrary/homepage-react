import * as actions from 'data/actions/actionTypes';

export const initialState = {
    siteList: null,
    siteListLoading: false,
    siteListError: null,
};

const handlers = {
    [actions.TESTTAG_SITE_LIST_LOADING]: state => ({
        ...initialState,
        ...state,
        siteListLoading: true,
        siteListError: false,
    }),
    [actions.TESTTAG_SITE_LIST_LOADED]: (state, action) => {
        console.log('SITE ACTION', action);
        return {
            ...initialState,
            ...state,
            siteListLoading: false,
            siteListError: false,
            siteList: action.payload,
        };
    },
    [actions.TESTTAG_SITE_LIST_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        siteListLoading: false,
        siteListError: action.payload,
    }),
    [actions.TESTTAG_SITE_LIST_CLEAR]: () => ({
        ...initialState,
    }),
};

export default function siteListReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
