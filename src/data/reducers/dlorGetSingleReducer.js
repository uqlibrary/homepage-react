import * as actions from 'data/actions/actionTypes';

export const initialState = {
    dlorItem: null,
    dlorItemLoading: null,
    dlorItemError: null,
};

const handlers = {
    [actions.DLOR_DETAIL_LOADING]: state => ({
        ...initialState,
        ...state,
        dlorItemLoading: true,
        dlorItemError: false,
    }),
    [actions.DLOR_DETAIL_LOADED]: (state, action) => ({
        ...initialState,
        ...state,
        dlorItemLoading: false,
        dlorItemError: false,
        dlorItem: action.payload,
    }),
    [actions.DLOR_DETAIL_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        dlorItemLoading: false,
        dlorItemError: action.payload,
    }),
    [actions.DLOR_DETAIL_CLEAR]: () => ({
        ...initialState,
    }),
};

export default function dlorGetSingleReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
