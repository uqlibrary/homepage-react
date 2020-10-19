import * as actions from 'actions/actionTypes';

export const initialState = {
    learningResourcesList: null,
    learningResourcesListLoading: false,
    learningResourcesListError: null,
};

const handlers = {
    [actions.LEARNING_RESOURCES_LOADING]: state => ({
        ...initialState,
        ...state,
        learningResourcesListLoading: true,
    }),
    [actions.LEARNING_RESOURCES_LOADED]: (state, action) => ({
        ...initialState,
        ...state,
        learningResourcesListLoading: false,
        learningResourcesList: action.payload,
    }),
    [actions.LEARNING_RESOURCES_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        learningResourcesListLoading: false,
        learningResourcesListError: action.payload,
    }),
    [actions.LEARNING_RESOURCES_CLEAR]: () => ({
        ...initialState,
    }),
};

export default function learningResourceReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
