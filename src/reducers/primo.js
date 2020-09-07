import * as actions from 'actions/actionTypes';

export const initialState = {
    suggestions: null,
    suggestionsLoading: false,
    suggestionsError: null,
};

const handlers = {
    [actions.PRIMO_SUGGESTIONS_LOADING]: state => ({
        ...initialState,
        ...state,
        suggestionsLoading: true,
    }),
    [actions.PRIMO_SUGGESTIONS_LOADED]: (state, action) => ({
        ...initialState,
        ...state,
        suggestionsLoading: false,
        suggestions: action.payload,
    }),
    [actions.PRIMO_SUGGESTIONS_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        suggestionsLoading: false,
        suggestionsError: action.payload,
    }),
};

export default function primoReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
