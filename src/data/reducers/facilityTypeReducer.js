import * as actions from 'data/actions/actionTypes';

export const initialState = {
    facilityTypeList: null,
    facilityTypeListLoading: null,
    facilityTypeListError: null,
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
};

export default function facilityTypeReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
