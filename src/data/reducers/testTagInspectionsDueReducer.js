import * as actions from 'data/actions/actionTypes';

export const initialState = {
    inspectionsDue: [],
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
        inspectionsDueError: null,
    }),
    [actions.TESTTAG_INSPECTIONS_DUE_LOADED]: (state, action) => ({
        ...initialState,
        ...state,
        inspectionsDueLoading: false,
        inspectionsDueLoaded: true,
        inspectionsDueError: null,
        inspectionsDue: action.payload,
    }),
    [actions.TESTTAG_INSPECTIONS_DUE_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        inspectionsDueLoading: false,
        inspectionsDueLoaded: false,
        inspectionsDueError: action.payload,
    }),
    [actions.TESTTAG_INSPECTIONS_DUE_CLEAR_ERROR]: state => ({
        ...initialState,
        ...state,
        inspectionsDueError: null,
    }),
    [actions.TESTTAG_INSPECTIONS_DUE_CLEAR]: () => ({
        ...initialState,
    }),
};

export default function testTagInspectionsDueReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
