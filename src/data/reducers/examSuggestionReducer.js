import * as actions from 'data/actions/actionTypes';

export const initialState = {
    examSuggestionList: null,
    examSuggestionListLoading: false,
    examSuggestionListError: null,
};

const handlers = {
    [actions.EXAM_SUGGESTIONS_LOADING]: state => ({
        ...initialState,
        ...state,
        examSuggestionListLoading: true,
        examSuggestionListError: false,
    }),
    [actions.EXAM_SUGGESTIONS_LOADED]: (state, action) => ({
        ...initialState,
        ...state,
        examSuggestionListLoading: false,
        examSuggestionListError: false,
        examSuggestionList: action.payload,
    }),
    [actions.EXAM_SUGGESTIONS_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        examSuggestionListLoading: false,
        examSuggestionListError: action.payload,
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
