import * as actions from 'data/actions/actionTypes';

export const initialState = {
    membershipRenewing: null,
    membershipRenewingLoading: null,
    membershipRenewingError: null,
};

const handlers = {
    [actions.MEMBERSHIP_RENEWING_LOADING]: state => ({
        ...initialState,
        ...state,
        membershipRenewingLoading: true,
        membershipRenewingError: false,
    }),
    [actions.MEMBERSHIP_RENEWING_LOADED]: (state, action) => ({
        ...initialState,
        ...state,
        membershipRenewingLoading: false,
        membershipRenewingError: false,
        membershipRenewing: action.payload,
    }),
    [actions.MEMBERSHIP_RENEWING_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        membershipRenewingLoading: false,
        membershipRenewingError: action.payload,
    }),
};

export default function membershipRenewingReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
