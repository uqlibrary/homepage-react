import * as actions from 'actions/actionTypes';

export const initialState = {
    guideList: null,
    guideListLoading: false,
    guideListError: null,
};

const handlers = {
    [actions.GUIDES_LOADING]: state => ({
        ...initialState,
        ...state,
        guideListLoading: true,
    }),
    [actions.GUIDES_LOADED]: (state, action) => ({
        ...initialState,
        ...state,
        guideListLoading: false,
        guideList: action.payload,
    }),
    [actions.GUIDES_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        guideListLoading: false,
        guideListError: action.payload,
    }),
    [actions.GUIDES_CLEAR]: () => ({
        ...initialState,
    }),
};

export default function guidesReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
