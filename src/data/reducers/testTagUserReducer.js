import * as actions from 'data/actions/actionTypes';
import { getUserPermissions } from 'modules/Pages/Admin/TestTag/helpers/auth';

export const initialState = {
    user: null,
    userLoading: false,
    userLoaded: false,
    userError: null,
};

const handlers = {
    [actions.TESTTAG_USER_LOADING]: state => ({
        ...initialState,
        ...state,
        user: null,
        userLoading: true,
        userLoaded: false,
        userError: false,
    }),
    [actions.TESTTAG_USER_LOADED]: (state, action) => ({
        ...initialState,
        ...state,
        userLoading: false,
        userLoaded: true,
        userError: false,
        user: action?.payload ?? {},
        privilege: getUserPermissions(action?.payload?.privileges ?? {}),
    }),
    [actions.TESTTAG_USER_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        user: null,
        userLoading: false,
        userLoaded: false,
        userError: action.payload,
    }),
};

export default function testTagUserReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
