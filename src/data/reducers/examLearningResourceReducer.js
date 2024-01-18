import * as actions from 'data/actions/actionTypes';

export const initialState = {
    examLearningResourceList: null,
    examLearningResourceListLoading: false,
    examLearningResourceListError: null,
};

const handlers = {
    [actions.EXAMS_LEARNING_RESOURCES_LOADING]: state => ({
        ...initialState,
        ...state,
        examLearningResourceListLoading: true,
        examLearningResourceListError: false,
    }),
    [actions.EXAMS_LEARNING_RESOURCES_LOADED]: (state, action) => ({
        ...initialState,
        ...state,
        examLearningResourceListLoading: false,
        examLearningResourceListError: false,
        examLearningResourceList: action.payload,
    }),
    [actions.EXAMS_LEARNING_RESOURCES_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        examLearningResourceListLoading: false,
        examLearningResourceListError: action.payload,
    }),
    [actions.EXAMS_LEARNING_RESOURCES_CLEAR]: () => ({
        ...initialState,
    }),
};

export default function examLearningResourceReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    console.log('EX action: ', action.type, state, action);
    return handler(state, action);
}
