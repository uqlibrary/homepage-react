import * as actions from 'data/actions/actionTypes';

export const initialState = {
    journalSearchList: [],
    journalSearchLoading: false,
    journalSearchError: null,
};

const handlers = {
    [actions.JOURNAL_SEARCH_LOADING]: state => ({
        ...initialState,
        ...state,
        journalSearchList: null,
        journalSearchLoading: true,
        journalSearchError: null,
    }),
    [actions.JOURNAL_SEARCH_LOADED]: (state, action) => ({
        ...initialState,
        ...state,
        journalSearchList: action.payload,
        journalSearchLoading: true,
        journalSearchError: null,
    }),
    [actions.JOURNAL_SEARCH_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        journalSearchLoading: false,
        journalSearchError: action.payload,
    }),
};

export default function journalSearchReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
