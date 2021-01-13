import * as actions from 'actions/actionTypes';

export const initialState = {
    chatStatus: null,
};

const handlers = {
    [actions.CHAT_STATUS_LOADING]: state => ({
        ...state,
        chatStatus: null,
    }),

    [actions.CHAT_STATUS_LOADED]: (state, action) => ({
        ...state,
        chatStatus: action.payload,
    }),

    [actions.CHAT_STATUS_FAILED]: state => ({
        ...state,
        chatStatus: { online: 'failed' },
    }),
};

export default function chatReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
