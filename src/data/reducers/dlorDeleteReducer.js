import * as actions from 'data/actions/actionTypes';

export const initialState = {
    dlorItemDeleting: null,
    dlorItemDeleted: null,
    dlorItemDeleteError: null,
};

const handlers = {
    [actions.DLOR_DELETING]: state => ({
        ...initialState,
        ...state,
        dlorItemDeleting: true,
        dlorItemDeleteError: false,
    }),
    [actions.DLOR_DELETED]: (state, action) => ({
        ...initialState,
        ...state,
        dlorItemDeleting: false,
        dlorItemDeleteError: false,
        dlorItemDeleted: action.payload,
    }),
    [actions.DLOR_DELETE_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        dlorItemDeleting: false,
        dlorItemDeleteError: action.payload,
    }),
};

export default function dlorDeleteReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    const handler1 = handler(state, action);
    console.log('reducer dlorDeleteReducer:', action.type, handler1);
    return handler1;
}
