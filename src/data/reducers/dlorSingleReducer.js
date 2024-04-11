import * as actions from 'data/actions/actionTypes';

export const initialState = {
    dlorItem: null,
    dlorItemLoading: null,
    dlorItemError: null,
    dlorItemCreating: null,
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
    [actions.DLOR_CREATING]: state => ({
        ...initialState,
        ...state,
        dlorItemCreating: true,
        dlorItemError: false,
    }),
    [actions.DLOR_CREATED]: (state, action) => ({
        ...initialState,
        ...state,
        dlorItemCreating: false,
        dlorItemError: false,
        dlorItem: action.payload,
    }),
    [actions.DLOR_CREATE_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        dlorItemCreating: false,
        dlorItemError: action.payload,
    }),
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
        dlorItem: action.payload,
    }),
    [actions.DLOR_DELETE_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        dlorItemDeleting: false,
        dlorItemDeleteError: action.payload,
    }),
};

export default function dlorSingleReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    const handler1 = handler(state, action);
    console.log('reducer dlorSingleReducer:', action.type, handler1);
    return handler1;
}
