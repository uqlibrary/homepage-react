import * as actions from 'data/actions/actionTypes';

export const initialState = {
    examSearchList: null,
    examSearchListLoading: false,
    examSearchListError: null,
};

const handlers = {
    [actions.EXAM_SEARCH_LOADING]: state => ({
        ...initialState,
        ...state,
        examSearchListLoading: true,
        examSearchListError: false,
    }),
    [actions.EXAM_SEARCH_LOADED]: (state, action) => ({
        ...initialState,
        ...state,
        examSearchListLoading: false,
        examSearchListError: false,
        examSearchList: action.payload,
    }),
    [actions.EXAM_SEARCH_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        examSearchListLoading: false,
        examSearchListError: action.payload,
    }),
    [actions.EXAM_SEARCH_CLEAR]: () => ({
        ...initialState,
    }),
};

export default function examSearchReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
