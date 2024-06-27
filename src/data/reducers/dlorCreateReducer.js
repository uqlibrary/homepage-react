import * as actions from 'data/actions/actionTypes';

export const initialState = {
    dlorItemCreating: null,
    dlorCreatedItem: null,
    dlorCreatedItemError: null,
};

const handlers = {
    [actions.DLOR_CREATING]: state => ({
        ...initialState,
        ...state,
        dlorItemCreating: true,
        dlorCreatedItemError: false,
    }),
    [actions.DLOR_CREATED]: (state, action) => ({
        ...initialState,
        ...state,
        dlorItemCreating: false,
        dlorCreatedItemError: false,
        dlorCreatedItem: action.payload,
    }),
    [actions.DLOR_CREATE_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        dlorItemCreating: false,
        dlorCreatedItemError: action.payload,
    }),
};

export default function dlorCreateReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
