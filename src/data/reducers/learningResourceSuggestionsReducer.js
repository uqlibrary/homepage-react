import * as actions from 'data/actions/actionTypes';

export const initialState = {
    CRsuggestions: null,
    CRsuggestionsLoading: false,
    CRsuggestionsError: null,
};

const handlers = {
    [actions.LEARNING_RESOURCE_SUGGESTIONS_LOADING]: state => ({
        ...initialState,
        ...state,
        CRsuggestionsLoading: true,
    }),
    [actions.LEARNING_RESOURCE_SUGGESTIONS_LOADED]: (state, action) => ({
        ...initialState,
        ...state,
        CRsuggestionsLoading: false,
        CRsuggestions: action.payload,
    }),
    [actions.LEARNING_RESOURCE_SUGGESTIONS_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        CRsuggestionsLoading: false,
        CRsuggestionsError: action.payload,
    }),
    [actions.LEARNING_RESOURCE_SUGGESTIONS_CLEAR]: () => ({
        ...initialState,
    }),
};

export default function learningResourceSuggestionsReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
