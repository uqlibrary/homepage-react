import * as actions from 'actions/actionTypes';

export const initialState = {
    examSearchList: null,
    examSearchListLoading: false,
    examSearchListError: null,
};

const handlers = {
    [actions.EXAM_SUGGESTIONS_LOADING]: state => ({
        ...initialState,
        ...state,
        examSearchListLoading: true,
        examSearchListError: false,
    }),
    [actions.EXAM_SUGGESTIONS_LOADED]: (state, action) => ({
        ...initialState,
        ...state,
        examSearchListLoading: false,
        examSearchListError: false,
        examSearchList: action.payload,
    }),
    [actions.EXAM_SUGGESTIONS_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        examSearchListLoading: false,
        examSearchListError: action.payload,
    }),
    [actions.EXAM_SUGGESTIONS_CLEAR]: () => ({
        ...initialState,
    }),
};

export default function examSuggestionReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
