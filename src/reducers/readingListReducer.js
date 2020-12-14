import * as actions from 'actions/actionTypes';

export const initialState = {
    readingList: null,
    readingListLoading: false,
    readingListError: null,
};

const handlers = {
    [actions.READING_LIST_LOADING]: state => ({
        ...initialState,
        ...state,
        readingListLoading: true,
        readingListError: false,
    }),
    [actions.READING_LIST_LOADED]: (state, action) => ({
        ...initialState,
        ...state,
        readingListLoading: false,
        readingList: action.payload,
        readingListError: false,
    }),
    [actions.READING_LIST_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        readingListLoading: false,
        readingListError: action.payload,
    }),
    [actions.READING_LIST_CLEAR]: () => ({
        ...initialState,
    }),
};

export default function readingListReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
