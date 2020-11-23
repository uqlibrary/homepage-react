import * as actions from 'actions/actionTypes';

export const initialState = {
    examList: null,
    examListLoading: false,
    examListError: null,
};

const handlers = {
    [actions.EXAMS_LOADING]: state => ({
        ...initialState,
        ...state,
        examListLoading: true,
    }),
    [actions.EXAMS_LOADED]: (state, action) => ({
        ...initialState,
        ...state,
        examListLoading: false,
        examList: action.payload,
    }),
    [actions.EXAMS_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        examListLoading: false,
        examListError: action.payload,
    }),
    [actions.EXAMS_CLEAR]: () => ({
        ...initialState,
    }),
};

export default function examReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
