import * as actions from 'actions/actionTypes';

export const initialState = {
    CRsuggestions: null,
    CRsuggestionsLoading: false,
    CRsuggestionsError: null,
};

const handlers = {
    [actions.COURSE_RESOURCE_SUGGESTIONS_LOADING]: state => ({
        ...initialState,
        ...state,
        CRsuggestionsLoading: true,
    }),
    [actions.COURSE_RESOURCE_SUGGESTIONS_LOADED]: (state, action) => ({
        ...initialState,
        ...state,
        CRsuggestionsLoading: false,
        CRsuggestions: action.payload,
    }),
    [actions.COURSE_RESOURCE_SUGGESTIONS_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        CRsuggestionsLoading: false,
        CRsuggestionsError: action.payload,
    }),
    [actions.COURSE_RESOURCE_SUGGESTIONS_CLEAR]: () => ({
        ...initialState,
    }),
};

export default function courseResourceSuggestionsReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
