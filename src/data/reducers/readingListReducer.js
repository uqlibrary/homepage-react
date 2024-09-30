import * as actions from 'data/actions/actionTypes';

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
        readingListError: false,
        readingList: action.payload,
    }),
    [actions.READING_LIST_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        readingListLoading: false,
        readingListError: action.payload,
        readingList: null,
    }),
    [actions.READING_LIST_CLEAR]: () => ({
        ...initialState,
    }),
};

export default function readingListReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (
        !handler
        // || (state.readingList === undefined && state.readingListLoading === false && state.readingListError === false)
    ) {
        // console.log('action: NOPE ', action.type);
        return state;
    }
    return handler(state, action);
}
