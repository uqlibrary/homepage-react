import * as actions from 'actions/actionTypes';

export const initialState = {
    alert: null,
    alertStatus: null,
    alertError: null,
};

const handlers = {
    [actions.ALERT_LOADING]: state => ({
        ...initialState,
        ...state,
        alertStatus: 'loading',
        alertError: false,
    }),
    [actions.ALERT_LOADED]: (state, action) => ({
        ...initialState,
        ...state,
        alertError: false,
        alert: action.payload,
        alertStatus: 'loaded',
    }),
    [actions.ALERT_SAVED]: (state, action) => ({
        ...initialState,
        ...state,
        alertError: false,
        alert: action.payload,
        alertStatus: 'saved',
    }),
    [actions.ALERT_DELETED]: (state, action) => ({
        ...initialState,
        ...state,
        alertError: false,
        alert: action.payload,
        alertStatus: 'deleted',
    }),
    [actions.ALERT_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        alertStatus: 'error',
        alertError: action.payload,
    }),
    [actions.ALERT_CLEAR]: () => ({
        ...initialState,
    }),
};

export default function alertReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    console.log(
        'alertReducer: ',
        action.type,
        ' - state = ',
        state,
        '; action = ',
        action,
        '; handler = ',
        handler(state, action),
    );
    return handler(state, action);
}
