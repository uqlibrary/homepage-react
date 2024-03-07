import * as actions from 'data/actions/actionTypes';

export const initialState = {
    dlorList: null,
    dlorListLoading: null,
    dlorListError: null,
};

const handlers = {
    [actions.DLOR_LIST_LOADING]: state => ({
        ...initialState,
        ...state,
        dlorListLoading: true,
        dlorListError: false,
    }),
    [actions.DLOR_LIST_LOADED]: (state, action) => ({
        ...initialState,
        ...state,
        dlorListLoading: false,
        dlorListError: false,
        dlorList: action.payload,
    }),
    [actions.DLOR_LIST_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        dlorListLoading: false,
        dlorListError: action.payload,
    }),
};

export default function dlorListReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    const handler1 = handler(state, action);
    console.log('dlorListReducer:', action.type, handler1);
    return handler1;
}
