import * as actions from 'data/actions/actionTypes';

export const initialState = {
    dlorStatistics: null,
    dlorStatisticsLoading: null,
    dlorStatisticsError: null,
};

const handlers = {
    [actions.DLOR_STATISTICS_LOADING]: state => ({
        ...initialState,
        ...state,
        dlorSeriesListLoading: true,
        dlorSeriesListError: false,
    }),
    [actions.DLOR_STATISTICS_LOADED]: (state, action) => ({
        ...initialState,
        ...state,
        dlorStatisticsLoading: false,
        dlorStatisticsError: false,
        dlorStatistics: action.payload,
    }),
    [actions.DLOR_STATISTICS_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        dlorStatisticsLoading: false,
        dlorStatisticsError: action.payload,
    }),
};

export default function dlorStatisticsReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
