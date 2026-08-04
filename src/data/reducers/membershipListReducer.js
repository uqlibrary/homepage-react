import * as actions from 'data/actions/actionTypes';

export const initialState = {
    memberships: null,
    membershipsLoading: null,
    membershipsError: null,
};

const handlers = {
    [actions.MEMBERSHIPS_LOADING]: state => ({
        ...initialState,
        ...state,
        membershipsLoading: true,
        membershipsError: false,
    }),
    [actions.MEMBERSHIPS_LOADED]: (state, action) => ({
        ...initialState,
        ...state,
        membershipsLoading: false,
        membershipsError: false,
        memberships: action.payload,
    }),
    [actions.MEMBERSHIPS_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        membershipsLoading: false,
        membershipsError: action.payload,
    }),
    [actions.MEMBERSHIPS_CLEAR]: () => ({
        ...initialState,
    }),
};

export default function membershipListReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
