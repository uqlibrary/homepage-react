import * as actions from 'data/actions/actionTypes';

export const initialState = {
    dlorSeriesList: null,
    dlorSeriesListLoading: null,
    dlorSeriesListError: null,
};

const handlers = {
    [actions.DLOR_SERIESLIST_LOADING]: state => ({
        ...initialState,
        ...state,
        dlorSeriesListLoading: true,
        dlorSeriesListError: false,
    }),
    [actions.DLOR_SERIESLIST_LOADED]: (state, action) => ({
        ...initialState,
        ...state,
        dlorSeriesListLoading: false,
        dlorSeriesListError: false,
        dlorSeriesList: action.payload,
    }),
    [actions.DLOR_SERIESLIST_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        dlorSeriesListLoading: false,
        dlorSeriesListError: action.payload,
    }),
};

export default function dlorSeriesListReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    const handler1 = handler(state, action);
    console.log('reducer dlorSeriesListReducer:', action.type, handler1);
    return handler1;
}
