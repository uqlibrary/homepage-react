import * as actions from 'data/actions/actionTypes';

export const initialState = {
    inspectionDetailsUpdating: false,
    inspectionDetailsUpdated: false,
    inspectionDetailsError: null,
};

const handlers = {
    [actions.TESTTAG_INSPECTION_DETAILS_UPDATING]: state => ({
        ...initialState,
        ...state,
        inspectionDetailsUpdating: true,
        inspectionDetailsUpdated: false,
        inspectionDetailsError: null,
    }),
    [actions.TESTTAG_INSPECTION_DETAILS_UPDATED]: state => ({
        ...initialState,
        ...state,
        inspectionDetailsUpdating: false,
        inspectionDetailsUpdated: true,
        inspectionDetailsError: false,
    }),
    [actions.TESTTAG_INSPECTION_DETAILS_UPDATE_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        inspectionDetailsUpdating: false,
        inspectionDetailsUpdated: false,
        inspectionDetailsError: action.payload,
    }),
    [actions.TESTTAG_INSPECTION_DETAILS_CLEAR]: () => ({
        ...initialState,
    }),
};

export default function testTagInspectionDetailsUpdateReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
