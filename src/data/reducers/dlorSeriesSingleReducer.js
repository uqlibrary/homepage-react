import * as actions from 'data/actions/actionTypes';

export const initialState = {
    dlorSeries: null,
    dlorSeriesLoading: null,
    dlorSeriesError: null,
};

const handlers = {
    [actions.DLOR_SERIES_LOADING]: state => ({
        ...initialState,
        ...state,
        dlorSeriesLoading: true,
        dlorSeriesError: false,
    }),
    [actions.DLOR_SERIES_LOADED]: (state, action) => ({
        ...initialState,
        ...state,
        dlorSeriesLoading: false,
        dlorSeriesError: false,
        dlorSeries: action.payload,
    }),
    [actions.DLOR_SERIES_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        dlorSeriesLoading: false,
        dlorSeriesError: action.payload,
    }),
};

export default function dlorSeriesSingleReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    const handler1 = handler(state, action);
    console.log('reducer dlorSeriesSingleReducer:', action.type, handler1);
    return handler1;
}
