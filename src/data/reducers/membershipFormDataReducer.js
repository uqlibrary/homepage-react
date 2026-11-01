import * as actions from 'data/actions/actionTypes';

export const initialState = {
    membershipFormData: null,
    membershipFormDataLoading: null,
    membershipFormDataError: null,
};

const handlers = {
    [actions.MEMBERSHIP_FORM_DATA_LOADING]: state => ({
        ...initialState,
        ...state,
        membershipFormDataLoading: true,
        membershipFormDataError: false,
    }),
    [actions.MEMBERSHIP_FORM_DATA_LOADED]: (state, action) => ({
        ...initialState,
        ...state,
        membershipFormDataLoading: false,
        membershipFormDataError: false,
        membershipFormData: action.payload,
    }),
    [actions.MEMBERSHIP_FORM_DATA_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        membershipFormDataLoading: false,
        membershipFormDataError: action.payload,
    }),
};

export default function membershipFormDataReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
