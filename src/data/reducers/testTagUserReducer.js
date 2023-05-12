import * as actions from 'data/actions/actionTypes';

export const initialState = {
    user: null,
};

const handlers = {
    [actions.TESTTAG_USER_LOADED]: (state, action) => ({
        ...initialState,
        ...state,
        user: action.payload,
    }),
};

export default function testTagUserReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
