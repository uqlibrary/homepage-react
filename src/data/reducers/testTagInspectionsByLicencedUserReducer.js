import * as actions from 'data/actions/actionTypes';

export const initialState = {
    userInspections: [],
    totalInspections: 0,
    licencedUsers: [],
    userInspectionsLoading: false,
    userInspectionsLoaded: false,
    userInspectionsError: null,
    licencedUsersLoading: false,
    licencedUsersLoaded: false,
    licencedUsersError: null,
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
        userInspections: action.payload.user_inspections,
        totalInspections: action.payload.total_inspections,
    }),
    [actions.TESTTAG_INSPECTIONS_BY_LICENCED_USER_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        userInspectionsLoading: false,
        userInspectionsLoaded: false,
        userInspectionsError: action.payload,
    }),
    [actions.TESTTAG_LICENCED_INSPECTORS_LOADING]: state => ({
        ...initialState,
        ...state,
        licencedUsersLoading: true,
        licencedUsersLoaded: false,
        licencedUsersError: null,
    }),
    [actions.TESTTAG_LICENCED_INSPECTORS_LOADED]: (state, action) => ({
        ...initialState,
        ...state,
        licencedUsersLoading: false,
        licencedUsersLoaded: true,
        licencedUsersError: null,
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
