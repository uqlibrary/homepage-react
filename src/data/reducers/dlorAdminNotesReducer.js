import * as actions from 'data/actions/actionTypes';

export const initialState = {
    dlorAdminNotesLoading: null,
    dlorAdminNotesLoaded: null,
    dlorAdminNotesLoadError: null,
    dlorAdminNotes: [],
};

const handlers = {
    [actions.DLOR_ADMIN_NOTES_LOADING]: () => ({
        ...initialState,
        dlorAdminNotesLoading: true,
    }),
    [actions.DLOR_ADMIN_NOTES_LOADED]: (state, action) => ({
        ...initialState,
        ...state,
        dlorAdminNotesLoadError: null,
        dlorAdminNotesLoading: false,
        dlorAdminNotesLoaded: true,
        dlorAdminNotes: action.payload,
    }),
    [actions.DLOR_ADMIN_NOTES_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        dlorAdminNotesLoading: false,
        dlorAdminNotesLoaded: true,
        dlorAdminNotesLoadError: action.payload,
    }),
    [actions.DLOR_ADMIN_NOTES_CLEAR]: () => ({
        ...initialState,
    }),
};

export default function dlorAdminNotesReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
