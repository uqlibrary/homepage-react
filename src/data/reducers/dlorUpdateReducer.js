import * as actions from 'data/actions/actionTypes';

export const initialState = {
    dlorItemUpdating: null,
    dlorUpdatedItem: null,
    dlorUpdatedItemError: null,
};

const handlers = {
    [actions.DLOR_UPDATING]: state => ({
        ...initialState,
        ...state,
        dlorItemUpdating: true,
        dlorUpdatedItemError: false,
    }),
    [actions.DLOR_UPDATED]: (state, action) => ({
        ...initialState,
        ...state,
        dlorItemUpdating: false,
        dlorUpdatedItemError: false,
        dlorUpdatedItem: action.payload,
    }),
    [actions.DLOR_UPDATE_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        dlorItemUpdating: false,
        dlorUpdatedItemError: action.payload,
    }),
};

export default function dlorUpdateReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
