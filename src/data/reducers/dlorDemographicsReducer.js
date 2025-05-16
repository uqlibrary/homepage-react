import * as actions from 'data/actions/actionTypes';

export const initialState = {
    dlorDemographics: null,
    dlorDemographicsLoading: null,
    dlorDemographicsError: null,
};

const handlers = {
    [actions.DLOR_DEMOGRAPHICS_LOADING]: state => ({
        ...initialState,
        ...state,
        dlorDemographicsLoading: true,
        dlorDemographicsError: false,
    }),
    [actions.DLOR_DEMOGRAPHICS_LOADED]: (state, action) => ({
        ...initialState,
        ...state,
        dlorDemographicsLoading: false,
        dlorDemographicsError: false,
        dlorDemographics: action.payload,
    }),
    [actions.DLOR_DEMOGRAPHICS_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        dlorDemographicsLoading: false,
        dlorDemographicsError: action.payload,
    }),
};

export default function dlorDemographicsReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
