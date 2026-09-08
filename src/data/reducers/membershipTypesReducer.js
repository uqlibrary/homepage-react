import * as actions from 'data/actions/actionTypes';

export const initialState = {
    membershipTypes: null,
    membershipTypesLoading: null,
    membershipTypesError: null,
};

const handlers = {
    [actions.MEMBERSHIP_TYPES_LOADING]: state => ({
        ...initialState,
        ...state,
        membershipTypesLoading: true,
        membershipTypesError: false,
    }),
    [actions.MEMBERSHIP_TYPES_LOADED]: (state, action) => ({
        ...initialState,
        ...state,
        membershipTypesLoading: false,
        membershipTypesError: false,
        membershipTypes: action.payload,
    }),
    [actions.MEMBERSHIP_TYPES_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        membershipTypesLoading: false,
        membershipTypesError: action.payload,
    }),
};

export default function membershipTypesReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
