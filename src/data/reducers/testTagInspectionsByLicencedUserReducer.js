import * as actions from 'data/actions/actionTypes';

export const initialState = {
    userInspections: null,
    licencedUsers: null,
    userInspectionsLoading: false,
    userInspectionsLoaded: false,
    userInspectionsError: null,
    licencedUsersLoading: false,
    licencedUsersLoaded: false,
    licencedUsersError: false,
};

const handlers = {
    [actions.TESTTAG_INSPECTIONS_BY_LICENCED_USER_LOADING]: state => ({
        ...initialState,
        ...state,
        userInspectionsLoading: true,
        userInspectionsLoaded: false,
        userInspectionsError: null,
    }),
    [actions.TESTTAG_INSPECTIONS_BY_LICENCED_USER_LOADED]: (state, action) => ({
        ...initialState,
        ...state,
        userInspectionsLoading: false,
        userInspectionsLoaded: true,
        userInspectionsError: null,
        UserInspections: action.payload,
    }),
    [actions.TESTTAG_INSPECTIONS_BY_LICENCED_USER_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        inspectionsDueLoading: false,
        inspectionsDueLoaded: false,
        inspectionsDueError: action.payload,
    }),
    [actions.TESTTAG_LICENCED_INSPECTORS_LOADING]: state => ({
        ...initialState,
        ...state,
        licencedUsersLoading: true,
        licencedUsersLoaded: false,
        licencedUsersError: false,
    }),
    [actions.TESTTAG_LICENCED_INSPECTORS_LOADED]: (state, action) => ({
        ...initialState,
        ...state,
        licencedUsersLoading: false,
        licencedUsersLoaded: true,
        licencedUsersError: false,
        licencedUsers: action.payload,
    }),
    [actions.TESTTAG_LICENCED_INSPECTORS_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        licencedUsersLoading: false,
        licencedUsersLoaded: false,
        licencedUsersError: action.payload,
    }),
};

export default function testTagInspectionsByLicencedUserReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
