import * as actions from 'data/actions/actionTypes';

export const initialState = {
    dlorList: null,
    dlorListLoading: null,
    dlorListError: null,
};

const handlers = {
    [actions.DLOR_HOMEPAGE_LOADING]: state => ({
        ...initialState,
        ...state,
        dlorListLoading: true,
        dlorListError: false,
    }),
    [actions.DLOR_HOMEPAGE_LOADED]: (state, action) => ({
        ...initialState,
        ...state,
        dlorListLoading: false,
        dlorListError: false,
        dlorList: action.payload,
    }),
    [actions.DLOR_HOMEPAGE_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        dlorListLoading: false,
        dlorListError: action.payload,
    }),
    // [actions.DLOR_HOMEPAGE_CLEAR]: () => ({
    //     ...initialState,
    // }),
};

export default function dlorReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    console.log('dlorReducer', action.type, state, action);
    return handler(state, action);
}
