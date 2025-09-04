import * as actions from 'data/actions/actionTypes';

export const initialState = {
    dlorKeywords: [],
    dlorKeywordsLoading: false,
    dlorKeywordsError: false,
};

const handlers = {
    [actions.DLOR_KEYWORDS_LOADING]: state => ({
        ...initialState,
        ...state,
        dlorKeywordsLoading: true,
        dlorKeywordsError: false,
    }),
    [actions.DLOR_KEYWORDS_LOADED]: (state, action) => ({
        ...initialState,
        ...state,
        dlorKeywordsLoading: false,
        dlorKeywordsError: false,
        dlorKeywords: action.payload,
    }),
    [actions.DLOR_KEYWORDS_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        dlorKeywordsLoading: false,
        dlorKeywords: action.payload,
    }),
};

export default function dlorKeywordsReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
