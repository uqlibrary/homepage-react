import * as actions from 'data/actions/actionTypes';

export const initialState = {
    inspectionsDue: null,
    inspectionsDueLoading: false,
    inspectionsDueLoaded: false,
    inspectionsDueError: null,
};

const handlers = {
    [actions.TESTTAG_INSPECTIONS_DUE_LOADING]: state => ({
        ...initialState,
        ...state,
        inspectionsDueLoading: true,
        inspectionsDueLoaded: false,
        inspectionsDueError: false,
    }),
    [actions.TESTTAG_INSPECTIONS_DUE_LOADED]: (state, action) => ({
        ...initialState,
        ...state,
        inspectionsDueLoading: false,
        inspectionsDueLoaded: true,
        inspectionsDueError: false,
        inspectionsDue: action.payload,
    }),
    [actions.TESTTAG_INSPECTIONS_DUE_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        inspectionsDueLoading: false,
        inspectionsDueLoaded: false,
        inspectionsDueError: action.payload,
    }),
};

export default function testTagInspectionsDueReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
