import * as actions from 'data/actions/actionTypes';
import { getUserPermissions } from 'modules/Pages/Admin/TestTag/helpers/auth';

export const initialState = {
    user: null,
};

const handlers = {
    [actions.TESTTAG_USER_LOADED]: (state, action) => ({
        ...initialState,
        ...state,
        user: action.payload,
        privilege: getUserPermissions(action?.payload?.privileges ?? {}),
    }),
};

export default function testTagUserReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
