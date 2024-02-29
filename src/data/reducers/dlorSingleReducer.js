import * as actions from 'data/actions/actionTypes';

export const initialState = {
    dlorItem: null,
    dlorItemLoading: null,
    dlorItemError: null,
};

const handlers = {
    [actions.DLOR_VIEWPAGE_LOADING]: state => ({
        ...initialState,
        ...state,
        dlorItemLoading: true,
        dlorItemError: false,
    }),
    [actions.DLOR_VIEWPAGE_LOADED]: (state, action) => ({
        ...initialState,
        ...state,
        dlorItemLoading: false,
        dlorItemError: false,
        dlorItem: action.payload,
    }),
    [actions.DLOR_VIEWPAGE_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        dlorItemLoading: false,
        dlorItemError: action.payload,
    }),
    // [actions.DLOR_VIEWPAGE_CLEAR]: () => ({
    //     ...initialState,
    // }),
};

export default function dlorSingleReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
