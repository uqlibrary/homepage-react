import * as actions from 'data/actions/actionTypes';

export const initialState = {
    dlorFilterList: null,
    dlorFilterListLoading: null,
    dlorFilterListError: null,
};

const handlers = {
    [actions.DLOR_FILTER_LIST_LOADING]: state => ({
        ...initialState,
        ...state,
        dlorFilterListLoading: true,
        dlorFilterListError: false,
    }),
    [actions.DLOR_FILTER_LIST_LOADED]: (state, action) => ({
        ...initialState,
        ...state,
        dlorFilterListLoading: false,
        dlorFilterListError: false,
        dlorFilterList: action.payload,
    }),
    [actions.DLOR_FILTER_LIST_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        dlorFilterListLoading: false,
        dlorFilterListError: action.payload,
    }),
};

export default function dlorFilterListReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
