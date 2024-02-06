import * as actions from 'data/actions/actionTypes';

export const initialState = {
    accountTalisList: null,
    accountTalisListLoading: false,
    accountTalisListError: null,
};

const handlers = {
    [actions.ACCOUNT_TALIS_LOADING]: state => ({
        ...initialState,
        ...state,
        accountTalisListLoading: true,
        accountTalisListError: false,
    }),
    [actions.ACCOUNT_TALIS_LOADED]: (state, action) => ({
        ...initialState,
        ...state,
        accountTalisListLoading: false,
        accountTalisListError: false,
        accountTalisList: action.payload,
    }),
    [actions.ACCOUNT_TALIS_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        accountTalisListLoading: false,
        accountTalisListError: action.payload,
    }),
    [actions.ACCOUNT_TALIS_CLEAR]: () => ({
        ...initialState,
    }),
};

export default function accountTalisListReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
