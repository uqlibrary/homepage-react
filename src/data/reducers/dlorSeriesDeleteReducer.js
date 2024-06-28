import * as actions from 'data/actions/actionTypes';

export const initialState = {
    dlorSeriesDeleting: null,
    dlorSeriesDeleted: null,
    dlorSeriesDeleteError: null,
};

const handlers = {
    [actions.DLOR_SERIES_DELETING]: state => ({
        ...initialState,
        ...state,
        dlorSeriesDeleting: true,
        dlorSeriesDeleteError: false,
    }),
    [actions.DLOR_SERIES_DELETED]: (state, action) => ({
        ...initialState,
        ...state,
        dlorSeriesDeleting: false,
        dlorSeriesDeleteError: false,
        dlorSeriesDeleted: action.payload,
    }),
    [actions.DLOR_SERIES_DELETE_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        dlorSeriesDeleting: false,
        dlorSeriesDeleteError: action.payload,
    }),
};

export default function dlorSeriesDeleteReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
