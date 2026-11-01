import * as actions from 'data/actions/actionTypes';

export const initialState = {
    membership: null,
    membershipLoading: null,
    membershipError: null,
    membershipSaving: null,
    membershipSaved: null,
    membershipSaveError: null,
};

const handlers = {
    [actions.MEMBERSHIP_LOADING]: state => ({
        ...initialState,
        ...state,
        membershipLoading: true,
        membershipError: false,
    }),
    [actions.MEMBERSHIP_LOADED]: (state, action) => ({
        ...initialState,
        ...state,
        membershipLoading: false,
        membershipError: false,
        membership: action.payload,
    }),
    [actions.MEMBERSHIP_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        membershipLoading: false,
        membershipError: action.payload,
    }),
    [actions.MEMBERSHIP_SAVING]: state => ({
        ...initialState,
        ...state,
        membershipSaving: true,
        membershipSaved: null,
        membershipSaveError: false,
    }),
    [actions.MEMBERSHIP_SAVED]: (state, action) => ({
        ...initialState,
        ...state,
        membershipSaving: false,
        membershipSaveError: false,
        membershipSaved: action.payload,
        membership: action.payload,
    }),
    [actions.MEMBERSHIP_SAVE_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        membershipSaving: false,
        membershipSaveError: action.payload,
    }),
    [actions.MEMBERSHIP_DELETED]: state => ({
        ...initialState,
        ...state,
        membershipSaving: false,
        membershipSaveError: false,
        membership: null,
    }),
    [actions.MEMBERSHIP_CLEAR]: () => ({
        ...initialState,
    }),
};

export default function membershipReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
