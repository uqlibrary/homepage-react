import * as actions from 'data/actions/actionTypes';

export const initialState = {
    saveInspectionSaving: false,
    saveInspectionSuccess: null,
    saveInspectionError: null,
};

const handlers = {
    [actions.TESTTAG_SAVE_INSPECTION_SAVING]: state => ({
        ...initialState,
        ...state,
        saveInspectionSaving: true,
        saveInspectionSuccess: null,
        saveInspectionError: null,
    }),
    [actions.TESTTAG_SAVE_INSPECTION_SUCCESS]: (state, action) => ({
        ...initialState,
        ...state,
        saveInspectionSaving: false,
        saveInspectionSuccess: action.payload,
        saveInspectionError: null,
    }),
    [actions.TESTTAG_SAVE_INSPECTION_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        saveInspectionSaving: false,
        saveInspectionSuccess: null,
        saveInspectionError: action.payload,
    }),
    [actions.TESTTAG_SAVE_INSPECTION_CLEAR]: () => ({
        ...initialState,
    }),
};

export default function testTagSaveInspectionReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
