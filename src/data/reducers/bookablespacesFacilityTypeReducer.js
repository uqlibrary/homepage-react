import * as actions from 'data/actions/actionTypes';

export const initialState = {
    facilityTypeList: null,
    facilityTypeListLoading: null,
    facilityTypeListError: null,
    facilityTypeAdding: null,
    facilityTypeAddError: null,
    facilityTypeAdded: null,
    facilityTypeGroupAdding: null,
    facilityTypeGroupAddError: null,
    facilityTypeGroupAdded: null,
};

const handlers = {
    [actions.SPACES_FACILITY_TYPE_LOADING]: state => ({
        ...initialState,
        ...state,
        facilityTypeListLoading: true,
        facilityTypeListError: false,
    }),
    [actions.SPACES_FACILITY_TYPE_LOADED]: (state, action) => ({
        ...initialState,
        ...state,
        facilityTypeListLoading: false,
        facilityTypeListError: false,
        facilityTypeList: action.payload,
    }),
    [actions.SPACES_FACILITY_TYPE_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        facilityTypeListLoading: false,
        facilityTypeListError: action.payload,
    }),
    // [actions.SPACES_FACILITY_TYPE_CLEAR]: () => ({
    //     ...initialState,
    // }),
    [actions.SPACES_FACILITY_TYPE_CREATING]: state => ({
        ...initialState,
        ...state,
        facilityTypeAdding: true,
        facilityTypeAddError: false,
    }),
    [actions.SPACES_FACILITY_TYPE_CREATED]: (state, action) => ({
        ...initialState,
        ...state,
        facilityTypeAdding: false,
        facilityTypeAddError: false,
        facilityTypeAdded: action.payload,
    }),
    [actions.SPACES_FACILITY_TYPE_CREATE_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        facilityTypeAdding: false,
        facilityTypeAddError: action.payload,
    }),
    [actions.SPACES_FACILITY_TYPE_GROUP_UPDATING]: state => ({
        ...initialState,
        ...state,
        facilityTypeUpdating: true,
        facilityTypeUpdateError: false,
    }),
    [actions.SPACES_FACILITY_TYPE_GROUP_UPDATED]: (state, action) => ({
        ...initialState,
        ...state,
        facilityTypeUpdating: false,
        facilityTypeUpdateError: false,
        facilityTypeUpdated: action.payload,
    }),
    [actions.SPACES_FACILITY_TYPE_GROUP_UPDATE_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        facilityTypeUpdating: false,
        facilityTypeUpdateError: action.payload,
    }),
    [actions.SPACES_FACILITY_TYPE_UPDATING]: state => ({
        ...initialState,
        ...state,
        facilityTypeUpdating: true,
        facilityTypeUpdateError: false,
    }),
    [actions.SPACES_FACILITY_TYPE_UPDATED]: (state, action) => ({
        ...initialState,
        ...state,
        facilityTypeUpdating: false,
        facilityTypeUpdateError: false,
        facilityTypeUpdated: action.payload,
    }),
    [actions.SPACES_FACILITY_TYPE_UPDATE_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        facilityTypeUpdating: false,
        facilityTypeUpdateError: action.payload,
    }),
    [actions.SPACES_FACILITY_TYPE_GROUP_CREATING]: state => ({
        ...initialState,
        ...state,
        facilityTypeGroupAdding: true,
        facilityTypeGroupAddError: false,
    }),
    [actions.SPACES_FACILITY_TYPE_GROUP_CREATED]: (state, action) => ({
        ...initialState,
        ...state,
        facilityTypeGroupAdding: false,
        facilityTypeGroupAddError: false,
        facilityTypeGroupAdded: action.payload,
    }),
    [actions.SPACES_FACILITY_TYPE_GROUP_CREATE_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        facilityTypeGroupAdding: false,
        facilityTypeGroupAddError: action.payload,
    }),
};

export default function bookablespacesFacilityTypeReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    console.log('bookablespacesFacilityTypeReducer', action.type, state, action);
    return handler(state, action);
}
